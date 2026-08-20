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

const pBool = (s?: string): boolean => !!s && /1/.test(s);
const mask = (w: number): bigint => (1n << BigInt(Math.max(0, w))) - 1n;

/**
 * Yosys writes parameters either as a binary digit string ("00001010", possibly
 * with x/z) or as a plain JSON number. Reset values and memory geometry can both
 * exceed 32 bits, so they are read as BigInt with unknown digits taken as 0.
 */
function pBig(s?: string | number): bigint {
  if (s == null) return 0n;
  if (typeof s === 'number') return BigInt(Math.trunc(s));
  const t = s.trim();
  if (!t) return 0n;
  if (/^[01xz]+$/i.test(t)) return BigInt('0b' + t.replace(/[xz]/gi, '0'));
  const n = Number(t);
  return Number.isFinite(n) ? BigInt(Math.trunc(n)) : 0n;
}

/** Parameter read as a plain decimal count (widths, port counts, sizes). */
function pNum(s?: string | number): number {
  if (s == null) return 0;
  if (typeof s === 'number') return Math.trunc(s);
  const t = s.trim();
  if (/^[01xz]+$/i.test(t) && t.length > 1) return Number(BigInt('0b' + t.replace(/[xz]/gi, '0')));
  const n = Number(t);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

/** Split a flat INIT/undefined parameter string into `size` words of `width` bits. */
function parseMemInit(raw: string | number | undefined, size: number, width: number): (bigint | null)[] {
  const out: (bigint | null)[] = new Array(size).fill(null);
  if (typeof raw !== 'string' || !/^[01xz]+$/i.test(raw)) return out;
  // MSB-first overall; word 0 occupies the LOWEST bits, i.e. the string's tail.
  for (let w = 0; w < size; w++) {
    const end = raw.length - w * width;
    const start = end - width;
    if (start < 0) break;
    const chunk = raw.slice(start, end);
    out[w] = /^[01]+$/.test(chunk) ? BigInt('0b' + chunk) : null;
  }
  return out;
}

const DFF_RE = /^\$(dff|dffe|adff|adffe|sdff|sdffe|sdffce|aldff|aldffe|dffsr|dffsre|dlatch|adlatch|dlatchsr)$/i;
const isDffType = (t: string): boolean => DFF_RE.test(t) || /^\$_(S?DFF|DFF|DLATCH)/i.test(t);

export interface SimPort { name: string; bits: Bitref[]; width: number }

/**
 * One flip-flop cell. Yosys `prep` emits a family of these ($dff, $dffe, $adff,
 * $adffe, $sdff, $sdffe, $sdffce, $dlatch); they differ only in which of the
 * enable/async-reset/sync-reset controls are present, so a single record with
 * optional controls covers them all.
 *
 * Reset priority follows the Yosys cell library: an ASYNC reset always wins over
 * the enable, while a SYNC reset wins over the enable for $sdffe but is itself
 * gated by the enable for $sdffce (`srstGatedByEn`).
 */
interface SimDff {
  id: string; q: Bitref[]; d: Bitref[];
  en?: Bitref; enPol: boolean;
  /** asynchronous reset — takes effect regardless of the enable */
  arst?: Bitref; arstPol: boolean; arstVal: bigint;
  /** synchronous reset — sampled at the edge like ordinary data */
  srst?: Bitref; srstPol: boolean; srstVal: bigint; srstGatedByEn: boolean;
  /** level-sensitive latch (transparent while EN is active) rather than edge-triggered */
  isLatch: boolean;
}

/**
 * A `$mem_v2` memory array. Read ports may be asynchronous (combinational) or
 * clocked; write ports carry a per-bit enable. Contents live in the register
 * state map alongside flip-flops so a memory-backed design (RAM, FIFO, register
 * file) steps exactly like any other sequential design.
 */
interface SimMemPortR { addr: Bitref[]; data: Bitref[]; en?: Bitref; clocked: boolean }
interface SimMemPortW { addr: Bitref[]; data: Bitref[]; en: Bitref[] }
interface SimMem {
  id: string; width: number; size: number; offset: number;
  rd: SimMemPortR[]; wr: SimMemPortW[];
  /** initial contents, LSB-first per word; undefined entries start at 0 */
  init: (bigint | null)[];
}

type Driver =
  | { k: 'input'; name: string; i: number }
  | { k: 'dff'; id: string; i: number }
  | { k: 'memrd'; id: string; port: number; i: number }
  | { k: 'cell'; id: string };

/** State keys for memory contents and for clocked read-port output registers. */
const memKey = (id: string) => `mem:${id}`;
const memRdKey = (id: string, port: number) => `memrd:${id}:${port}`;

export class NetlistSim {
  inputs: SimPort[] = [];
  outputs: SimPort[] = [];
  dffs: SimDff[] = [];
  mems: SimMem[] = [];
  hasClock = false;
  hasReset = false;
  /** Cell types encountered that this simulator does not model (drive x). */
  unsupported: string[] = [];
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
      if (isDffType(c.type)) {
        const q = c.connections.Q ?? [];
        const type = c.type.toLowerCase();
        const dff: SimDff = {
          id, q, d: c.connections.D ?? [],
          en: c.connections.EN?.[0], enPol: pBool(c.parameters?.EN_POLARITY ?? '1'),
          arst: c.connections.ARST?.[0], arstPol: pBool(c.parameters?.ARST_POLARITY ?? '1'),
          arstVal: pBig(c.parameters?.ARST_VALUE),
          srst: c.connections.SRST?.[0], srstPol: pBool(c.parameters?.SRST_POLARITY ?? '1'),
          srstVal: pBig(c.parameters?.SRST_VALUE),
          // $sdffce gates its synchronous reset behind the enable; $sdffe does not.
          srstGatedByEn: /sdffce/.test(type),
          isLatch: /dlatch/.test(type),
        };
        this.dffs.push(dff);
        if (!dff.isLatch) this.hasClock = true;
        if (dff.arst != null || dff.srst != null) this.hasReset = true;
        q.forEach((b, i) => { if (typeof b === 'number') this.driver.set(b, { k: 'dff', id, i }); });
      } else if (/^\$mem/i.test(c.type)) {
        const width = pNum(c.parameters?.WIDTH);
        const size = pNum(c.parameters?.SIZE);
        const rdPorts = pNum(c.parameters?.RD_PORTS);
        const wrPorts = pNum(c.parameters?.WR_PORTS);
        const rdClkEn = c.parameters?.RD_CLK_ENABLE ?? '';
        const rdAddr = c.connections.RD_ADDR ?? [];
        const rdData = c.connections.RD_DATA ?? [];
        const rdEn = c.connections.RD_EN ?? [];
        const wrAddr = c.connections.WR_ADDR ?? [];
        const wrData = c.connections.WR_DATA ?? [];
        const wrEn = c.connections.WR_EN ?? [];
        const abits = rdPorts ? rdAddr.length / rdPorts : (wrPorts ? wrAddr.length / wrPorts : 0);

        const rd: SimMemPortR[] = [];
        for (let p = 0; p < rdPorts; p++) {
          rd.push({
            addr: rdAddr.slice(p * abits, (p + 1) * abits),
            data: rdData.slice(p * width, (p + 1) * width),
            en: rdEn[p],
            // RD_CLK_ENABLE is a bit per port, written MSB-first.
            clocked: rdClkEn ? rdClkEn[rdClkEn.length - 1 - p] === '1' : false,
          });
        }
        const wr: SimMemPortW[] = [];
        for (let p = 0; p < wrPorts; p++) {
          wr.push({
            addr: wrAddr.slice(p * abits, (p + 1) * abits),
            data: wrData.slice(p * width, (p + 1) * width),
            en: wrEn.slice(p * width, (p + 1) * width),
          });
        }
        const mem: SimMem = {
          id, width, size, offset: pNum(c.parameters?.OFFSET),
          rd, wr, init: parseMemInit(c.parameters?.INIT, size, width),
        };
        this.mems.push(mem);
        if (rd.some((r) => r.clocked) || wr.length) this.hasClock = true;
        // A clocked read port's data register is state; an async one is combinational.
        rd.forEach((r, i) => r.data.forEach((b, j) => {
          if (typeof b === 'number') this.driver.set(b, r.clocked ? { k: 'memrd', id, port: i, i: j } : { k: 'cell', id });
        }));
      } else {
        const dirs = c.port_directions ?? {};
        for (const [pn, bits] of Object.entries(c.connections)) {
          const dir = dirs[pn] ?? (['Y', 'Q', 'X'].includes(pn) ? 'output' : 'input');
          if (dir === 'output') bits.forEach((b) => { if (typeof b === 'number') this.driver.set(b, { k: 'cell', id }); });
        }
      }
    }
  }

  /** Seed every flip-flop to 0 and every memory to its INIT (or 0). */
  initRegs(): Map<string, Val[]> {
    const m = new Map<string, Val[]>();
    for (const d of this.dffs) m.set(d.id, d.q.map(() => 0 as Val));
    this.seedMems(m);
    return m;
  }

  /** Seed every flip-flop to its reset value (used by the schematic's reset button). */
  applyReset(): Map<string, Val[]> {
    const m = new Map<string, Val[]>();
    for (const d of this.dffs) {
      const rv = d.arst != null ? d.arstVal : d.srst != null ? d.srstVal : 0n;
      m.set(d.id, d.q.map((_, i) => Number((rv >> BigInt(i)) & 1n) as Val));
    }
    this.seedMems(m);
    return m;
  }

  private seedMems(m: Map<string, Val[]>): void {
    for (const mem of this.mems) {
      const cells: Val[] = new Array(mem.size * mem.width).fill(0 as Val);
      mem.init.forEach((word, w) => {
        if (word == null) return;
        for (let b = 0; b < mem.width; b++) cells[w * mem.width + b] = Number((word >> BigInt(b)) & 1n) as Val;
      });
      m.set(memKey(mem.id), cells);
      mem.rd.forEach((r, i) => { if (r.clocked) m.set(memRdKey(mem.id, i), r.data.map(() => 0 as Val)); });
    }
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
      } else if (drv?.k === 'memrd') {
        r = regs.get(memRdKey(drv.id, drv.port))?.[drv.i] ?? null;
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
      if (isDffType(c.type)) return;
      // memories: only ASYNC read ports resolve combinationally (clocked ones are state)
      if (/^\$mem/i.test(c.type)) {
        const mem = this.mems.find((m) => m.id === id);
        if (!mem) return;
        const cells = regs.get(memKey(id));
        for (const r of mem.rd) {
          if (r.clocked) continue;
          const addr = readBus(r.addr);
          const word = addr === null ? null : this.readMemWord(mem, cells, Number(addr));
          r.data.forEach((b, i) => write(b, word ? word[i] ?? null : null));
        }
        return;
      }
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
        // Dynamic bit/part selects. Yosys lowers `vec[idx]` and `vec[idx +: N]`
        // to these: Y[i] takes A[i + B], with B signed (a negative amount shifts
        // the window the other way). Out-of-range reads are 0 for $shift and x
        // for $shiftx — which is what makes an overrun part-select visible.
        case '$shift': case '$shiftx': {
          const amt = readBus(B, bS);
          if (!Y) break;
          const fill: Val = t === '$shiftx' ? null : 0;
          if (amt === null) { writeBus(Y, null); break; }
          for (let i = 0; i < Y.length; i++) {
            const idx = BigInt(i) + amt;
            const inRange = idx >= 0n && idx < BigInt((A ?? []).length);
            write(Y[i], inRange ? bitVal(A![Number(idx)]) : fill);
          }
          break;
        }
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
          if (!this.unsupported.includes(c.type)) this.unsupported.push(c.type);
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

  /** One word of memory as LSB-first bits, or null if the address is out of range. */
  private readMemWord(mem: SimMem, cells: Val[] | undefined, addr: number): Val[] | null {
    const idx = addr - mem.offset;
    if (!cells || idx < 0 || idx >= mem.size) return null;
    return cells.slice(idx * mem.width, (idx + 1) * mem.width);
  }

  /**
   * Compute next state on a rising clock edge: flip-flops, memory writes, and
   * clocked read-port output registers.
   *
   * Control priority matches the Yosys cell library — an async reset overrides
   * everything, a sync reset overrides the enable except on $sdffce, and the
   * enable otherwise decides between loading D and holding.
   */
  nextRegs(drive: Map<string, bigint>, forces: Map<number, 0 | 1>, regs: Map<string, Val[]>): Map<string, Val[]> {
    const v = this.settle(drive, forces, regs);
    const read = (b: Bitref): Val => (typeof b === 'string' ? (b === '1' ? 1 : b === '0' ? 0 : null) : (forces.get(b as number) ?? v.get(b as number) ?? null));
    const active = (b: Bitref | undefined, pol: boolean): boolean => {
      if (b == null) return false;
      const val = read(b);
      return pol ? val === 1 : val === 0;
    };
    const spread = (val: bigint, width: number): Val[] =>
      Array.from({ length: width }, (_, i) => Number((val >> BigInt(i)) & 1n) as Val);

    const next = new Map<string, Val[]>();

    for (const d of this.dffs) {
      const cur = regs.get(d.id) ?? d.q.map(() => 0 as Val);
      const en = d.en == null ? true : active(d.en, d.enPol);

      // A transparent latch follows D while enabled and holds otherwise — it has
      // no clock edge, so its "next" state is just its settled value.
      if (d.isLatch) { next.set(d.id, en ? d.d.map(read) : cur); continue; }

      if (active(d.arst, d.arstPol)) { next.set(d.id, spread(d.arstVal, d.q.length)); continue; }

      const srstOn = active(d.srst, d.srstPol);
      if (srstOn && (!d.srstGatedByEn || en)) { next.set(d.id, spread(d.srstVal, d.q.length)); continue; }

      next.set(d.id, en ? d.d.map(read) : cur);
    }

    for (const mem of this.mems) {
      const cells = (regs.get(memKey(mem.id)) ?? new Array(mem.size * mem.width).fill(0 as Val)).slice();
      for (const w of mem.wr) {
        const addr = readBusOf(w.addr, read);
        if (addr === null) continue;
        const idx = Number(addr) - mem.offset;
        if (idx < 0 || idx >= mem.size) continue;
        // WR_EN carries one enable bit per data bit (byte-enables land here too).
        for (let b = 0; b < mem.width; b++) {
          if (read(w.en[b]) === 1) cells[idx * mem.width + b] = read(w.data[b]);
        }
      }
      next.set(memKey(mem.id), cells);

      // Clocked read ports latch the addressed word — using the PRE-write contents,
      // matching the non-transparent read-first behaviour Yosys infers by default.
      mem.rd.forEach((r, i) => {
        if (!r.clocked) return;
        const cur = regs.get(memRdKey(mem.id, i)) ?? r.data.map(() => 0 as Val);
        if (r.en != null && read(r.en) !== 1) { next.set(memRdKey(mem.id, i), cur); return; }
        const addr = readBusOf(r.addr, read);
        const word = addr === null ? null : this.readMemWord(mem, regs.get(memKey(mem.id)), Number(addr));
        next.set(memRdKey(mem.id, i), word ?? r.data.map(() => null as Val));
      });
    }

    return next;
  }
}

/** Read a bit vector (LSB-first) through an arbitrary bit reader. */
function readBusOf(bits: Bitref[], read: (b: Bitref) => Val): bigint | null {
  let acc = 0n;
  for (let i = 0; i < bits.length; i++) {
    const v = read(bits[i]);
    if (v === null) return null;
    if (v) acc |= 1n << BigInt(i);
  }
  return acc;
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
