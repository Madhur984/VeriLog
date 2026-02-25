import { useRef, useCallback } from 'react';
import { DragState, SnapNode, MagneticResult } from '../types';

const MAGNETIC_RADIUS = 80;
const SNAP_RADIUS = 24;
const ATTRACTION_FACTOR = 0.25;

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export const useMagneticEngine = (snapNodes: SnapNode[]) => {
    const ghostRef = useRef<SVGGElement>(null);
    const smoothPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const calculatePhysics = useCallback((drag: DragState): MagneticResult => {
        if (!drag.id || !ghostRef.current) {
            return {
                x: drag.currentX,
                y: drag.currentY,
                snappedNodeIds: [null, null],
                nearestDistance: Infinity
            };
        }

        let targetX = drag.currentX;
        let targetY = drag.currentY;
        const currentSnaps: (string | null)[] = [null, null];
        let nearestDist = Infinity;

        // Process each anchor for magnetic attraction
        drag.anchors.forEach((anchor, index) => {
            const worldX = drag.currentX + anchor.offsetX;
            const worldY = drag.currentY + anchor.offsetY;

            let minDist = Infinity;
            let nearest: SnapNode | null = null;

            for (const node of snapNodes) {
                if (node.occupiedById && node.occupiedById !== drag.id) continue;

                const dx = node.x - worldX;
                const dy = node.y - worldY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAGNETIC_RADIUS && dist < minDist) {
                    minDist = dist;
                    nearest = node;
                }
            }

            if (minDist < nearestDist) nearestDist = minDist;

            if (nearest) {
                const dx = nearest.x - worldX;
                const dy = nearest.y - worldY;

                if (minDist < SNAP_RADIUS) {
                    // Hard snap — lock to pad
                    targetX += dx;
                    targetY += dy;
                    currentSnaps[index] = nearest.id;
                } else {
                    // Magnetic attraction: force increases as distance decreases
                    const attraction = (1 - minDist / MAGNETIC_RADIUS) * ATTRACTION_FACTOR;
                    targetX += dx * attraction;
                    targetY += dy * attraction;
                    currentSnaps[index] = null;
                }
            }
        });

        // Smooth interpolation for ghost position
        const lerpFactor = 0.35;
        smoothPosRef.current.x = lerp(smoothPosRef.current.x, targetX, lerpFactor);
        smoothPosRef.current.y = lerp(smoothPosRef.current.y, targetY, lerpFactor);

        // Apply visual transform to ghost element (no React re-render)
        const scale = 1.05;
        const tilt = 1;
        const shadowOffset = 2;
        ghostRef.current.setAttribute(
            'transform',
            `translate(${smoothPosRef.current.x}, ${smoothPosRef.current.y + shadowOffset}) scale(${scale}) rotate(${tilt})`
        );

        return {
            x: targetX,
            y: targetY,
            snappedNodeIds: currentSnaps,
            nearestDistance: nearestDist
        };
    }, [snapNodes]);

    const resetSmooth = useCallback((x: number, y: number) => {
        smoothPosRef.current = { x, y };
    }, []);

    return { ghostRef, calculatePhysics, resetSmooth };
};
