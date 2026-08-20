/**
 * Track 2 — Combinational Blocks.
 *
 * Data movement rather than arithmetic: selection, decoding, encoding, shifting
 * and rewiring. Several of these have input spaces far too large to enumerate,
 * so they are graded on corner values plus seeded random vectors.
 */
import type { VProblemV2 } from '../types';

export const COMBINATIONAL_PROBLEMS: VProblemV2[] = [
  {
    id: 'c-mux2-bus',
    number: 34,
    title: '8-Bit 2-to-1 Multiplexer',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['mux', 'vectors', 'selection'],
    moduleName: 'mux2_bus8',
    statement:
      `Select between two 8-bit buses.\n\n` +
      `When \`sel\` is 0, \`y\` carries \`a\`. When \`sel\` is 1, \`y\` carries \`b\`. All eight bits switch together.`,
    context:
      `Widen the single-bit mux and you have the workhorse of every datapath: operand selection into an ALU, the write-back source in a register file, the forwarding path in a pipeline. One select line drives all lanes, which is why its fan-out and buffering matter.`,
    hint: 'The conditional operator works on whole vectors: `sel ? b : a`.',
    inputs: [
      { name: 'a', width: 8, note: 'selected when sel is 0' },
      { name: 'b', width: 8, note: 'selected when sel is 1' },
      { name: 'sel', width: 1 },
    ],
    outputs: [{ name: 'y', width: 8 }],
    constraints: ['Module name must be `mux2_bus8`', 'Purely combinational'],
    examples: [
      { in: { a: '8\'hAA', b: '8\'h55', sel: 0 }, out: { y: '8\'hAA' } },
      { in: { a: '8\'hAA', b: '8\'h55', sel: 1 }, out: { y: '8\'h55' } },
    ],
    stimulus: { mode: 'vectors', vectors: 200 },
    starter: `module mux2_bus8(
  input  [7:0] a,
  input  [7:0] b,
  input        sel,
  output [7:0] y
);
  // One select line, eight bits of data.

endmodule`,
    solution: `module mux2_bus8(
  input  [7:0] a,
  input  [7:0] b,
  input        sel,
  output [7:0] y
);
  assign y = sel ? b : a;
endmodule`,
    editorial:
      `Written this way the mux is one line regardless of width, and it stays correct if the ports are later parameterized. The synthesized result is eight 2-input muxes sharing a select net.\n\n` +
      `That shared net is the interesting part physically: with a wide bus the select line drives many loads and usually needs buffering, so tools clone or buffer it automatically. Problem 40 in this track makes that fan-out explicit.`,
  },

  {
    id: 'c-mux4-bus',
    number: 35,
    title: '4-to-1 Multiplexer with a Case Statement',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['mux', 'case', 'always_comb'],
    moduleName: 'mux4_bus8',
    statement:
      `Route one of four 8-bit inputs to the output, chosen by a 2-bit select.\n\n` +
      `\`sel\` = 0 picks \`in0\`, 1 picks \`in1\`, 2 picks \`in2\`, 3 picks \`in3\`. Every select value is covered, so the output is always defined.`,
    context:
      `Wider muxes are how a processor picks among several forwarding sources or how a router picks an output port. Writing one as a `
      + `case statement rather than nested conditionals keeps the intent — and the fact that all cases are covered — obvious to both readers and the synthesis tool.`,
    hint:
      'Use `always @(*)` with a `case (sel)`, assigning `y` in every branch. Add a `default` so no latch can be inferred. `y` must be declared `reg`.',
    inputs: [
      { name: 'in0', width: 8 }, { name: 'in1', width: 8 },
      { name: 'in2', width: 8 }, { name: 'in3', width: 8 },
      { name: 'sel', width: 2 },
    ],
    outputs: [{ name: 'y', width: 8 }],
    constraints: [
      'Module name must be `mux4_bus8`',
      'Cover every value of `sel` — no inferred latch',
      'Purely combinational',
    ],
    examples: [
      { in: { in0: '8\'h11', in1: '8\'h22', in2: '8\'h33', in3: '8\'h44', sel: 0 }, out: { y: '8\'h11' } },
      { in: { in0: '8\'h11', in1: '8\'h22', in2: '8\'h33', in3: '8\'h44', sel: 2 }, out: { y: '8\'h33' } },
      { in: { in0: '8\'h11', in1: '8\'h22', in2: '8\'h33', in3: '8\'h44', sel: 3 }, out: { y: '8\'h44' } },
    ],
    stimulus: { mode: 'vectors', vectors: 240 },
    starter: `module mux4_bus8(
  input  [7:0] in0,
  input  [7:0] in1,
  input  [7:0] in2,
  input  [7:0] in3,
  input  [1:0] sel,
  output reg [7:0] y
);
  always @(*) begin
    // case (sel) ... endcase  — cover every branch.
  end
endmodule`,
    solution: `module mux4_bus8(
  input  [7:0] in0,
  input  [7:0] in1,
  input  [7:0] in2,
  input  [7:0] in3,
  input  [1:0] sel,
  output reg [7:0] y
);
  always @(*) begin
    case (sel)
      2'b00:   y = in0;
      2'b01:   y = in1;
      2'b10:   y = in2;
      2'b11:   y = in3;
      default: y = in0;
    endcase
  end
endmodule`,
    editorial:
      `The \`default\` is redundant here — a 2-bit select really does have only four values — but it costs nothing and it is the habit that saves you when the select is later widened or when the case items are localparams that do not cover the full space.\n\n` +
      `Leave any branch unassigned and the tool must hold the previous value, which means a transparent latch. That is almost never what you wanted, and it turns a combinational block into a timing problem.`,
  },

  {
    id: 'c-decoder38',
    number: 36,
    title: '3-to-8 Decoder with Enable',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['decoder', 'one-hot', 'shift'],
    moduleName: 'decoder_3to8',
    statement:
      `Turn a 3-bit address into a one-hot select bus.\n\n` +
      `When \`en\` is high, exactly one bit of \`y\` is set — the one whose index equals \`addr\`. When \`en\` is low, every bit of \`y\` is 0.`,
    context:
      `Decoders sit in front of every memory array and register file, converting an address into the single word line or chip select that should activate. The enable is what lets you build a bigger decoder out of smaller ones.`,
    hint: 'Shifting is the compact form: `1 << addr`, gated by the enable.',
    inputs: [
      { name: 'addr', width: 3, note: 'which output to assert' },
      { name: 'en', width: 1, note: 'low forces all outputs to 0' },
    ],
    outputs: [{ name: 'y', width: 8, note: 'one-hot when enabled' }],
    constraints: ['Module name must be `decoder_3to8`', 'Purely combinational'],
    examples: [
      { in: { addr: 0, en: 0 }, out: { y: '8\'h00' } },
      { in: { addr: 0, en: 1 }, out: { y: '8\'h01' } },
      { in: { addr: 3, en: 1 }, out: { y: '8\'h08' } },
      { in: { addr: 7, en: 1 }, out: { y: '8\'h80' } },
    ],
    starter: `module decoder_3to8(
  input  [2:0] addr,
  input        en,
  output [7:0] y
);
  // Exactly one hot bit when enabled, all zeros otherwise.

endmodule`,
    solution: `module decoder_3to8(
  input  [2:0] addr,
  input        en,
  output [7:0] y
);
  assign y = en ? (8'b1 << addr) : 8'b0;
endmodule`,
    editorial:
      `\`8'b1 << addr\` gives the shifter its result width from the left operand, so the 1 is already 8 bits wide and nothing is truncated. Writing \`1 << addr\` relies on the 32-bit integer default and then narrows — same answer here, but the habit breaks on wider decoders.\n\n` +
      `Synthesis does not build an actual barrel shifter for this: with a constant left operand it collapses to eight AND terms, one per output, which is the classic decoder structure.`,
  },

  {
    id: 'c-prio-encoder',
    number: 37,
    title: '8-to-3 Priority Encoder',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['encoder', 'priority', 'casez'],
    moduleName: 'prio_encoder8',
    statement:
      `Report the index of the highest set bit in an 8-bit request bus.\n\n` +
      `\`idx\` is the position of the most significant bit of \`req\` that is high, and \`valid\` is high whenever any request is present. When \`req\` is entirely zero, \`valid\` is low and \`idx\` is 0.\n\n` +
      `Several requests may be asserted at once — bit 7 outranks bit 6, and so on down.`,
    context:
      `This is an interrupt controller in miniature: many sources assert at once and the hardware must pick exactly one to service. The same block picks the winning grant in a fixed-priority bus arbiter.`,
    hint:
      'A `casez` over `req` with `?` wildcards reads exactly like the priority table: `8\'b1???_????` first, then `8\'b01??_????`, and so on.',
    inputs: [{ name: 'req', width: 8, note: 'bit 7 is highest priority' }],
    outputs: [
      { name: 'idx', width: 3, note: 'index of the highest set bit' },
      { name: 'valid', width: 1, note: 'high when req is non-zero' },
    ],
    constraints: [
      'Module name must be `prio_encoder8`',
      'Bit 7 has the highest priority, bit 0 the lowest',
      'When `req` is zero: `valid` = 0 and `idx` = 0',
    ],
    examples: [
      { in: { req: '8\'h00' }, out: { idx: 0, valid: 0 } },
      { in: { req: '8\'h01' }, out: { idx: 0, valid: 1 } },
      { in: { req: '8\'h0A' }, out: { idx: 3, valid: 1 }, note: 'bits 1 and 3 set — 3 wins' },
      { in: { req: '8\'hFF' }, out: { idx: 7, valid: 1 } },
    ],
    starter: `module prio_encoder8(
  input  [7:0] req,
  output reg [2:0] idx,
  output reg       valid
);
  always @(*) begin
    // Highest set bit wins. Do not forget the all-zero case.
  end
endmodule`,
    solution: `module prio_encoder8(
  input  [7:0] req,
  output reg [2:0] idx,
  output reg       valid
);
  always @(*) begin
    valid = |req;
    casez (req)
      8'b1???????: idx = 3'd7;
      8'b01??????: idx = 3'd6;
      8'b001?????: idx = 3'd5;
      8'b0001????: idx = 3'd4;
      8'b00001???: idx = 3'd3;
      8'b000001??: idx = 3'd2;
      8'b0000001?: idx = 3'd1;
      8'b00000001: idx = 3'd0;
      default:     idx = 3'd0;
    endcase
  end
endmodule`,
    editorial:
      `Assigning \`valid\` unconditionally before the \`casez\` guarantees it is driven on every path, so no latch can creep in no matter which branch runs.\n\n` +
      `\`casez\` treats \`?\` as don't-care, which is what makes the priority explicit: the first matching pattern wins, and the patterns are written most-significant-first. Beware \`casex\` — it treats x in the *input* as a wildcard too, which can mask real bugs in simulation. Prefer \`casez\`.\n\n` +
      `A common follow-up: a priority encoder's delay grows linearly with width if written as a chain. Wide ones (32/64 bit) are built as a tree instead, which is why leading-zero counters get their own dedicated structures.`,
  },

  {
    id: 'c-onehot-check',
    number: 38,
    title: 'One-Hot Validator',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['one-hot', 'error-detection', 'popcount'],
    moduleName: 'onehot_check',
    statement:
      `Decide whether an 8-bit bus is a legal one-hot code — exactly one bit set.\n\n` +
      `Set \`is_onehot\` when precisely one bit of \`code\` is high. Set \`is_zero\` when no bits are high. Both are low when two or more bits are set.`,
    context:
      `One-hot state registers and one-hot grant buses are only valid with a single bit asserted. A soft error or a bug in the granting logic can produce two, and downstream decode logic will happily activate two things at once — so safety-critical designs check the invariant in hardware rather than assuming it.`,
    hint:
      'The classic trick: `code & (code - 1)` clears the lowest set bit. If the result is zero, there was at most one bit set.',
    inputs: [{ name: 'code', width: 8, note: 'candidate one-hot value' }],
    outputs: [
      { name: 'is_onehot', width: 1, note: 'exactly one bit set' },
      { name: 'is_zero', width: 1, note: 'no bits set' },
    ],
    constraints: ['Module name must be `onehot_check`', 'Purely combinational'],
    examples: [
      { in: { code: '8\'h00' }, out: { is_onehot: 0, is_zero: 1 } },
      { in: { code: '8\'h08' }, out: { is_onehot: 1, is_zero: 0 } },
      { in: { code: '8\'h09' }, out: { is_onehot: 0, is_zero: 0 }, note: 'two bits set' },
      { in: { code: '8\'hFF' }, out: { is_onehot: 0, is_zero: 0 } },
    ],
    starter: `module onehot_check(
  input  [7:0] code,
  output       is_onehot,
  output       is_zero
);
  // At most one bit set: code & (code - 1) == 0.

endmodule`,
    solution: `module onehot_check(
  input  [7:0] code,
  output       is_onehot,
  output       is_zero
);
  wire none    = ~|code;
  wire at_most = ((code & (code - 8'b1)) == 8'b0);

  assign is_zero   = none;
  assign is_onehot = at_most & ~none;
endmodule`,
    editorial:
      `\`code & (code - 1)\` works because subtracting one flips the lowest set bit to 0 and turns everything below it into 1s; ANDing with the original therefore clears exactly that bit. If nothing remains, there was at most one bit to begin with — hence the separate zero test to distinguish "one" from "none".\n\n` +
      `The alternative is a full population count compared against 1, which is a much larger circuit. For a validity check you only ever need "is popcount ≤ 1", and that is a subtractor plus an AND.`,
  },

  {
    id: 'c-fanout-gate',
    number: 40,
    title: 'Byte-Lane Gating with a Buffered Enable',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['fanout', 'masking', 'replication'],
    moduleName: 'lane_gate',
    statement:
      `Gate an 8-bit bus with a single global enable.\n\n` +
      `Each bit of \`y\` is the matching bit of \`data\` ANDed with \`en\`. When \`en\` is low the whole bus reads zero; when it is high the data passes untouched.`,
    context:
      `A chip-enable or a write-strobe has to reach every lane of a wide bus. Once that one net drives too many loads its edges slow down and timing closure suffers, so tools split it into buffered copies — the logical function stays identical, but the physical net does not.`,
    hint: 'Replicate the enable to the bus width and AND: `data & {8{en}}`.',
    inputs: [
      { name: 'data', width: 8 },
      { name: 'en', width: 1, note: 'global enable for every lane' },
    ],
    outputs: [{ name: 'y', width: 8 }],
    constraints: ['Module name must be `lane_gate`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'hFF', en: 0 }, out: { y: '8\'h00' } },
      { in: { data: '8\'hFF', en: 1 }, out: { y: '8\'hFF' } },
      { in: { data: '8\'hAA', en: 1 }, out: { y: '8\'hAA' } },
    ],
    starter: `module lane_gate(
  input  [7:0] data,
  input        en,
  output [7:0] y
);
  // Replicate en across the bus and mask.

endmodule`,
    solution: `module lane_gate(
  input  [7:0] data,
  input        en,
  output [7:0] y
);
  assign y = data & {8{en}};
endmodule`,
    editorial:
      `\`data & en\` without the replication would zero-extend \`en\` to 8 bits and gate only bit 0 — the single most common width bug in Verilog, and one that simulates without a murmur.\n\n` +
      `Do not hand-instantiate buffers to manage fan-out in RTL. Buffer insertion and net splitting belong to synthesis and place-and-route, which know the actual load; RTL buffers just get optimized away or, worse, block the tool from doing a better job.`,
  },

  {
    id: 'c-bit-reverse',
    number: 41,
    title: 'Reverse the Bit Order',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['vectors', 'rewiring', 'generate'],
    moduleName: 'bit_reverse8',
    statement:
      `Mirror an 8-bit bus end for end.\n\n` +
      `Bit 0 of \`data\` becomes bit 7 of \`y\`, bit 1 becomes bit 6, and so on down to bit 7 becoming bit 0.`,
    context:
      `Serial protocols disagree about which end of a byte goes first — SPI can be configured either way, and many CRC engines are specified LSB-first while the datapath around them is MSB-first. Reversal is pure rewiring, so it costs no gates at all.`,
    hint:
      'You can write it as a concatenation of individual bits, or use a `generate` loop for something that scales.',
    inputs: [{ name: 'data', width: 8 }],
    outputs: [{ name: 'y', width: 8, note: 'data with bit order mirrored' }],
    constraints: ['Module name must be `bit_reverse8`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'b00000001' }, out: { y: '8\'b10000000' } },
      { in: { data: '8\'b11000000' }, out: { y: '8\'b00000011' } },
      { in: { data: '8\'hFF' }, out: { y: '8\'hFF' } },
    ],
    starter: `module bit_reverse8(
  input  [7:0] data,
  output [7:0] y
);
  // Mirror the bus. A concatenation or a generate loop both work.

endmodule`,
    solution: `module bit_reverse8(
  input  [7:0] data,
  output [7:0] y
);
  genvar i;
  generate
    for (i = 0; i < 8; i = i + 1) begin : rev
      assign y[i] = data[7 - i];
    end
  endgenerate
endmodule`,
    editorial:
      `This synthesizes to nothing — no cells at all, just a permutation of net names. Place-and-route may still care, because crossing wires costs routing resources, but there is no logic delay.\n\n` +
      `The \`generate\` form scales to any width by changing one bound, whereas the concatenation \`{data[0], data[1], …}\` has to be rewritten by hand. Note the label \`: rev\` on the loop body — Verilog requires named generate blocks, and the name shows up in hierarchical paths during debug.`,
  },

  {
    id: 'c-byteswap',
    number: 42,
    title: 'Endianness Swap',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['vectors', 'endianness', 'concatenation'],
    moduleName: 'byteswap32',
    statement:
      `Reverse the byte order of a 32-bit word, leaving the bits inside each byte alone.\n\n` +
      `The least significant byte of \`data\` becomes the most significant byte of \`y\`, and so on. \`32'h1122_3344\` becomes \`32'h4433_2211\`.`,
    context:
      `Network protocols are big-endian and most processors are little-endian, so every NIC, PCIe bridge and protocol offload engine swaps bytes somewhere. Note the contrast with the previous problem — bytes move, bits within a byte do not.`,
    hint: 'Slice out the four bytes and concatenate them in reverse: `{data[7:0], data[15:8], …}`.',
    inputs: [{ name: 'data', width: 32 }],
    outputs: [{ name: 'y', width: 32, note: 'byte order reversed' }],
    constraints: ['Module name must be `byteswap32`', 'Purely combinational'],
    examples: [
      { in: { data: '32\'h11223344' }, out: { y: '32\'h44332211' } },
      { in: { data: '32\'h000000FF' }, out: { y: '32\'hFF000000' } },
      { in: { data: '32\'hDEADBEEF' }, out: { y: '32\'hEFBEADDE' } },
    ],
    stimulus: { mode: 'vectors', vectors: 120 },
    starter: `module byteswap32(
  input  [31:0] data,
  output [31:0] y
);
  // Four bytes, reversed order, bits within each byte untouched.

endmodule`,
    solution: `module byteswap32(
  input  [31:0] data,
  output [31:0] y
);
  assign y = { data[7:0], data[15:8], data[23:16], data[31:24] };
endmodule`,
    editorial:
      `The concatenation reads most-significant-first, so the byte you want at the top of the result goes first in the braces — which is why \`data[7:0]\` leads.\n\n` +
      `Like bit reversal this is free in gates. The reason it still shows up as a pipeline stage in fast designs is routing: moving 32 wires across a datapath has a real physical cost even when the logic is empty.`,
  },

  {
    id: 'c-sign-extend',
    number: 43,
    title: 'Sign Extension',
    track: 'combinational',
    difficulty: 'Easy',
    tags: ['vectors', 'signed', 'replication'],
    moduleName: 'sign_extend',
    statement:
      `Widen a signed 8-bit value to 16 bits, and the same value zero-extended, side by side.\n\n` +
      `\`sext\` must preserve the two's-complement value of \`data\`: copy bit 7 into every one of the eight new upper bits. \`zext\` simply pads with zeros.`,
    context:
      `Every load instruction makes this choice — a byte load is either LB (sign-extending) or LBU (zero-extending), and picking the wrong one silently turns -1 into 255. Immediate fields in instruction decoders face the identical decision.`,
    hint: 'Replicate the sign bit: `{{8{data[7]}}, data}`. Note the doubled braces.',
    inputs: [{ name: 'data', width: 8, signed: true, note: 'signed byte' }],
    outputs: [
      { name: 'sext', width: 16, signed: true, note: 'sign-extended to 16 bits' },
      { name: 'zext', width: 16, note: 'zero-extended to 16 bits' },
    ],
    constraints: ['Module name must be `sign_extend`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'h7F' }, out: { sext: '16\'h007F', zext: '16\'h007F' }, note: '+127, both agree' },
      { in: { data: '8\'hFF' }, out: { sext: '16\'hFFFF', zext: '16\'h00FF' }, note: '-1 vs 255' },
      { in: { data: '8\'h80' }, out: { sext: '16\'hFF80', zext: '16\'h0080' }, note: 'most negative byte' },
    ],
    starter: `module sign_extend(
  input  [7:0]  data,
  output [15:0] sext,
  output [15:0] zext
);
  // One replicates bit 7, the other pads with zeros.

endmodule`,
    solution: `module sign_extend(
  input  [7:0]  data,
  output [15:0] sext,
  output [15:0] zext
);
  assign sext = { {8{data[7]}}, data };
  assign zext = { 8'b0, data };
endmodule`,
    editorial:
      `The doubled braces matter: \`{8{data[7]}}\` is a replication producing eight copies, while \`{8, data[7]}\` would be a concatenation of the literal 8 with one bit — legal Verilog, completely wrong circuit.\n\n` +
      `The alternative is to declare the port \`signed\` and let the language widen automatically, but implicit sign extension across an assignment is easy to misread. Being explicit costs one line and removes the ambiguity.\n\n` +
      `Like the other rewiring problems, this is zero gates — the sign bit simply fans out to eight wires.`,
  },

  {
    id: 'c-barrel-shift',
    number: 44,
    title: 'Barrel Shifter with Rotate',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['shifter', 'rotate', 'case', 'alu'],
    moduleName: 'barrel_shift8',
    statement:
      `Shift or rotate an 8-bit value by an arbitrary amount in a single step.\n\n` +
      `\`mode\` picks the operation: 0 shifts left (vacated bits become 0), 1 shifts right logically (zeros in at the top), 2 rotates left, 3 rotates right. \`amt\` gives the distance, 0 through 7.\n\n` +
      `A rotate loses nothing — bits leaving one end re-enter at the other.`,
    context:
      `A processor shifts in one cycle, not one bit per cycle, so the hardware is a tree of muxes: one stage per bit of the shift amount. The same structure normalizes floating-point significands and extracts bit fields.`,
    hint:
      'Rotate left by n is `(data << n) | (data >> (8 - n))`. Beware n = 0, where `data >> 8` must not corrupt the result — concatenating `{data, data}` and slicing avoids the special case entirely.',
    inputs: [
      { name: 'data', width: 8 },
      { name: 'amt', width: 3, note: 'shift/rotate distance' },
      { name: 'mode', width: 2, note: '0 SHL, 1 SHR, 2 ROL, 3 ROR' },
    ],
    outputs: [{ name: 'y', width: 8 }],
    constraints: [
      'Module name must be `barrel_shift8`',
      'Cover all four modes — no inferred latch',
      'Purely combinational',
    ],
    examples: [
      { in: { data: '8\'hA5', amt: 2, mode: 0 }, out: { y: '8\'h94' }, note: 'shift left' },
      { in: { data: '8\'hA5', amt: 2, mode: 1 }, out: { y: '8\'h29' }, note: 'shift right' },
      { in: { data: '8\'hA5', amt: 2, mode: 2 }, out: { y: '8\'h96' }, note: 'rotate left' },
      { in: { data: '8\'hA5', amt: 2, mode: 3 }, out: { y: '8\'h69' }, note: 'rotate right' },
    ],
    stimulus: { mode: 'vectors', vectors: 256 },
    starter: `module barrel_shift8(
  input  [7:0] data,
  input  [2:0] amt,
  input  [1:0] mode,
  output reg [7:0] y
);
  always @(*) begin
    // 0: shift left, 1: shift right, 2: rotate left, 3: rotate right
  end
endmodule`,
    solution: `module barrel_shift8(
  input  [7:0] data,
  input  [2:0] amt,
  input  [1:0] mode,
  output reg [7:0] y
);
  // Doubling the word makes both rotates a plain slice, with no amt == 0 special case.
  wire [15:0] dbl = { data, data };

  always @(*) begin
    case (mode)
      2'b00:   y = data << amt;
      2'b01:   y = data >> amt;
      2'b10:   y = dbl[15 - amt -: 8];   // rotate left
      2'b11:   y = dbl[amt +: 8];        // rotate right
      default: y = data;
    endcase
  end
endmodule`,
    editorial:
      `The rotates are the interesting part. Writing \`(data << amt) | (data >> (8 - amt))\` breaks at \`amt == 0\`, because \`data >> 8\` on an 8-bit value is zero and the OR still works — but on some widths and with signed operands the same pattern silently drops bits. Concatenating the word with itself and taking an indexed slice sidesteps the whole class of bug.\n\n` +
      `\`dbl[amt +: 8]\` is the indexed part-select: start at \`amt\` and take 8 bits upward. \`-:\` counts downward from the start. Both are essential once the index is a variable, since \`dbl[amt+7 : amt]\` is illegal — slice bounds must be constant.\n\n` +
      `In gates this is three mux stages (for shifts of 1, 2 and 4) plus the mode selection, so the delay grows as log₂ of the width rather than linearly.`,
  },

  {
    id: 'c-popcount',
    number: 45,
    title: 'Population Count',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['popcount', 'adder-tree', 'generate'],
    moduleName: 'popcount8',
    statement:
      `Count how many bits of an 8-bit word are set.\n\n` +
      `\`count\` is a 4-bit result, so it can represent every possible answer from 0 through 8.`,
    context:
      `Population count is a single instruction on modern CPUs because it turns up everywhere: Hamming distance in error correction, sparsity in neural-network accelerators, free-slot counting in allocators, and cardinality in database bitmap indexes.`,
    hint:
      'The direct form is to add the eight bits together, each zero-extended to 4 bits. A `generate` loop or a simple sum both synthesize to an adder tree.',
    inputs: [{ name: 'data', width: 8 }],
    outputs: [{ name: 'count', width: 4, note: 'number of set bits, 0 to 8' }],
    constraints: ['Module name must be `popcount8`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'h00' }, out: { count: 0 } },
      { in: { data: '8\'h0F' }, out: { count: 4 } },
      { in: { data: '8\'hA5' }, out: { count: 4 } },
      { in: { data: '8\'hFF' }, out: { count: 8 } },
    ],
    starter: `module popcount8(
  input  [7:0] data,
  output [3:0] count
);
  // Sum the eight bits. The result needs 4 bits to reach 8.

endmodule`,
    solution: `module popcount8(
  input  [7:0] data,
  output [3:0] count
);
  // Pairwise tree: 8x1 -> 4x2 -> 2x3 -> 1x4 bits.
  wire [1:0] s0 = data[0] + data[1];
  wire [1:0] s1 = data[2] + data[3];
  wire [1:0] s2 = data[4] + data[5];
  wire [1:0] s3 = data[6] + data[7];
  wire [2:0] t0 = s0 + s1;
  wire [2:0] t1 = s2 + s3;
  assign count = t0 + t1;
endmodule`,
    editorial:
      `Writing it as an explicit tree makes the structure visible: three levels of adders, each level twice as wide and half as numerous. Delay grows with log₂(width).\n\n` +
      `\`data[0] + data[1]\` producing a 2-bit result is not automatic — the sum of two 1-bit values is 1 bit wide by Verilog's rules, and the carry would be lost. Declaring the target \`wire [1:0]\` is what makes the addition widen. This is the single most common popcount bug.\n\n` +
      `Simply writing \`assign count = data[0] + data[1] + ... + data[7];\` also works, because the assignment context is 4 bits wide and Verilog evaluates the whole expression at that width. The tree version just makes the hardware explicit.`,
  },

  {
    id: 'c-lzc',
    number: 46,
    title: 'Leading Zero Counter',
    track: 'combinational',
    difficulty: 'Medium',
    tags: ['lzc', 'normalization', 'casez', 'floating-point'],
    moduleName: 'lzc8',
    statement:
      `Count the zeros above the most significant set bit.\n\n` +
      `Scanning \`data\` from bit 7 downward, \`count\` is how many zeros are passed before the first 1. When \`data\` is entirely zero there is no such bit: \`count\` is 8 and \`all_zero\` is high.`,
    context:
      `Floating-point addition renormalizes its result by shifting the significand left until the leading 1 reaches the top — the shift distance is exactly this count. It also drives fast division-by-shifting and some compression codecs.`,
    hint:
      'A `casez` from the top: `8\'b1???_????` means zero leading zeros, `8\'b01??_????` means one, and the all-zero pattern is the last case.',
    inputs: [{ name: 'data', width: 8 }],
    outputs: [
      { name: 'count', width: 4, note: 'leading zeros, 0 to 8' },
      { name: 'all_zero', width: 1, note: 'high when data has no set bit' },
    ],
    constraints: [
      'Module name must be `lzc8`',
      'When `data` is zero: `count` = 8 and `all_zero` = 1',
    ],
    examples: [
      { in: { data: '8\'h80' }, out: { count: 0, all_zero: 0 } },
      { in: { data: '8\'h08' }, out: { count: 4, all_zero: 0 } },
      { in: { data: '8\'h01' }, out: { count: 7, all_zero: 0 } },
      { in: { data: '8\'h00' }, out: { count: 8, all_zero: 1 } },
    ],
    starter: `module lzc8(
  input  [7:0] data,
  output reg [3:0] count,
  output           all_zero
);
  always @(*) begin
    // Scan down from bit 7 to the first 1.
  end
endmodule`,
    solution: `module lzc8(
  input  [7:0] data,
  output reg [3:0] count,
  output           all_zero
);
  assign all_zero = ~|data;

  always @(*) begin
    casez (data)
      8'b1???????: count = 4'd0;
      8'b01??????: count = 4'd1;
      8'b001?????: count = 4'd2;
      8'b0001????: count = 4'd3;
      8'b00001???: count = 4'd4;
      8'b000001??: count = 4'd5;
      8'b0000001?: count = 4'd6;
      8'b00000001: count = 4'd7;
      default:     count = 4'd8;
    endcase
  end
endmodule`,
    editorial:
      `Note the width of \`count\`: it must hold 8, which needs 4 bits, not 3. Sizing it to log₂(8) = 3 is the standard off-by-one here and it silently wraps the all-zero case to 0 — the exact value that means "leading 1 at the top".\n\n` +
      `This is the priority encoder from problem 37 with a different output encoding, and it shares the same scaling problem: written as a chain the delay is linear in width. Real 64-bit LZCs are built as trees that combine per-half results, which is why they get dedicated hardware rather than being expressed as a case.`,
  },
];
