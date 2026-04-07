import { create } from 'zustand';

export type WaveType = 'sine' | 'square' | 'triangle';

interface SignalStore {
  amplitude: number;
  frequency: number;
  phase: number;
  secondaryPhase: number;
  noise: number;
  waveType: WaveType;
  scene: number;
  maxUnlockedScene: number;

  setAmplitude: (v: number) => void;
  setFrequency: (v: number) => void;
  setPhase: (v: number) => void;
  setSecondaryPhase: (v: number) => void;
  setNoise: (v: number) => void;
  setWaveType: (t: WaveType) => void;
  nextScene: () => void;
  goToScene: (n: number) => void;
  unlockScene: (n: number) => void;
  unlockAll: () => void;
  theoryMode: boolean;
  toggleTheoryMode: () => void;
}

const TOTAL_SCENES = 13;

export const useSignalStore = create<SignalStore>((set) => ({
  amplitude: 0.5,
  frequency: 1,
  phase: 0,
  secondaryPhase: 0,
  noise: 0,
  waveType: 'sine',
  scene: 0,
  maxUnlockedScene: 12, // TEMP: ALLOW ALL ACCESS FOR THOROUGH CHECK

  setAmplitude: (v) => set({ amplitude: Math.max(0, Math.min(1, v)) }),
  setFrequency: (v) => set({ frequency: Math.max(0.1, Math.min(5, v)) }),
  setPhase: (v) => set({ phase: v }),
  setSecondaryPhase: (v) => set({ secondaryPhase: v }),
  setNoise: (v) => set({ noise: Math.max(0, Math.min(1, v)) }),
  setWaveType: (t) => set({ waveType: t }),

  nextScene: () =>
    set((s) => {
      const next = Math.min(s.scene + 1, TOTAL_SCENES - 1);
      return { scene: next, maxUnlockedScene: Math.max(s.maxUnlockedScene, next) };
    }),

  goToScene: (n) =>
    set(() => ({ scene: Math.min(n, TOTAL_SCENES - 1) })), // Allow jumping if unlocked

  unlockScene: (n) =>
    set((s) => ({ maxUnlockedScene: Math.max(s.maxUnlockedScene, n) })),

  unlockAll: () => set({ maxUnlockedScene: 12 }),
  theoryMode: false,
  toggleTheoryMode: () => set((s) => ({ theoryMode: !s.theoryMode })),
}));
