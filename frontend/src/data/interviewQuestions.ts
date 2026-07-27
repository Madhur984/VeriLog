/**
 * VLSI / digital-design interview question bank. Real, commonly-asked
 * conceptual questions with concise, correct answers — scoped to what
 * BitForBytes actually teaches (digital electronics, number systems, Boolean
 * algebra & K-maps, combinational & sequential logic, Verilog). No fabricated
 * "asked at company X" attributions; these are genuinely standard fundamentals
 * that come up in VLSI/RTL interviews.
 */

export type IvTopic = 'digital' | 'number' | 'boolean' | 'comb' | 'seq' | 'verilog';

export interface IvTopicMeta { id: IvTopic; label: string; color: string; }

export const IV_TOPICS: IvTopicMeta[] = [
  { id: 'digital', label: 'Digital Basics',      color: '#22D3EE' },
  { id: 'number',  label: 'Number Systems',      color: '#F59E0B' },
  { id: 'boolean', label: 'Boolean & K-Maps',    color: '#34D399' },
  { id: 'comb',    label: 'Combinational',       color: '#A78BFA' },
  { id: 'seq',     label: 'Sequential & FSM',    color: '#FB7185' },
  { id: 'verilog', label: 'Verilog',             color: '#60A5FA' },
];

export type IvLevel = 'Easy' | 'Medium' | 'Hard';

export interface IvQuestion {
  id: string;
  topic: IvTopic;
  level: IvLevel;
  q: string;
  a: string;
}

