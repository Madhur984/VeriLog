import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../../dsd_module9_v1/components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#a78bfa';

const PROBLEMS: Problem[] = [
  {
    id: 'cl1', badge: 'CORE IDEA', badgeColor: '#fb923c',
    prompt: 'What is the central idea of a carry look-ahead adder?',
    options: [
      'Add one bit per clock cycle',
      'Compute every carry directly from the inputs, in parallel, instead of rippling',
      'Use a slower clock so the carry has time to settle',
      'Store the carry in a flip-flop between additions',
    ],
    correct: 1,
    explain:
      'Instead of waiting for each carry to ripple in from the stage below, the look-ahead adder computes all carries at once from the input bits. That is the master chef reading the whole ticket and starting every dish together.',
  },
  {
    id: 'cl2', badge: 'GENERATE', badgeColor: '#34d399',
    prompt: 'When does a column GENERATE a carry, and what is the formula?',
    options: [
      'When exactly one bit is 1; G = A ⊕ B',
      'When both bits are 1; G = A · B',
      'When both bits are 0; G = A + B',
      'Whenever the carry-in is 1; G = Cin',
    ],
    correct: 1,
    explain:
      'A column makes a carry on its own only when both bits are 1, so G = A · B (an AND gate). This carry happens regardless of what carry comes in - it is generated from scratch.',
  },
  {
    id: 'cl3', badge: 'PROPAGATE', badgeColor: '#38bdf8',
    prompt: 'When does a column PROPAGATE a carry, and what is the formula?',
    options: [
      'When both bits are 1; P = A · B',
      'When exactly one bit is 1; P = A ⊕ B',
      'Never; columns only generate',
      'When both bits are 0; P = NOT(A + B)',
    ],
    correct: 1,
    explain:
      'A column passes an incoming carry straight through when exactly one of its bits is 1, so P = A ⊕ B (an XOR gate). If a carry arrives, it leaves; if none arrives, none leaves.',
  },
  {
    id: 'cl4', badge: 'THE RECURRENCE', badgeColor: '#a78bfa',
    prompt: 'Which expression gives the carry out of bit i?',
    options: [
      'Ci+1 = Gi · Pi · Ci',
      'Ci+1 = Gi + Pi · Ci',
      'Ci+1 = Ai ⊕ Bi ⊕ Ci',
      'Ci+1 = Gi ⊕ Pi',
    ],
    correct: 1,
    explain:
      'Ci+1 = Gi + Pi·Ci: a carry leaves either because this column generated one (Gi), or because it propagated the incoming carry (Pi·Ci). Expanding Ci repeatedly removes every carry dependency.',
  },
  {
    id: 'cl5', badge: 'WHY FAST', badgeColor: '#34d399',
    prompt: 'Why can all the carries be computed at the same time?',
    options: [
      'Because the clock is very fast',
      'Because each carry equation, once expanded, depends only on G\'s, P\'s and C0 - not on another carry',
      'Because there is only one carry in the whole adder',
      'Because carries are stored in memory',
    ],
    correct: 1,
    explain:
      'Substituting the recurrence into itself rewrites every carry purely in terms of the inputs (G, P, C0). With no carry waiting on another carry, they all resolve together in a fixed number of gate delays.',
  },
  {
    id: 'cl6', badge: 'FIRST CARRY', badgeColor: '#fb923c',
    prompt: 'C1 = G0 + P0·C0. In words, this says C1 is 1 when...',
    options: [
      'bit 0 generates a carry, OR it propagates the incoming carry C0',
      'bit 0 and bit 1 are both 1',
      'the carry-in C0 is 0',
      'both A0 and B0 are 0',
    ],
    correct: 0,
    explain:
      'C1 is 1 if column 0 makes a carry by itself (G0 = 1), or if it passes the carry-in along (P0 = 1 and C0 = 1). The same OR-of-two-cases pattern builds every higher carry.',
  },
  {
    id: 'cl7', badge: 'THE SUM', badgeColor: '#38bdf8',
    prompt: 'Once the carries are known, how is each sum bit computed?',
    options: [
      'Si = Gi · Ci',
      'Si = Pi ⊕ Ci (which equals Ai ⊕ Bi ⊕ Ci)',
      'Si = Ai · Bi',
      'Si = Ci+1',
    ],
    correct: 1,
    explain:
      'Since Pi = Ai ⊕ Bi, the sum bit is Si = Pi ⊕ Ci = Ai ⊕ Bi ⊕ Ci - the same full-adder sum as always. The look-ahead logic only changed how the carry Ci is obtained, not the sum.',
  },
  {
    id: 'cl8', badge: 'G vs P', badgeColor: '#a78bfa',
    prompt: 'Can a single column both generate and propagate at the same time?',
    options: [
      'Yes, always',
      'No - if both bits are 1 (generate), then A ⊕ B = 0, so it cannot propagate',
      'Yes, whenever the carry-in is 1',
      'Only in the lowest column',
    ],
    correct: 1,
    explain:
      'Generate needs both bits 1; propagate needs exactly one bit 1. Those are mutually exclusive: if A·B = 1 then A⊕B = 0. A column either makes a carry or merely passes one, never both.',
  },
  {
    id: 'cl9', badge: 'THE COST', badgeColor: '#fb923c',
    prompt: 'What is the main downside of the carry look-ahead adder?',
    options: [
      'It is slower than ripple carry',
      'It needs more hardware - the parallel carry gates grow large and use more area and power',
      'It cannot produce a carry-out',
      'It only works for 1-bit numbers',
    ],
    correct: 1,
    explain:
      'Speed comes at the cost of silicon. The expanded carry equations need gates with many inputs and lots of wiring, so a look-ahead adder is larger and more power-hungry than a simple ripple adder.',
  },
  {
    id: 'cl10', badge: "WHAT'S NEXT", badgeColor: '#34d399',
    prompt: 'Why is a single flat look-ahead block impractical for 64-bit addition?',
    options: [
      'The carries would be wrong',
      'The carry equations need impossibly large gates (huge fan-in); the fix is multi-level blocks (parallel prefix)',
      'It would be too slow',
      '64-bit numbers cannot be added at all',
    ],
    correct: 1,
    explain:
      'At 64 bits the carry equations contain dozens of terms, demanding gates with unrealizable fan-in. Parallel prefix adders keep the look-ahead speed by stacking look-ahead into a logarithmic tree of small blocks.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Carry look-ahead', def: 'Computes all carries in parallel directly from the inputs, removing the ripple wait.' },
  { term: 'Generate (G)', def: 'G = A·B. The column makes a carry by itself, when both bits are 1.' },
  { term: 'Propagate (P)', def: 'P = A⊕B. The column passes an incoming carry on, when exactly one bit is 1.' },
  { term: 'Carry recurrence', def: 'Ci+1 = Gi + Pi·Ci. Expanded fully, every carry depends only on G\'s, P\'s and C0.' },
  { term: 'Sum bit', def: 'Si = Pi ⊕ Ci = Ai ⊕ Bi ⊕ Ci. Only the carry path changed, not the sum.' },
  { term: 'The trade-off', def: 'Near-constant delay (fast) at the cost of large, complex gates (more area and power).' },
];

export const S06_Practice: React.FC<Props> = ({ isDarkMode }) => (
  <div className="max-w-6xl mx-auto">
    <TryItYourself />
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 07 · Practice Arena"
    title="Look-Ahead Drill"
    intro="Generate and propagate, the carry recurrence, why it is fast, the sum bit, and the hardware cost - every beat of the module is here. Each question explains itself the instant you answer. Aim for 10/10."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="One chapter left: the cheatsheet, the Verilog, and the door to the parallel prefix adder."
    />
  </div>
);

export default S06_Practice;
