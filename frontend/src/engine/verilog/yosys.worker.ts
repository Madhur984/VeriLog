/**
 * Web Worker that runs the self-hosted Yosys WASM engine off the main thread.
 * It lazily imports the bundle from /yowasp/bundle.js (same-origin, so the 43 MB
 * core wasm loads relative to it), then synthesizes any Verilog the page sends
 * into a `write_json` netlist. The big download happens once per session and is
 * reported back as progress events.
 */
const ctx = self as unknown as {
  postMessage: (message: unknown) => void;
  onmessage: ((e: MessageEvent<{ id: number; code: string }>) => void) | null;
};

type RunYosys = (
  args?: string[],
  files?: Record<string, string | Uint8Array>,
  options?: {
    stdout?: (b: Uint8Array | null) => void;
    stderr?: (b: Uint8Array | null) => void;
    fetchProgress?: (e: { totalLength: number; doneLength: number }) => void;
  },
) => Promise<Record<string, string | Uint8Array>>;

let runYosys: RunYosys | null = null;
let loading: Promise<RunYosys> | null = null;

function loadEngine(): Promise<RunYosys> {
  if (runYosys) return Promise.resolve(runYosys);
  if (!loading) {
    // Vite serves this through its pipeline (optimizeDeps.exclude), so the
    // engine's `new URL('./yosys.core.wasm', import.meta.url)` resolves correctly.
    loading = import('@yowasp/yosys')
      .then((mod) => { runYosys = mod.runYosys as unknown as RunYosys; return runYosys!; })
      .catch((e: unknown) => { loading = null; throw e; });
  }
  return loading;
}

const SCRIPT = [
  'read_verilog -sv design.v',
  'hierarchy -auto-top',
  'prep',
  'write_json out.json',
].join('; ');

ctx.onmessage = async (e: MessageEvent<{ id: number; code: string }>) => {
  const { id, code } = e.data;
  let log = '';
  const sink = (b: Uint8Array | null) => { if (b) log += new TextDecoder().decode(b); };
  try {
    const run = await loadEngine();
    const files = await run(['-p', SCRIPT], { 'design.v': code }, {
      stdout: sink,
      stderr: sink,
      fetchProgress: (ev) => ctx.postMessage({ id, type: 'progress', done: ev.doneLength, total: ev.totalLength }),
    });
    const out = files['out.json'];
    const json = typeof out === 'string' ? out : new TextDecoder().decode(out ?? new Uint8Array());
    if (!json) { ctx.postMessage({ id, type: 'error', error: 'Synthesis produced no netlist.', log }); return; }
    ctx.postMessage({ id, type: 'done', json });
  } catch (err) {
    const tail = log.split('\n').filter(Boolean).slice(-8).join('\n');
    const msg = tail || (err instanceof Error ? err.message : String(err));
    ctx.postMessage({ id, type: 'error', error: msg, log });
  }
};

export {};
