import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SnapNodeVisualProps {
    x: number;
    y: number;
    isNearest: boolean;
    occupied: boolean;
    magneticForce: number; // 0-1
}

export const SnapNodeVisual: React.FC<SnapNodeVisualProps> = ({
    x,
    y,
    isNearest,
    occupied,
    magneticForce
}) => {
    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Attraction Ripple (Dashed Ring) */}
            <AnimatePresence>
                {isNearest && !occupied && (
                    <motion.circle
                        initial={{ r: 10, opacity: 0 }}
                        animate={{
                            r: [10, 24, 10],
                            opacity: [0, 0.6, 0],
                            strokeWidth: [1, 3, 1]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        fill="none"
                        stroke="#00D2FF"
                        strokeDasharray="4 3"
                    />
                )}
            </AnimatePresence>

            {/* Main Metallic Pad */}
            <motion.circle
                r={8}
                animate={{
                    r: isNearest ? 10 : 8,
                    strokeWidth: isNearest ? 2 : 1,
                    scale: isNearest ? 1.1 : 1,
                }}
                fill={occupied ? "#1E293B" : isNearest ? "url(#snapActiveGrad)" : "url(#snapIdleGrad)"}
                stroke={isNearest ? "#00D2FF" : "#334155"}
                className="transition-all duration-200"
                style={{
                    filter: isNearest ? `drop-shadow(0 0 ${8 * magneticForce}px #00D2FF)` : 'none',
                    opacity: occupied ? 0.3 : isNearest ? 1 : 0.4
                }}
            />

            {/* Inner Detail (Metallic Highlight) */}
            <circle
                cx={-2}
                cy={-2}
                r={2}
                fill="white"
                opacity={isNearest ? 0.8 : 0.2}
            />

            {/* Snap Badge label */}
            <AnimatePresence>
                {isNearest && magneticForce > 0.5 && (
                    <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transform="translate(0, -25)"
                    >
                        <rect
                            x={-18}
                            y={-8}
                            width={36}
                            height={16}
                            rx={4}
                            fill="rgba(0, 210, 255, 0.15)"
                            stroke="rgba(0, 210, 255, 0.5)"
                            strokeWidth={1}
                        />
                        <text
                            textAnchor="middle"
                            y={4}
                            fontSize={8}
                            fontWeight="bold"
                            fontFamily="monospace"
                            fill="#00D2FF"
                            letterSpacing="1"
                        >
                            SNAP
                        </text>
                    </motion.g>
                )}
            </AnimatePresence>
        </g>
    );
};
