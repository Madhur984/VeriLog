import { Implicant } from "../../types/solver";

/**
 * Petrick's Method simplification
 */

export const solveMinimumCoverage = (
  primeImplicants: Implicant[],
  minterms: number[]
): Implicant[] => {
  if (minterms.length === 0) return [];

  // Essential Prime Implicant check
  const chart: Record<number, number[]> = {};
  minterms.forEach(m => {
    chart[m] = primeImplicants
      .map((pi, idx) => (pi.minterms.includes(m) ? idx : -1))
      .filter(idx => idx !== -1);
  });

  const essentialIndices = new Set<number>();
  const remainingMinterms = new Set(minterms);

  Object.entries(chart).forEach(([, indices]) => {
    if (indices.length === 1) {
      essentialIndices.add(indices[0]);
    }
  });

  essentialIndices.forEach(idx => {
    primeImplicants[idx].minterms.forEach(m => remainingMinterms.delete(m));
  });

  const minimalSet = Array.from(essentialIndices).map(idx => primeImplicants[idx]);
  
  // Greedy choice for the rest
  while (remainingMinterms.size > 0) {
    let bestPIIdx = -1;
    let maxCoverage = 0;

    primeImplicants.forEach((pi, idx) => {
      if (!essentialIndices.has(idx)) {
        const coverage = pi.minterms.filter(m => remainingMinterms.has(m)).length;
        if (coverage > maxCoverage) {
          maxCoverage = coverage;
          bestPIIdx = idx;
        } else if (coverage > 0 && coverage === maxCoverage) {
          // Tie-break: prefer the larger group (simpler Boolean term)
          if (pi.minterms.length > (primeImplicants[bestPIIdx]?.minterms.length || 0)) {
            bestPIIdx = idx;
          }
        }
      }
    });

    if (bestPIIdx === -1) break;
    essentialIndices.add(bestPIIdx);
    minimalSet.push(primeImplicants[bestPIIdx]);
    primeImplicants[bestPIIdx].minterms.forEach(m => remainingMinterms.delete(m));
  }

  return minimalSet;
};