export const IV_QUESTIONS: IvQuestion[] = [
  // ── Digital basics ──────────────────────────────────────────────
  {
    id: 'comb-vs-seq', topic: 'digital', level: 'Easy',
    q: 'What is the difference between combinational and sequential circuits?',
    a: 'A combinational circuit’s output depends only on the current inputs — it has no memory (e.g. adders, multiplexers). A sequential circuit’s output depends on the current inputs and on stored state (memory), and it updates in step with a clock (e.g. counters, registers, state machines).',
  },
  {
    id: 'latch-vs-ff', topic: 'digital', level: 'Easy',
    q: 'What is the difference between a latch and a flip-flop?',
    a: 'A latch is level-sensitive: it is transparent (passes input to output) the whole time its enable is active. A flip-flop is edge-sensitive: it captures the input only on a clock edge (rising or falling). Synchronous designs use flip-flops because edge-triggering makes timing predictable.',
  },
  {
    id: 'setup-hold', topic: 'digital', level: 'Medium',
    q: 'What are setup time and hold time?',
    a: 'Setup time is the minimum time the data input must be stable BEFORE the clock edge. Hold time is the minimum time it must stay stable AFTER the edge. If either is violated, the flip-flop can go metastable and capture an unpredictable value.',
  },
  {
    id: 'metastability', topic: 'digital', level: 'Hard',
    q: 'What is metastability and how do you handle it?',
    a: 'If a flip-flop samples data that changes too close to the clock edge (a setup/hold violation), its output can hover between 0 and 1 for an unpredictable time before settling. You reduce the risk of it propagating by passing asynchronous signals through a synchronizer — usually two flip-flops in series — before using them.',
  },
  {
    id: 'fanin-fanout', topic: 'digital', level: 'Easy',
    q: 'What are fan-in and fan-out?',
    a: 'Fan-in is the number of inputs a gate has. Fan-out is the number of gate inputs that a single output can drive while still meeting its timing and electrical limits. High fan-out adds delay and may need a buffer.',
  },
  {
    id: 'prop-delay', topic: 'digital', level: 'Easy',
    q: 'What is propagation delay?',
    a: 'The time it takes for a change at a gate or circuit’s input to show up at its output. Propagation delays add up along a path and set the maximum clock speed of the design.',
  },

  // ── Number systems ──────────────────────────────────────────────
  {
    id: 'twos-comp', topic: 'number', level: 'Easy',
    q: 'What is 2’s complement and why is it used?',
    a: 'To negate a binary number in 2’s complement, invert every bit and add 1. It is used for signed numbers because one adder then handles both addition and subtraction (A − B = A + (−B)), and there is only a single representation of zero.',
  },
  {
    id: 'bin-to-gray', topic: 'number', level: 'Medium',
    q: 'How do you convert binary to Gray code?',
    a: 'Keep the MSB the same. Each remaining Gray bit is the XOR of the two adjacent binary bits (G[i] = B[i+1] ⊕ B[i]). The result changes by only one bit between consecutive values.',
  },
  {
    id: 'why-gray', topic: 'number', level: 'Medium',
    q: 'Why is Gray code used in K-maps and counters?',
    a: 'Only one bit changes between adjacent values. In K-maps that lets neighbouring cells combine; in counters and encoders it avoids glitches, because you never have several bits switching at once and briefly showing a wrong value.',
  },
  {
    id: 'bcd', topic: 'number', level: 'Easy',
    q: 'What is BCD and how does a BCD adder differ from a binary adder?',
    a: 'BCD (Binary-Coded Decimal) stores each decimal digit in 4 bits (0000–1001). A BCD adder adds two digits with a normal binary adder, then adds 6 (0110) whenever the result exceeds 9 or produces a carry, to skip the six unused codes and keep the result valid decimal.',
  },

  // ── Boolean & K-maps ────────────────────────────────────────────
  {
    id: 'sop-vs-pos', topic: 'boolean', level: 'Easy',
    q: 'What is the difference between SOP and POS?',
    a: 'SOP (Sum of Products) is the OR of the minterms — the rows where the output is 1. POS (Product of Sums) is the AND of the maxterms — the rows where the output is 0. Both describe the exact same function; you pick whichever is shorter.',
  },
  {
    id: 'minterm-maxterm', topic: 'boolean', level: 'Easy',
    q: 'What is a minterm versus a maxterm?',
    a: 'A minterm is an AND term that is 1 for exactly one row of the truth table (variable written plain if it is 1, complemented if 0). A maxterm is an OR term that is 0 for exactly one row (the rule is flipped).',
  },
  {
    id: 'dont-care', topic: 'boolean', level: 'Medium',
    q: 'What are don’t-care conditions and how do they help?',
    a: 'Don’t-cares are input combinations that never occur, or whose output does not matter. In a K-map you can treat each as a 0 or a 1 — whichever lets you draw a bigger group — which gives simpler, cheaper logic.',
  },
  {
    id: 'kmap-minimize', topic: 'boolean', level: 'Medium',
    q: 'How do you minimize a function using a K-map?',
    a: 'Plot the 1s on the grid (rows/columns in Gray-code order). Circle them in rectangular groups whose size is a power of two (1, 2, 4, 8…), as large as possible, wrapping around edges if it helps. Each group drops one variable; OR the terms from all groups to get the minimal SOP.',
  },
  {
    id: 'demorgan', topic: 'boolean', level: 'Easy',
    q: 'State De Morgan’s theorems.',
    a: 'NOT(A AND B) = NOT A OR NOT B, and NOT(A OR B) = NOT A AND NOT B. In short, break the bar and flip the operator. They are what let you convert between AND/OR forms and build everything from NAND or NOR gates.',
  },

  // ── Combinational ───────────────────────────────────────────────
  {
    id: 'mux-from-mux', topic: 'comb', level: 'Medium',
    q: 'How do you build a 4:1 multiplexer from 2:1 multiplexers?',
    a: 'Use three 2:1 muxes. Two of them use sel[0] to choose between (d0, d1) and between (d2, d3). A third mux uses sel[1] to choose between those two results. That gives the 4:1 selection.',
  },
  {
    id: 'dec-vs-mux', topic: 'comb', level: 'Easy',
    q: 'What is the difference between a decoder and a multiplexer?',
    a: 'A decoder takes n select lines and drives 2ⁿ one-hot outputs — exactly one output is active for each input code. A multiplexer takes 2ⁿ data inputs plus n select lines and routes one of them to a single output. Decoder = one-to-many select; mux = many-to-one route.',
  },
  {
    id: 'nand-universal', topic: 'comb', level: 'Medium',
    q: 'Why is NAND called a universal gate?',
    a: 'Because you can build every other gate from it. NOT = NAND(a, a); AND = NOT of NAND; OR = NAND of the two inverted inputs (by De Morgan). Since any function can be written in SOP form, it can be built entirely from NANDs — handy because NAND is cheap and fast in CMOS.',
  },
  {
    id: 'half-vs-full-adder', topic: 'comb', level: 'Easy',
    q: 'What is the difference between a half adder and a full adder?',
    a: 'A half adder adds two bits: Sum = A ⊕ B, Carry = A · B. A full adder adds three bits (including a carry-in): Sum = A ⊕ B ⊕ Cin, and Cout is 1 when at least two inputs are 1 (a majority). A full adder can be built from two half adders and an OR gate.',
  },
  {
    id: 'ripple-slow', topic: 'comb', level: 'Medium',
    q: 'Why is a ripple-carry adder slow, and how is it made faster?',
    a: 'Each stage cannot finish until the carry from the previous stage arrives, so the worst-case delay grows with the number of bits. A carry-look-ahead adder fixes this by computing all carries in parallel from Generate (G = A·B) and Propagate (P = A⊕B) signals, so it no longer waits bit by bit.',
  },
  {
    id: 'hazard', topic: 'comb', level: 'Hard',
    q: 'What is a glitch (hazard) in combinational logic?',
    a: 'A brief wrong output that appears because two paths to the same gate have different delays, so signals arrive at slightly different times. A static hazard is a momentary 0 (or 1) where the output should have stayed constant. K-map grouping that overlaps adjacent terms (adding a redundant prime implicant) can remove static hazards.',
  },

  // ── Sequential & FSM ────────────────────────────────────────────
  {
    id: 'moore-vs-mealy', topic: 'seq', level: 'Medium',
    q: 'What is the difference between a Moore and a Mealy state machine?',
    a: 'A Moore machine’s output depends only on the current state, so it changes on the clock edge and is glitch-free but may need more states. A Mealy machine’s output depends on the state AND the current inputs, so it reacts one cycle sooner and often needs fewer states, but its output can glitch with the inputs.',
  },
  {
    id: 'sync-vs-async-reset', topic: 'seq', level: 'Medium',
    q: 'What is the difference between synchronous and asynchronous reset?',
    a: 'A synchronous reset only takes effect on a clock edge (the reset is not in the sensitivity list). An asynchronous reset takes effect immediately, regardless of the clock (it appears in the sensitivity list, e.g. "or negedge rst_n"). Async reset acts even with no clock but needs care around reset removal (recovery/removal timing).',
  },
  {
    id: 'mod-n-ff', topic: 'seq', level: 'Easy',
    q: 'How many flip-flops are needed for a mod-N counter?',
    a: 'ceil(log2(N)) flip-flops. For example a mod-10 (decade) counter needs 4 flip-flops because 2³ = 8 is too few and 2⁴ = 16 is enough.',
  },
  {
    id: 'clock-skew', topic: 'seq', level: 'Hard',
    q: 'What is clock skew and why does it matter?',
    a: 'Clock skew is the difference in the clock’s arrival time at different flip-flops. Positive skew (clock reaches the capturing flop later) can help setup but hurt hold; negative skew does the opposite. Large uncontrolled skew causes hold or setup violations, so clock trees are balanced during physical design.',
  },
  {
    id: 'one-hot', topic: 'seq', level: 'Medium',
    q: 'What is one-hot state encoding and when is it used?',
    a: 'One-hot gives each FSM state its own flip-flop, with exactly one bit high at a time. It uses more flip-flops than binary encoding but makes the next-state and output logic simpler and faster, so it is popular in FPGAs where flip-flops are plentiful.',
  },
  {
    id: 'setup-fix', topic: 'seq', level: 'Hard',
    q: 'A path is failing setup timing. What can you do?',
    a: 'Shorten the logic between the two flip-flops (fewer levels of gates), pipeline the path by adding a register stage, resize/buffer slow gates, balance clock skew in your favour, or as a last resort lower the clock frequency. Setup fails when combinational delay + setup > clock period.',
  },

  // ── Verilog ─────────────────────────────────────────────────────
  {
    id: 'reg-vs-wire', topic: 'verilog', level: 'Easy',
    q: 'What is the difference between reg and wire in Verilog?',
    a: 'A wire is a physical connection that must be driven continuously (by an assign or a module output). A reg holds a value assigned inside an always or initial block. Important: reg does NOT necessarily mean a hardware register — a reg in a combinational always block synthesises to gates, not a flip-flop.',
  },
  {
    id: 'blocking-nonblocking', topic: 'verilog', level: 'Medium',
    q: 'When do you use blocking (=) versus non-blocking (<=) assignments?',
    a: 'Use blocking (=) in combinational always blocks — it executes immediately, in order. Use non-blocking (<=) in clocked/sequential always blocks — all right-hand sides are evaluated first, then updated together at the end of the time step, which correctly models parallel flip-flops. Mixing them in one block causes race conditions and sim/synthesis mismatches.',
  },
  {
    id: 'inferred-latch', topic: 'verilog', level: 'Medium',
    q: 'What causes an unintended latch in Verilog, and how do you avoid it?',
    a: 'An incomplete assignment in a combinational always block — for example an if with no else, or a case without a default — leaves the output unassigned for some inputs, so the tool infers a latch to "remember" the old value. Avoid it by assigning a default value at the top of the block, or covering every branch.',
  },
  {
    id: 'always-star', topic: 'verilog', level: 'Easy',
    q: 'Why use always @* instead of listing signals like always @(a or b)?',
    a: 'always @* automatically builds the sensitivity list from every signal read inside the block. A hand-written list that misses a signal simulates wrong (stale outputs) but often synthesises right — the worst kind of bug. @* keeps simulation and hardware consistent.',
  },
  {
    id: 'eq-vs-caseeq', topic: 'verilog', level: 'Medium',
    q: 'What is the difference between == and === in Verilog?',
    a: '== is logical equality: if either operand has an x or z bit, the result is x (unknown). === is case equality: it compares x and z bits literally and returns a definite 0 or 1. Use === in testbenches to check for exact values including x/z; it is not synthesisable.',
  },
  {
    id: 'testbench', topic: 'verilog', level: 'Easy',
    q: 'What is a testbench?',
    a: 'A non-synthesisable Verilog module that instantiates the design under test (DUT), applies stimulus to its inputs over time, and checks the outputs against expected values. It has no ports of its own and is only used for simulation.',
  },
];
