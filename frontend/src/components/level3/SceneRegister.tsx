/**
 * SceneRegister.tsx — Module 3.3: Bits in Memory
 * An 8-bit editable register with hex display and width selector.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Eye, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { useBinaryStore, selectRegisterHex, Bit } from '../../stores/binaryStore';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
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
        registerBits, registerWidth, storedValue, isWriting, lastRefreshTime, isDecayed,
        toggleRegisterBit, setRegisterWidth, storeValue, resetRegister, refreshMemory,
        recordAction, isLogicOverlayVisible, toggleLogicOverlay 
    } = useBinaryStore();

    const { triggerHaptic, playSound } = useGlobalSensory();
    const hex = useBinaryStore(selectRegisterHex);
    const decimal = storedValue !== null ? storedValue : 0;

    const [charge, setCharge] = useState(1);

    // REQ 5 Elite: ORGANIC JITTER & SEQUENCE (REQ 5)
    const [flickerBits, setFlickerBits] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const age = Date.now() - lastRefreshTime;
            const newCharge = Math.max(0, 1 - age / 15000); // 15s total life
            setCharge(newCharge);

            if (newCharge === 0 && !isDecayed && registerBits.some(b => b === 1)) {
                // Bit corruption!
                playSound('fail');
                triggerHaptic('heavy');
                useBinaryStore.setState(s => {
                    const next = s.registerBits.map(b => Math.random() > 0.7 ? (b === 0 ? 1 : 0) : b) as Bit[];
                    return { registerBits: next, isDecayed: true };
                });
            }
        }, 100);
        return () => clearInterval(interval);
    }, [lastRefreshTime, isDecayed, registerBits, playSound, triggerHaptic]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const runFlicker = () => {
            if (isWriting) {
                setFlickerBits(registerBits.map(() => Math.random() > 0.5 ? 1 : 0));
                triggerHaptic('micro');
                // Organic Jitter: Vary interval slightly (60-120ms)
                const nextDelay = 60 + Math.random() * 60;
                timeout = setTimeout(runFlicker, nextDelay);
            } else {
                setFlickerBits([]);
            }
        };

        if (isWriting) {
            playSound('tension');
            runFlicker();
        }

        return () => clearTimeout(timeout);
    }, [isWriting, registerBits, playSound, triggerHaptic]);

    const handleStoreValue = async () => {
        await storeValue();
        if (onStore) onStore();
        recordAction('interactions');
        playSound('success');
        triggerHaptic('success');
    };

    const handleToggle = (i: number) => {
        toggleRegisterBit(i);
        recordAction('interactions');
        triggerHaptic('snap');
    };

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
                    Module 3.3 — Bits in Memory
                </span>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>Inside a CPU Register</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>Click bits to toggle. Observe how binary maps to hex and decimal values.</p>
            </div>

            {/* Width selector (REQ 11 Elite: Attention Lock) */}
            <motion.div 
                animate={{ opacity: isWriting ? 0.3 : 1 }}
                style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}
            >
                {WIDTHS.map(w => (
                    <button
                        key={w}
                        onClick={() => {
                            setRegisterWidth(w);
                            triggerHaptic('light');
                        }}
                        style={{
                            padding: '6px 20px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: 4, cursor: 'pointer',
                            background: registerWidth === w ? 'rgba(0,212,255,0.12)' : 'transparent',
                            border: `1px solid ${registerWidth === w ? T.accent : T.border}`,
                            color: registerWidth === w ? T.accent : T.muted,
                            transition: 'all 0.18s',
                        }}
                    >
                        {w}-bit
                    </button>
                ))}
            </motion.div>

            {/* Register visual */}
            <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 24, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <HardDrive size={14} style={{ color: T.accent }} />
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        {registerWidth}-Bit Register (R0)
                    </span>
                    {isWriting && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: T.warning, fontFamily: T.mono, fontSize: 8 }}
                        >
                            <RefreshCw size={10} className="animate-spin" />
                            Stabilizing CMOS Gates...
                        </motion.div>
                    )}
                </div>

                {/* Bits Display */}
                <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                        {registerBits.map((bit, i) => {
                            const isNewNibble = i > 0 && i % 4 === 0;
                            const displayBit = isWriting ? flickerBits[i] ?? bit : bit;
                            return (
                                <React.Fragment key={i}>
                                    {isNewNibble && <div style={{ width: 16 }} />} 
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleToggle(i)}
                                        animate={{ 
                                            background: isWriting ? ['rgba(245,158,11,0.05)', 'rgba(245,158,11,0.15)', 'rgba(245,158,11,0.05)'] : bit ? 'rgba(0,212,255,0.08)' : T.surface,
                                            borderColor: isWriting ? T.warning : bit ? T.accent : T.border,
                                            scale: isWriting ? [1, 1.05, 0.95, 1] : 1,
                                            rotate: isWriting ? [0, -1, 1, 0] : 0 // Micro-flicker movement
                                        }}
                                        transition={{ 
                                            duration: isWriting ? 0.15 : 0.2, 
                                            repeat: isWriting ? Infinity : 0,
                                            repeatType: 'reverse'
                                        }}
                                        style={{
                                            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: T.mono, fontSize: 20, fontWeight: 700,
                                            border: `2px solid`,
                                            borderRadius: 6, cursor: isWriting ? 'wait' : 'pointer', color: bit ? T.accent : T.muted,
                                            position: 'relative'
                                        }}
                                        disabled={isWriting}
                                    >
                                        {displayBit}
                                        {isLogicOverlayVisible && (
                                            <div style={{ position: 'absolute', top: -14, fontSize: 6, color: T.muted }}>
                                                {bit ? 'SET' : 'CLR'}
                                            </div>
                                        )}
                                    </motion.button>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Logic Overlay Equations (REQ 7) */}
                <AnimatePresence>
                    {isLogicOverlayVisible && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ marginTop: 12, padding: 12, background: 'rgba(0,212,255,0.03)', border: `1px solid rgba(0,212,255,0.1)`, borderRadius: 6, fontFamily: T.mono, fontSize: 9, color: T.accent }}
                        >
                            <div style={{ opacity: 0.6, marginBottom: 4 }}>D-Flip-Flop Logic:</div>
                            Q<sub>next</sub> = (D & WE) | (Q & !WE)
                            <div style={{ marginTop: 4, color: T.muted, fontSize: 8 }}>WE (Write Enable) active during store operation.</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Value displays (REQ 11 Elite: Attention Lock) */}
            <motion.div 
                animate={{ opacity: isWriting ? 0.4 : 1 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}
            >
                {[
                    { label: 'Binary', val: registerBits.join(''), color: T.text },
                    { label: 'Hexadecimal', val: `0x${hex}`, color: T.accent },
                    { label: 'Decimal', val: String(decimal), color: T.success },
                ].map(d => (
                    <div key={d.label} style={{ padding: '14px 16px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 6 }}>{d.label}</div>
                        <motion.div key={d.val} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, color: d.color, letterSpacing: '0.08em' }}>
                            {d.val}
                        </motion.div>
                    </div>
                ))}
            </motion.div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
                    <motion.button
                        onClick={handleStoreValue}
                        disabled={isWriting}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: '16px 0', fontFamily: T.mono, fontSize: 13, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            background: isWriting ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                            border: `2px solid ${isWriting ? T.warning : T.success}`,
                            borderRadius: 8, color: isWriting ? T.warning : T.success, 
                            cursor: isWriting ? 'wait' : 'pointer'
                        }}
                    >
                        {isWriting ? 'STABILIZING...' : 'MEMORY WRITE'}
                    </motion.button>
                    
                    {/* Stabilization Bar (REQ 5) */}
                    <div style={{ height: 2, background: T.surface, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
                        <AnimatePresence>
                            {isWriting && (
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.2, ease: 'linear' }}
                                    style={{ height: '100%', background: T.warning, boxShadow: `0 0 8px ${T.warning}` }}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 140 }}>
                    <motion.button
                        onClick={() => {
                            refreshMemory();
                            triggerHaptic('light');
                            playSound('snap');
                        }}
                        style={{
                            height: 54, padding: '0 12px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            background: charge < 0.3 ? 'rgba(245,158,11,0.1)' : 'transparent',
                            border: `2px solid ${charge < 0.3 ? T.warning : T.border}`,
                            borderRadius: 8, color: charge < 0.3 ? T.warning : T.muted,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                    >
                        <RefreshCw size={12} className={charge < 0.2 ? 'animate-spin-slow' : ''} />
                        REFRESH
                    </motion.button>
                    <div style={{ height: 2, background: T.surface, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
                        <motion.div
                            animate={{ width: `${charge * 100}%`, background: charge < 0.3 ? T.warning : T.accent }}
                            style={{ height: '100%' }}
                        />
                    </div>
                </div>

                <button onClick={resetRegister} style={{ height: 54, padding: '0 24px', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, cursor: 'pointer' }}>
                    Clear
                </button>
            </div>

            {/* Stored confirmation */}
            <AnimatePresence>
                {storedValue !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ marginTop: 16, textAlign: 'center', fontFamily: T.mono, fontSize: 11, color: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                        <CheckCircle2 size={12} />
                        Value 0x{storedValue.toString(16).toUpperCase().padStart(2, '0')} Locked in R0 Silicon
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Engineering Context: Why This Matters */}
            <div style={{ marginTop: 48, padding: 20, background: 'rgba(0,212,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <HelpCircle size={14} style={{ color: T.accent }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Engineering Context: Silicon Memory
                    </span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                    Registers are the fastest memory in your computer. They are built using **Flip-Flops**—circuits 
                    that use feedback loops to "lock" a value in place. However, they are **volatile**; if 
                    the power goes out, the feedback loop breaks and the data is lost forever. This is why 
                    we need hard drives for long-term storage!
                </p>
            </div>
        </div>
    );
};

