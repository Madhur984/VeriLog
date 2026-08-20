/**
 * Regression tests for netlistSim's register semantics, driven through the real
 * Yosys engine so the cell shapes are exactly what the browser sees.
 *
 * These cover the flip-flop flavours `prep` emits ($dff/$dffe/$adff/$adffe/
 * $sdff/$sdffe/$sdffce) — async reset in particular used to be parsed and then
 * silently ignored, so any design with `always @(posedge clk or posedge rst)`
 * never reset.
 */
import { describe, it, expect } from 'vitest';
import { buildSim, type NetlistSim, type Val } from './netlistSim';
import { synthesizeNode } from './testing/yosysNode';

/** Read a named output port as an unsigned value ('x' if any bit is unknown). */
function readPort(sim: NetlistSim, name: string, vals: Map<number, Val>): string {
  const p = sim.outputs.find((o) => o.name === name);
  if (!p) throw new Error(`no output '${name}'`);
  let acc = 0n;
  for (let i = 0; i < p.bits.length; i++) {
    const b = p.bits[i];
    const v: Val = typeof b === 'string' ? (b === '1' ? 1 : b === '0' ? 0 : null) : vals.get(b) ?? null;
    if (v === null) return 'x';
    if (v === 1) acc |= 1n << BigInt(i);
  }
  return acc.toString();
}

/**
 * Clock the design once per stimulus row and sample `port` AFTER each edge,
 * which is what a cycle-by-cycle grader observes.
 */
async function run(code: string, port: string, rows: Record<string, number>[]): Promise<string[]> {
  const { json, log } = await synthesizeNode(code);
  const sim = buildSim(json);
  if (!sim) throw new Error(`buildSim failed:\n${log.slice(-600)}`);
  let regs = sim.initRegs();
  const seen: string[] = [];
  for (const row of rows) {
    const drive = new Map<string, bigint>();
    for (const [k, v] of Object.entries(row)) drive.set(k, BigInt(v));
    regs = sim.nextRegs(drive, new Map(), regs);
    seen.push(readPort(sim, port, sim.settle(drive, new Map(), regs)));
  }
  return seen;
}

