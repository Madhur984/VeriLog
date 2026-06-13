import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Share2, RotateCw } from 'lucide-react';
import { FlashCardDeck, DeckCard } from '../components/FlashCardDeck';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ROSE = '#fb7185';

/**
 * The Recall Deck - the module's opening "brief". Twenty shareable flip cards,
 * each carrying the exact analogy we taught a concept with on the front and the
 * real logic on the back. The analogies deliberately echo the DSD track
 * (the tea vendor, the cricket scoreboard, the marble box, the packing station)
 * so flipping the deck is a fast re-grounding before the drills.
 */
const CARDS: DeckCard[] = [
  // ── combinational ──
  {
    id: 'comb-def', concept: 'Combinational logic', category: 'comb',
    analogy: 'A vending machine with no memory: the snack you get depends only on the buttons pressed right now, never on what you bought yesterday.',
    logic: 'Output is a pure function of the present inputs only. No clock and no stored state, so identical inputs always give identical outputs after the gate delay.',
    where: 'Adders, multiplexers, decoders and ALUs - the arithmetic and routing fabric between a CPU\'s registers.',
  },
  {
    id: 'mux', concept: 'Multiplexer (MUX)', category: 'comb',
    analogy: 'A railway points lever: many incoming tracks, but the lever picks exactly which one train reaches the platform.',
    logic: 'An N-to-1 MUX routes one of N data inputs to a single output, chosen by ceil(log2 N) select bits. For a 2:1 MUX, Y = S̄·D0 + S·D1.',
    where: 'Bus routing, register-file read ports, and rebuilding any truth table directly from its rows.',
  },
  {
    id: 'decoder', concept: 'Decoder', category: 'comb',
    analogy: 'A hotel key-card panel: one room number goes in, and exactly one room\'s light switches on.',
    logic: 'An n-to-2^n decoder drives exactly one output high for each input code (one-hot). It expands a compact binary code into individual select lines.',
    where: 'Memory address decoding picks the one row to read, and instruction decoders fan an opcode out to control lines.',
  },
  {
    id: 'encoder', concept: 'Priority encoder', category: 'comb',
    analogy: 'A fire-alarm panel: many floor sensors trip, but it reports the binary number of the highest-priority floor.',
    logic: 'Collapses a one-hot (or many-hot) input into a binary code. A priority encoder outputs the index of the highest-priority active line, breaking ties by rank.',
    where: 'Interrupt controllers report which device to service first; floating-point units use them to find a leading one.',
  },
  {
    id: 'and', concept: 'AND gate', category: 'comb',
    analogy: 'A bank locker that needs two keys turned together: miss either key and it stays shut.',
    logic: 'Y = A·B. The output is 1 only when every input is 1. It is the carry of a half adder.',
    where: 'Enable logic everywhere: a write fires only when chip-select AND write-enable are both high.',
  },
  {
    id: 'xor', concept: 'XOR gate', category: 'comb',
    analogy: 'A two-way staircase switch: flip either switch and the light changes; it is on only when the switches disagree.',
    logic: 'Y = A⊕B. The output is 1 when the inputs differ. XOR is modulo-2 addition - the sum bit of every adder.',
    where: 'Adder sum bits, parity generators in ECC memory, and the mixing step in many ciphers.',
  },
  // ── sequential ──
  {
    id: 'seq-def', concept: 'Sequential logic', category: 'seq',
    analogy: 'A cricket scoreboard: the new total is the old total plus this ball. It has to remember where it was.',
    logic: 'Output depends on the present inputs AND the stored past state. It needs memory elements and, in synchronous designs, a clock to pace updates.',
    where: 'Counters, registers, state machines - anything that must know "what happened before now".',
  },
  {
    id: 'latch', concept: 'D Latch', category: 'seq',
    analogy: 'A door held open by a wedge: while you hold the wedge in, the door follows your hand; pull the wedge and it freezes where it is.',
    logic: 'Level-sensitive memory. A D latch is transparent (Q follows D) while enable is high and holds its last value when enable is low.',
    where: 'Low-power register cells, and accidentally inferred latches when an always block forgets an else (a classic Verilog bug).',
  },
  {
    id: 'dff', concept: 'D Flip-flop', category: 'seq',
    analogy: 'A camera shutter: it freezes whatever D shows at the exact instant of the clock edge, then keeps that snapshot until the next click.',
    logic: 'Edge-triggered memory. Q takes the value of D on the active clock edge and holds it until the next edge - the building block of all synchronous state.',
    where: 'Billions per SoC: every pipeline register, counter bit and state element is a D flip-flop.',
  },
  {
    id: 'clock', concept: 'The clock', category: 'seq',
    analogy: 'A drummer keeping the whole band in time: every musician changes on the beat, together, so the song stays coherent.',
    logic: 'A periodic square wave. Every flip-flop samples on the same edge, so the entire circuit advances one synchronised step per cycle.',
    where: 'A phone SoC beats around 3 billion times a second, generated by a PLL multiplying a crystal oscillator.',
  },
  {
    id: 'counter', concept: 'Counter', category: 'seq',
    analogy: 'A tally clicker at a gate: each press adds one, and it remembers the running total between presses.',
    logic: 'A register that increments its stored value on each clock edge. A mod-N counter wraps back to 0 after N-1; it is flip-flops plus an adder.',
    where: 'Program counters, timers, frequency dividers and address generators.',
  },
  {
    id: 'register', concept: 'Register', category: 'seq',
    analogy: 'A row of lockers all opened by the same bell: each holds one item, and they all update together on the ring.',
    logic: 'A group of D flip-flops sharing one clock, storing an N-bit word in parallel. The unit of state a CPU actually computes on.',
    where: 'The register file, pipeline stage boundaries, and every status/control register in a peripheral.',
  },
  // ── adders ──
  {
    id: 'half-adder', concept: 'Half adder', category: 'adder',
    analogy: 'A single-digit marble box: drop two marbles in and it shows the digit, overflowing to a carry on 1+1 - but it has no slot to receive a carry from the box on its right.',
    logic: 'Adds two 1-bit inputs A, B. Sum = A⊕B, Carry = A·B. With no carry-in, it cannot be chained into multi-bit addition.',
    where: 'The least-significant bit of a simple adder, and a teaching stepping stone to the full adder.',
  },
  {
    id: 'sum-wire', concept: 'The Sum wire (XOR)', category: 'adder',
    analogy: 'Counting marbles by odd or even: the digit you write down is 1 only when you are holding an odd number of them.',
    logic: 'Sum = A⊕B for a half adder, A⊕B⊕Cin for a full adder. XOR is modulo-2 addition: the output is 1 when an odd number of inputs are 1.',
    where: 'The sum output of every adder stage in every ALU.',
  },
  {
    id: 'carry-wire', concept: 'The Carry wire (majority)', category: 'adder',
    analogy: 'An overflow tray under the marble box: it only fills when too many marbles arrive at once.',
    logic: 'Half-adder Carry = A·B. Full-adder Cout = AB + ACin + BCin: the majority function, 1 whenever any two of the three inputs are 1.',
    where: 'The carry path that limits how fast an adder - and therefore a CPU - can run.',
  },
  {
    id: 'full-adder', concept: 'Full adder', category: 'adder',
    analogy: 'A packing station with two packers and a shipping dock: Packer 1 combines A and B, Packer 2 folds in the carry from the previous station, and the dock (an OR gate) ships out one carry.',
    logic: 'Adds A, B and Cin. Sum = A⊕B⊕Cin, Cout = AB+ACin+BCin. Built from two half adders feeding an OR gate.',
    where: 'The repeating cell of every ripple-carry and carry-lookahead adder in hardware.',
  },
  {
    id: 'carry-in', concept: 'The carry-in (Cin)', category: 'adder',
    analogy: 'The baton in a relay race: each runner receives the baton from the one before and passes it on down the line.',
    logic: 'Cin is the carry-out of the previous, less-significant column. This third input is exactly what the half adder lacked, and what lets adders chain.',
    where: 'The wire that connects one full adder to the next inside a multi-bit adder.',
  },
  {
    id: 'ripple', concept: 'Ripple-carry adder', category: 'adder',
    analogy: 'A bucket brigade passing water down a line: each full adder hands its carry to the next, so the carry ripples from the lowest bit up to the highest.',
    logic: 'N full adders chained Cout to Cin add two N-bit numbers. Simple to build, but slow: the carry must propagate through all N stages before the answer settles.',
    where: 'Small or low-cost adders; wide CPUs use carry-lookahead instead to beat the ripple delay.',
  },
  // ── timing ──
  {
    id: 'setup-hold', concept: 'Setup & hold time', category: 'timing',
    analogy: 'Boarding a train: be seated before the doors close (setup), and stay put as it pulls away (hold).',
    logic: 'Data must be stable for a setup window before the clock edge and a hold window after it, or the flip-flop can capture a wrong or unresolved value.',
    where: 'Static timing analysis checks every path; the worst setup path sets the maximum clock frequency.',
  },
  {
    id: 'prop-delay', concept: 'Propagation delay', category: 'timing',
    analogy: 'A line of dominoes: pushing the first does not drop the last instantly; the fall takes time to ripple through.',
    logic: 'Every gate takes a finite time to change its output. The longest combinational path between two registers decides how fast you can clock the design.',
    where: 'The reason a ripple-carry adder is slow, and why deep logic gets pipelined into shorter stages.',
  },
];

