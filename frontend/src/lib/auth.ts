/**
 * Tiny client-side auth helper.
 *
 * Recognizes TWO kinds of session:
 *  1. Real Supabase session - `supabase_token` in localStorage (set by LoginPage).
 *  2. Guest session - `guest_session === 'true'` in localStorage (set by the
 *     guest-login button). Useful when Supabase is offline / for quick demos.
 *
 * Both are persisted client-side. A guest login is ALSO best-effort logged to
 * the `guest_sessions` table (username + timestamp) for analytics.
 *
 * Module access model (see canOpenModule):
 *  - A real Supabase login => unlimited modules.
 *  - A guest or anonymous visitor => the first FREE_MODULE_LIMIT distinct
 *    modules are free; opening a further new module requires a real login.
 */

import { supabase } from './supabase';

const SUPABASE_TOKEN_KEY = 'supabase_token';
const GUEST_FLAG_KEY = 'guest_session';
const GUEST_NAME_KEY = 'guest_name';
const GUEST_ID_KEY = 'guest_id';
const MODULE_VISITS_KEY = 'module_visits';

/** How many distinct modules a non-logged-in (guest/anon) visitor may open. */
export const FREE_MODULE_LIMIT = 5;

/**
 * The five foundation modules (the portal's top L1-L5 row: Signals & Waves,
 * Number Systems, Logic Gates, K-Maps, Verilog Core) are open without a real
 * login. Everything else (Basic Electronics, DSD paths, Advanced Verilog)
 * requires signing in.
 */
export const FREE_MODULE_IDS = ['module/1', 'module/2', 'module/3', 'module/4', 'module/5'] as const;

export type SessionKind = 'supabase' | 'guest' | 'none';

export interface SessionInfo {
    kind: SessionKind;
    token: string | null;     // bearer token for backend calls; guests get a "guest_<id>" pseudo-token
    displayName: string | null;
    isGuest: boolean;
}

function safeStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function getSession(): SessionInfo {
    const ls = safeStorage();
    if (!ls) return { kind: 'none', token: null, displayName: null, isGuest: false };

    const token = ls.getItem(SUPABASE_TOKEN_KEY);
    if (token) {
        return { kind: 'supabase', token, displayName: null, isGuest: false };
    }
    if (ls.getItem(GUEST_FLAG_KEY) === 'true') {
        const id = ls.getItem(GUEST_ID_KEY) ?? 'unknown';
        return {
            kind: 'guest',
            token: `guest_${id}`,
            displayName: ls.getItem(GUEST_NAME_KEY) || 'Guest',
            isGuest: true,
        };
    }
    return { kind: 'none', token: null, displayName: null, isGuest: false };
}

export function isAuthenticated(): boolean {
    return getSession().kind !== 'none';
}

export function startGuestSession(name: string = 'Guest'): SessionInfo {
    const ls = safeStorage();
    if (!ls) throw new Error('localStorage unavailable');
    // Clear any stale real-auth token so the guest mode is unambiguous.
    ls.removeItem(SUPABASE_TOKEN_KEY);
    const hasUuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto;
    const id = hasUuid
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 12);
    ls.setItem(GUEST_FLAG_KEY, 'true');
    ls.setItem(GUEST_ID_KEY, id);
    ls.setItem(GUEST_NAME_KEY, name);

    // Best-effort persist {username, time} to the DB. Fire-and-forget so guest
    // mode keeps working instantly even if Supabase is slow/unreachable.
    // `id` is only sent when it is a real UUID (the column is uuid-typed); the
    // fallback random string is dropped so the DB default generates the id.
    void supabase
        .from('guest_sessions')
        .insert(
            hasUuid
                ? { id, guest_username: name, created_at: new Date().toISOString() }
                : { guest_username: name, created_at: new Date().toISOString() }
        )
        .then(({ error }) => {
            if (error) console.warn('[guest] session persist failed:', error.message);
        });

    return getSession();
}

