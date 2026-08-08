import { Implicant } from '../../types/solver';
import { simplify } from './mintermSimplifier';

export interface VEMCell {
  mintermIndex: number;
  expression: string; // e.g., "1", "0", "E", "E'", "E+F"
}

export interface VEMResult {
  baseVariables: string[];
  enteredVariables: string[];
  simplifiedExpression: string;
  constantPassTerms: string[];
  variablePassTerms: Array<{ variable: string; term: string }>;
}

export const solveVEM = (
  cells: Record<number, string>,
  baseVarCount: number,
  enteredVars: string[]
): VEMResult => {
  const baseVars = ["A", "B", "C", "D"].slice(0, baseVarCount);
  const totalBaseCells = 1 << baseVarCount;

  // Pass 1: Treat cells with "1" or containing entered variables as minterms for constant coverage
  const constMinterms: number[] = [];
  const constDontCares: number[] = [];

  for (let i = 0; i < totalBaseCells; i++) {
    const val = (cells[i] || "0").trim();
    if (val === "1") constMinterms.push(i);
    else if (val === "X") constDontCares.push(i);
  }

  const baseResult = simplify(constMinterms, constDontCares, baseVarCount, 'SOP');

  // Pass 2: Process entered variables individually
  const variableTerms: Array<{ variable: string; term: string }> = [];

  for (const eV of enteredVars) {
    const vMinterms: number[] = [];
    const vDontCares: number[] = [];

    for (let i = 0; i < totalBaseCells; i++) {
      const val = (cells[i] || "0").trim();
      if (val.includes(eV) || val === "1") vMinterms.push(i);
      else if (val === "X") vDontCares.push(i);
    }

    if (vMinterms.length > 0) {
      const res = simplify(vMinterms, vDontCares, baseVarCount, 'SOP');
      if (res.expression && res.expression !== "0") {
        variableTerms.push({
          variable: eV,
          term: `(${res.expression}) · ${eV}`
        });
      }
    }
  }

  const finalParts: string[] = [];
  if (baseResult.expression && baseResult.expression !== "0") {
    finalParts.push(baseResult.expression);
  }
  variableTerms.forEach(vt => finalParts.push(vt.term));

  const simplifiedExpression = finalParts.join(" + ") || "0";

  return {
    baseVariables: baseVars,
    enteredVariables: enteredVars,
    simplifiedExpression,
    constantPassTerms: baseResult.expression ? [baseResult.expression] : [],
    variablePassTerms: variableTerms
  };
};
