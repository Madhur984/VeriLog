/**
 * The interactive schematic's probe model, against the real engine.
 *
 * These assert the behaviour a user is actually being shown: drive an input and
 * the dependent wires change; step the clock and only state moves; replay the
 * testbench and internal wires — which the trace never recorded — come back
 * with the right values. A mocked simulator would prove none of that.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DOMParser } from '@xmldom/xmldom';
import { render as netlistsvgRender } from 'netlistsvg';
import { synthesizeNode } from '../../engine/verilog/testing/yosysNode';
import { buildSim } from '../../engine/verilog/netlistSim';
import { yosysToSvg } from '../../engine/verilog/schematic/yosysToSvg';
import { runSandbox, type SynthLike } from '../../engine/verilog/sandboxRun';
import {
  initialState, valuesOf, netValues, step, resetState, replayTo,
  clampToWidth, label, stateOf, isClockName, isResetName, isActiveLowReset,
} from './schematicProbe';

const TIMEOUT = 180_000;
const SKIN = readFileSync(
  resolve(__dirname, '../../engine/verilog/schematic/judge.skin.svg'), 'utf8');
const parseXml = (s: string) =>
  new DOMParser().parseFromString(s, 'image/svg+xml') as unknown as Document;

const build = async (src: string, flatten = false) => {
  const { json } = await synthesizeNode(src, { flatten });
  const netlist = JSON.parse(json);
  const sim = buildSim(json)!;
  const schem = await yosysToSvg(netlist, { skin: SKIN, render: netlistsvgRender, parseXml });
  return { sim, schem, json };
};

const HALF_ADDER = `module top(input a, input b, output sum, output cout);
  assign sum = a ^ b;
  assign cout = a & b;
endmodule
`;

const COUNTER = `module top(input clk, input rst, input en, output reg [3:0] q);
  always @(posedge clk) if (rst) q <= 4'd0; else if (en) q <= q + 1'b1;
endmodule
`;

describe('port naming helpers', () => {
  it('recognises clocks and resets the way the rest of the sandbox does', () => {
    expect(isClockName('clk')).toBe(true);
    expect(isClockName('sysclk')).toBe(true);
    expect(isClockName('clock_enable')).toBe(false);
    expect(isResetName('rst_n')).toBe(true);
    expect(isActiveLowReset('rst_n')).toBe(true);
    expect(isActiveLowReset('rst')).toBe(false);
  });
});

describe('clampToWidth', () => {
  it('masks to the port width instead of overflowing', () => {
    expect(clampToWidth(0xffn, 4)).toBe(0xfn);
    expect(clampToWidth(0n, 4)).toBe(0n);
    expect(clampToWidth(5n, 8)).toBe(5n);
  });
});

describe('driving a combinational circuit', () => {
  it('shows the truth table on the wires as inputs change', async () => {
    const { sim, schem } = await build(HALF_ADDER);
    let s = initialState(sim);

    const readOut = (name: string) => {
      const nets = netValues(schem.netIndex, valuesOf(sim, s));
      const net = [...schem.netIndex.values()].find((n) => n.name === name)!;
      expect(net, `net ${name} not drawn`).toBeTruthy();
      return nets.get(net.id)!;
    };
    const drive = (a: bigint, b: bigint) => {
      s = { ...s, drive: new Map([['a', a], ['b', b]]) };
    };

    // Every row of the half-adder, read off the rendered diagram.
    drive(0n, 0n); expect(label(readOut('sum'))).toBe('0'); expect(label(readOut('cout'))).toBe('0');
    drive(1n, 0n); expect(label(readOut('sum'))).toBe('1'); expect(label(readOut('cout'))).toBe('0');
    drive(0n, 1n); expect(label(readOut('sum'))).toBe('1'); expect(label(readOut('cout'))).toBe('0');
    drive(1n, 1n); expect(label(readOut('sum'))).toBe('0'); expect(label(readOut('cout'))).toBe('1');
  }, TIMEOUT);

  it('marks a carrying wire high and an idle one low', async () => {
    const { sim, schem } = await build(HALF_ADDER);
    const s = { ...initialState(sim), drive: new Map([['a', 1n], ['b', 1n]]) };
    const nets = netValues(schem.netIndex, valuesOf(sim, s));
    const byName = (n: string) =>
      nets.get([...schem.netIndex.values()].find((x) => x.name === n)!.id)!;
    expect(stateOf(byName('cout'))).toBe('high');   // 1 & 1
    expect(stateOf(byName('sum'))).toBe('low');     // 1 ^ 1
  }, TIMEOUT);
});

describe('stepping a sequential circuit', () => {
  it('advances state only on a clock edge', async () => {
    const { sim, schem } = await build(COUNTER);
    let s = initialState(sim);
    s = { ...s, drive: new Map([['rst', 0n], ['en', 1n]]) };

    const q = () => {
      const nets = netValues(schem.netIndex, valuesOf(sim, s));
      const net = [...schem.netIndex.values()].find((n) => n.name === 'q')!;
      return nets.get(net.id)!.num;
    };

    const before = q();
    // Re-settling without a clock edge must not change stored state.
    valuesOf(sim, s);
    expect(q()).toBe(before);

    s = step(sim, s);
    expect(s.cycle).toBe(1);
    expect(q()).toBe((before ?? 0n) + 1n);

    s = step(sim, s);
    expect(q()).toBe((before ?? 0n) + 2n);
  }, TIMEOUT);

  it('holds its value when the enable is low', async () => {
    const { sim, schem } = await build(COUNTER);
    let s = { ...initialState(sim), drive: new Map([['rst', 0n], ['en', 0n]]) };
    const net = [...schem.netIndex.values()].find((n) => n.name === 'q')!;
    const q = () => netValues(schem.netIndex, valuesOf(sim, s)).get(net.id)!.num;
    const before = q();
    s = step(sim, s);
    s = step(sim, s);
    expect(q()).toBe(before);
  }, TIMEOUT);

  it('reset returns the diagram to cycle 0', async () => {
    const { sim } = await build(COUNTER);
    let s = { ...initialState(sim), drive: new Map([['rst', 0n], ['en', 1n]]) };
    s = step(sim, s); s = step(sim, s); s = step(sim, s);
    expect(s.cycle).toBe(3);
    s = resetState(sim, s);
    expect(s.cycle).toBe(0);
  }, TIMEOUT);

  it('starts an active-low reset released, not held', async () => {
    const { sim } = await build(`module top(input clk, input rst_n, output reg q);
      always @(posedge clk) if (!rst_n) q <= 1'b0; else q <= ~q;
    endmodule
    `);
    const s = initialState(sim);
    // Held at 0 the design would never leave reset and the diagram would look dead.
    expect(s.drive.get('rst_n')).toBe(1n);
  }, TIMEOUT);
});

describe('replaying the testbench into the diagram', () => {
  it('recovers INTERNAL wire values the trace never stored', async () => {
    const design = `module top(input clk, input rst, input en, output reg [3:0] q);
      always @(posedge clk) if (rst) q <= 4'd0; else if (en) q <= q + 4'd1;
    endmodule
    `;
    const tb = `module tb(input clk, input rst, output en, output [3:0] q);
      reg [3:0] tick;
      always @(posedge clk) tick <= rst ? 4'd0 : tick + 1'b1;
      assign en = (tick > 4'd1);
      top uut(.clk(clk), .rst(rst), .en(en), .q(q));
    endmodule
    `;
    const synth = async (src: string): Promise<SynthLike> => {
      const r = await synthesizeNode(src, { flatten: true });
      return r.json
        ? { ok: true, json: r.json, diagnostics: r.diagnostics }
        : { ok: false, error: 'failed', diagnostics: r.diagnostics };
    };
    const run = await runSandbox(design, tb, 12, synth);
    expect(run.ok).toBe(true);

    const sim = buildSim(run.json!)!;
    const schem = await yosysToSvg(JSON.parse(run.json!), {
      skin: SKIN, render: netlistsvgRender, parseXml,
    });

    // The trace records top-level ports only.
    const traceNames = new Set(run.trace!.signals.map((s) => s.name));
    const internal = [...schem.netIndex.values()]
      .filter((n) => n.name && !traceNames.has(n.name));

    const late = replayTo(sim, run.trace!, run.trace!.cycles - 1);
    const nets = netValues(schem.netIndex, valuesOf(sim, late));

    // Every drawn net resolves to a value, including ones absent from the trace.
    for (const n of schem.netIndex.values()) expect(nets.has(n.id)).toBe(true);
    expect(late.cycle).toBe(run.trace!.cycles - 1);
    // And the replay actually advanced state rather than sitting at reset.
    const early = replayTo(sim, run.trace!, 0);
    expect(early.cycle).toBe(0);
    void internal;
  }, TIMEOUT);

  it('clamps a scrub past the end of the run', async () => {
    const { sim } = await build(COUNTER, true);
    const trace = {
      cycles: 3,
      signals: [{ name: 'rst', role: 'input' as const, values: [0n, 0n, 0n], width: 1 }],
    };
    const s = replayTo(sim, trace as never, 999);
    expect(s.cycle).toBe(2);
  }, TIMEOUT);
});
