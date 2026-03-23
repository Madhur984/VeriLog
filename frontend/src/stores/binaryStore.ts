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
export type PredictionStatus = 'idle' | 'pending' | 'correct' | 'wrong';

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

// ── Cognition Metrics ─────────────────────────────────────────────────────────

export interface CognitionMetrics {
    incorrectToggles: number;
    arithmeticMistakes: number;
    hesitationTime: number; // cumulative delay in ms
    predictionAccuracy: number; // 0-1
    interactions: number;
    errorStreak: number;
    lastInteractionTime: number;
}

// ── Store Interface ────────────────────────────────────────────────────────────

interface BinaryState {
    // Global Engine State
    isProcessing: boolean;
    isLogicOverlayVisible: boolean;
    toggleLogicOverlay: () => void;
    
    // Module 3.1 — Switch Register
    switchBits: Bit[];
    switchVoltages: number[];
    isSwitchTransitioning: boolean[];
    isBitUnstable: boolean[]; // NEW: Jitter/uncertainty state
    toggleSwitchBit: (index: number) => Promise<void>;
    resetSwitches: () => void;

    // Module 3.2 — Counter
    counterValue: number;
    carryHistory: CarryEvent[];
    isIncrementing: boolean;
    predictionStatus: PredictionStatus; // NEW: Prediction gate
    predictedBits: Bit[] | null;
    startPrediction: () => void;
    submitPrediction: (bits: Bit[]) => void;
    increment: (force?: boolean) => Promise<void>;
    resetCounter: () => void;

    // Module 3.3 — Memory Register
    registerBits: Bit[];
    registerWidth: 8 | 16 | 32;
    storedValue: number | null;
    isWriting: boolean;
    lastRefreshTime: number; // REQ 5 Elite: Decay tracking
    isDecayed: boolean;
    toggleRegisterBit: (index: number) => void;
    setRegisterWidth: (width: 8 | 16 | 32) => void;
    storeValue: () => Promise<void>;
    refreshMemory: () => void; // REQ 5 Elite: Manual refresh
    resetRegister: () => void;

    // Module 3.4 — Adder
    operandA: Bit[];
    operandB: Bit[];
    addSteps: AddStep[];
    addResult: Bit[];
    isAdding: boolean;
    additionComplete: boolean;
    isArithmeticReverseMode: boolean; // NEW: Reverse challenge
    targetSum: number | null;
    toggleOperandBit: (op: 'A' | 'B', index: number) => void;
    computeAddition: () => void;
    revealNextStep: () => void;
    setReverseMode: (active: boolean) => void;
    resetAdder: () => void;

    // Cognition Tracking
    metrics: CognitionMetrics;
    recordAction: (type: keyof CognitionMetrics, value?: number) => void;
    updateHesitation: () => void;
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
    const resultBits: Bit[] = [0, 0, 0, 0, 0];

