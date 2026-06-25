/**
 * Problem bank for the Hardware-LeetCode Verilog judge.
 *
 * BASIC tier: single-bit combinational logic that the in-browser miniSim can
 * grade exhaustively (gates → mux → half adder). Each problem ships a `golden`
 * reference model (plain JS) that the grader diffs the student's circuit against
 * over every input combination.
 *
 * Adding a problem: give it single-bit `inputs`/`outputs`, a `golden` function,
 * `starter` code whose ports match, and a `solution` for the "reveal" button.
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
  solution: string;
  golden: (i: Record<string, Bit>) => Record<string, Bit>;
}

const b = (x: number): Bit => (x & 1) as Bit;

export const VERILOG_PROBLEMS: VProblem[] = [
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
];

export const getProblem = (id: string): VProblem | undefined =>
  VERILOG_PROBLEMS.find((p) => p.id === id);
