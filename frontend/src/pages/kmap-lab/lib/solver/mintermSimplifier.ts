import { Implicant } from "../../types/solver";
import { getPrimeImplicants } from "./quineMcCluskey";
import { solveMinimumCoverage } from "./petricksMethod";

/**
 * Converts a binary implicant (e.g., "1-01") into a Boolean term (e.g., "A C' D").
 */
export const binaryToSOP = (bin: string, variables: string[]): string => {
  if (bin.split("").every(c => c === "-")) return "1"; // All cells are 1s
  
  let term = "";
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      term += variables[i];
    } else if (bin[i] === "0") {
      term += variables[i] + "'";
    }
  }
  return term === "" ? "1" : term;
};

/**
 * Converts a binary implicant into a POS sum term (e.g., "(A' + C + D')").
 */
export const binaryToPOS = (bin: string, variables: string[]): string => {
  if (bin.split("").every(c => c === "-")) return "0";

  let terms = [];
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      terms.push(variables[i] + "'");
    } else if (bin[i] === "0") {
      terms.push(variables[i]);
    }
  }
  return terms.length === 0 ? "0" : `(${terms.join(" + ")})`;
};

/**
 * Main function to simplify minterms.
 */
export const simplify = (
  minterms: number[],
  dontCares: number[],
  numVars: number,
  type: "SOP" | "POS" = "SOP"
): { expression: string; groups: Implicant[] } => {
  const variables = ["A", "B", "C", "D", "E"].slice(0, numVars);
  const totalCells = Math.pow(2, numVars);

  if (type === "SOP") {
    if (minterms.length === 0) return { expression: "0", groups: [] };
    if (minterms.length === totalCells) return { expression: "1", groups: [] };

    const primeImplicants = getPrimeImplicants(minterms, dontCares, numVars);
    const minimalSet = solveMinimumCoverage(primeImplicants, minterms);
    const expr = minimalSet.map(pi => binaryToSOP(pi.binary, variables)).join(" + ");
    return { expression: expr, groups: minimalSet };
  } else {
    // POS: Grouping 0s (Maxterms)
    // Find maxterms: all indices NOT in minterms AND NOT in dontCares
    const allIndices = Array.from({ length: totalCells }, (_, i) => i);
    const maxterms = allIndices.filter(i => !minterms.includes(i) && !dontCares.includes(i));

    if (maxterms.length === 0) return { expression: "1", groups: [] };
    if (maxterms.length === totalCells) return { expression: "0", groups: [] };

    const primeImplicants = getPrimeImplicants(maxterms, dontCares, numVars);
    const minimalSet = solveMinimumCoverage(primeImplicants, maxterms);
    const expr = minimalSet.map(pi => binaryToPOS(pi.binary, variables)).join("");
    return { expression: expr, groups: minimalSet };
  }
};
