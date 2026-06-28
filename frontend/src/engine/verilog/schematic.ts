/**
 * schematic - turn a compiled miniSim module into a drawable gate-level netlist.
 *
 * The judge already parses the student's Verilog into a `SimModule` whose every
 * output/wire is driven by an expression tree (`Expr`). Here we flatten those
 * trees into actual gate nodes (AND / OR / NOT / XOR / NAND / NOR / XNOR / MUX),
 * share named nets so fan-out is drawn once, assign each node a column by its
 * logic depth and a row by a barycenter pass, and hand back coordinates the SVG
 * renderer can drop straight onto a canvas.
 *
 * It also exposes `evalSchematic` so the live diagram can light up every wire for
 * a given set of input values - that is the part that makes the structure click.
 *
 * Pure + framework-free so it stays unit-testable.
 */
import type { SimModule, Expr, Bit } from './miniSim';

export type SKind =
  | 'input' | 'const' | 'buf' | 'not'
  | 'and' | 'or' | 'xor' | 'xnor' | 'nand' | 'nor'
  | 'mux' | 'output';

export interface SNode {
  id: string;
  kind: SKind;
  /** net name for input/output, '0'/'1' for const, gate mnemonic otherwise */
  label: string;
  /** source node ids feeding this node's input ports, in order.
   *  mux order is [select, in0 (sel=0), in1 (sel=1)]. */
  ins: string[];
  col: number;
  row: number;
  x: number;
  y: number;
}

export interface SWire {
  from: string;   // source node id (its output port)
  to: string;     // sink node id
  port: number;   // which input port on the sink
}

export interface Schematic {
  nodes: SNode[];
  wires: SWire[];
  inputs: string[];
  outputs: string[];
  width: number;
  height: number;
  byId: Map<string, SNode>;
  /** handy stats for the HUD */
  gateCount: number;
}

// ── layout constants ─────────────────────────────────────────────────────────
const COL_GAP = 132;
const ROW_GAP = 72;
const MARGIN_X = 70;
const MARGIN_Y = 56;

const GATE_KINDS: SKind[] = ['buf', 'not', 'and', 'or', 'xor', 'xnor', 'nand', 'nor', 'mux'];

/** Collect the operands of an associative chain of the SAME operator. */
function collectOperands(e: Expr, op: '&' | '|' | '^'): Expr[] {
  if (e.k === 'bin' && e.op === op) {
    return [...collectOperands(e.a, op), ...collectOperands(e.b, op)];
  }
  return [e];
}

