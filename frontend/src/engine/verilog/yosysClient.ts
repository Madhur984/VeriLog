/**
 * yosysClient - a thin main-thread wrapper around the Yosys worker. Keeps a
 * single worker alive so the 43 MB engine loads only once, and exposes a
 * promise-based `synthesize()` with progress + cancellation (latest call wins).
 */
import type { Diag } from './diagnostics';

export interface SynthProgress { done: number; total: number }
export type SynthResult =
  | { ok: true; json: string; diagnostics: Diag[] }
  | { ok: false; error: string; diagnostics: Diag[] };

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, {
  resolve: (r: SynthResult) => void;
  onProgress?: (p: SynthProgress) => void;
}>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./yosys.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent<{ id: number; type: string; json?: string; error?: string; done?: number; total?: number; diagnostics?: Diag[] }>) => {
    const { id, type } = e.data;
    const entry = pending.get(id);
    if (!entry) return;
    if (type === 'progress') {
      entry.onProgress?.({ done: e.data.done ?? 0, total: e.data.total ?? 0 });
    } else if (type === 'done') {
      pending.delete(id);
      entry.resolve({ ok: true, json: e.data.json ?? '', diagnostics: e.data.diagnostics ?? [] });
    } else if (type === 'error') {
      pending.delete(id);
      entry.resolve({ ok: false, error: e.data.error ?? 'Synthesis failed.', diagnostics: e.data.diagnostics ?? [] });
    }
  };
  worker.onerror = (ev) => {
    const msg = ev.message || 'The Yosys engine failed to load.';
    pending.forEach((entry) => entry.resolve({ ok: false, error: msg, diagnostics: [] }));
    pending.clear();
  };
  return worker;
}

export function synthesize(code: string, onProgress?: (p: SynthProgress) => void): Promise<SynthResult> {
  const w = ensureWorker();
  const id = ++seq;
  return new Promise<SynthResult>((resolve) => {
    pending.set(id, { resolve, onProgress });
    w.postMessage({ id, code });
  });
}

/** Whether the engine has already been pulled in this session (best-effort). */
export const engineStarted = () => worker !== null;
