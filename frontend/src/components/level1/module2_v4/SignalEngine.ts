/**
 * SignalEngine.ts
 * Core mathematical engine for Module 2: The Digital Bridge.
 * Handles continuous, sampled, and quantized signal generation, 
 * reconstruction, and performance metrics.
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
  snr: number;        // Signal-to-Noise Ratio (dB)
  enob: number;       // Effective Number of Bits
  thdn: number;       // Total Harmonic Distortion + Noise (dB)
  aliasing: boolean;  // Fs < 2 * f_max
}

export const SignalEngine = (config: SignalConfig, time: number, width: number, height: number) => {
  const { frequency, amplitude, sampleRate, bitDepth, jitter, dither, reconstruction } = config;
  const cy = height / 2;
  const amp = amplitude;
  
  // 1. Aliasing Detection
  // We assume the signal has a fundamental frequency. In this engine, we scale frequency for visualization.
  // The actual max frequency component is frequency * 5 based on previous lab logic.
  const f_max_scaled = frequency * 5;
  const aliasing = sampleRate < 2 * f_max_scaled;

  // 2. Quantization Constants
  const effectiveBits = Math.max(1, bitDepth);
  const levels = Math.pow(2, effectiveBits);
  const stepSize = 2 / (levels - 1);

  // 3. Generate Analog Path (Reference)
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
    
    // Add Jitter
    const jitterOffset = (Math.random() - 0.5) * jitter * 30;
    const x = Math.min(width, Math.max(0, idealX + jitterOffset));
    
    const timeFactor = (idealX / width) * Math.PI * 2 * f_max_scaled + time * 2;
    let analogVal = Math.sin(timeFactor);
    
    // Add Dither (Triangular PDF)
    if (dither) {
      const ditherVal = (Math.random() + Math.random() - 1) * stepSize;
      analogVal += ditherVal;
    }
    
    // Quantize
    const quantizedVal = Math.round(analogVal / stepSize) * stepSize;
    const y = cy + quantizedVal * amp;
    const error = analogVal - quantizedVal;
    
    samples.push({ x, y, analogVal, quantizedVal, error });
  }

  // 5. Reconstruction
  const reconstructedPoints: { x: number; y: number }[] = [];
  if (reconstruction === 'sinc') {
    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1)) * width;
      let sum = 0;
      samples.forEach((sample) => {
        const dx = (x - sample.x) / (width / effectiveFs);
        if (Math.abs(dx) < 1e-6) {
          sum += sample.quantizedVal;
        } else {
          sum += sample.quantizedVal * Math.sin(Math.PI * dx) / (Math.PI * dx);
        }
      });
      reconstructedPoints.push({ x, y: cy + sum * amp });
    }
  } else {
    // Zero-Order Hold
    for (let i = 0; i < resolution; i++) {
      const x = (i / (resolution - 1)) * width;
      const lastSample = [...samples].reverse().find(s => s.x <= x);
      const val = lastSample ? lastSample.quantizedVal : samples[0].quantizedVal;
      reconstructedPoints.push({ x, y: cy + val * amp });
    }
  }

  // 6. Metrics Calculation
  const theoreticalSNR = 6.02 * bitDepth + 1.76;
  const jitterFactor = jitter * 20;
  const snr = Math.max(0, theoreticalSNR - jitterFactor);
  const enob = (snr - 1.76) / 6.02;
  
  // Simple THD+N simulation
  let signalPower = 0;
  let noisePower = 0;
  samples.forEach(s => {
    signalPower += s.analogVal * s.analogVal;
    noisePower += s.error * s.error;
  });
  const thdn = 20 * Math.log10(Math.sqrt(noisePower / (signalPower + 1e-10)) + 1e-10);

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
