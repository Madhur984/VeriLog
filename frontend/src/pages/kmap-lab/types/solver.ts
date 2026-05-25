export type Value = 0 | 1 | 'X';

export interface Implicant {
  minterms: number[];
  binary: string; // e.g. "1-01"
  combinedCount: number;
  isUsed: boolean;
}

export interface SolverResult {
  expression: string;
  groups: Implicant[];
}
