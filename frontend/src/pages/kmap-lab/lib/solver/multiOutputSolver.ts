import { Implicant } from "../../types/solver";
import { simplify } from "./mintermSimplifier";

export interface FunctionDefinition {
  id: string;
  name: string;
  minterms: number[];
  dontCares: number[];
}

export interface SharedImplicant {
  binary: string;
  expression: string;
  usedInFunctions: string[];
  savingsScore: number;
}

export interface MultiOutputResult {
  functions: Array<{
    id: string;
    name: string;
    expression: string;
    groups: Implicant[];
  }>;
  sharedImplicants: SharedImplicant[];
  totalIndividualGates: number;
  totalSharedGates: number;
  gateReductionPercentage: number;
}

const binaryToTerm = (bin: string, numVars: number): string => {
  const vars = ["A", "B", "C", "D", "E"].slice(0, numVars);
  let res = "";
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") res += vars[i];
    else if (bin[i] === "0") res += vars[i] + "'";
  }
  return res || "1";
};

export const solveMultiOutput = (
  fnDefs: FunctionDefinition[],
  numVars: number
): MultiOutputResult => {
  const functionResults = fnDefs.map(fn => {
    const res = simplify(fn.minterms, fn.dontCares, numVars, 'SOP');
    return {
      id: fn.id,
      name: fn.name,
      expression: res.expression,
      groups: res.groups
    };
  });

  // Track product terms used across multiple functions
  const termUsageMap = new Map<string, string[]>();

  for (const fnRes of functionResults) {
    for (const group of fnRes.groups) {
      if (!termUsageMap.has(group.binary)) {
        termUsageMap.set(group.binary, []);
      }
      termUsageMap.get(group.binary)!.push(fnRes.name);
    }
  }

  const sharedImplicants: SharedImplicant[] = [];
  let sharedGatesCount = 0;

  termUsageMap.forEach((fns, bin) => {
    if (fns.length > 1) {
      const expr = binaryToTerm(bin, numVars);
      const savings = (fns.length - 1);
      sharedImplicants.push({
        binary: bin,
        expression: expr,
        usedInFunctions: fns,
        savingsScore: savings
      });
    }
  });

  const totalIndividualGates = functionResults.reduce((acc, f) => acc + f.groups.length, 0);
  const totalSharedGates = totalIndividualGates - sharedImplicants.reduce((acc, s) => acc + s.savingsScore, 0);
  const gateReductionPercentage = totalIndividualGates > 0 
    ? Math.round(((totalIndividualGates - totalSharedGates) / totalIndividualGates) * 100)
    : 0;

  return {
    functions: functionResults,
    sharedImplicants,
    totalIndividualGates,
    totalSharedGates,
    gateReductionPercentage
  };
};
