/**
 * The sandbox's run pipeline, as one testable function.
 *
 * This used to live inline in the page, which meant the only way to check that
 * "any reasonable Verilog runs" was to click Run and look. Pulling it out lets a
 * test drive dozens of designs through the *same* code the button does — a copy
 * of the logic in a test file would drift from the real thing and quietly stop
 * proving anything.
 *
 * The synthesis step is injected so the browser can pass its Web Worker client
 * and Node can pass the direct engine binding.
 */
import { buildFromNetlist, runTrace, type PortInfo, type Trace } from './simRunner';
import { buildSeqVectors, buildVectors, canBeExhaustive, type StimPort } from './stimulus';
import { analyzeNetlist, type SynthStats } from './netlistStats';
import { mergeDiagnostics, lintSandbox, buildSandboxSource, benchWiring, describeBenchMismatch, TB_FILE } from './sandboxSource';
import type { Diag } from './diagnostics';

/** Ports whose names read like a clock, in the order engineers write them. */
const CLOCK_NAMES = /^(clk|clock|clk_i|i_clk|clki|sysclk|clk_in)$/i;
const RESET_NAMES = /^(rst|reset|rst_n|resetn|reset_n|nrst|n_rst|arst|arst_n|rst_i|i_rst)$/i;

export const inferClock = (ports: PortInfo[]): string | undefined =>
  ports.find((p) => p.direction === 'input' && p.width === 1 && CLOCK_NAMES.test(p.name))?.name;

export const inferReset = (ports: PortInfo[]): { name: string; activeLow: boolean } | undefined => {
  const p = ports.find((x) => x.direction === 'input' && x.width === 1 && RESET_NAMES.test(x.name));
  if (!p) return undefined;
  return { name: p.name, activeLow: /_n$/i.test(p.name) || /^n_?rst/i.test(p.name) };
};

/** Structural match for yosysClient's SynthResult and the Node harness alike. */
export type SynthLike =
  | { ok: true; json: string; diagnostics: Diag[] }
  | { ok: false; error: string; diagnostics: Diag[] };

/** Injected synthesis: the browser worker client, or the Node engine in tests. */
export type Synthesizer = (source: string) => Promise<SynthLike>;

export interface SandboxRun {
  ok: boolean;
  error?: string;
  diags: Diag[];
  /** True when testbench.v was skipped because it would not build. */
  soloDesign: boolean;
  top?: string;
  clock?: string;
  reset?: string;
  json?: string;
  stats?: SynthStats | null;
  trace?: Trace;
  /** Cells the simulator has no model for; a non-empty list means a flat trace. */
  unsupported?: string[];
}

export async function runSandbox(
  design: string,
  tb: string,
  cycles: number,
  synth: Synthesizer,
): Promise<SandboxRun> {
  const hasBench = tb.trim().length > 0;

  let r = await synth(buildSandboxSource(design, tb));

  // If the pair will not build, fall back to driving the design on its own —
  // exactly what the Judge does with a lone module. A stale testbench left over
  // from an earlier design is the most common way to get here, and refusing to
  // run anything at all is the least useful response to it.
  let soloDesign = false;
  if (!r.ok && hasBench) {
    const solo = await synth(buildSandboxSource(design, ''));
    if (solo.ok) { r = solo; soloDesign = true; }
  }

  const diags = mergeDiagnostics(r.diagnostics, lintSandbox(design, soloDesign ? '' : tb));
  if (!r.ok) return { ok: false, error: r.error, diags, soloDesign };

  const built = buildFromNetlist(r.json);
  if (!built.ok) return { ok: false, error: built.error, diags, soloDesign };

  const clock = inferClock(built.ports);
  const reset = inferReset(built.ports);

  if (soloDesign) {
    const why = describeBenchMismatch(
      benchWiring(tb, built.moduleName), built.ports.map((p) => p.name));
    diags.unshift({
      severity: 'warning',
      file: TB_FILE,
      message: `Simulated design.v on its own — testbench.v could not be built with it.${why ? ` ${why}` : ''} Fix the testbench, or clear it to drive the design directly.`,
    });
  }

  const drivable: StimPort[] = built.ports
    .filter((p) => p.direction === 'input' && p.name !== clock)
    .map((p) => ({ name: p.name, width: p.width }));

  // A self-driving testbench has no inputs beyond the clock; give it empty
  // vectors so it still gets `cycles` clock edges. For combinational logic,
  // enumerate the whole input space when it is small enough to be worth reading
  // and sample it otherwise — an 8-input design has 256 columns, which is a
  // wall, not a waveform.
  const vectors = clock
    ? (drivable.length
      ? buildSeqVectors(drivable, { cycles, reset, seed: 1 })
      : Array.from({ length: cycles }, () => ({})))
    : drivable.length
      ? canBeExhaustive(drivable)
        ? buildVectors(drivable, { mode: 'exhaustive' })
        // `vectors` is a floor, not a ceiling — the corner sweep runs first and
        // can overshoot it. Trim so the cycles box governs the trace width, as
        // it visibly claims to.
        : buildVectors(drivable, { mode: 'vectors', vectors: cycles, seed: 1 }).slice(0, cycles)
      : buildVectors([], { mode: 'vectors', vectors: 1 });

  const trace = runTrace(built.sim, vectors, { clock });

  return {
    ok: true,
    diags,
    soloDesign,
    top: built.moduleName,
    clock,
    reset: reset?.name,
    json: r.json,
    stats: analyzeNetlist(r.json),
    trace,
    unsupported: built.sim.unsupported,
  };
}
