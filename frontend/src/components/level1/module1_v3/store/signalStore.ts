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

  // --- INTERACTION STATE ---
  isDragging: boolean;
  hasMoved: boolean;
  interactionTime: number;

  // --- NAVIGATION & FLOW ---
  scene: number;
  maxUnlockedScene: number;
  showContinue: boolean; // Keep for legacy if needed, but we use canProceed mostly now
  canProceed: boolean;

  // --- DERIVED / LOGIC ---
  stability: number;
  phaseAligned: boolean;

  // --- ACTIONS ---
  setAmplitude: (v: number) => void;
  setFrequency: (v: number) => void;
  setPhase: (v: number) => void;
  setNoise: (v: number) => void;
  setWaveType: (t: WaveType) => void;
  setSignalMode: (m: SignalMode) => void;
  
  setIsDragging: (v: boolean) => void;
  setHasMoved: (v: boolean) => void;
  updateInteraction: (dt: number) => void;

  nextScene: () => void;
  goToScene: (n: number) => void;
  
  computeStability: () => void;
  checkProceed: () => void;
  
  // --- THEORY LAYER ---
  theoryMode: boolean;
  toggleTheoryMode: () => void;
}

const TOTAL_SCENES = 13;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const useSignalStore = create<SignalStore>((set, get) => ({
  amplitude: 0.5,
  frequency: 1,
  phase: 0,
  noise: 0,
  waveType: 'sine',
  signalMode: 'analog',

  isDragging: false,
  hasMoved: false,
  interactionTime: 0,

  scene: 0,
  maxUnlockedScene: 12,
  showContinue: false,
  canProceed: false,

  stability: 0,
  phaseAligned: false,

  setAmplitude: (v) => set({ amplitude: clamp(v, 0, 1) }),
  setFrequency: (v) => set({ frequency: clamp(v, 0, 3) }),
  setPhase: (v) => set({ phase: v }),
  setNoise: (v) => set({ noise: clamp(v, 0, 1) }),
  setWaveType: (t) => set({ waveType: t }),
  setSignalMode: (m) => set({ signalMode: m }),

  setIsDragging: (v) => set({ isDragging: v }),
  setHasMoved: (v) => set({ hasMoved: v }),
  updateInteraction: (dt) => set((s) => ({ interactionTime: s.interactionTime + dt, hasMoved: true })),

  nextScene: () =>
    set((s) => {
      const next = Math.min(s.scene + 1, TOTAL_SCENES - 1);
      return { 
        scene: next, 
        maxUnlockedScene: Math.max(s.maxUnlockedScene, next),
        canProceed: false,
        interactionProgress: 0,
        interactionTime: 0,
        hasMoved: false
      };
    }),

  goToScene: (n) =>
    set(() => ({ 
      scene: Math.min(n, TOTAL_SCENES - 1),
      canProceed: false,
      interactionTime: 0,
      hasMoved: false
    })),

  computeStability: () => {
    const { amplitude, frequency, noise } = get();
    // Pedagogical stability calculation
    const stability = 
      (1 - noise) * 0.5 + 
      (amplitude > 0.4 && amplitude < 0.8 ? 0.25 : 0) + 
      (frequency > 1 && frequency < 2 ? 0.25 : 0);
    set({ stability });
  },

  checkProceed: () => {
    const s = get();
    let canProceed = false;

    switch (s.scene) {
      case 1: // Identity
        canProceed = s.interactionTime > 2;
        break;
      case 4: // Energy
        canProceed = s.amplitude > 0.6;
        break;
      case 5: // Frequency
        canProceed = s.frequency > 1.5;
        break;
      case 7: // Noise
        canProceed = s.noise > 0.5;
        break;
      case 9: // Interaction
        canProceed = s.phaseAligned;
        break;
      case 11: // Lab
        canProceed = s.stability > 0.8;
        break;
      default:
        canProceed = true; // In S00, S02, S03, etc., default to true or time-based
    }
    set({ canProceed });
  },

  theoryMode: false,
  toggleTheoryMode: () => set((s) => ({ theoryMode: !s.theoryMode })),
}));

