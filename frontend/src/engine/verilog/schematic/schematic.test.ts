/**
 * Schematic integrity harness.
 *
 * The load-bearing test here is the last one: it synthesizes every reference
 * solution in the bank and asserts that the skin has a symbol for every cell
 * type that appears. netlistsvg's behaviour for an unknown type is to fall
 * through to `s:type="generic"` and draw an unlabelled box — the render still
 * "succeeds", so nothing short of this check would notice. A new problem that
 * introduces, say, `$div` should break CI, not ship a schematic with a mystery
 * rectangle in it.
 *
 * Everything runs against real Yosys and real netlistsvg. A mocked netlist would
 * only prove that the post-processor agrees with the mock.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DOMParser } from '@xmldom/xmldom';
import { render as netlistsvgRender } from 'netlistsvg';
import { synthesizeNode } from '../testing/yosysNode';
import { VERILOG_V2_PROBLEMS } from '../../../data/verilog';
import { yosysToSvg, parseSrc, srcKey, busTickLayer } from './yosysToSvg';
import {
  checkCellSupport, skinAliases, netlistCellTypes, SIMULATED_CELL_TYPES,
  UnsupportedCellError,
} from './cellSupport';

const TIMEOUT = 300_000;
const HERE = (p: string) => resolve(__dirname, p);

const SKIN = readFileSync(HERE('judge.skin.svg'), 'utf8');
const parseXml = (s: string) => new DOMParser().parseFromString(s, 'image/svg+xml') as unknown as Document;

const renderNetlist = (netlist: unknown, strict = true) =>
  yosysToSvg(netlist, { skin: SKIN, render: netlistsvgRender, parseXml, strict });

const COUNTER = `module top(input clk, input rst, input en, input [3:0] d, output reg [3:0] q, output eq);
  always @(posedge clk) if (rst) q <= 4'd0; else if (en) q <= d + 4'd1;
  assign eq = (q == d);
endmodule
`;

describe('the skin', () => {
  it('is well-formed XML', () => {
    const doc = parseXml(SKIN);
    expect(doc.getElementsByTagName('parsererror').length).toBe(0);
    expect(doc.documentElement.tagName).toBe('svg');
  });

  it('declares exactly one generic fallback', () => {
    // More than one and netlistsvg's fallback lookup becomes order-dependent.
    // Counted from the parsed DOM, not the raw text — the file discusses
    // s:type="generic" in a comment, which a regex over the source would count.
    const doc = parseXml(SKIN);
    const generics = Array.from(doc.documentElement.getElementsByTagName('g'))
      .filter((g) => (g as Element).getAttribute('s:type') === 'generic');
    expect(generics).toHaveLength(1);
  });

  it('has a symbol for every cell type netlistSim can evaluate', () => {
    const aliases = skinAliases(SKIN);
    const missing = SIMULATED_CELL_TYPES.filter((t) => !aliases.has(t));
    expect(missing).toEqual([]);
  });

  it('declares no alias twice', () => {
    const all = [...SKIN.matchAll(/<s:alias\s+val="([^"]+)"/g)].map((m) => m[1]);
    const dupes = all.filter((v, i) => all.indexOf(v) !== i);
    expect(dupes).toEqual([]);
  });
});

describe('the simulator/skin contract', () => {
  // cellSupport.ts hand-lists what netlistSim can evaluate, because netlistSim
  // dispatches through a switch and two regexes with no exported manifest. That
  // copy is only trustworthy if it is checked against the real source.
  const SIM_SRC = readFileSync(resolve(__dirname, '../netlistSim.ts'), 'utf8');

  it('lists every cell type netlistSim actually switches on', () => {
    const cases = new Set(
      [...SIM_SRC.matchAll(/case\s+'(\$[A-Za-z_0-9]+)'/g)].map((m) => m[1]),
    );
    expect(cases.size).toBeGreaterThan(20);
    const missing = [...cases].filter((t) => !SIMULATED_CELL_TYPES.includes(t));
    expect(missing, 'netlistSim handles these but cellSupport does not list them').toEqual([]);
  });

  it('covers the flip-flop family netlistSim recognises by regex', () => {
    // DFF_RE = /^\$(dff|dffe|adff|…)$/i — pull the alternation straight out.
    const m = /const DFF_RE = \/\^\\\$\(([^)]+)\)/.exec(SIM_SRC);
    expect(m, 'DFF_RE not found — netlistSim.ts changed shape').toBeTruthy();
    const family = m![1].split('|').map((s) => `$${s}`);
    expect(family.length).toBeGreaterThan(8);
    const missing = family.filter((t) => !SIMULATED_CELL_TYPES.includes(t));
    expect(missing, 'netlistSim simulates these flops but cellSupport omits them').toEqual([]);
  });

  it('every simulatable type is also drawable — no silent generic boxes', () => {
    const aliases = skinAliases(SKIN);
    expect(SIMULATED_CELL_TYPES.filter((t) => !aliases.has(t))).toEqual([]);
  });
});

describe('cellSupport', () => {
  it('flags a built-in with no symbol', () => {
    const netlist = { modules: { top: { cells: { c: { type: '$fancy_new_thing' } } } } };
    const r = checkCellSupport(netlist, SKIN);
    expect(r.unsupported).toEqual(['$fancy_new_thing']);
  });

  it('does not flag user sub-modules, which are legitimately black boxes', () => {
    const netlist = { modules: { top: { cells: { u: { type: '\\my_adder' } } } } };
    expect(checkCellSupport(netlist, SKIN).unsupported).toEqual([]);
  });

  it('reads cell types out of every module, not just the top', () => {
    const netlist = {
      modules: {
        top: { cells: { a: { type: '$add' } } },
        sub: { cells: { b: { type: '$mux' } } },
      },
    };
    expect(netlistCellTypes(netlist)).toEqual(['$add', '$mux']);
  });
});

describe('parseSrc', () => {
  it('parses the line.col-line.col form Yosys emits', () => {
    expect(parseSrc('design.v:12.3-14.8')).toMatchObject({
      file: 'design.v', line: 12, col: 3, endLine: 14, endCol: 8,
    });
  });
  it('parses a bare line', () => {
    expect(parseSrc('testbench.v:4')).toMatchObject({ file: 'testbench.v', line: 4 });
  });
  it('takes the first location when Yosys lists several', () => {
    expect(parseSrc('design.v:2.1-2.9,design.v:7.1-7.4')?.line).toBe(2);
  });
  it('returns undefined rather than guessing', () => {
    expect(parseSrc(undefined)).toBeUndefined();
    expect(parseSrc('')).toBeUndefined();
    expect(parseSrc('not a location')).toBeUndefined();
  });
});

describe('yosysToSvg', () => {
  it('renders a real netlist with addressable cells and nets', async () => {
    const { json } = await synthesizeNode(COUNTER);
    const r = await renderNetlist(JSON.parse(json));

    expect(r.svg).toContain('<svg');
    expect(r.width).toBeGreaterThan(0);
    expect(r.height).toBeGreaterThan(0);
    // A viewBox is what makes fit-to-window possible; netlistsvg omits it.
    expect(r.svg).toMatch(/viewBox="0 0 \d/);

    expect(r.cellIndex.size).toBeGreaterThan(0);
    expect(r.netIndex.size).toBeGreaterThan(0);
    expect(r.svg).toContain('data-cell-id=');
    expect(r.svg).toContain('data-net-id=');
  }, TIMEOUT);

  it('indexes only real Yosys cells, not netlistsvg scaffolding', async () => {
    const { json } = await synthesizeNode(COUNTER);
    const netlist = JSON.parse(json);
    const r = await renderNetlist(netlist);
    const real = new Set(Object.keys(netlist.modules.top.cells));
    for (const id of r.cellIndex.keys()) expect(real.has(id)).toBe(true);
    // Ports and constants are still clickable in the DOM even though unindexed.
    expect(r.svg).toContain('data-cell-id="clk"');
  }, TIMEOUT);

  it('preserves Yosys src attributes and builds the reverse index', async () => {
    const { json } = await synthesizeNode(COUNTER);
    const r = await renderNetlist(JSON.parse(json));

    const withSrc = [...r.cellIndex.values()].filter((c) => c.src);
    expect(withSrc.length).toBeGreaterThan(0);
    expect(r.svg).toContain('data-src-file="design.v"');

    // The counter's adder is on line 2; the comparator on line 3.
    expect(r.srcIndex.get(srcKey('design.v', 2))?.length).toBeGreaterThan(0);
    const line3 = r.srcIndex.get(srcKey('design.v', 3)) ?? [];
    expect(line3.some((id) => r.cellIndex.get(id)?.type === '$eq')).toBe(true);
  }, TIMEOUT);

  it('resolves declared signal names onto nets, and records bus widths', async () => {
    const { json } = await synthesizeNode(COUNTER);
    const r = await renderNetlist(JSON.parse(json));

    const named = [...r.netIndex.values()].filter((n) => n.name);
    const names = named.map((n) => n.name);
    expect(names).toContain('q');
    expect(names).toContain('clk');

    const q = named.find((n) => n.name === 'q')!;
    expect(q.bits.length).toBe(4);         // 4-bit bus
    const clk = named.find((n) => n.name === 'clk')!;
    expect(clk.bits.length).toBe(1);
    // Anchors must be real coordinates — the value overlay positions on them.
    expect(Number.isFinite(q.x) && Number.isFinite(q.y)).toBe(true);
  }, TIMEOUT);

  it('throws on an undrawable built-in instead of rendering a blank box', async () => {
    const netlist = { modules: { top: { cells: { c: { type: '$not_a_real_cell' } } } } };
    await expect(renderNetlist(netlist)).rejects.toBeInstanceOf(UnsupportedCellError);
  });

  it('can be asked to render anyway, for a best-effort diagram', async () => {
    const netlist = {
      modules: {
        top: {
          ports: { a: { direction: 'input', bits: [2] }, y: { direction: 'output', bits: [3] } },
          cells: { c: { type: '$not_a_real_cell', connections: { A: [2], Y: [3] } } },
        },
      },
    };
    const r = await renderNetlist(netlist, false);
    expect(r.svg).toContain('<svg');
  });

  it('emits a bus tick only for multi-bit nets', async () => {
    const { json } = await synthesizeNode(COUNTER);
    const r = await renderNetlist(JSON.parse(json));
    const layer = busTickLayer(r.netIndex);
    const ticks = (layer.match(/class="bus-tick"/g) ?? []).length;
    const buses = [...r.netIndex.values()].filter((n) => n.bits.length > 1).length;
    expect(ticks).toBe(buses);
    expect(buses).toBeGreaterThan(0);
  }, TIMEOUT);
});

/**
 * The integrity harness. This is the check the toolchain doc's "every cell type
 * the bank uses has a symbol" requirement is built around.
 */
