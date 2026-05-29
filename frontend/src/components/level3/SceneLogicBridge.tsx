/**
 * SceneLogicBridge.tsx - Module 3.5: Post-Arithmetic Transition
 * 
 * "Building Mode": The user manually configures gates to create a Half-Adder,
 * proving they understand how arithmetic manifests from physical logic.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Zap, Layers, RefreshCcw, ArrowRight } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { useBinaryStore } from '../../stores/binaryStore';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onComplete: () => void; }

type GateType = 'XOR' | 'AND' | 'OR' | 'NAND';

export const SceneLogicBridge: React.FC<Props> = ({ onComplete }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const { labStage, setLabStage, setStageLocked, setNavigationLocked } = useBinaryStore();
    const [isRevealed, setIsRevealed] = useState(false);

    React.useEffect(() => {
        if (labStage === 'execution' || labStage === 'complete' || isRevealed) setNavigationLocked(false);
        else setNavigationLocked(true);
    }, [labStage, isRevealed, setNavigationLocked]);
    
    // Building State
    const [inputA, setInputA] = useState(0);
    const [inputB, setInputB] = useState(0);
    const [sumGate, setSumGate] = useState<GateType | null>(null);
    const [carryGate, setCarryGate] = useState<GateType | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const handleReveal = () => {
        setIsRevealed(true);
        triggerHaptic('heavy');
        playSound('success');
    };

    // Half-Adder Logic Check
    const checkLogic = () => {
        return sumGate === 'XOR' && carryGate === 'AND';
    };

    const handleTest = () => {
        setIsTesting(true);
        triggerHaptic('tension');
        playSound('tension');
        
        setTimeout(() => {
            setIsTesting(false);
            if (checkLogic()) {
                triggerHaptic('success');
                playSound('success');
            } else {
                triggerHaptic('error');
                playSound('fail');
            }
        }, 1200);
    };

    const calculateOutput = (a: number, b: number, gate: GateType | null) => {
        if (!gate) return '?';
        if (gate === 'AND') return a && b ? 1 : 0;
        if (gate === 'OR') return a || b ? 1 : 0;
        if (gate === 'XOR') return a !== b ? 1 : 0;
        if (gate === 'NAND') return !(a && b) ? 1 : 0;
        return '?';
    };

    const sumResult = calculateOutput(inputA, inputB, sumGate);
    const carryResult = calculateOutput(inputA, inputB, carryGate);
    const isSuccess = checkLogic();

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40, minHeight: '100vh', paddingTop: 60, alignItems: 'center' }}>
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
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>MODULE 3.5</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Gates are the atoms of thought.</h2>
                        </motion.div>

                        {/* CENTER: Visual Explanation (AND/OR/XOR operations) */}
                        <div style={{ width: 320, height: 120, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, position: 'relative', display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <div style={{ width: 12, height: 12, background: T.accent, borderRadius: 2 }} />
                                    <div style={{ width: 12, height: 12, background: T.accent, borderRadius: 2 }} />
                                </div>
                                <ArrowRight size={10} color={T.muted} />
                                <motion.div 
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ width: 32, height: 20, background: T.surface, border: `1px solid ${T.accent}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.mono, color: T.accent }}
                                >
                                    AND
                                </motion.div>
                                <ArrowRight size={10} color={T.muted} />
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ width: 12, height: 12, background: T.accent, borderRadius: 2, boxShadow: `0 0 10px ${T.accent}` }} 
                                />
                            </div>
                        </div>

                        {/* BOTTOM: Deep Theory */}
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                            <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
                                    A computer is billions of gates arranged to create meaning. 
                                    All processors are built from these same tiny primitives.
                                </p>
                                <p style={{ color: T.accent, fontSize: 14, fontWeight: 700, fontFamily: T.mono, letterSpacing: '-0.02em' }}>
                                    "A gate is a decision made by physics."
                                </p>
                                <div style={{ height: 1, width: 40, background: T.accent, opacity: 0.2, alignSelf: 'center' }} />
                                <p style={{ color: T.warning, fontSize: 12, fontWeight: 900, fontFamily: T.mono }}>
                                    NOW YOU WILL: CONNECT THE PHYSICAL WORLD TO LOGICAL CONCLUSIONS.
                                </p>
                            </div>
                            <button 
                                onClick={() => { setLabStage('execution'); setStageLocked(false); triggerHaptic('success'); }}
                                style={{ padding: '12px 32px', background: T.accent, color: T.bg, border: 'none', borderRadius: 4, fontWeight: 900, fontFamily: T.mono, cursor: 'pointer', fontSize: 13 }}
                            >
                                INITIALIZE BRIDGE →
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ textAlign: 'center' }}>
                <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.4em', color: T.accent, display: 'block', marginBottom: 16 }}
                >
                    3.5 - The Bridge to Logic
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 16 }}>Manifesting Computation</h2>
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                    <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.6 }}>
                        A computer is not a calculator. It is a physical arrangement of gates. 
                        To build a 64-bit CPU, we first need to build a single **Half-Adder**.
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', minHeight: 450, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                    {!isRevealed ? (
                        <motion.div 
                            key="box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={handleReveal}
                            style={{ 
                                width: 280, height: 280, background: T.card, border: `2px solid ${T.accent}`, borderRadius: 24,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
                                cursor: 'pointer', boxShadow: `0 0 40px ${T.accent}15`
                            }}
                        >
                            <Hexagon size={64} color={T.accent} fill={`${T.accent}20`} />
                            <span style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 900, color: T.accent }}>OPEN LOGIC CORE</span>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="interact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
                        >
                            <div style={{ 
                                width: '100%', background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, 
                                padding: 40, position: 'relative', overflow: 'hidden',
                                boxShadow: isSuccess ? `0 0 60px ${T.success}10` : 'none'
                             }}>
                                {/* Signal Path Visualization */}
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', gap: 40, alignItems: 'center' }}>
                                    
                                    {/* Inputs */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted, display: 'block', marginBottom: 8 }}>INPUT A</span>
                                            <button 
                                                onClick={() => { setInputA(a => a === 0 ? 1 : 0); triggerHaptic('light'); }}
                                                style={{ width: 64, height: 64, borderRadius: 12, background: inputA ? T.accent : T.surface, border: `2px solid ${T.accent}`, color: inputA ? T.bg : T.accent, fontSize: 24, fontWeight: 900, cursor: 'pointer', fontFamily: T.mono }}
                                            >
                                                {inputA}
                                            </button>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted, display: 'block', marginBottom: 8 }}>INPUT B</span>
                                            <button 
                                                onClick={() => { setInputB(b => b === 0 ? 1 : 0); triggerHaptic('light'); }}
                                                style={{ width: 64, height: 64, borderRadius: 12, background: inputB ? T.accent : T.surface, border: `2px solid ${T.accent}`, color: inputB ? T.bg : T.accent, fontSize: 24, fontWeight: 900, cursor: 'pointer', fontFamily: T.mono }}
                                            >
                                                {inputB}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Gate Configuration */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', top: -18, left: 10, fontSize: 11, fontFamily: T.mono, color: T.success, fontWeight: 800 }}>SUM PATH</span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {(['XOR', 'AND', 'OR'] as GateType[]).map(g => (
                                                    <button 
                                                        key={g} onClick={() => { setSumGate(g); triggerHaptic('micro'); }}
                                                        style={{ flex: 1, padding: '10px 4px', fontSize: 12, fontFamily: T.mono, fontWeight: 800, borderRadius: 6, cursor: 'pointer', background: sumGate === g ? T.success : T.surface, color: sumGate === g ? T.bg : T.muted, border: `1px solid ${sumGate === g ? T.success : T.border}` }}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', top: -18, left: 10, fontSize: 11, fontFamily: T.mono, color: T.warning, fontWeight: 800 }}>CARRY PATH</span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {(['AND', 'OR', 'NAND'] as GateType[]).map(g => (
                                                    <button 
                                                        key={g} onClick={() => { setCarryGate(g); triggerHaptic('micro'); }}
                                                        style={{ flex: 1, padding: '10px 4px', fontSize: 10, fontFamily: T.mono, fontWeight: 800, borderRadius: 6,
                                background: carryGate === g ? T.warning : T.surface, 
                                color: carryGate === g ? T.bg : T.muted, 
                                border: `1px solid ${carryGate === g ? `${T.warning}40` : T.border}` 
                            }}
                        >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Outputs */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted, display: 'block', marginBottom: 8 }}>SUM</span>
                                            <motion.div 
                                                animate={{ 
                                                    borderColor: isTesting ? T.accent : (isSuccess ? `${T.success}33` : T.border), 
                                                    scale: isTesting ? [1, 1.05, 1] : 1 
                                                }}
                                                style={{ width: 56, height: 60, borderRadius: 8, background: T.surface, border: '2px dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: isSuccess ? T.success : T.muted, fontFamily: T.mono }}
                                            >
                                                {isTesting ? '?' : sumResult}
                                            </motion.div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted, display: 'block', marginBottom: 8 }}>CARRY</span>
                                            <motion.div 
                                                animate={{ 
                                                    borderColor: isTesting ? T.accent : (isSuccess ? `${T.warning}33` : T.border), 
                                                    scale: isTesting ? [1, 1.05, 1] : 1 
                                                }}
                                                style={{ width: 56, height: 60, borderRadius: 8, background: T.surface, border: '2px dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: isSuccess ? T.warning : T.muted, fontFamily: T.mono }}
                                            >
                                                {isTesting ? '?' : carryResult}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Truth Table Guide (Helpful) */}
                                <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'center', gap: 40 }}>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', opacity: 0.6 }}>
                                        <Zap size={14} color={T.accent} />
                                        <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted }}>GOAL: SUM = 1 only if Input A ≠ Input B</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', opacity: 0.6 }}>
                                        <Layers size={14} color={T.warning} />
                                        <span style={{ fontSize: 11, fontFamily: T.mono, color: T.muted }}>GOAL: CARRY = 1 only if Input A AND B are 1</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={handleTest}
                                    style={{ padding: '16px 40px', background: T.accent, color: T.bg, border: 'none', borderRadius: 12, fontFamily: T.mono, fontSize: 14, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                                >
                                    <RefreshCcw size={16} /> RUN LOGIC TEST
                                </motion.button>
                                
                                {isSuccess && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={onComplete}
                                        style={{ padding: '16px 40px', background: T.success, color: T.bg, border: 'none', borderRadius: 12, fontFamily: T.mono, fontSize: 14, fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 30px ${T.success}40` }}
                                    >
                                        FINALIZE BRIDGE →
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Context Line */}
            {isSuccess && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: T.success, fontSize: 13, fontFamily: T.mono, textAlign: 'center', letterSpacing: '0.1em' }}>
                    [ ANALYSIS: HALF-ADDER DETECTED. BINARY TRANSITION COMPLETE. ]
                </motion.p>
            )}
        </div>
    );
};
