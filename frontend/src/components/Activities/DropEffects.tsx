import React from 'react';
import { motion } from 'framer-motion';

interface DropRippleProps {
    x: number;
    y: number;
}

export const DropRipple: React.FC<DropRippleProps> = ({ x, y }) => (
    <motion.circle
        cx={x}
        cy={y}
        r={60}
        initial={{ r: 8, opacity: 0.9, strokeWidth: 4 }}
        animate={{ r: 80, opacity: 0, strokeWidth: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        fill="none"
        stroke="#00D2FF"
    />
);

interface RejectFlashProps {
    x: number;
    y: number;
}

export const RejectFlash: React.FC<RejectFlashProps> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        {/* Red pulse */}
        <motion.circle
            r={40}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            fill="rgba(239, 68, 68, 0.4)"
        />
        {/* Label */}
        <motion.g
            initial={{ opacity: 0, y: 0 }}
            animate={{
                opacity: [0, 1, 1, 0],
                y: -40,
                x: [-2, 2, -2, 2, 0] // Shake
            }}
            transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
        >
            <text
                textAnchor="middle"
                fill="#EF4444"
                fontSize={12}
                fontWeight="bold"
                fontFamily="monospace"
            >
                NO SNAP NODE
            </text>
        </motion.g>
    </g>
);

/**
 * Higher-order component to handle spring bounce on snap
 */
export const SnapBounce: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.g
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
            type: "spring",
            stiffness: 400,
            damping: 20
        }}
    >
        {children}
    </motion.g>
);
