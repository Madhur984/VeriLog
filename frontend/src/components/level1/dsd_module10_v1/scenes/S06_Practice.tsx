import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../../dsd_module9_v1/components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#a78bfa';

const PROBLEMS: Problem[] = [
  {
    id: 'rc1', badge: 'DEFINITION', badgeColor: '#f59e0b',
    prompt: 'What is a ripple-carry adder?',
    options: [
      'A single full adder that adds all bits at once',
      'N full adders chained so each stage\'s carry-out feeds the next stage\'s carry-in',
      'A memory circuit that stores the carry in a flip-flop',
      'An adder with no carry between columns',
    ],
    correct: 1,
    explain:
      'A ripple-carry adder cascades N full adders, wiring each Cout into the next stage\'s Cin. It is the relay team: the carry baton is handed from one runner to the next, lowest bit to highest.',
  },
  {
    id: 'rc2', badge: 'HARDWARE', badgeColor: '#a78bfa',
    prompt: 'How many full adders does an N-bit ripple-carry adder use?',
    options: ['One, reused', 'N/2', 'Exactly N', 'N squared'],
    correct: 2,
    explain:
      'One full adder per bit, so N of them. Each is the identical full adder from Module 08; you just copy it N times and wire the carries. That is why hardware cost scales directly with N.',
  },
  {
    id: 'rc3', badge: 'THE CHAIN', badgeColor: '#f59e0b',
    prompt: 'How are two neighbouring stages connected?',
    options: [
      'The sum of one becomes the input of the next',
      'The carry-out of the lower stage becomes the carry-in of the higher stage',
      'They share the same clock only',
      'They are not connected; each works alone',
    ],
    correct: 1,
    explain:
      'Cout of stage i wires to Cin of stage i+1 - the baton pass. This single dependency is what links the adders into one chain and also what forces them to finish in order.',
  },
  {
    id: 'rc4', badge: 'THE START', badgeColor: '#34d399',
    prompt: 'What carry-in does the lowest stage (bit 0) receive?',
    options: ['Always 1', 'Always 0', 'The carry-out of the top stage', 'A random value'],
    correct: 1,
    explain:
      'The least-significant column has no carry coming into it, so its Cin is tied to 0. That fixed, known value is why runner 1 can start immediately while the others must wait.',
  },
  {
    id: 'rc5', badge: 'TIMING', badgeColor: '#fb7185',
    prompt: 'Why is a wide ripple-carry adder slow?',
    options: [
      'The clock runs too fast',
      'Each stage must wait for the carry from the stage below before it can settle',
      'Full adders are inherently slow circuits',
      'It uses too much memory',
    ],
    correct: 1,
    explain:
      'Every stage is locked out of finishing until its carry-in arrives from the stage below. The inputs are all present at once, but the carries can only ripple through in sequence, so the delays stack up.',
  },
  {
    id: 'rc6', badge: 'THE FORMULA', badgeColor: '#f59e0b',
    prompt: 'Roughly how does the worst-case delay of an N-bit ripple-carry adder grow?',
    options: [
      'It is constant, independent of N',
      'About 2 × N × ΔG - linear in N',
      'About log2(N) × ΔG',
      'About N squared × ΔG',
    ],
    correct: 1,
    explain:
      'Each stage costs roughly two gate delays to settle and pass its carry, and there are N stages in series: total ≈ 2 × N × ΔG. The delay grows in a straight line with the number of bits.',
  },
  {
    id: 'rc7', badge: 'OUTPUT WIDTH', badgeColor: '#34d399',
    prompt: 'Adding two 4-bit numbers, how many bits can the result need?',
    options: ['4 bits', '5 bits (4 sum bits plus the final carry-out)', 'Always 8 bits', '3 bits'],
    correct: 1,
    explain:
      'Two 4-bit numbers can total up to 15 + 15 = 30, which needs 5 bits. The adder produces 4 sum bits plus the final carry-out (Cout) as the most-significant fifth bit.',
  },
  {
    id: 'rc8', badge: 'WORST CASE', badgeColor: '#fb7185',
    prompt: 'For which kind of input does the carry ripple through every single stage?',
    options: [
      'When the two numbers are equal',
      'When a low-bit carry triggers a carry in each successive column (e.g. 0111 + 0001)',
      'When both numbers are zero',
      'When the carry-in is 0',
    ],
    correct: 1,
    explain:
      '0111 + 0001 = 1000: the bit-0 carry forces bit-1 to carry, which forces bit-2, which forces bit-3 - a single ripple all the way up. That longest path is the worst-case delay the hardware must allow for.',
  },
  {
    id: 'rc9', badge: 'WHY WAIT', badgeColor: '#a78bfa',
    prompt: 'All stages get their A and B inputs instantly. Why can\'t they all compute their sums at once?',
    options: [
      'They can; ripple adders are actually instant',
      'Each stage\'s sum depends on its carry-in, which is not known until the lower stage finishes',
      'They share one full adder',
      'The clock only ticks once',
    ],
    correct: 1,
    explain:
      'A stage\'s sum is A ⊕ B ⊕ Cin - it needs the carry-in. Since that carry is produced by the stage below, a stage cannot produce a correct sum until the ripple reaches it. The A and B bits alone are not enough.',
  },
  {
    id: 'rc10', badge: "WHAT'S NEXT", badgeColor: '#f59e0b',
    prompt: 'What is the main idea of the faster adder that replaces ripple-carry?',
    options: [
      'Use a slower clock so the carry has time',
      'Compute all the carries ahead of time, in parallel, instead of rippling them',
      'Remove the carry entirely',
      'Add the numbers one bit per clock cycle',
    ],
    correct: 1,
    explain:
      'The carry-lookahead adder computes every stage\'s carry directly from the inputs, in parallel, so no stage has to wait for the one below. It is the runners all getting the baton at the same instant.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Ripple-carry adder', def: 'N full adders chained Cout→Cin to add two N-bit numbers. The simplest, cheapest multi-bit adder.' },
  { term: 'The carry chain', def: 'Each stage\'s carry-out is the next stage\'s carry-in. Bit 0\'s Cin is tied to 0; the final Cout is the top result bit.' },
  { term: 'Propagation delay', def: 'The physical time for a stage\'s gates to settle. A stage cannot finish until its carry-in has arrived.' },
  { term: 'Worst-case delay', def: 'About 2 × N × ΔG - two gate delays per stage, N stages in series. Linear in the bit width.' },
  { term: 'Output width', def: 'N sum bits plus the final carry-out, so an N-bit add produces up to N+1 result bits.' },
  { term: 'The successor', def: 'The carry-lookahead adder computes carries in parallel from the inputs, removing the ripple wait.' },
];

export const S06_Practice: React.FC<Props> = ({ isDarkMode }) => (
  <div className="space-y-4">
    <div className="max-w-3xl mx-auto"><TryItYourself label="Answer the drill" /></div>
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 07 · Practice Arena"
    title="Relay Drill"
    intro="The chain, the baton, the lowest stage's Cin, the 2·N·ΔG delay, the worst-case ripple and what comes next - every beat of the module is here. Each question explains itself the instant you answer. Aim for 10/10."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="One chapter left: the cheatsheet, the Verilog, and the door to the faster adders."
    />
  </div>
);

export default S06_Practice;
