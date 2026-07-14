import React, { useMemo, useState } from 'react';
import { Search, Share2, RotateCw, Sparkles } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';

/**
 * The Daily Analogy Library: every VLSI concept explained through a real-world
 * analogy. Cards flip (front: concept + analogy; back: definition, why the
 * analogy maps, where it shows up in real chips) and share as a branded
 * 1080x1080 PNG via the system share sheet, with a download + copied-caption
 * fallback on desktop.
 */

type CatId = 'number' | 'gates' | 'comb' | 'seq' | 'timing' | 'device' | 'cpu' | 'cmos' | 'flow';

const CATEGORIES: Array<{ id: CatId; label: string; color: string }> = [
  { id: 'number', label: 'Number Systems',   color: '#F97316' },
  { id: 'gates',  label: 'Logic Gates',      color: '#F472B6' },
  { id: 'comb',   label: 'Combinational',    color: '#818CF8' },
  { id: 'seq',    label: 'Sequential Logic', color: '#A78BFA' },
  { id: 'timing', label: 'Timing',           color: '#F59E0B' },
  { id: 'device', label: 'Devices',          color: '#2DD4BF' },
  { id: 'cpu',    label: 'CPU & Architecture', color: '#22D3EE' },
  { id: 'cmos',   label: 'CMOS & Physical',  color: '#34D399' },
  { id: 'flow',   label: 'VLSI Flow',        color: '#60A5FA' },
];

interface Analogy {
  id: string;
  concept: string;
  category: CatId;
  analogy: string;
  definition: string;
  why: string;
  chips: string;
}

