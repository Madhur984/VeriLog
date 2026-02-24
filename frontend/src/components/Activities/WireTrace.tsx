import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WireTraceProps {
    path: { x: number; y: number }[];
    active?: boolean;
    isShort?: boolean;
}

/**
 * Premium "Glass Tube" Neon Wire with dramatic live-signal trail
 */
export const WireTrace: React.FC<WireTraceProps> = ({ path, active, isShort }) => {
    const d = useMemo(() => {
        if (path.length < 2) return '';
        return `M ${path[0].x} ${path[0].y} ` + path.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    }, [path]);

    const primaryColor = isShort ? '#EF4444' : '#00D2FF';

    return (
        <g>
            {/* ── Wide faint glass shell ── */}
            <path
                d={d}
                fill="none"
                stroke={active ? primaryColor : '#1E293B'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={active ? 0.12 : 0.05}
            />

            {/* ── Outer glow bloom ── */}
            {active && (
                <path
                    d={d}
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.25}
                    style={{ filter: 'blur(9px)' }}
                />
            )}

            {/* ── Primary neon tube ── */}
            <path
                d={d}
                fill="none"
                stroke={active ? primaryColor : '#1E293B'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={active ? 1 : 0.18}
                className={active ? 'neon-glow-blue transition-colors duration-500' : 'transition-colors duration-500'}
            />

            {/* ── Core brightness line ── */}
            {active && (
                <path
                    d={d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.55}
                />
            )}

            {/* ════ LIVE SIGNAL TRAIL — only when active ════ */}
            {active && !isShort && (
                <>
                    {/* Signal pulse #1 — fast bright electron */}
                    <motion.path
                        d={d}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="12 9999"
                        animate={{ strokeDashoffset: [0, -1200] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        opacity={0.95}
                        style={{ filter: 'blur(0px)' }}
                    />
                    {/* Signal pulse #2 — glowing trail behind it */}
                    <motion.path
                        d={d}
                        fill="none"
                        stroke={primaryColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="18 9999"
                        animate={{ strokeDashoffset: [4, -1196] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        opacity={0.6}
                        style={{ filter: 'blur(4px)' }}
                    />
                    {/* Signal pulse #3 — second electron slightly behind */}
                    <motion.path
                        d={d}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8 9999"
                        animate={{ strokeDashoffset: [220, -980] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        opacity={0.7}
                    />
                    {/* Signal pulse #4 — third faint electron */}
                    <motion.path
                        d={d}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="6 9999"
                        animate={{ strokeDashoffset: [440, -760] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        opacity={0.45}
                    />
                </>
            )}

            {/* Short circuit sparks */}
            {isShort && (
                <motion.path
                    d={d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="3 14"
                    animate={{ strokeDashoffset: [0, -17] }}
                    transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
                    opacity={0.8}
                />
            )}
        </g>
    );
};
