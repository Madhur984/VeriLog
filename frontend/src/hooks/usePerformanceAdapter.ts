import { useState, useEffect, useRef } from 'react';

/**
 * usePerformanceAdapter.ts
 * 
 * Monitors frame rate and returns a quality tier to help scale visual fidelity.
 * Tiers:
 *  - high: All effects (Glows, noise, high-rate animations)
 *  - mid: Reduced glows, standard waveforms
 *  - low: No glows, simple SVG logic, reduced frame rates
 */

export type QualityTier = 'low' | 'mid' | 'high';

export function usePerformanceAdapter() {
    const [quality, setQuality] = useState<QualityTier>('high');
    const frameTimes = useRef<number[]>([]);
    const lastTime = useRef(performance.now());
    
    useEffect(() => {
        let rafId: number;
        
        const monitor = (time: number) => {
            const delta = time - lastTime.current;
            lastTime.current = time;
            
            frameTimes.current.push(delta);
            if (frameTimes.current.length > 60) {
                frameTimes.current.shift();
                
                const avg = frameTimes.current.reduce((a, b) => a + b, 0) / 60;
                // Target 60fps (16.6ms). 
                // > 20ms (~50fps) -> mid
                // > 33ms (~30fps) -> low
                
                if (avg > 33) {
                    if (quality !== 'low') setQuality('low');
                } else if (avg > 20) {
                    if (quality !== 'mid') setQuality('mid');
                } else {
                    if (quality !== 'high') setQuality('high');
                }
            }
            
            rafId = requestAnimationFrame(monitor);
        };
        
        rafId = requestAnimationFrame(monitor);
        return () => cancelAnimationFrame(rafId);
    }, [quality]);

    return {
        quality,
        isLow: quality === 'low',
        isMid: quality === 'mid',
        isHigh: quality === 'high',
        // Helpers for conditional styles
        glowFactor: quality === 'high' ? 1 : (quality === 'mid' ? 0.3 : 0),
        fpsTarget: quality === 'low' ? 30 : 60
    };
}
