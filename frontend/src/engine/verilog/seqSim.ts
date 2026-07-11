/**
 * seqSim — a minimal CLOCKED extension of miniSim for the sequential tier.
 *
 * Grades single-bit, edge-triggered flip-flops of the form:
 *
 *   module top(input clk, [input rst,] <data inputs...>, output reg q [, ...]);
 *     always @(posedge clk [or posedge rst])
 *       [if (rst) q <= 1'b0; else] q <= <expr>;
 *   endmodule
 *
 * One `always` block, non-blocking (`<=`) assignments to `output reg`s, and an
 * optional active-high async reset. Next-state expressions reuse miniSim's
 * combinational parser and may reference the data inputs AND the current reg
 * values. NOT supported (later tiers): buses / multi-bit counters / FSMs /
 * `case` / blocking `=` / enables via nested `if`.
 */
import { parseExpr, evalExpr, stripComments, type Expr, type Bit } from './miniSim';

export interface SeqModule {
  name: string;
  clock: string;
  reset?: string;
  inputs: string[];               // data inputs (excludes clk & reset)
  regs: string[];                 // output reg names (state)
  next: Map<string, Expr>;        // reg -> next-state expression
  resetVals: Map<string, Bit>;    // reg -> value while reset is asserted
}

export type SeqCompile = { ok: true; module: SeqModule } | { ok: false; error: string };

export function compileSeq(src: string): SeqCompile {
  try {
    const clean = stripComments(src);
    const mm = /\bmodule\b([\s\S]*?)\bendmodule\b/.exec(clean);
    if (!mm) return { ok: false, error: 'No `module … endmodule` found.' };
    const inner = mm[1];
    const semi = inner.indexOf(';');
    if (semi === -1) return { ok: false, error: 'Module header is missing its `;`.' };
    const header = inner.slice(0, semi);
    const body = inner.slice(semi + 1);

    const hMatch = /^\s*([A-Za-z_]\w*)\s*(?:\(([\s\S]*)\))?\s*$/.exec(header);
    if (!hMatch) return { ok: false, error: 'Could not parse the module header.' };
    const name = hMatch[1];
    const portText = hMatch[2] ?? '';

    const dir = new Map<string, 'input' | 'output'>();
    const isReg = new Set<string>();
    const note = (kind: string | undefined, reg: boolean, nm: string) => {
      if (kind === 'input' || kind === 'output') dir.set(nm, kind);
      if (reg) isReg.add(nm);
    };

    // ANSI header ports
    if (portText.trim()) {
      for (const seg of portText.split(',')) {
        const m = /^\s*(input|output|inout)?\s*(reg|wire|logic)?\s*(?:\[[^\]]*\])?\s*([A-Za-z_]\w*)\s*$/.exec(seg);
        if (!m) return { ok: false, error: `Could not parse port '${seg.trim()}'.` };
        note(m[1], m[2] === 'reg', m[3]);
      }
    }
    // non-ANSI / body declarations (e.g. `output q; reg q;`)
    const declRe = /\b(input|output|inout|reg|wire|logic)\b([^;=]*);/g;
    let dm: RegExpExecArray | null;
    while ((dm = declRe.exec(body))) {
      const kind = dm[1];
      const reg = kind === 'reg' || /\breg\b/.test(dm[2]);
      const names = (dm[2].replace(/\[[^\]]*\]/g, ' ').match(/[A-Za-z_]\w*/g) ?? [])
        .filter((n) => !['reg', 'wire', 'logic', 'signed'].includes(n));
      for (const nm of names) note(kind === 'input' || kind === 'output' ? kind : undefined, reg, nm);
    }

    // the always block
    const aMatch = /\balways\b\s*@\s*\(([^)]*)\)([\s\S]*)$/.exec(body);
    if (!aMatch) return { ok: false, error: 'A flip-flop needs an `always @(posedge clk …)` block.' };
    const sens = aMatch[1];
    const blockRaw = aMatch[2].trim();

    const edges = [...sens.matchAll(/\b(?:posedge|negedge)\s+([A-Za-z_]\w*)/g)].map((x) => x[1]);
    if (edges.length === 0) return { ok: false, error: 'Use `@(posedge clk)` — this tier is edge-triggered.' };
    const clock = edges[0];
    const resetFromSens = edges[1];

    const stripBE = (s: string) => s.replace(/\bbegin\b/g, ' ').replace(/\bend\b/g, ' ').trim();

    const next = new Map<string, Expr>();
    const resetVals = new Map<string, Bit>();
    let resetName: string | undefined;

    // optional reset:  if (rst) <reset assigns> else <main assigns>
    const ifMatch = /^\s*if\s*\(\s*([A-Za-z_]\w*)\s*\)\s*([\s\S]*?)\s*\belse\b\s*([\s\S]*)$/.exec(blockRaw);
    let mainBlock = blockRaw;
    if (ifMatch) {
      resetName = ifMatch[1];
      const resetBody = stripBE(ifMatch[2]);
      mainBlock = ifMatch[3];
      for (const a of resetBody.matchAll(/([A-Za-z_]\w*)\s*<=\s*([^;]+);/g)) {
        let v: Bit = 0;
        try { v = evalExpr(parseExpr(a[2]), new Map()) ?? 0; } catch { v = 0; }
        resetVals.set(a[1], v);
      }
    }
    mainBlock = stripBE(mainBlock);

    for (const a of mainBlock.matchAll(/([A-Za-z_]\w*)\s*<=\s*([^;]+);/g)) {
      const lhs = a[1];
      let e: Expr;
      try { e = parseExpr(a[2]); }
      catch (err) { return { ok: false, error: `In \`${lhs} <= …\`: ${(err as Error).message}.` }; }
      next.set(lhs, e);
    }

    if (next.size === 0) return { ok: false, error: 'The always block has no `q <= …;` assignment yet.' };

    const reset = resetName ?? resetFromSens;
    const regs = [...next.keys()];
    for (const r of regs) {
      if (dir.get(r) !== 'output') return { ok: false, error: `Register '${r}' must be declared as an \`output reg\`.` };
      if (!isReg.has(r)) return { ok: false, error: `'${r}' is clocked, so declare it \`output reg ${r}\`.` };
    }

    const skip = new Set([clock, reset].filter(Boolean) as string[]);
    const inputs = [...dir.entries()].filter(([n, d]) => d === 'input' && !skip.has(n)).map(([n]) => n);

    return { ok: true, module: { name, clock, reset, inputs, regs, next, resetVals } };
  } catch (e) {
    return { ok: false, error: (e as Error).message || 'Failed to compile sequential module.' };
  }
}

/**
 * Advance one clock edge. `state` = current reg values; returns the next reg
 * values. Async reset is dominant (matches the golden used for grading).
 */
export function stepSeq(mod: SeqModule, state: Record<string, Bit>, inputs: Record<string, Bit>): Record<string, Bit> {
  if (mod.reset && inputs[mod.reset]) {
    const out: Record<string, Bit> = {};
    for (const r of mod.regs) out[r] = mod.resetVals.get(r) ?? 0;
    return out;
  }
  const vals = new Map<string, Bit>();
  for (const i of mod.inputs) vals.set(i, (inputs[i] ? 1 : 0) as Bit);
  for (const r of mod.regs) vals.set(r, (state[r] ? 1 : 0) as Bit);
  const out: Record<string, Bit> = {};
  for (const r of mod.regs) {
    const v = evalExpr(mod.next.get(r)!, vals);
    out[r] = (v ?? 0) as Bit;
  }
  return out;
}
