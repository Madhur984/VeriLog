import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../components/QuizArena';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#f59e0b';

const PROBLEMS: Problem[] = [
  {
    id: 's1', badge: 'DEFINITION', badgeColor: '#a78bfa',
    prompt: 'What distinguishes sequential logic from combinational logic?',
    options: [
      'Sequential logic uses more gates',
      'Its output depends on the current inputs AND the stored past state',
      'It cannot use a clock',
      'It can only output a single bit',
    ],
    correct: 1,
    explain:
      'Sequential logic remembers. Its output is a function of the present inputs plus the state held from the past - the cricket scoreboard adding this ball to the old total. That memory is what combinational logic lacks.',
  },
  {
    id: 's2', badge: 'LATCH vs FF', badgeColor: '#a78bfa',
    prompt: 'What is the key difference between a latch and a flip-flop?',
    options: [
      'A latch is level-sensitive; a flip-flop is edge-triggered',
      'A flip-flop cannot store a bit',
      'A latch needs a clock but a flip-flop does not',
      'They are two names for the same circuit',
    ],
    correct: 0,
    explain:
      'A latch is transparent across a whole clock level (Q follows D while enable is high). A flip-flop only captures at the instant of the clock edge - the camera shutter. Edge-triggering is what makes synchronous design predictable.',
  },
  {
    id: 's3', badge: 'D FLIP-FLOP', badgeColor: '#22d3ee',
    prompt: 'On the active clock edge, a D flip-flop does what?',
    options: [
      'Copies D to Q and holds it until the next edge',
      'Inverts whatever is on Q',
      'Outputs D continuously while the clock is high',
      'Adds D to its stored value',
    ],
    correct: 0,
    explain:
      'Q takes the value of D at the edge and freezes it until the next edge. Whatever D does between edges is ignored. This snapshot-and-hold behaviour is the atom of every register and pipeline stage.',
  },
  {
    id: 's4', badge: 'THE CLOCK', badgeColor: '#34d399',
    prompt: 'What is the clock\'s job in a synchronous circuit?',
    options: [
      'It supplies power to the flip-flops',
      'It makes every flip-flop sample on the same edge, advancing the circuit in lockstep',
      'It stores the circuit\'s state',
      'It chooses which input a multiplexer selects',
    ],
    correct: 1,
    explain:
      'The clock is the drummer. By having every flip-flop capture on the same edge, the whole circuit moves forward exactly one synchronised step per cycle, instead of millions of parts updating at random.',
  },
  {
    id: 's5', badge: 'FEEDBACK', badgeColor: '#a78bfa',
    prompt: 'How does a simple memory cell physically hold a bit?',
    options: [
      'A capacitor inside the gate stores charge forever',
      'Cross-coupled gates feed their outputs back as inputs, holding a stable loop',
      'The clock keeps re-sending the value',
      'It writes the value to an external file',
    ],
    correct: 1,
    explain:
      'Storage comes from feedback. Two cross-coupled gates drive each other, so the loop settles into one of two stable states and stays there - the light switch that stays on after your finger leaves. Combinational logic has no such loop.',
  },
  {
    id: 's6', badge: 'COUNTER', badgeColor: '#22d3ee',
    prompt: 'A mod-10 counter is currently at 9. What value does it hold after the next clock edge?',
    options: ['10', '0', '8', 'It freezes at 9'],
    correct: 1,
    explain:
      'A mod-N counter wraps: after N-1 it rolls back to 0. A mod-10 counter counts 0 through 9 then returns to 0, which is exactly how a single decimal digit behaves. Internally it is flip-flops plus an adder and a wrap-detect.',
  },
  {
    id: 's7', badge: 'REGISTER', badgeColor: '#34d399',
    prompt: 'An 8-bit register is built from how many D flip-flops, and how do they update?',
    options: [
      'One flip-flop, updated eight times per cycle',
      'Eight flip-flops sharing one clock, all updating together on the edge',
      'Eight flip-flops each with its own independent clock',
      'It uses latches, not flip-flops, so it has no clock',
    ],
    correct: 1,
    explain:
      'A register is a row of D flip-flops on a common clock - the lockers opened by one bell. Eight bits means eight flip-flops, and they all capture their inputs together on the same edge, storing one 8-bit word in parallel.',
  },
  {
    id: 's8', badge: 'STATE MACHINE', badgeColor: '#a78bfa',
    prompt: 'In a finite state machine, what holds the "current state" between clock cycles?',
    options: [
      'A combinational decoder',
      'A state register made of flip-flops',
      'The multiplexer on the inputs',
      'Nothing - the state is recomputed from scratch each cycle',
    ],
    correct: 1,
    explain:
      'An FSM is a state register (flip-flops) wrapped in combinational logic: one block computes the next state from the current state and inputs, the register latches it on the edge, and another block drives the outputs. The register is the memory that makes it sequential.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Sequential logic', def: 'Output depends on current inputs and stored past state. Needs memory elements and, in synchronous designs, a clock.' },
  { term: 'Latch vs flip-flop', def: 'A latch is level-sensitive (transparent while enabled); a flip-flop is edge-triggered (captures only at the clock edge).' },
  { term: 'D flip-flop', def: 'On the active clock edge, Q takes the value of D and holds it until the next edge. The atom of synchronous state.' },
  { term: 'Counter', def: 'A register that increments on each clock edge. A mod-N counter wraps from N-1 back to 0. Flip-flops plus an adder.' },
  { term: 'Register', def: 'A group of D flip-flops on a shared clock, storing an N-bit word in parallel, all updating on the same edge.' },
  { term: 'Finite state machine', def: 'A state register plus combinational next-state and output logic. The register is what carries state across cycles.' },
];

export const S03_Sequential: React.FC<Props> = ({ isDarkMode }) => (
  <div className="max-w-6xl mx-auto">
    <TryItYourself />
    <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 04 · Sequential Drill"
    title="Sequential Drill"
    intro="Logic that remembers: latches, flip-flops, the clock, counters and registers. Here the output depends on the past as well as the present - and a clock decides when the past updates."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="You have drilled the 'now' and the 'then'. Next they meet: adders are combinational, but chained registers of them are how a CPU adds across cycles."
    />
  </div>
);

export default S03_Sequential;
