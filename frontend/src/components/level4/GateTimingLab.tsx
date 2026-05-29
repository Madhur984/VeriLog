import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { GATE_META, GATE_ORDER, type GateId } from '../../utils/gateMeta';
import { getGateIcon } from './GateIcons';

interface Props { onComplete: () => void; hasCompleted: boolean; isDarkMode?: boolean; }

const TICK_MS = 600;

const TIMEOUT_WAVES: Record<number, { a: boolean[], b: boolean[], target: boolean[], hint: string, solution: GateId }> = {
    1: {
        a: [false, true, false, true, true, false, false, true],
        b: [false, false, true, true, false, true, false, true],
        target: [false, false, false, true, false, false, false, true],
        hint: 'Output is high ONLY when both inputs are high.',
        solution: 'AND'
    },
    2: {
        a: [false, true, true, false, false, true, false, false],
        b: [false, false, true, true, false, false, true, false],
        target: [false, true, true, true, false, true, true, false],
        hint: 'Output is high when AT LEAST ONE input is high.',
        solution: 'OR'
    },
    3: {
        a: [false, true, false, true, false, true, false, true],
        b: [false, false, true, true, false, false, true, true],
        target: [false, true, true, false, false, true, true, false],
        hint: 'Output is high when inputs are DIFFERENT.',
        solution: 'XOR'
    },
    4: {
        a: [false, true, false, true, false, true, false, true],
        b: [false, false, true, true, false, false, true, true],
        target: [true, false, false, false, true, false, false, false],
        hint: 'Output is high ONLY when BOTH inputs are zero.',
        solution: 'NOR'
    }
};