    for (let i = 3; i >= 0; i--) {
        const sum3 = a[i] + b[i] + carry;
        const sum_bit = (sum3 % 2) as Bit;
        const carry_out = (sum3 >= 2 ? 1 : 0) as Bit;
        steps.push({ colIndex: i, a: a[i], b: b[i], carry_in: carry, sum: sum_bit, carry_out, revealed: false });
        resultBits[i + 1] = sum_bit;
        carry = carry_out;
    }
    resultBits[0] = carry;
    return { steps: steps.reverse(), result: resultBits };
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useBinaryStore = create<BinaryState>((set, get) => ({
    // ── Global ──
    isProcessing: false,
    isLogicOverlayVisible: false,
    toggleLogicOverlay: () => set(s => ({ isLogicOverlayVisible: !s.isLogicOverlayVisible })),
    
    metrics: {
        incorrectToggles: 0,
        arithmeticMistakes: 0,
        hesitationTime: 0,
        predictionAccuracy: 1,
        interactions: 0,
        errorStreak: 0,
        lastInteractionTime: Date.now(),
    },

    recordAction: (type, value = 1) => {
        const now = Date.now();
        set(s => {
            const newMetrics = { 
                ...s.metrics, 
                [type]: s.metrics[type as keyof CognitionMetrics] + value,
                lastInteractionTime: now
            };
            return { metrics: newMetrics };
        });
    },

    updateHesitation: () => {
        const now = Date.now();
        const diff = now - get().metrics.lastInteractionTime;
        if (diff > 3000) { // Only track if > 3s
            set(s => ({ metrics: { ...s.metrics, hesitationTime: s.metrics.hesitationTime + diff, lastInteractionTime: now } }));
        }
    },

    // ── Module 3.1 ──
    switchBits: [0, 0, 0, 0],
    switchVoltages: [0, 0, 0, 0],
    isSwitchTransitioning: [false, false, false, false],
    isBitUnstable: [false, false, false, false],

    toggleSwitchBit: async (index) => {
        // Elite Polish: Pre-action tension (15ms delay)
        await new Promise(r => setTimeout(r, 15));

        const bit = get().switchBits[index];
        const targetVolt = bit === 0 ? 3.3 : 0;
        
        set(s => {
            const trans = [...s.isSwitchTransitioning];
            trans[index] = true;
            return { isSwitchTransitioning: trans };
        });

        // REQ 2: BIT WEIGHTED TIMING (Bit 3 is heavy/slow, Bit 0 is light/fast)
        const steps = 10 + (3 - index) * 5; 
        const baseDelay = 30 + (3 - index) * 10;
        
        for (let i = 0; i < steps; i++) {
            await new Promise(r => setTimeout(r, baseDelay));
            
            set(s => {
                const volts = [...s.switchVoltages];
                const volt = volts[index];
                // Non-linear rise for physical feel
                const progress = i / steps;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                volts[index] = volt + (targetVolt - volt) * (easeOut - (i-1)/steps);
                
                // REQ 1: UNCERTAINTY WINDOW (Instability zone)
                const isUnstable = volts[index] > 0.8 && volts[index] < 2.0;
                if (isUnstable) {
                    // Random Brownian motion jitter
                    volts[index] += (Math.random() - 0.5) * 0.4;
                }

                const nextBit = (volts[index] > 2.0) ? 1 : (volts[index] < 0.8 ? 0 : s.switchBits[index]);
                const bits = [...s.switchBits];
                bits[index] = nextBit as Bit;
                
                const unstableArr = [...s.isBitUnstable];
                unstableArr[index] = isUnstable;

                return { switchVoltages: volts, switchBits: bits, isBitUnstable: unstableArr };
            });
        }

        set(s => {
            const trans = [...s.isSwitchTransitioning];
            trans[index] = false;
            const unstableArr = [...s.isBitUnstable];
            unstableArr[index] = false;
            return { isSwitchTransitioning: trans, isBitUnstable: unstableArr };
        });
    },
    resetSwitches: () => set({ switchBits: [0, 0, 0, 0], switchVoltages: [0, 0, 0, 0], isBitUnstable: [false, false, false, false] }),

    // ── Module 3.2 ──
    counterValue: 0,
    carryHistory: [],
    isIncrementing: false,
    predictionStatus: 'idle',
    predictedBits: null,

    startPrediction: () => set({ predictionStatus: 'pending', predictedBits: null }),
    
    submitPrediction: (bits) => {
        const actualNext = (get().counterValue + 1) % 16;
        const actualBits = toBits4(actualNext);
        const isCorrect = bits.every((b, i) => b === actualBits[i]);
        
        set(s => ({ 
            predictionStatus: isCorrect ? 'correct' : 'wrong',
            predictedBits: bits,
            metrics: {
                ...s.metrics,
                predictionAccuracy: (s.metrics.predictionAccuracy * s.metrics.interactions + (isCorrect ? 1 : 0)) / (s.metrics.interactions + 1),
                errorStreak: isCorrect ? 0 : s.metrics.errorStreak + 1
            }
        }));
    },

    increment: async (force = false) => {
        // REQ 3: PREDICTIVE GATE (Force prediction unless 'force' is used)
        if (!force && get().predictionStatus !== 'correct') {
            get().startPrediction();
            return;
        }

        if (get().isIncrementing) return;
        set({ isIncrementing: true });

        const prevVal = get().counterValue;
        const nextVal = (prevVal + 1) % 16;
        const prevBits = toBits4(prevVal);
        const nextBits = toBits4(nextVal);
        const carries: CarryEvent[] = [];

        for (let i = 3; i >= 0; i--) {
            if (prevBits[i] !== nextBits[i]) {
                // REQ 8: TEMPORAL ALIGNMENT (Weighted ripple delay)
                const rippleDelay = 150 + (3 - i) * 100;
                await new Promise(r => setTimeout(r, rippleDelay));
                
                if (prevBits[i] === 1 && nextBits[i] === 0) {
                    carries.push({ fromBit: i, timestamp: Date.now() });
                }

                set(s => {
                    const currentBits = toBits4(s.counterValue);
                    currentBits[i] = nextBits[i];
                    return { 
                        counterValue: bitsToNum(currentBits),
                        carryHistory: [...s.carryHistory.slice(-7), ...carries]
                    };
                });
            } else {
                break;
            }
        }

        set({ isIncrementing: false, predictionStatus: 'idle' });
    },
    resetCounter: () => set({ counterValue: 0, carryHistory: [], isIncrementing: false, predictionStatus: 'idle' }),

    // ── Module 3.3 ──
    registerBits: [0, 0, 0, 0, 0, 0, 0, 0],
    registerWidth: 8,
    storedValue: null,
    isWriting: false,
    lastRefreshTime: Date.now(),
    isDecayed: false,
    toggleRegisterBit: (index) =>
        set((s) => {
            const next = [...s.registerBits] as Bit[];
            next[index] = (next[index] === 0 ? 1 : 0) as Bit;
            return { registerBits: next, storedValue: null, lastRefreshTime: Date.now(), isDecayed: false };
        }),
    setRegisterWidth: (width) => set({ registerWidth: width }),
    storeValue: async () => {
        set({ isWriting: true });
        // REQ 5: MEMORY STABILIZATION (Longer delay for feeling)
        await new Promise(r => setTimeout(r, 1200)); 
        set((s) => ({ 
            storedValue: bitsToNum(s.registerBits),
            isWriting: false,
            lastRefreshTime: Date.now(),
            isDecayed: false
        }));
    },
    refreshMemory: () => set({ lastRefreshTime: Date.now(), isDecayed: false }),
    resetRegister: () => set({ registerBits: [0, 0, 0, 0, 0, 0, 0, 0], storedValue: null, isWriting: false, lastRefreshTime: Date.now(), isDecayed: false }),

    // ── Module 3.4 ──
    operandA: [0, 1, 0, 1],
    operandB: [0, 0, 1, 1],
    addSteps: [],
    addResult: [0, 0, 0, 0, 0],
    isAdding: false,
    additionComplete: false,
    isArithmeticReverseMode: false,
    targetSum: null,

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
    setReverseMode: (active) => set({ 
        isArithmeticReverseMode: active, 
        targetSum: active ? Math.floor(Math.random() * 31) : null 
    }),
    resetAdder: () => set({ addSteps: [], addResult: [0, 0, 0, 0, 0], isAdding: false, additionComplete: false }),
}));

// ── Selectors ──
export const selectCounterBits = (s: BinaryState) => toBits4(s.counterValue);
export const selectSwitchDecimal = (s: BinaryState) => bitsToNum(s.switchBits);
export const selectRegisterHex = (s: BinaryState) =>
    bitsToNum(s.registerBits).toString(16).toUpperCase().padStart(2, '0');

export const selectCognitionTier = (s: BinaryState) => {
    const { interactions, incorrectToggles, arithmeticMistakes, predictionAccuracy, errorStreak } = s.metrics;
    
    if (errorStreak > 2) return 'struggling';
    if (interactions > 15 && predictionAccuracy < 0.4) return 'overconfident';
    if (arithmeticMistakes > 5 || incorrectToggles > 8) return 'struggling';
    if (interactions > 0 && interactions < 3) return 'passive';
    
    return 'learning';
};

