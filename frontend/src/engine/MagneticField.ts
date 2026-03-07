import { SnapNode, MagneticForce } from './types';

export const MAGNETIC_RADIUS = 80;   // px — attraction begins
export const SNAP_THRESHOLD = 24;    // px — instant lock
export const ATTRACTION_STRENGTH = 0.85;

/**
 * Calculates the magnetic attraction force between a cursor and a snap node.
 */
export function computeForce(
    cursorX: number,
    cursorY: number,
    snapNode: SnapNode
): MagneticForce {
    const dx = snapNode.x - cursorX;
    const dy = snapNode.y - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAGNETIC_RADIUS) {
        return { force: 0, angle: 0, snapNode, distance: dist };
    }

    // Force increases as distance decreases
    // Quadratic ease-in: (1 - dist/radius)^2
    const t = 1 - dist / MAGNETIC_RADIUS;
    const force = t * t * ATTRACTION_STRENGTH;
    const angle = Math.atan2(dy, dx);

    return { force, angle, snapNode, distance: dist };
}

/**
 * Interpolates between raw cursor position and snap target based on force.
 * Uses a cubic ease-out to make the final snap feel snappy yet smooth.
 */
export function interpolatePosition(
    rawX: number,
    rawY: number,
    targetX: number,
    targetY: number,
    force: number
): { x: number; y: number } {
    // Cubic ease-out interpolation
    // The force is already quadratic, making it cubic for position feels physical
    const pull = force * force * force;

    return {
        x: rawX + (targetX - rawX) * pull,
        y: rawY + (targetY - rawY) * pull,
    };
}

/**
 * Utility to calculate Euclidean distance
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