const Waveform: React.FC<{ data: boolean[], color: string, activeIdx: number, T: any }> = ({ data, color, activeIdx, T }) => {
    return (
        <div style={{ position: 'relative', height: 40, width: '100%', display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {data.map((val, i) => {
                const isCurrent = i === activeIdx;
                const h = val ? 38 : 10;
                return (
                    <motion.div key={i}
                        animate={{
                            height: h,
                            backgroundColor: isCurrent ? color : `${color}${val ? '80' : '30'}`,
                            boxShadow: isCurrent ? `0 0 10px ${color}` : 'none'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                            flex: 1,
                            borderTopLeftRadius: 4, borderTopRightRadius: 4,
                            border: `1px solid ${isCurrent ? color : 'transparent'}`
                        }}
                    >
                        {isCurrent && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontFamily: T.mono, fontSize: 10, color }}>
                                {val ? 1 : 0}
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export const GateTimingLab: React.FC<Props> = ({ onComplete, hasCompleted, isDarkMode = true }) => {
    const T = {
        card: isDarkMode ? '#0D0F16' : '#FFFFFF', 
        surface: isDarkMode ? '#1A1D24' : '#F8FAFC', 
        border: isDarkMode ? '#222633' : '#E2E8F0',
        text: isDarkMode ? '#E5E7EB' : '#0F172A', 
        muted: isDarkMode ? '#64748B' : '#64748B', 
        accent: '#00D4FF',
        success: '#10B981', warning: '#F59E0B', error: '#EF4444',
        mono: "'JetBrains Mono', monospace",
    };

    const [level, setLevel] = useState(1);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedGate, setSelectedGate] = useState<GateId | null>(null);
    const [result, setResult] = useState<{ pass: boolean } | null>(null);

    const challenge = TIMEOUT_WAVES[level];

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setActiveIdx(idx => {
                if (idx >= challenge.a.length - 1) {
                    setIsPlaying(false);
                    verify();
                    return -1;
                }
                return idx + 1;
            });
        }, TICK_MS);
        return () => clearInterval(interval);
    }, [isPlaying, challenge, selectedGate]);

    const verify = () => {
        if (!selectedGate) { setResult({ pass: false }); return; }
        const pass = selectedGate === challenge.solution;
        setResult({ pass });
        if (pass && level === 4 && !hasCompleted) {
            onComplete();
        }
    };

    const handlePlay = () => {
        if (!selectedGate) return;
        setResult(null);
        setActiveIdx(0);
        setIsPlaying(true);
    };

    const handleNext = () => {
        if (level < 4) setLevel(l => l + 1);
        setSelectedGate(null);
        setResult(null);
        setActiveIdx(-1);
        setIsPlaying(false);
    };

    const generatedOutput = selectedGate 
        ? challenge.a.map((a, i) => GATE_META[selectedGate].evaluate([a, challenge.b[i]])) 
        : Array(8).fill(false);

    return (
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 4.5 - Timing Diagram Analyst
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Waveform Forensics</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Analyze the input signals over time. Which gate produces the target output waveform?
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
                {/* Visualizer Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
                            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                Challenge {level}/4
                            </div>
                            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>💡 {challenge.hint}</div>
                        </div>

                        {/* Input A */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginBottom: 8 }}>INPUT A (CH1)</div>
                            <div style={{ padding: '16px', background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
                                <Waveform data={challenge.a} color="#00D4FF" activeIdx={activeIdx} T={T} />
                            </div>
                        </div>

                        {/* Input B */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginBottom: 8 }}>INPUT B (CH2)</div>
                            <div style={{ padding: '16px', background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
                                <Waveform data={challenge.b} color="#F59E0B" activeIdx={activeIdx} T={T} />
                            </div>
                        </div>

                        <div style={{ height: 1, background: T.border, margin: '24px 0' }} />

                        {/* Target & Produced Output */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginBottom: 8 }}>TARGET OUTPUT (CH3)</div>
                                <div style={{ padding: '16px', background: T.surface, borderRadius: 8, border: `1px dashed ${T.success}50` }}>
                                    <Waveform data={challenge.target} color={T.success} activeIdx={activeIdx} T={T} />
                                </div>
                            </div>
                            <div style={{ opacity: selectedGate ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                                <div style={{ fontFamily: T.mono, fontSize: 10, color: selectedGate ? GATE_META[selectedGate].color : T.muted, marginBottom: 8 }}>
                                    YOUR OUTPUT {selectedGate ? `(${selectedGate})` : ''}
                                </div>
                                <div style={{ padding: '16px', background: T.surface, borderRadius: 8, border: `1px solid ${selectedGate ? GATE_META[selectedGate].color : T.border}` }}>
                                    <Waveform data={generatedOutput} color={selectedGate ? GATE_META[selectedGate].color : T.muted} activeIdx={activeIdx} T={T} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Controls Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Select Gate Match</div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].map((id) => {
                                const m = GATE_META[id as GateId];
                                const isActive = selectedGate === id;
                                return (
                                    <motion.button key={id} onClick={() => !isPlaying && setSelectedGate(id as GateId)} whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '8px 12px', flex: '1 1 40%', fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                                            letterSpacing: '0.05em', borderRadius: 8, cursor: isPlaying ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                                            background: isActive ? m.accentBg : T.surface,
                                            border: `1px solid ${isActive ? m.color : T.border}`,
                                            color: isActive ? m.color : T.muted,
                                            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center'
                                        }}>
                                        {getGateIcon(id as GateId, 16, isActive ? m.color : T.muted)} {id}
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.button onClick={handlePlay} disabled={!selectedGate || isPlaying} whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%', padding: '14px 0', fontFamily: T.mono, fontSize: 11, fontWeight: 800,
                                letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: 8,
                                background: selectedGate && !isPlaying ? `${T.accent}15` : T.surface,
                                border: `1px solid ${selectedGate && !isPlaying ? T.accent : T.border}`,
                                color: selectedGate && !isPlaying ? T.accent : T.muted,
                                cursor: selectedGate && !isPlaying ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s'
                            }}>
                            <Play size={14} /> Simulate Signals
                        </motion.button>

                    </div>

                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12,
                                    background: result.pass ? `${T.success}10` : `${T.error}10`,
                                    border: `1px solid ${result.pass ? `${T.success}50` : `${T.error}50`}`,
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {result.pass ? <CheckCircle2 size={18} color={T.success} /> : <XCircle size={18} color={T.error} />}
                                    <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: result.pass ? T.success : T.error }}>
                                        {result.pass ? 'Waveforms match! Gate identified.' : 'Waveform mismatch. Try another gate.'}
                                    </span>
                                </div>
                                {result.pass && level < 4 && (
                                    <button onClick={handleNext} style={{
                                        padding: '10px 0', borderRadius: 6, background: T.success, color: '#000',
                                        fontFamily: T.mono, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer',
                                    }}>Next Challenge →</button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
