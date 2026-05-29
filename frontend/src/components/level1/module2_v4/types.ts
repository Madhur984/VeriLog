export interface GlobalSignalState {
  sampleRate: number;
  bitDepth: number;
  frequency: number;
  amplitude: number;
  jitter: number;
  dither: boolean;
  reconstruction: 'zoh' | 'sinc';
}
