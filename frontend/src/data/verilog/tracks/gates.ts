/**
 * Track 1 — Gates & Primitives.
 *
 * The tier above the single-gate ladder in tracks/foundations.ts: reduction
 * operators, universal-gate decomposition, and the compound AOI/OAI cells that
 * real standard-cell libraries ship. Everything in the track is combinational
 * and small enough to grade exhaustively.
 */
import type { VProblemV2 } from '../types';

export const GATE_PROBLEMS: VProblemV2[] = [
  {
    id: 'g-reduce-and',
    number: 12,
    title: 'AND Reduction over a Bus',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['reduction', 'vectors'],
    moduleName: 'reduce_and8',
    statement:
      `Collapse an 8-bit bus down to a single bit that is high only when every one of the eight bits is high.\n\n` +
      `Any zero anywhere in \`data\` forces \`all_ones\` low.`,
    context:
      `This is the "all lanes ready" check: a bus qualifier that only fires once every participant has asserted. The same shape appears in address decoders and in the carry-propagate term of a lookahead adder.`,
    hint: 'Verilog has a unary reduction form: `&data` ANDs every bit of the vector together.',
    inputs: [{ name: 'data', width: 8, note: 'the bus under test' }],
    outputs: [{ name: 'all_ones', width: 1, note: 'high only when data == 8\'hFF' }],
    constraints: [
      'Module name must be `reduce_and8`',
      'Use the reduction operator rather than writing out eight ANDs',
      'Purely combinational',
    ],
    examples: [
      { in: { data: '8\'h00' }, out: { all_ones: 0 } },
      { in: { data: '8\'h7F' }, out: { all_ones: 0 } },
      { in: { data: '8\'hFF' }, out: { all_ones: 1 } },
    ],
    starter: `module reduce_and8(
  input  [7:0] data,
  output       all_ones
);
  // Reduce the whole bus to one bit.

endmodule`,
    solution: `module reduce_and8(
  input  [7:0] data,
  output       all_ones
);
  assign all_ones = &data;
endmodule`,
    editorial:
      `\`&data\` is a *unary* reduction, not the binary AND — it takes one vector and returns one bit. Synthesis builds a balanced tree of gates, so the delay grows with log₂(width), not width.\n\n` +
      `\`data == 8'hFF\` produces exactly the same hardware. The reduction form is preferred because it stays correct when the port width is parameterized.`,
  },

  {
    id: 'g-reduce-or',
    number: 13,
    title: 'OR Reduction over a Bus',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['reduction', 'vectors'],
    moduleName: 'reduce_or8',
    statement:
      `Report whether an 8-bit bus contains any set bit at all.\n\n` +
      `\`any_set\` is high when at least one bit of \`data\` is high, and low only for an all-zero bus.`,
    context:
      `This is the inverse of a zero flag. An ALU computes exactly this on its result to decide whether to set Z, and interrupt controllers use it to collapse many request lines into one "something needs attention" signal.`,
    hint: 'The reduction OR is `|data`.',
    inputs: [{ name: 'data', width: 8 }],
    outputs: [{ name: 'any_set', width: 1, note: 'high unless data is all zeros' }],
    constraints: ['Module name must be `reduce_or8`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'h00' }, out: { any_set: 0 } },
      { in: { data: '8\'h01' }, out: { any_set: 1 } },
      { in: { data: '8\'h80' }, out: { any_set: 1 } },
    ],
    starter: `module reduce_or8(
  input  [7:0] data,
  output       any_set
);
  // High if any bit is set.

endmodule`,
    solution: `module reduce_or8(
  input  [7:0] data,
  output       any_set
);
  assign any_set = |data;
endmodule`,
    editorial:
      `A zero flag is \`~|data\` — the NOR reduction — which is why you rarely see an explicit \`data == 0\` comparator in a datapath.\n\n` +
      `The gate count is identical to the AND reduction; only the cell type changes.`,
  },

  {
    id: 'g-parity8',
    number: 14,
    title: 'Parity of a Byte',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['reduction', 'parity', 'error-detection'],
    moduleName: 'parity_byte',
    statement:
      `Compute both parities of an 8-bit word in one module.\n\n` +
      `\`odd\` is high when the number of set bits in \`data\` is odd. \`even\` is high when that count is even. The two outputs are always complements of one another.`,
    context:
      `A UART appends one of these bits to every frame, and DRAM stores one per byte, so a single flipped bit changes the parity and gets caught. It cannot correct anything, and it misses double-bit errors — which is exactly why ECC exists.`,
    hint: 'The XOR reduction `^data` counts set bits modulo 2, which is odd parity.',
    inputs: [{ name: 'data', width: 8, note: 'payload byte' }],
    outputs: [
      { name: 'odd', width: 1, note: 'high when the set-bit count is odd' },
      { name: 'even', width: 1, note: 'high when the set-bit count is even' },
    ],
    constraints: ['Module name must be `parity_byte`', 'Purely combinational'],
    examples: [
      { in: { data: '8\'h00' }, out: { odd: 0, even: 1 } },
      { in: { data: '8\'h01' }, out: { odd: 1, even: 0 } },
      { in: { data: '8\'h03' }, out: { odd: 0, even: 1 } },
      { in: { data: '8\'hFF' }, out: { odd: 0, even: 1 } },
    ],
    starter: `module parity_byte(
  input  [7:0] data,
  output       odd,
  output       even
);
  // XOR-reduce the byte; the two outputs are complements.

endmodule`,
    solution: `module parity_byte(
  input  [7:0] data,
  output       odd,
  output       even
);
  assign odd  = ^data;
  assign even = ~^data;
endmodule`,
    editorial:
      `\`^data\` is a tree of XORs — three levels deep for eight bits — and it is genuinely the slowest of the reduction operators because XOR cells are the most expensive.\n\n` +
      `A wide parity tree (64 bits and up) is often the critical path in an ECC encoder, which is why high-speed designs pipeline it rather than computing it in one cycle.`,
  },

  {
    id: 'g-nand-universal',
    number: 15,
    title: 'Everything from NAND',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['gates', 'universal', 'structural'],
    moduleName: 'nand_universal',
    statement:
      `NAND is functionally complete: every Boolean function can be built from NANDs alone. Prove it.\n\n` +
      `Produce four outputs — \`y_not\` (invert \`a\`), \`y_and\`, \`y_or\` and \`y_xor\` — using only NAND operations. You may declare intermediate wires, but every gate in the module must be a NAND.\n\n` +
      `The judge checks behaviour, so start from the identities: a NAND with both inputs tied together is an inverter, and inverting a NAND gives you AND.`,
    context:
      `This is not just a puzzle. Technology mapping does exactly this transformation — it rewrites your RTL into whatever cells the target library actually contains, and for many processes the NAND is the cheapest and fastest of them.`,
    hint:
      'Build up in stages: `n(x,x)` inverts. `y_and = n(n(a,b), n(a,b))`. For OR, invert both inputs first. XOR takes four NANDs.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [
      { name: 'y_not', width: 1, note: 'NOT a' },
      { name: 'y_and', width: 1 },
      { name: 'y_or', width: 1 },
      { name: 'y_xor', width: 1 },
    ],
    constraints: [
      'Module name must be `nand_universal`',
      'Every gate must be a NAND — no bare `&`, `|`, `^` between signals',
      'Intermediate `wire` declarations are encouraged',
    ],
    examples: [
      { in: { a: 0, b: 0 }, out: { y_not: 1, y_and: 0, y_or: 0, y_xor: 0 } },
      { in: { a: 0, b: 1 }, out: { y_not: 1, y_and: 0, y_or: 1, y_xor: 1 } },
      { in: { a: 1, b: 0 }, out: { y_not: 0, y_and: 0, y_or: 1, y_xor: 1 } },
      { in: { a: 1, b: 1 }, out: { y_not: 0, y_and: 1, y_or: 1, y_xor: 0 } },
    ],
    starter: `module nand_universal(
  input  a,
  input  b,
  output y_not,
  output y_and,
  output y_or,
  output y_xor
);
  // Only NANDs. Declare wires for the intermediate terms.
  // wire nab = ~(a & b);

endmodule`,
    solution: `module nand_universal(
  input  a,
  input  b,
  output y_not,
  output y_and,
  output y_or,
  output y_xor
);
  wire na  = ~(a & a);      // inverter from a NAND
  wire nb  = ~(b & b);
  wire nab = ~(a & b);      // the shared NAND term

  assign y_not = na;
  assign y_and = ~(nab & nab);
  assign y_or  = ~(na  & nb);
  assign y_xor = ~(~(a & nab) & ~(b & nab));
endmodule`,
    editorial:
      `The shared term \`nab\` is what makes the XOR cheap: \`a XOR b = NAND(NAND(a, nab), NAND(b, nab))\`, four NANDs total rather than the six a naive expansion gives.\n\n` +
      `Counting levels: \`y_and\` is two deep, \`y_or\` two, \`y_xor\` three. In a real library the XOR path would be the one to watch, and this is precisely the reasoning a mapper automates when it picks cells.`,
  },

  {
    id: 'g-nor-universal',
    number: 16,
    title: 'Everything from NOR',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['gates', 'universal', 'structural'],
    moduleName: 'nor_universal',
    statement:
      `NOR is functionally complete too — it is the dual of NAND.\n\n` +
      `Produce \`y_not\`, \`y_and\`, \`y_or\` and \`y_xor\` from \`a\` and \`b\` using only NOR operations.\n\n` +
      `A NOR with both inputs tied together inverts. Everything else follows by duality with the NAND construction.`,
    context:
      `NOR-only logic dominated early NMOS and ECL processes. In modern CMOS a NOR is slightly slower than a NAND because its PMOS devices stack in series, which is why libraries lean on NAND — but the completeness argument is identical.`,
    hint: 'Dual of the NAND case: `y_or` needs one extra inversion, `y_and` needs both inputs inverted first.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
    outputs: [
      { name: 'y_not', width: 1 },
      { name: 'y_and', width: 1 },
      { name: 'y_or', width: 1 },
      { name: 'y_xor', width: 1 },
    ],
    constraints: [
      'Module name must be `nor_universal`',
      'Every gate must be a NOR',
    ],
    examples: [
      { in: { a: 0, b: 0 }, out: { y_not: 1, y_and: 0, y_or: 0, y_xor: 0 } },
      { in: { a: 1, b: 0 }, out: { y_not: 0, y_and: 0, y_or: 1, y_xor: 1 } },
      { in: { a: 1, b: 1 }, out: { y_not: 0, y_and: 1, y_or: 1, y_xor: 0 } },
    ],
    starter: `module nor_universal(
  input  a,
  input  b,
  output y_not,
  output y_and,
  output y_or,
  output y_xor
);
  // Only NORs.

endmodule`,
    solution: `module nor_universal(
  input  a,
  input  b,
  output y_not,
  output y_and,
  output y_or,
  output y_xor
);
  wire na   = ~(a | a);
  wire nb   = ~(b | b);
  wire naob = ~(a | b);     // shared NOR term

  assign y_not = na;
  assign y_and = ~(na | nb);
  assign y_or  = ~(naob | naob);
  assign y_xor = ~(~(naob | ~(a | a)) | ~(naob | ~(b | b)));
endmodule`,
    editorial:
      `Compare with the NAND build: \`y_and\` and \`y_or\` swap places in complexity, which is exactly what duality predicts.\n\n` +
      `The XOR is the awkward one in both bases. When a design needs many XORs, libraries supply a dedicated XOR cell rather than letting the mapper expand it — a transmission-gate XOR is far cheaper than five NORs.`,
  },

  {
    id: 'g-aoi22',
    number: 17,
    title: 'AND-OR-Invert (AOI22)',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['gates', 'compound-cell', 'cmos'],
    moduleName: 'aoi22_cell',
    statement:
      `Implement the compound AOI22 cell.\n\n` +
      `Form two AND products — \`a & b\` and \`c & d\` — OR them together, then invert the result. \`y\` is therefore low whenever either pair is jointly high, and high otherwise.`,
    context:
      `A real library builds this as a single transistor stack rather than three separate gates, so it is faster and smaller than the AND-OR-INVERT sequence written out. Mappers hunt for this pattern aggressively — it turns up in adder carry logic and mux trees constantly.`,
    hint: 'One expression: invert the OR of the two AND terms.',
    inputs: [
      { name: 'a', width: 1 }, { name: 'b', width: 1 },
      { name: 'c', width: 1 }, { name: 'd', width: 1 },
    ],
    outputs: [{ name: 'y', width: 1, note: 'NOT ((a AND b) OR (c AND d))' }],
    constraints: ['Module name must be `aoi22_cell`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, c: 0, d: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1, c: 0, d: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1, c: 1, d: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 0, c: 0, d: 1 }, out: { y: 1 } },
    ],
    starter: `module aoi22_cell(
  input  a,
  input  b,
  input  c,
  input  d,
  output y
);
  // AND two pairs, OR them, invert.

endmodule`,
    solution: `module aoi22_cell(
  input  a,
  input  b,
  input  c,
  input  d,
  output y
);
  assign y = ~((a & b) | (c & d));
endmodule`,
    editorial:
      `Why the inversion is free: in static CMOS every gate is naturally inverting. The pull-down network here is two series pairs in parallel, and the pull-up is its complement. Building a non-inverting AND-OR would mean adding an output inverter — strictly more area and delay.\n\n` +
      `That is the reason libraries ship AOI/OAI cells but rarely a plain three-input AND-OR.`,
  },

  {
    id: 'g-oai22',
    number: 18,
    title: 'OR-AND-Invert (OAI22)',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['gates', 'compound-cell', 'cmos'],
    moduleName: 'oai22_cell',
    statement:
      `Implement the dual of AOI22.\n\n` +
      `Form two OR sums — \`a | b\` and \`c | d\` — AND them together, then invert. \`y\` is low only when both sums are high at once.`,
    context:
      `OAI is what a mapper reaches for when your RTL is naturally a product-of-sums. Together with AOI it covers most of the compound-cell patterns that show up after logic optimization.`,
    hint: 'Same shape as AOI22 with the operators swapped.',
    inputs: [
      { name: 'a', width: 1 }, { name: 'b', width: 1 },
      { name: 'c', width: 1 }, { name: 'd', width: 1 },
    ],
    outputs: [{ name: 'y', width: 1, note: 'NOT ((a OR b) AND (c OR d))' }],
    constraints: ['Module name must be `oai22_cell`', 'Purely combinational'],
    examples: [
      { in: { a: 0, b: 0, c: 0, d: 0 }, out: { y: 1 } },
      { in: { a: 0, b: 1, c: 0, d: 1 }, out: { y: 0 } },
      { in: { a: 1, b: 1, c: 0, d: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 0, c: 1, d: 0 }, out: { y: 0 } },
    ],
    starter: `module oai22_cell(
  input  a,
  input  b,
  input  c,
  input  d,
  output y
);
  // OR two pairs, AND them, invert.

endmodule`,
    solution: `module oai22_cell(
  input  a,
  input  b,
  input  c,
  input  d,
  output y
);
  assign y = ~((a | b) & (c | d));
endmodule`,
    editorial:
      `Applying De Morgan to this gives \`(~a & ~b) | (~c & ~d)\` — an AOI22 with inverted inputs. The two cells really are the same structure viewed from opposite polarity, which is why libraries characterize both.\n\n` +
      `Interview follow-up worth knowing: given a choice, prefer the cell whose slow transition is off your critical path. NAND-flavoured (AOI) cells have the faster falling output; NOR-flavoured (OAI) the faster rising one.`,
  },

  {
    id: 'g-cond-invert',
    number: 19,
    title: 'XOR as a Programmable Inverter',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['gates', 'xor', 'datapath'],
    moduleName: 'cond_invert',
    statement:
      `Use a single XOR to build a conditional inverter over a 4-bit bus.\n\n` +
      `When \`invert\` is low, \`y\` passes \`data\` through unchanged. When \`invert\` is high, every bit of \`y\` is the complement of the matching bit of \`data\`.`,
    context:
      `This is how an adder becomes a subtractor: XOR the second operand with the operation bit and feed that same bit into the carry-in, and you get two's-complement subtraction for the price of one gate per bit. Scramblers and error-injection hardware use the identical trick.`,
    hint: 'XOR with a constant: `a ^ 0` is `a`, and `a ^ 1` is `~a`. Replicate `invert` across the bus width.',
    inputs: [
      { name: 'data', width: 4, note: 'bus to pass or invert' },
      { name: 'invert', width: 1, note: 'high inverts every bit' },
    ],
    outputs: [{ name: 'y', width: 4 }],
    constraints: [
      'Module name must be `cond_invert`',
      'Use XOR rather than a mux or an if/else',
      'Purely combinational',
    ],
    examples: [
      { in: { data: '4\'b1010', invert: 0 }, out: { y: '4\'b1010' } },
      { in: { data: '4\'b1010', invert: 1 }, out: { y: '4\'b0101' } },
      { in: { data: '4\'b0000', invert: 1 }, out: { y: '4\'b1111' } },
    ],
    starter: `module cond_invert(
  input  [3:0] data,
  input        invert,
  output [3:0] y
);
  // One XOR per bit, all controlled by invert.

endmodule`,
    solution: `module cond_invert(
  input  [3:0] data,
  input        invert,
  output [3:0] y
);
  assign y = data ^ {4{invert}};
endmodule`,
    editorial:
      `\`{4{invert}}\` is the replication operator — it fans the single control bit out to the bus width so the XOR is bit-aligned. Writing \`data ^ invert\` instead would zero-extend \`invert\` and only affect bit 0, which is a classic width bug that simulates quietly.\n\n` +
      `The alternative, \`invert ? ~data : data\`, produces a mux per bit: more area and more delay than the XOR for identical behaviour.`,
  },

  {
    id: 'g-mux2-sop',
    number: 20,
    title: 'A Multiplexer from AND-OR-NOT',
    track: 'gates',
    difficulty: 'Easy',
    tags: ['mux', 'sop', 'structural'],
    moduleName: 'mux2_sop',
    statement:
      `Build a 2-to-1 multiplexer from primitive gates rather than the conditional operator.\n\n` +
      `When \`sel\` is 0, \`y\` follows \`a\`; when \`sel\` is 1, \`y\` follows \`b\`. Express it as a sum of products: each input is gated by the appropriate polarity of \`sel\`, and the two product terms are ORed.`,
    context:
      `The mux is the most-instantiated block in digital design — every register with an enable, every ALU result selection, every forwarding path is one. Knowing its gate-level shape tells you why the select line is usually the latest-arriving input.`,
    hint: '`y = (a AND NOT sel) OR (b AND sel)`.',
    inputs: [
      { name: 'a', width: 1, note: 'chosen when sel is 0' },
      { name: 'b', width: 1, note: 'chosen when sel is 1' },
      { name: 'sel', width: 1 },
    ],
    outputs: [{ name: 'y', width: 1 }],
    constraints: [
      'Module name must be `mux2_sop`',
      'Build it from AND / OR / NOT — not from `?:` or an `if`',
      'Purely combinational',
    ],
    examples: [
      { in: { a: 1, b: 0, sel: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 0, sel: 1 }, out: { y: 0 } },
      { in: { a: 0, b: 1, sel: 1 }, out: { y: 1 } },
    ],
    starter: `module mux2_sop(
  input  a,
  input  b,
  input  sel,
  output y
);
  // Sum of products: gate each input with the right polarity of sel.

endmodule`,
    solution: `module mux2_sop(
  input  a,
  input  b,
  input  sel,
  output y
);
  assign y = (a & ~sel) | (b & sel);
endmodule`,
    editorial:
      `Both product terms depend on \`sel\`, so it drives the widest fan-out and passes through an inverter on one branch — that asymmetry is why static timing usually shows the select path as the slowest input of a mux.\n\n` +
      `Real libraries implement this with transmission gates instead of AND-OR, which halves the transistor count and removes the inverter delay from the data path.`,
  },

  {
    id: 'g-sop-pos',
    number: 21,
    title: 'Two Forms of the Same Function',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['karnaugh', 'sop', 'pos', 'minimization'],
    moduleName: 'sop_pos_forms',
    statement:
      `A three-input function is defined by this truth table:\n\n` +
      `\`y\` is high for exactly these input combinations of \`{a, b, c}\`: 000, 001, 011, 101, 110, 111. It is low for 010 and 100.\n\n` +
      `Produce that function twice. \`y_sop\` must be written as a sum of products (an OR of AND terms), and \`y_pos\` as a product of sums (an AND of OR terms). Both outputs must agree on every input.`,
    context:
      `Synthesis tools derive both forms and keep whichever maps better onto the target library — an area-constrained corner may favour one, a timing-constrained corner the other. Being able to read a K-map both ways is still expected in interviews.`,
    hint:
      'The function is low only for 010 and 100. That makes the POS form short: one OR term per zero row, each written with inverted literals.',
    inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }, { name: 'c', width: 1 }],
    outputs: [
      { name: 'y_sop', width: 1, note: 'sum-of-products realization' },
      { name: 'y_pos', width: 1, note: 'product-of-sums realization' },
    ],
    constraints: [
      'Module name must be `sop_pos_forms`',
      '`y_sop` must be an OR of AND terms',
      '`y_pos` must be an AND of OR terms',
      'Both outputs must match the truth table exactly',
    ],
    examples: [
      { in: { a: 0, b: 0, c: 0 }, out: { y_sop: 1, y_pos: 1 } },
      { in: { a: 0, b: 1, c: 0 }, out: { y_sop: 0, y_pos: 0 }, note: 'one of the two zero rows' },
      { in: { a: 1, b: 0, c: 0 }, out: { y_sop: 0, y_pos: 0 }, note: 'the other zero row' },
      { in: { a: 1, b: 1, c: 1 }, out: { y_sop: 1, y_pos: 1 } },
    ],
    starter: `module sop_pos_forms(
  input  a,
  input  b,
  input  c,
  output y_sop,
  output y_pos
);
  // y is 0 only for {a,b,c} = 010 and 100.
  // Write it once as OR-of-ANDs, once as AND-of-ORs.

endmodule`,
    solution: `module sop_pos_forms(
  input  a,
  input  b,
  input  c,
  output y_sop,
  output y_pos
);
  // Sum of products: one AND term per row where y is 1.
  assign y_sop = (~a & ~b & ~c) | (~a & ~b &  c) |
                 (~a &  b &  c) | ( a & ~b &  c) |
                 ( a &  b & ~c) | ( a &  b &  c);

  // Product of sums: one OR term per row where y is 0.
  //   row 010 blocked by (a | ~b | c), row 100 by (~a | b | c)
  assign y_pos = (a | ~b | c) & (~a | b | c);
endmodule`,
    editorial:
      `The POS form is dramatically smaller here — two OR terms against six AND terms — purely because the function has only two zeros. That is the practical rule: minimize around whichever output value is rarer.\n\n` +
      `The SOP form above is deliberately unminimized so the correspondence with the truth table is visible. Minimizing it gives \`c & ~(a & b) | …\`; the tool will find that regardless of how you write it, so favour the form a reader can check against the spec.`,
  },

  {
    id: 'g-bcd-ge5',
    number: 22,
    title: 'Don\'t-Cares in a BCD Digit',
    track: 'gates',
    difficulty: 'Medium',
    tags: ['karnaugh', 'dont-care', 'bcd', 'minimization'],
    moduleName: 'bcd_ge5',
    statement:
      `A 4-bit input \`digit\` carries a binary-coded decimal value, so by construction it only ever holds 0 through 9. Codes 10 through 15 never occur.\n\n` +
      `Drive \`ge5\` high when the digit is 5 or greater, and low for 0 through 4.\n\n` +
      `Because the six illegal codes cannot appear, the judge does not check them — you are free to let them produce whatever value makes the logic smaller.`,
    context:
      `Every seven-segment driver and decade counter carries this constraint. Treating unreachable codes as don't-cares rather than zeros is one of the few places a designer still routinely beats the tool's default assumptions, because only the designer knows the input is restricted.`,
    hint:
      'With 10–15 as don\'t-cares the answer collapses to three literals: the digit is ≥ 5 when bit 3 is set, or when bit 2 is set together with either bit 1 or bit 0.',
    inputs: [{ name: 'digit', width: 4, note: 'BCD digit, guaranteed 0–9' }],
    outputs: [{ name: 'ge5', width: 1, note: 'high when digit >= 5' }],
    constraints: [
      'Module name must be `bcd_ge5`',
      'Purely combinational',
      'Codes 10–15 are unreachable and are not graded',
    ],
    examples: [
      { in: { digit: 4 }, out: { ge5: 0 } },
      { in: { digit: 5 }, out: { ge5: 1 } },
      { in: { digit: 9 }, out: { ge5: 1 } },
    ],
    // The six illegal codes are excluded from grading, so both the reference and
    // a legitimately-minimized answer are free to differ there.
    stimulus: {
      mode: 'vectors',
      directed: Array.from({ length: 10 }, (_, i) => ({ digit: i })),
      vectors: 10,
    },
    starter: `module bcd_ge5(
  input  [3:0] digit,
  output       ge5
);
  // digit is always 0..9 — exploit the unreachable codes.

endmodule`,
    solution: `module bcd_ge5(
  input  [3:0] digit,
  output       ge5
);
  assign ge5 = digit[3] | (digit[2] & (digit[1] | digit[0]));
endmodule`,
    editorial:
      `Treating 10–15 as zeros forces the term \`~digit[3] & digit[2] & …\`, an extra literal on the critical path. Letting them float removes it: any digit with bit 3 set is already ≥ 8, and among legal codes that means ≥ 5 automatically.\n\n` +
      `The honest way to express this in RTL is a \`casez\` with a \`default\` you genuinely do not care about, or a comment stating the input constraint. Silently relying on it without documenting it is how the next engineer reuses the block on unconstrained data and gets a bug.`,
  },
];
