/**
 * VLSI / digital-design interview question bank. Real, commonly-asked
 * conceptual questions with concise, correct answers — scoped to what
 * BitForBytes actually teaches (digital electronics, number systems, Boolean
 * algebra & K-maps, combinational & sequential logic, Verilog). No fabricated
 * "asked at company X" attributions; these are genuinely standard fundamentals
 * that come up in VLSI/RTL interviews.
 *
 * Extended with 100 Physical Design (PD) questions covering theory (Q1–50)
 * and STA/numerical problems (Q51–100). Numerical answers use §F:, §C:, §R:
 * markers for rich formula rendering in the UI.
 */

export type IvTopic = 'digital' | 'number' | 'boolean' | 'comb' | 'seq' | 'verilog' | 'pd' | 'freshers' | 'tools';

export interface IvTopicMeta {
  id: IvTopic;
  label: string;
  color: string;
  /** Groups topics in the sidebar navigator. */
  section: 'Core Hardware' | 'Design & Backend' | 'Career & Tools';
}

export const IV_TOPICS: IvTopicMeta[] = [
  { id: 'digital',  label: 'Digital Basics',     color: '#22D3EE', section: 'Core Hardware' },
  { id: 'number',   label: 'Number Systems',     color: '#F59E0B', section: 'Core Hardware' },
  { id: 'boolean',  label: 'Boolean & K-Maps',   color: '#34D399', section: 'Core Hardware' },
  { id: 'comb',     label: 'Combinational Logic', color: '#A78BFA', section: 'Core Hardware' },
  { id: 'seq',      label: 'Sequential & FSM',   color: '#FB7185', section: 'Core Hardware' },
  { id: 'verilog',  label: 'Verilog RTL',        color: '#60A5FA', section: 'Design & Backend' },
  { id: 'pd',       label: 'Physical Design',    color: '#F97316', section: 'Design & Backend' },
  { id: 'freshers', label: 'Freshers & HR',      color: '#10B981', section: 'Career & Tools' },
  { id: 'tools',    label: 'EDA Tools & MATLAB', color: '#EC4899', section: 'Career & Tools' },
];

