/**
 * SceneSwitch.tsx — Module 3.1: Discovering Binary
 * Toggle switches to produce binary digits and see voltage visualization.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useBinaryStore, selectSwitchDecimal } from '../../stores/binaryStore';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981',
    warning: '#F59E0B', mono: "'JetBrains Mono', monospace",
};

interface Props { onFirstToggle: () => void; hasToggled: boolean; }

export const SceneSwitch: React.FC<Props> = ({ onFirstToggle, hasToggled }) => {
    const { switchBits, toggleSwitchBit, resetSwitches } = useBinaryStore();
    const decimal = useBinaryStore(selectSwitchDecimal);

    const handleToggle = (i: number) => {
        if (!hasToggled) onFirstToggle();
        toggleSwitchBit(i);
    };

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.1 — Discovering Binary
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Why Two States?</h2>
                <p style={{ color: T.muted, fontSize: 14, maxWidth: 480, margin: '0 auto' }}>
                    Digital systems use voltage HIGH (1) and LOW (0). Toggle the switches below and observe binary representation.
                </p>
            </div>

            {/* Voltage legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
                {[{ label: 'LOW voltage → 0', color: T.muted }, { label: 'HIGH voltage → 1', color: T.accent }].map(v => (
                    <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.mono, fontSize: 10, color: v.color }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: v.color, opacity: 0.8 }} />
                        {v.label}
                    </div>
                ))}
            </div>

            {/* Switches */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
                {switchBits.map((bit, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                Bit {3 - i}
                            </span>
                            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.accent, fontWeight: 700 }}>
                                [{Math.pow(2, 3 - i)}]
                            </span>
                        </div>

                        {/* Voltage bar */}
                        <div style={{ width: 48, height: 80, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ height: bit ? '100%' : '20%', background: bit ? T.accent : T.muted }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.7 }}
                            />
                            <div style={{ position: 'absolute', top: 4, right: 4, fontFamily: T.mono, fontSize: 8, color: bit ? T.accent : T.muted }}>
                                {bit ? 'H' : 'L'}
                            </div>
                        </div>

                        {/* Toggle switch */}
                        <motion.button
                            onClick={() => handleToggle(i)}
                            whileTap={{ scale: 0.94 }}
                            style={{
                                width: 56, height: 28, borderRadius: 14, cursor: 'pointer',
                                background: bit ? `rgba(0,212,255,0.2)` : T.surface,
                                border: `2px solid ${bit ? T.accent : T.border}`,
                                position: 'relative', transition: 'background 0.2s, border-color 0.2s',
                            }}
                        >
                            <motion.div
                                animate={{ x: bit ? 28 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                style={{ width: 20, height: 20, borderRadius: '50%', background: bit ? T.accent : T.muted, position: 'absolute', top: 2 }}
                            />
                        </motion.button>

                        {/* Bit value */}
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={bit}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                style={{
                                    fontFamily: T.mono, fontSize: 36, fontWeight: 700,
                                    color: bit ? T.accent : T.muted,
                                    lineHeight: 1, minWidth: 36, textAlign: 'center',
                                }}
                            >
                                {bit}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Binary + Decimal display */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
                <div style={{ padding: '16px 32px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Binary</div>
                    <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.text, letterSpacing: '0.15em' }}>
                        {switchBits.join('')}
                    </div>
                </div>
                <div style={{ padding: '16px 32px', background: T.card, border: `1px solid rgba(0,212,255,0.2)`, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Decimal</div>
                    <motion.div
                        key={decimal}
                        initial={{ scale: 1.15, color: T.accent }}
                        animate={{ scale: 1, color: T.text }}
                        style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800 }}
                    >
                        {decimal}
                    </motion.div>
                </div>
            </div>

            {/* Power-of-2 breakdown */}
            {hasToggled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                    {switchBits.map((bit, i) => {
                        const power = 3 - i;
                        const val = Math.pow(2, power);
                        return (
                            <React.Fragment key={i}>
                                {i > 0 && <div style={{ alignSelf: 'center', fontFamily: T.mono, fontSize: 16, color: T.muted, opacity: 0.5, margin: '0 4px' }}>+</div>}
                                <div style={{ textAlign: 'center', opacity: bit ? 1 : 0.4, transition: 'opacity 0.2s', background: bit ? 'rgba(0,212,255,0.05)' : 'transparent', padding: '4px 8px', borderRadius: 4 }}>
                                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent }}>{bit} × 2<sup>{power}</sup></div>
                                    <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: bit ? 600 : 400, color: bit ? T.text : T.muted, marginTop: 4 }}>{bit ? val : 0}</div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: T.mono, fontSize: 16, color: T.success, marginLeft: 8 }}>
                        = {decimal}
                    </div>
                </motion.div>
            )}

            <Zap size={14} style={{ color: T.muted, opacity: 0.4, margin: '0 auto', display: 'block' }} />
            <button onClick={resetSwitches} style={{ display: 'block', margin: '12px auto 0', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${T.border}`, color: T.muted, padding: '6px 16px', borderRadius: 4, cursor: 'pointer' }}>
                Reset
            </button>
        </div>
    );
};
