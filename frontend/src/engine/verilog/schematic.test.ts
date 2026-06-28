import { describe, it, expect } from 'vitest';
import { compileVerilog, type Bit } from './miniSim';
import { buildSchematic, evalSchematic, type Schematic } from './schematic';

function build(src: string): Schematic {
  const c = compileVerilog(src);
  if (!c.ok) throw new Error(c.error);
  return buildSchematic(c.module);
}

/** Read an output pin's value for a given input vector. */
function outVal(s: Schematic, name: string, inputs: Record<string, Bit>): Bit | null {
  const vals = evalSchematic(s, inputs);
  const pin = s.nodes.find((n) => n.kind === 'output' && n.label === name)!;
  return vals.get(pin.id) ?? null;
}

describe('schematic - structure', () => {
  it('a plain wire has no gates', () => {
    const s = build('module top(input a, output y); assign y = a; endmodule');
    expect(s.gateCount).toBe(0);
    expect(s.inputs).toEqual(['a']);
    expect(s.outputs).toEqual(['y']);
  });

  it('collapses ~(a & b) into a single NAND gate', () => {
    const s = build('module top(input a, input b, output y); assign y = ~(a & b); endmodule');
    expect(s.gateCount).toBe(1);
    expect(s.nodes.some((n) => n.kind === 'nand')).toBe(true);
  });

  it('half adder builds an XOR and an AND', () => {
    const s = build('module ha(input a, input b, output sum, output carry); assign sum = a ^ b; assign carry = a & b; endmodule');
    expect(s.nodes.some((n) => n.kind === 'xor')).toBe(true);
    expect(s.nodes.some((n) => n.kind === 'and')).toBe(true);
    expect(s.gateCount).toBe(2);
  });

  it('flattens an associative AND chain into one 3-input gate', () => {
    const s = build('module m(input a, input b, input c, output y); assign y = a & b & c; endmodule');
    const ands = s.nodes.filter((n) => n.kind === 'and');
    expect(ands).toHaveLength(1);
    expect(ands[0].ins).toHaveLength(3);
  });

  it('ternary becomes a mux node', () => {
    const s = build('module m(input a, input b, input s, output y); assign y = s ? b : a; endmodule');
    expect(s.nodes.some((n) => n.kind === 'mux')).toBe(true);
  });
});

describe('schematic - live evaluation matches the logic', () => {
  it('NAND truth table', () => {
    const s = build('module top(input a, input b, output y); assign y = ~(a & b); endmodule');
    expect(outVal(s, 'y', { a: 0, b: 0 })).toBe(1);
    expect(outVal(s, 'y', { a: 1, b: 0 })).toBe(1);
    expect(outVal(s, 'y', { a: 1, b: 1 })).toBe(0);
  });

  it('half adder sum/carry', () => {
    const s = build('module ha(input a, input b, output sum, output carry); assign sum = a ^ b; assign carry = a & b; endmodule');
    expect(outVal(s, 'sum', { a: 1, b: 1 })).toBe(0);
    expect(outVal(s, 'carry', { a: 1, b: 1 })).toBe(1);
    expect(outVal(s, 'sum', { a: 1, b: 0 })).toBe(1);
    expect(outVal(s, 'carry', { a: 1, b: 0 })).toBe(0);
  });

  it('mux routes a when s=0 and b when s=1', () => {
    const s = build('module m(input a, input b, input s, output y); assign y = s ? b : a; endmodule');
    expect(outVal(s, 'y', { a: 1, b: 0, s: 0 })).toBe(1);
    expect(outVal(s, 'y', { a: 1, b: 0, s: 1 })).toBe(0);
  });

  it('shared internal wire fans out correctly', () => {
    const s = build('module m(input a, input b, output y); wire w; assign w = a & b; assign y = ~w; endmodule');
    expect(outVal(s, 'y', { a: 1, b: 1 })).toBe(0);
    expect(outVal(s, 'y', { a: 0, b: 1 })).toBe(1);
  });
});