const ANALOGIES: Analogy[] = [
  // ── logic gates ──
  {
    id: 'and', concept: 'AND gate', category: 'gates',
    analogy: 'A security desk that needs BOTH ID cards before the gate opens.',
    definition: 'Outputs 1 only when every input is 1. For two inputs, Y = A AND B.',
    why: 'One missing ID card (a 0 on either input) keeps the gate shut. Only the full set of credentials opens the way, exactly like the output going high only when all inputs are high.',
    chips: 'Enable logic everywhere: a memory write fires only when chip-select AND write-enable are both active at the same time.',
  },
  {
    id: 'or', concept: 'OR gate', category: 'gates',
    analogy: 'An emergency exit: either door opens the way out.',
    definition: 'Outputs 1 if at least one input is 1. Y = A OR B.',
    why: 'You do not need every door open, any single one is enough. Same with inputs: any 1 drives the output high.',
    chips: 'Interrupt controllers OR dozens of interrupt lines into one "something needs attention" signal for the CPU.',
  },
  {
    id: 'not', concept: 'NOT gate', category: 'gates',
    analogy: 'A day/night street lamp sensor: the output is always the opposite of the input.',
    definition: 'Inverts its single input. Y = NOT A. Also called an inverter.',
    why: 'Daylight in means lamp off; darkness in means lamp on. Input and output can never agree, which is the whole contract of an inverter.',
    chips: 'The most numerous gate on any die. Clock trees and signal buffers are built from chained inverter pairs.',
  },
  {
    id: 'nand', concept: 'NAND gate', category: 'gates',
    analogy: 'A WhatsApp group on mute: quiet unless both people message.',
    definition: 'AND followed by NOT. Output is 0 only when all inputs are 1; otherwise 1.',
    why: 'The group stays quiet (output 1) through anything, until both friends message at once and your phone finally buzzes (output drops to 0).',
    chips: 'The universal gate: any circuit can be built from NAND alone. Flash storage is literally named NAND, and standard-cell libraries lean on it for speed and area.',
  },
  {
    id: 'xor', concept: 'XOR gate', category: 'gates',
    analogy: 'The meeting rule: exactly one person may speak at a time.',
    definition: 'Outputs 1 when the inputs differ. Y = A XOR B.',
    why: 'One speaker is productive (1). Both talking over each other, or total silence, gets nothing done (0). The gate rewards difference.',
    chips: 'The sum bit of every adder, and the heart of parity generators that catch bit errors in ECC memory.',
  },
  {
    id: 'xnor', concept: 'XNOR gate', category: 'gates',
    analogy: 'An agreement detector: output is 1 only when both sides agree.',
    definition: 'The inverse of XOR. Outputs 1 when inputs match (both 0 or both 1).',
    why: 'Two parties shaking hands on the same answer is what fires the output, whether they both said yes or both said no.',
    chips: 'Bitwise comparators: cache hit logic compares address tags using XNOR per bit, then ANDs the agreements together.',
  },
  // ── sequential ──
  {
    id: 'dff', concept: 'D Flip-flop', category: 'seq',
    analogy: 'A photograph: it captures exactly what it sees the instant the shutter clicks, and holds it until the next shot.',
    definition: 'Samples input D on the active clock edge and holds that value at Q until the next edge.',
    why: 'The shutter click is the clock edge. Whatever the scene (D) looked like at that exact instant is frozen in the photo (Q), no matter how the scene changes afterwards.',
    chips: 'Billions per SoC. Every pipeline register, counter bit and state element in a modern chip is a D flip-flop.',
  },
  {
    id: 'sr', concept: 'SR Latch', category: 'seq',
    analogy: 'A light switch with memory: stays ON until you turn it OFF, even after your hand leaves the switch.',
    definition: 'Two cross-coupled gates storing one bit. Set drives Q to 1, Reset drives it to 0, and it holds its state in between.',
    why: 'A tap on Set is your finger flipping the switch up. Remove your finger (deassert the input) and the light stays on, because the loop remembers.',
    chips: 'Debounce circuits, status flags, and the storage core hidden inside many flip-flop standard cells.',
  },
  {
    id: 'jk', concept: 'JK Flip-flop', category: 'seq',
    analogy: 'A politician: can be Set, Reset, or Toggle their position on command.',
    definition: 'Like an SR flip-flop, but the forbidden input combination is repurposed: J=K=1 toggles the output every clock.',
    why: 'Tell them to commit (Set), to walk it back (Reset), or just watch them flip positions on every cycle (Toggle). Every input combination produces a defined behaviour.',
    chips: 'Ripple counters and frequency dividers, especially in older and discrete TTL-era designs.',
  },
  // ── timing ──
  {
    id: 'clock', concept: 'Clock', category: 'timing',
    analogy: 'A heartbeat that keeps every organ (every circuit) in sync.',
    definition: 'A periodic square wave that sequences all state updates: every flip-flop samples on the same edge.',
    why: 'One steady pulse coordinates millions of independent parts, so the whole body moves as one system instead of a million arrhythmic pieces.',
    chips: 'Your phone SoC beats around 3 billion times per second, generated by PLLs multiplying a humble crystal oscillator.',
  },
  {
    id: 'skew', concept: 'Clock skew', category: 'timing',
    analogy: 'Your heart beating 0.3ms earlier on the left side than the right: barely noticeable, but a real problem at scale.',
    definition: 'The difference in arrival time of the same clock edge at different flip-flops.',
    why: 'The beat is identical, but it lands at slightly different moments in different places. Small offsets are survivable; large ones make neighbouring stages disagree about "now".',
    chips: 'Clock-tree synthesis (CTS) inserts balanced buffers across the die to keep skew inside a few picoseconds.',
  },
  {
    id: 'setup', concept: 'Setup time', category: 'timing',
    analogy: 'Passengers must board before the train doors close, not as they are closing.',
    definition: 'The minimum time data must be stable BEFORE the clock edge for a flip-flop to capture it reliably.',
    why: 'Arrive at the platform early and you are definitely on the train. Arrive as the doors slam and nobody can say which side of them you ended up on.',
    chips: 'The limit on clock speed. Static timing analysis checks every path; the slowest one decides your chip\'s maximum frequency.',
  },
  {
    id: 'hold', concept: 'Hold time', category: 'timing',
    analogy: 'Passengers must stay seated after the train starts moving, not jump out as it begins.',
    definition: 'The minimum time data must stay stable AFTER the clock edge.',
    why: 'The capture is not instant: change the data too soon after the edge and you corrupt the value mid-grab, like leaping off a train that has already started.',
    chips: 'Hold violations cannot be fixed by slowing the clock. They are repaired with delay buffers before tapeout, or the silicon is scrap.',
  },
  {
    id: 'meta', concept: 'Metastability', category: 'timing',
    analogy: 'A conductor who cannot decide whether the passenger is on or off the train, so the whole system hangs.',
    definition: 'When timing is violated, a flip-flop can balance between 0 and 1 for an unbounded time before randomly resolving.',
    why: 'The passenger was half-in, half-out at the whistle. Until the conductor commits to a decision, nothing downstream can proceed safely.',
    chips: 'Any asynchronous input (a button, a signal from another clock domain) is passed through a two flip-flop synchronizer to contain it.',
  },
  // ── cpu ──
  {
    id: 'pipeline', concept: 'Pipeline', category: 'cpu',
    analogy: 'A McDonald\'s line: one person takes orders, one makes fries, one bags food, all at the same time.',
    definition: 'Splitting instruction execution into stages so several instructions are in flight simultaneously, one per stage.',
    why: 'No single burger is made faster, but a finished order comes off the line every few seconds because the stages overlap.',
    chips: 'The classic RISC pipeline has 5 stages; modern desktop cores run 14 to 20, which is how multi-GHz clocks are possible.',
  },
  {
    id: 'hazard', concept: 'Hazard', category: 'cpu',
    analogy: 'The fry station waiting on the order desk: until the order lands, everyone downstream stalls.',
    definition: 'When an instruction needs a result that an earlier instruction has not produced yet, forcing a stall or a bubble.',
    why: 'The assembly line only works when every station has its inputs ready. One dependency between stations and the whole line idles.',
    chips: 'CPUs add forwarding paths to pass results sideways, and compilers reorder instructions to keep the line moving.',
  },
  {
    id: 'cache', concept: 'Cache', category: 'cpu',
    analogy: 'The cook who keeps the best-selling items on the counter instead of walking to the back room every time.',
    definition: 'A small, fast memory close to the CPU that keeps recently and frequently used data.',
    why: 'The counter is tiny compared to the storeroom, but if the popular items live there, most trips to the back never happen.',
    chips: 'L1 caches are around 32 to 64 KB per core but serve well over 90% of requests, hiding the huge latency of DRAM.',
  },
  {
    id: 'branch', concept: 'Branch prediction', category: 'cpu',
    analogy: 'The experienced cashier who starts preparing your usual order before you finish asking, and is usually right.',
    definition: 'The CPU guesses which way a branch will go and speculatively executes ahead; a wrong guess is thrown away.',
    why: 'Waiting until you finish your sentence wastes time on regulars. Guessing keeps the kitchen busy, and the occasional remake is worth it.',
    chips: 'Modern predictors exceed 95% accuracy. A mispredict flushes the pipeline, and speculative execution side effects enabled the Spectre attacks.',
  },
  // ── cmos ──
  {
    id: 'cmosinv', concept: 'CMOS inverter', category: 'cmos',
    analogy: 'Two employees, one on day shift and one on night shift: never both working at the same time.',
    definition: 'A PMOS transistor pulls the output high, an NMOS pulls it low, and the input ensures exactly one of them conducts.',
    why: 'When one is on duty the other is home. Because both are never working at once, the company pays almost nothing in idle wages, which is CMOS\'s near-zero static power.',
    chips: 'The fundamental cell of all digital logic. Its tiny standby current is the reason CMOS beat every rival technology.',
  },
  {
    id: 'pgate', concept: 'Power gating', category: 'cmos',
    analogy: 'Turning off the lights in rooms nobody is using.',
    definition: 'Cutting the supply to an idle block through sleep transistors, eliminating both switching and leakage power.',
    why: 'An empty room does not need light. Flip the breaker for that wing and the bill drops, then flip it back when someone walks in.',
    chips: 'Phone modems and GPU domains power-collapse when idle. This is a big part of why standby lasts days, not hours.',
  },
  {
    id: 'cgate', concept: 'Clock gating', category: 'cmos',
    analogy: 'Pausing the heartbeat in body parts that are not moving right now.',
    definition: 'Stopping the clock to registers that are not doing useful work. State is kept, but nothing toggles.',
    why: 'The clock wiggling billions of times a second is itself a huge power cost. If a limb is resting, skip its pulse and nothing is lost.',
    chips: 'Synthesis tools insert clock gates automatically; in many SoCs this single trick saves a third of dynamic power.',
  },
  // ── flow ──
  {
    id: 'synth', concept: 'Synthesis', category: 'flow',
    analogy: 'Translating a Hindi movie script into English: same story, different language (RTL to gates).',
    definition: 'Converting RTL (your Verilog) into a gate-level netlist of standard cells, optimized for timing, area and power.',
    why: 'Nothing about the plot changes, only the vocabulary. Your always blocks become flip-flops, your assigns become gate networks.',
    chips: 'Tools like Design Compiler and Genus turn a few thousand lines of Verilog into millions of NAND, NOR and DFF cells.',
  },
  {
    id: 'pnr', concept: 'Place & Route', category: 'flow',
    analogy: 'City planning: deciding where to put the buildings (cells) and how to lay the roads (wires) without traffic jams.',
    definition: 'Placing each cell at physical coordinates on the die, then routing metal wires to connect them under timing and congestion limits.',
    why: 'Put the office next to the train station and commutes are short; scatter them carelessly and the roads clog. Wirelength is commute time.',
    chips: 'P&R tools place billions of cells and route them across 10 or more metal layers, stacked like multi-level highways.',
  },
  {
    id: 'drc', concept: 'DRC', category: 'flow',
    analogy: 'A building inspection: no wall too thin, no rooms too close together, before the building is approved.',
    definition: 'Design Rule Check verifies the layout obeys the foundry\'s geometric rules: minimum widths, spacings, densities.',
    why: 'The inspector does not care if your house is beautiful, only that it will not collapse. DRC does not care if the chip is clever, only that it can be manufactured.',
    chips: 'Advanced-node rule decks contain thousands of rules. A clean DRC report is mandatory before the foundry accepts your design.',
  },
  {
    id: 'sta', concept: 'STA', category: 'flow',
    analogy: 'Checking every delivery route so every package arrives before its deadline: not early, not late.',
    definition: 'Static Timing Analysis exhaustively checks every register-to-register path against setup and hold constraints, without simulation.',
    why: 'Instead of test-driving a few routes, you check the math on all of them. Too slow misses the deadline (setup); suspiciously early breaks the schedule (hold).',
    chips: 'Sign-off tools like PrimeTime verify millions of paths across process, voltage and temperature corners before tapeout.',
  },
  {
    id: 'tapeout', concept: 'Tapeout', category: 'flow',
    analogy: 'Sending the blueprint to the factory. No changes after this.',
    definition: 'Releasing the final layout database (GDSII) to the foundry for mask making and fabrication.',
    why: 'Once the factory starts pouring the foundation you cannot move a wall. Every review happens before this moment because nothing can happen after it.',
    chips: 'A leading-edge mask set costs millions of dollars. A bug found after tapeout means a respin: new masks, new money, months lost.',
  },

  // ── number systems (Foundation & DSD) ──
  {
    id: 'binary', concept: 'Binary', category: 'number',
    analogy: 'A row of light switches — each is either OFF (0) or ON (1), and their pattern spells out a number.',
    definition: 'Base-2: the only digits are 0 and 1, and each position is the next power of two (…8, 4, 2, 1).',
    why: 'Every switch is one bit. Read the ON switches by their place values and add them up, and the number comes right back — exactly how a chip stores every value.',
    chips: 'The only language transistors speak: a high voltage is 1, a low voltage is 0. Every number, pixel and instruction is ultimately a binary pattern.',
  },
  {
    id: 'hex', concept: 'Hexadecimal', category: 'number',
    analogy: 'Shorthand for binary — one symbol stands in for a whole group of four bits.',
    definition: 'Base-16, using 0–9 then A–F. Each hex digit maps to exactly four binary bits (a nibble).',
    why: 'Writing 1111 1010 is easy to miscount; "FA" is the same value four times shorter, so engineers read memory and registers in hex.',
    chips: 'Memory addresses, register dumps, MAC addresses and colour codes are all written in hex because it lines up cleanly with bytes.',
  },
  {
    id: 'octal', concept: 'Octal', category: 'number',
    analogy: 'Bundling bits into groups of three instead of four.',
    definition: 'Base-8, digits 0–7. Each octal digit maps to exactly three binary bits.',
    why: 'Three-bit grouping suited early machines whose word sizes were multiples of three; today hex usually wins, but the grouping trick is identical.',
    chips: 'Unix file permissions (chmod 755) are octal — each digit is three permission bits for owner, group and others.',
  },
  {
    id: 'twos', concept: "Two's complement", category: 'number',
    analogy: 'A car odometer rolling backwards past zero to show a negative reading.',
    definition: 'The standard way to store signed integers: to negate a value, invert every bit and add 1.',
    why: 'Rolling 0000 back one step gives 1111 = −1, so ordinary addition hardware handles positive and negative numbers with no special case.',
    chips: "Every CPU's integer ALU uses two's complement, which is why subtraction is just \"add the negated number\".",
  },
  {
    id: 'bcd', concept: 'BCD', category: 'number',
    analogy: 'Giving each decimal digit its own little box instead of converting the whole number to binary.',
    definition: 'Binary-Coded Decimal: each decimal digit 0–9 is stored in its own 4-bit group.',
    why: 'Keeping the digits separate avoids messy binary-to-decimal conversion when all you want is to light up a display.',
    chips: 'Digital clocks, calculators and seven-segment displays use BCD so each digit drives one display directly.',
  },
  {
    id: 'gray', concept: 'Gray code', category: 'number',
    analogy: 'Stepping stones where only one foot ever moves at a time — no mid-air stumble.',
    definition: 'A binary ordering where consecutive values differ in exactly one bit.',
    why: 'If a value is read while it is changing, only one bit is ever in flux, so the reading is at worst off by one — never random garbage.',
    chips: 'Rotary encoders and the pointers in asynchronous FIFOs use Gray code to cross safely between clock domains.',
  },

  // ── combinational building blocks (DSD) ──
  {
    id: 'boolalg', concept: 'Boolean algebra', category: 'comb',
    analogy: 'The grammar of logic — a few rewrite rules that tidy any tangled condition.',
    definition: 'The algebra of 0/1 with AND, OR and NOT, plus laws (De Morgan, distribution, absorption) for reshaping expressions.',
    why: 'Just as grammar rewrites a clumsy sentence into a clean one, these laws collapse a big logic expression into a smaller, cheaper circuit.',
    chips: 'Every synthesis tool runs on Boolean algebra to shrink your Verilog into the fewest gates.',
  },
  {
    id: 'kmap', concept: 'Karnaugh map', category: 'comb',
    analogy: 'A seating chart that puts neighbours together so a pattern jumps out and you cancel the redundancy.',
    definition: 'A grid that lays out a truth table so adjacent cells differ by one variable; grouping adjacent 1s gives the minimal expression.',
    why: 'Terms sitting next to each other differ in just one input, so they can be merged — the map makes those merges visible at a glance.',
    chips: 'A hand tool for small functions and the intuition behind the automatic minimizers inside every synthesis flow.',
  },
  {
    id: 'hadd', concept: 'Half adder', category: 'comb',
    analogy: 'Adding two single coins: you get a result digit and maybe a carry into the next column.',
    definition: 'Adds two 1-bit numbers, producing Sum = A XOR B and Carry = A AND B.',
    why: 'Two 1s make "10": the sum bit is 0 and you carry a 1 — exactly like carrying in decimal addition.',
    chips: 'The first building block of every arithmetic unit; chain them and you can add any width.',
  },
  {
    id: 'fadd', concept: 'Full adder', category: 'comb',
    analogy: 'Adding a column that also has a carry coming in from the column to its right.',
    definition: 'Adds three bits — A, B and carry-in — to produce a sum and a carry-out.',
    why: 'Real addition must accept the carry from the previous column, which a half adder cannot; the full adder takes all three inputs.',
    chips: 'The repeating cell of every multi-bit adder, multiplier and ALU on the chip.',
  },
  {
    id: 'rca', concept: 'Ripple-carry adder', category: 'comb',
    analogy: 'A bucket brigade passing the carry down the line, one person at a time.',
    definition: "Full adders chained so each stage's carry-out feeds the next stage's carry-in.",
    why: 'Simple to build, but the top bit cannot settle until the carry has rippled through every stage below it — so it is slow for wide numbers.',
    chips: 'Fine for narrow adds; wide datapaths switch to faster carry schemes to hit timing.',
  },
  {
    id: 'cla', concept: 'Carry-lookahead adder', category: 'comb',
    analogy: 'Predicting all the carries in advance instead of waiting for the brigade to pass them along.',
    definition: 'Computes each carry directly from the inputs using "generate" and "propagate" terms, in parallel.',
    why: 'By working out up front whether each column will make or pass a carry, every sum bit can resolve at nearly the same time.',
    chips: 'The classic fast adder; parallel-prefix variants (Kogge-Stone, Brent-Kung) push the idea to the widest datapaths.',
  },
  {
    id: 'mux', concept: 'Multiplexer', category: 'comb',
    analogy: 'A railway switch (points) that selects which single track the train continues on.',
    definition: 'Routes one of several data inputs to a single output, chosen by the select lines.',
    why: 'The select lines throw the points: n select bits choose among 2ⁿ inputs, all sharing one output wire.',
    chips: 'Everywhere — bus selection, choosing an ALU result, and building arbitrary logic ("mux-based logic").',
  },
  {
    id: 'demux', concept: 'Demultiplexer', category: 'comb',
    analogy: 'A mail sorter sending one incoming letter to exactly one of many pigeonholes.',
    definition: 'The inverse of a mux: routes one input to one of several outputs, chosen by select lines.',
    why: 'The address on the letter (the select lines) picks the single destination; every other output stays idle.',
    chips: 'Distributing a data stream, and the output stage of address decoders that enable one block at a time.',
  },
  {
    id: 'decoder', concept: 'Decoder', category: 'comb',
    analogy: 'A row of numbered mailboxes where an address lights up exactly one box.',
    definition: 'Turns an n-bit input code into 2ⁿ outputs, with exactly one active for each code.',
    why: 'Each unique input pattern is wired to fire a single output line — that is how an address selects one thing out of many.',
    chips: 'Memory row/column selection and instruction decoding both hang off decoders.',
  },
  {
    id: 'encoder', concept: 'Encoder', category: 'comb',
    analogy: 'A quiz buzzer that reports which one of many buttons was pressed as a number.',
    definition: 'The inverse of a decoder: converts an active input line into its binary code (a priority encoder picks the highest).',
    why: 'Many separate signals are compressed into a compact binary index — the "which one?" answered in the fewest bits.',
    chips: 'Interrupt controllers encode which of dozens of lines is asking for attention into an interrupt number.',
  },
  {
    id: 'comparator', concept: 'Comparator', category: 'comb',
    analogy: 'A balance scale telling you which pan is heavier, or that the two are equal.',
    definition: 'Compares two binary numbers and outputs greater-than, less-than or equal.',
    why: 'Scanning from the top bit down, the first place where they differ decides the winner; if none differ, they are equal.',
    chips: 'Address-match logic, sorting networks and the branch conditions inside a CPU all lean on comparators.',
  },
  {
    id: 'subtractor', concept: 'Subtractor', category: 'comb',
    analogy: 'Adding a debt instead of subtracting — owing someone 3 is the same as adding −3.',
    definition: "Subtracts using addition: A − B = A + (two's complement of B).",
    why: 'Rather than build separate subtract hardware, flip B\'s bits and add 1, then reuse the very same adder.',
    chips: 'ALUs almost never carry a dedicated subtractor — they negate and reuse the adder, saving huge area.',
  },

  // ── devices (Basic Electronics) ──
  {
    id: 'diode', concept: 'Diode', category: 'device',
    analogy: 'A one-way valve for current: it flows freely one way and is blocked the other.',
    definition: 'A PN junction that conducts when forward-biased and blocks when reverse-biased.',
    why: 'The junction only lets charge cross in one direction, like a valve that opens with flow one way and slams shut against the other.',
    chips: 'Rectification, clamps against voltage spikes, and the ESD diodes guarding every chip pin.',
  },
  {
    id: 'rectifier', concept: 'Rectifier', category: 'device',
    analogy: 'A turnstile that only lets people through one way, turning a churning crowd into an orderly line.',
    definition: 'A diode circuit that converts alternating current (AC) into direct current (DC).',
    why: 'AC swings both positive and negative; the diodes pass only one polarity (or fold the other up), leaving current that flows one way.',
    chips: 'Every phone charger and power supply starts with a rectifier turning wall AC into the DC electronics need.',
  },
  {
    id: 'zener', concept: 'Zener diode', category: 'device',
    analogy: 'A pressure-relief valve that holds a steady pressure no matter how hard you push.',
    definition: 'A diode built to conduct in reverse at a precise breakdown voltage, clamping the voltage across it.',
    why: 'Past its Zener voltage it happily passes current to hold that voltage fixed, venting the excess like a relief valve.',
    chips: 'Simple voltage references and over-voltage protection; the same idea underlies on-chip references.',
  },
  {
    id: 'bjt', concept: 'BJT', category: 'device',
    analogy: 'A tap where a small effort from your hand controls a big flow of water.',
    definition: 'Bipolar Junction Transistor: a small base current controls a much larger collector-to-emitter current (current-controlled).',
    why: 'A tiny trickle into the base opens a wide channel for the main current — a small cause steering a large effect, which is amplification.',
    chips: 'Analog amplifiers, RF and power stages; digital logic instead uses the voltage-controlled MOSFET.',
  },
  {
    id: 'mosfet', concept: 'MOSFET', category: 'device',
    analogy: 'A voltage-operated sluice gate — hold a voltage on the gate and the channel opens, drawing almost no effort to keep it there.',
    definition: 'A transistor whose gate voltage (not current) creates a conducting channel between source and drain.',
    why: 'The insulated gate steers the channel purely with an electric field, so it sips almost no current to stay switched — ideal for dense, low-power logic.',
    chips: 'The workhorse of all digital chips: billions of NMOS and PMOS MOSFETs form every CMOS gate.',
  },
];

