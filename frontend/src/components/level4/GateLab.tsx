/**
 * GateLab.tsx — Level 4, Scene 4.2
 *
 * 6 gate stations side-by-side. Student tests each, truth table fills in real-time.
 * Enhanced: per-gate progress bar, XP spring badge, glowing completion state.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { GATE_META, type GateId } from '../../utils/gateMeta';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B',
    mono: "'JetBrains Mono', monospace",
};

const LAB_GATES: GateId[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];

interface GateState { inputA: boolean; inputB: boolean; tested: Set<number>; }
interface Props { onComplete: () => void; hasCompleted: boolean; }

export const GateLab: React.FC<Props> = ({ onComplete, hasCompleted }) => {
    const [gateStates, setGateStates] = useState<Record<GateId, GateState>>({} as Record<GateId, GateState>);

    const getState = (id: GateId): GateState =>
        gateStates[id] ?? { inputA: false, inputB: false, tested: new Set() };

    const toggle = (id: GateId, key: 'inputA' | 'inputB') => {
        const s = getState(id);
        const meta = GATE_META[id];
        const nextA = key === 'inputA' ? !s.inputA : s.inputA;
        const nextB = key === 'inputB' ? !s.inputB : s.inputB;
        const rowIndex = meta.inputs === 1
            ? (nextA ? 1 : 0)
            : (nextA ? 2 : 0) + (nextB ? 1 : 0);
        const nextTested = new Set([...s.tested, rowIndex]);

        setGateStates(prev => ({ ...prev, [id]: { inputA: nextA, inputB: nextB, tested: nextTested } }));

        if (!hasCompleted) {
            const allTested = LAB_GATES.every(gid => {
                const gs = gid === id ? { ...getState(gid), tested: nextTested } : getState(gid);
                const req = GATE_META[gid].inputs === 1 ? 2 : 4;
                return gs.tested.size >= req;
            });
            if (allTested) onComplete();
        }
    };

    const completedCount = LAB_GATES.filter(id => {
        const s = getState(id);
        return s.tested.size >= (GATE_META[id].inputs === 1 ? 2 : 4);
    }).length;

    return (
        <div style={{ width: '100%', maxWidth: 1020, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#10B981', display: 'block', marginBottom: 8 }}>
                    Scene 4.2 — Gate Lab
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>6-Gate Characterization Lab</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Toggle all input combinations for each gate. Fill every truth table row.
                    <span style={{ marginLeft: 8, color: '#10B981' }}>{completedCount}/{LAB_GATES.length} gates characterized</span>
                </p>
                {/* Global progress bar */}
                <div style={{ maxWidth: 320, margin: '12px auto 0', height: 4, background: T.surface, borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div
                        animate={{ width: `${(completedCount / LAB_GATES.length) * 100}%` }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: 2 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {LAB_GATES.map(gateId => {
                    const meta = GATE_META[gateId];
                    const s = getState(gateId);
                    const inputs = meta.inputs === 1 ? [s.inputA] : [s.inputA, s.inputB];
                    const output = meta.evaluate(inputs);
                    const requiredRows = meta.inputs === 1 ? 2 : 4;
                    const isDone = s.tested.size >= requiredRows;
                    const table = meta.getTruthTable();
                    const testedFraction = s.tested.size / requiredRows;

                    return (
                        <motion.div key={gateId} layout style={{
                            padding: 18,
                            background: isDone ? `${meta.color}06` : T.card,
                            borderRadius: 10, position: 'relative', overflow: 'hidden',
                            border: `1px solid ${isDone ? `${meta.color}50` : T.border}`,
                            boxShadow: isDone ? `0 0 24px ${meta.color}20` : 'none',
                            transition: 'all 0.4s ease',
                        }}>
                            {/* Top accent line for completed gate */}
                            <AnimatePresence>
                                {isDone && (
                                    <motion.div
                                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                        style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                            background: `linear-gradient(90deg, ${meta.color}, transparent)`,
                                            transformOrigin: 'left',
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div>
                                    <span style={{ fontFamily: T.mono, fontSize: 9, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{meta.id}</span>
                                    <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2 }}>{meta.equation}</div>
                                </div>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 6,
                                    background: meta.accentBg,
                                    border: `1px solid ${output ? meta.color : meta.color + '40'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: T.mono, fontSize: 16, fontWeight: 800, color: meta.color,
                                    boxShadow: output ? `0 0 10px ${meta.color}50` : 'none',
                                    transition: 'all 0.2s',
                                }}>{meta.symbol}</div>
                            </div>

                            {/* Per-gate progress bar */}
                            <div style={{ marginBottom: 12, height: 3, background: T.surface, borderRadius: 2, overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${testedFraction * 100}%` }}
                                    style={{ height: '100%', background: meta.color, borderRadius: 2, opacity: 0.7 }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Input toggles */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
                                {(['inputA', ...(meta.inputs === 2 ? ['inputB'] : [])] as ('inputA' | 'inputB')[]).map(key => {
                                    const val = s[key];
                                    return (
                                        <button key={key} onClick={() => toggle(gateId, key)} style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            background: 'none', border: 'none', cursor: 'pointer',
                                        }}>
                                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>{key === 'inputA' ? 'A' : 'B'}</span>
                                            <motion.div animate={{
                                                background: val ? meta.accentBg : T.surface,
                                                borderColor: val ? meta.color : T.border,
                                                boxShadow: val ? `0 0 8px ${meta.color}50` : 'none',
                                            }} style={{ width: 38, height: 38, borderRadius: 6, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: val ? meta.color : T.muted }}>{val ? 1 : 0}</span>
                                            </motion.div>
                                        </button>
                                    );
                                })}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 8, color: meta.color }}>Y</span>
                                    <motion.div animate={{
                                        background: output ? meta.accentBg : T.surface,
                                        borderColor: output ? meta.color : T.border,
                                        boxShadow: output ? `0 0 14px ${meta.color}60` : 'none',
                                    }} style={{ width: 38, height: 38, borderRadius: 6, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: output ? meta.color : T.muted }}>{output ? 1 : 0}</span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Mini truth table */}
                            <div style={{ fontSize: 0 }}>
                                {table.map((row, i) => {
                                    const tested = s.tested.has(i);
                                    const isCurrent = row.inputs[0] === s.inputA && (meta.inputs === 1 || row.inputs[1] === s.inputB);
                                    return (
                                        <div key={i} style={{
                                            display: 'flex', gap: 4, padding: '3px 8px', borderRadius: 3,
                                            marginBottom: 2,
                                            background: isCurrent ? meta.accentBg : 'transparent',
                                            opacity: tested ? 1 : 0.28,
                                            borderLeft: isCurrent ? `3px solid ${meta.color}` : '3px solid transparent',
                                            transition: 'all 0.2s',
                                        }}>
                                            {row.inputs.map((v, j) => (
                                                <span key={j} style={{ fontFamily: T.mono, fontSize: 12, color: v ? meta.color : T.muted, minWidth: 16, textAlign: 'center' }}>{v ? 1 : 0}</span>
                                            ))}
                                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, margin: '0 4px' }}>→</span>
                                            <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: row.output ? meta.color : T.muted, minWidth: 16, textAlign: 'center' }}>
                                                {tested ? (row.output ? 1 : 0) : '?'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* XP Badge — springs in on completion */}
                            <AnimatePresence>
                                {isDone && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.6, y: 4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '5px 10px', background: `${meta.color}15`, borderRadius: 6, border: `1px solid ${meta.color}40` }}
                                    >
                                        <CheckCircle2 size={12} style={{ color: meta.color }} />
                                        <span style={{ fontFamily: T.mono, fontSize: 9, color: meta.color, fontWeight: 700 }}>Characterized — +XP</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
