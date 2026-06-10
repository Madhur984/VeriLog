/**
 * Lightweight per-browser record of which course modules the learner has opened,
 * the exact page they last reached in each (for "continue where you left off"),
 * and when. Recorded for EVERY visitor (real login or guest), unlike the
 * free-gate visit counter in lib/auth which only tracks guests.
 */

import { moduleIdFromPath } from './auth';

const KEY = 'bfb_module_history';

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
  'basic-electronics/1': 'Physics of Control',
  'basic-electronics/2': 'Silicon, Doping & Carriers',
  'basic-electronics/3': 'The P-N Junction',
  'basic-electronics/4': 'Rectifiers & Filters',
  'basic-electronics/5': 'Special-Purpose Diodes',
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
