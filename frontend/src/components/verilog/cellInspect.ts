/**
 * What a cell on the schematic actually IS — the model behind double-clicking it.
 *
 * The diagram can only ever show shape and connectivity. The questions a learner
 * asks next ("what does this box compute?", "why is this wire x?", "which line of
 * my Verilog made it?") need the netlist, not the picture. This module answers
 * them from the same Yosys JSON the schematic and the simulator were both built
 * from, so an inspector panel can never disagree with the wires next to it.
 *
 * The one design decision worth stating: truth tables are not hand-written per
 * gate type. They are produced by building a ONE-CELL netlist and running the
 * real `netlistSim` over every input combination. A hand-written table for
 * `$reduce_xnor` with A_SIGNED set is a second implementation of the semantics,
 * and second implementations drift. This one is correct by construction, and it
 * covers every type the simulator models without enumerating them here.
 */
import { buildSim, busValue, type Val } from '../../engine/verilog/netlistSim';
import { parseSrc, type SrcLoc } from '../../engine/verilog/schematic/yosysToSvg';

type Bitref = number | string;

interface RawCell {
  type?: string;
  parameters?: Record<string, string | number>;
  port_directions?: Record<string, string>;
  connections?: Record<string, Bitref[]>;
  attributes?: Record<string, unknown>;
}
interface RawPort { direction?: string; bits?: Bitref[] }
interface RawModule {
  attributes?: Record<string, unknown>;
  ports?: Record<string, RawPort>;
  cells?: Record<string, RawCell>;
  netnames?: Record<string, { bits?: Bitref[]; hide_name?: number }>;
}
export interface RawNetlist { modules?: Record<string, RawModule> }

export type Dir = 'input' | 'output' | 'inout';

export interface PortDetail {
  name: string;
  dir: Dir;
  width: number;
  bits: Bitref[];
  /** The schematic's net identity, when every bit is a real net. */
  netId?: string;
  /** Declared signal name, when the connected net is a named wire. */
  netName?: string;
}

export interface TruthTable {
  inputs: { name: string; width: number }[];
  outputs: { name: string; width: number }[];
  /** One row per input combination; values already formatted for display. */
  rows: { in: string[]; out: string[] }[];
  /** True when the input space was larger than the row cap and was cut short. */
  truncated: boolean;
}

export interface CellDetail {
  kind: 'cell';
  id: string;
  type: string;
  /** Human name for the symbol — "AND gate", "2-to-1 multiplexer". */
  title: string;
  /** One sentence on what the cell does. */
  blurb: string;
  /** Position in the module's cell list, 1-based, and the total. */
  index: number;
  total: number;
  params: [string, string][];
  ports: PortDetail[];
  src?: SrcLoc;
  /** Set when this cell's type is another module in the same netlist. */
  submodule?: string;
  truth?: TruthTable;
  /** Why there is no truth table, when there isn't one. */
  truthNote?: string;
}

export interface NetDetail {
  kind: 'net';
  id: string;
  name?: string;
  bits: Bitref[];
  width: number;
  /** Cell (or port) that drives this net. */
  driver?: { id: string; type: string; port: string };
  /** Cells that read it. */
  loads: { id: string; type: string; port: string }[];
  /** Set when the net is a top-level module port. */
  topPort?: { name: string; dir: Dir };
}

export type Detail = CellDetail | NetDetail;

// ── netlist access ──────────────────────────────────────────────────────────

export function parseNetlist(json: string | undefined | null): RawNetlist | null {
  if (!json) return null;
  try { return JSON.parse(json) as RawNetlist; } catch { return null; }
}

const isTopAttr = (m: RawModule): boolean => {
  const t = m.attributes?.top;
  return t === 1 || t === '1' || (typeof t === 'string' && /1$/.test(t));
};

/** The module the schematic drew: Yosys's `top`, else the first one. */
export function pickModule(nl: RawNetlist, name?: string): [string, RawModule] | null {
  const mods = nl.modules ?? {};
  const names = Object.keys(mods);
  if (!names.length) return null;
  if (name && mods[name]) return [name, mods[name]];
  const top = names.find((n) => isTopAttr(mods[n])) ?? names[0];
  return [top, mods[top]];
}

