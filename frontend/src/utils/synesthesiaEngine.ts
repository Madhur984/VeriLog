/**
 * synesthesiaEngine.ts
 * Procedural audio generator for bit-weighted feedback.
 * Maps binary positions to specific frequencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * Play a short sine/triangle tone at a frequency determined by bit position.
 * @param index - The bit index (0 is LSB, 7 is MSB)
 * @param type - Bit value ('high' or 'low')
 */
export const playBitTone = (index: number, type: 'high' | 'low' = 'high') => {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Base frequency: 220Hz (A3)
        // Each bit roughly corresponds to a musical interval
        const baseFreq = 220;
        const freq = baseFreq * Math.pow(1.5, index); // Using 5ths for professional resonance

        osc.type = type === 'high' ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Silently fail if blocked by browser policy
    }
};

/**
 * Generate a low-frequency hum that pulses based on system heat.
 */
let thermalOsc: OscillatorNode | null = null;
let thermalGain: GainNode | null = null;

export const setThermalResonance = (heatLevel: number) => {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        if (!thermalOsc) {
            thermalOsc = ctx.createOscillator();
            thermalGain = ctx.createGain();
            thermalOsc.type = 'sawtooth';
            thermalOsc.frequency.setValueAtTime(30, ctx.currentTime); // Deep hum
            thermalGain.gain.setValueAtTime(0, ctx.currentTime);
            
            const lowpass = ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.setValueAtTime(120, ctx.currentTime);

            thermalOsc.connect(lowpass);
            lowpass.connect(thermalGain);
            thermalGain.connect(ctx.destination);
            thermalOsc.start();
        }

        // Modulate volume and filter based on heat
        const targetVol = 0.02 + heatLevel * 0.08;
        thermalGain!.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.1);
    } catch { /* ignore */ }
};
