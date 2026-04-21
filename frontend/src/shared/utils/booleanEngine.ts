// ─── Boolean Engine — Full Implementation ───────────────────────────────────
// Truth table → minterms/maxterms → canonical SOP/POS → gate counting → evaluation

export type TruthTableRow = {
  inputs: boolean[];
  output: boolean | null;
  index: number;
};

export type Minterm = {
  index: number;
  term: string;
  variables: string[];
  complements: boolean[]; // true = complemented (add prime)
  present?: boolean[];    // true = variable is included in this term
};

export type Maxterm = {
  index: number;
  term: string;
  variables: string[];
  complements: boolean[]; // REVERSED: true = complemented (add prime) when input was 1
  present?: boolean[];    // true = variable is included in this term
};

export type CircuitForm = 'AND-OR' | 'NAND-NAND' | 'OR-AND' | 'NOR-NOR';

export type GateCount = {
  level1: number;
  level2: number;
  total: number;
  gateType: string;
};

// ─── Term Extraction ─────────────────────────────────────────────────────────

export function getMinterms(rows: TruthTableRow[], vars: string[]): Minterm[] {
  return rows
    .filter(r => r.output === true)
    .map(r => {
      const complements = r.inputs.map(bit => !bit);
      const term = vars
        .map((v, i) => (complements[i] ? `${v}'` : v))
        .join('·');
      return { index: r.index, term, variables: vars, complements, present: new Array(vars.length).fill(true) };
    });
}

export function getMaxterms(rows: TruthTableRow[], vars: string[]): Maxterm[] {
  return rows
    .filter(r => r.output === false)
    .map(r => {
      const complements = r.inputs.map(bit => bit);
      const term = `(${vars.map((v, i) => (complements[i] ? `${v}'` : v)).join('+')})`;
      return { index: r.index, term, variables: vars, complements, present: new Array(vars.length).fill(true) };
    });
}

// ─── Term → String ───────────────────────────────────────────────────────────

export function mintermToProductTerm(m: Minterm): string {
  return m.variables.map((v, i) => (m.complements[i] ? `${v}'` : v)).join('·');
}

export function maxtermToSumTerm(M: Maxterm): string {
  const inner = M.variables.map((v, i) => (M.complements[i] ? `${v}'` : v)).join('+');
  return `(${inner})`;
}

// ─── Canonical Expressions ───────────────────────────────────────────────────

export function canonicalSOP(minterms: Minterm[], _vars: string[]): string {
  if (minterms.length === 0) return 'F = 0';
  return 'F = ' + minterms.map(m => mintermToProductTerm(m)).join(' + ');
}

export function canonicalPOS(maxterms: Maxterm[], _vars: string[]): string {
  if (maxterms.length === 0) return 'F = 1';
  return 'F = ' + maxterms.map(M => maxtermToSumTerm(M)).join('·');
}

// ─── Shorthand Notation ──────────────────────────────────────────────────────

export function sigmaMNotation(minterms: Minterm[]): string {
  const indices = minterms.map(m => m.index).sort((a, b) => a - b).join(',');
  return `Σm(${indices})`;
}

export function piMNotation(maxterms: Maxterm[]): string {
  const indices = maxterms.map(M => M.index).sort((a, b) => a - b).join(',');
  return `ΠM(${indices})`;
}

// ─── Gate Counting ───────────────────────────────────────────────────────────

export function countGatesForSOP(minterms: Minterm[]): GateCount {
  const level1 = minterms.length;
  const level2 = level1 > 0 ? 1 : 0;
  return { level1, level2, total: level1 + level2, gateType: 'AND/OR' };
}

export function countGatesForPOS(maxterms: Maxterm[]): GateCount {
  const level1 = maxterms.length;
  const level2 = level1 > 0 ? 1 : 0;
  return { level1, level2, total: level1 + level2, gateType: 'OR/AND' };
}

export function countGatesNANDNAND(minterms: Minterm[]): GateCount {
  // Double negation: same gate count as AND-OR
  const level1 = minterms.length;
  const level2 = level1 > 0 ? 1 : 0;
  return { level1, level2, total: level1 + level2, gateType: 'NAND' };
}

export function countGatesNORNOR(maxterms: Maxterm[]): GateCount {
  const level1 = maxterms.length;
  const level2 = level1 > 0 ? 1 : 0;
  return { level1, level2, total: level1 + level2, gateType: 'NOR' };
}

// ─── Expression Parsing ──────────────────────────────────────────────────────

