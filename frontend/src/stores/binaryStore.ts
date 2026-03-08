/**
 * binaryStore.ts — Level 3 Binary Awakening State Engine
 *
 * Manages the complete state for all four Level 3 micro-modules:
 *  - 4-bit switch register (Module 3.1)
 *  - 4-bit counter with carry history (Module 3.2)
 *  - 8-bit memory register (Module 3.3)
 *  - Dual-operand binary adder (Module 3.4)
 */

import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────────────────────────────

export type Bit = 0 | 1;

export interface CarryEvent {
    fromBit: number; // index of the bit that caused carry
    timestamp: number;
}

export interface AddStep {
    colIndex: number;
    a: Bit;
    b: Bit;
    carry_in: Bit;
    sum: Bit;
    carry_out: Bit;
    revealed: boolean;
}

// ── Store Interface ────────────────────────────────────────────────────────────

interface BinaryState {
    // Module 3.1 — Switch Register
    switchBits: Bit[]; // 4 bits, index 0 = MSB
    toggleSwitchBit: (index: number) => void;
    resetSwitches: () => void;

    // Module 3.2 — Counter
    counterValue: number; // 0-15
    carryHistory: CarryEvent[];
    increment: () => void;
    resetCounter: () => void;

    // Module 3.3 — Memory Register
    registerBits: Bit[]; // 8 bits, index 0 = MSB
    registerWidth: 8 | 16 | 32;
    storedValue: number | null;
    toggleRegisterBit: (index: number) => void;
    setRegisterWidth: (width: 8 | 16 | 32) => void;
    storeValue: () => void;
    resetRegister: () => void;

    // Module 3.4 — Adder
    operandA: Bit[]; // 4 bits MSB-first
    operandB: Bit[];
    addSteps: AddStep[];
    addResult: Bit[]; // 5 bits (includes overflow)
    isAdding: boolean;
    additionComplete: boolean;
    toggleOperandBit: (op: 'A' | 'B', index: number) => void;
    computeAddition: () => void;
    revealNextStep: () => void;
    resetAdder: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const toBits4 = (n: number): Bit[] => [
    ((n >> 3) & 1) as Bit,
    ((n >> 2) & 1) as Bit,
    ((n >> 1) & 1) as Bit,
    (n & 1) as Bit,
];

const bitsToNum = (bits: Bit[]): number =>
    bits.reduce<number>((acc, b, i) => acc | (b << (bits.length - 1 - i)), 0);

const buildAddSteps = (a: Bit[], b: Bit[]): { steps: AddStep[]; result: Bit[] } => {
    const steps: AddStep[] = [];
    let carry: Bit = 0;
    const resultBits: Bit[] = [0, 0, 0, 0, 0]; // 5 bits

    // Process from LSB (index 3) to MSB (index 0)
    for (let i = 3; i >= 0; i--) {
        const sum3 = a[i] + b[i] + carry;
        const sum_bit = (sum3 % 2) as Bit;
        const carry_out = (sum3 >= 2 ? 1 : 0) as Bit;
        steps.push({ colIndex: i, a: a[i], b: b[i], carry_in: carry, sum: sum_bit, carry_out, revealed: false });
        resultBits[i + 1] = sum_bit;
        carry = carry_out;
    }
    resultBits[0] = carry; // overflow
    // steps are built LSB→MSB, reverse to display MSB→LSB
    return { steps: steps.reverse(), result: resultBits };
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useBinaryStore = create<BinaryState>((set, get) => ({
    // ── Module 3.1 ──
    switchBits: [0, 0, 0, 0],
    toggleSwitchBit: (index) =>
        set((s) => {
            const next = [...s.switchBits] as Bit[];
            next[index] = (next[index] === 0 ? 1 : 0) as Bit;
            return { switchBits: next };
        }),
    resetSwitches: () => set({ switchBits: [0, 0, 0, 0] }),

    // ── Module 3.2 ──
    counterValue: 0,
    carryHistory: [],
    increment: () =>
        set((s) => {
            const next = (s.counterValue + 1) % 16;
            const carries: CarryEvent[] = [];
            // Detect which bits carry (bits that flip from 1 to 0)
            const prev = toBits4(s.counterValue);
            const curr = toBits4(next);
            prev.forEach((bit, i) => {
                if (bit === 1 && curr[i] === 0) {
                    carries.push({ fromBit: i, timestamp: Date.now() });
                }
            });
            return {
                counterValue: next,
                carryHistory: [...s.carryHistory.slice(-7), ...carries],
            };
        }),
    resetCounter: () => set({ counterValue: 0, carryHistory: [] }),

    // ── Module 3.3 ──
    registerBits: [0, 0, 0, 0, 0, 0, 0, 0],
    registerWidth: 8,
    storedValue: null,
    toggleRegisterBit: (index) =>
        set((s) => {
            const next = [...s.registerBits] as Bit[];
            next[index] = (next[index] === 0 ? 1 : 0) as Bit;
            return { registerBits: next, storedValue: null };
        }),
    setRegisterWidth: (width) => set({ registerWidth: width }),
    storeValue: () =>
        set((s) => ({ storedValue: bitsToNum(s.registerBits) })),
    resetRegister: () => set({ registerBits: [0, 0, 0, 0, 0, 0, 0, 0], storedValue: null }),

    // ── Module 3.4 ──
    operandA: [0, 1, 0, 1],
    operandB: [0, 0, 1, 1],
    addSteps: [],
    addResult: [0, 0, 0, 0, 0],
    isAdding: false,
    additionComplete: false,
    toggleOperandBit: (op, index) =>
        set((s) => {
            const bits = [...(op === 'A' ? s.operandA : s.operandB)] as Bit[];
            bits[index] = (bits[index] === 0 ? 1 : 0) as Bit;
            return op === 'A'
                ? { operandA: bits, addSteps: [], additionComplete: false }
                : { operandB: bits, addSteps: [], additionComplete: false };
        }),
    computeAddition: () => {
        const { operandA, operandB } = get();
        const { steps, result } = buildAddSteps(operandA, operandB);
        set({ addSteps: steps, addResult: result, isAdding: true, additionComplete: false });
    },
    revealNextStep: () =>
        set((s) => {
            const idx = s.addSteps.findIndex((step) => !step.revealed);
            if (idx === -1) return { additionComplete: true, isAdding: false };
            const next = s.addSteps.map((step, i) =>
                i === idx ? { ...step, revealed: true } : step
            );
            const allDone = next.every((step) => step.revealed);
            return { addSteps: next, additionComplete: allDone, isAdding: !allDone };
        }),
    resetAdder: () =>
        set({ addSteps: [], addResult: [0, 0, 0, 0, 0], isAdding: false, additionComplete: false }),
}));

// ── Selector helpers ───────────────────────────────────────────────────────────

export const selectCounterBits = (s: BinaryState) => toBits4(s.counterValue);
export const selectSwitchDecimal = (s: BinaryState) => bitsToNum(s.switchBits);
export const selectRegisterHex = (s: BinaryState) =>
    bitsToNum(s.registerBits).toString(16).toUpperCase().padStart(2, '0');
