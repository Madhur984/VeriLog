/**
 * SceneWhyBinary.tsx — Module 3.0: Pre-Scene
 * Grounding Binary in Physical Reality (Noise vs. Threshold).
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

interface Props { onComplete: () => void; }

export const SceneWhyBinary: React.FC<Props> = ({ onComplete }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    
    const [isThresholdOn, setIsThresholdOn] = useState(false);
    const [noise, setNoise] = useState<number[]>(Array(50).fill(2.5));
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Simulate noisy analog signal
    useEffect(() => {
        const interval = setInterval(() => {
            setNoise(prev => {
                const next = prev.slice(1);
                const last = prev[prev.length - 1];
                const target = Math.random() > 0.5 ? 4.5 : 0.5; // High or Low target
                const drift = (target - last) * 0.1 + (Math.random() - 0.5) * 1.5;
                const newer = Math.min(5, Math.max(0, last + drift));
                return [...next, newer];
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Render Waveform
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;

        // Draw Signal
        ctx.beginPath();
        ctx.strokeStyle = isThresholdOn ? T.success : T.accent;
        noise.forEach((v, i) => {
            const x = (i / noise.length) * canvas.width;
            const y = canvas.height - (v / 5) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        if (isThresholdOn) {
            // Draw result bit (0 or 1)
            ctx.beginPath();
            ctx.strokeStyle = T.success;
            ctx.lineWidth = 4;
            noise.forEach((v, i) => {
                const x = (i / noise.length) * canvas.width;
                const bit = v > 2.5 ? 1 : 0;
                const bY = canvas.height - (bit === 1 ? 0.9 : 0.1) * canvas.height;
                if (i === 0) ctx.moveTo(x, bY);
                else ctx.lineTo(x, bY);
            });
            ctx.stroke();
        }
    }, [noise, isThresholdOn]);

    const handleThreshold = () => {
        setIsThresholdOn(true);
        triggerHaptic('heavy');
        playSound('success');
    };

    return (
        <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh', paddingTop: 60, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.4em', color: T.accent, display: 'block', marginBottom: 12 }}
                >
                    3.0 — The Engineering Choice
                </motion.span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 16 }}>The Cost of Continuity</h2>
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                    <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.6 }}>
                        Analog signals are rich, but they are fragile. Every electron collision in the wire adds noise. 
                        In a world of infinite precision, truth is impossible to find.
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, position: 'relative' }}>
                <div style={{ width: '100%', height: 200, background: T.bg, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.surface}`, position: 'relative' }}>
                    <canvas ref={canvasRef} width={640} height={200} style={{ width: '100%', height: '100%' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={14} color={T.accent} />
                        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>PHYSICAL SIGNAL (V)</span>
                    </div>
                </div>

                <AnimatePresence>
                    {!isThresholdOn ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 32, textAlign: 'center' }}>
                            <p style={{ color: T.warning, fontFamily: T.mono, fontSize: 13, marginBottom: 20 }}>
                                SIGNAL CORRUPTION DETECTED. RECOVER TRUTH?
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleThreshold}
                                style={{ padding: '16px 48px', background: T.accent, color: T.bg, border: 'none', borderRadius: 12, fontFamily: T.mono, fontSize: 13, fontWeight: 900, cursor: 'pointer' }}
                            >
                                <Zap size={14} style={{ marginRight: 8, display: 'inline' }} /> APPLY THRESHOLD
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 32, textAlign: 'center' }}>
                            <p style={{ color: T.success, fontFamily: T.mono, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                                "Binary exists because reality is noisy."
                            </p>
                            <p style={{ color: T.muted, fontSize: 13, maxWidth: 400, margin: '0 auto 24px' }}>
                                By ignoring 90% of the signal and choosing only <b>0</b> and <b>1</b>, 
                                we build a machine that can never be wrong.
                            </p>
                            <button 
                                onClick={onComplete}
                                style={{ padding: '12px 32px', background: T.success, color: T.bg, border: 'none', borderRadius: 6, fontFamily: T.mono, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                            >
                                START AWAKENING →
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
