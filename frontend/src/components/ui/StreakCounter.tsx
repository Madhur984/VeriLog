/**
 * StreakCounter.tsx — Engineering "Uptime" / Daily Streak
 *
 * Displays consecutive days of learning as an operational metric.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const T = {
    accent: '#00D4FF',
    text: '#E5E7EB',
    muted: '#94A3B8',
    mono: "'JetBrains Mono', monospace",
} as const;

interface StreakCounterProps {
    days: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ days }) => {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '4px 12px',
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: 6,
        }}>
            <div style={{ position: 'relative' }}>
                <Zap size={14} color={T.accent} fill={T.accent} opacity={0.8} />
                <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute', inset: 0,
                        background: T.accent, borderRadius: '50%',
                        filter: 'blur(4px)',
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontFamily: T.mono, fontSize: 8,
                    color: T.muted, letterSpacing: '0.1em',
                    textTransform: 'uppercase', lineHeight: 1,
                }}>
                    Engineering Uptime
                </span>
                <span style={{
                    fontFamily: T.mono, fontSize: 13,
                    color: T.text, fontWeight: 700,
                    lineHeight: 1.2,
                }}>
                    {days} <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.6 }}>DAYS</span>
                </span>
            </div>
        </div>
    );
};
