import { create } from "zustand";
import { Value } from "../types/solver";
import { parseBoolean, evaluateAST, inferNumVars } from "../lib/utils/parseBoolean";

export type Mode = 'normal' | 'pro';

interface AppState {
  mode: Mode;
  numVars: number;
  cellValues: Record<number, Value>;
  expression: string;
  minterms: number[];
  dontCares: number[];
  solType: 'SOP' | 'POS';

  // History stack for Undo/Redo
  history: Record<number, Value>[];
  historyIdx: number;

  // Actions
  setMode: (m: Mode) => void;
  setNumVars: (n: number) => void;
  setSolType: (type: 'SOP' | 'POS') => void;
  setCellValue: (index: number, val: Value) => void;
  toggleCellValue: (index: number) => void;
  setExpression: (expr: string) => void;
  solveExpression: (expr?: string) => { ok: boolean; error?: string };
  reset: () => void;
  loadExample: () => void;
  undo: () => void;
  redo: () => void;
}

const updateMintermsAndDontCares = (cellValues: Record<number, Value>) => {
  const minterms = Object.entries(cellValues)
    .filter(([_, v]) => v === 1)
    .map(([i]) => parseInt(i));
  const dontCares = Object.entries(cellValues)
    .filter(([_, v]) => v === 'X')
    .map(([i]) => parseInt(i));
  return { minterms, dontCares };
};

export const useStore = create<AppState>((set, get) => ({
  mode: 'pro',
  numVars: 4,
  solType: 'SOP',
  cellValues: {},
  expression: "",
  minterms: [],
  dontCares: [],
  history: [{}],
  historyIdx: 0,

  setMode: (m) => set({ mode: m }),

  setNumVars: (n) => set({ 
    numVars: n, 
    cellValues: {}, 
    minterms: [],
    dontCares: [],
    history: [{}],
    historyIdx: 0
  }),

  setSolType: (type) => set({ solType: type }),
  
  setCellValue: (index, val) => set((state) => {
    const newValues = { ...state.cellValues, [index]: val };
    const { minterms, dontCares } = updateMintermsAndDontCares(newValues);

    const newHistory = state.history.slice(0, state.historyIdx + 1);
    newHistory.push(newValues);

    return { 
      cellValues: newValues, 
      minterms, 
      dontCares,
      history: newHistory,
      historyIdx: newHistory.length - 1
    };
  }),

  toggleCellValue: (index) => set((state) => {
    const current = state.cellValues[index] || 0;
    const nextVal: Value = current === 0 ? 1 : current === 1 ? 'X' : 0;
    const newValues = { ...state.cellValues, [index]: nextVal };
    const { minterms, dontCares } = updateMintermsAndDontCares(newValues);

    const newHistory = state.history.slice(0, state.historyIdx + 1);
    newHistory.push(newValues);

    return { 
      cellValues: newValues, 
      minterms, 
      dontCares,
      history: newHistory,
      historyIdx: newHistory.length - 1
    };
  }),

  setExpression: (expr) => set({ expression: expr }),

  solveExpression: (expr) => {
    const source = (expr ?? get().expression).trim();
    if (!source) return { ok: false, error: 'Enter a Boolean expression first.' };
    if (source === '0' || source === '1') {
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
    if (!ast) return { ok: false, error: "Could not parse expression — use A-E, ' for NOT, + for OR." };

    const numVars = Math.max(get().numVars, inferNumVars(ast));
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

    const { dontCares } = updateMintermsAndDontCares(cellValues);
    set({ numVars, minterms, dontCares, cellValues, expression: source });
    return { ok: true };
  },

  reset: () => set({ 
    cellValues: {}, 
    minterms: [], 
    dontCares: [], 
    expression: "",
    history: [{}],
    historyIdx: 0
  }),

  loadExample: () => {
    const example: Record<number, Value> = {
      0: 1, 1: 1, 4: 1, 5: 1,
      10: 'X', 14: 1
    };
    const minterms = [0, 1, 4, 5, 14];
    const dontCares = [10];
    const exampleExpr = "A'B' + BC'D";
    set({ cellValues: example, minterms, dontCares, expression: exampleExpr });
  },

  undo: () => set((state) => {
    if (state.historyIdx <= 0) return state;
    const newIdx = state.historyIdx - 1;
    const prevValues = state.history[newIdx];
    const { minterms, dontCares } = updateMintermsAndDontCares(prevValues);
    return {
      cellValues: prevValues,
      minterms,
      dontCares,
      historyIdx: newIdx
    };
  }),

  redo: () => set((state) => {
    if (state.historyIdx >= state.history.length - 1) return state;
    const newIdx = state.historyIdx + 1;
    const nextValues = state.history[newIdx];
    const { minterms, dontCares } = updateMintermsAndDontCares(nextValues);
    return {
      cellValues: nextValues,
      minterms,
      dontCares,
      historyIdx: newIdx
    };
  })
}));
