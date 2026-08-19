/**
 * Per-module SCREEN-TIME tracker.
 *
 * Measures the ACTIVE (tab-visible) seconds a learner spends inside each course
 * module and streams them to Supabase `public.module_engagement` via the
 * `record_engagement` RPC — see supabase/migrations/0004_module_engagement.sql.
 *
 * One "session" = one continuous visit to a single module in one tab. A fresh
 * session id (uuid) is minted every time a *different* module is entered, so
 * every engagement is its own row and nothing is overwritten. Time is sent as
 * the CUMULATIVE active-seconds for the session, and the RPC keeps the max, so
 * duplicate / out-of-order heartbeats can neither inflate nor rewind a total.
 *
 * Accounting rule: seconds accrue only while `document.visibilityState` is
 * 'visible'. Switching tabs / minimising / locking the phone pauses the clock;
 * focus moving to an in-page iframe (e.g. the CircuitVerse simulator) or a
 * playing video does NOT (the tab is still visible), so simulator and video
 * time still count.
 *
 * Recorded for EVERYONE:
 *   - signed-in users   -> owner_kind 'user',  keyed by their auth uid
 *   - guest sessions    -> owner_kind 'guest', keyed by guest_id
 *   - pure anonymous    -> owner_kind 'guest', keyed by a stable device id
 *
 * Fire-and-forget: any network failure only logs a console warning; tracking
 * never blocks navigation or throws into the app.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY, supabase } from './supabase';

const RPC_URL = `${SUPABASE_URL}/rest/v1/rpc/record_engagement`;
const FLUSH_MS = 15_000; // stream progress to the server at least this often
const DEVICE_ID_KEY = 'bfb_device_id';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type OwnerKind = 'user' | 'guest';
interface Identity { kind: OwnerKind; key: string; display: string }

interface Session {
  id: string;
  /** Grouping key: the module id for modules, else the route. */
  key: string;
  moduleId: string | null;
  route: string;
  pageKind: string;
  path: string;
  accumulatedMs: number;    // banked visible time from finished stretches
  activeStart: number | null; // ts the current visible stretch began, or null if paused
  lastSent: number;         // highest active-seconds value already pushed
}

let session: Session | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let listenersOn = false;

/**
 * Normalise a path into a reporting route + bucket. MUST stay in step with
 * public.classify_page() in 0008_page_engagement.sql — the server re-derives
 * these when a client omits them, and the two must agree or a route splits
 * across buckets.
 */
export function classifyPath(path: string): { route: string; kind: string; moduleId: string | null } {
  const clean = (path || '/').split('?')[0].split('#')[0] || '/';
  const mod = clean.match(/^\/(module|dsd|basic-electronics)\/(\d+)/);
  if (mod) {
    return { route: `/${mod[1]}/:n`, kind: 'module', moduleId: `${mod[1]}/${mod[2]}` };
  }
  const kind =
    /^\/(verilog-playground|workbench|kmap-lab|logic-studio|fsm|signal-playground|hw-leetcode|ai-lab)/.test(clean) ? 'tool'
    : /^\/(library|analogies|verilog-library|interview-prep|silicon-map)/.test(clean) ? 'library'
    : /^\/(career-roadmap|portfolio|skill-tree)/.test(clean) ? 'career'
    : /^\/(profile|settings|login)/.test(clean) ? 'account'
    : /^\/(privacy|terms|pledge|community)$/.test(clean) || clean === '/' ? 'marketing'
    : 'other';
  return { route: clean, kind, moduleId: null };
}

/* ------------------------------- helpers ------------------------------- */

