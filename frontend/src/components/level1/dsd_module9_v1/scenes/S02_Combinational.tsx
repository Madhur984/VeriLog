import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#f59e0b';

const PROBLEMS: Problem[] = [
  {
    id: 'c1', badge: 'DEFINITION', badgeColor: '#22d3ee',
    prompt: 'What makes a circuit combinational?',
    options: [
      'Its output depends only on the current inputs, with no stored state',
      'It updates only on a clock edge',
      'It always contains at least one flip-flop',
      'It remembers its previous output',
    ],
    correct: 0,
    explain:
      'Combinational logic is a pure function of the present inputs. No clock, no memory: the same inputs always produce the same outputs after the gate delay. The moment a circuit must remember anything, it becomes sequential.',
  },
  {
    id: 'c2', badge: 'MULTIPLEXER', badgeColor: '#f59e0b',
    prompt: 'How many select lines does an 8-to-1 multiplexer need?',
    options: ['8', '4', '3', '2'],
    correct: 2,
    explain:
      'A MUX with N inputs needs ceil(log2 N) select lines. log2 8 = 3, so three select bits address all eight inputs (000 to 111). The railway-points lever needs exactly enough positions to pick every incoming track.',
  },
  {
    id: 'c3', badge: 'MULTIPLEXER', badgeColor: '#f59e0b',
    prompt: 'Which expression describes a 2-to-1 MUX with select S, inputs D0 and D1?',
    options: [
      'Y = D0 · D1',
      'Y = S̄·D0 + S·D1',
      'Y = S·D0 + S̄·D1',
      'Y = S ⊕ D0 ⊕ D1',
    ],
    correct: 1,
    explain:
      'When S = 0 the output is D0; when S = 1 it is D1. So Y = S̄·D0 + S·D1. The select bit ANDs through exactly one data input and the OR merges the chosen one to the output.',
  },
  {
    id: 'c4', badge: 'DECODER', badgeColor: '#22d3ee',
    prompt: 'A 3-to-8 decoder receives the input 101. What appears on its outputs?',
    options: [
      'All eight outputs go high',
      'Outputs 1, 0 and 1 go high',
      'Exactly output line 5 goes high, the rest stay low',
      'The output is undefined without a clock',
    ],
    correct: 2,
    explain:
      'A decoder is one-hot: each input code drives exactly one output high. 101 in binary is 5, so output line 5 activates and the other seven stay low - just like one room number lighting one room.',
  },
  {
    id: 'c5', badge: 'ENCODER', badgeColor: '#34d399',
    prompt: 'What does a priority encoder do when several of its inputs are active at once?',
    options: [
      'It outputs the binary index of the highest-priority active input',
      'It adds the active input numbers together',
      'It outputs all the active lines unchanged',
      'It holds the previous value until only one input is active',
    ],
    correct: 0,
    explain:
      'A priority encoder breaks ties by rank: among all the active inputs it reports the binary code of the highest-priority one. The fire panel ignores the lower floors and names the top-priority alarm.',
  },
  {
    id: 'c6', badge: 'CLASSIFY', badgeColor: '#f59e0b',
    prompt: 'Which of these is NOT a combinational circuit?',
    options: [
      'A 4-bit adder',
      'A multiplexer',
      'A 4-bit counter',
      'A priority encoder',
    ],
    correct: 2,
    explain:
      'A counter holds a running value and changes it on each clock edge, so it depends on its own past state - that is sequential. Adders, MUXes and encoders compute purely from their current inputs.',
  },
  {
    id: 'c7', badge: 'GATE LOGIC', badgeColor: '#22d3ee',
    prompt: 'An AND gate feeding combinational enable logic outputs 1 when...',
    options: [
      'at least one input is 1',
      'the inputs differ',
      'every input is 1',
      'an odd number of inputs are 1',
    ],
    correct: 2,
    explain:
      'Y = A·B is high only when all inputs are high - the two-key locker. This is why enables are ANDed: a memory write fires only when chip-select AND write-enable agree.',
  },
  {
    id: 'c8', badge: 'BUILD-UP', badgeColor: '#34d399',
    prompt: 'Why can any truth table be built from a decoder plus an OR gate?',
    options: [
      'The decoder generates every minterm as a one-hot line; OR the rows where the output is 1',
      'Decoders can store the truth table in memory',
      'An OR gate can compute any Boolean function on its own',
      'It cannot - you always need a multiplexer',
    ],
    correct: 0,
    explain:
      'A full decoder produces one line per input combination (every minterm). To build any function, simply OR together the decoder lines for the rows where the output should be 1. It is the sum-of-minterms form turned into hardware.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Combinational logic', def: 'Output is a pure function of the current inputs. No clock and no stored state, so identical inputs always give identical outputs.' },
  { term: 'Multiplexer', def: 'An N-to-1 selector with ceil(log2 N) select lines. Routes one chosen data input to the output. 2:1 MUX: Y = S̄·D0 + S·D1.' },
  { term: 'Decoder', def: 'An n-to-2^n circuit that drives exactly one output high (one-hot) for each input code. Expands a compact code into select lines.' },
  { term: 'Priority encoder', def: 'Collapses a one-hot or many-hot input into the binary index of the highest-priority active line, breaking ties by rank.' },
  { term: 'Minterm realisation', def: 'A decoder emits every minterm as a one-hot line; ORing the lines where the function is 1 builds any Boolean function.' },
];

export const S02_Combinational: React.FC<Props> = ({ isDarkMode }) => (
  <div className="max-w-6xl mx-auto">
    <TryItYourself />
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 03 · Combinational Drill"
    title="Combinational Drill"
    intro="Logic with no memory: gates, multiplexers, decoders and encoders. Every output here is decided entirely by what is on the inputs right now. Answer each question to unlock its walkthrough."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="Combinational is the 'now'. Next up is the 'then' - sequential logic, where the circuit finally gets to remember."
    />
  </div>
);

export default S02_Combinational;
