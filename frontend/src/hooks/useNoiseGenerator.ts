/**
 * useNoiseGenerator.ts
 *
 * Provides a shared noise amplitude state and a utility to inject
 * Gaussian noise into a waveform sample array.
 *
 * Box-Muller transform for Gaussian distribution.
 * noiseAmp range: 0 (silent) → 10 (maximum chaos)
 */

import { useState, useCallback } from 'react';

export interface NoiseGeneratorState {
    noiseAmp: number;
    setNoiseAmp: (v: number) => void;
    /** Returns a new array with Gaussian noise applied in-place copy */
    applyNoise: (samples: Float32Array) => Float32Array;
    /** Single noise sample scaled by current amplitude */
    noiseSample: () => number;
}

export function useNoiseGenerator(): NoiseGeneratorState {
    const [noiseAmp, setNoiseAmpState] = useState(0);

    const setNoiseAmp = useCallback((v: number) => {
        setNoiseAmpState(Math.max(0, Math.min(10, v)));
    }, []);

    const noiseSample = useCallback((): number => {
        if (noiseAmp === 0) return 0;
        // Box-Muller transform
        const u1 = Math.random() + 1e-10;
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z * (noiseAmp / 10) * 0.15;
    }, [noiseAmp]);

    const applyNoise = useCallback((samples: Float32Array): Float32Array => {
        if (noiseAmp === 0) return samples;
        const out = new Float32Array(samples.length);
        for (let i = 0; i < samples.length; i++) {
            const u1 = Math.random() + 1e-10;
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const noise = z * (noiseAmp / 10) * 0.18;
            out[i] = Math.max(0, Math.min(1, samples[i] + noise));
        }
        return out;
    }, [noiseAmp]);

    return { noiseAmp, setNoiseAmp, applyNoise, noiseSample };
}