/**
 * Extract one module as a standalone, top-marked netlist.
 *
 * This is how drilling into a submodule works: rather than teaching the renderer
 * to draw a module other than the top one, we hand it a netlist whose only
 * module IS the one we want. netlistsvg, `buildSim` and `yosysToSvg` then all
 * agree on what "top" means without any of them growing a mode flag.
 */
export function submoduleNetlist(nl: RawNetlist, name: string): string | null {
  const mod = nl.modules?.[name];
  if (!mod) return null;
  return JSON.stringify({
    modules: { [name]: { ...mod, attributes: { ...(mod.attributes ?? {}), top: 1 } } },
  });
}

/** Module names that are instantiable — i.e. could appear as a cell type. */
export function moduleNames(nl: RawNetlist): string[] {
  return Object.keys(nl.modules ?? {});
}

// ── port direction ──────────────────────────────────────────────────────────

/**
 * Yosys omits `port_directions` on its built-in cells. The convention it does
 * guarantee is the port NAME: `Y`, `Q` and `X` are outputs on every `$`-cell,
 * everything else is an input. Same rule netlistSim uses to build its driver
 * map, so the inspector and the simulator can never disagree about which way a
 * pin faces.
 */
export function dirOf(cell: RawCell, port: string): Dir {
  const d = cell.port_directions?.[port];
  if (d === 'input' || d === 'output' || d === 'inout') return d;
  return ['Y', 'Q', 'X', 'RD_DATA'].includes(port) ? 'output' : 'input';
}

// ── human descriptions ──────────────────────────────────────────────────────

interface TypeDesc { title: string; blurb: string }

