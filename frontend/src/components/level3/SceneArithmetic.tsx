/**
 * SceneArithmetic.tsx — Module 3.4: Binary Arithmetic Lab
 * Step-by-step binary addition with animated carry propagation visualization.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, RefreshCw, Eye, Target, Zap, Waves, HelpCircle } from 'lucide-react';
import { useBinaryStore } from '../../stores/binaryStore';
import type { Bit } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onCorrect: () => void; }

const BitCell: React.FC<{ bit: Bit | null; highlight?: 'carry' | 'result' | 'input'; onClick?: () => void; label?: string; }> = ({ bit, highlight, onClick, label }) => {
    const colors: Record<string, string> = {
        carry: T.warning, result: T.success, input: T.accent,
    };
    const col = highlight ? colors[highlight] : T.muted;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {label && <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>{label}</span>}
            <motion.div
                onClick={onClick}
                whileTap={onClick ? { scale: 0.9 } : undefined}
                whileHover={onClick ? { borderColor: col, background: `${col}05` } : undefined}
                style={{
                    width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.mono, fontSize: 24, fontWeight: 800,
                    color: bit !== null ? col : T.border,
                    background: bit && highlight ? `${col}15` : T.surface,
                    border: `2px solid ${bit !== null && highlight ? col : T.border}`,
                    borderRadius: 6,
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative'
                }}
            >
                {bit !== null ? bit : '·'}
            </motion.div>
        </div>
    );
};

export const SceneArithmetic: React.FC<Props> = ({ onCorrect }) => {
    const { 
        operandA, operandB, addSteps, addResult, isAdding, additionComplete, 
        toggleOperandBit, computeAddition, revealNextStep, resetAdder, recordAction,
        isArithmeticReverseMode, targetSum, setReverseMode,
        isLogicOverlayVisible, toggleLogicOverlay
    } = useBinaryStore();
    const { triggerHaptic, playSound } = useGlobalSensory();

    const [processingMode, setProcessingMode] = useState<'ripple' | 'parallel'>('ripple');

    const handleToggle = (side: 'A' | 'B', i: number) => {
        if (isAdding) return;
        toggleOperandBit(side, i);
        resetAdder();
        recordAction('interactions');
        triggerHaptic('light');
    };

    const handleStep = () => {
        if (!isAdding) {
            computeAddition();
        }
        revealNextStep();
        recordAction('interactions');
        triggerHaptic('snap');
        
        // Completion check
        const nextRevealedCount = addSteps.filter(s => s.revealed).length + 1;
        if (nextRevealedCount >= addSteps.length) {
            onCorrect();
            playSound('success');
            triggerHaptic('success');
        }
    };

    const runParallel = async () => {
        computeAddition();
        playSound('tension'); // REQ 10 Elite: Thinking tension
        triggerHaptic('heavy');
        
        // REQ 10 Elite: Thinking Pause (Computational delay)
        await new Promise(r => setTimeout(r, 400));
        
        // Reveal all steps quickly
        for (let i = 0; i < addSteps.length; i++) {
            await new Promise(r => setTimeout(r, 120)); // Micro-timing polish
            revealNextStep();
            triggerHaptic('micro');
        }
        onCorrect();
        playSound('success');
    };

    const aDecimal = operandA.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const bDecimal = operandB.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const resultDecimal = addResult.reduce<number>((acc, b, i) => acc | (b << (4 - i)), 0);

    const revealedCount = addSteps.filter(s => s.revealed).length;
    const currentStep = addSteps.find(s => !s.revealed);

    return (
        <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            {/* Logic Overlay Toggle */}
            <button 
                onClick={toggleLogicOverlay}
                style={{
                    position: 'absolute', top: -40, right: 0,
                    background: isLogicOverlayVisible ? T.accent : 'transparent',
                    border: `1px solid ${T.accent}`, color: isLogicOverlayVisible ? '#0A0B10' : T.accent,
                    padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 10,
                    zIndex: 50
                }}
            >
                <Eye size={12} />
                {isLogicOverlayVisible ? 'LOGIC VIEW: ON' : 'LOGIC VIEW: OFF'}
            </button>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.4 — Binary Arithmetic Lab
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Ripple Carry Adder</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                    <button 
                        onClick={() => setReverseMode(!isArithmeticReverseMode)}
                        style={{
                            padding: '4px 12px', borderRadius: 4, background: isArithmeticReverseMode ? T.warning : 'transparent',
                            border: `1px solid ${T.warning}`, color: isArithmeticReverseMode ? T.card : T.warning,
                            fontSize: 10, fontFamily: T.mono, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                        }}
                    >
                        <Target size={12} />
                        {isArithmeticReverseMode ? 'REVERSE CHALLENGE: ON' : 'STUDY MODE'}
                    </button>
                    <button 
                        onClick={() => setProcessingMode(processingMode === 'ripple' ? 'parallel' : 'ripple')}
                        style={{
                            padding: '4px 12px', borderRadius: 4, background: 'transparent',
                            border: `1px solid ${T.muted}`, color: T.muted,
                            fontSize: 10, fontFamily: T.mono, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                        }}
                    >
                        {processingMode === 'ripple' ? <Waves size={12} /> : <Zap size={12} />}
                        {processingMode === 'ripple' ? 'SEQ: RIPPLE' : 'PAR: LOOKAHEAD'}
                    </button>
                </div>
            </div>

            {/* Reverse Challenge Header */}
            <AnimatePresence>
                {isArithmeticReverseMode && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 16, background: 'rgba(245,158,11,0.05)', borderRadius: 12, border: `1px dashed ${T.warning}`, marginBottom: 24 }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase' }}>Current Sum</div>
                            <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: aDecimal + bDecimal === targetSum ? T.success : T.text }}>{aDecimal + bDecimal}</div>
                        </div>
                        <div style={{ fontSize: 24, color: T.muted }}>→</div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, textTransform: 'uppercase' }}>Target Sum</div>
                            <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.warning }}>{targetSum}</div>
                        </div>
                        {aDecimal + bDecimal === targetSum && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: T.success, display: 'flex', alignItems: 'center', gap: 4, fontFamily: T.mono, fontSize: 11, fontWeight: 700 }}>
                                <RefreshCw size={14} /> MATCHED
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Operand Editor */}
            <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 24, position: 'relative' }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>
                    Input Operands
                </div>

                {/* Operand A (REQ 11 Elite: Attention Lock) */}
                <motion.div 
                    animate={{ opacity: isAdding || additionComplete ? 0.4 : 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}
                >
                    <span style={{ fontFamily: T.mono, fontSize: 14, color: T.accent, minWidth: 24, textAlign: 'right' }}>A</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {operandA.map((bit, i) => (
                            <BitCell key={i} bit={bit} highlight="input" label={`2^${3-i}`} onClick={() => handleToggle('A', i)} />
                        ))}
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 13, color: T.muted }}>= {aDecimal}</span>
                </motion.div>

                {/* + operator (REQ 11 Elite: Attention Lock) */}
                <motion.div 
                    animate={{ opacity: isAdding || additionComplete ? 0.4 : 1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}
                >
                    <span style={{ fontFamily: T.mono, fontSize: 18, color: T.success, minWidth: 24, textAlign: 'right' }}>+</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {operandB.map((bit, i) => (
                            <BitCell key={i} bit={bit} highlight="input" onClick={() => handleToggle('B', i)} />
                        ))}
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 13, color: T.muted }}>= {bDecimal}</span>
                </motion.div>

                <div style={{ height: 1, background: T.border, margin: '16px 0 16px 36px' }} />

                {/* Result row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 14, color: T.success, minWidth: 24, textAlign: 'right' }}>=</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {addResult.map((bit, i) => (
                            <BitCell key={i} bit={additionComplete ? bit : null} highlight="result" label={i === 0 ? 'Cout' : ''} />
                        ))}
                    </div>
                    {additionComplete && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: T.mono, fontSize: 13, color: T.success }}>
                            = {resultDecimal}
                        </motion.span>
                    )}
                </div>

                {/* Logic Overlay Full Adder equations */}
                <AnimatePresence>
                    {isLogicOverlayVisible && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', top: 24, right: 24, width: 220, padding: 12, background: 'rgba(0,0,0,0.8)', border: `1px solid ${T.accent}`, borderRadius: 8, fontFamily: T.mono, fontSize: 9, color: T.accent }}
                        >
                            <div style={{ fontWeight: 700, marginBottom: 6 }}>Full Adder Logic</div>
                            <div>Sum = A ⊕ B ⊕ C<sub>in</sub></div>
                            <div style={{ marginTop: 4 }}>C<sub>out</sub> = (A & B) | (C<sub>in</sub> & (A ⊕ B))</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Addition Animation */}
            {isAdding && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            {processingMode === 'ripple' ? 'Ripple Carry Engine' : 'Parallel Lookahead Engine'}
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
                            Stage {revealedCount}/{addSteps.length}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
                        {addSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    borderColor: step.revealed ? T.accent : T.border,
                                    background: step.revealed ? 'rgba(0,212,255,0.03)' : 'transparent'
                                }}
                                style={{ width: 110, padding: 12, borderRadius: 8, border: '1px solid', position: 'relative' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10 }}>
                                        <span style={{ color: T.muted }}>bits:</span>
                                        <span style={{ color: T.text }}>{step.a},{step.b}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10 }}>
                                        <span style={{ color: T.warning }}>Cin:</span>
                                        <span style={{ color: T.warning }}>{step.carry_in}</span>
                                    </div>
                                    <div style={{ height: 1, background: T.border, margin: '2px 0' }} />
                                    <AnimatePresence mode="wait">
                                        {step.revealed ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10, fontWeight: 700 }}>
                                                    <span style={{ color: T.success }}>Sum:</span>
                                                    <span>{step.sum}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10 }}>
                                                    <span style={{ color: T.warning }}>Cout:</span>
                                                    <span>{step.carry_out}</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>...</div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {processingMode === 'ripple' && i < 3 && step.revealed && step.carry_out === 1 && (
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: 12 }}
                                        style={{ position: 'absolute', right: -12, top: '50%', height: 2, background: T.warning }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {currentStep && processingMode === 'ripple' && (
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textAlign: 'center' }}>
                            Computing full-adder for column {3 - (addSteps.indexOf(currentStep))}...
                        </div>
                    )}
                </motion.div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {!isAdding && !additionComplete && (
                    <motion.button
                        onClick={processingMode === 'ripple' ? handleStep : runParallel}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            background: processingMode === 'ripple' ? 'rgba(0,212,255,0.08)' : 'rgba(16,185,129,0.1)',
                            border: `2px solid ${processingMode === 'ripple' ? T.accent : T.success}`,
                            borderRadius: 8, color: processingMode === 'ripple' ? T.accent : T.success, cursor: 'pointer',
                        }}
                    >
                        {processingMode === 'ripple' ? <ChevronRight size={14} /> : <Play size={14} />}
                        {processingMode === 'ripple' ? 'START STEPPER' : 'COMPUTE PARALLEL'}
                    </motion.button>
                )}
                {isAdding && !additionComplete && processingMode === 'ripple' && (
                    <motion.button
                        onClick={handleStep}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            background: 'rgba(245,158,11,0.1)', border: `2px solid ${T.warning}`,
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

            {/* Engineering Context: Why This Matters */}
            <div style={{ marginTop: 48, padding: 20, background: 'rgba(16,185,129,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <HelpCircle size={14} style={{ color: T.success }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.success, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Engineering Context: The ALU
                    </span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                    What you see here is a primitive **Arithmetic Logic Unit (ALU)**. Modern ALUs can perform 
                    billions of these additions every second. To achieve that speed, they don't just "ripple" 
                    carries—they use predictive mathematics to calculate the carry for bit 63 at the same time 
                    as bit 1!
                </p>
            </div>
        </div>
    );
};

