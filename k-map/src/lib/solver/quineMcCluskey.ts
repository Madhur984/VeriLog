import { Implicant } from "@/types/solver";

/**
 * Quine-McCluskey algorithm implementation
 */

export const countOnes = (n: string): number => {
  return n.split("").filter(c => c === "1").length;
};

// I'll rewrite this more cleanly
const getBinary = (n: number, numVars: number): string => {
  return n.toString(2).padStart(numVars, "0");
};

const diffCount = (a: string, b: string): number => {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++;
  }
  return count;
};

const combine = (a: string, b: string): string | null => {
  let diffPos = -1;
  let res = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (diffPos !== -1) return null;
      diffPos = i;
      res += "-";
    } else {
      res += a[i];
    }
  }
  return res;
};

export const getPrimeImplicants = (
  minterms: number[],
  dontCares: number[],
  numVars: number
): Implicant[] => {
  const allTerms = [...new Set([...minterms, ...dontCares])];
  let currentGroup: Implicant[] = allTerms.map(m => ({
    minterms: [m],
    binary: getBinary(m, numVars),
    combinedCount: 0,
    isUsed: false
  }));

  const primeImplicants: Implicant[] = [];

  while (currentGroup.length > 0) {
    const nextGroup: Implicant[] = [];
    const usedIndices = new Set<number>();
    const usedInCombination = new Set<number>();

    for (let i = 0; i < currentGroup.length; i++) {
      for (let j = i + 1; j < currentGroup.length; j++) {
        const combined = combine(currentGroup[i].binary, currentGroup[j].binary);
        if (combined) {
          usedInCombination.add(i);
          usedInCombination.add(j);
          const combinedMinterms = [...new Set([...currentGroup[i].minterms, ...currentGroup[j].minterms])].sort((a,b) => a-b);
          
          if (!nextGroup.some(item => item.binary === combined)) {
            nextGroup.push({
              binary: combined,
              minterms: combinedMinterms,
              combinedCount: currentGroup[i].combinedCount + 1,
              isUsed: false
            });
          }
        }
      }
    }

    for (let i = 0; i < currentGroup.length; i++) {
      if (!usedInCombination.has(i)) {
        primeImplicants.push(currentGroup[i]);
      }
    }

    currentGroup = nextGroup;
  }

  return primeImplicants;
};
