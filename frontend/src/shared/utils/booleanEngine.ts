// ─── Boolean Engine — Full Implementation ───────────────────────────────────
// IMPROVEMENT: IMP-E2 + IMP-E3 applied
// CHANGES: Added runtime evaluation and expression normalization for canonical comparison.

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

export interface CircuitEvalResult {
  gateOutputs: Record<string, boolean>;
  finalOutput: boolean;
  activeWires: string[]; // IDs of wires that carry 1
}

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
        index: tIdx,
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
  const termMatches = expr.match(/\([^)]+\)/g) ?? [];
  const result: Maxterm[] = [];

  for (const termStr of termMatches) {
    const inner = termStr.slice(1, -1);
    const complements: boolean[] = new Array(vars.length).fill(false);
    let matched = true;

    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      if (inner.includes(`${v}'`)) {
        complements[i] = true;
      } else if (!inner.includes(v)) {
        matched = false;
        break;
      }
    }

    if (matched) {
      let index = 0;
      for (let i = 0; i < vars.length; i++) {
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
    if (!m.present?.[i]) continue;
    const expected = !m.complements[i];
    if (inputValues[i] !== expected) return false;
  }
  return true;
}

export function evaluateMaxterm(M: Maxterm, inputValues: boolean[]): boolean {
  for (let i = 0; i < M.variables.length; i++) {
    const literal = M.complements[i] ? !inputValues[i] : inputValues[i];
    if (literal) return true;
  }
  return false;
}

export function evaluateSOP(minterms: Minterm[], inputValues: boolean[]): boolean {
  if (minterms.length === 0) return false;
  return minterms.some(m => evaluateMinterm(m, inputValues));
}

export function evaluatePOS(maxterms: Maxterm[], inputValues: boolean[]): boolean {
  if (maxterms.length === 0) return true;
  return maxterms.every(M => evaluateMaxterm(M, inputValues));
}

/**
 * IMP-E2: Full expression evaluation
 */
export function evaluateExpression(
  expression: string,
  inputs: Record<string, boolean>
): boolean {
  const vars = Object.keys(inputs).sort();
  const inputArr = vars.map(v => inputs[v]);
  
  if (expression.includes('+')) {
    // Treat as SOP
    const minterms = parseSOP(expression, vars);
    return evaluateSOP(minterms, inputArr);
  } else if (expression.includes('(')) {
    // Treat as POS
    const maxterms = parsePOS(expression, vars);
    return evaluatePOS(maxterms, inputArr);
  } else {
    // Single term or 0/1
    if (expression === '0') return false;
    if (expression === '1') return true;
    const minterms = parseSOP(expression, vars);
    return evaluateSOP(minterms, inputArr);
  }
}

/**
 * IMP-E2: Circuit-level evaluation for wire coloring
 */
export function evaluateCircuit(
  expression: string,
  inputs: Record<string, boolean>,
  form: CircuitForm
): CircuitEvalResult {
  const vars = Object.keys(inputs).sort();
  const inputArr = vars.map(v => inputs[v]);
  const gateOutputs: Record<string, boolean> = {};
  const activeWires: string[] = [];

  // Track active input wires
  vars.forEach((v, i) => {
    if (inputArr[i]) activeWires.push(`wire_in_${v}`);
  });

  let finalOutput = false;

  if (form === 'AND-OR') {
    const minterms = parseSOP(expression, vars);
    minterms.forEach((m, idx) => {
      const out = evaluateMinterm(m, inputArr);
      gateOutputs[`AND_${idx}`] = out;
      if (out) activeWires.push(`wire_AND_${idx}`);
    });
    finalOutput = evaluateSOP(minterms, inputArr);
  } else if (form === 'OR-AND') {
    const maxterms = parsePOS(expression, vars);
    maxterms.forEach((M, idx) => {
      const out = evaluateMaxterm(M, inputArr);
      gateOutputs[`OR_${idx}`] = out;
      if (out) activeWires.push(`wire_OR_${idx}`);
    });
    finalOutput = evaluatePOS(maxterms, inputArr);
  } else if (form === 'NAND-NAND') {
    const minterms = parseSOP(expression, vars);
    minterms.forEach((m, idx) => {
      // NAND = NOT AND
      const andOut = evaluateMinterm(m, inputArr);
      const out = !andOut;
      gateOutputs[`NAND1_${idx}`] = out;
      if (out) activeWires.push(`wire_NAND1_${idx}`);
    });
    // NAND-NAND final stage is NAND of NAND outputs
    const nand1Outs = minterms.map((m, idx) => gateOutputs[`NAND1_${idx}`]);
    finalOutput = !nand1Outs.every(v => v);
  } else if (form === 'NOR-NOR') {
    const maxterms = parsePOS(expression, vars);
    maxterms.forEach((M, idx) => {
      // NOR = NOT OR
      const orOut = evaluateMaxterm(M, inputArr);
      const out = !orOut;
      gateOutputs[`NOR1_${idx}`] = out;
      if (out) activeWires.push(`wire_NOR1_${idx}`);
    });
    // NOR-NOR final stage is NOR of NOR outputs
    const nor1Outs = maxterms.map((M, idx) => gateOutputs[`NOR1_${idx}`]);
    finalOutput = !nor1Outs.some(v => v);
  }

  if (finalOutput) activeWires.push('wire_out_final');

  return { gateOutputs, finalOutput, activeWires };
}

/**
 * IMP-E2: Helper for minterm matching
 */
export function isMinterm(
  inputs: Record<string, boolean>,
  minterms: number[]
): { match: boolean; mintermIndex: number | null } {
  let index = 0;
  const sortedVars = Object.keys(inputs).sort();
  sortedVars.forEach((v, i) => {
    if (inputs[v]) index = (index << 1) | 1;
    else index = (index << 1) | 0;
  });
  
  const match = minterms.includes(index);
  return { match, mintermIndex: match ? index : null };
}

/**
 * IMP-E2: Human-readable input string
 */
export function inputsToString(
  inputs: Record<string, boolean>,
  variables: string[]
): string {
  return variables.map(v => `${v}=${inputs[v] ? '1' : '0'}`).join(', ');
}

/**
 * IMP-E3: Canonical normalization for comparison
 */
export function normalizeExpression(expression: string): string {
  let expr = expression.replace(/^F\s*=\s*/i, '').replace(/\s+/g, '');
  if (!expr) return '';

  // SOP normalization: sort terms alphabetically, then sort variables within terms
  if (expr.includes('+')) {
    const terms = expr.split('+').map(t => {
      // Sort literals within term (A, A', B...)
      // Simple regex split for literals
      const literals = t.match(/[A-Z]'?/g) ?? [];
      return literals.sort().join('·');
    });
    return terms.sort().join('+');
  }

  // POS normalization: ΠM or (A+B)·(C+D)
  if (expr.includes('·') || expr.includes('(')) {
    const terms = (expr.match(/\([^)]+\)/g) ?? []).map(t => {
      const inner = t.slice(1, -1);
      const literals = inner.match(/[A-Z]'?/g) ?? [];
      return `(${literals.sort().join('+')})`;
    });
    return terms.sort().join('·');
  }

  // Fallback for single term
  const literals = expr.match(/[A-Z]'?/g) ?? [];
  return literals.sort().join('·');
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
    const complements = inputs.map(bit => bit);
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
