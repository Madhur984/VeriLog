/**
 * useAnalogSignal.ts
 *
 * Manages potentiometer slider state and generates a continuous
 * analog waveform for the oscilloscope buffer.
 *
 * Signal shape:
 *   - Slow sweep → ramp (rising edge proportional to slider)
 *   - Quick change → transient spike then settles
 *   - Noise amplitude injected externally via noiseAmp prop
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const BUFFER_SIZE = 256;

export type NoiseType = 'gaussian' | 'burst' | 'drift' | 'emi';

export interface AnalogSignalState {
    /** 0-100 potentiometer percentage */
    sliderValue: number;
    setSlider: (v: number) => void;
    /** Circular waveform buffer for oscilloscope (0-1 normalized) */
    waveformSamples: Float32Array;
    /** Voltage in volts (0-5V mapped from 0-100) */
    voltageV: number;
    /** LED brightness 0-1 */
    brightness: number;
}

export function useAnalogSignal(noiseAmp = 0, noiseType: NoiseType = 'gaussian'): AnalogSignalState {
    const [sliderValue, setSliderValue] = useState(50);
    const bufferRef = useRef(new Float32Array(BUFFER_SIZE));
    const writeHeadRef = useRef(0);
    const prevSliderRef = useRef(50);
    const rafRef = useRef(0);
    
    // Noise personality state
    const driftRef = useRef(0);

    const setSlider = useCallback((v: number) => {
        setSliderValue(Math.max(0, Math.min(100, v)));
    }, []);

    // Continuously fill the waveform buffer at ~60fps
    useEffect(() => {
        let frame = 0;

        function tick() {
            const target = sliderValue / 100;
            const prev = prevSliderRef.current / 100;
            // Interpolate towards target - creates ramp effect
            const interp = prev + (target - prev) * 0.08;
            prevSliderRef.current = interp * 100;

            // ─── Noise Personality Engine ───
            let noise = 0;
            if (noiseAmp > 0) {
                switch (noiseType) {
                    case 'gaussian': {
                        const u1 = Math.random();
                        const u2 = Math.random();
                        noise = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
                        break;
                    }
                    case 'burst': {
                        // Random high-amplitude spikes
                        if (Math.random() < 0.05) {
                            noise = (Math.random() - 0.5) * 2.5;
                        }
                        break;
                    }
                    case 'drift': {
                        // Low-frequency wander
                        driftRef.current += (Math.random() - 0.5) * 0.2;
                        driftRef.current *= 0.95; // Return to center
                        noise = driftRef.current;
                        break;
                    }
                    case 'emi': {
                        // Simulated 50Hz hum
                        noise = Math.sin(frame * 0.5) * 0.5;
                        break;
                    }
                }
                noise *= noiseAmp * 0.04;
            }

            const sample = Math.max(0, Math.min(1, interp + noise));
            bufferRef.current[writeHeadRef.current % BUFFER_SIZE] = sample;
            writeHeadRef.current++;
            frame++;

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [sliderValue, noiseAmp, noiseType]);

    const voltageV = (sliderValue / 100) * 5;
    const brightness = sliderValue / 100;

    return {
        sliderValue,
        setSlider,
        waveformSamples: bufferRef.current,
        voltageV,
        brightness,
    };
}
