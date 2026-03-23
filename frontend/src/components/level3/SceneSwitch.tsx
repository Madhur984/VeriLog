/**
 * SceneSwitch.tsx — Module 3.1: Discovering Binary
 * Toggle switches to produce binary digits and see voltage visualization.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, HelpCircle } from 'lucide-react';
import { useBinaryStore, selectSwitchDecimal } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981',
    warning: '#F59E0B', mono: "'JetBrains Mono', monospace",
};

interface Props { onFirstToggle: () => void; hasToggled: boolean; }

export const SceneSwitch: React.FC<Props> = ({ onFirstToggle, hasToggled }) => {
    const { 
        switchBits, switchVoltages, isSwitchTransitioning, isBitUnstable,
        toggleSwitchBit, resetSwitches, recordAction, 
        isLogicOverlayVisible, toggleLogicOverlay 
    } = useBinaryStore();
    const decimal = useBinaryStore(selectSwitchDecimal);
    const { triggerHaptic, playSound } = useGlobalSensory();

    const handleToggle = async (i: number) => {
        if (isSwitchTransitioning[i]) return;
        if (!hasToggled) onFirstToggle();
        
        // REQ 1 Elite: PRE-ACTION TENSION
        const hapticType = i === 0 ? 'heavy' : i === 1 ? 'medium' : i === 2 ? 'light' : 'micro';
        triggerHaptic(hapticType);
        playSound('snap');

        // Tiny tension window
        setTimeout(async () => {
            await toggleSwitchBit(i);
            recordAction('interactions');
        }, 15);
    };

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', position: 'relative' }}>
            {/* Logic Overlay Toggle (REQ 7) */}
            <button 
                onClick={toggleLogicOverlay}
                style={{
                    position: 'absolute', top: -40, right: 0,
                    background: isLogicOverlayVisible ? T.accent : 'transparent',
                    border: `1px solid ${T.accent}`, color: isLogicOverlayVisible ? T.bg : T.accent,
                    padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 10,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 50
                }}
            >
                <Eye size={12} />
                {isLogicOverlayVisible ? 'LOGIC VIEW: ON' : 'LOGIC VIEW: OFF'}
            </button>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Module 3.1 — Discovering Binary
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Why Two States?</h2>
                <p style={{ color: T.muted, fontSize: 14, maxWidth: 480, margin: '0 auto' }}>
                    Digital systems use voltage HIGH (1) and LOW (0). Toggle the switches below and observe binary representation.
                </p>
            </div>

            {/* Voltage legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
                {[{ label: 'GND (0V)', color: T.muted }, { label: 'THRESHOLD (2V)', color: T.warning }, { label: 'VDD (3.3V)', color: T.accent }].map(v => (
                    <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 9, color: v.color }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, opacity: 0.8 }} />
                        {v.label}
                    </div>
                ))}
            </div>

            {/* Switches */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
                {switchBits.map((bit, i) => {
                    const isTransitioning = isSwitchTransitioning[i];
                    const anyTransitioning = isSwitchTransitioning.some(t => t);
                    const shouldDim = anyTransitioning && !isTransitioning;

                    return (
                        <motion.div 
                            key={i} 
                            animate={{ opacity: shouldDim ? 0.4 : 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    Bit {3 - i}
                                </span>
                                <span style={{ fontFamily: T.mono, fontSize: 13, color: T.accent, fontWeight: 700 }}>
                                    [{Math.pow(2, 3 - i)}]
                                </span>
                            </div>

                            {/* Voltage bar */}
                            <div style={{ width: 48, height: 100, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                {/* Logic Overlay Equations (REQ 7) */}
                                <AnimatePresence>
                                    {isLogicOverlayVisible && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(10,11,16,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: T.accent, fontSize: 10, fontFamily: T.mono }}
                                        >
                                            <div style={{ opacity: 0.6 }}>Out =</div>
                                            <div style={{ fontWeight: 700 }}>{bit}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Threshold markers */}
                                <div style={{ position: 'absolute', bottom: '60.6%', left: 0, right: 0, height: 1, background: T.warning, opacity: 0.4, zIndex: 1 }} /> {/* 2.0V / 3.3V */}
                                <div style={{ position: 'absolute', bottom: '24.2%', left: 0, right: 0, height: 1, background: T.warning, opacity: 0.4, zIndex: 1 }} /> {/* 0.8V / 3.3V */}

                                <motion.div
                                    animate={{ 
                                        height: `${(switchVoltages[i] / 3.3) * 100}%`, 
                                        background: switchVoltages[i] > 2.0 ? T.accent : switchVoltages[i] > 0.8 ? T.warning : T.muted,
                                        // REQ 1: INSTABILITY JITTER
                                        x: isBitUnstable[i] ? [0, -2, 2, -2, 0] : 0,
                                        // REQ 2: MSB STRONGER GLOW
                                        boxShadow: switchVoltages[i] > 2.0 
                                            ? `0 0 ${15 + (3-i)*10}px ${T.accent}${Math.floor(0.3 * 255).toString(16)}` 
                                            : 'none'
                                    }}
                                    transition={{ 
                                        height: { 
                                            // ASYMMETRIC WEIGHT CURVES (REQ 2 Elite)
                                            type: 'tween',
                                            duration: 0.3 + (3-i)*0.08, // MSB (i=0) is significantly slower
                                            ease: bit === 1 ? [0.4, 0, 0.2, 1] : [0.2, 0, 0.4, 1.2], // Rising vs Falling (w/ overshoot)
                                        },
                                        x: { duration: 0.08, repeat: isBitUnstable[i] ? Infinity : 0 }
                                    }}
                                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.7 }}
                                />
                                
                                <div style={{ position: 'absolute', top: 4, right: 4, fontFamily: T.mono, fontSize: 8, color: T.muted, zIndex: 2 }}>
                                    {switchVoltages[i].toFixed(1)}V
                                </div>

                                {/* Status label */}
                                <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontFamily: T.mono, fontSize: 7, color: '#fff', zIndex: 2, textTransform: 'uppercase', opacity: 0.5 }}>
                                    {switchVoltages[i] > 2.0 ? 'HIGH' : switchVoltages[i] < 0.8 ? 'LOW' : 'TRANS'}
                                </div>
                            </div>

                            {/* Toggle switch */}
                            <motion.button
                                onClick={() => handleToggle(i)}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    width: 56, height: 28, borderRadius: 14, cursor: 'pointer',
                                    background: bit ? `rgba(0,212,255,0.2)` : T.surface,
                                    border: `2px solid ${bit ? T.accent : T.border}`,
                                    position: 'relative', transition: 'background 0.2s, border-color 0.2s',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Click Confidence Ripple (REQ 13 Elite) */}
                                <AnimatePresence>
                                    {isTransitioning && (
                                        <motion.div 
                                            initial={{ scale: 0, opacity: 0.4 }}
                                            animate={{ scale: 4, opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            style={{ 
                                                position: 'absolute', inset: 0, borderRadius: '50%', 
                                                background: T.accent, pointerEvents: 'none' 
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    animate={{ x: bit ? 28 : 2 }}
                                    transition={{ 
                                        type: 'spring', stiffness: 500, damping: 30,
                                        // Slight inertia effect
                                        velocity: bit ? 10 : -10
                                    }}
                                    style={{ width: 20, height: 20, borderRadius: '50%', background: bit ? T.accent : T.muted, position: 'absolute', top: 2 }}
                                />
                            </motion.button>

                            {/* Bit value */}
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={bit}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    style={{
                                        fontFamily: T.mono, fontSize: 36, fontWeight: 700,
                                        color: bit ? T.accent : T.muted,
                                        lineHeight: 1, minWidth: 36, textAlign: 'center',
                                    }}
                                >
                                    {bit}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Binary + Decimal display */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
                <div style={{ padding: '16px 32px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Binary</div>
                    <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.text, letterSpacing: '0.15em' }}>
                        {switchBits.join('')}
                    </div>
                </div>
                <div style={{ padding: '16px 32px', background: T.card, border: `1px solid rgba(0,212,255,0.2)`, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>Decimal</div>
                    <motion.div
                        key={decimal}
                        initial={{ scale: 1.15, color: T.accent }}
                        animate={{ scale: 1, color: T.text }}
                        style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800 }}
                    >
                        {decimal}
                    </motion.div>
                </div>
            </div>

            {/* Power-of-2 breakdown */}
            {hasToggled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                    {switchBits.map((bit, i) => {
                        const power = 3 - i;
                        const val = Math.pow(2, power);
                        return (
                            <React.Fragment key={i}>
                                {i > 0 && <div style={{ alignSelf: 'center', fontFamily: T.mono, fontSize: 16, color: T.muted, opacity: 0.5, margin: '0 4px' }}>+</div>}
                                <div style={{ textAlign: 'center', opacity: bit ? 1 : 0.4, transition: 'opacity 0.2s', background: bit ? 'rgba(0,212,255,0.05)' : 'transparent', padding: '4px 8px', borderRadius: 4 }}>
                                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent }}>{bit} × 2<sup>{power}</sup></div>
                                    <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: bit ? 600 : 400, color: bit ? T.text : T.muted, marginTop: 4 }}>{bit ? val : 0}</div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: T.mono, fontSize: 16, color: T.success, marginLeft: 8 }}>
                        = {decimal}
                    </div>
                </motion.div>
            )}

            <Zap size={14} style={{ color: T.muted, opacity: 0.4, margin: '0 auto', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                <button onClick={resetSwitches} style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${T.border}`, color: T.muted, padding: '6px 16px', borderRadius: 4, cursor: 'pointer' }}>
                    Reset
                </button>
            </div>
            {/* Engineering Context: Why This Matters */}
            <div style={{ marginTop: 48, padding: 20, background: 'rgba(0,212,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <HelpCircle size={14} style={{ color: T.accent }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Engineering Context: Why This Matters
                    </span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                    In physical hardware, a "1" isn't a magical symbol—it's a voltage level (usually 3.3V or 5V). 
                    Binary systems use **Threshold Logic** to filter out electrical noise. If the voltage is above 
                    roughly 70% of the maximum, it's a 1. This is why digital systems are so much more reliable 
                    than analog ones!
                </p>
            </div>
        </div>
    );
};

