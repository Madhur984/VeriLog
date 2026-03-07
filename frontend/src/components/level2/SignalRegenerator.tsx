/**
 * SignalRegenerator.tsx — Micro-Module 2.4 (Advanced)
 *
 * Demonstrates digital signal regeneration:
 *   Noisy square wave input → Digital buffer → Clean output
 *
 * Dual-channel oscilloscope: CH1=noisy input, CH2=clean output
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';

const T = {
    card: '#0D0F16', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const BUFFER_SIZE = 256;

interface SignalRegeneratorProps {
    onComplete: (xp: number) => void;
}

export function SignalRegenerator({ onComplete }: SignalRegeneratorProps) {
    const [noiseAmp, setNoiseAmp] = useState(5);
    const [complete, setComplete] = useState(false);

    const noisyRef = useRef(new Float32Array(BUFFER_SIZE));
    const cleanRef = useRef(new Float32Array(BUFFER_SIZE));
    const writeRef = useRef(0);
    const halfRef = useRef(0);
    const rafRef = useRef(0);

    // Generate both channels
    useEffect(() => {
        const PERIOD = 60;

        function tick() {
            const squareHi = halfRef.current < PERIOD / 2;
            const baseV = squareHi ? 1.0 : 0.0;

            // Noisy channel
            const u1 = Math.random() + 1e-10;
            const u2 = Math.random();
            const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const noise = gaussian * (noiseAmp / 10) * 0.22;
            const noisyV = Math.max(0, Math.min(1, baseV + noise));

            // Clean channel (threshold decision: >0.5 → 1, else → 0)
            const cleanV = noisyV > 0.5 ? 1.0 : 0.0;

            const idx = writeRef.current % BUFFER_SIZE;
            noisyRef.current[idx] = noisyV;
            cleanRef.current[idx] = cleanV;

            halfRef.current = (halfRef.current + 1) % PERIOD;
            writeRef.current++;

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [noiseAmp]);

    const handleObserved = useCallback(() => {
        setComplete(true);
        onComplete(15);
    }, [onComplete]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 24,
            }}>
                <span style={{
                    display: 'block', fontFamily: T.mono, fontSize: 8,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${T.accent}80`, marginBottom: 16,
                }}>
                    Signal Regeneration Lab — Digital Buffer
                </span>

                {/* Noise control */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontFamily: T.mono, fontSize: 8, color: T.muted,
                        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                    }}>
                        <span>Input Noise Amplitude</span>
                        <span style={{ color: T.warning }}>{noiseAmp.toFixed(1)} / 10</span>
                    </div>
                    <input
                        type="range" min={1} max={9} step={0.5} value={noiseAmp}
                        onChange={e => setNoiseAmp(Number(e.target.value))}
                        style={{ width: '100%', accentColor: T.warning, cursor: 'pointer' }}
                    />
                </div>

                {/* Pipeline diagram */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 16px', marginBottom: 20,
                    background: 'rgba(0,212,255,0.03)', borderRadius: 4,
                    border: `1px solid rgba(0,212,255,0.1)`,
                }}>
                    {[
                        { label: 'Noisy Source', color: T.warning, width: 100 },
                        { label: '→', color: T.muted, width: 20 },
                        { label: 'Digital Buffer', color: T.accent, width: 110 },
                        { label: '→', color: T.muted, width: 20 },
                        { label: 'Clean Output', color: T.success, width: 100 },
                    ].map((item, i) => (
                        <div key={i} style={{
                            fontFamily: T.mono, fontSize: item.label === '→' ? 14 : 8,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: item.color, textAlign: 'center', flexShrink: 0,
                        }}>
                            {item.label === 'Digital Buffer' ? (
                                <div style={{
                                    padding: '6px 12px', border: `1px solid ${T.accent}40`,
                                    borderRadius: 2, background: 'rgba(0,212,255,0.06)',
                                }}>
                                    {item.label}<br />
                                    <span style={{ fontSize: 7, color: T.muted }}>THRESHOLD DECISION</span>
                                </div>
                            ) : item.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dual-channel oscilloscope */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 16,
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
                }}>
                    <span style={{
                        fontFamily: T.mono, fontSize: 8, color: `${T.accent}80`,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                        Oscilloscope — Regeneration Comparison
                    </span>
                    <div style={{ display: 'flex', gap: 16, fontFamily: T.mono, fontSize: 8 }}>
                        <span style={{ color: '#00D4FF' }}>■ CH1 Noisy Input</span>
                        <span style={{ color: '#F59E0B' }}>■ CH2 Clean Output</span>
                    </div>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={noisyRef.current}
                    ch2Samples={cleanRef.current}
                    showThreshold={true}
                    thresholdLow={0.1}
                    thresholdHigh={0.5}
                    label1="CH1 Noisy"
                    label2="CH2 Clean"
                    height={200}
                />
            </div>

            {/* VoltMonkey insight */}
            <div style={{
                padding: '16px 20px',
                border: `1px solid rgba(0,212,255,0.15)`,
                borderRadius: 4, background: 'rgba(0,212,255,0.03)',
                borderLeft: `2px solid ${T.accent}`,
            }}>
                <span style={{
                    fontFamily: T.mono, fontSize: 8, color: T.accent,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                    VoltMonkey — Engineering Principle
                </span>
                <p style={{ fontFamily: T.sans, fontSize: 15, color: T.muted, marginTop: 8, lineHeight: 1.7, fontStyle: 'italic' }}>
                    "A digital buffer compares input to threshold, then drives output rail to VCC or GND.
                    Noise on the input is discarded — only the binary decision propagates.
                    This is why a digital signal can traverse thousands of kilometers through
                    repeater nodes with zero accumulated degradation."
                </p>
            </div>

            {!complete ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleObserved}
                        style={{
                            padding: '10px 24px',
                            fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            background: 'rgba(0,212,255,0.07)',
                            border: '1px solid rgba(0,212,255,0.3)',
                            borderRadius: 2, color: T.accent,
                            cursor: 'pointer',
                        }}
                    >
                        I understand regeneration →
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                        padding: '16px 20px',
                        border: `1px solid ${T.success}40`,
                        borderRadius: 4, background: `${T.success}08`,
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}
                >
                    <CheckCircle2 style={{ width: 18, height: 18, color: T.success, flexShrink: 0 }} />
                    <div>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.success, letterSpacing: '0.1em' }}>
                            MODULE 2.4 COMPLETE — ADVANCED
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2 }}>
                            +15 XP · Badge: Digital Advocate
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
