import { Implicant } from "../../types/solver";
import { getGrayCode, getKMapDimensions } from "../utils/kmapUtils";

export interface QMGroupStage {
  stageIndex: number;
  stageName: string;
  groups: {
    onesCount: number;
    terms: Array<{
      binary: string;
      minterms: number[];
      combined: boolean;
      expression: string;
    }>;
  }[];
}

export interface PIChartColumn {
  minterm: number;
  coveredBy: number[]; // indices into primeImplicants
}

export interface MinimizationStep {
  stepNumber: number;
  title: string;
  category: 'grouping' | 'combining' | 'pi_chart' | 'essentials' | 'final';
  description: string;
  highlightMinterms: number[];
  stages?: QMGroupStage[];
  primeImplicants?: Implicant[];
  essentialPIs?: Implicant[];
  selectedPIs?: Implicant[];
  chart?: {
    minterms: number[];
    pis: { implicant: Implicant; covers: number[]; isEssential: boolean }[];
  };
}

const getBinary = (n: number, numVars: number): string => n.toString(2).padStart(numVars, "0");

const countOnes = (bin: string): number => bin.split("").filter(c => c === "1").length;

export const binaryToTerm = (bin: string, vars: string[]): string => {
  if (bin.split("").every(c => c === "-")) return "1";
  let res = "";
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") res += vars[i];
    else if (bin[i] === "0") res += vars[i] + "'";
  }
  return res || "1";
};

const combineBinaries = (a: string, b: string): string | null => {
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

export const generateMinimizationSteps = (
  minterms: number[],
  dontCares: number[],
  numVars: number,
  solType: 'SOP' | 'POS' = 'SOP'
): MinimizationStep[] => {
  const vars = ["A", "B", "C", "D", "E"].slice(0, numVars);
  const steps: MinimizationStep[] = [];
  let stepCount = 1;

  const targetTerms = solType === 'SOP' 
    ? minterms 
    : Array.from({ length: 1 << numVars }, (_, i) => i).filter(i => !minterms.includes(i) && !dontCares.includes(i));

  const allTerms = [...new Set([...targetTerms, ...dontCares])].sort((a, b) => a - b);

  // Step 1: Initial Minterm List
  steps.push({
    stepNumber: stepCount++,
    title: `Step 1: Identify ${solType === 'SOP' ? 'Minterms' : 'Maxterms'} & Don't Cares`,
    category: 'grouping',
    description: solType === 'SOP' 
      ? `Extracted minterms m(${targetTerms.join(', ') || 'none'}) ${dontCares.length ? `and don't cares d(${dontCares.join(', ')})` : ''}.`
      : `Extracted maxterms M(${targetTerms.join(', ') || 'none'}) ${dontCares.length ? `and don't cares d(${dontCares.join(', ')})` : ''}.`,
    highlightMinterms: targetTerms,
  });

  if (targetTerms.length === 0) {
    steps.push({
      stepNumber: stepCount++,
      title: "Final Result: Constant 0",
      category: 'final',
      description: "No active terms present. Function simplifies to 0.",
      highlightMinterms: [],
    });
    return steps;
  }

  if (targetTerms.length === (1 << numVars)) {
    steps.push({
      stepNumber: stepCount++,
      title: "Final Result: Constant 1",
      category: 'final',
      description: "All terms active. Function simplifies to 1.",
      highlightMinterms: targetTerms,
    });
    return steps;
  }

  // Step 2: Group by count of 1s
  interface QuineTerm {
    binary: string;
    minterms: number[];
    combined: boolean;
  }

  let currentLevel: QuineTerm[] = allTerms.map(m => ({
    binary: getBinary(m, numVars),
    minterms: [m],
    combined: false
  }));

  const stages: QMGroupStage[] = [];
  const primeImplicants: Implicant[] = [];
  let stageIdx = 0;

  while (currentLevel.length > 0) {
    // Group current level by number of ones
    const groupedMap = new Map<number, QuineTerm[]>();
    for (const term of currentLevel) {
      const ones = countOnes(term.binary);
      if (!groupedMap.has(ones)) groupedMap.set(ones, []);
      groupedMap.get(ones)!.push(term);
    }

    const sortedOnes = Array.from(groupedMap.keys()).sort((a, b) => a - b);
    
    stages.push({
      stageIndex: stageIdx,
      stageName: stageIdx === 0 ? "Initial 1-bit Minterm Groups" : `Stage ${stageIdx}: ${Math.pow(2, stageIdx)}-cell Combinations`,
      groups: sortedOnes.map(ones => ({
        onesCount: ones,
        terms: groupedMap.get(ones)!.map(t => ({
          binary: t.binary,
          minterms: t.minterms,
          combined: t.combined,
          expression: binaryToTerm(t.binary, vars)
        }))
      }))
    });

    // Pairwise combine adjacent ones-count groups
    const nextLevel: QuineTerm[] = [];
    const usedSet = new Set<string>();

    for (let i = 0; i < sortedOnes.length - 1; i++) {
      const g1 = groupedMap.get(sortedOnes[i]) || [];
      const g2 = groupedMap.get(sortedOnes[i + 1]) || [];

      for (const t1 of g1) {
        for (const t2 of g2) {
          const combined = combineBinaries(t1.binary, t2.binary);
          if (combined) {
            t1.combined = true;
            t2.combined = true;
            if (!usedSet.has(combined)) {
              usedSet.add(combined);
              const mergedMinterms = [...new Set([...t1.minterms, ...t2.minterms])].sort((a, b) => a - b);
              nextLevel.push({
                binary: combined,
                minterms: mergedMinterms,
                combined: false
              });
            }
          }
        }
      }
    }

    // Collect prime implicants (terms that could not be combined further)
    for (const term of currentLevel) {
      if (!term.combined && !primeImplicants.some(pi => pi.binary === term.binary)) {
        primeImplicants.push({
          binary: term.binary,
          minterms: term.minterms,
          combinedCount: stageIdx,
          isUsed: false
        });
      }
    }

    currentLevel = nextLevel;
    stageIdx++;
  }

  steps.push({
    stepNumber: stepCount++,
    title: "Step 2: Quine-McCluskey Column Merging",
    category: 'combining',
    description: `Adjacent terms differing by 1 bit were iteratively merged across ${stages.length} passes to form Prime Implicants.`,
    highlightMinterms: targetTerms,
    stages
  });

  // Step 3: Prime Implicant Chart & Essential Identification
  const chartPIs = primeImplicants.map(pi => {
    const covers = pi.minterms.filter(m => targetTerms.includes(m));
    return {
      implicant: pi,
      covers,
      isEssential: false
    };
  });

  const essentialPIs: Implicant[] = [];
  const coveredMinterms = new Set<number>();

  for (const m of targetTerms) {
    const coveringPIs = chartPIs.filter(p => p.covers.includes(m));
    if (coveringPIs.length === 1) {
      const essential = coveringPIs[0];
      essential.isEssential = true;
      if (!essentialPIs.some(epi => epi.binary === essential.implicant.binary)) {
        essentialPIs.push(essential.implicant);
      }
      essential.covers.forEach(c => coveredMinterms.add(c));
    }
  }

  steps.push({
    stepNumber: stepCount++,
    title: "Step 3: Prime Implicant Chart & Essential Implicants",
    category: 'pi_chart',
    description: `Constructed the PI chart. Found ${essentialPIs.length} Essential Prime Implicant(s) covering mandatory minterms.`,
    highlightMinterms: Array.from(coveredMinterms),
    primeImplicants,
    essentialPIs,
    chart: {
      minterms: targetTerms,
      pis: chartPIs
    }
  });

  return steps;
};
