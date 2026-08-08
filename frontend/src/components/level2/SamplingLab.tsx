import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle } from 'lucide-react';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';
import { EnhancedSlider } from '../ui/EnhancedSlider';
import { ConceptGate, ConceptLevel } from '../ui/ConceptGate';
import { CognitiveCheckpoint } from '../ui/CognitiveCheckpoint';
import { TextbookEquation } from '../ui/TextbookEquation';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { useCognitionEngine } from '../../hooks/useCognitionEngine';
import { DURATIONS, SPRINGS } from '../../constants/designTokens';
import { useSpring } from 'framer-motion';
import { usePerformanceAdapter } from '../../hooks/usePerformanceAdapter';



/**
 * SamplingLab.tsx
 * 
 * Explores the bridge between Analog and Digital.
 * Concepts: Sampling Rate, Nyquist, Aliasing, Quantization.
 */

const T = {
    bg: '#FFFFFF', card: '#F8FAFC', surface: '#F1F5F9', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0EA5E9',
    success: '#059669', error: '#DC2626', warning: '#D97706',
    sampling: '#3B82F6',
    mono: "'IBM Plex Mono', monospace"
};

const BUFFER_SIZE = 256;

export function SamplingLab({ onComplete }: { onComplete: (xp: number) => void }) {
    const { triggerHaptic } = useGlobalSensory();
    const cognition = useCognitionEngine('sampling_lab');
    const { quality } = usePerformanceAdapter();
    
    // Simulation State
    const [signalFreq, setSignalFreq] = useState(2); 
    const [samplingRate, setSamplingRate] = useState(10); 
    const [bitDepthTarget, setBitDepth] = useState(8); 
    const bitDepth = useSpring(bitDepthTarget, SPRINGS.INTERACTIVE);
    
    // Lab State
    const [isGateUnlocked, setIsGateUnlocked] = useState(false);
    const [isSweepActive, setIsSweepActive] = useState(false);
    const [isAudioLocked, setIsAudioLocked] = useState(false);
    const [pulseOpacity, setPulseOpacity] = useState(0);
    
    // Audio Resources
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    // Audio Logic
    useEffect(() => {
        if (isAudioLocked) {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;

            if (!oscRef.current && ctx) {
                oscRef.current = ctx.createOscillator();
                gainRef.current = ctx.createGain();
                if (oscRef.current && gainRef.current) {
                    oscRef.current.connect(gainRef.current);
                    gainRef.current.connect(ctx.destination);
                    oscRef.current.start();
                }
            }
            
            if (oscRef.current && ctx) {
                // Map 0-10Hz to audible 100-1000Hz for "Audio Lock"
                oscRef.current.frequency.setTargetAtTime(signalFreq * 100, ctx.currentTime, 0.05);
                gainRef.current?.gain.setTargetAtTime(0.05, ctx.currentTime, 0.1);
            }
        } else {
            const ctx = audioCtxRef.current;
            if (gainRef.current && ctx) gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        }
        return () => {
            if (oscRef.current && !isAudioLocked) {
                oscRef.current.stop();
                oscRef.current = null;
            }
        };
    }, [isAudioLocked, signalFreq]);
    
    // DELIGHT: Energy Pulse logic
    useEffect(() => {
        setPulseOpacity(1);
        const t = setTimeout(() => setPulseOpacity(0), DURATIONS.GLOW_TRAVEL * 1000);
        return () => clearTimeout(t);
    }, [signalFreq, samplingRate, bitDepth]);
    
    // Waveform Buffers
    const [analogBuffer, setAnalogBuffer] = useState(new Float32Array(BUFFER_SIZE));
    const [sampledBuffer, setSampledBuffer] = useState(new Float32Array(BUFFER_SIZE));
    
    const rafRef = useRef(0);
    const phaseRef = useRef(0);

    // ─── Simulation Loop ────────────────────────────────────────────────────
    useEffect(() => {
        const tick = () => {
            if (quality === 'low' && rafRef.current % 2 !== 0) {
                 rafRef.current++;
                 rafRef.current = requestAnimationFrame(tick);
                 return;
            }

            const newAnalog = new Float32Array(BUFFER_SIZE);
            const newSampled = new Float32Array(BUFFER_SIZE);
            
            phaseRef.current += 0.05;
            
            const sampleInterval = BUFFER_SIZE / samplingRate;
            const quantLevels = Math.pow(2, bitDepth.get());

            for (let i = 0; i < BUFFER_SIZE; i++) {
                const val = Math.sin(phaseRef.current + (i / BUFFER_SIZE) * Math.PI * 2 * signalFreq) * 0.4 + 0.5;
                newAnalog[i] = val;

                const sampleIdx = Math.floor(i / sampleInterval) * sampleInterval;
                const samplePhase = phaseRef.current + (sampleIdx / BUFFER_SIZE) * Math.PI * 2 * signalFreq;
                let sampledVal = Math.sin(samplePhase) * 0.4 + 0.5;
                sampledVal = Math.round(sampledVal * quantLevels) / quantLevels;
                newSampled[i] = sampledVal;
            }

            setAnalogBuffer(newAnalog);
            setSampledBuffer(newSampled);

            if (isSweepActive) {
                setSignalFreq(f => {
                    const next = f + 0.01;
                    if (next > 10) {
                        setIsSweepActive(false);
                        triggerHaptic('success');
                        return 10;
                    }
                    return next;
                });
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [signalFreq, samplingRate, bitDepthTarget, isSweepActive, bitDepth]);

    const NyquistLimit = signalFreq * 2;
    const isAliasing = samplingRate < NyquistLimit;

    useEffect(() => {
        if (isAliasing && isGateUnlocked) {
            triggerHaptic('warning');
        }
    }, [isAliasing, isGateUnlocked, triggerHaptic]);

    useEffect(() => {
        cognition.registerTarget('freq_slider');
        cognition.registerTarget('rate_slider');
        cognition.registerTarget('bit_slider');
    }, [cognition]);

    const handleInteraction = (id: string, val: number, setter: (v: number) => void) => {
        setter(val);
        cognition.recordInteraction(id);
    };

    const GATE_LEVELS: ConceptLevel[] = [
        {
            title: "Nyquist Theorem",
            content: "To perfectly capture a signal, you must sample it at least TWICE as fast as its highest frequency. (Rate > 2f)"
        },
        {
            title: "The Aliasing Ghost",
            content: "If you sample too slowly, high frequencies 'disguise' themselves as low frequencies. This creates 'ghost' signals that don't exist in reality."
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ 
                        background: T.card, border: `1px solid ${T.border}`,
                        borderRadius: 12, padding: 24, position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Activity size={18} color={T.sampling} />
                                <h3 style={{ margin: 0, fontFamily: T.mono, fontSize: 14 }}>SAMPLING_ENGINE_v4</h3>
                            </div>
                            {isAliasing && (
                                <motion.div 
                                    animate={{ opacity: [1, 0, 1] }}
                                    style={{ color: T.error, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: T.mono }}
                                >
                                    <AlertTriangle size={12} /> ALIASING_GHOST_DETECTED
                                </motion.div>
                            )}
                        </div>

                            <OscilloscopeCanvas 
                                ch1Samples={analogBuffer}
                                ch2Samples={sampledBuffer}
                                label1="Analog"
                                label2="Sampled"
                                height={220}
                                showGrid
                                className={isAliasing ? 'aliasing-flicker' : ''}
                            />
                            
                            {/* Causal Pulse Overlay (Invisible but felt) */}
                            <AnimatePresence>
                                {pulseOpacity > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: pulseOpacity * 0.1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ 
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: `radial-gradient(circle at 50% 50%, ${T.sampling}20, transparent)`,
                                            pointerEvents: 'none', zIndex: 1
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                    <div style={{ 
                        background: T.card, border: `1px solid ${T.border}`,
                        borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <EnhancedSlider 
                                label="SIGNAL FREQUENCY (f)"
                                value={signalFreq}
                                min={0.5} max={10} step={0.1}
                                unit="Hz"
                                color={T.accent}
                                onChange={(v) => handleInteraction('freq_slider', v, setSignalFreq)}
                            />
                            <EnhancedSlider 
                                label="SAMPLING RATE (S/s)"
                                value={samplingRate}
                                min={2} max={40} step={1}
                                unit="Hz"
                                color={T.sampling}
                                onChange={(v) => handleInteraction('rate_slider', v, setSamplingRate)}
                            />
                            <TextbookEquation
                              title="Nyquist-Shannon Sampling Theorem"
                              math="f_s \ge 2 f_{\text{max}}"
                              variables={[
                                { symbol: "f_s", name: "Sampling Rate", description: "Number of discrete samples taken per second.", unit: "Hz" },
                                { symbol: "f_{\\text{max}}", name: "Max Signal Frequency", description: "Highest frequency present in the continuous signal.", unit: "Hz" }
                              ]}
                              note={isAliasing ? "Warning: f_s < 2f_max! Aliasing ghost distortion is currently present." : "Condition satisfied: No aliasing distortion."}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <EnhancedSlider 
                                label="BIT DEPTH (Quantization)"
                                value={bitDepthTarget}
                                min={1} max={16} step={1}
                                unit="bits"
                                color={T.success}
                                onChange={(v) => handleInteraction('bit_slider', v, setBitDepth)}
                            />
                            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <button 
                                    onClick={() => setIsSweepActive(!isSweepActive)}
                                    style={{
                                        padding: '12px', background: isSweepActive ? T.error : 'rgba(15, 23, 42, 0.05)',
                                        border: `1px solid ${isSweepActive ? T.error : T.border}`,
                                        borderRadius: 6, color: isSweepActive ? '#FFF' : T.text, fontFamily: T.mono, fontSize: 10,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isSweepActive ? 'STOP_SWEEP' : 'START_SWEEP'}
                                </button>
                                <button 
                                    onClick={() => setIsAudioLocked(!isAudioLocked)}
                                    style={{
                                        padding: '12px', background: isAudioLocked ? T.accent : 'rgba(15, 23, 42, 0.05)',
                                        border: `1px solid ${isAudioLocked ? T.accent : T.border}`,
                                        borderRadius: 6, color: isAudioLocked ? '#FFF' : T.text, fontFamily: T.mono, fontSize: 10,
                                        cursor: 'pointer', fontWeight: isAudioLocked ? 700 : 400
                                    }}
                                >
                                    {isAudioLocked ? 'AUDIO_LOCKED' : 'AUDIO_LOCK'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <AnimatePresence>
                        {isGateUnlocked && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <CognitiveCheckpoint 
                                    mode={cognition.classification === 'Advanced' ? 'APPLY' : 'PREDICT'}
                                    question="What happens if the internal signal frequency exceeds the Nyquist limit?"
                                    options={[
                                        { text: 'Aliasing distorts the signal', isCorrect: true },
                                        { text: 'The signal becomes stronger', isCorrect: false },
                                        { text: 'It converts to digital faster', isCorrect: false }
                                    ]}
                                    explanation="When S/s < 2f, the sampling system cannot track the cycles fast enough, leading to mathematical ghosts."
                                    onSuccess={() => onComplete(50)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ 
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 8, padding: 16, flex: 1
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Activity size={14} color={T.muted} />
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>COGNITIVE_STATS</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <StatRow label="Classification" value={cognition.classification} />
                            <StatRow label="Stability" value={`${Math.round(cognition.predictionAccuracy * 100)}%`} />
                            <StatRow label="Exploration" value={`${Math.round(cognition.explorationScore * 100)}%`} />
                        </div>
                    </div>
                </div>
            </div>

            <ConceptGate 
                title="Nyquist & Aliasing"
                levels={GATE_LEVELS}
                isVisible={!isGateUnlocked}
                interactionRequirement={0.4}
                currentExplorationScore={cognition.explorationScore}
                onComplete={() => {
                    setIsGateUnlocked(true);
                    triggerHaptic('success');
                }}
            />
        </div>
    );
}

function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: T.mono }}>
            <span style={{ color: T.muted }}>{label}:</span>
            <span style={{ color: T.accent }}>{value}</span>
        </div>
    );
}
