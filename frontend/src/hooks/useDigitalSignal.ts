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
    /** True if the signal is currently in an unstable 'metastable' state */
    isGlitching: boolean;
}

export function useDigitalSignal(noiseAmp = 0): DigitalSignalState {
    const [switchOn, setSwitchOn] = useState(false);
    const [inputVoltage, setInputVoltageState] = useState(3.3);
    const [isGlitching, setIsGlitching] = useState(false);
    
    const bufferRef = useRef(new Float32Array(BUFFER_SIZE));
    const writeHeadRef = useRef(0);
    const halfPeriodRef = useRef(0);
    const rafRef = useRef(0);
    
    // Internal prop-delay state
    const interpSwitchRef = useRef(0);

    const toggle = useCallback(() => setSwitchOn(v => !v), []);

    const setInputVoltage = useCallback((v: number) => {
        setInputVoltageState(Math.max(0, Math.min(5, v)));
    }, []);

    const classifyVoltage = (v: number, noise: number): VoltageClass => {
        const effective = v + noise;
        if (effective < VIL) return 'LOW';
        if (effective > VIH) return 'HIGH';
        return 'UNDEFINED';
    };

    // Generate square wave buffer & manage glitch state
    useEffect(() => {
        const periodFrames = 60;

        function tick() {
            // Simulated propagation delay (t_prop)
            const target = switchOn ? 5 : 0;
            interpSwitchRef.current += (target - interpSwitchRef.current) * 0.3;
            
            const squareSample = (halfPeriodRef.current < periodFrames / 2) ? interpSwitchRef.current : 0;

            let noise = 0;
            if (noiseAmp > 0) {
                const u1 = Math.random() + 1e-10;
                const u2 = Math.random();
                noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                noise *= noiseAmp * 0.4;
            }

            const analogNoisyV = squareSample + noise;
            bufferRef.current[writeHeadRef.current % BUFFER_SIZE] = analogNoisyV / 5;

            // Manage glitch flicker
            const currentEffective = inputVoltage + (Math.random() - 0.5) * noiseAmp * 0.2;
            const isUndef = currentEffective >= VIL && currentEffective <= VIH;
            if (isUndef) {
                // High frequency flicker simulation
                setIsGlitching(Math.random() > 0.5);
            } else {
                setIsGlitching(false);
            }

            halfPeriodRef.current = (halfPeriodRef.current + 1) % periodFrames;
            writeHeadRef.current++;

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [switchOn, noiseAmp, inputVoltage]);

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
        isGlitching
    };
}
