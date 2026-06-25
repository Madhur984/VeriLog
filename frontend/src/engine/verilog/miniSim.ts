/**
 * miniSim — a tiny, dependency-free Verilog simulator for the "basic" tier of
 * the Hardware-LeetCode judge.
 *
 * Scope (deliberately small, runs 100% in the browser):
 *   - single-bit signals only (gates, muxes, half/full adders by bit)
 *   - continuous `assign lhs = expr;`
 *   - gate primitives: and/or/not/nand/nor/xor/xnor/buf  (out is the first port)
 *   - expression ops: ~ ! & && | || ^ ~^ ^~ ( ) ?:   and 0/1/1'b0/1'b1 literals
 *   - ANSI (`module m(input a, output y);`) and non-ANSI headers
 *
 * NOT supported yet (these belong to later tiers): vectors/buses, always blocks,
 * if/case, sequential logic. A design that uses them compiles to a clear error
 * rather than grading wrong.
 *
 * The grader compiles the student source once, then evaluates the resulting
 * network against every input combination and diffs it with a golden model.
 */

export type Bit = 0 | 1;

// ─── Expression AST ──────────────────────────────────────────────────────────
type Expr =
  | { k: 'const'; v: Bit }
  | { k: 'id'; name: string }
  | { k: 'not'; a: Expr }
  | { k: 'bin'; op: '&' | '|' | '^' | '~^'; a: Expr; b: Expr }
  | { k: 'mux'; s: Expr; t: Expr; f: Expr };

export interface SimModule {
  name: string;
  inputs: string[];
  outputs: string[];
  internals: string[];
  /** signal name -> the expression continuously driving it */
  drivers: Map<string, Expr>;
}

export type CompileResult =
  | { ok: true; module: SimModule }
  | { ok: false; error: string };

// ─── helpers ─────────────────────────────────────────────────────────────────
const stripComments = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

const BASE: Record<string, number> = { b: 2, o: 8, d: 10, h: 16 };

/** Parse a Verilog integer literal and return its least-significant bit. */
function literalBit(raw: string): Bit {
  const tick = raw.indexOf("'");
  if (tick === -1) return (parseInt(raw, 10) & 1) as Bit;
  const spec = raw.slice(tick + 1).replace(/^s/i, '');
  const base = BASE[spec[0].toLowerCase()] ?? 2;
  const digits = spec.slice(1).replace(/[xz_]/gi, '0');
  const val = parseInt(digits, base);
  return ((Number.isNaN(val) ? 0 : val) & 1) as Bit;
}

// ─── expression tokenizer + Pratt-ish parser ─────────────────────────────────
type ETok = { t: 'id' | 'num' | 'op'; v: string };

function lexExpr(s: string): ETok[] {
  const toks: ETok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9']/.test(c)) {
      const m = /^(\d+)?'[sS]?[bodhBODH][0-9a-fA-FxXzZ_]+|^\d+/.exec(s.slice(i));
      if (m) { toks.push({ t: 'num', v: m[0] }); i += m[0].length; continue; }
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_]\w*/.exec(s.slice(i))!;
      toks.push({ t: 'id', v: m[0] }); i += m[0].length; continue;
    }
    const two = s.slice(i, i + 2);
    if (two === '&&' || two === '||') { toks.push({ t: 'op', v: two[0] }); i += 2; continue; }
    if (two === '~^' || two === '^~') { toks.push({ t: 'op', v: '~^' }); i += 2; continue; }
    if ('~!&|^()?:'.includes(c)) { toks.push({ t: 'op', v: c }); i++; continue; }
    throw new Error(`unexpected character '${c}'`);
  }
  return toks;
}

function parseExpr(src: string): Expr {
  const toks = lexExpr(src);
  let p = 0;
  const peek = () => toks[p];
  const eat = (v?: string) => {
    const tk = toks[p];
    if (!tk) throw new Error('unexpected end of expression');
    if (v && tk.v !== v) throw new Error(`expected '${v}'`);
    p++; return tk;
  };
  const isOp = (v: string) => peek()?.t === 'op' && peek()?.v === v;

  const ternary = (): Expr => {
    const cond = orExpr();
    if (isOp('?')) {
      eat('?'); const t = ternary(); eat(':'); const f = ternary();
      return { k: 'mux', s: cond, t, f };
    }
    return cond;
  };
  const orExpr = (): Expr => {
    let left = xorExpr();
    while (isOp('|')) { eat('|'); left = { k: 'bin', op: '|', a: left, b: xorExpr() }; }
    return left;
  };
  const xorExpr = (): Expr => {
    let left = andExpr();
    while (isOp('^') || isOp('~^')) { const op = eat().v as '^' | '~^'; left = { k: 'bin', op, a: left, b: andExpr() }; }
    return left;
  };
  const andExpr = (): Expr => {
    let left = unary();
    while (isOp('&')) { eat('&'); left = { k: 'bin', op: '&', a: left, b: unary() }; }
    return left;
  };
  const unary = (): Expr => {
    if (isOp('~') || isOp('!')) { eat(); return { k: 'not', a: unary() }; }
    return primary();
  };
  const primary = (): Expr => {
    if (isOp('(')) { eat('('); const e = ternary(); eat(')'); return e; }
    const tk = peek();
    if (!tk) throw new Error('unexpected end of expression');
    if (tk.t === 'num') { eat(); return { k: 'const', v: literalBit(tk.v) }; }
    if (tk.t === 'id') { eat(); return { k: 'id', name: tk.v }; }
    throw new Error(`unexpected token '${tk.v}'`);
  };

  const out = ternary();
  if (p !== toks.length) throw new Error(`unexpected token '${peek()?.v}'`);
  return out;
}

