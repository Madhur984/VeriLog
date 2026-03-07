/**
 * useDigitalSignal.ts
 *
 * Models a SPST switch and digital voltage threshold classifier.
 *
 * Features:
 *   - switchOn / toggle — binary ON/OFF
 *   - inputVoltage (0–5V) — for threshold demo slider
 *   - voltageClass: 'LOW' | 'HIGH' | 'UNDEFINED'
 *   - Square wave buffer for oscilloscope
 *   - Noise immunity: digital output stays stable if noise < margin
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const BUFFER_SIZE = 256;

// Standard CMOS-style thresholds
const VIL = 0.8;  // Max LOW input voltage
const VIH = 2.0;  // Min HIGH input voltage

export type VoltageClass = 'LOW' | 'HIGH' | 'UNDEFINED';

export interface DigitalSignalState {
    switchOn: boolean;
    toggle: () => void;
    inputVoltage: number;
    setInputVoltage: (v: number) => void;
    voltageClass: VoltageClass;
    waveformSamples: Float32Array;
    /** Output voltage AFTER digital buffer (noise-immune) */
    outputVoltage: number;
}

export function useDigitalSignal(noiseAmp = 0): DigitalSignalState {
    const [switchOn, setSwitchOn] = useState(false);
    const [inputVoltage, setInputVoltageState] = useState(3.3);
    const bufferRef = useRef(new Float32Array(BUFFER_SIZE));
    const writeHeadRef = useRef(0);
    const halfPeriodRef = useRef(0);
    const stateRef = useRef(false);
    const rafRef = useRef(0);

    const toggle = useCallback(() => setSwitchOn(v => !v), []);

    const setInputVoltage = useCallback((v: number) => {
        setInputVoltageState(Math.max(0, Math.min(5, v)));
    }, []);

    const classifyVoltage = (v: number, noise: number): VoltageClass => {
        // Add noise to analog input, then interpret
        const effective = v + noise;
        if (effective < VIL) return 'LOW';
        if (effective > VIH) return 'HIGH';
        return 'UNDEFINED';
    };

    // Generate square wave buffer
    useEffect(() => {
        const periodFrames = 60; // 1 second period at ~60fps

        function tick() {
            // Determine current half-period output
            const highV = switchOn ? 5 : 0;
            const squareSample = (halfPeriodRef.current < periodFrames / 2) ? highV : 0;

            let noise = 0;
            if (noiseAmp > 0) {
                const u1 = Math.random() + 1e-10;
                const u2 = Math.random();
                noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                noise *= noiseAmp * 0.4;
            }

            // Digital output is immune to noise below margin
            const analogNoisyV = squareSample + noise;

            // Store normalized value (0–1)
            bufferRef.current[writeHeadRef.current % BUFFER_SIZE] = analogNoisyV / 5;

            halfPeriodRef.current = (halfPeriodRef.current + 1) % periodFrames;
            stateRef.current = !stateRef.current;
            writeHeadRef.current++;

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [switchOn, noiseAmp]);

    const getNoiseAmount = () => {
        if (noiseAmp <= 0) return 0;
        return (Math.random() - 0.5) * noiseAmp * 0.5;
    };

    const voltageClass = classifyVoltage(inputVoltage, getNoiseAmount());
    const outputVoltage = switchOn ? 5 : 0;

    return {
        switchOn,
        toggle,
        inputVoltage,
        setInputVoltage,
        voltageClass,
        waveformSamples: bufferRef.current,
        outputVoltage,
    };
}
