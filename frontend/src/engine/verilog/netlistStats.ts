/**
 * Netlist statistics — the "what did this actually synthesize to" report.
 *
 * Equivalent to what `yosys stat` prints, computed from the JSON netlist the
 * worker already returns so no second synthesis run is needed. This is the
 * difference between "my code compiles" and "my code is 40 gates and 4
 * flip-flops": correctness is table stakes, cost is the part hardware people
 * argue about.
 */

/** Yosys writes parameters either as a decimal string or as a bit string. */
function paramInt(v: unknown): number | null {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (/^[01]+$/.test(t) && t.length > 1) return parseInt(t, 2);
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

interface RawCell {
  type?: string;
  parameters?: Record<string, unknown>;
}
interface RawPort {
  direction?: string;
  bits?: unknown[];
}
interface RawModule {
  attributes?: Record<string, unknown>;
  ports?: Record<string, RawPort>;
  cells?: Record<string, RawCell>;
  netnames?: Record<string, { hide_name?: number; bits?: unknown[] }>;
}

export interface CellCount {
  /** Raw Yosys type, e.g. `$dff` or `$_NAND_`. */
  type: string;
  /** Readable label, e.g. `DFF` or `NAND`. */
  label: string;
  count: number;
  /** Total bit-width across all instances, when the cells carry a WIDTH. */
  bits: number;
}

export interface SynthStats {
  top: string;
  cells: CellCount[];
  totalCells: number;
  /** Storage bits inferred as flip-flops or latches. */
  flopBits: number;
  /** Bits held in inferred memories (`$mem_v2`). */
  memBits: number;
  ports: { name: string; direction: string; width: number }[];
  /** Named nets Yosys kept (a rough proxy for how much survived optimization). */
  namedNets: number;
}

const FLOP = /^\$(_?[SA]?DFFE?|_?DFF|_?ALDFFE?|_?SDFFC?E?|dff|dffe|adff|adffe|sdff|sdffe|sdffce|aldff|aldffe|dlatch|adlatch|_DLATCH)/i;
const MEM = /^\$mem/i;

/** `$_NAND_` -> `NAND`, `$add` -> `ADD`, `$mem_v2` -> `MEM`. */
function labelOf(type: string): string {
  const t = type.replace(/^\$_?/, '').replace(/_$/, '');
  if (/^mem/i.test(t)) return 'MEM';
  return t.toUpperCase();
}

/** Pick the module Yosys marked as top, else the first one. */
function topOf(modules: Record<string, RawModule>): string | null {
  const names = Object.keys(modules);
  if (!names.length) return null;
  const isTop = (m: RawModule) => {
    const t = m.attributes?.top;
    return t === 1 || t === '1' || (typeof t === 'string' && /1$/.test(t));
  };
  return names.find((n) => isTop(modules[n])) ?? names[0];
}

export function analyzeNetlist(json: string): SynthStats | null {
  let data: { modules?: Record<string, RawModule> };
  try {
    data = JSON.parse(json) as { modules?: Record<string, RawModule> };
  } catch {
    return null;
  }
  const modules = data.modules ?? {};
  const top = topOf(modules);
  if (!top) return null;
  const mod = modules[top];

  const byType = new Map<string, { count: number; bits: number }>();
  let flopBits = 0;
  let memBits = 0;

  for (const cell of Object.values(mod.cells ?? {})) {
    const type = cell.type ?? '(unknown)';
    const width = paramInt(cell.parameters?.WIDTH) ?? 1;
    const entry = byType.get(type) ?? { count: 0, bits: 0 };
    entry.count += 1;
    entry.bits += width;
    byType.set(type, entry);

    if (FLOP.test(type)) flopBits += width;
    if (MEM.test(type)) {
      // A memory's capacity is its word width times its depth.
      const w = paramInt(cell.parameters?.WIDTH) ?? 0;
      const size = paramInt(cell.parameters?.SIZE) ?? 0;
      memBits += w * size;
    }
  }

  const cells: CellCount[] = [...byType.entries()]
    .map(([type, v]) => ({ type, label: labelOf(type), count: v.count, bits: v.bits }))
    // Busiest first; ties broken by name so the table is stable between runs.
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const ports = Object.entries(mod.ports ?? {}).map(([name, p]) => ({
    name,
    direction: p.direction ?? 'unknown',
    width: (p.bits ?? []).length,
  }));

  const namedNets = Object.values(mod.netnames ?? {})
    .filter((n) => n.hide_name !== 1).length;

  return {
    top,
    cells,
    totalCells: cells.reduce((n, c) => n + c.count, 0),
    flopBits,
    memBits,
    ports,
    namedNets,
  };
}