describe('netlistSim — flip-flop reset semantics', () => {
  it('applies an ASYNC reset ($adff) and releases it', async () => {
    const src = `
module top(input clk, input arst, input d, output reg q);
  always @(posedge clk or posedge arst)
    if (arst) q <= 1'b1; else q <= d;
endmodule`;
    // arst holds q at 1; once released q follows d.
    const out = await run(src, 'q', [
      { clk: 0, arst: 1, d: 0 },
      { clk: 0, arst: 1, d: 1 },
      { clk: 0, arst: 0, d: 0 },
      { clk: 0, arst: 0, d: 1 },
    ]);
    expect(out).toEqual(['1', '1', '0', '1']);
  }, 120_000);

  it('applies an ACTIVE-LOW async reset', async () => {
    const src = `
module top(input clk, input rst_n, input d, output reg q);
  always @(posedge clk or negedge rst_n)
    if (!rst_n) q <= 1'b0; else q <= d;
endmodule`;
    const out = await run(src, 'q', [
      { clk: 0, rst_n: 1, d: 1 },
      { clk: 0, rst_n: 0, d: 1 },
      { clk: 0, rst_n: 1, d: 1 },
    ]);
    expect(out).toEqual(['1', '0', '1']);
  }, 120_000);

  it('gives async reset priority over the clock enable ($adffe)', async () => {
    const src = `
module top(input clk, input arst, input en, input d, output reg q);
  always @(posedge clk or posedge arst)
    if (arst) q <= 1'b0;
    else if (en) q <= d;
endmodule`;
    const out = await run(src, 'q', [
      { clk: 0, arst: 0, en: 1, d: 1 },  // load 1
      { clk: 0, arst: 0, en: 0, d: 0 },  // hold 1
      { clk: 0, arst: 1, en: 0, d: 1 },  // reset wins even with en=0
    ]);
    expect(out).toEqual(['1', '1', '0']);
  }, 120_000);

  it('holds on enable-low and loads on enable-high ($dffe)', async () => {
    const src = `
module top(input clk, input en, input [3:0] d, output reg [3:0] q);
  always @(posedge clk) if (en) q <= d;
endmodule`;
    const out = await run(src, 'q', [
      { clk: 0, en: 1, d: 5 },
      { clk: 0, en: 0, d: 9 },
      { clk: 0, en: 1, d: 9 },
    ]);
    expect(out).toEqual(['5', '5', '9']);
  }, 120_000);

  it('resets a multi-bit register to a non-zero reset value', async () => {
    const src = `
module top(input clk, input arst, input [3:0] d, output reg [3:0] q);
  always @(posedge clk or posedge arst)
    if (arst) q <= 4'd10; else q <= d;
endmodule`;
    const out = await run(src, 'q', [
      { clk: 0, arst: 1, d: 3 },
      { clk: 0, arst: 0, d: 3 },
    ]);
    expect(out).toEqual(['10', '3']);
  }, 120_000);

  it('counts with a synchronous reset and enable', async () => {
    const src = `
module top #(parameter WIDTH = 4)(
  input clk, input rst, input en, output reg [WIDTH-1:0] count
);
  always @(posedge clk) begin
    if (rst) count <= 0;
    else if (en) count <= count + 1'b1;
  end
endmodule`;
    const out = await run(src, 'count', [
      { clk: 0, rst: 1, en: 0 },
      { clk: 0, rst: 0, en: 1 },
      { clk: 0, rst: 0, en: 1 },
      { clk: 0, rst: 0, en: 0 },
      { clk: 0, rst: 0, en: 1 },
      { clk: 0, rst: 1, en: 1 },
    ]);
    expect(out).toEqual(['0', '1', '2', '2', '3', '0']);
  }, 120_000);

  it('runs a Moore FSM through its state sequence', async () => {
    const src = `
module top(input clk, input rst_n, input in, output out);
  localparam S0=2'b00, S1=2'b01, S2=2'b10;
  reg [1:0] state, next_state;
  always @(posedge clk or negedge rst_n)
    if (!rst_n) state <= S0; else state <= next_state;
  always @(*) begin
    case (state)
      S0: next_state = in ? S1 : S0;
      S1: next_state = in ? S2 : S0;
      S2: next_state = in ? S2 : S0;
      default: next_state = S0;
    endcase
  end
  assign out = (state == S2);
endmodule`;
    const out = await run(src, 'out', [
      { clk: 0, rst_n: 0, in: 0 },  // S0
      { clk: 0, rst_n: 1, in: 1 },  // -> S1
      { clk: 0, rst_n: 1, in: 1 },  // -> S2, out=1
      { clk: 0, rst_n: 1, in: 1 },  // stay S2
      { clk: 0, rst_n: 1, in: 0 },  // -> S0
    ]);
    expect(out).toEqual(['0', '0', '1', '1', '0']);
  }, 120_000);
});

describe('netlistSim — memories', () => {
  it('writes and reads a synchronous single-port RAM', async () => {
    const src = `
module top(input clk, input we, input [1:0] addr, input [3:0] din, output reg [3:0] dout);
  reg [3:0] mem [0:3];
  always @(posedge clk) begin
    if (we) mem[addr] <= din;
    dout <= mem[addr];
  end
endmodule`;
    // write 5@0, 9@1, then read them back (sync read => data appears the cycle after the address)
    const out = await run(src, 'dout', [
      { clk: 0, we: 1, addr: 0, din: 5 },
      { clk: 0, we: 1, addr: 1, din: 9 },
      { clk: 0, we: 0, addr: 0, din: 0 },
      { clk: 0, we: 0, addr: 1, din: 0 },
    ]);
    // cycle 3 samples mem[0]=5, cycle 4 samples mem[1]=9
    expect(out.slice(2)).toEqual(['5', '9']);
  }, 120_000);

  it('reads an asynchronous-read register file', async () => {
    const src = `
module top(input clk, input we, input [1:0] waddr, input [3:0] din,
           input [1:0] raddr, output [3:0] dout);
  reg [3:0] mem [0:3];
  always @(posedge clk) if (we) mem[waddr] <= din;
  assign dout = mem[raddr];
endmodule`;
    const out = await run(src, 'dout', [
      { clk: 0, we: 1, waddr: 2, din: 7, raddr: 0 },
      { clk: 0, we: 0, waddr: 0, din: 0, raddr: 2 },
    ]);
    expect(out[1]).toBe('7');
  }, 120_000);
});
