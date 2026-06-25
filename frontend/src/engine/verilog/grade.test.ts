import { describe, it, expect } from 'vitest';
import { grade } from './grade';
import { VERILOG_PROBLEMS } from '../../data/verilogProblems';

describe('grader', () => {
  it('every reference solution passes its own problem', () => {
    for (const p of VERILOG_PROBLEMS) {
      const r = grade(p, p.solution);
      expect(r.status, `${p.title} solution should pass (${r.error ?? ''})`).toBe('pass');
      expect(r.passed).toBe(r.total);
    }
  });

  it('starter code does not falsely pass', () => {
    // Starters are unfinished — they must either error (undriven output) or fail.
    for (const p of VERILOG_PROBLEMS) {
      const r = grade(p, p.starter);
      expect(r.status, `${p.title} starter should not pass`).not.toBe('pass');
    }
  });

  it('a wrong AND (using OR) fails with a diff', () => {
    const and = VERILOG_PROBLEMS.find((p) => p.id === 'and')!;
    const r = grade(and, `module top(input a, input b, output y); assign y = a | b; endmodule`);
    expect(r.status).toBe('fail');
    expect(r.passed).toBeLessThan(r.total);
    expect(r.rows.some((row) => !row.pass)).toBe(true);
  });

  it('renamed output port is reported as an error', () => {
    const and = VERILOG_PROBLEMS.find((p) => p.id === 'and')!;
    const r = grade(and, `module top(input a, input b, output z); assign z = a & b; endmodule`);
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/output `y`/);
  });
});
