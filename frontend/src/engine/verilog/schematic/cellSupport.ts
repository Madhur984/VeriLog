/**
 * The contract between three lists that must not drift apart:
 *
 *   1. cell types netlistSim.ts can EVALUATE
 *   2. cell types judge.skin.svg can DRAW
 *   3. cell types Yosys actually EMITS for our pipeline
 *
 * netlistsvg's failure mode when a type is missing from the skin is to fall
 * through to `s:type="generic"` and draw an anonymous box — the schematic still
 * "works", it just quietly stops meaning anything. That is precisely the kind of
 * failure that survives review, so this module makes it loud: the skin's aliases
 * are parsed at load, checked against the netlist before rendering, and any
 * unknown type is reported rather than drawn.
 *
 * The simulator list is derived from netlistSim.ts by inspection rather than
 * imported, because netlistSim dispatches on a switch and two regexes with no
 * exported manifest. `cellSupport.test.ts` re-derives it from that file's source
 * text and fails if the two disagree, so this copy cannot rot silently.
 */

/** Word-level combinational cells netlistSim evaluates in `evalCell`. */
export const SIM_COMBINATIONAL = [
  '$add', '$sub', '$mul', '$div', '$mod', '$neg',
  '$and', '$or', '$xor', '$xnor', '$not',
  '$logic_and', '$logic_or', '$logic_not',
  '$reduce_and', '$reduce_or', '$reduce_xor', '$reduce_xnor', '$reduce_bool',
  '$eq', '$ne', '$eqx', '$nex', '$lt', '$le', '$gt', '$ge',
  '$shl', '$shr', '$sshl', '$sshr', '$shift', '$shiftx',
  '$mux', '$pmux',
] as const;

/** Gate-level primitives (only reachable if techmap/abc are ever enabled). */
export const SIM_PRIMITIVES = [
  '$_AND_', '$_OR_', '$_XOR_', '$_XNOR_', '$_NOT_', '$_MUX_',
] as const;

/** Anything netlistSim treats as state: the `DFF_RE` family plus memories. */
export const SIM_STATEFUL = [
  '$dff', '$dffe', '$adff', '$adffe', '$sdff', '$sdffe', '$sdffce',
  '$aldff', '$aldffe', '$dffsr', '$dffsre',
  '$dlatch', '$adlatch', '$dlatchsr',
  '$mem', '$mem_v2',
] as const;

/** Everything the simulator can evaluate, and therefore must be drawable. */
export const SIMULATED_CELL_TYPES: readonly string[] = [
  ...SIM_COMBINATIONAL, ...SIM_PRIMITIVES, ...SIM_STATEFUL,
];

/**
 * Pseudo-cells netlistsvg synthesizes itself for module boundaries, constants
 * and bus splitting. They never appear in a Yosys netlist and are matched by
 * their own aliases in the skin.
 */
export const SYNTHETIC_TYPES: readonly string[] = [
  '$_inputExt_', '$_outputExt_', '$_constant_', '$_split_', '$_join_',
];

/**
 * Every `<s:alias val="…">` the skin declares. Parsed from the skin text rather
 * than hand-listed, so adding a symbol automatically widens support and removing
 * one automatically narrows it.
 */
export function skinAliases(skin: string): Set<string> {
  return new Set(
    [...skin.matchAll(/<s:alias\s+val="([^"]+)"/g)].map((m) => m[1]),
  );
}

/** Cell types present in a Yosys netlist, across every module it contains. */
export function netlistCellTypes(netlist: unknown): string[] {
  const mods = (netlist as { modules?: Record<string, { cells?: Record<string, { type?: string }> }> })
    ?.modules ?? {};
  const out = new Set<string>();
  for (const m of Object.values(mods)) {
    for (const c of Object.values(m.cells ?? {})) if (c.type) out.add(c.type);
  }
  return [...out].sort();
}

export interface SupportReport {
  /** Types in the netlist with no symbol — these would render as blank boxes. */
  unsupported: string[];
  /** Types present that are drawable but NOT simulatable (drawn, never valued). */
  undrivenBySim: string[];
  types: string[];
}

/**
 * Check a netlist against the skin before rendering.
 *
 * A user sub-module instantiated by name (`\my_adder`) is legitimately absent
 * from the skin — netlistsvg renders it as a labelled generic box on purpose,
 * which is the correct depiction of a black box. Only `$`-prefixed built-ins are
 * held to the "must have a symbol" rule.
 */
export function checkCellSupport(netlist: unknown, skin: string): SupportReport {
  const aliases = skinAliases(skin);
  const types = netlistCellTypes(netlist);
  const builtin = types.filter((t) => t.startsWith('$'));
  return {
    types,
    unsupported: builtin.filter((t) => !aliases.has(t)),
    undrivenBySim: builtin.filter(
      (t) => aliases.has(t) && !SIMULATED_CELL_TYPES.includes(t)),
  };
}

/** Thrown when a netlist contains a built-in cell the skin cannot draw. */
export class UnsupportedCellError extends Error {
  readonly cellTypes: string[];
  constructor(cellTypes: string[]) {
    super(
      `The schematic skin has no symbol for ${cellTypes.join(', ')}. `
      + 'Rendering would show an unlabelled box instead of the real gate. '
      + 'Add a symbol with a matching <s:alias> to judge.skin.svg.',
    );
    this.name = 'UnsupportedCellError';
    this.cellTypes = cellTypes;
  }
}
