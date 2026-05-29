/**
 * SceneRegister.tsx - Module 3.3: Bits in Memory
 * An 8-bit editable register with volatile decay simulation.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, RefreshCw } from 'lucide-react';
import { useBinaryStore, selectRegisterHex, Bit, bitsToNum } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

const WIDTHS: (8 | 16 | 32)[] = [8, 16, 32];

interface SceneRegisterProps {
    onStore?: () => void;
}
export const SceneRegister: React.FC<SceneRegisterProps> = ({ onStore }) => {
    const { 
        registerBits, registerWidth, storedValue, isWriting, isDecayed, isSystemBusy,
        toggleRegisterBit, setRegisterWidth, storeValue, refreshMemory,
        isAutoRefresh, toggleAutoRefresh, predictionStatus, submitRegisterPrediction,
        recordAction, labStage, setLabStage, isStageLocked, setStageLocked,
        propagationDelay, systemTemperature, setSystemTemperature, setPredictionConfidence,
        setNavigationLocked, nextScene, isLogicOverlayVisible
    } = useBinaryStore();

    const { triggerHaptic, playSound } = useGlobalSensory();
    const hex = useBinaryStore(selectRegisterHex);
    const decimal = storedValue;

    const [charge, setCharge] = useState(1);
    const [predictionValue, setPredictionValue] = useState<string>('');

    // REQ: Memory Decay Simulation (Physical Causality)
    useEffect(() => {
        const interval = setInterval(() => {
            const state = useBinaryStore.getState();
            const age = Date.now() - state.lastRefreshTime;
            
            // Temperature affects decay (Higher temp = faster decay)
            const baseDecay = 12000;
            const tempFactor = 1 - (state.systemTemperature * 0.85); 
            const decayDuration = state.isAutoRefresh ? 60000 : Math.max(2000, baseDecay * tempFactor);
            
            setCharge(() => {
                const newCharge = Math.max(0, 1 - age / decayDuration);
                
                // Trigger Refresh if Auto
                if (state.isAutoRefresh && newCharge < 0.75 && !state.isWriting) {
                    refreshMemory();
                }

                // Trigger Decay Effect
                if (newCharge === 0 && !state.isDecayed && state.registerBits.some(b => b === 1)) {
                    playSound('fail');
                    triggerHaptic('heavy');
                    useBinaryStore.setState(s => ({
                        registerBits: s.registerBits.map(b => Math.random() > 0.65 ? (b === 0 ? 1 : 0) : b) as Bit[],
                        isDecayed: true
                    }));
                }
                
                return newCharge;
            });
        }, 120); // slightly slower poll for performance
        return () => clearInterval(interval);
    }, [refreshMemory, playSound, triggerHaptic]);

    useEffect(() => {
        if (labStage === 'execution' || labStage === 'complete') setNavigationLocked(false);
        else setNavigationLocked(true);
    }, [labStage, setNavigationLocked]);

    const handleInitialWrite = () => {
        if (isSystemBusy || (labStage === 'theory' && isStageLocked)) return;
        setLabStage('prediction'); // Transition to prediction stage
        triggerHaptic('light');
    };

    const handleVerify = async () => {
        const val = parseInt(predictionValue);
        if (isNaN(val)) return;
        
        submitRegisterPrediction(val);
        if (val === bitsToNum(registerBits)) {
            triggerHaptic('success');
            playSound('success');
            await storeValue(true);
            if (onStore) onStore();
            if (labStage === 'execution') setStageLocked(false);
        } else {
            triggerHaptic('error');
            playSound('fail');
            setPredictionValue('');
            recordAction('incorrectToggles');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh', paddingTop: 40 }}>
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
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>MODULE 3.3</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Memory is a cycle, not a state.</h2>
                        </motion.div>

                        {/* CENTER: Visual Explanation (Decay & Refresh) */}
                        <div style={{ width: 300, height: 120, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <motion.div 
                                animate={{ 
                                    opacity: [1, 0.2, 1],
                                    scale: [1, 0.95, 1],
                                    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
                                    color: [T.accent, T.muted, T.accent]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ fontFamily: T.mono, fontSize: 64, fontWeight: 900 }}
                            >
                                1
                            </motion.div>
                            <motion.div 
                                animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ position: 'absolute', inset: 0, border: `2px solid ${T.accent}`, borderRadius: 12, pointerEvents: 'none' }}
                            />
                        </div>

                        {/* BOTTOM: Deep Theory */}
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                            <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                                    Electrons slowly leak away from silicon gates due to physics. 
                                    DRAM requires periodic "Refresh" cycles to maintain data integrity.
                                </p>
                                <p style={{ color: T.accent, fontSize: 15, fontWeight: 700, fontFamily: T.mono, letterSpacing: '-0.02em' }}>
                                    "Memory is a persistent decision that physics tries to erase."
                                </p>
                                <div style={{ height: 1, width: 40, background: T.accent, opacity: 0.2, alignSelf: 'center' }} />
                                <p style={{ color: T.warning, fontSize: 12, fontWeight: 900, fontFamily: T.mono }}>
                                    NOW YOU WILL: STORE A VALUE AND PREVENT IT FROM DECAYING.
                                </p>
                            </div>
                            <button 
                                onClick={() => { setLabStage('execution'); setStageLocked(false); triggerHaptic('success'); }}
                                style={{ padding: '12px 32px', background: T.accent, color: T.bg, border: 'none', borderRadius: 4, fontWeight: 900, fontFamily: T.mono, cursor: 'pointer', fontSize: 13 }}
                            >
                                INITIALIZE LAB →
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
                    3.3 - The Volatile Mind
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12 }}>Silicon Persistence</h2>
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 8 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: 140, height: 4, background: T.surface, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                                        <motion.div animate={{ width: `${charge * 100}%`, background: charge < 0.3 ? T.error : T.accent }} style={{ height: '100%' }} />
                                    </div>
                                    <span style={{ color: T.muted, fontSize: 11, fontFamily: T.mono }}>STABILITY: {Math.round(charge * 100)}%</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: T.muted, fontSize: 11, fontFamily: T.mono, display: 'block', marginBottom: 4 }}>PROPAGATION COST</span>
                                    <span style={{ color: T.warning, fontSize: 13, fontWeight: 800, fontFamily: T.mono }}>{propagationDelay}ns</span>
                                </div>
                            </div>
                        </div>
                    </AnimatePresence>
                </div>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, textTransform: 'uppercase' }}>Ambient Temperature (Heat accelerates decay)</span>
                    <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={systemTemperature}
                        onChange={(e) => setSystemTemperature(parseFloat(e.target.value))}
                        style={{ width: 200, accentColor: T.error }}
                    />
                </div>
            </div>

            {/* 2. PRIMARY SYSTEM (Center 70%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', position: 'relative' }}>
                <div style={{ width: '100%', background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden' }}>
                    {/* Prediction Overlay (REQ 3 + Confidence) */}
                    <AnimatePresence>
                        {labStage === 'prediction' && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(13, 15, 22, 0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}
                            >
                                <h3 style={{ color: predictionStatus === 'wrong' ? T.error : T.text, fontSize: 18, fontWeight: 800 }}>
                                    {predictionStatus === 'wrong' ? 'VOLTAGE MISMATCH' : 'Capture State'}
                                </h3>
                                <p style={{ color: T.muted, fontSize: 13, fontFamily: T.mono, maxWidth: 300, textAlign: 'center' }}>
                                    Before the electrons settle, what is the decimal value of these {registerWidth} bits?
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                    <input 
                                        type="text" 
                                        value={predictionValue}
                                        onChange={(e) => setPredictionValue(e.target.value)}
                                        placeholder="VALUE"
                                        style={{ background: T.surface, border: `2px solid ${T.accent}`, color: T.accent, padding: '12px 24px', borderRadius: 8, textAlign: 'center', fontFamily: T.mono, fontSize: 26, width: 140, outline: 'none' }}
                                    />
                                    
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {(['low', 'med', 'high'] as const).map(conf => (
                                            <button 
                                                key={conf}
                                                onClick={() => { setPredictionConfidence(conf); triggerHaptic('light'); }}
                                                style={{ padding: '4px 12px', background: T.surface, border: `1px solid ${useBinaryStore.getState().predictionConfidence === conf ? T.accent : T.border}`, color: T.muted, borderRadius: 4, cursor: 'pointer', fontSize: 11, fontFamily: T.mono }}
                                            >
                                                {conf.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={handleVerify} style={{ padding: '10px 24px', background: T.accent, color: T.bg, border: 'none', borderRadius: 6, fontFamily: T.mono, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                                        VALIDATE WRITE
                                    </button>
                                    <button onClick={() => setLabStage('execution')} style={{ padding: '10px 24px', background: 'transparent', border: `1px solid ${T.muted}`, color: T.muted, borderRadius: 6, fontFamily: T.mono, fontSize: 13, cursor: 'pointer' }}>
                                        ABORT
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Width selector */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
                        {WIDTHS.map(w => (
                            <button
                                key={w} onClick={() => setRegisterWidth(w)}
                                style={{
                                    padding: '4px 16px', fontFamily: T.mono, fontSize: 11, borderRadius: 4, cursor: 'pointer',
                                    background: registerWidth === w ? 'rgba(0,212,255,0.1)' : 'transparent',
                                    border: `1px solid ${registerWidth === w ? T.accent : T.border}`,
                                    color: registerWidth === w ? T.accent : T.muted
                                }}
                            >
                                {w}-BIT
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
                        {registerBits.map((bit, i) => {
                            const isDecayingLow = charge < 0.3 && bit === 1;
                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: isSystemBusy ? 0.98 : 0.95 }}
                                    onClick={() => { 
                                        if (isSystemBusy) return;
                                        toggleRegisterBit(i); 
                                        triggerHaptic('snap'); 
                                    }}
                                    animate={{ 
                                        background: bit ? 'rgba(0,212,255,0.06)' : T.surface,
                                        borderColor: isDecayed ? T.error : (bit ? `${T.accent}44` : T.border),
                                        opacity: isDecayingLow ? 0.25 : (0.5 + (charge * 0.5)),
                                        y: isDecayed ? [0, -1, 1, 0] : 0,
                                        boxShadow: bit && charge > 0.85 ? `0 0 15px ${T.accent}10` : 'none',
                                        scale: isDecayingLow ? [1, 0.96, 1] : 1
                                    }}
                                    transition={{ 
                                        y: { duration: 0.2, repeat: isDecayed ? Infinity : 0 },
                                        opacity: { duration: 0.5, repeat: isDecayingLow ? Infinity : 0 }
                                    }}
                                    style={{
                                        width: 32, height: 40, border: '2px solid', borderRadius: 4,
                                        fontFamily: T.mono, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                                        color: bit ? T.accent : T.muted,
                                        position: 'relative',
                                        filter: isDecayingLow ? 'blur(0.5px)' : 'none'
                                    }}
                                >
                                    {bit}
                                    {isLogicOverlayVisible && (
                                        <span style={{ position: 'absolute', top: -14, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: T.accent, opacity: 0.6 }}>
                                            {Math.pow(2, registerWidth - 1 - i)}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Output Conversion */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>HEXADECIMAL</span>
                            <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 800, color: T.accent }}>0x{hex}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>STORED VALUE</span>
                            <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 800, color: T.success }}>{decimal ?? '--'}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                        onClick={handleInitialWrite}
                        disabled={isWriting || (labStage === 'theory' && isStageLocked)}
                        style={{
                            padding: '16px 32px', fontFamily: T.mono, fontSize: 13, fontWeight: 900,
                            background: (isWriting || isSystemBusy) ? T.warning : T.success, border: 'none', borderRadius: 8,
                            color: T.bg, cursor: (isWriting || isSystemBusy) ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            opacity: (isWriting || isSystemBusy || charge < 0.3) ? 0.4 : 1 // Passive: Dim Write during decay
                        }}
                    >
                        <HardDrive size={14} /> {(isWriting || isSystemBusy) ? 'STABILIZING...' : 'MEMORY WRITE'}
                    </motion.button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
                        <motion.button
                            onClick={() => { refreshMemory(); triggerHaptic('light'); playSound('snap'); }}
                            animate={{ 
                                scale: charge < 0.3 ? [1, 1.1, 1] : 1,
                                boxShadow: charge < 0.3 ? `0 0 20px ${T.warning}50` : 'none',
                                borderColor: charge < 0.3 ? T.warning : T.accent
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{
                                padding: '10px 24px', fontFamily: T.mono, fontSize: 11, fontWeight: 900,
                                background: 'transparent', border: `1px solid ${T.accent}`, borderRadius: 6,
                                color: T.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <RefreshCw size={12} /> MANUAL REFRESH
                        </motion.button>
                        {charge < 0.3 && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ position: 'absolute', bottom: -35, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <span style={{ color: T.warning, fontSize: 10, fontFamily: T.mono, fontWeight: 800 }}>SILICON LEAKING! REFRESH NOW</span>
                                <span style={{ color: T.muted, fontSize: 10, fontStyle: 'italic', marginTop: 2 }}>"Charge leakage is unavoidable in real circuits"</span>
                            </motion.div>
                        )}
                        <button 
                            onClick={toggleAutoRefresh}
                            style={{ 
                                background: 'transparent', border: 'none', color: isAutoRefresh ? T.success : T.muted,
                                fontSize: 10, fontFamily: T.mono, cursor: 'pointer', textAlign: 'center'
                            }}
                        >
                            {isAutoRefresh ? 'REFRESH UNIT: ONLINE' : 'REFRESH UNIT: OFFLINE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. FEEDBACK / QUESTION */}
            <div style={{ textAlign: 'center', paddingBottom: 60 }}>
                {labStage === 'execution' && !isStageLocked && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(0,212,255,0.03)', border: `1px solid ${T.border}`, padding: 24, borderRadius: 12, maxWidth: 500, margin: '0 auto' }}>
                        <p style={{ fontSize: 16, color: T.text, marginBottom: 20, fontStyle: 'italic' }}>
                            "If Silicon memory requires energy to 'remember', what happens to information in the absence of power?"
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            {['Corruption', 'Conservation', 'Stasis'].map(ans => (
                                <button
                                    key={ans}
                                    onClick={() => {
                                        if (ans === 'Corruption') {
                                            setLabStage('complete'); playSound('success');
                                        } else {
                                            playSound('fail');
                                        }
                                    }}
                                    style={{ padding: '10px 24px', background: T.surface, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, fontFamily: T.mono, fontSize: 12, cursor: 'pointer' }}
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
                            ✓ Information is Entropy. Memory is a Cycle, not a State.
                        </p>
                        <div style={{ padding: '12px 32px', border: `1px solid ${T.success}`, borderRadius: 6, fontFamily: T.mono, fontSize: 14, fontWeight: 800, color: T.success }}>
                            READY TO COMPUTE →
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

