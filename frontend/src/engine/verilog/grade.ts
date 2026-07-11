/**
 * Grader for the Hardware-LeetCode judge.
 *  - Combinational problems: compiled with miniSim, checked EXHAUSTIVELY against
 *    a golden model over every input vector.
 *  - Sequential (flip-flop) problems: compiled with seqSim, checked CYCLE-BY-CYCLE
 *    against a stateful golden over a fixed clock sequence.
 */
import { compileVerilog, simulate, type Bit } from './miniSim';
import { compileSeq, stepSeq } from './seqSim';
import { isSeq, type AnyProblem, type VProblem, type VSeqProblem } from '../../data/verilogProblems';

export interface RowResult {
  in: Record<string, Bit>;
  expected: Record<string, Bit>;
  got: Record<string, Bit> | null;
  pass: boolean;
  /** clock-cycle index — set for sequential problems only */
  cycle?: number;
}

export interface GradeResult {
  status: 'pass' | 'fail' | 'error';
  /** compile / simulation error message (status === 'error') */
  error?: string;
  rows: RowResult[];
  passed: number;
  total: number;
}

const MAX_INPUT_BITS = 14; // 2^14 = 16384 vectors, plenty for the basic tier

export function grade(problem: AnyProblem, source: string): GradeResult {
  return isSeq(problem) ? gradeSeq(problem, source) : gradeComb(problem, source);
}

// ─── combinational: exhaustive truth-table diff ──────────────────────────────
function gradeComb(problem: VProblem, source: string): GradeResult {
  const compiled = compileVerilog(source);
  if (!compiled.ok) return { status: 'error', error: compiled.error, rows: [], passed: 0, total: 0 };
  const mod = compiled.module;

  for (const i of problem.inputs)
    if (!mod.inputs.includes(i))
      return { status: 'error', error: `Your module must declare input \`${i}\`.`, rows: [], passed: 0, total: 0 };
  for (const o of problem.outputs)
    if (!mod.outputs.includes(o))
      return { status: 'error', error: `Your module must declare output \`${o}\`.`, rows: [], passed: 0, total: 0 };

  if (problem.inputs.length > MAX_INPUT_BITS)
    return { status: 'error', error: 'Problem has too many inputs for exhaustive testing.', rows: [], passed: 0, total: 0 };

  const n = problem.inputs.length;
  const rows: RowResult[] = [];
  let passed = 0;

  for (let m = 0; m < (1 << n); m++) {
    const inp: Record<string, Bit> = {};
    problem.inputs.forEach((name, idx) => { inp[name] = ((m >> (n - 1 - idx)) & 1) as Bit; });

    const expected = problem.golden(inp);
    let got: Record<string, Bit> | null = null;
    let ok = false;
    try {
      const full = simulate(mod, inp);
      got = {};
      ok = true;
      for (const o of problem.outputs) {
        got[o] = full[o];
        if (full[o] !== expected[o]) ok = false;
      }
    } catch {
      got = null;
      ok = false;
    }
    if (ok) passed++;
    rows.push({ in: inp, expected, got, pass: ok });
  }

  return { status: passed === rows.length ? 'pass' : 'fail', rows, passed, total: rows.length };
}

// ─── sequential: step the clock, diff each cycle ─────────────────────────────
function gradeSeq(problem: VSeqProblem, source: string): GradeResult {
  const c = compileSeq(source);
  if (!c.ok) return { status: 'error', error: c.error, rows: [], passed: 0, total: 0 };
  const mod = c.module;

  if (mod.clock !== problem.clock)
    return { status: 'error', error: `Clock the design on \`posedge ${problem.clock}\`.`, rows: [], passed: 0, total: 0 };
  for (const d of problem.dataInputs)
    if (!mod.inputs.includes(d))
      return { status: 'error', error: `Your module must declare input \`${d}\`.`, rows: [], passed: 0, total: 0 };
  for (const o of problem.regOutputs)
    if (!mod.regs.includes(o))
      return { status: 'error', error: `\`${o}\` must be an \`output reg\` driven on the clock edge.`, rows: [], passed: 0, total: 0 };
  if (problem.reset && mod.reset !== problem.reset)
    return { status: 'error', error: `Handle the reset \`${problem.reset}\` in the sensitivity list.`, rows: [], passed: 0, total: 0 };

  let studentState: Record<string, Bit> = {};
  let goldenState: Record<string, Bit> = {};
  for (const r of problem.regOutputs) { studentState[r] = 0; goldenState[r] = 0; }

  const rows: RowResult[] = [];
  let passed = 0;

  problem.vectors.forEach((vec, i) => {
    const expected = problem.step(goldenState, vec);
    let got: Record<string, Bit> | null = null;
    let ok = false;
    try {
      const nextState = stepSeq(mod, studentState, vec);
      got = {};
      ok = true;
      for (const o of problem.regOutputs) {
        got[o] = nextState[o];
        if (nextState[o] !== expected[o]) ok = false;
      }
      studentState = nextState;
    } catch {
      got = null;
      ok = false;
    }
    goldenState = expected;
    if (ok) passed++;
    rows.push({ in: vec, expected, got, pass: ok, cycle: i });
  });

  return { status: passed === rows.length ? 'pass' : 'fail', rows, passed, total: rows.length };
}
