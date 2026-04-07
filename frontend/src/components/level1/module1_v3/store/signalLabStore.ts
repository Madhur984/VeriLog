import { create } from "zustand";

type Status = "UNSTABLE" | "BALANCING" | "STABLE" | "OPTIMAL";

interface SignalLabState {
  amplitude: number;
  frequency: number;
  noise: number;

  status: Status;
  stabilityProgress: number; // 0.0 to 1.0

  // internal tracking
  stabilityTime: number;
  lastUpdate: number;

  // actions
  setAmplitude: (v: number) => void;
  setFrequency: (v: number) => void;
  setNoise: (v: number) => void;

  updateStatus: () => void;
  reset: () => void;
}

export const useSignalLabStore = create<SignalLabState>((set, get) => ({
  amplitude: 0.3,
  frequency: 1.0,
  noise: 0.3,

  status: "UNSTABLE",
  stabilityProgress: 0,
  stabilityTime: 0,
  lastUpdate: Date.now(),

  // 🎛 setters
  setAmplitude: (v) => set({ amplitude: clamp(v, 0, 1) }),
  setFrequency: (v) => set({ frequency: clamp(v, 0, 3) }),
  setNoise: (v) => set({ noise: clamp(v, 0, 1) }),

  // 🧠 core logic
  updateStatus: () => {
    const { amplitude, frequency, noise, stabilityTime, lastUpdate } = get();

    const now = Date.now();
    const dt = (now - lastUpdate) / 1000;

    // Intelligence: Calculate weighted progress toward targets
    // Target: Amp 0.7, Freq 2.0, Noise 0.0
    const ampDist = Math.abs(amplitude - 0.7);
    const freqDist = Math.abs(frequency - 2.0) / 2.0;
    const noiseDist = noise;

    const totalDist = (ampDist + freqDist + noiseDist) / 3.0;
    const progress = clamp(1.0 - totalDist * 1.5, 0, 1);

    const isStable = amplitude > 0.65 && frequency > 1.8 && noise < 0.12;

    let newStatus: Status = "UNSTABLE";
    let newStabilityTime = 0;

    if (isStable) {
      newStabilityTime = stabilityTime + dt;
      if (newStabilityTime > 1.8) {
        newStatus = "OPTIMAL";
      } else {
        newStatus = "STABLE";
      }
    } else {
      newStatus = progress > 0.6 ? "BALANCING" : "UNSTABLE";
      newStabilityTime = 0;
    }

    set({
      status: newStatus,
      stabilityProgress: progress,
      stabilityTime: newStabilityTime,
      lastUpdate: now,
    });
  },

  reset: () =>
    set({
      amplitude: 0.3,
      frequency: 1.0,
      noise: 0.3,
      status: "UNSTABLE",
      stabilityProgress: 0,
      stabilityTime: 0,
    }),
}));

// helper
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
