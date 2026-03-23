/**
 * NoiseExperiment.tsx — Micro-Module 2.3
 *
 * Side-by-side comparison: Analog vs Digital under noise.
 *
 * Layout:
 *   [Noise Slider — shared]
 *   [Analog Circuit] [Digital Circuit]
 *   [Dual-channel Oscilloscope]
 *   [Interactive Concept Table]
 *   [Scenario Classification Quiz]
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAnalogSignal } from '../../hooks/useAnalogSignal';
import { useDigitalSignal } from '../../hooks/useDigitalSignal';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { VeriSlider } from '../shared/VeriSlider';
import { VeriButton } from '../shared/VeriButton';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', error: '#EF4444', warning: '#F59E0B',
    analog: '#A78BFA', digital: '#34D399',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const CONCEPT_ROWS = [
    {
        concept: 'Resolution',
        analog: 'Infinite — any value in range',
        digital: '2 levels: HIGH or LOW',
        insight: 'A 12-bit ADC divides the analog range into 4096 discrete levels. More bits → finer resolution.',
    },
    {
        concept: 'Noise Immunity',
        analog: 'Low — noise directly corrupts value',
        digital: 'High — noise margin absorbs interference',
        insight: 'Digital noise margin = V_OH_min − V_IH. Any noise below this is rejected entirely.',
    },
    {
        concept: 'Storage',
        analog: 'Degrades over time (tape, vinyl)',
        digital: 'Perfect indefinitely (bit is a bit)',
        insight: 'A bit stored on flash memory 10 years ago is identical when read today. Analog tape loses fidelity every decade.',
    },
    {
        concept: 'Long-Distance',
        analog: 'Signal attenuates and accumulates noise',
        digital: 'Repeaters regenerate perfect copies',
        insight: 'Transatlantic fiber cables contain repeater stations every 80km, each regenerating the digital signal to perfection.',
    },
    {
        concept: 'Processing',
        analog: 'Requires op-amps, continuous circuits',
        digital: 'Logic gates — fast, dense, scalable',
        insight: 'A modern CPU performs 10^10 operations/sec using transistors as digital switches. Equivalent analog complexity is impossible.',
    },
];

const SCENARIOS = [
    { label: 'Temperature sensor reading 23.7°C', correct: 'Analog', reason: 'Temperature is a continuous physical quantity.' },
    { label: 'Keyboard key being pressed', correct: 'Digital', reason: 'Key is either pressed (HIGH) or not (LOW). Binary state.' },
    { label: 'MP3 audio file on disk', correct: 'Digital', reason: 'Audio encoded as discrete samples at 44,100 Hz, 16 bits each.' },
    { label: 'Vinyl record groove', correct: 'Analog', reason: 'Groove depth maps continuously to pressure — no discrete steps.' },
];

interface NoiseExperimentProps {
    onComplete: (xp: number) => void;
}

export function NoiseExperiment({ onComplete }: NoiseExperimentProps) {
    const { triggerHaptic } = useGlobalSensory();
    const [noiseAmp, setNoiseAmp] = useState(0);
    const { waveformSamples: analogSamples, brightness } = useAnalogSignal(noiseAmp);
    const { waveformSamples: digitalSamples, switchOn } = useDigitalSignal(noiseAmp);

    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [scenarioAnswers, setScenarioAnswers] = useState<(string | null)[]>([null, null, null, null]);
    const [allScenariosComplete, setAllScenariosComplete] = useState(false);

    const handleAnswer = useCallback((ans: string) => {
        if (scenarioAnswers[scenarioIdx] !== null) return;
        const updated = [...scenarioAnswers];
        updated[scenarioIdx] = ans;
        setScenarioAnswers(updated);

        if (scenarioIdx < SCENARIOS.length - 1) {
            setTimeout(() => setScenarioIdx(i => i + 1), 1100);
        } else {
            setTimeout(() => {
                setAllScenariosComplete(true);
                onComplete(10);
            }, 1100);
        }
    }, [scenarioAnswers, scenarioIdx, onComplete]);

    const flickering = noiseAmp > 4;
    const ledDigitalOn = switchOn || noiseAmp < 6;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {/* ── Noise Slider ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 20,
            }}>
                <VeriSlider
                    value={noiseAmp}
                    onChange={(v) => {
                        setNoiseAmp(v);
                        triggerHaptic('light');
                    }}
                    min={0} max={10}
                    label="Noise Generator — Shared Channel"
                    variant="signal"
                />
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12,
                    fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.08em',
                }}>
                    <div style={{
                        padding: '8px 12px', borderRadius: 4,
                        background: noiseAmp > 0 ? `${T.error}08` : 'transparent',
                        border: `1px solid ${noiseAmp > 0 ? `${T.error}20` : T.border}`,
                    }}>
                        <span style={{ color: T.analog }}>ANALOG:</span> noise directly corrupts signal
                        {noiseAmp > 4 && <span style={{ color: T.error }}> — DEGRADED</span>}
                    </div>
                    <div style={{
                        padding: '8px 12px', borderRadius: 4,
                        background: noiseAmp > 7 ? `${T.warning}08` : 'transparent',
                        border: `1px solid ${noiseAmp > 7 ? `${T.warning}20` : T.border}`,
                    }}>
                        <span style={{ color: T.digital }}>DIGITAL:</span> stable within noise margin
                        {noiseAmp > 7 && <span style={{ color: T.warning }}> — MARGIN EXCEEDED</span>}
                    </div>
                </div>
            </div>

            {/* ── Side-by-side LED compare ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Analog LED */}
                <div style={{
                    background: T.card, border: `1px solid rgba(167,139,250,0.2)`,
                    borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 12,
                }}>
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.analog }}>
                        Analog Circuit
                    </span>
                    <div
                        style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: `rgba(167,139,250,${0.1 + brightness * 0.85})`,
                            boxShadow: brightness > 0.1
                                ? `0 0 ${16 + brightness * 24}px rgba(167,139,250,${brightness * 0.7})`
                                : 'none',
                            border: '1px solid rgba(167,139,250,0.4)',
                        }}
                        className={flickering ? 'led--flickering' : ''}
                    />
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
                        {flickering ? '⚠ Flickering — noise corrupting signal' : 'Smooth dimming'}
                    </span>
                </div>

                {/* Digital LED */}
                <div style={{
                    background: T.card, border: `1px solid rgba(52,211,153,0.2)`,
                    borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 12,
                }}>
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.digital }}>
                        Digital Circuit
                    </span>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: ledDigitalOn ? 'rgba(52,211,153,0.9)' : 'rgba(52,211,153,0.05)',
                        boxShadow: ledDigitalOn ? '0 0 24px rgba(52,211,153,0.7)' : 'none',
                        border: '1px solid rgba(52,211,153,0.3)',
                        transition: 'background 0.08s step-end, box-shadow 0.08s step-end',
                    }} />
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
                        {noiseAmp > 7 ? '⚠ Threshold exceeded' : 'Stable — noise rejected'}
                    </span>
                </div>
            </div>

            {/* ── Dual-channel Oscilloscope ── */}
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
                        Dual-Channel Oscilloscope
                    </span>
                    <div style={{ display: 'flex', gap: 16, fontFamily: T.mono, fontSize: 8 }}>
                        <span style={{ color: '#00D4FF' }}>■ CH1 Analog</span>
                        <span style={{ color: '#F59E0B' }}>■ CH2 Digital</span>
                    </div>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={analogSamples}
                    ch2Samples={digitalSamples}
                    showThreshold={true}
                    label1="CH1 Analog"
                    label2="CH2 Digital"
                    height={200}
                />
            </div>

            {/* ── Interactive Concept Table ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 20,
            }}>
                <span style={{
                    display: 'block', fontFamily: T.mono, fontSize: 8,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${T.accent}80`, marginBottom: 16,
                }}>
                    Comparison Matrix — Click to Expand
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
                        gap: 0, padding: '6px 12px',
                        borderBottom: `1px solid ${T.border}`,
                        fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.1em',
                    }}>
                        <span>PARAMETER</span>
                        <span style={{ color: T.analog }}>ANALOG</span>
                        <span style={{ color: T.digital }}>DIGITAL</span>
                    </div>
                    {CONCEPT_ROWS.map((row, i) => (
                        <div key={row.concept}
                            onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                            className={`concept-row ${expandedRow === i ? 'concept-row--active' : ''}`}
                            style={{ borderBottom: `1px solid ${T.border}` }}
                        >
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
                                gap: 0, padding: '10px 12px', cursor: 'pointer',
                                alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ChevronDown style={{
                                        width: 10, height: 10, color: T.accent,
                                        transform: expandedRow === i ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s ease',
                                    }} />
                                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.text, letterSpacing: '0.06em' }}>
                                        {row.concept}
                                    </span>
                                </div>
                                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.analog }}>
                                    {row.analog}
                                </span>
                                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.digital }}>
                                    {row.digital}
                                </span>
                            </div>
                            <AnimatePresence>
                                {expandedRow === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            padding: '12px 16px',
                                            borderLeft: `2px solid ${T.warning}`,
                                            background: `${T.warning}08`,
                                            margin: '0 12px 10px 12px',
                                            borderRadius: '0 4px 4px 0',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <AlertTriangle size={12} style={{ color: T.warning }} />
                                                <span style={{
                                                    fontFamily: T.mono, fontSize: 9, color: T.warning,
                                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                                    fontWeight: 600,
                                                }}>
                                                    Engineering Insight
                                                </span>
                                            </div>
                                            <p style={{
                                                fontFamily: T.sans, fontSize: 13, color: T.text,
                                                marginTop: 6, lineHeight: 1.6, WebkitFontSmoothing: 'antialiased'
                                            }}>
                                                {row.insight}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Scenario Classification Quiz ── */}
            {!allScenariosComplete ? (
                <div style={{
                    background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 4, padding: 20,
                }}>
                    <span style={{
                        display: 'block', fontFamily: T.mono, fontSize: 8,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: `${T.accent}80`, marginBottom: 12,
                    }}>
                        Challenge — Signal Classification ({scenarioIdx + 1}/{SCENARIOS.length})
                    </span>
                    <div style={{ fontFamily: T.sans, fontSize: 18, color: T.text, marginBottom: 16, lineHeight: 1.6 }}>
                        {SCENARIOS[scenarioIdx].label}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        {(['Analog', 'Digital'] as const).map(opt => {
                            const answered = scenarioAnswers[scenarioIdx];
                            const isCorrect = opt === SCENARIOS[scenarioIdx].correct;
                            const isSelected = answered === opt;
                            
                            let variant: 'primary' | 'secondary' | 'logic' | 'signal' | 'ghost' = 'secondary';
                            if (answered) {
                                if (isSelected) {
                                    variant = isCorrect ? 'logic' : 'primary';
                                }
                            }
                            
                            return (
                                <VeriButton 
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={!!answered}
                                    variant={variant}
                                    size="md"
                                    className="flex-1"
                                >
                                    {opt}
                                </VeriButton>
                            );
                        })}
                    </div>
                    <AnimatePresence>
                        {scenarioAnswers[scenarioIdx] && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '10px 14px',
                                    borderLeft: `2px solid ${scenarioAnswers[scenarioIdx] === SCENARIOS[scenarioIdx].correct ? T.success : T.error}`,
                                    fontFamily: T.sans, fontSize: 14, color: T.muted,
                                    fontStyle: 'italic',
                                }}
                            >
                                {SCENARIOS[scenarioIdx].reason}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                            MODULE 2.3 COMPLETE
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2 }}>
                            +10 XP · Badge: Comparison Master
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
