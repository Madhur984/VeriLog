/**
 * Problem bank for the Hardware-LeetCode Verilog judge.
 *
 * Every problem is single-bit COMBINATIONAL logic that the in-browser miniSim
 * grades exhaustively (all 2^n input vectors) against a `golden` JS reference.
 * Each ships a `solution` used by the grader unit test (engine/verilog/grade.test)
 * to prove the golden is correct — the solution is NOT shown to students.
 *
 * Adding a problem: single-bit `inputs`/`outputs`, a `golden` function, `starter`
 * code whose ports match, and a `solution` that passes its own golden.
 * (Sequential/clocked problems need a clocked sim — not supported here yet.)
 */
import type { Bit } from '../engine/verilog/miniSim';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface VExample {
  in: Record<string, Bit>;
  out: Record<string, Bit>;
  note?: string;
}

export interface VProblem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  /** Short prose statement (rendered as paragraphs split on blank lines). */
  statement: string;
  hint?: string;
  inputs: string[];
  outputs: string[];
  examples: VExample[];
  starter: string;
  /** Reference solution — used by tests/authoring only; not shown in the UI. */
  solution: string;
  golden: (i: Record<string, Bit>) => Record<string, Bit>;
}

/** A clocked, single-bit flip-flop problem, graded cycle-by-cycle (see engine/verilog/seqSim + grade). */
export interface VSeqProblem {
  kind: 'seq';
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  statement: string;
  hint?: string;
  clock: string;                 // clock port (posedge)
  reset?: string;                // optional async active-high reset port
  dataInputs: string[];          // non-clock, non-reset inputs
  regOutputs: string[];          // output reg names (state)
  inputs: string[];              // all ports for the UI (clk + data + reset)
  outputs: string[];             // = regOutputs (for the UI)
  examples: VExample[];
  starter: string;
  solution: string;
  /** Test sequence: one input vector per clock cycle (data + reset; clk implicit). */
  vectors: Record<string, Bit>[];
  /** Golden next-state: (current reg state, this cycle's inputs) -> reg values after the edge. */
  step: (state: Record<string, Bit>, inp: Record<string, Bit>) => Record<string, Bit>;
}

export type AnyProblem = VProblem | VSeqProblem;
export const isSeq = (p: AnyProblem): p is VSeqProblem => (p as VSeqProblem).kind === 'seq';

const b = (x: number): Bit => (x & 1) as Bit;

