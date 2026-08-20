/**
 * Track 3 — Arithmetic & Datapath.
 *
 * Adders in three architectures, comparison, ALU flags and code conversion. The
 * recurring theme is that all of these compute the same answers with very
 * different delay/area trade-offs, which is exactly what interviews probe.
 */
import type { VProblemV2 } from '../types';

export const ARITHMETIC_PROBLEMS: VProblemV2[] = [
  {
    id: 'a-half-adder',
    number: 50,
    title: 'Half Adder',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['adder', 'basics'],
    moduleName: 'half_adder',
    statement:
      `Add two single bits.\n\n` +
      `\`sum\` is the low bit of the result and \`carry\` is the overflow into the next position. There is no carry input.`,
    context:
      `The half adder is the least significant cell of any ripple-carry adder and a building block of the partial-product trees inside multipliers.`,
    hint: 'The sum is an XOR; the carry is an AND.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [
      { name: 'sum', width: 1, note: 'a + b, low bit' },
      { name: 'carry', width: 1, note: 'overflow bit' },
    ],
    constraints: ['Module name must be `half_adder`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0 }, out: { sum: 0, carry: 0 } },
      { in: { a: 1, b: 0 }, out: { sum: 1, carry: 0 } },
      { in: { a: 1, b: 1 }, out: { sum: 0, carry: 1 } },
    ],
    starter: `module half_adder(
  input  a,
  input  b,
  output sum,
  output carry
);
  // One XOR and one AND.

endmodule`,
    solution: `module half_adder(
  input  a,
  input  b,
  output sum,
  output carry
);
  assign sum   = a ^ b;
  assign carry = a & b;
endmodule`,
    editorial:
      `1 + 1 = 2, which is \`10\` in binary — sum 0, carry 1. That single row is why the sum is XOR rather than OR.\n\n` +
      `You could also write \`assign {carry, sum} = a + b;\` and let the tool infer both bits from the concatenation on the left. Identical hardware, and it scales to wider adders without changing shape.`,
  },

  {
    id: 'a-full-adder',
    number: 51,
    title: 'Full Adder',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['adder', 'carry'],
    moduleName: 'full_adder',
    statement:
      `Add two bits plus a carry from the position below.\n\n` +
      `\`sum\` is the low bit of \`a + b + cin\`; \`cout\` is the carry into the next position. \`cout\` is high whenever at least two of the three inputs are high.`,
    context:
      `Cascade N of these and you have an N-bit adder. The carry path from \`cin\` to \`cout\` is the reason a ripple-carry adder gets slow: every stage waits for the one below it.`,
    hint: 'Sum is the XOR of all three. Carry-out is the majority function of the three inputs.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'cin', width: 1 }],
    outputs: [{ name: 'sum', width: 1 }, { name: 'cout', width: 1 }],
    constraints: ['Module name must be `full_adder`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, cin: 0 }, out: { sum: 0, cout: 0 } },
      { in: { a: 1, b: 0, cin: 0 }, out: { sum: 1, cout: 0 } },
      { in: { a: 1, b: 1, cin: 0 }, out: { sum: 0, cout: 1 } },
      { in: { a: 1, b: 1, cin: 1 }, out: { sum: 1, cout: 1 } },
    ],
    starter: `module full_adder(
  input  a,
  input  b,
  input  cin,
  output sum,
  output cout
);
  // Sum is a three-way XOR; carry is a majority vote.

endmodule`,
    solution: `module full_adder(
  input  a,
  input  b,
  input  cin,
  output sum,
  output cout
);
  assign sum  = a ^ b ^ cin;
  assign cout = (a & b) | (b & cin) | (a & cin);
endmodule`,
    editorial:
      `The carry expression is the majority-of-three function, and it is also \`(a & b) | (cin & (a ^ b))\` — generate, or propagate-and-carry-in. That second form is the seed of carry-lookahead: \`g = a & b\` and \`p = a ^ b\` are precisely the generate and propagate terms.\n\n` +
      `Note the delay asymmetry. The \`cin → cout\` path is one AND-OR, while \`cin → sum\` is an XOR. Since the carry chain is what ripples, cell libraries optimize the carry path specifically.`,
  },

  {
    id: 'a-rca4',
    number: 58,
    title: '4-Bit Ripple Carry Adder',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['adder', 'ripple-carry', 'generate'],
    moduleName: 'rca4',
    statement:
      `Add two 4-bit numbers with a carry in and a carry out.\n\n` +
      `\`sum\` holds the low four bits of \`a + b + cin\`, and \`cout\` is the carry out of the top bit — so together they form the exact 5-bit result.`,
    context:
      `The simplest adder architecture: chain four full adders and let the carry ripple. Small and regular, but its delay grows linearly with width, which is why anything wide and fast uses lookahead instead.`,
    hint:
      'Let the tool build it: `assign {cout, sum} = a + b + cin;` — the 5-bit left-hand side captures the carry naturally.',
    inputs: [
      { name: 'a', width: 4 }, { name: 'b', width: 4 },
      { name: 'cin', width: 1 },
    ],
    outputs: [
      { name: 'sum', width: 4 },
      { name: 'cout', width: 1, note: 'carry out of bit 3' },
    ],
    constraints: ['Module name must be `rca4`', 'Purely combinational'],
    examples: [
      { in: { a: 5, b: 3, cin: 0 }, out: { sum: 8, cout: 0 } },
      { in: { a: 10, b: 10, cin: 0 }, out: { sum: 4, cout: 1 }, note: '20 wraps to 4 with carry' },
      { in: { a: 15, b: 0, cin: 1 }, out: { sum: 0, cout: 1 } },
      { in: { a: 15, b: 15, cin: 1 }, out: { sum: 15, cout: 1 } },
    ],
    starter: `module rca4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  // The carry out is just the fifth bit of the result.

endmodule`,
    solution: `module rca4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  assign {cout, sum} = a + b + cin;
endmodule`,
    editorial:
      `The concatenation on the left is doing real work: it makes the assignment context 5 bits wide, so Verilog evaluates the whole right-hand side at 5 bits and the carry survives. Assign to a 4-bit \`sum\` alone and the carry is silently discarded.\n\n` +
      `Writing \`a + b + cin\` rather than instantiating four full adders lets the tool pick the architecture — it will use whatever adder its library implements best, often a carry-lookahead or a carry-select, not a literal ripple chain. Hand-instantiating full adders locks it into the slow version.`,
  },

  {
    id: 'a-cla4',
    number: 59,
    title: '4-Bit Carry Lookahead Adder',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['adder', 'carry-lookahead', 'critical-path'],
    moduleName: 'cla4',
    statement:
      `Build a 4-bit adder that computes all its carries in parallel instead of rippling them.\n\n` +
      `For each bit define generate \`g[i] = a[i] & b[i]\` (this position makes a carry regardless) and propagate \`p[i] = a[i] ^ b[i]\` (this position passes a carry through). Then every carry is a direct function of \`cin\`:\n\n` +
      `c1 = g0 | (p0 & cin)\nc2 = g1 | (p1 & g0) | (p1 & p0 & cin)\nc3 = g2 | (p2 & g1) | (p2 & p1 & g0) | (p2 & p1 & p0 & cin)\ncout = g3 | (p3 & g2) | (p3 & p2 & g1) | (p3 & p2 & p1 & g0) | (p3 & p2 & p1 & p0 & cin)\n\n` +
      `The sum bits are then \`sum[i] = p[i] ^ c[i]\`, with \`c[0] = cin\`.\n\n` +
      `The results must match an ordinary adder exactly — the point is the structure, not the answer.`,
    context:
      `Ripple-carry delay grows with width; lookahead flattens the carry computation into two gate levels at the cost of much wider gates. Every fast adder in a real ALU is some hybrid of this idea.`,
    hint: 'Compute the `g` and `p` vectors first, then write each carry as its own `assign`.',
    inputs: [
      { name: 'a', width: 4 }, { name: 'b', width: 4 },
      { name: 'cin', width: 1 },
    ],
    outputs: [{ name: 'sum', width: 4 }, { name: 'cout', width: 1 }],
    constraints: [
      'Module name must be `cla4`',
      'Derive the carries from explicit generate/propagate terms',
      'Purely combinational',
    ],
    examples: [
      { in: { a: 5, b: 3, cin: 0 }, out: { sum: 8, cout: 0 } },
      { in: { a: 10, b: 10, cin: 0 }, out: { sum: 4, cout: 1 } },
      { in: { a: 15, b: 15, cin: 1 }, out: { sum: 15, cout: 1 } },
    ],
    starter: `module cla4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  wire [3:0] g = a & b;   // generate
  wire [3:0] p = a ^ b;   // propagate
  // Build c1, c2, c3 and cout from g and p, then sum = p ^ c.

endmodule`,
    solution: `module cla4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  wire [3:0] g = a & b;
  wire [3:0] p = a ^ b;

  wire c1 = g[0] | (p[0] & cin);
  wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & cin);
  wire c3 = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & cin);

  assign cout = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1])
              | (p[3] & p[2] & p[1] & g[0]) | (p[3] & p[2] & p[1] & p[0] & cin);

  assign sum = p ^ {c3, c2, c1, cin};
endmodule`,
    editorial:
      `Every carry here depends only on \`g\`, \`p\` and \`cin\` — never on another carry — so all four resolve in the same two gate levels. That is the whole trick, and it is why the adder's delay stops growing with width.\n\n` +
      `The cost is fan-in. The \`cout\` expression already needs a 5-input OR with terms up to 5 inputs wide, and at 16 bits the equivalent expression is unbuildable. Real designs therefore use 4-bit lookahead blocks and then apply the same lookahead trick a second time *between* blocks, using block-level generate and propagate signals. That hierarchy is what a "carry-lookahead adder" actually means at scale.\n\n` +
      `Compare with problem 58: identical outputs, completely different timing. Synthesis will usually reach the same place on its own — this problem is about being able to explain why.`,
  },

  {
    id: 'a-carry-select',
    number: 60,
    title: '4-Bit Carry-Select Adder',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['adder', 'carry-select', 'speculation'],
    moduleName: 'carry_select4',
    statement:
      `Compute the sum twice, speculatively, and pick the right one.\n\n` +
      `Evaluate \`a + b\` assuming the carry in is 0, and again assuming it is 1. Both run in parallel without waiting for the real \`cin\`. When \`cin\` finally arrives, use it to select which pair of results to drive onto \`sum\` and \`cout\`.`,
    context:
      `This is speculation in hardware: trade area for latency by computing every possibility ahead of time and muxing at the end. Wide adders split into blocks that all speculate simultaneously, so only the final mux chain is serial.`,
    hint: 'Two adders into two 5-bit wires, then one mux on `cin`.',
    inputs: [
      { name: 'a', width: 4 }, { name: 'b', width: 4 },
      { name: 'cin', width: 1 },
    ],
    outputs: [{ name: 'sum', width: 4 }, { name: 'cout', width: 1 }],
    constraints: [
      'Module name must be `carry_select4`',
      'Compute both carry-in cases and select between them',
      'Purely combinational',
    ],
    examples: [
      { in: { a: 3, b: 4, cin: 0 }, out: { sum: 7, cout: 0 } },
      { in: { a: 3, b: 4, cin: 1 }, out: { sum: 8, cout: 0 } },
      { in: { a: 9, b: 8, cin: 0 }, out: { sum: 1, cout: 1 } },
      { in: { a: 9, b: 8, cin: 1 }, out: { sum: 2, cout: 1 } },
    ],
    starter: `module carry_select4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  // Compute both possibilities in parallel, then select on cin.

endmodule`,
    solution: `module carry_select4(
  input  [3:0] a,
  input  [3:0] b,
  input        cin,
  output [3:0] sum,
  output       cout
);
  wire [4:0] r0 = a + b;          // speculative: cin = 0
  wire [4:0] r1 = a + b + 5'd1;   // speculative: cin = 1

  wire [4:0] chosen = cin ? r1 : r0;

  assign sum  = chosen[3:0];
  assign cout = chosen[4];
endmodule`,
    editorial:
      `The two adders start the instant \`a\` and \`b\` are stable, so the only thing on \`cin\`'s path is a single mux. In a block-partitioned adder that turns the carry chain into one mux per block rather than one full-adder delay per bit.\n\n` +
      `The price is roughly double the adder area per block. That trade is why carry-select tends to appear in the upper blocks of a wide adder — where the carry arrives latest — while the lowest block, whose carry-in is known immediately, stays a plain ripple adder.\n\n` +
      `Yosys will notice \`a + b\` and \`a + b + 1\` share structure and merge what it can, so the synthesized netlist may be smaller than the source suggests.`,
  },

  {
    id: 'a-addsub-flags',
    number: 61,
    title: 'Adder / Subtractor with Overflow',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['adder', 'twos-complement', 'overflow', 'flags'],
    moduleName: 'addsub8',
    statement:
      `One datapath that both adds and subtracts, with correct flags for each.\n\n` +
      `When \`sub\` is 0 compute \`a + b\`; when it is 1 compute \`a - b\`. Alongside the 8-bit \`result\`, drive:\n\n` +
      `\`carry\` — the carry out of the top bit (an unsigned overflow indicator).\n` +
      `\`overflow\` — signed two's-complement overflow: the true signed result did not fit in 8 bits.\n` +
      `\`zero\` — the result is all zeros.\n` +
      `\`negative\` — bit 7 of the result.`,
    context:
      `This is the core of an ALU's flag logic, and the carry-versus-overflow distinction is one of the most-asked interview questions. Carry means the *unsigned* result wrapped; overflow means the *signed* result wrapped. They are independent, and the same addition can set either, both, or neither.`,
    hint:
      'Invert `b` and set the carry in when subtracting: `a + (b ^ {8{sub}}) + sub`. Signed overflow happens when the two operands (after that conditional inversion) share a sign and the result differs from it.',
    inputs: [
      { name: 'a', width: 8, signed: true },
      { name: 'b', width: 8, signed: true },
      { name: 'sub', width: 1, note: '0 = add, 1 = subtract' },
    ],
    outputs: [
      { name: 'result', width: 8, signed: true },
      { name: 'carry', width: 1, note: 'unsigned carry/borrow out' },
      { name: 'overflow', width: 1, note: 'signed overflow' },
      { name: 'zero', width: 1 },
      { name: 'negative', width: 1 },
    ],
    constraints: [
      'Module name must be `addsub8`',
      'Use a single adder with conditional inversion — not two separate datapaths',
      'Purely combinational',
    ],
    examples: [
      { in: { a: '8\'h50', b: '8\'h30', sub: 0 }, out: { result: '8\'h80', carry: 0, overflow: 1, zero: 0, negative: 1 }, note: '80 + 48 = 128, past the signed max' },
      { in: { a: '8\'h50', b: '8\'h30', sub: 1 }, out: { result: '8\'h20', carry: 1, overflow: 0, zero: 0, negative: 0 } },
      { in: { a: '8\'h7F', b: '8\'h01', sub: 0 }, out: { result: '8\'h80', carry: 0, overflow: 1, zero: 0, negative: 1 } },
      { in: { a: '8\'h05', b: '8\'h05', sub: 1 }, out: { result: '8\'h00', carry: 1, overflow: 0, zero: 1, negative: 0 } },
    ],
    stimulus: { mode: 'vectors', vectors: 400 },
    starter: `module addsub8(
  input  [7:0] a,
  input  [7:0] b,
  input        sub,
  output [7:0] result,
  output       carry,
  output       overflow,
  output       zero,
  output       negative
);
  // Conditionally invert b and feed sub in as the carry in.

endmodule`,
    solution: `module addsub8(
  input  [7:0] a,
  input  [7:0] b,
  input        sub,
  output [7:0] result,
  output       carry,
  output       overflow,
  output       zero,
  output       negative
);
  // Subtracting is adding the two's complement: invert b, carry in 1.
  wire [7:0] bx = b ^ {8{sub}};
  wire [8:0] full = {1'b0, a} + {1'b0, bx} + {8'b0, sub};

  assign result   = full[7:0];
  assign carry    = full[8];
  // Signed overflow: operands agreed in sign but the result disagrees.
  assign overflow = (a[7] == bx[7]) && (result[7] != a[7]);
  assign zero     = ~|result;
  assign negative = result[7];
endmodule`,
    editorial:
      `The conditional inversion is the whole design. \`b ^ {8{sub}}\` passes \`b\` through when adding and complements it when subtracting; feeding \`sub\` into the carry in completes the two's complement. One adder, one XOR row, both operations.\n\n` +
      `On the two flags, which is the part worth memorizing: **carry** is bit 8 of the unsigned sum — it means the result did not fit in 8 *unsigned* bits. **Overflow** means it did not fit in 8 *signed* bits, and can only happen when both operands have the same sign and the result comes out with the opposite one. Adding numbers of opposite signs can never overflow.\n\n` +
      `Look at the first example: 0x50 + 0x30 = 0x80. No carry out, so unsigned arithmetic is perfectly happy with 128. But as signed values that is 80 + 48 = 128, which exceeds the signed maximum of 127, so the result reads as -128 and overflow is set. Same bits, different interpretation — which is exactly why processors keep both flags and let the compiler choose which branch instruction to use.\n\n` +
      `For subtraction, \`carry\` acts as a *borrow-not*: it is 1 when no borrow was needed, i.e. when \`a >= b\` unsigned. Some architectures invert this convention, so always check the reference manual before porting flag logic.`,
  },

  {
    id: 'a-comparator',
    number: 62,
    title: 'Signed and Unsigned Comparator',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['comparator', 'signed', 'branch'],
    moduleName: 'comparator8',
    statement:
      `Compare two 8-bit values under either interpretation.\n\n` +
      `When \`is_signed\` is 0, treat \`a\` and \`b\` as plain unsigned numbers. When it is 1, treat them as two's-complement signed values. Drive exactly one of \`lt\`, \`eq\`, \`gt\` high in every case.`,
    context:
      `A branch unit needs both interpretations — RISC-V has BLT and BLTU, x86 has JL and JB — because 0xFF is 255 unsigned but -1 signed. Getting this wrong produces bugs that only appear on large or negative values.`,
    hint:
      'Equality is the same either way. For the ordering, `$signed(a) < $signed(b)` gives the signed comparison; select between it and the unsigned one.',
    inputs: [
      { name: 'a', width: 8 }, { name: 'b', width: 8 },
      { name: 'is_signed', width: 1, note: '1 selects two\'s-complement comparison' },
    ],
    outputs: [
      { name: 'lt', width: 1, note: 'a < b' },
      { name: 'eq', width: 1, note: 'a == b' },
      { name: 'gt', width: 1, note: 'a > b' },
    ],
    constraints: [
      'Module name must be `comparator8`',
      'Exactly one output is high for any input',
      'Purely combinational',
    ],
    examples: [
      { in: { a: '8\'h50', b: '8\'h50', is_signed: 0 }, out: { lt: 0, eq: 1, gt: 0 } },
      { in: { a: '8\'h10', b: '8\'h50', is_signed: 0 }, out: { lt: 1, eq: 0, gt: 0 } },
      { in: { a: '8\'hFF', b: '8\'h01', is_signed: 0 }, out: { lt: 0, eq: 0, gt: 1 }, note: '255 > 1' },
      { in: { a: '8\'hFF', b: '8\'h01', is_signed: 1 }, out: { lt: 1, eq: 0, gt: 0 }, note: '-1 < 1' },
    ],
    stimulus: { mode: 'vectors', vectors: 400 },
    starter: `module comparator8(
  input  [7:0] a,
  input  [7:0] b,
  input        is_signed,
  output       lt,
  output       eq,
  output       gt
);
  // Equality is interpretation-independent; ordering is not.

endmodule`,
    solution: `module comparator8(
  input  [7:0] a,
  input  [7:0] b,
  input        is_signed,
  output       lt,
  output       eq,
  output       gt
);
  wire lt_u = (a < b);
  wire lt_s = ($signed(a) < $signed(b));

  assign eq = (a == b);
  assign lt = is_signed ? lt_s : lt_u;
  assign gt = ~eq & ~lt;
endmodule`,
    editorial:
      `Deriving \`gt\` as "neither equal nor less than" guarantees the three outputs stay mutually exclusive and collectively exhaustive by construction — there is no input for which two could fire or none could.\n\n` +
      `\`$signed()\` is a cast, not a conversion: it does not change any bits, only how the comparison operator reads the top one. That is why the same 0xFF compares as 255 in one branch and -1 in the other.\n\n` +
      `In hardware both comparisons share almost everything — a signed comparison is the unsigned one with the two sign bits swapped before the compare — so synthesis builds one subtractor and a little polarity logic rather than two full comparators.`,
  },

  {
    id: 'a-range-check',
    number: 63,
    title: 'Range Window Detector',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['comparator', 'address-decode'],
    moduleName: 'range_check8',
    statement:
      `Decide where a value falls relative to an inclusive window.\n\n` +
      `Given \`value\`, \`lo\` and \`hi\` as unsigned numbers, drive exactly one of: \`in_range\` when \`lo <= value <= hi\`, \`below\` when \`value < lo\`, and \`above\` when \`value > hi\`.\n\n` +
      `Both endpoints count as inside the window.`,
    context:
      `Memory-mapped I/O decoding is exactly this: each peripheral owns an address window and asserts its chip select when the incoming address lands inside it. Sensor limit alarms and packet classifiers use the same block.`,
    hint: 'Three comparisons. Derive `in_range` from the other two so the outputs cannot disagree.',
    inputs: [
      { name: 'value', width: 8 },
      { name: 'lo', width: 8, note: 'window start, inclusive' },
      { name: 'hi', width: 8, note: 'window end, inclusive' },
    ],
    outputs: [
      { name: 'in_range', width: 1 },
      { name: 'below', width: 1 },
      { name: 'above', width: 1 },
    ],
    constraints: [
      'Module name must be `range_check8`',
      'The window is inclusive at both ends',
      'Purely combinational',
    ],
    examples: [
      { in: { value: '8\'h50', lo: '8\'h10', hi: '8\'h80' }, out: { in_range: 1, below: 0, above: 0 } },
      { in: { value: '8\'h05', lo: '8\'h10', hi: '8\'h80' }, out: { in_range: 0, below: 1, above: 0 } },
      { in: { value: '8\'h90', lo: '8\'h10', hi: '8\'h80' }, out: { in_range: 0, below: 0, above: 1 } },
      { in: { value: '8\'h10', lo: '8\'h10', hi: '8\'h80' }, out: { in_range: 1, below: 0, above: 0 }, note: 'endpoint is inside' },
    ],
    stimulus: { mode: 'vectors', vectors: 400 },
    starter: `module range_check8(
  input  [7:0] value,
  input  [7:0] lo,
  input  [7:0] hi,
  output       in_range,
  output       below,
  output       above
);
  // Inclusive window. Exactly one output high.

endmodule`,
    solution: `module range_check8(
  input  [7:0] value,
  input  [7:0] lo,
  input  [7:0] hi,
  output       in_range,
  output       below,
  output       above
);
  assign below    = (value < lo);
  assign above    = (value > hi);
  assign in_range = ~below & ~above;
endmodule`,
    editorial:
      `Deriving \`in_range\` rather than writing \`(value >= lo) && (value <= hi)\` reuses the two comparators already present, so the block costs two comparisons instead of four.\n\n` +
      `If \`lo > hi\` the window is empty and every value reports both below and above — which the derived \`in_range\` handles correctly by going low. Worth noting because the "exactly one output" property quietly depends on the endpoints being sane.\n\n` +
      `Real address decoders avoid comparators entirely: they align windows to power-of-two sizes so the test becomes a masked equality on the upper address bits, which is far cheaper.`,
  },

  {
    id: 'a-bin2gray',
    number: 64,
    title: 'Binary to Gray Code',
    track: 'arithmetic',
    difficulty: 'Easy',
    tags: ['gray-code', 'cdc', 'encoding'],
    moduleName: 'bin2gray4',
    statement:
      `Convert a 4-bit binary value into Gray code.\n\n` +
      `The top bit is unchanged, and every lower bit is the XOR of the binary bit at that position with the one above it. Consecutive values then differ in exactly one bit.`,
    context:
      `Asynchronous FIFOs send their pointers across clock domains in Gray code. A binary counter can change several bits at once (0111 to 1000 flips four), and a receiving flip-flop sampling mid-transition could latch a value that never existed. Gray code makes that impossible — only one bit is ever in flight.`,
    hint: 'The whole conversion is `bin ^ (bin >> 1)`.',
    inputs: [{ name: 'bin', width: 4 }],
    outputs: [{ name: 'gray', width: 4 }],
    constraints: ['Module name must be `bin2gray4`', 'Purely combinational'],
    examples: [
      { in: { bin: 0 }, out: { gray: 0 } },
      { in: { bin: 7 }, out: { gray: 4 } },
      { in: { bin: 8 }, out: { gray: 12 } },
      { in: { bin: 15 }, out: { gray: 8 } },
    ],
    starter: `module bin2gray4(
  input  [3:0] bin,
  output [3:0] gray
);
  // One XOR against the value shifted down by one.

endmodule`,
    solution: `module bin2gray4(
  input  [3:0] bin,
  output [3:0] gray
);
  assign gray = bin ^ (bin >> 1);
endmodule`,
    editorial:
      `Three XOR gates, no carry chain, constant delay at any width — which is why the conversion is cheap enough to sit directly on a pointer's output path.\n\n` +
      `The shift is by a constant, so it is pure rewiring; the top bit XORs against a shifted-in 0 and therefore passes through unchanged, exactly as the definition requires.\n\n` +
      `Worth knowing: this single-bit-change property only holds across the full power-of-two wrap. A Gray counter with a non-power-of-two modulus breaks it at the wrap point, which is why asynchronous FIFOs are almost always power-of-two deep.`,
  },

  {
    id: 'a-gray2bin',
    number: 65,
    title: 'Gray Code to Binary',
    track: 'arithmetic',
    difficulty: 'Medium',
    tags: ['gray-code', 'cdc', 'encoding', 'prefix-xor'],
    moduleName: 'gray2bin4',
    statement:
      `Convert 4-bit Gray code back to binary — the inverse of the previous problem.\n\n` +
      `The top bit passes through unchanged. Every lower binary bit is the XOR of the Gray bit at that position with the binary bit *just above it*, so the computation cascades downward.`,
    context:
      `Once a Gray-coded FIFO pointer has crossed into the destination clock domain it has to become binary again before you can do arithmetic on it — subtracting pointers to compute occupancy, or comparing them for full and empty.`,
    hint:
      'Each output bit is the XOR of all Gray bits from the top down to that position — a prefix XOR. Note the dependency runs on the binary result, not on the Gray input.',
    inputs: [{ name: 'gray', width: 4 }],
    outputs: [{ name: 'bin', width: 4 }],
    constraints: ['Module name must be `gray2bin4`', 'Purely combinational'],
    examples: [
      { in: { gray: 0 }, out: { bin: 0 } },
      { in: { gray: 4 }, out: { bin: 7 } },
      { in: { gray: 12 }, out: { bin: 8 } },
      { in: { gray: 8 }, out: { bin: 15 } },
    ],
    starter: `module gray2bin4(
  input  [3:0] gray,
  output [3:0] bin
);
  // bin[3] = gray[3]; each lower bit XORs the gray bit with the binary bit above.

endmodule`,
    solution: `module gray2bin4(
  input  [3:0] gray,
  output [3:0] bin
);
  assign bin[3] = gray[3];
  assign bin[2] = gray[2] ^ bin[3];
  assign bin[1] = gray[1] ^ bin[2];
  assign bin[0] = gray[0] ^ bin[1];
endmodule`,
    editorial:
      `Note the asymmetry with the forward conversion. Binary-to-Gray is one parallel XOR at any width; Gray-to-binary is a *cascade*, because each bit needs the result of the bit above it. Expanded, \`bin[0]\` is the XOR of all four Gray bits.\n\n` +
      `Written as a chain the delay grows linearly with width. Since it is a prefix-XOR, it can instead be built as a Kogge-Stone style tree with log₂(width) depth — the same restructuring used for fast adder carry chains. At 4 bits nobody cares; at 32 bits on a fast clock, it matters.\n\n` +
      `Assigning individual bits of a wire in separate statements is legal and common for this pattern. Synthesis flattens the whole thing into an XOR cone regardless of how you wrote it.`,
  },

  {
    id: 'a-alu8',
    number: 67,
    title: '8-Bit ALU with Flags',
    track: 'arithmetic',
    difficulty: 'Hard',
    tags: ['alu', 'datapath', 'case', 'flags'],
    moduleName: 'alu8',
    statement:
      `Build a small ALU with eight operations selected by \`op\`:\n\n` +
      `0 — ADD (\`a + b\`)\n1 — SUB (\`a - b\`)\n2 — AND\n3 — OR\n4 — XOR\n5 — shift left by \`b[2:0]\`\n6 — shift right logical by \`b[2:0]\`\n7 — SLT: set \`result\` to 1 when \`a < b\` as signed values, else 0\n\n` +
      `Alongside \`result\`, drive \`zero\` (result is all zeros) and \`carry\`. \`carry\` is meaningful only for ADD and SUB — the carry out of the adder — and must read 0 for every other operation.`,
    context:
      `This is a teaching-scale version of the block at the centre of any processor. The interesting engineering is not the operations themselves but that they all share one result mux and one flag path, so the slowest operation sets the cycle time for all of them.`,
    hint:
      'Compute the add/sub in a 9-bit wire so the carry is available, then select `result` in a `case`. Drive `carry` to 0 in the non-arithmetic branches.',
    inputs: [
      { name: 'a', width: 8, signed: true },
      { name: 'b', width: 8, signed: true },
      { name: 'op', width: 3, note: 'operation select' },
    ],
    outputs: [
      { name: 'result', width: 8 },
      { name: 'zero', width: 1 },
      { name: 'carry', width: 1, note: 'valid for ADD and SUB only' },
    ],
    constraints: [
      'Module name must be `alu8`',
      'Cover all eight opcodes — no inferred latch',
      '`carry` must be 0 for logical, shift and SLT operations',
      'Purely combinational',
    ],
    examples: [
      { in: { a: '8\'h0F', b: '8\'h01', op: 0 }, out: { result: '8\'h10', zero: 0, carry: 0 } },
      { in: { a: '8\'h05', b: '8\'h05', op: 1 }, out: { result: '8\'h00', zero: 1, carry: 1 } },
      { in: { a: '8\'hF0', b: '8\'h3C', op: 2 }, out: { result: '8\'h30', zero: 0, carry: 0 } },
      { in: { a: '8\'h01', b: '8\'h03', op: 5 }, out: { result: '8\'h08', zero: 0, carry: 0 } },
      { in: { a: '8\'hFF', b: '8\'h01', op: 7 }, out: { result: '8\'h01', zero: 0, carry: 0 }, note: '-1 < 1 signed' },
    ],
    stimulus: { mode: 'vectors', vectors: 500 },
    starter: `module alu8(
  input  [7:0] a,
  input  [7:0] b,
  input  [2:0] op,
  output reg [7:0] result,
  output           zero,
  output reg       carry
);
  always @(*) begin
    // Assign result and carry on every branch.
  end
endmodule`,
    solution: `module alu8(
  input  [7:0] a,
  input  [7:0] b,
  input  [2:0] op,
  output reg [7:0] result,
  output           zero,
  output reg       carry
);
  // One shared adder: subtract by inverting b and carrying in.
  wire        do_sub = (op == 3'd1);
  wire [7:0]  bx     = b ^ {8{do_sub}};
  wire [8:0]  sum    = {1'b0, a} + {1'b0, bx} + {8'b0, do_sub};

  always @(*) begin
    carry = 1'b0;
    case (op)
      3'd0: begin result = sum[7:0]; carry = sum[8]; end
      3'd1: begin result = sum[7:0]; carry = sum[8]; end
      3'd2:       result = a & b;
      3'd3:       result = a | b;
      3'd4:       result = a ^ b;
      3'd5:       result = a << b[2:0];
      3'd6:       result = a >> b[2:0];
      3'd7:       result = ($signed(a) < $signed(b)) ? 8'd1 : 8'd0;
      default:    result = 8'd0;
    endcase
  end

  assign zero = ~|result;
endmodule`,
    editorial:
      `Assigning \`carry = 1'b0\` before the \`case\` is the key defensive move. Every branch then either leaves it at zero or overrides it, so \`carry\` is driven on all paths and no latch can be inferred — without needing a \`carry = …\` line in all eight branches.\n\n` +
      `ADD and SUB share one adder through the conditional-inversion trick from problem 61. Building two separate adders would roughly double the arithmetic area for no benefit, and the adder is already the largest and slowest block here.\n\n` +
      `\`zero\` is derived from \`result\` after the mux rather than computed per operation. That puts a NOR reduction *after* the result mux, which lengthens the critical path — a real design would often register the flags instead, accepting a cycle of latency to keep the clock fast.\n\n` +
      `Interview follow-up: which operation sets the cycle time? Almost always ADD/SUB, because the carry has to traverse the full width while the logical ops are a single gate. That is why processor ALUs get elaborate fast adders and plain AND gates.`,
  },
];
