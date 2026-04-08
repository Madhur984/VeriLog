import { create } from 'zustand';
import { audioEngine } from '../engine/audioEngine';

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

export type Phase = 'ENTRY' | 'ACTIVE';

interface SignalStore {
  // --- GLOBAL ENGINE STATE ---
  phase: Phase;
  introPhase: 0 | 1 | 2 | 3 | 4;
  tunnelProgress: number; // 0 → 1
  collapseProgress: number;
  velocity: number;

  // --- CORE SIGNAL PARAMETERS ---
  amplitude: number;
  frequency: number;
  phase_offset: number; // renamed from 'phase' to avoid clash with engine 'phase'
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
  showContinue: boolean; 
  canProceed: boolean;

  // --- DERIVED / LOGIC ---
  stability: number;
  phaseAligned: boolean;

  // --- ACTIONS ---
  setPhase: (p: Phase) => void;
  setIntroPhase: (p: 0 | 1 | 2 | 3 | 4) => void;
  setTunnelProgress: (v: number) => void;
  setCollapseProgress: (v: number) => void;
  setVelocity: (v: number) => void;

  setAmplitude: (v: number) => void;
  setFrequency: (v: number) => void;
  setPhaseOffset: (v: number) => void;
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

const TOTAL_SCENES = 14;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const useSignalStore = create<SignalStore>((set, get) => ({
  phase: 'ENTRY',
  introPhase: 1,
  tunnelProgress: 0,
  collapseProgress: 0,
  velocity: 0,

  amplitude: 0.5,
  frequency: 1,
  phase_offset: 0,
  noise: 0,
  waveType: 'sine',
  signalMode: 'analog',

  isDragging: false,
  hasMoved: false,
  interactionTime: 0,

  scene: 0,
  maxUnlockedScene: 13,
  showContinue: false,
  canProceed: false,

  stability: 0,
  phaseAligned: false,

  setPhase: (phase) => set({ phase }),
  setIntroPhase: (introPhase) => set({ introPhase }),
  setTunnelProgress: (tunnelProgress) => set({ tunnelProgress }),
  setCollapseProgress: (collapseProgress) => set({ collapseProgress }),
  setVelocity: (velocity) => set({ velocity }),

  setAmplitude: (v) => {
    const next = clamp(v, 0, 1);
    set({ amplitude: next });
    const { frequency, noise, stability: oldStability } = get();
    audioEngine.harmonic(frequency, next, noise);
    get().computeStability();
    const { stability: newStability } = get();
    if (newStability > 0.85 && oldStability <= 0.85) audioEngine.snap();
  },
  setFrequency: (v) => {
    const next = clamp(v, 0, 3);
    set({ frequency: next });
    const { amplitude, noise, stability: oldStability } = get();
    audioEngine.harmonic(next, amplitude, noise);
    get().computeStability();
    const { stability: newStability } = get();
    if (newStability > 0.85 && oldStability <= 0.85) audioEngine.snap();
  },
  setPhaseOffset: (v) => set({ phase_offset: v }),
  setNoise: (v) => {
    const next = clamp(v, 0, 1);
    set({ noise: next });
    const { amplitude, frequency, stability: oldStability } = get();
    audioEngine.harmonic(frequency, amplitude, next);
    get().computeStability();
    const { stability: newStability } = get();
    if (newStability > 0.85 && oldStability <= 0.85) audioEngine.snap();
  },
  setWaveType: (t) => set({ waveType: t }),
  setSignalMode: (m) => set({ signalMode: m }),

  setIsDragging: (v) => set({ isDragging: v }),
  setHasMoved: (v) => set({ hasMoved: v }),
  updateInteraction: (dt) => {
    const nextTime = get().interactionTime + dt;
    set({ interactionTime: nextTime, hasMoved: true });
    get().checkProceed();
  },

  nextScene: () =>
    set((s) => {
      const next = Math.min(s.scene + 1, TOTAL_SCENES - 1);
      return { 
        scene: next, 
        maxUnlockedScene: Math.max(s.maxUnlockedScene, next),
        canProceed: false,
        showContinue: false,
        interactionTime: 0,
        hasMoved: false
      };
    }),

  goToScene: (n) =>
    set(() => ({ 
      scene: Math.min(n, TOTAL_SCENES - 1),
      canProceed: false,
      showContinue: false,
      interactionTime: 0,
      hasMoved: false
    })),

  computeStability: () => {
    const { amplitude, frequency, noise } = get();
    const aOpt = amplitude > 0.55 && amplitude < 0.65;
    const fOpt = frequency > 1.4 && frequency < 1.6;
    
    const stability = 
      (1 - noise) * 0.5 + 
      (aOpt ? 0.25 : 0) + 
      (fOpt ? 0.25 : 0);
    set({ stability });
    get().checkProceed();
  },

  checkProceed: () => {
    const s = get();
    let canProceed = false;

    switch (s.scene) {
      case 1: canProceed = s.interactionTime > 2; break;
      case 4: canProceed = s.amplitude > 0.6; break;
      case 5: canProceed = s.frequency > 1.6; break;
      case 7: canProceed = s.noise > 0.5; break;
      case 9: canProceed = s.phaseAligned; break;
      case 11: canProceed = s.stability > 0.8; break;
      default: canProceed = true;
    }

    // 🔵 SMART ASSIST MODE
    const showContinue = s.interactionTime > 4.5 && !canProceed;

    set({ canProceed, showContinue });
  },

  theoryMode: false,
  toggleTheoryMode: () => set((s) => ({ theoryMode: !s.theoryMode })),
}));