/* ------------------------------------------------------------------ *
 *  Module access gate - first N distinct modules free, then login.
 * ------------------------------------------------------------------ */

/**
 * Normalize any module route to a single module identity so chapter/sub-routes
 * don't each consume a free slot.
 *   /dsd/1/cover    -> 'dsd/1'
 *   /module/6/3     -> 'module/6'
 *   /module/1/1     -> 'module/1'
 *   /sandbox/verilog-> null   (not a counted module; always free)
 */
export function moduleIdFromPath(pathname: string): string | null {
    const m = pathname.match(/^\/(module|dsd|basic-electronics)\/(\d+)/);
    return m ? `${m[1]}/${m[2]}` : null;
}

/** Distinct module IDs this browser has already opened (guest/anon only). */
export function getVisitedModules(): string[] {
    const ls = safeStorage();
    if (!ls) return [];
    try {
        const raw = JSON.parse(ls.getItem(MODULE_VISITS_KEY) || '[]');
        return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
    } catch {
        return [];
    }
}

/**
 * May this visitor open `moduleId` right now?
 *  - Real Supabase session => always (unlimited).
 *  - Guest/anon => only the five free foundation modules (FREE_MODULE_IDS);
 *    every other module (Basic Electronics, DSD, Advanced Verilog) is locked
 *    until they sign in.
 */
export function canOpenModule(moduleId: string): boolean {
    if (getSession().kind === 'supabase') return true;
    return (FREE_MODULE_IDS as readonly string[]).includes(moduleId);
}

/** Record an opened module (no-op for real logins / already-recorded modules). */
export function recordModuleVisit(moduleId: string): void {
    if (getSession().kind === 'supabase') return;
    const ls = safeStorage();
    if (!ls) return;
    const visited = getVisitedModules();
    if (!visited.includes(moduleId)) {
        visited.push(moduleId);
        ls.setItem(MODULE_VISITS_KEY, JSON.stringify(visited));
    }
}

/** How many free module slots remain for a guest/anon visitor (0 if logged in). */
export function remainingFreeModules(): number {
    if (getSession().kind === 'supabase') return Infinity;
    return Math.max(0, FREE_MODULE_LIMIT - getVisitedModules().length);
}

let bridgeStarted = false;

/**
 * The ONE bridge that keeps `supabase_token` in sync with the real Supabase
 * session (runs from main.tsx at module load, before first render). The
 * password flow writes the token itself, but OAuth, email-verification and
 * password-recovery all return via a full-page redirect where only supabase-js
 * sees the session - without this bridge the app would still treat the user as
 * anonymous. Mirrors the token on every event that carries a session
 * (SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, INITIAL_SESSION,
 * PASSWORD_RECOVERY), clears it on SIGNED_OUT, and drops the guest flag when a
 * real session is adopted. Idempotent - extra calls are no-ops.
 */
export function initAuthTokenBridge(): void {
    if (bridgeStarted) return;
    const ls = safeStorage();
    if (!ls) return;
    bridgeStarted = true;

    const adopt = (token: string | null | undefined) => {
        if (!token) return;
        ls.setItem(SUPABASE_TOKEN_KEY, token);
        // A real login supersedes any guest session.
        ls.removeItem(GUEST_FLAG_KEY);
    };

    void supabase.auth.getSession().then(({ data }) => adopt(data.session?.access_token));

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            ls.removeItem(SUPABASE_TOKEN_KEY);
            return;
        }
        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, INITIAL_SESSION, PASSWORD_RECOVERY
        adopt(session?.access_token);
    });
}

export function clearSession(): void {
    const ls = safeStorage();
    if (!ls) return;
    ls.removeItem(SUPABASE_TOKEN_KEY);
    ls.removeItem(GUEST_FLAG_KEY);
    ls.removeItem(GUEST_ID_KEY);
    ls.removeItem(GUEST_NAME_KEY);
}
