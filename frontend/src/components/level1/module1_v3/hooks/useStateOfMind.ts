// Maps scene number to signal visual state.
// Varies opacity, lineWidth, intensity — NOT color hue.
export interface MindState {
  opacity: number;
  lineWidth: number;
  intensity: number; // 0-1, used for supplemental effects
  mode: 'curiosity' | 'discovery' | 'control' | 'mastery' | 'conclusion';
}

const STATES: MindState[] = [
  { opacity: 0.20, lineWidth: 1.2, intensity: 0.2, mode: 'curiosity' },   // S00 Entry
  { opacity: 0.35, lineWidth: 1.5, intensity: 0.3, mode: 'curiosity' },   // S01 Identity
  { opacity: 0.50, lineWidth: 1.7, intensity: 0.4, mode: 'discovery' },   // S02 Signal
  { opacity: 0.60, lineWidth: 1.8, intensity: 0.5, mode: 'discovery' },   // S03 Time
  { opacity: 0.68, lineWidth: 2.0, intensity: 0.6, mode: 'discovery' },   // S04 Energy
  { opacity: 0.72, lineWidth: 2.0, intensity: 0.65, mode: 'control' },    // S05 Frequency
  { opacity: 0.78, lineWidth: 2.1, intensity: 0.7, mode: 'control' },     // S06 Shape
  { opacity: 0.82, lineWidth: 2.2, intensity: 0.75, mode: 'control' },    // S07 Noise
  { opacity: 0.87, lineWidth: 2.3, intensity: 0.82, mode: 'control' },    // S08 Control
  { opacity: 0.92, lineWidth: 2.5, intensity: 0.9, mode: 'mastery' },     // S09 Interaction
  { opacity: 0.94, lineWidth: 2.5, intensity: 0.93, mode: 'mastery' },    // S10 RealWorld
  { opacity: 0.97, lineWidth: 2.5, intensity: 0.97, mode: 'mastery' },    // S11 Lab
  { opacity: 1.00, lineWidth: 3.0, intensity: 1.0,  mode: 'conclusion' }, // S12 Conclusion
];

export function useStateOfMind(scene: number): MindState {
  return STATES[Math.min(Math.max(scene, 0), STATES.length - 1)];
}
