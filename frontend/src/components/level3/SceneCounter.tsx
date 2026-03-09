/**
 * SceneCounter.tsx — Module 3.2: Binary Counting Machine
 * A 4-bit counter that animates carry propagation on each increment.
 */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBinaryStore, selectCounterBits } from '../../stores/binaryStore';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', warning: '#F59E0B',
    success: '#10B981', mono: "'JetBrains Mono', monospace",
};

interface Props { onCarry: () => void; onReach8: () => void; hasReached8: boolean; }

export const SceneCounter: React.FC<Props> = ({ onCarry, onReach8, hasReached8 }) => {
    const { counterValue, carryHistory, increment, resetCounter } = useBinaryStore();
    const bits = useBinaryStore(selectCounterBits);
    const prevBits = useRef(bits);

    useEffect(() => {
        if (carryHistory.length > 0) onCarry();
        if (counterValue === 8 && !hasReached8) onReach8();
        prevBits.current = bits;
    }, [counterValue, carryHistory]);

    // Entry in the log
    const LOG_ENTRIES = Array.from({ length: Math.min(counterValue + 1, 8) }, (_, i) => {
        const v = counterValue - (Math.min(counterValue, 7) - i);
        return { binary: v.toString(2).padStart(4, '0'), decimal: v };
    }).reverse();

    return (
        <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.2 — Binary Counting Machine
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>4-Bit Counter</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>Watch bits flip and carries propagate on each increment.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Counter Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Bit register */}
                    <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
                            4-bit Register
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                            {bits.map((bit, i) => {
                                const isCarryBit = carryHistory.some(c => c.fromBit === i && Date.now() - c.timestamp < 800);
                                return (
                                    <React.Fragment key={i}>
                                        {i > 0 && (
                                            <div style={{ position: 'relative', width: 24, height: 2, background: T.border, alignSelf: 'center', marginTop: 12 }}>
                                                <AnimatePresence>
                                                    {carryHistory.some(c => c.fromBit === i && Date.now() - c.timestamp < 800) && (
                                                        <motion.div
                                                            initial={{ x: 24, opacity: 1 }}
                                                            animate={{ x: -8, opacity: 0 }}
                                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                                            style={{ position: 'absolute', top: -3, width: 8, height: 8, borderRadius: '50%', background: T.warning, boxShadow: `0 0 8px ${T.warning}` }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>2<sup style={{ fontSize: 7 }}>{3 - i}</sup></div>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`${i}-${bit}`}
                                                    initial={{ scale: 1.4, color: T.accent }}
                                                    animate={{ scale: 1, color: bit ? T.accent : T.muted }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{
                                                        width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontFamily: T.mono, fontSize: 36, fontWeight: 800,
                                                        background: isCarryBit ? 'rgba(245,158,11,0.15)' : bit ? 'rgba(0,212,255,0.08)' : T.surface,
                                                        border: `2px solid ${isCarryBit ? T.warning : bit ? T.accent : T.border}`,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    {bit}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Decimal value */}
                        <div style={{ textAlign: 'center', padding: '12px 0', borderTop: `1px solid ${T.border}` }}>
                            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Decimal: </span>
                            <motion.span
                                key={counterValue}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 700, color: T.success }}
                            >
                                {counterValue}
                            </motion.span>
                        </div>
                    </div>

                    {/* Increment Button */}
                    <motion.button
                        onClick={increment}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            padding: '14px 0', fontFamily: T.mono, fontSize: 11, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            background: 'rgba(0,212,255,0.08)', border: `2px solid rgba(0,212,255,0.3)`,
                            borderRadius: 8, color: T.accent, cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
                    >
                        ++ Increment
                    </motion.button>

                    <button
                        onClick={resetCounter}
                        style={{ padding: '8px 0', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 4, color: T.muted, cursor: 'pointer' }}
                    >
                        Reset Counter
                    </button>
                </div>

                {/* Count Log Table */}
                <div style={{ padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
                        State History
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `1px solid ${T.border}`, paddingBottom: 8, marginBottom: 8 }}>
                        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase' }}>Binary</span>
                        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase' }}>Decimal</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
                        {LOG_ENTRIES.map((e, idx) => (
                            <motion.div
                                key={e.decimal}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    padding: '6px 8px', borderRadius: 4,
                                    background: idx === 0 ? 'rgba(0,212,255,0.06)' : 'transparent',
                                    border: idx === 0 ? `1px solid rgba(0,212,255,0.15)` : '1px solid transparent',
                                }}
                            >
                                <span style={{ fontFamily: T.mono, fontSize: 14, color: idx === 0 ? T.accent : T.text, letterSpacing: '0.08em' }}>
                                    {e.binary}
                                </span>
                                <span style={{ fontFamily: T.mono, fontSize: 14, color: idx === 0 ? T.success : T.muted }}>
                                    {e.decimal}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Carry info */}
                    {carryHistory.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ marginTop: 16, padding: 10, background: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 6 }}
                        >
                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                Carry Propagation Active
                            </div>
                            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.text, marginTop: 4 }}>
                                Bit flipped from 1→0, carry emitted
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
