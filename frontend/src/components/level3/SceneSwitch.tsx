/**
 * SceneSwitch.tsx — Module 3.1: Discovering Binary
 * Toggle switches to produce binary digits and see voltage visualization.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useBinaryStore, selectSwitchDecimal } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { playBitTone } from '../../utils/synesthesiaEngine';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981',
    warning: '#F59E0B', mono: "'JetBrains Mono', monospace",
};

interface Props { onFirstToggle: () => void; hasToggled: boolean; }

export const SceneSwitch: React.FC<Props> = ({ onFirstToggle, hasToggled }) => {
    const { 
        bits, voltages, isBitTransitioning, isBitUnstable,
        toggleSwitchBit, recordAction, isSystemBusy,
        isLogicOverlayVisible,
        labStage, setLabStage, isStageLocked, setStageLocked,
        propagationDelay, setNavigationLocked,
        nextScene,
        systemTemperature
    } = useBinaryStore();
    const decimal = useBinaryStore(selectSwitchDecimal);
    const { triggerHaptic, playSound } = useGlobalSensory();

    // REQ 2: Metastability Monitoring
    React.useEffect(() => {
        if (isBitUnstable.some(u => u)) {
            triggerHaptic('warning');
            const timer = setInterval(() => playSound('glitch'), 200);
            return () => clearInterval(timer);
        }
    }, [isBitUnstable, triggerHaptic, playSound]);

    // Navigation Guard (Centralized Sync)
    React.useEffect(() => {
        // Allow navigation in execution or complete stages
        if (labStage === 'execution' || labStage === 'complete') setNavigationLocked(false);
        else setNavigationLocked(true);
    }, [labStage, setNavigationLocked]);


    const [idleTime, setIdleTime] = React.useState(0);
    const [showHint, setShowHint] = React.useState(false);

    // Active Guidance: Hint after 3s inactivity
    React.useEffect(() => {
        if (labStage !== 'execution') return;
        const timer = setInterval(() => setIdleTime(t => t + 1000), 1000);
        if (idleTime >= 3000 && !hasToggled) setShowHint(true);
        return () => clearInterval(timer);
    }, [labStage, idleTime, hasToggled]);

    const handleToggle = async (i: number) => {
        if (isSystemBusy || isBitTransitioning[i] || (labStage === 'theory' && isStageLocked)) {
            if (isSystemBusy) triggerHaptic('micro');
            return;
        }
        
        // INSTANT FEEDBACK LAYER (<50ms)
        triggerHaptic(i === 0 ? 'heavy' : 'light');
        playSound('snap');
        setIdleTime(0);
        setShowHint(false);

        if (!hasToggled) onFirstToggle();
        
        await toggleSwitchBit(i);
        recordAction('interactions');
        playBitTone(3-i, bits[i] === 0 ? 'high' : 'low');
        if (labStage === 'execution') setStageLocked(false);
    };

    const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '0, 212, 255';

    return (
        <div style={{ 
            width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh', paddingTop: 40,
            transition: 'filter 1.2s ease',
            filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, 0.25))` : 'none'
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
                    >                        {/* TOP: Concept */}
                        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} style={{ opacity: 1 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>MODULE 3.1</span>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Voltage is continuous, logic is discrete.</h2>
                        </motion.div>
                        
                        {/* CENTER: Visual Explanation (Noisy Voltage) */}
                        <div style={{ width: 300, height: 120, background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
                            <svg width="100%" height="100%" viewBox="0 0 300 120">
                                <motion.path 
                                    d="M 0 60 Q 25 40 50 80 T 100 60 T 150 40 T 200 80 T 250 60 T 300 40"
                                    fill="none" stroke={T.accent} strokeWidth="1"
                                    animate={{ 
                                        d: [
                                            "M 0 60 Q 25 40 50 80 T 100 60 T 150 40 T 200 80 T 250 60 T 300 40",
                                            "M 0 65 Q 25 35 50 85 T 100 55 T 150 45 T 200 75 T 250 65 T 300 35"
                                        ],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
                                />
                                <line x1="0" y1="60" x2="300" y2="60" stroke={T.accent} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                                <motion.circle 
                                    r="3" fill={T.accent}
                                    animate={{ cx: [0, 300], cy: [60, 60] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: 5, right: 10, fontSize: 10, fontFamily: T.mono, color: T.accent, opacity: 0.5 }}>THRESHOLD</div>
                        </div>

                        {/* BOTTOM: Insight & mental model */}
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                            <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 14, lineHeight: 1.6, opacity: 0.9 }}>
                                    Noise makes exact voltage unreliable in the physical world. 
                                    Digital logic ignores small fluctuations to maintain stability.
                                </p>
                                <p style={{ color: T.accent, fontSize: 14, fontWeight: 700, fontFamily: T.mono, letterSpacing: '-0.02em' }}>
                                    "Binary is a decision filter, not a simplification."
                                </p>
                                <div style={{ height: 1, width: 40, background: T.accent, opacity: 0.2, alignSelf: 'center' }} />
                                <p style={{ color: T.warning, fontSize: 12, fontWeight: 900, fontFamily: T.mono }}>
                                    NOW YOU WILL: CONVERT VOLTAGE INTO STABLE LOGIC STATES.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => { setLabStage('prediction'); triggerHaptic('success'); }}
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.4em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 12 }}
                >
                    3.1 — Voltage to Logic
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12 }}>Physical State Transition</h2>
                <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {labStage === 'prediction' && (
                            <motion.div key="predict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                <p style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>PREDICTION GATE</p>
                                <p style={{ color: T.muted, fontSize: 14 }}>If the voltage is currently 1.4V, will the machine register 0, 1, or Error?</p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {['0', '1', 'Error'].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => {
                                                if (opt === 'Error') { playSound('success'); triggerHaptic('success'); setLabStage('execution'); setStageLocked(false); }
                                                else { playSound('fail'); triggerHaptic('error'); recordAction('incorrectToggles'); }
                                            }}
                                            style={{ padding: '8px 20px', background: T.surface, border: `1px solid ${T.border}`, color: T.text, borderRadius: 4, cursor: 'pointer', fontFamily: T.mono, fontSize: 13 }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {labStage === 'execution' && (
                            <motion.div key="exec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p style={{ color: T.accent, fontSize: 15, fontFamily: T.mono, marginBottom: 8 }}>
                                    SYSTEM ACTIVE: Monitoring thresholds...
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                                    <span style={{ fontSize: 12, color: T.muted, fontFamily: T.mono }}>
                                        TOTAL COMPUTE DELAY: <span style={{ color: T.warning, fontSize: 13 }}>{propagationDelay}ns</span>
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. PRIMARY SYSTEM (Center 70%) */}
            <motion.div 
                animate={{ opacity: (labStage === 'theory' && isStageLocked) ? 0.2 : 1 }}
                style={{ display: 'flex', justifyContent: 'center', gap: 32, position: 'relative' }}
            >

                {bits.map((bit, i) => {
                    const isTransitioning = isBitTransitioning[i];
                    const isUnstable = isBitUnstable[i];
                    const anyTransitioning = isBitTransitioning.some(t => t);
                    const shouldDim = anyTransitioning && !isTransitioning;

                    return (
                        <motion.div 
                            key={i} 
                            animate={{ 
                                opacity: shouldDim ? 0.3 : 1, 
                                scale: isTransitioning ? 1.02 : 1,
                                filter: isUnstable ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))' : 'none'
                            }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
                        >
                            {/* Physical Voltage Column */}
                            <div style={{ width: 56, height: 160, background: T.card, border: `1px solid ${isUnstable ? 'rgba(239,68,68,0.3)' : T.border}`, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                                {/* Threshold Zones */}
                                <div style={{ position: 'absolute', bottom: '60.6%', left: 0, right: 0, height: 1, background: T.success, opacity: 0.15, zIndex: 5 }} />
                                <div style={{ position: 'absolute', bottom: '24.2%', left: 0, right: 0, height: 1, background: '#EF4444', opacity: 0.15, zIndex: 5 }} />
                                
                                <motion.div
                                    animate={{ 
                                        height: `${(voltages[i] / 3.3) * 100}%`, 
                                        background: voltages[i] > 2.0 ? T.success : voltages[i] > 0.8 ? T.warning : T.muted,
                                        x: isUnstable ? [0, -1, 1, 0] : 0,
                                        opacity: isUnstable ? [0.6, 1, 0.7, 1] : 0.8
                                    }}
                                    transition={{ 
                                        height: { type: 'tween', duration: 0.1 },
                                        x: { duration: 0.1, repeat: Infinity },
                                        opacity: { duration: 0.1, repeat: Infinity }
                                    }}
                                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                                />
                                <div style={{ position: 'absolute', top: 6, left: 0, right: 0, textAlign: 'center', fontFamily: T.mono, fontSize: 10, color: isUnstable ? '#EF4444' : T.muted, fontWeight: isUnstable ? 900 : 400 }}>
                                    {isUnstable ? 'ERR!' : `${voltages[i].toFixed(2)}V`}
                                </div>
                            </div>

                            {/* Tactile Toggle */}
                            <motion.button
                                onClick={() => handleToggle(i)}
                                whileHover={{ scale: isSystemBusy ? 1 : 1.05 }}
                                whileTap={{ scale: isSystemBusy ? 0.98 : 0.9 }}
                                disabled={labStage === 'theory' && isStageLocked}
                                style={{
                                    width: 60, height: 32, borderRadius: 16, cursor: isSystemBusy ? 'wait' : 'pointer',
                                    background: bit ? `rgba(0,212,255,0.08)` : T.surface,
                                    border: `2px solid ${bit ? `${T.accent}33` : T.border}`,
                                    position: 'relative',
                                    opacity: isSystemBusy ? 0.6 : 1,
                                    boxShadow: (showHint && i === 3) ? `0 0 15px ${T.accent}` : 'none' // Active Element Highlight
                                }}
                            >
                                <motion.div
                                    animate={{ 
                                        x: bit ? 30 : 2,
                                        scale: isTransitioning ? [1, 1.2, 1] : 1, // Micro-scale feedback
                                        background: isUnstable ? ['#64748B', '#EF4444', '#64748B'] : (bit ? T.accent : T.muted)
                                    }}
                                    transition={{ 
                                        x: { type: 'spring', stiffness: 500, damping: 30 },
                                        scale: { duration: 0.1 },
                                        background: { duration: 0.2, repeat: isUnstable ? Infinity : 0 }
                                    }}
                                    style={{ width: 24, height: 24, borderRadius: '50%', position: 'absolute', top: 2 }}
                                />
                                {showHint && i === 3 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        style={{ position: 'absolute', top: 40, width: 100, left: -20, color: T.accent, fontSize: 11, fontFamily: T.mono, fontWeight: 800 }}
                                    >
                                        TRY TOGGLING THIS
                                    </motion.div>
                                )}
                            </motion.button>

                            {/* Abstract Bit */}
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={bit + (isUnstable ? '_un' : '_st')}
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                    style={{ 
                                        fontFamily: T.mono, fontSize: 42, fontWeight: 900, 
                                        color: isUnstable ? '#EF4444' : (bit ? T.accent : T.muted),
                                        textShadow: isUnstable ? '0 0 10px #EF4444' : 'none'
                                    }}
                                >
                                    {isUnstable ? '?' : bit}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* 3. FEEDBACK / QUESTION (Bottom 15-20%) */}
            <motion.div 
                animate={{ opacity: (labStage === 'theory' && isStageLocked) ? 0 : 1 }}
                style={{ textAlign: 'center', paddingBottom: 60 }}
            >
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
                    <div style={{ color: T.muted, fontFamily: T.mono, fontSize: 14 }}>
                        BINARY: <span style={{ color: T.text, fontWeight: 700, letterSpacing: '0.2em' }}>{bits.join('')}</span>
                    </div>
                    <div style={{ color: T.muted, fontFamily: T.mono, fontSize: 14 }}>
                        DECIMAL: <span style={{ color: T.success, fontWeight: 700 }}>{decimal}</span>
                    </div>
                </div>

                {/* Micro Flow Guidance */}
                <AnimatePresence>
                    {labStage === 'execution' && !isStageLocked && decimal === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 20 }}>
                            <span style={{ fontSize: 12, fontFamily: T.mono, color: T.accent, opacity: 0.7 }}>NOW CONVERT VOLTAGE INTO LOGIC</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {labStage === 'execution' && !isStageLocked && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(245,158,11,0.05)', border: `1px solid ${T.warning}30`, padding: 20, borderRadius: 12, maxWidth: 400, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                            <HelpCircle size={14} color={T.warning} />
                            <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 800, color: T.warning, textTransform: 'uppercase' }}>Analytic Question</span>
                        </div>
                        <p style={{ fontSize: 14, color: T.text, marginBottom: 16 }}>If you set all bits to HIGH, what is the maximum value for 4 bits?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            {[15, 16, 8].map(ans => (
                                <button
                                    key={ans}
                                    onClick={() => {
                                        if (ans === 15) {
                                            playSound('success');
                                            triggerHaptic('success');
                                            setLabStage('complete');
                                        } else {
                                            playSound('fail');
                                            triggerHaptic('error');
                                            recordAction('incorrectToggles');
                                        }
                                    }}
                                    style={{ padding: '6px 16px', background: T.surface, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 4, fontFamily: T.mono, fontSize: 12, cursor: 'pointer' }}
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {labStage === 'complete' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <p style={{ color: T.success, fontFamily: T.mono, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                            ✓ Concepts Captured. Reality Digitized.
                        </p>
                        <div style={{ padding: '12px 32px', border: `1px solid ${T.success}`, borderRadius: 6, fontFamily: T.mono, fontSize: 14, fontWeight: 800, color: T.success, letterSpacing: '0.1em', display: 'inline-block' }}>
                            LAB INITIALIZED →
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Subtle Engineering Sidebar (Optional/Dimmed) */}
            {isLogicOverlayVisible && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ position: 'absolute', right: -120, top: '50%', transform: 'translateY(-50%)', width: 100, color: T.muted, fontSize: 11, fontFamily: T.mono, borderLeft: `1px solid ${T.border}`, paddingLeft: 12 }}
                >
                    <div style={{ marginBottom: 12 }}>THRESHOLD</div>
                    <div>{'>'} 2.0V = 1</div>
                    <div style={{ marginBottom: 12 }}>{'<'} 0.8V = 0</div>
                    <div style={{ color: T.warning }}>0.8 - 2.0V = INDETERMINATE</div>
                </motion.div>
            )}
        </div>
    );
};

