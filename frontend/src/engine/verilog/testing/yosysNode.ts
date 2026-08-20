/**
 * Node-side Yosys runner — the same synthesis the browser worker performs, but
 * callable from vitest and from the problem-bank authoring harness.
 *
 * The browser path (yosys.worker.ts) loads the engine from a static `/yowasp/`
 * URL to dodge Vite's transform of the wasm sidecars; under Node there is no
 * such constraint, so we import the package directly. Keeping the SCRIPT
 * identical to the worker's is what makes offline validation meaningful: a
 * reference solution proven here is proven against the netlist students get.
 */
import { parseDiagnostics, type Diag } from '../diagnostics';

export const YOSYS_SCRIPT = [
  'read_verilog -sv design.v',
  'hierarchy -auto-top',
  'prep',
  'write_json out.json',
].join('; ');

export interface NodeSynthResult {
  json: string;
  log: string;
  diagnostics: Diag[];
}

type RunYosys = (
  args?: string[],
  files?: Record<string, string | Uint8Array>,
  options?: { stdout?: (b: Uint8Array | null) => void; stderr?: (b: Uint8Array | null) => void },
) => Promise<Record<string, string | Uint8Array>>;

let engine: Promise<RunYosys> | null = null;

function loadEngine(): Promise<RunYosys> {
  if (!engine) {
    engine = import('@yowasp/yosys').then((m) => {
      const mod = m as unknown as { runYosys?: RunYosys; default?: { runYosys?: RunYosys } };
      const run = mod.runYosys ?? mod.default?.runYosys;
      if (!run) throw new Error('@yowasp/yosys did not expose runYosys');
      return run;
    });
  }
  return engine;
}

/** Synthesize one Verilog source to a Yosys JSON netlist. Never throws. */
export async function synthesizeNode(code: string): Promise<NodeSynthResult> {
  let log = '';
  const sink = (b: Uint8Array | null) => { if (b) log += new TextDecoder().decode(b); };
  try {
    const run = await loadEngine();
    const files = await run(['-p', YOSYS_SCRIPT], { 'design.v': code }, { stdout: sink, stderr: sink });
    const out = files['out.json'];
    const json = typeof out === 'string' ? out : new TextDecoder().decode(out ?? new Uint8Array());
    return { json, log, diagnostics: parseDiagnostics(log) };
  } catch (err) {
    const diagnostics = parseDiagnostics(log);
    const msg = diagnostics.find((d) => d.severity === 'error')?.message
      ?? (err instanceof Error ? err.message : String(err));
    return { json: '', log: `${log}\n${msg}`, diagnostics };
  }
}
