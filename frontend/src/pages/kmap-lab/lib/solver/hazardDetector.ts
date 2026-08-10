import { Implicant } from "../../types/solver";
import { getKMapDimensions, getMintermIndex } from "../utils/kmapUtils";

export interface Hazard {
  id: string;
  type: 'static-1' | 'static-0';
  mintermA: number;
  mintermB: number;
  groupAIndex: number;
  groupBIndex: number;
  variableChanging: string;
  consensusBinary: string;
  consensusTerm: string;
}

const getBinary = (n: number, numVars: number): string => n.toString(2).padStart(numVars, "0");

/**
 * Checks if two minterm numbers are adjacent in Hamming distance (differ by exactly 1 bit).
 */
export const areAdjacent = (a: number, b: number): boolean => {
  const diff = a ^ b;
  return diff > 0 && (diff & (diff - 1)) === 0;
};

/**
 * Detects static-1 hazards in the given solution.
 */
export const detectHazards = (
  minterms: number[],
  groups: Implicant[],
  numVars: number
): Hazard[] => {
  const vars = ["A", "B", "C", "D", "E"].slice(0, numVars);
  const hazards: Hazard[] = [];
  const mintermSet = new Set(minterms);

  // Find all pairs of adjacent minterms in the minterm set
  const mintermList = Array.from(mintermSet).sort((a, b) => a - b);

  for (let i = 0; i < mintermList.length; i++) {
    for (let j = i + 1; j < mintermList.length; j++) {
      const mA = mintermList[i];
      const mB = mintermList[j];

      if (areAdjacent(mA, mB)) {
        // Check if there is any single group in `groups` that covers BOTH mA and mB
        const commonGroup = groups.find(g => g.minterms.includes(mA) && g.minterms.includes(mB));

        if (!commonGroup) {
          // Find which groups cover mA and mB separately
          const groupAIdx = groups.findIndex(g => g.minterms.includes(mA));
          const groupBIdx = groups.findIndex(g => g.minterms.includes(mB));

          if (groupAIdx !== -1 && groupBIdx !== -1 && groupAIdx !== groupBIdx) {
            // Find which variable changes between mA and mB
            const binA = getBinary(mA, numVars);
            const binB = getBinary(mB, numVars);
            let varIdx = -1;
            for (let k = 0; k < numVars; k++) {
              if (binA[k] !== binB[k]) {
                varIdx = k;
                break;
              }
            }

            // Create consensus binary: combine common bits between binA and binB
            let consensusBin = "";
            for (let k = 0; k < numVars; k++) {
              if (k === varIdx) consensusBin += "-";
              else consensusBin += binA[k];
            }

            let consensusTerm = "";
            for (let k = 0; k < numVars; k++) {
              if (consensusBin[k] === "1") consensusTerm += vars[k];
              else if (consensusBin[k] === "0") consensusTerm += vars[k] + "'";
            }
            if (!consensusTerm) consensusTerm = "1";

            const hazardId = `hazard_${mA}_${mB}`;
            if (!hazards.some(h => h.id === hazardId)) {
              hazards.push({
                id: hazardId,
                type: 'static-1',
                mintermA: mA,
                mintermB: mB,
                groupAIndex: groupAIdx,
                groupBIndex: groupBIdx,
                variableChanging: vars[varIdx] || `V${varIdx}`,
                consensusBinary: consensusBin,
                consensusTerm
              });
            }
          }
        }
      }
    }
  }

  return hazards;
};
