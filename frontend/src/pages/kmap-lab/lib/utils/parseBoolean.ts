/**
 * Boolean Expression Parser
 * Converts strings like "AB' + CD" or "(A + B')(C + D)" into an AST.
 */

export type ASTNode =
  | { type: 'VAR'; name: string }
  | { type: 'NOT'; input: ASTNode }
  | { type: 'AND'; inputs: ASTNode[] }
  | { type: 'OR'; inputs: ASTNode[] };

// --------------- Tokenizer ---------------

type Token =
  | { kind: 'VAR'; value: string }
  | { kind: 'NOT' }
  | { kind: 'OR' }
  | { kind: 'LPAREN' }
  | { kind: 'RPAREN' }
  | { kind: 'EOF' };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[A-E]/i.test(ch)) {
      tokens.push({ kind: 'VAR', value: ch.toUpperCase() });
      i++;
    } else if (ch === "'") {
      tokens.push({ kind: 'NOT' });
      i++;
    } else if (ch === '+') {
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

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private expect(kind: Token['kind']): Token {
    const tok = this.consume();
    if (tok.kind !== kind) throw new Error(`Expected ${kind}, got ${tok.kind}`);
    return tok;
  }

  /** expr = term ('+' term)* */
  parseExpr(): ASTNode {
    const terms: ASTNode[] = [this.parseTerm()];
    while (this.peek().kind === 'OR') {
      this.consume(); // eat '+'
      terms.push(this.parseTerm());
    }
    if (terms.length === 1) return terms[0];
    return { type: 'OR', inputs: terms };
  }

  /**
   * term = factor+     (implicit AND, juxtaposition)
   * A term ends when we see '+', ')', or EOF
   */
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

  /** factor = atom ("'")* */
  parseFactor(): ASTNode {
    let node = this.parseAtom();
    while (this.peek().kind === 'NOT') {
      this.consume();
      node = { type: 'NOT', input: node };
    }
    return node;
  }

  /** atom = VAR | '(' expr ')' */
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

/**
 * Parse a Boolean expression string into an AST.
 * Returns null if the expression is trivial ("0" or "1") or empty.
 */
export function parseBoolean(expr: string): ASTNode | null {
  const trimmed = expr.trim();
  if (!trimmed || trimmed === '0' || trimmed === '1') return null;
  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    return parser.parseExpr();
  } catch {
    return null;
  }
}
