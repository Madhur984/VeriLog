/**
 * Differential grader.
 *
 * Both the student's design and the problem's reference solution are synthesized
 * with Yosys and driven with identical stimulus; a mismatch on any recorded
 * output is a failure. The reference Verilog is therefore the single source of
 * truth for a problem's behaviour — there is no second model in TypeScript that
 * could drift from it.
 *
 * The synthesis step is injected so the same grader runs in the browser (Yosys
 * WASM worker) and under Node (authoring harness / CI).
 */
import type { Diag } from './diagnostics';
import { buildFromNetlist, runTrace, type PortInfo, type Trace } from './simRunner';
import { buildSeqVectors, buildVectors, type StimPort, type Vector } from './stimulus';
import { inputBits, isSequential, type VProblemV2 } from '../../data/verilog/types';

export interface SynthOutcome { json: string; log?: string; diagnostics?: Diag[] }
export type Synthesize = (code: string) => Promise<SynthOutcome>;

export interface DiffRow {
  /** Cycle index for sequential problems; vector index otherwise. */
  index: number;
  in: Record<string, bigint>;
  expected: Record<string, bigint | null>;
  got: Record<string, bigint | null>;
  pass: boolean;
}

/**
 * What a passing verdict actually established.
 *
 * The UI must never present these as interchangeable: "we enumerated every
 * possible input" and "we tried 256 random ones" are different claims, and
 * showing one green tick for both would overclaim. See the verdict badge in
 * components/verilog/VerdictBadge.tsx.
 *
 * `proved` and `bounded` are reserved for the formal-equivalence path (Yosys
 * `miter` + `sat`) and are not produced yet — they are declared here so the UI
 * contract is written once rather than retrofitted.
 */
export type VerdictKind = 'proved' | 'exhaustive' | 'bounded' | 'sampled';

export interface DiffGradeResult {
  status: 'pass' | 'fail' | 'error';
  /** Strength of the check that was run — set whenever vectors were generated. */
  verdict?: VerdictKind;
  /** Cycles proved, for `bounded`; input-space size for `exhaustive`. */
  verdictDetail?: { cycles?: number; space?: number };
  /** Set when the design could not be compiled or does not match the interface. */
  error?: string;
  diagnostics: Diag[];
  rows: DiffRow[];
  passed: number;
  total: number;
  /** Index into `rows` of the first mismatch, for jump-to-failure in the UI. */
  firstFailure?: number;
  /** Student trace, for the waveform viewer. */
  trace?: Trace;
  /** Reference trace, drawn as the golden overlay. */
  expectedTrace?: Trace;
  /** Cells the simulator could not model — surfaced as a caveat, not a failure. */
  unsupportedCells?: string[];
}

const err = (message: string, diagnostics: Diag[] = []): DiffGradeResult => ({
  status: 'error', error: message, diagnostics, rows: [], passed: 0, total: 0,
});

/** Reference netlists are stable per problem, so synthesize each at most once. */
const referenceCache = new Map<string, string>();

function checkInterface(problem: VProblemV2, ports: PortInfo[], moduleName: string): string | null {
  if (moduleName !== problem.moduleName && moduleName !== '(top)') {
    return `Your top module is \`${moduleName}\` — this problem requires \`${problem.moduleName}\`.`;
  }
  const byName = new Map(ports.map((p) => [p.name, p]));

  for (const want of problem.inputs) {
    const got = byName.get(want.name);
    if (!got) return `Missing input \`${want.name}\`.`;
    if (got.direction !== 'input') return `\`${want.name}\` must be an input.`;
    if (got.width !== want.width) {
      return `Input \`${want.name}\` should be ${want.width} bit${want.width > 1 ? 's' : ''} wide, but yours is ${got.width}.`;
    }
  }
  for (const want of problem.outputs) {
    const got = byName.get(want.name);
    if (!got) return `Missing output \`${want.name}\`.`;
    if (got.direction !== 'output') return `\`${want.name}\` must be an output.`;
    if (got.width !== want.width) {
      return `Output \`${want.name}\` should be ${want.width} bit${want.width > 1 ? 's' : ''} wide, but yours is ${got.width}.`;
    }
  }
  return null;
}

/** Ports to drive, in a stable order (the clock is stepped by the runner). */
function stimPorts(problem: VProblemV2): StimPort[] {
  return problem.inputs.filter((i) => i.name !== problem.clock).map((i) => ({ name: i.name, width: i.width }));
}