/** Collect identifier names referenced by an expression. */
function refsOf(e: Expr, acc: Set<string>): void {
  switch (e.k) {
    case 'id': acc.add(e.name); break;
    case 'not': refsOf(e.a, acc); break;
    case 'bin': refsOf(e.a, acc); refsOf(e.b, acc); break;
    case 'mux': refsOf(e.s, acc); refsOf(e.t, acc); refsOf(e.f, acc); break;
  }
}

// ─── module compiler ─────────────────────────────────────────────────────────
function gateExpr(type: string, ins: string[]): Expr {
  const ids: Expr[] = ins.map((n) => ({ k: 'id', name: n }));
  const fold = (op: '&' | '|' | '^'): Expr => ids.reduce((a, b) => ({ k: 'bin', op, a, b }));
  switch (type) {
    case 'buf': return ids[0];
    case 'not': return { k: 'not', a: ids[0] };
    case 'and': return fold('&');
    case 'or': return fold('|');
    case 'xor': return fold('^');
    case 'nand': return { k: 'not', a: fold('&') };
    case 'nor': return { k: 'not', a: fold('|') };
    case 'xnor': return { k: 'not', a: fold('^') };
    default: throw new Error(`unknown gate '${type}'`);
  }
}

export function compileVerilog(src: string): CompileResult {
  try {
    const clean = stripComments(src);
    const mod = /\bmodule\b([\s\S]*?)\bendmodule\b/.exec(clean);
    if (!mod) return { ok: false, error: 'No `module … endmodule` found.' };

    const semi = mod[1].indexOf(';');
    if (semi === -1) return { ok: false, error: 'Module header is missing its `;`.' };
    const header = mod[1].slice(0, semi);
    const body = mod[1].slice(semi + 1);

    const hMatch = /^\s*([A-Za-z_]\w*)\s*(?:\(([\s\S]*)\))?\s*$/.exec(header);
    if (!hMatch) return { ok: false, error: 'Could not parse the module header.' };
    const name = hMatch[1];
    const portText = hMatch[2] ?? '';

    const dir = new Map<string, 'input' | 'output'>();
    const declared = new Set<string>();
    const order: string[] = [];

    const noteDecl = (kind: string, namesBlob: string) => {
      const names = namesBlob.replace(/\[[^\]]*\]/g, ' ').match(/[A-Za-z_]\w*/g) ?? [];
      for (const n of names) {
        declared.add(n);
        if (kind === 'input' || kind === 'output') dir.set(n, kind);
        if (!order.includes(n)) order.push(n);
      }
    };

    // ANSI ports declared in the header
    if (portText.trim()) {
      for (const seg of portText.split(',')) {
        const m = /^\s*(input|output|inout)?\s*(?:wire|reg|logic)?\s*(?:\[[^\]]*\])?\s*([A-Za-z_]\w*)\s*$/.exec(seg);
        if (!m) return { ok: false, error: `Could not parse port '${seg.trim()}'.` };
        noteDecl(m[1] ?? 'port', m[2]);
      }
    }

    // Non-ANSI / body declarations
    const declRe = /\b(input|output|inout|wire|reg|logic)\b([^;]*);/g;
    let dm: RegExpExecArray | null;
    while ((dm = declRe.exec(body))) noteDecl(dm[1], dm[2]);

    const drivers = new Map<string, Expr>();

    // gate-primitive instances:  and g1 (y, a, b);
    const gateRe = /\b(and|or|not|nand|nor|xor|xnor|buf)\b\s*(?:[A-Za-z_]\w*\s*)?\(([^)]*)\)\s*;/g;
    let gm: RegExpExecArray | null;
    while ((gm = gateRe.exec(body))) {
      const type = gm[1];
      const args = gm[2].split(',').map((s) => s.trim()).filter(Boolean);
      if (args.length < 2) return { ok: false, error: `Gate '${type}' needs an output and at least one input.` };
      const outName = args[0];
      const ins = args.slice(1);
      if (!/^[A-Za-z_]\w*$/.test(outName)) return { ok: false, error: `Gate output '${outName}' must be a plain signal.` };
      if ((type === 'not' || type === 'buf') && ins.length !== 1)
        return { ok: false, error: `'${type}' takes exactly one input.` };
      drivers.set(outName, gateExpr(type, ins));
      if (!declared.has(outName)) { declared.add(outName); order.push(outName); }
    }

    // continuous assignments:  assign y = a & b;
    const assignRe = /\bassign\b\s+([^=;]+?)\s*=\s*([^;]+);/g;
    let am: RegExpExecArray | null;
    while ((am = assignRe.exec(body))) {
      const lhs = am[1].trim();
      if (!/^[A-Za-z_]\w*$/.test(lhs))
        return { ok: false, error: `Left side of assign must be a single signal, got '${lhs}'.` };
      let expr: Expr;
      try { expr = parseExpr(am[2]); }
      catch (e) { return { ok: false, error: `In \`assign ${lhs} = …\`: ${(e as Error).message}.` }; }
      drivers.set(lhs, expr);
      if (!declared.has(lhs)) { declared.add(lhs); order.push(lhs); }
    }

    // Reject always-blocks etc. so we never silently grade an unsupported design.
    if (/\balways\b/.test(body) || /\binitial\b/.test(body))
      return { ok: false, error: 'always/initial blocks are not supported in the basic tier — use `assign` or gate primitives.' };

    const inputs = order.filter((n) => dir.get(n) === 'input');
    const outputs = order.filter((n) => dir.get(n) === 'output');
    const internals = order.filter((n) => !dir.has(n));

    if (!outputs.length) return { ok: false, error: 'Module declares no outputs.' };

    // Every referenced signal must be a known input/output/wire.
    const refs = new Set<string>();
    for (const e of drivers.values()) refsOf(e, refs);
    for (const r of refs)
      if (!declared.has(r)) return { ok: false, error: `Unknown signal '${r}'.` };

    // Inputs must not be driven; outputs must be driven.
    for (const out of outputs)
      if (!drivers.has(out)) return { ok: false, error: `Output '${out}' is never assigned.` };
    for (const inp of inputs)
      if (drivers.has(inp)) return { ok: false, error: `Input '${inp}' cannot be assigned.` };

    return { ok: true, module: { name, inputs, outputs, internals, drivers } };
  } catch (e) {
    return { ok: false, error: (e as Error).message || 'Failed to compile module.' };
  }
}

