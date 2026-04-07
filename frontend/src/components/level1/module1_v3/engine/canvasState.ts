/**
 * canvasState — mutable object read directly by the RAF loop.
 * Updated without triggering React re-renders for high-freq data.
 */
export const canvasState = {
  // Visual (from useStateOfMind)
  lineWidth: 1.5,
  opacity: 0.35,

  // Cursor (updated on every mousemove)
  cursorNormX: -1,    // -1 = no influence
  cursorX: 0,
  cursorY: 0,
  magneticStrength: 0, // 0 = off

  // Resistance / Lerp targets
  currentA: 0.5,
  currentF: 1.0,

  // Trail
  showTrail: false,

  // Intro Cinematic / Entry (S00)
  introProgress: 0, // 0 to 6000ms
  introPhase: 0,    // 1: Void, 2: Activation, 3: Tunnel, 4: Collapse
  introText: '',
  tunnelOpacity: 0,
  tunnelLayerCount: 0,
  stabilizeCompress: 1.0, // scale factor for phase 4
  cameraZ: 2.5,


  // Time control (S03)
  timeOffset: 0,
  frozen: false,

  // Secondary signal (S09 - Interaction)
  secondaryEnabled: false,
  secondaryPhase: 0,
  secondaryOpacity: 0.35,
  secondaryAmplitudeMult: 0.8,
  secondaryFrequencyMult: 1.2,
  secondaryMagneticStrength: 0.1,
};

