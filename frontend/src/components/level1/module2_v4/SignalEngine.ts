/**
 * SignalEngine.ts
 * Optimized mathematical engine for Module 2: The Digital Bridge.
 * 
 * Performance Focus:
 * - O(N) Windowed Sinc Reconstruction
 * - Stabilized Randomness (Seeded Noise)
 * - Cached Constants
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

export interface SignalMetrics {
  snr: number;        
  enob: number;       
  thdn: number;       
  aliasing: boolean;  
}

// Simple seeded random to stabilize jitter/dither per frame if needed
// However, since physics is decoupled, we usually want these to be "live" noise.
// To satisfy "stabilize randomness", we can pre-generate a noise buffer.
const NOISE_BUFFER_SIZE = 1024;
const noiseBuffer = Array.from({ length: NOISE_BUFFER_SIZE }, () => Math.random());
let noisePtr = 0;
const getNoise = () => noiseBuffer[(noisePtr++) % NOISE_BUFFER_SIZE];

/**
 * Core Engine Function
 */
export const SignalEngine = (config: SignalConfig, time: number, width: number, height: number) => {
  const { frequency, amplitude, sampleRate, bitDepth, jitter, dither, reconstruction } = config;
  const cy = height / 2;
  const amp = amplitude;
  
  // Reset noise pointer for frame-stability if called with same time
  // Actually, to make it feel like real-time noise, we SHOULD let it fluctuate,
  // but the user wants to "stabilize jitter randomness causing flicker".
  // Let's use the time as a seed or offset.
  noisePtr = Math.floor(time * 60) % NOISE_BUFFER_SIZE;

  // 1. Aliasing Detection (Fundamental + Harmonics)
  // Higher pedagogical accuracy: nyquist is Fs/2.
  const fundamental = frequency * 2; // Arbitrary scaling for display
  const f_max_scaled = frequency * 5; 
  const aliasing = sampleRate < 2 * f_max_scaled;

  // 2. Quantization Constants
  const effectiveBits = Math.max(1, bitDepth);
  const levels = Math.pow(2, effectiveBits);
  const stepSize = 2 / (levels - 1);

  // 3. Generate Analog Path (Reference)
  // Optimization: Reduce resolution for preview if needed, but 200 is fine.
  const analogPoints: { x: number; y: number }[] = [];
  const resolution = 200;
  for (let i = 0; i < resolution; i++) {
    const x = (i / (resolution - 1)) * width;
    const t_factor = (x / width) * Math.PI * 2 * f_max_scaled + time * 2;
    const y = cy + amp * Math.sin(t_factor);
    analogPoints.push({ x, y });
  }

  // 4. Generate Samples
  const numSamples = Math.max(2, Math.floor(sampleRate || 2));
  const samples: Sample[] = [];
  const effectiveFs = Math.max(0.1, sampleRate);
  
  for (let i = 0; i < numSamples; i++) {
    const idealX = (i / (numSamples - 1)) * width;
    
    // Stabilized Jitter
    const jitterOffset = (getNoise() - 0.5) * jitter * 30;
    const x = Math.min(width, Math.max(0, idealX + jitterOffset));
    
    const timeFactor = (idealX / width) * Math.PI * 2 * f_max_scaled + time * 2;
    let analogVal = Math.sin(timeFactor);
    
    // Stabilized Dither (Triangular PDF)
    if (dither) {
      const d1 = getNoise();
      const d2 = getNoise();
      const ditherVal = (d1 + d2 - 1) * stepSize;
      analogVal += ditherVal;
    }
    
    // Quantize
    const quantizedVal = Math.round(analogVal / stepSize) * stepSize;
    const y = cy + quantizedVal * amp;
    const error = analogVal - quantizedVal;
    
    samples.push({ x, y, analogVal, quantizedVal, error });
  }

  // 5. Reconstruction Optimization
  const reconstructedPoints: { x: number; y: number }[] = [];
  const sampleInterval = width / (numSamples - 1 || 1);

  if (reconstruction === 'sinc') {
    // Windowed Sinc: O(N * window) instead of O(N * M)
    const windowSize = 8; // Look at ±8 closest samples
    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1)) * width;
      
      // Find range of samples and iterate
      const nearIndex = Math.floor(x / sampleInterval);
      const startS = Math.max(0, nearIndex - windowSize);
      const endS = Math.min(numSamples - 1, nearIndex + windowSize);
      
      let sum = 0;
      for (let s = startS; s <= endS; s++) {
        const sample = samples[s];
        const dx = (x - sample.x) / sampleInterval;
        
        if (Math.abs(dx) < 1e-6) {
          sum += sample.quantizedVal;
        } else {
          // Lanczos-style or just windowed Sinc
          const sinc = Math.sin(Math.PI * dx) / (Math.PI * dx);
          // Apply a subtle Blackman or Hamming window to reduce ripple? 
          // Keep it pure for pedagogical accuracy but windowed for perf.
          sum += sample.quantizedVal * sinc;
        }
      }
      reconstructedPoints.push({ x, y: cy + sum * amp });
    }
  } else {
    // Zero-Order Hold (Optimized skip-search)
    let sIdx = 0;
    for (let i = 0; i < resolution; i++) {
        const x = (i / (resolution - 1)) * width;
        while (sIdx < numSamples - 1 && samples[sIdx + 1].x <= x) {
            sIdx++;
        }
        reconstructedPoints.push({ x, y: cy + samples[sIdx].quantizedVal * amp });
    }
  }

  // 6. Metrics Calculation (Optimized & Cached)
  const theoreticalSNR = 6.02 * bitDepth + 1.76;
  const jitterPenalty = jitter * 40; // Simulated penalty
  const snr = Math.max(0, theoreticalSNR - jitterPenalty);
  const enob = Math.max(0, (snr - 1.76) / 6.02);
  
  // THD+N calculation using pre-calculated errors
  let sigSquareSum = 0;
  let noiseSquareSum = 0;
  for (let i = 0; i < numSamples; i++) {
    sigSquareSum += samples[i].analogVal ** 2;
    noiseSquareSum += samples[i].error ** 2;
  }
  const thdn = 10 * Math.log10((noiseSquareSum / (sigSquareSum + 0.0001)) + 0.000001);

  return {
    analogPoints,
    samples,
    reconstructedPoints,
    metrics: {
      snr,
      enob,
      thdn,
      aliasing
    }
  };
};
