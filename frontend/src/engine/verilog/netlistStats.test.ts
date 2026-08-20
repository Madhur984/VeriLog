/**
 * Netlist statistics, checked against the REAL Yosys engine rather than a
 * hand-written fixture — a stats reader that agrees with a mock but not with
 * the tool would be worse than none.
 */
import { describe, it, expect } from 'vitest';
import { synthesizeNode } from './testing/yosysNode';
import { analyzeNetlist } from './netlistStats';

const TIMEOUT = 120_000;

describe('analyzeNetlist', () => {
  it('counts the flip-flops in a register', async () => {
    const { json } = await synthesizeNode(`module r(
      input clk, input [7:0] d, output reg [7:0] q);
      always @(posedge clk) q <= d;
    endmodule`);
    const s = analyzeNetlist(json)!;
    expect(s).toBeTruthy();
    expect(s.top).toBe('r');
    // Eight bits of storage, however Yosys chooses to group them into cells.
    expect(s.flopBits).toBe(8);
    expect(s.totalCells).toBeGreaterThan(0);
  }, TIMEOUT);

  it('reports no storage for combinational logic', async () => {
    const { json } = await synthesizeNode(`module c(
      input [3:0] a, input [3:0] b, output [3:0] y);
      assign y = a & b;
    endmodule`);
    const s = analyzeNetlist(json)!;
    expect(s.flopBits).toBe(0);
    expect(s.memBits).toBe(0);
    expect(s.cells.length).toBeGreaterThan(0);
  }, TIMEOUT);

  it('lists ports with their real widths and directions', async () => {
    const { json } = await synthesizeNode(`module p(
      input clk, input [15:0] wide, output [2:0] small);
      assign small = wide[2:0] ^ {3{clk}};
    endmodule`);
    const s = analyzeNetlist(json)!;
    const by = new Map(s.ports.map((x) => [x.name, x]));
    expect(by.get('clk')).toMatchObject({ direction: 'input', width: 1 });
    expect(by.get('wide')).toMatchObject({ direction: 'input', width: 16 });
    expect(by.get('small')).toMatchObject({ direction: 'output', width: 3 });
  }, TIMEOUT);

  it('accounts for inferred memory bits', async () => {
    const { json } = await synthesizeNode(`module m(
      input clk, input we, input [3:0] addr, input [7:0] din, output reg [7:0] dout);
      reg [7:0] store [0:15];
      always @(posedge clk) begin
        if (we) store[addr] <= din;
        dout <= store[addr];
      end
    endmodule`);
    const s = analyzeNetlist(json)!;
    // 16 words x 8 bits, whether Yosys keeps it as $mem_v2 or expands to flops.
    expect(s.memBits + s.flopBits).toBeGreaterThanOrEqual(128);
  }, TIMEOUT);

  it('cell counts are sorted busiest-first and stable', async () => {
    const { json } = await synthesizeNode(`module s(
      input [7:0] a, input [7:0] b, output [7:0] y, output [7:0] z);
      assign y = a + b;
      assign z = a ^ b;
    endmodule`);
    const s = analyzeNetlist(json)!;
    for (let i = 1; i < s.cells.length; i++) {
      expect(s.cells[i - 1].count).toBeGreaterThanOrEqual(s.cells[i].count);
    }
    expect(s.totalCells).toBe(s.cells.reduce((n, c) => n + c.count, 0));
  }, TIMEOUT);

  it('returns null rather than throwing on unusable input', () => {
    expect(analyzeNetlist('')).toBeNull();
    expect(analyzeNetlist('not json')).toBeNull();
    expect(analyzeNetlist('{"modules":{}}')).toBeNull();
  });
});
