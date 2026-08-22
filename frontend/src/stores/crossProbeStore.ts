/**
 * One selection, shared by the editor, the schematic and the waveform.
 *
 * The three views each have their own idea of "this thing": the editor knows
 * file+line, the schematic knows cell and net ids, the waveform knows signal
 * names. Cross-probing works only if there is a SINGLE selection they all read
 * and write, rather than three that try to mirror each other — mirroring is how
 * you get feedback loops where a click in one pane bounces back and re-selects
 * something slightly different in another.
 *
 * `origin` records which view initiated the change. A view must not scroll or
 * re-focus itself in response to its own selection, or clicking a wire yanks the
 * diagram out from under the cursor; every consumer checks `origin !== 'self'`
 * before reacting with movement.
 */
import { useSyncExternalStore } from 'react';

export type ProbeOrigin = 'schematic' | 'editor' | 'waveform' | 'none';

export interface ProbeSelection {
  /** Yosys bit list, comma-joined — the schematic's net identity. */
  netId?: string;
  /** Declared signal name, when the net has one. */
  netName?: string;
  cellId?: string;
  srcFile?: string;
  srcLine?: number;
  origin: ProbeOrigin;
}

const EMPTY: ProbeSelection = { origin: 'none' };

let selection: ProbeSelection = EMPTY;
const listeners = new Set<() => void>();

function emit(): void { for (const l of listeners) l(); }

export function getProbe(): ProbeSelection { return selection; }

export function setProbe(next: Omit<ProbeSelection, 'origin'> & { origin: ProbeOrigin }): void {
  // Re-selecting the identical thing is a no-op: without this, a view that
  // echoes the selection back (schematic click -> editor reveal -> editor
  // cursor event -> schematic select) would loop forever.
  if (same(selection, next)) return;
  selection = next;
  emit();
}

export function clearProbe(): void {
  if (selection === EMPTY) return;
  selection = EMPTY;
  emit();
}

function same(a: ProbeSelection, b: ProbeSelection): boolean {
  return a.netId === b.netId
    && a.cellId === b.cellId
    && a.srcFile === b.srcFile
    && a.srcLine === b.srcLine;
}

export function subscribeProbe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** React binding. Returns the current selection and re-renders on change. */
export function useProbe(): ProbeSelection {
  return useSyncExternalStore(subscribeProbe, getProbe, getProbe);
}

/** Test seam — the module-level singleton otherwise leaks between cases. */
export function __resetProbe(): void {
  selection = EMPTY;
  listeners.clear();
}
