/**
 * designTokens.ts - Standardized Micro-Timings & Interaction Physics
 * 
 * Defines the "feel" of the application based on the 2026 Micro-Interaction Philosophy.
 */

export const DURATIONS = {
    TAP: 0.08,             // 80ms - Instant response
    SLIDER_DELAY: 0.016,    // 16ms - Real-time per frame
    GLOW_TRAVEL: 0.35,      // 350ms - Perceived propagation
    SUCCESS: 0.45,          // 450ms - Reward settle
    ERROR: 0.20,            // 200ms - Glitch stabilize
    SETTLE: 0.3,            // 300ms - Physical bounce-back
};

export const SPRINGS = {
    // Snappy but physical
    INTERACTIVE: { stiffness: 400, damping: 25 }, 
    
    // Magnetic pull (stiffer)
    MAGNETIC: { stiffness: 600, damping: 20 },
    
    // Soft, organic settle
    ORGANIC: { stiffness: 150, damping: 15, mass: 1 },
    
    // Ultra-snappy
    INSTANT: { stiffness: 800, damping: 40 },
};

export const COLORS = {
    GLOW_PRIMARY: 'rgba(0, 212, 255, 0.4)',
    GLOW_SECONDARY: 'rgba(0, 212, 255, 0.1)',
    ERROR_GLITCH: 'rgba(239, 68, 68, 0.2)',
    SUCCESS_HARMONIC: 'rgba(16, 185, 129, 0.2)',
};
