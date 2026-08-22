/**
 * The live-probe model behind the Sandbox's interactive schematic.
 *
 * Kept out of the component because it is the part with actual behaviour: how a
 * driven input becomes a value on every wire, what a clock edge does to state,
 * and how replaying a recorded trace reproduces the same thing cycle by cycle.
 * The component's job is only to paint what these functions return.
 *
 * Everything here runs against the SAME `netlistSim` the grader uses, on the
 * SAME netlist the schematic was drawn from — so a value shown on a wire is the
 * value the simulator computed, not a second, prettier approximation of it.
 */
import { busValue, type NetlistSim, type Val } from '../../engine/verilog/netlistSim';
import type { NetInfo } from '../../engine/verilog/schematic/yosysToSvg';
import type { Trace } from '../../engine/verilog/simRunner';

/** Names that read like a clock / reset, matching the rest of the sandbox. */
const CLOCK_NAMES = /^(clk|clock|clk_i|i_clk|clki|sysclk|clk_in)$/i;
const RESET_NAMES = /^(rst|reset|rst_n|resetn|reset_n|nrst|n_rst|arst|arst_n|rst_i|i_rst)$/i;

export const isClockName = (n: string): boolean => CLOCK_NAMES.test(n);
export const isResetName = (n: string): boolean => RESET_NAMES.test(n);
export const isActiveLowReset = (n: string): boolean => /_n$/i.test(n) || /^n_?rst/i.test(n);

/** Machine state of the probe: what is driven, what is forced, what is stored. */
export interface ProbeState {
  drive: Map<string, bigint>;
  forces: Map<number, 0 | 1>;
  regs: Map<string, Val[]>;
  /** Clock edges applied since reset — the "time" readout. */
  cycle: number;
}

export function initialState(sim: NetlistSim): ProbeState {
  const drive = new Map<string, bigint>();
  for (const p of sim.inputs) drive.set(p.name, 0n);
  // An active-low reset idles HIGH; starting it at 0 would hold the design in
  // reset forever and make the schematic look dead.
  for (const p of sim.inputs) {
    if (isResetName(p.name) && isActiveLowReset(p.name)) drive.set(p.name, mask(p.width));
  }
  return { drive, forces: new Map(), regs: sim.initRegs(), cycle: 0 };
}

const mask = (w: number): bigint => (1n << BigInt(w)) - 1n;

/** Clamp a user-entered value to the port's width. */
export const clampToWidth = (v: bigint, width: number): bigint => {
  const m = mask(width);
  const x = v & m;
  return x < 0n ? 0n : x;
};

/** Combinational settle at the current state. */
export const valuesOf = (sim: NetlistSim, s: ProbeState): Map<number, Val> =>
  sim.settle(s.drive, s.forces, s.regs);

/**
 * Advance one clock edge.
 *
 * The clock port itself is never part of `drive`: netlistSim models edges by
 * recomputing register state, not by toggling a clock net, so "stepping" is
 * exactly one call to nextRegs.
 */
export function step(sim: NetlistSim, s: ProbeState): ProbeState {
  return { ...s, regs: sim.nextRegs(s.drive, s.forces, s.regs), cycle: s.cycle + 1 };
}

/** Pulse reset for one edge and return to cycle 0. */
export function resetState(sim: NetlistSim, s: ProbeState): ProbeState {
  return { ...s, regs: sim.initRegs(), cycle: 0 };
}

export interface NetValue {
  netId: string;
  /** null when any bit is x/unknown. */
  num: bigint | null;
  anyHigh: boolean;
  anyX: boolean;
  width: number;
}

/** Resolve every drawn net to a value, for painting and for the overlay. */
export function netValues(
  netIndex: Map<string, NetInfo>,
  values: Map<number, Val>,
): Map<string, NetValue> {
  const out = new Map<string, NetValue>();
  for (const net of netIndex.values()) {
    const { num, anyHigh, anyX } = busValue(net.bits, values);
    out.set(net.id, { netId: net.id, num, anyHigh, anyX, width: net.bits.length });
  }
  return out;
}

/** The class the wire is painted with — drives colour and flow animation. */
export function stateOf(v: NetValue | undefined): 'x' | 'high' | 'low' {
  if (!v || v.anyX) return 'x';
  return v.anyHigh ? 'high' : 'low';
}

/** Hex for buses, plain 0/1 for single bits, `x` when unknown. */
export function label(v: NetValue): string {
  if (v.anyX) return 'x';
  if (v.width === 1) return v.anyHigh ? '1' : '0';
  return v.num === null ? 'x' : `0x${v.num.toString(16).toUpperCase()}`;
}

/**
 * Replay a recorded run into the probe, so scrubbing the cycle slider shows
 * INTERNAL wire values, not just the port values the trace stores.
 *
 * The trace only records top-level signals. Re-driving the simulator from those
 * inputs and stepping to the requested cycle reconstructs every internal net at
 * that moment — which is the whole point of watching values flow through the
 * diagram rather than reading them off a waveform.
 *
 * O(cycle) per scrub, with cycle capped at 512 by the sandbox's own control, so
 * a full-length scrub is a few hundred settles — cheap enough to run on input.
 */
export function replayTo(sim: NetlistSim, trace: Trace, cycle: number): ProbeState {
  const inputs = new Map(
    trace.signals.filter((s) => s.role === 'input').map((s) => [s.name, s.values]),
  );
  const driveAt = (i: number): Map<string, bigint> => {
    const d = new Map<string, bigint>();
    for (const p of sim.inputs) {
      const series = inputs.get(p.name);
      const raw = series?.[i];
      d.set(p.name, typeof raw === 'bigint' ? clampToWidth(raw, p.width)
        : typeof raw === 'number' ? clampToWidth(BigInt(raw), p.width)
          : 0n);
    }
    return d;
  };

  const target = Math.max(0, Math.min(cycle, trace.cycles - 1));
  let regs = sim.initRegs();
  const forces = new Map<number, 0 | 1>();
  for (let i = 0; i < target; i++) regs = sim.nextRegs(driveAt(i), forces, regs);
  return { drive: driveAt(target), forces, regs, cycle: target };
}
