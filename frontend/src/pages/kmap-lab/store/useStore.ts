import { create } from "zustand";
import { Value } from "../types/solver";

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
  reset: () => void;
  loadExample: () => void;
}

export const useStore = create<AppState>((set) => ({
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