export type IvLevel = 'Easy' | 'Medium' | 'Hard' | 'Numerical';

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

  // ── Physical Design — Theory (Q1–Q25) ──────────────────────────────────
  {
    id: 'pd-lef-def', topic: 'pd', level: 'Easy',
    q: '[Synopsys] What are the mandatory input files for Place & Route? Explain the structural difference between a LEF file and a DEF file.',
    a: 'Mandatory inputs: Gate-Level Netlist (.v), Timing/Power Libraries (.lib/.db), Physical Libraries (.lef), Design Constraints (.sdc), RC Extraction Tech Files (.tluplus/.qrcTechFile), and Power Constraints (.upf) for multi-voltage designs.\n\nLEF (Library Exchange Format): A static abstract library file defining physical blueprints of standard cells and macros — cell boundary sizes, pin coordinates, metal layer geometries, obstruction areas, and pitch/spacing rules. Contains no timing data.\n\nDEF (Design Exchange Format): A design-specific file representing the actual chip layout — the floorplan, placed cell locations, net connections, routed wires, and vias for a specific design instance.',
  },
  {
    id: 'pd-lib-db', topic: 'pd', level: 'Easy',
    q: '[Qualcomm] What is the difference between .lib and .db formats? What critical information is in a timing library versus a physical library (.lef)?',
    a: '.lib is human-readable ASCII Liberty format containing timing arcs, power tables, and pin functions. .db is the compiled binary version of .lib, optimised for memory efficiency and fast tool loading — functionally identical but not human-readable.\n\nTiming Library (.lib/.db) contains: internal arc delays, setup/hold thresholds, NLDM/CCS/ECSM delay models, transition/capacitance tables, leakage/dynamic power tables, and pin capacitances.\n\nPhysical Library (.lef) contains: cell boundary dimensions, site types, pin coordinates, metal layer geometries, blockage regions, and pitch/spacing rules. It contains zero timing arc data.',
  },
  {
    id: 'pd-tlu-plus', topic: 'pd', level: 'Medium',
    q: '[Nvidia] What is a TLU+ or ITF file, and how does the P&R engine use RC extraction models at early placement versus post-route stages?',
    a: 'TLU+ / ITF files contain process manufacturing specifications — metal thickness, resistivity, dielectric constants, and dielectric height — used to build RC lookup tables for parasitic extraction.\n\nEarly Placement Stage: Uses virtual/global routing with fast wire-load models or distance-based RC estimation to rapidly estimate parasitic delay without detailed layout geometry.\n\nPost-Route Stage: Uses full 3D detailed extraction with exact routed metal geometries, via counts, and cross-coupling capacitance from actual placed and routed traces for final signoff STA accuracy.',
  },
  {
    id: 'pd-sdc-contents', topic: 'pd', level: 'Medium',
    q: '[Intel] What does an SDC file contain? What happens if an input port is left unconstrained in SDC?',
    a: 'SDC (Synopsys Design Constraints) contains: clock declarations (`create_clock`, `create_generated_clock`), clock characteristics (uncertainty, latency, transition), I/O delay constraints (`set_input_delay`, `set_output_delay`), design rule constraints (`set_max_transition`, `set_max_capacitance`, `set_max_fanout`), and timing exceptions (`set_false_path`, `set_multicycle_path`).\n\nUnconstrained Input Port: The tool assumes zero external input delay. Paths originating from that port are not timing-optimised, resulting in unoptimised setup/hold paths, large input transition violations, and functional failure on real silicon.',
  },
  {
    id: 'pd-core-sizing', topic: 'pd', level: 'Medium',
    q: '[Apple] How do you calculate core size and aspect ratio? What considerations dictate macro placement near the core boundary versus the center?',
    a: 'Core Area = (Total Cell Area + Total Macro Area) / Target Utilization. Aspect Ratio = Core Height / Core Width.\n\nBoundary Placement (preferred): Minimises routing congestion in the core, keeps central routing channels clear for standard cells, aligns macro pins with I/O ring connections, and avoids splitting standard-cell placement islands.\n\nCenter Placement: Only used if a macro communicates equally with surrounding blocks and minimising wire latency is critical, but it severely risks routing congestion and fragmented standard-cell regions.',
  },
  {
    id: 'pd-halo-blockage', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] What are Halo (Keepout Margin) and Blockage types (Hard, Soft, Partial)? When would you use a Partial Blockage over a Hard Blockage?',
    a: 'Halo (Keepout Margin): A dynamic perimeter around macros that travels with the macro during placement, preserving routing channels and preventing standard cells from crowding macro edges.\n\nHard Blockage: Permanently prohibits all standard cell and macro placement.\nSoft Blockage: Prohibits cells during global placement but allows placement during legalization/detailed placement if needed for timing or buffer insertion.\nPartial Blockage: Restricts cell density to a specified percentage (e.g. max 40%) to alleviate congestion.\n\nUse Partial over Hard when routing density is high but buffers still need to be placed in the region to fix timing — a hard blockage would prevent those buffer insertions entirely.',
  },
  {
    id: 'pd-flyline', topic: 'pd', level: 'Easy',
    q: '[AMD] Explain fly-line analysis during macro placement and how it helps minimise global wire congestion.',
    a: 'Fly-Line Analysis displays straight logical connection vectors between macros, standard-cell clusters, and I/O pins based on netlist topology — visualising the "demand" of global wires before routing occurs.\n\nBy orienting macros so that fly-lines are parallel, uncrossed, and short, designers avoid configurations where global wires would criss-cross and compete for the same routing tracks. Proper alignment based on fly-lines is the primary technique for preventing global routing bottlenecks before placement is committed.',
  },
  {
    id: 'pd-pdn-arch', topic: 'pd', level: 'Hard',
    q: '[Nvidia] Describe PDN components — rings, stripes, rails. How do you size core power stripes to prevent EM and IR drop?',
    a: 'Rings: Perimeter conductors surrounding the chip/core that distribute current from I/O pads to the inner power network.\nStripes: Higher-level metal vertical/horizontal grid lines that carry current across the core area.\nRails: Lowest metal (M1) structures that directly supply VDD/VSS to standard cell rows.\n\nSizing Strategy: Stripe width and pitch are calculated from maximum current (I_max), the electromigration current density limit (J_max in mA/μm), and the target maximum IR drop. For a stripe of resistance R_stripe, the allowed IR drop ΔV_max = I · R_stripe. Wider stripes lower resistance; tighter pitch reduces the distance current must travel horizontally through thin rails.',
  },
  {
    id: 'pd-ir-drop-types', topic: 'pd', level: 'Medium',
    q: '[Intel] What is the distinction between Dynamic IR drop and Static IR drop? Which floorplan choices aggravate Dynamic IR drop?',
    a: 'Static IR Drop: DC voltage drop caused by resistive loss V = I_avg · R during steady-state average current draw through the power grid.\n\nDynamic IR Drop: AC voltage drop ΔV = L · di/dt + I_peak · R caused by localized transient peak currents when large numbers of gates switch simultaneously on a clock edge.\n\nAggravating Floorplan Choices: High-density cell clusters near high-frequency clock trees; placing macros close together without sufficient local power stripes; narrow power trunks near high-switching-activity functional units; and insufficient local decap cell insertion near switching clock gating cells.',
  },
  {
    id: 'pd-decap', topic: 'pd', level: 'Easy',
    q: '[Samsung] What are Decoupling Capacitors (Decaps), where are they placed, and how do they mitigate transient switching noise?',
    a: 'Decoupling Capacitors are localised charge reservoirs placed between VDD and VSS rail networks, typically implemented as always-on MOSFET capacitors in standard-cell rows.\n\nPlacement: Distributed near high-frequency clock gates, memory macro borders, and power domain boundaries — wherever peak current demand is highest.\n\nNoise Mitigation: During high transient di/dt events (many gates switching simultaneously), Decaps supply instantaneous charge locally to the switching logic before the main power supply can respond through the resistive/inductive power grid, preventing the VDD rail from dipping below the safe operating voltage.',
  },
  {
    id: 'pd-placement-phases', topic: 'pd', level: 'Easy',
    q: '[Cadence] What are the internal algorithmic phases of placement — Global Placement, Congestion Optimisation, Legalization, Detailed Placement?',
    a: 'Global Placement: Determines coarse spatial positions across the floorplan while temporarily allowing cell overlaps. Objective is to minimise total wirelength and timing cost.\n\nCongestion Optimisation: Adjusts cell density based on routing track availability, spreading cells away from over-congested regions to ensure routable density distribution.\n\nLegalization: Eliminates all cell overlaps and snaps cells precisely to standard-cell rows and site grid boundaries.\n\nDetailed Placement: Performs fine local cell swapping and micro-adjustments to minimise total wirelength, reduce transition violations, and improve setup timing — while maintaining legality from the previous step.',
  },
  {
    id: 'pd-tap-cells', topic: 'pd', level: 'Easy',
    q: '[Apple] What is the physical role of Tap Cells (Well-taps), and how do they prevent CMOS latch-up? What determines their maximum pitch?',
    a: 'Tap Cells connect the p-substrate to VSS and the n-well to VDD at regular intervals throughout standard-cell rows, ensuring the substrate and well are tied to their correct supply potentials.\n\nLatch-Up Prevention: Without well-taps, the parasitic PNP (p-sub/n-well/p-source) and NPN (n-well/p-sub/n-source) transistors can form a parasitic SCR (thyristor). If triggered by a noise event, the SCR latches into a low-resistance conducting state, shorting VDD to VSS and potentially destroying the device.\n\nMaximum Pitch: Dictated by the foundry Design Rule Manual (DRM) based on substrate and n-well sheet resistance — tap spacing must be close enough that the resistive voltage drop in the well/substrate stays below the threshold for parasitic bipolar turn-on.',
  },
  {
    id: 'pd-vt-swap', topic: 'pd', level: 'Medium',
    q: '[Nvidia] Compare HVT, SVT, and LVT cells in terms of power, delay, and leakage. How does P&R swap VT cells during timing closure?',
    a: 'LVT (Low Threshold Voltage): Fastest switching delay, standard dynamic power, very high leakage — used on critical timing paths.\nSVT (Standard VT): Medium delay, moderate leakage — the default for most logic.\nHVT (High VT): Slowest delay, lowest leakage — used for non-critical paths to minimise standby power.\n\nP&R VT Swapping Strategy: Placement engines begin with an all-HVT library to minimise leakage. During timing closure, paths with negative setup slack are selectively swapped from HVT to SVT or LVT to recover timing margin. Hold violations on heavily-buffered paths may require swapping back to HVT. The final mix balances timing closure with a power/leakage budget target.',
  },
  {
    id: 'pd-endcap', topic: 'pd', level: 'Easy',
    q: '[Qualcomm] What is End-Cap cell placement, and why is it necessary at row boundaries or macro peripheries?',
    a: 'End-Cap Cells are specialised non-logical cells inserted at the left and right terminations of every standard-cell row and at the edges of hard macro boundaries.\n\nNecessity: They provide gate-oxide and well-isolation at row edges, prevent optical and lithographic edge-distortion artifacts during manufacturing, and satisfy active-layer enclosure rules in the Design Rule Manual (DRM). Without end-caps, the active diffusion at the edge of a row would be exposed to manufacturing process effects that cause transistor degradation or DRC violations.',
  },
  {
    id: 'pd-tie-cells', topic: 'pd', level: 'Easy',
    q: "[Intel] Explain Tie-High and Tie-Low cells. Why don't we connect standard cell gate terminals directly to VDD or VSS?",
    a: "Tie-High and Tie-Low cells are dummy driver cells that provide a constant logic '1' (VDD) or logic '0' (VSS) output through a protective transistor structure.\n\nWhy Not Direct Connection: Connecting a gate terminal directly to the VDD or VSS power rail subjects the fragile thin-gate oxide directly to power supply voltage transients, ESD spikes, and current surges that occur during power-on or antenna charge accumulation. This risks irreversible gate oxide breakdown. Tie cells contain internal pull-up or pull-down transistors with built-in current limiting and ESD protection, providing the correct logic level safely.",
  },
  {
    id: 'pd-scan-reorder', topic: 'pd', level: 'Medium',
    q: '[Broadcom] What is Scan Chain Reordering? Why is it executed during placement, and how does it affect DFT routing?',
    a: 'Scan Chain Reordering re-arranges the logical order of test flip-flops in a scan chain based on their actual physical placement locations after global placement is complete.\n\nWhy During Placement: The original DFT scan chain order is determined before physical placement and is based on netlist topology — not physical proximity. Post-placement, the logically ordered chain produces long criss-crossing scan interconnects between physically distant flip-flops, consuming large amounts of global routing resources.\n\nRouting Benefit: Reordering the scan chain so adjacent flip-flops in the chain are also physically adjacent drastically reduces scan wire length, frees global routing capacity for functional signals, and reduces total design congestion — without changing the DFT test coverage or test pattern.',
  },
  {
    id: 'pd-cts-goals', topic: 'pd', level: 'Easy',
    q: '[Synopsys] What are the primary goals of Clock Tree Synthesis? Differentiate between Clock Skew, Insertion Delay (Latency), and Clock Jitter.',
    a: 'Primary CTS Goals: Distribute the clock with minimum skew between all sinks, acceptable insertion delay, clean transition times meeting library limits, and minimum clock power consumption.\n\nClock Skew: The maximum difference in clock arrival time between any two flip-flop clock pins within a clock domain. Skew directly impacts both setup and hold timing margins.\n\nInsertion Delay (Latency): The total propagation time from the clock source to a flip-flop clock pin — the sum of source latency (PLL to chip port) and network latency (chip port to sink, built during CTS).\n\nClock Jitter: Cycle-to-cycle variation in clock edge arrival time relative to the ideal clock period, caused by PLL phase noise, power supply ripple, or thermal effects. Jitter is modelled in STA as clock uncertainty.',
  },
  {
    id: 'pd-clock-topo', topic: 'pd', level: 'Medium',
    q: '[Nvidia] Compare H-Tree, Mesh, and Balanced Buffer Tree topologies. When would an enterprise GPU design choose a Clock Mesh over an H-tree?',
    a: 'H-Tree: Symmetric recursive branching topology with mathematically zero structural skew. Ideal for regular array structures (memory, datapath) but inflexible for irregular floorplans.\n\nBalanced Buffer Tree: Standard CTS approach using balanced buffer chains. Flexible for arbitrary floorplans, but susceptible to dynamic OCV variation and process-induced skew.\n\nClock Mesh: A highly interconnected metal grid driven by multiple parallel clock buffers, where any local variation is averaged out by the mesh connectivity.\n\nGPU/ASIC preference for Mesh: On large die areas (>100mm²) with millions of flip-flops, process and temperature gradients cause significant dynamic skew in tree structures. A clock mesh provides self-equalising delay — local skew from a single buffer is absorbed by adjacent mesh drivers — giving superior jitter tolerance and variation resistance despite higher power consumption.',
  },
  {
    id: 'pd-clock-latency', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] What is Source Latency vs. Network Latency? How do virtual clocks model source latency?',
    a: 'Source Latency: The time delay from the master clock source (e.g., crystal oscillator or PLL output) to the chip input clock port. This delay exists outside the chip and is modelled in SDC using `set_clock_latency -source`.\n\nNetwork Latency: The time delay from the chip input clock port through the synthesised clock tree to the target flip-flop clock pin. This is built and controlled during CTS.\n\nVirtual Clocks: Clocks defined in SDC without an attached physical port — used to model timing relationships for external I/O interfaces operating on off-chip clock sources. Source latency is applied to virtual clocks to account for the external clock path delay, allowing accurate `set_input_delay` and `set_output_delay` constraints for chip-to-chip interfaces.',
  },
  {
    id: 'pd-useful-skew', topic: 'pd', level: 'Hard',
    q: '[Apple] What is Useful Skew (Clock Pulling/Pushing)? How can deliberately introduced skew fix a setup violation without altering datapath logic?',
    a: "Useful Skew deliberately introduces unequal clock arrival times at launch and capture flip-flops to trade setup margin against hold margin.\n\nSetup Fix by Clock Pushing: If the data path FF_A → combo → FF_B violates setup timing, delay the clock arrival at FF_B (the capture flop) by inserting additional buffers on FF_B's clock path. This gives the data more time to propagate and arrive before the clock edge at FF_B — effectively 'stealing' time from the clock cycle without touching any logic.\n\nConstraint: Adding delay to the capture clock worsens the hold check at FF_B (hold slack = arrival_min − capture_lat − T_hold). Useful skew must be balanced so the hold violation on the same path is not worsened beyond fixable limits. CTS tools implement this as a constrained optimisation across all paths.",
  },
  {
    id: 'pd-icg-cells', topic: 'pd', level: 'Medium',
    q: '[AMD] What are Integrated Clock Gating (ICG) cells? What is the enable setup/hold check on an ICG cell, and how is it closed in CTS?',
    a: 'ICG (Integrated Clock Gating) cells combine a latch and an AND gate to safely disable clock switching on idle registers, eliminating spurious clock edges and reducing dynamic power on inactive data paths.\n\nEnable Setup Check: The enable signal must arrive at the ICG latch input and be stable before the active clock edge that closes the latch — preventing a glitch on the gated clock output. Violation means the enable could be sampled mid-transition, creating a partial-width clock pulse.\n\nEnable Hold Check: The enable must remain stable after the clock edge for the latch hold time.\n\nClosing in CTS: The CTS engine balances latency to the ICG enable pin just as it does for flip-flop clock pins, inserting buffers on the enable path or adjusting the clock arrival at the ICG to satisfy both enable setup and hold timing checks simultaneously.',
  },
  {
    id: 'pd-clock-buffers', topic: 'pd', level: 'Easy',
    q: '[Intel] Why do we use specialised Clock Buffers/Inverters instead of regular logic buffers in the clock tree?',
    a: 'Clock Buffers are purpose-designed with symmetric rise and fall delays (matched to maintain 50% duty cycle through the tree), high drive strength, balanced output capacitance, and physically symmetric internal layout to avoid introducing additional skew.\n\nLogic Buffers are optimised for minimum cell area, not symmetry — they typically have asymmetric rise/fall times, which cause duty-cycle distortion and introduce skew when used in balanced clock trees. A single asymmetric buffer in a clock path can shift all downstream flip-flop capture edges, creating effective skew that cannot be balanced by further tree optimisation.',
  },
  {
    id: 'pd-routing-phases', topic: 'pd', level: 'Easy',
    q: '[Nvidia] Describe Global Routing vs. Track Assignment vs. Detailed Routing.',
    a: 'Global Routing: Partitions the core into a grid of G-cells and assigns each net to a sequence of routing regions (G-cells) without specifying exact metal tracks. Produces a coarse routing plan used to estimate congestion and guide detailed routing.\n\nTrack Assignment: Takes the global routing solution and assigns each wire segment to a specific metal track and layer, resolving track conflicts and minimising vias and wire jogs. Improves routability before detailed routing.\n\nDetailed Routing: The final physical routing step. Places exact metal polygons and vias on the layout while obeying all lithography DRC rules (minimum width, spacing, enclosure, via size). Produces the actual mask-ready geometry.',
  },
  {
    id: 'pd-ndr-shield', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] What are Non-Default Rules (NDR)? Why do we apply double-width, double-spacing, or shielding to critical clock signals?',
    a: 'Non-Default Rules (NDR) are custom routing specifications that override the default minimum design rules for specific nets, typically specifying wider width and/or larger spacing than the technology minimum.\n\nDouble-Width: Reduces wire resistance (R ∝ 1/W), lowering RC delay and IR drop on long clock nets. Also improves electromigration reliability.\n\nDouble-Spacing: Reduces capacitive coupling (crosstalk) from adjacent switching signals to the critical clock net, preventing clock edge jitter induced by aggressor switching.\n\nShielding (VSS/VDD guard wires): Places static-voltage VSS or VDD wires immediately adjacent to the clock net. Since shield wires never switch, they provide a fixed coupling capacitance that eliminates dynamic crosstalk noise and prevents crosstalk-induced delay variation on the protected clock.',
  },
  // ── Physical Design — Theory (Q26–Q50) ─────────────────────────────────
  {
    id: 'pd-crosstalk-mech', topic: 'pd', level: 'Medium',
    q: '[Nvidia] Explain the mechanisms of Crosstalk Glitch and Crosstalk Delay. What is Miller Coupling Factor (MCF)?',
    a: 'Crosstalk Glitch: A spurious voltage spike on a quiet victim net caused by capacitive coupling from a switching aggressor net. If the glitch magnitude exceeds the receiver threshold, it can cause functional errors by flipping a latch or register.\n\nCrosstalk Delay: A change in signal propagation delay on the victim net due to capacitive coupling from a switching aggressor. When aggressor and victim switch in the same direction simultaneously, the effective coupling capacitance is reduced (faster transition). When they switch in opposite directions, effective capacitance doubles (slower transition — setup violation risk).\n\nMiller Coupling Factor (MCF): A factor that scales the coupling capacitance to model the effective aggressor switching impact. MCF = 0 when aggressor is static (only ground capacitance Cg). MCF = 1 for same-direction switching. MCF = 2 for opposite-direction switching (maximum pessimism), effectively doubling Cc in timing analysis.',
  },
  {
    id: 'pd-crosstalk-fixes', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] What are the standard ECO techniques to fix a crosstalk timing violation found during SI analysis?',
    a: 'Spacing: Increase physical separation between aggressor and victim wires — the primary and cheapest fix. Coupling capacitance Cc ∝ 1/d.\n\nShielding: Insert VSS/VDD guard wires adjacent to the victim net, providing a static capacitive ground that prevents aggressor-induced delta-V from coupling into the victim.\n\nLayer Change: Move either the aggressor or victim to a different metal layer — parallel wires on different layers have lower interlayer coupling capacitance than same-layer wires at minimum spacing.\n\nDriver Upsizing: Increase the victim driver strength. A lower driver output impedance Rd reduces the RC time constant of the victim path, making it less susceptible to coupling-induced delay shift.\n\nNet Buffering: Insert buffers on the victim net to break the long parallel coupling run into shorter segments, reducing the total coupling length and therefore total Cc.',
  },
  {
    id: 'pd-antenna-effect', topic: 'pd', level: 'Medium',
    q: '[Intel] What is the Antenna Effect (Plasma-Induced Gate Oxide Damage)? Name three methods to fix an antenna DRC violation.',
    a: "Antenna Effect: During plasma etching in CMOS fabrication, metal and poly wires act as antennas that accumulate plasma charge. If a long metal segment is directly connected to a transistor gate before the gate's protective source/drain implant is formed, the accumulated charge can create a high electric field across the thin gate oxide, causing permanent dielectric breakdown.\n\nFix Methods:\n1. Layer Hopping (Jumper): Route the antenna-violating net up to a higher metal layer (one that has its top-level connections completed before the lower etch), inserting a via at the violation point. The higher layer's charge escapes through the completed connections.\n2. Antenna Diode Insertion: Add a reverse-biased diode (tied to VSS/VDD) near the gate input. During processing, the diode conducts in breakdown and discharges accumulated plasma charge harmlessly to the supply rail.\n3. Net Splitting: Re-route the long wire to break it into shorter antenna-compliant segments connected through upper metal layers.",
  },
  {
    id: 'pd-em-factors', topic: 'pd', level: 'Easy',
    q: '[Samsung] What causes Electromigration (EM) in metal interconnects, and what design rules prevent EM violations?',
    a: 'Electromigration: A physical phenomenon where sustained high-density electron flow (momentum transfer from electrons to metal ions) displaces metal atoms along the wire, causing voids (opens) at cathode regions and hillocks (shorts) at anode regions over time — reliability failure.\n\nDesign Rules to Prevent EM: Maximum current density limits (J_max in mA/μm) specified per metal layer and temperature. Width sizing rules: wider wires carry more current (W ∝ I_rms). Average current limits for unidirectional DC signals. RMS current limits for bidirectional (clock/data) signals. Via redundancy rules to distribute current across multiple parallel vias.',
  },
  {
    id: 'pd-temp-inversion', topic: 'pd', level: 'Hard',
    q: '[Apple] Explain Temperature Inversion in advanced nodes. Why do cells become faster at higher temperatures at sub-65nm nodes?',
    a: "Traditional CMOS (older nodes): Higher temperature increases carrier scattering (thermal phonons), reducing mobility and slowing transistors — worst-case timing was always at maximum temperature.\n\nTemperature Inversion (sub-65nm nodes): As Vt (threshold voltage) has been scaled aggressively relative to Vdd, the Vt temperature coefficient dominates over mobility degradation. At high temperatures, Vt decreases significantly, causing Ion to increase. This actually makes cells faster at higher temperatures — inverting the traditional temperature-speed relationship.\n\nImpact on STA: Worst-case setup timing may now occur at cold corners (low temperature, higher Vt, slower cells) rather than hot corners. Multi-corner STA must include cold fast corners, and library characterisation must cover the full temperature range to avoid signoff misses.",
  },
  {
    id: 'pd-finfet-layout', topic: 'pd', level: 'Medium',
    q: '[TSMC] What are unique FinFET layout constraints versus planar CMOS — fin quantisation, gate pitch, and diffusion breaks?',
    a: "Fin Quantisation: FinFET transistor width is quantised in discrete steps (W = n × Wfin). Unlike planar CMOS where W is continuously sized, FinFET strength can only be adjusted by integer numbers of fins — limiting drive strength granularity to coarse steps.\n\nUniform Gate Pitch: FinFET processes require regular, constant polysilicon gate pitch across the cell to control critical dimension uniformity in EUV lithography. Variable-pitch poly (as in planar CMOS) is not allowed.\n\nDiffusion Breaks (Single/Double): To electrically isolate adjacent transistors in the same cell row, a cut in the fin (diffusion) is required. Single diffusion breaks consume less area but may cause stress-induced mobility variation. Double diffusion breaks provide better isolation but consume more routing track space.",
  },
  {
    id: 'pd-mcmm', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] What is Multi-Corner Multi-Mode (MCMM) analysis, and what are the typical corners analysed for signoff?',
    a: 'MCMM simultaneously analyses the design across multiple operating conditions (Corners) and functional configurations (Modes) to ensure timing closure under all realistic conditions.\n\nTypical Signoff Corners: SS (Slow-Slow, high Vt, low Vdd, hot) for setup; FF (Fast-Fast, low Vt, high Vdd, cold) for hold; TT (Typical) for power estimation; RC corners (min/max metal resistance based on ILD thickness variation) for interconnect delay.\n\nTypical Modes: Functional (scan mode off, all paths active), Test/Scan (scan chains active), Low-Power (clock gating active), High-Performance (all clocks at max frequency).\n\nSignoff requires all modes to pass all timing checks under their corresponding worst-case corners simultaneously — a single failing path in any corner/mode combination blocks tape-out.',
  },
  {
    id: 'pd-ocv-aocv-pocv', topic: 'pd', level: 'Hard',
    q: '[Intel] Differentiate OCV, AOCV, and POCV derating methodologies. Why does POCV provide the best accuracy?',
    a: "OCV (On-Chip Variation): Applies flat, constant derating factors (e.g. early +5%, late -5%) to all cells regardless of their depth in the path. Simple but overly pessimistic — applies maximum derating even to short paths where statistical variation averages out.\n\nAOCV (Advanced OCV): Applies derating factors that reduce with increasing path depth (number of stages). Longer paths experience more statistical averaging, so less derating is applied. More accurate than flat OCV for long paths.\n\nPOCV (Parametric OCV): Uses statistical cell delay distributions (sigma values from Monte Carlo characterisation) and accumulates variation using RSS (Root Sum Squares) rather than worst-case addition. This models the statistical independence of variation sources across multiple cells.\n\nWhy POCV is Most Accurate: Real process variation on different cells in the same path is partially independent — not all cells hit their worst case simultaneously. OCV and AOCV worst-case addition is overly pessimistic. POCV's statistical accumulation matches silicon measurement data and produces signoff margins that are tighter (less pessimistic) while remaining statistically valid.",
  },
  {
    id: 'pd-gba-pba', topic: 'pd', level: 'Medium',
    q: '[Nvidia] What is the difference between Graph-Based Analysis (GBA) and Path-Based Analysis (PBA) in STA?',
    a: 'GBA (Graph-Based Analysis): Computes worst-case timing at each node in the timing graph independently by taking the worst-case arrival time from all upstream paths. Fast (single graph traversal) but pessimistic — it assumes all worst-case conditions occur simultaneously on all paths, which is physically impossible.\n\nPBA (Path-Based Analysis): Traces individual endpoint-to-startpoint paths and applies derating/OCV only to the exact cells in that specific path. Eliminates false pessimism where GBA assumes impossible worst-case combinations.\n\nUsage: GBA is used throughout P&R for fast iteration speed. PBA is applied at signoff on endpoints that fail GBA to determine whether the violation is a genuine failure or GBA pessimism — avoiding unnecessary ECO iterations.',
  },
  {
    id: 'pd-drc-lvs-erc', topic: 'pd', level: 'Easy',
    q: '[Synopsys] Define DRC, LVS, and ERC. What class of errors does each check catch?',
    a: "DRC (Design Rule Check): Verifies that all physical layout geometries (wire widths, spacings, enclosures, densities, via sizes) comply with the foundry's process design rules. Catches: layout-to-process rule violations that would cause shorts, opens, or manufacturability failures.\n\nLVS (Layout vs. Schematic): Extracts the netlist from the physical layout and compares it against the schematic/gate-level netlist. Catches: missing connections, shorts, wrong device types, incorrect device sizing, and extra/missing ports.\n\nERC (Electrical Rule Check): Verifies electrical correctness — floating gates, missing well/substrate connections, forward-biased junctions, floating outputs. Catches: electrically unsafe configurations that DRC and LVS do not cover because they are geometrically and connectivity-correct but electrically dangerous.",
  },
  {
    id: 'pd-lvs-debug', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] How do you debug an LVS short between Power and Ground? Describe the isolation methodology.',
    a: "LVS VDD-VSS Short Isolation Methodology:\n1. Identify the short net in the LVS error report — tool reports it as a merged net (VDD and VSS treated as one).\n2. Bisect the design: Divide the layout into halves. Run LVS on each half independently to determine which half contains the short.\n3. Recurse into the failing half, repeatedly bisecting until the short is localised to a single cell or routing segment.\n4. Inspect the identified location in the layout viewer: look for minimum-spacing violations between M1 VDD rails and VSS rails, incorrect fill shapes bridging power rails, or a cell's internal diffusion short.\n5. Verify the fix: Re-run LVS on the full design after correcting the short to confirm the merged net is resolved.",
  },
  {
    id: 'pd-metal-fill', topic: 'pd', level: 'Easy',
    q: '[TSMC] What is Metal Fill insertion and why is it required? What are the density DRC checks it must satisfy?',
    a: 'Metal Fill: Dummy metal polygons inserted in regions of low metal density after routing is complete, to ensure the layout meets foundry minimum and maximum metal density design rules.\n\nWhy Required: CMP (Chemical Mechanical Planarisation) processes used to flatten metal layers are sensitive to local pattern density. Regions that are too sparse experience excessive oxide dishing (the surface sinks due to uneven polishing), while overly dense regions suffer from metal erosion. Both distortions alter final wire resistance and capacitance beyond model accuracy.\n\nDensity DRC Checks: Minimum metal density per layer per unit window (e.g. minimum 20% M1 coverage in any 50×50μm window) and maximum metal density limits (e.g. max 80%) that floating fill shapes must satisfy in all density check windows.',
  },
  {
    id: 'pd-eco-types', topic: 'pd', level: 'Medium',
    q: '[Intel] Differentiate between a Functional ECO and a Timing ECO. How is a metal-only ECO used for post-mask silicon fix?',
    a: 'Functional ECO: Changes the logical function of the design — adds/removes/modifies gates to fix a design bug discovered in simulation or silicon debug. Requires re-synthesis, re-placement, and complete re-routing of affected logic.\n\nTiming ECO: Modifies the physical implementation without changing logical function — buffer insertions, cell upsizing, VT swaps, wire spreading — to close a setup or hold timing violation.\n\nMetal-Only ECO: A post-mask fix that modifies only upper metal layers (Metal 3 and above) without changing base-layer masks (poly, diffusion, contacts, M1). Used when lower-layer masks are already committed (tapeout done). Achieves functional changes by rewiring existing cells in pre-inserted spare cell islands — the base layers are reused as-is, only the upper metal connectivity changes. This saves the cost of re-fabricating expensive base-layer masks.',
  },
  {
    id: 'pd-lec', topic: 'pd', level: 'Easy',
    q: '[Cadence] What does Logical Equivalence Checking (LEC) verify, and at what stages of the PD flow is it run?',
    a: "LEC (Logical Equivalence Checking) is a formal verification method that proves the logical function of two netlists (or gate-level vs. RTL) is identical — without simulation vectors. It uses Boolean satisfiability and BDD techniques to exhaustively compare all input-output relationships.\n\nKey Stages:\n1. Post-Synthesis: Verify gate-level netlist is logically equivalent to the RTL source.\n2. Post-ECO: Verify that the ECO-modified netlist is still equivalent to the pre-ECO reference after any timing or functional fix.\n3. Post-Scan Insertion: Verify the DFT-modified netlist (with scan chains) is functionally equivalent in functional mode.\n4. Pre-Signoff: Final confirmation that the tapeout netlist matches the verified RTL.",
  },
  {
    id: 'pd-upf-terms', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] Define the UPF terms: Power Domain, Supply Net, Isolation Cell, Level Shifter, and Retention Register.',
    a: 'Power Domain: A logical grouping of design elements that share the same power supply and can be independently powered on or off.\n\nSupply Net: An abstract net in UPF that models a physical power supply connection (VDD, VSS, or a level-shifted supply) — separate from the signal netlist.\n\nIsolation Cell: A special cell inserted at the boundary between a power domain that can be shut down and an always-on domain. When the source domain is powered off, the isolation cell clamps its output to a safe known logic value (0 or 1), preventing X-propagation into always-on logic.\n\nLevel Shifter: A cell inserted at cross-domain signal boundaries where the source and destination domains operate at different supply voltages, translating the signal voltage level to ensure correct logic thresholds at the receiving domain.\n\nRetention Register: A flip-flop with an always-on shadow latch. Before the primary supply is cut, the state is saved to the shadow latch; when power is restored, the state is restored — preserving context across power-off events.',
  },
  {
    id: 'pd-level-shifters', topic: 'pd', level: 'Medium',
    q: '[Apple] When are High-to-Low vs. Low-to-High level shifters required? What happens if a level shifter is missing?',
    a: 'High-to-Low Shifter (Step-Down): Required when a signal originates from a domain at higher VDD and drives logic in a domain at lower VDD. Without it, the high-voltage output may be interpreted as a voltage above the lower domain VDD, potentially causing oxide stress or always-on logic levels at the receiver.\n\nLow-to-High Shifter (Step-Up): Required when a signal originates from a lower-voltage domain and drives higher-voltage domain logic. Without it, the signal swing may not reach the logic threshold of the higher-VDD receiver, causing indeterminate (X) logic levels and functional failure.\n\nMissing Level Shifter Consequence: Without a shifter, the cross-domain interface may pass incorrect logic levels (below Vil or above Vih), cause latch-up in the receiving domain, or create static current paths between the two different supply domains — all causing functional or reliability failures.',
  },
  {
    id: 'pd-isolation-cells', topic: 'pd', level: 'Medium',
    q: '[Nvidia] Why must isolation cells be placed in the always-on domain rather than the shutoff domain?',
    a: "Isolation cells must be powered from the always-on supply domain because they operate precisely during and after the source domain's power-down event.\n\nIf isolation cells were placed in the shutoff domain, they would lose power at the same time as the logic they are supposed to clamp — the isolation function would disappear exactly when it is needed, allowing floating/X values to propagate from the powerless shutoff domain into the always-on receiver logic. This would cause functional failures, metastability, or latch-up in the downstream logic.\n\nBy placement in the always-on domain, the isolation cell remains active with its clamped output driving the receiver safely (to '0' or '1') throughout the entire period when the source domain is shut off.",
  },
  {
    id: 'pd-congestion-map', topic: 'pd', level: 'Easy',
    q: '[AMD] How do you read a Congestion Map from an EDA tool and what does it tell you about your floorplan quality?',
    a: 'A Congestion Map visualises the routing demand vs. routing supply ratio across the core area as a colour heat map — green areas have available routing tracks (demand < supply); yellow/orange areas are near capacity; red areas have routing demand exceeding available track supply (overflow = 0 routes at those locations).\n\nFloorplan Quality Indicators: Red hotspots near macro boundaries indicate the macro is blocking horizontal or vertical routing channels — repositioning or reorienting the macro would help. Widespread congestion in the core center suggests utilization is too high. Congestion aligned with clock tree buffers indicates CTS is consuming too many routing resources. The number of global routing overflows (GRC violations) is the primary numeric metric: target is 0 overflows at global routing stage before detailed routing begins.',
  },
  {
    id: 'pd-max-tran-fix', topic: 'pd', level: 'Easy',
    q: '[Synopsys] What causes maximum transition violations, and how are they fixed during P&R?',
    a: 'Maximum Transition Violation: The signal transition time (slew) at a cell output exceeds the library-specified maximum transition limit. Slow transitions cause: increased short-circuit current (both PMOS and NMOS partially on simultaneously), erratic delay values outside the characterised NLDM table range, and downstream cells receiving slow input transitions that degrade their own output delays.\n\nCauses: Excessive net capacitance from a high fanout or long wire; weak driver cell unable to charge the load quickly.\n\nFixes: Driver upsizing — replace with a higher drive-strength cell of the same function. Net splitting via buffer insertion — place a buffer midway on the long net, reducing the capacitance driven by the original driver. Fanout reduction — split a high-fanout net into two trees each driven by separate buffer instances.',
  },
  {
    id: 'pd-placement-constraints', topic: 'pd', level: 'Easy',
    q: '[Qualcomm] Explain Region Constraints and Fence Constraints. How do they differ in controlling cell placement?',
    a: 'Region Constraint (Soft): Specifies a preferred placement area for a group of cells (module or cluster). The P&R tool places cells inside the region when possible, but may spill outside the boundary if necessary to resolve congestion, timing, or legality issues.\n\nFence Constraint (Hard): Creates a strict, inviolable boundary. Cells assigned to the fence MUST be placed inside; cells not assigned to the fence CANNOT be placed inside. Provides full placement isolation for sub-blocks (e.g., a synchroniser, a critical timing path, or an IP block that must be physically isolated from surrounding logic).\n\nDifference: Region = strong suggestion with overflow allowed. Fence = absolute hard boundary with no overflow permitted in either direction.',
  },
  {
    id: 'pd-latch-timeborrow', topic: 'pd', level: 'Hard',
    q: '[Intel] Explain Time Borrowing in latch-based design. How does it differ from flip-flop timing analysis?',
    a: "Time Borrowing (Latch-Based): A latch is transparent for the entire half-cycle it is enabled (not just at a single clock edge like a flip-flop). If data arrives late from a previous stage (borrowing time from the current cycle), it can still pass through the latch while it remains transparent — provided it arrives before the latch closes.\n\nQuantitative Benefit: A latch-based pipeline stage can borrow up to T_clk/2 of extra time from the next pipeline stage, smoothing out timing imbalances across stages without requiring retiming or buffer insertion.\n\nDifference from Flip-Flop: A flip-flop samples data only at a single rising edge — there is no borrowing window. Setup time must be met relative to that one edge. Latches amortise timing slack across two adjacent pipeline stages, enabling designs with unbalanced paths (e.g., high-performance arithmetic units) that would violate flip-flop setup without retiming.",
  },
  {
    id: 'pd-dmsa', topic: 'pd', level: 'Medium',
    q: '[Nvidia] What is Distributed Multi-Scenario Analysis (DMSA) in Synopsys ICC2/Fusion Compiler?',
    a: 'DMSA distributes the MCMM (Multi-Corner Multi-Mode) timing analysis workload across multiple CPU cores or compute machines simultaneously, running each corner/mode scenario in parallel rather than sequentially.\n\nBenefit: Reduces total wall-clock time for full MCMM timing closure from hours (sequential) to minutes (parallel) on large server clusters. Each worker process handles one scenario independently, then reports violations back to the master optimisation engine.\n\nUsage: Critical for designs with >10 timing scenarios (common in mobile SoCs: functional, test, low-power, memory access, and multiple PVT corners). Without DMSA, full signoff MCMM runs that previously took 8–12 hours can be completed in under 2 hours.',
  },
  {
    id: 'pd-etm-ilm', topic: 'pd', level: 'Medium',
    q: '[Qualcomm] Compare Extracted Timing Model (ETM) vs. Interface Logic Model (ILM) for hierarchical STA.',
    a: 'ETM (Extracted Timing Model): A black-box model of a completed block that retains only the input-to-output and input-to-register timing arcs visible at the boundary. Internal paths and internal state are abstracted away. Smaller file size, suitable for top-level STA when the block is treated as a fully closed sub-design.\n\nILM (Interface Logic Model): A partial model that retains the boundary logic (first/last stage registers and combinational paths) visible to the top level but removes the internal logic. Allows the top-level STA engine to optimise paths that cross the block boundary — including driving the boundary registers and fanout from the boundary outputs.\n\nKey Difference: ETM is fully black-box — no top-level optimisation can penetrate the block. ILM exposes boundary logic for cross-boundary timing closure, enabling buffer insertion and sizing at the block I/O interface from the top-level flow.',
  },
  {
    id: 'pd-metal-stack', topic: 'pd', level: 'Easy',
    q: '[Samsung] What drives the choice of metal layer for routing — signal, clock, power, and global routing layers?',
    a: 'Lower Metals (M1–M2): Highest resistivity per unit width due to narrow minimum width rules. Used for local cell-to-cell signal connections and standard cell internal routing. Short wires only.\n\nMid-Level Metals (M3–M5): Moderate resistivity. Used for block-level signal routing, intermediate clock distribution, and local power distribution.\n\nUpper Metals (M6–Mx): Lowest resistivity (wider minimum widths allowed, thicker dielectrics, lower sheet resistance). Used for long global signal nets, clock trunk routing, and power grid stripes where low resistance is critical.\n\nPower/Ground: Allocated to the widest, thickest top metals to minimise IR drop across the full die. Clock trunk routes use upper metals with NDR double-width rules. Signal routes are stacked from M2 upward based on congestion and timing criticality.',
  },
  {
    id: 'pd-unconstrained-ep', topic: 'pd', level: 'Easy',
    q: '[Intel] What is an Unconstrained Endpoint? Why should unconstrained endpoints be resolved before signoff?',
    a: "An Unconstrained Endpoint is a flip-flop clock pin, data pin, or output port that has no timing constraint applied — no `set_input_delay`, no `set_output_delay`, no `create_clock`, or belongs to a path declared `set_false_path` or `set_multicycle_path` unintentionally.\n\nWhy Resolve: Unconstrained endpoints are not optimised or checked during P&R timing closure. They may silently contain large setup or hold violations that only manifest on real silicon. At signoff, unconstrained endpoints appear as 'MET' (not-analysed) in STA reports, giving false confidence that the design is timing-clean. Industry standard: zero unconstrained logic endpoints allowed at tapeout.",
  },
  {
    id: 'pd-esd-protection', topic: 'pd', level: 'Easy',
    q: '[Qualcomm] What are ESD protection structures, and where are they placed in the chip I/O ring?',
    a: "ESD (Electrostatic Discharge) protection structures clamp parasitic voltage spikes (up to several kV from human body model or machine model ESD events) that appear on I/O pads, preventing the spike from reaching the fragile core logic.\n\nCommon Structures: Dual-diode clamps (one diode to VDD, one to VSS per I/O pad), large NMOS snapback transistors, SCR (silicon-controlled rectifier) clamp cells, and power clamp cells across VDD-VSS.\n\nPlacement: In the I/O ring between the pad metal and the core-facing ESD bus (VDD-VSS rail running around the periphery dedicated to ESD discharge). Every I/O pad receives local diode clamps. Power clamp cells are distributed around the I/O ring at intervals to ensure ESD current discharged at one pad can flow around the ring to reach the nearest power clamp without exceeding safe current density in the ESD bus.",
  },
  // ── Physical Design — Numericals (Q51–Q75) ─────────────────────────────
  {
    id: 'pd-num-setup-slack', topic: 'pd', level: 'Numerical',
    q: '[Synopsys] A Reg-to-Reg path has: launch clock latency = 0.8 ns, Clk-to-Q = 0.4 ns, combinational delay = 3.1 ns, capture clock latency = 0.6 ns, T_clk = 5 ns, T_setup = 0.3 ns. Calculate the Setup Slack.',
    a: 'Given: T_launch_lat = 0.8 ns, T_clk→q = 0.4 ns, T_combo = 3.1 ns, T_capt_lat = 0.6 ns, T_clk = 5 ns, T_setup = 0.3 ns.\n§F: T_arrival = T_launch_lat + T_clk→q + T_combo\n§C: = 0.8 + 0.4 + 3.1 = 4.3 ns\n§F: T_required = T_clk + T_capt_lat − T_setup\n§C: = 5.0 + 0.6 − 0.3 = 5.3 ns\n§F: Setup Slack = T_required − T_arrival\n§C: = 5.3 − 4.3 = +1.0 ns\n§R: Setup Slack = +1.0 ns ✓ (Timing Met)',
  },
  {
    id: 'pd-num-hold-slack', topic: 'pd', level: 'Numerical',
    q: '[Intel] Same path as Q51. Minimum Clk-to-Q = 0.2 ns, minimum combo delay = 0.1 ns, T_hold = 0.15 ns. Calculate the Hold Slack.',
    a: 'Given: T_launch_lat = 0.8 ns, T_clk→q_min = 0.2 ns, T_combo_min = 0.1 ns, T_capt_lat = 0.6 ns, T_hold = 0.15 ns.\n§F: T_arrival_min = T_launch_lat + T_clk→q_min + T_combo_min\n§C: = 0.8 + 0.2 + 0.1 = 1.1 ns\n§F: T_hold_req = T_capt_lat + T_hold\n§C: = 0.6 + 0.15 = 0.75 ns\n§F: Hold Slack = T_arrival_min − T_hold_req\n§C: = 1.1 − 0.75 = +0.35 ns\n§R: Hold Slack = +0.35 ns ✓ (Hold Met)',
  },
  {
    id: 'pd-num-fmax', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] A critical path has T_clk→q = 0.5 ns, combinational delay = 4.2 ns, T_setup = 0.3 ns, clock skew = 0.1 ns. Find F_max.',
    a: 'Given: T_clk→q = 0.5 ns, T_combo = 4.2 ns, T_setup = 0.3 ns, skew = 0.1 ns (capture later than launch — beneficial).\n§F: T_clk_min = T_clk→q + T_combo + T_setup − skew\n§C: = 0.5 + 4.2 + 0.3 − 0.1 = 4.9 ns\n§F: F_max = 1 / T_clk_min\n§C: = 1 / 4.9 ns = 204.1 MHz\n§R: F_max ≈ 204 MHz',
  },
  {
    id: 'pd-num-setup-hold-check', topic: 'pd', level: 'Numerical',
    q: '[Apple] T_clk = 4 ns. Launch latency = 1.2 ns, capture latency = 1.5 ns. T_clk→q = 0.35 ns, combo = 2.8 ns, T_setup = 0.25 ns, T_hold = 0.1 ns, T_combo_min = 0.05 ns. Check both setup and hold.',
    a: 'Setup Check:\n§F: T_arrival = 1.2 + 0.35 + 2.8 = 4.35 ns\n§F: T_required = 4.0 + 1.5 − 0.25 = 5.25 ns\n§F: Setup Slack = 5.25 − 4.35 = +0.90 ns\n§R: Setup MET ✓\nHold Check:\n§F: T_arrival_min = 1.2 + 0.35 + 0.05 = 1.60 ns\n§F: T_hold_req = 1.5 + 0.1 = 1.60 ns\n§F: Hold Slack = 1.60 − 1.60 = 0.00 ns\n§R: Hold Borderline — marginal, may require buffer insertion',
  },
  {
    id: 'pd-num-hold-fix-delay', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] A hold violation exists: T_arrival_min = 0.9 ns, T_hold_req = 1.1 ns. What minimum buffer delay is needed to fix hold?',
    a: 'Given: T_arrival_min = 0.9 ns, T_hold_req = 1.1 ns.\n§F: Hold Slack = T_arrival_min − T_hold_req\n§C: = 0.9 − 1.1 = −0.2 ns (violation)\n§F: Required buffer delay = |Hold Slack| + margin\n§C: = 0.2 + 0.05 (margin) = 0.25 ns\n§R: Insert a buffer with delay ≥ 0.25 ns on the launch data path to fix hold violation',
  },
  {
    id: 'pd-num-skew-id', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] Clock arrives at FF_A at 1.85 ns and at FF_B at 1.20 ns. What is the clock skew? How does it affect setup timing for the path FF_A → FF_B?',
    a: 'Given: T_clk_A = 1.85 ns (launch), T_clk_B = 1.20 ns (capture).\n§F: Skew = T_clk_capture − T_clk_launch = T_clk_B − T_clk_A\n§C: = 1.20 − 1.85 = −0.65 ns\nNegative skew means capture clock arrives BEFORE launch — hurts setup (less time for data).\n§F: Setup check: T_required = T_clk + T_capt_lat − T_setup = T_clk + 1.20 − T_setup\n§F: Effective setup window reduced by |skew| = 0.65 ns\n§R: Skew = −0.65 ns — detrimental to setup; 0.65 ns of setup margin is lost',
  },
  {
    id: 'pd-num-ocv-skew', topic: 'pd', level: 'Numerical',
    q: '[Intel] CTS targets 50 ps skew. OCV derating adds ±3% to clock path delays. Launch latency = 1.5 ns, capture latency = 1.5 ns. What is the total effective skew with OCV?',
    a: 'Given: T_lat = 1.5 ns, OCV = ±3%, target skew = 50 ps.\n§F: OCV variation on launch = 1.5 ns × 3% = 0.045 ns = 45 ps\n§F: OCV variation on capture = 1.5 ns × 3% = 45 ps\n§F: Worst-case effective skew = Base skew + OCV_launch + OCV_capture\n§C: = 50 + 45 + 45 = 140 ps = 0.14 ns\n§R: Total effective clock uncertainty for STA = 140 ps',
  },
  {
    id: 'pd-num-aocv-skew', topic: 'pd', level: 'Numerical',
    q: '[AMD] A 5-stage clock path has AOCV derating 2% per stage. Each stage delay = 0.3 ns. Calculate worst-case late arrival with AOCV vs flat OCV at 10%.',
    a: 'Given: 5 stages, each 0.3 ns, AOCV = 2%/stage, flat OCV = 10%.\nFlat OCV (pessimistic):\n§F: Total delay_OCV = 5 × 0.3 × (1 + 10%) = 1.5 × 1.10 = 1.65 ns\nAOCV (stage-accumulating):\n§F: AOCV derating per stage = 2% × √stage_depth (approximation)\n§C: Effective total AOCV ≈ 1.5 × (1 + 2%×√5) = 1.5 × (1 + 4.47%) = 1.567 ns\n§R: AOCV = 1.567 ns vs OCV = 1.650 ns — AOCV saves 83 ps of pessimism per path',
  },
  {
    id: 'pd-num-max-combo-delay', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] T_clk = 2.5 ns, T_setup = 0.1 ns, T_clk→q = 0.3 ns. Launch latency = 0.9 ns, capture latency = 0.7 ns. What is the maximum allowable combinational delay?',
    a: 'Given: T_clk = 2.5 ns, T_setup = 0.1 ns, T_clk→q = 0.3 ns, T_launch = 0.9 ns, T_capt = 0.7 ns.\n§F: T_required = T_clk + T_capt − T_setup = 2.5 + 0.7 − 0.1 = 3.1 ns\n§F: T_arrival = T_launch + T_clk→q + T_combo_max = 3.1 ns\n§F: T_combo_max = T_required − T_launch − T_clk→q\n§C: = 3.1 − 0.9 − 0.3 = 1.9 ns\n§R: Maximum allowable combinational delay = 1.9 ns',
  },
  {
    id: 'pd-num-duty-jitter', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] A 500 MHz clock has period jitter of ±50 ps and duty-cycle distortion of 5%. What is the effective valid setup window for capture?',
    a: 'Given: F = 500 MHz → T_clk = 2 ns, jitter = ±50 ps, DCD = 5%.\n§F: DCD impact on high-time = T_clk × 5% = 2 ns × 0.05 = 0.1 ns\n§F: Effective half-period = (T_clk / 2) − DCD_impact = 1.0 − 0.1 = 0.9 ns\n§F: Total clock uncertainty = jitter + DCD = 50 ps + 100 ps = 150 ps\n§F: Effective setup window = T_clk − clock_uncertainty\n§C: = 2.0 − 0.15 = 1.85 ns\n§R: Effective setup window = 1.85 ns (150 ps consumed by jitter + DCD)',
  },
  {
    id: 'pd-num-half-cycle-max', topic: 'pd', level: 'Numerical',
    q: '[Intel] A half-cycle path launches on rising edge, captures on falling edge. T_clk = 4 ns. T_clk→q = 0.3 ns, T_setup = 0.2 ns. What is the maximum combo delay?',
    a: 'Given: T_clk = 4 ns, half cycle = 2 ns, T_clk→q = 0.3 ns, T_setup = 0.2 ns.\n§F: Available time = T_clk/2 = 4/2 = 2.0 ns\n§F: T_combo_max = T_clk/2 − T_clk→q − T_setup\n§C: = 2.0 − 0.3 − 0.2 = 1.5 ns\n§R: Maximum combinational delay for half-cycle path = 1.5 ns',
  },
  {
    id: 'pd-num-half-cycle-hold', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] Same half-cycle path. T_clk→q_min = 0.15 ns, T_combo_min = 0.05 ns, T_hold = 0.1 ns. Check hold.',
    a: 'Half-cycle hold check: capture is one half-cycle (2 ns) later than launch.\nGiven: T_clk→q_min = 0.15 ns, T_combo_min = 0.05 ns, T_hold = 0.1 ns.\n§F: T_arrival_min = T_launch_lat + T_clk→q_min + T_combo_min\n§F: T_hold_req = T_capt_lat + T_hold (capture is T_clk/2 = 2 ns later in clock domain)\nAssuming equal latencies and capture half-cycle offset:\n§F: Hold Slack = T_arrival_min − (T_capt_lat + T_hold)\n§C: With T_capt_lat = T_launch_lat, hold slack = T_clk→q_min + T_combo_min − T_hold\n§C: = 0.15 + 0.05 − 0.10 = +0.10 ns\n§R: Hold Slack = +0.10 ns ✓',
  },
  {
    id: 'pd-num-mc-arrival', topic: 'pd', level: 'Numerical',
    q: '[Apple] A 3-cycle multicycle path: T_clk = 3 ns, T_clk→q = 0.4 ns, T_combo = 7.2 ns, T_setup = 0.3 ns, equal launch/capture latency = 1.0 ns. Calculate setup slack.',
    a: 'Given: MCP = 3 cycles, T_clk = 3 ns, T_clk→q = 0.4 ns, T_combo = 7.2 ns, T_setup = 0.3 ns, T_lat = 1.0 ns.\n§F: T_arrival = T_launch_lat + T_clk→q + T_combo\n§C: = 1.0 + 0.4 + 7.2 = 8.6 ns\n§F: T_required = (MCP × T_clk) + T_capt_lat − T_setup\n§C: = (3 × 3.0) + 1.0 − 0.3 = 9.0 + 1.0 − 0.3 = 9.7 ns\n§F: Setup Slack = T_required − T_arrival\n§C: = 9.7 − 8.6 = +1.1 ns\n§R: Setup Slack = +1.1 ns ✓',
  },
  {
    id: 'pd-num-mc-hold-edge', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] For the same 3-cycle MCP above, the hold check uses what capture edge? With T_combo_min = 0.5 ns and T_hold = 0.1 ns, calculate hold slack.',
    a: 'For a multicycle setup path of N cycles, the hold check moves the capture edge back by (N−1) cycles, so the hold check uses the capture edge at cycle 1 (default), but with `set_multicycle_path -hold (N-1)` the hold check edge moves to the same cycle as launch.\nGiven: T_clk→q_min = 0.4 ns (min), T_combo_min = 0.5 ns, T_hold = 0.1 ns, T_lat = 1.0 ns.\n§F: T_arrival_min = 1.0 + 0.4 + 0.5 = 1.9 ns\n§F: Hold check edge at cycle 0 (same rising edge): T_hold_req = 1.0 + 0.1 = 1.1 ns\n§F: Hold Slack = 1.9 − 1.1 = +0.8 ns\n§R: Hold Slack = +0.8 ns ✓ (with correct `set_multicycle_path -hold 2`)',
  },
  {
    id: 'pd-num-mc-hold-sdc', topic: 'pd', level: 'Numerical',
    q: '[Intel] Write the complete SDC for a 3-cycle multicycle setup path from reg_a/Q to reg_b/D on CLK, and verify the hold edge is correctly repositioned.',
    a: 'SDC Commands:\n§F: set_multicycle_path 3 -setup -from [get_cells reg_a] -to [get_cells reg_b] -end\n§F: set_multicycle_path 2 -hold  -from [get_cells reg_a] -to [get_cells reg_b] -end\nExplanation: `-setup 3` moves the setup check to the 3rd capture edge (3T from launch). `-hold 2` moves the hold check to the 2nd capture edge, which aligns hold checking with the correct launch-capture relationship — without this, the tool checks hold at the nearest edge (T=0), causing false hold violations on all combinational delays > T_hold.\n§R: Both SDC lines required; omitting the hold line causes false hold violations',
  },
  {
    id: 'pd-num-core-area', topic: 'pd', level: 'Numerical',
    q: '[Apple] Total standard cell area = 2.5 mm². Macro area = 1.2 mm². Target core utilisation = 75%. Calculate required core area.',
    a: 'Given: Cell area = 2.5 mm², Macro area = 1.2 mm², Utilisation = 75%.\n§F: Total placed area = Cell area + Macro area = 2.5 + 1.2 = 3.7 mm²\n§F: Core area = Total placed area / Utilisation\n§C: = 3.7 / 0.75 = 4.933 mm²\n§R: Required core area ≈ 4.93 mm² (round up to nearest standard floorplan grid)',
  },
  {
    id: 'pd-num-core-dimensions', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] Using the core area from Q66, if aspect ratio = 1.2 (H/W), find the core width and height.',
    a: 'Given: Core area = 4.933 mm², Aspect Ratio = H/W = 1.2.\n§F: Area = W × H = W × 1.2W = 1.2W²\n§F: W² = Area / 1.2 = 4.933 / 1.2 = 4.111 mm²\n§F: W = √4.111 ≈ 2.028 mm\n§F: H = 1.2 × W = 1.2 × 2.028 ≈ 2.433 mm\n§R: Core Width ≈ 2.03 mm, Core Height ≈ 2.43 mm',
  },
  {
    id: 'pd-num-die-core-util', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] Die area = 8 mm². I/O ring area = 2 mm². Placed cell area = 4.2 mm². Calculate (a) core area and (b) core utilisation.',
    a: 'Given: Die area = 8 mm², I/O ring = 2 mm², Placed cell area = 4.2 mm².\n§F: (a) Core area = Die area − I/O ring area = 8 − 2 = 6 mm²\n§F: (b) Core utilisation = Placed cell area / Core area\n§C: = 4.2 / 6.0 = 0.70 = 70%\n§R: Core area = 6 mm², Core utilisation = 70%',
  },
  {
    id: 'pd-num-cell-rows', topic: 'pd', level: 'Numerical',
    q: '[Intel] Core height = 2.4 mm. Standard cell height = 0.8 μm. Calculate the number of standard cell rows.',
    a: 'Given: Core height = 2.4 mm = 2400 μm, Cell height = 0.8 μm.\n§F: Number of rows = Core height / Cell height\n§C: = 2400 / 0.8 = 3000 rows\n§R: 3000 standard cell rows',
  },
  {
    id: 'pd-num-keepout-area', topic: 'pd', level: 'Numerical',
    q: '[Samsung] A macro is 500 μm × 400 μm. A 10 μm halo (keepout margin) is applied on all sides. What total area is unavailable for standard cell placement?',
    a: 'Given: Macro W = 500 μm, Macro H = 400 μm, Halo = 10 μm.\n§F: Area with halo = (500 + 2×10) × (400 + 2×10)\n§C: = 520 × 420 = 218,400 μm²\n§F: Macro area alone = 500 × 400 = 200,000 μm²\n§F: Keepout zone area = 218,400 − 200,000 = 18,400 μm²\n§F: Total unavailable area = Macro + Keepout = 218,400 μm² = 0.2184 mm²\n§R: Total area unavailable for placement = 0.218 mm²',
  },
  {
    id: 'pd-num-total-power', topic: 'pd', level: 'Numerical',
    q: '[Broadcom] A chip operates at V_DD = 0.8 V, F = 2 GHz. Total dynamic capacitance switching per cycle = 5 nF. Static leakage current I_leak = 250 mA. Calculate total power (Dynamic + Static).',
    a: 'Given: V = 0.8 V, F = 2 GHz = 2×10⁹ Hz, C = 5 nF = 5×10⁻⁹ F, I_leak = 250 mA.\n§F: P_dynamic = C × V² × F\n§C: = 5×10⁻⁹ × (0.8)² × 2×10⁹ = 5 × 0.64 × 2 = 6.4 W\n§F: P_static = V × I_leak\n§C: = 0.8 × 0.250 = 0.2 W\n§F: P_total = P_dynamic + P_static = 6.4 + 0.2 = 6.6 W\n§R: Total Power = 6.6 W',
  },
  {
    id: 'pd-num-dvdd-reduction', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] V_DD is reduced by 10% (from 0.8 V to 0.72 V). Calculate the percentage reduction in dynamic power.',
    a: 'Given: V1 = 0.8 V, V2 = 0.72 V, P_dynamic ∝ V².\n§F: P_dynamic1 ∝ V1² = (0.8)² = 0.64\n§F: P_dynamic2 ∝ V2² = (0.72)² = 0.5184\n§F: Reduction = (P1 − P2) / P1 × 100%\n§C: = (0.64 − 0.5184) / 0.64 × 100% = 0.1216 / 0.64 × 100% = 19%\n§R: Dynamic power reduces by 19%',
  },
  {
    id: 'pd-num-stripe-ir', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] A VDD power stripe of length 1 mm, width 2 μm has metal sheet resistance R_s = 0.05 Ω/sq. A uniform 20 mA current flows. Calculate the Static IR drop.',
    a: 'Given: L = 1 mm = 1000 μm, W = 2 μm, R_s = 0.05 Ω/sq, I = 20 mA.\n§F: Number of squares = L / W = 1000 / 2 = 500 squares\n§F: R_stripe = R_s × squares = 0.05 × 500 = 25 Ω\n§F: IR Drop = I × R = 0.020 × 25 = 0.5 V\nNote: 0.5 V is extreme — real design uses many parallel stripes. This illustrates that wider/shorter stripes are critical.\n§R: IR Drop = 0.5 V (need more parallel stripes or wider width)',
  },
  {
    id: 'pd-num-decap-sizing', topic: 'pd', level: 'Numerical',
    q: '[Apple] A dynamic current spike ΔI = 100 mA occurs for Δt = 200 ps. Maximum allowable voltage drop ΔV = 40 mV. What minimum Decap capacitance is required?',
    a: 'Given: ΔI = 100 mA = 0.1 A, Δt = 200 ps = 200×10⁻¹² s, ΔV = 40 mV = 0.04 V.\n§F: Decap model: ΔV = ΔI × Δt / C_decap\n§F: C_decap = ΔI × Δt / ΔV\n§C: = 0.1 × 200×10⁻¹² / 0.04 = 20×10⁻¹² / 0.04 = 500 pF\n§R: Minimum Decap capacitance required = 500 pF',
  },
  {
    id: 'pd-num-transient-ir', topic: 'pd', level: 'Numerical',
    q: '[Intel] A power grid has equivalent resistance R_eq = 0.15 Ω from power pad to logic cluster. The cluster draws a transient current of 2 A. Find instantaneous IR drop.',
    a: 'Given: R_eq = 0.15 Ω, I_transient = 2 A.\n§F: ΔV_IR = I × R_eq\n§C: = 2 × 0.15 = 0.30 V\n§R: Instantaneous IR drop = 300 mV\nNote: 300 mV is excessive for a 0.8 V supply (37.5% drop). Requires reducing R_eq via more/wider stripes or inserting local Decap.',
  },
  // ── Physical Design — Numericals (Q76–Q100) ────────────────────────────
  {
    id: 'pd-num-rc-lumped', topic: 'pd', level: 'Numerical',
    q: '[Synopsys] A wire of length L = 500 μm has resistance per unit length r = 0.2 Ω/μm and capacitance per unit length c = 0.15 fF/μm. Calculate the total RC wire delay using the lumped π-model (τ = R_total × C_total / 2).',
    a: 'Given: L = 500 μm, r = 0.2 Ω/μm, c = 0.15 fF/μm.\n§F: R_total = r × L = 0.2 × 500 = 100 Ω\n§F: C_total = c × L = 0.15 fF × 500 = 75 fF = 75×10⁻¹⁵ F\n§F: τ = R_total × C_total / 2 (lumped π-model)\n§C: = 100 × 75×10⁻¹⁵ / 2 = 7500×10⁻¹⁵ / 2 = 3.75 ps\n§R: RC wire delay (50% point) ≈ 3.75 ps',
  },
  {
    id: 'pd-num-elmore-delay', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] An Elmore delay tree: driver resistance Rd = 100 Ω, main trunk splits into Branch 1 (R1 = 50 Ω, C1 = 20 fF) and Branch 2 (R2 = 80 Ω, C2 = 30 fF). Wire capacitance before split C0 = 10 fF. Calculate Elmore delay to the endpoint of Branch 2.',
    a: 'Given: Rd = 100 Ω, C0 = 10 fF, R1 = 50 Ω, C1 = 20 fF, R2 = 80 Ω, C2 = 30 fF.\nElmore delay to endpoint of Branch 2 = sum of (resistance on path) × (all downstream capacitance).\n§F: τ_B2 = Rd × (C0 + C1 + C2) + R2 × C2\n§C: = 100 × (10 + 20 + 30)×10⁻¹⁵ + 80 × 30×10⁻¹⁵\n§C: = 100 × 60×10⁻¹⁵ + 2400×10⁻¹⁵\n§C: = 6000×10⁻¹⁵ + 2400×10⁻¹⁵ = 8400×10⁻¹⁵ s\n§R: Elmore delay to Branch 2 endpoint = 8.4 ps',
  },
  {
    id: 'pd-num-repeater-scaling', topic: 'pd', level: 'Numerical',
    q: '[Apple] A wire of length is doubled (2×). By what factor does RC propagation delay increase? If a repeater (buffer) is inserted at the exact midpoint, by what factor does total wire delay change relative to the unbuffered double-length wire?',
    a: 'RC delay ∝ L² (quadratic with wire length).\n§F: Original wire delay ∝ L²\n§F: Doubled wire delay ∝ (2L)² = 4L²\nDelay increase factor without repeater:\n§R: Delay increases by 4× when wire length doubles\nWith repeater at midpoint (two segments of length L):\n§F: Each segment delay ∝ L²\n§F: Total = 2 × L² (two half-length wires)\n§F: Delay reduction vs 4L²: factor = 2L² / 4L² = 0.5\n§R: Repeater at midpoint reduces total delay to 50% of unbuffered double-length wire (2× improvement)',
  },
  {
    id: 'pd-num-metal-resistance', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] Metal 2 layer has R_s = 0.08 Ω/sq, width = 0.1 μm. Metal 7 has R_s = 0.01 Ω/sq, width = 0.5 μm. Calculate the resistance of a 1000 μm long trace on Metal 2 versus Metal 7.',
    a: 'Given: M2: R_s = 0.08 Ω/sq, W = 0.1 μm; M7: R_s = 0.01 Ω/sq, W = 0.5 μm. L = 1000 μm.\n§F: R = R_s × (L / W)\nMetal 2:\n§C: R_M2 = 0.08 × (1000 / 0.1) = 0.08 × 10000 = 800 Ω\nMetal 7:\n§C: R_M7 = 0.01 × (1000 / 0.5) = 0.01 × 2000 = 20 Ω\n§R: M2 resistance = 800 Ω; M7 resistance = 20 Ω. M7 is 40× lower resistance — use upper metals for global long wires.',
  },
  {
    id: 'pd-num-driver-propagation', topic: 'pd', level: 'Numerical',
    q: '[Intel] A net has C_wire = 40 fF and connects to 4 loads of 5 fF each. Driver output resistance R_out = 200 Ω. Estimate 50% driver propagation delay using 0.69 × R × C_total.',
    a: 'Given: C_wire = 40 fF, N_loads = 4, C_load = 5 fF each, R_out = 200 Ω.\n§F: C_total = C_wire + N_loads × C_load\n§C: = 40 + 4×5 = 40 + 20 = 60 fF\n§F: τ_50% = 0.69 × R_out × C_total\n§C: = 0.69 × 200 × 60×10⁻¹⁵\n§C: = 0.69 × 12000×10⁻¹⁵ = 8280×10⁻¹⁵ s\n§R: Driver propagation delay (50%) ≈ 8.28 ps',
  },
  {
    id: 'pd-num-xtalk-peak-voltage', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] A victim net has ground capacitance Cg = 30 fF and coupling capacitance to aggressor Cc = 10 fF. The aggressor switches with ΔV_agg = 0.9 V. Calculate peak crosstalk noise voltage on the victim (ΔV_vict = ΔV_agg × Cc/(Cg+Cc)).',
    a: 'Given: Cg = 30 fF, Cc = 10 fF, ΔV_agg = 0.9 V.\n§F: ΔV_vict = ΔV_agg × Cc / (Cg + Cc)\n§C: = 0.9 × 10 / (30 + 10)\n§C: = 0.9 × 10 / 40\n§C: = 0.9 × 0.25 = 0.225 V\n§R: Peak crosstalk noise = 225 mV',
  },
  {
    id: 'pd-num-xtalk-mcf2-cap', topic: 'pd', level: 'Numerical',
    q: '[Broadcom] Same victim net (Cg = 30 fF, Cc = 10 fF). The aggressor switches in the OPPOSITE direction (MCF = 2). Calculate the effective capacitance of the victim net.',
    a: 'Given: Cg = 30 fF, Cc = 10 fF, MCF = 2 (opposite-direction switching — maximum pessimism).\n§F: C_eff = Cg + MCF × Cc\n§C: = 30 + 2 × 10 = 30 + 20 = 50 fF\n§R: Effective victim capacitance = 50 fF (vs 30 fF with no aggressor — 67% increase, causes worst-case delay)',
  },
  {
    id: 'pd-num-xtalk-mcf0-cap', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] Same victim (Cg = 30 fF, Cc = 10 fF). The aggressor switches in the SAME direction (MCF = 0). Calculate effective victim capacitance.',
    a: 'Given: Cg = 30 fF, Cc = 10 fF, MCF = 0 (same-direction — coupling capacitance is neutralised).\n§F: C_eff = Cg + MCF × Cc\n§C: = 30 + 0 × 10 = 30 + 0 = 30 fF\n§R: Effective victim capacitance = 30 fF (coupling has zero net effect; victim sees only ground capacitance — faster transition)',
  },
  {
    id: 'pd-num-xtalk-driver-upsize', topic: 'pd', level: 'Numerical',
    q: '[Apple] A buffer with drive strength Rd = 150 Ω drives a victim net with crosstalk noise peak V_peak = 250 mV. If driver resistance is upsized to Rd_new = 50 Ω, estimate the new noise peak voltage assuming linear scaling with driver impedance.',
    a: 'Given: Rd_old = 150 Ω, V_peak_old = 250 mV, Rd_new = 50 Ω.\nCrosstalk noise peak scales with driver output impedance (higher Rd → slower transition → more charge coupling time).\n§F: V_peak_new = V_peak_old × (Rd_new / Rd_old)\n§C: = 250 × (50 / 150)\n§C: = 250 × 0.333 = 83.3 mV\n§R: New noise peak ≈ 83 mV (3× reduction by upsizing driver)',
  },
  {
    id: 'pd-num-antenna-ratio', topic: 'pd', level: 'Numerical',
    q: '[TSMC] Metal 3 line of length 200 μm, width 0.1 μm is connected directly to a gate oxide terminal of area A_gate = 0.02 μm². Calculate the Antenna Ratio (Metal Area / Gate Area).',
    a: 'Given: Metal length = 200 μm, Metal width = 0.1 μm, A_gate = 0.02 μm².\n§F: A_metal = Length × Width = 200 × 0.1 = 20 μm²\n§F: Antenna Ratio = A_metal / A_gate\n§C: = 20 / 0.02 = 1000\n§R: Antenna Ratio = 1000:1\nNote: Most foundry rules limit antenna ratio to 400–500:1. A ratio of 1000 is a severe DRC violation requiring layer-hopping or diode insertion.',
  },
  {
    id: 'pd-num-antenna-drc-cut', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] If the maximum allowed Antenna Ratio for Metal 3 is 500, determine if the net in Q85 violates DRC. What minimum wire length must M3 be cut to to eliminate the violation using layer hopping to M4?',
    a: 'Q85 Antenna Ratio = 1000. Maximum allowed = 500. Violation exists (1000 > 500).\n§F: Max allowed M3 area = 500 × A_gate = 500 × 0.02 = 10 μm²\n§F: Max M3 wire length = A_max_M3 / width = 10 / 0.1 = 100 μm\nSolution: Cut the M3 wire at 100 μm, route the remaining 100 μm on M4 (which has a separate, already-completed connection to source/drain — its antenna ratio resets).\n§R: Cut M3 at 100 μm and continue on M4 — antenna ratio drops to 500:1 ✓',
  },
  {
    id: 'pd-num-via-array-res', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] A via array consists of 2×2 grid (4 vias). Each via resistance = 8 Ω. Calculate the effective resistance of the via array.',
    a: 'Given: 4 vias in parallel array, each R_via = 8 Ω.\n§F: R_eff = R_via / N_vias (parallel combination of N equal resistances)\n§C: = 8 / 4 = 2 Ω\n§R: Effective via array resistance = 2 Ω\nNote: Via arrays are mandatory for high-current nets (power, clock trunks) to reduce resistance and meet EM current density limits.',
  },
  {
    id: 'pd-num-routing-tracks', topic: 'pd', level: 'Numerical',
    q: '[Apple] Standard cell height = 1.2 μm, width = 2.4 μm. Pitch of horizontal M2 routing tracks = 0.2 μm. Calculate the maximum number of routing tracks that cross vertically over this standard cell.',
    a: 'Given: Cell height = 1.2 μm, M2 pitch = 0.2 μm.\n§F: N_tracks = Cell height / M2 pitch\n§C: = 1.2 / 0.2 = 6 tracks\n§R: Maximum 6 horizontal M2 routing tracks can cross over this standard cell',
  },
  {
    id: 'pd-num-icg-max-path', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] An ICG cell has Clock-to-Enable Setup time T_setup_enable = 0.15 ns and Hold time T_hold_enable = 0.05 ns. Clock period T_clk = 2 ns (50% duty cycle). If the enable signal is generated by a flop clocked on the rising edge, calculate the maximum allowable path delay from the generating flop to the ICG enable pin.',
    a: 'Given: T_setup_enable = 0.15 ns, T_clk = 2 ns (50% duty → high time = 1 ns). Enable must be stable before the LOW→HIGH edge that closes the ICG latch.\n§F: ICG latch closes on rising clock edge. Enable must arrive by: T_clk_high − T_setup_enable before the edge.\n§F: Max enable path delay = T_high_phase − T_setup_enable = 1.0 − 0.15 = 0.85 ns\nFrom the generating flip-flop (clocked at rising edge, 0 ns): the full path (clk→q + combo + routing) to ICG enable must complete within 0.85 ns.\n§R: Maximum allowable path delay from flop to ICG enable pin = 0.85 ns',
  },
  {
    id: 'pd-num-icg-enable-check', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] In an active-high enable ICG (integrated with latch), state whether enable setup check occurs at the clock rising or falling edge, and calculate the required arrival time for T_clk = 1 ns.',
    a: 'For an active-high ICG cell: The internal latch is transparent when clock is HIGH. It closes (latches) on the falling edge of the clock.\nEnable setup check occurs at the FALLING clock edge — the enable must be stable before the latch closes.\n§F: T_clk_period = 1 ns → falling edge at T = 0.5 ns (50% duty)\n§F: Required enable arrival time = T_falling_edge − T_setup_enable\n§C: = 0.5 − 0.15 = 0.35 ns from rising edge\n§R: Enable must arrive by T = 0.35 ns after the rising clock edge (setup check at falling edge)',
  },
  {
    id: 'pd-num-latency-skew-buffer', topic: 'pd', level: 'Numerical',
    q: '[Intel] Latency from Clock Source to Flop A is 1.85 ns. Latency to Flop B is 1.20 ns. What is the skew between A and B? How many buffer stages of 65 ps each must be added to Flop B\'s path to balance the latency to within 30 ps skew?',
    a: 'Given: T_lat_A = 1.85 ns, T_lat_B = 1.20 ns.\n§F: Skew = T_lat_A − T_lat_B = 1.85 − 1.20 = 0.65 ns = 650 ps\nTarget: ≤ 30 ps skew after adding buffers to B\'s path.\n§F: Required additional delay on B = 650 − 30 = 620 ps\n§F: Buffer stages needed = Required delay / Stage delay\n§C: = 620 / 65 = 9.54 → round up to 10 stages\n§R: Add 10 buffer stages of 65 ps to Flop B\'s clock path (adds 650 ps, results in 0 ps skew — within 30 ps target)',
  },
  {
    id: 'pd-num-clock-branch-power', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] A clock tree branch splits into 16 sinks. Each sink load = 8 fF. Wire capacitance of the tree structure = 120 fF. Calculate total dynamic clock power of this branch at V_DD = 0.9 V, F = 1.5 GHz.',
    a: 'Given: N_sinks = 16, C_sink = 8 fF, C_wire = 120 fF, V = 0.9 V, F = 1.5 GHz.\n§F: C_sink_total = N_sinks × C_sink = 16 × 8 = 128 fF\n§F: C_total = C_wire + C_sink_total = 120 + 128 = 248 fF\n§F: P_clk = C_total × V² × F\n§C: = 248×10⁻¹⁵ × (0.9)² × 1.5×10⁹\n§C: = 248×10⁻¹⁵ × 0.81 × 1.5×10⁹\n§C: = 248 × 0.81 × 1.5 × 10⁻⁶ = 301.6 μW\n§R: Clock branch dynamic power ≈ 301.6 μW',
  },
  {
    id: 'pd-num-hyperperiod', topic: 'pd', level: 'Numerical',
    q: '[Apple] Clock A has period T_A = 3 ns. Clock B has period T_B = 4 ns. Clocks are generated from the same source at t = 0. Calculate the common base period (hyperperiod) for setup timing analysis between Clock A and Clock B domains.',
    a: 'Given: T_A = 3 ns, T_B = 4 ns.\n§F: Hyperperiod = LCM(T_A, T_B) = LCM(3, 4)\nLCM(3,4) = 12 (since GCD(3,4) = 1):\n§C: LCM = 3 × 4 / GCD(3,4) = 12 / 1 = 12 ns\nIn 12 ns: Clock A completes 4 cycles, Clock B completes 3 cycles — they realign at t = 12 ns.\n§R: Hyperperiod = 12 ns; setup analysis must find the minimum clock-edge separation in this window',
  },
  {
    id: 'pd-num-voltage-slack', topic: 'pd', level: 'Numerical',
    q: '[AMD] A design operates at 1 GHz (V_DD = 0.9 V) with a setup slack of +50 ps. If voltage is scaled down to 0.8 V, cell gate delay increases by 18%. Calculate the new setup slack at 1 GHz assuming the original data path delay was 850 ps.',
    a: 'Given: F = 1 GHz → T_clk = 1000 ps, T_setup ≈ 50 ps slack, T_data_old = 850 ps, delay increase = 18%.\n§F: T_data_new = T_data_old × (1 + 18%) = 850 × 1.18 = 1003 ps\n§F: T_required ≈ T_clk − T_clk→q − T_setup_lib (assume these are folded into T_data_old basis)\nUsing slack equation: new slack = old_slack − (T_data_new − T_data_old)\n§F: New Setup Slack = +50 − (1003 − 850) = 50 − 153 = −103 ps\n§R: New Setup Slack = −103 ps ⚠ (Violation — design fails at 1 GHz at 0.8 V)',
  },
  {
    id: 'pd-num-fmax-wns', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] A path has a Worst Negative Slack (WNS) of −120 ps at 500 MHz. What is the maximum operating frequency (F_max) at which this path will have exactly 0 ps slack?',
    a: 'Given: F_operating = 500 MHz → T_clk = 2000 ps, WNS = −120 ps.\n§F: At F_operating, slack = T_clk − T_data_path. WNS = −120 ps means T_data_path exceeds T_clk by 120 ps.\n§F: T_data_path = T_clk − WNS_margin = 2000 − (−120) = 2120 ps (the path takes 2120 ps)\n§F: F_max = 1 / T_data_path = 1 / 2120 ps\n§C: = 1 / 2.12×10⁻⁹ = 471.7 MHz\n§R: F_max ≈ 471.7 MHz (this path limits the design to ~472 MHz)',
  },
  {
    id: 'pd-num-buffer-swaps-setup', topic: 'pd', level: 'Numerical',
    q: '[Broadcom] A data path has a setup slack of −180 ps. Swapping a standard VT buffer (Delay = 100 ps) with an LVT buffer reduces delay by 35%. How many such buffer swaps along the path are required to make setup slack positive?',
    a: 'Given: Setup slack = −180 ps, VT delay = 100 ps, reduction = 35%.\n§F: Delay saved per swap = 100 × 35% = 35 ps per buffer\n§F: Swaps needed = |slack| / delay_saved_per_swap\n§C: = 180 / 35 = 5.14 → round up to 6 swaps\n§R: 6 LVT buffer swaps required to recover 210 ps (positive slack = +30 ps after 6 swaps)',
  },
  {
    id: 'pd-num-hold-buffer-selection', topic: 'pd', level: 'Numerical',
    q: '[Nvidia] A hold violation of −90 ps exists on a net. Available delay buffers: Buf_A = 20 ps, Buf_B = 35 ps, Buf_C = 50 ps. Choose the optimal combination to fix hold without creating a setup violation on a path with +40 ps slack margin.',
    a: 'Given: Hold violation = −90 ps (need ≥ 90 ps added delay). Available: 20/35/50 ps buffers. Max insertable delay without setup violation = +40 ps — wait, hold and setup are independent paths; setup slack of +40 ps limits total buffer delay to 40 ps on the launch path.\nBest combination within 40 ps constraint:\n§F: Buf_B (35 ps) → hold fixed by 35 ps, slack = −90 + 35 = −55 ps (still violating)\n§F: Buf_A + Buf_B = 20 + 35 = 55 ps → exceeds setup margin of 40 ps\nCorrect approach: Insert buffers on the CLOCK path (not data path) to delay capture edge, which fixes hold without affecting setup data path.\n§F: Buf_B + Buf_A on clock path = 55 ps > 90 ps? No.\n§F: Buf_C + Buf_B = 50 + 35 = 85 ps; Buf_C + Buf_B + Buf_A = 105 ps ≥ 90 ps\n§R: Optimal: Buf_C (50 ps) + Buf_B (35 ps) = 85 ps on clock path — hold becomes −5 ps (needs slight further fix); or Buf_C + Buf_B + Buf_A = 105 ps on clock path → hold becomes +15 ps ✓',
  },
  {
    id: 'pd-num-dual-slack-buffer', topic: 'pd', level: 'Numerical',
    q: '[Intel] A path has Setup Slack = +10 ps and Hold Slack = −30 ps. You insert a delay buffer with Delay = 25 ps to fix hold. Does this fix create a setup violation?',
    a: 'Given: Setup Slack = +10 ps, Hold Slack = −30 ps, buffer delay = 25 ps.\nInserting a delay buffer on the DATA path increases minimum arrival time (fixes hold) but also increases maximum arrival time (worsens setup).\n§F: New Hold Slack = Old Hold Slack + buffer delay = −30 + 25 = −5 ps (still violated)\n§F: New Setup Slack = Old Setup Slack − buffer delay = +10 − 25 = −15 ps\n§R: Setup violation created (−15 ps). Hold still violated (−5 ps). Buffer delay of 25 ps is insufficient and damages setup. Need ≥30 ps buffer inserted on CLOCK path instead (capture clock delayed, fixes hold without touching setup data path).',
  },
  {
    id: 'pd-num-input-port-slack', topic: 'pd', level: 'Numerical',
    q: '[Qualcomm] Input port IN1 has `set_input_delay -max 1.8 ns -clock CLK` (T_clk = 2.5 ns). Internal datapath delay from IN1 to first Flop FF1 = 0.1 ns. T_setup = 0.1 ns. Calculate setup slack at FF1.',
    a: 'Given: T_input_delay_max = 1.8 ns, T_clk = 2.5 ns, T_combo = 0.1 ns, T_setup = 0.1 ns.\n§F: T_arrival at FF1 = T_input_delay + T_combo = 1.8 + 0.1 = 1.9 ns\n§F: T_required = T_clk − T_setup = 2.5 − 0.1 = 2.4 ns\n§F: Setup Slack = T_required − T_arrival = 2.4 − 1.9 = +0.5 ns\n§R: Setup Slack at FF1 = +0.5 ns ✓',
  },
  {
    id: 'pd-num-output-port-combo', topic: 'pd', level: 'Numerical',
    q: '[Apple] Output port OUT1 has `set_output_delay -max 0.8 ns -clock CLK` (T_clk = 2.0 ns). Internal clock delay to launch Flop FF_out is 0.2 ns, T_clk→q = 0.15 ns. Calculate maximum allowable internal combinational logic delay from FF_out to OUT1.',
    a: 'Given: T_output_delay_max = 0.8 ns, T_clk = 2.0 ns, T_clk_to_FF_out = 0.2 ns, T_clk→q = 0.15 ns.\n§F: T_required at output port = T_clk − T_output_delay\n§C: = 2.0 − 0.8 = 1.2 ns (this is the latest the data can arrive at the output port)\n§F: T_arrival = T_clk_to_FF_out + T_clk→q + T_combo_max\n§C: = 0.2 + 0.15 + T_combo_max = T_required = 1.2 ns\n§F: T_combo_max = 1.2 − 0.2 − 0.15 = 0.85 ns\n§R: Maximum allowable combinational delay from FF_out to OUT1 = 0.85 ns',
  },

  // ── Freshers & HR Questions ─────────────────────────────────────────
  {
    id: 'hr-why-vlsi', topic: 'freshers', level: 'Easy',
    q: 'Why do you want to work in VLSI instead of software engineering?',
    a: 'I enjoy working close to the hardware and understanding physical signal behaviour at the transistor and gate levels. In VLSI, optimizing timing, dynamic power, or silicon area directly impacts millions of hardware units across consumer devices, data centers, and embedded systems. Combining hardware description languages (Verilog/SystemVerilog) with physical silicon design offers a uniquely rewarding engineering challenge.',
  },
  {
    id: 'hr-btech-tools', topic: 'freshers', level: 'Easy',
    q: 'Which VLSI EDA tools or hardware description languages have you used during your engineering studies?',
    a: 'During B.Tech/academics, I worked with Verilog and SystemVerilog for RTL modeling and testbench creation. For simulation and synthesis, I have used industry-standard suites (such as Cadence Xcelium/Genus, Synopsys VCS/Design Compiler, or open-source tools like Icarus Verilog, Yosys, and OpenLane for physical implementation), along with Python and Tcl scripting for workflow automation.',
  },
  {
    id: 'hr-project-learnings', topic: 'freshers', level: 'Medium',
    q: 'Tell me about a VLSI or digital design project you built and your key takeaways from it.',
    a: 'I designed and verified an RTL block (e.g., a 32-bit RISC-V CPU core / 4-bit ALU / SPI Controller) in Verilog. I developed the architecture specification, authored clean modular RTL, and built a SystemVerilog testbench for functional verification. Key learnings included mastering clean coding styles, avoiding unintentional latches, understanding clock domain boundaries, and debugging timing reports.',
  },
  {
    id: 'hr-continuous-learning', topic: 'freshers', level: 'Easy',
    q: 'How do you plan to keep your VLSI domain knowledge updated in the semiconductor industry?',
    a: 'I regularly review core fundamentals (CMOS physics, static timing analysis, setup/hold constraints) and follow industry developments via IEEE papers, semiconductor blogs (SemiAnalysis, WikiChip), and tool documentation. On the job, I actively learn from senior designers by reviewing codebase architectures, analyzing synthesis constraints, and working on hands-on RTL/EDA script projects.',
  },
  {
    id: 'freshers-frequently-asked-matters', topic: 'freshers', level: 'Easy',
    q: '[Self-Check MCQ] In a typical entry-level VLSI candidate evaluation, which attribute matters MOST?',
    a: 'Option B: Deep VLSI & Digital Fundamentals + Strong learning agility for EDA tools.\n\nRecruiters evaluate core understanding of logic design, timing, and problem-solving. Tool syntax can be taught rapidly on the job, but weak digital fundamentals create long-term design bugs.',
  },

  // ── Extended Digital & Verification Fundamentals ───────────────────
  {
    id: 'digital-what-is-vlsi', topic: 'digital', level: 'Easy',
    q: 'What is VLSI, and why is it important in modern technology?',
    a: 'VLSI (Very Large Scale Integration) is the process of integrating thousands to billions of transistors on a single silicon microchip. It enables packing complex digital logic, memory, clock management, and analog interfaces into a single IC (System-on-Chip), drastically reducing power, manufacturing cost, and physical size while elevating computing throughput.',
  },
  {
    id: 'digital-asic-vs-fpga', topic: 'digital', level: 'Easy',
    q: 'What are the main differences between an ASIC and an FPGA?',
    a: 'An ASIC (Application-Specific Integrated Circuit) is a custom-fabricated microchip optimized for a single task, offering maximum performance, lowest unit cost, and minimal power consumption, but requiring high NRE mask costs and zero post-fabrication changes. An FPGA (Field-Programmable Gate Array) consists of reconfigurable logic blocks (LUTs) and routing matrices that can be reprogrammed in the field, making it ideal for rapid prototyping and low-volume applications at higher per-unit power and cost.',
  },
  {
    id: 'digital-sync-vs-async', topic: 'digital', level: 'Medium',
    q: 'Compare synchronous and asynchronous digital circuits.',
    a: 'In synchronous circuits, all sequential memory elements (flip-flops) update state simultaneously under the control of a shared global clock signal, ensuring predictable timing analysis via STA. Asynchronous circuits operate without a global clock, coordinating data transfers using local handshaking signals (req/ack); they offer lower dynamic idle power but introduce complex hazard verification.',
  },
  {
    id: 'digital-2to1-mux-gates', topic: 'digital', level: 'Easy',
    q: 'How is a 2:1 Multiplexer implemented using basic logic gates?',
    a: 'A 2:1 MUX selects between inputs I0 and I1 based on select signal S.\n§F: Y = (\\bar{S} \\cdot I_0) + (S \\cdot I_1)\nThis requires 1 NOT gate (to generate $\\bar{S}$), 2 AND gates (for $\\bar{S}\\cdot I_0$ and $S\\cdot I_1$), and 1 OR gate to combine the outputs.',
  },
  {
    id: 'verilog-blocking-vs-nonblocking', topic: 'verilog', level: 'Medium',
    q: 'What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?',
    a: 'Blocking assignments (=) execute sequentially in procedural order within an active event loop, blocking subsequent statement evaluations; they are strictly used in combinational logic (`always_comb`). Non-blocking assignments (<=) evaluate all RHS expressions concurrently before updating LHS targets at the end of the time step; they must be used in sequential clocked blocks (`always @(posedge clk)`) to prevent simulation race conditions.',
  },
  {
    id: 'pd-static-vs-dynamic-power', topic: 'pd', level: 'Medium',
    q: 'What is the difference between static power and dynamic power in VLSI?',
    a: 'Dynamic power is consumed during active logic switching when charging and discharging parasitic nodal capacitances:\n§F: P_{\\text{dynamic}} = \\alpha \\cdot C_{\\text{load}} \\cdot V_{\\text{dd}}^2 \\cdot f\nStatic power is consumed when the circuit is idle due to subthreshold leakage, gate oxide tunneling, and reverse-biased junction leakage currents ($P_{\\text{static}} = V_{\\text{dd}} \\cdot I_{\\text{leak}}$).',
  },
  {
    id: 'pd-dft-overview', topic: 'pd', level: 'Medium',
    q: 'What is Design for Testability (DFT) and why is it essential?',
    a: 'DFT involves adding auxiliary test circuitry into silicon designs to detect manufacturing defects post-fabrication. Main techniques include Scan Chains (converting flip-flops into shift registers for controllability/observability), BIST (Built-In Self-Test for memory arrays), and Boundary Scan (JTAG IEEE 1149.1 for board-level interconnect testing).',
  },

  // ── EDA Tools & MATLAB Questions ──────────────────────────────────
  {
    id: 'tools-matlab-basics', topic: 'tools', level: 'Easy',
    q: 'What is MATLAB and how is it used in semiconductor and DSP engineering?',
    a: 'MATLAB is a high-level numerical computing and visualization environment widely used for digital signal processing (DSP), filter synthesis, control loop modeling, and architectural algorithm exploration before RTL implementation in Verilog.',
  },
  {
    id: 'tools-matlab-script-vs-func', topic: 'tools', level: 'Easy',
    q: 'What is the structural difference between MATLAB script M-files and function M-files?',
    a: 'Script M-files execute commands sequentially within the global base workspace without accepting input parameters or returning output variables. Function M-files operate in their own isolated local workspace, accept formal arguments (`function [y] = myFunc(x)`), and return defined outputs, preventing variable name collisions.',
  },
  {
    id: 'tools-matlab-vectorization', topic: 'tools', level: 'Medium',
    q: 'What is vectorization in MATLAB and why is it preferred over explicit `for` loops?',
    a: 'Vectorization replaces explicit iterative element loops with optimized matrix array operations (e.g. `y = sin(x)` or element-wise `C = A .* B`). Because MATLAB is optimized for BLAS/LAPACK matrix routines, vectorized operations run 10x-100x faster than interpreted `for` loops.',
  },
  {
    id: 'digital-sync-vs-async', topic: 'digital', level: 'Easy',
    q: 'What is the core operational difference between synchronous and asynchronous digital circuits?',
    a: 'In synchronous circuits, all state transitions across registers are driven simultaneously by a global master clock signal, making STA and verification predictable.\nIn asynchronous circuits, there is no global clock; state changes rely on local handshake signals (request/acknowledge), which can offer higher speed and lower power but significantly increases design and verification complexity.',
  },
  {
    id: 'freshers-vlsi-vs-sw', topic: 'freshers', level: 'Easy',
    q: 'Why choose a career in VLSI design over pure software engineering?',
    a: 'Key takeaways:\n1. Proximity to Silicon: VLSI allows engineers to work at the physical transistor and architectural level, directly shaping hardware capabilities.\n2. Leverage Impact: Microarchitectural and power optimizations in chip design translate to performance and efficiency gains for millions of computing devices worldwide.',
  },
  {
    id: 'pd-antenna-effect-mitigation', topic: 'pd', level: 'Hard',
    q: 'What is the Antenna Effect in VLSI fabrication and how is it mitigated?',
    a: 'The Antenna Effect occurs during plasma etching when long metal interconnects accumulate static charge, building high voltage that can breakdown thin gate oxide of connected transistors.\nMitigation techniques:\n1. Metal Hopping: Route long nets to higher metal layers closer to the gate.\n2. Antenna Diodes: Insert reverse-biased diodes near the gate to safely discharge accumulated plasma voltage to ground.\n3. Gate Sizing: Increase connected gate area to reduce metal-to-gate area ratio.',
  },
  {
    id: 'pd-decoupling-capacitors', topic: 'pd', level: 'Medium',
    q: 'Why are Decoupling Capacitors (Decaps) placed across the Power Distribution Network (PDN)?',
    a: 'Decoupling capacitors act as local energy reservoirs placed between VDD and GND near high-frequency switching blocks.\nWhen standard cells switch simultaneously, they draw instantaneous surge current, causing Dynamic IR drop and ground bounce. Decaps supply this transient current, dampening voltage power grid spikes.',
  },
  {
    id: 'rtl-blocking-vs-nonblocking', topic: 'verilog', level: 'Easy',
    q: 'What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?',
    a: 'Blocking (=) executes sequentially within procedural blocks, evaluating and assigning immediately before proceeding to the next statement (used for combinational logic).\nNon-blocking (<=) evaluates all right-hand side expressions first and schedules updates at the end of the time step, executing in parallel (mandatory for sequential edge-triggered registers to prevent race conditions).',
  }
];

