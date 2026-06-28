/**
 * netlistSim - a small multi-bit simulator over a Yosys word-level netlist, so
 * every wire in the synthesized schematic can show a live value and be probed.
 *
 * It evaluates the common `prep` cells ($and/$or/$xor/$not, reductions, logic,
 * $add/$sub/$mul, comparisons, shifts, $mux/$pmux) combinationally, treats
 * flip-flops ($dff/$adff/$sdff/$dffe/$dlatch) as state sources, and advances
 * them on an explicit clock step. Any unknown cell (or a user sub-module
 * instance) drives its outputs to x. Values are 0 | 1 | null(x), per bit.
 */
export type Val = 0 | 1 | null;
type Bitref = number | string;

interface Port { direction: string; bits: Bitref[] }
interface Cell { type: string; parameters?: Record<string, string>; port_directions?: Record<string, string>; connections: Record<string, Bitref[]> }
interface Mod { attributes?: Record<string, unknown>; ports: Record<string, Port>; cells: Record<string, Cell> }

const pInt = (s?: string): number => (s ? (parseInt(s, 2) || 0) : 0);
const pBool = (s?: string): boolean => !!s && /1/.test(s);
const mask = (w: number): bigint => (1n << BigInt(Math.max(0, w))) - 1n;

export interface SimPort { name: string; bits: Bitref[]; width: number }
interface SimDff {
  id: string; q: Bitref[]; d: Bitref[];
  en?: Bitref; enPol: boolean;
  arst?: Bitref; arstPol: boolean; arstVal: number;
}

type Driver =
  | { k: 'input'; name: string; i: number }
  | { k: 'dff'; id: string; i: number }
  | { k: 'cell'; id: string };

export class NetlistSim {
  inputs: SimPort[] = [];
  outputs: SimPort[] = [];
  dffs: SimDff[] = [];
  hasClock = false;
  hasReset = false;
  private cells = new Map<string, Cell>();
  private driver = new Map<number, Driver>();

  constructor(mod: Mod) {
    for (const [name, p] of Object.entries(mod.ports)) {
      if (p.direction !== 'output') {
        this.inputs.push({ name, bits: p.bits, width: p.bits.length });
        p.bits.forEach((b, i) => { if (typeof b === 'number') this.driver.set(b, { k: 'input', name, i }); });
      }
      if (p.direction !== 'input') this.outputs.push({ name, bits: p.bits, width: p.bits.length });
    }
    for (const [id, c] of Object.entries(mod.cells)) {
      this.cells.set(id, c);
      if (/(dff|dlatch|dffsr|adff|sdff|dffe)/i.test(c.type)) {
        const q = c.connections.Q ?? [];
        const dff: SimDff = {
          id, q, d: c.connections.D ?? [],
          en: c.connections.EN?.[0], enPol: pBool(c.parameters?.EN_POLARITY ?? '1'),
          arst: c.connections.ARST?.[0] ?? c.connections.SRST?.[0],
          arstPol: pBool(c.parameters?.ARST_POLARITY ?? c.parameters?.SRST_POLARITY ?? '1'),
          arstVal: pInt(c.parameters?.ARST_VALUE ?? c.parameters?.SRST_VALUE),
        };
        this.dffs.push(dff);
        this.hasClock = true;
        if (dff.arst != null) this.hasReset = true;
        q.forEach((b, i) => { if (typeof b === 'number') this.driver.set(b, { k: 'dff', id, i }); });
      } else {
        const dirs = c.port_directions ?? {};
        for (const [pn, bits] of Object.entries(c.connections)) {
          const dir = dirs[pn] ?? (['Y', 'Q', 'X'].includes(pn) ? 'output' : 'input');
          if (dir === 'output') bits.forEach((b) => { if (typeof b === 'number') this.driver.set(b, { k: 'cell', id }); });
        }
      }
    }
  }

  initRegs(): Map<string, Val[]> {
    const m = new Map<string, Val[]>();
    for (const d of this.dffs) m.set(d.id, d.q.map(() => 0 as Val));
    return m;
  }

  applyReset(): Map<string, Val[]> {
    const m = new Map<string, Val[]>();
    for (const d of this.dffs) m.set(d.id, d.q.map((_, i) => ((d.arstVal >> i) & 1) as Val));
    return m;
  }

