import { create } from "zustand";
import { Value } from "../types/solver";
import { parseBoolean, evaluateAST, inferNumVars } from "../lib/utils/parseBoolean";

interface AppState {
  numVars: number;
  cellValues: Record<number, Value>;
  expression: string;
  minterms: number[];
  dontCares: number[];
  solType: 'SOP' | 'POS';
  
  // Actions
  setNumVars: (n: number) => void;
  setSolType: (type: 'SOP' | 'POS') => void;
  setCellValue: (index: number, val: Value) => void;
  setExpression: (expr: string) => void;
  /** Parse the Boolean expression, evaluate it, and load the result into the K-map. */
  solveExpression: (expr?: string) => { ok: boolean; error?: string };
  reset: () => void;
  loadExample: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  numVars: 4,
  solType: 'SOP',
  cellValues: {},
  expression: "",
  minterms: [],
  dontCares: [],

  setNumVars: (n) => set({ 
    numVars: n, 
    cellValues: {}, 
    minterms: [],
    dontCares: [] 
  }),

  setSolType: (type) => set({ solType: type }),
  
  setCellValue: (index, val) => set((state) => {
    const newValues = { ...state.cellValues, [index]: val };
    const minterms = Object.entries(newValues)
      .filter(([_, v]) => v === 1)
      .map(([i]) => parseInt(i));
    const dontCares = Object.entries(newValues)
      .filter(([_, v]) => v === 'X')
      .map(([i]) => parseInt(i));
    
    return { cellValues: newValues, minterms, dontCares };
  }),

  setExpression: (expr) => set({ expression: expr }),

  solveExpression: (expr) => {
    const source = (expr ?? get().expression).trim();
    if (!source) return { ok: false, error: 'Enter a Boolean expression first.' };
    if (source === '0' || source === '1') {
      // A constant: fill the whole map (1) or clear it (0).
      const numVars = get().numVars;
      const total = 1 << numVars;
      const cellValues: Record<number, Value> = {};
      const minterms: number[] = [];
      for (let m = 0; m < total; m++) {
        if (source === '1') { cellValues[m] = 1; minterms.push(m); }
        else cellValues[m] = 0;
      }
      set({ numVars, minterms, dontCares: [], cellValues, expression: source });
      return { ok: true };
    }

    const ast = parseBoolean(source);
    if (!ast) return { ok: false, error: 'Could not parse that — use variables A–E, ’ for NOT, + for OR (e.g. A’BC + AB’).' };

    // Size the map to the highest variable used so it matches the expression.
    const numVars = inferNumVars(ast);
    const vars = ['A', 'B', 'C', 'D', 'E'].slice(0, numVars);
    const total = 1 << numVars;
    const cellValues: Record<number, Value> = {};
    const minterms: number[] = [];
    for (let m = 0; m < total; m++) {
      const env: Record<string, boolean> = {};
      for (let i = 0; i < numVars; i++) {
        env[vars[i]] = ((m >> (numVars - 1 - i)) & 1) === 1;
      }
      if (evaluateAST(ast, env)) { cellValues[m] = 1; minterms.push(m); }
      else cellValues[m] = 0;
    }
    set({ numVars, minterms, dontCares: [], cellValues, expression: source });
    return { ok: true };
  },

  reset: () => set({ cellValues: {}, minterms: [], dontCares: [], expression: "" }),

  loadExample: () => {
    const example: Record<number, Value> = {
      0: 1, 1: 1, 4: 1, 5: 1,
      10: 'X', 14: 1
    };
    const minterms = [0, 1, 4, 5, 14];
    const dontCares = [10];
    set({ cellValues: example, minterms, dontCares });
  }
}));