/* ── share image generation (1080x1080 canvas) ──────────────────────── */

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const tryLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(tryLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tryLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderCardImage(a: Analogy): Promise<Blob> {
  const cat = CATEGORIES.find((c) => c.id === a.category)!;
  const S = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;

  // background
  ctx.fillStyle = '#0A0E1A';
  ctx.fillRect(0, 0, S, S);
  // faint grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= S; i += 54) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
  }
  // accent glow
  const glow = ctx.createRadialGradient(S - 140, 150, 0, S - 140, 150, 600);
  glow.addColorStop(0, `${cat.color}33`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);

  // wordmark
  ctx.textBaseline = 'alphabetic';
  ctx.font = '900 46px Arial, sans-serif';
  let x = 80;
  ctx.fillStyle = '#FFFFFF'; ctx.fillText('BIT', x, 120); x += ctx.measureText('BIT').width;
  ctx.fillStyle = cat.color;  ctx.fillText('FOR', x, 120); x += ctx.measureText('FOR').width;
  ctx.fillStyle = '#FFFFFF'; ctx.fillText('BYTES', x, 120);
  // series label
  ctx.font = '700 24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('THE DAILY ANALOGY LIBRARY', 80, 165);

  // category pill
  ctx.font = '700 26px Arial, sans-serif';
  const catLabel = cat.label.toUpperCase();
  const pillW = ctx.measureText(catLabel).width + 48;
  ctx.fillStyle = `${cat.color}26`;
  ctx.strokeStyle = cat.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(80, 240, pillW, 56);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = cat.color;
  ctx.fillText(catLabel, 104, 278);

  // concept
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 84px Arial, sans-serif';
  const conceptLines = wrapText(ctx, a.concept, 920);
  let y = 420;
  for (const line of conceptLines) { ctx.fillText(line, 80, y); y += 96; }

  // analogy (quoted)
  ctx.fillStyle = cat.color;
  ctx.font = 'italic 600 46px Georgia, serif';
  const quoteLines = wrapText(ctx, `"${a.analogy}"`, 900);
  y += 24;
  for (const line of quoteLines) { ctx.fillText(line, 80, y); y += 64; }

  // footer
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.moveTo(80, 950); ctx.lineTo(1000, 950); ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px Arial, sans-serif';
  ctx.fillText('Learn electronics backwards.', 80, 1006);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '600 26px Arial, sans-serif';
  const tag = 'bitforbytes';
  ctx.fillText(tag, 1000 - ctx.measureText(tag).width, 1006);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

const captionFor = (a: Analogy) =>
  `Finally understood ${a.concept} through BitForBytes. ${a.analogy}`;

/* ── page ────────────────────────────────────────────────────────────── */

export const AnalogyLibrary: React.FC = () => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CatId | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ANALOGIES.filter((a) => {
      if (cat && a.category !== cat) return false;
      if (!needle) return true;
      const hay = `${a.concept} ${a.analogy} ${a.definition} ${CATEGORIES.find((c) => c.id === a.category)?.label}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q, cat]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const share = async (a: Analogy) => {
    try {
      const blob = await renderCardImage(a);
      const caption = captionFor(a);
      const file = new File([blob], `bitforbytes-${a.id}.png`, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] } as ShareData)) {
        await navigator.share({ files: [file], text: caption } as ShareData);
        return;
      }
      // desktop fallback: download the image, put the caption on the clipboard
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitforbytes-${a.id}.png`;
      link.click();
      URL.revokeObjectURL(url);
      try { await navigator.clipboard.writeText(caption); } catch { /* clipboard blocked */ }
      notify('Card image downloaded and the caption is on your clipboard. Paste it anywhere.');
    } catch {
      notify('Could not generate the share image in this browser.');
    }
  };

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0A0B12]' : 'bg-white'} ${text}`}>
      {/* header */}
      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-pink-400">
            <Sparkles size={14} /> The Daily Analogy Library
          </span>
          <h1 className={`mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight ${text}`}>
            Every VLSI concept, explained through something you already know.
          </h1>
          <p className={`mt-4 text-lg leading-relaxed ${sub}`}>
            Tap a card to flip it. Share the one that finally made a concept click, it will
            do the same for someone else.
          </p>
        </div>

        {/* search + filters */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
            dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}>
            <Search size={18} className={sub} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: setup time, cache, NAND, tapeout..."
              className={`w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 ${text}`}
            />
            {q && (
              <button onClick={() => setQ('')} className={`text-xs font-bold ${sub} hover:opacity-70`}>clear</button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCat(null)}
              className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
              style={{
                borderColor: cat === null ? '#F472B6' : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                background: cat === null ? 'rgba(244,114,182,0.12)' : 'transparent',
                color: cat === null ? '#F472B6' : undefined,
              }}
            >
              ALL ({ANALOGIES.length})
            </button>
            {CATEGORIES.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(active ? null : c.id)}
                  className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
                  style={{
                    borderColor: active ? c.color : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    background: active ? `${c.color}1F` : 'transparent',
                    color: active ? c.color : undefined,
                  }}
                >
                  {c.label.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* cards */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {filtered.map((a) => {
          const c = CATEGORIES.find((x) => x.id === a.category)!;
          const isFlipped = !!flipped[a.id];
          return (
            <div key={a.id} className="h-[380px] [perspective:1400px]">
              <div
                className="relative h-full w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                onClick={() => setFlipped((f) => ({ ...f, [a.id]: !f[a.id] }))}
              >
                {/* front */}
                <div
                  className={`absolute inset-0 flex flex-col rounded-3xl border p-6 [backface-visibility:hidden] ${
                    dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                          style={{ background: `${c.color}1A`, color: c.color }}>
                      {c.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); void share(a); }}
                      title="Share this card"
                      className={`rounded-full border p-2 transition-all active:scale-90 ${
                        dark ? 'border-white/10 hover:border-white/30' : 'border-slate-200 hover:border-slate-400'
                      }`}
                      style={{ color: c.color }}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                  <h3 className={`mt-5 text-2xl font-extrabold tracking-tight ${text}`}>{a.concept}</h3>
                  <p className="mt-4 text-[17px] font-medium italic leading-relaxed" style={{ color: c.color }}>
                    "{a.analogy}"
                  </p>
                  <div className={`mt-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${sub}`}>
                    <RotateCw size={12} /> tap to flip
                  </div>
                </div>

                {/* back */}
                <div
                  className={`absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
                  }`}
                  style={{ borderColor: `${c.color}55` }}
                >
                  <h3 className="text-lg font-extrabold tracking-tight" style={{ color: c.color }}>{a.concept}</h3>
                  <div className="mt-3 space-y-3 text-[13px] leading-relaxed">
                    <div>
                      <div className={`font-mono text-[10px] font-bold uppercase tracking-widest ${sub}`}>What it is</div>
                      <p className={`mt-0.5 ${text}`}>{a.definition}</p>
                    </div>
                    <div>
                      <div className={`font-mono text-[10px] font-bold uppercase tracking-widest ${sub}`}>Why the analogy maps</div>
                      <p className={`mt-0.5 ${text}`}>{a.why}</p>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: c.color }}>
                        Where this appears in real chips
                      </div>
                      <p className={`mt-0.5 ${text}`}>{a.chips}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${sub}`}>
                      <RotateCw size={12} /> tap to flip back
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); void share(a); }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
                      style={{ background: c.color }}
                    >
                      <Share2 size={12} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className={`mt-16 text-center text-sm ${sub}`}>
          Nothing matches "{q}". Try a concept name like "cache" or "setup".
        </p>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-pink-400/40 bg-slate-950 px-5 py-4 text-center text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AnalogyLibrary;