export function parseSOP(expression: string, vars: string[]): Minterm[] {
  const expr = expression.replace(/^F\s*=\s*/i, '').trim();
  const terms = expr.split(/\s*\+\s*/);
  const result: Minterm[] = [];

  for (const [tIdx, term] of terms.entries()) {
    if (!term) continue;
    const complements: boolean[] = new Array(vars.length).fill(false);
    const present: boolean[] = new Array(vars.length).fill(false);
    let matchedAny = false;

    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      if (term.includes(`${v}'`) || term.includes(`${v}\'`)) {
        complements[i] = true;
        present[i] = true;
        matchedAny = true;
      } else if (term.includes(v)) {
        complements[i] = false;
        present[i] = true;
        matchedAny = true;
      }
    }

    if (matchedAny) {
      let index = 0;
      for (let i = 0; i < vars.length; i++) {
        if (present[i]) {
          const bit = complements[i] ? 0 : 1;
          index = (index << 1) | bit;
        }
      }
      result.push({
        index: tIdx, // use term index for non-canonical
        term,
        variables: vars,
        complements,
        present,
      });
    }
  }

  return result;
}

export function parsePOS(expression: string, vars: string[]): Maxterm[] {
  const expr = expression.replace(/^F\s*=\s*/i, '').trim();
  // Match parenthesized groups
  const termMatches = expr.match(/\([^)]+\)/g) ?? [];
  const result: Maxterm[] = [];

  for (const termStr of termMatches) {
    const inner = termStr.slice(1, -1); // remove parens
    const complements: boolean[] = new Array(vars.length).fill(false);
    let matched = true;

    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      if (inner.includes(`${v}'`)) {
        complements[i] = true; // complemented in sum → input was 1
      } else if (!inner.includes(v)) {
        matched = false;
        break;
      }
    }

    if (matched) {
      let index = 0;
      for (let i = 0; i < vars.length; i++) {
        // Reversed: complement[i]=true means input was 1
        const bit = complements[i] ? 1 : 0;
        index = (index << 1) | bit;
      }
      result.push({ index, term: termStr, variables: vars, complements });
    }
  }

  return result;
}

// ─── Evaluation ──────────────────────────────────────────────────────────────

export function evaluateMinterm(m: Minterm, inputValues: boolean[]): boolean {
  for (let i = 0; i < m.variables.length; i++) {
    const expected = !m.complements[i]; // false complement = variable → expect 1
    if (inputValues[i] !== expected) return false;
  }
  return true;
}

export function evaluateMaxterm(M: Maxterm, inputValues: boolean[]): boolean {
  // Maxterm is 0 only when all literals evaluate to 0
  // complement[i]=true → literal is v' → evaluates to 0 when input=1
  for (let i = 0; i < M.variables.length; i++) {
    const literal = M.complements[i] ? !inputValues[i] : inputValues[i];
    if (literal) return true; // sum term: one true → entire term true
  }
  return false;
}

export function evaluateSOP(minterms: Minterm[], inputValues: boolean[]): boolean {
  return minterms.some(m => evaluateMinterm(m, inputValues));
}

export function evaluatePOS(maxterms: Maxterm[], inputValues: boolean[]): boolean {
  return maxterms.every(M => evaluateMaxterm(M, inputValues));
}

// ─── Path Recommendation ─────────────────────────────────────────────────────

export function recommendPath(
  minterms: Minterm[],
  maxterms: Maxterm[]
): 'SOP' | 'POS' | 'EQUAL' {
  if (minterms.length < maxterms.length) return 'SOP';
  if (maxterms.length < minterms.length) return 'POS';
  return 'EQUAL';
}

// ─── Duality ─────────────────────────────────────────────────────────────────

export function complementMintermsToMaxterms(
  minterms: Minterm[],
  totalRows: number,
  vars: string[]
): Maxterm[] {
  const mintermIndices = new Set(minterms.map(m => m.index));
  const maxterms: Maxterm[] = [];

  for (let i = 0; i < totalRows; i++) {
    if (mintermIndices.has(i)) continue;
    const inputs = Array.from({ length: vars.length }, (_, bit) =>
      Boolean((i >> (vars.length - 1 - bit)) & 1)
    );
    const complements = inputs.map(bit => bit); // maxterm reversal
    const term = `(${vars.map((v, idx) => (complements[idx] ? `${v}'` : v)).join('+')})`;
    maxterms.push({ index: i, term, variables: vars, complements });
  }

  return maxterms;
}

// ─── Truth Table Helpers ──────────────────────────────────────────────────────

export function buildTruthTableRows(numVars: number): TruthTableRow[] {
  const total = Math.pow(2, numVars);
  return Array.from({ length: total }, (_, i) => ({
    index: i,
    inputs: Array.from({ length: numVars }, (__, bit) =>
      Boolean((i >> (numVars - 1 - bit)) & 1)
    ),
    output: null,
  }));
}

export function rowsToBinaryString(row: TruthTableRow): string {
  return row.inputs.map(b => (b ? '1' : '0')).join('');
}