const DESCRIPTIONS: Record<string, TypeDesc> = {
  $and: { title: 'AND', blurb: 'Bitwise AND: each output bit is 1 only when both input bits are 1.' },
  $or: { title: 'OR', blurb: 'Bitwise OR: each output bit is 1 when either input bit is 1.' },
  $xor: { title: 'XOR', blurb: 'Bitwise exclusive-OR: each output bit is 1 when the input bits differ.' },
  $xnor: { title: 'XNOR', blurb: 'Bitwise exclusive-NOR: each output bit is 1 when the input bits match.' },
  $not: { title: 'NOT', blurb: 'Bitwise inversion — every input bit is flipped.' },
  $logic_and: { title: 'logical AND', blurb: 'One-bit result: 1 when both operands are non-zero.' },
  $logic_or: { title: 'logical OR', blurb: 'One-bit result: 1 when either operand is non-zero.' },
  $logic_not: { title: 'logical NOT', blurb: 'One-bit result: 1 when the operand is zero.' },
  $reduce_and: { title: 'AND reduction', blurb: 'ANDs every bit of the input together into a single bit.' },
  $reduce_or: { title: 'OR reduction', blurb: 'ORs every bit of the input together — 1 when any bit is set.' },
  $reduce_xor: { title: 'XOR reduction', blurb: 'Parity: 1 when an odd number of input bits are set.' },
  $reduce_xnor: { title: 'XNOR reduction', blurb: 'Even parity: 1 when an even number of input bits are set.' },
  $reduce_bool: { title: 'boolean reduction', blurb: 'Collapses the input to one bit: 1 when the value is non-zero.' },
  $add: { title: 'adder', blurb: 'Y = A + B, truncated to the output width.' },
  $sub: { title: 'subtractor', blurb: 'Y = A - B, truncated to the output width.' },
  $mul: { title: 'multiplier', blurb: 'Y = A x B, truncated to the output width.' },
  $div: { title: 'divider', blurb: 'Y = A / B (integer division).' },
  $mod: { title: 'modulo', blurb: 'Y = A % B (division remainder).' },
  $neg: { title: 'negate', blurb: "Y = -A, two's complement." },
  $eq: { title: 'equality', blurb: 'One-bit result: 1 when A equals B.' },
  $ne: { title: 'inequality', blurb: 'One-bit result: 1 when A differs from B.' },
  $eqx: { title: 'case equality', blurb: 'Like ==, but x and z compare literally rather than as unknown.' },
  $nex: { title: 'case inequality', blurb: 'Like !=, but x and z compare literally rather than as unknown.' },
  $lt: { title: 'less-than', blurb: 'One-bit result: 1 when A < B.' },
  $le: { title: 'less-or-equal', blurb: 'One-bit result: 1 when A <= B.' },
  $gt: { title: 'greater-than', blurb: 'One-bit result: 1 when A > B.' },
  $ge: { title: 'greater-or-equal', blurb: 'One-bit result: 1 when A >= B.' },
  $shl: { title: 'shift left', blurb: 'Y = A << B, zero-filled from the right.' },
  $shr: { title: 'shift right', blurb: 'Y = A >> B, zero-filled from the left.' },
  $sshl: { title: 'arithmetic shift left', blurb: 'Y = A <<< B — identical to a logical left shift.' },
  $sshr: { title: 'arithmetic shift right', blurb: 'Y = A >>> B, sign-extended from the left.' },
  $shift: { title: 'shift', blurb: 'Shifts A by B; a negative B shifts the other way.' },
  $shiftx: { title: 'indexed part-select', blurb: 'Selects a slice of A at offset B — how Yosys builds `a[i +: n]`.' },
  $mux: { title: 'multiplexer', blurb: 'Y = S ? B : A. One select bit chooses between two inputs.' },
  $pmux: { title: 'priority multiplexer', blurb: 'One-hot select across several inputs; A is the default when no S bit is set.' },
  $dff: { title: 'D flip-flop', blurb: 'Captures D on the active clock edge and holds it on Q until the next one.' },
  $dffe: { title: 'D flip-flop with enable', blurb: 'Captures D on the clock edge, but only while EN is asserted.' },
  $adff: { title: 'D flip-flop, async reset', blurb: 'Captures D on the clock edge; ARST forces Q immediately, without waiting for a clock.' },
  $adffe: { title: 'D flip-flop, async reset + enable', blurb: 'Clocked capture gated by EN, with an ARST that acts immediately.' },
  $sdff: { title: 'D flip-flop, sync reset', blurb: 'Captures D on the clock edge; SRST loads the reset value on the edge instead.' },
  $sdffe: { title: 'D flip-flop, sync reset + enable', blurb: 'SRST is applied on the clock edge regardless of EN.' },
  $sdffce: { title: 'D flip-flop, sync reset gated by enable', blurb: 'SRST is applied on the clock edge only while EN is asserted.' },
  $aldff: { title: 'D flip-flop, async load', blurb: 'Loads AD asynchronously when ALOAD is asserted, otherwise captures D on the edge.' },
  $dffsr: { title: 'D flip-flop, set/reset', blurb: 'Per-bit asynchronous SET and CLR inputs override the clocked capture.' },
  $dlatch: { title: 'D latch', blurb: 'Level-sensitive: Q follows D while EN is asserted and holds when it is released.' },
  $adlatch: { title: 'D latch, async reset', blurb: 'Level-sensitive latch with an immediate reset input.' },
  $mem: { title: 'memory', blurb: 'An inferred RAM/ROM array with its own read and write ports.' },
  $mem_v2: { title: 'memory', blurb: 'An inferred RAM/ROM array with its own read and write ports.' },
  $_AND_: { title: 'AND gate', blurb: 'Single-bit AND primitive.' },
  $_OR_: { title: 'OR gate', blurb: 'Single-bit OR primitive.' },
  $_XOR_: { title: 'XOR gate', blurb: 'Single-bit exclusive-OR primitive.' },
  $_XNOR_: { title: 'XNOR gate', blurb: 'Single-bit exclusive-NOR primitive.' },
  $_NOT_: { title: 'inverter', blurb: 'Single-bit inversion primitive.' },
  $_MUX_: { title: '2-to-1 mux', blurb: 'Single-bit multiplexer: Y = S ? B : A.' },
  // netlistsvg's own pseudo-cells. They carry no Yosys cell, but they are the
  // things a reader is most likely to click first, so they get real answers too.
  $_inputExt_: { title: 'module input', blurb: 'A port on the top-level module — this is where a value enters the design.' },
  $_outputExt_: { title: 'module output', blurb: 'A port on the top-level module — this is what the design produces.' },
  $_constant_: { title: 'constant', blurb: 'A fixed value wired straight into the circuit.' },
  $_split_: { title: 'bus split', blurb: 'Splits a wide bus into narrower slices. Drawing only — no logic.' },
  $_join_: { title: 'bus join', blurb: 'Concatenates narrow signals into one wide bus. Drawing only — no logic.' },
};