describe('the whole problem bank', () => {
  it('uses no cell type the skin cannot draw', async () => {
    const aliases = skinAliases(SKIN);
    const offenders = new Map<string, string[]>();
    const seen = new Set<string>();

    for (const p of VERILOG_V2_PROBLEMS) {
      // Both shapes the app renders: the judge does not flatten, the sandbox does.
      for (const flatten of [false, true]) {
        const { json } = await synthesizeNode(p.solution, { flatten });
        if (!json) continue;
        for (const t of netlistCellTypes(JSON.parse(json))) {
          seen.add(t);
          if (t.startsWith('$') && !aliases.has(t)) {
            const list = offenders.get(t) ?? [];
            if (!list.includes(p.id)) list.push(p.id);
            offenders.set(t, list);
          }
        }
      }
    }

    // Guard against the test silently passing because nothing synthesized.
    expect(seen.size).toBeGreaterThan(10);
    expect(Object.fromEntries(offenders)).toEqual({});
  }, TIMEOUT);

  it('renders a representative problem from every track without throwing', async () => {
    const byTrack = new Map<string, typeof VERILOG_V2_PROBLEMS[number]>();
    for (const p of VERILOG_V2_PROBLEMS) if (!byTrack.has(p.track)) byTrack.set(p.track, p);
    expect(byTrack.size).toBeGreaterThan(4);

    for (const p of byTrack.values()) {
      const { json } = await synthesizeNode(p.solution);
      const netlist = JSON.parse(json);
      const r = await renderNetlist(netlist);
      expect(r.svg, `${p.id} produced no svg`).toContain('<svg');
      // Cell count is only asserted when the netlist HAS cells: a pure wiring
      // problem (`assign y = a;`) optimizes down to zero cells and is still a
      // perfectly valid schematic — ports joined by a wire.
      const cellsInNetlist = Object.values(
        netlist.modules as Record<string, { cells?: object }>,
      ).reduce((n, m) => n + Object.keys(m.cells ?? {}).length, 0);
      if (cellsInNetlist > 0) {
        expect(r.cellIndex.size, `${p.id} has cells but indexed none`).toBeGreaterThan(0);
      }
    }
  }, TIMEOUT);
});
