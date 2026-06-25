/**
 * Grader for the Hardware-LeetCode basic tier. Compiles the student's Verilog
 * with miniSim, then checks it against a golden model over every input vector.
 */
import { compileVerilog, simulate, type Bit } from './miniSim';
import type { VProblem } from '../../data/verilogProblems';

export interface RowResult {
  in: Record<string, Bit>;
  expected: Record<string, Bit>;
  got: Record<string, Bit> | null;
  pass: boolean;
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

export function grade(problem: VProblem, source: string): GradeResult {
  const compiled = compileVerilog(source);
  if (!compiled.ok) {
    return { status: 'error', error: compiled.error, rows: [], passed: 0, total: 0 };
  }
  const mod = compiled.module;

  // The student's ports must match the problem contract.
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