export function buildStimulus(problem: VProblemV2): Vector[] {
  const ports = stimPorts(problem);
  const spec = problem.stimulus ?? {};
  if (isSequential(problem)) {
    return buildSeqVectors(ports, { ...spec, reset: problem.reset });
  }
  // A wide combinational design can't be enumerated; fall back to sampled vectors.
  const mode = spec.mode ?? (inputBits(problem) <= 14 ? 'exhaustive' : 'vectors');
  return buildVectors(ports, { ...spec, mode });
}

/**
 * How strong a claim the generated stimulus supports.
 *
 * Combinational designs narrow enough to enumerate get every input vector, so a
 * pass is genuinely exhaustive. Everything else — wide combinational, and every
 * sequential design, where the reachable state space is unbounded — is sampled,
 * and the UI says so.
 */
export function verdictKindFor(problem: VProblemV2, vectorCount: number): {
  verdict: VerdictKind;
  verdictDetail?: { cycles?: number; space?: number };
} {
  if (isSequential(problem)) return { verdict: 'sampled', verdictDetail: { cycles: vectorCount } };
  const bits = inputBits(problem);
  const mode = problem.stimulus?.mode ?? (bits <= 14 ? 'exhaustive' : 'vectors');
  if (mode === 'exhaustive') return { verdict: 'exhaustive', verdictDetail: { space: 2 ** bits } };
  return { verdict: 'sampled' };
}

const sameValue = (a: bigint | null, b: bigint | null): boolean => (a === null || b === null ? a === b : a === b);

export async function diffGrade(
  problem: VProblemV2,
  source: string,
  synthesize: Synthesize,
): Promise<DiffGradeResult> {
  // ── student design ────────────────────────────────────────────────────────
  const studentSynth = await synthesize(source);
  const diagnostics = studentSynth.diagnostics ?? [];
  if (!studentSynth.json) {
    const firstError = diagnostics.find((d) => d.severity === 'error')?.message;
    return err(firstError ?? 'Your design did not compile.', diagnostics);
  }
  const student = buildFromNetlist(studentSynth.json);
  if (!student.ok) return err(student.error, diagnostics);

  const mismatch = checkInterface(problem, student.ports, student.moduleName);
  if (mismatch) return err(mismatch, diagnostics);

  // ── reference design ──────────────────────────────────────────────────────
  let refJson = referenceCache.get(problem.id);
  if (!refJson) {
    const refSynth = await synthesize(problem.solution);
    if (!refSynth.json) {
      return err('The reference solution for this problem failed to build — please report this.', diagnostics);
    }
    refJson = refSynth.json;
    referenceCache.set(problem.id, refJson);
  }
  const reference = buildFromNetlist(refJson);
  if (!reference.ok) return err('The reference netlist for this problem is unusable — please report this.', diagnostics);

  // ── run both on identical stimulus ────────────────────────────────────────
  const vectors = buildStimulus(problem);
  const recorded = [...problem.inputs.filter((i) => i.name !== problem.clock).map((i) => i.name),
                    ...problem.outputs.map((o) => o.name)];
  const runOpts = { clock: problem.clock, record: recorded };

  const trace = runTrace(student.sim, vectors, runOpts);
  const expectedTrace = runTrace(reference.sim, vectors, runOpts);

  const outNames = problem.outputs.map((o) => o.name);
  const inNames = problem.inputs.filter((i) => i.name !== problem.clock).map((i) => i.name);
  const sig = (t: Trace, name: string) => t.signals.find((s) => s.name === name);

  const rows: DiffRow[] = [];
  let passed = 0;
  let firstFailure: number | undefined;

  for (let i = 0; i < vectors.length; i++) {
    const inputs: Record<string, bigint> = {};
    for (const n of inNames) inputs[n] = vectors[i][n] ?? 0n;

    const expected: Record<string, bigint | null> = {};
    const got: Record<string, bigint | null> = {};
    let ok = true;
    for (const n of outNames) {
      const e = sig(expectedTrace, n)?.values[i] ?? null;
      const g = sig(trace, n)?.values[i] ?? null;
      expected[n] = e;
      got[n] = g;
      if (!sameValue(e, g)) ok = false;
    }
    if (ok) passed++;
    else if (firstFailure === undefined) firstFailure = rows.length;
    rows.push({ index: i, in: inputs, expected, got, pass: ok });
  }

  const unsupportedCells = student.sim.unsupported.length ? [...student.sim.unsupported] : undefined;

  return {
    status: passed === rows.length ? 'pass' : 'fail',
    ...verdictKindFor(problem, rows.length),
    diagnostics,
    rows,
    passed,
    total: rows.length,
    firstFailure,
    trace,
    expectedTrace,
    unsupportedCells,
  };
}

/** Drop cached reference netlists (used by the authoring harness between runs). */
export const clearReferenceCache = (): void => { referenceCache.clear(); };
