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
  magneticStrength: 0, // 0 = off

  // Trail
  showTrail: false,

  // Time control (S03)
  timeOffset: 0,
  frozen: false,

  // Secondary signal (S09)
  secondaryEnabled: false,
  secondaryPhase: 0,
  secondaryOpacity: 0.35,
};
