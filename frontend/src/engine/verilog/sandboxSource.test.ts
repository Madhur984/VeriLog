/**
 * Source bundling and diagnostics — checked against the REAL Yosys engine.
 *
 * The bug these guard against is subtle and was invisible in the UI: the two
 * editors are concatenated into one buffer, so before `\`line` directives an
 * error on testbench.v line 3 was reported as line 8 — a real line number,
 * pointing at innocent code in the other file. Nothing type-checks that. Only
 * running the engine and asserting on the location catches it.
 */
import { describe, it, expect } from 'vitest';
import { synthesizeNode } from './testing/yosysNode';
import {
  buildSandboxSource, lintSandbox, mergeDiagnostics, DESIGN_FILE, TB_FILE,
} from './sandboxSource';
import { parseDiagnostics, explainDiagnostic, type Diag } from './diagnostics';

const TIMEOUT = 120_000;

const GOOD_DESIGN = `module top(input clk, input a, output y);
  assign y = a & clk;
endmodule
`;

describe('buildSandboxSource + Yosys line attribution', () => {
  it('blames the testbench for a testbench error, at the right line', async () => {
    // The error is on line 3 OF THE TESTBENCH. Concatenated it lands on line 8.
    const tb = `module tb(input clk, output y);
  reg drive;
  top uut(.clk(clk) .a(drive), .y(y));
endmodule
`;
    const { log } = await synthesizeNode(buildSandboxSource(GOOD_DESIGN, tb));
    const err = parseDiagnostics(log).find((d) => d.severity === 'error')!;
    expect(err).toBeTruthy();
    expect(err.file).toBe(TB_FILE);
    expect(err.line).toBe(3);
  }, TIMEOUT);

  it('blames the design for a design error, at the right line', async () => {
    const design = `module top (sum, cout, a, b)
input a,b;
output sum,cout;
assign sum = a^b;
endmodule
`;
    const { log } = await synthesizeNode(buildSandboxSource(design, ''));
    const err = parseDiagnostics(log).find((d) => d.severity === 'error')!;
    expect(err.file).toBe(DESIGN_FILE);
    expect(err.line).toBe(2);
  }, TIMEOUT);

  it('does not change what gets synthesized', async () => {
    const tb = `module tb(input clk, output y);
  top uut(.clk(clk), .a(1'b1), .y(y));
endmodule
`;
    const plain = await synthesizeNode(`${GOOD_DESIGN}\n\n${tb}`);
    const bundled = await synthesizeNode(buildSandboxSource(GOOD_DESIGN, tb));
    expect(bundled.json).toBeTruthy();
    const names = (j: string) => Object.keys(JSON.parse(j).modules).sort();
    const cellCount = (j: string) =>
      Object.values(JSON.parse(j).modules as Record<string, { cells?: object }>)
        .reduce((n, m) => n + Object.keys(m.cells ?? {}).length, 0);
    expect(names(bundled.json)).toEqual(names(plain.json));
    expect(cellCount(bundled.json)).toBe(cellCount(plain.json));
  }, TIMEOUT);

  it('omits the testbench directive when there is no testbench', () => {
    expect(buildSandboxSource(GOOD_DESIGN, '   \n')).not.toContain(TB_FILE);
    expect(buildSandboxSource(GOOD_DESIGN, '')).toContain(DESIGN_FILE);
  });
});

describe('explainDiagnostic', () => {
  // Each case is a real Verilog mistake; the message is whatever Yosys says
  // about it today, so the explanation table cannot drift away from the engine.
  const CASES: { name: string; src: string; expect: RegExp }[] = [
    {
      name: 'missing semicolon after a Verilog-1995 port list',
      src: 'module top (a, b)\ninput a,b;\nendmodule\n',
      expect: /missing its semicolon/i,
    },
    {
      name: 'missing endmodule',
      src: 'module top(input a, output y);\nassign y=a;\n',
      expect: /ended while something was still open/i,
    },
    {
      name: 'missing comma between port connections',
      src: 'module m(input a, output y); assign y=a; endmodule\n'
        + 'module top(input a, output y);\n m u(.a(a) .y(y));\nendmodule\n',
      expect: /not separated by a comma/i,
    },
    {
      name: 'undeclared identifier',
      src: 'module top(input a, output y);\nassign y = a & zz;\nendmodule\n',
      expect: /never declared/i,
    },
    {
      name: 'reg driven by continuous assignment',
      src: 'module top(input a, output reg y);\nassign y = a;\nendmodule\n',
      expect: /declared `reg` but driven by an `assign`/i,
    },
    {
      name: 'instantiating a module that does not exist',
      src: 'module top(input a, output y);\nnope u(.a(a),.y(y));\nendmodule\n',
      expect: /no such module is defined/i,
    },
    {
      name: 'invalid digit for the base',
      src: "module top(output [3:0] y);\nassign y = 4'b12x;\nendmodule\n",
      expect: /does not exist in base 2/i,
    },
  ];

  for (const c of CASES) {
    it(`explains: ${c.name}`, async () => {
      const { log } = await synthesizeNode(buildSandboxSource(c.src, ''));
      const diags = parseDiagnostics(log).filter((d) => d.severity !== 'note');
      expect(diags.length).toBeGreaterThan(0);
      const explained = diags.map(explainDiagnostic).filter(Boolean);
      expect(explained.length).toBeGreaterThan(0);
      const all = explained.map((e) => `${e!.cause} ${e!.fix}`).join('\n');
      expect(all).toMatch(c.expect);
    }, TIMEOUT);
  }

  it('returns nothing rather than inventing an explanation', () => {
    expect(explainDiagnostic({ severity: 'error', message: 'something entirely novel' }))
      .toBeUndefined();
  });
});