export function describeType(type: string): TypeDesc {
  const known = DESCRIPTIONS[type];
  if (known) return known;
  if (!type.startsWith('$')) {
    return { title: `${type} instance`, blurb: `An instance of the \`${type}\` module.` };
  }
  return { title: type, blurb: 'A Yosys cell this build has no description for yet.' };
}

const isStateful = (type: string): boolean =>
  /^\$(a|s|al)?dffe?(ce)?$|^\$dffsre?$|^\$a?dlatch(sr)?$|^\$mem(_v2)?$/i.test(type);

// ── truth tables, by simulation ─────────────────────────────────────────────

/** Cap on enumerated rows. 6 free input bits = 64 rows: still readable, still instant. */
const MAX_FREE_BITS = 6;

const netIdOf = (bits: Bitref[]): string | undefined =>
  bits.length && bits.every((b) => typeof b === 'number') ? bits.join(',') : undefined;

const fmt = (num: bigint | null, width: number): string => {
  if (num === null) return 'x';
  if (width === 1) return num === 0n ? '0' : '1';
  return `0x${num.toString(16).toUpperCase()}`;
};

/**
 * Enumerate a combinational cell's behaviour by running the real simulator on a
 * netlist containing nothing but that cell.
 *
 * Returns null (with a reason) whenever a table would be misleading rather than
 * absent: stateful cells have no truth table, and a cell with more free input
 * bits than the cap would need a table nobody could read.
 */
export function truthTableFor(cell: RawCell): { table?: TruthTable; note?: string } {
  const type = cell.type ?? '';
  if (isStateful(type)) {
    return { note: 'Stateful cell — its output depends on stored state, not on the inputs alone.' };
  }
  const conns = cell.connections ?? {};
  const names = Object.keys(conns);
  if (!names.length) return {};

  const ins = names.filter((n) => dirOf(cell, n) === 'input');
  const outs = names.filter((n) => dirOf(cell, n) === 'output');
  if (!ins.length || !outs.length) return {};

  // One variable per distinct net bit. A bit wired to two input pins is ONE
  // degree of freedom, not two, and driving the two pins independently would
  // produce rows the circuit can never actually be in.
  const free: number[] = [];
  for (const n of ins) {
    for (const b of conns[n]) {
      if (typeof b === 'number' && !free.includes(b)) free.push(b);
    }
  }
  const outBits = new Set<number>();
  for (const n of outs) for (const b of conns[n]) if (typeof b === 'number') outBits.add(b);
  // A cell whose output feeds back into its own input is not a function of its
  // inputs; enumerating it would report the simulator's loop-breaking, not the
  // gate's behaviour.
  if (free.some((b) => outBits.has(b))) {
    return { note: 'This cell feeds back into itself, so it has no standalone truth table.' };
  }
  if (!free.length) return { note: 'Every input is a constant — this cell has a single fixed output.' };
  if (free.length > MAX_FREE_BITS) {
    return { note: `${free.length} input bits would need ${2 ** free.length} rows — too many to show. Drive the inputs above and watch the wires instead.` };
  }

  const ports: Record<string, RawPort> = {};
  for (const n of ins) ports[n] = { direction: 'input', bits: conns[n] };
  for (const n of outs) ports[n] = { direction: 'output', bits: conns[n] };
  const sim = buildSim(JSON.stringify({
    modules: { probe: { attributes: { top: 1 }, ports, cells: { c: cell }, netnames: {} } },
  }));
  if (!sim) return {};

  const rows: TruthTable['rows'] = [];
  const combos = 1 << free.length;
  for (let mask = 0; mask < combos; mask++) {
    const bitVal = new Map<number, 0 | 1>();
    free.forEach((b, i) => bitVal.set(b, ((mask >> i) & 1) as 0 | 1));

    // Assemble each port's drive word from the per-bit assignment, so pins that
    // share a net always see the same value.
    const drive = new Map<string, bigint>();
    for (const n of ins) {
      let v = 0n;
      conns[n].forEach((b, i) => {
        const bit = typeof b === 'number' ? bitVal.get(b) ?? 0 : b === '1' ? 1 : 0;
        if (bit) v |= 1n << BigInt(i);
      });
      drive.set(n, v);
    }

    const values: Map<number, Val> = sim.settle(drive, new Map(), sim.initRegs());
    rows.push({
      in: ins.map((n) => fmt(busValue(conns[n], values).num, conns[n].length)),
      out: outs.map((n) => {
        const { num, anyX } = busValue(conns[n], values);
        return anyX ? 'x' : fmt(num, conns[n].length);
      }),
    });
  }

  return {
    table: {
      inputs: ins.map((n) => ({ name: n, width: conns[n].length })),
      outputs: outs.map((n) => ({ name: n, width: conns[n].length })),
      rows,
      truncated: false,
    },
  };
}

