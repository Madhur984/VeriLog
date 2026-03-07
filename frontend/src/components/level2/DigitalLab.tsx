/**
 * DigitalLab.tsx — Micro-Module 2.2
 *
 * Interactive digital circuit: Battery → Switch → LED
 *
 * Features:
 *   - Clickable SPST switch toggling LED ON/OFF (no intermediate)
 *   - Voltage threshold visualization with band zones
 *   - Noise immunity slider demonstrating noise margin concept
 *   - Voltage classification quiz
 *   - Square wave oscilloscope
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useDigitalSignal } from '../../hooks/useDigitalSignal';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', error: '#EF4444', warning: '#F59E0B',
    analog: '#A78BFA', digital: '#34D399',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const QUIZ_VOLTAGES = [
    { v: 3.2, correct: 'HIGH' as const, label: '3.2V' },
    { v: 0.4, correct: 'LOW' as const, label: '0.4V' },
    { v: 1.2, correct: 'UNDEFINED' as const, label: '1.2V' },
];

type VClass = 'HIGH' | 'LOW' | 'UNDEFINED';

interface DigitalLabProps {
    onComplete: (xp: number) => void;
    isXRayMode?: boolean;
    isProbeMode?: boolean;
    isDebugMode?: boolean;
    isPathMode?: boolean;
    isGraphMode?: boolean;
    setProbeData?: (data: { label: string; val: string } | null) => void;
}

export function DigitalLab({
    onComplete,
    isXRayMode,
    isProbeMode,
    isDebugMode,
    isPathMode,
    isGraphMode,
    setProbeData
}: DigitalLabProps) {
    const [noiseAmp, setNoiseAmp] = useState(0);
    const { switchOn, toggle, inputVoltage, setInputVoltage, voltageClass, waveformSamples } = useDigitalSignal(noiseAmp);

    const [quizIdx, setQuizIdx] = useState(0);
    const [quizDone, setQuizDone] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<(VClass | null)[]>([null, null, null]);


    const currentVQ = QUIZ_VOLTAGES[quizIdx];

    const handleQuizAnswer = useCallback((ans: VClass) => {
        if (quizAnswers[quizIdx] !== null) return;
        const updated = [...quizAnswers];
        updated[quizIdx] = ans;
        setQuizAnswers(updated);

        if (quizIdx < QUIZ_VOLTAGES.length - 1) {
            setTimeout(() => setQuizIdx(i => i + 1), 900);
        } else {
            setTimeout(() => {
                setQuizDone(true);
                onComplete(10);
            }, 900);
        }
    }, [quizAnswers, quizIdx, onComplete]);

    const ledOn = switchOn;
    const voleZoneColor = voltageClass === 'HIGH' ? T.success : (voltageClass === 'LOW' ? T.error : T.warning);
    const bandPercent = (inputVoltage / 5) * 100;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {/* ── Circuit + Controls ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 24,
            }}>
                <span style={{
                    display: 'block', fontFamily: T.mono, fontSize: 8,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${T.accent}80`, marginBottom: 16,
                }}>
                    Circuit Lab — Digital Toggle
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                    {/* SVG Circuit */}
                    <svg viewBox="0 0 260 160" style={{ width: '100%', maxWidth: 260 }}>
                        {/* Battery */}
                        <rect x="8" y="60" width="28" height="40" rx="2" fill="none"
                            stroke={T.accent} strokeWidth="1.5" />
                        <line x1="14" y1="68" x2="14" y2="92" stroke={T.accent} strokeWidth="1.5" />
                        <line x1="22" y1="64" x2="22" y2="96" stroke={T.accent} strokeWidth="2" />
                        <text x="20" y="56" fill={T.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">9V</text>
                        <text x="38" y="72" fill={T.accent} fontSize="9" fontFamily="monospace">+</text>
                        <text x="38" y="94" fill={T.muted} fontSize="9" fontFamily="monospace">−</text>

                        {/* Wire batt+ → switch */}
                        <line x1="36" y1="68" x2="80" y2="68"
                            stroke={ledOn ? T.accent : T.border} strokeWidth="1.5"
                            style={ledOn ? { filter: 'drop-shadow(0 0 3px rgba(0,212,255,0.6))' } : undefined} />

                        {/* Switch symbol */}
                        <circle cx="90" cy="68" r="3" fill={T.accent} />
                        {/* Switch arm */}
                        <line
                            x1="90" y1="68"
                            x2={switchOn ? "122" : "118"}
                            y2={switchOn ? "68" : "56"}
                            stroke={T.accent} strokeWidth="1.8"
                            style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                            onClick={toggle}
                        />
                        <circle cx="124" cy="68" r="3" fill={ledOn ? T.accent : T.muted} />
                        <text x="105" y="84" fill={T.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">
                            SPST
                        </text>

                        {/* Wire switch → LED */}
                        <line x1="127" y1="68" x2="168" y2="68"
                            stroke={ledOn ? T.accent : T.border} strokeWidth="1.5"
                            style={ledOn ? { filter: 'drop-shadow(0 0 3px rgba(0,212,255,0.6))' } : undefined} />

                        {/* LED */}
                        <circle cx="186" cy="80" r="14" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                        <circle cx="186" cy="80" r="10"
                            fill={ledOn ? 'rgba(0,212,255,0.9)' : 'rgba(0,212,255,0.04)'}
                            style={{ transition: 'fill 0.08s step-end', filter: ledOn ? 'drop-shadow(0 0 10px rgba(0,212,255,0.9))' : 'none' }}
                        />
                        <polygon points="180,75 180,85 190,80" fill={T.accent} opacity={0.7} />
                        <line x1="190" y1="74" x2="190" y2="86" stroke={T.accent} strokeWidth="1.2" />

                        {/* Return path */}
                        <line x1="200" y1="80" x2="220" y2="80" stroke={T.border} strokeWidth="1.5" />
                        <line x1="220" y1="80" x2="220" y2="92" stroke={T.border} strokeWidth="1.5" />
                        <line x1="36" y1="92" x2="220" y2="92" stroke={T.border} strokeWidth="1.5" />

                        {/* Path Analyzer Overlay (Feature 9) */}
                        <AnimatePresence>
                            {isPathMode && (
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    d="M36,68 L90,68 M124,68 L170,68 M200,80 L220,80 L220,92 L36,92 L36,68"
                                    fill="none"
                                    stroke={T.analog}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeOpacity="0.3"
                                />
                            )}
                        </AnimatePresence>

                        {/* Logic State Trace (Feature 11) */}
                        <AnimatePresence>
                            {ledOn && (
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.2 }}
                                    exit={{ opacity: 0 }}
                                    d="M36,68 L172,68"
                                    stroke={T.success}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                            )}
                        </AnimatePresence>

                        {/* X-Ray Mode Overlay (Feature 1) */}
                        {isXRayMode && (
                            <g>
                                {/* Digital Pulse Particles */}
                                <rect x="0" y="0" width="260" height="160" fill={T.accent} opacity="0.03" pointerEvents="none" />
                                {[0, 0.4, 0.8].map((offset, i) => (
                                    <rect key={i} width="4" height="4" rx="1" fill={T.accent}>
                                        <animateMotion
                                            path={ledOn ? "M36,68 L172,68" : "M36,68 L88,68"}
                                            dur={ledOn ? "0.8s" : "2s"}
                                            repeatCount="indefinite"
                                            begin={`${offset}s`}
                                        />
                                    </rect>
                                ))}
                            </g>
                        )}

                        {/* Debug Assist Overlay (Feature 6) */}
                        <AnimatePresence>
                            {isDebugMode && (
                                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {!switchOn && (
                                        <g>
                                            <circle cx="105" cy="62" r="12" fill="none" stroke={T.warning} strokeWidth="1" strokeDasharray="3 3">
                                                <animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                            <text x="80" y="45" fill={T.warning} fontSize="6" fontFamily={T.mono}>FAULT: GATE_STUCK_LOW</text>
                                        </g>
                                    )}
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Circuit Graph View (Feature 12) */}
                        <AnimatePresence>
                            {isGraphMode && (
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <rect x="0" y="0" width="260" height="160" fill={T.bg} />
                                    <g stroke={T.success} strokeWidth="1" opacity="0.6">
                                        <line x1="60" y1="70" x2="130" y2="70" />
                                        <line x1="130" y1="70" x2="200" y2="80" />
                                        <line x1="200" y1="80" x2="200" y2="130" />
                                        <line x1="200" y1="130" x2="60" y2="130" />
                                        <line x1="60" y1="130" x2="60" y2="70" />
                                    </g>
                                    <circle cx="60" cy="70" r="8" fill={T.surface} stroke={T.success} />
                                    <text x="60" y="88" fill={T.success} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_PWR</text>

                                    <circle cx="130" cy="70" r="8" fill={T.surface} stroke={T.success} />
                                    <text x="130" y="88" fill={T.success} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_GATE</text>

                                    <circle cx="200" cy="80" r="8" fill={T.surface} stroke={T.success} />
                                    <text x="200" y="98" fill={T.success} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_OUT</text>

                                    <circle cx="130" cy="130" r="4" fill={T.border} />
                                    <text x="130" y="142" fill={T.muted} fontSize="5" fontFamily={T.mono} textAnchor="middle">GND_BUS</text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Timing Visualizer Tooltip (Feature 10) */}
                        <AnimatePresence>
                            {isXRayMode && (
                                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <rect x="10" y="10" width="80" height="30" rx="2" fill="rgba(0,212,255,0.05)" stroke={T.accent} strokeWidth="0.5" />
                                    <text x="15" y="22" fill={T.accent} fontSize="5" fontFamily={T.mono}>TIMING_TRACE</text>
                                    <text x="15" y="32" fill={T.muted} fontSize="5" fontFamily={T.mono}>t_prop: 0.12ns</text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Probe Interaction Layer (Feature 5) */}
                        {isProbeMode && !isGraphMode && (
                            <g style={{ cursor: 'crosshair' }}>
                                <circle cx="36" cy="68" r="15" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'SOURCE_VCC', val: '5.0V' })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                                <circle cx="105" cy="68" r="20" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'GATE_INPUT', val: switchOn ? '5.0V' : '0.0V' })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                                <circle cx="186" cy="80" r="20" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'LED_LOGIC', val: switchOn ? 'HIGH' : 'LOW' })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                            </g>
                        )}
                    </svg>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Switch Toggle Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Switch Control
                            </span>
                            <button
                                onClick={toggle}
                                style={{
                                    padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10,
                                    background: ledOn ? `${T.success}12` : `${T.error}08`,
                                    border: `1px solid ${ledOn ? T.success : T.error}40`,
                                    borderRadius: 4, color: ledOn ? T.success : T.error,
                                    fontFamily: T.mono, fontSize: 10, letterSpacing: '0.12em',
                                    cursor: 'pointer', transition: 'all 0.08s step-end',
                                }}
                            >
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: ledOn ? T.success : T.error,
                                    boxShadow: `0 0 8px ${ledOn ? T.success : T.error}`,
                                }} />
                                {ledOn ? 'ON — HIGH (5V)' : 'OFF — LOW (0V)'}
                            </button>
                        </div>

                        {/* Voltage Threshold Visualization */}
                        <div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: T.mono, fontSize: 8, color: T.muted,
                                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                            }}>
                                <span>Input Voltage Demo</span>
                                <span style={{ color: voleZoneColor }}>{inputVoltage.toFixed(1)}V — {voltageClass}</span>
                            </div>
                            {/* Zone bar */}
                            <div style={{
                                height: 28, borderRadius: 4, position: 'relative',
                                background: 'linear-gradient(to right, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.2) 16%, rgba(245,158,11,0.2) 16%, rgba(245,158,11,0.2) 40%, rgba(16,185,129,0.2) 40%, rgba(16,185,129,0.2) 100%)',
                                border: `1px solid ${T.border}`,
                            }}>
                                {/* LOW label */}
                                <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', fontFamily: T.mono, fontSize: 7, color: T.error, letterSpacing: '0.1em' }}>LOW</span>
                                {/* UNDEF label */}
                                <span style={{ position: 'absolute', left: '22%', top: '50%', transform: 'translateY(-50%)', fontFamily: T.mono, fontSize: 7, color: T.warning, letterSpacing: '0.08em' }}>UNDEF</span>
                                {/* HIGH label */}
                                <span style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', fontFamily: T.mono, fontSize: 7, color: T.success, letterSpacing: '0.1em' }}>HIGH</span>
                                {/* Indicator */}
                                <div style={{
                                    position: 'absolute', top: -4, bottom: -4,
                                    left: `${bandPercent}%`, width: 2,
                                    background: voleZoneColor,
                                    boxShadow: `0 0 6px ${voleZoneColor}`,
                                    borderRadius: 1, transition: 'left 0.05s ease',
                                }} />
                            </div>
                            <input
                                type="range" min={0} max={5} step={0.1} value={inputVoltage}
                                onChange={e => setInputVoltage(Number(e.target.value))}
                                style={{ width: '100%', accentColor: voleZoneColor, marginTop: 6, cursor: 'pointer' }}
                            />
                        </div>

                        {/* Noise Slider */}
                        <div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: T.mono, fontSize: 8, color: T.muted,
                                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                            }}>
                                <span>Noise Amplitude</span>
                                <span>{noiseAmp.toFixed(1)} / 10</span>
                            </div>
                            <input
                                type="range" min={0} max={10} step={0.5} value={noiseAmp}
                                onChange={e => setNoiseAmp(Number(e.target.value))}
                                style={{ width: '100%', accentColor: T.warning, cursor: 'pointer' }}
                            />
                            <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 4 }}>
                                {noiseAmp < 2 ? 'Signal stable — within noise margin' :
                                    noiseAmp < 6 ? 'Approaching threshold — caution' :
                                        'Exceeding noise margin — signal corrupted'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Oscilloscope ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 16,
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
                }}>
                    <span style={{
                        fontFamily: T.mono, fontSize: 8, color: `${T.success}80`,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                        Oscilloscope — CH2 Digital Square Wave
                    </span>
                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>TIME/DIV: 100ms</span>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={waveformSamples}
                    showThreshold={true}
                    label1="CH2 — Digital"
                    height={160}
                />
            </div>

            {/* ── Voltage Classification Quiz ── */}
            {!quizDone ? (
                <div style={{
                    background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 4, padding: 20,
                }}>
                    <span style={{
                        display: 'block', fontFamily: T.mono, fontSize: 8,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: `${T.accent}80`, marginBottom: 12,
                    }}>
                        Challenge — Voltage Classification ({quizIdx + 1}/3)
                    </span>
                    <div style={{ fontFamily: T.sans, fontSize: 18, color: T.text, marginBottom: 16 }}>
                        Classify{' '}
                        <span style={{ fontFamily: T.mono, color: T.accent, fontSize: 20 }}>
                            {currentVQ.label}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {(['LOW', 'UNDEFINED', 'HIGH'] as VClass[]).map(opt => {
                            const answered = quizAnswers[quizIdx];
                            const isCorrect = opt === currentVQ.correct;
                            const isSelected = answered === opt;
                            let borderCol: string = T.border, bg = 'transparent', col: string = T.text;
                            if (answered) {
                                if (isCorrect) { borderCol = `${T.success}50`; bg = `${T.success}08`; col = T.success; }
                                else if (isSelected) { borderCol = `${T.error}50`; bg = `${T.error}08`; col = T.error; }
                                else col = T.muted;
                            }
                            return (
                                <button key={opt}
                                    onClick={() => handleQuizAnswer(opt)}
                                    disabled={!!answered}
                                    style={{
                                        flex: 1, padding: '10px 8px',
                                        fontFamily: T.mono, fontSize: 10, letterSpacing: '0.1em',
                                        background: bg, border: `1px solid ${borderCol}`, borderRadius: 2,
                                        color: col, cursor: answered ? 'default' : 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
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
                            MODULE 2.2 COMPLETE
                        </div>
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2 }}>
                            +10 XP · Badge: Digital Discoverer
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
