/**
 * Boolean Expression Parser
 * Converts strings like "AB' + CD" or "(A + B')(C + D)" into an AST.
 * Supports up to 6 variables (A, B, C, D, E, F).
 */

export type ASTNode =
  | { type: 'VAR'; name: string }
  | { type: 'NOT'; input: ASTNode }
  | { type: 'AND'; inputs: ASTNode[] }
  | { type: 'OR'; inputs: ASTNode[] };

// --------------- Tokenizer ---------------

type Token =
  | { kind: 'VAR'; value: string }
  | { kind: 'NOT' }       // postfix complement:  A'
  | { kind: 'NOTPRE' }    // prefix complement:   !A, ~A
  | { kind: 'OR' }
  | { kind: 'LPAREN' }
  | { kind: 'RPAREN' }
  | { kind: 'EOF' };

const POSTFIX_NOT = new Set(["'", '’', '‘', '´', '`']);
const PREFIX_NOT = new Set(['!', '~', '¬']);
const OR_CHARS = new Set(['+', '|']);

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[A-F]/i.test(ch)) {
      tokens.push({ kind: 'VAR', value: ch.toUpperCase() });
      i++;
    } else if (POSTFIX_NOT.has(ch)) {
      tokens.push({ kind: 'NOT' });
      i++;
    } else if (PREFIX_NOT.has(ch)) {
      tokens.push({ kind: 'NOTPRE' });
      i++;
    } else if (OR_CHARS.has(ch)) {
      tokens.push({ kind: 'OR' });
      i++;
    } else if (ch === '(') {
      tokens.push({ kind: 'LPAREN' });
      i++;
    } else if (ch === ')') {
      tokens.push({ kind: 'RPAREN' });
      i++;
    } else {
      i++; // skip unknown
    }
  }
  tokens.push({ kind: 'EOF' });
  return tokens;
}

// --------------- Parser ---------------

class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  remaining(): Token {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private expect(kind: Token['kind']): Token {
    const tok = this.consume();
    if (tok.kind !== kind) throw new Error(`Expected ${kind}, got ${tok.kind}`);
    return tok;
  }

  parseExpr(): ASTNode {
    const terms: ASTNode[] = [this.parseTerm()];
    while (this.peek().kind === 'OR') {
      this.consume();
      terms.push(this.parseTerm());
    }
    if (terms.length === 1) return terms[0];
    return { type: 'OR', inputs: terms };
  }

  parseTerm(): ASTNode {
    const factors: ASTNode[] = [this.parseFactor()];
    while (
      this.peek().kind !== 'OR' &&
      this.peek().kind !== 'RPAREN' &&
      this.peek().kind !== 'EOF'
    ) {
      factors.push(this.parseFactor());
    }
    if (factors.length === 1) return factors[0];
    return { type: 'AND', inputs: factors };
  }

  parseFactor(): ASTNode {
    let prefixNots = 0;
    while (this.peek().kind === 'NOTPRE') { this.consume(); prefixNots++; }
    let node = this.parseAtom();
    while (this.peek().kind === 'NOT') {
      this.consume();
      node = { type: 'NOT', input: node };
    }
    for (let k = 0; k < prefixNots; k++) node = { type: 'NOT', input: node };
    return node;
  }

  parseAtom(): ASTNode {
    const tok = this.peek();
    if (tok.kind === 'VAR') {
      this.consume();
      return { type: 'VAR', name: tok.value };
    }
    if (tok.kind === 'LPAREN') {
      this.consume();
      const inner = this.parseExpr();
      this.expect('RPAREN');
      return inner;
    }
    throw new Error(`Unexpected token: ${tok.kind}`);
  }
}

export function parseBoolean(expr: string): ASTNode | null {
  const trimmed = expr.trim();
  if (!trimmed || trimmed === '0' || trimmed === '1') return null;
  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const ast = parser.parseExpr();
    if (parser.remaining().kind !== 'EOF') return null;
    return ast;
  } catch {
    return null;
  }
}

// --------------- Evaluation ---------------

export function collectVars(ast: ASTNode, acc: Set<string> = new Set()): Set<string> {
  switch (ast.type) {
    case 'VAR': acc.add(ast.name); break;
    case 'NOT': collectVars(ast.input, acc); break;
    case 'AND':
    case 'OR': ast.inputs.forEach((i) => collectVars(i, acc)); break;
  }
  return acc;
}

export function evaluateAST(ast: ASTNode, env: Record<string, boolean>): boolean {
  switch (ast.type) {
    case 'VAR': return env[ast.name] === true;
    case 'NOT': return !evaluateAST(ast.input, env);
    case 'AND': return ast.inputs.every((i) => evaluateAST(i, env));
    case 'OR': return ast.inputs.some((i) => evaluateAST(i, env));
  }
}

const VAR_ORDER = ['A', 'B', 'C', 'D', 'E', 'F'];

export function expressionToMinterms(expr: string, numVars: number): number[] | null {
  const ast = parseBoolean(expr);
  if (!ast) return null;
  const vars = VAR_ORDER.slice(0, numVars);
  const minterms: number[] = [];
  const total = 1 << numVars;
  for (let m = 0; m < total; m++) {
    const env: Record<string, boolean> = {};
    for (let i = 0; i < numVars; i++) {
      env[vars[i]] = ((m >> (numVars - 1 - i)) & 1) === 1;
    }
    if (evaluateAST(ast, env)) minterms.push(m);
  }
  return minterms;
}

export function inferNumVars(ast: ASTNode): number {
  let hi = -1;
  collectVars(ast).forEach((v) => {
    const idx = VAR_ORDER.indexOf(v);
    if (idx > hi) hi = idx;
  });
  return Math.min(6, Math.max(2, hi + 1));
}
