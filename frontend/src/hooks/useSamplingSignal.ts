import { useState, useMemo } from 'react';

export function useSamplingSignal() {
    const [signalFreq, setSignalFreq] = useState(2); // Hz
    const [sampleRate, setSampleRate] = useState(10); // Hz
    const [bitDepth, setBitDepth] = useState(8);    // bits

    const samples = useMemo(() => {
        const count = 256;
        const analog = new Float32Array(count);
        const sampled = new Float32Array(count);
        const quantized = new Float32Array(count);

        // ─── Analog Base Signal ───
        for (let i = 0; i < count; i++) {
            const t = i / count;
            analog[i] = (Math.sin(2 * Math.PI * signalFreq * t) + 1) / 2;
        }

        // ─── Sampling & Quantization Logic ───
        // We pick a "sample" every (count / sampleRate) steps
        const stepSize = count / sampleRate;
        const levels = Math.pow(2, bitDepth) - 1;

        for (let i = 0; i < count; i++) {
            // Find the last sample point
            const lastSampleIdx = Math.floor(i / stepSize) * stepSize;
            const sampleVal = analog[Math.floor(lastSampleIdx)];
            
            sampled[i] = sampleVal;
            
            // Quantize
            quantized[i] = Math.round(sampleVal * levels) / levels;
        }

        return { analog, sampled, quantized };
    }, [signalFreq, sampleRate, bitDepth]);

    const isAliased = sampleRate < 2 * signalFreq;

    return {
        signalFreq, setSignalFreq,
        sampleRate, setSampleRate,
        bitDepth, setBitDepth,
        waveforms: samples,
        isAliased
    };
}
