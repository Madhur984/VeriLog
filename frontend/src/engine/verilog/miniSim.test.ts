import { describe, it, expect } from 'vitest';
import { compileVerilog, simulate, type Bit } from './miniSim';

/** Compile + run a module against every input combination, return rows. */
function truthTable(src: string, inputs: string[]) {
  const c = compileVerilog(src);
  if (!c.ok) throw new Error(c.error);
  const rows: { in: Record<string, Bit>; out: Record<string, Bit> }[] = [];
  for (let m = 0; m < (1 << inputs.length); m++) {
    const inp: Record<string, Bit> = {};
    inputs.forEach((name, i) => { inp[name] = ((m >> (inputs.length - 1 - i)) & 1) as Bit; });
    rows.push({ in: inp, out: simulate(c.ok ? c.module : (null as never), inp) });
  }
  return rows;
}

describe('miniSim — basic combinational', () => {
  it('AND via assign (ANSI header)', () => {
    const rows = truthTable(
      `module and_gate(input a, input b, output y); assign y = a & b; endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.y)).toEqual([0, 0, 0, 1]);
  });

  it('AND via gate primitive', () => {
    const rows = truthTable(
      `module g(input a, input b, output y); and u1(y, a, b); endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.y)).toEqual([0, 0, 0, 1]);
  });

  it('NOT', () => {
    const rows = truthTable(`module n(input a, output y); assign y = ~a; endmodule`, ['a']);
    expect(rows.map((r) => r.out.y)).toEqual([1, 0]);
  });

  it('XOR (non-ANSI header)', () => {
    const rows = truthTable(
      `module x(a, b, y); input a, b; output y; assign y = a ^ b; endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.y)).toEqual([0, 1, 1, 0]);
  });

  it('NAND via gate', () => {
    const rows = truthTable(`module nd(input a, input b, output y); nand(y, a, b); endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.y)).toEqual([1, 1, 1, 0]);
  });

  it('XNOR via ~^', () => {
    const rows = truthTable(`module xn(input a, input b, output y); assign y = a ~^ b; endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.y)).toEqual([1, 0, 0, 1]);
  });

  it('2:1 mux with ternary + intermediate wire', () => {
    const rows = truthTable(
      `module mux2(input a, input b, input s, output y);
         wire w; assign w = ~s; assign y = s ? b : a; endmodule`, ['a', 'b', 's']);
    // y = s ? b : a
    expect(rows.map((r) => r.out.y)).toEqual([0, 0, 0, 1, 1, 0, 1, 1]);
  });

  it('half adder — two outputs', () => {
    const rows = truthTable(
      `module ha(input a, input b, output sum, output carry);
         assign sum = a ^ b; assign carry = a & b; endmodule`, ['a', 'b']);
    expect(rows.map((r) => r.out.sum)).toEqual([0, 1, 1, 0]);
    expect(rows.map((r) => r.out.carry)).toEqual([0, 0, 0, 1]);
  });

  it('respects operator precedence (a | b & c == a | (b & c))', () => {
    const rows = truthTable(
      `module p(input a, input b, input c, output y); assign y = a | b & c; endmodule`, ['a', 'b', 'c']);
    const expected = rows.map((r) => (r.in.a | (r.in.b & r.in.c)));
    expect(rows.map((r) => r.out.y)).toEqual(expected);
  });
});

describe('miniSim — error reporting', () => {
  it('rejects always blocks', () => {
    const c = compileVerilog(`module m(input a, output y); always @(*) y = a; endmodule`);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.error).toMatch(/always/i);
  });
  it('flags unknown signal', () => {
    const c = compileVerilog(`module m(input a, output y); assign y = a & z; endmodule`);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.error).toMatch(/unknown signal 'z'/i);
  });
  it('flags undriven output', () => {
    const c = compileVerilog(`module m(input a, output y); endmodule`);
    expect(c.ok).toBe(false);
    if (!c.ok) expect(c.error).toMatch(/never assigned/i);
  });
  it('flags missing module', () => {
    const c = compileVerilog(`assign y = a;`);
    expect(c.ok).toBe(false);
  });
});
