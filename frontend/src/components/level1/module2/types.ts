import type { HapticType, SoundType } from '../../../hooks/useGlobalSensory';

/** Shared Module 2 signal state stored in global memory. */
export interface M2Signal {
  amplitude: number;    // 0.1 – 1.0
  frequency: number;    // 1 – 15 Hz
  samplingRate: number; // 2 – 40 samples per period
  bitDepth: number;     // 1 – 8 bits
}

export interface M2ScreenProps {
  onNext: () => void;
  triggerHaptic: (type: HapticType) => void;
  playSound: (type: SoundType) => void;
  isIdle?: boolean;
  signal?: M2Signal;
  updateSignal?: (updates: Partial<M2Signal>) => void;
}

/** Design token constants shared across all M2 screens */
export const T = {
  bg: 'var(--t-bg, #FFFFFF)',
  card: 'var(--t-card, #F8FAFC)',
  surface: 'var(--t-surface, #F1F5F9)',
  border: 'var(--t-border, #E2E8F0)',
  text: 'var(--t-text, #0F172A)',
  muted: 'var(--t-muted, #64748B)',
  signal: 'var(--t-signal, #0EA5E9)',   // sky-500 — THE signal color
  interact: 'var(--t-interact, #F97316)', // orange — ONLY for sliders/handles
  success: 'var(--t-success, #059669)',
  error: 'var(--t-error, #DC2626)',
  mono: "'IBM Plex Mono', 'Roboto Mono', monospace",
} as const;

export const DEFAULT_SIGNAL: M2Signal = {
  amplitude: 0.65,
  frequency: 3,
  samplingRate: 12,
  bitDepth: 4,
};

