/**
 * "It should run all the code" — held to account against a broad corpus.
 *
 * These drive the REAL pipeline (`runSandbox`, the same function the Run button
 * calls) through a spread of styles a learner actually writes: Verilog-1995 and
 * -2001 headers, combinational and clocked, FSMs, memories, parameters,
 * generate blocks, SystemVerilog `always_ff`. Each must produce a trace with
 * signals that are not all-x — synthesizing is not the same as simulating, and
 * a flat trace is the failure this suite exists to catch.
 */
import { describe, it, expect } from 'vitest';
import { synthesizeNode } from './testing/yosysNode';
import { runSandbox, type SynthLike } from './sandboxRun';

const TIMEOUT = 180_000;

/** Node-side synthesizer matching the browser worker's flattening behaviour. */
const synth = async (src: string): Promise<SynthLike> => {
  const r = await synthesizeNode(src, { flatten: true });
  return r.json
    ? { ok: true, json: r.json, diagnostics: r.diagnostics }
    : { ok: false, error: r.log.split('\n').filter(Boolean).slice(-1)[0] ?? 'failed', diagnostics: r.diagnostics };
};

const run = (design: string, tb = '', cycles = 16) => runSandbox(design, tb, cycles, synth);

/** A trace is only useful if something in it actually changes. */
const hasLiveSignals = (t: { signals: { values: (string | number | bigint | null)[] }[] }) =>
  t.signals.some((s) => new Set(s.values.map(String)).size > 1);

// ── the corpus ───────────────────────────────────────────────────────────────

const DESIGNS: { name: string; src: string }[] = [
  {
    name: 'Verilog-1995 half adder (the reported case)',
    src: `module top (sum, cout, a, b);
input a,b;
output sum,cout;
 assign sum = a^b;
 assign cout = a&b;
endmodule
`,
  },
  {
    name: 'Verilog-2001 ANSI ports',
    src: `module top(input a, input b, output sum, output cout);
  assign {cout, sum} = a + b;
endmodule
`,
  },
  {
    name: '4-bit ripple adder with carry',
    src: `module top(input [3:0] a, input [3:0] b, input cin, output [3:0] s, output cout);
  assign {cout, s} = a + b + cin;
endmodule
`,
  },
  {
    name: '4:1 mux with case',
    src: `module top(input [3:0] d, input [1:0] sel, output reg y);
  always @(*) case (sel)
    2'b00: y = d[0]; 2'b01: y = d[1]; 2'b10: y = d[2]; default: y = d[3];
  endcase
endmodule
`,
  },
  {
    name: '3-to-8 decoder',
    src: `module top(input [2:0] a, input en, output [7:0] y);
  assign y = en ? (8'b1 << a) : 8'b0;
endmodule
`,
  },
  {
    name: 'D flip-flop with async reset',
    src: `module top(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) if (rst) q <= 1'b0; else q <= d;
endmodule
`,
  },
  {
    name: 'up/down counter',
    src: `module top(input clk, input rst, input up, output reg [3:0] q);
  always @(posedge clk) if (rst) q <= 4'd0; else q <= up ? q + 1'b1 : q - 1'b1;
endmodule
`,
  },
  {
    name: 'shift register with parallel load',
    src: `module top(input clk, input rst, input load, input sin, input [7:0] din, output reg [7:0] q);
  always @(posedge clk)
    if (rst) q <= 8'd0; else if (load) q <= din; else q <= {q[6:0], sin};
endmodule
`,
  },
  {
    name: 'Moore FSM with parameters',
    src: `module top(input clk, input rst, input x, output reg z);
  localparam A = 2'd0, B = 2'd1, C = 2'd2;
  reg [1:0] state;
  always @(posedge clk) begin
    if (rst) state <= A;
    else case (state)
      A: state <= x ? B : A;
      B: state <= x ? C : A;
      C: state <= x ? C : A;
      default: state <= A;
    endcase
  end
  always @(*) z = (state == C);
endmodule
`,
  },
  {
    name: 'parameterised width counter',
    src: `module top #(parameter W = 6)(input clk, input rst, output reg [W-1:0] q);
  always @(posedge clk) if (rst) q <= {W{1'b0}}; else q <= q + 1'b1;
endmodule
`,
  },
  {
    name: 'synchronous RAM',
    src: `module top(input clk, input we, input [3:0] addr, input [7:0] din, output reg [7:0] dout);
  reg [7:0] mem [0:15];
  always @(posedge clk) begin
    if (we) mem[addr] <= din;
    dout <= mem[addr];
  end
endmodule
`,
  },
  {
    name: 'generate block',
    src: `module top(input [3:0] a, input [3:0] b, output [3:0] y);
  genvar i;
  generate for (i = 0; i < 4; i = i + 1) begin : g
    assign y[i] = a[i] ^ b[i];
  end endgenerate
endmodule
`,
  },
  {
    name: 'SystemVerilog always_ff / always_comb',
    src: `module top(input clk, input rst, input [3:0] a, output logic [3:0] q);
  logic [3:0] nxt;
  always_comb nxt = a + 4'd1;
  always_ff @(posedge clk) if (rst) q <= '0; else q <= nxt;
endmodule
`,
  },
  {
    name: 'function call',
    src: `module top(input [3:0] a, output [3:0] y);
  function [3:0] inv; input [3:0] v; inv = ~v; endfunction
  assign y = inv(a);
endmodule
`,
  },
  {
    name: 'wide combinational (forces sampled stimulus, not exhaustive)',
    src: `module top(input [15:0] a, input [15:0] b, output [15:0] y, output eq);
  assign y = a & b;
  assign eq = (a == b);
endmodule
`,
  },
  {
    name: 'active-low reset naming',
    src: `module top(input clk, input rst_n, input d, output reg q);
  always @(posedge clk) if (!rst_n) q <= 1'b0; else q <= d;
endmodule
`,
  },
  {
    name: 'tri-state style mux (no z retained after synthesis)',
    src: `module top(input sel, input a, input b, output y);
  assign y = sel ? a : b;
endmodule
`,
  },
];

