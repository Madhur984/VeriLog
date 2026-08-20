/**
 * Problem schema for the Verilog judge (v2).
 *
 * The v1 bank (data/verilogProblems.ts) described single-bit combinational logic
 * and carried a hand-written JavaScript `golden` per problem. That does not
 * scale past toy gates: a 4-bit ALU or a FIFO would need its whole behaviour
 * re-implemented in TypeScript, and any mismatch between the JS model and the
 * Verilog intent becomes a wrong grade.
 *
 * v2 grades DIFFERENTIALLY instead. Each problem ships a reference `solution` in
 * Verilog; the judge synthesizes it alongside the student's design, drives both
 * with identical stimulus, and compares outputs. The Verilog reference is the
 * spec, so a problem only has to declare its ports and how to exercise them.
 */
import type { StimulusSpec } from '../../engine/verilog/stimulus';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** Curriculum tracks, ordered as they appear in the UI. */
export type TrackId =
  | 'gates'
  | 'combinational'
  | 'arithmetic'
  | 'sequential'
  | 'shift'
  | 'counters'
  | 'fsm'
  | 'memory'
  | 'waveform';

export interface Track {
  id: TrackId;
  title: string;
  blurb: string;
  /** lucide-react icon name, resolved in the UI */
  icon: string;
  /** accent hue used for the track chip in both themes */
  accent: string;
}

export const TRACKS: Track[] = [
  { id: 'gates', title: 'Gates & Primitives', blurb: 'Boolean logic, universal gates, compound cells.', icon: 'Binary', accent: '#10b981' },
  { id: 'combinational', title: 'Combinational Blocks', blurb: 'Muxes, decoders, encoders, shifters.', icon: 'Network', accent: '#06b6d4' },
  { id: 'arithmetic', title: 'Arithmetic & Datapath', blurb: 'Adders, comparators, ALUs, converters.', icon: 'Calculator', accent: '#8b5cf6' },
  { id: 'sequential', title: 'Sequential Logic', blurb: 'Flip-flops, registers, resets, pipelines.', icon: 'Clock', accent: '#f59e0b' },
  { id: 'shift', title: 'Shift Registers', blurb: 'SISO/SIPO/PISO, LFSRs, delay lines.', icon: 'MoveRight', accent: '#ec4899' },
  { id: 'counters', title: 'Counters', blurb: 'Up/down, modulo-N, Gray, ring, Johnson.', icon: 'Hash', accent: '#f43f5e' },
  { id: 'fsm', title: 'Finite State Machines', blurb: 'Moore, Mealy, encodings, safe recovery.', icon: 'GitBranch', accent: '#3b82f6' },
  { id: 'memory', title: 'Memory & Interfaces', blurb: 'RAMs, FIFOs, CDC, handshakes.', icon: 'Database', accent: '#14b8a6' },
  { id: 'waveform', title: 'Waveform & Timing', blurb: 'PWM, pulse generators, encoders, measurement.', icon: 'Activity', accent: '#a855f7' },
];

/** A port on the design under test. */
export interface VPort {
  name: string;
  /** Bit width; 1 for a scalar. */
  width: number;
  /** Rendered as signed in the waveform/table and in examples. */
  signed?: boolean;
  /** Short description shown in the port table. */
  note?: string;
}

/** A worked example row shown in the problem statement. */
export interface VExampleRow {
  in: Record<string, number | string>;
  out: Record<string, number | string>;
  note?: string;
}

export interface VProblemV2 {
  id: string;
  number: number;
  title: string;
  track: TrackId;
  difficulty: Difficulty;
  tags: string[];

  /** Prose statement; blank lines separate paragraphs. Markdown-ish inline code. */
  statement: string;
  /** Why this shows up in real silicon — rendered as a callout. */
  context?: string;
  hint?: string;

  /** The module name the student MUST use (checked against the synthesized top). */
  moduleName: string;
  inputs: VPort[];
  outputs: VPort[];
  /** Clock port name for sequential designs; omit for combinational. */
  clock?: string;
  /** Reset port, used to drive a defined start-of-run state. */
  reset?: { name: string; activeLow: boolean };

  /** Rules echoed under the statement (module name, port list, style limits). */
  constraints?: string[];
  examples?: VExampleRow[];

  starter: string;
  /** Reference design — the executable spec. Never shown before a solve. */
  solution: string;
  /** How to exercise the design. Defaults are usually right. */
  stimulus?: StimulusSpec;

  /** Post-solve explanation: the architecture, trade-offs, interview follow-ups. */
  editorial?: string;
}

export const isSequential = (p: VProblemV2): boolean => !!p.clock;

/** Total input bit-width, used to pick exhaustive vs sampled grading. */
export const inputBits = (p: VProblemV2): number =>
  p.inputs.filter((i) => i.name !== p.clock).reduce((n, i) => n + i.width, 0);
