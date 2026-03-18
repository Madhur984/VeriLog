import { useEffect, useCallback, RefObject } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface CursorGravityOptions {
    magneticRadius?: number;
    pullStrength?: number;
}

/**
 * useCursorGravity
 * 
 * Provides global (or localized) mouse tracking via Framer Motion values,
 * and handles "soft cursor gravity" / magnetic snapping offset math.
 */
export const useCursorGravity = (options: CursorGravityOptions = {}) => {
    const {
        magneticRadius = 120, // distance before pull starts
        pullStrength = 0.05   // 5% lerp per frame equivalent
    } = options;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth the cursor motion slightly if we want to use it for a ghost cursor UI
    const smoothMouseX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Expose a helper to calculate distance to a target
    const getDistanceToTarget = useCallback((targetRef: RefObject<HTMLElement>) => {
        if (!targetRef.current) return Infinity;
        const rect = targetRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = mouseX.get() - centerX;
        const dy = mouseY.get() - centerY;
        
        return Math.sqrt(dx * dx + dy * dy);
    }, [mouseX, mouseY]);

    // Calculate lerped pull offset if within magnetic radius
    const calculateMagneticPull = useCallback((targetRef: RefObject<HTMLElement>, currentX: number, currentY: number) => {
        if (!targetRef.current) return { x: currentX, y: currentY, isNear: false };
        
        const rect = targetRef.current.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        
        const dx = targetCenterX - currentX;
        const dy = targetCenterY - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < magneticRadius) {
            // Lerp position towards target
            const newX = currentX + dx * pullStrength;
            const newY = currentY + dy * pullStrength;
            return { x: newX, y: newY, isNear: true, distance: dist };
        }
        
        return { x: currentX, y: currentY, isNear: false, distance: dist };
    }, [magneticRadius, pullStrength]);

    return {
        mouseX,
        mouseY,
        smoothMouseX,
        smoothMouseY,
        getDistanceToTarget,
        calculateMagneticPull
    };
};
