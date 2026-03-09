/**
 * SceneRegister.tsx — Module 3.3: Bits in Memory
 * An 8-bit editable register with hex display and width selector.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Save } from 'lucide-react';
import { useBinaryStore, selectRegisterHex } from '../../stores/binaryStore';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

const WIDTHS: (8 | 16 | 32)[] = [8, 16, 32];

interface Props { onStore: () => void; }

export const SceneRegister: React.FC<Props> = ({ onStore }) => {
    const { registerBits, registerWidth, storedValue, toggleRegisterBit, setRegisterWidth, storeValue, resetRegister } = useBinaryStore();
    const hex = useBinaryStore(selectRegisterHex);

    const decimal = registerBits.reduce<number>((acc, b, i) => acc | (b << (7 - i)), 0);

    const handleStore = () => { storeValue(); onStore(); };

    return (
        <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.3 — Bits in Memory
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Inside a CPU Register</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>Click bits to toggle. Observe how binary maps to hex and decimal values.</p>
            </div>

            {/* Width selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                {WIDTHS.map(w => (
                    <button
                        key={w}
                        onClick={() => setRegisterWidth(w)}
                        style={{
                            padding: '6px 20px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: 4, cursor: 'pointer',
                            background: registerWidth === w ? 'rgba(0,212,255,0.12)' : 'transparent',
                            border: `1px solid ${registerWidth === w ? T.accent : T.border}`,
                            color: registerWidth === w ? T.accent : T.muted,
                            transition: 'all 0.18s',
                        }}
                    >
                        {w}-bit
                    </button>
                ))}
            </div>

            {/* Register visual */}
            <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <HardDrive size={14} style={{ color: T.accent }} />
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        {registerWidth}-Bit Register (R0)
                    </span>
                </div>

                {/* 8-bit active cells */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                    {registerBits.map((bit, i) => (
                        <motion.button
                            key={i}
                            onClick={() => toggleRegisterBit(i)}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                width: 58, height: 58, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 3,
                                borderRadius: 6, cursor: 'pointer',
                                background: bit ? 'rgba(0,212,255,0.1)' : T.surface,
                                border: `2px solid ${bit ? T.accent : T.border}`,
                                transition: 'background 0.18s, border-color 0.18s',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={bit}
                                    initial={{ scale: 1.3, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 800, color: bit ? T.accent : T.muted }}
                                >
                                    {bit}
                                </motion.span>
                            </AnimatePresence>
                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>b{7 - i}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Ghost bits for 16/32-bit display */}
                {registerWidth > 8 && (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', opacity: 0.25 }}>
                        {Array.from({ length: registerWidth - 8 }).map((_, i) => (
                            <div key={i} style={{ width: 58, height: 58, background: T.surface, border: `1px dashed ${T.border}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 22, color: T.muted }}>
                                0
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Value displays */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Binary', val: registerBits.join(''), color: T.text },
                    { label: 'Hexadecimal', val: `0x${hex}`, color: T.accent },
                    { label: 'Decimal', val: String(decimal), color: T.success },
                ].map(d => (
                    <div key={d.label} style={{ padding: '14px 16px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 6 }}>{d.label}</div>
                        <motion.div key={d.val} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, color: d.color, letterSpacing: '0.08em' }}>
                            {d.val}
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <motion.button
                    onClick={handleStore}
                    whileTap={{ scale: 0.96 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 28px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        background: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.3)`,
                        borderRadius: 6, color: T.success, cursor: 'pointer',
                    }}
                >
                    <Save size={13} /> Store to R0
                </motion.button>
                <button onClick={resetRegister} style={{ padding: '11px 24px', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 6, color: T.muted, cursor: 'pointer' }}>
                    Clear
                </button>
            </div>

            {/* Stored confirmation */}
            <AnimatePresence>
                {storedValue !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ marginTop: 16, textAlign: 'center', fontFamily: T.mono, fontSize: 11, color: T.success }}
                    >
                        ✓ Stored: 0x{storedValue.toString(16).toUpperCase().padStart(2, '0')} ({storedValue}₁₀) written to R0
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
