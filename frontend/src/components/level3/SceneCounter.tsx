/**
 * SceneCounter.tsx - Module 3.2: Binary Counting Machine
 * A 4-bit counter that animates carry propagation on each increment.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBinaryStore, selectCounterBits, Bit } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { playBitTone } from '../../utils/synesthesiaEngine';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { KineticTraces, TracePath } from './KineticTraces';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', warning: '#F59E0B',
    success: '#10B981', error: '#EF4444', mono: "'JetBrains Mono', monospace",
};

interface Props { onCarry: () => void; onReach8: () => void; hasReached8: boolean; }

export const SceneCounter: React.FC<Props> = ({ onCarry, onReach8, hasReached8 }) => {
    const counterValue = useBinaryStore(s => s.counterValue);
    const carryHistory = useBinaryStore(s => s.carryHistory);
    const isIncrementing = useBinaryStore(s => s.isIncrementing);
    const increment = useBinaryStore(s => s.increment);
    const recordAction = useBinaryStore(s => s.recordAction);
    const isSystemBusy = useBinaryStore(s => s.isSystemBusy);
    const predictionStatus = useBinaryStore(s => s.predictionStatus);
    const submitPrediction = useBinaryStore(s => s.submitPrediction);
    const startPrediction = useBinaryStore(s => s.startPrediction);
    const pulseHistory = useBinaryStore(s => s.pulseHistory);
    const labStage = useBinaryStore(s => s.labStage);
    const setLabStage = useBinaryStore(s => s.setLabStage);
    const isStageLocked = useBinaryStore(s => s.isStageLocked);
    const setStageLocked = useBinaryStore(s => s.setStageLocked);
    const setNavigationLocked = useBinaryStore(s => s.setNavigationLocked);
    const isLogicOverlayVisible = useBinaryStore(s => s.isLogicOverlayVisible);
    const resetCounter = useBinaryStore(s => s.resetCounter);
    const isSlowMotion = useBinaryStore(s => s.isSlowMotion);
    const setSlowMotion = useBinaryStore(s => s.setSlowMotion);
    const bits = useBinaryStore(s => s.bits);
    const propagationDelay = useBinaryStore(s => s.propagationDelay);
    const systemTemperature = useBinaryStore(s => s.systemTemperature);
    const nextScene = useBinaryStore(s => s.nextScene);
    const prevBits = useRef(bits);

    const { triggerHaptic, playSound } = useGlobalSensory();
    const [userGuess, setUserGuess] = useState<Bit[]>([0, 0, 0, 0]);
    const [errorSimBits, setErrorSimBits] = useState<Bit[] | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const tracePaths = React.useMemo<TracePath[]>(() => {
        return pulseHistory.filter(p => p.type === 'carry' && Date.now() - p.timestamp < 1000).map((p, i) => ({
            id: `counter-trace-${i}`,
            from: { x: (3 - p.targetIndex) * 92 + 100, y: 100 }, 
            to: { x: (3 - p.targetIndex - 1) * 92 + 100, y: 100 },
            active: true,
            color: '#F59E0B'
        }));
    }, [pulseHistory]);

    useEffect(() => {
        if (labStage === 'execution' || labStage === 'complete') setNavigationLocked(false);
        else setNavigationLocked(true);
    }, [labStage, setNavigationLocked]);

    const handlePredict = async () => {
        const nextReal = (counterValue + 1) % 16;
        const actualBits = selectCounterBits({ counterValue: nextReal } as any);
        const isCorrect = userGuess.every((b: Bit, i: number) => b === actualBits[i]);

        submitPrediction(userGuess);

        if (isCorrect) {
            triggerHaptic('success');
            playSound('success');
        } else {
            triggerHaptic('error');
            playSound('fail');
            recordAction('incorrectToggles');
            
            // WRONG PREDICTION FLOW (FINAL)
            // 1. Show correct ripple (slow)
            setSlowMotion(true);
            setErrorSimBits(null); 
            await increment(true); // Run the actual correct increment in slow motion
            setSlowMotion(false);

            // 2. Show hint (1 line) + slight pause
            setShowHint(true);
            await new Promise(r => setTimeout(r, 800)); // Visible hint time
            
            // 3. Reset system after slight pause (300ms)
            await new Promise(r => setTimeout(r, 300));
            resetCounter(); 
            setShowHint(false);
        }
    };

    const [idleTime, setIdleTime] = useState(0);
    const [showHint, setShowHint] = useState(false);

    // Active Guidance: Hint after 3s inactivity
    useEffect(() => {
        if (labStage !== 'execution' || isStageLocked) return;
        const timer = setInterval(() => setIdleTime(t => t + 1000), 1000);
        if (idleTime >= 3000 && counterValue === 0) setShowHint(true);
        return () => clearInterval(timer);
    }, [labStage, isStageLocked, idleTime, counterValue]);

    async function handleIncrement() {
        if (isSystemBusy || isIncrementing || (labStage === 'theory' && isStageLocked)) {
            if (isSystemBusy || isIncrementing) triggerHaptic('impact' as any);
            return;
        }
        
        // INSTANT FEEDBACK LAYER (<50ms)
        triggerHaptic('light');
        setIdleTime(0);
        setShowHint(false);

        if (predictionStatus === 'idle') {
            setUserGuess([...bits]);
            startPrediction();
            return;
        }
        
        if (predictionStatus === 'correct') {
            await increment(true);
            recordAction('interactions');
            playBitTone(0, 'low');
            if (labStage === 'execution') setStageLocked(false);
        }
    }

    // REQ: Precise carry-event detection (Stable effect)
    const lastCarryTimestamp = useRef(0);
    useEffect(() => {
        if (carryHistory.length > 0) {
            const last = carryHistory[carryHistory.length - 1];
            if (last.timestamp > lastCarryTimestamp.current) {
                lastCarryTimestamp.current = last.timestamp;
                onCarry();
            }
        }
    }, [carryHistory, onCarry]);

    useEffect(() => {
        if (counterValue === 8 && !hasReached8) onReach8();
    }, [counterValue, hasReached8, onReach8]);

    useEffect(() => {
        const timeout = setTimeout(() => { prevBits.current = bits; }, 800);
        return () => clearTimeout(timeout);
    }, [bits]);

    useEffect(() => {
        if (predictionStatus === 'pending') setUserGuess([...bits]);
    }, [predictionStatus, bits]);

    const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '0, 212, 255';

    return (
        <div style={{ 
            width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh', paddingTop: 40,
            transition: 'filter 1.2s ease',
            filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, 0.25))` : 'none'
        }}>            {/* 1. THEORY-FIRST OVERLAY (SEE -> CONNECT -> DO) */}
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
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>MODULE 3.2</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Counting propagates from right to left.</h2>
                        </motion.div>

                        {/* CENTER: Visual Explanation (Ripple Carry) */}
                        <div style={{ width: 320, height: 120, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
                            {[0, 1, 1, 1].map((b, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ background: T.surface }}
                                    animate={{ 
                                        background: i > 0 ? T.accent : T.surface,
                                        scale: [1, 1.1, 1],
                                        boxShadow: i === 3 ? [`0 0 0px ${T.accent}`, `0 0 20px ${T.accent}`, `0 0 0px ${T.accent}`] : 'none'
                                    }}
                                    transition={{ 
                                        delay: i * 0.4,
                                        scale: { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
                                    }}
                                    style={{ width: 40, height: 60, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 24, fontWeight: 900, color: i > 0 ? T.bg : T.muted, border: i === 3 ? `2px solid ${T.accent}` : `1px solid ${T.border}` }}
                                >
                                    {b}
                                </motion.div>
                            ))}
                        </div>

                        {/* BOTTOM: Deep Theory */}
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 450 }}>
                                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                                    Each bit waits for the previous one to overflow. 
                                    This chain reaction, called Ripple Carry, is the physical speed-limit of hardware.
                                </p>
                                <p style={{ color: T.accent, fontSize: 15, fontWeight: 700, fontFamily: T.mono, letterSpacing: '-0.02em' }}>
                                    "Counting is a chain reaction, not a jump."
                                </p>
                                <div style={{ height: 1, width: 40, background: T.accent, opacity: 0.2, alignSelf: 'center' }} />
                                <p style={{ color: T.warning, fontSize: 12, fontWeight: 900, fontFamily: T.mono }}>
                                    NOW YOU WILL: OBSERVE HOW CARRY MOVES THROUGH BITS.
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
                    3.2 - The Carry Chain
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12 }}>Sequential Logic</h2>
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <p style={{ color: T.accent, fontSize: 15, fontFamily: T.mono, marginBottom: 8 }}>
                                PULSE DETECTOR: {isIncrementing ? 'Tracking carries...' : 'Awaiting trigger...'}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                                <span style={{ fontSize: 12, color: T.muted, fontFamily: T.mono }}>
                                    TOTAL COMPUTE DELAY: <span style={{ color: T.warning }}>{propagationDelay}ns</span>
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. PRIMARY SYSTEM (Center 70%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
                <div ref={containerRef} style={{ position: 'relative', padding: 40, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, width: '100%', overflow: 'hidden' }}>
                    <KineticTraces paths={tracePaths} containerRef={containerRef} />
                    {/* Prediction Overlay (REQ 3) */}
                    <AnimatePresence>
                        {predictionStatus === 'pending' && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(13, 15, 22, 0.98)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ color: T.text, fontSize: 20, marginBottom: 8, fontWeight: 800 }}>Predict the Ripple</h3>
                                    <p style={{ color: T.muted, fontSize: 14, fontFamily: T.mono }}>{counterValue} + 1 = ?</p>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {userGuess.map((b, i) => (
                                        <button 
                                            key={i} onClick={() => {
                                                const next = [...userGuess];
                                                next[i] = (b === 0 ? 1 : 0) as Bit;
                                                setUserGuess(next);
                                                triggerHaptic('micro');
                                            }}
                                            style={{
                                                width: 56, height: 64, borderRadius: 8, background: b ? T.accent : T.surface, border: `2px solid ${T.accent}`,
                                                color: b ? T.bg : T.accent, fontFamily: T.mono, fontSize: 28, fontWeight: 900, cursor: 'pointer'
                                            }}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handlePredict} style={{ padding: '12px 32px', background: T.accent, color: T.bg, border: 'none', borderRadius: 6, fontFamily: T.mono, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                                    VERIFY STATE
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Standardized Bit Display */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
                        {(errorSimBits || bits).map((bit: Bit, i: number) => {
                            const hasPulse = pulseHistory.some(p => p.type === 'carry' && p.targetIndex === i && Date.now() - p.timestamp < 1000);
                            const isErrorState = errorSimBits !== null;
                            const isCurrentFocus = i === 3 && counterValue === 0;

                            return (
                                <motion.div 
                                    key={i}
                                    animate={{ 
                                        scale: (isIncrementing && bits[i] !== prevBits.current[i]) || isCurrentFocus ? 1.08 : 1,
                                        boxShadow: hasPulse ? `0 0 35px ${T.warning}40` : (isErrorState ? `0 0 15px ${T.error}10` : (isCurrentFocus ? `0 0 20px ${T.accent}50` : 'none')),
                                        borderColor: isErrorState ? `${T.error}80` : (hasPulse ? T.warning : (bit ? `${T.accent}80` : (isCurrentFocus ? T.accent : T.border))),
                                        background: isCurrentFocus ? `rgba(0,212,255,0.05)` : T.surface,
                                        opacity: (!isIncrementing && counterValue === 0 && i !== 3 && labStage !== 'complete') ? 0.3 : 1 
                                    }}
                                    style={{ 
                                        width: 80, height: 100, background: T.surface, border: `2px solid`, borderRadius: 12,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>2<sup>{3-i}</sup></span>
                                    <span style={{ 
                                        fontFamily: T.mono, fontSize: 48, fontWeight: 900, 
                                        color: isErrorState ? T.error : (bit ? T.accent : T.muted) 
                                    }}>
                                        {bit}
                                    </span>
                                    {/* Engineering Overlay: Carry Logic Link */}
                                    {isLogicOverlayVisible && i < 3 && (
                                        <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', alignItems: 'center' }}>
                                            <motion.div 
                                               animate={{ opacity: hasPulse ? 1 : 0.4, scale: hasPulse ? 1.2 : 1 }}
                                               style={{ width: 14, height: 14, borderRadius: '50%', background: T.warning, border: `1px solid ${T.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.bg }} />
                                            </motion.div>
                                            <div style={{ height: 1, width: 12, background: T.warning, opacity: 0.3 }} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div style={{ textAlign: 'center', borderTop: `1px solid ${T.border}`, paddingTop: 24, position: 'relative' }}>
                        {/* Micro-flow guidance & Inline Theory */}
                        <AnimatePresence>
                            {(isIncrementing || isSlowMotion) && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{ position: 'absolute', top: -35, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                >
                                    <span style={{ color: isSlowMotion ? T.warning : T.accent, fontSize: 12, fontFamily: T.mono, fontWeight: 800, letterSpacing: '0.1em' }}>
                                        {isSlowMotion ? '⚠️ SLOW-MOTION CORRECTIVE RIPPLE' : 'CORE PROPAGATION ACTIVE'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <span style={{ fontFamily: T.mono, fontSize: 14, color: T.muted }}>DECIMAL EQUIVALENT: </span>
                        <motion.span key={counterValue} animate={{ scale: [1.2, 1] }} style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.success }}>
                            {counterValue}
                        </motion.span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <motion.button
                        onClick={handleIncrement}
                        disabled={isSystemBusy || isIncrementing || (labStage === 'theory' && isStageLocked)}
                        whileHover={{ scale: (isSystemBusy || isIncrementing) ? 1 : 1.05 }}
                        whileTap={{ scale: (isSystemBusy || isIncrementing) ? 0.98 : 0.95 }}
                        style={{
                            padding: '16px 48px', fontFamily: T.mono, fontSize: 14, fontWeight: 900, letterSpacing: '0.2em',
                            background: predictionStatus === 'correct' ? T.success : 'transparent',
                            border: `2px solid ${predictionStatus === 'correct' ? T.success : T.accent}`,
                            borderRadius: 8, color: predictionStatus === 'correct' ? T.bg : T.accent,
                            cursor: (isSystemBusy || isIncrementing) ? 'wait' : 'pointer', 
                            opacity: (isSystemBusy || isIncrementing) ? 0.6 : 1,
                            boxShadow: showHint ? `0 0 20px ${T.accent}40` : 'none',
                            position: 'relative', minWidth: 260
                        }}
                    >
                        {(isSystemBusy || isIncrementing) ? 'PROPAGATING...' : predictionStatus === 'correct' ? 'EXECUTE UPDATE' : '++ INCREMENT'}
                        <AnimatePresence>
                            {showHint && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{ position: 'absolute', bottom: -35, left: 0, right: 0, color: T.accent, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                >
                                    WATCH HOW CARRY MOVES
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <motion.button
                        onClick={() => { resetCounter(); triggerHaptic('heavy'); playSound('fail'); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '16px 24px', fontFamily: T.mono, fontSize: 12, fontWeight: 900,
                            background: 'transparent', border: `1px solid ${T.error}44`,
                            borderRadius: 8, color: T.error, opacity: 0.6, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8
                        }}
                    >
                        <RefreshCcw size={14} /> RESET SYSTEM
                    </motion.button>
                </div>
            </div>

            {/* 3. FEEDBACK / QUESTION */}
            <div style={{ textAlign: 'center', paddingBottom: 60 }}>
                {counterValue === 15 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(239,68,68,0.05)', border: `1px solid ${T.error}30`, padding: 24, borderRadius: 12, maxWidth: 500, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                            <AlertTriangle size={16} color={T.error} />
                            <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 800, color: T.error, textTransform: 'uppercase' }}>Engineering Reality: Overflow</span>
                        </div>
                        <p style={{ fontSize: 14, color: T.text, marginBottom: 16 }}>
                            A 4-bit counter has a finite depth. What happens to the carry signal when you add 1 to 1111 (15)?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            {['Destroyed', 'Stored', 'Sent to Bit 4'].map(ans => (
                                <button
                                    key={ans}
                                    onClick={() => {
                                        if (ans === 'Sent to Bit 4') {
                                            playSound('success'); triggerHaptic('success'); setLabStage('complete');
                                        } else {
                                            playSound('fail'); triggerHaptic('error');
                                        }
                                    }}
                                    style={{ padding: '8px 20px', background: T.surface, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 6, fontFamily: T.mono, fontSize: 13, cursor: 'pointer' }}
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {labStage === 'complete' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 24 }}>
                        <p style={{ color: T.success, fontFamily: T.mono, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                            ✓ Overflow Understood. The Ripple effect is the speed-limit of physics.
                        </p>
                        <div style={{ padding: '12px 32px', border: `1px solid ${T.success}`, borderRadius: 6, fontFamily: T.mono, fontSize: 14, fontWeight: 800, color: T.success }}>
                            OVERFLOW MODE COMPLETE →
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
