/**
 * SignalEngine.ts
 * High-fidelity mathematical engine for Module 2 v5: The Digital Bridge.
 * 
 * Features:
 * - Lanczos-3 (3rd order sinc) Reconstruction Kernel
 * - TPDF Dither (Triangular PDF) for Harmonic Linearization
 * - Scientifically Standard SNR Metrics (6.02N + 1.76 dB)
 * - Real-time Signal Integrity (Fidelity) Metrics
 */

export interface SignalConfig {
    frequency: number;   
    amplitude: number;
    sampleRate: number;  // Fs
    bitDepth: number;    // N
    jitter: number;      
    dither: boolean;
    reconstruction: 'sinc' | 'zoh';
}

export interface Sample {
    x: number;
    y: number;
    analogVal: number;
    quantizedVal: number;
    error: number;
}

const NOISE_BUFFER_SIZE = 1024;
const noiseBuffer = Array.from({ length: NOISE_BUFFER_SIZE }, () => Math.random());
let noisePtr = 0;
const getNoise = () => noiseBuffer[(noisePtr++) % NOISE_BUFFER_SIZE];

const lanczos = (x: number, a: number = 3) => {
    if (Math.abs(x) < 0.0001) return 1;
    if (Math.abs(x) >= a) return 0;
    const pix = Math.PI * x;
    return (a * Math.sin(pix) * Math.sin(pix / a)) / (pix * pix);
};

export const SignalEngine = (config: SignalConfig, time: number, width: number, height: number) => {
    const frequency = Math.max(0.001, config.frequency || 0.1);
    const amplitude = Math.max(0, config.amplitude || 10);
    const sampleRate = Math.max(1, config.sampleRate || 1);
    const bitDepth = Math.max(1, Math.min(24, config.bitDepth || 1)); 
    const jitter = Math.max(0, Math.min(1, config.jitter || 0));
    const { dither, reconstruction } = config;

    const cy = height / 2;
    const amp = amplitude;
    
    noisePtr = Math.floor(time * 60) % NOISE_BUFFER_SIZE;

    // Aliasing Logic
    const f_max_scaled = frequency * 5; 
    const aliasing = sampleRate > 0 && sampleRate < 2 * f_max_scaled;

    // Quantization Logic
    const levels = Math.pow(2, bitDepth);
    const stepSize = 2 / (levels - 1);

    // 1. Analog Reference (The Truth)
    const analogPoints: { x: number; y: number }[] = [];
    const resolution = 300;
    for (let i = 0; i < resolution; i++) {
        const x = (i / (resolution - 1)) * width;
        const t_factor = (x / width) * Math.PI * 2 * f_max_scaled + time * 2;
        const y = cy + amp * Math.sin(t_factor);
        analogPoints.push({ x, y });
    }

    // 2. Discrete Samples (The Capture)
    const numSamples = Math.floor(sampleRate);
    const samples: Sample[] = [];
    let totalError = 0;
    
    for (let i = 0; i < numSamples; i++) {
        const idealX = (i / (numSamples - 1)) * width;
        const jitterOffset = (getNoise() - 0.5) * jitter * 30;
        const x = Math.min(width, Math.max(0, idealX + jitterOffset));
        
        const timeFactor = (idealX / width) * Math.PI * 2 * f_max_scaled + time * 2;
        let analogVal = Math.sin(timeFactor);
        
        if (dither && bitDepth > 0) {
            const d1 = getNoise();
            const d2 = getNoise();
            analogVal += (d1 + d2 - 1) * stepSize;
        }
        
        const quantizedVal = Math.round(analogVal / stepSize) * stepSize;
        const y = cy + quantizedVal * amp;
        const error = Math.abs(analogVal - quantizedVal);
        totalError += error;
        
        samples.push({ x, y, analogVal, quantizedVal, error });
    }

    // 3. Digital Reconstruction (The Illusion)
    const reconstructedPoints: { x: number; y: number }[] = [];
    const sampleInterval = width / (numSamples - 1);

    if (reconstruction === 'sinc' && numSamples > 2) {
        for (let i = 0; i < resolution; i++) {
            const x = (i / (resolution - 1)) * width;
            let sum = 0;
            const nearIndex = Math.floor(x / sampleInterval);
            const window = 3; 
            for (let s = Math.max(0, nearIndex - window); s <= Math.min(numSamples - 1, nearIndex + window); s++) {
                const sample = samples[s];
                if (!sample) continue;
                const dx = (x - sample.x) / sampleInterval;
                sum += sample.quantizedVal * lanczos(dx);
            }
            reconstructedPoints.push({ x, y: cy + sum * amp });
        }
    } else {
        let sIdx = 0;
        for (let i = 0; i < resolution; i++) {
            const x = (i / (resolution - 1)) * width;
            while (sIdx < numSamples - 1 && samples[sIdx + 1] && samples[sIdx + 1].x <= x) sIdx++;
            reconstructedPoints.push({ x, y: cy + (samples[sIdx]?.quantizedVal || 0) * amp });
        }
    }

    // 4. Advanced Metrics
    const snr = 6.02 * bitDepth + 1.76;
    const avgError = totalError / numSamples;
    const fidelity = Math.max(0, 100 - (avgError * 50) - (aliasing ? 40 : 0));
    const dataLoss = 100 - fidelity;

    // Buffers for Canvas
    const analogBuffer = new Float32Array(analogPoints.map(p => (cy - p.y) / amp));
    const digitalBuffer = new Float32Array(reconstructedPoints.map(p => (cy - p.y) / amp));

    return {
        analogPoints,
        samples,
        reconstructedPoints,
        analogBuffer,
        digitalBuffer,
        metrics: {
            snr,
            enob: bitDepth,
            fidelity,
            dataLoss,
            aliasing,
            error: avgError
        }
    };
};
