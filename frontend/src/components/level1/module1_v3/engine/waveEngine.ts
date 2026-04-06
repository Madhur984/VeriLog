export type WaveType = 'sine' | 'square' | 'triangle';

export interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  noise: number;
  waveType: WaveType;
}

// Precomputed noise — init once at module load
const NOISE_SIZE = 4096;
const noiseTable = new Float32Array(NOISE_SIZE);
for (let i = 0; i < NOISE_SIZE; i++) noiseTable[i] = (Math.random() - 0.5) * 2;

export function getNoiseValue(frame: number, idx: number): number {
  return noiseTable[(frame * 37 + idx * 7) & (NOISE_SIZE - 1)];
}

export function computeY(normX: number, t: number, params: WaveParams): number {
  const arg = normX * Math.PI * 2 * params.frequency + t + params.phase;

  let y: number;
  switch (params.waveType) {
    case 'square':
      y = Math.sin(arg) >= 0 ? 1 : -1;
      break;
    case 'triangle': {
      const a = ((arg / (Math.PI * 2)) % 1 + 1) % 1;
      y = a < 0.5 ? 4 * a - 1 : 3 - 4 * a;
      break;
    }
    default:
      y = Math.sin(arg);
  }

  return y * params.amplitude;
}

// Gaussian cursor-magnetic influence on wave
export function magneticPull(normX: number, cursorNormX: number, strength: number): number {
  const dist = normX - cursorNormX;
  return Math.exp(-(dist * dist) / 0.007) * strength;
}