describe('lintNonSynthesizable', () => {
  it('flags the constructs Yosys silently discards', () => {
    const tb = `module tb(output reg y);
  initial y = 0;
  always @(*) begin
    #10 y = 1;
    $display("y=%b", y);
    $finish;
  end
endmodule
`;
    const notes = lintSandbox('module top(); endmodule\n', tb);
    const text = notes.map((n) => n.message).join('\n');
    expect(text).toMatch(/initial/i);
    expect(text).toMatch(/delay/i);
    expect(text).toMatch(/text output/i);
    expect(text).toMatch(/\$finish/i);
    // Every note points at the testbench, not the design.
    expect(notes.every((n) => n.file === TB_FILE)).toBe(true);
  });

  it('rates $finish an error, because Yosys aborts on it', async () => {
    // Verified against the engine below: this is not a stylistic preference,
    // $finish genuinely prevents a netlist from being produced.
    const tb = 'module tb(input clk);\n initial $finish;\nendmodule\n';
    const finish = lintSandbox('module top(); endmodule\n', tb)
      .find((d) => /\$finish/.test(d.message))!;
    expect(finish.severity).toBe('error');

    const { json, diagnostics } = await synthesizeNode(
      buildSandboxSource('module top(input clk, output y); assign y = clk; endmodule\n', tb));
    expect(json).toBeFalsy();
    expect(diagnostics.some((d) => d.severity === 'error')).toBe(true);
  }, TIMEOUT);

  it('explains both shapes of the $finish failure', async () => {
    const inInitial = 'module top(input clk, output y);\n assign y = clk;\n initial $finish;\nendmodule\n';
    const outside = 'module top(input clk, output reg y);\n always @(posedge clk) begin y <= ~y; $finish; end\nendmodule\n';
    for (const src of [inInitial, outside]) {
      const { log } = await synthesizeNode(buildSandboxSource(src, ''));
      const err = parseDiagnostics(log).find((d) => d.severity === 'error')!;
      expect(err).toBeTruthy();
      const ex = explainDiagnostic(err);
      expect(ex?.fix).toMatch(/cycles box/i);
    }
  }, TIMEOUT);

  it('reports each construct once, not once per occurrence', () => {
    const src = `module tb();
  initial begin
    $display("a");
    $display("b");
    $display("c");
  end
endmodule
`;
    const notes = lintSandbox(src, '');
    expect(notes.filter((n) => /text output/i.test(n.message))).toHaveLength(1);
  });

  it('ignores keywords inside comments and strings', () => {
    const src = `module top(input a, output y);
  // this initial comment mentions $display and #5 delays
  /* and $finish in a block comment */
  assign y = a;   // "initial"
endmodule
`;
    expect(lintSandbox(src, '')).toEqual([]);
  });

  it('says nothing about a clean synthesizable testbench', () => {
    const tb = `module tb(input clk, input rst, output [3:0] count);
  reg [3:0] tick;
  always @(posedge clk) tick <= rst ? 4'd0 : tick + 1'b1;
  top uut(.clk(clk), .rst(rst), .count(count));
endmodule
`;
    expect(lintSandbox(GOOD_DESIGN, tb)).toEqual([]);
  });

  it('does not repeat what Yosys already said about the same line', () => {
    const yosys: Diag[] = [
      { severity: 'error', file: TB_FILE, line: 7, message: "System task `$finish' executed." },
    ];
    const lint: Diag[] = [
      { severity: 'error', file: TB_FILE, line: 7, message: '`$finish` / `$stop` is not supported…' },
      { severity: 'note', file: TB_FILE, line: 3, message: '`initial` block is ignored…' },
    ];
    const merged = mergeDiagnostics(yosys, lint);
    expect(merged).toHaveLength(2);
    expect(merged.filter((d) => d.line === 7)).toHaveLength(1);
    // Yosys keeps the line it spoke for; the unrelated note survives.
    expect(merged[0].message).toMatch(/executed/);
    expect(merged[1].line).toBe(3);
  });

  it('keeps lint for lines Yosys never mentioned', () => {
    const merged = mergeDiagnostics(
      [{ severity: 'error', file: DESIGN_FILE, line: 2, message: 'x' }],
      [{ severity: 'note', file: TB_FILE, line: 2, message: 'y' }],
    );
    // Same line number, different file — not a duplicate.
    expect(merged).toHaveLength(2);
  });

  it('points at the line the construct is actually on', () => {
    const notes = lintSandbox('module t();\n\n\n  initial x = 0;\nendmodule\n', '');
    expect(notes[0].line).toBe(4);
    expect(notes[0].file).toBe(DESIGN_FILE);
  });
});