export const VERILOG_PROBLEMS: AnyProblem[] = [
  {
    id: 'wire', number: 1, title: 'Wire', difficulty: 'Easy', tags: ['basics', 'assign'],
    statement:
      `Create a module that simply connects the input to the output — a plain wire.\n\n` +
      `Whatever value arrives on \`a\` should appear unchanged on \`y\`. This is the "hello world" of hardware: a continuous assignment with no logic at all.`,
    hint: 'Use a continuous assignment: `assign y = a;`',
    inputs: ['a'], outputs: ['y'],
    examples: [
      { in: { a: 0 }, out: { y: 0 } },
      { in: { a: 1 }, out: { y: 1 } },
    ],
    starter: `module top(input a, output y);
  // Connect a straight through to y

endmodule`,
    solution: `module top(input a, output y);
  assign y = a;
endmodule`,
    golden: (i) => ({ y: i.a }),
  },
  {
    id: 'not', number: 2, title: 'NOT Gate', difficulty: 'Easy', tags: ['gates', 'assign'],
    statement:
      `Build an inverter. The output \`y\` is the logical NOT of the input \`a\`.\n\n` +
      `When \`a\` is 0, \`y\` is 1; when \`a\` is 1, \`y\` is 0.`,
    hint: 'The NOT operator in Verilog is `~`.',
    inputs: ['a'], outputs: ['y'],
    examples: [{ in: { a: 0 }, out: { y: 1 } }, { in: { a: 1 }, out: { y: 0 } }],
    starter: `module top(input a, output y);
  // y = NOT a

endmodule`,
    solution: `module top(input a, output y);
  assign y = ~a;
endmodule`,
    golden: (i) => ({ y: b(~i.a) }),
  },
  {
    id: 'and', number: 3, title: 'AND Gate', difficulty: 'Easy', tags: ['gates', 'assign'],
    statement:
      `Output \`y\` should be 1 only when BOTH inputs \`a\` and \`b\` are 1.\n\n` +
      `This is the logical AND of the two inputs.`,
    hint: 'The bitwise AND operator is `&`. You could also instantiate a gate: `and(y, a, b);`',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1 }, out: { y: 1 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = a AND b

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = a & b;
endmodule`,
    golden: (i) => ({ y: b(i.a & i.b) }),
  },
  {
    id: 'or', number: 4, title: 'OR Gate', difficulty: 'Easy', tags: ['gates', 'assign'],
    statement:
      `Output \`y\` should be 1 when AT LEAST ONE of \`a\` or \`b\` is 1.\n\nThis is the logical OR.`,
    hint: 'The bitwise OR operator is `|`.',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1 }, out: { y: 1 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = a OR b

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = a | b;
endmodule`,
    golden: (i) => ({ y: b(i.a | i.b) }),
  },
  {
    id: 'nand', number: 5, title: 'NAND Gate', difficulty: 'Easy', tags: ['gates', 'universal'],
    statement:
      `Output \`y\` is the inverse of AND: it is 0 only when both inputs are 1, and 1 otherwise.\n\n` +
      `NAND is a *universal* gate — every other gate can be built from it.`,
    hint: 'Invert an AND: `assign y = ~(a & b);`',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 1 }, out: { y: 0 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = NOT (a AND b)

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = ~(a & b);
endmodule`,
    golden: (i) => ({ y: b(~(i.a & i.b)) }),
  },
  {
    id: 'nor', number: 6, title: 'NOR Gate', difficulty: 'Easy', tags: ['gates', 'universal'],
    statement:
      `Output \`y\` is the inverse of OR: 1 only when both inputs are 0, and 0 otherwise.\n\n` +
      `NOR is the other universal gate.`,
    hint: 'Invert an OR: `assign y = ~(a | b);`',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = NOT (a OR b)

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = ~(a | b);
endmodule`,
    golden: (i) => ({ y: b(~(i.a | i.b)) }),
  },
  {
    id: 'xor', number: 7, title: 'XOR Gate', difficulty: 'Easy', tags: ['gates', 'arithmetic'],
    statement:
      `Output \`y\` is 1 when the inputs are DIFFERENT, and 0 when they are the same.\n\n` +
      `XOR is the heart of binary addition — it is the "sum" bit of a half adder.`,
    hint: 'The XOR operator is `^`.',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 0 } },
      { in: { a: 0, b: 1 }, out: { y: 1 } },
      { in: { a: 1, b: 1 }, out: { y: 0 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = 1 when a and b differ

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = a ^ b;
endmodule`,
    golden: (i) => ({ y: b(i.a ^ i.b) }),
  },
  {
    id: 'xnor', number: 8, title: 'XNOR Gate', difficulty: 'Easy', tags: ['gates', 'equality'],
    statement:
      `Output \`y\` is 1 when the inputs are the SAME (both 0 or both 1) — an equality detector.`,
    hint: 'Use `~^` (XNOR), or invert an XOR: `~(a ^ b)`.',
    inputs: ['a', 'b'], outputs: ['y'],
    examples: [
      { in: { a: 0, b: 0 }, out: { y: 1 } },
      { in: { a: 1, b: 0 }, out: { y: 0 } },
      { in: { a: 1, b: 1 }, out: { y: 1 } },
    ],
    starter: `module top(input a, input b, output y);
  // y = 1 when a equals b

endmodule`,
    solution: `module top(input a, input b, output y);
  assign y = a ~^ b;
endmodule`,
    golden: (i) => ({ y: b(~(i.a ^ i.b)) }),
  },
  {
    id: 'mux2', number: 9, title: '2-to-1 Multiplexer', difficulty: 'Medium', tags: ['mux', 'select'],
    statement:
      `A multiplexer selects one of its data inputs based on a select line.\n\n` +
      `When \`s\` is 0, route \`a\` to \`y\`. When \`s\` is 1, route \`b\` to \`y\`.`,
    hint: 'The ternary operator reads like an if/else: `assign y = s ? b : a;`',
    inputs: ['a', 'b', 's'], outputs: ['y'],
    examples: [
      { in: { a: 1, b: 0, s: 0 }, out: { y: 1 }, note: 's=0 → pick a' },
      { in: { a: 1, b: 0, s: 1 }, out: { y: 0 }, note: 's=1 → pick b' },
    ],
    starter: `module top(input a, input b, input s, output y);
  // s == 0 -> y = a
  // s == 1 -> y = b

endmodule`,
    solution: `module top(input a, input b, input s, output y);
  assign y = s ? b : a;
endmodule`,
    golden: (i) => ({ y: i.s ? i.b : i.a }),
  },
  {
    id: 'half_adder', number: 10, title: 'Half Adder', difficulty: 'Medium', tags: ['arithmetic', 'multi-output'],
    statement:
      `Add two 1-bit numbers \`a\` and \`b\`. Produce a \`sum\` bit and a \`carry\` bit.\n\n` +
      `1 + 1 = binary 10, so the sum is 0 and the carry is 1. The sum is XOR; the carry is AND.`,
    hint: '`assign sum = a ^ b;` and `assign carry = a & b;`',
    inputs: ['a', 'b'], outputs: ['sum', 'carry'],
    examples: [
      { in: { a: 0, b: 0 }, out: { sum: 0, carry: 0 } },
      { in: { a: 1, b: 0 }, out: { sum: 1, carry: 0 } },
      { in: { a: 1, b: 1 }, out: { sum: 0, carry: 1 }, note: '1+1 = 10' },
    ],
    starter: `module top(input a, input b, output sum, output carry);
  // sum  = a XOR b
  // carry = a AND b

endmodule`,
    solution: `module top(input a, input b, output sum, output carry);
  assign sum   = a ^ b;
  assign carry = a & b;
endmodule`,
    golden: (i) => ({ sum: b(i.a ^ i.b), carry: b(i.a & i.b) }),
  },

  // ── extended combinational bank ──────────────────────────────────────────
  {
    id: 'and3', number: 11, title: '3-Input AND', difficulty: 'Easy', tags: ['gates'],
    statement: `Output \`y\` is 1 only when ALL three inputs \`a\`, \`b\` and \`c\` are 1.`,
    hint: 'Chain the operator: `a & b & c`.',
    inputs: ['a', 'b', 'c'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 1, c: 0 }, out: { y: 0 } }, { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } }],
    starter: `module top(input a, input b, input c, output y);
  // y = a AND b AND c

endmodule`,
    solution: `module top(input a, input b, input c, output y);
  assign y = a & b & c;
endmodule`,
    golden: (i) => ({ y: b(i.a & i.b & i.c) }),
  },
  {
    id: 'or3', number: 12, title: '3-Input OR', difficulty: 'Easy', tags: ['gates'],
    statement: `Output \`y\` is 1 when AT LEAST ONE of \`a\`, \`b\` or \`c\` is 1.`,
    hint: 'Chain the OR operator: `a | b | c`.',
    inputs: ['a', 'b', 'c'], outputs: ['y'],
    examples: [{ in: { a: 0, b: 0, c: 0 }, out: { y: 0 } }, { in: { a: 0, b: 1, c: 0 }, out: { y: 1 } }],
    starter: `module top(input a, input b, input c, output y);
  // y = a OR b OR c

endmodule`,
    solution: `module top(input a, input b, input c, output y);
  assign y = a | b | c;
endmodule`,
    golden: (i) => ({ y: b(i.a | i.b | i.c) }),
  },
  {
    id: 'parity3', number: 13, title: '3-Bit Parity', difficulty: 'Easy', tags: ['xor', 'parity'],
    statement: `Output \`y\` is 1 when an ODD number of the inputs \`a\`, \`b\`, \`c\` are 1.\n\nThis is the XOR of all three — the basis of parity error-checking.`,
    hint: 'XOR chains naturally: `a ^ b ^ c`.',
    inputs: ['a', 'b', 'c'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 0, c: 0 }, out: { y: 1 } }, { in: { a: 1, b: 1, c: 0 }, out: { y: 0 } }, { in: { a: 1, b: 1, c: 1 }, out: { y: 1 } }],
    starter: `module top(input a, input b, input c, output y);
  // y = 1 when an odd number of inputs are 1

endmodule`,
    solution: `module top(input a, input b, input c, output y);
  assign y = a ^ b ^ c;
endmodule`,
    golden: (i) => ({ y: b(i.a ^ i.b ^ i.c) }),
  },
  {
    id: 'majority', number: 14, title: 'Majority Vote', difficulty: 'Medium', tags: ['logic', 'voting'],
    statement: `Output \`y\` is 1 when at least TWO of the three inputs are 1 — a majority voter used in fault-tolerant hardware.`,
    hint: 'Cover every pair: `(a & b) | (b & c) | (a & c)`.',
    inputs: ['a', 'b', 'c'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 1, c: 0 }, out: { y: 1 } }, { in: { a: 1, b: 0, c: 0 }, out: { y: 0 } }],
    starter: `module top(input a, input b, input c, output y);
  // y = 1 when two or more inputs are 1

endmodule`,
    solution: `module top(input a, input b, input c, output y);
  assign y = (a & b) | (b & c) | (a & c);
endmodule`,
    golden: (i) => ({ y: b((i.a & i.b) | (i.b & i.c) | (i.a & i.c)) }),
  },
  {
    id: 'full_adder', number: 15, title: 'Full Adder', difficulty: 'Medium', tags: ['arithmetic', 'multi-output'],
    statement: `Add three 1-bit values — \`a\`, \`b\` and a carry-in \`cin\`. Produce a \`sum\` bit and a carry-out \`cout\`.\n\nThe full adder is the cell you chain to build any wide adder.`,
    hint: '`sum = a ^ b ^ cin;`  and  `cout = (a & b) | (cin & (a ^ b));`',
    inputs: ['a', 'b', 'cin'], outputs: ['sum', 'cout'],
    examples: [{ in: { a: 1, b: 1, cin: 0 }, out: { sum: 0, cout: 1 } }, { in: { a: 1, b: 1, cin: 1 }, out: { sum: 1, cout: 1 } }],
    starter: `module top(input a, input b, input cin, output sum, output cout);

endmodule`,
    solution: `module top(input a, input b, input cin, output sum, output cout);
  assign sum  = a ^ b ^ cin;
  assign cout = (a & b) | (cin & (a ^ b));
endmodule`,
    golden: (i) => ({ sum: b(i.a ^ i.b ^ i.cin), cout: b((i.a & i.b) | (i.cin & (i.a ^ i.b))) }),
  },
  {
    id: 'half_sub', number: 16, title: 'Half Subtractor', difficulty: 'Medium', tags: ['arithmetic'],
    statement: `Compute \`a - b\` for two 1-bit values. Output the \`diff\` bit and a \`borrow\` bit (1 when b > a).`,
    hint: '`diff = a ^ b;`  and  `borrow = ~a & b;`',
    inputs: ['a', 'b'], outputs: ['diff', 'borrow'],
    examples: [{ in: { a: 0, b: 1 }, out: { diff: 1, borrow: 1 }, note: '0-1 borrows' }, { in: { a: 1, b: 1 }, out: { diff: 0, borrow: 0 } }],
    starter: `module top(input a, input b, output diff, output borrow);

endmodule`,
    solution: `module top(input a, input b, output diff, output borrow);
  assign diff   = a ^ b;
  assign borrow = ~a & b;
endmodule`,
    golden: (i) => ({ diff: b(i.a ^ i.b), borrow: b((~i.a & 1) & i.b) }),
  },
  {
    id: 'full_sub', number: 17, title: 'Full Subtractor', difficulty: 'Hard', tags: ['arithmetic', 'multi-output'],
    statement: `Compute \`a - b - bin\` for 1-bit values, where \`bin\` is a borrow-in. Output the \`diff\` bit and a borrow-out \`bout\`.`,
    hint: '`diff = a ^ b ^ bin;`  and  `bout = (~a & (b | bin)) | (b & bin);`',
    inputs: ['a', 'b', 'bin'], outputs: ['diff', 'bout'],
    examples: [{ in: { a: 0, b: 1, bin: 0 }, out: { diff: 1, bout: 1 } }, { in: { a: 1, b: 0, bin: 0 }, out: { diff: 1, bout: 0 } }],
    starter: `module top(input a, input b, input bin, output diff, output bout);

endmodule`,
    solution: `module top(input a, input b, input bin, output diff, output bout);
  assign diff = a ^ b ^ bin;
  assign bout = (~a & (b | bin)) | (b & bin);
endmodule`,
    golden: (i) => { const s = i.a - i.b - i.bin; return { diff: b(((s % 2) + 2) % 2), bout: b(s < 0 ? 1 : 0) }; },
  },
  {
    id: 'mux4', number: 18, title: '4-to-1 Multiplexer', difficulty: 'Medium', tags: ['mux', 'select'],
    statement: `Select one of four data inputs \`a\`, \`b\`, \`c\`, \`d\` using two select lines \`s1\`,\`s0\`.\n\n\`s1s0\` = 00→a, 01→b, 10→c, 11→d.`,
    hint: 'Nest ternaries: `s1 ? (s0 ? d : c) : (s0 ? b : a)`.',
    inputs: ['a', 'b', 'c', 'd', 's1', 's0'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 0, c: 0, d: 0, s1: 0, s0: 0 }, out: { y: 1 } }, { in: { a: 0, b: 0, c: 0, d: 1, s1: 1, s0: 1 }, out: { y: 1 } }],
    starter: `module top(input a, input b, input c, input d, input s1, input s0, output y);

endmodule`,
    solution: `module top(input a, input b, input c, input d, input s1, input s0, output y);
  assign y = s1 ? (s0 ? d : c) : (s0 ? b : a);
endmodule`,
    golden: (i) => { const sel = (i.s1 << 1) | i.s0; return { y: ([i.a, i.b, i.c, i.d][sel]) as Bit }; },
  },
  {
    id: 'dec2to4', number: 19, title: '2-to-4 Decoder', difficulty: 'Medium', tags: ['decoder', 'multi-output'],
    statement: `An enabled decoder. When \`en\` is 1, drive exactly one of \`y0..y3\` high, chosen by \`a1a0\` (00→y0 … 11→y3). When \`en\` is 0, all outputs are 0.`,
    hint: 'Each output ANDs en with the right input pattern, e.g. `y0 = en & ~a1 & ~a0;`.',
    inputs: ['a1', 'a0', 'en'], outputs: ['y0', 'y1', 'y2', 'y3'],
    examples: [{ in: { a1: 0, a0: 1, en: 1 }, out: { y0: 0, y1: 1, y2: 0, y3: 0 } }, { in: { a1: 1, a0: 1, en: 0 }, out: { y0: 0, y1: 0, y2: 0, y3: 0 } }],
    starter: `module top(input a1, input a0, input en, output y0, output y1, output y2, output y3);

endmodule`,
    solution: `module top(input a1, input a0, input en, output y0, output y1, output y2, output y3);
  assign y0 = en & ~a1 & ~a0;
  assign y1 = en & ~a1 &  a0;
  assign y2 = en &  a1 & ~a0;
  assign y3 = en &  a1 &  a0;
endmodule`,
    golden: (i) => { const s = (i.a1 << 1) | i.a0; return { y0: b(i.en && s === 0 ? 1 : 0), y1: b(i.en && s === 1 ? 1 : 0), y2: b(i.en && s === 2 ? 1 : 0), y3: b(i.en && s === 3 ? 1 : 0) }; },
  },
  {
    id: 'cmp1', number: 20, title: '1-Bit Comparator', difficulty: 'Medium', tags: ['comparator', 'multi-output'],
    statement: `Compare two 1-bit numbers \`a\` and \`b\`. Output \`gt\` (a>b), \`eq\` (a==b) and \`lt\` (a<b). Exactly one is high.`,
    hint: '`gt = a & ~b;`  `lt = ~a & b;`  `eq = ~(a ^ b);`',
    inputs: ['a', 'b'], outputs: ['gt', 'eq', 'lt'],
    examples: [{ in: { a: 1, b: 0 }, out: { gt: 1, eq: 0, lt: 0 } }, { in: { a: 1, b: 1 }, out: { gt: 0, eq: 1, lt: 0 } }],
    starter: `module top(input a, input b, output gt, output eq, output lt);

endmodule`,
    solution: `module top(input a, input b, output gt, output eq, output lt);
  assign gt = a & ~b;
  assign eq = ~(a ^ b);
  assign lt = ~a & b;
endmodule`,
    golden: (i) => ({ gt: b(i.a && !i.b ? 1 : 0), eq: b(i.a === i.b ? 1 : 0), lt: b(!i.a && i.b ? 1 : 0) }),
  },
  {
    id: 'cmp2', number: 21, title: '2-Bit Comparator', difficulty: 'Hard', tags: ['comparator', 'multi-output'],
    statement: `Compare two 2-bit numbers A=\`a1a0\` and B=\`b1b0\`. Output \`gt\`, \`eq\`, \`lt\`.`,
    hint: 'Equality is per-bit XNOR ANDed; greater-than checks the high bit first, then the low bit when the highs tie.',
    inputs: ['a1', 'a0', 'b1', 'b0'], outputs: ['gt', 'eq', 'lt'],
    examples: [{ in: { a1: 1, a0: 0, b1: 0, b0: 1 }, out: { gt: 1, eq: 0, lt: 0 }, note: '2 > 1' }, { in: { a1: 1, a0: 1, b1: 1, b0: 1 }, out: { gt: 0, eq: 1, lt: 0 } }],
    starter: `module top(input a1, input a0, input b1, input b0, output gt, output eq, output lt);

endmodule`,
    solution: `module top(input a1, input a0, input b1, input b0, output gt, output eq, output lt);
  assign eq = (a1 ~^ b1) & (a0 ~^ b0);
  assign gt = (a1 & ~b1) | ((a1 ~^ b1) & a0 & ~b0);
  assign lt = (~a1 & b1) | ((a1 ~^ b1) & ~a0 & b0);
endmodule`,
    golden: (i) => { const A = (i.a1 << 1) | i.a0, B = (i.b1 << 1) | i.b0; return { gt: b(A > B ? 1 : 0), eq: b(A === B ? 1 : 0), lt: b(A < B ? 1 : 0) }; },
  },
  {
    id: 'gray2', number: 22, title: 'Binary → Gray (2-bit)', difficulty: 'Medium', tags: ['encoding', 'xor'],
    statement: `Convert a 2-bit binary number \`b1b0\` to Gray code \`g1g0\`, where consecutive values differ in exactly one bit.\n\nThe MSB passes through; each lower Gray bit is the XOR of adjacent binary bits.`,
    hint: '`g1 = b1;`  `g0 = b1 ^ b0;`',
    inputs: ['b1', 'b0'], outputs: ['g1', 'g0'],
    examples: [{ in: { b1: 1, b0: 0 }, out: { g1: 1, g0: 1 }, note: 'bin 10 → gray 11' }, { in: { b1: 1, b0: 1 }, out: { g1: 1, g0: 0 } }],
    starter: `module top(input b1, input b0, output g1, output g0);

endmodule`,
    solution: `module top(input b1, input b0, output g1, output g0);
  assign g1 = b1;
  assign g0 = b1 ^ b0;
endmodule`,
    golden: (i) => ({ g1: i.b1, g0: b(i.b1 ^ i.b0) }),
  },
  {
    id: 'add2', number: 23, title: '2-Bit Adder', difficulty: 'Hard', tags: ['arithmetic', 'multi-output'],
    statement: `Add two 2-bit numbers A=\`a1a0\` and B=\`b1b0\`. Output the 2-bit sum \`s1s0\` and a carry-out \`cout\`.`,
    hint: 'Chain two full adders: the low bits produce s0 + an internal carry that feeds the high bit.',
    inputs: ['a1', 'a0', 'b1', 'b0'], outputs: ['s1', 's0', 'cout'],
    examples: [{ in: { a1: 1, a0: 1, b1: 0, b0: 1 }, out: { s1: 0, s0: 0, cout: 1 }, note: '3 + 1 = 100' }, { in: { a1: 0, a0: 1, b1: 0, b0: 1 }, out: { s1: 1, s0: 0, cout: 0 } }],
    starter: `module top(input a1, input a0, input b1, input b0, output s1, output s0, output cout);

endmodule`,
    solution: `module top(input a1, input a0, input b1, input b0, output s1, output s0, output cout);
  assign s0   = a0 ^ b0;
  assign s1   = a1 ^ b1 ^ (a0 & b0);
  assign cout = (a1 & b1) | ((a0 & b0) & (a1 ^ b1));
endmodule`,
    golden: (i) => { const S = ((i.a1 << 1) | i.a0) + ((i.b1 << 1) | i.b0); return { s1: b((S >> 1) & 1), s0: b(S & 1), cout: b((S >> 2) & 1) }; },
  },
  {
    id: 'parity4', number: 24, title: '4-Bit Parity', difficulty: 'Medium', tags: ['xor', 'parity'],
    statement: `Output \`y\` is 1 when an ODD number of the four inputs are 1 — a 4-bit parity generator.`,
    hint: '`y = a ^ b ^ c ^ d;`',
    inputs: ['a', 'b', 'c', 'd'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 1, c: 1, d: 0 }, out: { y: 1 } }, { in: { a: 1, b: 1, c: 1, d: 1 }, out: { y: 0 } }],
    starter: `module top(input a, input b, input c, input d, output y);

endmodule`,
    solution: `module top(input a, input b, input c, input d, output y);
  assign y = a ^ b ^ c ^ d;
endmodule`,
    golden: (i) => ({ y: b(i.a ^ i.b ^ i.c ^ i.d) }),
  },
  {
    id: 'prio4', number: 25, title: '4-to-2 Priority Encoder', difficulty: 'Hard', tags: ['encoder', 'priority', 'multi-output'],
    statement: `Encode the position of the HIGHEST-priority input that is 1. \`i3\` is highest, \`i0\` lowest.\n\nOutput the 2-bit index \`y1y0\` and a \`valid\` bit (0 when no input is set).`,
    hint: 'Check i3 first, then i2, i1, i0. `valid = i3|i2|i1|i0`.',
    inputs: ['i3', 'i2', 'i1', 'i0'], outputs: ['y1', 'y0', 'valid'],
    examples: [{ in: { i3: 0, i2: 1, i1: 0, i0: 1 }, out: { y1: 1, y0: 0, valid: 1 }, note: 'i2 wins → 10' }, { in: { i3: 0, i2: 0, i1: 0, i0: 0 }, out: { y1: 0, y0: 0, valid: 0 } }],
    starter: `module top(input i3, input i2, input i1, input i0, output y1, output y0, output valid);

endmodule`,
    solution: `module top(input i3, input i2, input i1, input i0, output y1, output y0, output valid);
  assign valid = i3 | i2 | i1 | i0;
  assign y1 = i3 | i2;
  assign y0 = i3 | (~i2 & i1);
endmodule`,
    golden: (i) => {
      let y1 = 0, y0 = 0; const valid = (i.i3 | i.i2 | i.i1 | i.i0);
      if (i.i3) { y1 = 1; y0 = 1; } else if (i.i2) { y1 = 1; y0 = 0; } else if (i.i1) { y1 = 0; y0 = 1; } else if (i.i0) { y1 = 0; y0 = 0; }
      return { y1: b(y1), y0: b(y0), valid: b(valid) };
    },
  },
  {
    id: 'alu1', number: 26, title: '1-Bit ALU', difficulty: 'Hard', tags: ['alu', 'select'],
    statement: `A tiny ALU. Two op-select bits \`op1op0\` choose the operation on \`a\`,\`b\`:\n\n00 → AND, 01 → OR, 10 → XOR, 11 → NOT a. Output the result \`y\`.`,
    hint: 'It is a 4-to-1 mux whose data inputs are `a&b`, `a|b`, `a^b`, and `~a`.',
    inputs: ['a', 'b', 'op1', 'op0'], outputs: ['y'],
    examples: [{ in: { a: 1, b: 0, op1: 0, op0: 0 }, out: { y: 0 }, note: 'AND' }, { in: { a: 1, b: 0, op1: 1, op0: 1 }, out: { y: 0 }, note: 'NOT a' }],
    starter: `module top(input a, input b, input op1, input op0, output y);

endmodule`,
    solution: `module top(input a, input b, input op1, input op0, output y);
  assign y = op1 ? (op0 ? ~a : (a ^ b)) : (op0 ? (a | b) : (a & b));
endmodule`,
    golden: (i) => { const op = (i.op1 << 1) | i.op0; const y = op === 0 ? (i.a & i.b) : op === 1 ? (i.a | i.b) : op === 2 ? (i.a ^ i.b) : (~i.a & 1); return { y: b(y) }; },
  },

  // ── sequential tier: edge-triggered flip-flops (clocked, graded per cycle) ──
  {
    kind: 'seq', id: 'dff', number: 27, title: 'D Flip-Flop', difficulty: 'Medium', tags: ['sequential', 'flip-flop', 'clocked'],
    statement:
      `Your first CLOCKED circuit. On every rising edge of \`clk\`, capture input \`d\` into the register \`q\` — and \`q\` then holds that value until the next edge.\n\n` +
      `Use a non-blocking assignment (\`<=\`) inside an \`always @(posedge clk)\` block, with \`q\` declared as \`output reg\`.`,
    hint: "`always @(posedge clk) q <= d;`",
    clock: 'clk', dataInputs: ['d'], regOutputs: ['q'],
    inputs: ['clk', 'd'], outputs: ['q'],
    examples: [{ in: { d: 1 }, out: { q: 1 }, note: 'after the edge, q follows d' }],
    starter: `module top(input clk, input d, output reg q);
  always @(posedge clk) begin
    // q <= ?
  end
endmodule`,
    solution: `module top(input clk, input d, output reg q);
  always @(posedge clk) q <= d;
endmodule`,
    vectors: [{ d: 0 }, { d: 1 }, { d: 1 }, { d: 0 }, { d: 1 }, { d: 0 }, { d: 0 }, { d: 1 }],
    step: (_s, i) => ({ q: (i.d ? 1 : 0) as Bit }),
  },
  {
    kind: 'seq', id: 'dff_rst', number: 28, title: 'D Flip-Flop + Async Reset', difficulty: 'Medium', tags: ['sequential', 'flip-flop', 'reset'],
    statement:
      `A D flip-flop with an asynchronous, active-high reset \`rst\`.\n\n` +
      `While \`rst\` is 1, force \`q\` to 0 no matter the clock. Otherwise, on each rising edge of \`clk\`, capture \`d\` into \`q\`.`,
    hint: "`always @(posedge clk or posedge rst) if (rst) q <= 1'b0; else q <= d;`",
    clock: 'clk', reset: 'rst', dataInputs: ['d'], regOutputs: ['q'],
    inputs: ['clk', 'rst', 'd'], outputs: ['q'],
    examples: [{ in: { d: 1, rst: 1 }, out: { q: 0 }, note: 'reset wins' }, { in: { d: 1, rst: 0 }, out: { q: 1 } }],
    starter: `module top(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst) begin
    // if (rst) ... else ...
  end
endmodule`,
    solution: `module top(input clk, input rst, input d, output reg q);
  always @(posedge clk or posedge rst)
    if (rst) q <= 1'b0;
    else     q <= d;
endmodule`,
    vectors: [{ rst: 1, d: 1 }, { rst: 0, d: 1 }, { rst: 0, d: 0 }, { rst: 0, d: 1 }, { rst: 1, d: 1 }, { rst: 0, d: 0 }, { rst: 0, d: 1 }, { rst: 0, d: 1 }],
    step: (_s, i) => ({ q: (i.rst ? 0 : (i.d ? 1 : 0)) as Bit }),
  },
  {
    kind: 'seq', id: 'tff', number: 29, title: 'T Flip-Flop', difficulty: 'Medium', tags: ['sequential', 'flip-flop', 'toggle'],
    statement:
      `A toggle flip-flop. On each rising edge of \`clk\`: if \`t\` is 1, flip \`q\` to its opposite; if \`t\` is 0, hold \`q\`.\n\n` +
      `The next state references the CURRENT \`q\` — exactly what a register lets you do.`,
    hint: "`q <= q ^ t;`  (or `q <= t ? ~q : q;`)",
    clock: 'clk', dataInputs: ['t'], regOutputs: ['q'],
    inputs: ['clk', 't'], outputs: ['q'],
    examples: [{ in: { t: 1 }, out: { q: 1 }, note: 'from q=0, toggle -> 1' }, { in: { t: 0 }, out: { q: 1 }, note: 'hold' }],
    starter: `module top(input clk, input t, output reg q);
  always @(posedge clk) begin
    // q <= ?
  end
endmodule`,
    solution: `module top(input clk, input t, output reg q);
  always @(posedge clk) q <= q ^ t;
endmodule`,
    vectors: [{ t: 1 }, { t: 1 }, { t: 0 }, { t: 1 }, { t: 1 }, { t: 1 }, { t: 0 }, { t: 1 }],
    step: (s, i) => ({ q: (((s.q ? 1 : 0) ^ (i.t ? 1 : 0)) & 1) as Bit }),
  },
  {
    kind: 'seq', id: 'jkff', number: 30, title: 'JK Flip-Flop', difficulty: 'Hard', tags: ['sequential', 'flip-flop'],
    statement:
      `The universal flip-flop. On each rising edge of \`clk\`, inputs \`j\`,\`k\` decide the next \`q\`:\n\n` +
      `\`00\` hold · \`01\` reset to 0 · \`10\` set to 1 · \`11\` toggle.`,
    hint: "One expression captures all four cases: `q <= (j & ~q) | (~k & q);`",
    clock: 'clk', dataInputs: ['j', 'k'], regOutputs: ['q'],
    inputs: ['clk', 'j', 'k'], outputs: ['q'],
    examples: [{ in: { j: 1, k: 0 }, out: { q: 1 }, note: 'set' }, { in: { j: 1, k: 1 }, out: { q: 0 }, note: 'toggle from 1' }],
    starter: `module top(input clk, input j, input k, output reg q);
  always @(posedge clk) begin
    // q <= ?
  end
endmodule`,
    solution: `module top(input clk, input j, input k, output reg q);
  always @(posedge clk) q <= (j & ~q) | (~k & q);
endmodule`,
    vectors: [{ j: 1, k: 0 }, { j: 0, k: 0 }, { j: 0, k: 1 }, { j: 1, k: 1 }, { j: 1, k: 1 }, { j: 0, k: 0 }, { j: 1, k: 0 }, { j: 0, k: 1 }],
    step: (s, i) => {
      const q = s.q ? 1 : 0, j = i.j ? 1 : 0, k = i.k ? 1 : 0;
      return { q: (((j & (~q & 1)) | ((~k & 1) & q)) & 1) as Bit };
    },
  },
];

export const getProblem = (id: string): AnyProblem | undefined =>
  VERILOG_PROBLEMS.find((p) => p.id === id);
