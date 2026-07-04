import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#f59e0b';

const PROBLEMS: Problem[] = [
  {
    id: 'a1', badge: 'HALF ADDER', badgeColor: '#22d3ee',
    prompt: 'Which pair of expressions defines a half adder?',
    options: [
      'Sum = A·B, Carry = A⊕B',
      'Sum = A⊕B, Carry = A·B',
      'Sum = A+B, Carry = A·B',
      'Sum = A⊕B⊕Cin, Carry = A·B',
    ],
    correct: 1,
    explain:
      'A half adder adds two bits: Sum = A⊕B (1 when the inputs differ) and Carry = A·B (1 only on 1+1). The marble box shows the digit on XOR and overflows into the tray on AND.',
  },
  {
    id: 'a2', badge: 'THE GAP', badgeColor: '#fb7185',
    prompt: 'Why can a half adder NOT be chained to build a multi-bit adder?',
    options: [
      'It has no carry-in to receive the carry from the previous column',
      'Its outputs are too slow',
      'It produces two carries that conflict',
      'It can only add even numbers',
    ],
    correct: 0,
    explain:
      'The half adder has no Cin port. Column addition needs each stage to accept the carry coming from the column on its right - and the half adder simply has nowhere to plug that wire in. That missing input is the entire reason the full adder exists.',
  },
  {
    id: 'a3', badge: 'FULL ADDER', badgeColor: '#a78bfa',
    prompt: 'What is the Sum expression for a full adder?',
    options: [
      'S = A·B·Cin',
      'S = A⊕B⊕Cin',
      'S = (A+B)·Cin',
      'S = A⊕B + Cin',
    ],
    correct: 1,
    explain:
      'The full-adder Sum is the triple XOR, S = A⊕B⊕Cin. It is 1 when an odd number of the three inputs are 1. In hardware it is two 2-input XORs in series: (A⊕B) first, then ⊕ Cin.',
  },
  {
    id: 'a4', badge: 'FULL ADDER', badgeColor: '#f59e0b',
    prompt: 'Which expression equals the full-adder carry-out Cout?',
    options: [
      'A·B·Cin',
      'A + B + Cin',
      'A·B + A·Cin + B·Cin',
      '(A⊕B)·(B⊕Cin)',
    ],
    correct: 2,
    explain:
      'Cout = AB + ACin + BCin is the majority function: one AND per input pair, merged by OR. If any two inputs are 1 the column overflows, so the carry goes high.',
  },
  {
    id: 'a5', badge: 'EXTREME ROW', badgeColor: '#fb7185',
    prompt: 'For a full adder, A = 1, B = 1, Cin = 1. What are the outputs?',
    options: [
      'S = 0, Cout = 1',
      'S = 1, Cout = 1',
      'S = 1, Cout = 0',
      'S = 0, Cout = 0',
    ],
    correct: 1,
    explain:
      '1 + 1 + 1 = 3, which is 11 in binary. The low bit (1) stays as the Sum and the high bit (1) leaves as Cout. It is the only row where both outputs are 1: odd count satisfies the XOR, majority satisfies the carry.',
  },
  {
    id: 'a6', badge: 'ARCHITECTURE', badgeColor: '#a78bfa',
    prompt: 'How is a full adder built from smaller blocks?',
    options: [
      'Three half adders in a triangle',
      'Two half adders cascaded, with their carries merged by an OR gate',
      'One half adder and two OR gates',
      'A single 3-input XOR gate alone',
    ],
    correct: 1,
    explain:
      'HA1 adds A and B (partial sum P, carry C1). HA2 adds Cin to P (final Sum, carry C2). An OR gate merges C1 and C2 into Cout - the two packers and the shipping dock. Two trusted half adders plus one gate.',
  },
  {
    id: 'a7', badge: 'THE OR GATE', badgeColor: '#34d399',
    prompt: 'Why is a plain OR gate safe for merging the two partial carries C1 and C2?',
    options: [
      'It is not - the design really needs an XOR there',
      'C1 and C2 can never both be 1 at the same time, so OR loses nothing',
      'Because OR gates are faster than AND gates',
      'The OR gate also produces the Sum',
    ],
    correct: 1,
    explain:
      'C1 = A·B is 1 only when A and B are both 1 - but then P = A⊕B = 0, forcing C2 = P·Cin = 0. The two carries are mutually exclusive, so the humble OR merges them without ever losing a carry.',
  },
  {
    id: 'a8', badge: 'CASCADING', badgeColor: '#f59e0b',
    prompt: 'How do full adders add two 8-bit numbers, and what is the catch?',
    options: [
      'One full adder loops 8 times; there is no catch',
      'Eight full adders chain Cout to Cin; the catch is the carry must ripple through all 8 stages',
      'Eight half adders run in parallel with no carry path',
      'They cannot - 8-bit addition needs a multiplier',
    ],
    correct: 1,
    explain:
      'Eight full adders chain, each Cout feeding the next Cin - the bucket brigade. That is a ripple-carry adder. The catch: the top bit cannot settle until the carry has propagated through every stage below it, which is why wide CPUs use carry-lookahead instead.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Half adder', def: 'Adds two bits. Sum = A⊕B, Carry = A·B. No carry-in, so it cannot be chained into multi-bit addition.' },
  { term: 'Full adder', def: 'Adds A, B and Cin. Sum = A⊕B⊕Cin, Cout = AB+ACin+BCin. Built from two half adders plus an OR gate.' },
  { term: 'Sum rule (modulo-2)', def: 'The Sum is 1 when an odd number of inputs are 1. Computed by chained XOR: A⊕B, then ⊕ Cin.' },
  { term: 'Carry rule (majority)', def: 'Cout is 1 when any two or all three inputs are 1 - the Boolean majority function, one AND per pair feeding an OR.' },
  { term: 'Mutually exclusive carries', def: 'C1 = A·B and C2 = (A⊕B)·Cin can never both be 1, which is why a plain OR can merge them safely.' },
  { term: 'Ripple-carry adder', def: 'N full adders chained Cout to Cin add two N-bit numbers. Simple but slow: the carry propagates through every stage.' },
];

export const S04_Adders: React.FC<Props> = ({ isDarkMode }) => (
  <div className="max-w-6xl mx-auto">
    <TryItYourself />
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 05 · Adders Drill"
    title="Adders Drill"
    intro="From the half adder's missing wire to the full adder's two-halves architecture and the ripple-carry chain. This is the payoff of the whole arithmetic arc - prove every rule."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="That is the adder story end to end. One round left: the Mixed Boss draws from all three topics at once."
    />
  </div>
);

export default S04_Adders;
