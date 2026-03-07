import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BubbleTone = 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'bright' | 'warm' | 'cool' | 'ghost';

interface BubbleAction {
    label: string;
    onClick: () => void;
    primary?: boolean;
}

export interface SpeechBubbleProps {
    title?: string;
    body: string;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    accent?: string;
    tone?: BubbleTone;
    visible?: boolean;
    typingSpeed?: number;
    actions?: BubbleAction[];
}

const TONE_COLORS: Record<BubbleTone, string> = {
    info: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    neutral: '#64748B',
    bright: '#FBBF24',
    warm: '#F97316',
    cool: '#818CF8',
    ghost: '#475569',
};

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
    title,
    body,
    placement = 'right',
    accent,
    tone = 'info',
    visible = true,
    actions,
}) => {
    const isHorizontal = placement === 'left' || placement === 'right';
    const toneColor = accent || TONE_COLORS[tone];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                        position: 'relative',
                        maxWidth: isHorizontal ? 280 : 240,
                        padding: '12px 16px',
                        background: 'rgba(15, 15, 22, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${toneColor}30`,
                        borderRadius: 12,
                        color: '#e2e8f0',
                        fontSize: 13,
                        lineHeight: 1.5,
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${toneColor}10`,
                    }}
                >
                    {title && (
                        <div style={{
                            fontWeight: 600,
                            fontSize: 14,
                            marginBottom: 4,
                            color: toneColor,
                        }}>
                            {title}
                        </div>
                    )}
                    <div>{body}</div>
                    {actions && actions.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                            {actions.map((a, i) => (
                                <button
                                    key={i}
                                    onClick={a.onClick}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: a.primary ? toneColor : 'rgba(255,255,255,0.08)',
                                        color: a.primary ? '#000' : '#e2e8f0',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Tail */}
                    <div
                        style={{
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            ...(placement === 'right' && {
                                left: -6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                borderRight: '6px solid rgba(15, 15, 22, 0.92)',
                            }),
                            ...(placement === 'left' && {
                                right: -6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                borderLeft: '6px solid rgba(15, 15, 22, 0.92)',
                            }),
                            ...(placement === 'top' && {
                                bottom: -6,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid rgba(15, 15, 22, 0.92)',
                            }),
                            ...(placement === 'bottom' && {
                                top: -6,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderBottom: '6px solid rgba(15, 15, 22, 0.92)',
                            }),
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
