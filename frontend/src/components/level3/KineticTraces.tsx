/**
 * KineticTraces.tsx
 * An SVG overlay that draws and animates "copper trace" paths between bit cells.
 * Used to visualize carry propagation and data flow.
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TracePath {
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    active: boolean;
    color?: string;
}

interface Props {
    paths: TracePath[];
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const KineticTraces: React.FC<Props> = ({ paths, containerRef }) => {
    return (
        <svg 
            style={{ 
                position: 'absolute', 
                top: 0, left: 0, 
                width: '100%', height: '100%', 
                pointerEvents: 'none',
                zIndex: 5
            }}
        >
            <AnimatePresence>
                {paths.map(path => {
                    if (!path.active) return null;

                    // Calculate path details (simple cubic bezier for organic feel)
                    const { from, to } = path;
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;
                    
                    // Engineering style: straight lines with rounded corners or subtle curves
                    const d = `M ${from.x} ${from.y} Q ${midX} ${from.y - 20}, ${midX} ${midY} T ${to.x} ${to.y}`;

                    return (
                        <g key={path.id}>
                            {/* Static Trace (The "Copper") */}
                            <path
                                d={d}
                                fill="none"
                                stroke={path.color || '#F59E0B'}
                                strokeWidth="1"
                                opacity="0.1"
                            />
                            
                            {/* Active Pulse */}
                            <motion.path
                                d={d}
                                fill="none"
                                stroke={path.color || '#F59E0B'}
                                strokeWidth="2"
                                strokeDasharray="0 1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: [0, 1], 
                                    opacity: [0, 1, 0],
                                    strokeWidth: [2, 4, 2]
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    duration: 0.6, 
                                    ease: "easeInOut"
                                }}
                                style={{
                                    filter: `drop-shadow(0 0 8px ${path.color || '#F59E0B'})`
                                }}
                            />
                        </g>
                    );
                })}
            </AnimatePresence>
        </svg>
    );
};
