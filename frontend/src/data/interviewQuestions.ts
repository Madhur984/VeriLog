/**
 * VLSI & Embedded Systems Interview Question Bank.
 * Structured by full VLSI Silicon Design Flow & Embedded Engineering domains:
 * 
 * ── VLSI Design Flow Domains ───────────────────────────────────────
 * 1. Spec & Microarchitecture (spec-arch)
 * 2. RTL Design & Verification (rtl-dv)
 * 3. Logic Synthesis & DFT (synth-dft)
 * 4. Physical Design & Signoff (pd-signoff)
 * 5. Static Timing Analysis (sta-timing)
 * 6. Analog & Device Physics (analog-physics)
 * 7. Post-Silicon, Packaging & Fab (fab-silicon)
 *
 * ── Embedded Systems Domains ───────────────────────────────────────
 * 1. MCU & Architecture (emb-basics)
 * 2. Embedded C & Memory (emb-c)
 * 3. Protocols & Peripherals (emb-protocols)
 * 4. Interrupts, Timers & RTOS (emb-rtos)
 * 5. Debug, Power & Testing (emb-debug)
 *
 * ── Digital Fundamentals & Career ──────────────────────────────────
 * 1. Digital Basics (digital)
 * 2. Number Systems (number)
 * 3. Boolean & K-Maps (boolean)
 * 4. Combinational Logic (comb)
 * 5. Sequential & FSM (seq)
 * 6. EDA Tools & MATLAB (tools)
 * 7. Freshers & HR (freshers)
 */

export type IvTopic =
  | 'digital'
  | 'number'
  | 'boolean'
  | 'comb'
  | 'seq'
  | 'spec-arch'
  | 'rtl-dv'
  | 'synth-dft'
  | 'pd-signoff'
  | 'sta-timing'
  | 'analog-physics'
  | 'fab-silicon'
  | 'emb-basics'
  | 'emb-c'
  | 'emb-protocols'
  | 'emb-rtos'
  | 'emb-debug'
  | 'tools'
  | 'freshers';

export interface IvTopicMeta {
  id: IvTopic;
  label: string;
  color: string;
  /** Groups topics in the sidebar navigator. */
  section: 'VLSI Design Flow' | 'Embedded Systems' | 'Digital Fundamentals' | 'Career & Tools';
}

export const IV_TOPICS: IvTopicMeta[] = [
  // ── VLSI Design Flow ─────────────────────────────────────────────
  { id: 'spec-arch',      label: '1. Specs & Architecture',    color: '#38BDF8', section: 'VLSI Design Flow' },
  { id: 'rtl-dv',          label: '2. RTL Design & UVM / DV',   color: '#818CF8', section: 'VLSI Design Flow' },
  { id: 'synth-dft',      label: '3. Logic Synthesis & DFT',   color: '#A855F7', section: 'VLSI Design Flow' },
  { id: 'pd-signoff',     label: '4. Physical Design & Signoff', color: '#F97316', section: 'VLSI Design Flow' },
  { id: 'sta-timing',     label: '5. Static Timing (STA)',     color: '#EC4899', section: 'VLSI Design Flow' },
  { id: 'analog-physics', label: '6. Analog & Device Physics', color: '#10B981', section: 'VLSI Design Flow' },
  { id: 'fab-silicon',    label: '7. Packaging, Yield & Fab',  color: '#F59E0B', section: 'VLSI Design Flow' },

  // ── Embedded Systems ─────────────────────────────────────────────
  { id: 'emb-basics',     label: 'MCU Architecture',           color: '#14B8A6', section: 'Embedded Systems' },
  { id: 'emb-c',          label: 'Embedded C & Memory',        color: '#06B6D4', section: 'Embedded Systems' },
  { id: 'emb-protocols',  label: 'Buses (I2C/SPI/CAN/UART)',   color: '#3B82F6', section: 'Embedded Systems' },
  { id: 'emb-rtos',       label: 'Interrupts, Timers & RTOS',  color: '#8B5CF6', section: 'Embedded Systems' },
  { id: 'emb-debug',      label: 'Debug, Power & Testing',     color: '#D946EF', section: 'Embedded Systems' },

  // ── Digital Fundamentals ─────────────────────────────────────────
  { id: 'digital',        label: 'Digital Basics',             color: '#22D3EE', section: 'Digital Fundamentals' },
  { id: 'number',         label: 'Number Systems',             color: '#F59E0B', section: 'Digital Fundamentals' },
  { id: 'boolean',        label: 'Boolean & K-Maps',           color: '#34D399', section: 'Digital Fundamentals' },
  { id: 'comb',           label: 'Combinational Logic',        color: '#A78BFA', section: 'Digital Fundamentals' },
  { id: 'seq',            label: 'Sequential & FSM',           color: '#FB7185', section: 'Digital Fundamentals' },

  // ── Career & Tools ───────────────────────────────────────────────
  { id: 'tools',          label: 'EDA Tools & MATLAB',         color: '#E11D48', section: 'Career & Tools' },
  { id: 'freshers',       label: 'Freshers & HR Scenarios',    color: '#10B981', section: 'Career & Tools' },
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
  {
    id: "comb-vs-seq", topic: "digital", level: "Easy",
    q: "What is the difference between combinational and sequential circuits?",
    a: "A combinational circuit’s output depends only on the current inputs — it has no memory (e.g. adders, multiplexers). A sequential circuit’s output depends on the current inputs and on stored state (memory), and it updates in step with a clock (e.g. counters, registers, state machines).",
  },
  {
    id: "latch-vs-ff", topic: "digital", level: "Easy",
    q: "What is the difference between a latch and a flip-flop?",
    a: "A latch is level-sensitive: it is transparent (passes input to output) the whole time its enable is active. A flip-flop is edge-sensitive: it captures the input only on a clock edge (rising or falling). Synchronous designs use flip-flops because edge-triggering makes timing predictable.",
  },
  {
    id: "setup-hold", topic: "digital", level: "Medium",
    q: "What are setup time and hold time?",
    a: "Setup time is the minimum time the data input must be stable BEFORE the clock edge. Hold time is the minimum time it must stay stable AFTER the edge. If either is violated, the flip-flop can go metastable and capture an unpredictable value.",
  },
  {
    id: "metastability", topic: "digital", level: "Hard",
    q: "What is metastability and how do you handle it?",
    a: "If a flip-flop samples data that changes too close to the clock edge (a setup/hold violation), its output can hover between 0 and 1 for an unpredictable time before settling. You reduce the risk of it propagating by passing asynchronous signals through a synchronizer — usually two flip-flops in series — before using them.",
  },
  {
    id: "fanin-fanout", topic: "digital", level: "Easy",
    q: "What are fan-in and fan-out?",
    a: "Fan-in is the number of inputs a gate has. Fan-out is the number of gate inputs that a single output can drive while still meeting its timing and electrical limits. High fan-out adds delay and may need a buffer.",
  },
  {
    id: "prop-delay", topic: "digital", level: "Easy",
    q: "What is propagation delay?",
    a: "The time it takes for a change at a gate or circuit’s input to show up at its output. Propagation delays add up along a path and set the maximum clock speed of the design.",
  },
  {
    id: "twos-comp", topic: "number", level: "Easy",
    q: "What is 2’s complement and why is it used?",
    a: "To negate a binary number in 2’s complement, invert every bit and add 1. It is used for signed numbers because one adder then handles both addition and subtraction (A − B = A + (−B)), and there is only a single representation of zero.",
  },
  {
    id: "bin-to-gray", topic: "number", level: "Medium",
    q: "How do you convert binary to Gray code?",
    a: "Keep the MSB the same. Each remaining Gray bit is the XOR of the two adjacent binary bits (G[i] = B[i+1] ⊕ B[i]). The result changes by only one bit between consecutive values.",
  },
  {
    id: "why-gray", topic: "number", level: "Medium",
    q: "Why is Gray code used in K-maps and counters?",
    a: "Only one bit changes between adjacent values. In K-maps that lets neighbouring cells combine; in counters and encoders it avoids glitches, because you never have several bits switching at once and briefly showing a wrong value.",
  },
  {
    id: "bcd", topic: "number", level: "Easy",
    q: "What is BCD and how does a BCD adder differ from a binary adder?",
    a: "BCD (Binary-Coded Decimal) stores each decimal digit in 4 bits (0000–1001). A BCD adder adds two digits with a normal binary adder, then adds 6 (0110) whenever the result exceeds 9 or produces a carry, to skip the six unused codes and keep the result valid decimal.",
  },
  {
    id: "sop-vs-pos", topic: "boolean", level: "Easy",
    q: "What is the difference between SOP and POS?",
    a: "SOP (Sum of Products) is the OR of the minterms — the rows where the output is 1. POS (Product of Sums) is the AND of the maxterms — the rows where the output is 0. Both describe the exact same function; you pick whichever is shorter.",
  },
  {
    id: "minterm-maxterm", topic: "boolean", level: "Easy",
    q: "What is a minterm versus a maxterm?",
    a: "A minterm is an AND term that is 1 for exactly one row of the truth table (variable written plain if it is 1, complemented if 0). A maxterm is an OR term that is 0 for exactly one row (the rule is flipped).",
  },
  {
    id: "dont-care", topic: "boolean", level: "Medium",
    q: "What are don’t-care conditions and how do they help?",
    a: "Don’t-cares are input combinations that never occur, or whose output does not matter. In a K-map you can treat each as a 0 or a 1 — whichever lets you draw a bigger group — which gives simpler, cheaper logic.",
  },
  {
    id: "kmap-minimize", topic: "boolean", level: "Medium",
    q: "How do you minimize a function using a K-map?",
    a: "Plot the 1s on the grid (rows/columns in Gray-code order). Circle them in rectangular groups whose size is a power of two (1, 2, 4, 8…), as large as possible, wrapping around edges if it helps. Each group drops one variable; OR the terms from all groups to get the minimal SOP.",
  },
  {
    id: "demorgan", topic: "boolean", level: "Easy",
    q: "State De Morgan’s theorems.",
    a: "NOT(A AND B) = NOT A OR NOT B, and NOT(A OR B) = NOT A AND NOT B. In short, break the bar and flip the operator. They are what let you convert between AND/OR forms and build everything from NAND or NOR gates.",
  },
  {
    id: "mux-from-mux", topic: "comb", level: "Medium",
    q: "How do you build a 4:1 multiplexer from 2:1 multiplexers?",
    a: "Use three 2:1 muxes. Two of them use sel[0] to choose between (d0, d1) and between (d2, d3). A third mux uses sel[1] to choose between those two results. That gives the 4:1 selection.",
  },
  {
    id: "dec-vs-mux", topic: "comb", level: "Easy",
    q: "What is the difference between a decoder and a multiplexer?",
    a: "A decoder takes n select lines and drives 2ⁿ one-hot outputs — exactly one output is active for each input code. A multiplexer takes 2ⁿ data inputs plus n select lines and routes one of them to a single output. Decoder = one-to-many select; mux = many-to-one route.",
  },
  {
    id: "nand-universal", topic: "comb", level: "Medium",
    q: "Why is NAND called a universal gate?",
    a: "Because you can build every other gate from it. NOT = NAND(a, a); AND = NOT of NAND; OR = NAND of the two inverted inputs (by De Morgan). Since any function can be written in SOP form, it can be built entirely from NANDs — handy because NAND is cheap and fast in CMOS.",
  },
  {
    id: "half-vs-full-adder", topic: "comb", level: "Easy",
    q: "What is the difference between a half adder and a full adder?",
    a: "A half adder adds two bits: Sum = A ⊕ B, Carry = A · B. A full adder adds three bits (including a carry-in): Sum = A ⊕ B ⊕ Cin, and Cout is 1 when at least two inputs are 1 (a majority). A full adder can be built from two half adders and an OR gate.",
  },
  {
    id: "ripple-slow", topic: "comb", level: "Medium",
    q: "Why is a ripple-carry adder slow, and how is it made faster?",
    a: "Each stage cannot finish until the carry from the previous stage arrives, so the worst-case delay grows with the number of bits. A carry-look-ahead adder fixes this by computing all carries in parallel from Generate (G = A·B) and Propagate (P = A⊕B) signals, so it no longer waits bit by bit.",
  },
  {
    id: "hazard", topic: "comb", level: "Hard",
    q: "What is a glitch (hazard) in combinational logic?",
    a: "A brief wrong output that appears because two paths to the same gate have different delays, so signals arrive at slightly different times. A static hazard is a momentary 0 (or 1) where the output should have stayed constant. K-map grouping that overlaps adjacent terms (adding a redundant prime implicant) can remove static hazards.",
  },
  {
    id: "moore-vs-mealy", topic: "seq", level: "Medium",
    q: "What is the difference between a Moore and a Mealy state machine?",
    a: "A Moore machine’s output depends only on the current state, so it changes on the clock edge and is glitch-free but may need more states. A Mealy machine’s output depends on the state AND the current inputs, so it reacts one cycle sooner and often needs fewer states, but its output can glitch with the inputs.",
  },
  {
    id: "sync-vs-async-reset", topic: "seq", level: "Medium",
    q: "What is the difference between synchronous and asynchronous reset?",
    a: "A synchronous reset only takes effect on a clock edge (the reset is not in the sensitivity list). An asynchronous reset takes effect immediately, regardless of the clock (it appears in the sensitivity list, e.g. \"or negedge rst_n\"). Async reset acts even with no clock but needs care around reset removal (recovery/removal timing).",
  },
  {
    id: "mod-n-ff", topic: "seq", level: "Easy",
    q: "How many flip-flops are needed for a mod-N counter?",
    a: "ceil(log2(N)) flip-flops. For example a mod-10 (decade) counter needs 4 flip-flops because 2³ = 8 is too few and 2⁴ = 16 is enough.",
  },
  {
    id: "clock-skew", topic: "seq", level: "Hard",
    q: "What is clock skew and why does it matter?",
    a: "Clock skew is the difference in the clock’s arrival time at different flip-flops. Positive skew (clock reaches the capturing flop later) can help setup but hurt hold; negative skew does the opposite. Large uncontrolled skew causes hold or setup violations, so clock trees are balanced during physical design.",
  },
  {
    id: "one-hot", topic: "seq", level: "Medium",
    q: "What is one-hot state encoding and when is it used?",
    a: "One-hot gives each FSM state its own flip-flop, with exactly one bit high at a time. It uses more flip-flops than binary encoding but makes the next-state and output logic simpler and faster, so it is popular in FPGAs where flip-flops are plentiful.",
  },
  {
    id: "setup-fix", topic: "seq", level: "Hard",
    q: "A path is failing setup timing. What can you do?",
    a: "Shorten the logic between the two flip-flops (fewer levels of gates), pipeline the path by adding a register stage, resize/buffer slow gates, balance clock skew in your favour, or as a last resort lower the clock frequency. Setup fails when combinational delay + setup > clock period.",
  },
  {
    id: "reg-vs-wire", topic: "rtl-dv", level: "Easy",
    q: "What is the difference between reg and wire in Verilog?",
    a: "A wire is a physical connection that must be driven continuously (by an assign or a module output). A reg holds a value assigned inside an always or initial block. Important: reg does NOT necessarily mean a hardware register — a reg in a combinational always block synthesises to gates, not a flip-flop.",
  },
  {
    id: "blocking-nonblocking", topic: "rtl-dv", level: "Medium",
    q: "When do you use blocking (=) versus non-blocking (<=) assignments?",
    a: "Use blocking (=) in combinational always blocks — it executes immediately, in order. Use non-blocking (<=) in clocked/sequential always blocks — all right-hand sides are evaluated first, then updated together at the end of the time step, which correctly models parallel flip-flops. Mixing them in one block causes race conditions and sim/synthesis mismatches.",
  },
  {
    id: "inferred-latch", topic: "rtl-dv", level: "Medium",
    q: "What causes an unintended latch in Verilog, and how do you avoid it?",
    a: "An incomplete assignment in a combinational always block — for example an if with no else, or a case without a default — leaves the output unassigned for some inputs, so the tool infers a latch to \"remember\" the old value. Avoid it by assigning a default value at the top of the block, or covering every branch.",
  },
  {
    id: "always-star", topic: "rtl-dv", level: "Easy",
    q: "Why use always @* instead of listing signals like always @(a or b)?",
    a: "always @* automatically builds the sensitivity list from every signal read inside the block. A hand-written list that misses a signal simulates wrong (stale outputs) but often synthesises right — the worst kind of bug. @* keeps simulation and hardware consistent.",
  },
  {
    id: "eq-vs-caseeq", topic: "rtl-dv", level: "Medium",
    q: "What is the difference between == and === in Verilog?",
    a: "== is logical equality: if either operand has an x or z bit, the result is x (unknown). === is case equality: it compares x and z bits literally and returns a definite 0 or 1. Use === in testbenches to check for exact values including x/z; it is not synthesisable.",
  },
  {
    id: "testbench", topic: "rtl-dv", level: "Easy",
    q: "What is a testbench?",
    a: "A non-synthesisable Verilog module that instantiates the design under test (DUT), applies stimulus to its inputs over time, and checks the outputs against expected values. It has no ports of its own and is only used for simulation.",
  },
  {
    id: "pd-lef-def", topic: "pd-signoff", level: "Easy",
    q: "[Synopsys] What are the mandatory input files for Place & Route? Explain the structural difference between a LEF file and a DEF file.",
    a: "Mandatory inputs: Gate-Level Netlist (.v), Timing/Power Libraries (.lib/.db), Physical Libraries (.lef), Design Constraints (.sdc), RC Extraction Tech Files (.tluplus/.qrcTechFile), and Power Constraints (.upf) for multi-voltage designs.\n\nLEF (Library Exchange Format): A static abstract library file defining physical blueprints of standard cells and macros — cell boundary sizes, pin coordinates, metal layer geometries, obstruction areas, and pitch/spacing rules. Contains no timing data.\n\nDEF (Design Exchange Format): A design-specific file representing the actual chip layout — the floorplan, placed cell locations, net connections, routed wires, and vias for a specific design instance.",
  },
  {
    id: "pd-lib-db", topic: "sta-timing", level: "Easy",
    q: "[Qualcomm] What is the difference between .lib and .db formats? What critical information is in a timing library versus a physical library (.lef)?",
    a: ".lib is human-readable ASCII Liberty format containing timing arcs, power tables, and pin functions. .db is the compiled binary version of .lib, optimised for memory efficiency and fast tool loading — functionally identical but not human-readable.\n\nTiming Library (.lib/.db) contains: internal arc delays, setup/hold thresholds, NLDM/CCS/ECSM delay models, transition/capacitance tables, leakage/dynamic power tables, and pin capacitances.\n\nPhysical Library (.lef) contains: cell boundary dimensions, site types, pin coordinates, metal layer geometries, blockage regions, and pitch/spacing rules. It contains zero timing arc data.",
  },
  {
    id: "pd-tlu-plus", topic: "sta-timing", level: "Medium",
    q: "[Nvidia] What is a TLU+ or ITF file, and how does the P&R engine use RC extraction models at early placement versus post-route stages?",
    a: "TLU+ / ITF files contain process manufacturing specifications — metal thickness, resistivity, dielectric constants, and dielectric height — used to build RC lookup tables for parasitic extraction.\n\nEarly Placement Stage: Uses virtual/global routing with fast wire-load models or distance-based RC estimation to rapidly estimate parasitic delay without detailed layout geometry.\n\nPost-Route Stage: Uses full 3D detailed extraction with exact routed metal geometries, via counts, and cross-coupling capacitance from actual placed and routed traces for final signoff STA accuracy.",
  },
  {
    id: "pd-sdc-contents", topic: "pd-signoff", level: "Medium",
    q: "[Intel] What does an SDC file contain? What happens if an input port is left unconstrained in SDC?",
    a: "SDC (Synopsys Design Constraints) contains: clock declarations (`create_clock`, `create_generated_clock`), clock characteristics (uncertainty, latency, transition), I/O delay constraints (`set_input_delay`, `set_output_delay`), design rule constraints (`set_max_transition`, `set_max_capacitance`, `set_max_fanout`), and timing exceptions (`set_false_path`, `set_multicycle_path`).\n\nUnconstrained Input Port: The tool assumes zero external input delay. Paths originating from that port are not timing-optimised, resulting in unoptimised setup/hold paths, large input transition violations, and functional failure on real silicon.",
  },
  {
    id: "pd-core-sizing", topic: "pd-signoff", level: "Medium",
    q: "[Apple] How do you calculate core size and aspect ratio? What considerations dictate macro placement near the core boundary versus the center?",
    a: "Core Area = (Total Cell Area + Total Macro Area) / Target Utilization. Aspect Ratio = Core Height / Core Width.\n\nBoundary Placement (preferred): Minimises routing congestion in the core, keeps central routing channels clear for standard cells, aligns macro pins with I/O ring connections, and avoids splitting standard-cell placement islands.\n\nCenter Placement: Only used if a macro communicates equally with surrounding blocks and minimising wire latency is critical, but it severely risks routing congestion and fragmented standard-cell regions.",
  },
  {
    id: "pd-halo-blockage", topic: "pd-signoff", level: "Medium",
    q: "[Qualcomm] What are Halo (Keepout Margin) and Blockage types (Hard, Soft, Partial)? When would you use a Partial Blockage over a Hard Blockage?",
    a: "Halo (Keepout Margin): A dynamic perimeter around macros that travels with the macro during placement, preserving routing channels and preventing standard cells from crowding macro edges.\n\nHard Blockage: Permanently prohibits all standard cell and macro placement.\nSoft Blockage: Prohibits cells during global placement but allows placement during legalization/detailed placement if needed for timing or buffer insertion.\nPartial Blockage: Restricts cell density to a specified percentage (e.g. max 40%) to alleviate congestion.\n\nUse Partial over Hard when routing density is high but buffers still need to be placed in the region to fix timing — a hard blockage would prevent those buffer insertions entirely.",
  },
  {
    id: "pd-flyline", topic: "pd-signoff", level: "Easy",
    q: "[AMD] Explain fly-line analysis during macro placement and how it helps minimise global wire congestion.",
    a: "Fly-Line Analysis displays straight logical connection vectors between macros, standard-cell clusters, and I/O pins based on netlist topology — visualising the \"demand\" of global wires before routing occurs.\n\nBy orienting macros so that fly-lines are parallel, uncrossed, and short, designers avoid configurations where global wires would criss-cross and compete for the same routing tracks. Proper alignment based on fly-lines is the primary technique for preventing global routing bottlenecks before placement is committed.",
  },
  {
    id: "pd-pdn-arch", topic: "pd-signoff", level: "Hard",
    q: "[Nvidia] Describe PDN components — rings, stripes, rails. How do you size core power stripes to prevent EM and IR drop?",
    a: "Rings: Perimeter conductors surrounding the chip/core that distribute current from I/O pads to the inner power network.\nStripes: Higher-level metal vertical/horizontal grid lines that carry current across the core area.\nRails: Lowest metal (M1) structures that directly supply VDD/VSS to standard cell rows.\n\nSizing Strategy: Stripe width and pitch are calculated from maximum current (I_max), the electromigration current density limit (J_max in mA/μm), and the target maximum IR drop. For a stripe of resistance R_stripe, the allowed IR drop ΔV_max = I · R_stripe. Wider stripes lower resistance; tighter pitch reduces the distance current must travel horizontally through thin rails.",
  },
  {
    id: "pd-ir-drop-types", topic: "sta-timing", level: "Medium",
    q: "[Intel] What is the distinction between Dynamic IR drop and Static IR drop? Which floorplan choices aggravate Dynamic IR drop?",
    a: "Static IR Drop: DC voltage drop caused by resistive loss V = I_avg · R during steady-state average current draw through the power grid.\n\nDynamic IR Drop: AC voltage drop ΔV = L · di/dt + I_peak · R caused by localized transient peak currents when large numbers of gates switch simultaneously on a clock edge.\n\nAggravating Floorplan Choices: High-density cell clusters near high-frequency clock trees; placing macros close together without sufficient local power stripes; narrow power trunks near high-switching-activity functional units; and insufficient local decap cell insertion near switching clock gating cells.",
  },
  {
    id: "pd-decap", topic: "pd-signoff", level: "Easy",
    q: "[Samsung] What are Decoupling Capacitors (Decaps), where are they placed, and how do they mitigate transient switching noise?",
    a: "Decoupling Capacitors are localised charge reservoirs placed between VDD and VSS rail networks, typically implemented as always-on MOSFET capacitors in standard-cell rows.\n\nPlacement: Distributed near high-frequency clock gates, memory macro borders, and power domain boundaries — wherever peak current demand is highest.\n\nNoise Mitigation: During high transient di/dt events (many gates switching simultaneously), Decaps supply instantaneous charge locally to the switching logic before the main power supply can respond through the resistive/inductive power grid, preventing the VDD rail from dipping below the safe operating voltage.",
  },
  {
    id: "pd-placement-phases", topic: "pd-signoff", level: "Easy",
    q: "[Cadence] What are the internal algorithmic phases of placement — Global Placement, Congestion Optimisation, Legalization, Detailed Placement?",
    a: "Global Placement: Determines coarse spatial positions across the floorplan while temporarily allowing cell overlaps. Objective is to minimise total wirelength and timing cost.\n\nCongestion Optimisation: Adjusts cell density based on routing track availability, spreading cells away from over-congested regions to ensure routable density distribution.\n\nLegalization: Eliminates all cell overlaps and snaps cells precisely to standard-cell rows and site grid boundaries.\n\nDetailed Placement: Performs fine local cell swapping and micro-adjustments to minimise total wirelength, reduce transition violations, and improve setup timing — while maintaining legality from the previous step.",
  },
  {
    id: "pd-tap-cells", topic: "pd-signoff", level: "Easy",
    q: "[Apple] What is the physical role of Tap Cells (Well-taps), and how do they prevent CMOS latch-up? What determines their maximum pitch?",
    a: "Tap Cells connect the p-substrate to VSS and the n-well to VDD at regular intervals throughout standard-cell rows, ensuring the substrate and well are tied to their correct supply potentials.\n\nLatch-Up Prevention: Without well-taps, the parasitic PNP (p-sub/n-well/p-source) and NPN (n-well/p-sub/n-source) transistors can form a parasitic SCR (thyristor). If triggered by a noise event, the SCR latches into a low-resistance conducting state, shorting VDD to VSS and potentially destroying the device.\n\nMaximum Pitch: Dictated by the foundry Design Rule Manual (DRM) based on substrate and n-well sheet resistance — tap spacing must be close enough that the resistive voltage drop in the well/substrate stays below the threshold for parasitic bipolar turn-on.",
  },
  {
    id: "pd-vt-swap", topic: "sta-timing", level: "Medium",
    q: "[Nvidia] Compare HVT, SVT, and LVT cells in terms of power, delay, and leakage. How does P&R swap VT cells during timing closure?",
    a: "LVT (Low Threshold Voltage): Fastest switching delay, standard dynamic power, very high leakage — used on critical timing paths.\nSVT (Standard VT): Medium delay, moderate leakage — the default for most logic.\nHVT (High VT): Slowest delay, lowest leakage — used for non-critical paths to minimise standby power.\n\nP&R VT Swapping Strategy: Placement engines begin with an all-HVT library to minimise leakage. During timing closure, paths with negative setup slack are selectively swapped from HVT to SVT or LVT to recover timing margin. Hold violations on heavily-buffered paths may require swapping back to HVT. The final mix balances timing closure with a power/leakage budget target.",
  },
  {
    id: "pd-endcap", topic: "pd-signoff", level: "Easy",
    q: "[Qualcomm] What is End-Cap cell placement, and why is it necessary at row boundaries or macro peripheries?",
    a: "End-Cap Cells are specialised non-logical cells inserted at the left and right terminations of every standard-cell row and at the edges of hard macro boundaries.\n\nNecessity: They provide gate-oxide and well-isolation at row edges, prevent optical and lithographic edge-distortion artifacts during manufacturing, and satisfy active-layer enclosure rules in the Design Rule Manual (DRM). Without end-caps, the active diffusion at the edge of a row would be exposed to manufacturing process effects that cause transistor degradation or DRC violations.",
  },
  {
    id: "pd-tie-cells", topic: "sta-timing", level: "Easy",
    q: "[Intel] Explain Tie-High and Tie-Low cells. Why don't we connect standard cell gate terminals directly to VDD or VSS?",
    a: "Tie-High and Tie-Low cells are dummy driver cells that provide a constant logic '1' (VDD) or logic '0' (VSS) output through a protective transistor structure.\n\nWhy Not Direct Connection: Connecting a gate terminal directly to the VDD or VSS power rail subjects the fragile thin-gate oxide directly to power supply voltage transients, ESD spikes, and current surges that occur during power-on or antenna charge accumulation. This risks irreversible gate oxide breakdown. Tie cells contain internal pull-up or pull-down transistors with built-in current limiting and ESD protection, providing the correct logic level safely.",
  },
  {
    id: "pd-scan-reorder", topic: "pd-signoff", level: "Medium",
    q: "[Broadcom] What is Scan Chain Reordering? Why is it executed during placement, and how does it affect DFT routing?",
    a: "Scan Chain Reordering re-arranges the logical order of test flip-flops in a scan chain based on their actual physical placement locations after global placement is complete.\n\nWhy During Placement: The original DFT scan chain order is determined before physical placement and is based on netlist topology — not physical proximity. Post-placement, the logically ordered chain produces long criss-crossing scan interconnects between physically distant flip-flops, consuming large amounts of global routing resources.\n\nRouting Benefit: Reordering the scan chain so adjacent flip-flops in the chain are also physically adjacent drastically reduces scan wire length, frees global routing capacity for functional signals, and reduces total design congestion — without changing the DFT test coverage or test pattern.",
  },
  {
    id: "pd-cts-goals", topic: "sta-timing", level: "Easy",
    q: "[Synopsys] What are the primary goals of Clock Tree Synthesis? Differentiate between Clock Skew, Insertion Delay (Latency), and Clock Jitter.",
    a: "Primary CTS Goals: Distribute the clock with minimum skew between all sinks, acceptable insertion delay, clean transition times meeting library limits, and minimum clock power consumption.\n\nClock Skew: The maximum difference in clock arrival time between any two flip-flop clock pins within a clock domain. Skew directly impacts both setup and hold timing margins.\n\nInsertion Delay (Latency): The total propagation time from the clock source to a flip-flop clock pin — the sum of source latency (PLL to chip port) and network latency (chip port to sink, built during CTS).\n\nClock Jitter: Cycle-to-cycle variation in clock edge arrival time relative to the ideal clock period, caused by PLL phase noise, power supply ripple, or thermal effects. Jitter is modelled in STA as clock uncertainty.",
  },
  {
    id: "pd-clock-topo", topic: "pd-signoff", level: "Medium",
    q: "[Nvidia] Compare H-Tree, Mesh, and Balanced Buffer Tree topologies. When would an enterprise GPU design choose a Clock Mesh over an H-tree?",
    a: "H-Tree: Symmetric recursive branching topology with mathematically zero structural skew. Ideal for regular array structures (memory, datapath) but inflexible for irregular floorplans.\n\nBalanced Buffer Tree: Standard CTS approach using balanced buffer chains. Flexible for arbitrary floorplans, but susceptible to dynamic OCV variation and process-induced skew.\n\nClock Mesh: A highly interconnected metal grid driven by multiple parallel clock buffers, where any local variation is averaged out by the mesh connectivity.\n\nGPU/ASIC preference for Mesh: On large die areas (>100mm²) with millions of flip-flops, process and temperature gradients cause significant dynamic skew in tree structures. A clock mesh provides self-equalising delay — local skew from a single buffer is absorbed by adjacent mesh drivers — giving superior jitter tolerance and variation resistance despite higher power consumption.",
  },
  {
    id: "pd-clock-latency", topic: "sta-timing", level: "Medium",
    q: "[Qualcomm] What is Source Latency vs. Network Latency? How do virtual clocks model source latency?",
    a: "Source Latency: The time delay from the master clock source (e.g., crystal oscillator or PLL output) to the chip input clock port. This delay exists outside the chip and is modelled in SDC using `set_clock_latency -source`.\n\nNetwork Latency: The time delay from the chip input clock port through the synthesised clock tree to the target flip-flop clock pin. This is built and controlled during CTS.\n\nVirtual Clocks: Clocks defined in SDC without an attached physical port — used to model timing relationships for external I/O interfaces operating on off-chip clock sources. Source latency is applied to virtual clocks to account for the external clock path delay, allowing accurate `set_input_delay` and `set_output_delay` constraints for chip-to-chip interfaces.",
  },
  {
    id: "pd-useful-skew", topic: "sta-timing", level: "Hard",
    q: "[Apple] What is Useful Skew (Clock Pulling/Pushing)? How can deliberately introduced skew fix a setup violation without altering datapath logic?",
    a: "Useful Skew deliberately introduces unequal clock arrival times at launch and capture flip-flops to trade setup margin against hold margin.\n\nSetup Fix by Clock Pushing: If the data path FF_A → combo → FF_B violates setup timing, delay the clock arrival at FF_B (the capture flop) by inserting additional buffers on FF_B's clock path. This gives the data more time to propagate and arrive before the clock edge at FF_B — effectively 'stealing' time from the clock cycle without touching any logic.\n\nConstraint: Adding delay to the capture clock worsens the hold check at FF_B (hold slack = arrival_min − capture_lat − T_hold). Useful skew must be balanced so the hold violation on the same path is not worsened beyond fixable limits. CTS tools implement this as a constrained optimisation across all paths.",
  },
  {
    id: "pd-icg-cells", topic: "sta-timing", level: "Medium",
    q: "[AMD] What are Integrated Clock Gating (ICG) cells? What is the enable setup/hold check on an ICG cell, and how is it closed in CTS?",
    a: "ICG (Integrated Clock Gating) cells combine a latch and an AND gate to safely disable clock switching on idle registers, eliminating spurious clock edges and reducing dynamic power on inactive data paths.\n\nEnable Setup Check: The enable signal must arrive at the ICG latch input and be stable before the active clock edge that closes the latch — preventing a glitch on the gated clock output. Violation means the enable could be sampled mid-transition, creating a partial-width clock pulse.\n\nEnable Hold Check: The enable must remain stable after the clock edge for the latch hold time.\n\nClosing in CTS: The CTS engine balances latency to the ICG enable pin just as it does for flip-flop clock pins, inserting buffers on the enable path or adjusting the clock arrival at the ICG to satisfy both enable setup and hold timing checks simultaneously.",
  },
  {
    id: "pd-clock-buffers", topic: "pd-signoff", level: "Easy",
    q: "[Intel] Why do we use specialised Clock Buffers/Inverters instead of regular logic buffers in the clock tree?",
    a: "Clock Buffers are purpose-designed with symmetric rise and fall delays (matched to maintain 50% duty cycle through the tree), high drive strength, balanced output capacitance, and physically symmetric internal layout to avoid introducing additional skew.\n\nLogic Buffers are optimised for minimum cell area, not symmetry — they typically have asymmetric rise/fall times, which cause duty-cycle distortion and introduce skew when used in balanced clock trees. A single asymmetric buffer in a clock path can shift all downstream flip-flop capture edges, creating effective skew that cannot be balanced by further tree optimisation.",
  },
  {
    id: "pd-routing-phases", topic: "pd-signoff", level: "Easy",
    q: "[Nvidia] Describe Global Routing vs. Track Assignment vs. Detailed Routing.",
    a: "Global Routing: Partitions the core into a grid of G-cells and assigns each net to a sequence of routing regions (G-cells) without specifying exact metal tracks. Produces a coarse routing plan used to estimate congestion and guide detailed routing.\n\nTrack Assignment: Takes the global routing solution and assigns each wire segment to a specific metal track and layer, resolving track conflicts and minimising vias and wire jogs. Improves routability before detailed routing.\n\nDetailed Routing: The final physical routing step. Places exact metal polygons and vias on the layout while obeying all lithography DRC rules (minimum width, spacing, enclosure, via size). Produces the actual mask-ready geometry.",
  },
  {
    id: "pd-ndr-shield", topic: "pd-signoff", level: "Medium",
    q: "[Qualcomm] What are Non-Default Rules (NDR)? Why do we apply double-width, double-spacing, or shielding to critical clock signals?",
    a: "Non-Default Rules (NDR) are custom routing specifications that override the default minimum design rules for specific nets, typically specifying wider width and/or larger spacing than the technology minimum.\n\nDouble-Width: Reduces wire resistance (R ∝ 1/W), lowering RC delay and IR drop on long clock nets. Also improves electromigration reliability.\n\nDouble-Spacing: Reduces capacitive coupling (crosstalk) from adjacent switching signals to the critical clock net, preventing clock edge jitter induced by aggressor switching.\n\nShielding (VSS/VDD guard wires): Places static-voltage VSS or VDD wires immediately adjacent to the clock net. Since shield wires never switch, they provide a fixed coupling capacitance that eliminates dynamic crosstalk noise and prevents crosstalk-induced delay variation on the protected clock.",
  },
  {
    id: "pd-crosstalk-mech", topic: "sta-timing", level: "Medium",
    q: "[Nvidia] Explain the mechanisms of Crosstalk Glitch and Crosstalk Delay. What is Miller Coupling Factor (MCF)?",
    a: "Crosstalk Glitch: A spurious voltage spike on a quiet victim net caused by capacitive coupling from a switching aggressor net. If the glitch magnitude exceeds the receiver threshold, it can cause functional errors by flipping a latch or register.\n\nCrosstalk Delay: A change in signal propagation delay on the victim net due to capacitive coupling from a switching aggressor. When aggressor and victim switch in the same direction simultaneously, the effective coupling capacitance is reduced (faster transition). When they switch in opposite directions, effective capacitance doubles (slower transition — setup violation risk).\n\nMiller Coupling Factor (MCF): A factor that scales the coupling capacitance to model the effective aggressor switching impact. MCF = 0 when aggressor is static (only ground capacitance Cg). MCF = 1 for same-direction switching. MCF = 2 for opposite-direction switching (maximum pessimism), effectively doubling Cc in timing analysis.",
  },
  {
    id: "pd-crosstalk-fixes", topic: "sta-timing", level: "Medium",
    q: "[Qualcomm] What are the standard ECO techniques to fix a crosstalk timing violation found during SI analysis?",
    a: "Spacing: Increase physical separation between aggressor and victim wires — the primary and cheapest fix. Coupling capacitance Cc ∝ 1/d.\n\nShielding: Insert VSS/VDD guard wires adjacent to the victim net, providing a static capacitive ground that prevents aggressor-induced delta-V from coupling into the victim.\n\nLayer Change: Move either the aggressor or victim to a different metal layer — parallel wires on different layers have lower interlayer coupling capacitance than same-layer wires at minimum spacing.\n\nDriver Upsizing: Increase the victim driver strength. A lower driver output impedance Rd reduces the RC time constant of the victim path, making it less susceptible to coupling-induced delay shift.\n\nNet Buffering: Insert buffers on the victim net to break the long parallel coupling run into shorter segments, reducing the total coupling length and therefore total Cc.",
  },
  {
    id: "pd-antenna-effect", topic: "pd-signoff", level: "Medium",
    q: "[Intel] What is the Antenna Effect (Plasma-Induced Gate Oxide Damage)? Name three methods to fix an antenna DRC violation.",
    a: "Antenna Effect: During plasma etching in CMOS fabrication, metal and poly wires act as antennas that accumulate plasma charge. If a long metal segment is directly connected to a transistor gate before the gate's protective source/drain implant is formed, the accumulated charge can create a high electric field across the thin gate oxide, causing permanent dielectric breakdown.\n\nFix Methods:\n1. Layer Hopping (Jumper): Route the antenna-violating net up to a higher metal layer (one that has its top-level connections completed before the lower etch), inserting a via at the violation point. The higher layer's charge escapes through the completed connections.\n2. Antenna Diode Insertion: Add a reverse-biased diode (tied to VSS/VDD) near the gate input. During processing, the diode conducts in breakdown and discharges accumulated plasma charge harmlessly to the supply rail.\n3. Net Splitting: Re-route the long wire to break it into shorter antenna-compliant segments connected through upper metal layers.",
  },
  {
    id: "pd-em-factors", topic: "pd-signoff", level: "Easy",
    q: "[Samsung] What causes Electromigration (EM) in metal interconnects, and what design rules prevent EM violations?",
    a: "Electromigration: A physical phenomenon where sustained high-density electron flow (momentum transfer from electrons to metal ions) displaces metal atoms along the wire, causing voids (opens) at cathode regions and hillocks (shorts) at anode regions over time — reliability failure.\n\nDesign Rules to Prevent EM: Maximum current density limits (J_max in mA/μm) specified per metal layer and temperature. Width sizing rules: wider wires carry more current (W ∝ I_rms). Average current limits for unidirectional DC signals. RMS current limits for bidirectional (clock/data) signals. Via redundancy rules to distribute current across multiple parallel vias.",
  },
  {
    id: "pd-temp-inversion", topic: "pd-signoff", level: "Hard",
    q: "[Apple] Explain Temperature Inversion in advanced nodes. Why do cells become faster at higher temperatures at sub-65nm nodes?",
    a: "Traditional CMOS (older nodes): Higher temperature increases carrier scattering (thermal phonons), reducing mobility and slowing transistors — worst-case timing was always at maximum temperature.\n\nTemperature Inversion (sub-65nm nodes): As Vt (threshold voltage) has been scaled aggressively relative to Vdd, the Vt temperature coefficient dominates over mobility degradation. At high temperatures, Vt decreases significantly, causing Ion to increase. This actually makes cells faster at higher temperatures — inverting the traditional temperature-speed relationship.\n\nImpact on STA: Worst-case setup timing may now occur at cold corners (low temperature, higher Vt, slower cells) rather than hot corners. Multi-corner STA must include cold fast corners, and library characterisation must cover the full temperature range to avoid signoff misses.",
  },
  {
    id: "pd-finfet-layout", topic: "pd-signoff", level: "Medium",
    q: "[TSMC] What are unique FinFET layout constraints versus planar CMOS — fin quantisation, gate pitch, and diffusion breaks?",
    a: "Fin Quantisation: FinFET transistor width is quantised in discrete steps (W = n × Wfin). Unlike planar CMOS where W is continuously sized, FinFET strength can only be adjusted by integer numbers of fins — limiting drive strength granularity to coarse steps.\n\nUniform Gate Pitch: FinFET processes require regular, constant polysilicon gate pitch across the cell to control critical dimension uniformity in EUV lithography. Variable-pitch poly (as in planar CMOS) is not allowed.\n\nDiffusion Breaks (Single/Double): To electrically isolate adjacent transistors in the same cell row, a cut in the fin (diffusion) is required. Single diffusion breaks consume less area but may cause stress-induced mobility variation. Double diffusion breaks provide better isolation but consume more routing track space.",
  },
  {
    id: "pd-mcmm", topic: "pd-signoff", level: "Medium",
    q: "[Qualcomm] What is Multi-Corner Multi-Mode (MCMM) analysis, and what are the typical corners analysed for signoff?",
    a: "MCMM simultaneously analyses the design across multiple operating conditions (Corners) and functional configurations (Modes) to ensure timing closure under all realistic conditions.\n\nTypical Signoff Corners: SS (Slow-Slow, high Vt, low Vdd, hot) for setup; FF (Fast-Fast, low Vt, high Vdd, cold) for hold; TT (Typical) for power estimation; RC corners (min/max metal resistance based on ILD thickness variation) for interconnect delay.\n\nTypical Modes: Functional (scan mode off, all paths active), Test/Scan (scan chains active), Low-Power (clock gating active), High-Performance (all clocks at max frequency).\n\nSignoff requires all modes to pass all timing checks under their corresponding worst-case corners simultaneously — a single failing path in any corner/mode combination blocks tape-out.",
  },
  {
    id: "pd-ocv-aocv-pocv", topic: "sta-timing", level: "Hard",
    q: "[Intel] Differentiate OCV, AOCV, and POCV derating methodologies. Why does POCV provide the best accuracy?",
    a: "OCV (On-Chip Variation): Applies flat, constant derating factors (e.g. early +5%, late -5%) to all cells regardless of their depth in the path. Simple but overly pessimistic — applies maximum derating even to short paths where statistical variation averages out.\n\nAOCV (Advanced OCV): Applies derating factors that reduce with increasing path depth (number of stages). Longer paths experience more statistical averaging, so less derating is applied. More accurate than flat OCV for long paths.\n\nPOCV (Parametric OCV): Uses statistical cell delay distributions (sigma values from Monte Carlo characterisation) and accumulates variation using RSS (Root Sum Squares) rather than worst-case addition. This models the statistical independence of variation sources across multiple cells.\n\nWhy POCV is Most Accurate: Real process variation on different cells in the same path is partially independent — not all cells hit their worst case simultaneously. OCV and AOCV worst-case addition is overly pessimistic. POCV's statistical accumulation matches silicon measurement data and produces signoff margins that are tighter (less pessimistic) while remaining statistically valid.",
  },
  {
    id: "pd-gba-pba", topic: "sta-timing", level: "Medium",
    q: "[Nvidia] What is the difference between Graph-Based Analysis (GBA) and Path-Based Analysis (PBA) in STA?",
    a: "GBA (Graph-Based Analysis): Computes worst-case timing at each node in the timing graph independently by taking the worst-case arrival time from all upstream paths. Fast (single graph traversal) but pessimistic — it assumes all worst-case conditions occur simultaneously on all paths, which is physically impossible.\n\nPBA (Path-Based Analysis): Traces individual endpoint-to-startpoint paths and applies derating/OCV only to the exact cells in that specific path. Eliminates false pessimism where GBA assumes impossible worst-case combinations.\n\nUsage: GBA is used throughout P&R for fast iteration speed. PBA is applied at signoff on endpoints that fail GBA to determine whether the violation is a genuine failure or GBA pessimism — avoiding unnecessary ECO iterations.",
  },
  {
    id: "pd-drc-lvs-erc", topic: "pd-signoff", level: "Easy",
    q: "[Synopsys] Define DRC, LVS, and ERC. What class of errors does each check catch?",
    a: "DRC (Design Rule Check): Verifies that all physical layout geometries (wire widths, spacings, enclosures, densities, via sizes) comply with the foundry's process design rules. Catches: layout-to-process rule violations that would cause shorts, opens, or manufacturability failures.\n\nLVS (Layout vs. Schematic): Extracts the netlist from the physical layout and compares it against the schematic/gate-level netlist. Catches: missing connections, shorts, wrong device types, incorrect device sizing, and extra/missing ports.\n\nERC (Electrical Rule Check): Verifies electrical correctness — floating gates, missing well/substrate connections, forward-biased junctions, floating outputs. Catches: electrically unsafe configurations that DRC and LVS do not cover because they are geometrically and connectivity-correct but electrically dangerous.",
  },
  {
    id: "pd-lvs-debug", topic: "pd-signoff", level: "Medium",
    q: "[Qualcomm] How do you debug an LVS short between Power and Ground? Describe the isolation methodology.",
    a: "LVS VDD-VSS Short Isolation Methodology:\n1. Identify the short net in the LVS error report — tool reports it as a merged net (VDD and VSS treated as one).\n2. Bisect the design: Divide the layout into halves. Run LVS on each half independently to determine which half contains the short.\n3. Recurse into the failing half, repeatedly bisecting until the short is localised to a single cell or routing segment.\n4. Inspect the identified location in the layout viewer: look for minimum-spacing violations between M1 VDD rails and VSS rails, incorrect fill shapes bridging power rails, or a cell's internal diffusion short.\n5. Verify the fix: Re-run LVS on the full design after correcting the short to confirm the merged net is resolved.",
  },
  {
    id: "pd-metal-fill", topic: "pd-signoff", level: "Easy",
    q: "[TSMC] What is Metal Fill insertion and why is it required? What are the density DRC checks it must satisfy?",
    a: "Metal Fill: Dummy metal polygons inserted in regions of low metal density after routing is complete, to ensure the layout meets foundry minimum and maximum metal density design rules.\n\nWhy Required: CMP (Chemical Mechanical Planarisation) processes used to flatten metal layers are sensitive to local pattern density. Regions that are too sparse experience excessive oxide dishing (the surface sinks due to uneven polishing), while overly dense regions suffer from metal erosion. Both distortions alter final wire resistance and capacitance beyond model accuracy.\n\nDensity DRC Checks: Minimum metal density per layer per unit window (e.g. minimum 20% M1 coverage in any 50×50μm window) and maximum metal density limits (e.g. max 80%) that floating fill shapes must satisfy in all density check windows.",
  },
  {
    id: "pd-eco-types", topic: "sta-timing", level: "Medium",
    q: "[Intel] Differentiate between a Functional ECO and a Timing ECO. How is a metal-only ECO used for post-mask silicon fix?",
    a: "Functional ECO: Changes the logical function of the design — adds/removes/modifies gates to fix a design bug discovered in simulation or silicon debug. Requires re-synthesis, re-placement, and complete re-routing of affected logic.\n\nTiming ECO: Modifies the physical implementation without changing logical function — buffer insertions, cell upsizing, VT swaps, wire spreading — to close a setup or hold timing violation.\n\nMetal-Only ECO: A post-mask fix that modifies only upper metal layers (Metal 3 and above) without changing base-layer masks (poly, diffusion, contacts, M1). Used when lower-layer masks are already committed (tapeout done). Achieves functional changes by rewiring existing cells in pre-inserted spare cell islands — the base layers are reused as-is, only the upper metal connectivity changes. This saves the cost of re-fabricating expensive base-layer masks.",
  },
  {
    id: "pd-lec", topic: "sta-timing", level: "Easy",
    q: "[Cadence] What does Logical Equivalence Checking (LEC) verify, and at what stages of the PD flow is it run?",
    a: "LEC (Logical Equivalence Checking) is a formal verification method that proves the logical function of two netlists (or gate-level vs. RTL) is identical — without simulation vectors. It uses Boolean satisfiability and BDD techniques to exhaustively compare all input-output relationships.\n\nKey Stages:\n1. Post-Synthesis: Verify gate-level netlist is logically equivalent to the RTL source.\n2. Post-ECO: Verify that the ECO-modified netlist is still equivalent to the pre-ECO reference after any timing or functional fix.\n3. Post-Scan Insertion: Verify the DFT-modified netlist (with scan chains) is functionally equivalent in functional mode.\n4. Pre-Signoff: Final confirmation that the tapeout netlist matches the verified RTL.",
  },
  {
    id: "pd-upf-terms", topic: "pd-signoff", level: "Medium",
    q: "[Qualcomm] Define the UPF terms: Power Domain, Supply Net, Isolation Cell, Level Shifter, and Retention Register.",
    a: "Power Domain: A logical grouping of design elements that share the same power supply and can be independently powered on or off.\n\nSupply Net: An abstract net in UPF that models a physical power supply connection (VDD, VSS, or a level-shifted supply) — separate from the signal netlist.\n\nIsolation Cell: A special cell inserted at the boundary between a power domain that can be shut down and an always-on domain. When the source domain is powered off, the isolation cell clamps its output to a safe known logic value (0 or 1), preventing X-propagation into always-on logic.\n\nLevel Shifter: A cell inserted at cross-domain signal boundaries where the source and destination domains operate at different supply voltages, translating the signal voltage level to ensure correct logic thresholds at the receiving domain.\n\nRetention Register: A flip-flop with an always-on shadow latch. Before the primary supply is cut, the state is saved to the shadow latch; when power is restored, the state is restored — preserving context across power-off events.",
  },
  {
    id: "pd-level-shifters", topic: "pd-signoff", level: "Medium",
    q: "[Apple] When are High-to-Low vs. Low-to-High level shifters required? What happens if a level shifter is missing?",
    a: "High-to-Low Shifter (Step-Down): Required when a signal originates from a domain at higher VDD and drives logic in a domain at lower VDD. Without it, the high-voltage output may be interpreted as a voltage above the lower domain VDD, potentially causing oxide stress or always-on logic levels at the receiver.\n\nLow-to-High Shifter (Step-Up): Required when a signal originates from a lower-voltage domain and drives higher-voltage domain logic. Without it, the signal swing may not reach the logic threshold of the higher-VDD receiver, causing indeterminate (X) logic levels and functional failure.\n\nMissing Level Shifter Consequence: Without a shifter, the cross-domain interface may pass incorrect logic levels (below Vil or above Vih), cause latch-up in the receiving domain, or create static current paths between the two different supply domains — all causing functional or reliability failures.",
  },
  {
    id: "pd-isolation-cells", topic: "pd-signoff", level: "Medium",
    q: "[Nvidia] Why must isolation cells be placed in the always-on domain rather than the shutoff domain?",
    a: "Isolation cells must be powered from the always-on supply domain because they operate precisely during and after the source domain's power-down event.\n\nIf isolation cells were placed in the shutoff domain, they would lose power at the same time as the logic they are supposed to clamp — the isolation function would disappear exactly when it is needed, allowing floating/X values to propagate from the powerless shutoff domain into the always-on receiver logic. This would cause functional failures, metastability, or latch-up in the downstream logic.\n\nBy placement in the always-on domain, the isolation cell remains active with its clamped output driving the receiver safely (to '0' or '1') throughout the entire period when the source domain is shut off.",
  },
  {
    id: "pd-congestion-map", topic: "pd-signoff", level: "Easy",
    q: "[AMD] How do you read a Congestion Map from an EDA tool and what does it tell you about your floorplan quality?",
    a: "A Congestion Map visualises the routing demand vs. routing supply ratio across the core area as a colour heat map — green areas have available routing tracks (demand < supply); yellow/orange areas are near capacity; red areas have routing demand exceeding available track supply (overflow = 0 routes at those locations).\n\nFloorplan Quality Indicators: Red hotspots near macro boundaries indicate the macro is blocking horizontal or vertical routing channels — repositioning or reorienting the macro would help. Widespread congestion in the core center suggests utilization is too high. Congestion aligned with clock tree buffers indicates CTS is consuming too many routing resources. The number of global routing overflows (GRC violations) is the primary numeric metric: target is 0 overflows at global routing stage before detailed routing begins.",
  },
  {
    id: "pd-max-tran-fix", topic: "pd-signoff", level: "Easy",
    q: "[Synopsys] What causes maximum transition violations, and how are they fixed during P&R?",
    a: "Maximum Transition Violation: The signal transition time (slew) at a cell output exceeds the library-specified maximum transition limit. Slow transitions cause: increased short-circuit current (both PMOS and NMOS partially on simultaneously), erratic delay values outside the characterised NLDM table range, and downstream cells receiving slow input transitions that degrade their own output delays.\n\nCauses: Excessive net capacitance from a high fanout or long wire; weak driver cell unable to charge the load quickly.\n\nFixes: Driver upsizing — replace with a higher drive-strength cell of the same function. Net splitting via buffer insertion — place a buffer midway on the long net, reducing the capacitance driven by the original driver. Fanout reduction — split a high-fanout net into two trees each driven by separate buffer instances.",
  },
  {
    id: "pd-placement-constraints", topic: "pd-signoff", level: "Easy",
    q: "[Qualcomm] Explain Region Constraints and Fence Constraints. How do they differ in controlling cell placement?",
    a: "Region Constraint (Soft): Specifies a preferred placement area for a group of cells (module or cluster). The P&R tool places cells inside the region when possible, but may spill outside the boundary if necessary to resolve congestion, timing, or legality issues.\n\nFence Constraint (Hard): Creates a strict, inviolable boundary. Cells assigned to the fence MUST be placed inside; cells not assigned to the fence CANNOT be placed inside. Provides full placement isolation for sub-blocks (e.g., a synchroniser, a critical timing path, or an IP block that must be physically isolated from surrounding logic).\n\nDifference: Region = strong suggestion with overflow allowed. Fence = absolute hard boundary with no overflow permitted in either direction.",
  },
  {
    id: "pd-latch-timeborrow", topic: "sta-timing", level: "Hard",
    q: "[Intel] Explain Time Borrowing in latch-based design. How does it differ from flip-flop timing analysis?",
    a: "Time Borrowing (Latch-Based): A latch is transparent for the entire half-cycle it is enabled (not just at a single clock edge like a flip-flop). If data arrives late from a previous stage (borrowing time from the current cycle), it can still pass through the latch while it remains transparent — provided it arrives before the latch closes.\n\nQuantitative Benefit: A latch-based pipeline stage can borrow up to T_clk/2 of extra time from the next pipeline stage, smoothing out timing imbalances across stages without requiring retiming or buffer insertion.\n\nDifference from Flip-Flop: A flip-flop samples data only at a single rising edge — there is no borrowing window. Setup time must be met relative to that one edge. Latches amortise timing slack across two adjacent pipeline stages, enabling designs with unbalanced paths (e.g., high-performance arithmetic units) that would violate flip-flop setup without retiming.",
  },
  {
    id: "pd-dmsa", topic: "pd-signoff", level: "Medium",
    q: "[Nvidia] What is Distributed Multi-Scenario Analysis (DMSA) in Synopsys ICC2/Fusion Compiler?",
    a: "DMSA distributes the MCMM (Multi-Corner Multi-Mode) timing analysis workload across multiple CPU cores or compute machines simultaneously, running each corner/mode scenario in parallel rather than sequentially.\n\nBenefit: Reduces total wall-clock time for full MCMM timing closure from hours (sequential) to minutes (parallel) on large server clusters. Each worker process handles one scenario independently, then reports violations back to the master optimisation engine.\n\nUsage: Critical for designs with >10 timing scenarios (common in mobile SoCs: functional, test, low-power, memory access, and multiple PVT corners). Without DMSA, full signoff MCMM runs that previously took 8–12 hours can be completed in under 2 hours.",
  },
  {
    id: "pd-etm-ilm", topic: "sta-timing", level: "Medium",
    q: "[Qualcomm] Compare Extracted Timing Model (ETM) vs. Interface Logic Model (ILM) for hierarchical STA.",
    a: "ETM (Extracted Timing Model): A black-box model of a completed block that retains only the input-to-output and input-to-register timing arcs visible at the boundary. Internal paths and internal state are abstracted away. Smaller file size, suitable for top-level STA when the block is treated as a fully closed sub-design.\n\nILM (Interface Logic Model): A partial model that retains the boundary logic (first/last stage registers and combinational paths) visible to the top level but removes the internal logic. Allows the top-level STA engine to optimise paths that cross the block boundary — including driving the boundary registers and fanout from the boundary outputs.\n\nKey Difference: ETM is fully black-box — no top-level optimisation can penetrate the block. ILM exposes boundary logic for cross-boundary timing closure, enabling buffer insertion and sizing at the block I/O interface from the top-level flow.",
  },
  {
    id: "pd-metal-stack", topic: "pd-signoff", level: "Easy",
    q: "[Samsung] What drives the choice of metal layer for routing — signal, clock, power, and global routing layers?",
    a: "Lower Metals (M1–M2): Highest resistivity per unit width due to narrow minimum width rules. Used for local cell-to-cell signal connections and standard cell internal routing. Short wires only.\n\nMid-Level Metals (M3–M5): Moderate resistivity. Used for block-level signal routing, intermediate clock distribution, and local power distribution.\n\nUpper Metals (M6–Mx): Lowest resistivity (wider minimum widths allowed, thicker dielectrics, lower sheet resistance). Used for long global signal nets, clock trunk routing, and power grid stripes where low resistance is critical.\n\nPower/Ground: Allocated to the widest, thickest top metals to minimise IR drop across the full die. Clock trunk routes use upper metals with NDR double-width rules. Signal routes are stacked from M2 upward based on congestion and timing criticality.",
  },
  {
    id: "pd-unconstrained-ep", topic: "pd-signoff", level: "Easy",
    q: "[Intel] What is an Unconstrained Endpoint? Why should unconstrained endpoints be resolved before signoff?",
    a: "An Unconstrained Endpoint is a flip-flop clock pin, data pin, or output port that has no timing constraint applied — no `set_input_delay`, no `set_output_delay`, no `create_clock`, or belongs to a path declared `set_false_path` or `set_multicycle_path` unintentionally.\n\nWhy Resolve: Unconstrained endpoints are not optimised or checked during P&R timing closure. They may silently contain large setup or hold violations that only manifest on real silicon. At signoff, unconstrained endpoints appear as 'MET' (not-analysed) in STA reports, giving false confidence that the design is timing-clean. Industry standard: zero unconstrained logic endpoints allowed at tapeout.",
  },
  {
    id: "pd-esd-protection", topic: "pd-signoff", level: "Easy",
    q: "[Qualcomm] What are ESD protection structures, and where are they placed in the chip I/O ring?",
    a: "ESD (Electrostatic Discharge) protection structures clamp parasitic voltage spikes (up to several kV from human body model or machine model ESD events) that appear on I/O pads, preventing the spike from reaching the fragile core logic.\n\nCommon Structures: Dual-diode clamps (one diode to VDD, one to VSS per I/O pad), large NMOS snapback transistors, SCR (silicon-controlled rectifier) clamp cells, and power clamp cells across VDD-VSS.\n\nPlacement: In the I/O ring between the pad metal and the core-facing ESD bus (VDD-VSS rail running around the periphery dedicated to ESD discharge). Every I/O pad receives local diode clamps. Power clamp cells are distributed around the I/O ring at intervals to ensure ESD current discharged at one pad can flow around the ring to reach the nearest power clamp without exceeding safe current density in the ESD bus.",
  },
  {
    id: "pd-num-setup-slack", topic: "sta-timing", level: "Numerical",
    q: "[Synopsys] A Reg-to-Reg path has: launch clock latency = 0.8 ns, Clk-to-Q = 0.4 ns, combinational delay = 3.1 ns, capture clock latency = 0.6 ns, T_clk = 5 ns, T_setup = 0.3 ns. Calculate the Setup Slack.",
    a: "Given: T_launch_lat = 0.8 ns, T_clk→q = 0.4 ns, T_combo = 3.1 ns, T_capt_lat = 0.6 ns, T_clk = 5 ns, T_setup = 0.3 ns.\n§F: T_arrival = T_launch_lat + T_clk→q + T_combo\n§C: = 0.8 + 0.4 + 3.1 = 4.3 ns\n§F: T_required = T_clk + T_capt_lat − T_setup\n§C: = 5.0 + 0.6 − 0.3 = 5.3 ns\n§F: Setup Slack = T_required − T_arrival\n§C: = 5.3 − 4.3 = +1.0 ns\n§R: Setup Slack = +1.0 ns ✓ (Timing Met)",
  },
  {
    id: "pd-num-hold-slack", topic: "sta-timing", level: "Numerical",
    q: "[Intel] Same path as Q51. Minimum Clk-to-Q = 0.2 ns, minimum combo delay = 0.1 ns, T_hold = 0.15 ns. Calculate the Hold Slack.",
    a: "Given: T_launch_lat = 0.8 ns, T_clk→q_min = 0.2 ns, T_combo_min = 0.1 ns, T_capt_lat = 0.6 ns, T_hold = 0.15 ns.\n§F: T_arrival_min = T_launch_lat + T_clk→q_min + T_combo_min\n§C: = 0.8 + 0.2 + 0.1 = 1.1 ns\n§F: T_hold_req = T_capt_lat + T_hold\n§C: = 0.6 + 0.15 = 0.75 ns\n§F: Hold Slack = T_arrival_min − T_hold_req\n§C: = 1.1 − 0.75 = +0.35 ns\n§R: Hold Slack = +0.35 ns ✓ (Hold Met)",
  },
  {
    id: "pd-num-fmax", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] A critical path has T_clk→q = 0.5 ns, combinational delay = 4.2 ns, T_setup = 0.3 ns, clock skew = 0.1 ns. Find F_max.",
    a: "Given: T_clk→q = 0.5 ns, T_combo = 4.2 ns, T_setup = 0.3 ns, skew = 0.1 ns (capture later than launch — beneficial).\n§F: T_clk_min = T_clk→q + T_combo + T_setup − skew\n§C: = 0.5 + 4.2 + 0.3 − 0.1 = 4.9 ns\n§F: F_max = 1 / T_clk_min\n§C: = 1 / 4.9 ns = 204.1 MHz\n§R: F_max ≈ 204 MHz",
  },
  {
    id: "pd-num-setup-hold-check", topic: "sta-timing", level: "Numerical",
    q: "[Apple] T_clk = 4 ns. Launch latency = 1.2 ns, capture latency = 1.5 ns. T_clk→q = 0.35 ns, combo = 2.8 ns, T_setup = 0.25 ns, T_hold = 0.1 ns, T_combo_min = 0.05 ns. Check both setup and hold.",
    a: "Setup Check:\n§F: T_arrival = 1.2 + 0.35 + 2.8 = 4.35 ns\n§F: T_required = 4.0 + 1.5 − 0.25 = 5.25 ns\n§F: Setup Slack = 5.25 − 4.35 = +0.90 ns\n§R: Setup MET ✓\nHold Check:\n§F: T_arrival_min = 1.2 + 0.35 + 0.05 = 1.60 ns\n§F: T_hold_req = 1.5 + 0.1 = 1.60 ns\n§F: Hold Slack = 1.60 − 1.60 = 0.00 ns\n§R: Hold Borderline — marginal, may require buffer insertion",
  },
  {
    id: "pd-num-hold-fix-delay", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] A hold violation exists: T_arrival_min = 0.9 ns, T_hold_req = 1.1 ns. What minimum buffer delay is needed to fix hold?",
    a: "Given: T_arrival_min = 0.9 ns, T_hold_req = 1.1 ns.\n§F: Hold Slack = T_arrival_min − T_hold_req\n§C: = 0.9 − 1.1 = −0.2 ns (violation)\n§F: Required buffer delay = |Hold Slack| + margin\n§C: = 0.2 + 0.05 (margin) = 0.25 ns\n§R: Insert a buffer with delay ≥ 0.25 ns on the launch data path to fix hold violation",
  },
  {
    id: "pd-num-skew-id", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] Clock arrives at FF_A at 1.85 ns and at FF_B at 1.20 ns. What is the clock skew? How does it affect setup timing for the path FF_A → FF_B?",
    a: "Given: T_clk_A = 1.85 ns (launch), T_clk_B = 1.20 ns (capture).\n§F: Skew = T_clk_capture − T_clk_launch = T_clk_B − T_clk_A\n§C: = 1.20 − 1.85 = −0.65 ns\nNegative skew means capture clock arrives BEFORE launch — hurts setup (less time for data).\n§F: Setup check: T_required = T_clk + T_capt_lat − T_setup = T_clk + 1.20 − T_setup\n§F: Effective setup window reduced by |skew| = 0.65 ns\n§R: Skew = −0.65 ns — detrimental to setup; 0.65 ns of setup margin is lost",
  },
  {
    id: "pd-num-ocv-skew", topic: "sta-timing", level: "Numerical",
    q: "[Intel] CTS targets 50 ps skew. OCV derating adds ±3% to clock path delays. Launch latency = 1.5 ns, capture latency = 1.5 ns. What is the total effective skew with OCV?",
    a: "Given: T_lat = 1.5 ns, OCV = ±3%, target skew = 50 ps.\n§F: OCV variation on launch = 1.5 ns × 3% = 0.045 ns = 45 ps\n§F: OCV variation on capture = 1.5 ns × 3% = 45 ps\n§F: Worst-case effective skew = Base skew + OCV_launch + OCV_capture\n§C: = 50 + 45 + 45 = 140 ps = 0.14 ns\n§R: Total effective clock uncertainty for STA = 140 ps",
  },
  {
    id: "pd-num-aocv-skew", topic: "sta-timing", level: "Numerical",
    q: "[AMD] A 5-stage clock path has AOCV derating 2% per stage. Each stage delay = 0.3 ns. Calculate worst-case late arrival with AOCV vs flat OCV at 10%.",
    a: "Given: 5 stages, each 0.3 ns, AOCV = 2%/stage, flat OCV = 10%.\nFlat OCV (pessimistic):\n§F: Total delay_OCV = 5 × 0.3 × (1 + 10%) = 1.5 × 1.10 = 1.65 ns\nAOCV (stage-accumulating):\n§F: AOCV derating per stage = 2% × √stage_depth (approximation)\n§C: Effective total AOCV ≈ 1.5 × (1 + 2%×√5) = 1.5 × (1 + 4.47%) = 1.567 ns\n§R: AOCV = 1.567 ns vs OCV = 1.650 ns — AOCV saves 83 ps of pessimism per path",
  },
  {
    id: "pd-num-max-combo-delay", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] T_clk = 2.5 ns, T_setup = 0.1 ns, T_clk→q = 0.3 ns. Launch latency = 0.9 ns, capture latency = 0.7 ns. What is the maximum allowable combinational delay?",
    a: "Given: T_clk = 2.5 ns, T_setup = 0.1 ns, T_clk→q = 0.3 ns, T_launch = 0.9 ns, T_capt = 0.7 ns.\n§F: T_required = T_clk + T_capt − T_setup = 2.5 + 0.7 − 0.1 = 3.1 ns\n§F: T_arrival = T_launch + T_clk→q + T_combo_max = 3.1 ns\n§F: T_combo_max = T_required − T_launch − T_clk→q\n§C: = 3.1 − 0.9 − 0.3 = 1.9 ns\n§R: Maximum allowable combinational delay = 1.9 ns",
  },
  {
    id: "pd-num-duty-jitter", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] A 500 MHz clock has period jitter of ±50 ps and duty-cycle distortion of 5%. What is the effective valid setup window for capture?",
    a: "Given: F = 500 MHz → T_clk = 2 ns, jitter = ±50 ps, DCD = 5%.\n§F: DCD impact on high-time = T_clk × 5% = 2 ns × 0.05 = 0.1 ns\n§F: Effective half-period = (T_clk / 2) − DCD_impact = 1.0 − 0.1 = 0.9 ns\n§F: Total clock uncertainty = jitter + DCD = 50 ps + 100 ps = 150 ps\n§F: Effective setup window = T_clk − clock_uncertainty\n§C: = 2.0 − 0.15 = 1.85 ns\n§R: Effective setup window = 1.85 ns (150 ps consumed by jitter + DCD)",
  },
  {
    id: "pd-num-half-cycle-max", topic: "sta-timing", level: "Numerical",
    q: "[Intel] A half-cycle path launches on rising edge, captures on falling edge. T_clk = 4 ns. T_clk→q = 0.3 ns, T_setup = 0.2 ns. What is the maximum combo delay?",
    a: "Given: T_clk = 4 ns, half cycle = 2 ns, T_clk→q = 0.3 ns, T_setup = 0.2 ns.\n§F: Available time = T_clk/2 = 4/2 = 2.0 ns\n§F: T_combo_max = T_clk/2 − T_clk→q − T_setup\n§C: = 2.0 − 0.3 − 0.2 = 1.5 ns\n§R: Maximum combinational delay for half-cycle path = 1.5 ns",
  },
  {
    id: "pd-num-half-cycle-hold", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] Same half-cycle path. T_clk→q_min = 0.15 ns, T_combo_min = 0.05 ns, T_hold = 0.1 ns. Check hold.",
    a: "Half-cycle hold check: capture is one half-cycle (2 ns) later than launch.\nGiven: T_clk→q_min = 0.15 ns, T_combo_min = 0.05 ns, T_hold = 0.1 ns.\n§F: T_arrival_min = T_launch_lat + T_clk→q_min + T_combo_min\n§F: T_hold_req = T_capt_lat + T_hold (capture is T_clk/2 = 2 ns later in clock domain)\nAssuming equal latencies and capture half-cycle offset:\n§F: Hold Slack = T_arrival_min − (T_capt_lat + T_hold)\n§C: With T_capt_lat = T_launch_lat, hold slack = T_clk→q_min + T_combo_min − T_hold\n§C: = 0.15 + 0.05 − 0.10 = +0.10 ns\n§R: Hold Slack = +0.10 ns ✓",
  },
  {
    id: "pd-num-mc-arrival", topic: "sta-timing", level: "Numerical",
    q: "[Apple] A 3-cycle multicycle path: T_clk = 3 ns, T_clk→q = 0.4 ns, T_combo = 7.2 ns, T_setup = 0.3 ns, equal launch/capture latency = 1.0 ns. Calculate setup slack.",
    a: "Given: MCP = 3 cycles, T_clk = 3 ns, T_clk→q = 0.4 ns, T_combo = 7.2 ns, T_setup = 0.3 ns, T_lat = 1.0 ns.\n§F: T_arrival = T_launch_lat + T_clk→q + T_combo\n§C: = 1.0 + 0.4 + 7.2 = 8.6 ns\n§F: T_required = (MCP × T_clk) + T_capt_lat − T_setup\n§C: = (3 × 3.0) + 1.0 − 0.3 = 9.0 + 1.0 − 0.3 = 9.7 ns\n§F: Setup Slack = T_required − T_arrival\n§C: = 9.7 − 8.6 = +1.1 ns\n§R: Setup Slack = +1.1 ns ✓",
  },
  {
    id: "pd-num-mc-hold-edge", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] For the same 3-cycle MCP above, the hold check uses what capture edge? With T_combo_min = 0.5 ns and T_hold = 0.1 ns, calculate hold slack.",
    a: "For a multicycle setup path of N cycles, the hold check moves the capture edge back by (N−1) cycles, so the hold check uses the capture edge at cycle 1 (default), but with `set_multicycle_path -hold (N-1)` the hold check edge moves to the same cycle as launch.\nGiven: T_clk→q_min = 0.4 ns (min), T_combo_min = 0.5 ns, T_hold = 0.1 ns, T_lat = 1.0 ns.\n§F: T_arrival_min = 1.0 + 0.4 + 0.5 = 1.9 ns\n§F: Hold check edge at cycle 0 (same rising edge): T_hold_req = 1.0 + 0.1 = 1.1 ns\n§F: Hold Slack = 1.9 − 1.1 = +0.8 ns\n§R: Hold Slack = +0.8 ns ✓ (with correct `set_multicycle_path -hold 2`)",
  },
  {
    id: "pd-num-mc-hold-sdc", topic: "sta-timing", level: "Numerical",
    q: "[Intel] Write the complete SDC for a 3-cycle multicycle setup path from reg_a/Q to reg_b/D on CLK, and verify the hold edge is correctly repositioned.",
    a: "SDC Commands:\n§F: set_multicycle_path 3 -setup -from [get_cells reg_a] -to [get_cells reg_b] -end\n§F: set_multicycle_path 2 -hold  -from [get_cells reg_a] -to [get_cells reg_b] -end\nExplanation: `-setup 3` moves the setup check to the 3rd capture edge (3T from launch). `-hold 2` moves the hold check to the 2nd capture edge, which aligns hold checking with the correct launch-capture relationship — without this, the tool checks hold at the nearest edge (T=0), causing false hold violations on all combinational delays > T_hold.\n§R: Both SDC lines required; omitting the hold line causes false hold violations",
  },
  {
    id: "pd-num-core-area", topic: "sta-timing", level: "Numerical",
    q: "[Apple] Total standard cell area = 2.5 mm². Macro area = 1.2 mm². Target core utilisation = 75%. Calculate required core area.",
    a: "Given: Cell area = 2.5 mm², Macro area = 1.2 mm², Utilisation = 75%.\n§F: Total placed area = Cell area + Macro area = 2.5 + 1.2 = 3.7 mm²\n§F: Core area = Total placed area / Utilisation\n§C: = 3.7 / 0.75 = 4.933 mm²\n§R: Required core area ≈ 4.93 mm² (round up to nearest standard floorplan grid)",
  },
  {
    id: "pd-num-core-dimensions", topic: "pd-signoff", level: "Numerical",
    q: "[Qualcomm] Using the core area from Q66, if aspect ratio = 1.2 (H/W), find the core width and height.",
    a: "Given: Core area = 4.933 mm², Aspect Ratio = H/W = 1.2.\n§F: Area = W × H = W × 1.2W = 1.2W²\n§F: W² = Area / 1.2 = 4.933 / 1.2 = 4.111 mm²\n§F: W = √4.111 ≈ 2.028 mm\n§F: H = 1.2 × W = 1.2 × 2.028 ≈ 2.433 mm\n§R: Core Width ≈ 2.03 mm, Core Height ≈ 2.43 mm",
  },
  {
    id: "pd-num-die-core-util", topic: "pd-signoff", level: "Numerical",
    q: "[Nvidia] Die area = 8 mm². I/O ring area = 2 mm². Placed cell area = 4.2 mm². Calculate (a) core area and (b) core utilisation.",
    a: "Given: Die area = 8 mm², I/O ring = 2 mm², Placed cell area = 4.2 mm².\n§F: (a) Core area = Die area − I/O ring area = 8 − 2 = 6 mm²\n§F: (b) Core utilisation = Placed cell area / Core area\n§C: = 4.2 / 6.0 = 0.70 = 70%\n§R: Core area = 6 mm², Core utilisation = 70%",
  },
  {
    id: "pd-num-cell-rows", topic: "sta-timing", level: "Numerical",
    q: "[Intel] Core height = 2.4 mm. Standard cell height = 0.8 μm. Calculate the number of standard cell rows.",
    a: "Given: Core height = 2.4 mm = 2400 μm, Cell height = 0.8 μm.\n§F: Number of rows = Core height / Cell height\n§C: = 2400 / 0.8 = 3000 rows\n§R: 3000 standard cell rows",
  },
  {
    id: "pd-num-keepout-area", topic: "sta-timing", level: "Numerical",
    q: "[Samsung] A macro is 500 μm × 400 μm. A 10 μm halo (keepout margin) is applied on all sides. What total area is unavailable for standard cell placement?",
    a: "Given: Macro W = 500 μm, Macro H = 400 μm, Halo = 10 μm.\n§F: Area with halo = (500 + 2×10) × (400 + 2×10)\n§C: = 520 × 420 = 218,400 μm²\n§F: Macro area alone = 500 × 400 = 200,000 μm²\n§F: Keepout zone area = 218,400 − 200,000 = 18,400 μm²\n§F: Total unavailable area = Macro + Keepout = 218,400 μm² = 0.2184 mm²\n§R: Total area unavailable for placement = 0.218 mm²",
  },
  {
    id: "pd-num-total-power", topic: "sta-timing", level: "Numerical",
    q: "[Broadcom] A chip operates at V_DD = 0.8 V, F = 2 GHz. Total dynamic capacitance switching per cycle = 5 nF. Static leakage current I_leak = 250 mA. Calculate total power (Dynamic + Static).",
    a: "Given: V = 0.8 V, F = 2 GHz = 2×10⁹ Hz, C = 5 nF = 5×10⁻⁹ F, I_leak = 250 mA.\n§F: P_dynamic = C × V² × F\n§C: = 5×10⁻⁹ × (0.8)² × 2×10⁹ = 5 × 0.64 × 2 = 6.4 W\n§F: P_static = V × I_leak\n§C: = 0.8 × 0.250 = 0.2 W\n§F: P_total = P_dynamic + P_static = 6.4 + 0.2 = 6.6 W\n§R: Total Power = 6.6 W",
  },
  {
    id: "pd-num-dvdd-reduction", topic: "pd-signoff", level: "Numerical",
    q: "[Qualcomm] V_DD is reduced by 10% (from 0.8 V to 0.72 V). Calculate the percentage reduction in dynamic power.",
    a: "Given: V1 = 0.8 V, V2 = 0.72 V, P_dynamic ∝ V².\n§F: P_dynamic1 ∝ V1² = (0.8)² = 0.64\n§F: P_dynamic2 ∝ V2² = (0.72)² = 0.5184\n§F: Reduction = (P1 − P2) / P1 × 100%\n§C: = (0.64 − 0.5184) / 0.64 × 100% = 0.1216 / 0.64 × 100% = 19%\n§R: Dynamic power reduces by 19%",
  },
  {
    id: "pd-num-stripe-ir", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] A VDD power stripe of length 1 mm, width 2 μm has metal sheet resistance R_s = 0.05 Ω/sq. A uniform 20 mA current flows. Calculate the Static IR drop.",
    a: "Given: L = 1 mm = 1000 μm, W = 2 μm, R_s = 0.05 Ω/sq, I = 20 mA.\n§F: Number of squares = L / W = 1000 / 2 = 500 squares\n§F: R_stripe = R_s × squares = 0.05 × 500 = 25 Ω\n§F: IR Drop = I × R = 0.020 × 25 = 0.5 V\nNote: 0.5 V is extreme — real design uses many parallel stripes. This illustrates that wider/shorter stripes are critical.\n§R: IR Drop = 0.5 V (need more parallel stripes or wider width)",
  },
  {
    id: "pd-num-decap-sizing", topic: "pd-signoff", level: "Numerical",
    q: "[Apple] A dynamic current spike ΔI = 100 mA occurs for Δt = 200 ps. Maximum allowable voltage drop ΔV = 40 mV. What minimum Decap capacitance is required?",
    a: "Given: ΔI = 100 mA = 0.1 A, Δt = 200 ps = 200×10⁻¹² s, ΔV = 40 mV = 0.04 V.\n§F: Decap model: ΔV = ΔI × Δt / C_decap\n§F: C_decap = ΔI × Δt / ΔV\n§C: = 0.1 × 200×10⁻¹² / 0.04 = 20×10⁻¹² / 0.04 = 500 pF\n§R: Minimum Decap capacitance required = 500 pF",
  },
  {
    id: "pd-num-transient-ir", topic: "sta-timing", level: "Numerical",
    q: "[Intel] A power grid has equivalent resistance R_eq = 0.15 Ω from power pad to logic cluster. The cluster draws a transient current of 2 A. Find instantaneous IR drop.",
    a: "Given: R_eq = 0.15 Ω, I_transient = 2 A.\n§F: ΔV_IR = I × R_eq\n§C: = 2 × 0.15 = 0.30 V\n§R: Instantaneous IR drop = 300 mV\nNote: 300 mV is excessive for a 0.8 V supply (37.5% drop). Requires reducing R_eq via more/wider stripes or inserting local Decap.",
  },
  {
    id: "pd-num-rc-lumped", topic: "sta-timing", level: "Numerical",
    q: "[Synopsys] A wire of length L = 500 μm has resistance per unit length r = 0.2 Ω/μm and capacitance per unit length c = 0.15 fF/μm. Calculate the total RC wire delay using the lumped π-model (τ = R_total × C_total / 2).",
    a: "Given: L = 500 μm, r = 0.2 Ω/μm, c = 0.15 fF/μm.\n§F: R_total = r × L = 0.2 × 500 = 100 Ω\n§F: C_total = c × L = 0.15 fF × 500 = 75 fF = 75×10⁻¹⁵ F\n§F: τ = R_total × C_total / 2 (lumped π-model)\n§C: = 100 × 75×10⁻¹⁵ / 2 = 7500×10⁻¹⁵ / 2 = 3.75 ps\n§R: RC wire delay (50% point) ≈ 3.75 ps",
  },
  {
    id: "pd-num-elmore-delay", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] An Elmore delay tree: driver resistance Rd = 100 Ω, main trunk splits into Branch 1 (R1 = 50 Ω, C1 = 20 fF) and Branch 2 (R2 = 80 Ω, C2 = 30 fF). Wire capacitance before split C0 = 10 fF. Calculate Elmore delay to the endpoint of Branch 2.",
    a: "Given: Rd = 100 Ω, C0 = 10 fF, R1 = 50 Ω, C1 = 20 fF, R2 = 80 Ω, C2 = 30 fF.\nElmore delay to endpoint of Branch 2 = sum of (resistance on path) × (all downstream capacitance).\n§F: τ_B2 = Rd × (C0 + C1 + C2) + R2 × C2\n§C: = 100 × (10 + 20 + 30)×10⁻¹⁵ + 80 × 30×10⁻¹⁵\n§C: = 100 × 60×10⁻¹⁵ + 2400×10⁻¹⁵\n§C: = 6000×10⁻¹⁵ + 2400×10⁻¹⁵ = 8400×10⁻¹⁵ s\n§R: Elmore delay to Branch 2 endpoint = 8.4 ps",
  },
  {
    id: "pd-num-repeater-scaling", topic: "pd-signoff", level: "Numerical",
    q: "[Apple] A wire of length is doubled (2×). By what factor does RC propagation delay increase? If a repeater (buffer) is inserted at the exact midpoint, by what factor does total wire delay change relative to the unbuffered double-length wire?",
    a: "RC delay ∝ L² (quadratic with wire length).\n§F: Original wire delay ∝ L²\n§F: Doubled wire delay ∝ (2L)² = 4L²\nDelay increase factor without repeater:\n§R: Delay increases by 4× when wire length doubles\nWith repeater at midpoint (two segments of length L):\n§F: Each segment delay ∝ L²\n§F: Total = 2 × L² (two half-length wires)\n§F: Delay reduction vs 4L²: factor = 2L² / 4L² = 0.5\n§R: Repeater at midpoint reduces total delay to 50% of unbuffered double-length wire (2× improvement)",
  },
  {
    id: "pd-num-metal-resistance", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] Metal 2 layer has R_s = 0.08 Ω/sq, width = 0.1 μm. Metal 7 has R_s = 0.01 Ω/sq, width = 0.5 μm. Calculate the resistance of a 1000 μm long trace on Metal 2 versus Metal 7.",
    a: "Given: M2: R_s = 0.08 Ω/sq, W = 0.1 μm; M7: R_s = 0.01 Ω/sq, W = 0.5 μm. L = 1000 μm.\n§F: R = R_s × (L / W)\nMetal 2:\n§C: R_M2 = 0.08 × (1000 / 0.1) = 0.08 × 10000 = 800 Ω\nMetal 7:\n§C: R_M7 = 0.01 × (1000 / 0.5) = 0.01 × 2000 = 20 Ω\n§R: M2 resistance = 800 Ω; M7 resistance = 20 Ω. M7 is 40× lower resistance — use upper metals for global long wires.",
  },
  {
    id: "pd-num-driver-propagation", topic: "sta-timing", level: "Numerical",
    q: "[Intel] A net has C_wire = 40 fF and connects to 4 loads of 5 fF each. Driver output resistance R_out = 200 Ω. Estimate 50% driver propagation delay using 0.69 × R × C_total.",
    a: "Given: C_wire = 40 fF, N_loads = 4, C_load = 5 fF each, R_out = 200 Ω.\n§F: C_total = C_wire + N_loads × C_load\n§C: = 40 + 4×5 = 40 + 20 = 60 fF\n§F: τ_50% = 0.69 × R_out × C_total\n§C: = 0.69 × 200 × 60×10⁻¹⁵\n§C: = 0.69 × 12000×10⁻¹⁵ = 8280×10⁻¹⁵ s\n§R: Driver propagation delay (50%) ≈ 8.28 ps",
  },
  {
    id: "pd-num-xtalk-peak-voltage", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] A victim net has ground capacitance Cg = 30 fF and coupling capacitance to aggressor Cc = 10 fF. The aggressor switches with ΔV_agg = 0.9 V. Calculate peak crosstalk noise voltage on the victim (ΔV_vict = ΔV_agg × Cc/(Cg+Cc)).",
    a: "Given: Cg = 30 fF, Cc = 10 fF, ΔV_agg = 0.9 V.\n§F: ΔV_vict = ΔV_agg × Cc / (Cg + Cc)\n§C: = 0.9 × 10 / (30 + 10)\n§C: = 0.9 × 10 / 40\n§C: = 0.9 × 0.25 = 0.225 V\n§R: Peak crosstalk noise = 225 mV",
  },
  {
    id: "pd-num-xtalk-mcf2-cap", topic: "pd-signoff", level: "Numerical",
    q: "[Broadcom] Same victim net (Cg = 30 fF, Cc = 10 fF). The aggressor switches in the OPPOSITE direction (MCF = 2). Calculate the effective capacitance of the victim net.",
    a: "Given: Cg = 30 fF, Cc = 10 fF, MCF = 2 (opposite-direction switching — maximum pessimism).\n§F: C_eff = Cg + MCF × Cc\n§C: = 30 + 2 × 10 = 30 + 20 = 50 fF\n§R: Effective victim capacitance = 50 fF (vs 30 fF with no aggressor — 67% increase, causes worst-case delay)",
  },
  {
    id: "pd-num-xtalk-mcf0-cap", topic: "pd-signoff", level: "Numerical",
    q: "[Qualcomm] Same victim (Cg = 30 fF, Cc = 10 fF). The aggressor switches in the SAME direction (MCF = 0). Calculate effective victim capacitance.",
    a: "Given: Cg = 30 fF, Cc = 10 fF, MCF = 0 (same-direction — coupling capacitance is neutralised).\n§F: C_eff = Cg + MCF × Cc\n§C: = 30 + 0 × 10 = 30 + 0 = 30 fF\n§R: Effective victim capacitance = 30 fF (coupling has zero net effect; victim sees only ground capacitance — faster transition)",
  },
  {
    id: "pd-num-xtalk-driver-upsize", topic: "sta-timing", level: "Numerical",
    q: "[Apple] A buffer with drive strength Rd = 150 Ω drives a victim net with crosstalk noise peak V_peak = 250 mV. If driver resistance is upsized to Rd_new = 50 Ω, estimate the new noise peak voltage assuming linear scaling with driver impedance.",
    a: "Given: Rd_old = 150 Ω, V_peak_old = 250 mV, Rd_new = 50 Ω.\nCrosstalk noise peak scales with driver output impedance (higher Rd → slower transition → more charge coupling time).\n§F: V_peak_new = V_peak_old × (Rd_new / Rd_old)\n§C: = 250 × (50 / 150)\n§C: = 250 × 0.333 = 83.3 mV\n§R: New noise peak ≈ 83 mV (3× reduction by upsizing driver)",
  },
  {
    id: "pd-num-antenna-ratio", topic: "pd-signoff", level: "Numerical",
    q: "[TSMC] Metal 3 line of length 200 μm, width 0.1 μm is connected directly to a gate oxide terminal of area A_gate = 0.02 μm². Calculate the Antenna Ratio (Metal Area / Gate Area).",
    a: "Given: Metal length = 200 μm, Metal width = 0.1 μm, A_gate = 0.02 μm².\n§F: A_metal = Length × Width = 200 × 0.1 = 20 μm²\n§F: Antenna Ratio = A_metal / A_gate\n§C: = 20 / 0.02 = 1000\n§R: Antenna Ratio = 1000:1\nNote: Most foundry rules limit antenna ratio to 400–500:1. A ratio of 1000 is a severe DRC violation requiring layer-hopping or diode insertion.",
  },
  {
    id: "pd-num-antenna-drc-cut", topic: "pd-signoff", level: "Numerical",
    q: "[Nvidia] If the maximum allowed Antenna Ratio for Metal 3 is 500, determine if the net in Q85 violates DRC. What minimum wire length must M3 be cut to to eliminate the violation using layer hopping to M4?",
    a: "Q85 Antenna Ratio = 1000. Maximum allowed = 500. Violation exists (1000 > 500).\n§F: Max allowed M3 area = 500 × A_gate = 500 × 0.02 = 10 μm²\n§F: Max M3 wire length = A_max_M3 / width = 10 / 0.1 = 100 μm\nSolution: Cut the M3 wire at 100 μm, route the remaining 100 μm on M4 (which has a separate, already-completed connection to source/drain — its antenna ratio resets).\n§R: Cut M3 at 100 μm and continue on M4 — antenna ratio drops to 500:1 ✓",
  },
  {
    id: "pd-num-via-array-res", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] A via array consists of 2×2 grid (4 vias). Each via resistance = 8 Ω. Calculate the effective resistance of the via array.",
    a: "Given: 4 vias in parallel array, each R_via = 8 Ω.\n§F: R_eff = R_via / N_vias (parallel combination of N equal resistances)\n§C: = 8 / 4 = 2 Ω\n§R: Effective via array resistance = 2 Ω\nNote: Via arrays are mandatory for high-current nets (power, clock trunks) to reduce resistance and meet EM current density limits.",
  },
  {
    id: "pd-num-routing-tracks", topic: "sta-timing", level: "Numerical",
    q: "[Apple] Standard cell height = 1.2 μm, width = 2.4 μm. Pitch of horizontal M2 routing tracks = 0.2 μm. Calculate the maximum number of routing tracks that cross vertically over this standard cell.",
    a: "Given: Cell height = 1.2 μm, M2 pitch = 0.2 μm.\n§F: N_tracks = Cell height / M2 pitch\n§C: = 1.2 / 0.2 = 6 tracks\n§R: Maximum 6 horizontal M2 routing tracks can cross over this standard cell",
  },
  {
    id: "pd-num-icg-max-path", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] An ICG cell has Clock-to-Enable Setup time T_setup_enable = 0.15 ns and Hold time T_hold_enable = 0.05 ns. Clock period T_clk = 2 ns (50% duty cycle). If the enable signal is generated by a flop clocked on the rising edge, calculate the maximum allowable path delay from the generating flop to the ICG enable pin.",
    a: "Given: T_setup_enable = 0.15 ns, T_clk = 2 ns (50% duty → high time = 1 ns). Enable must be stable before the LOW→HIGH edge that closes the ICG latch.\n§F: ICG latch closes on rising clock edge. Enable must arrive by: T_clk_high − T_setup_enable before the edge.\n§F: Max enable path delay = T_high_phase − T_setup_enable = 1.0 − 0.15 = 0.85 ns\nFrom the generating flip-flop (clocked at rising edge, 0 ns): the full path (clk→q + combo + routing) to ICG enable must complete within 0.85 ns.\n§R: Maximum allowable path delay from flop to ICG enable pin = 0.85 ns",
  },
  {
    id: "pd-num-icg-enable-check", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] In an active-high enable ICG (integrated with latch), state whether enable setup check occurs at the clock rising or falling edge, and calculate the required arrival time for T_clk = 1 ns.",
    a: "For an active-high ICG cell: The internal latch is transparent when clock is HIGH. It closes (latches) on the falling edge of the clock.\nEnable setup check occurs at the FALLING clock edge — the enable must be stable before the latch closes.\n§F: T_clk_period = 1 ns → falling edge at T = 0.5 ns (50% duty)\n§F: Required enable arrival time = T_falling_edge − T_setup_enable\n§C: = 0.5 − 0.15 = 0.35 ns from rising edge\n§R: Enable must arrive by T = 0.35 ns after the rising clock edge (setup check at falling edge)",
  },
  {
    id: "pd-num-latency-skew-buffer", topic: "sta-timing", level: "Numerical",
    q: "[Intel] Latency from Clock Source to Flop A is 1.85 ns. Latency to Flop B is 1.20 ns. What is the skew between A and B? How many buffer stages of 65 ps each must be added to Flop B's path to balance the latency to within 30 ps skew?",
    a: "Given: T_lat_A = 1.85 ns, T_lat_B = 1.20 ns.\n§F: Skew = T_lat_A − T_lat_B = 1.85 − 1.20 = 0.65 ns = 650 ps\nTarget: ≤ 30 ps skew after adding buffers to B's path.\n§F: Required additional delay on B = 650 − 30 = 620 ps\n§F: Buffer stages needed = Required delay / Stage delay\n§C: = 620 / 65 = 9.54 → round up to 10 stages\n§R: Add 10 buffer stages of 65 ps to Flop B's clock path (adds 650 ps, results in 0 ps skew — within 30 ps target)",
  },
  {
    id: "pd-num-clock-branch-power", topic: "pd-signoff", level: "Numerical",
    q: "[Nvidia] A clock tree branch splits into 16 sinks. Each sink load = 8 fF. Wire capacitance of the tree structure = 120 fF. Calculate total dynamic clock power of this branch at V_DD = 0.9 V, F = 1.5 GHz.",
    a: "Given: N_sinks = 16, C_sink = 8 fF, C_wire = 120 fF, V = 0.9 V, F = 1.5 GHz.\n§F: C_sink_total = N_sinks × C_sink = 16 × 8 = 128 fF\n§F: C_total = C_wire + C_sink_total = 120 + 128 = 248 fF\n§F: P_clk = C_total × V² × F\n§C: = 248×10⁻¹⁵ × (0.9)² × 1.5×10⁹\n§C: = 248×10⁻¹⁵ × 0.81 × 1.5×10⁹\n§C: = 248 × 0.81 × 1.5 × 10⁻⁶ = 301.6 μW\n§R: Clock branch dynamic power ≈ 301.6 μW",
  },
  {
    id: "pd-num-hyperperiod", topic: "sta-timing", level: "Numerical",
    q: "[Apple] Clock A has period T_A = 3 ns. Clock B has period T_B = 4 ns. Clocks are generated from the same source at t = 0. Calculate the common base period (hyperperiod) for setup timing analysis between Clock A and Clock B domains.",
    a: "Given: T_A = 3 ns, T_B = 4 ns.\n§F: Hyperperiod = LCM(T_A, T_B) = LCM(3, 4)\nLCM(3,4) = 12 (since GCD(3,4) = 1):\n§C: LCM = 3 × 4 / GCD(3,4) = 12 / 1 = 12 ns\nIn 12 ns: Clock A completes 4 cycles, Clock B completes 3 cycles — they realign at t = 12 ns.\n§R: Hyperperiod = 12 ns; setup analysis must find the minimum clock-edge separation in this window",
  },
  {
    id: "pd-num-voltage-slack", topic: "sta-timing", level: "Numerical",
    q: "[AMD] A design operates at 1 GHz (V_DD = 0.9 V) with a setup slack of +50 ps. If voltage is scaled down to 0.8 V, cell gate delay increases by 18%. Calculate the new setup slack at 1 GHz assuming the original data path delay was 850 ps.",
    a: "Given: F = 1 GHz → T_clk = 1000 ps, T_setup ≈ 50 ps slack, T_data_old = 850 ps, delay increase = 18%.\n§F: T_data_new = T_data_old × (1 + 18%) = 850 × 1.18 = 1003 ps\n§F: T_required ≈ T_clk − T_clk→q − T_setup_lib (assume these are folded into T_data_old basis)\nUsing slack equation: new slack = old_slack − (T_data_new − T_data_old)\n§F: New Setup Slack = +50 − (1003 − 850) = 50 − 153 = −103 ps\n§R: New Setup Slack = −103 ps ⚠ (Violation — design fails at 1 GHz at 0.8 V)",
  },
  {
    id: "pd-num-fmax-wns", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] A path has a Worst Negative Slack (WNS) of −120 ps at 500 MHz. What is the maximum operating frequency (F_max) at which this path will have exactly 0 ps slack?",
    a: "Given: F_operating = 500 MHz → T_clk = 2000 ps, WNS = −120 ps.\n§F: At F_operating, slack = T_clk − T_data_path. WNS = −120 ps means T_data_path exceeds T_clk by 120 ps.\n§F: T_data_path = T_clk − WNS_margin = 2000 − (−120) = 2120 ps (the path takes 2120 ps)\n§F: F_max = 1 / T_data_path = 1 / 2120 ps\n§C: = 1 / 2.12×10⁻⁹ = 471.7 MHz\n§R: F_max ≈ 471.7 MHz (this path limits the design to ~472 MHz)",
  },
  {
    id: "pd-num-buffer-swaps-setup", topic: "sta-timing", level: "Numerical",
    q: "[Broadcom] A data path has a setup slack of −180 ps. Swapping a standard VT buffer (Delay = 100 ps) with an LVT buffer reduces delay by 35%. How many such buffer swaps along the path are required to make setup slack positive?",
    a: "Given: Setup slack = −180 ps, VT delay = 100 ps, reduction = 35%.\n§F: Delay saved per swap = 100 × 35% = 35 ps per buffer\n§F: Swaps needed = |slack| / delay_saved_per_swap\n§C: = 180 / 35 = 5.14 → round up to 6 swaps\n§R: 6 LVT buffer swaps required to recover 210 ps (positive slack = +30 ps after 6 swaps)",
  },
  {
    id: "pd-num-hold-buffer-selection", topic: "sta-timing", level: "Numerical",
    q: "[Nvidia] A hold violation of −90 ps exists on a net. Available delay buffers: Buf_A = 20 ps, Buf_B = 35 ps, Buf_C = 50 ps. Choose the optimal combination to fix hold without creating a setup violation on a path with +40 ps slack margin.",
    a: "Given: Hold violation = −90 ps (need ≥ 90 ps added delay). Available: 20/35/50 ps buffers. Max insertable delay without setup violation = +40 ps — wait, hold and setup are independent paths; setup slack of +40 ps limits total buffer delay to 40 ps on the launch path.\nBest combination within 40 ps constraint:\n§F: Buf_B (35 ps) → hold fixed by 35 ps, slack = −90 + 35 = −55 ps (still violating)\n§F: Buf_A + Buf_B = 20 + 35 = 55 ps → exceeds setup margin of 40 ps\nCorrect approach: Insert buffers on the CLOCK path (not data path) to delay capture edge, which fixes hold without affecting setup data path.\n§F: Buf_B + Buf_A on clock path = 55 ps > 90 ps? No.\n§F: Buf_C + Buf_B = 50 + 35 = 85 ps; Buf_C + Buf_B + Buf_A = 105 ps ≥ 90 ps\n§R: Optimal: Buf_C (50 ps) + Buf_B (35 ps) = 85 ps on clock path — hold becomes −5 ps (needs slight further fix); or Buf_C + Buf_B + Buf_A = 105 ps on clock path → hold becomes +15 ps ✓",
  },
  {
    id: "pd-num-dual-slack-buffer", topic: "sta-timing", level: "Numerical",
    q: "[Intel] A path has Setup Slack = +10 ps and Hold Slack = −30 ps. You insert a delay buffer with Delay = 25 ps to fix hold. Does this fix create a setup violation?",
    a: "Given: Setup Slack = +10 ps, Hold Slack = −30 ps, buffer delay = 25 ps.\nInserting a delay buffer on the DATA path increases minimum arrival time (fixes hold) but also increases maximum arrival time (worsens setup).\n§F: New Hold Slack = Old Hold Slack + buffer delay = −30 + 25 = −5 ps (still violated)\n§F: New Setup Slack = Old Setup Slack − buffer delay = +10 − 25 = −15 ps\n§R: Setup violation created (−15 ps). Hold still violated (−5 ps). Buffer delay of 25 ps is insufficient and damages setup. Need ≥30 ps buffer inserted on CLOCK path instead (capture clock delayed, fixes hold without touching setup data path).",
  },
  {
    id: "pd-num-input-port-slack", topic: "sta-timing", level: "Numerical",
    q: "[Qualcomm] Input port IN1 has `set_input_delay -max 1.8 ns -clock CLK` (T_clk = 2.5 ns). Internal datapath delay from IN1 to first Flop FF1 = 0.1 ns. T_setup = 0.1 ns. Calculate setup slack at FF1.",
    a: "Given: T_input_delay_max = 1.8 ns, T_clk = 2.5 ns, T_combo = 0.1 ns, T_setup = 0.1 ns.\n§F: T_arrival at FF1 = T_input_delay + T_combo = 1.8 + 0.1 = 1.9 ns\n§F: T_required = T_clk − T_setup = 2.5 − 0.1 = 2.4 ns\n§F: Setup Slack = T_required − T_arrival = 2.4 − 1.9 = +0.5 ns\n§R: Setup Slack at FF1 = +0.5 ns ✓",
  },
  {
    id: "pd-num-output-port-combo", topic: "pd-signoff", level: "Numerical",
    q: "[Apple] Output port OUT1 has `set_output_delay -max 0.8 ns -clock CLK` (T_clk = 2.0 ns). Internal clock delay to launch Flop FF_out is 0.2 ns, T_clk→q = 0.15 ns. Calculate maximum allowable internal combinational logic delay from FF_out to OUT1.",
    a: "Given: T_output_delay_max = 0.8 ns, T_clk = 2.0 ns, T_clk_to_FF_out = 0.2 ns, T_clk→q = 0.15 ns.\n§F: T_required at output port = T_clk − T_output_delay\n§C: = 2.0 − 0.8 = 1.2 ns (this is the latest the data can arrive at the output port)\n§F: T_arrival = T_clk_to_FF_out + T_clk→q + T_combo_max\n§C: = 0.2 + 0.15 + T_combo_max = T_required = 1.2 ns\n§F: T_combo_max = 1.2 − 0.2 − 0.15 = 0.85 ns\n§R: Maximum allowable combinational delay from FF_out to OUT1 = 0.85 ns",
  },
  {
    id: "hr-why-vlsi", topic: "freshers", level: "Easy",
    q: "Why do you want to work in VLSI instead of software engineering?",
    a: "I enjoy working close to the hardware and understanding physical signal behaviour at the transistor and gate levels. In VLSI, optimizing timing, dynamic power, or silicon area directly impacts millions of hardware units across consumer devices, data centers, and embedded systems. Combining hardware description languages (Verilog/SystemVerilog) with physical silicon design offers a uniquely rewarding engineering challenge.",
  },
  {
    id: "hr-btech-tools", topic: "freshers", level: "Easy",
    q: "Which VLSI EDA tools or hardware description languages have you used during your engineering studies?",
    a: "During B.Tech/academics, I worked with Verilog and SystemVerilog for RTL modeling and testbench creation. For simulation and synthesis, I have used industry-standard suites (such as Cadence Xcelium/Genus, Synopsys VCS/Design Compiler, or open-source tools like Icarus Verilog, Yosys, and OpenLane for physical implementation), along with Python and Tcl scripting for workflow automation.",
  },
  {
    id: "hr-project-learnings", topic: "freshers", level: "Medium",
    q: "Tell me about a VLSI or digital design project you built and your key takeaways from it.",
    a: "I designed and verified an RTL block (e.g., a 32-bit RISC-V CPU core / 4-bit ALU / SPI Controller) in Verilog. I developed the architecture specification, authored clean modular RTL, and built a SystemVerilog testbench for functional verification. Key learnings included mastering clean coding styles, avoiding unintentional latches, understanding clock domain boundaries, and debugging timing reports.",
  },
  {
    id: "hr-continuous-learning", topic: "freshers", level: "Easy",
    q: "How do you plan to keep your VLSI domain knowledge updated in the semiconductor industry?",
    a: "I regularly review core fundamentals (CMOS physics, static timing analysis, setup/hold constraints) and follow industry developments via IEEE papers, semiconductor blogs (SemiAnalysis, WikiChip), and tool documentation. On the job, I actively learn from senior designers by reviewing codebase architectures, analyzing synthesis constraints, and working on hands-on RTL/EDA script projects.",
  },
  {
    id: "freshers-frequently-asked-matters", topic: "freshers", level: "Easy",
    q: "[Self-Check MCQ] In a typical entry-level VLSI candidate evaluation, which attribute matters MOST?",
    a: "Option B: Deep VLSI & Digital Fundamentals + Strong learning agility for EDA tools.\n\nRecruiters evaluate core understanding of logic design, timing, and problem-solving. Tool syntax can be taught rapidly on the job, but weak digital fundamentals create long-term design bugs.",
  },
  {
    id: "digital-what-is-vlsi", topic: "digital", level: "Easy",
    q: "What is VLSI, and why is it important in modern technology?",
    a: "VLSI (Very Large Scale Integration) is the process of integrating thousands to billions of transistors on a single silicon microchip. It enables packing complex digital logic, memory, clock management, and analog interfaces into a single IC (System-on-Chip), drastically reducing power, manufacturing cost, and physical size while elevating computing throughput.",
  },
  {
    id: "digital-asic-vs-fpga", topic: "digital", level: "Easy",
    q: "What are the main differences between an ASIC and an FPGA?",
    a: "An ASIC (Application-Specific Integrated Circuit) is a custom-fabricated microchip optimized for a single task, offering maximum performance, lowest unit cost, and minimal power consumption, but requiring high NRE mask costs and zero post-fabrication changes. An FPGA (Field-Programmable Gate Array) consists of reconfigurable logic blocks (LUTs) and routing matrices that can be reprogrammed in the field, making it ideal for rapid prototyping and low-volume applications at higher per-unit power and cost.",
  },
  {
    id: "digital-sync-vs-async", topic: "digital", level: "Medium",
    q: "Compare synchronous and asynchronous digital circuits.",
    a: "In synchronous circuits, all sequential memory elements (flip-flops) update state simultaneously under the control of a shared global clock signal, ensuring predictable timing analysis via STA. Asynchronous circuits operate without a global clock, coordinating data transfers using local handshaking signals (req/ack); they offer lower dynamic idle power but introduce complex hazard verification.",
  },
  {
    id: "digital-2to1-mux-gates", topic: "digital", level: "Easy",
    q: "How is a 2:1 Multiplexer implemented using basic logic gates?",
    a: "A 2:1 MUX selects between inputs I0 and I1 based on select signal S.\n§F: Y = (\\\\bar{S} \\\\cdot I_0) + (S \\\\cdot I_1)\nThis requires 1 NOT gate (to generate $\\\\bar{S}$), 2 AND gates (for $\\\\bar{S}\\\\cdot I_0$ and $S\\\\cdot I_1$), and 1 OR gate to combine the outputs.",
  },
  {
    id: "verilog-blocking-vs-nonblocking", topic: "rtl-dv", level: "Medium",
    q: "What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?",
    a: "Blocking assignments (=) execute sequentially in procedural order within an active event loop, blocking subsequent statement evaluations; they are strictly used in combinational logic (`always_comb`). Non-blocking assignments (<=) evaluate all RHS expressions concurrently before updating LHS targets at the end of the time step; they must be used in sequential clocked blocks (`always @(posedge clk)`) to prevent simulation race conditions.",
  },
  {
    id: "pd-static-vs-dynamic-power", topic: "sta-timing", level: "Medium",
    q: "What is the difference between static power and dynamic power in VLSI?",
    a: "Dynamic power is consumed during active logic switching when charging and discharging parasitic nodal capacitances:\n§F: P_{\\\\text{dynamic}} = \\\\alpha \\\\cdot C_{\\\\text{load}} \\\\cdot V_{\\\\text{dd}}^2 \\\\cdot f\nStatic power is consumed when the circuit is idle due to subthreshold leakage, gate oxide tunneling, and reverse-biased junction leakage currents ($P_{\\\\text{static}} = V_{\\\\text{dd}} \\\\cdot I_{\\\\text{leak}}$).",
  },
  {
    id: "pd-dft-overview", topic: "sta-timing", level: "Medium",
    q: "What is Design for Testability (DFT) and why is it essential?",
    a: "DFT involves adding auxiliary test circuitry into silicon designs to detect manufacturing defects post-fabrication. Main techniques include Scan Chains (converting flip-flops into shift registers for controllability/observability), BIST (Built-In Self-Test for memory arrays), and Boundary Scan (JTAG IEEE 1149.1 for board-level interconnect testing).",
  },
  {
    id: "tools-matlab-basics", topic: "tools", level: "Easy",
    q: "What is MATLAB and how is it used in semiconductor and DSP engineering?",
    a: "MATLAB is a high-level numerical computing and visualization environment widely used for digital signal processing (DSP), filter synthesis, control loop modeling, and architectural algorithm exploration before RTL implementation in Verilog.",
  },
  {
    id: "tools-matlab-script-vs-func", topic: "tools", level: "Easy",
    q: "What is the structural difference between MATLAB script M-files and function M-files?",
    a: "Script M-files execute commands sequentially within the global base workspace without accepting input parameters or returning output variables. Function M-files operate in their own isolated local workspace, accept formal arguments (`function [y] = myFunc(x)`), and return defined outputs, preventing variable name collisions.",
  },
  {
    id: "tools-matlab-vectorization", topic: "tools", level: "Medium",
    q: "What is vectorization in MATLAB and why is it preferred over explicit `for` loops?",
    a: "Vectorization replaces explicit iterative element loops with optimized matrix array operations (e.g. `y = sin(x)` or element-wise `C = A .* B`). Because MATLAB is optimized for BLAS/LAPACK matrix routines, vectorized operations run 10x-100x faster than interpreted `for` loops.",
  },
  {
    id: "digital-sync-vs-async-v2", topic: "digital", level: "Easy",
    q: "What is the core operational difference between synchronous and asynchronous digital circuits?",
    a: "In synchronous circuits, all state transitions across registers are driven simultaneously by a global master clock signal, making STA and verification predictable.\nIn asynchronous circuits, there is no global clock; state changes rely on local handshake signals (request/acknowledge), which can offer higher speed and lower power but significantly increases design and verification complexity.",
  },
  {
    id: "freshers-vlsi-vs-sw", topic: "freshers", level: "Easy",
    q: "Why choose a career in VLSI design over pure software engineering?",
    a: "Key takeaways:\n1. Proximity to Silicon: VLSI allows engineers to work at the physical transistor and architectural level, directly shaping hardware capabilities.\n2. Leverage Impact: Microarchitectural and power optimizations in chip design translate to performance and efficiency gains for millions of computing devices worldwide.",
  },
  {
    id: "pd-antenna-effect-mitigation", topic: "pd-signoff", level: "Hard",
    q: "What is the Antenna Effect in VLSI fabrication and how is it mitigated?",
    a: "The Antenna Effect occurs during plasma etching when long metal interconnects accumulate static charge, building high voltage that can breakdown thin gate oxide of connected transistors.\nMitigation techniques:\n1. Metal Hopping: Route long nets to higher metal layers closer to the gate.\n2. Antenna Diodes: Insert reverse-biased diodes near the gate to safely discharge accumulated plasma voltage to ground.\n3. Gate Sizing: Increase connected gate area to reduce metal-to-gate area ratio.",
  },
  {
    id: "pd-decoupling-capacitors", topic: "pd-signoff", level: "Medium",
    q: "Why are Decoupling Capacitors (Decaps) placed across the Power Distribution Network (PDN)?",
    a: "Decoupling capacitors act as local energy reservoirs placed between VDD and GND near high-frequency switching blocks.\nWhen standard cells switch simultaneously, they draw instantaneous surge current, causing Dynamic IR drop and ground bounce. Decaps supply this transient current, dampening voltage power grid spikes.",
  },
  {
    id: "rtl-blocking-vs-nonblocking", topic: "rtl-dv", level: "Easy",
    q: "What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?",
    a: "Blocking (=) executes sequentially within procedural blocks, evaluating and assigning immediately before proceeding to the next statement (used for combinational logic).\nNon-blocking (<=) evaluates all right-hand side expressions first and schedules updates at the end of the time step, executing in parallel (mandatory for sequential edge-triggered registers to prevent race conditions).",
  },
  {
    id: "digital-cmos-dominance", topic: "digital", level: "Easy",
    q: "What is CMOS and why has it become the dominant technology in VLSI?",
    a: "CMOS (Complementary Metal-Oxide-Semiconductor) uses complementary pairs of p-type and n-type MOSFETs to implement digital logic functions.\nKey takeaways:\n1. Ultra-Low Static Power: For any stable logic state, one transistor is ON while the other is OFF, creating an extremely high resistance path from VDD to GND to minimize leakage current.\n2. Scale Integration: High noise margins and low power dissipation enable integrating billions of transistors on a single die without thermal self-destruction.",
  },
  {
    id: "digital-latch-vs-flipflop", topic: "digital", level: "Easy",
    q: "What is the fundamental difference between a latch and a flip-flop?",
    a: "Key takeaways:\n1. Level-Sensitivity vs Edge-Triggering: A latch is level-sensitive and transparent while its enable signal is active (HIGH). A flip-flop is edge-triggered, sampling input data strictly on a specific clock transition (e.g. rising edge).\n2. STA Impact: Flip-flops are preferred in synchronous digital design because predictable clock sampling simplifies Static Timing Analysis (STA). Latches are used intentionally for time-borrowing in high-performance pipelines or low-power designs, though they increase STA complexity.",
  },
  {
    id: "digital-comb-vs-seq", topic: "digital", level: "Easy",
    q: "What is the operational difference between combinational and sequential logic?",
    a: "Combinational Logic: Output is strictly a function of current input values without internal memory (e.g., adders, multiplexers, decoders).\nSequential Logic: Output depends on current inputs AND past state history, requiring memory storage elements like flip-flops or registers (e.g., counters, registers, FSMs).",
  },
  {
    id: "verilog-clk-div3-50duty", topic: "rtl-dv", level: "Hard",
    q: "How do you design a clock divider by 3 with a 50% duty cycle in Verilog?",
    a: "§F: Formula / Algorithm\nTo divide clock frequency by an odd integer (N=3) with a 50% duty cycle, you must trigger logic on both clock edges.\n\n§C: Implementation Steps\n1. Instantiate two 2-bit counters counting 0 → 1 → 2 → 0 (one on posedge clk, one on negedge clk).\n2. Generate a pulse signal `out_r` from the posedge counter when count == 0.\n3. Generate an identical pulse signal `out_f` from the negedge counter.\n4. Combine outputs using logical OR (`clk_out = out_r | out_f`).\n\n§R: Result\nBecause `out_r` and `out_f` are offset by 0.5 clock cycles, their OR produces 1.5 cycles HIGH and 1.5 cycles LOW, yielding an exact 50% duty cycle.",
  },
  {
    id: "verilog-avoiding-latches", topic: "rtl-dv", level: "Medium",
    q: "How do you avoid inferring unintended latches in combinational RTL blocks?",
    a: "Unintended latches occur in combinational `always @(*)` blocks when a signal is not assigned a value in every possible execution path.\n\nPrevention rules:\n1. Complete Conditional Paths: Include an `else` branch for every `if` statement.\n2. Default Cases: Add a `default:` clause to every `case` statement.\n3. Variable Pre-assignment: Assign default fallback values to signals at the very top of procedural blocks.",
  },
  {
    id: "verification-methods-overview", topic: "digital", level: "Medium",
    q: "What are the primary verification methods used in VLSI engineering?",
    a: "1. Directed Testing: Writing explicit test cases to verify specific functional requirements.\n2. Constrained Random Verification (CRV): Generating randomized stimulus within specified constraints to discover edge-case bugs.\n3. Assertion-Based Verification (ABV): Using SystemVerilog Assertions (SVA) to monitor protocol rules continuously.\n4. Formal Verification: Utilizing mathematical equivalence and property checkers to exhaustively prove RTL correctness without simulation vectors.",
  },
  {
    id: "verification-formal-proofs", topic: "digital", level: "Hard",
    q: "What is Formal Verification and what are its advantages and limitations?",
    a: "Formal Verification uses mathematical algorithms to prove RTL code correctness against formal property specifications (SVA).\nAdvantages: Exhaustive state-space exploration guaranteeing 100% mathematical proof without requiring simulation test vectors.\nLimitations: Suffers from state-space explosion on complex microarchitectures like deep pipelines or floating-point units.",
  },
  {
    id: "pd-flow-major-steps", topic: "pd-signoff", level: "Medium",
    q: "What are the major steps in the physical design (RTL-to-GDSII) flow?",
    a: "1. Floorplanning: Establishing chip aspect ratio, core area, macro placement, halos, and I/O pin assignments.\n2. Power Planning: Constructing Power Distribution Networks (PDN) with VDD/VSS rings, straps, and rails.\n3. Placement: Legalizing standard cells into core rows while minimizing routing congestion.\n4. Clock Tree Synthesis (CTS): Building balanced buffer trees to deliver clock signals with minimal skew and latency.\n5. Routing: Executing global and detailed routing on target metal layers.\n6. Signoff Verification: Performing DRC, LVS, and STA checks for physical manufacturability.",
  },
  {
    id: "pd-cts-goals-v2", topic: "sta-timing", level: "Hard",
    q: "What is Clock Tree Synthesis (CTS) and why is absolute zero skew not always desirable?",
    a: "CTS constructs a balanced clock distribution tree delivering clock pulses to all sequential elements.\nWhy absolute zero skew is avoided:\n1. Power Grid Spikes (di/dt): Simultaneous switching across all clock sinks draws massive transient surge currents, inducing high IR drop.\n2. Useful Skew: Intentional skew is deliberately introduced to delay clock arrival at capturing registers on critical paths, borrowing timing slack to resolve setup violations.",
  },
  {
    id: "pd-global-vs-detailed-routing", topic: "pd-signoff", level: "Medium",
    q: "What is the operational difference between global and detailed routing?",
    a: "Global Routing: Divides the die into coarse routing regions (g-cells) and calculates estimated path guides without assigning exact metal tracks or layers.\nDetailed Routing: Takes global routing guides and places physical metal traces on exact grid tracks while adhering to foundry DRC rules.",
  },
  {
    id: "sta-fundamentals-importance", topic: "sta-timing", level: "Medium",
    q: "What is Static Timing Analysis (STA) and why is it critical in chip signoff?",
    a: "Static Timing Analysis (STA) calculates worst-case propagation delays across all timing paths in a circuit without requiring dynamic simulation test vectors.\nIt ensures the chip meets setup and hold time constraints across all process-voltage-temperature (PVT) corners before tapeout signoff.",
  },
  {
    id: "sta-setup-violation-fixes", topic: "sta-timing", level: "Hard",
    q: "How do you identify and resolve a Setup Time violation?",
    a: "§F: Setup Constraint Equation\n`T_clk + T_skew >= T_cq + T_comb + T_setup` (Data path is too slow).\n\nFixes:\n1. Upsize Driving Cells: Increase cell drive strength to reduce gate delay.\n2. Use Low-Vt (LVT) Cells: Swap standard cells for low threshold voltage cells on critical paths.\n3. Restructure Logic Depth: Pipeline long combinational paths with intermediate registers.\n4. Useful Skew: Delay clock edge at capture register.",
  },
  {
    id: "sta-hold-violation-fixes", topic: "sta-timing", level: "Hard",
    q: "How do you identify and resolve a Hold Time violation?",
    a: "§F: Hold Constraint Equation\n`T_cq + T_comb >= T_hold + T_skew` (Data path is too fast).\n\nFixes:\n1. Insert Delay Buffers: Place non-inverting buffers directly into fast data paths.\n2. Swap to High-Vt (HVT) Cells: Replace fast LVT cells with slower HVT variants.\nNote: Hold fixes are independent of clock period (frequency) and must be satisfied across all operating corners.",
  },
  {
    id: "dft-scan-based-testing", topic: "pd-signoff", level: "Medium",
    q: "What is DFT and how does scan-based testing operate?",
    a: "Design for Testability (DFT) embeds extra test circuitry to verify silicon after manufacturing.\nScan Testing Operates via 2 Modes:\n1. Shift Mode (Scan Enable = 1): Replaces flip-flops with scan cells linked serially into shift registers (scan chains) to load test vectors (SI).\n2. Capture Mode (Scan Enable = 0): Applies a functional clock pulse to capture circuit response, then shifts data out (SO) for fault analysis.",
  },
  {
    id: "dft-atpg-fault-models", topic: "pd-signoff", level: "Hard",
    q: "What are the common fault models targeted by Automatic Test Pattern Generation (ATPG)?",
    a: "1. Stuck-At Faults (Stuck-At-0 / Stuck-At-1): Models structural wires permanently shorted to ground or supply.\n2. Transition Delay Faults: Tests dynamic gate switching delays (slow-to-rise / slow-to-fall) at operational clock speeds.\n3. Bridging Faults: Models unintentional shorts between neighboring signal lines.",
  },
  {
    id: "cdc-fifo-depth-calc", topic: "digital", level: "Hard",
    q: "How do you calculate the minimum required depth of an asynchronous FIFO?",
    a: "§F: FIFO Depth Equation\n`Depth >= Burst_Length - (Burst_Length * (F_read / F_write) * (1 / (1 + Read_Stall)))` + `Guard_Band`.\n\nExample Calculation:\nGiven Write Clock = 100MHz, Read Clock = 50MHz, Burst = 80 items with zero read delay:\n1. Burst Duration = 80 / 100MHz = 800ns.\n2. Reads during burst = 800ns * 50MHz = 40 items.\n3. Backlog = 80 - 40 = 40 entries.\n\n§R: Result\nMinimum Depth = 40 entries + synchronizer latency guard band.",
  },
  {
    id: "lowpower-cmos-dissipation-types", topic: "digital", level: "Medium",
    q: "What are the main types of power dissipation in CMOS integrated circuits?",
    a: "1. Dynamic Power (`P_dynamic = α * C * V^2 * f`): Consumed when transistors switch states; includes capacitive load charging/discharging and short-circuit current.\n2. Static Leakage Power (`P_static = I_leak * V`): Power consumed when idle due to sub-threshold leakage, gate oxide tunneling, and reverse-biased junction leakage.",
  },
  {
    id: "lowpower-design-techniques", topic: "digital", level: "Hard",
    q: "What are the industry-standard architectural techniques for low-power design?",
    a: "1. Clock Gating: Disabling clock trees to idle registers using Integrated Clock Gating (ICG) cells.\n2. Power Gating: Shutting down supply voltage to idle blocks using header/footer power switches.\n3. Multi-VDD & DVFS: Adjusting supply voltage and frequency dynamically based on workload demand.\n4. Multi-Vt Optimization: Using low-Vt cells strictly on timing-critical paths and high-Vt (HVT) cells elsewhere to suppress leakage.",
  },
  {
    id: "tier-primary-and-or", topic: "digital", level: "Easy",
    q: "What is the visual and logic difference between an AND gate and an OR gate?",
    a: "AND Gate: Output is 1 ONLY when ALL inputs are 1 (like switches connected in series).\nOR Gate: Output is 1 when AT LEAST ONE input is 1 (like switches connected in parallel).",
  },
  {
    id: "tier-primary-binary-count", topic: "digital", level: "Easy",
    q: "How do computers count to 10 using binary (0s and 1s)?",
    a: "Binary counting uses base-2 positional values (1, 2, 4, 8):\n0=0000, 1=0001, 2=0010, 3=0011, 4=0100, 5=0101, 6=0110, 7=0111, 8=1000, 9=1001, 10=1010.",
  },
  {
    id: "tier-hs-demorgan", topic: "digital", level: "Easy",
    q: "What are De Morgan’s Laws and why are they useful in circuit synthesis?",
    a: "De Morgan’s Laws:\n1. `~(A & B) = ~A | ~B`\n2. `~(A | B) = ~A & ~B`\nUtility: Allows converting logic equations into NAND-only or NOR-only implementations, optimizing silicon area in standard cell libraries.",
  },
  {
    id: "tier-senior-retiming", topic: "digital", level: "Medium",
    q: "What is register retiming and how does it optimize clock performance?",
    a: "Register retiming shifts flip-flops across combinational logic blocks without altering input-output functional behavior.\nGoal: Balances critical combinational path delays across pipeline stages to achieve higher maximum operating frequency (Fmax).",
  },
  {
    id: "tier-pro-round-robin-arbiter", topic: "rtl-dv", level: "Hard",
    q: "How do you implement a 4-requestor Round-Robin Arbiter with rotating priority?",
    a: "Maintain a 2-bit pointer `last_grant`. For each requestor i, evaluate priority relative to `last_grant` (`priority = (i - last_grant) mod 4`). Rotate input request vector, pass to fixed priority encoder, grant request, and update `last_grant`.",
  },
  {
    id: "tier-pro-upf-power-intent", topic: "digital", level: "Hard",
    q: "What is IEEE 1801 UPF (Unified Power Format) and how does it drive multi-rail implementation?",
    a: "UPF specifies power intent out-of-band from RTL code.\nIt defines:\n1. Power domains and supply nets/switches.\n2. Isolation cells (preventing floating inputs when domains turn off).\n3. Level shifters (bridging signals between low-voltage and high-voltage rails).\n4. Retention registers (saving register states during power-down).",
  },
  {
    id: "company-intel-power-stripes", topic: "pd-signoff", level: "Hard",
    q: "[Intel Interview] Why are power distribution stripes routed on top metal layers in advanced nodes?",
    a: "Top metal layers (e.g., M7-M9) are physically thicker with larger cross-sectional area, offering significantly lower resistance (R per unit length).\nRouting primary VDD/VSS power grid lines on top metal minimizes IR voltage drops and electromigration across high-performance CPU cores.",
  },
  {
    id: "company-amd-pdp-tradeoff", topic: "digital", level: "Medium",
    q: "[AMD Interview] What is Power-Delay Product (PDP) and Energy-Delay Product (EDP)?",
    a: "Power-Delay Product (PDP = Power * Delay): Measures energy consumed per switching operation (Joules).\nEnergy-Delay Product (EDP = Energy * Delay): Evaluates architectural efficiency by balancing performance penalty against power savings. EDP is the primary metric for processor pipeline tuning.",
  },
  {
    id: "company-qualcomm-axi-bursts", topic: "tools", level: "Hard",
    q: "[Qualcomm Interview] What are the key differences between AMBA AXI3 and AXI4 protocols?",
    a: "1. Burst Length: AXI4 expands INCR burst length up to 256 transfers (AXI3 maxed at 16).\n2. Write Interleaving: AXI4 removes write data interleaving to simplify interconnect design.\n3. Quality of Service (QoS): AXI4 adds 4-bit `AxQOS` signals for real-time priority traffic routing.",
  },
  {
    id: "company-nvidia-pipeline-forwarding", topic: "rtl-dv", level: "Hard",
    q: "[NVIDIA Interview] How do you resolve Read-After-Write (RAW) data hazards in a 5-stage RISC pipeline?",
    a: "1. Bypassing / Forwarding: Route execution results directly from EX/MEM or MEM/WB pipeline registers back to the ALU input in the ID stage without waiting for register file writeback.\n2. Pipeline Stalling: Insert a bubble (NOP) when loading data from memory (Load-Use hazard) where forwarding cannot bridge the single-cycle gap.",
  },
  {
    id: "company-analog-chargesharing-paradox", topic: "digital", level: "Hard",
    q: "[Texas Instruments / Analog Interview] When a capacitor charged to V0 connects to an identical uncharged capacitor, what is the final voltage and energy state?",
    a: "§F: Charge Conservation Equation\n`Q_total = C * V0`. When connected to second capacitor C, total capacitance = `2C`.\n\n§C: Calculation Steps\n1. Final Voltage: `V_final = Q_total / (2C) = V0 / 2`.\n2. Initial Energy: `E_initial = 0.5 * C * V0^2`.\n3. Final Energy: `E_final = 0.5 * (2C) * (V0 / 2)^2 = 0.25 * C * V0^2`.\n\n§R: Result\nExactly 50% of electrostatic energy is dissipated as heat in interconnect resistance regardless of resistance value.",
  },
  {
    id: "company-arm-l2-cache-coherence", topic: "digital", level: "Hard",
    q: "[ARM Interview] How does the MESI protocol maintain cache coherence across multi-core CPUs?",
    a: "The MESI protocol tracks cache line states across 4 modes:\n1. Modified (M): Line is dirty (modified) and present only in current local cache.\n2. Exclusive (E): Line is clean (matches main memory) and present only in current cache.\n3. Shared (S): Line is clean and may be present in multiple core caches.\n4. Invalid (I): Line does not contain valid data.\nCoherence transitions occur via bus snooping of read/write requests across L1/L2 caches.",
  },
  {
    id: "company-apple-retention-flops", topic: "digital", level: "Hard",
    q: "[Apple Interview] What is a Retention Flip-Flop and how is it used in aggressive power gating?",
    a: "A Retention Flip-Flop contains a secondary shadow latch powered by an always-on supply rail (VDD_always).\nBefore power-gating a block, a `SAVE` pulse backs up register state into shadow latches. When main power returns, a `RESTORE` pulse reloads saved values into primary flip-flops, resuming execution instantly without warm-boot latency.",
  },
  {
    id: "company-broadcom-serdes-equalization", topic: "tools", level: "Hard",
    q: "[Broadcom Interview] What is the purpose of Pre-Emphasis and Continuous Time Linear Equalization (CTLE) in high-speed SerDes links?",
    a: "High-speed serial PCB channels act as low-pass filters, causing severe Inter-Symbol Interference (ISI) and high-frequency attenuation.\n1. Pre-Emphasis (Tx): Amplifies high-frequency signal transitions at transmitter output.\n2. CTLE (Rx): Applies high-pass frequency response at receiver front-end to flatten channel attenuation and open eye diagrams.",
  },
  {
    id: "company-cadence-synopsys-primetime-ocv", topic: "sta-timing", level: "Hard",
    q: "[Synopsys / Cadence Interview] What is Advanced On-Chip Variation (AOCV) in PrimeTime STA?",
    a: "Traditional OCV applies a uniform flat derate factor across the entire die, leading to overly pessimistic timing slack.\nAOCV applies location-dependent and path-depth-dependent derate factors: longer timing paths average out random process variations, reducing pessimism and recovering timing closure margin.",
  },
  {
    id: "company-samsung-finfet-quantization", topic: "pd-signoff", level: "Hard",
    q: "[Samsung / Foundry Interview] What is FinFET width quantization and how does it constrain transistor sizing?",
    a: "In planar MOSFETs, channel width (W) can be continuously adjusted. In 3D FinFET technology, effective channel width is quantized into discrete fin counts (`W_eff = N_fins * (2 * H_fin + W_fin)`).\nDesign Impact: Transistor drive strength can only be scaled by adding integer numbers of discrete vertical fins (1-fin, 2-fin, 3-fin cells).",
  },
  {
    id: "vlsi-sgi-q1-what-is-the-difference-between-meal", topic: "rtl-dv", level: "Medium",
    q: "What is the difference between Mealy and Moore state machines?",
    a: "• Moore Machine: Outputs depend strictly on the current state only ($Output = f(State)$). Outputs change synchronously on clock edges and are immune to input glitches.\n• Mealy Machine: Outputs depend on both the current state and present input signals ($Output = f(State, Inputs)$). Mealy machines often require fewer states to implement the same function, but asynchronous input transitions can propagate glitches directly to the outputs.",
  },
  {
    id: "vlsi-sgi-q2-how-do-you-solve-setup-and-hold-vio", topic: "sta-timing", level: "Hard",
    q: "How do you solve setup and hold violations in a design?",
    a: "To solve Setup Violations ($T_{clk} < T_{cq} + T_{comb} + T_{setup} - T_{skew}$):\n1. Optimize/restructure combinational data path logic (retiming, pipelining, logic restructuring).\n2. Upsize cells on the critical data path to higher drive strength or swap HVT cells to LVT cells.\n3. Increase clock transition slew at the launch flip-flop clock pin to reduce $T_{cq}$.\n4. Apply useful clock skew (delay clock to capture flip-flop).\n\nTo solve Hold Violations ($T_{cq} + T_{comb} < T_{hold} + T_{skew}$):\n1. Insert dedicated delay cells or buffer pairs into the data path.\n2. Delay the clock arrival at the launch flip-flop.\n3. Insert lockup latches on clock domain boundaries to eliminate data race hazards.",
  },
  {
    id: "vlsi-sgi-q3-what-is-an-antenna-violation-and-ho", topic: "pd-signoff", level: "Hard",
    q: "What is an antenna violation and how do you prevent it?",
    a: "During reactive ion etching (plasma etching), electrical charges accumulate on exposed long metal interconnect lines. If connected to a small MOSFET gate, the high accumulated electrostatic voltage can rupture the thin gate oxide dielectric, destroying the transistor.\n\nPrevention Techniques:\n1. Metal Jogging: Route the net up to a higher metal layer (e.g. M3 instead of M2) so the long antenna line is disconnected from the gate during lower-layer etching.\n2. Antenna Diodes: Insert reverse-biased ESD protection diodes near the gate to safely discharge accumulated charges into the substrate/well.",
  },
  {
    id: "vlsi-sgi-q4-what-special-synthesis-step-is-requ", topic: "synth-dft", level: "Medium",
    q: "What special synthesis step is required when multiple RTL instances of a module exist?",
    a: "During synthesis, instantiation in RTL describes reusable module hierarchy. To allow the synthesis tool to perform independent timing optimization, cell sizing, and pin mapping for each instance based on its specific load and timing context, the command `UNIQUIFY` is run.\n• `UNIQUIFY` clones unique module definitions (e.g. `block_1`, `block_2`) for each instance, converting abstract models into optimized physical gate-level instances.",
  },
  {
    id: "vlsi-sgi-q5-what-are-tie-high-and-tie-low-cells", topic: "pd-signoff", level: "Easy",
    q: "What are tie-high and tie-low cells and where are they used?",
    a: "Tie-high and Tie-low cells are standard cells used to connect unused transistor gate inputs to VDD or VSS respectively.\n• Direct connection of gate oxide to power/ground rails can cause gate oxide breakdown or false switching during power/ground bounce transients.\n• Tie cells isolate the gate oxide through a high-resistance transistor channel, protecting sub-micron transistors.",
  },
  {
    id: "vlsi-sgi-q6-what-is-the-difference-between-latc", topic: "seq", level: "Medium",
    q: "What is the difference between latch-based and flip-flop-based designs?",
    a: "• Latches: Level-sensitive storage elements. Allow 'time borrowing' (cycle stealing), enabling higher clock frequencies by sharing time across pipeline stages, but significantly complicate Static Timing Analysis (STA) and increase susceptibility to race conditions.\n• Flip-Flops: Edge-triggered storage elements. Strict cycle-by-cycle boundaries make STA timing closure straightforward and robust against min-delay race conditions.",
  },
  {
    id: "vlsi-sgi-q7-what-are-high-vt-hvt-and-low-vt", topic: "pd-signoff", level: "Medium",
    q: "What are High-Vt (HVT) and Low-Vt (LVT) cells?",
    a: "• High-Vt (HVT) Cells: Higher threshold voltage ($V_{th}$). Slower switching speed and higher propagation delay, but substantially lower subthreshold static leakage current. Placed on non-timing-critical paths to conserve leakage power.\n• Low-Vt (LVT) Cells: Lower threshold voltage ($V_{th}$). Faster switching speed and lower delay, but significantly higher static leakage current. Placed exclusively on critical timing paths to close setup time.",
  },
  {
    id: "vlsi-sgi-q8-what-is-the-lef-format", topic: "pd-signoff", level: "Medium",
    q: "What is the LEF format?",
    a: "LEF (Library Exchange Format) is a Cadence standard ASCII specification describing standard cell and macro physical geometry without exposing proprietary transistor-level schematics.\n• Technology LEF: Defines metal layers, routing pitches, design rules, via definitions, and unit capacitances.\n• Macro LEF: Defines cell boundaries, pin locations, layers, obstruction blockages, and capacitive attributes for place-and-route tools.",
  },
  {
    id: "vlsi-sgi-q9-what-is-the-def-format", topic: "pd-signoff", level: "Medium",
    q: "What is the DEF format?",
    a: "DEF (Design Exchange Format) is an ASCII format used to represent the physical layout and placement/routing state of an ASIC design.\n• Contains die area, core boundary, placement coordinates of standard cells and macros, I/O pin placements, power grid stripes, and detailed routing geometry.",
  },
  {
    id: "vlsi-sgi-q10-what-are-the-steps-involved-in-desi", topic: "pd-signoff", level: "Hard",
    q: "What are the steps involved in designing an optimal padring?",
    a: "1. Place corner pads at all four chip corners to ensure power and ground rail continuity.\n2. Ensure padring meets ESD protection requirements and establish dedicated split power domains (Core VDD, I/O VDD, Analog VDD) with common ground.\n3. Ensure padring satisfies Simultaneous Switching Noise (SSN) limits.\n4. Place power cut / breaker cells to isolate noisy digital I/O from sensitive analog blocks.\n5. Match drive strength of clock and data pads in source-synchronous interfaces.\n6. Connect unused I/O pads to tie cells or fill with power pads to eliminate floating CMOS gates.",
  },
  {
    id: "vlsi-sgi-q11-what-is-metastability-and-how-do-yo", topic: "digital", level: "Hard",
    q: "What is metastability and how do you prevent it?",
    a: "Metastability is an indeterminate electrical state where a flip-flop's output hovers between logic 0 and 1 for an unpredictable duration, caused by setup or hold time violations when sampling asynchronous signals.\n\nPrevention:\n1. Multi-stage Synchronizers: Pass asynchronous inputs through 2-stage or 3-stage flip-flop synchronizers to exponentially increase Mean Time Between Failures (MTBF).\n2. Fast Flip-Flops: Use flip-flops with very narrow setup/hold timing windows.\n3. Asynchronous FIFOs for multi-bit clock domain crossing.",
  },
  {
    id: "vlsi-sgi-q12-what-do-local-skew-global-skew-an", topic: "sta-timing", level: "Hard",
    q: "What do local skew, global skew, and useful skew mean?",
    a: "• Local Skew: The difference in clock arrival times between the launch flip-flop and capture flip-flop of a specific timing path ($T_{skew} = T_{clk,capture} - T_{clk,launch}$).\n• Global Skew: The maximum difference in clock arrival times across all flip-flops belonging to the same clock domain across the entire die.\n• Useful Skew: Intentionally introducing clock delay to the capture flip-flop of a critical path to help resolve setup timing violations, provided hold time remains satisfied.",
  },
  {
    id: "vlsi-sgi-q13-what-are-the-four-fundamental-timin", topic: "sta-timing", level: "Medium",
    q: "What are the four fundamental timing paths checked in STA?",
    a: "1. In-to-Reg: Input port to register data pin.\n2. Reg-to-Reg: Clocked register output (Q) through combinational logic to receiving register data pin (D).\n3. Reg-to-Out: Register output through combinational logic to output port.\n4. In-to-Out: Pure combinational feedthrough from input port to output port.",
  },
  {
    id: "vlsi-sgi-q14-what-are-the-main-components-of-cmo", topic: "digital", level: "Hard",
    q: "What are the main components of CMOS leakage power?",
    a: "1. Sub-threshold Leakage ($I_{sub} \\propto e^{\\frac{V_{gs} - V_{th}}{n V_T}}$): Current flowing from drain to source when $V_{gs} < V_{th}$, worsened by Drain-Induced Barrier Lowering (DIBL).\n2. Gate Oxide Tunneling ($I_{gate}$): Quantum mechanical carrier tunneling through ultra-thin gate dielectric.\n3. Reverse-Biased Junction Band-to-Band Tunneling: Leakage across reverse-biased drain/source p-n junctions to the substrate/well.",
  },
  {
    id: "vlsi-sgi-q15-what-are-the-main-types-of-yield-lo", topic: "fab-silicon", level: "Medium",
    q: "What are the main types of yield loss in semiconductor manufacturing?",
    a: "1. Functional Yield Loss: Random catastrophic physical defects (spot defects, particulate contamination) causing open interconnects or inter-metal shorts.\n2. Parametric Yield Loss: Process variations (die-to-die, wafer-to-wafer variations in channel length, oxide thickness, and threshold voltage) causing chips to fail speed, frequency, or power specifications.",
  },
  {
    id: "vlsi-sgi-q16-what-is-a-virtual-clock-in-sta-and", topic: "sta-timing", level: "Medium",
    q: "What is a virtual clock in STA and why is it needed?",
    a: "A virtual clock is a clock defined in SDC constraints (`create_clock -name VCLK -period 10`) that is not physically connected to any pin or port of the current design.\n• Used to model external I/O timing relationships: defines the arrival time of input signals launched by an external chip or output signals captured by an external chip relative to an external clock source.",
  },
  {
    id: "vlsi-sgi-q17-what-variations-impact-timing-in-de", topic: "sta-timing", level: "Hard",
    q: "What variations impact timing in deep sub-micron designs?",
    a: "1. BEOL (Back-End-Of-Line) Metal: Metal thickness, wire width, and interlayer dielectric variations impacting wire resistance and capacitance ($-10\\%$ to $+25\\%$ delay).\n2. Environmental: Supply voltage drops (IR drop), ground bounce, and operating temperature variations ($\\pm 15\\%$ delay).\n3. Transistor Variations: $V_{th}$ fluctuations, channel length variations, and N/P device mismatch ($\\pm 10\\%$ delay).\n4. PLL & Clock: Clock jitter, duty cycle distortion, and phase error ($\\pm 10\\%$ delay).\n5. Device Aging: NBTI (Negative Bias Temperature Instability) and Hot Carrier Injection (HCI).",
  },
  {
    id: "vlsi-sgi-q18-what-are-the-essential-design-const", topic: "synth-dft", level: "Medium",
    q: "What are the essential design constraints provided during logic synthesis?",
    a: "1. Clock definitions: Clock period, duty cycle, clock waveform, and generated clocks.\n2. Clock uncertainty: Jitter, skew, and setup/hold timing margins.\n3. Input transition / Slew limits on input ports.\n4. Output capacitive load constraints (`set_load`).\n5. Input and output external delays (`set_input_delay`, `set_output_delay`).\n6. Timing exceptions: False paths (`set_false_path`) and multicycle paths (`set_multicycle_path`).\n7. Operating conditions and wireload models.",
  },
  {
    id: "vlsi-sgi-q19-which-verilog-constructs-are-unsupp", topic: "rtl-dv", level: "Easy",
    q: "Which Verilog constructs are unsupported by logic synthesis tools?",
    a: "• Procedural timing delays (`#10`, `wait`).\n• `initial` blocks (used strictly in testbenches, though supported by some FPGA tools for RAM initialization).\n• Non-synthesizable data types: `real`, `time`, `realtime`.\n• Dynamic simulation controls: `fork`/`join`, `force`/`release`, `$display`, `$finish`.\n• Functions with delays or infinite loops.",
  },
  {
    id: "vlsi-sgi-q20-what-are-the-intrinsic-and-parasiti", topic: "analog-physics", level: "Hard",
    q: "What are the intrinsic and parasitic capacitances within a MOSFET?",
    a: "1. Gate Capacitances: Gate-to-channel capacitance ($C_{ox} = W \\cdot L \\cdot \\frac{\\varepsilon_{ox}}{t_{ox}}$), partitioned into gate-to-source ($C_{gs}$) and gate-to-drain ($C_{gd}$).\n2. Overlap Capacitances ($C_{os}$, $C_{od}$): Parasitic overlap between gate electrode and source/drain diffusion regions.\n3. Junction Capacitances ($C_{js}$, $C_{jd}$): Reverse-biased p-n junction depletion capacitances between source/drain diffusions and substrate/well.",
  },
  {
    id: "vlsi-sgi-q21-how-does-the-i-ds-v-ds-charac", topic: "analog-physics", level: "Medium",
    q: "How does the $I_{ds}-V_{ds}$ characteristic curve of a MOSFET behave with increasing $V_{gs}$?",
    a: "• Linear (Triode) Region ($V_{ds} < V_{gs} - V_{th}$): Current increases almost linearly with $V_{ds}$ as $I_{ds} = \\mu_n C_{ox} \\frac{W}{L} \\left[(V_{gs}-V_{th})V_{ds} - \\frac{V_{ds}^2}{2}\\right]$.\n• Saturation Region ($V_{ds} \\ge V_{gs} - V_{th}$): Channel pinches off at the drain side; current saturates to $I_{ds,sat} = \\frac{1}{2} \\mu_n C_{ox} \\frac{W}{L} (V_{gs}-V_{th})^2(1 + \\lambda V_{ds})$.\n• Increasing $V_{gs}$ increases channel carrier density, shifting saturation current upward quadratically.",
  },
  {
    id: "vlsi-sgi-q22-describe-the-basic-physical-operati", topic: "analog-physics", level: "Medium",
    q: "Describe the basic physical operation of an n-channel MOSFET.",
    a: "An NMOS transistor is fabricated on a p-type silicon substrate with two heavily doped $n^+$ regions (source and drain).\n• When $V_{gs} = 0\\,\\text{V}$, back-to-back p-n junctions prevent current flow between drain and source.\n• Applying $V_{gs} > V_{th}$ repels holes and attracts minority electrons to the silicon-oxide interface, creating an inverted n-type conductive channel connecting source and drain.\n• Applying $V_{ds} > 0\\,\\text{V}$ causes electrons to drift from source to drain, conducting drain current $I_{ds}$.",
  },
  {
    id: "vlsi-sgi-q23-what-is-channel-length-modulation-i", topic: "analog-physics", level: "Medium",
    q: "What is channel length modulation in MOSFETs?",
    a: "In saturation ($V_{ds} > V_{gs} - V_{th}$), the pinch-off point moves away from the drain toward the source as $V_{ds}$ increases, expanding the drain depletion region ($L_d$).\n• The effective channel length decreases to $L_{eff} = L - L_d$.\n• Because current is inversely proportional to $L_{eff}$, $I_{ds}$ exhibits a finite upward slope in saturation, modeled by $(1 + \\lambda V_{ds})$.",
  },
  {
    id: "vlsi-sgi-q24-what-is-the-body-effect-in-mosfets", topic: "analog-physics", level: "Hard",
    q: "What is the body effect in MOSFETs?",
    a: "Body effect (substrate sensitivity) is the increase in threshold voltage ($V_{th}$) when the source-to-substrate voltage ($V_{sb}$) becomes reverse-biased:\n§F: Body Effect Equation\n`V_{th} = V_{th0} + \\gamma \\left(\\sqrt{2\\phi_F + V_{sb}} - \\sqrt{2\\phi_F}\\right)`\n• When $V_{sb} > 0$, the depletion layer under the gate widens, exposing more uncompensated negative acceptor ions. A larger gate voltage is required to achieve inversion, increasing $V_{th}$ and slowing down stacked transistors.",
  },
  {
    id: "vlsi-sgi-q25-what-is-latch-up-in-cmos-design-and", topic: "analog-physics", level: "Hard",
    q: "What is latch-up in CMOS design and how do you prevent it?",
    a: "Latch-up is a catastrophic low-impedance short-circuit between VDD and VSS caused by the cross-coupled parasitic BJT structure in bulk CMOS (vertical PNP from PMOS/N-well/P-sub and lateral NPN from NMOS/P-sub/N-well) forming a parasitic Silicon Controlled Rectifier (SCR).\n\nTrigger: Substrate or well current creates a voltage drop across parasitic well/substrate resistors ($R_{well}, R_{sub}$), turning on one BJT which drives the other into regenerative saturation.\n\nPrevention:\n1. Guard Rings: Place $p^+$ guard rings tied to GND around NMOS and $n^+$ guard rings tied to VDD around PMOS.\n2. Tap Frequency: Maximize substrate/well contact density close to transistor source terminals to minimize $R_{sub}$ and $R_{well}$.\n3. Trench Isolation: Use Deep Trench Isolation (DTI) or SOI substrates.",
  },
  {
    id: "vlsi-sgi-q26-what-is-standard-library-characteri", topic: "pd-signoff", level: "Medium",
    q: "What is standard library characterization?",
    a: "Library characterization is the process of performing extensive SPICE transistor-level circuit simulations across multiple Process, Voltage, and Temperature (PVT) corners to measure cell timing, propagation delay, output slew, and dynamic/leakage power.\n• The resulting lookup tables (Liberty `.lib` format) drive logic synthesis, STA, and power analysis tools.",
  },
  {
    id: "vlsi-sgi-q27-what-is-a-wireload-model", topic: "pd-signoff", level: "Easy",
    q: "What is a wireload model?",
    a: "A statistical model used in pre-layout logic synthesis to estimate interconnect wire delay and wire capacitance based solely on cell fanout before physical placement exists.",
  },
  {
    id: "vlsi-sgi-q28-what-measures-are-taken-to-meet-sig", topic: "pd-signoff", level: "Hard",
    q: "What measures are taken to meet Signal Integrity (SI) targets?",
    a: "1. Double Pitch / Wide Spacing: Space out critical high-frequency nets and clock lines to reduce cross-coupling capacitance ($C_{cross}$).\n2. Shielding: Route ground/power shield tracks parallel to sensitive clock or victim nets.\n3. Buffer Insertion: Insert repeaters to break long parallel net runs.\n4. Orthogonal Routing: Route adjacent metal layers strictly in alternating orthogonal directions (e.g. M3 horizontal, M4 vertical).",
  },
  {
    id: "vlsi-sgi-q29-what-design-measures-improve-silico", topic: "fab-silicon", level: "Medium",
    q: "What design measures improve silicon manufacturing yield?",
    a: "1. Redundant Vias: Place double or multi-cut vias to prevent open-circuit yield loss from single via failure.\n2. DFM Rules: Enforce strict spacing rules and avoid sharp 90° metal corners to prevent lithographic pinching/bridging.\n3. Memory Redundancy: Implement spare rows/columns in large SRAM macros with BIST/BISR.\n4. Poly Orientation: Maintain uniform poly gate orientation across standard cells.",
  },
  {
    id: "vlsi-sgi-q30-what-precautions-are-taken-when-int", topic: "analog-physics", level: "Hard",
    q: "What precautions are taken when integrating analog and digital circuitry on the same chip?",
    a: "1. Physical Separation: Keep sensitive analog blocks isolated in separate chip corners away from noisy high-speed digital switching logic.\n2. Split Power & Ground: Use dedicated analog power/ground pins (`VDDA`, `VSSA`) with separate bond pads to prevent digital ground bounce from corrupting analog signals.\n3. Guard Rings: Surround analog blocks with grounded double guard rings.\n4. Clock Dithering: Spread digital clock spectral peaks.",
  },
  {
    id: "vlsi-sgi-q31-what-steps-are-involved-in-an-engin", topic: "pd-signoff", level: "Medium",
    q: "What steps are involved in an Engineering Change Order (ECO)?",
    a: "An ECO modifies an existing post-synthesis or post-route netlist to fix functional or timing bugs without re-running the entire place-and-route flow from scratch.\n• Pre-routes spare cells distributed across the layout to implement small logic patches.\n• Preserves existing untouched placement and routing to maintain closed timing.",
  },
  {
    id: "vlsi-sgi-q32-what-steps-are-performed-to-achieve", topic: "pd-signoff", level: "Medium",
    q: "What steps are performed to achieve a lithography-friendly design (DFM)?",
    a: "1. Uniform poly and metal pitch across standard cell layouts.\n2. Spreading wire traces in non-congested routing areas.\n3. Adding dummy metal fill patterns to ensure uniform Chemical-Mechanical Planarization (CMP) oxide thickness.\n4. Using Optical Proximity Correction (OPC) aware layout structures.",
  },
  {
    id: "vlsi-sgi-q33-what-does-logic-synthesis-mean", topic: "synth-dft", level: "Easy",
    q: "What does logic synthesis mean?",
    a: "Logic synthesis is the automated electronic design process of translating high-level RTL code (Verilog/VHDL) into an optimized gate-level netlist mapped to specific target standard-cell library gates, satisfying user-specified timing, power, and area constraints.",
  },
  {
    id: "vlsi-sgi-q34-what-are-the-mandatory-inputs-requi", topic: "synth-dft", level: "Easy",
    q: "What are the mandatory inputs required for logic synthesis?",
    a: "1. RTL source files (Verilog/VHDL/SystemVerilog).\n2. Target Technology Standard Cell Libraries (`.lib` / `.db` files).\n3. Design Constraints File (SDC format defining clocks, I/O delays, operating corners).\n4. Tmax / Wireload Models or Physical Floorplan DEF (for physical synthesis).",
  },
  {
    id: "vlsi-sgi-q35-explain-the-logic-synthesis-referen", topic: "synth-dft", level: "Medium",
    q: "Explain the logic synthesis reference flow.",
    a: "1. Read & Analyze RTL: Parses HDL syntax and checks for elaboration errors.\n2. Generic Elaboration: Translates RTL into technology-independent GTECH boolean primitives.\n3. Apply Constraints: Loads SDC timing, area, and power goals.\n4. Logic Optimization: Removes redundant logic, flattens boolean expressions, and performs constant folding.\n5. Technology Mapping: Maps generic logic into target library standard cells (`.lib`).\n6. Gate-level Timing Verification & Netlist Export (`.v`, `.sdc`).",
  },
  {
    id: "vlsi-sgi-q36-what-are-the-various-ways-to-reduce", topic: "pd-signoff", level: "Hard",
    q: "What are the various ways to reduce clock insertion delay?",
    a: "1. Minimize the physical distance between PLL clock source and clock sinks.\n2. Balance clock sinks across clock tree levels using symmetric H-tree topologies.\n3. Upsize clock buffers and inverters for higher drive strength.\n4. Optimize Integrated Clock Gating (ICG) cell placement closer to root/branch points.\n5. Route clock networks on thick, low-resistance top metal layers (M7-M9).",
  },
  {
    id: "vlsi-sgi-q37-what-are-the-common-functional-veri", topic: "rtl-dv", level: "Medium",
    q: "What are the common functional verification methodologies?",
    a: "• Transaction-Level Modeling (TLM) in SystemC.\n• Static Linting and CDC checking.\n• Direct and Constrained-Random RTL Simulation (UVM/SystemVerilog).\n• Gate-Level Simulation (GLS) with SDF timing annotation.\n• Formal Property Verification (Model Checking).\n• Hardware Emulation and FPGA Prototyping.",
  },
  {
    id: "vlsi-sgi-q38-what-does-formal-verification-mean", topic: "rtl-dv", level: "Medium",
    q: "What does formal verification mean?",
    a: "Formal verification uses mathematical techniques to exhaustively prove that a hardware design satisfies specified properties or is functionally equivalent to a golden model, without requiring simulation test vectors.\n• Logic Equivalence Checking (LEC): Proves RTL matches synthesized netlist.\n• Model Checking: Proves SystemVerilog Assertions (SVA) hold true under all possible input sequences.",
  },
  {
    id: "vlsi-sgi-q39-how-do-you-time-input-and-output-pa", topic: "sta-timing", level: "Hard",
    q: "How do you time input and output paths in STA? What is a false path?",
    a: "• Input Path Timing: Constrained using `set_input_delay` relative to an external clock, modeling the delay from an external transmitting chip through board traces to the chip input pad.\n• Output Path Timing: Constrained using `set_output_delay` relative to a clock, modeling board trace and external receiver setup requirements.\n• False Path: A physical circuit path that can never be sensitized or exercised during functional operation (e.g. test mode logic during normal mode, or cross-domain signals synchronized with FIFOs), declared via `set_false_path` to prevent STA tools from wasting optimization effort.",
  },
  {
    id: "vlsi-sgi-q40-what-is-a-multicycle-path-in-sta", topic: "sta-timing", level: "Medium",
    q: "What is a multicycle path in STA?",
    a: "A multicycle path is a register-to-register timing path where the design intent allows data multiple clock cycles to propagate from the launch flip-flop to the capture flip-flop before being latched.\n• Constrained using `set_multicycle_path -setup N -from [get_pins ...] -to [get_pins ...]`.\n• Relaxes setup timing to $N \\times T_{clk}$ while maintaining appropriate hold check boundaries.",
  },
  {
    id: "vlsi-sgi-q41-what-are-source-synchronous-timing", topic: "sta-timing", level: "Hard",
    q: "What are source-synchronous timing paths?",
    a: "A high-speed interface where the transmitting chip generates and sends both the data bus and the synchronizing strobe/clock signal together across the board.\n• Because clock and data travel parallel physical paths experiencing similar board trace delays, timing margins depend on data-to-clock skew rather than absolute clock propagation latency (e.g. DDR memory interfaces).",
  },
  {
    id: "vlsi-sgi-q42-how-does-an-sta-tool-behave-if-late", topic: "sta-timing", level: "Hard",
    q: "How does an STA tool behave if latency is defined on both master and generated clocks?",
    a: "When clocks are set to propagated mode after Clock Tree Synthesis (CTS), the STA tool honors the generated clock's source and network latency numbers, overriding and ignoring the master clock's network latency on the generated clock domain.",
  },
  {
    id: "vlsi-sgi-q43-how-do-you-preserve-specific-logic", topic: "synth-dft", level: "Easy",
    q: "How do you preserve specific logic hierarchies from optimization during synthesis?",
    a: "Apply the `set_dont_touch` constraint on specific nets, cells, or instances, or `set_dont_touch_network` on clock/reset trees, instructing the synthesis tool to leave that logic untouched.",
  },
  {
    id: "vlsi-sgi-q44-what-is-the-purpose-of-uniquify-in", topic: "synth-dft", level: "Medium",
    q: "What is the purpose of UNIQUIFY in logic synthesis?",
    a: "When an RTL module is instantiated multiple times, `UNIQUIFY` creates distinct, independently named copies of the module design database for each instance, allowing the synthesis engine to customize gate sizing and boolean optimization for each individual instance's unique load and timing environment.",
  },
  {
    id: "vlsi-sgi-q45-what-is-the-difference-between-an-e", topic: "rtl-dv", level: "Medium",
    q: "What is the difference between an event and an assertion in verification?",
    a: "• Event: A discrete change in signal value or state (e.g. `@(posedge clk)`) evaluated by event-driven dynamic simulators during runtime simulation.\n• Assertion: A declarative formal property statement (written in SVA/PSL) that defines an invariant condition that must always hold true across all clock cycles.",
  },
  {
    id: "vlsi-sgi-q46-what-is-clock-skew-what-problems-d", topic: "sta-timing", level: "Hard",
    q: "What is clock skew? What problems does it cause and how is it minimized?",
    a: "Clock skew is the difference in arrival times of the active clock edge at two different flip-flops within the same clock domain.\n• Positive Skew (clock arrives later at capture flop): Helps setup time ($T_{clk} \\ge T_{cq} + T_{comb} + T_{setup} - T_{skew}$), but worsens hold time ($T_{cq} + T_{comb} \\ge T_{hold} + T_{skew}$).\n• Negative Skew (clock arrives earlier at capture flop): Worsens setup time, helps hold time.\n• Minimized via Clock Tree Synthesis (CTS) using balanced H-tree or fishbone buffer distributions.",
  },
  {
    id: "vlsi-sgi-q47-what-is-timing-slack-in-static-timi", topic: "sta-timing", level: "Easy",
    q: "What is timing slack in Static Timing Analysis?",
    a: "Slack is the difference between the required arrival time and the actual data arrival time: $\\text{Slack} = T_{required} - T_{arrival}$.\n• Positive Slack: Path meets timing constraints with margin.\n• Negative Slack: Timing violation exists; circuit will fail to operate at the specified clock frequency.",
  },
  {
    id: "vlsi-sgi-q48-what-is-a-clock-glitch-and-how-do-y", topic: "seq", level: "Medium",
    q: "What is a clock glitch and how do you overcome it?",
    a: "A clock glitch is an unwanted narrow voltage spike or hazard on a clock line caused by combinational gating of the clock with asynchronous enable signals.\n• Overcome by using Integrated Clock Gating (ICG) cells consisting of a negative-level-sensitive latch driving an AND gate, ensuring enable transitions only when clock is LOW.",
  },
  {
    id: "vlsi-sgi-q49-how-do-you-configure-an-xor-gate-as", topic: "digital", level: "Easy",
    q: "How do you configure an XOR gate as an inverter or a buffer?",
    a: "• Inverter: Connect one input to logic `1` (VCC). $Y = A \\oplus 1 = \\bar{A}$.\n• Buffer: Connect one input to logic `0` (GND). $Y = A \\oplus 0 = A$.",
  },
  {
    id: "vlsi-sgi-q50-what-is-the-difference-between-a-la", topic: "seq", level: "Easy",
    q: "What is the difference between a latch and a flip-flop?",
    a: "• Latch: Level-sensitive storage element (transparent when enable is active, latches data when inactive).\n• Flip-Flop: Edge-triggered storage element (samples data strictly on clock transition: rising or falling edge).",
  },
  {
    id: "vlsi-sgi-q51-how-do-you-implement-a-4-1-multiple", topic: "comb", level: "Easy",
    q: "How do you implement a 4:1 multiplexer using only 2:1 multiplexers?",
    a: "Use three 2:1 multiplexers arranged in a two-stage tree:\n• Stage 1: Mux 1 selects between `I0` and `I1` using select line `S0`. Mux 2 selects between `I2` and `I3` using `S0`.\n• Stage 2: Mux 3 selects between the outputs of Mux 1 and Mux 2 using select line `S1` to produce output `Y`.",
  },
  {
    id: "vlsi-sgi-q52-what-is-the-difference-between-heap", topic: "emb-c", level: "Easy",
    q: "What is the difference between heap and stack memory in C?",
    a: "• Stack: LIFO memory managed automatically by the CPU, used for local variables and function call frames. Fast and deterministic, fixed size.\n• Heap: Dynamic memory pool managed manually by firmware via `malloc()`/`free()`. Flexible size, but non-deterministic allocation time with fragmentation risks.",
  },
  {
    id: "vlsi-sgi-q53-what-is-the-fundamental-difference", topic: "rtl-dv", level: "Easy",
    q: "What is the fundamental difference between Mealy and Moore FSMs?",
    a: "• Moore FSM: Outputs depend solely on the current state register ($Y = f(S)$). Output updates synchronously with clock edges.\n• Mealy FSM: Outputs depend on current state AND current inputs ($Y = f(S, X)$). Reacts immediately to inputs within the cycle, but inputs can introduce glitches to outputs.",
  },
  {
    id: "vlsi-sgi-q54-what-is-the-difference-between-one", topic: "rtl-dv", level: "Medium",
    q: "What is the difference between one-hot and binary state encoding?",
    a: "• Binary Encoding: States are encoded as binary numbers; requires $\\lceil \\log_2(N) \\rceil$ flip-flops for $N$ states. Uses fewer flip-flops but more combinational next-state decode logic.\n• One-Hot Encoding: Exactly one flip-flop is active (HIGH) per state; requires $N$ flip-flops for $N$ states. Preferred in FPGAs because flip-flops are abundant and decode logic is simpler and faster.",
  },
  {
    id: "vlsi-sgi-q55-what-are-the-common-techniques-for", topic: "digital", level: "Hard",
    q: "What are the common techniques for Clock Domain Crossing (CDC) synchronization?",
    a: "1. 2-Flop / 3-Flop Synchronizer: For single-bit control signals crossing into a destination clock domain.\n2. Handshake Protocol: `Req`/`Ack` 4-phase handshake for multi-bit data transfers.\n3. Asynchronous FIFO: Uses dual-port RAM with Gray-code read/write pointers for high-throughput multi-bit data streaming.\n4. Pulse Synchronizer (Toggle Synchronizer): For capturing narrow pulses across clock domains.",
  },
  {
    id: "vlsi-sgi-q56-how-do-you-calculate-the-maximum-op", topic: "sta-timing", level: "Medium",
    q: "How do you calculate the maximum operating clock frequency of a sequential path?",
    a: "§F: Max Frequency Equation\n`T_{clk,min} = T_{cq} + T_{comb,max} + T_{setup} - T_{skew}`\n`f_{max} = \\frac{1}{T_{clk,min}}`\n• $T_{cq}$: Flip-flop clock-to-Q delay.\n• $T_{comb,max}$: Maximum propagation delay through combinational logic.\n• $T_{setup}$: Setup time of capture flip-flop.\n• $T_{skew}$: Clock skew ($T_{clk,capture} - T_{clk,launch}$).",
  },
  {
    id: "vlsi-sgi-q57-how-do-static-timing-analysis-tools", topic: "sta-timing", level: "Medium",
    q: "How do Static Timing Analysis tools determine the critical path?",
    a: "STA tools perform forward topological propagation to calculate the arrival time ($T_{arr}$) at every node and backward backward traversal from endpoints to calculate required arrival time ($T_{req}$).\n• The path with the minimum (most negative) slack ($\\text{Slack} = T_{req} - T_{arr}$) is the critical path.",
  },
  {
    id: "vlsi-sgi-q58-design-a-state-diagram-for-an-fsm-d", topic: "rtl-dv", level: "Medium",
    q: "Design a state diagram for an FSM detecting the sequence '0110' without reuse of leading zeros.",
    a: "FSM with 5 states:\n• S0 (Reset, Out=0): On 0 -> S1; on 1 -> S0.\n• S1 (Saw '0', Out=0): On 1 -> S2; on 0 -> S1.\n• S2 (Saw '01', Out=0): On 1 -> S3; on 0 -> S1.\n• S3 (Saw '011', Out=0): On 0 -> S4; on 1 -> S0.\n• S4 (Saw '0110', Out=1): On 0 -> S1; on 1 -> S2.",
  },
  {
    id: "vlsi-sgi-q59-how-do-you-achieve-an-exact-180-cl", topic: "digital", level: "Medium",
    q: "How do you achieve an exact 180° clock phase shift in an FPGA?",
    a: "Do not use an inverter, as gate propagation delay varies with PVT.\n• Use dedicated on-chip clock management resources: PLL (Phase Locked Loop), MMCM (Mixed-Mode Clock Manager), or DCM (Digital Clock Manager) configured for an exact 180° phase-shifted clock output.\n• Alternatively, use differential clock buffers (`BUFGDS`).",
  },
  {
    id: "vlsi-sgi-q60-what-is-the-significance-of-ras-and", topic: "spec-arch", level: "Medium",
    q: "What is the significance of RAS and CAS in SDRAM?",
    a: "SDRAM uses a multiplexed address bus to reduce pin count:\n• RAS (Row Address Strobe): Latches the row address to open an entire memory row in the DRAM bank.\n• CAS (Column Address Strobe): Latches the column address to read or write the specific byte/word from the open row buffer.\n• CAS Latency ($CL$) is the delay in clock cycles between sending CAS and data availability.",
  },
  {
    id: "vlsi-sgi-q61-what-are-the-primary-applications-o", topic: "digital", level: "Easy",
    q: "What are the primary applications of a buffer in digital design?",
    a: "1. High Fan-out Driving: Increases signal drive strength (`BUFG`) to drive many receiving gates.\n2. Delay Insertion: Solves hold-time violations by adding controlled data path latency.\n3. Signal Slew Restoration: Restores sharp transition edges on long wires.\n4. Clock Tree Balancing: Balances clock arrival across clock tree branches.",
  },
  {
    id: "vlsi-sgi-q62-how-do-you-implement-a-2-input-and", topic: "comb", level: "Easy",
    q: "How do you implement a 2-input AND gate using a 2:1 multiplexer?",
    a: "Connect input `A` to the multiplexer select line `S`:\n• Connect input `0` (`I0`) to logic `0` (GND).\n• Connect input `1` (`I1`) to input `B`.\n• Output $Y = \\bar{A} \\cdot 0 + A \\cdot B = A \\cdot B$.",
  },
  {
    id: "vlsi-sgi-q63-what-arithmetic-operation-occurs-wh", topic: "number", level: "Easy",
    q: "What arithmetic operation occurs when a register is shifted left or right?",
    a: "• Shift Left by 1 bit (with LSB zero-fill): Multiplies the integer value by 2 ($X \\times 2$).\n• Shift Right by 1 bit: Divides the integer value by 2 ($\\lfloor X / 2 \\rfloor$).",
  },
  {
    id: "vlsi-sgi-q64-calculate-required-fifo-depth-f", topic: "digital", level: "Numerical",
    q: "Calculate required FIFO depth: $f_{wr} = 25\\,\\text{MHz}$, $f_{rd} = 100\\,\\text{MHz}$ with $25\\%$ read duty cycle.",
    a: "§F: FIFO Depth Equation\n`\\text{Depth} = \\text{Burst Items} - \\text{Read Items during burst}`\n\n§C: Calculation Steps\n1. Burst write: 100 items at 25 MHz ($T_{wr} = 40\\,\\text{ns}$) -> Burst Duration = $100 \\times 40\\,\\text{ns} = 4000\\,\\text{ns}$.\n2. Read side operates at 100 MHz ($T_{rd} = 10\\,\\text{ns}$) with 25% active duty cycle -> Active Read Time = $0.25 \\times 4000\\,\\text{ns} = 1000\\,\\text{ns}$.\n3. Items read during burst = $1000\\,\\text{ns} / 10\\,\\text{ns} = 100$ items.\n4. If burst is 100 writes and 25 reads happen: Backlog = $100 - 25 = 75$.\n\n§R: Result\nRequired FIFO Depth = 75 entries.",
  },
  {
    id: "vlsi-sgi-q65-how-do-you-design-a-4-input-nand-ga", topic: "comb", level: "Easy",
    q: "How do you design a 4-input NAND gate using only 2-input NAND gates?",
    a: "Requires 5 two-input NAND gates:\n1. NAND1 computes $\\overline{AB}$. NAND2 (inverter: tied inputs) produces $AB$.\n2. NAND3 computes $\\overline{CD}$. NAND4 (inverter) produces $CD$.\n3. NAND5 computes $\\overline{(AB) \\cdot (CD)} = \\overline{ABCD}$.",
  },
  {
    id: "vlsi-sgi-q66-what-is-the-difference-between-sync", topic: "digital", level: "Medium",
    q: "What is the difference between synchronous and asynchronous reset?",
    a: "• Synchronous Reset: Reset is sampled strictly on the active clock edge. Filters out reset glitches, but requires a running clock and adds combinational gate delay to the data path.\n• Asynchronous Reset: Resets flip-flops immediately regardless of clock presence. Ideal for power-on reset, but de-assertion (reset removal) must be synchronized to prevent metastability.",
  },
  {
    id: "vlsi-sgi-q67-why-are-active-low-signals-and-inte", topic: "digital", level: "Medium",
    q: "Why are active-low signals and interrupts widely preferred in hardware?",
    a: "1. NMOS Pull-Down Speed: In CMOS open-drain/open-collector buses, NMOS pull-down transistors conduct electrons (3x higher mobility than PMOS holes), discharging line capacitance faster and providing stronger pull-down drive.\n2. Wired-OR / Wired-AND compatibility.\n3. Noise margin safety against ground bounce.",
  },
  {
    id: "vlsi-sgi-q68-give-two-ways-to-convert-a-2-input", topic: "comb", level: "Easy",
    q: "Give two ways to convert a 2-input NAND gate into an inverter.",
    a: "1. Tie both inputs together ($A = B$) and connect the input signal to the common node ($Y = \\overline{A \\cdot A} = \\bar{A}$).\n2. Connect one input to logic `1` (VDD) and apply the input signal to the second input ($Y = \\overline{A \\cdot 1} = \\bar{A}$).",
  },
  {
    id: "vlsi-sgi-q69-between-setup-and-hold-constraints", topic: "sta-timing", level: "Easy",
    q: "Between setup and hold constraints, which determines maximum operating frequency?",
    a: "Setup time constraint determines the maximum operating frequency ($f_{max} = 1 / T_{clk,min}$).\nHold time constraint is independent of clock frequency (single-edge check) and must be met by ensuring sufficient minimum data path delay.",
  },
  {
    id: "vlsi-sgi-q70-what-is-the-key-functional-differen", topic: "seq", level: "Easy",
    q: "What is the key functional difference between a D-latch and a D flip-flop?",
    a: "• D-Latch: Level-sensitive device; output transparently tracks input D while Enable is HIGH and latches current state when Enable is LOW.\n• D Flip-Flop: Edge-triggered device; captures input D strictly on the active clock transition (rising/falling edge), maintaining a stable output during the rest of the cycle.",
  },
  {
    id: "vlsi-sgi-q71-what-is-a-multiplexer", topic: "comb", level: "Easy",
    q: "What is a multiplexer?",
    a: "A combinational digital logic circuit that selects binary data from one of $2^N$ input lines and routes it to a single output line based on $N$ select lines (data selector).",
  },
  {
    id: "vlsi-sgi-q72-how-do-you-convert-an-sr-flip-flop", topic: "seq", level: "Easy",
    q: "How do you convert an SR flip-flop into a JK flip-flop?",
    a: "By adding feedback from the outputs to the inputs:\n• $S = J \\cdot \\bar{Q}$\n• $R = K \\cdot Q$\nEliminates the invalid/forbidden state ($S=1, R=1$) by converting it into a toggle state ($J=1, K=1$).",
  },
  {
    id: "vlsi-sgi-q73-how-do-you-convert-a-jk-flip-flop-i", topic: "seq", level: "Easy",
    q: "How do you convert a JK flip-flop into a D flip-flop?",
    a: "Connect the $D$ input directly to $J$, and connect the inverted $D$ input (via an inverter $\\bar{D}$) to $K$ ($J = D, K = \\bar{D}$).",
  },
  {
    id: "vlsi-sgi-q74-what-is-the-race-around-condition-i", topic: "seq", level: "Medium",
    q: "What is the race-around condition in a JK flip-flop and how is it eliminated?",
    a: "When $J=1, K=1$ and clock pulse width $t_p > t_{pd}$ (propagation delay of flip-flop), the output complements repeatedly (toggles continuously) during a single clock pulse, creating an indeterminate output at clock fall.\n\nElimination:\n1. Master-Slave JK Flip-Flop construction.\n2. Edge-triggered flip-flop design.\n3. Ensuring clock pulse width $t_p < t_{pd}$.",
  },
  {
    id: "vlsi-sgi-q75-how-do-you-check-if-two-8-bit-digit", topic: "comb", level: "Easy",
    q: "How do you check if two 8-bit digital buses A and B are equal?",
    a: "Bitwise XOR each pair of bits ($X_i = A_i \\oplus B_i$ for $i = 0 \\dots 7$). Feed all 8 XOR outputs into an 8-input NOR gate. If $A = B$, all XOR outputs are 0, producing a NOR output of `1`.",
  },
  {
    id: "vlsi-sgi-q76-a-7-bit-ring-counter-is-initialized", topic: "seq", level: "Easy",
    q: "A 7-bit ring counter is initialized to `0100010`. After how many clock cycles will it return to this initial state?",
    a: "7 clock cycles. An $N$-bit ring counter has a repeating period of exactly $N$ clock cycles.",
  },
  {
    id: "vlsi-sgi-q77-calculate-f-max-for-a-d-ff-divi", topic: "sta-timing", level: "Numerical",
    q: "Calculate $f_{max}$ for a D-FF divide-by-2 circuit ($T_{setup}=6\\,\\text{ns}$, $T_{hold}=2\\,\\text{ns}$, $T_{pd}=10\\,\\text{ns}$).",
    a: "§F: Clock Period Equation\n`T_{clk,min} = T_{pd} + T_{setup}`\n`f_{max} = \\frac{1}{T_{clk,min}}`\n\n§C: Calculation Steps\n1. Minimum Clock Period: `T_{min} = 10\\,\\text{ns} + 6\\,\\text{ns} = 16\\,\\text{ns}`.\n2. Maximum Clock Frequency: `f_{max} = 1 / 16\\,\\text{ns} = 62.5\\,\\text{MHz}`.\n\n§R: Result\nMaximum frequency of operation = 62.5 MHz.",
  },
  {
    id: "vlsi-sgi-q78-how-do-you-implement-all-basic-gate", topic: "comb", level: "Medium",
    q: "How do you implement all basic gates (NOT, AND, OR, NAND, NOR, XOR, XNOR) using a 2:1 MUX?",
    a: "With 2:1 Mux (inputs `I0`, `I1`, select `S`):\n• NOT: `S = A`, `I0 = 1`, `I1 = 0` ($Y = \\bar{A}$)\n• AND: `S = A`, `I0 = 0`, `I1 = B` ($Y = AB$)\n• OR: `S = A`, `I0 = B`, `I1 = 1` ($Y = A + B$)\n• NAND: Invert output of AND mux using NOT mux.\n• NOR: Invert output of OR mux using NOT mux.\n• XOR: `S = A`, `I0 = B`, `I1 = \\bar{B}` ($Y = A \\oplus B$)\n• XNOR: `S = A`, `I0 = \\bar{B}`, `I1 = B` ($Y = \\overline{A \\oplus B}$)",
  },
  {
    id: "vlsi-sgi-q79-how-does-a-cascade-of-n-xnor-gates", topic: "comb", level: "Medium",
    q: "How does a cascade of N XNOR gates behave for N inputs?",
    a: "• If $N$ is ODD: Acts as an Even Parity Detector (output is 1 if inputs contain an even number of 1s) / Odd Parity Generator.\n• If $N$ is EVEN: Acts as an Odd Parity Detector / Even Parity Generator.",
  },
  {
    id: "vlsi-sgi-q80-how-many-2-input-nand-gates-are-nee", topic: "comb", level: "Medium",
    q: "How many 2-input NAND gates are needed to implement fail-safe sensor logic with 3 sensors and 1 emergency switch?",
    a: "Minimum of 6 two-input NAND gates.\n• Logic function: $F = \\overline{\\text{EMERG}} \\cdot \\overline{(S1 \\cdot S2 + S2 \\cdot S3 + S1 \\cdot S2 \\cdot S3)}$.",
  },
  {
    id: "vlsi-sgi-q81-how-do-you-design-a-squarer-circuit", topic: "comb", level: "Medium",
    q: "How do you design a squarer circuit ($N^2$) without using a hardware multiplier?",
    a: "Using the summation property of consecutive odd numbers:\n$1^2 = 1$\n$2^2 = 1 + 3 = 4$\n$3^2 = 4 + 5 = 9$\n$4^2 = 9 + 7 = 16$\n$N^2 = \\sum_{k=1}^N (2k - 1)$.\nImplemented using an adder, an accumulator register, and an odd-number counter ($+2$), computing $N^2$ in $N$ clock cycles without multipliers.",
  },
  {
    id: "vlsi-sgi-q82-how-do-you-convert-a-full-adder-int", topic: "comb", level: "Easy",
    q: "How do you convert a full adder into a full subtractor?",
    a: "Connect all bits of the subtrahend input ($B$) through XOR gates with the other XOR input tied to `1` (inverting $B$), and set the carry-in bit $C_{in} = 1$ to compute 2's complement addition ($A - B = A + \\bar{B} + 1$).",
  },
  {
    id: "vlsi-sgi-q83-why-is-hold-time-independent-of-clo", topic: "sta-timing", level: "Medium",
    q: "Why is hold time independent of clock frequency?",
    a: "Hold time check occurs at the same clock edge (single-edge constraint) to ensure newly launched data from cycle $N$ does not race ahead and overwrite captured data before $T_{hold}$ is satisfied. Changing the clock period ($T_{clk}$) shifts the NEXT clock edge, which affects setup checks but has zero effect on the current clock edge.",
  },
  {
    id: "vlsi-sgi-q84-what-are-the-unused-states-in-a-3-b", topic: "seq", level: "Easy",
    q: "What are the unused states in a 3-bit Johnson counter?",
    a: "Total possible binary states = $2^n = 2^3 = 8$. A Johnson counter has $2n = 6$ valid states (`000 -> 100 -> 110 -> 111 -> 011 -> 001`).\n• Number of unused states = $2^n - 2n = 8 - 6 = 2$ states: `010` and `101`.",
  },
  {
    id: "vlsi-sgi-q85-how-do-you-design-a-minimal-hardwar", topic: "digital", level: "Medium",
    q: "How do you design a minimal hardware encryption system for 8-bit parallel data?",
    a: "Use a Look-Up Table (LUT) implemented with a non-volatile ROM/Flash memory. The 8-bit `data_in` acts as the address bus to the ROM, and the programmed data at each address outputs the corresponding encrypted substitution cipher byte in a single clock cycle.",
  },
  {
    id: "vlsi-sgi-q86-what-is-an-lfsr-and-what-are-its-co", topic: "rtl-dv", level: "Medium",
    q: "What is an LFSR and what are its common industry applications?",
    a: "A Linear Feedback Shift Register (LFSR) is a shift register whose input bit is driven by the XOR (linear function) of specific register tap positions.\n• Applications: Pseudo-Random Number Generation (PRNG), Built-In Self-Test (BIST) pattern generation, CRC calculation, and cryptography/scramblers.",
  },
  {
    id: "vlsi-sgi-q87-what-is-a-false-path-in-static-timi", topic: "sta-timing", level: "Medium",
    q: "What is a false path in Static Timing Analysis?",
    a: "A false path is a physical path in the circuit that can never be sensitized or exercised during normal functional operation (e.g. cross-clock domain synchronizers, test-mode logic during functional mode, mutually exclusive multiplexer selections).\n• Declared via `set_false_path` so STA tools ignore it.",
  },
  {
    id: "vlsi-sgi-q88-between-two-processors-with-100ps-a", topic: "sta-timing", level: "Medium",
    q: "Between two processors with 100ps and 50ps clock skew, which consumes more clock power?",
    a: "The processor with 50ps skew will consume more power. Achieving tighter (lower) clock skew requires a denser clock tree network with more intermediate clock buffers, larger driver sizes, and higher switching capacitance.",
  },
  {
    id: "vlsi-sgi-q89-what-are-multicycle-paths-and-how-a", topic: "sta-timing", level: "Medium",
    q: "What are multicycle paths and how are they handled in place-and-route?",
    a: "Paths where logic propagation takes multiple clock cycles ($N > 1$) to settle. Declared in SDC constraints using `set_multicycle_path`, relaxing the setup requirement to $N \\times T_{clk}$ and preventing the P&R tool from over-optimizing data paths unnecessarily.",
  },
  {
    id: "vlsi-sgi-q90-between-a-4-bit-synchronous-counter", topic: "seq", level: "Easy",
    q: "Between a 4-bit synchronous counter and a 4-bit ripple counter, which has lower propagation delay?",
    a: "The synchronous counter has lower delay. In a synchronous counter, all flip-flops are clocked simultaneously, so the total delay is just 1 flip-flop $T_{cq}$ + gate delay. In a ripple counter, clock delay ripples through all 4 flip-flops ($4 \\times T_{cq}$).",
  },
  {
    id: "vlsi-sgi-q91-what-is-the-difference-between-a-ra", topic: "digital", level: "Easy",
    q: "What is the difference between a RAM and a FIFO?",
    a: "• RAM (Random Access Memory): Addressable storage where any memory location can be accessed in random order using an address bus.\n• FIFO (First-In First-Out): Sequential queue storage without external address lines. Data is read in the exact order it was written; used for flow control and clock domain crossing.",
  },
  {
    id: "vlsi-sgi-q92-how-do-you-detect-rotational-direct", topic: "digital", level: "Medium",
    q: "How do you detect rotational direction (clockwise vs counter-clockwise) using minimum hardware?",
    a: "Use 2 optical sensors (Phase A and Phase B) positioned with 90° quadrature phase offset. Connect Sensor A to the `D` input of a D flip-flop and Sensor B to the `CLK` pin. Clockwise rotation clocks `D=1` (output HIGH); counter-clockwise clocks `D=0` (output LOW).",
  },
  {
    id: "vlsi-sgi-q93-draw-and-explain-the-timing-diagram", topic: "sta-timing", level: "Medium",
    q: "Draw and explain the timing diagram of a 2-stage pipelined register path.",
    a: "Two cascaded registers ($FF1 \\to \\text{Logic1} \\to FF2 \\to \\text{Logic2} \\to FF3$) clocked by common `CLK`.\n• Data launched from FF1 at clock edge $T_0$ propagates through Logic1 ($t_{pd1}$) and must meet setup time ($t_{su}$) before clock edge $T_1$ at FF2.\n• Pipelining cuts the combinational path in half, doubling maximum clock frequency.",
  },
  {
    id: "vlsi-sgi-q94-implement-3-input-nand-nor-and-xn", topic: "comb", level: "Easy",
    q: "Implement 3-input NAND, NOR, and XNOR gates using minimum 2-input gates.",
    a: "• 3-input NAND (3 gates): `((A NAND B) NAND (A NAND B)) NAND C`\n• 3-input NOR (3 gates): `((A NOR B) NOR (A NOR B)) NOR C`\n• 3-input XNOR (2 gates): `(A XNOR B) XNOR C`",
  },
  {
    id: "vlsi-sgi-q95-is-it-possible-to-reduce-clock-skew", topic: "sta-timing", level: "Medium",
    q: "Is it possible to reduce clock skew to absolute zero across an entire chip?",
    a: "No. Even with ideal symmetric H-tree routing, on-chip process variations (OCV), localized temperature gradients, supply voltage IR drops, and manufacturing tolerances in wire width and thickness introduce non-zero clock skew.",
  },
  {
    id: "vlsi-sgi-q96-design-an-fsm-to-detect-the-sequenc", topic: "rtl-dv", level: "Medium",
    q: "Design an FSM to detect the sequence '10110'.",
    a: "5-state non-overlapping / overlapping sequence detector:\n• S0 (Reset): On 1 -> S1; on 0 -> S0.\n• S1 (1): On 0 -> S2; on 1 -> S1.\n• S2 (10): On 1 -> S3; on 0 -> S0.\n• S3 (101): On 1 -> S4; on 0 -> S2.\n• S4 (1011): On 0 -> S5 (Found, Out=1); on 1 -> S1.",
  },
  {
    id: "vlsi-sgi-q97-convert-a-d-ff-into-a-divide-by-2-f", topic: "sta-timing", level: "Easy",
    q: "Convert a D-FF into a divide-by-2 frequency divider and calculate max clock frequency.",
    a: "Connect $\\bar{Q}$ output back to the $D$ input. Output $Q$ toggles at half the clock frequency ($f_{out} = f_{clk} / 2$).\n• Max frequency: $f_{max} = 1 / (T_{cq} + T_{setup})$.",
  },
  {
    id: "vlsi-sgi-q98-design-a-circuit-to-extend-the-fall", topic: "digital", level: "Medium",
    q: "Design a circuit to extend the falling edge of an input pulse by 2 clock cycles.",
    a: "Connect the input pulse to the D input of $FF1$. Connect $FF1$'s Q output to the D input of $FF2$. Both flip-flops are clocked by `CLK`. Feed the original input, $FF1$'s Q, and $FF2$'s Q into a 3-input OR gate. The output falling edge is extended by 2 clock cycles.",
  },
  {
    id: "vlsi-sgi-q99-calculate-maximum-operating-frequen", topic: "sta-timing", level: "Numerical",
    q: "Calculate maximum operating frequency and analyze hold violations in a feedback circuit.",
    a: "§F: Timing Equations\n`T_{min} = T_{cq} + T_{comb} + T_{setup}`\n`T_{hold\\_margin} = T_{cq} + T_{comb,min} - T_{hold}`\n\n§C: Calculation Steps\nGiven $T_{setup}=3\\,\\text{ns}, T_{pd}=2\\,\\text{ns}, T_{comb}=3\\,\\text{ns}, T_{hold}=6\\,\\text{ns}$:\n1. $T_{min} = 2 + 3 + 3 = 8\\,\\text{ns} \\implies f_{max} = 125\\,\\text{MHz}$.\n2. Hold path: $T_{cq} + T_{comb} = 2 + 2 = 4\\,\\text{ns} < 6\\,\\text{ns}$ (Hold Violation by 2 ns).\n3. Fix: Insert 2 delay buffers (1 ns each) in the feedback data path.\n\n§R: Result\nMax Frequency = 125 MHz; insert 2 ns buffer delay to fix hold violation.",
  },
  {
    id: "vlsi-sgi-q100-design-a-d-latch-using-a-a-2-1-mu", topic: "seq", level: "Easy",
    q: "Design a D-latch using (a) a 2:1 multiplexer, and (b) an SR latch.",
    a: "(a) Using 2:1 Mux: Connect output $Q$ to input $I0$, connect data $D$ to input $I1$, and connect clock/enable to select line $S$. When $S=1$, $Q=D$; when $S=0$, $Q$ holds previous value.\n(b) Using SR Latch: Connect $D$ to $S$ through an AND gate with $CLK$, and connect $\\bar{D}$ to $R$ through an AND gate with $CLK$.",
  },
  {
    id: "vlsi-sgi-q101-how-do-you-implement-a-master-slave", topic: "seq", level: "Medium",
    q: "How do you implement a master-slave edge-triggered flip-flop using 2:1 multiplexers?",
    a: "Cascade two 2:1-mux-based D-latches in series:\n• Master Mux (Latch 1): Controlled by inverted clock $\\overline{CLK}$ (transparent when CLK=0).\n• Slave Mux (Latch 2): Controlled by true clock $CLK$ (transparent when CLK=1).\n• Together they capture data on the rising edge of $CLK$ and hold it stable.",
  },
  {
    id: "vlsi-sgi-q102-how-many-2-input-xor-gates-are-need", topic: "comb", level: "Easy",
    q: "How many 2-input XOR gates are needed to build a 16-input parity generator?",
    a: "For $N$ inputs, an XOR parity tree requires exactly $N - 1$ two-input XOR gates. For 16 inputs: $16 - 1 = 15$ gates.",
  },
  {
    id: "vlsi-sgi-q103-how-do-you-design-a-circuit-to-comp", topic: "comb", level: "Medium",
    q: "How do you design a circuit to compute the 9's complement of a BCD digit using a 4-bit binary adder?",
    a: "9's complement is $9 - A = 9 + \\bar{A} + 1 - 16$:\n• Connect BCD input $A$ through inverters to adder input $B$ ($=\\bar{A}$).\n• Connect input $A$ of adder to binary `1001` (9) and set $C_{in} = 1$.\n• The 4-bit sum output produces the correct 9's complement.",
  },
  {
    id: "vlsi-sgi-q104-what-is-the-difference-between-writ", topic: "spec-arch", level: "Medium",
    q: "What is the difference between write-back and write-through cache?",
    a: "• Write-Through: Data is written simultaneously to both the cache and main memory. Simple, ensures memory consistency, but slower due to frequent bus write traffic.\n• Write-Back (Copy-Back): Data is written only to the cache; the modified cache line is marked 'dirty' and written back to main memory only when evicted. Higher performance and lower bus bandwidth.",
  },
  {
    id: "vlsi-sgi-q105-what-is-the-difference-between-sync", topic: "digital", level: "Medium",
    q: "What is the difference between synchronous, asynchronous, and isochronous communication?",
    a: "• Synchronous: Transmitter and receiver share a common clock or sync pattern; data is sent in continuous frames (SPI, I2S).\n• Asynchronous: No shared clock; bytes are framed by start/stop bits (UART).\n• Isochronous: Time-sensitive streaming where data must arrive within guaranteed, bounded time intervals (e.g. USB audio/video streams).",
  },
  {
    id: "vlsi-sgi-q106-what-are-the-common-binary-multipli", topic: "digital", level: "Medium",
    q: "What are the common binary multiplication and division algorithms?",
    a: "• Multiplication: Shift-and-Add, Booth's Algorithm (encodes consecutive 1s to reduce additions), Wallace Tree Multiplier, Array Multiplier.\n• Division: Restoring Division (subtracts divisor and restores if negative), Non-Restoring Division, SRT Division.",
  },
  {
    id: "vlsi-sgi-q107-what-are-the-differences-between-so", topic: "spec-arch", level: "Medium",
    q: "What are the differences between SoC, ASIC, Full-Custom IC, and FPGA?",
    a: "• FPGA: Field-programmable, reconfigurable silicon, zero NRE cost, fast time-to-market, lower power/density efficiency.\n• Standard-Cell ASIC: Custom-manufactured silicon using pre-designed cell libraries, high NRE, high volume cost-efficiency.\n• Full-Custom IC: Manual transistor-level layout optimization for maximum performance (CPUs, analog RF).\n• SoC (System-on-Chip): Integrates CPU cores, DSPs, memories, analog PHYs, and bus interconnects on a single die.",
  },
  {
    id: "vlsi-sgi-q108-what-is-scan-insertion-and-atpg-in", topic: "synth-dft", level: "Hard",
    q: "What is Scan Insertion and ATPG in manufacturing test?",
    a: "Scan Insertion replaces functional flip-flops with scan flip-flops linked into serial scan chains during test mode (`Scan Enable = 1`).\n• Automatic Test Pattern Generation (ATPG) generates deterministic test vector patterns shifted in via Scan In (`SI`), captured in one clock cycle, and shifted out via Scan Out (`SO`) to detect stuck-at manufacturing defects with >95% fault coverage.",
  },
  {
    id: "vlsi-sgi-q109-explain-the-body-effect-formula-and", topic: "analog-physics", level: "Hard",
    q: "Explain the body effect formula and its physical origin.",
    a: "§F: Body Effect Threshold Voltage Shift\n`\\Delta V_{th} = \\frac{\\sqrt{2 \\varepsilon_{si} q N_A}}{C_{ox}} \\left(\\sqrt{2\\phi_F + V_{sb}} - \\sqrt{2\\phi_F}\\right)`\n• When source-to-substrate voltage $V_{sb} > 0$, the depletion region beneath the gate widens, exposing more uncompensated negative acceptor ions. Additional gate voltage is required to establish channel inversion.",
  },
  {
    id: "vlsi-sgi-q110-what-is-the-standard-cell-methodolo", topic: "pd-signoff", level: "Easy",
    q: "What is the standard cell methodology in ASIC design?",
    a: "A design abstraction where complex logic is constructed from a pre-characterized library of standard cells (AND, NAND, Flip-Flops, Adders) designed with uniform cell height and standardized power rail tracks, enabling automated place-and-route tools to scale designs to millions of gates.",
  },
  {
    id: "vlsi-sgi-q111-what-are-drc-design-rule-check-an", topic: "pd-signoff", level: "Medium",
    q: "What are DRC (Design Rule Check) and LVS (Layout Versus Schematic)?",
    a: "• DRC: Validates that physical layout geometries obey foundry manufacturing rules (minimum metal spacing, trace width, enclosure rules).\n• LVS: Extracts a transistor-level netlist from the physical layout and verifies exact electrical 1-to-1 equivalence with the schematic netlist (devices, pins, ports, sizes).",
  },
  {
    id: "vlsi-sgi-q112-what-is-the-antenna-effect-in-semic", topic: "pd-signoff", level: "Medium",
    q: "What is the antenna effect in semiconductor manufacturing?",
    a: "Accumulation of electrostatic charge on long metal interconnects during plasma etching, which discharges through and damages the gate dielectric of connected MOSFETs.",
  },
  {
    id: "vlsi-sgi-q113-what-are-the-primary-fabrication-st", topic: "fab-silicon", level: "Medium",
    q: "What are the primary fabrication steps in semiconductor IC manufacturing?",
    a: "1. Wafer preparation & cleaning.\n2. Photolithography (photoresist coating, mask exposure, developing).\n3. Etching (dry plasma etching, wet chemical etching).\n4. Ion Implantation & Diffusion (doping wells and source/drain regions).\n5. Thin-film deposition (CVD, PVD, atomic layer deposition of oxides and metals).\n6. Chemical-Mechanical Planarization (CMP).\n7. Packaging, wire bonding, and ATE final test.",
  },
  {
    id: "vlsi-sgi-q114-what-is-a-clock-distribution-networ", topic: "pd-signoff", level: "Medium",
    q: "What is a clock distribution network and why is it critical?",
    a: "The dedicated physical network (H-tree, clock mesh, or balanced tree) that delivers the clock signal from the oscillator/PLL to every flip-flop across the chip.\n• Must deliver clean edges with minimal clock skew and jitter to ensure synchronous timing closure without race conditions.",
  },
  {
    id: "vlsi-sgi-q115-what-is-clock-gating-and-how-does-i", topic: "pd-signoff", level: "Easy",
    q: "What is clock gating and how does it save dynamic power?",
    a: "Clock gating shuts off the clock signal to inactive registers using Integrated Clock Gating (ICG) cells.\n• Since dynamic power is $P = C V^2 f$, setting $f=0$ eliminates dynamic switching power dissipation in idle blocks.",
  },
  {
    id: "vlsi-sgi-q116-what-is-a-netlist", topic: "synth-dft", level: "Easy",
    q: "What is a netlist?",
    a: "A text file defining the connectivity of an electronic circuit, specifying instances (gates, transistors), ports, and nets (interconnecting wires). Formats include Verilog gate-level netlist, SPICE netlist, and EDIF.",
  },
  {
    id: "vlsi-sgi-q117-what-is-physical-timing-closure", topic: "sta-timing", level: "Medium",
    q: "What is physical timing closure?",
    a: "The iterative physical design process (placement, CTS, routing, cell sizing, buffer insertion) performed by EDA tools to ensure all timing paths satisfy setup and hold constraints at target PVT corners.",
  },
  {
    id: "vlsi-sgi-q118-what-verification-checks-constitute", topic: "pd-signoff", level: "Medium",
    q: "What verification checks constitute physical verification?",
    a: "• DRC (Design Rule Check)\n• LVS (Layout Versus Schematic)\n• ERC (Electrical Rule Check)\n• Antenna Rule Checks\n• XOR layout comparison (GDS vs. GDS).",
  },
  {
    id: "vlsi-sgi-q119-what-is-a-stuck-at-fault-model-in-d", topic: "synth-dft", level: "Easy",
    q: "What is a stuck-at fault model in DFT?",
    a: "A structural fault model that simulates physical manufacturing defects by assuming a circuit node is permanently shorted to logic `1` (Stuck-At-1) or logic `0` (Stuck-At-0).",
  },
  {
    id: "vlsi-sgi-q120-list-the-major-digital-logic-famili", topic: "fab-silicon", level: "Easy",
    q: "List the major digital logic families in historical order.",
    a: "DL (Diode Logic) -> RTL (Resistor-Transistor Logic) -> DTL (Diode-Transistor Logic) -> TTL (Transistor-Transistor Logic) -> ECL (Emitter-Coupled Logic) -> NMOS/PMOS -> CMOS -> BiCMOS.",
  },
  {
    id: "vlsi-sgi-q121-what-are-the-common-ic-packaging-ty", topic: "fab-silicon", level: "Easy",
    q: "What are the common IC packaging types?",
    a: "DIP (Dual In-Line), QFP (Quad Flat Package), QFN (Quad Flat No-Lead), BGA (Ball Grid Array), CSP (Chip Scale Package), WLCSP (Wafer-Level CSP), and 2.5D/3D Chiplets.",
  },
  {
    id: "vlsi-sgi-q122-what-is-substrate-coupling-in-mixed", topic: "analog-physics", level: "Medium",
    q: "What is substrate coupling in mixed-signal ICs?",
    a: "The phenomenon where high-frequency switching noise from fast digital logic injects current into the conductive silicon substrate, which propagates and corrupts sensitive high-precision analog and RF circuits.",
  },
  {
    id: "vlsi-sgi-q123-what-is-the-physical-mechanism-of-l", topic: "analog-physics", level: "Hard",
    q: "What is the physical mechanism of latch-up in CMOS?",
    a: "Regenerative forward-biasing of the parasitic four-layer $p-n-p-n$ thyristor structure formed by the PMOS source, N-well, P-substrate, and NMOS source, creating a direct low-impedance short between VDD and VSS.",
  },
  {
    id: "vlsi-sgi-q124-what-are-the-failure-consequences-o", topic: "analog-physics", level: "Medium",
    q: "What are the failure consequences of CMOS latch-up?",
    a: "Causes massive current draw from VDD to VSS, leading to severe thermal runaway, metal burnout, and permanent silicon destruction via Electrical Overstress (EOS).",
  },
  {
    id: "vlsi-sgi-q125-why-is-a-nand-gate-preferred-over-a", topic: "pd-signoff", level: "Medium",
    q: "Why is a NAND gate preferred over a NOR gate in CMOS design?",
    a: "1. Higher Speed & Lower Area: NMOS electrons have ~2-3x higher mobility than PMOS holes. In NAND, the NMOS transistors are in series and PMOS in parallel. In NOR, the slower PMOS transistors are in series, requiring 2-3x larger PMOS sizing to achieve equal fall times.\n2. Symmetrical delay profile and lower gate leakage.",
  },
  {
    id: "vlsi-sgi-q126-what-is-noise-margin-in-digital-log", topic: "analog-physics", level: "Easy",
    q: "What is noise margin in digital logic?",
    a: "The maximum amount of spurious noise voltage that can be added to a digital signal without causing the receiving gate to misinterpret the logic level ($NMH = V_{OH} - V_{IH}$, $NML = V_{IL} - V_{OL}$).",
  },
  {
    id: "vlsi-sgi-q127-explain-the-procedure-for-sizing-an", topic: "analog-physics", level: "Medium",
    q: "Explain the procedure for sizing an inverter in CMOS.",
    a: "To achieve equal rise and fall times, the PMOS transistor width must be sized larger than the NMOS width by the mobility ratio: $W_p / W_n \\approx \\mu_n / \\mu_p \\approx 2.0 \\text{ to } 2.5$.",
  },
  {
    id: "vlsi-sgi-q128-how-does-transistor-sizing-affect-t", topic: "analog-physics", level: "Medium",
    q: "How does transistor sizing affect threshold voltage?",
    a: "In short-channel MOSFETs, increasing channel length ($L$) reduces the Short-Channel Effect (SCE) and Drain-Induced Barrier Lowering (DIBL), raising threshold voltage $V_{th}$.",
  },
  {
    id: "vlsi-sgi-q129-how-do-you-calculate-high-and-low-n", topic: "analog-physics", level: "Easy",
    q: "How do you calculate High and Low Noise Margins?",
    a: "§F: Noise Margin Equations\n`NML = V_{IL} - V_{OL}`\n`NMH = V_{OH} - V_{IH}`\n• $V_{OH}$: Minimum HIGH output voltage.\n• $V_{IH}$: Minimum HIGH input recognized.\n• $V_{IL}$: Maximum LOW input recognized.\n• $V_{OL}$: Maximum LOW output voltage.",
  },
  {
    id: "vlsi-sgi-q130-what-happens-to-propagation-delay-w", topic: "analog-physics", level: "Easy",
    q: "What happens to propagation delay when load capacitance increases?",
    a: "Propagation delay increases linearly with load capacitance ($t_{pd} \\propto C_{load} \\cdot \\frac{V_{DD}}{I_{sat}}$), because charging and discharging the larger capacitive load takes more time.",
  },
  {
    id: "vlsi-sgi-q131-what-happens-to-delay-if-output-res", topic: "analog-physics", level: "Easy",
    q: "What happens to delay if output resistance increases?",
    a: "Delay increases proportionally with the $RC$ time constant ($\\tau = R_{out} \\cdot C_{load}$).",
  },
  {
    id: "vlsi-sgi-q132-what-are-the-practical-limitations", topic: "analog-physics", level: "Medium",
    q: "What are the practical limitations of raising supply voltage ($V_{DD}$) to reduce gate delay?",
    a: "1. Dynamic power increases quadratically ($P \\propto V_{DD}^2$).\n2. Excessive thermal dissipation causes chip overheating.\n3. High electric fields cause gate dielectric breakdown, Hot Carrier Injection (HCI), and electromigration.",
  },
  {
    id: "vlsi-sgi-q133-how-does-metal-interconnect-resista", topic: "pd-signoff", level: "Easy",
    q: "How does metal interconnect resistance vary with thickness and length?",
    a: "§F: Resistance Equation\n`R = \\rho \\frac{L}{A} = \\rho \\frac{L}{W \\cdot T}`\n• Resistance increases directly with length ($L$) and decreases inversely with metal thickness ($T$) and width ($W$).",
  },
  {
    id: "vlsi-sgi-q134-what-techniques-minimize-dynamic-po", topic: "analog-physics", level: "Medium",
    q: "What techniques minimize dynamic power in CMOS circuits?",
    a: "Since $P_{dynamic} = \\alpha \\cdot C_{load} \\cdot V_{DD}^2 \\cdot f$:\n1. Lower supply voltage ($V_{DD}$).\n2. Apply Clock Gating to reduce switching activity ($\\alpha$).\n3. Reduce clock frequency ($f$) when idle (DVFS).\n4. Minimize interconnect routing capacitance ($C_{load}$).",
  },
  {
    id: "vlsi-sgi-q135-what-is-charge-sharing-in-dynamic-c", topic: "analog-physics", level: "Hard",
    q: "What is charge sharing in dynamic CMOS logic?",
    a: "In dynamic logic or precharged buses, when internal node capacitances share charge with output capacitance upon transistor switching, the output voltage drops to an intermediate voltage level, causing logic errors unless $C_{load} \\gg C_{internal}$.",
  },
  {
    id: "vlsi-sgi-q136-why-do-we-gradually-size-inverters", topic: "analog-physics", level: "Medium",
    q: "Why do we gradually size inverters in buffer chains driving large capacitive loads?",
    a: "A single small inverter cannot drive a massive capacitive load without extreme slew degradation. An optimal tapered buffer chain where each stage is sized larger by a factor of $e \\approx 2.72$ (or $\\approx 3-4$) minimizes total propagation delay.",
  },
  {
    id: "vlsi-sgi-q137-how-is-latch-up-prevented-through-l", topic: "analog-physics", level: "Medium",
    q: "How is latch-up prevented through layout design rules?",
    a: "1. Place $p^+$ guard rings around NMOS connected to GND and $n^+$ guard rings around PMOS connected to VDD.\n2. Ensure substrate and well taps are placed frequently (e.g. every 5–10 transistors).\n3. Keep NMOS and PMOS regions physically separated.",
  },
  {
    id: "vlsi-sgi-q138-give-the-formula-for-cmos-dynamic-s", topic: "analog-physics", level: "Easy",
    q: "Give the formula for CMOS dynamic switching power dissipation.",
    a: "§F: Dynamic Power Formula\n`P_{dynamic} = \\alpha \\cdot C_L \\cdot V_{DD}^2 \\cdot f_{clk}`\n• $\\alpha$: Switching activity factor.\n• $C_L$: Total load capacitance.\n• $V_{DD}$: Supply voltage.\n• $f_{clk}$: Clock frequency.",
  },
  {
    id: "vlsi-sgi-q139-why-does-threshold-voltage-increase", topic: "analog-physics", level: "Medium",
    q: "Why does threshold voltage increase in stacked series NMOS transistors?",
    a: "In stacked NMOS gates (e.g. 3-input NAND), the source of upper transistors sits at a voltage higher than substrate ground ($V_{sb} > 0$), inducing the Body Effect which raises $V_{th}$ for the upper transistors.",
  },
  {
    id: "vlsi-sgi-q140-why-is-the-substrate-of-nmos-connec", topic: "analog-physics", level: "Easy",
    q: "Why is the substrate of NMOS connected to GND and the body of PMOS connected to VDD?",
    a: "To ensure that all source/drain-to-substrate/well $p-n$ junctions remain permanently reverse-biased, preventing forward conduction and leakage current into the substrate.",
  },
  {
    id: "vlsi-sgi-q141-what-is-the-fundamental-difference", topic: "analog-physics", level: "Easy",
    q: "What is the fundamental difference between a MOSFET and a BJT?",
    a: "• MOSFET: Unipolar voltage-controlled device; current is carried by a single type of carrier (electrons or holes).\n• BJT: Bipolar current-controlled device; current involves both majority and minority carriers (electrons and holes).",
  },
  {
    id: "vlsi-sgi-q142-which-device-has-higher-transconduc", topic: "analog-physics", level: "Medium",
    q: "Which device has higher transconductance and gain: BJT or MOSFET?",
    a: "BJT has higher transconductance ($g_m = I_C / V_T$) because collector current depends exponentially on base-emitter voltage, whereas MOSFET current follows a square-law dependence.",
  },
  {
    id: "vlsi-sgi-q143-what-is-the-optimal-staging-ratio-f", topic: "analog-physics", level: "Hard",
    q: "What is the optimal staging ratio for progressive buffer sizing?",
    a: "The optimal staging ratio is $f = e \\approx 2.72$ (in practice, $f = 3 \\text{ to } 4$). For a total load $C_L / C_{in} = Y$, the optimal number of stages is $N = \\ln(Y)$, giving minimum total propagation delay.",
  },
  {
    id: "vlsi-sgi-q144-why-is-pmos-designed-with-a-larger", topic: "analog-physics", level: "Easy",
    q: "Why is PMOS designed with a larger width than NMOS in CMOS logic?",
    a: "Electron mobility in silicon ($\\mu_n \\approx 1350\\,\\text{cm}^2/\\text{V}\\cdot\\text{s}$) is approximately 2.5 times higher than hole mobility ($\\mu_p \\approx 480\\,\\text{cm}^2/\\text{V}\\cdot\\text{s}$). Sizing PMOS $W_p \\approx 2.5 \\times W_n$ balances pull-up and pull-down drive strengths for symmetric rise/fall times.",
  },
  {
    id: "vlsi-sgi-q145-why-are-nmos-and-pmos-sized-equally", topic: "analog-physics", level: "Medium",
    q: "Why are NMOS and PMOS sized equally in CMOS transmission gates?",
    a: "In a transmission gate, NMOS and PMOS conduct in parallel: NMOS passes a strong `0` and PMOS passes a strong `1`. They assist each other rather than competing, so equal sizing provides balanced on-resistance across the full voltage range.",
  },
  {
    id: "vlsi-sgi-q146-what-happens-if-pmos-and-nmos-posit", topic: "analog-physics", level: "Medium",
    q: "What happens if PMOS and NMOS positions are swapped in a CMOS inverter?",
    a: "The circuit acts as a non-inverting buffer, but produces degraded logic levels: a logic `1` input outputs a degraded HIGH ($V_{DD} - V_{thn}$) and a logic `0` input outputs a degraded LOW ($V_{thp}$).",
  },
  {
    id: "vlsi-sgi-q147-what-are-5-essential-layout-design", topic: "pd-signoff", level: "Medium",
    q: "What are 5 essential layout design guidelines for digital standard cells?",
    a: "1. Maintain uniform cell height across standard cell rows.\n2. Enforce strict unidirectional routing per metal layer (e.g. M1 horiz, M2 vert).\n3. Place frequent substrate and well contacts in empty layout spaces.\n4. Avoid long polysilicon routing lines.\n5. Use multi-finger transistors for wide gates to reduce drain capacitance.",
  },
  {
    id: "vlsi-sgi-q148-what-are-the-different-ways-to-reso", topic: "digital", level: "Medium",
    q: "What are the different ways to resolve metastability in asynchronous clock domain crossings?",
    a: "1. 2-FF or 3-FF synchronizers for single-bit signals.\n2. Dual-clock Asynchronous FIFOs with Gray-coded pointers for multi-bit data buses.\n3. Request-Acknowledge 4-phase handshaking protocols.",
  },
  {
    id: "vlsi-sgi-q149-in-a-multi-input-nand-gate-where-s", topic: "analog-physics", level: "Hard",
    q: "In a multi-input NAND gate, where should late-arriving signals be placed in the series NMOS stack?",
    a: "The late-arriving signal must be connected to the NMOS transistor closest to the output node. This allows internal intermediate node capacitances in the stack to pre-discharge, minimizing switching delay when the late signal finally arrives.",
  },
  {
    id: "vlsi-sgi-q150-what-is-the-difference-between-zene", topic: "analog-physics", level: "Medium",
    q: "What is the difference between Zener breakdown and Avalanche breakdown?",
    a: "• Zener Breakdown: Occurs in heavily doped junctions at low reverse voltage ($< 5\\,\\text{V}$) via direct quantum mechanical band-to-band tunneling under high electric fields.\n• Avalanche Breakdown: Occurs in lightly doped junctions at higher voltages ($> 5\\,\\text{V}$) via impact ionization where accelerated carriers collide with lattice atoms, generating secondary electron-hole pairs.",
  },
  {
    id: "vlsi-sgi-q151-what-is-an-instrumentation-amplifie", topic: "analog-physics", level: "Medium",
    q: "What is an instrumentation amplifier and what are its key advantages?",
    a: "An instrumentation amplifier is a precision differential op-amp circuit with buffered inputs offering extremely high input impedance, high Common-Mode Rejection Ratio (CMRR), low DC offset drift, and gain settable via a single external resistor.",
  },
  {
    id: "vlsi-sgi-q152-what-is-the-primary-difference-betw", topic: "analog-physics", level: "Easy",
    q: "What is the primary difference between a MOSFET and a BJT in terms of control mode?",
    a: "A MOSFET is a voltage-controlled device with virtually infinite DC input impedance ($I_G \\approx 0$), while a BJT is a current-controlled device requiring continuous base current $I_B$ to maintain collector current.",
  },
  {
    id: "vlsi-sgi-q153-what-are-the-fundamental-difference", topic: "analog-physics", level: "Medium",
    q: "What are the fundamental differences between analog and digital IC design?",
    a: "• Analog Design: Operates on continuous voltages and currents, highly sensitive to noise, device physics, layout parasitics, and PVT corners. Low automation, custom handcrafted layout.\n• Digital Design: Operates on discrete binary logic levels (0/1), high noise immunity, automated logic synthesis, and place-and-route flows.",
  },
  {
    id: "vlsi-sgi-q154-what-is-a-ring-oscillator-and-how-i", topic: "analog-physics", level: "Medium",
    q: "What is a ring oscillator and how is its oscillation frequency derived?",
    a: "A ring oscillator is a closed-loop chain of an odd number ($N$) of inverters connected in a feedback loop.\n§F: Ring Oscillator Frequency\n`T = 2 \\cdot N \\cdot t_{pd}`\n`f_{osc} = \\frac{1}{2 \\cdot N \\cdot t_{pd}}`\n• $N$: Number of inverters (must be odd).\n• $t_{pd}$: Single inverter propagation delay.\n• Used on test chips to characterize semiconductor process speed.",
  },
  {
    id: "vlsi-sgi-q155-what-are-rtl-gate-metal-and-fib", topic: "fab-silicon", level: "Hard",
    q: "What are RTL, Gate, Metal, and FIB fixes in the ASIC lifecycle? What is a sewing kit?",
    a: "Methods to fix silicon bugs after tape-out, from least to most intrusive:\n1. RTL Fix: Modify HDL and re-run synthesis, P&R, and full mask generation (expensive full re-spin).\n2. Gate Fix: Manually edit gate netlist, avoiding re-synthesis, but modifies all mask layers.\n3. Metal Fix: Reconnects existing spare cells using only top metal mask layers without changing base silicon layers.\n   • A Sewing Kit is a pre-placed array of uncommitted spare logic gates and flip-flops included in the layout specifically for future metal fixes.\n4. FIB (Focused Ion Beam) Fix: Uses a focused gallium ion beam to physically cut and mill metal traces directly on a manufactured silicon die for prototype verification.",
  },
  {
    id: "emb-q1-what-is-an-embedded-system", topic: "emb-basics", level: "Easy",
    q: "What is an embedded system?",
    a: "An embedded system is a specialized computer system designed to perform specific dedicated tasks or functions within a larger mechanical or electrical system, often with real-time constraints.\n• Integrates hardware (microcontroller or microprocessor, RAM, ROM/Flash) and I/O interfaces like sensors and actuators.\n• Unlike general-purpose PCs, it is optimized for specific applications (e.g., controlling appliances, automotive ECUs, medical devices, avionics).\n• Usually resource-constrained, requiring efficient use of memory and processing power, prioritizing reliability, low power consumption, and deterministic real-time performance.",
  },
  {
    id: "emb-q2-what-is-firmware-in-the-context-of", topic: "emb-basics", level: "Easy",
    q: "What is firmware in the context of embedded systems?",
    a: "Firmware is a specialized class of low-level software stored in non-volatile memory (e.g., ROM, Flash, or EEPROM) that provides direct control for an embedded system's hardware.\n• Serves as the intermediary between hardware registers and higher-level application software.\n• Tightly coupled with hardware; written in C or assembly for maximum execution speed and direct register access.\n• Manages hardware startup, clock trees, peripheral configuration (UART, SPI, Timers), and interrupt dispatching.\n• Non-volatile storage ensures persistence across power cycles.",
  },
  {
    id: "emb-q3-what-is-the-difference-between-soft", topic: "emb-basics", level: "Easy",
    q: "What is the difference between software and firmware?",
    a: "• Software: Programs running on general-purpose computers with abundant resources under rich OSs (Linux, Windows). Designed for high flexibility, frequent updates, and user interaction (e.g., word processors, web apps).\n• Firmware: Low-level code stored in non-volatile memory (ROM/Flash) on resource-constrained microcontrollers. Tightly bound to physical silicon registers; updates are infrequent and require specialized tools (JTAG, ISP, SWD, or bootloaders/OTA). Errors in firmware can brick devices.",
  },
  {
    id: "emb-q4-what-are-the-main-components-of-an", topic: "emb-basics", level: "Easy",
    q: "What are the main components of an embedded system?",
    a: "1. Processing Unit: Microcontroller (MCU) or Microprocessor (MPU) executing control logic.\n2. Memory Subsystem: ROM/Flash (firmware storage), RAM (runtime variables, stack, buffers), and EEPROM (configuration/calibration data).\n3. Input/Output Interfaces: GPIO, UART, SPI, I2C, CAN, ADC, and DAC.\n4. Sensors & Actuators: Sensors detect environmental conditions (temperature, motion); actuators produce physical actions (motors, solenoids, relays).\n5. Power Supply: Regulated power rails (3.3V, 5V) and supervisory circuits (Power-On Reset, Brown-Out Reset).",
  },
  {
    id: "emb-q5-what-is-a-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is a microcontroller?",
    a: "A microcontroller (MCU) is a compact integrated circuit that combines a CPU core, memory (RAM and Flash/ROM), and programmable peripherals (Timers, ADC, UART, SPI, I2C, GPIO) on a single silicon chip.\n• Designed for dedicated control applications requiring low power, small footprint, and cost-effective implementation (e.g., smart thermostats, motor drives, remote controls).\n• Common architectures: ARM Cortex-M, Microchip AVR (ATmega), PIC, and 8051.\n• Typically programmed in C using toolchains like Keil, GCC, or MPLAB.",
  },
  {
    id: "emb-q6-what-is-a-microprocessor", topic: "emb-basics", level: "Easy",
    q: "What is a microprocessor?",
    a: "A microprocessor (MPU) is a central processing unit (CPU) fabricated on a single chip, designed to execute instructions but requiring external components (external RAM, Flash/ROM, and peripheral controllers) for a complete system.\n• Prioritizes high computational power and clock frequency (GHz range), hosting complex OSs like Linux or Windows.\n• Used in compute-intensive embedded applications (smartphones, multimedia gateways).\n• Examples include Intel x86 and ARM Cortex-A cores.",
  },
  {
    id: "emb-q7-what-is-the-difference-between-a-mi", topic: "emb-basics", level: "Easy",
    q: "What is the difference between a microcontroller and a microprocessor?",
    a: "• Microcontroller (MCU): Integrates CPU, RAM, Flash, and Peripherals (Timers, ADC, GPIO) on one chip. Low power, low cost, deterministic real-time performance, ideal for bare-metal or RTOS control (e.g., Arduino ATmega328, STM32).\n• Microprocessor (MPU): Standalone CPU requiring external memory and discrete peripheral chips. Higher compute throughput, higher power and cost, supports full multi-user OSs like Linux (e.g., Raspberry Pi BCM2837, Intel x86).",
  },
  {
    id: "emb-q8-what-is-an-embedded-operating-syste", topic: "emb-basics", level: "Easy",
    q: "What is an embedded operating system?",
    a: "An embedded operating system is a lightweight OS designed for resource-constrained embedded hardware, providing task scheduling, memory management, and I/O abstraction.\n• Optimized for small memory footprints (often kilobytes of RAM) and deterministic real-time performance.\n• Examples: FreeRTOS, Zephyr, RTEMS, and Embedded Linux.\n• Enables multithreading, priority preemption, and structured synchronization (mutexes, semaphores, queues) for complex embedded applications.",
  },
  {
    id: "emb-q9-what-is-real-time-embedded-systems", topic: "emb-basics", level: "Medium",
    q: "What is real-time embedded systems?",
    a: "A real-time embedded system is one where operational correctness depends on both logical results and strict temporal deadlines.\n• Hard Real-Time: Missing a deadline causes catastrophic system failure or safety hazards (e.g., automotive braking/ABS, pacemakers, avionics).\n• Soft Real-Time: Tolerates occasional delays without catastrophic consequences; degrades Quality of Service (e.g., video streaming, UI responsiveness).\n• Relies on deterministic firmware, priority scheduling, hardware timers, and bounded interrupt latency.",
  },
  {
    id: "emb-q10-what-is-the-role-of-firmware-in-a-m", topic: "emb-basics", level: "Easy",
    q: "What is the role of firmware in a microcontroller?",
    a: "Firmware in an MCU provides low-level control to:\n1. Initialize hardware, core clocks, PLLs, and memory maps.\n2. Configure peripheral registers (GPIO, UART, SPI, I2C, ADC, Timers).\n3. Handle hardware interrupts via an Interrupt Vector Table (IVT).\n4. Execute real-time control algorithms, digital filtering, and communication protocols.\n5. Run an event loop or manage RTOS tasks to maintain predictable system behavior.",
  },
  {
    id: "emb-q11-what-is-the-purpose-of-rom-in-embed", topic: "emb-basics", level: "Easy",
    q: "What is the purpose of ROM in embedded systems?",
    a: "ROM (Read-Only Memory) stores firmware and permanent instructions that must persist without power.\n• Holds the reset vector, bootloader, startup code, and constant calibration tables.\n• Non-volatile and immutable during normal execution, protecting critical startup routines from accidental overwriting.\n• In modern MCUs, on-chip Flash memory serves as reprogrammable ROM.",
  },
  {
    id: "emb-q12-what-is-the-purpose-of-ram-in-embed", topic: "emb-basics", level: "Easy",
    q: "What is the purpose of RAM in embedded systems?",
    a: "RAM (Random Access Memory) provides high-speed temporary volatile read/write workspace during CPU execution.\n• Stores runtime variables, call stack frames (local variables, function return addresses), dynamic memory (heap), and peripheral I/O data buffers (e.g. UART RX/TX buffers).\n• Volatile: loses data when unpowered.\n• In MCUs, RAM is limited (e.g., 2 KB to 512 KB), requiring static allocation and lean data structures to prevent overflow.",
  },
  {
    id: "emb-q13-what-is-non-volatile-memory", topic: "emb-basics", level: "Easy",
    q: "What is non-volatile memory?",
    a: "Non-volatile memory retains its stored data without electrical power.\n• Essential for storing executable code, bootloader, device configuration, and calibration values.\n• Types include Mask ROM, Flash (NOR for code execution, NAND for mass storage), and EEPROM for byte-level parameter updates.\n• Slower write/erase operations than RAM, but guarantees persistence across power cycles.",
  },
  {
    id: "emb-q14-what-is-volatile-memory", topic: "emb-basics", level: "Easy",
    q: "What is volatile memory?",
    a: "Volatile memory (primarily SRAM and DRAM) loses stored contents when electrical power is removed.\n• Used for fast temporary data manipulation during CPU execution: variables, stack, and buffers.\n• Offers single-cycle read/write access critical for real-time processing.\n• Must be reinitialized at power-up from non-volatile storage.",
  },
  {
    id: "emb-q15-what-is-the-difference-between-rom", topic: "emb-basics", level: "Easy",
    q: "What is the difference between ROM and RAM?",
    a: "• ROM (Read-Only Memory): Non-volatile (retains data without power), read-only during normal execution, stores permanent firmware/boot code.\n• RAM (Random Access Memory): Volatile (loses data on power loss), read/write capable at high speed, stores runtime variables, stack frames, and communication buffers.",
  },
  {
    id: "emb-q16-what-is-flash-memory", topic: "emb-basics", level: "Easy",
    q: "What is flash memory?",
    a: "Flash memory is a non-volatile, electrically erasable and reprogrammable storage technology widely used for MCU firmware.\n• NOR Flash: Allows random byte-level read access with execute-in-place (XIP) capability, making it the standard on-chip code memory for microcontrollers.\n• NAND Flash: High density, block-level read/write, used for bulk storage.\n• Erased in sectors/blocks; supports 10,000 to 100,000 write/erase endurance cycles.",
  },
  {
    id: "emb-q17-what-is-eeprom", topic: "emb-basics", level: "Easy",
    q: "What is EEPROM?",
    a: "EEPROM (Electrically Erasable Programmable Read-Only Memory) is a non-volatile memory allowing fine-grained byte-level erasing and rewriting.\n• Used in embedded systems for storing device IDs, calibration offsets, Wi-Fi credentials, and user preferences.\n• Higher endurance (100,000 to 1,000,000+ cycles) compared to Flash memory.\n• Accessed via internal registers or serial interfaces (I2C/SPI).",
  },
  {
    id: "emb-q18-what-is-the-boot-process-in-an-embe", topic: "emb-basics", level: "Medium",
    q: "What is the boot process in an embedded system?",
    a: "1. Power-On Reset (POR): Hardware resets the CPU core upon stable power.\n2. Fetch Reset Vector: CPU loads the initial Stack Pointer (SP) and Program Counter (PC) from address 0x0.\n3. Bootloader / Reset Handler: Configures system clocks, oscillators, PLL, and initializes memory.\n4. C Runtime Setup: Copies `.data` segment from Flash to RAM; zeroes out `.bss` segment in RAM.\n5. Jump to `main()`: Enters the application entry point and begins the main event loop.",
  },
  {
    id: "emb-q19-what-is-a-bootloader", topic: "emb-basics", level: "Medium",
    q: "What is a bootloader?",
    a: "A bootloader is a small program stored in non-volatile memory (ROM or reserved Flash sector) that executes immediately after reset.\n• Responsibilities: Hardware initialization, firmware integrity/signature verification, and loading the application.\n• Enables in-field firmware updates via UART, USB, CAN, SPI, or OTA (Wi-Fi/BLE) without dedicated JTAG hardware.\n• If no update is requested, branches to the main application address.",
  },
  {
    id: "emb-q20-what-is-the-difference-between-hard", topic: "emb-basics", level: "Easy",
    q: "What is the difference between hardware and software in embedded systems?",
    a: "• Hardware: Physical components including MCU silicon, PCB traces, power supplies, sensors, and actuators. Fixed post-fabrication.\n• Software (Firmware): Digital instructions and data executed by the processor to control the hardware. Stored in memory and updatable via programming tools or bootloaders.",
  },
  {
    id: "emb-q21-what-is-an-actuator-in-embedded-sys", topic: "emb-basics", level: "Easy",
    q: "What is an actuator in embedded systems?",
    a: "An actuator is a hardware device that converts electrical control signals from an MCU into physical action.\n• Examples: Motors (DC, stepper, servo), solenoids, relays, piezo buzzers, and LEDs.\n• Driven via GPIO signals, PWM outputs, or power MOSFET driver stages.",
  },
  {
    id: "emb-q22-what-is-a-sensor-in-embedded-system", topic: "emb-basics", level: "Easy",
    q: "What is a sensor in embedded systems?",
    a: "A sensor is a transducer that measures physical environmental conditions (temperature, pressure, light, acceleration) and converts them into electrical signals.\n• Interfaces via analog inputs (ADC) or digital buses (I2C, SPI, UART).\n• Firmware samples, filters, and calibrates raw sensor data for control algorithms.",
  },
  {
    id: "emb-q23-what-is-the-role-of-input-output-i", topic: "emb-basics", level: "Easy",
    q: "What is the role of input/output (I/O) in embedded systems?",
    a: "I/O interfaces enable an embedded system to interact with the external world:\n• Inputs: Capture sensor readings, button presses, and communication packets via ADC, GPIO, or serial buses.\n• Outputs: Drive actuators, displays, LEDs, and communication transmitters via digital pins, PWM, and DAC.\n• Managed via memory-mapped registers and interrupt service routines for real-time responsiveness.",
  },
  {
    id: "emb-q24-what-is-a-peripheral-device", topic: "emb-basics", level: "Easy",
    q: "What is a peripheral device?",
    a: "A peripheral is an on-chip or off-chip hardware block that performs specialized functions independently of the CPU.\n• Internal: Timers, ADC, DAC, DMA, UART, SPI, I2C, CAN, and Watchdog.\n• External: Displays, flash chips, external sensors, motor drivers.\n• Reduces CPU workload by offloading timing, sampling, and data transfer tasks.",
  },
  {
    id: "emb-q25-what-is-the-difference-between-hard", topic: "emb-basics", level: "Medium",
    q: "What is the difference between hard real-time and soft real-time systems?",
    a: "• Hard Real-Time: Deadlines must be met with zero tolerance; missing a deadline constitutes total system failure (e.g., automotive airbag, ABS, cardiac pacemaker, avionics).\n• Soft Real-Time: Deadlines are important, but occasional misses degrade Quality of Service without causing system failure (e.g., video streaming, audio player, UI display refresh).",
  },
  {
    id: "emb-q26-what-is-an-infinite-loop-in-embedde", topic: "emb-basics", level: "Easy",
    q: "What is an infinite loop in embedded firmware?",
    a: "An infinite loop (`while(1)` or `for(;;)`) is a programming construct that executes repeatedly without terminating.\n• Standard pattern in bare-metal embedded firmware because embedded systems run continuously without an underlying OS to exit to.\n• Contains the main polling routine, state machine transitions, and background task execution.",
  },
  {
    id: "emb-q27-why-do-embedded-systems-often-use-i", topic: "emb-basics", level: "Easy",
    q: "Why do embedded systems often use infinite loops?",
    a: "1. Autonomous Continuous Operation: Devices like smoke detectors and engine ECUs must monitor sensors 24/7.\n2. No Host OS: Returning from `main()` in freestanding bare-metal code causes undefined behavior or CPU crash.\n3. Event Loop Architecture: Constantly polls flags, processes I/O, or sleeps in low-power mode waiting for interrupt wakeups.",
  },
  {
    id: "emb-q28-what-is-the-purpose-of-a-power-supp", topic: "emb-basics", level: "Easy",
    q: "What is the purpose of a power supply in an embedded system?",
    a: "Provides stable DC voltage and current (e.g., 3.3V, 5V, 1.8V) to power the MCU, memory, peripherals, and sensors.\n• Protects against voltage fluctuations, noise, and power surges using regulators (LDOs, Buck converters) and decoupling capacitors.\n• Supports power management by enabling sleep and low-power modes to extend battery life in portable IoT devices.",
  },
  {
    id: "emb-q29-what-is-a-timer-in-embedded-systems", topic: "emb-basics", level: "Easy",
    q: "What is a timer in embedded systems?",
    a: "A hardware peripheral that counts clock cycles to measure time intervals or generate timed events.\n• Configured via prescalers to operate at specific frequencies.\n• Used for generating periodic interrupts (system ticks), measuring pulse widths, scheduling tasks, and generating PWM waveforms.\n• Offloads timing operations from the CPU for deterministic performance.",
  },
  {
    id: "emb-q30-what-is-the-difference-between-an-e", topic: "emb-basics", level: "Easy",
    q: "What is the difference between an embedded system and a general-purpose computer?",
    a: "• Embedded System: Dedicated to a specific function, highly resource-constrained (KBs of RAM), low power consumption, deterministic real-time response, bare-metal or RTOS (e.g., smart thermostat, ECU).\n• General-Purpose Computer: Versatile computing platform running diverse user applications, abundant resources (GBs of RAM, multi-GHz CPU), non-deterministic general OS (Windows/Linux/macOS), high power usage (e.g., desktop PC, laptop).",
  },
  {
    id: "emb-q31-what-is-the-role-of-c-in-embedded-f", topic: "emb-c", level: "Easy",
    q: "What is the role of C in embedded firmware development?",
    a: "C is the dominant language for embedded firmware due to:\n1. Efficiency & Low Overhead: Produces compact, fast machine code with minimal runtime penalty.\n2. Direct Hardware Manipulation: Pointers allow direct access to memory-mapped registers and physical memory addresses.\n3. Portability: Standardized ANSI/ISO C code can be recompiled across different MCU architectures (ARM, AVR, PIC, RISC-V).\n4. Rich Ecosystem: Supported by all major embedded toolchains (GCC, Keil, IAR, Clang) and safety standards (MISRA-C).",
  },
  {
    id: "emb-q32-what-is-the-difference-between-c-an", topic: "emb-c", level: "Medium",
    q: "What is the difference between C and embedded C?",
    a: "• Standard C: General-purpose language designed for hosted environments with abundant resources, OS support, standard I/O (stdio), and dynamic heap allocation.\n• Embedded C: Extension and subset of C tailored for resource-constrained, freestanding microcontrollers. Features direct register access, fixed-point arithmetic, hardware-specific pragmas, interrupt service routine syntax (`__interrupt`), bit manipulation, and strict adherence to safety standards like MISRA-C.",
  },
  {
    id: "emb-q33-what-is-a-header-file-in-c", topic: "emb-c", level: "Easy",
    q: "What is a header file in C?",
    a: "A header file (`.h`) contains declarations of functions, data structures, macros, register definitions, and typedefs, separating interfaces from implementations.\n• Included via `#include \"file.h\"`.\n• Uses include guards (`#ifndef HEADER_H / #define HEADER_H / #endif`) or `#pragma once` to prevent multiple inclusion errors.\n• In embedded systems, headers define memory-mapped register structs and peripheral driver APIs.",
  },
  {
    id: "emb-q34-what-is-the-main-function", topic: "emb-c", level: "Easy",
    q: "What is the main() function?",
    a: "The `main()` function is the application entry point in C where execution begins after startup runtime initialization.\n• In embedded freestanding environments, it is typically defined as `int main(void)` or `void main(void)`.\n• In bare-metal systems, `main()` initializes peripherals and enters an infinite `while(1)` loop, never returning.",
  },
  {
    id: "emb-q35-what-is-a-variable-in-c", topic: "emb-c", level: "Easy",
    q: "What is a variable in C?",
    a: "A named memory location in RAM holding a value of a specific data type that can be modified during runtime execution.\n• Defined by type, scope (local, global), and lifetime (automatic, static).\n• In embedded systems, variable sizes must be managed carefully using fixed-width types (`uint8_t`, `uint16_t`, `uint32_t`) to optimize limited RAM.",
  },
  {
    id: "emb-q36-what-are-the-basic-data-types-in-c", topic: "emb-c", level: "Easy",
    q: "What are the basic data types in C?",
    a: "• Integer types: `char` (8-bit), `short` (16-bit), `int` (16/32-bit), `long` (32/64-bit), with `signed` and `unsigned` modifiers.\n• Floating-point types: `float` (32-bit IEEE 754), `double` (64-bit).\n• `void`: Represents absence of type (used for generic pointers `void *` and functions without return/parameters).\n• In embedded firmware, fixed-width types from `<stdint.h>` (`uint8_t`, `int16_t`, `uint32_t`) are preferred for architecture-independent portability.",
  },
  {
    id: "emb-q37-what-is-an-integer-in-c", topic: "emb-c", level: "Easy",
    q: "What is an integer in C?",
    a: "An integer is a fundamental data type for storing whole numbers without fractional components.\n• Platform-dependent size (16-bit on 8/16-bit MCUs, 32-bit on ARM Cortex-M).\n• Supports arithmetic (`+`, `-`, `*`, `/`, `%`) and bitwise operations (`&`, `|`, `^`, `~`, `<<`, `>>`), which are critical for microcontroller register manipulation.",
  },
  {
    id: "emb-q38-what-is-a-character-in-c", topic: "emb-c", level: "Easy",
    q: "What is a character in C?",
    a: "A character (`char`) is an 8-bit integer type representing ASCII characters or raw byte data.\n• Range: `signed char` (-128 to 127), `unsigned char` (0 to 255).\n• In embedded systems, `uint8_t` (unsigned char) is widely used to manipulate hardware registers and byte buffers (e.g. UART RX data).",
  },
  {
    id: "emb-q39-what-is-a-float-in-c", topic: "emb-c", level: "Medium",
    q: "What is a float in C?",
    a: "A `float` is a 32-bit single-precision floating-point type following IEEE 754 standards, offering ~6-7 decimal digits of precision.\n• In low-end microcontrollers lacking a hardware Floating Point Unit (FPU), float operations are emulated in software, consuming significant CPU cycles and Flash memory.\n• Embedded firmware often uses integer fixed-point arithmetic instead of floats for high speed and deterministic timing.",
  },
  {
    id: "emb-q40-what-is-the-difference-between-int", topic: "emb-c", level: "Easy",
    q: "What is the difference between int and char?",
    a: "• `char`: 8 bits (1 byte), range -128 to 127 (signed) or 0 to 255 (unsigned), used for ASCII characters and raw byte-level register access.\n• `int`: 16 or 32 bits (architecture dependent), used for general arithmetic, loop counters, and larger numerical ranges. Uses more RAM than char.",
  },
  {
    id: "emb-q41-what-is-a-constant-in-c", topic: "emb-c", level: "Easy",
    q: "What is a constant in C?",
    a: "A fixed value that cannot be modified during program execution.\n• Defined using literals (e.g. `100`, `3.14f`), `#define` preprocessor macros, `const` keyword, or `enum`.\n• In embedded systems, `const` global variables are stored in Flash/ROM rather than RAM, conserving valuable volatile memory.",
  },
  {
    id: "emb-q42-what-is-the-const-keyword", topic: "emb-c", level: "Easy",
    q: "What is the const keyword?",
    a: "The `const` keyword declares a variable or pointer as read-only, preventing runtime modification by code.\n• In embedded systems, `const` global tables and variables are placed in Flash/ROM by the linker, saving RAM.\n• Used in function parameters (e.g. `void send_data(const uint8_t *buf)`) to prevent accidental buffer modification.",
  },
  {
    id: "emb-q43-what-is-the-volatile-keyword", topic: "emb-c", level: "Medium",
    q: "What is the volatile keyword?",
    a: "The `volatile` keyword informs the compiler that a variable's value can change unexpectedly at any time without any action taken by nearby code, preventing the compiler from optimizing away reads or writes or caching the variable in a CPU register.\n• Mandatory for: (1) Memory-mapped hardware registers, (2) Global variables shared between an ISR and main loop, (3) Variables shared across threads in an RTOS.",
  },
  {
    id: "emb-q44-why-is-volatile-used-in-embedded-c", topic: "emb-c", level: "Medium",
    q: "Why is volatile used in embedded C?",
    a: "In embedded systems, hardware peripherals and interrupt service routines modify memory locations outside the normal compiler-visible control flow.\n• Without `volatile`, compiler optimizations (e.g. `-O2`) might cache a status register value into a CPU register and create an infinite loop that never re-reads the updated hardware state.\n• `volatile` forces the CPU to perform an explicit memory read/write on every access.",
  },
  {
    id: "emb-q45-what-is-the-difference-between-cons", topic: "emb-c", level: "Medium",
    q: "What is the difference between const and volatile?",
    a: "• `const`: Read-only variable from the program's perspective (prevents software writes; stored in Flash/ROM).\n• `volatile`: Tells the compiler that the value can change asynchronously outside program flow; forces fresh memory access on every read.\n• `const volatile`: Read-only hardware register that is updated by external hardware (e.g., read-only UART status register `const volatile uint32_t * const UART_SR`).",
  },
  {
    id: "emb-q46-what-is-a-pointer-in-c", topic: "emb-c", level: "Easy",
    q: "What is a pointer in C?",
    a: "A pointer is a variable that stores the memory address of another variable or hardware register (`type *ptr`).\n• Enables indirect memory access, pass-by-reference in functions, dynamic buffer management, and memory-mapped register manipulation (`*(volatile uint32_t *)0x40000000 = 0x01;`).",
  },
  {
    id: "emb-q47-what-is-a-null-pointer", topic: "emb-c", level: "Easy",
    q: "What is a null pointer?",
    a: "A null pointer is a pointer initialized to `NULL` (or address `0`), indicating that it does not point to any valid object or memory location.\n• Used as a safe default value and to signal error conditions (e.g. memory allocation failure).\n• In embedded systems, dereferencing a NULL pointer causes a HardFault exception (on ARM) or memory corruption.",
  },
  {
    id: "emb-q48-what-is-dereferencing-a-pointer", topic: "emb-c", level: "Easy",
    q: "What is dereferencing a pointer?",
    a: "Dereferencing a pointer means using the unary `*` operator (or `->` for struct pointers) to read or modify the data stored at the memory address held by the pointer.\n• Example: `*ptr = 0x55;` writes `0x55` directly to the address stored in `ptr`.\n• In embedded C, dereferencing is how firmware reads and writes hardware peripheral registers.",
  },
  {
    id: "emb-q49-what-is-the-address-of-operator", topic: "emb-c", level: "Easy",
    q: "What is the & (address-of) operator?",
    a: "The `&` operator returns the memory address of a variable in RAM or Flash.\n• Used to create pointers (`uint8_t *ptr = &data;`) and to pass arguments by reference to functions, allowing the function to modify the caller's variable without copying large data blocks.",
  },
  {
    id: "emb-q50-what-is-the-operator-in-c", topic: "emb-c", level: "Easy",
    q: "What is the * operator in C?",
    a: "1. In declarations: Declares a pointer variable (`uint32_t *ptr;`).\n2. In expressions: Dereferences a pointer to access/modify the value at the pointed address (`*ptr = 10;`).\n3. In arithmetic: Multiplication operator (`a * b`).",
  },
  {
    id: "emb-q51-what-is-an-array-in-c", topic: "emb-c", level: "Easy",
    q: "What is an array in C?",
    a: "An array is a contiguous block of memory holding multiple elements of the same data type, accessed via zero-based indexing (`arr[i]`).\n• In embedded systems, arrays are widely used for sensor data buffers, lookup tables, and communication FIFOs.\n• Decays to a pointer when passed to functions.",
  },
  {
    id: "emb-q52-how-do-you-declare-an-array-in-c", topic: "emb-c", level: "Easy",
    q: "How do you declare an array in C?",
    a: "Syntax: `type name[size];` (e.g., `uint8_t buffer[64];`).\n• Can be initialized at declaration: `uint8_t leds[3] = {0x01, 0x02, 0x04};`.\n• Static/global arrays are zero-initialized by default in the `.bss` section if no initial values are provided.",
  },
  {
    id: "emb-q53-what-is-the-size-of-an-array-in-c", topic: "emb-c", level: "Medium",
    q: "What is the size of an array in C?",
    a: "The total size in bytes equals the number of elements multiplied by the size of each element type: `sizeof(arr)`.\n• The element count is calculated using `sizeof(arr) / sizeof(arr[0])`.\n• When passed into a function, an array decays to a pointer, so `sizeof` inside the function returns pointer size (2 or 4 bytes), not array size.",
  },
  {
    id: "emb-q54-what-is-a-string-in-c", topic: "emb-c", level: "Easy",
    q: "What is a string in C?",
    a: "A string in C is a null-terminated sequence of characters stored in a `char` array, ending with the null character `\\0`.\n• String literals (e.g. `\"AT+CMD\"`) are stored in read-only Flash/ROM as `const char *`.\n• In embedded systems, strings are used for UART communication, command parsing, and display messages.",
  },
  {
    id: "emb-q55-how-do-you-declare-a-string-in-c", topic: "emb-c", level: "Easy",
    q: "How do you declare a string in C?",
    a: "1. Modifiable char array: `char msg[10] = \"Hello\";` (allocated in RAM, null-terminated).\n2. String literal pointer: `const char *msg = \"Hello\";` (stored in Flash/ROM, read-only).\n3. Character list: `char str[] = {'O', 'K', '\\0'};`.",
  },
  {
    id: "emb-q56-what-is-a-function-in-c", topic: "emb-c", level: "Easy",
    q: "What is a function in C?",
    a: "A function is a reusable, modular block of code that performs a specific task, defined with a return type, name, and parameters (`int add(int a, int b) { return a + b; }`).\n• Promotes code modularity, reusability, and readability.\n• In embedded C, functions encapsulate peripheral drivers, math algorithms, and interrupt handlers.",
  },
  {
    id: "emb-q57-what-is-a-void-function", topic: "emb-c", level: "Easy",
    q: "What is a void function?",
    a: "A function declared with a `void` return type (`void init_gpio(void)`), indicating that it does not return any value to the caller.\n• Commonly used in embedded firmware for configuration routines, ISRs, and hardware control actions where operations produce side effects on physical registers rather than numerical results.",
  },
  {
    id: "emb-q58-what-is-the-return-type-of-main", topic: "emb-c", level: "Easy",
    q: "What is the return type of main()?",
    a: "In standard ANSI/ISO C, `main()` returns an `int` (`int main(void)`), where return value `0` indicates success.\n• In freestanding embedded systems, `main()` never returns because the MCU runs an infinite event loop.\n• Some embedded compilers accept `void main(void)`, though `int main(void)` is the standard portable convention.",
  },
  {
    id: "emb-q59-what-is-a-loop-in-c", topic: "emb-c", level: "Easy",
    q: "What is a loop in C?",
    a: "A control flow structure that repeatedly executes a block of code while a condition remains true.\n• Types: `for`, `while`, and `do-while`.\n• In embedded firmware, loops are used for hardware polling, delay generation, buffer processing, and the main system execution loop (`while(1)`).",
  },
  {
    id: "emb-q60-what-is-a-for-loop", topic: "emb-c", level: "Easy",
    q: "What is a for loop?",
    a: "A counted loop construct with initialization, condition, and increment/update in a single header: `for (init; condition; update) { ... }`.\n• Ideal for iterating over arrays, processing fixed-size data packets, and generating software delay loops in test benches.",
  },
  {
    id: "emb-q61-what-is-a-while-loop", topic: "emb-c", level: "Easy",
    q: "What is a while loop?",
    a: "A loop that evaluates its condition before each iteration: `while (condition) { ... }`.\n• Continues executing as long as the condition is true.\n• In embedded systems, `while(1)` forms the main firmware execution loop, and `while(!(UART->SR & TXE));` is used for hardware polling.",
  },
  {
    id: "emb-q62-what-is-an-if-statement", topic: "emb-c", level: "Easy",
    q: "What is an if statement?",
    a: "A conditional branching construct: `if (condition) { ... } else { ... }`.\n• Evaluates a Boolean expression to choose between alternate execution paths.\n• Used for sensor threshold checks, state transitions, and error validation.",
  },
  {
    id: "emb-q63-what-is-a-switch-statement", topic: "emb-c", level: "Easy",
    q: "What is a switch statement?",
    a: "A multi-way branching statement: `switch (expression) { case C1: ... break; default: ... }` that evaluates an integer expression against constant case values.\n• Generates efficient jump tables in assembly.\n• Extensively used in embedded firmware to implement Finite State Machines (FSMs) and protocol command decoders.",
  },
  {
    id: "emb-q64-what-is-a-structure-struct-in-c", topic: "emb-c", level: "Easy",
    q: "What is a structure (struct) in C?",
    a: "A user-defined composite data type that groups variables of different types under a single named unit.\n• Syntax: `struct SensorData { uint16_t raw; float temp; };`.\n• In embedded systems, structs are mapped directly over memory-mapped peripheral registers to provide clean, readable hardware register abstractions.",
  },
  {
    id: "emb-q65-how-do-you-define-a-struct-in-c", topic: "emb-c", level: "Easy",
    q: "How do you define a struct in C?",
    a: "1. Standard definition: `struct Point { int x; int y; };`\n2. With typedef alias: `typedef struct { uint16_t speed; uint8_t dir; } Motor_t;`\n• Allows declaring instances cleanly as `Motor_t m1;` without writing `struct` every time.",
  },
  {
    id: "emb-q66-what-is-a-union-in-c", topic: "emb-c", level: "Medium",
    q: "What is a union in C?",
    a: "A user-defined data type where all member variables share the exact same memory location; the size of the union is determined by its largest member.\n• Only one member can be stored at a time.\n• Widely used in embedded firmware for type punning, protocol packet parsing, and register bit/byte access (e.g. accessing a 32-bit register as four individual 8-bit bytes).",
  },
  {
    id: "emb-q67-what-is-the-difference-between-stru", topic: "emb-c", level: "Medium",
    q: "What is the difference between struct and union?",
    a: "• `struct`: Each member has its own distinct memory location; total size is the sum of member sizes plus padding for alignment.\n• `union`: All members share the same starting memory address; total size equals the size of the largest member. Saves RAM in resource-constrained MCUs when handling variable data formats.",
  },
  {
    id: "emb-q68-what-is-a-typedef-in-c", topic: "emb-c", level: "Easy",
    q: "What is a typedef in C?",
    a: "A keyword that creates a user-defined alias for an existing data type: `typedef unsigned char uint8_t;`.\n• Enhances code readability, reduces typing verbosity, and ensures architecture-independent portability across different compilers and MCU bit-widths.",
  },
  {
    id: "emb-q69-what-is-include-in-c", topic: "emb-c", level: "Easy",
    q: "What is #include in C?",
    a: "A preprocessor directive that inserts the entire contents of a specified file into the source code before compilation.\n• `<filename.h>`: Searches system/toolchain library include directories.\n• `\"filename.h\"`: Searches the local project directory first, then system paths.",
  },
  {
    id: "emb-q70-what-is-define-in-c", topic: "emb-c", level: "Easy",
    q: "What is #define in C?",
    a: "A preprocessor directive used for text substitution, defining constants (`#define LED_PIN 5`) or function-like macros (`#define MIN(a,b) ((a)<(b)?(a):(b))`).\n• Evaluated before compilation; does not allocate memory or perform type checking.",
  },
  {
    id: "emb-q71-what-is-a-macro-in-c", topic: "emb-c", level: "Medium",
    q: "What is a macro in C?",
    a: "A fragment of code defined using `#define` that is expanded inline by the preprocessor before compilation.\n• Avoids function call overhead (stack pushing/popping), useful for short register bit manipulation (e.g. `#define SET_BIT(reg, bit) ((reg) |= (1U << (bit)))`).\n• Must use parentheses around arguments to avoid operator precedence bugs.",
  },
  {
    id: "emb-q72-what-is-the-preprocessor-in-c", topic: "emb-c", level: "Easy",
    q: "What is the preprocessor in C?",
    a: "A tool that processes source code before the compiler executes.\n• Handles directives beginning with `#`: `#include` (file inclusion), `#define` (macro expansion), `#ifdef / #ifndef / #endif` (conditional compilation), and `#pragma` (compiler-specific directives).\n• Strips comments and produces pure expanded C code for the compiler.",
  },
  {
    id: "emb-q73-what-is-compilation-in-c", topic: "emb-c", level: "Easy",
    q: "What is compilation in C?",
    a: "The process of translating high-level C source code into machine-readable object code (`.o` / `.obj`).\n• Stages: (1) Preprocessing, (2) Lexical Analysis (tokenization), (3) Syntax & Semantic Analysis (parse tree), (4) Optimization, (5) Assembly code generation, (6) Machine code output.",
  },
  {
    id: "emb-q74-what-is-linking-in-c", topic: "emb-c", level: "Medium",
    q: "What is linking in C?",
    a: "The process performed by the linker that combines multiple compiled object files (`.o`) and library archives (`.a`) into a single executable binary image (`.elf`, `.hex`, `.bin`).\n• Resolves external symbols and function references.\n• Uses a linker script to map code and data sections to physical MCU Flash and RAM addresses.",
  },
  {
    id: "emb-q75-what-is-the-difference-between-decl", topic: "emb-c", level: "Easy",
    q: "What is the difference between declaration and definition?",
    a: "• Declaration: Introduces a symbol name and its type to the compiler without allocating memory (e.g. `extern int count;`, `void init(void);`). Can appear multiple times.\n• Definition: Allocates physical memory storage or provides the function implementation body (e.g. `int count = 0;`, `void init(void) { ... }`). Must occur exactly once (One Definition Rule).",
  },
  {
    id: "emb-q76-what-is-a-global-variable", topic: "emb-c", level: "Easy",
    q: "What is a global variable?",
    a: "A variable declared outside all functions, having file scope and static lifetime (exists throughout the entire program run).\n• Stored in the `.data` (if initialized) or `.bss` (if uninitialized) section in RAM.\n• Accessible by any function in the file (or across files if declared `extern`). In embedded systems, excessive globals risk concurrency bugs in ISRs.",
  },
  {
    id: "emb-q77-what-is-a-local-variable", topic: "emb-c", level: "Easy",
    q: "What is a local variable?",
    a: "A variable declared inside a function or block, having block scope and automatic lifetime (created when entering the block, destroyed on exit).\n• Stored on the CPU call stack or in CPU registers.\n• Private to the enclosing function, preventing unintended modifications.",
  },
  {
    id: "emb-q78-what-is-static-in-c", topic: "emb-c", level: "Medium",
    q: "What is static in C?",
    a: "1. Inside a function: A `static` local variable retains its value across function calls, initialized once and stored in RAM (`.data`/`.bss`) rather than the stack.\n2. Outside functions (global): A `static` global variable or function has internal linkage, restricting visibility strictly to the declaring translation unit (`.c` file), preventing naming collisions across modules.",
  },
  {
    id: "emb-q79-what-is-the-scope-of-a-variable", topic: "emb-c", level: "Easy",
    q: "What is the scope of a variable?",
    a: "Scope defines the region of code where a variable is visible and accessible:\n• Block/Local Scope: Accessible only within the enclosing `{ ... }` braces.\n• File Scope: Accessible from its declaration to the end of the source file.\n• Global/Program Scope: Accessible across all files in the project (using `extern`).",
  },
  {
    id: "emb-q80-what-is-recursion-in-c", topic: "emb-c", level: "Medium",
    q: "What is recursion in C?",
    a: "Recursion is when a function calls itself directly or indirectly to solve smaller subproblems until a base condition is reached.\n• In embedded firmware, recursion is generally prohibited (MISRA-C rule) because each recursive call creates a new stack frame, risking rapid stack overflow in memory-constrained MCUs.",
  },
  {
    id: "emb-q81-what-is-the-8051-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is the 8051 microcontroller?",
    a: "An 8-bit Harvard architecture microcontroller developed by Intel in 1980.\n• Architecture: 8-bit CPU, 4 KB on-chip ROM, 128 bytes on-chip RAM, 32 programmable I/O pins (four 8-bit ports P0–P3), two 16-bit timers/counters, full-duplex UART, and 5 interrupt sources.\n• Memory space: Supports up to 64 KB external program ROM and 64 KB external data RAM.",
  },
  {
    id: "emb-q82-what-is-an-avr-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is an AVR microcontroller?",
    a: "A family of modified Harvard architecture 8-bit RISC microcontrollers developed by Atmel (now Microchip).\n• Features single-cycle instruction execution (most instructions execute in 1 clock cycle), on-chip Flash, SRAM, EEPROM, and rich peripherals (GPIO, Timers, ADC, SPI, I2C, UART).\n• Basis of the Arduino Uno platform (ATmega328P); programmed via In-System Programming (ISP) or JTAG.",
  },
  {
    id: "emb-q83-what-is-an-arm-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is an ARM microcontroller?",
    a: "A 32-bit RISC microcontroller based on ARM architecture cores licensed by ARM Holdings (e.g. Cortex-M0/M0+/M3/M4/M7).\n• Standard in modern embedded systems: high computational efficiency, low power consumption, Nested Vectored Interrupt Controller (NVIC), hardware divide/FPU options, and rich peripheral sets.\n• Manufactured by ST (STM32), NXP, Microchip, TI, Silicon Labs.",
  },
  {
    id: "emb-q84-what-is-the-clock-in-a-microcontrol", topic: "emb-basics", level: "Easy",
    q: "What is the clock in a microcontroller?",
    a: "The timing reference signal (square wave in Hz/MHz) that synchronizes all internal CPU operations, instruction pipelining, bus transactions, and peripheral timers.\n• Higher clock frequency increases instruction throughput but increases dynamic power consumption.\n• Generated by internal RC oscillators or external quartz crystals, often multiplied by on-chip PLLs.",
  },
  {
    id: "emb-q85-what-is-an-oscillator", topic: "emb-basics", level: "Easy",
    q: "What is an oscillator?",
    a: "A circuit that generates a repetitive periodic electronic signal (clock wave) for the microcontroller.\n• Internal RC Oscillator: Low cost, fast startup, but lower accuracy and temperature drift (typically 1-2%).\n• External Crystal / Ceramic Resonator: High frequency accuracy and stability (ppm precision), required for USB, CAN, and precision UART baud rates.",
  },
  {
    id: "emb-q86-what-is-the-reset-pin", topic: "emb-basics", level: "Easy",
    q: "What is the reset pin?",
    a: "A dedicated hardware pin (typically active-low `RESET` / `NRST`) that forces the microcontroller CPU core and peripherals into a known initial state.\n• When asserted, registers reset to default values, the program counter is loaded with the reset vector, and execution restarts from the beginning of firmware.",
  },
  {
    id: "emb-q87-what-is-the-power-pin", topic: "emb-basics", level: "Easy",
    q: "What is the power pin?",
    a: "Pins that supply operating DC voltage (`VDD` / `VCC`) and ground (`VSS` / `GND`) to the MCU.\n• Many MCUs feature separate analog supply pins (`VDDA`, `VSSA`) for low-noise ADC/DAC operations.\n• Decoupling capacitors (0.1 µF ceramic) must be placed as close as possible to power pins to filter high-frequency switching noise.",
  },
  {
    id: "emb-q88-what-are-gpio-pins", topic: "emb-basics", level: "Easy",
    q: "What are GPIO pins?",
    a: "GPIO (General Purpose Input/Output) pins are software-configurable digital pins on an MCU.\n• Can be configured as Inputs (reading buttons, logic signals) or Outputs (driving LEDs, relays, control lines).\n• Often support alternate functions like UART TX/RX, SPI SCK/MOSI/MISO, I2C SDA/SCL, or analog ADC inputs.",
  },
  {
    id: "emb-q89-what-does-gpio-stand-for", topic: "emb-basics", level: "Easy",
    q: "What does GPIO stand for?",
    a: "GPIO stands for General Purpose Input/Output.\n• 'General Purpose': Not dedicated to a single fixed function; can be repurposed by firmware.\n• 'Input/Output': Capable of reading external logic levels or driving output voltage signals.",
  },
  {
    id: "emb-q90-how-do-you-configure-a-gpio-pin-as", topic: "emb-basics", level: "Easy",
    q: "How do you configure a GPIO pin as input?",
    a: "Set the direction control bit in the GPIO Data Direction Register (DDR in AVR) or Mode Register (MODER in STM32) to `0` (input mode).\n• Optionally enable internal pull-up or pull-down resistors to prevent floating inputs.\n• Read the incoming logic level from the Input Data Register (e.g. `PINB` in AVR, `GPIOA->IDR` in STM32).",
  },
  {
    id: "emb-q91-how-do-you-configure-a-gpio-pin-as", topic: "emb-basics", level: "Easy",
    q: "How do you configure a GPIO pin as output?",
    a: "1. Set the direction bit in the Data Direction Register (DDR) or Mode Register to `1` (output mode).\n2. Write to the Output Data Register (e.g. `PORTB |= (1 << PB0);` in AVR or `GPIOA->ODR` / `BSRR` in STM32) to drive the pin HIGH (VDD) or LOW (GND).\n3. Optionally configure output type (push-pull or open-drain) and drive speed.",
  },
  {
    id: "emb-q92-what-is-a-pull-up-resistor", topic: "emb-basics", level: "Easy",
    q: "What is a pull-up resistor?",
    a: "A resistor (typically 4.7kΩ–100kΩ) connected between a GPIO pin and the positive supply voltage (VDD).\n• Ensures the pin remains at a deterministic HIGH state when no external circuit is actively driving it (prevents high-impedance floating inputs).\n• Crucial for active-low buttons and open-drain buses like I2C.",
  },
  {
    id: "emb-q93-what-is-a-pull-down-resistor", topic: "emb-basics", level: "Easy",
    q: "What is a pull-down resistor?",
    a: "A resistor connected between a GPIO pin and Ground (GND).\n• Ensures the pin stays at a deterministic LOW (0V) state when not actively driven, preventing noise from causing false logic transitions on active-high input switches.",
  },
  {
    id: "emb-q94-what-is-the-address-bus", topic: "emb-basics", level: "Easy",
    q: "What is the address bus?",
    a: "A unidirectional group of physical wires carrying memory addresses from the CPU to memory units (RAM, Flash) and memory-mapped peripherals.\n• The width of the address bus determines maximum addressable memory space ($2^N$ bytes, where $N$ is the number of address lines: 16 bits = 64 KB, 32 bits = 4 GB).",
  },
  {
    id: "emb-q95-what-is-the-data-bus", topic: "emb-basics", level: "Easy",
    q: "What is the data bus?",
    a: "A bidirectional group of wires that transfers data bytes/words between the CPU core, memory subsystems, and peripherals.\n• Bus width (8-bit, 16-bit, 32-bit, 64-bit) determines how much data can be transferred in a single memory cycle.",
  },
  {
    id: "emb-q96-what-is-the-control-bus", topic: "emb-basics", level: "Easy",
    q: "What is the control bus?",
    a: "A set of signal lines used by the CPU to synchronize and coordinate operations with memory and peripherals.\n• Includes Read/Write enable (`RD`, `WR`), Chip Select (`CS`), Output Enable (`OE`), Clock, and Interrupt Request lines.",
  },
  {
    id: "emb-q97-what-is-harvard-architecture", topic: "emb-basics", level: "Medium",
    q: "What is Harvard architecture?",
    a: "A computer architecture featuring physically separate memory spaces and separate buses for program instructions and data.\n• Allows simultaneous instruction fetch and data read/write in the same clock cycle, eliminating bus contention bottlenecks.\n• Common in DSPs and microcontrollers (AVR, PIC, 8051, ARM Cortex-M modified Harvard).",
  },
  {
    id: "emb-q98-what-is-von-neumann-architecture", topic: "emb-basics", level: "Medium",
    q: "What is Von Neumann architecture?",
    a: "A computer architecture where program instructions and data share the same unified memory space and single bus system.\n• Simpler hardware design, but suffers from the 'Von Neumann bottleneck': the CPU cannot read an instruction and read/write data simultaneously.",
  },
  {
    id: "emb-q99-what-is-the-difference-between-harv", topic: "emb-basics", level: "Medium",
    q: "What is the difference between Harvard and Von Neumann architecture?",
    a: "• Harvard: Separate instruction and data memories with dedicated buses. Simultaneous code fetch and data access, higher throughput, fixed memory partition (AVR, DSPs, Cortex-M).\n• Von Neumann: Single shared memory and bus for both code and data. Lower hardware complexity, flexible memory allocation, but prone to bus contention bottlenecks (x86, standard PCs).",
  },
  {
    id: "emb-q100-what-is-a-register-in-a-microcontro", topic: "emb-basics", level: "Easy",
    q: "What is a register in a microcontroller?",
    a: "A register is a small, high-speed on-chip storage location directly inside the CPU core or peripheral hardware.\n• Categories: (1) General-Purpose Registers (ALU calculations), (2) Special Function Registers (Program Counter, Stack Pointer, Status Flags), (3) Peripheral Control/Status/Data Registers (GPIO, UART, Timers).\n• In embedded C, peripheral registers are accessed via memory-mapped pointers.",
  },
  {
    id: "emb-q101-what-is-the-accumulator", topic: "emb-basics", level: "Easy",
    q: "What is the accumulator?",
    a: "The accumulator is a primary CPU working register used to hold operands and intermediate results of arithmetic and logical operations performed by the ALU.\n• In 8-bit MCUs like the 8051, register `A` is the implicit operand for nearly all ALU instructions (`ADD A, #5`).\n• In modern RISC 32-bit architectures (ARM), general-purpose registers (R0–R12) replace dedicated single accumulators.",
  },
  {
    id: "emb-q102-what-is-the-program-counter-pc", topic: "emb-basics", level: "Easy",
    q: "What is the program counter (PC)?",
    a: "The Program Counter (PC) is a dedicated CPU register that holds the memory address of the next instruction to be fetched and executed.\n• Automatically increments after each instruction fetch, or is updated to target branch addresses during jumps, function calls, interrupts, and returns.\n• Starts at the reset vector upon power-on.",
  },
  {
    id: "emb-q103-what-is-the-stack-pointer-sp", topic: "emb-basics", level: "Easy",
    q: "What is the stack pointer (SP)?",
    a: "The Stack Pointer (SP) is a dedicated CPU register that holds the current memory address of the top of the call stack in RAM.\n• Automatically decrements/increments during `PUSH` and `POP` operations, function calls (storing return addresses), and interrupt context saves.\n• Initialized to the top of RAM at startup.",
  },
  {
    id: "emb-q104-what-is-the-status-register-flags", topic: "emb-basics", level: "Easy",
    q: "What is the status register (flags register)?",
    a: "A special register containing individual condition flag bits that record the outcome of recent ALU operations and CPU states.\n• Common Flags: Zero Flag (`Z`), Carry Flag (`C`), Overflow Flag (`V`), Negative/Sign Flag (`N`), and Interrupt Enable Flag (`I`).\n• Condition flags drive conditional branch decisions (`BEQ`, `BNE`, `JC`).",
  },
  {
    id: "emb-q105-what-is-endianness", topic: "emb-basics", level: "Medium",
    q: "What is endianness?",
    a: "Endianness defines the byte ordering in which multi-byte data types (16-bit, 32-bit integers) are stored in computer memory.\n• Little-Endian: Least Significant Byte (LSB) is stored at the lowest memory address.\n• Big-Endian: Most Significant Byte (MSB) is stored at the lowest memory address.\n• ARM Cortex-M and x86 default to little-endian, while network protocols (TCP/IP) use big-endian.",
  },
  {
    id: "emb-q106-what-is-little-endian", topic: "emb-basics", level: "Medium",
    q: "What is little-endian?",
    a: "Little-endian is a memory format where the least significant byte (LSB) is placed at the lowest numerical memory address.\n• Example: 32-bit integer `0x12345678` stored at address `0x2000`:\n  `0x2000: 0x78 (LSB)`\n  `0x2001: 0x56`\n  `0x2002: 0x34`\n  `0x2003: 0x12 (MSB)`\n• Native architecture for ARM Cortex-M and x86 processors.",
  },
  {
    id: "emb-q107-what-is-big-endian", topic: "emb-basics", level: "Medium",
    q: "What is big-endian?",
    a: "Big-endian is a memory format where the most significant byte (MSB) is placed at the lowest numerical memory address.\n• Example: `0x12345678` stored at address `0x2000`:\n  `0x2000: 0x12 (MSB)`\n  `0x2001: 0x34`\n  `0x2002: 0x56`\n  `0x2003: 0x78 (LSB)`\n• Standard for network protocols (network byte order) and some older architectures (Motorola 68k, PowerPC).",
  },
  {
    id: "emb-q108-how-do-you-check-endianness-in-code", topic: "emb-basics", level: "Medium",
    q: "How do you check endianness in code?",
    a: "Declare a multi-byte integer with a known pattern and cast its address to a char pointer to inspect the first byte:\n```c\nint is_little_endian(void) {\n    uint16_t test = 0x0001;\n    uint8_t *byte_ptr = (uint8_t *)&test;\n    return (*byte_ptr == 0x01); // Returns 1 if Little-Endian, 0 if Big-Endian\n}\n```",
  },
  {
    id: "emb-q109-what-is-the-memory-map-in-a-microco", topic: "emb-basics", level: "Medium",
    q: "What is the memory map in a microcontroller?",
    a: "A memory map is the complete architectural layout and address allocation of all on-chip and off-chip memory regions and peripherals across the MCU's address space.\n• Shows base addresses and boundary ranges for Flash ROM, SRAM, Peripheral Registers, System Control Blocks (NVIC, SysTick), and external memory banks.\n• Example in STM32: Flash starts at `0x08000000`, SRAM at `0x20000000`, Peripherals at `0x40000000`.",
  },
  {
    id: "emb-q110-what-is-ram-in-a-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is RAM in a microcontroller?",
    a: "On-chip Static RAM (SRAM) providing high-speed volatile data memory.\n• Organized into sections: (1) Data segment (initialized global/static variables), (2) BSS segment (zero-initialized globals), (3) Heap (dynamic memory), (4) Stack (function parameters, local variables, ISR registers).\n• Sized from a few hundred bytes up to several megabytes.",
  },
  {
    id: "emb-q111-what-is-rom-in-a-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is ROM in a microcontroller?",
    a: "Non-volatile memory used to store the application firmware, bootloader, and constant lookup tables.\n• Retains contents through power cycles.\n• In modern MCUs, on-chip NOR Flash functions as reprogrammable ROM with execute-in-place (XIP) capability.",
  },
  {
    id: "emb-q112-what-is-flash-memory-in-a-microcont", topic: "emb-basics", level: "Easy",
    q: "What is flash memory in a microcontroller?",
    a: "On-chip non-volatile NOR Flash memory that stores the compiled binary executable image.\n• Read access is fast with XIP support; write/erase operations are slower and executed in sectors or pages.\n• Reprogrammable via in-system debuggers (JTAG/SWD), serial bootloaders, or OTA wireless updates.",
  },
  {
    id: "emb-q113-what-is-the-interrupt-vector-table", topic: "emb-basics", level: "Medium",
    q: "What is the interrupt vector table (IVT)?",
    a: "An array of memory addresses located at a fixed memory location (e.g. `0x00000000` in ARM Cortex-M) where each entry contains the starting address (function pointer) of an Interrupt Service Routine (ISR).\n• When a hardware interrupt triggers, the CPU core hardware automatically looks up the vector table to fetch the ISR address and branches immediately.",
  },
  {
    id: "emb-q114-what-is-the-cpu-core", topic: "emb-basics", level: "Easy",
    q: "What is the CPU core?",
    a: "The central processing engine of the microcontroller that fetches, decodes, and executes binary instructions.\n• Comprises the Arithmetic Logic Unit (ALU), Instruction Decoder, Control Unit, Register Bank, and internal bus interfaces.\n• Determines architecture bit-width (8/16/32-bit), pipeline depth, and performance (e.g., ARM Cortex-M4).",
  },
  {
    id: "emb-q115-what-is-the-alu-arithmetic-logic-u", topic: "emb-basics", level: "Easy",
    q: "What is the ALU (Arithmetic Logic Unit)?",
    a: "The core computational component of the CPU that executes:\n• Arithmetic operations: Addition, subtraction, multiplication, division.\n• Logical operations: AND, OR, XOR, NOT, bit-shifting, and comparisons.\n• Updates CPU condition status flags (Carry, Zero, Negative, Overflow) after each calculation.",
  },
  {
    id: "emb-q116-what-is-the-role-of-the-bus-in-a-mi", topic: "emb-basics", level: "Easy",
    q: "What is the role of the bus in a microcontroller?",
    a: "A high-speed communication backbone that interconnects the CPU core, memory units, and peripheral controllers.\n• High-performance bus standards (e.g., ARM AMBA AHB / APB) separate high-bandwidth memory transfers from lower-speed peripheral register accesses to optimize power and performance.",
  },
  {
    id: "emb-q117-what-is-a-port-in-a-microcontroller", topic: "emb-basics", level: "Easy",
    q: "What is a port in a microcontroller?",
    a: "A group of GPIO pins (typically 8, 16, or 32 pins) bundled together and controlled collectively by a single set of memory-mapped control registers (e.g., `PORTA`, `PORTB`, `GPIOD`).\n• Allows simultaneous parallel reading or writing of multiple digital lines.",
  },
  {
    id: "emb-q118-what-is-port-0-in-8051", topic: "emb-basics", level: "Medium",
    q: "What is Port 0 in 8051?",
    a: "Port 0 in the 8051 is an 8-bit bidirectional multiplexed Address/Data bus (`AD0–AD7`) used when interfacing external memory.\n• In general I/O mode, it is an open-drain port requiring external pull-up resistors to output a logic HIGH.",
  },
  {
    id: "emb-q119-what-is-the-crystal-oscillator", topic: "emb-basics", level: "Easy",
    q: "What is the crystal oscillator?",
    a: "An external electronic oscillator circuit that utilizes the mechanical resonance of a vibrating quartz crystal to generate a stable, highly accurate clock frequency.\n• Essential for applications demanding tight timing synchronization, such as USB, CAN, Ethernet, and precise UART baud rates.",
  },
  {
    id: "emb-q120-what-is-the-baud-rate", topic: "emb-basics", level: "Easy",
    q: "What is the baud rate?",
    a: "The rate at which data is transmitted over a serial communication channel, expressed in symbols or bits per second (bps).\n• Common baud rates: 9600, 19200, 38400, 57600, 115200 bps.\n• Both transmitter and receiver must be configured with matching baud rates to prevent framing errors.",
  },
  {
    id: "emb-q121-what-is-uart", topic: "emb-protocols", level: "Easy",
    q: "What is UART?",
    a: "UART (Universal Asynchronous Receiver/Transmitter) is a hardware serial communication peripheral that transmits and receives data asynchronously bit-by-bit over two dedicated signal lines: `TX` (Transmit) and `RX` (Receive).\n• Uses start, data, optional parity, and stop bits to frame bytes without a shared clock line.",
  },
  {
    id: "emb-q122-what-does-uart-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does UART stand for?",
    a: "UART stands for Universal Asynchronous Receiver/Transmitter.\n• 'Universal': Configurable data format (5–9 bits, parity, stop bits, baud rate).\n• 'Asynchronous': No shared clock line.\n• 'Receiver/Transmitter': Dual transmit and receive capability.",
  },
  {
    id: "emb-q123-what-is-serial-communication", topic: "emb-protocols", level: "Easy",
    q: "What is serial communication?",
    a: "A method of transmitting data sequentially, one bit at a time, over a single wire or communication channel.\n• Requires far fewer physical pins, traces, and cable wires than parallel communication, reducing PCB routing complexity and cost.\n• Examples: UART, SPI, I2C, CAN, USB.",
  },
  {
    id: "emb-q124-what-is-parallel-communication", topic: "emb-protocols", level: "Easy",
    q: "What is parallel communication?",
    a: "A method of transmitting multiple data bits simultaneously over multiple parallel wires (e.g., 8, 16, or 32 data lines) in a single clock cycle.\n• High throughput over short distances, but suffers from clock skew, wire crosstalk, and high pin count over longer traces.",
  },
  {
    id: "emb-q125-what-is-the-difference-between-seri", topic: "emb-protocols", level: "Easy",
    q: "What is the difference between serial and parallel communication?",
    a: "• Serial: Transfers 1 bit at a time over 1-2 wires. Low pin count, simpler PCB layout, low crosstalk, preferred for chip-to-chip and long-distance links.\n• Parallel: Transfers multiple bits simultaneously over multiple wires. Higher pin count and cost, prone to signal skew over distance; mostly restricted to on-chip buses and high-speed memory interfaces.",
  },
  {
    id: "emb-q126-what-is-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is I2C?",
    a: "I2C (Inter-Integrated Circuit) is a synchronous, multi-master, multi-slave, 2-wire serial bus developed by Philips (NXP).\n• Signal Lines: `SDA` (Serial Data) and `SCL` (Serial Clock), both open-drain requiring pull-up resistors.\n• Speeds: Standard (100 kbps), Fast (400 kbps), Fast Plus (1 Mbps), High Speed (3.4 Mbps).\n• Uses 7-bit or 10-bit addressing to communicate with multiple slave devices on the same 2 wires.",
  },
  {
    id: "emb-q127-what-does-i2c-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does I2C stand for?",
    a: "I2C stands for Inter-Integrated Circuit (also written as I²C).\n• Named for its primary design purpose: enabling simple communication between integrated circuit chips on the same printed circuit board.",
  },
  {
    id: "emb-q128-what-is-the-master-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is the master in I2C?",
    a: "The device on the I2C bus that initiates a transfer, drives the `SCL` clock line, transmits slave addresses, and generates START and STOP framing conditions.",
  },
  {
    id: "emb-q129-what-is-the-slave-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is the slave in I2C?",
    a: "A device on the I2C bus that is addressed by a master, responds to read/write requests, and acknowledges transfers via ACK/NACK bits. Does not drive the SCL clock (except during clock stretching).",
  },
  {
    id: "emb-q130-what-is-the-clock-line-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is the clock line in I2C?",
    a: "The `SCL` (Serial Clock) line is the open-drain clock signal wire driven by the master to synchronize bit transfers across the I2C bus.\n• Data on `SDA` is only allowed to change when `SCL` is LOW, and must remain stable while `SCL` is HIGH.",
  },
  {
    id: "emb-q131-what-is-sda-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is SDA in I2C?",
    a: "The `SDA` (Serial Data) line is the bidirectional open-drain line carrying device addresses, read/write commands, data payload bytes, and ACK/NACK acknowledge bits.",
  },
  {
    id: "emb-q132-what-is-spi", topic: "emb-protocols", level: "Easy",
    q: "What is SPI?",
    a: "SPI (Serial Peripheral Interface) is a high-speed, synchronous, full-duplex, 4-wire serial bus developed by Motorola.\n• Signals: `MOSI` (Master Out Slave In), `MISO` (Master In Slave Out), `SCK` (Serial Clock), and `SS/CS` (Slave Select / Chip Select).\n• Speeds: Can reach 10–50+ MHz with low protocol overhead, ideal for high-speed Flash memory, SD cards, and TFT displays.",
  },
  {
    id: "emb-q133-what-does-spi-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does SPI stand for?",
    a: "SPI stands for Serial Peripheral Interface.",
  },
  {
    id: "emb-q134-what-is-full-duplex-in-spi", topic: "emb-protocols", level: "Easy",
    q: "What is full-duplex in SPI?",
    a: "Full-duplex means data can be transmitted and received simultaneously on separate dedicated wires (`MOSI` for transmit, `MISO` for receive) on every single clock pulse, doubling effective data throughput.",
  },
  {
    id: "emb-q135-what-is-mosi-in-spi", topic: "emb-protocols", level: "Easy",
    q: "What is MOSI in SPI?",
    a: "MOSI stands for Master Out Slave In. It is the unidirectional serial data line driven by the SPI Master to send commands, configuration, and data bytes to SPI Slave devices.",
  },
  {
    id: "emb-q136-what-is-miso-in-spi", topic: "emb-protocols", level: "Easy",
    q: "What is MISO in SPI?",
    a: "MISO stands for Master In Slave Out. It is the unidirectional serial data line driven by the selected SPI Slave to send data back to the SPI Master.",
  },
  {
    id: "emb-q137-what-is-sck-in-spi", topic: "emb-protocols", level: "Easy",
    q: "What is SCK in SPI?",
    a: "SCK (Serial Clock) is the clock line driven by the master to synchronize data bit shifting and sampling on MOSI and MISO lines, configured via CPOL and CPHA parameters.",
  },
  {
    id: "emb-q138-what-is-ss-cs-in-spi", topic: "emb-protocols", level: "Easy",
    q: "What is SS / CS in SPI?",
    a: "SS (Slave Select) or CS (Chip Select) is an active-low line driven by the master to enable and address a specific SPI slave device. Each slave requires its own dedicated SS line.",
  },
  {
    id: "emb-q139-what-is-the-difference-between-i2c", topic: "emb-protocols", level: "Medium",
    q: "What is the difference between I2C and SPI?",
    a: "• I2C: 2 wires (SDA, SCL), open-drain with pull-ups, half-duplex, multi-master support, device addressing in software, up to 1-3.4 Mbps.\n• SPI: 4+ wires (MOSI, MISO, SCK, plus 1 SS line per slave), push-pull drivers, full-duplex, single master, hardware SS addressing, high speed (10–50+ MHz).",
  },
  {
    id: "emb-q140-what-is-can", topic: "emb-protocols", level: "Medium",
    q: "What is CAN?",
    a: "CAN (Controller Area Network) is a robust, message-based differential serial bus protocol designed by Bosch for automotive and industrial environments.\n• Uses twisted pair differential lines (`CAN_H`, `CAN_L`) for high electromagnetic noise immunity.\n• Speeds: Up to 1 Mbps (Classical CAN) or 5–8 Mbps (CAN FD).\n• Features non-destructive bitwise arbitration based on message IDs, built-in CRC error detection, and automatic fault confinement.",
  },
  {
    id: "emb-q141-what-does-can-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does CAN stand for?",
    a: "CAN stands for Controller Area Network.",
  },
  {
    id: "emb-q142-what-is-usb-in-embedded-systems", topic: "emb-protocols", level: "Easy",
    q: "What is USB in embedded systems?",
    a: "Universal Serial Bus (USB) is a high-speed, tiered-star topology serial bus providing data communication and power delivery (5V) over differential D+/D- lines.\n• Embedded MCUs can function as USB Device (HID keyboard, Virtual COM Port/CDC, Mass Storage) or USB Host/OTG.",
  },
  {
    id: "emb-q143-what-is-a-baud-rate-in-uart", topic: "emb-protocols", level: "Easy",
    q: "What is a baud rate in UART?",
    a: "The transmission speed of UART serial communication, defining the bit period: $T_{bit} = 1 / \\text{Baud Rate}$.\n• Example: At 9600 bps, each bit duration is $\\approx 104.16\\,\\mu\\text{s}$. At 115200 bps, each bit is $\\approx 8.68\\,\\mu\\text{s}$.",
  },
  {
    id: "emb-q144-how-do-you-initialize-uart-in-firmw", topic: "emb-protocols", level: "Medium",
    q: "How do you initialize UART in firmware?",
    a: "1. Enable the peripheral clock for the UART module and associated GPIO port.\n2. Configure GPIO pins as Alternate Function (TX as push-pull output, RX as input/pull-up).\n3. Calculate and set the Baud Rate Register (BRR / UBRR) based on system clock.\n4. Set frame format: Data bits (8), Parity (None/Even/Odd), Stop bits (1 or 2) — typically 8-N-1.\n5. Enable Transmitter (`TE`/`TXEN`) and Receiver (`RE`/`RXEN`).\n6. Optionally enable RX interrupt (`RXNEIE`) in the NVIC/interrupt controller.",
  },
  {
    id: "emb-q145-what-is-a-communication-protocol", topic: "emb-protocols", level: "Easy",
    q: "What is a communication protocol?",
    a: "A formal set of standardized rules that define how data is framed, formatted, transmitted, received, synchronized, and verified for errors across a communication link.",
  },
  {
    id: "emb-q146-what-is-half-duplex-communication", topic: "emb-protocols", level: "Easy",
    q: "What is half-duplex communication?",
    a: "A communication mode where data can flow in both directions between two nodes, but only in one direction at a time (devices take turns transmitting and receiving).\n• Examples: I2C, RS-485, walkie-talkies.",
  },
  {
    id: "emb-q147-what-is-the-start-bit-in-uart", topic: "emb-protocols", level: "Easy",
    q: "What is the start bit in UART?",
    a: "A single logic LOW bit (0) transmitted at the beginning of every UART frame to signal to the idle HIGH receiver that a new character is starting, aligning receiver clock sampling.",
  },
  {
    id: "emb-q148-what-is-the-stop-bit-in-uart", topic: "emb-protocols", level: "Easy",
    q: "What is the stop bit in UART?",
    a: "One or two logic HIGH bits (1) transmitted at the end of a UART frame to return the bus to the idle state and give the receiver time to process the byte before the next start bit.",
  },
  {
    id: "emb-q149-what-is-a-parity-bit-in-serial-comm", topic: "emb-protocols", level: "Easy",
    q: "What is a parity bit in serial communication?",
    a: "An optional error-detecting bit appended to the data bits in a UART frame:\n• Even Parity: Parity bit is set so that the total number of 1s in data + parity is even.\n• Odd Parity: Parity bit is set so that the total number of 1s is odd.\n• Detects single-bit transmission errors.",
  },
  {
    id: "emb-q150-what-is-asynchronous-communication", topic: "emb-protocols", level: "Easy",
    q: "What is asynchronous communication?",
    a: "Serial communication where data is transferred without a separate shared clock signal.\n• Transmitter and receiver must agree beforehand on clock speed (baud rate), and synchronize per-character using Start and Stop bits (e.g., UART).",
  },
  {
    id: "emb-q151-what-is-synchronous-communication", topic: "emb-protocols", level: "Easy",
    q: "What is synchronous communication?",
    a: "Communication where data bits are synchronized to an explicit shared clock signal line (e.g., `SCK` in SPI, `SCL` in I2C).\n• Eliminates start/stop framing overhead, achieving higher throughput.",
  },
  {
    id: "emb-q152-what-is-the-address-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is the address in I2C?",
    a: "A 7-bit (or 10-bit) unique identifier assigned to each slave device on the bus, transmitted by the master in the first byte after a START condition, followed by the Read/Write bit.",
  },
  {
    id: "emb-q153-what-is-ack-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is ACK in I2C?",
    a: "Acknowledge (ACK): A logic LOW signal driven on the SDA line during the 9th SCL clock cycle by the receiver to confirm successful receipt of an address or data byte.",
  },
  {
    id: "emb-q154-what-is-nack-in-i2c", topic: "emb-protocols", level: "Easy",
    q: "What is NACK in I2C?",
    a: "Not Acknowledge (NACK): A logic HIGH condition on SDA during the 9th SCL clock cycle, indicating that a slave is not present, busy, unable to accept more data, or that a master read transfer is ending.",
  },
  {
    id: "emb-q155-what-is-clock-stretching-in-i2c", topic: "emb-protocols", level: "Medium",
    q: "What is clock stretching in I2C?",
    a: "A mechanism where an I2C slave holds the `SCL` line LOW to pause the master while it processes data or finishes an internal operation.\n• The master must wait until the slave releases `SCL` before generating subsequent clock pulses.",
  },
  {
    id: "emb-q156-what-is-spi-mode-cpol-and-cpha", topic: "emb-protocols", level: "Medium",
    q: "What is SPI mode (CPOL and CPHA)?",
    a: "SPI modes (0, 1, 2, 3) define the clock polarity (`CPOL`) and clock phase (`CPHA`):\n• CPOL=0: Clock idles LOW; CPOL=1: Clock idles HIGH.\n• CPHA=0: Data sampled on first clock edge; CPHA=1: Data sampled on second clock edge.\n• Mode 0 (CPOL=0, CPHA=0) is the most common standard.",
  },
  {
    id: "emb-q157-what-is-an-adc-analog-to-digital-c", topic: "emb-protocols", level: "Easy",
    q: "What is an ADC (Analog-to-Digital Converter)?",
    a: "An on-chip peripheral that samples a continuous analog voltage signal from a sensor and converts it into a discrete digital numerical representation for MCU processing.\n• Defined by resolution (e.g. 10-bit = 1024 levels, 12-bit = 4096 levels) and sampling rate (kSPS / MSPS).",
  },
  {
    id: "emb-q158-what-does-adc-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does ADC stand for?",
    a: "ADC stands for Analog-to-Digital Converter.",
  },
  {
    id: "emb-q159-what-is-a-dac-digital-to-analog-co", topic: "emb-protocols", level: "Easy",
    q: "What is a DAC (Digital-to-Analog Converter)?",
    a: "A peripheral that converts discrete digital binary numbers into proportional continuous analog voltage or current signals.\n• Used for audio generation, waveform synthesis, and precision reference control.",
  },
  {
    id: "emb-q160-what-does-dac-stand-for", topic: "emb-protocols", level: "Easy",
    q: "What does DAC stand for?",
    a: "DAC stands for Digital-to-Analog Converter.",
  },
  {
    id: "emb-q161-what-is-an-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is an interrupt?",
    a: "An asynchronous hardware or software signal that temporarily suspends the main CPU program execution, causing the CPU to save its current context and branch to an Interrupt Service Routine (ISR) to handle a time-sensitive event immediately.",
  },
  {
    id: "emb-q162-what-is-an-isr-interrupt-service-r", topic: "emb-rtos", level: "Easy",
    q: "What is an ISR (Interrupt Service Routine)?",
    a: "A specialized callback function executed automatically by the CPU when an interrupt triggers.\n• Best practices: Must be short, deterministic, avoid delays or blocking calls, use `volatile` shared flags, and clear the peripheral interrupt flag.",
  },
  {
    id: "emb-q163-what-does-isr-stand-for", topic: "emb-rtos", level: "Easy",
    q: "What does ISR stand for?",
    a: "ISR stands for Interrupt Service Routine.",
  },
  {
    id: "emb-q164-what-is-interrupt-latency", topic: "emb-rtos", level: "Medium",
    q: "What is interrupt latency?",
    a: "The time elapsed between the generation of an interrupt request by hardware and the execution of the first instruction in the corresponding ISR.\n• Comprises hardware context-saving cycles, pipeline flush, vector table fetch, and any delay from higher-priority ISRs.",
  },
  {
    id: "emb-q165-how-do-you-reduce-interrupt-latency", topic: "emb-rtos", level: "Medium",
    q: "How do you reduce interrupt latency in firmware?",
    a: "1. Keep ISRs extremely short (set a flag and defer processing to main loop/RTOS task).\n2. Use hardware interrupt controllers with automated hardware stacking (e.g. ARM NVIC tail-chaining).\n3. Optimize ISR compiler flags.\n4. Avoid long critical sections that disable global interrupts (`cli()` / `__disable_irq()`).\n5. Use DMA for large data transfers.",
  },
  {
    id: "emb-q166-what-is-a-timer-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is a timer interrupt?",
    a: "An interrupt triggered when a hardware timer's counter register matches a compare value or overflows its maximum limit.\n• Used to create periodic system ticks, software timers, and deterministic timebases.",
  },
  {
    id: "emb-q167-what-is-an-external-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is an external interrupt?",
    a: "An interrupt triggered by a voltage level or edge transition (rising, falling, or both) on an external physical GPIO pin (e.g., button press, external sensor alarm).",
  },
  {
    id: "emb-q168-what-is-a-software-interrupt", topic: "emb-rtos", level: "Medium",
    q: "What is a software interrupt?",
    a: "An interrupt triggered intentionally by program code instruction (e.g., `SWI`, `SVC`, `TRAP`) rather than by external hardware.\n• Used to implement RTOS system service calls (Syscalls) and context switching.",
  },
  {
    id: "emb-q169-what-is-interrupt-priority", topic: "emb-rtos", level: "Easy",
    q: "What is interrupt priority?",
    a: "A numeric value assigned to each interrupt source that determines which interrupt gets serviced first when multiple interrupt requests occur simultaneously.\n• Higher priority interrupts can preempt lower priority ones if nesting is enabled.",
  },
  {
    id: "emb-q170-what-are-nested-interrupts", topic: "emb-rtos", level: "Medium",
    q: "What are nested interrupts?",
    a: "A mechanism where a higher-priority interrupt can preempt (interrupt) an already running lower-priority ISR.\n• Managed in ARM Cortex-M by the hardware Nested Vectored Interrupt Controller (NVIC).",
  },
  {
    id: "emb-q171-what-is-a-timer-in-a-microcontrolle", topic: "emb-rtos", level: "Easy",
    q: "What is a timer in a microcontroller?",
    a: "A hardware counter that counts internal clock pulses or external events to measure elapsed time, generate software delays, trigger periodic ISRs, or output PWM waveforms.",
  },
  {
    id: "emb-q172-what-is-a-hardware-counter", topic: "emb-rtos", level: "Easy",
    q: "What is a hardware counter?",
    a: "A specialized register that increments or decrements upon receiving external electrical pulses on a dedicated GPIO pin, used for counting revolutions, encoder pulses, or measuring input frequencies.",
  },
  {
    id: "emb-q173-what-is-the-difference-between-a-ti", topic: "emb-rtos", level: "Easy",
    q: "What is the difference between a timer and a counter?",
    a: "• Timer: Clocked by the MCU's internal fixed system clock to measure time intervals.\n• Counter: Clocked by external signal transitions on an input pin to count external hardware events.",
  },
  {
    id: "emb-q174-what-is-pwm-pulse-width-modulation", topic: "emb-rtos", level: "Easy",
    q: "What is PWM (Pulse Width Modulation)?",
    a: "A technique for generating a square wave whose duty cycle (ratio of on-time to period) is varied while keeping frequency constant.\n• Allows digital pins to simulate analog voltages to control motor speed, LED brightness, and heater power.",
  },
  {
    id: "emb-q175-what-does-pwm-stand-for", topic: "emb-rtos", level: "Easy",
    q: "What does PWM stand for?",
    a: "PWM stands for Pulse Width Modulation.",
  },
  {
    id: "emb-q176-what-is-duty-cycle", topic: "emb-rtos", level: "Easy",
    q: "What is duty cycle?",
    a: "The percentage of time a digital periodic signal remains in the active HIGH state over one complete period: $\\text{Duty Cycle} = (T_{on} / T_{period}) \\times 100\\%$.",
  },
  {
    id: "emb-q177-what-is-pwm-frequency", topic: "emb-rtos", level: "Easy",
    q: "What is PWM frequency?",
    a: "The number of complete PWM cycles completed per second (Hz), equal to $1 / T_{period}$.\n• High frequencies (e.g., 20 kHz) eliminate audible motor coil whine and visual LED flicker.",
  },
  {
    id: "emb-q178-how-do-you-generate-pwm-in-a-microc", topic: "emb-rtos", level: "Medium",
    q: "How do you generate PWM in a microcontroller?",
    a: "1. Configure a hardware timer in PWM mode (e.g., Fast PWM or Center-Aligned PWM).\n2. Set the timer Auto-Reload Register (ARR) to establish the desired PWM period/frequency.\n3. Set the Capture/Compare Register (CCR) to define the pulse on-time (duty cycle).\n4. Enable the timer channel output to drive the designated GPIO pin.",
  },
  {
    id: "emb-q179-what-is-timer-overflow", topic: "emb-rtos", level: "Easy",
    q: "What is timer overflow?",
    a: "Occurs when a timer counter increments past its maximum capacity (e.g., 255 for 8-bit, 65535 for 16-bit) and rolls over back to 0, setting an overflow flag (`TOV`/`UIF`) and triggering an ISR if enabled.",
  },
  {
    id: "emb-q180-what-is-compare-match", topic: "emb-rtos", level: "Easy",
    q: "What is compare match?",
    a: "A hardware event that occurs when a timer counter value matches the value stored in a compare register (`CCR`), triggering an interrupt or toggling an output pin (used in PWM generation).",
  },
  {
    id: "emb-q181-what-is-a-prescaler", topic: "emb-rtos", level: "Easy",
    q: "What is a prescaler?",
    a: "A hardware clock divider circuit that divides the incoming system clock by an integer factor ($N = 1, 2, 4, 8, \\dots, 256, 1024$) before feeding the timer counter, extending the maximum measurable time range.",
  },
  {
    id: "emb-q182-what-is-the-auto-reload-value", topic: "emb-rtos", level: "Easy",
    q: "What is the auto-reload value?",
    a: "The maximum count value programmed into a timer's reload register (`ARR` / `TH0`). When the counter reaches this value, it automatically resets to 0 and reloads, establishing precise periodic timing.",
  },
  {
    id: "emb-q183-what-is-a-watchdog-timer-wdt", topic: "emb-rtos", level: "Easy",
    q: "What is a watchdog timer (WDT)?",
    a: "An independent hardware timer that resets the microcontroller if the firmware fails to periodically reset ('kick' or 'feed') it within a specified timeout window.\n• Recovers the system from infinite loops, deadlocks, and firmware crashes.",
  },
  {
    id: "emb-q184-what-is-the-purpose-of-a-watchdog-t", topic: "emb-rtos", level: "Easy",
    q: "What is the purpose of a watchdog timer?",
    a: "To ensure autonomous fault recovery and high system reliability in safety-critical and unattended embedded devices by resetting an unresponsive or hanging microcontroller.",
  },
  {
    id: "emb-q185-how-do-you-reset-kick-a-watchdog", topic: "emb-rtos", level: "Easy",
    q: "How do you reset (kick) a watchdog timer in firmware?",
    a: "By periodically writing a specific key value or calling a watchdog refresh function (e.g., `wdt_reset();` in AVR or writing `0xAAAA` to `IWDG_KR` in STM32) from the main execution loop.",
  },
  {
    id: "emb-q186-what-happens-if-the-watchdog-timer", topic: "emb-rtos", level: "Easy",
    q: "What happens if the watchdog timer is not reset?",
    a: "When the WDT counter decrements to zero (times out), it triggers an immediate hardware system reset, re-initializing the microcontroller from the reset vector.",
  },
  {
    id: "emb-q187-what-is-an-edge-triggered-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is an edge-triggered interrupt?",
    a: "An interrupt that is activated by a signal transition on a pin: Rising Edge (LOW to HIGH), Falling Edge (HIGH to LOW), or Both Edges.\n• Fires exactly once per transition, ideal for pulse detection.",
  },
  {
    id: "emb-q188-what-is-a-level-triggered-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is a level-triggered interrupt?",
    a: "An interrupt that remains active as long as the input pin is held at a specific voltage level (LOW or HIGH).\n• Continuously triggers the ISR until the external hardware de-asserts the signal.",
  },
  {
    id: "emb-q189-what-is-the-nvic-nested-vectored-i", topic: "emb-rtos", level: "Medium",
    q: "What is the NVIC (Nested Vectored Interrupt Controller)?",
    a: "A high-performance hardware interrupt controller integrated directly into the ARM Cortex-M CPU core.\n• Features configurable priority levels, dynamic preemption nesting, automatic hardware register stacking/unstacking, and ultra-low latency tail-chaining.",
  },
  {
    id: "emb-q190-what-does-nvic-stand-for", topic: "emb-rtos", level: "Easy",
    q: "What does NVIC stand for?",
    a: "NVIC stands for Nested Vectored Interrupt Controller.",
  },
  {
    id: "emb-q191-what-is-interrupt-enable", topic: "emb-rtos", level: "Easy",
    q: "What is interrupt enable?",
    a: "The control bit or register setting that permits a specific interrupt source (or global interrupts overall) to generate CPU interrupt requests.\n• Configured via peripheral registers (e.g. `TIMSK`) and global enable instructions (`sei()` / `__enable_irq()`).",
  },
  {
    id: "emb-q192-what-is-an-interrupt-flag", topic: "emb-rtos", level: "Easy",
    q: "What is an interrupt flag?",
    a: "A hardware status register bit that is set to `1` by hardware when a trigger event occurs (e.g. Timer Overflow, UART RX Ready).\n• Must typically be cleared by firmware in the ISR to prevent repeated re-triggering.",
  },
  {
    id: "emb-q193-what-is-a-vector-address", topic: "emb-rtos", level: "Easy",
    q: "What is a vector address?",
    a: "The physical memory location in the Interrupt Vector Table where the address of the corresponding Interrupt Service Routine (ISR) is stored.",
  },
  {
    id: "emb-q194-what-is-polling-in-embedded-systems", topic: "emb-rtos", level: "Easy",
    q: "What is polling in embedded systems?",
    a: "A software technique where the CPU continuously checks a status flag or peripheral register in a tight loop (`while(!(UART->SR & RXNE));`) to detect when an event occurs.\n• Simple to implement, but wastes CPU cycles and consumes high power compared to interrupt-driven designs.",
  },
  {
    id: "emb-q195-what-is-the-difference-between-poll", topic: "emb-rtos", level: "Easy",
    q: "What is the difference between polling and interrupts?",
    a: "• Polling: CPU repeatedly checks peripheral status flags in a loop. Wastes CPU cycles, high power consumption, non-deterministic latency.\n• Interrupts: Peripheral notifies CPU asynchronously only when an event occurs. CPU sleeps or executes other tasks, providing fast response, high efficiency, and low power.",
  },
  {
    id: "emb-q196-what-is-a-periodic-interrupt", topic: "emb-rtos", level: "Easy",
    q: "What is a periodic interrupt?",
    a: "An interrupt generated at recurring, fixed time intervals by a hardware timer (e.g. 1 kHz system tick), used for RTOS scheduling and sensor sampling.",
  },
  {
    id: "emb-q197-what-is-a-one-shot-timer", topic: "emb-rtos", level: "Easy",
    q: "What is a one-shot timer?",
    a: "A timer configured to count down once and trigger an event/interrupt, then automatically stop until re-triggered by firmware (used for pulse generation, debounce timeouts).",
  },
  {
    id: "emb-q198-what-is-auto-reload-in-a-timer", topic: "emb-rtos", level: "Easy",
    q: "What is auto-reload in a timer?",
    a: "A feature where a timer automatically resets its counter to a preset value upon reaching overflow or compare match, running continuously without requiring firmware intervention.",
  },
  {
    id: "emb-q199-what-is-capture-mode-in-a-timer", topic: "emb-rtos", level: "Medium",
    q: "What is capture mode in a timer?",
    a: "A hardware timer feature that latches the current counter value into a capture register (`ICR`) when an external signal edge occurs on a GPIO pin, enabling high-precision pulse width and frequency measurement without CPU latency.",
  },
  {
    id: "emb-q200-what-is-timer-resolution", topic: "emb-rtos", level: "Easy",
    q: "What is timer resolution?",
    a: "The smallest measurable time step of a timer, equal to one timer clock tick period: $T_{res} = 1 / (F_{clk} / \\text{Prescaler})$.",
  },
  {
    id: "emb-q201-what-is-stack-memory", topic: "emb-debug", level: "Easy",
    q: "What is stack memory?",
    a: "Stack memory is a contiguous region of RAM used for Last-In-First-Out (LIFO) storage of local variables, function arguments, and return addresses during program execution.\n• Automatically managed by the CPU hardware via the Stack Pointer (SP).\n• Fast and deterministic, but strictly bounded in size in embedded MCUs.",
  },
  {
    id: "emb-q202-what-is-heap-memory", topic: "emb-debug", level: "Easy",
    q: "What is heap memory?",
    a: "Heap memory is a dynamic memory pool in RAM managed at runtime using allocator functions (`malloc()`, `calloc()`, `realloc()`, `free()`).\n• Memory remains allocated until explicitly freed by firmware.\n• Prone to memory fragmentation and allocation non-determinism in embedded systems.",
  },
  {
    id: "emb-q203-what-is-the-difference-between-stac", topic: "emb-debug", level: "Easy",
    q: "What is the difference between stack and heap memory?",
    a: "• Stack: Managed automatically by CPU (LIFO), fast allocation, fixed maximum size, holds local variables and call frames; risk is stack overflow.\n• Heap: Managed manually by programmer via `malloc`/`free`, variable size, non-deterministic allocation time; risks include memory leaks and fragmentation.",
  },
  {
    id: "emb-q204-what-is-static-memory-allocation", topic: "emb-debug", level: "Easy",
    q: "What is static memory allocation?",
    a: "Allocating fixed memory addresses to global and static variables at compile/link time.\n• Stored in `.data` (initialized) and `.bss` (uninitialized) sections.\n• Guaranteed availability throughout program lifetime; no runtime allocation overhead or fragmentation.",
  },
  {
    id: "emb-q205-what-is-dynamic-memory-allocation", topic: "emb-debug", level: "Easy",
    q: "What is dynamic memory allocation?",
    a: "Allocating variable-sized blocks of RAM at runtime from the heap using `malloc()`.\n• Provides flexibility for variable-sized data buffers, but introduces non-deterministic execution times and heap fragmentation risks in real-time firmware.",
  },
  {
    id: "emb-q206-why-is-dynamic-memory-allocation-m", topic: "emb-debug", level: "Medium",
    q: "Why is dynamic memory allocation (malloc) avoided in embedded systems?",
    a: "1. Non-Deterministic Execution: `malloc()` search time varies depending on heap state, violating real-time deadline guarantees.\n2. Heap Fragmentation: Repeated alloc/free cycles create small unusable memory gaps, causing `malloc()` to fail even when total free RAM is sufficient.\n3. Memory Leaks: Forgetting to `free()` exhausts RAM over long operating durations, causing unrecoverable system crashes.\n4. Overhead: Bookkeeping metadata consumes scarce RAM.",
  },
  {
    id: "emb-q207-what-is-a-memory-leak", topic: "emb-debug", level: "Easy",
    q: "What is a memory leak?",
    a: "Occurs when dynamically allocated memory (`malloc()`) is no longer needed but is not released back to the heap via `free()`, and the pointer to it is lost.\n• Gradually consumes all available heap memory until future allocations fail.",
  },
  {
    id: "emb-q208-how-do-you-prevent-memory-leaks-in", topic: "emb-debug", level: "Medium",
    q: "How do you prevent memory leaks in embedded firmware?",
    a: "1. Avoid dynamic memory allocation entirely; prefer static buffers and memory pools.\n2. Ensure every `malloc()` has an unambiguous, corresponding `free()`.\n3. Set pointers to `NULL` immediately after freeing.\n4. Use static analysis tools (e.g. PC-lint, Coverity) and memory sanitizers during testing.",
  },
  {
    id: "emb-q209-what-is-memory-fragmentation", topic: "emb-debug", level: "Medium",
    q: "What is memory fragmentation?",
    a: "Fragmentation occurs when free memory becomes broken into small, non-contiguous blocks separated by allocated blocks.\n• External Fragmentation: Total free memory is large enough for an allocation, but no single contiguous block is large enough.\n• Internal Fragmentation: Memory allocated inside a block is larger than requested, wasting space.",
  },
  {
    id: "emb-q210-what-is-a-stack-overflow", topic: "emb-debug", level: "Easy",
    q: "What is a stack overflow?",
    a: "Occurs when stack memory usage grows beyond its allocated memory boundary in RAM, overwriting adjacent memory (such as global variables in `.bss` or the heap).\n• Caused by deep function call chains, recursion, large local arrays, or nested ISRs.\n• Triggers system crashes, corrupted data, or CPU HardFault exceptions.",
  },
  {
    id: "emb-q211-how-do-you-detect-and-prevent-stack", topic: "emb-debug", level: "Medium",
    q: "How do you detect and prevent stack overflow in embedded systems?",
    a: "• Stack Painting (Canary Pattern): Fill the stack RAM area with a known byte pattern (e.g., `0xAA`) at boot. Periodically check how much of the pattern remains unwritten from the bottom.\n• MPU Stack Guard: Configure the Memory Protection Unit (MPU) to generate a fault exception when the stack pointer crosses into a protected guard region.\n• Compiler Stack Analysis: Use compiler flags (`-fstack-usage`) to statically verify maximum call stack depth.",
  },
  {
    id: "emb-q212-what-is-the-data-segment-data", topic: "emb-debug", level: "Easy",
    q: "What is the data segment (.data)?",
    a: "A memory section in RAM that holds initialized global and static variables with non-zero initial values (`int status = 1;`).\n• Initial values are stored in Flash ROM and copied into RAM by the startup code during boot.",
  },
  {
    id: "emb-q213-what-is-the-code-segment-text", topic: "emb-debug", level: "Easy",
    q: "What is the code segment (.text)?",
    a: "A read-only memory region in Flash ROM that contains compiled executable machine instructions, functions, and the Interrupt Vector Table.",
  },
  {
    id: "emb-q214-what-is-the-bss-section-bss", topic: "emb-debug", level: "Easy",
    q: "What is the BSS section (.bss)?",
    a: "A memory region in RAM that holds uninitialized (or zero-initialized) global and static variables (`static int count;`).\n• Does not take space in Flash ROM; the startup code zeroes out this entire RAM region during boot.",
  },
  {
    id: "emb-q215-what-is-initialized-data", topic: "emb-debug", level: "Easy",
    q: "What is initialized data?",
    a: "Global and static variables explicitly given non-zero initial values at declaration (`uint8_t baud_div = 16;`). Stored in Flash ROM and copied to `.data` RAM at boot.",
  },
  {
    id: "emb-q216-what-is-a-linker-script", topic: "emb-debug", level: "Medium",
    q: "What is a linker script?",
    a: "A configuration file (e.g., `.ld` in GCC) that directs the linker on how to map compiled sections (`.text`, `.rodata`, `.data`, `.bss`) into the physical memory regions (Flash and SRAM) of the target MCU.\n• Defines starting addresses, memory lengths, and stack/heap boundaries.",
  },
  {
    id: "emb-q217-what-is-a-map-file", topic: "emb-debug", level: "Medium",
    q: "What is a map file?",
    a: "A text file generated by the linker during build that details the exact memory layout of the final binary: addresses and byte sizes of all functions, global variables, and memory sections in Flash and RAM.\n• Invaluable for diagnosing memory usage, bloat, and section overflows.",
  },
  {
    id: "emb-q218-what-is-memory-alignment", topic: "emb-debug", level: "Medium",
    q: "What is memory alignment?",
    a: "The requirement that $N$-byte data types must be stored at memory addresses that are integer multiples of $N$ (e.g., 4-byte integers at addresses divisible by 4).\n• Ensures single-cycle CPU memory bus access; unaligned access on architectures like ARM Cortex-M0 causes a UsageFault exception.",
  },
  {
    id: "emb-q219-what-is-structure-padding", topic: "emb-debug", level: "Medium",
    q: "What is structure padding?",
    a: "Extra unused bytes inserted automatically by the compiler between struct members to satisfy hardware memory alignment requirements.\n• Can be controlled or eliminated using `#pragma pack(1)` or `__attribute__((packed))` for network/protocol packets.",
  },
  {
    id: "emb-q220-what-is-endianness-in-memory", topic: "emb-debug", level: "Easy",
    q: "What is endianness in memory?",
    a: "The convention for ordering the constituent bytes of a multi-byte word in physical memory addresses: Little-Endian (LSB at lowest address) vs. Big-Endian (MSB at lowest address).",
  },
  {
    id: "emb-q221-what-is-big-endian-storage", topic: "emb-debug", level: "Easy",
    q: "What is big-endian storage?",
    a: "Memory storage format where the most significant byte (MSB) is placed at the lowest memory address (e.g., `0x1234` stored as `[0x12, 0x34]`).",
  },
  {
    id: "emb-q222-what-is-little-endian-storage", topic: "emb-debug", level: "Easy",
    q: "What is little-endian storage?",
    a: "Memory storage format where the least significant byte (LSB) is placed at the lowest memory address (e.g., `0x1234` stored as `[0x34, 0x12]`). Standard in ARM Cortex-M.",
  },
  {
    id: "emb-q223-what-is-union-memory-usage", topic: "emb-debug", level: "Easy",
    q: "What is union memory usage?",
    a: "In a union, all member variables overlap and share the same starting address; the total memory consumed equals the size of the largest individual member.",
  },
  {
    id: "emb-q224-what-is-a-bit-field-in-a-struct", topic: "emb-debug", level: "Medium",
    q: "What is a bit-field in a struct?",
    a: "A struct member declared with an explicit bit width (`struct { uint8_t flag:1; uint8_t mode:3; };`), packing variables into specific bit positions to map directly to hardware registers or save memory.",
  },
  {
    id: "emb-q225-what-is-the-size-of-a-pointer-in-em", topic: "emb-debug", level: "Easy",
    q: "What is the size of a pointer in embedded systems?",
    a: "Matches the native address bus width of the target CPU architecture: 2 bytes (16 bits) on 8/16-bit MCUs (AVR, 8051), and 4 bytes (32 bits) on 32-bit MCUs (ARM Cortex-M).",
  },
  {
    id: "emb-q226-what-is-a-null-pointer-dereference", topic: "emb-debug", level: "Easy",
    q: "What is a null pointer dereference?",
    a: "Attempting to read or write memory through a pointer with value `NULL` (address `0x00000000`), causing immediate CPU memory faults or unexpected system crashes.",
  },
  {
    id: "emb-q227-what-is-a-dangling-pointer", topic: "emb-debug", level: "Medium",
    q: "What is a dangling pointer?",
    a: "A pointer that continues referencing a memory address after the memory has been deallocated (via `free()`) or after a local stack variable has gone out of scope.\n• Dereferencing it causes silent data corruption.",
  },
  {
    id: "emb-q228-what-is-a-wild-pointer", topic: "emb-debug", level: "Easy",
    q: "What is a wild pointer?",
    a: "An uninitialized pointer variable that contains whatever garbage address happened to be in memory when declared.\n• Prevent by always initializing pointers to `NULL` or a valid address at declaration.",
  },
  {
    id: "emb-q229-what-is-memory-mapped-i-o-mmio", topic: "emb-debug", level: "Medium",
    q: "What is memory-mapped I/O (MMIO)?",
    a: "A hardware architecture where peripheral registers (control, status, data) share the same address space as RAM and Flash.\n• The CPU accesses hardware peripherals using standard load/store memory instructions (`*(volatile uint32_t *)0x40020000`).",
  },
  {
    id: "emb-q230-what-is-the-advantage-of-memory-map", topic: "emb-debug", level: "Easy",
    q: "What is the advantage of memory-mapped I/O?",
    a: "1. Unified Instruction Set: No special CPU I/O instructions needed (unlike x86 `IN`/`OUT`).\n2. Direct C Pointer Manipulation: Peripheral registers can be mapped directly to C struct pointers.\n3. Simplifies DMA and peripheral addressing.",
  },
  {
    id: "emb-q231-what-is-debugging-in-embedded-syste", topic: "emb-debug", level: "Easy",
    q: "What is debugging in embedded systems?",
    a: "The systematic process of identifying, isolating, and fixing functional defects, timing violations, and crashes in embedded firmware and hardware interfaces.",
  },
  {
    id: "emb-q232-what-is-a-breakpoint", topic: "emb-debug", level: "Easy",
    q: "What is a breakpoint?",
    a: "A debugging mechanism that halts CPU execution at a specified program address or source code line, allowing inspection of CPU registers, RAM variables, and call stacks.\n• Hardware breakpoints use on-chip comparator registers; software breakpoints insert trap instructions.",
  },
  {
    id: "emb-q233-what-is-jtag", topic: "emb-debug", level: "Medium",
    q: "What is JTAG?",
    a: "JTAG (Joint Test Action Group / IEEE 1149.1) is an industry-standard interface for on-chip hardware debugging, boundary scan testing, and non-volatile Flash programming.\n• Uses 4-5 dedicated pins: `TDI` (Test Data In), `TDO` (Test Data Out), `TCK` (Test Clock), `TMS` (Test Mode Select), and optional `TRST`.",
  },
  {
    id: "emb-q234-what-is-swd-serial-wire-debug", topic: "emb-debug", level: "Medium",
    q: "What is SWD (Serial Wire Debug)?",
    a: "An alternative 2-pin debug protocol developed by ARM for Cortex-M microcontrollers.\n• Pins: `SWDIO` (bidirectional data) and `SWCLK` (clock).\n• Delivers full JTAG-equivalent debugging and Flash programming while saving precious package pins on small MCUs.",
  },
  {
    id: "emb-q235-what-is-a-logic-analyzer", topic: "emb-debug", level: "Easy",
    q: "What is a logic analyzer?",
    a: "A test instrument that captures, decodes, and displays digital signals across multiple channels simultaneously over time.\n• Essential for debugging protocol timing violations and data packet decode on UART, SPI, I2C, and CAN buses.",
  },
  {
    id: "emb-q236-what-is-an-oscilloscope", topic: "emb-debug", level: "Easy",
    q: "What is an oscilloscope?",
    a: "A hardware test instrument that displays real-time 2D voltage-versus-time analog waveforms.\n• Used to measure signal rise/fall times, clock jitter, voltage ripple, ringing, and EMI noise on PCB traces.",
  },
  {
    id: "emb-q237-what-is-printf-debugging-in-embedde", topic: "emb-debug", level: "Easy",
    q: "What is printf debugging in embedded?",
    a: "A lightweight debugging method where firmware outputs text diagnostic messages over UART to a serial terminal.\n• Simple to use, but adds CPU execution overhead and timing delays (Heisenbug risk in real-time code).",
  },
  {
    id: "emb-q238-what-is-an-embedded-simulator", topic: "emb-debug", level: "Easy",
    q: "What is an embedded simulator?",
    a: "A software tool running on a host PC that models the CPU instruction set, registers, and memory in software without physical hardware.\n• Useful for early algorithm verification and automated unit testing in CI pipelines.",
  },
  {
    id: "emb-q239-what-is-an-emulator-in-circuit-em", topic: "emb-debug", level: "Medium",
    q: "What is an emulator / in-circuit emulator (ICE)?",
    a: "A hardware debugging tool that interfaces directly with target silicon hardware (via JTAG/SWD) or replaces the MCU to provide cycle-accurate debugging, hardware trace, and real-time execution monitoring.",
  },
  {
    id: "emb-q240-what-is-unit-testing-in-embedded-fi", topic: "emb-debug", level: "Easy",
    q: "What is unit testing in embedded firmware?",
    a: "Testing individual software functions or modules in isolation from the rest of the system using automated test frameworks (e.g., Unity, Ceedling, GoogleTest) with mocked hardware interfaces.",
  },
  {
    id: "emb-q241-what-is-integration-testing", topic: "emb-debug", level: "Easy",
    q: "What is integration testing?",
    a: "Testing the interactions and interfaces between multiple integrated firmware modules, device drivers, and hardware peripherals (e.g. testing sensor driver + I2C stack + data logger together).",
  },
  {
    id: "emb-q242-what-is-system-testing", topic: "emb-debug", level: "Easy",
    q: "What is system testing?",
    a: "Validating the complete, integrated embedded product (hardware + firmware + enclosures + power supply) against all original functional, performance, and environmental requirements.",
  },
  {
    id: "emb-q243-what-is-black-box-testing", topic: "emb-debug", level: "Easy",
    q: "What is black-box testing?",
    a: "Testing firmware functionality purely against requirements and external I/O specifications without inspecting or knowing the internal source code structure.",
  },
  {
    id: "emb-q244-what-is-white-box-testing", topic: "emb-debug", level: "Easy",
    q: "What is white-box testing?",
    a: "Testing firmware where test cases are designed using explicit knowledge of the internal source code, exercising specific code paths, branch decisions, and statement coverage.",
  },
  {
    id: "emb-q245-what-is-a-test-case", topic: "emb-debug", level: "Easy",
    q: "What is a test case?",
    a: "A documented set of test preconditions, input stimuli, execution steps, and expected pass/fail output results designed to verify a specific software requirement.",
  },
  {
    id: "emb-q246-what-is-an-assertion-in-testing", topic: "emb-debug", level: "Easy",
    q: "What is an assertion in testing?",
    a: "A programmatic Boolean statement placed in test code or firmware that validates whether an invariant condition holds true; if false, it halts execution and reports a failure.",
  },
  {
    id: "emb-q247-what-is-code-coverage-in-testing", topic: "emb-debug", level: "Medium",
    q: "What is code coverage in testing?",
    a: "A quantitative metric measuring the percentage of source code executed during automated tests.\n• Metrics include: Statement Coverage, Branch/Decision Coverage, and Modified Condition/Decision Coverage (MC/DC) required for DO-178C avionics and ISO 26262 automotive safety.",
  },
  {
    id: "emb-q248-what-is-firmware-code-review", topic: "emb-debug", level: "Easy",
    q: "What is firmware code review?",
    a: "A formal peer-review process where engineers systematically inspect source code for logic bugs, race conditions, memory leaks, MISRA-C violations, and maintainability prior to merging.",
  },
  {
    id: "emb-q249-what-is-static-code-analysis", topic: "emb-debug", level: "Easy",
    q: "What is static code analysis?",
    a: "Analyzing source code without executing it, using automated linters and analyzers (PC-lint, Clang-Tidy, Coverity) to identify syntax flaws, potential null dereferences, buffer overflows, and rule violations.",
  },
  {
    id: "emb-q250-what-is-dynamic-code-analysis", topic: "emb-debug", level: "Easy",
    q: "What is dynamic code analysis?",
    a: "Evaluating software during runtime execution to detect memory leaks, race conditions, stack overruns, and profiling CPU cycle bottlenecks.",
  },
  {
    id: "emb-q251-what-is-a-segmentation-fault-segfa", topic: "emb-debug", level: "Medium",
    q: "What is a segmentation fault (segfault) / HardFault?",
    a: "A hardware exception triggered when the CPU attempts to access an illegal, unmapped, or protected memory address, or performs an unaligned memory access.",
  },
  {
    id: "emb-q252-what-causes-a-segmentation-fault", topic: "emb-debug", level: "Medium",
    q: "What causes a segmentation fault / HardFault in embedded C?",
    a: "1. Dereferencing NULL, wild, or dangling pointers.\n2. Array index out-of-bounds writing into protected memory.\n3. Stack overflow overwriting memory boundaries.\n4. Unaligned memory access on architectures without unaligned support.\n5. Accessing a peripheral whose clock is disabled.",
  },
  {
    id: "emb-q253-how-do-you-debug-an-embedded-system", topic: "emb-debug", level: "Hard",
    q: "How do you debug an embedded system crash?",
    a: "1. Inspect Fault Status Registers (e.g., ARM `CFSR`, `HFSR`, `BFAR`).\n2. Extract the saved stacked PC and LR from the stack frame in the `HardFault_Handler`.\n3. Use GDB/debugger with ELF symbol tables to map the faulting PC to the exact source code line.\n4. Examine local variables and call stack history.",
  },
  {
    id: "emb-q254-what-is-gdb-gnu-debugger", topic: "emb-debug", level: "Easy",
    q: "What is GDB (GNU Debugger)?",
    a: "A powerful open-source command-line debugger that connects to embedded targets via OpenOCD / GDB Server (over JTAG/SWD) to set breakpoints, step instructions, and inspect registers and memory.",
  },
  {
    id: "emb-q255-what-is-a-core-dump", topic: "emb-debug", level: "Medium",
    q: "What is a core dump?",
    a: "A snapshot recording the exact CPU register states, stack memory, and RAM contents at the moment of a software crash, saved for post-mortem offline analysis.",
  },
  {
    id: "emb-q256-what-is-logging-in-firmware", topic: "emb-debug", level: "Easy",
    q: "What is logging in firmware?",
    a: "Recording timestamped diagnostic messages, system states, and error codes to a serial console, internal Flash log, or SD card for monitoring and post-event troubleshooting.",
  },
  {
    id: "emb-q257-what-is-the-assert-macro", topic: "emb-debug", level: "Easy",
    q: "What is the assert() macro?",
    a: "A diagnostic macro defined in `<assert.h>` that evaluates a condition; if false, it prints diagnostic file/line info and halts execution (`while(1)`). Stripped out when `NDEBUG` is defined.",
  },
  {
    id: "emb-q258-what-is-error-handling-in-firmware", topic: "emb-debug", level: "Easy",
    q: "What is error handling in firmware?",
    a: "The systematic strategy of anticipating, detecting, and gracefully recovering from hardware faults, sensor timeouts, and invalid inputs using status return codes, retry mechanisms, and safe fallback states.",
  },
  {
    id: "emb-q259-what-is-fault-tolerance-in-embedded", topic: "emb-debug", level: "Medium",
    q: "What is fault tolerance in embedded systems?",
    a: "The architectural ability of an embedded system to maintain safe, correct operation even in the presence of internal hardware faults or software glitches.\n• Employs redundancy, Watchdog timers, brown-out detectors, ECC memory, and fail-safe default states (ISO 26262 / IEC 61508).",
  },
  {
    id: "emb-q260-what-is-the-difference-between-simu", topic: "emb-debug", level: "Easy",
    q: "What is the difference between simulation and emulation?",
    a: "• Simulation: Entirely software-based model running on a host PC to mimic MCU instruction execution.\n• Emulation: Uses real or hardware-accurate target silicon/FPGA to run code with exact physical timing and electrical peripheral behavior.",
  },
  {
    id: "emb-q261-what-is-power-consumption-in-embedd", topic: "emb-debug", level: "Medium",
    q: "What is power consumption in embedded systems?",
    a: "The total electrical power dissipated by the microcontroller and its peripherals during operation, consisting of:\n1. Dynamic Power ($P_{dyn} = C \\cdot V^2 \\cdot f$): Consumed during transistor switching.\n2. Static Leakage Power ($P_{stat} = I_{leak} \\cdot V$): Current leaking through reverse-biased junctions and subthreshold channels while idle.",
  },
  {
    id: "emb-q262-what-is-sleep-mode-in-a-microcontro", topic: "emb-debug", level: "Easy",
    q: "What is sleep mode in a microcontroller?",
    a: "A low-power state where the CPU core clock is halted while selected peripherals (timers, external interrupts) remain active to wake the CPU upon event arrival.",
  },
  {
    id: "emb-q263-what-is-idle-mode", topic: "emb-debug", level: "Easy",
    q: "What is idle mode?",
    a: "A low-power state where the CPU stops fetching instructions, but system oscillators and on-chip peripherals continue running at full speed, allowing ultra-fast sub-microsecond wakeup.",
  },
  {
    id: "emb-q264-what-is-low-power-mode", topic: "emb-debug", level: "Easy",
    q: "What is low-power mode?",
    a: "A general term for MCU energy-saving states (Sleep, Deep Sleep, Stop, Standby, Hibernate) that progressively disable CPU clocks, PLLs, Flash power, and internal regulators to minimize current draw down to microamps (µA) or nanoamps (nA).",
  },
  {
    id: "emb-q265-how-do-you-reduce-power-consumption", topic: "emb-debug", level: "Medium",
    q: "How do you reduce power consumption in embedded firmware?",
    a: "1. Maximize Sleep Time: Use interrupt-driven event architectures and keep CPU in Deep Sleep as long as possible.\n2. Clock Management: Lower CPU clock frequency when workload is low; use Dynamic Voltage and Frequency Scaling (DVFS).\n3. Clock Gating: Disable peripheral clocks when not actively in use.\n4. GPIO Configuration: Configure unused pins as analog inputs or pull-downs to eliminate floating CMOS input leakage.\n5. Batch I/O operations and use DMA.",
  },
  {
    id: "emb-q266-what-is-clock-gating", topic: "emb-debug", level: "Easy",
    q: "What is clock gating?",
    a: "A hardware/firmware power-saving technique that turns off the clock signal distribution to inactive peripherals or logic gates, eliminating dynamic switching power dissipation in idle blocks.",
  },
  {
    id: "emb-q267-what-is-dvfs-dynamic-voltage-and-f", topic: "emb-debug", level: "Medium",
    q: "What is DVFS (Dynamic Voltage and Frequency Scaling)?",
    a: "A power management technique that dynamically adjusts the MCU's operating clock frequency and core supply voltage at runtime based on real-time computational workload demands.",
  },
  {
    id: "emb-q268-what-does-dvfs-stand-for", topic: "emb-debug", level: "Easy",
    q: "What does DVFS stand for?",
    a: "DVFS stands for Dynamic Voltage and Frequency Scaling.",
  },
  {
    id: "emb-q269-what-is-a-battery-powered-embedded", topic: "emb-debug", level: "Easy",
    q: "What is a battery-powered embedded system?",
    a: "An embedded device designed to operate autonomously from limited energy storage (e.g. coin cell, Li-Ion battery), requiring ultra-low-power firmware design to achieve multi-year operating lifetime.",
  },
  {
    id: "emb-q270-what-is-a-power-reset", topic: "emb-debug", level: "Easy",
    q: "What is a power reset?",
    a: "A hardware reset triggered when power is first applied or when supply rail voltage drops below the minimum operating threshold, resetting the CPU and peripherals to safe default states.",
  },
  {
    id: "emb-q271-what-is-a-brown-out-reset-bor", topic: "emb-debug", level: "Medium",
    q: "What is a Brown-Out Reset (BOR)?",
    a: "A supervisory circuit that monitors the MCU supply voltage and asserts an immediate reset if $V_{DD}$ sags below a critical threshold, preventing flash corruption or erratic CPU execution during battery depletion.",
  },
  {
    id: "emb-q272-what-is-a-power-on-reset-por", topic: "emb-debug", level: "Easy",
    q: "What is a Power-On Reset (POR)?",
    a: "An internal circuit that generates a clean reset pulse to hold the CPU in reset while the power supply ramps up, releasing the reset only after voltage has stabilized above the minimum operating voltage.",
  },
  {
    id: "emb-q273-what-is-a-configuration-fuse-in-a-m", topic: "emb-debug", level: "Medium",
    q: "What is a configuration fuse in a microcontroller?",
    a: "Non-volatile configuration bits programmed into dedicated flash/EEPROM cells that set fundamental hardware parameters before runtime: clock source, watchdog enable, brown-out threshold, and boot vector location.",
  },
  {
    id: "emb-q274-what-are-lock-bits-in-a-microcontro", topic: "emb-debug", level: "Easy",
    q: "What are lock bits in a microcontroller?",
    a: "Security configuration bits that disable external reading and writing of on-chip Flash memory via JTAG/ISP, protecting proprietary firmware intellectual property against reverse engineering.",
  },
  {
    id: "emb-q275-what-is-security-in-embedded-firmwa", topic: "emb-debug", level: "Medium",
    q: "What is security in embedded firmware?",
    a: "Techniques designed to protect devices from unauthorized access, tampering, and intellectual property theft:\n• Secure Boot (authenticating firmware with cryptographic signatures).\n• Memory Protection (MPU/TrustZone separating secure and non-secure code).\n• Hardware Crypto Accelerators (AES, ECC, SHA-256).\n• Encrypted firmware updates (OTA).",
  },
  {
    id: "emb-q276-what-is-an-ota-over-the-air-updat", topic: "emb-debug", level: "Medium",
    q: "What is an OTA (Over-The-Air) update?",
    a: "A method of wirelessly downloading and installing new firmware images on deployed embedded devices using Wi-Fi, Bluetooth, or cellular links.\n• Utilizes dual-bank Flash and secure bootloader verification to prevent bricking if an update is interrupted.",
  },
  {
    id: "emb-q277-what-does-ota-stand-for", topic: "emb-debug", level: "Easy",
    q: "What does OTA stand for?",
    a: "OTA stands for Over-The-Air.",
  },
  {
    id: "emb-q278-what-is-flashing-firmware", topic: "emb-debug", level: "Easy",
    q: "What is flashing firmware?",
    a: "The process of erasing and writing a compiled binary executable image into the microcontroller's on-chip non-volatile Flash memory using a hardware programmer (JTAG, SWD, ISP) or bootloader.",
  },
  {
    id: "emb-q279-what-is-isp-in-system-programming", topic: "emb-debug", level: "Easy",
    q: "What is ISP (In-System Programming)?",
    a: "A programming method that allows an MCU's on-chip Flash to be reprogrammed while soldered directly onto the final target PCB, using serial interfaces like SPI or UART without removing the chip.",
  },
  {
    id: "emb-q280-what-does-isp-stand-for", topic: "emb-debug", level: "Easy",
    q: "What does ISP stand for?",
    a: "ISP stands for In-System Programming.",
  },
  {
    id: "emb-q281-what-is-jtag-flashing", topic: "emb-debug", level: "Easy",
    q: "What is JTAG flashing?",
    a: "Programming MCU Flash memory by streaming binary data packets through the standard JTAG boundary-scan interface pins (`TDI`, `TDO`, `TCK`, `TMS`).",
  },
  {
    id: "emb-q282-what-is-an-embedded-development-boa", topic: "emb-debug", level: "Easy",
    q: "What is an embedded development board?",
    a: "A printed circuit board containing a microcontroller, power management, clock crystals, debugging interface (USB-JTAG), and breakout headers for rapid prototyping and hardware validation (e.g. STM32 Nucleo, Arduino Uno).",
  },
  {
    id: "emb-q283-what-is-arduino", topic: "emb-debug", level: "Easy",
    q: "What is Arduino?",
    a: "An open-source embedded electronics prototyping platform combining easy-to-use hardware boards (based on AVR or ARM MCUs) and a C++-based software development environment (Arduino IDE) with standardized abstraction libraries.",
  },
  {
    id: "emb-q284-what-is-raspberry-pi", topic: "emb-debug", level: "Easy",
    q: "What is Raspberry Pi?",
    a: "A credit-card sized single-board computer (SBC) powered by an ARM Cortex-A microprocessor running a full Linux OS (Raspberry Pi OS) with HDMI display, USB, Ethernet, Wi-Fi, and 40-pin GPIO header.",
  },
  {
    id: "emb-q285-what-is-the-difference-between-ardu", topic: "emb-debug", level: "Easy",
    q: "What is the difference between Arduino and Raspberry Pi?",
    a: "• Arduino: Microcontroller board (MCU), real-time bare-metal execution, ultra-low power, directly drives sensors and motors with microsecond timing.\n• Raspberry Pi: Single-board computer (MPU), runs full Linux OS, high compute performance (GHz, GBs RAM), hosts web servers and video processing, but is non-deterministic for real-time control.",
  },
  {
    id: "emb-q286-what-is-an-ide-in-embedded-developm", topic: "emb-debug", level: "Easy",
    q: "What is an IDE in embedded development?",
    a: "Integrated Development Environment: A unified software application providing a source code editor, build automation tools (compiler, assembler, linker), and interactive hardware debugger (Keil MDK, STM32CubeIDE, MPLAB X).",
  },
  {
    id: "emb-q287-what-is-keil-mdk", topic: "emb-debug", level: "Easy",
    q: "What is Keil MDK?",
    a: "A comprehensive software development suite by ARM featuring the µVision IDE, ARM C/C++ compiler, and advanced simulator/debugger for ARM Cortex-M microcontrollers.",
  },
  {
    id: "emb-q288-what-is-mplab-x", topic: "emb-debug", level: "Easy",
    q: "What is MPLAB X?",
    a: "An IDE developed by Microchip for firmware development on PIC, dsPIC, AVR, and SAM microcontrollers, integrating XC compilers and hardware debuggers (PICkit, ICD).",
  },
  {
    id: "emb-q289-what-is-codewarrior", topic: "emb-debug", level: "Easy",
    q: "What is CodeWarrior?",
    a: "An embedded IDE originally by Metrowerks (now NXP) used for building firmware on ColdFire, S12, PowerPC, and Kinetis microcontrollers in automotive and industrial control.",
  },
  {
    id: "emb-q290-what-is-a-makefile-in-embedded-syst", topic: "emb-debug", level: "Medium",
    q: "What is a Makefile in embedded systems?",
    a: "A build configuration script used by the `make` utility that defines build rules, target dependencies, compiler toolchains (e.g. `arm-none-eabi-gcc`), and optimization flags to automate firmware compilation.",
  },
  {
    id: "emb-q291-what-is-a-cross-compiler", topic: "emb-debug", level: "Easy",
    q: "What is a cross-compiler?",
    a: "A compiler that runs on a host development system (e.g. x86_64 Windows/Linux) but produces executable binary machine code for a different target processor architecture (e.g. ARM Cortex-M4).",
  },
  {
    id: "emb-q292-what-is-the-target-architecture", topic: "emb-debug", level: "Easy",
    q: "What is the target architecture?",
    a: "The specific processor instruction set and core hardware (e.g., ARMv7E-M, AVR, RISC-V RV32I) for which firmware is compiled and linked.",
  },
  {
    id: "emb-q293-what-is-compiler-optimization", topic: "emb-debug", level: "Medium",
    q: "What is compiler optimization?",
    a: "Techniques applied by the compiler during code generation to minimize execution cycle time, reduce binary Flash size, or minimize memory access overhead without altering program logic.",
  },
  {
    id: "emb-q294-what-is-the-o0-compiler-optimizati", topic: "emb-debug", level: "Easy",
    q: "What is the -O0 compiler optimization flag?",
    a: "A compiler flag that disables all optimizations, generating code that maps 1-to-1 with source statements. Essential for step-by-step interactive debugging with GDB without variable optimization-out.",
  },
  {
    id: "emb-q295-what-is-an-inline-function-in-c", topic: "emb-debug", level: "Medium",
    q: "What is an inline function in C?",
    a: "A function declared with the `inline` keyword, suggesting to the compiler to replace function calls with the direct function body code, eliminating call/return overhead at the potential cost of larger Flash code size.",
  },
  {
    id: "emb-q296-what-are-best-practices-for-interru", topic: "emb-rtos", level: "Medium",
    q: "What are best practices for Interrupt Service Routines (ISRs)?",
    a: "1. Keep ISRs as short and fast as possible (set volatile flags and defer processing).\n2. Never execute delay loops or blocking I/O calls inside an ISR.\n3. Mark all variables shared between ISR and main loop as `volatile`.\n4. Clear the peripheral interrupt pending flag.\n5. Protect shared multi-byte variables with atomic critical sections.",
  },
  {
    id: "emb-q297-what-is-a-reentrant-function-in-emb", topic: "emb-rtos", level: "Hard",
    q: "What is a reentrant function in embedded C?",
    a: "A function that can be interrupted in the middle of execution and safely called again (re-entered) by another thread or ISR before the previous invocation completes, without corrupting data.\n• Requirements: Uses only stack local variables, does not use global/static variables without mutex locks, and calls only other reentrant functions.",
  },
  {
    id: "emb-q298-what-is-a-thread-safe-function", topic: "emb-rtos", level: "Medium",
    q: "What is a thread-safe function?",
    a: "A function that can be executed concurrently by multiple RTOS threads without producing race conditions or data corruption, typically enforced using mutual exclusion (mutexes, semaphores, or atomic operations).",
  },
  {
    id: "emb-q299-what-is-an-rtos-real-time-operatin", topic: "emb-rtos", level: "Medium",
    q: "What is an RTOS (Real-Time Operating System)?",
    a: "An operating system designed specifically for embedded real-time applications that guarantees deterministic, bounded task scheduling latency.\n• Core features: Preemptive priority-based task scheduler, context switching, inter-task communication (queues, semaphores, mutexes), and software timers (e.g. FreeRTOS).",
  },
  {
    id: "emb-q300-what-is-a-simple-non-preemptive-sch", topic: "emb-rtos", level: "Easy",
    q: "What is a simple non-preemptive scheduler?",
    a: "A lightweight task management architecture (e.g. cooperative round-robin or time-triggered state machine) that executes tasks sequentially to completion without preempting running tasks.\n• Minimal RAM overhead and zero context switching latency, ideal for low-cost 8-bit MCUs.",
  }
];