// ─── evaluation ──────────────────────────────────────────────────────────────
function evalExpr(e: Expr, vals: Map<string, Bit>): Bit | null {
  if (e.k === 'const') return e.v;
  if (e.k === 'id') return vals.has(e.name) ? vals.get(e.name)! : null;
  if (e.k === 'not') { const a = evalExpr(e.a, vals); return a === null ? null : ((~a) & 1) as Bit; }
  if (e.k === 'mux') { const s = evalExpr(e.s, vals); return s === null ? null : evalExpr(s ? e.t : e.f, vals); }
  // e.k === 'bin'
  const a = evalExpr(e.a, vals); if (a === null) return null;
  const b = evalExpr(e.b, vals); if (b === null) return null;
  switch (e.op) {
    case '&': return (a & b) as Bit;
    case '|': return (a | b) as Bit;
    case '^': return (a ^ b) as Bit;
    case '~^': return ((~(a ^ b)) & 1) as Bit;
    default: return null;
  }
}

/**
 * Evaluate a compiled module for one input vector. Throws on a combinational
 * loop or an output that can't be resolved.
 */
export function simulate(mod: SimModule, inputs: Record<string, Bit>): Record<string, Bit> {
  const vals = new Map<string, Bit>();
  for (const inp of mod.inputs) vals.set(inp, (inputs[inp] ? 1 : 0) as Bit);

  // Fixpoint: at most (#drivers + 1) passes resolves any acyclic network.
  const targets = [...mod.drivers.keys()];
  for (let pass = 0; pass <= targets.length; pass++) {
    let progressed = false;
    for (const sig of targets) {
      if (vals.has(sig)) continue;
      const v = evalExpr(mod.drivers.get(sig)!, vals);
      if (v !== null) { vals.set(sig, v); progressed = true; }
    }
    if (!progressed) break;
  }

  const out: Record<string, Bit> = {};
  for (const o of mod.outputs) {
    if (!vals.has(o)) throw new Error(`signal '${o}' did not settle (combinational loop or undriven input)`);
    out[o] = vals.get(o)!;
  }
  return out;
}
