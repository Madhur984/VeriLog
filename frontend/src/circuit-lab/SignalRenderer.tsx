import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalState } from './utils/circuitValidator';

interface SignalRendererProps {
    path: string; // SVG path data
    isActive: boolean;
    state: SignalState;
    particleCount?: number;
    color?: string;
}

/**
 * SignalRenderer.tsx
 * GPU-accelerated particle flow engine for Anti-Gravity orbital flows.
 * Uses stroke-dashoffset or motion paths for efficiency.
 */
export const SignalRenderer: React.FC<SignalRendererProps> = ({
    path,
    isActive,
    state,
    particleCount = 15,
    color = '#00D2FF'
}) => {
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            offset: (i / particleCount) * 100, // Distribution along path
            speed: state === 'accelerated' ? 0.8 : state === 'slow' ? 5 : 2.5, // Duration in seconds
        }));
    }, [particleCount, state]);

    if (!isActive) return null;

    return (
        <g className="signal-renderer">
            {/* Hessian Bloom Layer (Core Discovery Feedback) */}
            {state === 'bloom' && (
                <path
                    d={path}
                    className="vl-bloom-trace"
                />
            )}

            {/* Base Glow Layer */}
            <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={state === 'glow' ? "6" : "4"}
                strokeLinecap="round"
                initial={{ opacity: 0, strokeDasharray: state === 'dissipate' ? '4 8' : 'none' }}
                animate={{ 
                    opacity: state === 'dissipate' ? 0.2 : state === 'glow' ? 0.8 : 0.4,
                    strokeDasharray: state === 'dissipate' ? '4 12' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className={state === 'glow' ? 'filter blur-[8px]' : 'filter blur-[4px]'}
            />

            {/* Orbital Particles */}
            {state !== 'dissipate' && particles.map((p) => (
                <circle key={p.id} r={state === 'glow' ? "2.5" : "1.5"} fill={color} className="filter blur-[1px]">
                    <animateMotion
                        path={path}
                        dur={`${p.speed}s`}
                        repeatCount="indefinite"
                        begin={`${(p.offset / 100) * -p.speed}s`}
                    />
                </circle>
            ))}

            {/* Dissipation Particles */}
            {state === 'dissipate' && particles.slice(0, 5).map((p) => (
                <motion.circle
                    key={`diss-${p.id}`}
                    r="1.5"
                    fill={color}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ 
                        opacity: 0,
                        scale: 2,
                        x: [0, (Math.random() - 0.5) * 20],
                        y: [0, (Math.random() - 0.5) * 20]
                    }}
                    transition={{ 
                        duration: 1, 
                        repeat: Infinity,
                        delay: p.offset / 100 
                    }}
                />
            ))}
        </g>
    );
};
