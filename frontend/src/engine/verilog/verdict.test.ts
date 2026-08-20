/**
 * The verdict taxonomy is a promise to the user, so it gets a test rather than
 * a code review. The failure this guards against is silent and severe: a change
 * that lets a sampled run report `exhaustive` would have the UI claim every
 * input was checked when it was not.
 */
import { describe, it, expect } from 'vitest';
import { verdictKindFor } from './diffGrade';
import { VERILOG_V2_PROBLEMS, inputBits, isSequential } from '../../data/verilog';
import type { VProblemV2 } from '../../data/verilog';

const byId = (id: string): VProblemV2 => {
  const p = VERILOG_V2_PROBLEMS.find((x) => x.id === id);
  if (!p) throw new Error(`fixture problem ${id} is missing`);
  return p;
};

describe('verdictKindFor', () => {
  it('claims exhaustive only when the input space was actually enumerated', () => {
    // plain_wire has a single 1-bit input: 2 vectors covers everything.
    const wire = byId('g-wire');
    const v = verdictKindFor(wire, 2);
    expect(v.verdict).toBe('exhaustive');
    expect(v.verdictDetail?.space).toBe(2);
  });

  it('downgrades to sampled when the input space is too wide to enumerate', () => {
    // alu8: 8 + 8 + 3 = 19 input bits, far past the 14-bit enumeration budget.
    const alu = byId('a-alu8');
    expect(inputBits(alu)).toBeGreaterThan(14);
    expect(verdictKindFor(alu, 256).verdict).toBe('sampled');
  });

  it('never claims exhaustive for a sequential design', () => {
    // Reachable state is unbounded even when the input space is tiny, so a
    // finite cycle run can only ever be evidence.
    const seq = VERILOG_V2_PROBLEMS.filter(isSequential);
    expect(seq.length).toBeGreaterThan(0);
    for (const p of seq) {
      expect(verdictKindFor(p, 32).verdict, `${p.id} overclaimed`).toBe('sampled');
    }
  });

  it('honours an author-declared sampled stimulus over the bit-width heuristic', () => {
    const narrow = byId('g-wire');
    const forced: VProblemV2 = { ...narrow, stimulus: { mode: 'vectors' } };
    expect(verdictKindFor(forced, 64).verdict).toBe('sampled');
  });

  it('assigns every problem in the bank a verdict it can support', () => {
    for (const p of VERILOG_V2_PROBLEMS) {
      const { verdict } = verdictKindFor(p, 64);
      expect(['exhaustive', 'sampled'], `${p.id}`).toContain(verdict);
      // The formal-proof verdicts are declared but must not be produced yet —
      // claiming a proof the grader never ran would be the worst possible bug.
      expect(verdict).not.toBe('proved');
      expect(verdict).not.toBe('bounded');
      if (verdict === 'exhaustive') {
        expect(isSequential(p), `${p.id} is clocked but claims exhaustive`).toBe(false);
        expect(inputBits(p)).toBeLessThanOrEqual(14);
      }
    }
  });
});
