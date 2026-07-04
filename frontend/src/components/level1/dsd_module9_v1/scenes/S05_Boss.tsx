import React from 'react';
import { QuizArena, Problem } from '../components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#a78bfa';

const PROBLEMS: Problem[] = [
  {
    id: 'b1', badge: 'CLASSIFY', badgeColor: '#22d3ee',
    prompt: 'Which circuit is sequential rather than combinational?',
    options: [
      'A 4-bit ripple-carry adder',
      'A 3-to-8 decoder',
      'A 4-bit up-counter',
      'A priority encoder',
    ],
    correct: 2,
    explain:
      'The counter holds and updates a running value across clock edges, so it depends on its own past state - sequential. The adder, decoder and encoder all compute purely from their present inputs.',
  },
  {
    id: 'b2', badge: 'NOW vs THEN', badgeColor: '#a78bfa',
    prompt: 'A full adder and a register both appear in a CPU\'s datapath. Which needs a clock?',
    options: [
      'Both need a clock',
      'Only the register; the full adder is combinational',
      'Only the full adder; the register is combinational',
      'Neither needs a clock',
    ],
    correct: 1,
    explain:
      'The full adder is pure combinational arithmetic - give it inputs and the answer settles after the gate delay. The register is sequential and captures on the clock edge. Adders compute; registers remember.',
  },
  {
    id: 'b3', badge: 'ADDER MATH', badgeColor: '#f59e0b',
    prompt: 'A full adder gets A = 0, B = 1, Cin = 1. What are Sum and Cout?',
    options: [
      'S = 0, Cout = 1',
      'S = 1, Cout = 0',
      'S = 1, Cout = 1',
      'S = 0, Cout = 0',
    ],
    correct: 0,
    explain:
      '0 + 1 + 1 = 2, which is 10 in binary: Sum = 0, Cout = 1. Two inputs are 1 (an even count) so the XOR sum is 0, and a pair is a majority so the carry goes high.',
  },
  {
    id: 'b4', badge: 'SUM RULE', badgeColor: '#22d3ee',
    prompt: 'The Sum output of an adder uses XOR because XOR computes...',
    options: [
      'whether all inputs agree',
      'modulo-2 addition: 1 when an odd number of inputs are 1',
      'the majority of the inputs',
      'the logical AND of the inputs',
    ],
    correct: 1,
    explain:
      'XOR is addition without the carry - it gives the parity bit. The sum digit of a column is 1 exactly when an odd number of bits in that column are 1, which is precisely what chained XOR produces.',
  },
  {
    id: 'b5', badge: 'TIMING', badgeColor: '#34d399',
    prompt: 'Why does a wide ripple-carry adder limit a processor\'s clock speed?',
    options: [
      'It stores too many bits between cycles',
      'The carry must propagate through every stage, and the clock can only tick once that settles',
      'It needs one clock edge per bit',
      'Its flip-flops have long hold times',
    ],
    correct: 1,
    explain:
      'The result is not valid until the carry has rippled from the lowest bit to the highest - a combinational propagation delay. The clock period must be longer than that worst-case path, so a long ripple chain caps the frequency. Carry-lookahead shortens it.',
  },
  {
    id: 'b6', badge: 'MEMORY', badgeColor: '#a78bfa',
    prompt: 'What lets a sequential circuit physically remember a bit that combinational logic cannot?',
    options: [
      'More gates',
      'A feedback loop (cross-coupled gates) that settles into a stable state',
      'A faster clock',
      'A larger power supply',
    ],
    correct: 1,
    explain:
      'Memory comes from feedback. Cross-coupled gates drive each other and lock into one of two stable states, holding the bit after the input is gone. Combinational logic is feed-forward only, so it has nothing to hold.',
  },
  {
    id: 'b7', badge: 'BUILDING BLOCK', badgeColor: '#f59e0b',
    prompt: 'A full adder is assembled from two half adders and which extra gate?',
    options: [
      'An AND gate',
      'An XOR gate',
      'An OR gate merging the two partial carries',
      'A NOT gate on the Sum',
    ],
    correct: 2,
    explain:
      'HA1 and HA2 each produce a partial carry; an OR gate merges them into Cout. Because the two partial carries can never both be 1, the OR is lossless. Two halves plus one OR make a whole.',
  },
  {
    id: 'b8', badge: 'CLOCKING', badgeColor: '#22d3ee',
    prompt: 'In a synchronous system, when do all the flip-flops capture their inputs?',
    options: [
      'Whenever their data inputs change',
      'On the same active clock edge, together',
      'One after another, in a ripple',
      'Continuously while the clock is high',
    ],
    correct: 1,
    explain:
      'Synchronous means every flip-flop samples on the same clock edge - the drummer\'s beat. That shared instant is what keeps the whole circuit\'s state consistent and makes timing analysis tractable.',
  },
  {
    id: 'b9', badge: 'SELECT LOGIC', badgeColor: '#34d399',
    prompt: 'An ALU uses a multiplexer to pick between "add" and "AND" results. The MUX is...',
    options: [
      'sequential, because it chooses over time',
      'combinational, because its output depends only on the current select and data inputs',
      'a memory element',
      'a kind of flip-flop',
    ],
    correct: 1,
    explain:
      'A MUX is pure combinational selection: given the select bits and the data inputs right now, it routes one through immediately. No clock, no stored state - the railway lever just points to the chosen track.',
  },
  {
    id: 'b10', badge: 'INTEGRATION', badgeColor: '#a78bfa',
    prompt: 'A counter that increments by 1 each cycle must contain which combinational block inside it?',
    options: [
      'A decoder',
      'An adder (to compute current value + 1)',
      'A priority encoder',
      'Only flip-flops, nothing combinational',
    ],
    correct: 1,
    explain:
      'A counter is sequential on the outside but holds a combinational adder inside: each cycle it adds 1 to the stored value and the register latches the result on the edge. Combinational arithmetic wrapped in sequential memory - the whole module in one circuit.',
  },
];

export const S05_Boss: React.FC<Props> = ({ isDarkMode }) => (
  <div className="max-w-6xl mx-auto">
    <TryItYourself />
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 06 · Mixed Boss Round"
    title="Mixed Boss Round"
    intro="No topic labels to lean on. These ten questions shuffle combinational, sequential and adders together - and several force you to connect them, the way they actually combine inside a real datapath. Aim for a clean sweep."
    problems={PROBLEMS}
    closer="Boss cleared. Hit the cheatsheet to lock in the one-page summary, share the deck, then take it to the workbench."
    />
  </div>
);

export default S05_Boss;
