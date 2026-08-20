/**
 * yosysClient - a thin main-thread wrapper around the Yosys worker. Keeps a
 * single worker alive so the 43 MB engine loads only once, and exposes a
 * promise-based `synthesize()` with progress.
 *
 * Robustness guards (a runaway or oversized design can otherwise wedge the app):
 *   - TIMEOUT: the WASM engine runs synchronously inside the worker, so a design
 *     that never finishes (too large / a synthesis loop) can't be interrupted
 *     except by killing the worker. Each run has a hard timeout that resolves as
 *     an error and terminates + respawns the worker so the next run starts clean.
 *   - RECYCLE: Yosys WASM accumulates heap across runs, so after a number of runs
 *     we terminate the worker while idle to reclaim memory; the next synthesize()
 *     lazily respawns it.
 */
import type { Diag } from './diagnostics';

export interface SynthProgress { done: number; total: number }
export type SynthResult =
  | { ok: true; json: string; diagnostics: Diag[] }
  | { ok: false; error: string; diagnostics: Diag[] };

const RUN_TIMEOUT_MS = 30_000;   // kill a run that wedges the engine
const RECYCLE_AFTER_RUNS = 25;   // reclaim WASM memory after a heavy session

let worker: Worker | null = null;
let seq = 0;
let runsSinceSpawn = 0;
const pending = new Map<number, {
  resolve: (r: SynthResult) => void;
  onProgress?: (p: SynthProgress) => void;
  timer?: ReturnType<typeof setTimeout>;
}>();

// (Re)arm the per-run wedge timer. Reset on each progress event so the one-time
// ~43MB engine DOWNLOAD isn't counted against the synthesis budget — the timer
// then measures actual (post-download) synthesis time and only fires if the
// engine truly wedges on a run.
function armWedgeTimer(id: number) {
  const entry = pending.get(id);
  if (!entry) return;
  clearTimeout(entry.timer);
  entry.timer = setTimeout(() => {
    settle(id, {
      ok: false,
      error: `Synthesis timed out after ${RUN_TIMEOUT_MS / 1000}s — the design may be too large or contain a synthesis loop. Try simplifying it.`,
      diagnostics: [],
    });
    failAllPending('Synthesis engine was reset after a timeout — please run again.');
    recycle();
  }, RUN_TIMEOUT_MS);
}

function settle(id: number, r: SynthResult) {
  const entry = pending.get(id);
  if (!entry) return;
  clearTimeout(entry.timer);
  pending.delete(id);
  entry.resolve(r);
}

function failAllPending(error: string) {
  pending.forEach((entry, id) => {
    clearTimeout(entry.timer);
    entry.resolve({ ok: false, error, diagnostics: [] });
    pending.delete(id);
  });
}

/** Kill the worker (if any) so the next synthesize() spawns a fresh one. */
function recycle() {
  if (worker) { worker.terminate(); worker = null; }
  runsSinceSpawn = 0;
}

/** After a heavy session, recycle while idle to reclaim WASM heap. */
function maybeRecycleWhenIdle() {
  if (pending.size === 0 && runsSinceSpawn >= RECYCLE_AFTER_RUNS) recycle();
}

function spawnWorker(): Worker {
  const w = new Worker(new URL('./yosys.worker.ts', import.meta.url), { type: 'module' });
  w.onmessage = (e: MessageEvent<{ id: number; type: string; json?: string; error?: string; done?: number; total?: number; diagnostics?: Diag[] }>) => {
    const { id, type } = e.data;
    const entry = pending.get(id);
    if (!entry) return;
    if (type === 'progress') {
      entry.onProgress?.({ done: e.data.done ?? 0, total: e.data.total ?? 0 });
      armWedgeTimer(id); // still downloading — don't let the download eat the timeout
      return;
    }
    if (type === 'done') {
      settle(id, { ok: true, json: e.data.json ?? '', diagnostics: e.data.diagnostics ?? [] });
    } else if (type === 'error') {
      settle(id, { ok: false, error: e.data.error ?? 'Synthesis failed.', diagnostics: e.data.diagnostics ?? [] });
    }
    runsSinceSpawn++;
    maybeRecycleWhenIdle();
  };
  w.onerror = (ev) => {
    // The engine crashed/failed to load — fail everything and start fresh next time.
    failAllPending(ev.message || 'The Yosys engine failed to load.');
    recycle();
  };
  return w;
}

function ensureWorker(): Worker {
  if (!worker) { worker = spawnWorker(); runsSinceSpawn = 0; }
  return worker;
}

/**
 * Memo of the most recent synthesis results, keyed by source text.
 *
 * Several panels want the netlist for the *same* code at the same moment — the
 * live schematic and the custom-run panel both react to the debounced editor
 * contents — and synthesizing twice would double the work for an identical
 * answer. Keyed by source rather than by caller, so an undo back to previous
 * code is also free.
 *
 * Small on purpose: netlists are large, and holding many would defeat the
 * worker recycling that exists to reclaim WASM heap.
 */
const CACHE_MAX = 8;
const synthCache = new Map<string, SynthResult>();

function cacheResult(code: string, r: SynthResult): SynthResult {
  // Never cache an engine-level failure (timeout, worker crash) — those are
  // transient and the next attempt may well succeed. A compile error is a
  // genuine property of the source, so that one is worth keeping.
  const transient = !r.ok && /timed out|engine was reset|failed to load/i.test(r.error);
  if (!transient) {
    synthCache.set(code, r);
    if (synthCache.size > CACHE_MAX) synthCache.delete(synthCache.keys().next().value as string);
  }
  return r;
}

export interface SynthOptions {
  /** Dissolve module hierarchy so a testbench's DUT instance is simulable. */
  flatten?: boolean;
}

export function synthesize(
  code: string,
  onProgress?: (p: SynthProgress) => void,
  opts: SynthOptions = {},
): Promise<SynthResult> {
  // The flag changes the netlist, so it has to be part of the cache identity.
  const key = `${opts.flatten ? 'F' : '-'}\n${code}`;
  const hit = synthCache.get(key);
  if (hit) return Promise.resolve(hit);

  const w = ensureWorker();
  const id = ++seq;
  return new Promise<SynthResult>((resolve) => {
    pending.set(id, { resolve: (r) => resolve(cacheResult(key, r)), onProgress });
    armWedgeTimer(id); // reset on each progress event (see armWedgeTimer)
    w.postMessage({ id, code, flatten: !!opts.flatten });
  });
}

/** Drop memoized netlists (used by tests; also on an engine reset). */
export const clearSynthCache = (): void => { synthCache.clear(); };

/** Whether the engine has already been pulled in this session (best-effort). */
export const engineStarted = () => worker !== null;
