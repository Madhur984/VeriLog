/**
 * The v2 Verilog problem bank, assembled from its per-track files.
 *
 * Problems are graded differentially against the reference solution each one
 * ships (see engine/verilog/diffGrade), and the whole bank is validated against
 * the real Yosys engine by problems.test.ts.
 */
import type { VProblemV2, TrackId } from './types';
import { FOUNDATION_PROBLEMS } from './tracks/foundations';
import { GATE_PROBLEMS } from './tracks/gates';
import { COMBINATIONAL_PROBLEMS } from './tracks/combinational';
import { ARITHMETIC_PROBLEMS } from './tracks/arithmetic';
import { SEQUENTIAL_PROBLEMS } from './tracks/sequential';
import { COUNTER_PROBLEMS } from './tracks/counters';
import { SHIFT_PROBLEMS } from './tracks/shift';
import { FSM_PROBLEMS } from './tracks/fsm';
import { MEMORY_PROBLEMS } from './tracks/memory';
import { WAVEFORM_PROBLEMS } from './tracks/waveform';

export * from './types';

export const VERILOG_V2_PROBLEMS: VProblemV2[] = [
  ...FOUNDATION_PROBLEMS,
  ...GATE_PROBLEMS,
  ...COMBINATIONAL_PROBLEMS,
  ...ARITHMETIC_PROBLEMS,
  ...SEQUENTIAL_PROBLEMS,
  ...COUNTER_PROBLEMS,
  ...SHIFT_PROBLEMS,
  ...FSM_PROBLEMS,
  ...MEMORY_PROBLEMS,
  ...WAVEFORM_PROBLEMS,
].sort((a, b) => a.number - b.number);

export const problemsByTrack = (track: TrackId): VProblemV2[] =>
  VERILOG_V2_PROBLEMS.filter((p) => p.track === track);

export const problemById = (id: string): VProblemV2 | undefined =>
  VERILOG_V2_PROBLEMS.find((p) => p.id === id);
