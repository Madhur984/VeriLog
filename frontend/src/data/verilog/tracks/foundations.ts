/**
 * Foundations — every problem carried over from the original 30-problem bank
 * (data/verilogProblems.ts), rewritten against the v2 schema.
 *
 * These are the single-gate ladder, the scalar-port muxes, decoders, encoders,
 * comparators and adders, and the toggle/JK flip-flops: small designs with one
 * concept each, which is what makes them the on-ramp to the themed tracks.
 *
 * Two of the originals would have duplicated a themed problem outright, so they
 * were reworked into the neighbouring exercise instead: the 4-bit parity
 * generator became a parity *checker* (the receive side of problem 14), and the
 * 2-bit binary-to-Gray converter became a Gray *increment* (the step problem 64
 * and problem 65 leave open).
 *
 * They slot into the existing tracks by `track` and `number` rather than forming
 * a track of their own — the UI groups by `track`, and `index.ts` sorts by
 * `number`, so file layout is an authoring convenience only.
 */
import type { VProblemV2 } from '../types';

export const FOUNDATION_PROBLEMS: VProblemV2[] = [
  {
    id: 'g-wire',
    number: 0,
    title: 'Wire',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['basics', 'assign'],
    moduleName: 'plain_wire',
    statement:
      `The smallest possible module: connect the input straight to the output.\n\n` +
      `Whatever arrives on \`a\` appears unchanged on \`y\`. No logic, no state — just a continuous assignment.`,
    context:
      `Every hardware course starts here for a reason. A continuous assignment describes a permanent connection, not an action that happens once; understanding that difference is the whole mental shift from software to RTL.`,
    hint: 'One line: `assign y = a;`',
    inputs: [{ name: 'a', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `plain_wire`', 'Purely combinational'],
    examples: [
      { in: { a: 0 }, out: { y: 0 } },
      { in: { a: 1 }, out: { y: 1 } },
    ],
    starter: `module plain_wire(
  input  a,
  output y
);
  // Connect a straight through to y.

endmodule`,
    solution: `module plain_wire(
  input  a,
  output y
);
  assign y = a;
endmodule`,
    editorial:
      `\`assign\` is not an assignment in the programming sense. It does not run at a moment in time — it declares that \`y\` *is* \`a\`, permanently, for as long as the circuit is powered. Change \`a\` and \`y\` follows after a propagation delay, with nothing executing.\n\n` +
      `This synthesizes to zero gates. The two names refer to the same physical net after optimization.`,
  },

  {
    id: 'g-majority3',
    number: 11,
    title: 'Majority of Three',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'majority', 'voting'],
    moduleName: 'majority3',
    statement:
      `Output the value that at least two of the three inputs agree on.\n\n` +
      `\`y\` is high when two or three of \`a\`, \`b\` and \`c\` are high, and low otherwise.`,
    context:
      `This is a triple-redundancy voter in its smallest form, and it is also — not coincidentally — the carry-out of a full adder. The same three-input function shows up in fault tolerance and in arithmetic.`,
    hint: 'Three AND terms, one per pair, ORed together.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'c', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `majority3`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, c: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1, c: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 0, c: 1 }, out: { y: 1 } },
      { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } },
    ],
    starter: `module majority3(
  input  a,
  input  b,
  input  c,
  output y
);
  // High when at least two inputs are high.

endmodule`,
    solution: `module majority3(
  input  a,
  input  b,
  input  c,
  output y
);
  assign y = (a & b) | (b & c) | (a & c);
endmodule`,
    editorial:
      `Each AND term covers one pair. Any input combination with two or more highs satisfies at least one pair, and no combination with fewer than two can satisfy any — so the three terms are exactly the function.\n\n` +
      `You could also write \`(a + b + c) >= 2\`, which is arguably clearer about the intent, though it invites the tool to build an adder. The gate form is what the majority voter in problem 82 scales up to across a whole bus.`,
  },

  {
    id: 'a-half-sub',
    number: 52,
    title: 'Half Subtractor',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['subtractor', 'borrow', 'basics'],
    moduleName: 'half_sub',
    statement:
      `Subtract one bit from another.\n\n` +
      `\`diff\` is the low bit of \`a - b\`, and \`borrow\` is high when the subtraction needed to borrow from the next position — that is, when \`a\` is 0 and \`b\` is 1.`,
    context:
      `The mirror of the half adder. Modern datapaths do not actually build subtractors: they negate the operand and reuse the adder, as problem 61 shows. Knowing the direct form is still what makes that trick make sense.`,
    hint: 'The difference is an XOR, same as an adder\'s sum. The borrow is `~a & b`.',
    inputs: [{ name: 'a', width: 1, note: 'minuend' }, { name: 'b', width: 1, note: 'subtrahend' }],
    outputs: [
      { name: 'diff', width: 1 },
      { name: 'borrow', width: 1, note: 'high when a < b' },
    ],
    constraints: ['Module name must be `half_sub`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { diff: 0, borrow: 0 } },
      { in: { a: 0, b: 1 }, out: { diff: 1, borrow: 1 }, note: '0 - 1 borrows' },
      { in: { a: 1, b: 0 }, out: { diff: 1, borrow: 0 } },
      { in: { a: 1, b: 1 }, out: { diff: 0, borrow: 0 } },
    ],
    starter: `module half_sub(
  input  a,
  input  b,
  output diff,
  output borrow
);
  // Difference is XOR; borrow happens when a is 0 and b is 1.

endmodule`,
    solution: `module half_sub(
  input  a,
  input  b,
  output diff,
  output borrow
);
  assign diff   = a ^ b;
  assign borrow = ~a & b;
endmodule`,
    editorial:
      `The difference bit is identical to the adder's sum bit — XOR either way — because addition and subtraction agree modulo 2. Only the carry/borrow term differs: an adder generates on \`a & b\`, a subtractor borrows on \`~a & b\`.\n\n` +
      `That asymmetry is precisely what the two's-complement trick exploits. Invert \`b\` and add 1, and the adder's carry logic computes the borrow for you with no extra hardware.`,
  },

  {
    id: 'a-full-sub',
    number: 53,
    title: 'Full Subtractor',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['subtractor', 'borrow', 'cascade'],
    moduleName: 'full_sub',
    statement:
      `Subtract with a borrow coming in from the position below.\n\n` +
      `\`diff\` is the low bit of \`a - b - bin\`. \`bout\` is high when the position needs to borrow from above.`,
    context:
      `Cascade these and you have a ripple-borrow subtractor, the direct analogue of a ripple-carry adder — and with the same linear delay problem.`,
    hint: 'The difference is the XOR of all three. The borrow-out is `(~a & b) | (~a & bin) | (b & bin)`.',
    inputs: [
      { name: 'a', width: 1 }, { name: 'b', width: 1 },
      { name: 'bin', width: 1, note: 'borrow in' },
    ],
    outputs: [
      { name: 'diff', width: 1 },
      { name: 'bout', width: 1, note: 'borrow out' },
    ],
    constraints: ['Module name must be `full_sub`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, bin: 0 }, out: { diff: 0, bout: 0 } },
      { in: { a: 0, b: 0, bin: 1 }, out: { diff: 1, bout: 1 } },
      { in: { a: 1, b: 1, bin: 1 }, out: { diff: 1, bout: 1 } },
      { in: { a: 1, b: 0, bin: 0 }, out: { diff: 1, bout: 0 } },
    ],
    starter: `module full_sub(
  input  a,
  input  b,
  input  bin,
  output diff,
  output bout
);
  // Three-way XOR for the difference; the borrow needs three terms.

endmodule`,
    solution: `module full_sub(
  input  a,
  input  b,
  input  bin,
  output diff,
  output bout
);
  assign diff = a ^ b ^ bin;
  assign bout = (~a & b) | (~a & bin) | (b & bin);
endmodule`,
    editorial:
      `Compare the borrow term with the full adder's carry, \`(a & b) | (b & cin) | (a & cin)\`. It is the same majority-of-three shape with \`a\` inverted — a borrow happens when the minuend is outvoted by what is being taken from it.\n\n` +
      `Nobody ships a ripple-borrow subtractor. Every real datapath computes \`a + ~b + 1\` and reuses the adder, which is why a processor's ALU has one adder and a row of XOR gates rather than two separate arithmetic units.`,
  },

  {
    id: 's-tff',
    number: 74,
    title: 'T Flip-Flop',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['flip-flop', 'toggle', 'divider'],
    moduleName: 't_flipflop',
    statement:
      `A flip-flop that toggles rather than loads.\n\n` +
      `On each rising edge: \`rst\` (synchronous, active high) clears \`q\` to 0. Otherwise, if \`t\` is high \`q\` inverts; if \`t\` is low \`q\` holds.`,
    context:
      `Tie \`t\` high and the output changes state on every clock edge, which means it switches at exactly half the clock frequency. Chain them and each stage halves again — that is a ripple counter, and it is the cheapest frequency divider in digital design.`,
    hint: '`q <= ~q;` in the toggle branch.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'synchronous, active high' },
      { name: 't', width: 1, note: 'high toggles, low holds' },
    ],
    outputs: [{ name: 'q', width: 1 }],
    constraints: [
      'Module name must be `t_flipflop`',
      'Reset is synchronous and beats `t`',
    ],
    examples: [
      { in: { rst: 1, t: 1 }, out: { q: 0 }, note: 'reset wins' },
      { in: { rst: 0, t: 1 }, out: { q: 1 } },
      { in: { rst: 0, t: 1 }, out: { q: 0 }, note: 'toggled again' },
      { in: { rst: 0, t: 0 }, out: { q: 0 }, note: 'held' },
    ],
    stimulus: { cycles: 32, seed: 7001 },
    starter: `module t_flipflop(
  input      clk,
  input      rst,
  input      t,
  output reg q
);
  // Toggle when t is high.

endmodule`,
    solution: `module t_flipflop(
  input      clk,
  input      rst,
  input      t,
  output reg q
);
  always @(posedge clk) begin
    if (rst)    q <= 1'b0;
    else if (t) q <= ~q;
  end
endmodule`,
    editorial:
      `\`q <= ~q\` reads the pre-edge value because the assignment is non-blocking, which is exactly right: the flop toggles based on what it held, not on some partially-updated value.\n\n` +
      `In hardware there is no separate "T flip-flop" cell in most libraries. Synthesis builds it as a D flip-flop with an XOR in front: \`D = q ^ t\`. That is worth noticing, because it means the toggle costs one gate more than a plain load.\n\n` +
      `The divide-by-two behaviour with \`t\` tied high is the basis of the ripple counter — but ripple counters have a skew problem, since each stage clocks off the previous stage's output rather than the real clock. That is why synchronous counters (problem 100) are preferred despite needing more logic.`,
  },

  {
    id: 's-jkff',
    number: 75,
    title: 'JK Flip-Flop',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['flip-flop', 'jk', 'classic'],
    moduleName: 'jk_flipflop',
    statement:
      `The most general of the classic flip-flops: four behaviours selected by two control inputs.\n\n` +
      `On each rising edge, \`rst\` (synchronous, active high) clears \`q\`. Otherwise \`j\` and \`k\` decide:\n\n` +
      `\`j\`=0, \`k\`=0 — hold\n\`j\`=0, \`k\`=1 — clear to 0\n\`j\`=1, \`k\`=0 — set to 1\n\`j\`=1, \`k\`=1 — toggle`,
    context:
      `The JK flip-flop was designed to fix the SR latch's forbidden state: where SR left both-inputs-high undefined, JK defines it as toggle. That made it the universal building block of discrete-logic era counters, and it still turns up in interview questions and excitation tables.`,
    hint:
      'A `case ({j, k})` covers the four combinations directly. Alternatively the whole thing is `q <= (j & ~q) | (~k & q);`',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'j', width: 1 },
      { name: 'k', width: 1 },
    ],
    outputs: [{ name: 'q', width: 1 }],
    constraints: [
      'Module name must be `jk_flipflop`',
      'Reset is synchronous and beats `j`/`k`',
      '`j`=1, `k`=1 must toggle, not be undefined',
    ],
    examples: [
      { in: { rst: 0, j: 1, k: 0 }, out: { q: 1 }, note: 'set' },
      { in: { rst: 0, j: 0, k: 0 }, out: { q: 1 }, note: 'hold' },
      { in: { rst: 0, j: 1, k: 1 }, out: { q: 0 }, note: 'toggle' },
      { in: { rst: 0, j: 0, k: 1 }, out: { q: 0 }, note: 'clear' },
    ],
    stimulus: { cycles: 40, seed: 7002 },
    starter: `module jk_flipflop(
  input      clk,
  input      rst,
  input      j,
  input      k,
  output reg q
);
  // 00 hold, 01 clear, 10 set, 11 toggle

endmodule`,
    solution: `module jk_flipflop(
  input      clk,
  input      rst,
  input      j,
  input      k,
  output reg q
);
  always @(posedge clk) begin
    if (rst) q <= 1'b0;
    else begin
      case ({j, k})
        2'b00: q <= q;      // hold
        2'b01: q <= 1'b0;   // clear
        2'b10: q <= 1'b1;   // set
        2'b11: q <= ~q;     // toggle
      endcase
    end
  end
endmodule`,
    editorial:
      `The characteristic equation \`q_next = (j & ~q) | (~k & q)\` collapses all four rows into one expression, and it is what synthesis produces regardless of how you write it — a D flip-flop with two gates in front.\n\n` +
      `The historical point is the \`j\`=\`k\`=1 row. An SR latch with both inputs asserted drives both outputs to the same value and then resolves unpredictably when the inputs release, which is genuinely unusable. JK defines that case as a toggle, turning a hazard into a feature and making a single part able to count.\n\n` +
      `Modern RTL essentially never instantiates one. You describe the behaviour you want and let the tool infer a D flip-flop, because D is what the standard-cell library actually contains. JK survives as a teaching device and as a way to ask whether a candidate understands excitation tables.`,
  },

  // ── the single-gate ladder ────────────────────────────────────────────────
  {
    id: 'g-not',
    number: 1,
    title: 'NOT Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'assign', 'basics'],
    moduleName: 'not_gate',
    statement:
      `Invert a single bit.\n\n` +
      `\`y\` is high when \`a\` is low, and low when \`a\` is high. Nothing is stored — the output tracks the input continuously.`,
    context:
      `The inverter is the smallest cell in any standard-cell library and the one everything else is measured against: a library's delay figures are quoted in "fanout-of-4 inverter delays". It is also the only gate CMOS builds with two transistors.`,
    hint: 'The bitwise NOT operator is `~`.',
    inputs: [{ name: 'a', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: [
      'Module name must be `not_gate`',
      'Purely combinational — no `always @(posedge …)`, no state',
    ],
    examples: [
      { in: { a: 0 }, out: { y: 1 } },
      { in: { a: 1 }, out: { y: 0 } },
    ],
    starter: `module not_gate(
  input  a,
  output y
);
  // y is the inverse of a.

endmodule`,
    solution: `module not_gate(
  input  a,
  output y
);
  assign y = ~a;
endmodule`,
    editorial:
      `Verilog has two negation operators and they are not interchangeable. \`~\` is bitwise: it inverts every bit of its operand and returns something the same width. \`!\` is logical: it returns a single bit, 1 if the operand is zero and 0 otherwise. On a one-bit signal they agree, which is exactly why the distinction bites later — \`~\` on a 4-bit bus gives you four inverted bits, \`!\` gives you one.\n\n` +
      `In CMOS an inverter is a PMOS pulling up and an NMOS pulling down, and it is inherently *inverting* because both transistor types pass their strong level in only one direction. That is the physical reason NAND and NOR are cheaper than AND and OR: the inverted forms are what the transistors naturally build.`,
  },

  {
    id: 'g-and',
    number: 2,
    title: 'AND Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'assign', 'basics'],
    moduleName: 'and_gate',
    statement:
      `Output \`y\` is high only when both \`a\` and \`b\` are high. Every other combination gives 0.`,
    context:
      `AND is how hardware expresses "both conditions hold" — a write only lands when the request is valid *and* the address is in range. It is also the gating element of every enable signal in a design.`,
    hint: 'The bitwise AND operator is `&`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `and_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1 }, out: { y: 1 } },
    ],
    starter: `module and_gate(
  input  a,
  input  b,
  output y
);
  // High only when both inputs are high.

endmodule`,
    solution: `module and_gate(
  input  a,
  input  b,
  output y
);
  assign y = a & b;
endmodule`,
    editorial:
      `You could also write this structurally as \`and (y, a, b);\` — a built-in gate primitive, with the output listed first. Both descriptions synthesize identically, and the operator form is what modern RTL uses; the primitive form survives mainly in netlists written by tools.\n\n` +
      `A static CMOS library usually has no true AND transistor stack. It builds a NAND and appends an inverter, so an AND costs one more gate delay than a NAND. This is why synthesis output looks nothing like the AND/OR structure you wrote — the tool re-maps everything onto the inverting cells the library is fastest at.`,
  },

  {
    id: 'g-or',
    number: 3,
    title: 'OR Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'assign', 'basics'],
    moduleName: 'or_gate',
    statement:
      `Output \`y\` is high when at least one of \`a\` or \`b\` is high, and low only when both are low.`,
    context:
      `OR collects alarms: an interrupt line asserts when *any* source needs attention, an error flag raises when *any* check fails. Widened into a reduction it becomes the "is anything set?" test that appears in nearly every controller.`,
    hint: 'The bitwise OR operator is `|`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `or_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1 }, out: { y: 1 } },
      { in: { a: 1, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1 }, out: { y: 1 } },
    ],
    starter: `module or_gate(
  input  a,
  input  b,
  output y
);
  // High when either input is high.

endmodule`,
    solution: `module or_gate(
  input  a,
  input  b,
  output y
);
  assign y = a | b;
endmodule`,
    editorial:
      `AND and OR are duals: swap every operator and every constant in one and you get the other. De Morgan makes that concrete — \`a | b\` is \`~(~a & ~b)\`, so an OR is an AND with all three terminals inverted. Synthesis uses this constantly to push inversions around until they cancel.\n\n` +
      `As with AND, watch the single-bar/double-bar distinction. \`|\` is bitwise; \`||\` is logical and always returns one bit. On scalars they agree; on buses they do not, and the mistake compiles cleanly.`,
  },

  {
    id: 'g-nand',
    number: 4,
    title: 'NAND Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'universal', 'assign'],
    moduleName: 'nand_gate',
    statement:
      `Output \`y\` is the complement of AND: low only when both inputs are high, and high in every other case.`,
    context:
      `NAND is *functionally complete* — every Boolean function, however large, can be built from NAND gates alone. Combine that with it being the cheapest gate in static CMOS and you get the reason gate-level netlists are dominated by it.`,
    hint: 'Invert the whole expression: `~(a & b)`. Note that `~a & b` is a different circuit.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `nand_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 1 }, out: { y: 1 } },
      { in: { a: 1, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1 }, out: { y: 0 } },
    ],
    starter: `module nand_gate(
  input  a,
  input  b,
  output y
);
  // Low only when both inputs are high.

endmodule`,
    solution: `module nand_gate(
  input  a,
  input  b,
  output y
);
  assign y = ~(a & b);
endmodule`,
    editorial:
      `The parenthesis placement is the whole problem. \`~(a & b)\` inverts the *result* of the AND; \`~a & b\` inverts \`a\` first and then ANDs. Both are legal Verilog, so the mistake survives compilation and only shows up in simulation.\n\n` +
      `Physically a NAND is two NMOS transistors in series pulling down and two PMOS in parallel pulling up — four transistors, one inversion, no extra stage. The AND that "looks simpler" in your source is that same structure plus an inverter.\n\n` +
      `Problem 15 makes the universality concrete by asking you to rebuild NOT, AND and OR from nothing but this gate.`,
  },

  {
    id: 'g-nor',
    number: 5,
    title: 'NOR Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'universal', 'assign'],
    moduleName: 'nor_gate',
    statement:
      `Output \`y\` is the complement of OR: high only when both inputs are low, and low whenever either input is high.`,
    context:
      `NOR is the other functionally complete gate, and it is the one the classic SR latch is built from — cross-couple two NORs and you have the smallest circuit that remembers a bit.`,
    hint: 'Invert the whole expression: `~(a | b)`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `nor_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1 }, out: { y: 0 } },
    ],
    starter: `module nor_gate(
  input  a,
  input  b,
  output y
);
  // High only when both inputs are low.

endmodule`,
    solution: `module nor_gate(
  input  a,
  input  b,
  output y
);
  assign y = ~(a | b);
endmodule`,
    editorial:
      `NAND and NOR are mirror images through De Morgan: \`~(a | b) == ~a & ~b\`, and \`~(a & b) == ~a | ~b\`. Either form synthesizes to the same cell, because the tool normalizes the whole cone before mapping.\n\n` +
      `They are not equally fast, though. A NOR stacks its *PMOS* transistors in series, and PMOS conducts worse than NMOS for the same area, so a wide NOR degrades faster than a wide NAND. That is why libraries offer 4-input NANDs but rarely 4-input NORs, and why synthesis prefers NAND-heavy structures on critical paths.`,
  },

  {
    id: 'g-xor',
    number: 6,
    title: 'XOR Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'xor', 'arithmetic'],
    moduleName: 'xor_gate',
    statement:
      `Output \`y\` is high when the two inputs *differ*, and low when they are the same.`,
    context:
      `XOR is addition modulo 2, which makes it the sum bit of every adder. It is also the difference detector behind parity, CRC, checksums and the conditional inverter that turns an adder into a subtractor.`,
    hint: 'The XOR operator is `^`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `xor_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1 }, out: { y: 1 } },
      { in: { a: 1, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1 }, out: { y: 0 } },
    ],
    starter: `module xor_gate(
  input  a,
  input  b,
  output y
);
  // High when the inputs differ.

endmodule`,
    solution: `module xor_gate(
  input  a,
  input  b,
  output y
);
  assign y = a ^ b;
endmodule`,
    editorial:
      `Two properties make XOR the workhorse of arithmetic and error checking. It is its own inverse — \`(a ^ b) ^ b == a\`, which is why XOR encryption and Manchester decoding work — and it is *balanced*: flipping either input always flips the output, so no input can mask another.\n\n` +
      `The cost is silicon. A CMOS XOR needs roughly a dozen transistors against a NAND's four, because there is no single transistor stack that produces it. When you write \`^\` across a wide bus you are asking for a tree of those, and it is often the slowest part of an ECC or CRC block.`,
  },

  {
    id: 'g-xnor',
    number: 7,
    title: 'XNOR Gate',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'equality', 'xor'],
    moduleName: 'xnor_gate',
    statement:
      `Output \`y\` is high when the two inputs *match* — both low or both high — and low when they differ.\n\n` +
      `This is a one-bit equality test.`,
    context:
      `Cache tag comparison is a row of these: XNOR every tag bit against the address, AND the results, and a single high output means "hit". The same shape checks an opcode against a decode pattern.`,
    hint: 'Use `~^` (also written `^~`), or invert an XOR with `~(a ^ b)`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `xnor_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1 }, out: { y: 1 } },
    ],
    starter: `module xnor_gate(
  input  a,
  input  b,
  output y
);
  // High when the inputs match.

endmodule`,
    solution: `module xnor_gate(
  input  a,
  input  b,
  output y
);
  assign y = a ~^ b;
endmodule`,
    editorial:
      `The equality operator \`==\` would also work here and reads more clearly at one bit. The difference appears on buses: \`a == b\` reduces a whole vector to a single bit, whereas \`a ~^ b\` gives you a per-bit match vector. Both are useful — you want the reduction for a hit signal and the vector when you need to know *which* bits disagreed.\n\n` +
      `There is a third distinction worth knowing: \`==\` returns \`x\` if either operand contains an unknown, while \`===\` compares \`x\` and \`z\` literally and always returns a definite answer. \`===\` is not synthesizable, which is a feature — it exists for testbenches.`,
  },

  {
    id: 'g-and3',
    number: 8,
    title: '3-Input AND',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'assign'],
    moduleName: 'and3_gate',
    statement:
      `Output \`y\` is high only when all three inputs \`a\`, \`b\` and \`c\` are high.`,
    context:
      `Real enable conditions are rarely two-term. "Issue this instruction" might mean valid AND not-stalled AND no-hazard, and each extra term is another series transistor or another gate level.`,
    hint: 'The operator chains: `a & b & c`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'c', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `and3_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 1, c: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 1, c: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } },
    ],
    starter: `module and3_gate(
  input  a,
  input  b,
  input  c,
  output y
);
  // High only when all three inputs are high.

endmodule`,
    solution: `module and3_gate(
  input  a,
  input  b,
  input  c,
  output y
);
  assign y = a & b & c;
endmodule`,
    editorial:
      `\`&\` is left-associative, so \`a & b & c\` parses as \`(a & b) & c\`. AND is associative so the value is the same either way, and the synthesis tool is free to rebalance the tree; you do not control the gate structure by how you parenthesize.\n\n` +
      `Whether this maps to one 3-input cell or two 2-input cells depends on the library. Stacking transistors in series slows the gate down roughly linearly, so most libraries stop offering wide AND/NAND cells past three or four inputs and let the tool build a tree instead. Once the input count gets large, the reduction operator in problem 12 is the better way to write it.`,
  },

  {
    id: 'g-or3',
    number: 9,
    title: '3-Input OR',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'assign'],
    moduleName: 'or3_gate',
    statement:
      `Output \`y\` is high when at least one of \`a\`, \`b\` or \`c\` is high, and low only when all three are low.`,
    context:
      `The "any of these" test. An exception unit ORs together every fault source; a bus arbiter ORs every request line to decide whether it needs to run an arbitration round at all.`,
    hint: 'The operator chains: `a | b | c`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'c', width: 1 }],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `or3_gate`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, c: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1, c: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } },
    ],
    starter: `module or3_gate(
  input  a,
  input  b,
  input  c,
  output y
);
  // High when any input is high.

endmodule`,
    solution: `module or3_gate(
  input  a,
  input  b,
  input  c,
  output y
);
  assign y = a | b | c;
endmodule`,
    editorial:
      `Concatenation gives a second way to write this: \`|{a, b, c}\` builds a 3-bit vector and OR-reduces it. That form scales — adding a fourth source means adding a name to the braces rather than another operator — and it is what you want the moment the list is more than a few items long.\n\n` +
      `Note what happens if you accidentally write \`||\` instead. On single bits the result is identical, so the bug is invisible here and appears later when someone widens \`a\` to a bus and the logical form silently collapses it to "non-zero".`,
  },

  {
    id: 'g-parity3',
    number: 10,
    title: '3-Bit Parity',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['xor', 'parity', 'gates'],
    moduleName: 'parity3',
    statement:
      `Output \`y\` is high when an *odd* number of the three inputs are high.\n\n` +
      `With one or three inputs set the answer is 1; with zero or two it is 0.`,
    context:
      `This is odd parity over three bits, and it is the sum output of a full adder written on its own. The same XOR chain widened to eight bits is what a UART appends to every frame.`,
    hint: 'XOR chains: `a ^ b ^ c`.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'c', width: 1 }],
    outputs: [{ name: 'y', width: 1, note: 'high when an odd number of inputs are set' }],
    constraints: ['Module name must be `parity3`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, c: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 0, c: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1, c: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } },
    ],
    starter: `module parity3(
  input  a,
  input  b,
  input  c,
  output y
);
  // High when an odd number of inputs are high.

endmodule`,
    solution: `module parity3(
  input  a,
  input  b,
  input  c,
  output y
);
  assign y = a ^ b ^ c;
endmodule`,
    editorial:
      `XOR is associative, so chaining it computes the running sum modulo 2 and the final result is simply the count of ones taken mod 2 — parity. That generalizes to any width, which is why \`^\` has a reduction form (problem 14) that does exactly this over a whole bus.\n\n` +
      `Pair this with the majority function in problem 11 and you have a complete full adder: parity of the three inputs is the sum bit, majority of the three is the carry. Two different functions of the same three signals, and the reason a full adder cell is so compact.`,
  },
  // ── scalar-port combinational classics ───────────────────────────────────
  {
    id: 'c-mux2-bit',
    number: 30,
    title: '2-to-1 Multiplexer',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['mux', 'select', 'ternary'],
    moduleName: 'mux2_bit',
    statement:
      `A multiplexer routes one of its data inputs to the output, chosen by a select line.\n\n` +
      `When \`s\` is 0, \`y\` follows \`a\`. When \`s\` is 1, \`y\` follows \`b\`.`,
    context:
      `The mux is the most-instantiated block in digital design. Every register with a clock enable, every ALU result selection, every forwarding path in a pipeline is one of these — usually widened to a bus, but always this same function.`,
    hint: 'The conditional operator reads like an if/else: `s ? b : a`.',
    inputs: [
      { name: 'a', width: 1, note: 'selected when s is 0' },
      { name: 'b', width: 1, note: 'selected when s is 1' },
      { name: 's', width: 1, note: 'select' },
    ],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `mux2_bit`', 'Purely combinational'],
    examples: [
      { in: { a: 1, b: 0, s: 0 }, out: { y: 1 }, note: 's=0 picks a' },
      { in: { a: 1, b: 0, s: 1 }, out: { y: 0 }, note: 's=1 picks b' },
      { in: { a: 0, b: 1, s: 1 }, out: { y: 1 } },
    ],
    starter: `module mux2_bit(
  input  a,
  input  b,
  input  s,
  output y
);
  // s = 0 -> a, s = 1 -> b

endmodule`,
    solution: `module mux2_bit(
  input  a,
  input  b,
  input  s,
  output y
);
  assign y = s ? b : a;
endmodule`,
    editorial:
      `Order matters in the conditional operator and it is the classic slip: \`s ? a : b\` selects \`a\` when \`s\` is *high*, which is the opposite of what this asks. Read it as "if s then … else …".\n\n` +
      `Underneath, this is the sum of products \`(a & ~s) | (b & s)\` — problem 20 asks you to write it that way explicitly. The select line passes through an inverter on one branch, which is why \`s\` is typically the latest-arriving input on a mux and why timing reports so often show the select path as critical.\n\n` +
      `A real library implements the mux with transmission gates rather than AND-OR, which is faster and smaller. You do not write that; you write the behaviour and let the tool pick the cell.`,
  },

  {
    id: 'c-mux4-bit',
    number: 31,
    title: '4-to-1 Multiplexer',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['mux', 'select', 'ternary'],
    moduleName: 'mux4_bit',
    statement:
      `Select one of four single-bit inputs using two select lines.\n\n` +
      `\`s1\`\`s0\` = 00 picks \`a\`, 01 picks \`b\`, 10 picks \`c\`, 11 picks \`d\`.`,
    context:
      `Two-bit selects show up wherever a small fixed set of sources feeds one destination: a register's write source, a pipeline's forwarding choice, a two-bit opcode picking an ALU result.`,
    hint: 'Nest the conditional operator: `s1 ? (s0 ? d : c) : (s0 ? b : a)`.',
    inputs: [
      { name: 'a', width: 1 }, { name: 'b', width: 1 },
      { name: 'c', width: 1 }, { name: 'd', width: 1 },
      { name: 's1', width: 1, note: 'select MSB' },
      { name: 's0', width: 1, note: 'select LSB' },
    ],
    outputs: [{ name: 'y', width: 1 }],
    constraints: ['Module name must be `mux4_bit`', 'Purely combinational'],
    examples: [
      { in: { a: 1, b: 0, c: 0, d: 0, s1: 0, s0: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 1, c: 0, d: 0, s1: 0, s0: 1 }, out: { y: 1 } },
      { in: { a: 0, b: 0, c: 1, d: 0, s1: 1, s0: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 0, c: 0, d: 1, s1: 1, s0: 1 }, out: { y: 1 } },
    ],
    starter: `module mux4_bit(
  input  a,
  input  b,
  input  c,
  input  d,
  input  s1,
  input  s0,
  output y
);
  // 00 -> a, 01 -> b, 10 -> c, 11 -> d

endmodule`,
    solution: `module mux4_bit(
  input  a,
  input  b,
  input  c,
  input  d,
  input  s1,
  input  s0,
  output y
);
  assign y = s1 ? (s0 ? d : c)
                : (s0 ? b : a);
endmodule`,
    editorial:
      `Nesting builds a tree: two 2-to-1 muxes on \`s0\` feeding a third on \`s1\`. Two levels of logic, and it generalizes — an 8-to-1 is three levels, a 16-to-1 is four.\n\n` +
      `Writing it as a chain instead (\`sel == 0 ? a : sel == 1 ? b : …\`) describes a *priority* structure rather than a balanced tree. Synthesis usually recovers the tree because the conditions are mutually exclusive, but it has to prove that first, and a \`case\` statement (problem 35) states the intent without making the tool work for it.\n\n` +
      `Separate \`s1\` and \`s0\` ports are the old textbook convention. Real designs use one \`[1:0] sel\` bus, which is why the next few problems switch to that style.`,
  },

  {
    id: 'c-dec2to4',
    number: 32,
    title: '2-to-4 Decoder with Enable',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['decoder', 'one-hot', 'enable'],
    moduleName: 'decoder2to4',
    statement:
      `Turn a 2-bit code into a one-hot output.\n\n` +
      `When \`en\` is high, drive exactly one of \`y0\`…\`y3\` high, chosen by \`a1\`\`a0\`: 00 selects \`y0\`, 01 selects \`y1\`, 10 selects \`y2\`, 11 selects \`y3\`.\n\n` +
      `When \`en\` is low, every output is 0.`,
    context:
      `A decoder is how an address becomes a select line. The row decoder in a memory array is exactly this shape, just wider — and the enable is what lets you tile several decoders together to cover a larger address space.`,
    hint: 'Each output ANDs `en` with one input pattern, for example `y0 = en & ~a1 & ~a0`.',
    inputs: [
      { name: 'a1', width: 1, note: 'address MSB' },
      { name: 'a0', width: 1, note: 'address LSB' },
      { name: 'en', width: 1, note: 'active high' },
    ],
    outputs: [
      { name: 'y0', width: 1 }, { name: 'y1', width: 1 },
      { name: 'y2', width: 1 }, { name: 'y3', width: 1 },
    ],
    constraints: [
      'Module name must be `decoder2to4`',
      'All outputs are 0 when `en` is 0',
      'Purely combinational',
    ],
    examples: [
      { in: { a1: 0, a0: 0, en: 1 }, out: { y0: 1, y1: 0, y2: 0, y3: 0 } },
      { in: { a1: 0, a0: 1, en: 1 }, out: { y0: 0, y1: 1, y2: 0, y3: 0 } },
      { in: { a1: 1, a0: 1, en: 1 }, out: { y0: 0, y1: 0, y2: 0, y3: 1 } },
      { in: { a1: 1, a0: 1, en: 0 }, out: { y0: 0, y1: 0, y2: 0, y3: 0 }, note: 'disabled' },
    ],
    starter: `module decoder2to4(
  input  a1,
  input  a0,
  input  en,
  output y0,
  output y1,
  output y2,
  output y3
);
  // Exactly one output high when enabled, none when not.

endmodule`,
    solution: `module decoder2to4(
  input  a1,
  input  a0,
  input  en,
  output y0,
  output y1,
  output y2,
  output y3
);
  assign y0 = en & ~a1 & ~a0;
  assign y1 = en & ~a1 &  a0;
  assign y2 = en &  a1 & ~a0;
  assign y3 = en &  a1 &  a0;
endmodule`,
    editorial:
      `A decoder is the inverse of an encoder: it expands a compact binary index into a one-hot vector where the position carries the information. That representation costs more wires but needs no decoding downstream — a one-hot select feeds a mux or a write-enable directly.\n\n` +
      `The four product terms share subexpressions (\`~a1\`, \`~a0\`), so the real gate count is lower than four independent 3-input ANDs. Synthesis factors that automatically.\n\n` +
      `The enable is not decoration. Chain two of these with complementary enables driven by a third address bit and you have a 3-to-8 decoder — the standard way decoders were composed before they were just written as \`1 << addr\`.`,
  },

  {
    id: 'c-prio4',
    number: 33,
    title: '4-to-2 Priority Encoder',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['encoder', 'priority', 'arbitration'],
    moduleName: 'prio_encoder4',
    statement:
      `Report which of four request lines wins, where \`i3\` has the highest priority and \`i0\` the lowest.\n\n` +
      `Drive \`y1\`\`y0\` with the index of the highest-priority input that is high, and \`valid\` high whenever any input is high. When no input is set, \`valid\` is 0 and both index bits are 0.\n\n` +
      `Several inputs may be high at once — the highest wins outright.`,
    context:
      `This is an interrupt controller in miniature, and a fixed-priority bus arbiter. The reason it needs a \`valid\` output is that index 0 is ambiguous on its own: it means both "input 0 won" and "nobody asked".`,
    hint: 'Check `i3` first, then `i2`, `i1`, `i0`. `valid` is the OR of all four.',
    inputs: [
      { name: 'i3', width: 1, note: 'highest priority' },
      { name: 'i2', width: 1 },
      { name: 'i1', width: 1 },
      { name: 'i0', width: 1, note: 'lowest priority' },
    ],
    outputs: [
      { name: 'y1', width: 1, note: 'index MSB' },
      { name: 'y0', width: 1, note: 'index LSB' },
      { name: 'valid', width: 1, note: 'high when any input is set' },
    ],
    constraints: [
      'Module name must be `prio_encoder4`',
      'When no input is set: `valid` = 0 and the index is 0',
      'Purely combinational',
    ],
    examples: [
      { in: { i3: 0, i2: 0, i1: 0, i0: 0 }, out: { y1: 0, y0: 0, valid: 0 } },
      { in: { i3: 0, i2: 0, i1: 0, i0: 1 }, out: { y1: 0, y0: 0, valid: 1 } },
      { in: { i3: 0, i2: 1, i1: 0, i0: 1 }, out: { y1: 1, y0: 0, valid: 1 }, note: 'i2 outranks i0' },
      { in: { i3: 1, i2: 1, i1: 1, i0: 1 }, out: { y1: 1, y0: 1, valid: 1 } },
    ],
    starter: `module prio_encoder4(
  input  i3,
  input  i2,
  input  i1,
  input  i0,
  output y1,
  output y0,
  output valid
);
  // Highest set input wins; valid is low when none are set.

endmodule`,
    solution: `module prio_encoder4(
  input  i3,
  input  i2,
  input  i1,
  input  i0,
  output y1,
  output y0,
  output valid
);
  assign valid = i3 | i2 | i1 | i0;
  assign y1    = i3 | i2;
  assign y0    = i3 | (~i2 & i1);
endmodule`,
    editorial:
      `The two index bits fall out of the priority table once you write it down. \`y1\` is high for indices 2 and 3, which is \`i3 | i2\` — no masking needed, since anything above already forces it. \`y0\` is high for indices 1 and 3: \`i3\` forces it, and \`i1\` only counts when \`i2\` is not blocking, hence the \`~i2\`.\n\n` +
      `A plain (non-priority) encoder would just be \`y1 = i3 | i2\`, \`y0 = i3 | i1\`, and it produces nonsense when two inputs are set at once — \`i2\` and \`i1\` together would report 3. The masking term is the entire difference between the two circuits.\n\n` +
      `Fixed priority is simple but starves the low inputs under constant load. Real arbiters rotate the priority each grant (round-robin) or track age, which is a sequential problem rather than this combinational one. Problem 37 scales the same structure to eight inputs using \`casez\`.`,
  },

  {
    id: 'c-parity-check4',
    number: 39,
    title: 'Parity Checker with Error Flag',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['parity', 'error-detection', 'xor'],
    moduleName: 'parity_check4',
    statement:
      `The receiving half of a parity link. A 4-bit word arrives together with the parity bit that the transmitter computed over it.\n\n` +
      `Recompute the parity of \`data\` and compare it with \`parity_in\`. Raise \`error\` when they disagree.\n\n` +
      `\`odd_mode\` selects the convention: when it is high the sender used odd parity (the parity bit is the XOR of the data bits); when it is low the sender used even parity (the complement of that).`,
    context:
      `Every UART frame, every parity-protected SRAM word and every legacy DRAM byte carries one of these bits, and this is the circuit that decides whether to trust the data. It detects any single flipped bit and misses any double flip — which is precisely the limitation that motivates ECC.`,
    hint:
      'The XOR reduction `^data` is the odd parity of the word. Under even parity the expected bit is its complement; then `error` is a comparison against `parity_in`.',
    inputs: [
      { name: 'data', width: 4, note: 'received payload' },
      { name: 'parity_in', width: 1, note: 'parity bit as received' },
      { name: 'odd_mode', width: 1, note: '1 = odd parity, 0 = even parity' },
    ],
    outputs: [{ name: 'error', width: 1, note: 'high when the parity does not match' }],
    constraints: [
      'Module name must be `parity_check4`',
      'Must work under both parity conventions',
      'Purely combinational',
    ],
    examples: [
      { in: { data: '4\'b0000', parity_in: 0, odd_mode: 1 }, out: { error: 0 } },
      { in: { data: '4\'b0001', parity_in: 0, odd_mode: 1 }, out: { error: 1 }, note: 'odd parity should be 1' },
      { in: { data: '4\'b0001', parity_in: 0, odd_mode: 0 }, out: { error: 0 }, note: 'even parity is 0' },
      { in: { data: '4\'b1011', parity_in: 1, odd_mode: 1 }, out: { error: 0 } },
    ],
    starter: `module parity_check4(
  input  [3:0] data,
  input        parity_in,
  input        odd_mode,
  output       error
);
  // Recompute the parity, pick the convention, compare.

endmodule`,
    solution: `module parity_check4(
  input  [3:0] data,
  input        parity_in,
  input        odd_mode,
  output       error
);
  wire computed = odd_mode ? ^data : ~(^data);
  assign error  = computed ^ parity_in;
endmodule`,
    editorial:
      `The comparison is an XOR, not an equality operator, and that is the neat part: \`computed ^ parity_in\` is high exactly when the two disagree. It also means the whole circuit collapses into one XOR tree over five bits, with \`odd_mode\` as a conditional inverter on the end — the same programmable-inverter trick as problem 19.\n\n` +
      `Writing it as \`^{data, parity_in}\` is even shorter: XOR the payload and its parity bit together and, under odd parity, the result is 0 on a clean word. That is how hardware actually checks parity — no separate recompute-and-compare step, just one reduction over the whole frame.\n\n` +
      `Parity catches every odd number of flipped bits and nothing else. Two flips inside the same word cancel and sail through undetected, which is why anything that cares about data integrity uses a Hamming or BCH code with enough distance to both detect and correct.`,
  },
  // ── scalar-port arithmetic classics ──────────────────────────────────────
  {
    id: 'a-cmp1',
    number: 54,
    title: '1-Bit Comparator',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['comparator', 'multi-output'],
    moduleName: 'compare1',
    statement:
      `Compare two single-bit numbers and report the relationship on three separate outputs.\n\n` +
      `\`gt\` is high when \`a\` is greater than \`b\`, \`eq\` when they are equal, \`lt\` when \`a\` is less. Exactly one of the three is high for any input.`,
    context:
      `Three mutually exclusive outputs is the classic comparator interface, and it is how comparator ICs were packaged. It survives in RTL because a downstream mux can use the flags directly as one-hot selects.`,
    hint: '`gt = a & ~b`, `lt = ~a & b`, and equality is an XNOR.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [
      { name: 'gt', width: 1, note: 'a > b' },
      { name: 'eq', width: 1, note: 'a == b' },
      { name: 'lt', width: 1, note: 'a < b' },
    ],
    constraints: [
      'Module name must be `compare1`',
      'Exactly one output is high in every case',
      'Purely combinational',
    ],
    examples: [
      { in: { a: 0, b: 0 }, out: { gt: 0, eq: 1, lt: 0 } },
      { in: { a: 0, b: 1 }, out: { gt: 0, eq: 0, lt: 1 } },
      { in: { a: 1, b: 0 }, out: { gt: 1, eq: 0, lt: 0 } },
      { in: { a: 1, b: 1 }, out: { gt: 0, eq: 1, lt: 0 } },
    ],
    starter: `module compare1(
  input  a,
  input  b,
  output gt,
  output eq,
  output lt
);
  // Exactly one of gt / eq / lt is high.

endmodule`,
    solution: `module compare1(
  input  a,
  input  b,
  output gt,
  output eq,
  output lt
);
  assign gt = a & ~b;
  assign eq = a ~^ b;
  assign lt = ~a & b;
endmodule`,
    editorial:
      `Only two of the three outputs carry information — the third is implied, since \`eq\` is just \`~(gt | lt)\`. Driving all three anyway costs one gate and saves the consumer from having to derive it, which is usually the right trade.\n\n` +
      `The "exactly one high" property is what makes these usable as one-hot mux selects downstream. It is also a property worth asserting in a testbench: if a widened version of this ever drives two flags at once, something is wrong with the comparison logic rather than with whatever consumed it.\n\n` +
      `At one bit, "greater than" is just \`a AND NOT b\` — there is no borrow chain and no sign to worry about. Problem 62 shows what changes once both appear.`,
  },

  {
    id: 'a-cmp2',
    number: 55,
    title: '2-Bit Comparator',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['comparator', 'multi-output', 'cascade'],
    moduleName: 'compare2',
    statement:
      `Compare two 2-bit unsigned numbers, A = \`a1\`\`a0\` and B = \`b1\`\`b0\`, presented as individual bits.\n\n` +
      `Drive \`gt\`, \`eq\` and \`lt\` as before: exactly one is high for any input.`,
    context:
      `Comparison ripples from the top bit down, and that structure is why comparing wide numbers is not free. Understanding the two-bit case is what makes the general rule obvious: the most significant differing bit decides everything below it.`,
    hint:
      'Equality is per-bit XNOR ANDed together. For greater-than, the high bits decide first; the low bits only matter when the high bits tie.',
    inputs: [
      { name: 'a1', width: 1, note: 'A MSB' }, { name: 'a0', width: 1, note: 'A LSB' },
      { name: 'b1', width: 1, note: 'B MSB' }, { name: 'b0', width: 1, note: 'B LSB' },
    ],
    outputs: [
      { name: 'gt', width: 1, note: 'A > B' },
      { name: 'eq', width: 1, note: 'A == B' },
      { name: 'lt', width: 1, note: 'A < B' },
    ],
    constraints: [
      'Module name must be `compare2`',
      'Treat both operands as unsigned',
      'Purely combinational',
    ],
    examples: [
      { in: { a1: 0, a0: 0, b1: 0, b0: 0 }, out: { gt: 0, eq: 1, lt: 0 } },
      { in: { a1: 1, a0: 0, b1: 0, b0: 1 }, out: { gt: 1, eq: 0, lt: 0 }, note: '2 > 1' },
      { in: { a1: 0, a0: 1, b1: 1, b0: 0 }, out: { gt: 0, eq: 0, lt: 1 }, note: '1 < 2' },
      { in: { a1: 1, a0: 1, b1: 1, b0: 1 }, out: { gt: 0, eq: 1, lt: 0 } },
    ],
    starter: `module compare2(
  input  a1,
  input  a0,
  input  b1,
  input  b0,
  output gt,
  output eq,
  output lt
);
  // The high bits decide unless they are equal.

endmodule`,
    solution: `module compare2(
  input  a1,
  input  a0,
  input  b1,
  input  b0,
  output gt,
  output eq,
  output lt
);
  wire hi_eq = a1 ~^ b1;

  assign eq = hi_eq & (a0 ~^ b0);
  assign gt = (a1 & ~b1) | (hi_eq & a0 & ~b0);
  assign lt = (~a1 & b1) | (hi_eq & ~a0 & b0);
endmodule`,
    editorial:
      `The \`hi_eq\` term is the whole idea. A lower bit can only influence the result when every bit above it agrees, so each position's contribution is gated by the equality of all higher positions. Extend that to 32 bits and you get a chain of 32 AND terms — a linear-depth structure with exactly the same problem as a ripple-carry adder.\n\n` +
      `Real comparators avoid the chain. The usual trick is to subtract: \`a - b\` in one wide adder gives you the ordering from the carry-out and the equality from a NOR of the difference, and the adder is already carry-lookahead. That is why a processor's branch unit has no dedicated comparator — it borrows the ALU.\n\n` +
      `Writing \`assign gt = ({a1,a0} > {b1,b0});\` produces the same function in one line and is what you would actually ship. Building it from gates once is what makes the cost model visible.`,
  },

  {
    id: 'a-add2',
    number: 56,
    title: '2-Bit Adder',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['adder', 'carry', 'cascade'],
    moduleName: 'adder2',
    statement:
      `Add two 2-bit unsigned numbers, A = \`a1\`\`a0\` and B = \`b1\`\`b0\`.\n\n` +
      `Produce the 2-bit sum \`s1\`\`s0\` and the carry-out \`cout\`. The full result is the three-bit value \`cout\`\`s1\`\`s0\`, so 3 + 1 gives \`cout\`=1 with a sum of 0.`,
    context:
      `This is a ripple-carry adder with exactly two stages — small enough to write out by hand, large enough that the carry chain is visible. Everything about wide-adder design follows from watching what the carry between these two bits costs.`,
    hint:
      'Chain two adders: the low bits produce `s0` and an internal carry, and that carry feeds the high bit as its carry-in.',
    inputs: [
      { name: 'a1', width: 1 }, { name: 'a0', width: 1 },
      { name: 'b1', width: 1 }, { name: 'b0', width: 1 },
    ],
    outputs: [
      { name: 's1', width: 1, note: 'sum MSB' },
      { name: 's0', width: 1, note: 'sum LSB' },
      { name: 'cout', width: 1, note: 'carry out' },
    ],
    constraints: [
      'Module name must be `adder2`',
      'Purely combinational',
    ],
    examples: [
      { in: { a1: 0, a0: 1, b1: 0, b0: 1 }, out: { s1: 1, s0: 0, cout: 0 }, note: '1 + 1 = 2' },
      { in: { a1: 1, a0: 1, b1: 0, b0: 1 }, out: { s1: 0, s0: 0, cout: 1 }, note: '3 + 1 = 4' },
      { in: { a1: 1, a0: 0, b1: 1, b0: 0 }, out: { s1: 0, s0: 0, cout: 1 }, note: '2 + 2 = 4' },
      { in: { a1: 1, a0: 1, b1: 1, b0: 1 }, out: { s1: 1, s0: 0, cout: 1 }, note: '3 + 3 = 6' },
    ],
    starter: `module adder2(
  input  a1,
  input  a0,
  input  b1,
  input  b0,
  output s1,
  output s0,
  output cout
);
  // Two stages: the low carry feeds the high bit.

endmodule`,
    solution: `module adder2(
  input  a1,
  input  a0,
  input  b1,
  input  b0,
  output s1,
  output s0,
  output cout
);
  wire c1 = a0 & b0;                 // carry out of the low bit

  assign s0   = a0 ^ b0;
  assign s1   = a1 ^ b1 ^ c1;
  assign cout = (a1 & b1) | (c1 & (a1 ^ b1));
endmodule`,
    editorial:
      `The low stage is a half adder — there is no carry-in to worry about — and the high stage is a full adder taking \`c1\`. Naming that intermediate carry is what keeps the expressions readable; writing \`s1\` as one giant expression in terms of the four inputs works but tells you nothing about the structure.\n\n` +
      `The carry-out term \`(a1 & b1) | (c1 & (a1 ^ b1))\` splits into *generate* and *propagate*: \`a1 & b1\` generates a carry regardless of what arrives from below, and \`a1 ^ b1\` propagates whatever does arrive. Those two signals are the entire basis of carry-lookahead — problem 59 computes them for all bits in parallel instead of waiting for the ripple.\n\n` +
      `Of course \`assign {cout, s1, s0} = {a1,a0} + {b1,b0};\` does the same job in one line, and that is what production RTL says. The tool then picks an adder architecture from its library based on your timing constraint, which it can only do because you described addition rather than a specific gate structure.`,
  },

  {
    id: 'a-alu1',
    number: 57,
    title: '1-Bit ALU',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['alu', 'mux', 'select'],
    moduleName: 'alu1',
    statement:
      `A minimal arithmetic-logic unit. Two opcode bits \`op1\`\`op0\` choose what happens to \`a\` and \`b\`:\n\n` +
      `00 — AND\n01 — OR\n10 — XOR\n11 — NOT \`a\` (\`b\` is ignored)\n\n` +
      `Drive the chosen result onto \`y\`.`,
    context:
      `Strip a processor's ALU down to one bit and this is what is left: a handful of logic functions and a mux picking between them. The bit-slice structure is real — early ALUs were literally built by tiling a one-bit slice sixteen or thirty-two times.`,
    hint: 'It is a 4-to-1 multiplexer whose data inputs are `a & b`, `a | b`, `a ^ b` and `~a`.',
    inputs: [
      { name: 'a', width: 1 }, { name: 'b', width: 1 },
      { name: 'op1', width: 1, note: 'opcode MSB' },
      { name: 'op0', width: 1, note: 'opcode LSB' },
    ],
    outputs: [{ name: 'y', width: 1 }],
    constraints: [
      'Module name must be `alu1`',
      'All four opcodes must be covered — no inferred latch',
      'Purely combinational',
    ],
    examples: [
      { in: { a: 1, b: 0, op1: 0, op0: 0 }, out: { y: 0 }, note: 'AND' },
      { in: { a: 1, b: 0, op1: 0, op0: 1 }, out: { y: 1 }, note: 'OR' },
      { in: { a: 1, b: 1, op1: 1, op0: 0 }, out: { y: 0 }, note: 'XOR' },
      { in: { a: 1, b: 0, op1: 1, op0: 1 }, out: { y: 0 }, note: 'NOT a' },
    ],
    starter: `module alu1(
  input  a,
  input  b,
  input  op1,
  input  op0,
  output y
);
  // 00 AND, 01 OR, 10 XOR, 11 NOT a

endmodule`,
    solution: `module alu1(
  input  a,
  input  b,
  input  op1,
  input  op0,
  output y
);
  assign y = op1 ? (op0 ? ~a : (a ^ b))
                 : (op0 ? (a | b) : (a & b));
endmodule`,
    editorial:
      `Every ALU has this shape: compute all the operations unconditionally, then mux. That looks wasteful — three of the four results are thrown away every cycle — but it is the only way to keep the latency at one mux delay, and the discarded logic costs area rather than time. Power-conscious designs claw some of it back by gating the operand inputs of unused units.\n\n` +
      `A \`case ({op1, op0})\` with all four branches reads better than nested conditionals and states the mutual exclusivity explicitly. What matters either way is covering all four codes: leave one out of a \`case\` inside an \`always @*\` and the tool infers a latch to hold the previous value, which is almost never what anyone wanted.\n\n` +
      `Notice \`b\` is unused in the NOT branch. Synthesis will not complain — it simply finds no path — but if a port ends up with no path under *any* opcode, that is a genuine warning worth reading rather than suppressing. Problem 67 scales this to eight bits with arithmetic operations and flags, where the result mux stops being the interesting part and the adder starts setting the cycle time.`,
  },

  {
    id: 'a-gray-inc',
    number: 66,
    title: 'Gray Code Increment',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['gray-code', 'cdc', 'fifo'],
    moduleName: 'gray_inc4',
    statement:
      `Given a 4-bit Gray codeword, produce the Gray codeword for the next value in sequence.\n\n` +
      `The values wrap: the successor of the codeword for 15 is the codeword for 0. Consecutive outputs must still differ from their input in exactly one bit.`,
    context:
      `An asynchronous FIFO's pointers live in Gray code so they can cross a clock domain safely, but they still need to count. This is the increment step: decode to binary, add one, re-encode — and the whole point is that the *stored* value never leaves Gray code.`,
    hint:
      'Convert to binary with an XOR prefix (each binary bit is the XOR of all Gray bits at and above it), add 1, then convert back with `bin ^ (bin >> 1)`.',
    inputs: [{ name: 'gray_in', width: 4, note: 'current Gray codeword' }],
    outputs: [{ name: 'gray_next', width: 4, note: 'Gray codeword for the next value' }],
    constraints: [
      'Module name must be `gray_inc4`',
      'The count wraps from 15 back to 0',
      'Purely combinational',
    ],
    examples: [
      { in: { gray_in: '4\'b0000' }, out: { gray_next: '4\'b0001' }, note: '0 -> 1' },
      { in: { gray_in: '4\'b0001' }, out: { gray_next: '4\'b0011' }, note: '1 -> 2' },
      { in: { gray_in: '4\'b0010' }, out: { gray_next: '4\'b0110' }, note: '3 -> 4' },
      { in: { gray_in: '4\'b1000' }, out: { gray_next: '4\'b0000' }, note: '15 wraps to 0' },
    ],
    starter: `module gray_inc4(
  input  [3:0] gray_in,
  output [3:0] gray_next
);
  // Gray -> binary -> +1 -> Gray.

endmodule`,
    solution: `module gray_inc4(
  input  [3:0] gray_in,
  output [3:0] gray_next
);
  wire [3:0] bin = {gray_in[3],
                    gray_in[3] ^ gray_in[2],
                    gray_in[3] ^ gray_in[2] ^ gray_in[1],
                    gray_in[3] ^ gray_in[2] ^ gray_in[1] ^ gray_in[0]};

  wire [3:0] bin_next = bin + 4'd1;

  assign gray_next = bin_next ^ (bin_next >> 1);
endmodule`,
    editorial:
      `The two conversions are not symmetric. Binary to Gray is a single XOR against a shifted copy — constant depth at any width. Gray to binary is an XOR *prefix*: bit \`i\` depends on every Gray bit above it, so the depth grows with the width. That asymmetry is why a Gray counter is usually built as a binary counter with a Gray *output* stage rather than by incrementing in Gray directly.\n\n` +
      `Which is exactly what an asynchronous FIFO does. It keeps a binary pointer in the source domain for the arithmetic, converts to Gray on the way out, and synchronizes the Gray version across the domain boundary. This problem is the "increment in Gray" alternative, and comparing the two structures tells you why the first one won.\n\n` +
      `The wrap works only because 16 is a power of two. Truncate the sequence — count modulo 12, say — and the wrap from the last codeword back to the first flips several bits at once, destroying the single-bit-change guarantee. That is the real reason asynchronous FIFOs are almost always power-of-two deep.`,
  },
];
