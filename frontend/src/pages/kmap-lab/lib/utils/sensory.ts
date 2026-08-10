/**
 * Sensory Feedback Utility for K-Map Lab
 * Provides Web Haptics (navigator.vibrate) and zero-asset Web Audio synthesis.
 */

// Native Web Audio Context singleton
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Plays a retro synth click tone based on cell value (0, 1, X).
 */
export const playCellSound = (val: 0 | 1 | 'X') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (val === 1) {
      osc.type = "square";
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (val === 'X') {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(329.63, now); // E4
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    // Ignore audio autoplay policies gracefully
  }
};

/**
 * Plays a celebratory chord arpeggio when a circuit is simplified.
 */
export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime + idx * 0.06;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  } catch (e) {
    // Ignore audio policy error
  }
};

/**
 * Triggers Web Haptics vibration pulses on supported mobile & touch devices.
 */
export const triggerHaptic = (type: 'tap' | 'hazard' | 'success') => {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;

  try {
    if (type === 'tap') {
      navigator.vibrate(12);
    } else if (type === 'hazard') {
      navigator.vibrate([30, 40, 30]);
    } else if (type === 'success') {
      navigator.vibrate([15, 30, 15, 30, 60]);
    }
  } catch (e) {
    // Haptics fallback
  }
};