function store(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Pull the `sub` (user id) claim out of a Supabase JWT, synchronously. */
function jwtSub(token: string): string | null {
  try {
    let b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = JSON.parse(atob(b64));
    return typeof json.sub === 'string' ? json.sub : null;
  } catch {
    return null;
  }
}

/**
 * Resolve WHO this engagement belongs to, using only synchronous localStorage
 * (so it also works from the beforeunload / pagehide path). Order of precedence:
 * real login -> guest session -> stable anonymous device id.
 */
function resolveIdentity(): Identity {
  const ls = store();
  if (ls) {
    const token = ls.getItem('supabase_token');
    if (token) {
      const sub = jwtSub(token);
      if (sub) return { kind: 'user', key: sub, display: '' };
    }
    if (ls.getItem('guest_session') === 'true') {
      const gid = ls.getItem('guest_id');
      if (gid && UUID_RE.test(gid)) {
        return { kind: 'guest', key: gid, display: ls.getItem('guest_name') || '' };
      }
    }
    let dev = ls.getItem(DEVICE_ID_KEY);
    if (!dev || !UUID_RE.test(dev)) {
      dev = uuid();
      try { ls.setItem(DEVICE_ID_KEY, dev); } catch { /* ignore */ }
    }
    return { kind: 'guest', key: dev, display: '' };
  }
  // No storage at all: fall back to an ephemeral device id for this page load.
  return { kind: 'guest', key: uuid(), display: '' };
}

/* --------------------------- time accounting --------------------------- */

function visible(): boolean {
  return typeof document === 'undefined' || document.visibilityState === 'visible';
}

function resume(): void {
  if (session && session.activeStart == null && visible()) session.activeStart = Date.now();
}

function pause(): void {
  if (session && session.activeStart != null) {
    session.accumulatedMs += Date.now() - session.activeStart;
    session.activeStart = null;
  }
}

function activeSeconds(): number {
  if (!session) return 0;
  const live = session.activeStart != null ? Date.now() - session.activeStart : 0;
  return Math.floor((session.accumulatedMs + live) / 1000);
}

/* ------------------------------- flushing ------------------------------ */

function buildBody(secs: number): Record<string, unknown> {
  const id = resolveIdentity();
  return {
    p_session_id: session!.id,
    p_owner_key: id.key,
    p_owner_kind: id.kind,
    p_display_name: id.display,
    p_module_id: session!.moduleId,
    p_last_path: session!.path,
    p_active_seconds: secs,
    p_route: session!.route,
    p_page_kind: session!.pageKind,
  };
}

/**
 * @param final when true, the page may be going away: send via a keepalive
 * fetch (survives unload) and always send even if unchanged. When false it is a
 * routine heartbeat sent through supabase-js (which attaches a fresh auth token
 * and skips the request if nothing new accrued).
 */
function flush(final: boolean): void {
  if (!session) return;
  const secs = activeSeconds();
  // Never create a row for a module that was never really viewed (< 1s) — this
  // also swallows React StrictMode's dev-only mount/unmount/mount churn.
  if (session.lastSent < 0 && secs <= 0) return;
  if (!final && secs <= session.lastSent) return; // nothing new since last beat
  session.lastSent = Math.max(session.lastSent, secs);
  const body = buildBody(secs);

  if (final) {
    try {
      const token = store()?.getItem('supabase_token') || SUPABASE_ANON_KEY;
      fetch(RPC_URL, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).catch(() => { /* ignore */ });
    } catch { /* ignore */ }
    return;
  }

  supabase.rpc('record_engagement', body).then(({ error }) => {
    if (error) console.warn('[engagement] flush skipped:', error.message);
  });
}

/* ------------------------------ listeners ------------------------------ */

function onVisibilityChange(): void {
  if (visible()) {
    resume();
  } else {
    // Tab is being backgrounded (and may be frozen): bank the time now.
    pause();
    flush(true);
  }
}

function onPageHide(): void {
  pause();
  flush(true);
}

function installListeners(): void {
  if (listenersOn || typeof document === 'undefined') return;
  listenersOn = true;
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('beforeunload', onPageHide);
}

/* -------------------------------- API ---------------------------------- */

/**
 * Begin (or continue) tracking time for a page. Call on EVERY route change —
 * this is the single tracker for the whole site, not just course modules.
 *
 * Sessions group by module for module routes (so moving between a module's
 * sub-pages keeps one continuous session, as it always did) and by route
 * elsewhere. Landing on a genuinely different page finalises the old session
 * and starts a new one, so each visit stays its own row.
 */
export function enterPage(path: string): void {
  const { route, kind, moduleId } = classifyPath(path);
  const key = moduleId ?? route;
  if (session && session.key === key) {
    session.path = path; // same page/module, different sub-path — keep counting
    return;
  }
  endEngagement(); // finalise whatever came before
  session = {
    id: uuid(), key, moduleId, route, pageKind: kind, path,
    accumulatedMs: 0, activeStart: null, lastSent: -1,
  };
  resume();
  installListeners();
  if (!flushTimer) flushTimer = setInterval(() => flush(false), FLUSH_MS);
}

/** Finalise the current session (leaving the app, or signing out). */
export function endEngagement(): void {
  if (!session) return;
  pause();
  flush(false); // in-app navigation: normal (fresh-token) flush of the last slice
  session = null;
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

/** @deprecated Kept for older call sites; enterPage derives the module itself. */
export function enterModule(_moduleId: string, path: string): void {
  enterPage(path);
}

/** @deprecated Use endEngagement. */
export const leaveModule = endEngagement;
