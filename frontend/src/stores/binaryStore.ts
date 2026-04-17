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
import { setThermalResonance } from '../utils/synesthesiaEngine';
// ── Types ──────────────────────────────────────────────────────────────────────

export type Bit = 0 | 1;
export type Scene = 'intro' | 'whybinary' | 'switch' | 'counter' | 'register' | 'arithmetic' | 'bridge' | 'complete';
export type PredictionStatus = 'idle' | 'pending' | 'correct' | 'wrong';
export type PredictionConfidence = 'low' | 'med' | 'high';
export type LabStage = 'theory' | 'prediction' | 'execution' | 'observe' | 'explain' | 'apply' | 'complete';

export interface CarryEvent {
    fromBit: number; // index of the bit that caused carry
    timestamp: number;
}

export interface PulseEvent {
    originIndex: number;
    targetIndex: number;
    type: 'carry' | 'write' | 'ripple';
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
    wrongAnswerCount: number;
    lastInteractionTime: number;
    thermalUpdateInterval?: any;
}

// ── Store Interface ────────────────────────────────────────────────────────────

interface BinaryState {
    // Global Engine State
    isProcessing: boolean;
    isSystemBusy: boolean;
    setSystemBusy: (busy: boolean) => void;
    isLogicOverlayVisible: boolean;
    toggleLogicOverlay: () => void;
    
    // Routing & Navigation (Elite Sync)
    activeScene: Scene;
    navigationLocked: boolean;
    setNavigationLocked: (locked: boolean) => void;
    nextScene: () => void;
    prevScene: () => void;
    goToScene: (scene: Scene) => void;
    
    // Cognitive Flow
    labStage: LabStage;
    setLabStage: (stage: LabStage) => void;
    isStageLocked: boolean;
    setStageLocked: (locked: boolean) => void;
    
    // Causality Engine
    pulseHistory: PulseEvent[];
    propagationDelay: number; // Total compute time in ns
    recordPulse: (pulse: Omit<PulseEvent, 'timestamp'>) => void;
    
    // Standardized Bit State (across all labs)
    bits: Bit[];
    voltages: number[];
    isBitTransitioning: boolean[];
    isBitUnstable: boolean[];
    
    // Module 3.1 — Switch Register
    switchBits: Bit[];
    switchVoltages: number[];
    toggleSwitchBit: (index: number) => Promise<void>;
    resetSwitches: () => void;

    // Module 3.2 — Counter
    counterValue: number;
    carryHistory: CarryEvent[];
    isIncrementing: boolean;
    predictionStatus: PredictionStatus;
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
    isAutoRefresh: boolean; // NEW: Auto Refresh toggle
    lastRefreshTime: number;
    isDecayed: boolean;
    toggleRegisterBit: (index: number) => void;
    setRegisterWidth: (width: 8 | 16 | 32) => void;
    toggleAutoRefresh: () => void;
    submitRegisterPrediction: (value: number) => void;
    storeValue: (force?: boolean) => Promise<void>;
    refreshMemory: () => void;
    resetRegister: () => void;

    // Module 3.4 — Adder
    operandA: Bit[];
    operandB: Bit[];
    addSteps: AddStep[];
    addResult: Bit[];
    isAdding: boolean;
    additionComplete: boolean;
    submitArithmeticPrediction: (carry: Bit, sum: Bit) => void;
    isArithmeticReverseMode: boolean;
    targetSum: number | null;
    toggleOperandBit: (op: 'A' | 'B', index: number) => void;
    computeAddition: () => void;
    revealNextStep: () => Promise<void>;
    setReverseMode: (active: boolean) => void;
    resetAdder: () => void;

    // Elite Polish & Realism
    isSlowMotion: boolean;
    setSlowMotion: (active: boolean) => void;
    predictionConfidence: PredictionConfidence | null;
    systemTemperature: number; // 0.0 to 1.0 (effects decay speed)
    delayVariation: number; // jitter in ms
    setPredictionConfidence: (conf: PredictionConfidence) => void;
    setSystemTemperature: (temp: number) => void;