// ── the inspectors ──────────────────────────────────────────────────────────

export function inspectCell(
  nl: RawNetlist, cellId: string, moduleName?: string,
): CellDetail | null {
  const picked = pickModule(nl, moduleName);
  if (!picked) return null;
  const [, mod] = picked;
  const cells = mod.cells ?? {};
  const ids = Object.keys(cells);
  const cell = cells[cellId];

  // netlistsvg's pseudo-cells (ports, constants, splits) have no Yosys cell
  // behind them. They are still clickable, so answer for them rather than
  // returning nothing and looking broken.
  if (!cell) return pseudoCellDetail(mod, cellId);

  const type = cell.type ?? '';
  const { title, blurb } = describeType(type);
  const conns = cell.connections ?? {};
  const nameByNet = netNameIndex(mod);

  const ports: PortDetail[] = Object.keys(conns).map((n) => {
    const bits = conns[n];
    const netId = netIdOf(bits);
    return {
      name: n,
      dir: dirOf(cell, n),
      width: bits.length,
      bits,
      netId,
      netName: netId ? nameByNet.get(netId) : undefined,
    };
  });

  const { table, note } = truthTableFor(cell);

  return {
    kind: 'cell',
    id: cellId,
    type,
    title,
    blurb,
    index: ids.indexOf(cellId) + 1,
    total: ids.length,
    params: Object.entries(cell.parameters ?? {}).map(([k, v]) => [k, String(v)]),
    ports,
    src: parseSrc(cell.attributes?.src),
    submodule: nl.modules?.[type] ? type : undefined,
    truth: table,
    truthNote: note,
  };
}

/** A module port / constant / split drawn by netlistsvg but absent from `cells`. */
function pseudoCellDetail(mod: RawModule, cellId: string): CellDetail | null {
  const port = mod.ports?.[cellId];
  if (!port) return null;
  const dir: Dir = port.direction === 'output' ? 'output'
    : port.direction === 'inout' ? 'inout' : 'input';
  const bits = port.bits ?? [];
  const { title, blurb } = describeType(dir === 'output' ? '$_outputExt_' : '$_inputExt_');
  return {
    kind: 'cell',
    id: cellId,
    type: `module ${dir}`,
    title: `${cellId} — ${title}`,
    blurb,
    index: 0,
    total: 0,
    params: [['width', String(bits.length)]],
    ports: [{ name: cellId, dir, width: bits.length, bits, netId: netIdOf(bits) }],
    truthNote: 'A port is a boundary, not a gate — it has no logic of its own.',
  };
}