describe('runSandbox over a corpus of ordinary Verilog', () => {
  for (const d of DESIGNS) {
    it(`runs: ${d.name}`, async () => {
      const r = await run(d.src);
      expect(r.error ?? '').toBe('');
      expect(r.ok).toBe(true);
      expect(r.trace).toBeTruthy();
      expect(r.trace!.signals.length).toBeGreaterThan(0);
      expect(r.trace!.cycles).toBeGreaterThan(0);
      // No cell the simulator cannot evaluate — that is what makes a trace flat.
      expect(r.unsupported ?? []).toEqual([]);
      expect(hasLiveSignals(r.trace!)).toBe(true);
    }, TIMEOUT);
  }
});

describe('testbench handling', () => {
  const HALF_ADDER = DESIGNS[0].src;
  const STARTER_TB = `module tb(input clk, input rst, output en, output [3:0] count);
  reg [3:0] tick;
  always @(posedge clk) begin
    if (rst) tick <= 4'd0; else tick <= tick + 1'b1;
  end
  assign en = (tick > 4'd2);
  top #(.W(4)) uut (.clk(clk), .rst(rst), .en(en), .count(count));
endmodule
`;

  it('still runs the design when a stale testbench does not fit it', async () => {
    // This is the exact situation that produced "Can't find object for defparam
    // `W`!" against design.v line 1 — a fixed design with the starter bench left
    // in place. It must produce a usable trace, not a dead end.
    const r = await run(HALF_ADDER, STARTER_TB);
    expect(r.ok).toBe(true);
    expect(r.soloDesign).toBe(true);
    expect(r.top).toBe('top');
    expect(hasLiveSignals(r.trace!)).toBe(true);
    // …and says why, naming the ports the bench reached for.
    const warn = r.diags.find((x) => /Simulated design\.v on its own/.test(x.message))!;
    expect(warn).toBeTruthy();
    expect(warn.message).toMatch(/\bW\b/);
    expect(warn.message).toMatch(/count|clk/);
  }, TIMEOUT);

  it('uses a matching testbench rather than falling back', async () => {
    const design = `module top(input clk, input rst, input en, output reg [3:0] count);
  always @(posedge clk) if (rst) count <= 4'd0; else if (en) count <= count + 1'b1;
endmodule
`;
    const tb = `module tb(input clk, input rst, output en, output [3:0] count);
  reg [3:0] tick;
  always @(posedge clk) tick <= rst ? 4'd0 : tick + 1'b1;
  assign en = (tick > 4'd2);
  top uut (.clk(clk), .rst(rst), .en(en), .count(count));
endmodule
`;
    const r = await run(design, tb, 24);
    expect(r.ok).toBe(true);
    expect(r.soloDesign).toBe(false);
    expect(r.top).toBe('tb');
    expect(hasLiveSignals(r.trace!)).toBe(true);
  }, TIMEOUT);

  it('reports a real design error instead of silently falling back', async () => {
    // The fallback must not paper over a broken DESIGN — there is nothing to
    // fall back to, and the user needs the syntax error.
    const broken = 'module top (a, b)\ninput a,b;\nendmodule\n';
    const r = await run(broken, STARTER_TB);
    expect(r.ok).toBe(false);
    expect(r.diags.some((d) => d.severity === 'error')).toBe(true);
  }, TIMEOUT);

  it('drives a combinational design exhaustively when the space is small', async () => {
    const r = await run(DESIGNS[0].src);
    // 2 one-bit inputs -> all four combinations.
    expect(r.trace!.cycles).toBe(4);
  }, TIMEOUT);

  it('samples instead of enumerating when the input space is large', async () => {
    const r = await run(DESIGNS[14].src, '', 12);
    // 33 input bits: enumerating would be 8.6 billion columns.
    expect(r.trace!.cycles).toBe(12);
  }, TIMEOUT);
});
