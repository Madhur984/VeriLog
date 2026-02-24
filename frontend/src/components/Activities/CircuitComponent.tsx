import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-Fidelity Electrical Symbols (Reference Image Style)
 * Supports magnetic snap: isSnapTarget highlights connection nodes
 */

export interface CircuitComponentProps {
    x: number;
    y: number;
    active?: boolean;
    id: string;
    /** Set true when a dragged component is within magnetic range */
    isSnapTarget?: boolean;
    /** Set true when the component is being dragged */
    isDragging?: boolean;
    /** Set true for the "ghost" preview component */
    isGhost?: boolean;
}

const Node: React.FC<{ cx: number; cy: number; active?: boolean; isSnapTarget?: boolean }> = ({ cx, cy, active, isSnapTarget }) => (
    <g>
        {/* Magnetic attraction ring — shown when a component is nearby */}
        {isSnapTarget && (
            <>
                <motion.circle
                    cx={cx} cy={cy} r={20}
                    fill="none"
                    stroke="#00D2FF"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.4, 0.6], opacity: [0, 0.9, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle
                    cx={cx} cy={cy} r={14}
                    fill="rgba(0,210,255,0.12)"
                    stroke="#00D2FF"
                    strokeWidth={1.5}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            </>
        )}

        {/* Core node */}
        <circle
            cx={cx} cy={cy} r={8}
            fill={isSnapTarget ? '#00D2FF' : active ? '#00D2FF' : '#1E293B'}
            stroke={isSnapTarget ? '#FFFFFF' : active ? '#00D2FF' : '#334155'}
            strokeWidth={2}
            style={{ filter: isSnapTarget ? 'drop-shadow(0 0 8px #00D2FF)' : undefined }}
        />
        {active && !isSnapTarget && (
            <motion.circle
                cx={cx} cy={cy} r={16}
                fill="none"
                stroke="#00D2FF"
                strokeWidth={1}
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        )}
        <circle cx={cx} cy={cy} r={3} fill={active || isSnapTarget ? '#FFFFFF' : '#94A3B8'} />
    </g>
);

/**
 * Shared wrapper for handling drag elevation and ghost effects
 */
const ComponentShell: React.FC<{
    children: React.ReactNode;
    x: number;
    y: number;
    isDragging?: boolean;
    isGhost?: boolean;
}> = ({ children, x, y, isDragging, isGhost }) => (
    <motion.g
        transform={`translate(${x}, ${y})`}
        animate={{
            scale: isDragging ? 1.05 : 1,
            rotate: isDragging ? 1.5 : 0,
            opacity: isGhost ? 0.5 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
            pointerEvents: isGhost ? 'none' : 'auto',
            filter: isGhost
                ? 'drop-shadow(0 0 10px #00D2FF)'
                : isDragging
                    ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
                    : 'none'
        }}
    >
        {children}
    </motion.g>
);

export const LabBattery: React.FC<CircuitComponentProps> = ({ x, y, active, isSnapTarget, isDragging, isGhost }) => (
    <ComponentShell x={x} y={y} isDragging={isDragging} isGhost={isGhost}>
        {/* Background & Shadow */}
        <rect x={-15} y={-35} width={30} height={70} rx={4} fill="#0D1426" stroke="#1E293B" strokeWidth={1} />

        {/* Vertical Battery Body */}
        <rect x={-12} y={-30} width={24} height={60} rx={2} fill="url(#battGrad)" stroke="#334155" strokeWidth={1.5} />

        {/* Terminal markings */}
        <text x={0} y={-10} textAnchor="middle" fill="#94A3B8" fontSize={16} fontWeight="bold" fontFamily="monospace">+</text>
        <text x={0} y={20} textAnchor="middle" fill="#94A3B8" fontSize={16} fontWeight="bold" fontFamily="monospace">-</text>

        <Node cx={0} cy={-40} active={active} isSnapTarget={isSnapTarget} />
        <Node cx={0} cy={40} active={active} isSnapTarget={isSnapTarget} />
    </ComponentShell>
);

export const LabBulb: React.FC<CircuitComponentProps> = ({ x, y, active, isSnapTarget, isDragging, isGhost }) => (
    <ComponentShell x={x} y={y} isDragging={isDragging} isGhost={isGhost}>
        {/* Bulb Glass */}
        <circle cx={0} cy={0} r={22} fill={active ? "rgba(255, 184, 0, 0.1)" : "#0D1426"} stroke={active ? "#FFB800" : "#334155"} strokeWidth={2} className={active ? "neon-glow-orange" : ""} />

        {/* Filament */}
        <path
            d="M -8 5 Q -8 -8 0 -8 Q 8 -8 8 5"
            stroke={active ? "#FFB800" : "#475569"}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
        />

        {/* Base */}
        <rect x={-10} y={18} width={20} height={8} fill="#334155" rx={1} />
        <rect x={-8} y={26} width={16} height={6} fill="#1E293B" rx={1} />

        <Node cx={-28} cy={0} active={active} isSnapTarget={isSnapTarget} />
        <Node cx={28} cy={0} active={active} isSnapTarget={isSnapTarget} />
    </ComponentShell>
);

export const LabResistor: React.FC<CircuitComponentProps> = ({ x, y, active, isSnapTarget, isDragging, isGhost }) => (
    <ComponentShell x={x} y={y} isDragging={isDragging} isGhost={isGhost}>
        {/* Capsule / Pill Background */}
        <rect x={-40} y={-15} width={80} height={30} rx={15} fill="#0D1426" stroke="#1E293B" strokeWidth={1} opacity={0.8} />

        {/* Zigzag symbol */}
        <polyline
            points="-25,0 -20,8 -10,-8 0,8 10,-8 20,8 25,0"
            fill="none"
            stroke={active ? "#00D2FF" : "#475569"}
            strokeWidth={2.5}
            strokeLinejoin="round"
            className={active ? "neon-glow-blue" : ""}
        />

        <Node cx={-45} cy={0} active={active} isSnapTarget={isSnapTarget} />
        <Node cx={45} cy={0} active={active} isSnapTarget={isSnapTarget} />
    </ComponentShell>
);

export const LabSwitch: React.FC<CircuitComponentProps & { isOpen: boolean }> = ({ x, y, active, isOpen, isSnapTarget, isDragging, isGhost }) => (
    <ComponentShell x={x} y={y} isDragging={isDragging} isGhost={isGhost}>
        {/* Connection points */}
        <circle cx={-20} cy={0} r={4} fill="#475569" stroke="#334155" strokeWidth={1.5} />
        <circle cx={20} cy={0} r={4} fill="#475569" stroke="#334155" strokeWidth={1.5} />

        {/* Moving Lever */}
        <motion.line
            x1={-20} y1={0}
            x2={20} y2={isOpen ? -20 : 0}
            stroke={active ? "#00D2FF" : "#475569"}
            strokeWidth={4}
            strokeLinecap="round"
            animate={{ x2: 20, y2: isOpen ? -20 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={active && !isOpen ? "neon-glow-blue" : ""}
        />

        <Node cx={-30} cy={0} active={active} isSnapTarget={isSnapTarget} />
        <Node cx={30} cy={0} active={active} isSnapTarget={isSnapTarget} />
    </ComponentShell>
);
