import { describe, it, expect } from 'vitest';
import { compileSeq, stepSeq } from './seqSim';
import type { Bit } from './miniSim';

/** Run a flip-flop over a vector sequence, returning q per cycle. */
function run(src: string, vectors: Record<string, Bit>[]): Record<string, Bit>[] {
  const c = compileSeq(src);
  if (!c.ok) throw new Error(c.error);
  let s: Record<string, Bit> = {};
  for (const r of c.module.regs) s[r] = 0;
  const out: Record<string, Bit>[] = [];
  for (const v of vectors) { s = stepSeq(c.module, s, v); out.push({ ...s }); }
  return out;
}

describe('seqSim', () => {
  it('D flip-flop registers d on each edge', () => {
    const src = `module top(input clk, input d, output reg q); always @(posedge clk) q <= d; endmodule`;
    expect(run(src, [{ d: 1 }, { d: 0 }, { d: 1 }]).map((o) => o.q)).toEqual([1, 0, 1]);
  });

  it('T flip-flop toggles on t=1, holds on t=0', () => {
    const src = `module top(input clk, input t, output reg q); always @(posedge clk) q <= q ^ t; endmodule`;
    expect(run(src, [{ t: 1 }, { t: 1 }, { t: 0 }, { t: 1 }]).map((o) => o.q)).toEqual([1, 0, 0, 1]);
  });

  it('D flip-flop with async reset forces q=0 while rst=1', () => {
    const src = `module top(input clk, input rst, input d, output reg q);
      always @(posedge clk or posedge rst) if (rst) q <= 1'b0; else q <= d; endmodule`;
    const c = compileSeq(src);
    expect(c.ok).toBe(true);
    if (c.ok) expect(c.module.reset).toBe('rst');
    expect(run(src, [{ rst: 0, d: 1 }, { rst: 1, d: 1 }, { rst: 0, d: 1 }]).map((o) => o.q)).toEqual([1, 0, 1]);
  });

  it('JK flip-flop: set / hold / reset / toggle', () => {
    const src = `module top(input clk, input j, input k, output reg q);
      always @(posedge clk) q <= (j & ~q) | (~k & q); endmodule`;
    // q starts 0: set(1,0)->1, hold(0,0)->1, reset(0,1)->0, toggle(1,1)->1
    expect(run(src, [{ j: 1, k: 0 }, { j: 0, k: 0 }, { j: 0, k: 1 }, { j: 1, k: 1 }]).map((o) => o.q)).toEqual([1, 1, 0, 1]);
  });

  it('rejects an empty always block (unfinished starter)', () => {
    const src = `module top(input clk, input d, output reg q); always @(posedge clk) begin end endmodule`;
    expect(compileSeq(src).ok).toBe(false);
  });

  it('requires a clocked signal to be an output reg', () => {
    const src = `module top(input clk, input d, output q); always @(posedge clk) q <= d; endmodule`;
    expect(compileSeq(src).ok).toBe(false);
  });
});
