/**
 * SignalEngine.ts
 * High-fidelity mathematical engine for Module 2: The Digital Bridge.
 * 
 * Features:
 * - Lanczos-3 (3rd order sinc) Reconstruction Kernel
 * - TPDF Dither (Triangular PDF) for Harmonic Linearization
 * - Scientifically Standard SNR Metrics (6.02N + 1.76 dB)
 */

export interface SignalConfig {
    frequency: number;   // f_max
    amplitude: number;
    sampleRate: number;  // Fs
    bitDepth: number;    // N
    jitter: number;      // sigma
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

/**
 * Lanczos Kernel (Order 3) - Superior to standard Sinc for visual reconstruction
 */
const lanczos = (x: number, a: number = 3) => {
    if (Math.abs(x) < 0.0001) return 1;
    if (Math.abs(x) >= a) return 0;
    const pix = Math.PI * x;
    return (a * Math.sin(pix) * Math.sin(pix / a)) / (pix * pix);
};

export const SignalEngine = (config: SignalConfig, time: number, width: number, height: number) => {
    // 0. Safety Sanitize
    const frequency = Math.max(0.001, config.frequency || 0.1);
    const amplitude = Math.max(0, config.amplitude || 10);
    const sampleRate = Math.max(0, config.sampleRate || 0);
    const bitDepth = Math.max(0, Math.min(24, config.bitDepth || 0)); // Cap at 24-bit for stability
    const jitter = Math.max(0, Math.min(1, config.jitter || 0));
    const { dither, reconstruction } = config;

    const cy = height / 2;
    const amp = amplitude;
    
    noisePtr = Math.floor(time * 60) % NOISE_BUFFER_SIZE;

    // Aliasing Detection
    const f_max_scaled = frequency * 5; 
    const aliasing = sampleRate > 0 && sampleRate < 2 * f_max_scaled;

    // Quantization Constants
    const effectiveBits = bitDepth;
    const levels = effectiveBits > 0 ? Math.pow(2, effectiveBits) : 0;
    const stepSize = levels > 1 ? 2 / (levels - 1) : 0;

    // 1. Generate Analog Path (Reference)
    const analogPoints: { x: number; y: number }[] = [];
    const resolution = 200;
    for (let i = 0; i < resolution; i++) {
        const x = (i / (resolution - 1)) * width;
        const t_factor = (x / width) * Math.PI * 2 * f_max_scaled + time * 2;
        const y = cy + amp * Math.sin(t_factor);
        analogPoints.push({ x, y });
    }

    // 2. Generate Samples
    const numSamples = Math.max(2, Math.floor(sampleRate || 2));
    const samples: Sample[] = [];
    
    for (let i = 0; i < numSamples; i++) {
        const idealX = (i / (numSamples - 1)) * width;
        const jitterOffset = (getNoise() - 0.5) * jitter * 30;
        const x = Math.min(width, Math.max(0, idealX + jitterOffset));
        
        const timeFactor = (idealX / width) * Math.PI * 2 * f_max_scaled + time * 2;
        let analogVal = Math.sin(timeFactor);
        
        // Elite Dither: TPDF (Triangular) instead of Rectangular
        if (dither && bitDepth > 0 && stepSize > 0) {
            const d1 = getNoise();
            const d2 = getNoise();
            analogVal += (d1 + d2 - 1) * stepSize;
        }
        
        const quantizedVal = (bitDepth > 0 && stepSize > 0) 
            ? Math.round(analogVal / stepSize) * stepSize 
            : analogVal;
            
        const y = cy + quantizedVal * amp;
        const error = analogVal - quantizedVal;
        
        samples.push({ x, y, analogVal, quantizedVal, error });
    }

    // 3. Reconstruction
    const reconstructedPoints: { x: number; y: number }[] = [];
    const sampleInterval = numSamples > 1 ? width / (numSamples - 1) : width;

    if (reconstruction === 'sinc' && sampleRate > 0 && sampleInterval > 0) {
        for (let i = 0; i < resolution; i++) {
            const x = (i / (resolution - 1)) * width;
            let sum = 0;
            
            // Optimization: Only use Lanczos window
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
        // Zero-Order Hold
        let sIdx = 0;
        for (let i = 0; i < resolution; i++) {
            const x = (i / (resolution - 1)) * width;
            while (sIdx < numSamples - 1 && samples[sIdx + 1] && samples[sIdx + 1].x <= x) sIdx++;
            reconstructedPoints.push({ x, y: cy + (samples[sIdx]?.quantizedVal || 0) * amp });
        }
    }

    // 4. Metrics calculation
    const snr = bitDepth > 0 ? 6.02 * bitDepth + 1.76 : 120; // Default to 120dB for infiniteish
    const thdn = bitDepth > 0 ? -snr : -120; 

    return {
        analogPoints,
        samples,
        reconstructedPoints,
        metrics: {
            snr,
            enob: bitDepth,
            thdn,
            aliasing
        }
    };
};
