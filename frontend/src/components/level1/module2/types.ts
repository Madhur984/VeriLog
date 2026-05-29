import type { HapticType, SoundType } from '../../../hooks/useGlobalSensory';

/** Shared Module 2 signal state stored in global memory. */
export interface M2Signal {
  amplitude: number;    // 0.1 - 1.0
  frequency: number;    // 1 - 15 Hz
  samplingRate: number; // 2 - 40 samples per period
  bitDepth: number;     // 1 - 8 bits
}

export interface M2ScreenProps {
  onNext: () => void;
  triggerHaptic: (type: HapticType) => void;
  playSound: (type: SoundType) => void;
  isIdle?: boolean;
  signal?: M2Signal;
  updateSignal?: (updates: Partial<M2Signal>) => void;
}

/** Design token constants shared across all M2 screens - ULTIMATE BITFORBYTES EDITION */
export const T = {
  bg: '#0A0A0B',        // matte-obsidian
  card: '#121215',      // solder-mask
  surface: '#1A1A20',
  border: '#2A2A35',    // ghost-trace
  text: '#E6E6ED',      // oscilloscope-trace
  muted: '#8A8A99',     // grid-line
  signal: '#00D4FF',    // plasma-cyan
  interact: '#FF5F1F',  // burnished-copper
  success: '#10B981',   // success-green
  error: '#DC2626',
  mono: "'IBM Plex Mono', 'Space Mono', monospace",
} as const;

export const DEFAULT_SIGNAL: M2Signal = {
  amplitude: 0.65,
  frequency: 3,
  samplingRate: 12,
  bitDepth: 4,
};

