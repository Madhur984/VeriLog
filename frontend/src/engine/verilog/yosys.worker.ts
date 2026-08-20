/**
 * Web Worker that runs the self-hosted Yosys WASM engine off the main thread.
 * It lazily imports the bundle from /yowasp/bundle.js (same-origin, so the 43 MB
 * core wasm loads relative to it), then synthesizes any Verilog the page sends
 * into a `write_json` netlist. The big download happens once per session and is
 * reported back as progress events.
 */
import { parseDiagnostics } from './diagnostics';

const ctx = self as unknown as {
  postMessage: (message: unknown) => void;
  onmessage: ((e: MessageEvent<{ id: number; code: string; flatten?: boolean }>) => void) | null;
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

// The self-hosted Yosys ESM bundle is copied out of node_modules into
// `public/yowasp/` by the bfb-yowasp-assets Vite plugin, and loaded here by
// static URL rather than by importing '@yowasp/yosys'. That keeps Vite from
// rewriting the engine's `new URL('./yosys.core.wasm', import.meta.url)` sidecar
// references — in dev those were served with a wasm/empty MIME type and the
// browser rejected them as module scripts ("Strict MIME type checking …"),
// which broke the code→schematic synthesis. Loading the bundle from a plain
// static path makes `import.meta.url` resolve to /yowasp/bundle.js, so its
// siblings fetch as normal static assets (correct MIME) in dev and prod alike.
const BUNDLE_URL = '/yowasp/bundle.js';

function loadEngine(): Promise<RunYosys> {
  if (runYosys) return Promise.resolve(runYosys);
  if (!loading) {
    loading = import(/* @vite-ignore */ BUNDLE_URL)
      .then((mod: { runYosys?: unknown }) => {
        runYosys = mod.runYosys as unknown as RunYosys;
        return runYosys!;
      })
      .catch((e: unknown) => { loading = null; throw e; });
  }
  return loading;
}

/**
 * `flatten` matters for the sandbox, where a testbench module instantiates the
 * design. Without it the instance stays a submodule cell that netlistSim has no
 * model for, and every signal reads x. Flattening dissolves the hierarchy so the
 * top module's ports are the whole observable surface — which is exactly what a
 * synthesizable testbench is written to expose.
 *
 * The judge deliberately does NOT flatten: a student's single module has no
 * hierarchy to dissolve, and skipping the pass keeps synthesis faster.
 */
const script = (flatten: boolean): string => [
  'read_verilog -sv design.v',
  'hierarchy -auto-top',
  'prep',
  ...(flatten ? ['flatten', 'opt -purge'] : []),
  'write_json out.json',
].join('; ');

ctx.onmessage = async (e: MessageEvent<{ id: number; code: string; flatten?: boolean }>) => {
  const { id, code, flatten } = e.data;
  let log = '';
  const sink = (b: Uint8Array | null) => { if (b) log += new TextDecoder().decode(b); };
  try {
    const run = await loadEngine();
    const files = await run(['-p', script(!!flatten)], { 'design.v': code }, {
      stdout: sink,
      stderr: sink,
      fetchProgress: (ev) => ctx.postMessage({ id, type: 'progress', done: ev.doneLength, total: ev.totalLength }),
    });
    const out = files['out.json'];
    const json = typeof out === 'string' ? out : new TextDecoder().decode(out ?? new Uint8Array());
    const diagnostics = parseDiagnostics(log);
    if (!json) { ctx.postMessage({ id, type: 'error', error: 'Synthesis produced no netlist.', diagnostics }); return; }
    ctx.postMessage({ id, type: 'done', json, diagnostics });
  } catch (err) {
    const diagnostics = parseDiagnostics(log);
    const tail = log.split('\n').filter(Boolean).slice(-8).join('\n');
    const msg = diagnostics.find((d) => d.severity === 'error')?.message || tail || (err instanceof Error ? err.message : String(err));
    ctx.postMessage({ id, type: 'error', error: msg, diagnostics });
  }
};

export {};