export const S01_Deck: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ROSE }}>
          <Layers size={14} /> The Recall Deck · The Brief
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          Flip the analogy, <span style={{ color: ROSE }}>find the logic.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Every card front is the picture we used to teach a concept. The back is the real logic
          underneath it. Skim the deck to re-ground yourself, then hit the drills. Found the one
          card that finally made it click? Share it - it is watermarked and ready to post.
        </p>
      </motion.section>

      {/* how-to strip */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className={`grid sm:grid-cols-3 gap-3`}>
        {[
          [RotateCw, 'Tap to flip', 'Front is the analogy, back is the real logic plus where it lives in real chips.'],
          [Share2, 'Share any card', 'Exports a branded 1080x1080 image with the BitForBytes watermark and an auto caption.'],
          [Layers, 'Filter by topic', 'Combinational, sequential, adders and timing - or search by name.'],
        ].map(([Icon, title, body]) => {
          const I = Icon as React.FC<{ size?: number; style?: React.CSSProperties }>;
          return (
            <div key={title as string} className={`rounded-2xl border p-5 ${cardBg}`}>
              <I size={18} style={{ color: ROSE }} />
              <h3 className={`mt-2.5 text-[15px] font-extrabold ${textColor}`}>{title as string}</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${subText}`}>{body as string}</p>
            </div>
          );
        })}
      </motion.div>

      {/* the deck */}
      <FlashCardDeck cards={CARDS} isDarkMode={isDarkMode} />
    </div>
  );
};

export default S01_Deck;
