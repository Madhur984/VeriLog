import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../../dsd_module9_v1/components/QuizArena';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#a78bfa';

const PROBLEMS: Problem[] = [
  {
    id: 'sa1', badge: 'DEFINITION', badgeColor: '#38bdf8',
    prompt: 'What defines a serial adder?',
    options: [
      'It adds all bits at once using one full adder per bit',
      'It adds two numbers one bit per clock cycle using a single reused full adder',
      'It can only add 1-bit numbers',
      'It stores both numbers in a single flip-flop',
    ],
    correct: 1,
    explain:
      'A serial adder processes one pair of bits per clock cycle through a single full adder, lowest bit first. It trades time (N cycles) for space (one adder instead of N) - the single-lane toll booth.',
  },
  {
    id: 'sa2', badge: 'HARDWARE', badgeColor: '#38bdf8',
    prompt: 'How many full adders does an N-bit serial adder contain?',
    options: ['N full adders', 'N/2 full adders', 'Exactly one, reused every cycle', 'Two: one for sum, one for carry'],
    correct: 2,
    explain:
      'Just one. The same full adder is reused on every clock cycle, which is the whole point: a parallel adder needs N of them, the serial adder needs one. That is the space it saves.',
  },
  {
    id: 'sa3', badge: 'THE CARRY', badgeColor: '#f59e0b',
    prompt: 'Between two clock cycles, where is the carry kept?',
    options: [
      'In one of the shift registers',
      'It is recomputed from scratch each cycle',
      'In a D flip-flop, to become the next cycle\'s carry-in',
      'It is discarded; serial adders ignore carries',
    ],
    correct: 2,
    explain:
      'The carry-out is clocked into a D flip-flop - the booth\'s clipboard - and handed back as the carry-in for the next bit. Without that one-bit memory, a serial adder would be a full adder that forgets.',
  },
  {
    id: 'sa4', badge: 'TIMING', badgeColor: '#34d399',
    prompt: 'How many clock cycles does a serial adder need to add two 8-bit numbers?',
    options: ['1 cycle', '4 cycles', '8 cycles', '16 cycles'],
    correct: 2,
    explain:
      'One cycle per bit, so an 8-bit addition takes 8 cycles. In general an N-bit serial addition needs N clock cycles - the time grows with the size of the numbers.',
  },
  {
    id: 'sa5', badge: 'TRADE-OFF', badgeColor: '#a78bfa',
    prompt: 'Compared with a parallel adder, the serial adder is...',
    options: [
      'Faster and smaller',
      'Slower but much smaller (less hardware and area)',
      'Faster but much larger',
      'Identical in every way',
    ],
    correct: 1,
    explain:
      'Serial trades speed for size. It takes many clock cycles instead of one, but uses a single full adder plus a flip-flop instead of N full adders. Time for space.',
  },
  {
    id: 'sa6', badge: 'OPERANDS', badgeColor: '#38bdf8',
    prompt: 'How are the two numbers supplied to the full adder?',
    options: [
      'From two shift registers, lowest bit first, one pair per cycle',
      'All bits in parallel on a wide bus',
      'From the carry flip-flop',
      'They are hard-wired into the adder',
    ],
    correct: 0,
    explain:
      'Two shift registers (A and B) hold the operands and shift right each clock, presenting the next-lowest pair of bits to the adder. They are the queues of cars feeding the single booth.',
  },
  {
    id: 'sa7', badge: 'RESET', badgeColor: '#f59e0b',
    prompt: 'Before a fresh addition begins, the carry flip-flop must be...',
    options: [
      'set to 1',
      'cleared to 0',
      'left at whatever it held before',
      'disconnected from the adder',
    ],
    correct: 1,
    explain:
      'The lowest bit has no carry coming in, so the flip-flop must start at 0 - exactly like a full adder with Cin = 0 on bit 0. A leftover 1 from a previous sum would corrupt the new result.',
  },
  {
    id: 'sa8', badge: 'FIRST TICK', badgeColor: '#34d399',
    prompt: 'On the very first clock tick of adding 1011 and 0110, what enters the full adder?',
    options: [
      'A=1, B=0, Cin=0 (the most-significant bits)',
      'A=1, B=0, Cin=0 (the least-significant bits)',
      'A=1, B=1, Cin=1',
      'The whole numbers at once',
    ],
    correct: 1,
    explain:
      'Lowest bit first: the LSBs are A=1 (from 1011) and B=0 (from 0110), with Cin=0 from the cleared flip-flop. Sum=1, Cout=0. The booth always starts with the rightmost cars in each queue.',
  },
  {
    id: 'sa9', badge: 'ANALOGY', badgeColor: '#a78bfa',
    prompt: 'In the toll-booth analogy, what does the ticket the booth prints represent?',
    options: [
      'The sum bit',
      'The clock signal',
      'The carry bit handed to the next car',
      'The operand being added',
    ],
    correct: 2,
    explain:
      'The ticket is the carry. The booth prints it, clips it to the clipboard (the flip-flop), and gives it to the next car in line as its carry-in. The booth itself is the full adder.',
  },
  {
    id: 'sa10', badge: 'APPLICATION', badgeColor: '#38bdf8',
    prompt: 'Why might a smartwatch use a serial adder instead of a parallel one?',
    options: [
      'Because it needs the absolute fastest arithmetic possible',
      'Because chip area and power are scarce, and a few extra cycles are acceptable',
      'Because serial adders cannot make mistakes',
      'Because it has no clock signal',
    ],
    correct: 1,
    explain:
      'Wearables are constrained by silicon area and battery, not by raw speed. The serial adder\'s tiny footprint and low power are worth the extra clock cycles - exactly the trade it is built to make.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Serial adder', def: 'Adds two numbers one bit per clock cycle with a single reused full adder, lowest bit first. Trades time for space.' },
  { term: 'Carry flip-flop', def: 'A D flip-flop that stores the carry-out each cycle and feeds it back as the next cycle\'s carry-in. Cleared to 0 before a new addition.' },
  { term: 'Shift registers', def: 'Two registers (A and B) hold the operands and shift right each clock, presenting the next pair of bits to the adder.' },
  { term: 'N bits = N cycles', def: 'An N-bit serial addition takes N clock cycles; the final carry forms the top result bit.' },
  { term: 'Parallel vs serial', def: 'Parallel: N full adders, one cycle, large. Serial: one full adder, N cycles, compact. Opposite ends of the same trade.' },
  { term: 'Where serial wins', def: 'Area- and power-constrained designs: microcontrollers, IoT sensors, wearables - where space beats speed.' },
];

export const S06_Practice: React.FC<Props> = ({ isDarkMode }) => (
  <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 07 · Practice Arena"
    title="Boss Drill"
    intro="The definition, the one full adder, the carry flip-flop, N cycles, the trade-off and the toll-booth mapping - every beat of the module is in here. Each question explains itself the instant you answer. Aim for 10/10."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="One chapter left: the cheatsheet, the Verilog, and where to take this next."
  />
);

export default S06_Practice;
