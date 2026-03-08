/**
 * SceneArithmetic.tsx — Module 3.4: Binary Arithmetic Lab
 * Step-by-step binary addition with animated carry propagation visualization.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, RefreshCw } from 'lucide-react';
import { useBinaryStore } from '../../stores/binaryStore';
import type { Bit } from '../../stores/binaryStore';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onCorrect: () => void; }

const BitCell: React.FC<{ bit: Bit | null; highlight?: 'carry' | 'result' | 'input'; onClick?: () => void; }> = ({ bit, highlight, onClick }) => {
    const colors: Record<string, string> = {
        carry: T.warning, result: T.success, input: T.accent,
    };
    const col = highlight ? colors[highlight] : T.muted;
    return (
        <motion.div
            onClick={onClick}
            whileTap={onClick ? { scale: 0.9 } : undefined}
            style={{
                width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.mono, fontSize: 24, fontWeight: 800,
                color: bit !== null ? col : T.border,
                background: bit && highlight ? `${col}15` : T.surface,
                border: `2px solid ${bit !== null && highlight ? col : T.border}`,
                borderRadius: 6,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
            }}
        >
            {bit !== null ? bit : '·'}
        </motion.div>
    );
};

export const SceneArithmetic: React.FC<Props> = ({ onCorrect }) => {
    const { operandA, operandB, addSteps, addResult, isAdding, additionComplete, toggleOperandBit, computeAddition, revealNextStep, resetAdder } = useBinaryStore();

    const aDecimal = operandA.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const bDecimal = operandB.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const resultDecimal = addResult.reduce<number>((acc, b, i) => acc | (b << (4 - i)), 0);

    const handleReveal = () => {
        revealNextStep();
        const allRevealed = addSteps.every(s => s.revealed);
        if (allRevealed) onCorrect();
    };

    const revealedCount = addSteps.filter(s => s.revealed).length;
    const currentStep = addSteps.find(s => !s.revealed);

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.4 — Binary Arithmetic Lab
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Ripple Carry Adder</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>Edit the operands, then step through the carry propagation.</p>
            </div>

            {/* Operand Editor */}
            <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 24 }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
                    Input Operands (click to toggle bits)
                </div>

                {/* Column headers */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 4, paddingRight: 4 }}>
                    {['bit3', 'bit2', 'bit1', 'bit0'].map(l => (
                        <div key={l} style={{ width: 52, textAlign: 'center', fontFamily: T.mono, fontSize: 8, color: T.muted }}>{l}</div>
                    ))}
                </div>

                {/* Operand A */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 14, color: T.accent, minWidth: 24, textAlign: 'right' }}>A</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {operandA.map((bit, i) => (
                            <BitCell key={i} bit={bit} highlight="input" onClick={() => { toggleOperandBit('A', i); resetAdder(); }} />
                        ))}
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 13, color: T.muted }}>= {aDecimal}</span>
                </div>

                {/* + operator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 18, color: T.success, minWidth: 24, textAlign: 'right' }}>+</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {operandB.map((bit, i) => (
                            <BitCell key={i} bit={bit} highlight="input" onClick={() => { toggleOperandBit('B', i); resetAdder(); }} />
                        ))}
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 13, color: T.muted }}>= {bDecimal}</span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: T.border, margin: '12px 0 12px 36px' }} />

                {/* Result row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 14, color: T.success, minWidth: 24, textAlign: 'right' }}>=</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {addResult.map((bit, i) => (
                            <AnimatePresence key={i} mode="wait">
                                <motion.div key={additionComplete ? 'done' : 'empty'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                    <BitCell bit={additionComplete ? bit : null} highlight="result" />
                                </motion.div>
                            </AnimatePresence>
                        ))}
                    </div>
                    {additionComplete && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: T.mono, fontSize: 13, color: T.success }}>
                            = {resultDecimal}
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Step-by-step carry animation */}
            {isAdding && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 20, background: T.card, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 12, marginBottom: 20 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 14 }}>
                        Carry Propagation — Step {revealedCount}/{addSteps.length}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
                        {addSteps.map((step, _i) => (
                            <div key={step.colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: step.revealed ? 1 : 0.25, transition: 'opacity 0.3s' }}>
                                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning }}>
                                    C{step.carry_in}
                                </div>
                                <BitCell bit={step.a} highlight="input" />
                                <BitCell bit={step.b} highlight="input" />
                                <div style={{ height: 1, width: 52, background: T.border }} />
                                <BitCell bit={step.revealed ? step.sum : null} highlight="result" />
                                <div style={{ height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    {step.carry_out === 1 && step.revealed && (
                                        <>
                                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning }}>↑C</div>
                                            <motion.div
                                                initial={{ y: -4, x: 0, opacity: 1, scale: 0.5 }}
                                                animate={{ y: -170, x: -60, opacity: 0, scale: 1.5 }}
                                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                                style={{
                                                    position: 'absolute', top: 2, left: -2, width: 16, height: 16,
                                                    borderRadius: '50%', background: T.warning,
                                                    boxShadow: `0 0 12px ${T.warning}`, pointerEvents: 'none',
                                                    display: 'flex', alignItems: 'center', justifyItems: 'center',
                                                    color: '#000', fontSize: 10, fontWeight: 800,
                                                }}
                                            >
                                                C
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {currentStep && (
                        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.text, marginBottom: 12 }}>
                            <span style={{ color: T.accent }}>{currentStep.a}</span> + <span style={{ color: T.accent }}>{currentStep.b}</span> + carry(<span style={{ color: T.warning }}>{currentStep.carry_in}</span>) = <span style={{ color: T.success }}>{currentStep.sum}</span>, carry_out = <span style={{ color: T.warning }}>{currentStep.carry_out}</span>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Completion banner */}
            <AnimatePresence>
                {additionComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ padding: 16, background: 'rgba(16,185,129,0.08)', border: `1px solid rgba(16,185,129,0.3)`, borderRadius: 10, textAlign: 'center', marginBottom: 16 }}
                    >
                        <div style={{ fontFamily: T.mono, fontSize: 12, color: T.success, marginBottom: 4 }}>
                            {aDecimal} + {bDecimal} = {resultDecimal} ✓
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}>
                            Ripple carry adder computed in {addSteps.length} full-adder stages
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {!isAdding && !additionComplete && (
                    <motion.button
                        onClick={computeAddition}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            background: 'rgba(0,212,255,0.08)', border: `2px solid rgba(0,212,255,0.3)`,
                            borderRadius: 8, color: T.accent, cursor: 'pointer',
                        }}
                    >
                        <Play size={14} /> Compute
                    </motion.button>
                )}
                {isAdding && !additionComplete && (
                    <motion.button
                        onClick={handleReveal}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            background: 'rgba(245,158,11,0.1)', border: `2px solid rgba(245,158,11,0.3)`,
                            borderRadius: 8, color: T.warning, cursor: 'pointer',
                        }}
                    >
                        <ChevronRight size={14} /> Next Carry Step
                    </motion.button>
                )}
                {(isAdding || additionComplete) && (
                    <button
                        onClick={resetAdder}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 20px', fontFamily: T.mono, fontSize: 10,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            background: 'transparent', border: `1px solid ${T.border}`,
                            borderRadius: 8, color: T.muted, cursor: 'pointer',
                        }}
                    >
                        <RefreshCw size={12} /> Reset
                    </button>
                )}
            </div>
        </div>
    );
};
