/**
 * SceneArithmetic.tsx — Module 3.4: Binary Arithmetic Lab
 * Elite Upgrade: Prediction-First Step-by-Step Addition with Physical Causality.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBinaryStore, Bit } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { playBitTone } from '../../utils/synesthesiaEngine';
import { KineticTraces, TracePath } from './KineticTraces';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onCorrect: () => void; }

const BitCell: React.FC<{ bit: number | null; highlight?: 'carry' | 'result'; label?: string; onClick?: () => void }> = ({ bit, highlight, label, onClick }) => {
    const isCarry = highlight === 'carry';
    const isResult = highlight === 'result';
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            {label && <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted }}>{label}</span>}
            <motion.div
                onClick={onClick}
                whileTap={onClick ? { scale: 0.95 } : undefined}
                whileHover={onClick ? { borderColor: isResult ? T.accent : T.border } : undefined}
                animate={{ 
                    borderColor: bit !== null ? (isCarry ? T.warning : (isResult || onClick ? T.accent : T.border)) : T.border,
                    background: bit === 1 ? (isCarry ? `${T.warning}08` : (isResult || onClick ? `${T.accent}08` : T.surface)) : T.surface,
                    scale: bit !== null ? 1.05 : 1
                }}
                style={{
                    width: 48, height: 60, borderRadius: 8, background: T.surface, border: '2px solid',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 900, fontFamily: T.mono, color: bit === null ? T.muted : (isCarry ? T.warning : (isResult || onClick ? T.accent : T.text)),
                    cursor: onClick ? 'pointer' : 'default',
                    position: 'relative'
                }}
            >
                {bit === null ? '?' : bit}
            </motion.div>
        </div>
    );
};

export const SceneArithmetic: React.FC<Props> = ({ onCorrect }) => {
    const { 
        operandA, operandB, addSteps, addResult, isAdding, additionComplete, isSystemBusy,
        toggleOperandBit, computeAddition, revealNextStep, resetAdder, recordAction,
        submitArithmeticPrediction, 
        labStage, setLabStage, isStageLocked, setStageLocked, setNavigationLocked,
        propagationDelay, setPredictionConfidence, nextScene, isLogicOverlayVisible,
        systemTemperature
    } = useBinaryStore();
    const { triggerHaptic, playSound } = useGlobalSensory();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const tracePaths = React.useMemo<TracePath[]>(() => {
        return addSteps.filter(s => s.revealed && s.carry_out === 1).map((s, i) => ({
            id: `trace-${s.colIndex}`,
            from: { x: (3 - s.colIndex) * 60 + 200, y: 100 }, // Approximate center logic
            to: { x: (3 - s.colIndex - 1) * 60 + 200, y: 100 },
            active: true
        }));
    }, [addSteps]);

    const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '0, 212, 255';

    useEffect(() => {
        if (labStage === 'execution' || labStage === 'complete') setNavigationLocked(false);
        else setNavigationLocked(true);
    }, [labStage, setNavigationLocked]);

    const [predCarry, setPredCarry] = useState<Bit>(0);
    const [predSum, setPredSum] = useState<Bit>(0);
    const [errorSimStep, setErrorSimStep] = useState<number | null>(null);
    const [isAutoRun, setIsAutoRun] = useState(false);

    const handleToggle = (side: 'A' | 'B', i: number) => {
        if (isSystemBusy || isAdding || (labStage === 'theory' && isStageLocked)) {
            if (isSystemBusy) triggerHaptic('micro');
            return;
        }
        toggleOperandBit(side, i);
        resetAdder();
        recordAction('interactions');
        triggerHaptic('light');
        playBitTone(3-i, 'high');
    };

    const nextStepIdx = addSteps.findIndex(s => !s.revealed);
    const currentStep = nextStepIdx !== -1 ? addSteps[nextStepIdx] : null;

    const handlePredict = async () => {
        if (!currentStep || isSystemBusy) return;
        
        const isCorrect = currentStep.carry_out === predCarry && currentStep.sum === predSum;
        submitArithmeticPrediction(predCarry, predSum);

        if (isCorrect) {
            triggerHaptic('success');
            playSound('success');
            await revealNextStep();
            
            const stillAdding = addSteps.some(s => !s.revealed);
            if (!stillAdding) {
                playSound('success');
                triggerHaptic('success');
                if (labStage === 'execution') setStageLocked(false);
            }
        } else {
            triggerHaptic('error');
            playSound('fail');
            recordAction('incorrectToggles');
            
            // REQ 7: Error-Driven Learning (Slow Corrective Show)
            setErrorSimStep(nextStepIdx);
            await new Promise(r => setTimeout(r, 1500));
            setErrorSimStep(null);
            setPredCarry(0);
            setPredSum(0);
        }
    };

    const handleStart = () => {
        if (isSystemBusy) {
            triggerHaptic('micro');
            return;
        }
        if (!isAdding) {
            computeAddition();
            setLabStage('prediction');
        }
        // IMMEDIATE FEEDBACK
        triggerHaptic('snap');
        setPredCarry(0);
        setPredSum(0);
    };

    // Auto-run logic (REQ 7: CPU Speed Simulation)
    React.useEffect(() => {
        if (isAutoRun && isAdding && !additionComplete && nextStepIdx !== -1 && labStage === 'execution') {
            const timer = setTimeout(async () => {
                const step = addSteps[nextStepIdx];
                // In auto mode, we use "correct" prediction automatically to show speed
                submitArithmeticPrediction(step.carry_out, step.sum);
                await revealNextStep();
            }, 180); // 180ms per bit (Human-visible but fast)
            return () => clearTimeout(timer);
        }
    }, [isAutoRun, isAdding, additionComplete, nextStepIdx, labStage, revealNextStep, addSteps, submitArithmeticPrediction]);

    const aDecimal = operandA.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const bDecimal = operandB.reduce<number>((acc, b, i) => acc | (b << (3 - i)), 0);
    const resultDecimal = addResult.reduce<number>((acc, b, i) => acc | (b << (4 - i)), 0);

    return (
        <div style={{ 
            width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh', paddingTop: 40,
            transition: 'filter 1s ease',
            filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, 0.2))` : 'none'
        }}>
            {/* 1. THEORY-FIRST OVERLAY (SEE -> CONNECT -> DO) */}
            <AnimatePresence>
                {labStage === 'theory' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ 
                            position: 'absolute', inset: 0, background: T.bg, zIndex: 100,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40,
                            padding: 40, textAlign: 'center'
                        }}
                    >
                        {/* TOP: Concept */}
                        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>MODULE 3.4</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Mathematics is manifest logic.</h2>
                        </motion.div>

                        {/* CENTER: Visual Explanation (Full Adder) */}
                        <div style={{ width: 320, height: 160, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: T.accent, fontSize: 13, fontFamily: T.mono }}>A: 1</motion.div>
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} style={{ color: T.accent, fontSize: 13, fontFamily: T.mono }}>B: 1</motion.div>
                                <div style={{ width: 40, height: 1, background: T.border }} />
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} style={{ color: T.success, fontSize: 16, fontWeight: 800, fontFamily: T.mono }}>SUM: 0</motion.div>
                            </div>
                            <motion.div
                                animate={{ x: [0, 40, 40], y: [0, 0, -40], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                style={{ position: 'absolute', color: T.warning, fontSize: 12, fontFamily: T.mono, fontWeight: 900 }}
                            >
                                CARRY →
                            </motion.div>
                        </div>

                        {/* BOTTOM: Deep Theory */}
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                            <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                                    Addition is not an instant jump, but a sequence of carries. 
                                    Carry propagation delay is the primary bottleneck in calculator speed.
                                </p>
                                <p style={{ color: T.accent, fontSize: 15, fontWeight: 700, fontFamily: T.mono, letterSpacing: '-0.02em' }}>
                                    "Arithmetic is a chain of logic gates, not an instant sum."
                                </p>
                                <div style={{ height: 1, width: 40, background: T.accent, opacity: 0.2, alignSelf: 'center' }} />
                                <p style={{ color: T.warning, fontSize: 12, fontWeight: 900, fontFamily: T.mono }}>
                                    NOW YOU WILL: COMPUTE A 4-BIT SUM BY TRACKING EACH CARRY.
                                </p>
                            </div>
                            <button 
                                onClick={() => { setLabStage('execution'); setStageLocked(false); triggerHaptic('success'); }}
                                style={{ padding: '12px 32px', background: T.accent, color: T.bg, border: 'none', borderRadius: 4, fontWeight: 900, fontFamily: T.mono, cursor: 'pointer', fontSize: 13 }}
                            >
                                INITIALIZE ALU →
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ textAlign: 'center' }}>
                <motion.span 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 12 }}
                >
                    3.4 — The Logic of Math
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12 }}>Binary Synthesis</h2>
                <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {labStage === 'execution' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <p style={{ color: T.accent, fontSize: 15, fontFamily: T.mono, marginBottom: 4 }}>
                                    {aDecimal} + {bDecimal} = {additionComplete ? resultDecimal : '?'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                                    <span style={{ fontSize: 12, color: T.muted, fontFamily: T.mono }}>
                                        PROPAGATION COST: <span style={{ color: T.warning }}>{propagationDelay}ns</span>
                                    </span>
                                </div>
                            </div>
                        )}
                        {labStage === 'prediction' && (
                            <motion.div key="predict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 14, fontWeight: 700, fontFamily: T.mono }}>PREDICTION GATE</p>
                                <p style={{ color: T.muted, fontSize: 13, maxWidth: 300 }}>Predict the outcome of the FIRST COLUMN (Bit 0). What will be the Carry and Sum?</p>
                                
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {(['low', 'med', 'high'] as const).map(conf => (
                                        <button 
                                            key={conf}
                                            onClick={() => setPredictionConfidence(conf)}
                                            style={{ padding: '4px 12px', background: T.surface, border: `1px solid ${useBinaryStore.getState().predictionConfidence === conf ? T.accent : T.border}`, color: T.muted, borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: T.mono }}
                                        >
                                            {conf.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => { setLabStage('execution'); triggerHaptic('light'); }}
                                    style={{ padding: '8px 24px', background: T.accent, color: T.bg, border: 'none', borderRadius: 6, fontFamily: T.mono, fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
                                >
                                    CONFIRM & OBSERVE
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. PRIMARY SYSTEM (Center 70%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', position: 'relative' }}>
                <div ref={containerRef} style={{ width: '100%', background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden' }}>
                    <KineticTraces paths={tracePaths} containerRef={containerRef} />
                    {/* Prediction Overlay (REQ 3 & 6) */}
                    <AnimatePresence>
                        {isAdding && !additionComplete && errorSimStep === null && (
                             <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'rgba(13, 15, 22, 0.98)', borderTop: `2px solid ${T.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 50 }}
                            >
                                <span style={{ color: T.text, fontSize: 13, fontWeight: 800, fontFamily: T.mono }}>PREDICT STEP {nextStepIdx + 1}/4</span>
                                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 11, color: T.muted }}>C_OUT</span>
                                        <button 
                                            onClick={() => setPredCarry(c => (c === 0 ? 1 : 0) as Bit)}
                                            style={{ width: 48, height: 48, background: predCarry ? T.warning : T.surface, border: `2px solid ${T.warning}`, color: predCarry ? T.bg : T.warning, borderRadius: 8, fontFamily: T.mono, fontSize: 20, fontWeight: 900, cursor: 'pointer' }}
                                        >
                                            {predCarry}
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 11, color: T.muted }}>SUM</span>
                                        <button 
                                            onClick={() => setPredSum(s => (s === 0 ? 1 : 0) as Bit)}
                                            style={{ width: 48, height: 48, background: predSum ? T.success : T.surface, border: `2px solid ${T.success}`, color: predSum ? T.bg : T.success, borderRadius: 8, fontFamily: T.mono, fontSize: 20, fontWeight: 900, cursor: 'pointer' }}
                                        >
                                            {predSum}
                                        </button>
                                    </div>
                                    <button onClick={handlePredict} style={{ padding: '12px 32px', background: T.accent, color: T.bg, border: 'none', borderRadius: 8, fontFamily: T.mono, fontSize: 13, fontWeight: 900, cursor: 'pointer', marginLeft: 16 }}>
                                        APPLY LOGIC
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Addition Workspace */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', paddingRight: 40 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {operandA.map((bit, i) => {
                                const isTarget = isAdding && nextStepIdx === (3 - i);
                                return <BitCell key={i} bit={bit} highlight={isTarget ? 'carry' : 'result'} onClick={() => handleToggle('A', i)} />;
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: -40, top: 12, fontSize: 32, fontWeight: 800, color: T.success }}>+</span>
                            {operandB.map((bit, i) => {
                                const isTarget = isAdding && nextStepIdx === (3 - i);
                                return <BitCell key={i} bit={bit} highlight={isTarget ? 'carry' : 'result'} onClick={() => handleToggle('B', i)} />;
                            })}
                        </div>
                        <div style={{ width: '100%', height: 2, background: T.border, margin: '8px 0' }} />
                        <div style={{ display: 'flex', gap: 12 }}>
                            {addResult.map((bit, i) => {
                                const stepIdx = 4 - i;
                                const isRevealed = additionComplete || (i > 0 && addSteps[stepIdx]?.revealed);
                                const isError = errorSimStep === stepIdx;
                                const isTarget = isAdding && !additionComplete && (nextStepIdx === stepIdx);
                                const displayBit = isError ? (i === 0 ? predCarry : predSum) : (isRevealed ? bit : null);
                                return (
                                    <BitCell 
                                        key={i} 
                                        bit={displayBit} 
                                        highlight={isTarget ? 'carry' : (isError ? 'carry' : 'result')} 
                                        label={i === 0 ? 'COUT' : ''} 
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Ripple Steps Visualizer */}
                    <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 12 }}>
                        {addSteps.map((step, i) => {
                            const isActive = i === nextStepIdx;
                            const isError = errorSimStep === i;
                            return (
                                <motion.div 
                                    key={i}
                                    animate={{ 
                                        scale: isActive ? 1.05 : 1,
                                        borderColor: isError ? T.error : (step.revealed ? T.accent : T.border),
                                        background: isError ? `${T.error}10` : (step.revealed ? `${T.accent}05` : 'transparent')
                                    }}
                                    style={{ 
                                        width: 100, padding: '12px 8px', border: `1px solid`, borderRadius: 8,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative'
                                    }}
                                >
                                    <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted }}>BIT {i}</span>
                                    <span style={{ fontSize: 12, color: T.warning, fontFamily: T.mono }}>CIN: {isError ? '?' : step.carry_in}</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: T.mono }}>{step.a} + {step.b}</span>
                                    
                                    {/* Engineering Overlay: gate logic visualization */}
                                    {isLogicOverlayVisible && (
                                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${T.border}`, width: '100%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                                            <div style={{ fontSize: 10, fontFamily: T.mono, color: T.accent, opacity: 0.7 }}>FULL ADDER GEN</div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 10, color: T.muted }}>XOR</div>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 10, color: T.muted }}>AND</div>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 10, color: T.muted }}>OR</div>
                                            </div>
                                        </div>
                                    )}

                                    {isActive && (
                                        <motion.div layoutId="activeStep" style={{ position: 'absolute', bottom: -10, width: 6, height: 6, borderRadius: '50%', background: T.accent }} />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {!isAdding ? (
                        <motion.button
                            onClick={handleStart}
                            whileHover={{ scale: isSystemBusy ? 1 : 1.05 }}
                            whileTap={{ scale: isSystemBusy ? 0.98 : 0.95 }}
                            disabled={isSystemBusy || (labStage === 'theory' && isStageLocked)}
                            style={{
                                padding: '16px 48px', fontFamily: T.mono, fontSize: 14, fontWeight: 900,
                                background: isSystemBusy ? T.warning : T.accent, border: 'none', borderRadius: 8, 
                                color: T.bg, cursor: isSystemBusy ? 'wait' : 'pointer',
                                opacity: isSystemBusy ? 0.6 : 1
                            }}
                        >
                            {isSystemBusy ? 'PROCESSING...' : 'BEGIN SUMMATION'}
                        </motion.button>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsAutoRun(!isAutoRun)}
                                style={{
                                    padding: '10px 24px', fontFamily: T.mono, fontSize: 12, fontWeight: 800,
                                    background: isAutoRun ? T.warning : 'transparent', 
                                    border: `1px solid ${isAutoRun ? T.warning : T.border}`,
                                    color: isAutoRun ? T.bg : T.muted, borderRadius: 8, cursor: 'pointer'
                                }}
                            >
                                {isAutoRun ? 'CPU SPEED: ON' : 'AUTO-RUN (Simulate CPU)'}
                            </button>
                            <button
                                onClick={resetAdder}
                                style={{
                                    padding: '16px 32px', fontFamily: T.mono, fontSize: 13,
                                    background: 'transparent', border: `2px solid ${T.border}`, borderRadius: 8,
                                    color: T.muted, cursor: 'pointer'
                                }}
                            >
                                ABORT
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 3. FEEDBACK / COMPLETION */}
            <div style={{ textAlign: 'center', paddingBottom: 60 }}>
                {additionComplete && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(0,212,255,0.03)', border: `1px solid ${T.border}`, padding: 24, borderRadius: 12, maxWidth: 500, margin: '0 auto' }}>
                        <p style={{ fontSize: 16, color: T.text, marginBottom: 20 }}>
                            "When the ripple reaches the end and the carry overflows, what fundamental property is lost?"
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            {['Precision', 'Magnitude', 'Stability'].map(ans => (
                                <button
                                    key={ans}
                                    onClick={() => {
                                        if (ans === 'Magnitude') {
                                            setLabStage('complete'); 
                                            playSound('success');
                                            onCorrect();
                                        } else {
                                            playSound('fail');
                                            triggerHaptic('error');
                                        }
                                    }}
                                    style={{ padding: '10px 24px', background: T.surface, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, fontFamily: T.mono, fontSize: 13, cursor: 'pointer' }}
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {labStage === 'complete' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24 }}>
                        <p style={{ color: T.success, fontFamily: T.mono, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                            ✓ Binary Synthesis Complete. Logic has manifest as Mathematics.
                        </p>
                        <div style={{ padding: '12px 48px', border: `1px solid ${T.success}`, borderRadius: 6, fontFamily: T.mono, fontSize: 14, fontWeight: 900, color: T.success, letterSpacing: '0.1em' }}>
                            MODULE GRADUATION READY →
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
