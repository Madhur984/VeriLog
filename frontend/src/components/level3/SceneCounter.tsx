/**
 * SceneCounter.tsx — Module 3.2: Binary Counting Machine
 * A 4-bit counter that animates carry propagation on each increment.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBinaryStore, selectCounterBits, Bit } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { Eye, HelpCircle, AlertTriangle } from 'lucide-react';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', warning: '#F59E0B',
    success: '#10B981', error: '#EF4444', mono: "'JetBrains Mono', monospace",
};

interface Props { onCarry: () => void; onReach8: () => void; hasReached8: boolean; }

export const SceneCounter: React.FC<Props> = ({ onCarry, onReach8, hasReached8 }) => {
    const { 
        counterValue, carryHistory, isIncrementing, increment, resetCounter, recordAction,
        predictionStatus, predictedBits, submitPrediction, startPrediction,
        isLogicOverlayVisible, toggleLogicOverlay 
    } = useBinaryStore();
    const { triggerHaptic, playSound } = useGlobalSensory();
    
    const [userGuess, setUserGuess] = useState<Bit[]>([0, 0, 0, 0]);
    const bits = useBinaryStore(selectCounterBits);
    const prevBits = useRef(bits);

    const handleIncrement = () => {
        // ALWAYS force prediction before increment (REQ 3 Elite)
        if (predictionStatus === 'idle') {
            triggerHaptic('light');
            startPrediction();
            return;
        }
        
        if (predictionStatus === 'correct') {
            increment(true);
            recordAction('interactions');
        }
    };

    const handlePredict = () => {
        submitPrediction(userGuess);
        const nextState = selectCounterBits({ counterValue: (counterValue + 1) % 16 } as any);
        if (userGuess.every((b, i) => b === nextState[i])) {
            triggerHaptic('success');
            playSound('success');
        } else {
            triggerHaptic('error');
            playSound('fail');
            recordAction('incorrectToggles');
        }
    };

    useEffect(() => {
        if (carryHistory.length > 0) onCarry();
        if (counterValue === 8 && !hasReached8) onReach8();
        // We delay updating prevBits.current until AFTER the animation has had a chance to see the change
        const timeout = setTimeout(() => {
            prevBits.current = bits;
        }, 600);
        return () => clearTimeout(timeout);
    }, [counterValue, carryHistory, bits, onCarry, onReach8, hasReached8]);

    useEffect(() => {
        if (predictionStatus === 'pending') {
            setUserGuess([...bits]);
        }
    }, [predictionStatus, bits]);

    const LOG_ENTRIES = Array.from({ length: Math.min(counterValue + 1, 8) }, (_, i) => {
        const v = counterValue - (Math.min(counterValue, 7) - i);
        return { binary: v.toString(2).padStart(4, '0'), decimal: v };
    }).reverse();

    return (
        <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            <button 
                onClick={toggleLogicOverlay}
                style={{
                    position: 'absolute', top: -40, right: 0,
                    background: isLogicOverlayVisible ? T.accent : 'transparent',
                    border: `1px solid ${T.accent}`, color: isLogicOverlayVisible ? T.bg : T.accent,
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
                    Module 3.2 — Binary Counting Machine
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>4-Bit Counter</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>Watch bits flip and carries propagate on each increment.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, position: 'relative' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
                            4-bit Register
                        </div>

                        <AnimatePresence>
                            {predictionStatus === 'pending' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    style={{ 
                                        position: 'absolute', inset: 0, zIndex: 100, 
                                        background: 'rgba(13, 15, 22, 0.95)', 
                                        borderRadius: 12, display: 'flex', flexDirection: 'column', 
                                        alignItems: 'center', justifyContent: 'center', gap: 20,
                                        border: `2px solid ${T.accent}`
                                    }}
                                >
                                    <HelpCircle size={32} color={T.accent} />
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ color: T.text, fontSize: 18, marginBottom: 4 }}>Predict Next State</h3>
                                        <p style={{ color: T.muted, fontSize: 12 }}>What will binary {counterValue} (+1) become?</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {userGuess.map((b, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => {
                                                    const next = [...userGuess];
                                                    next[i] = (b === 0 ? 1 : 0) as Bit;
                                                    setUserGuess(next);
                                                    triggerHaptic('micro');
                                                }}
                                                style={{
                                                    width: 48, height: 48, borderRadius: 8,
                                                    background: b ? T.accent : 'transparent',
                                                    border: `2px solid ${T.accent}`,
                                                    color: b ? T.bg : T.accent,
                                                    fontFamily: T.mono, fontSize: 24, fontWeight: 700,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={handlePredict}
                                        style={{
                                            padding: '10px 24px', background: T.accent, color: T.bg,
                                            border: 'none', borderRadius: 6, fontFamily: T.mono,
                                            fontSize: 12, fontWeight: 700, cursor: 'pointer'
                                        }}
                                    >
                                        VERIFY PREDICTION
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {predictionStatus === 'wrong' && !isIncrementing && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ 
                                        padding: 16, background: 'rgba(239,68,68,0.05)', 
                                        border: `1px solid ${T.error}30`, borderRadius: 8,
                                        marginTop: -10, marginBottom: 20
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.error, marginBottom: 8 }}>
                                        <AlertTriangle size={14} />
                                        <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>MISMATCH DETECTED</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 20 }}>
                                        <div>
                                            <div style={{ fontSize: 8, color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>Your Prediction</div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {predictedBits?.map((b, i) => {
                                                    const actualNext = selectCounterBits({ counterValue: (counterValue + 1) % 16 } as any);
                                                    const isWrong = b !== actualNext[i];
                                                    return (
                                                        <span key={i} style={{ 
                                                            fontFamily: T.mono, fontSize: 14, fontWeight: 700, 
                                                            color: isWrong ? T.error : T.muted,
                                                            borderBottom: isWrong ? `2px solid ${T.error}` : 'none'
                                                        }}>{b}</span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ color: T.muted, fontSize: 14, alignSelf: 'center' }}>→</div>
                                        <div>
                                            <div style={{ fontSize: 8, color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>Expected Correct</div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {selectCounterBits({ counterValue: (counterValue + 1) % 16 } as any).map((b, i) => (
                                                    <span key={i} style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 700, color: T.success }}>{b}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 11, color: T.muted, marginTop: 12, lineHeight: 1.4 }}>
                                        The carry at Bit 0 ripples through. Try to reason why the bits flip!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                            {bits.map((bit, i) => {
                                const isCarryBit = carryHistory.some(c => c.fromBit === i && Date.now() - c.timestamp < 1000);
                                const isRising = bit === 1 && prevBits.current[i] === 0;
                                const isFalling = bit === 0 && prevBits.current[i] === 1;

                                return (
                                    <React.Fragment key={i}>
                                        {i > 0 && (
                                            <div style={{ position: 'relative', width: 32, height: 2, background: 'rgba(255,255,255,0.05)', alignSelf: 'center', marginTop: 12 }}>
                                                <AnimatePresence>
                                                    {isCarryBit && (
                                                        <motion.div
                                                            initial={{ x: 38, opacity: 1, scale: 1.2 }}
                                                            animate={{ x: -18, opacity: 0.8, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.2 }}
                                                            transition={{ 
                                                                x: { duration: 0.4 + (3-i)*0.05, ease: 'linear' },
                                                                opacity: { delay: 0.3 + (3-i)*0.05, duration: 0.1 }
                                                            }}
                                                            style={{ 
                                                                position: 'absolute', top: -5, width: 12, height: 12, 
                                                                borderRadius: '50%', background: T.warning, 
                                                                boxShadow: `0 0 ${20 + (3-i)*5}px ${T.warning}`, zIndex: 10 
                                                            }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>2<sup>{3 - i}</sup></div>
                                            <div style={{ position: 'relative' }}>
                                                <AnimatePresence>
                                                    {prevBits.current[i] !== bit && (
                                                        <motion.div
                                                            initial={{ opacity: 0.3, scale: 1 }}
                                                            animate={{ opacity: 0, scale: 1.2 }}
                                                            transition={{ duration: 0.2 + (3-i)*0.1 }}
                                                            style={{
                                                                position: 'absolute', inset: 0,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontFamily: T.mono, fontSize: 36, fontWeight: 800,
                                                                color: prevBits.current[i] ? T.accent : T.muted,
                                                                pointerEvents: 'none'
                                                            }}
                                                        >
                                                            {prevBits.current[i]}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={`${i}-${bit}`}
                                                        initial={{ scale: isRising ? 1.2 : 0.8, opacity: 0 }}
                                                        animate={{ 
                                                            scale: 1, opacity: 1,
                                                            color: bit ? T.accent : T.muted,
                                                            boxShadow: isCarryBit ? `0 0 ${30 + (3-i)*10}px ${T.warning}` : 'none',
                                                            borderColor: predictionStatus === 'wrong' && predictedBits && predictedBits[i] !== bit ? T.error : (isCarryBit ? T.warning : bit ? T.accent : T.border)
                                                        }}
                                                        exit={{ scale: isFalling ? 0.8 : 1.2, opacity: 0 }}
                                                        transition={{ 
                                                            duration: 0.2 + (3-i)*0.1, // MSB (i=0) is heavier
                                                            ease: bit === 1 ? [0.4, 0, 0.2, 1] : [0.2, 0, 0.4, 1.2] 
                                                        }}
                                                        onUpdate={() => {
                                                            if (prevBits.current[i] !== bit) triggerHaptic(i === 0 ? 'heavy' : 'light');
                                                        }}
                                                        style={{
                                                            width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontFamily: T.mono, fontSize: 36, fontWeight: 800,
                                                            background: isCarryBit ? 'rgba(245,158,11,0.15)' : bit ? 'rgba(0,212,255,0.08)' : T.surface,
                                                            border: `2px solid`, borderRadius: 8
                                                        }}
                                                    >
                                                        {bit}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

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

                    <motion.button
                        onClick={handleIncrement}
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ boxShadow: `0 0 20px rgba(0,212,255,0.2)` }}
                        disabled={isIncrementing}
                        style={{
                            padding: '14px 0', fontFamily: T.mono, fontSize: 11, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            background: predictionStatus === 'correct' ? T.success : 'rgba(0,212,255,0.08)', 
                            border: `2px solid ${predictionStatus === 'correct' ? T.success : 'rgba(0,212,255,0.3)'}`,
                            borderRadius: 8, color: predictionStatus === 'correct' ? T.bg : T.accent, 
                            cursor: isIncrementing ? 'wait' : 'pointer', 
                            transition: 'all 0.2s', opacity: isIncrementing ? 0.6 : 1
                        }}
                    >
                        {isIncrementing ? '>> Propagating...' : predictionStatus === 'correct' ? 'CONFIRM TRANSITION' : '++ Increment'}
                    </motion.button>

                    <button
                        onClick={resetCounter}
                        style={{
                            padding: '10px 0', fontFamily: T.mono, fontSize: 9, 
                            color: T.muted, background: 'none', border: 'none', cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.1em'
                        }}
                    >
                        Reset Circuit
                    </button>
                </div>

                <div style={{ padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
                        State History
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
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
                </div>
            </div>

            <div style={{ marginTop: 48, padding: 20, background: 'rgba(245,158,11,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <HelpCircle size={14} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.warning, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Engineering Context: The Carry Chain
                    </span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                    In a computer, counters don't update instantly. The "Bit 1" can only flip after "Bit 0" sends it 
                    a carry signal. This is called **Propagation Delay**. If you have a 64-bit counter, the carry 
                    has to "ripple" through 64 gates, which takes time. High-performance CPUs use complex 
                    **Carry Lookahead** logic to skip the wait!
                </p>
            </div>
        </div>
    );
};
