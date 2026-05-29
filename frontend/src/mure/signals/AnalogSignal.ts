/**
 * mure/signals/AnalogSignal.ts - Analog Signal Model
 *
 * Represents continuous voltage values.
 * Helper utilities for voltage interpolation and range clamping.
 */

export interface AnalogSignal {
    voltage: number;
}

export function createAnalogSignal(voltage = 0): AnalogSignal {
    return { voltage };
}

/** Clamp voltage to valid range */
export function clampVoltage(v: number, min = 0, max = 12): number {
    return Math.max(min, Math.min(max, v));
}

/** Linear interpolation between two voltages */
export function lerpVoltage(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Convert analog voltage to normalized 0-1 range */
export function normalizeVoltage(v: number, vMin = 0, vMax = 5): number {
    if (vMax === vMin) return 0;
    return Math.max(0, Math.min(1, (v - vMin) / (vMax - vMin)));
}