    // Cognition Tracking
    metrics: CognitionMetrics;
    resetWrongAnswerCount: () => void;
    recordAction: (type: keyof CognitionMetrics, value?: number) => void;
    updateHesitation: () => void;
    setBit: (index: number, value: Bit) => void;
    toggleBit: (index: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const toBits4 = (n: number): Bit[] => [
    ((n >> 3) & 1) as Bit,
    ((n >> 2) & 1) as Bit,
    ((n >> 1) & 1) as Bit,
    (n & 1) as Bit,
];

export const bitsToNum = (bits: Bit[]): number =>
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
    isSystemBusy: false,
    setSystemBusy: (busy: boolean) => set({ isSystemBusy: busy }),
    isLogicOverlayVisible: false,
    toggleLogicOverlay: () => set(state => ({ isLogicOverlayVisible: !state.isLogicOverlayVisible })),
    
    // Routing & Navigation
    activeScene: 'intro',
    navigationLocked: false,
    setNavigationLocked: (locked: boolean) => set({ navigationLocked: locked }),
    nextScene: () => set(state => {
        if (state.navigationLocked) return state;
        const SCENE_ORDER: Scene[] = ['intro', 'whybinary', 'switch', 'counter', 'register', 'arithmetic', 'bridge', 'complete'];
        const idx = SCENE_ORDER.indexOf(state.activeScene);
        
        if (idx < SCENE_ORDER.length - 1) {
            const nextS = SCENE_ORDER[idx + 1];
            const updates: any = { activeScene: nextS, labStage: 'theory', isStageLocked: true };
            
            // State Continuity Logic
            if (state.activeScene === 'switch' && nextS === 'counter') {
                updates.counterValue = bitsToNum(state.switchBits);
            } else if (state.activeScene === 'counter' && nextS === 'register') {
                const newReg = [...state.registerBits];
                const cBits = toBits4(state.counterValue);
                for(let i=0; i<4; i++) newReg[i+4] = cBits[i];
                updates.registerBits = newReg;
            } else if (state.activeScene === 'register' && nextS === 'arithmetic') {
                const regVal = bitsToNum(state.registerBits);
                updates.operandA = toBits4(regVal % 16);
            }
            
            return { ...updates };
        }
        return state;
    }),
    prevScene: () => set(state => {
        const SCENE_ORDER: Scene[] = ['intro', 'whybinary', 'switch', 'counter', 'register', 'arithmetic', 'bridge', 'complete'];
        const idx = SCENE_ORDER.indexOf(state.activeScene);
        if (idx > 0) {
            return { activeScene: SCENE_ORDER[idx - 1] };
        }
        return state;
    }),
    goToScene: (scene: Scene) => set({ activeScene: scene }),

    // Cognitive Flow
    labStage: 'theory',
    setLabStage: (stage: LabStage) => set({ labStage: stage, isStageLocked: true }),
    isStageLocked: true,
    setStageLocked: (locked: boolean) => set({ isStageLocked: locked }),

    // Causality Engine
    pulseHistory: [],
    propagationDelay: 0,
    recordPulse: (pulse: Omit<PulseEvent, 'timestamp'>) => set(s => {
        const cost = pulse.type === 'carry' ? 12 : (pulse.type === 'ripple' ? 5 : 20);
        return { 
            pulseHistory: [...s.pulseHistory.slice(-10), { ...pulse, timestamp: Date.now() }],
            propagationDelay: s.propagationDelay + cost
        };
    }),

    // Standardized Bit State
    bits: [0, 0, 0, 0],
    voltages: [0, 0, 0, 0],
    isBitTransitioning: [false, false, false, false],
    isBitUnstable: [false, false, false, false],

    metrics: {
        incorrectToggles: 0,
        arithmeticMistakes: 0,
        hesitationTime: 0,
        predictionAccuracy: 1,
        interactions: 0,
        errorStreak: 0,
        wrongAnswerCount: 0,
        lastInteractionTime: Date.now(),
        thermalUpdateInterval: null as any,
    },
    resetWrongAnswerCount: () => set(s => ({ metrics: { ...s.metrics, wrongAnswerCount: 0 } })),

    // Thermal Engine Logic
    initThermalEngine: () => {
        if (get().metrics.thermalUpdateInterval) return;
        const interval = setInterval(() => {
            const { systemTemperature } = get();
            if (systemTemperature > 0.05) {
                const coolingRate = 0.01 + (systemTemperature * 0.05); // Faster cooling at higher temps
                const nextTemp = Math.max(0.05, systemTemperature - coolingRate);
                set({ systemTemperature: nextTemp });
                setThermalResonance(nextTemp);
            }
        }, 1000);
        set(s => ({ metrics: { ...s.metrics, thermalUpdateInterval: interval } }));
    },

    // Elite State
    isSlowMotion: false,
    setSlowMotion: (active: boolean) => set({ isSlowMotion: active }),
    predictionConfidence: null,
    systemTemperature: 0.2, // Default cool
    delayVariation: 10,
    setPredictionConfidence: (conf: PredictionConfidence) => set({ predictionConfidence: conf }),
    setSystemTemperature: (temp: number) => set({ systemTemperature: temp }),

    recordAction: (type: keyof CognitionMetrics, value = 1) => {
        const now = Date.now();
        const { initThermalEngine } = get();
        initThermalEngine(); // Ensure engine is running

        set(s => {
            const newMetrics = { 
                ...s.metrics, 
                [type]: (s.metrics[type as keyof CognitionMetrics] || 0) + value,
                lastInteractionTime: now
            };
            
            // Thermal accumulation
            const heatGain = type === 'interactions' ? 0.04 : 0.02;
            const newTemp = Math.min(1, s.systemTemperature + heatGain);
            setThermalResonance(newTemp);
            
            if (type === 'incorrectToggles' || type === 'arithmeticMistakes') {
                newMetrics.wrongAnswerCount += value;
            }
            return { metrics: newMetrics, systemTemperature: newTemp };
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

    toggleSwitchBit: async (index) => {
        if (get().isSystemBusy || index < 0 || index >= 4) return;
        try {
            set({ isSystemBusy: true, isProcessing: true });
            
            // Elite Polish: Pre-action tension (15ms delay)
            await new Promise(r => setTimeout(r, 15));

            const bit = get().switchBits[index];
            const targetVolt = bit === 0 ? 3.3 : 0;
            
            set(s => {
                const trans = [...s.isBitTransitioning];
                trans[index] = true;
                return { isBitTransitioning: trans };
            });

            // REQ 2: BIT WEIGHTED TIMING (Bit 3 is heavy/slow, Bit 0 is light/fast)
            const steps = 10 + (3 - index) * 5; 
            const baseDelay = 30 + (3 - index) * 10;
            
            for (let i = 0; i < steps; i++) {
                // REQ: ±10ms delay variation (jitter)
                const jitter = (Math.random() - 0.5) * get().delayVariation;
                await new Promise(r => setTimeout(r, Math.max(5, baseDelay + jitter)));
                
                set(s => {
                    const volts = [...s.voltages];
                    const volt = volts[index];
                    const progress = i / steps;
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    // Base target voltage with subtle thermal noise
                    const thermalNoise = (Math.random() - 0.5) * 0.05 * s.systemTemperature;
                    volts[index] = volt + (targetVolt - volt) * (easeOut - (i-1)/steps) + thermalNoise;
                    
                    // INDETERMINATE ZONE (0.8V - 2.0V)
                    const isUnstable = volts[index] > 0.8 && volts[index] < 2.0;
                    if (isUnstable) {
                        // Random Brownian jitter in the undefined zone
                        volts[index] += (Math.random() - 0.5) * 0.6;
                    }

                    const nextBit = (volts[index] > 2.0) ? 1 : (volts[index] < 0.8 ? 0 : s.bits[index]);
                    const bits = [...s.bits];
                    const switchBits = [...s.switchBits];
                    bits[index] = nextBit as Bit;
                    switchBits[index] = nextBit as Bit;
                    
                    const unstableArr = [...s.isBitUnstable];
                    unstableArr[index] = isUnstable;

                    return { 
                        voltages: volts, 
                        switchVoltages: volts, 
                        bits, 
                        switchBits, 
                        isBitUnstable: unstableArr 
                    };
                });
            }

            get().recordPulse({ originIndex: index, targetIndex: index, type: 'ripple' });
        } finally {
            set(s => {
                const trans = [...s.isBitTransitioning];
                trans[index] = false;
                const unstableArr = [...s.isBitUnstable];
                unstableArr[index] = false;
                // FINAL SYNC CHECK: Ensure visual is perfectly aligned with logical at end
                return { 
                    bits: [...s.switchBits],
                    isBitTransitioning: trans, 
                    isBitUnstable: unstableArr, 
                    isSystemBusy: false,
                    isProcessing: false 
                };
            });
        }
    },
    resetSwitches: () => set({ switchBits: [0, 0, 0, 0], switchVoltages: [0, 0, 0, 0], isBitUnstable: [false, false, false, false] }),

    // ── Module 3.2 ──
    counterValue: 0,
    carryHistory: [],
    isIncrementing: false,
    predictionStatus: 'idle',
    predictedBits: null,

    startPrediction: () => set({ predictionStatus: 'pending', predictedBits: null }),
    
    submitPrediction: (bits: Bit[]) => {
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

        if (get().isIncrementing || get().isSystemBusy) return;
        
        try {
            set({ isIncrementing: true, isSystemBusy: true, isProcessing: true });

            const prevVal = get().counterValue;
            const nextVal = (prevVal + 1) % 16;
            const prevBits = toBits4(prevVal);
            const nextBits = toBits4(nextVal);
            const carries: CarryEvent[] = [];

            // 1. ANIMATION PHASE — Update visual bits only, keep counterValue stable
            const visualBits = [...prevBits];
            
            for (let i = 3; i >= 0; i--) {
                // Safety: ensure index exists in the array (though toBits4 always returns 4)
                if (i < 0 || i >= visualBits.length) break;

                if (prevBits[i] !== nextBits[i]) {
                    // REQ 8: TEMPORAL ALIGNMENT (Weighted ripple delay)
                    const baseRipple = 120 + (3 - i) * 80;
                    const rippleDelay = get().isSlowMotion ? baseRipple * 3 : baseRipple;
                    await new Promise(r => setTimeout(r, rippleDelay));
                    
                    if (prevBits[i] === 1 && nextBits[i] === 0) {
                        carries.push({ fromBit: i, timestamp: Date.now() });
                        if (i > 0) {
                            get().recordPulse({ originIndex: i, targetIndex: i - 1, type: 'carry' });
                        }
                    }

                    // Update visual bits layer
                    set(s => {
                        const nextVisual = [...s.bits];
                        if (i < nextVisual.length) nextVisual[i] = nextBits[i];
                        return { bits: nextVisual, carryHistory: [...s.carryHistory.slice(-7), ...carries] };
                    });
                } else {
                    // Ripple stops when bits match (no carry needed)
                    break;
                }
            }

            // 2. COMMIT PHASE — Finalize counterValue atomically
            set({ 
                counterValue: nextVal, 
                bits: nextBits,
                predictionStatus: 'idle' 
            });
        } finally {
            set({ 
                isIncrementing: false, 
                isSystemBusy: false, 
                isProcessing: false
            });
        }
    },
    resetCounter: () => set({ 
        counterValue: 0, 
        bits: [0, 0, 0, 0], 
        carryHistory: [], 
        isIncrementing: false, 
        isSystemBusy: false,
        predictionStatus: 'idle' 
    }),

    // ── Module 3.3 ──
    registerBits: [0, 0, 0, 0, 0, 0, 0, 0],
    registerWidth: 8,
    storedValue: null,
    isWriting: false,
    isAutoRefresh: false,
    lastRefreshTime: Date.now(),
    isDecayed: false,
    toggleRegisterBit: (index: number) =>
        set((s) => {
            if (index < 0 || index >= s.registerBits.length) return s;
            const next = [...s.registerBits] as Bit[];
            next[index] = (next[index] === 0 ? 1 : 0) as Bit;
            const bits = [...s.bits];
            if (index < bits.length) bits[index] = next[index];
            return { registerBits: next, bits, storedValue: null, lastRefreshTime: Date.now(), isDecayed: false };
        }),
    setRegisterWidth: (width) => {
        const bits = Array(width).fill(0) as Bit[];
        set({ registerWidth: width, registerBits: bits, bits: bits.slice(0, 4) });
    },
    toggleAutoRefresh: () => set(s => ({ isAutoRefresh: !s.isAutoRefresh })),
    submitRegisterPrediction: (value: number) => {
        const actual = bitsToNum(get().registerBits);
        const isCorrect = value === actual;
        set(s => {
            const newMetrics = {
                ...s.metrics,
                interactions: s.metrics.interactions + 1,
                predictionAccuracy: (s.metrics.predictionAccuracy * s.metrics.interactions + (isCorrect ? 1 : 0)) / (s.metrics.interactions + 1),
                wrongAnswerCount: isCorrect ? 0 : s.metrics.wrongAnswerCount + 1
            };
            return { 
                predictionStatus: isCorrect ? 'correct' : 'wrong',
                metrics: newMetrics
            };
        });
    },
    storeValue: async (force = false) => {
        if (!force && get().predictionStatus !== 'correct') return;
        if (get().isSystemBusy) return;
        
        try {
            set({ isWriting: true, isProcessing: true, isSystemBusy: true });
            const val = bitsToNum(get().registerBits);
            
            // REQ 5: Propagation Causality (Temporal Delay)
            const writeTime = get().registerWidth * 2; // 2ns per bit write
            await new Promise(r => setTimeout(r, 600)); // Mimic propagation delay
            
            set(s => ({ 
                storedValue: val, 
                lastRefreshTime: Date.now(),
                isDecayed: false,
                predictionStatus: 'idle',
                propagationDelay: s.propagationDelay + writeTime,
                pulseHistory: [
                    ...s.pulseHistory, 
                    { originIndex: -1, targetIndex: 0, type: 'write', timestamp: Date.now() }
                ]
            }));
        } finally {
            set({ isWriting: false, isProcessing: false, isSystemBusy: false });
        }
    },
    refreshMemory: () => set({ lastRefreshTime: Date.now(), isDecayed: false }),
    resetRegister: () => set({ registerBits: [0, 0, 0, 0, 0, 0, 0, 0], storedValue: null, isWriting: false, isAutoRefresh: false, lastRefreshTime: Date.now(), isDecayed: false }),

    // ── Module 3.4 ──
    operandA: [0, 1, 0, 1],
    operandB: [0, 0, 1, 1],
    addSteps: [],
    addResult: [0, 0, 0, 0, 0],
    isAdding: false,
    additionComplete: false,
    isArithmeticReverseMode: false,
    targetSum: null,

    toggleOperandBit: (op: 'A' | 'B', index: number) =>
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
        set({ addSteps: steps, addResult: result, isAdding: true, additionComplete: false, predictionStatus: 'idle' });
    },
    submitArithmeticPrediction: (carry: Bit, sum: Bit) => {
        const idx = get().addSteps.findIndex(s => !s.revealed);
        if (idx === -1) return;
        const step = get().addSteps[idx];
        const isCorrect = step.carry_out === carry && step.sum === sum;
        
        set(s => {
            const newMetrics = {
                ...s.metrics,
                interactions: s.metrics.interactions + 1,
                predictionAccuracy: (s.metrics.predictionAccuracy * s.metrics.interactions + (isCorrect ? 1 : 0)) / (s.metrics.interactions + 1),
                wrongAnswerCount: isCorrect ? 0 : s.metrics.wrongAnswerCount + 1,
                arithmeticMistakes: isCorrect ? s.metrics.arithmeticMistakes : s.metrics.arithmeticMistakes + 1
            };
            return { 
                predictionStatus: isCorrect ? 'correct' : 'wrong',
                metrics: newMetrics
            };
        });
    },
    revealNextStep: async () => {
        if (get().predictionStatus !== 'correct') return;

        set((s) => {
            const idx = s.addSteps.findIndex((step) => !step.revealed);
            if (idx === -1) return { additionComplete: true, isAdding: false };
            
            const step = s.addSteps[idx];
            if (step.carry_out === 1 && idx < s.addSteps.length - 1) {
                get().recordPulse({ originIndex: 3 - idx, targetIndex: 3 - (idx + 1), type: 'carry' });
            }

            const next = s.addSteps.map((step, i) =>
                i === idx ? { ...step, revealed: true } : step
            );
            
            const allDone = next.every((step) => step.revealed);
            const bits = [...s.bits];
            if (idx < 4) bits[3 - idx] = step.sum;

            return { addSteps: next, bits, additionComplete: allDone, isAdding: !allDone, predictionStatus: 'idle' };
        });
    },
    setReverseMode: (active) => set({ 
        isArithmeticReverseMode: active, 
        targetSum: active ? Math.floor(Math.random() * 31) : null 
    }),
    resetAdder: () => set({ addSteps: [], addResult: [0, 0, 0, 0, 0], isAdding: false, additionComplete: false }),

    setBit: (index, value) => set(s => {
        const next = [...s.bits];
        next[index] = value;
        return { bits: next };
    }),

    toggleBit: (index) => set(s => {
        const next = [...s.bits];
        next[index] = (next[index] === 0 ? 1 : 0) as Bit;
        return { bits: next };
    }),
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