export function buildSchematic(mod: SimModule): Schematic {
  let counter = 0;
  const nodes: SNode[] = [];
  const byId = new Map<string, SNode>();
  const wires: SWire[] = [];

  const netNode = new Map<string, string>();   // net name -> id of the node driving it
  const constNode = new Map<0 | 1, string>();   // shared constant sources
  const building = new Set<string>();           // cycle guard

  const add = (kind: SKind, label: string, ins: string[]): string => {
    const id = `${kind}${counter++}`;
    const node: SNode = { id, kind, label, ins, col: 0, row: 0, x: 0, y: 0 };
    nodes.push(node);
    byId.set(id, node);
    ins.forEach((src, port) => wires.push({ from: src, to: id, port }));
    return id;
  };

  // input pins live in column 0
  for (const name of mod.inputs) netNode.set(name, add('input', name, []));

  const getConst = (v: Bit): string => {
    const key = (v ? 1 : 0) as 0 | 1;
    if (!constNode.has(key)) constNode.set(key, add('const', key ? '1' : '0', []));
    return constNode.get(key)!;
  };

  /** Resolve a named net to the node id that drives it, building it on demand. */
  const netFor = (name: string): string => {
    const have = netNode.get(name);
    if (have) return have;
    if (building.has(name)) {
      // combinational loop - draw a stub so we still render something sane
      const stub = add('input', name, []);
      netNode.set(name, stub);
      return stub;
    }
    const driver = mod.drivers.get(name);
    if (!driver) {
      const stub = add('input', name, []);
      netNode.set(name, stub);
      return stub;
    }
    building.add(name);
    const root = flatten(driver);
    building.delete(name);
    netNode.set(name, root);
    return root;
  };

  /** Map an expression's binary operands to their source node ids. */
  const gateInputs = (e: Extract<Expr, { k: 'bin' }>): string[] => {
    if (e.op === '~^') return [flatten(e.a), flatten(e.b)];
    return collectOperands(e, e.op).map(flatten);
  };

  function flatten(e: Expr): string {
    switch (e.k) {
      case 'const': return getConst(e.v);
      case 'id': return netFor(e.name);
      case 'not': {
        const a = e.a;
        if (a.k === 'bin') {
          const ins = gateInputs(a);
          const kind: SKind =
            a.op === '&' ? 'nand' : a.op === '|' ? 'nor' : a.op === '^' ? 'xnor' : 'xor';
          const label = kind.toUpperCase();
          return add(kind, label, ins);
        }
        return add('not', 'NOT', [flatten(a)]);
      }
      case 'bin': {
        const ins = gateInputs(e);
        const kind: SKind = e.op === '&' ? 'and' : e.op === '|' ? 'or' : e.op === '^' ? 'xor' : 'xnor';
        return add(kind, kind.toUpperCase(), ins);
      }
      case 'mux': {
        const s = flatten(e.s);
        const f = flatten(e.f);
        const t = flatten(e.t);
        return add('mux', 'MUX', [s, f, t]);
      }
    }
  }

  // build every driven net (so internal wires show even if only feeding outputs)
  for (const name of mod.drivers.keys()) netFor(name);

  // output pins on the far right, each fed by its driving net
  const outputPinIds: string[] = [];
  for (const name of mod.outputs) {
    const feeder = netFor(name);
    outputPinIds.push(add('output', name, [feeder]));
  }

  // ── columns by logic depth ─────────────────────────────────────────────────
  const depthMemo = new Map<string, number>();
  const depthOf = (id: string, seen = new Set<string>()): number => {
    if (depthMemo.has(id)) return depthMemo.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    const n = byId.get(id)!;
    const d = n.ins.length === 0 ? 0 : 1 + Math.max(...n.ins.map((s) => depthOf(s, seen)));
    seen.delete(id);
    depthMemo.set(id, d);
    return d;
  };

  let maxGateDepth = 0;
  for (const n of nodes) {
    if (n.kind === 'output') continue;
    maxGateDepth = Math.max(maxGateDepth, depthOf(n.id));
  }
  const outCol = maxGateDepth + 1;
  for (const n of nodes) n.col = n.kind === 'output' ? outCol : depthOf(n.id);

  // ── rows by barycenter sweeps to keep wires tidy ────────────────────────────
  const consumers = new Map<string, string[]>();
  for (const w of wires) {
    if (!consumers.has(w.from)) consumers.set(w.from, []);
    consumers.get(w.from)!.push(w.to);
  }

  const cols = new Map<number, SNode[]>();
  for (const n of nodes) {
    if (!cols.has(n.col)) cols.set(n.col, []);
    cols.get(n.col)!.push(n);
  }
  const colKeys = [...cols.keys()].sort((a, b) => a - b);

  const rowIndex = new Map<string, number>();
  const reindex = () => {
    for (const k of colKeys) cols.get(k)!.forEach((n, i) => rowIndex.set(n.id, i));
  };
  // seed: inputs in declared order, then any extra col-0 nodes
  cols.get(0)?.sort((a, b) => {
    const ia = mod.inputs.indexOf(a.label);
    const ib = mod.inputs.indexOf(b.label);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  reindex();

  const bary = (ids: string[]): number => {
    const rs = ids.map((i) => rowIndex.get(i)).filter((r): r is number => r != null);
    return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;
  };

  for (let pass = 0; pass < 4; pass++) {
    // forward: order each column by the average row of its inputs
    for (const k of colKeys) {
      if (k === 0) continue;
      cols.get(k)!.sort((a, b) => bary(a.ins) - bary(b.ins));
      reindex();
    }
    // backward: order by the average row of consumers
    for (let i = colKeys.length - 1; i >= 0; i--) {
      const k = colKeys[i];
      cols.get(k)!.sort((a, b) => bary(consumers.get(a.id) ?? []) - bary(consumers.get(b.id) ?? []));
      reindex();
    }
  }

  // ── coordinates ─────────────────────────────────────────────────────────────
  const maxRows = Math.max(1, ...colKeys.map((k) => cols.get(k)!.length));
  const height = MARGIN_Y * 2 + (maxRows - 1) * ROW_GAP + 36;
  const width = MARGIN_X * 2 + outCol * COL_GAP + 40;

  for (const k of colKeys) {
    const list = cols.get(k)!;
    const colH = (list.length - 1) * ROW_GAP;
    const startY = (height - colH) / 2;
    list.forEach((n, i) => {
      n.row = i;
      n.x = MARGIN_X + k * COL_GAP;
      n.y = startY + i * ROW_GAP;
    });
  }

  const gateCount = nodes.filter((n) => GATE_KINDS.includes(n.kind)).length;

  return {
    nodes, wires, byId,
    inputs: mod.inputs, outputs: mod.outputs,
    width, height, gateCount,
  };
}

// ── live evaluation ──────────────────────────────────────────────────────────
const neg = (v: Bit): Bit => ((~v) & 1) as Bit;

/**
 * Compute the logic value carried by every node for one input vector.
 * Returns a map id -> 0 | 1 | null (null = could not resolve / floating).
 */
export function evalSchematic(s: Schematic, inputs: Record<string, Bit>): Map<string, Bit | null> {
  const val = new Map<string, Bit | null>();
  const visiting = new Set<string>();

  const reduce = (ids: string[], f: (a: Bit, b: Bit) => number, seed: Bit): Bit | null => {
    let acc: Bit = seed;
    for (const id of ids) {
      const v = compute(id);
      if (v === null) return null;
      acc = (f(acc, v) & 1) as Bit;
    }
    return acc;
  };

  function compute(id: string): Bit | null {
    if (val.has(id)) return val.get(id)!;
    if (visiting.has(id)) return null;
    visiting.add(id);
    const n = s.byId.get(id)!;
    let r: Bit | null;
    switch (n.kind) {
      case 'input': r = (inputs[n.label] ? 1 : 0) as Bit; break;
      case 'const': r = (n.label === '1' ? 1 : 0) as Bit; break;
      case 'buf':
      case 'output': r = compute(n.ins[0]); break;
      case 'not': { const a = compute(n.ins[0]); r = a === null ? null : neg(a); break; }
      case 'and': r = reduce(n.ins, (a, b) => a & b, 1 as Bit); break;
      case 'or': r = reduce(n.ins, (a, b) => a | b, 0 as Bit); break;
      case 'xor': r = reduce(n.ins, (a, b) => a ^ b, 0 as Bit); break;
      case 'nand': { const a = reduce(n.ins, (x, y) => x & y, 1 as Bit); r = a === null ? null : neg(a); break; }
      case 'nor': { const a = reduce(n.ins, (x, y) => x | y, 0 as Bit); r = a === null ? null : neg(a); break; }
      case 'xnor': { const a = reduce(n.ins, (x, y) => x ^ y, 0 as Bit); r = a === null ? null : neg(a); break; }
      case 'mux': {
        const sel = compute(n.ins[0]);
        r = sel === null ? null : compute(sel ? n.ins[2] : n.ins[1]);
        break;
      }
      default: r = null;
    }
    visiting.delete(id);
    val.set(id, r);
    return r;
  }

  for (const n of s.nodes) compute(n.id);
  return val;
}