function netNameIndex(mod: RawModule): Map<string, string> {
  const out = new Map<string, string>();
  for (const [name, net] of Object.entries(mod.netnames ?? {})) {
    if (net.hide_name === 1) continue;
    const bits = net.bits ?? [];
    if (bits.length) out.set(bits.join(','), name);
  }
  return out;
}

export function inspectNet(
  nl: RawNetlist, netId: string, moduleName?: string,
): NetDetail | null {
  const picked = pickModule(nl, moduleName);
  if (!picked) return null;
  const [, mod] = picked;
  const bits = netId.split(',').map((s) => (/^-?\d+$/.test(s) ? Number(s) : s));
  const own = new Set(bits.filter((b): b is number => typeof b === 'number'));
  if (!own.size) return null;

  let driver: NetDetail['driver'];
  const loads: NetDetail['loads'] = [];
  for (const [id, cell] of Object.entries(mod.cells ?? {})) {
    for (const [port, pbits] of Object.entries(cell.connections ?? {})) {
      if (!pbits.some((b) => typeof b === 'number' && own.has(b))) continue;
      const entry = { id, type: cell.type ?? '', port };
      if (dirOf(cell, port) === 'output') driver ??= entry;
      else loads.push(entry);
    }
  }

  let topPort: NetDetail['topPort'];
  for (const [name, p] of Object.entries(mod.ports ?? {})) {
    if ((p.bits ?? []).some((b) => typeof b === 'number' && own.has(b))) {
      topPort = {
        name,
        dir: p.direction === 'output' ? 'output' : p.direction === 'inout' ? 'inout' : 'input',
      };
      break;
    }
  }

  return {
    kind: 'net',
    id: netId,
    name: netNameIndex(mod).get(netId),
    bits,
    width: bits.length,
    driver,
    loads,
    topPort,
  };
}

// ── source recovery ─────────────────────────────────────────────────────────

export interface ModuleSource {
  name: string;
  /** 1-based, inclusive. */
  startLine: number;
  endLine: number;
  code: string;
}

/**
 * The `module … endmodule` block a given line falls inside.
 *
 * This is what makes "open the submodule" work in the sandbox, where synthesis
 * is flattened: the hierarchy is gone from the netlist, but the cell still
 * carries the source location it came from, and that location still sits inside
 * whichever module the user wrote it in. Showing that block IS showing the
 * submodule — recovered from the text rather than from a hierarchy that the
 * flatten pass deliberately dissolved.
 */
export function moduleSourceAt(text: string, line: number): ModuleSource | null {
  const lines = text.split('\n');
  if (line < 1 || line > lines.length) return null;
  let start = -1;
  let name = '';
  for (let i = 0; i < lines.length; i++) {
    const open = /^\s*module\s+([A-Za-z_][\w$]*)/.exec(lines[i]);
    if (open) { start = i; name = open[1]; }
    if (/^\s*endmodule\b/.test(lines[i]) && start >= 0) {
      if (line - 1 >= start && line - 1 <= i) {
        return { name, startLine: start + 1, endLine: i + 1, code: lines.slice(start, i + 1).join('\n') };
      }
      start = -1;
    }
  }
  // An unterminated final module still deserves an answer — a half-typed file is
  // exactly when someone reaches for this.
  if (start >= 0 && line - 1 >= start) {
    return { name, startLine: start + 1, endLine: lines.length, code: lines.slice(start).join('\n') };
  }
  return null;
}

/** A window of source around a line, for the inspector's code excerpt. */
export function excerptAt(
  text: string, line: number, context = 3,
): { startLine: number; lines: string[] } | null {
  const all = text.split('\n');
  if (line < 1 || line > all.length) return null;
  const from = Math.max(0, line - 1 - context);
  const to = Math.min(all.length, line + context);
  return { startLine: from + 1, lines: all.slice(from, to) };
}
