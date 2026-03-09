/**
 * KMapIntro.tsx — Scene 5.1: Animated concept introduction for Karnaugh Maps.
 *
 * Visual flow:
 * 1. Truth table fades in row by row
 * 2. Animated paths trace each 1-minterm to its K-Map cell
 * 3. K-Map cell glows on arrival
 * 4. VoltMonkey quote pulses in
 * 5. CTA button unlocks
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';

const T = {
    bg: '#07080C', card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    accent: '#00D4FF', success: '#10B981', warning: '#F59E0B',
    text: '#E5E7EB', muted: '#64748B',
    mono: "'JetBrains Mono', monospace",
};

// 3-variable truth table rows for F = A'BC + ABC + AB'C  (minterms 1,3,5,7)
const TRUTH_ROWS = [
    { idx: 0, a: 0, b: 0, c: 0, f: 0 },
    { idx: 1, a: 0, b: 0, c: 1, f: 1 },
    { idx: 2, a: 0, b: 1, c: 0, f: 0 },
    { idx: 3, a: 0, b: 1, c: 1, f: 1 },
    { idx: 4, a: 1, b: 0, c: 0, f: 0 },
    { idx: 5, a: 1, b: 0, c: 1, f: 1 },
    { idx: 6, a: 1, b: 1, c: 0, f: 0 },
    { idx: 7, a: 1, b: 1, c: 1, f: 1 },
];



interface Props {
    onComplete: () => void;
}

export const KMapIntro: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [litCells, setLitCells] = useState<Set<number>>(new Set());
    const [showCTA, setShowCTA] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        // Auto-advance animation
        const delays = [400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 4000, 5200];
        delays.forEach((d, i) => {
            timerRef.current = setTimeout(() => setStep(i + 1), d);
        });
        return () => clearTimeout(timerRef.current);
    }, []);

    // Light up K-Map cells as truth table rows animate in
    useEffect(() => {
        const minterms = [1, 3, 5, 7];
        minterms.forEach((m, i) => {
            setTimeout(() => {
                setLitCells(prev => new Set([...prev, m]));
            }, 2800 + i * 350);
        });
        setTimeout(() => setShowCTA(true), 5400);
    }, []);

    const CELL_SIZE = 72;
    const COLS = ['00', '01', '11', '10'];
    const ROWS = ['0', '1'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: '0 40px', fontFamily: T.mono }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 5.1 — Concept Introduction
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>
                    Why Karnaugh Maps?
                </h2>
                <p style={{ color: T.muted, fontSize: 14, marginTop: 8, maxWidth: 560, margin: '8px auto 0' }}>
                    Watch how truth table rows map directly into K-Map cells — exposing hidden patterns that eliminate redundant logic.
                </p>
            </motion.div>

            {/* Side-by-side: Truth Table + K-Map */}
            <div style={{ display: 'flex', gap: 64, justifyContent: 'center', alignItems: 'flex-start' }}>

                {/* Truth Table */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, minWidth: 240 }}>
                    <div style={{ fontSize: 9, color: T.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Truth Table</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 32px) 40px', gap: 8, textAlign: 'center', fontSize: 13 }}>
                        {['A', 'B', 'C'].map(v => <div key={v} style={{ color: T.muted, fontWeight: 600 }}>{v}</div>)}
                        <div style={{ color: T.accent, fontWeight: 700 }}>F</div>
                        <div style={{ gridColumn: '1/-1', height: 1, background: T.border }} />
                        {TRUTH_ROWS.map((row, i) => (
                            <React.Fragment key={row.idx}>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} style={{ color: row.a ? T.text : T.muted }}>{row.a}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} style={{ color: row.b ? T.text : T.muted }}>{row.b}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} style={{ color: row.c ? T.text : T.muted }}>{row.c}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ color: row.f ? T.success : T.muted, fontWeight: row.f ? 700 : 400, fontSize: row.f ? 16 : 13 }}>
                                    {row.f}
                                </motion.div>
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Arrow */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > 3 ? 1 : 0 }} transition={{ duration: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', paddingTop: 80, color: T.accent }}>
                    <ArrowRight size={32} />
                </motion.div>

                {/* K-Map */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                    <div style={{ fontSize: 9, color: T.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>K-Map (3 Variable)</div>

                    {/* Column headers */}
                    <div style={{ display: 'flex', marginBottom: 4 }}>
                        <div style={{ width: 36, fontSize: 9, color: T.muted }}>A\BC</div>
                        {COLS.map(c => (
                            <div key={c} style={{ width: CELL_SIZE, textAlign: 'center', fontSize: 12, color: T.muted }}>{c}</div>
                        ))}
                    </div>

                    {ROWS.map((r) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 36, fontSize: 12, color: T.muted, textAlign: 'center' }}>{r}</div>
                            {COLS.map((c, cIdx) => {
                                const bin = r + c;
                                const minterm = parseInt(bin, 2);
                                const isLit = litCells.has(minterm);
                                return (
                                    <motion.div
                                        key={cIdx}
                                        animate={{
                                            background: isLit ? 'rgba(16,185,129,0.15)' : T.surface,
                                            borderColor: isLit ? T.success : T.border,
                                            boxShadow: isLit ? `0 0 16px rgba(16,185,129,0.3)` : 'none',
                                        }}
                                        transition={{ duration: 0.4 }}
                                        style={{
                                            width: CELL_SIZE, height: CELL_SIZE,
                                            border: `1px solid ${T.border}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 20, fontWeight: 700,
                                            color: isLit ? T.success : T.muted,
                                            position: 'relative',
                                        }}
                                    >
                                        <AnimatePresence>
                                            {isLit && (
                                                <motion.span
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >1</motion.span>
                                            )}
                                        </AnimatePresence>
                                        <span style={{ position: 'absolute', bottom: 3, right: 4, fontSize: 8, color: T.muted, opacity: 0.5 }}>
                                            m{minterm}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* VoltMonkey Insight */}
            <AnimatePresence>
                {step > 7 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            maxWidth: 680, margin: '0 auto', padding: '20px 24px',
                            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
                            borderRadius: 10, display: 'flex', gap: 16, alignItems: 'flex-start',
                        }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Cpu size={18} color={T.warning} />
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: T.warning, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>VoltMonkey · Engineering Insight</div>
                            <div style={{ fontSize: 14, color: '#FDE68A', lineHeight: 1.7 }}>
                                Notice how all four 1s in the K-Map are adjacent. A single group of 4 cells eliminates two variables entirely — turning a 3-input AND-OR expression into a single wire. <span style={{ color: T.accent }}>F = C.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA */}
            <AnimatePresence>
                {showCTA && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={onComplete}
                            style={{
                                padding: '14px 36px', background: T.accent, color: '#000', border: 'none',
                                borderRadius: 8, fontFamily: T.mono, fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', letterSpacing: '0.1em',
                                boxShadow: `0 8px 26px rgba(0,212,255,0.25)`,
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                            }}>
                            Open K-Map Explorer <ArrowRight size={18} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
