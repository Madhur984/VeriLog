/**
 * Lightweight per-browser record of which course modules the learner has opened,
 * the exact page they last reached in each (for "continue where you left off"),
 * and when. Recorded for EVERY visitor (real login or guest), unlike the
 * free-gate visit counter in lib/auth which only tracks guests.
 */

import { moduleIdFromPath } from './auth';
import { supabase } from './supabase';

const KEY = 'bfb_module_history';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Best-effort mirror of a module open into public.module_history (see
 * supabase/migrations/0002_user_data.sql). Signed-in users are keyed by their
 * auth uid, guests by their guest_id (which is also guest_sessions.id).
 * Fire-and-forget: any failure only logs a console warning.
 */
const lastSync: Record<string, number> = {};
const SYNC_WINDOW_MS = 60_000;

async function syncModuleOpen(moduleId: string, path: string): Promise<void> {
  // Chapter flips inside a module re-trigger the gate; one write per page per
  // minute is plenty for "where did they leave off" analytics.
  const now = Date.now();
  if (now - (lastSync[path] ?? 0) < SYNC_WINDOW_MS) return;
  lastSync[path] = now;
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) {
      const name = (user.user_metadata?.full_name as string) || user.email || '';
      await supabase.rpc('record_module_open', {
        p_owner_key: user.id,
        p_owner_kind: 'user',
        p_display_name: name,
        p_module_id: moduleId,
        p_last_path: path,
      });
      return;
    }
    const gid = localStorage.getItem('guest_id');
    if (localStorage.getItem('guest_session') === 'true' && gid && UUID_RE.test(gid)) {
      await supabase.rpc('record_module_open', {
        p_owner_key: gid,
        p_owner_kind: 'guest',
        p_display_name: localStorage.getItem('guest_name') || '',
        p_module_id: moduleId,
        p_last_path: path,
      });
    }
  } catch (e: any) {
    console.warn('[module-history] db sync skipped:', e?.message ?? e);
  }
}

/** Human labels for each counted module id (matches the portal tree). */
export const MODULE_LABELS: Record<string, string> = {
  'module/1': 'Signals & Waves',
  'module/2': 'Number Systems',
  'module/3': 'Logic Gates',
  'module/4': 'Karnaugh Maps',
  'module/5': 'Verilog Core',
  'module/6': 'Advanced Verilog',
  'dsd/1': 'Binary & Boolean Logic',
  'dsd/2': 'K-Maps · Architect of Logic',
  'dsd/3': 'Circuit Realisation',
  'dsd/4': 'Practice Arena',
  'dsd/5': 'Universal Gates',
  'dsd/6': 'Combinational & Sequential Circuits',
  'dsd/7': 'The Half Adder',
  'dsd/8': 'The Full Adder',
  'dsd/9': 'Recall & Prove',
  'dsd/10': 'The Ripple-Carry Adder',
  'dsd/11': 'The Carry Look-Ahead Adder',
  'dsd/12': 'The Parallel Prefix Adder',
  'dsd/13': 'The Serial Adder',
  'dsd/14': 'Recall & Prime',
  'dsd/15': 'How Computers Subtract',
  'dsd/16': 'The Half Subtractor',
  'dsd/17': 'The Full Subtractor',
  'dsd/18': 'Complements',
  'dsd/19': "The 10's Complement",
  'dsd/20': 'The BCD Adder',
  'dsd/21': 'Multiplexer (MUX)',
  'dsd/22': 'Demultiplexer (DEMUX)',
  'dsd/23': 'Decoders',
  'dsd/24': 'Encoders',
  'dsd/25': 'Code Converters',
  'dsd/26': 'Universal Logic & Shannon',
  'dsd/27': 'Binary Dividers',
  'basic-electronics/1': 'Physics of Control',
  'basic-electronics/2': 'Silicon, Doping & Carriers',
  'basic-electronics/3': 'The P-N Junction',
  'basic-electronics/4': 'Rectifiers & Filters',
  'basic-electronics/5': 'Special-Purpose Diodes',
  'basic-electronics/6': 'BJT Construction & Operation',
  'basic-electronics/7': 'BJT DC Biasing',
  'basic-electronics/8': 'BJT AC Analysis',
  'basic-electronics/9': 'MOSFET Construction',
  'basic-electronics/10': 'Transistors & JFETs',
};

export function moduleLabel(id: string): string {
  return MODULE_LABELS[id] ?? id;
}

interface HistEntry { path: string; ts: number }
type HistMap = Record<string, HistEntry>;

function read(): HistMap {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch {
    return {};
  }
}

/** Record (or update) the module + exact page for the given pathname. No-op for non-module routes. */
export function recordModuleHistory(pathname: string): void {
  const id = moduleIdFromPath(pathname);
  if (!id) return;
  try {
    const map = read();
    map[id] = { path: pathname, ts: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  void syncModuleOpen(id, pathname);
}

export interface ModuleHistoryItem {
  id: string;
  label: string;
  path: string;
  ts: number;
}

/** All modules this browser has opened, most-recent first. Merges legacy guest visits. */
export function getModuleHistory(): ModuleHistoryItem[] {
  const map = read();
  // Fold in any legacy free-gate visits so existing guests aren't blank.
  try {
    const visited = JSON.parse(localStorage.getItem('module_visits') || '[]');
    if (Array.isArray(visited)) {
      for (const id of visited) {
        if (typeof id === 'string' && !map[id]) map[id] = { path: `/${id}`, ts: 0 };
      }
    }
  } catch {
    /* ignore */
  }
  return Object.entries(map)
    .map(([id, e]) => ({ id, label: moduleLabel(id), path: e.path, ts: e.ts }))
    .sort((a, b) => b.ts - a.ts);
}

/** The module the learner most recently worked on, or null. */
export function getLastModule(): ModuleHistoryItem | null {
  return getModuleHistory()[0] ?? null;
}
