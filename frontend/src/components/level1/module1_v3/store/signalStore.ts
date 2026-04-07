import { create } from 'zustand';

export type WaveType = 'sine' | 'square' | 'triangle';

/**
 * SignalMode: Unique visual/interactive behaviors for specific theory concepts.
 */
export type SignalMode = 
  | 'analog'        // Smooth sine
  | 'digital'       // Step wave
  | 'periodic'      // Perfectly looping
  | 'aperiodic'     // Irregular drift
  | 'deterministic' // Clean/stable
  | 'random'        // Chaotically noisy
  | 'step'          // Unit step jump
  | 'impulse'       // Single spike
  | 'ramp'          // Linear rise
  | 'sinc'          // Card(sin) / decaying oscillation
  | 'triangular'    // Sharp peaks
  | 'rectangular';  // Binary blocks

interface SignalStore {
  // --- CORE SIGNAL PARAMETERS ---
  amplitude: number;
  frequency: number;
  phase: number;
  noise: number;
  waveType: WaveType;
  signalMode: SignalMode;

  // --- NAVIGATION & FLOW ---
  scene: number;
  maxUnlockedScene: number;
  showContinue: boolean;
  interactionProgress: number; // 0 to 1

  // --- ACTIONS ---
  setAmplitude: (v: number) => void;
  setFrequency: (v: number) => void;
  setPhase: (v: number) => void;
  setNoise: (v: number) => void;
  setWaveType: (t: WaveType) => void;
  setSignalMode: (m: SignalMode) => void;
  
  setShowContinue: (show: boolean) => void;
  setInteractionProgress: (p: number) => void;

  nextScene: () => void;
  goToScene: (n: number) => void;
  unlockScene: (n: number) => void;
  unlockAll: () => void;

  // --- THEORY LAYER ---
  theoryMode: boolean;
  toggleTheoryMode: () => void;
}

const TOTAL_SCENES = 13;

export const useSignalStore = create<SignalStore>((set) => ({
  amplitude: 0.5,
  frequency: 1,
  phase: 0,
  noise: 0,
  waveType: 'sine',
  signalMode: 'analog',

  scene: 0,
  maxUnlockedScene: 12,
  showContinue: false,
  interactionProgress: 0,

  setAmplitude: (v) => set({ amplitude: Math.max(0, Math.min(1, v)) }),
  setFrequency: (v) => set({ frequency: Math.max(0.1, Math.min(5, v)) }),
  setPhase: (v) => set({ phase: v }),
  setNoise: (v) => set({ noise: Math.max(0, Math.min(1, v)) }),
  setWaveType: (t) => set({ waveType: t }),
  setSignalMode: (m) => set({ signalMode: m }),

  setShowContinue: (show) => set({ showContinue: show }),
  setInteractionProgress: (p) => set({ interactionProgress: Math.min(1, Math.max(0, p)) }),

  nextScene: () =>
    set((s) => {
      const next = Math.min(s.scene + 1, TOTAL_SCENES - 1);
      // Reset interaction on scene change but KEEP signal parameters
      return { 
        scene: next, 
        maxUnlockedScene: Math.max(s.maxUnlockedScene, next),
        showContinue: false,
        interactionProgress: 0
      };
    }),

  goToScene: (n) =>
    set(() => ({ 
      scene: Math.min(n, TOTAL_SCENES - 1),
      showContinue: false,
      interactionProgress: 0
    })),

  unlockScene: (n) =>
    set((s) => ({ maxUnlockedScene: Math.max(s.maxUnlockedScene, n) })),

  unlockAll: () => set({ maxUnlockedScene: 12 }),
  theoryMode: false,
  toggleTheoryMode: () => set((s) => ({ theoryMode: !s.theoryMode })),
}));
