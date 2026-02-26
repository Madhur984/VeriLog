import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SpeechBubble — Typewriter-animated tooltip for VoltMonkey
   ═══════════════════════════════════════════════════════════════ */

import type { BubbleTone } from '../Bot/botDialogue';

interface SpeechBubbleProps {
    /** Title shown in bold at top */
    title?: string;
    /** Body text — types out character by character */
    body: string;
    /** Where the bubble tail points */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Emotion-driven tone — controls accent + border color */
    tone?: BubbleTone;
    /** Override accent color directly (takes precedence over tone) */
    accent?: string;
    /** ms per character for typewriter, default 28 */
    typingSpeed?: number;
    /** Action buttons rendered below body */
    actions?: { label: string; onClick: () => void; primary?: boolean }[];
    /** Is the bubble visible? */
    visible?: boolean;
    /** Step indicator, e.g. "2 / 5" */
    stepLabel?: string;
}

const TONE_ACCENT: Record<BubbleTone, string> = {
    bright: '#F59E0B',
    warm: '#22C55E',
    cool: '#38BDF8',
    ghost: '#475569',
};

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
    title,
    body,
    placement = 'right',
    tone = 'cool',
    accent,
    typingSpeed,
    actions,
    visible = true,
    stepLabel,
}) => {
    const resolvedAccent = accent ?? TONE_ACCENT[tone];
    const TYPING_SPEED = typingSpeed ?? 28;
    const [displayed, setDisplayed] = useState('');
    const [isDone, setIsDone] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* typewriter effect */
    useEffect(() => {
        if (!visible) return;
        setDisplayed('');
        setIsDone(false);
        let idx = 0;
        intervalRef.current = setInterval(() => {
            idx++;
            setDisplayed(body.slice(0, idx));
            if (idx >= body.length) {
                clearInterval(intervalRef.current!);
                setIsDone(true);
            }
        }, TYPING_SPEED);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [body, visible]);

    /* skip to end on click */
    const skipTyping = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayed(body);
        setIsDone(true);
    };

    /* tail position styles */
    const tailMap: Record<string, React.CSSProperties> = {
        right: { left: -8, top: 20, borderWidth: '8px 10px 8px 0', borderColor: 'transparent #141D2D transparent transparent' },
        left: { right: -8, top: 20, borderWidth: '8px 0 8px 10px', borderColor: 'transparent transparent transparent #141D2D' },
        top: { bottom: -8, left: 24, borderWidth: '0 8px 10px 8px', borderColor: 'transparent transparent #141D2D transparent' },
        bottom: { top: -8, left: 24, borderWidth: '10px 8px 0 8px', borderColor: '#141D2D transparent transparent transparent' },
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    onClick={skipTyping}
                    style={{
                        position: 'relative',
                        background: '#141D2D',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        padding: '16px 20px',
                        width: 280,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
                        cursor: isDone ? 'default' : 'pointer',
                        userSelect: 'none',
                    }}
                >
                    {/* accent bar */}
                    <div style={{
                        position: 'absolute', top: 0, left: 16, right: 16, height: 2,
                        borderRadius: '0 0 2px 2px',
                        background: `linear-gradient(to right, transparent, ${resolvedAccent}, transparent)`,
                    }} />

                    {/* step label */}
                    {stepLabel && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: resolvedAccent, marginBottom: 8,
                            background: `${resolvedAccent}15`, padding: '2px 8px', borderRadius: 20,
                            border: `1px solid ${resolvedAccent}30`,
                        }}>
                            ⚡ {stepLabel}
                        </div>
                    )}

                    {/* title */}
                    {title && (
                        <div style={{
                            fontSize: 14, fontWeight: 700, color: '#F1F5F9',
                            marginBottom: 6, lineHeight: 1.3,
                        }}>
                            {title}
                        </div>
                    )}

                    {/* body with typewriter + cursor */}
                    <div style={{
                        fontSize: 13, color: '#94A3B8', lineHeight: 1.65,
                        minHeight: 20,
                    }}>
                        {displayed}
                        {!isDone && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                style={{ color: resolvedAccent, fontWeight: 700, marginLeft: 1 }}
                            >
                                |
                            </motion.span>
                        )}
                    </div>

                    {/* actions (appear after typing finishes) */}
                    <AnimatePresence>
                        {isDone && actions && actions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                style={{ display: 'flex', gap: 8, marginTop: 14 }}
                            >
                                {actions.map((a, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); a.onClick(); }}
                                        style={{
                                            fontSize: 12, fontWeight: 600, border: 'none',
                                            borderRadius: 10, padding: '6px 14px', cursor: 'pointer',
                                            transition: 'all 0.15s',
                                            ...(a.primary
                                                ? { background: resolvedAccent, color: '#fff' }
                                                : { background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.08)' }
                                            ),
                                        }}
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* tail triangle */}
                    <div style={{
                        position: 'absolute',
                        width: 0, height: 0,
                        borderStyle: 'solid',
                        ...tailMap[placement],
                    }} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