  /** Combinational settle: returns every net's value for the given drive/forces/reg state. */
  settle(drive: Map<string, bigint>, forces: Map<number, 0 | 1>, regs: Map<string, Val[]>): Map<number, Val> {
    const memo = new Map<number, Val>();
    const visiting = new Set<number>();
    const doneCells = new Set<string>();

    const bitVal = (b: Bitref): Val => {
      if (typeof b === 'string') return b === '1' ? 1 : b === '0' ? 0 : null;
      if (forces.has(b)) return forces.get(b)!;
      if (memo.has(b)) return memo.get(b)!;
      if (visiting.has(b)) return null;
      visiting.add(b);
      const drv = this.driver.get(b);
      let r: Val = null;
      if (drv?.k === 'input') {
        const v = drive.get(drv.name) ?? 0n;
        r = Number((v >> BigInt(drv.i)) & 1n) as Val;
      } else if (drv?.k === 'dff') {
        r = regs.get(drv.id)?.[drv.i] ?? null;
      } else if (drv?.k === 'cell') {
        evalCell(drv.id);
        r = memo.has(b) ? memo.get(b)! : null;
      }
      visiting.delete(b);
      if (!memo.has(b)) memo.set(b, r);
      return memo.get(b)!;
    };

    const readBus = (bits: Bitref[] | undefined, signed = false): bigint | null => {
      if (!bits) return 0n;
      let acc = 0n;
      for (let i = 0; i < bits.length; i++) { const v = bitVal(bits[i]); if (v === null) return null; if (v) acc |= 1n << BigInt(i); }
      if (signed && bits.length && bitVal(bits[bits.length - 1]) === 1) acc -= 1n << BigInt(bits.length);
      return acc;
    };
    const write = (b: Bitref, v: Val) => { if (typeof b === 'number') memo.set(b, forces.has(b) ? forces.get(b)! : v); };
    const writeBus = (bits: Bitref[] | undefined, value: bigint | null) => {
      if (!bits) return;
      for (let i = 0; i < bits.length; i++) write(bits[i], value === null ? null : (Number((value >> BigInt(i)) & 1n) as Val));
    };

    const evalCell = (id: string) => {
      if (doneCells.has(id)) return;
      doneCells.add(id);
      const c = this.cells.get(id)!;
      // flip-flops are state: their Q comes from `regs`, never combinational eval
      if (/(dff|dlatch|dffsr|adff|sdff|dffe)/i.test(c.type)) return;
      const { A, B, Y, S } = c.connections;
      const aS = pBool(c.parameters?.A_SIGNED), bS = pBool(c.parameters?.B_SIGNED);
      const yw = Y ? Y.length : 0;
      const perbit = (f: (a: Val, b: Val) => Val) => {
        if (!Y) return;
        for (let i = 0; i < Y.length; i++) write(Y[i], f(A ? bitVal(A[i] ?? '0') : null, B ? bitVal(B[i] ?? '0') : null));
      };
      const t = c.type;
      switch (t) {
        case '$not': case '$_NOT_': perbit((a) => (a === null ? null : (a ? 0 : 1))); break;
        case '$and': case '$_AND_': perbit((a, b) => (a === null || b === null ? null : ((a && b) ? 1 : 0))); break;
        case '$or': case '$_OR_': perbit((a, b) => (a === null || b === null ? null : ((a || b) ? 1 : 0))); break;
        case '$xor': case '$_XOR_': perbit((a, b) => (a === null || b === null ? null : ((a !== b) ? 1 : 0))); break;
        case '$xnor': case '$_XNOR_': perbit((a, b) => (a === null || b === null ? null : ((a === b) ? 1 : 0))); break;
        case '$reduce_and': { const a = readBus(A); writeBus(Y, a === null ? null : (a === mask((A ?? []).length) ? 1n : 0n)); break; }
        case '$reduce_or': case '$reduce_bool': { const a = readBus(A); writeBus(Y, a === null ? null : (a !== 0n ? 1n : 0n)); break; }
        case '$reduce_xor': { let acc: Val = 0; for (const b of A ?? []) { const v = bitVal(b); if (v === null) { acc = null; break; } acc = (acc! ^ v) as Val; } writeBus(Y, acc === null ? null : BigInt(acc)); break; }
        case '$reduce_xnor': { let acc: Val = 0; let bad = false; for (const b of A ?? []) { const v = bitVal(b); if (v === null) { bad = true; break; } acc = (acc! ^ v) as Val; } writeBus(Y, bad ? null : (acc ? 0n : 1n)); break; }
        case '$logic_not': { const a = readBus(A); writeBus(Y, a === null ? null : (a === 0n ? 1n : 0n)); break; }
        case '$logic_and': { const a = readBus(A), b = readBus(B); writeBus(Y, (a === null || b === null) ? null : ((a !== 0n && b !== 0n) ? 1n : 0n)); break; }
        case '$logic_or': { const a = readBus(A), b = readBus(B); writeBus(Y, (a === null || b === null) ? null : ((a !== 0n || b !== 0n) ? 1n : 0n)); break; }
        case '$add': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : ((a + b) & mask(yw))); break; }
        case '$sub': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : ((a - b) & mask(yw))); break; }
        case '$mul': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : ((a * b) & mask(yw))); break; }
        case '$neg': { const a = readBus(A, aS); writeBus(Y, a === null ? null : ((-a) & mask(yw))); break; }
        case '$div': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null || b === 0n) ? null : ((a / b) & mask(yw))); break; }
        case '$mod': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null || b === 0n) ? null : ((a % b) & mask(yw))); break; }
        case '$eq': case '$eqx': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a === b ? 1n : 0n)); break; }
        case '$ne': case '$nex': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a !== b ? 1n : 0n)); break; }
        case '$lt': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a < b ? 1n : 0n)); break; }
        case '$le': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a <= b ? 1n : 0n)); break; }
        case '$gt': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a > b ? 1n : 0n)); break; }
        case '$ge': { const a = readBus(A, aS), b = readBus(B, bS); writeBus(Y, (a === null || b === null) ? null : (a >= b ? 1n : 0n)); break; }
        case '$shl': case '$sshl': { const a = readBus(A, aS), b = readBus(B); writeBus(Y, (a === null || b === null) ? null : ((a << b) & mask(yw))); break; }
        case '$shr': { const a = readBus(A), b = readBus(B); writeBus(Y, (a === null || b === null) ? null : ((a >> b) & mask(yw))); break; }
        case '$sshr': { const a = readBus(A, aS), b = readBus(B); writeBus(Y, (a === null || b === null) ? null : ((a >> b) & mask(yw))); break; }
        case '$mux': case '$_MUX_': {
          const s = S ? bitVal(S[0]) : null;
          if (!Y) break;
          for (let i = 0; i < Y.length; i++) write(Y[i], s === null ? null : (s ? (B ? bitVal(B[i] ?? '0') : null) : (A ? bitVal(A[i] ?? '0') : null)));
          break;
        }
        case '$pmux': {
          if (!Y || !S) break;
          const w = Y.length;
          let chosen = -1, bad = false;
          for (let k = 0; k < S.length; k++) { const sv = bitVal(S[k]); if (sv === null) { bad = true; break; } if (sv) { chosen = k; break; } }
          for (let i = 0; i < w; i++) {
            if (bad) { write(Y[i], null); continue; }
            if (chosen < 0) write(Y[i], A ? bitVal(A[i] ?? '0') : null);
            else write(Y[i], B ? bitVal(B[chosen * w + i] ?? '0') : null);
          }
          break;
        }
        default:
          // unknown cell / sub-module instance: outputs unknown
          for (const [pn, bits] of Object.entries(c.connections)) {
            const dir = (c.port_directions ?? {})[pn] ?? (['Y', 'Q', 'X'].includes(pn) ? 'output' : 'input');
            if (dir === 'output') writeBus(bits, null);
          }
      }
    };

    // resolve every net
    for (const out of this.outputs) for (const b of out.bits) bitVal(b);
    for (const id of this.cells.keys()) evalCell(id);
    for (const [b] of this.driver) bitVal(b);
    return memo;
  }

  /** Compute next register state on a rising clock edge. */
  nextRegs(drive: Map<string, bigint>, forces: Map<number, 0 | 1>, regs: Map<string, Val[]>): Map<string, Val[]> {
    const v = this.settle(drive, forces, regs);
    const read = (b: Bitref): Val => (typeof b === 'string' ? (b === '1' ? 1 : b === '0' ? 0 : null) : (forces.get(b as number) ?? v.get(b as number) ?? null));
    const next = new Map<string, Val[]>();
    for (const d of this.dffs) {
      const cur = regs.get(d.id) ?? d.q.map(() => 0 as Val);
      let en = true;
      if (d.en != null) { const ev = read(d.en); en = d.enPol ? ev === 1 : ev === 0; }
      next.set(d.id, en ? d.d.map((b) => read(b)) : cur);
    }
    return next;
  }
}

export function buildSim(jsonText: string): NetlistSim | null {
  try {
    const data = JSON.parse(jsonText) as { modules?: Record<string, Mod> };
    const mods = data.modules ?? {};
    const names = Object.keys(mods);
    if (!names.length) return null;
    const isTop = (m: Mod) => { const t = m.attributes?.top; return t === 1 || t === '1' || (typeof t === 'string' && /1$/.test(t)); };
    const top = names.find((n) => isTop(mods[n])) ?? names[0];
    return new NetlistSim(mods[top]);
  } catch {
    return null;
  }
}

/** Read a settled bus value as a number string for display (LSB-first bits). */
export function busValue(bits: Bitref[], values: Map<number, Val>): { num: bigint | null; anyHigh: boolean; anyX: boolean } {
  let acc = 0n; let anyHigh = false; let anyX = false; let known = true;
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i];
    const v: Val = typeof b === 'string' ? (b === '1' ? 1 : b === '0' ? 0 : null) : (values.get(b) ?? null);
    if (v === null) { anyX = true; known = false; }
    else if (v === 1) { anyHigh = true; acc |= 1n << BigInt(i); }
  }
  return { num: known ? acc : null, anyHigh, anyX };
}
