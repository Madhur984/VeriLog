/**
 * simRunner — drives a compiled Yosys netlist with a stimulus program and
 * records a multi-bit trace of every port, cycle by cycle.
 *
 * This is the shared execution core behind both grading (run student and
 * reference, diff the traces) and the waveform viewer (render the trace). It
 * deliberately knows nothing about problems: give it a netlist and vectors and
 * it returns values.
 */
import { buildSim, type NetlistSim, type SimPort, type Val } from './netlistSim';
import type { Vector } from './stimulus';

/** A port's value each cycle; `null` marks an unknown (x) result. */
export interface TraceSignal {
  name: string;
  width: number;
  role: 'input' | 'output';
  values: (bigint | null)[];
}

export interface Trace {
  cycles: number;
  signals: TraceSignal[];
}

export interface PortInfo { name: string; width: number; direction: 'input' | 'output' }

export type BuildResult =
  | { ok: true; sim: NetlistSim; ports: PortInfo[]; moduleName: string }
  | { ok: false; error: string };

interface NetlistJson {
  modules?: Record<string, { attributes?: Record<string, unknown> }>;
}

/** Name of the module Yosys selected as top, for module-name validation. */
export function topModuleName(json: string): string | null {
  try {
    const data = JSON.parse(json) as NetlistJson;
    const mods = data.modules ?? {};
    const names = Object.keys(mods);
    if (!names.length) return null;
    const isTop = (m: { attributes?: Record<string, unknown> }) => {
      const t = m.attributes?.top;
      return t === 1 || t === '1' || (typeof t === 'string' && /1$/.test(t));
    };
    return names.find((n) => isTop(mods[n])) ?? names[0];
  } catch {
    return null;
  }
}

export function buildFromNetlist(json: string): BuildResult {
  const sim = buildSim(json);
  if (!sim) return { ok: false, error: 'Synthesis produced no usable netlist.' };
  const ports: PortInfo[] = [
    ...sim.inputs.map((p) => ({ name: p.name, width: p.width, direction: 'input' as const })),
    ...sim.outputs.map((p) => ({ name: p.name, width: p.width, direction: 'output' as const })),
  ];
  return { ok: true, sim, ports, moduleName: topModuleName(json) ?? '(top)' };
}

/** Read one settled port as an unsigned value, or null if any bit is x. */
export function readPort(port: SimPort, vals: Map<number, Val>): bigint | null {
  let acc = 0n;
  for (let i = 0; i < port.bits.length; i++) {
    const b = port.bits[i];
    const v: Val = typeof b === 'string' ? (b === '1' ? 1 : b === '0' ? 0 : null) : vals.get(b) ?? null;
    if (v === null) return null;
    if (v === 1) acc |= 1n << BigInt(i);
  }
  return acc;
}

export interface RunOptions {
  /** Clock port name — when set, each vector is one clock cycle. */
  clock?: string;
  /** Ports to record. Defaults to every port on the design. */
  record?: string[];
}

/**
 * Run `vectors` against a netlist.
 *
 * Combinational (no clock): each vector is applied and the outputs settle.
 * Sequential: each vector is applied, the clock edge is taken, and the outputs
 * are sampled AFTER the edge — the same thing a testbench sees when it samples
 * on the following cycle.
 */
export function runTrace(sim: NetlistSim, vectors: Vector[], opts: RunOptions = {}): Trace {
  const clocked = !!opts.clock && sim.hasClock;
  const wanted = opts.record ? new Set(opts.record) : null;

  const inPorts = sim.inputs.filter((p) => p.name !== opts.clock);
  const outPorts = sim.outputs;
  const signals: TraceSignal[] = [
    ...inPorts.filter((p) => !wanted || wanted.has(p.name))
      .map((p) => ({ name: p.name, width: p.width, role: 'input' as const, values: [] as (bigint | null)[] })),
    ...outPorts.filter((p) => !wanted || wanted.has(p.name))
      .map((p) => ({ name: p.name, width: p.width, role: 'output' as const, values: [] as (bigint | null)[] })),
  ];
  const byName = new Map(signals.map((s) => [s.name, s]));

  let regs = sim.initRegs();
  const forces = new Map<number, 0 | 1>();

  for (const vec of vectors) {
    const drive = new Map<string, bigint>();
    for (const p of sim.inputs) drive.set(p.name, vec[p.name] ?? 0n);
    if (opts.clock) drive.set(opts.clock, 0n);

    if (clocked) regs = sim.nextRegs(drive, forces, regs);
    const vals = sim.settle(drive, forces, regs);

    for (const p of inPorts) byName.get(p.name)?.values.push(vec[p.name] ?? 0n);
    for (const p of outPorts) byName.get(p.name)?.values.push(readPort(p, vals));
  }

  return { cycles: vectors.length, signals };
}
