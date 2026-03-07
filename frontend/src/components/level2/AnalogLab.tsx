/**
 * AnalogLab.tsx — Micro-Module 2.1
 *
 * Interactive potentiometer circuit:
 *   Battery → Potentiometer → LED → Battery (return)
 *
 * Features:
 *   - SVG circuit diagram with animated electron flow when active
 *   - Smooth LED brightness control via slider
 *   - Oscilloscope showing ramp waveform
 *   - Precision challenge: match target brightness ±3%
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Target } from 'lucide-react';
import { useAnalogSignal } from '../../hooks/useAnalogSignal';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', error: '#EF4444', warning: '#F59E0B',
    analog: '#A78BFA',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const CHALLENGE_TARGETS = [25, 50, 75];

interface AnalogLabProps {
    onComplete: (xp: number) => void;
    noiseAmp?: number;
    isXRayMode?: boolean;
    isProbeMode?: boolean;
    isDebugMode?: boolean;
    isPathMode?: boolean;
    isGraphMode?: boolean;
    setProbeData?: (data: { label: string; val: string } | null) => void;
}

export function AnalogLab({
    onComplete,
    noiseAmp = 0,
    isXRayMode,
    isProbeMode,
    isDebugMode,
    isPathMode,
    isGraphMode,
    setProbeData
}: AnalogLabProps) {
    const { sliderValue, setSlider, waveformSamples, voltageV, brightness } = useAnalogSignal(noiseAmp);
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [challengeComplete, setChallengeComplete] = useState(false);
    const [targetsMet, setTargetsMet] = useState<boolean[]>([false, false, false]);

    const currentTarget = CHALLENGE_TARGETS[challengeIdx];
    const diff = Math.abs(sliderValue - currentTarget);
    const isWithinTolerance = diff <= 3;

    const handleChallengeCheck = useCallback(() => {
        if (!isWithinTolerance) return;
        const newMet = [...targetsMet];
        newMet[challengeIdx] = true;
        setTargetsMet(newMet);

        if (challengeIdx < CHALLENGE_TARGETS.length - 1) {
            setChallengeIdx(i => i + 1);
        } else {
            setChallengeComplete(true);
            onComplete(10);
        }
    }, [isWithinTolerance, challengeIdx, targetsMet, onComplete]);

    const ledColor = `rgba(0, 212, 255, ${0.05 + brightness * 0.95})`;
    const ledGlow = brightness > 0.1
        ? `0 0 ${12 + brightness * 32}px rgba(0,212,255,${brightness * 0.8}), 0 0 ${4 + brightness * 12}px rgba(0,212,255,0.9)`
        : 'none';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {/* ── Circuit Diagram ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 24,
            }}>
                <span style={{
                    display: 'block', fontFamily: T.mono, fontSize: 8,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${T.accent}80`, marginBottom: 16,
                }}>
                    Circuit Lab — Potentiometer Voltage Divider
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                    {/* SVG Circuit */}
                    <svg viewBox="0 0 280 200" style={{ width: '100%', maxWidth: 280 }}>
                        {/* Battery */}
                        <g>
                            <rect x="8" y="80" width="32" height="40" rx="2" fill="none"
                                stroke={T.accent} strokeWidth="1.5" />
                            <line x1="14" y1="88" x2="14" y2="112" stroke={T.accent} strokeWidth="1.5" />
                            <line x1="26" y1="84" x2="26" y2="116" stroke={T.accent} strokeWidth="2" />
                            <text x="24" y="78" fill={T.muted} fontSize="8" fontFamily="monospace" textAnchor="middle">9V</text>
                            <text x="42" y="85" fill={T.accent} fontSize="9" fontFamily="monospace">+</text>
                            <text x="42" y="115" fill={T.muted} fontSize="9" fontFamily="monospace">−</text>
                        </g>

                        {/* Wire battery+ to potentiometer */}
                        <line x1="40" y1="88" x2="90" y2="88" stroke={T.accent} strokeWidth="1.5"
                            className={brightness > 0.05 ? 'wire--analog-live' : 'wire--off'} />

                        {/* Potentiometer */}
                        <g>
                            <rect x="90" y="76" width="60" height="24" rx="2" fill="none"
                                stroke="#94A3B8" strokeWidth="1.5" />
                            <text x="120" y="91" fill={T.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">POT</text>
                            {/* Wiper arrow */}
                            <line x1={90 + (sliderValue / 100) * 60} y1="100"
                                x2={90 + (sliderValue / 100) * 60} y2="115"
                                stroke={T.accent} strokeWidth="1.5" />
                            <polygon
                                points={`${90 + (sliderValue / 100) * 60 - 4},115 ${90 + (sliderValue / 100) * 60 + 4},115 ${90 + (sliderValue / 100) * 60},108`}
                                fill={T.accent} />
                        </g>

                        {/* Wire pot to LED */}
                        <line x1="150" y1="88" x2="195" y2="88" stroke={T.accent} strokeWidth="1.5"
                            className={brightness > 0.05 ? 'wire--analog-live' : 'wire--off'} />

                        {/* LED symbol */}
                        <g>
                            <circle cx="210" cy="100" r="16" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                            {/* LED bright fill */}
                            <circle cx="210" cy="100" r="12"
                                fill={ledColor}
                                style={{ filter: `drop-shadow(0 0 ${8 * brightness}px rgba(0,212,255,${brightness * 0.9}))` }}
                            />
                            {/* LED symbol triangle */}
                            <polygon points="204,95 204,105 214,100" fill={T.accent} opacity={0.7} />
                            <line x1="214" y1="94" x2="214" y2="106" stroke={T.accent} strokeWidth="1.2" />
                            {/* Emission rays */}
                            {brightness > 0.3 && (<>
                                <line x1="222" y1="93" x2="228" y2="87" stroke={T.accent} strokeWidth="1"
                                    opacity={brightness * 0.8} />
                                <line x1="224" y1="98" x2="231" y2="95" stroke={T.accent} strokeWidth="1"
                                    opacity={brightness * 0.7} />
                            </>)}
                        </g>

                        {/* Wire LED to battery− (return path) */}
                        <line x1="226" y1="100" x2="250" y2="100" stroke={T.border} strokeWidth="1.5" />
                        <line x1="250" y1="100" x2="250" y2="112" stroke={T.border} strokeWidth="1.5" />
                        <line x1="40" y1="112" x2="250" y2="112" stroke={T.border} strokeWidth="1.5" />

                        {/* Probe indicator overlay */}
                        <circle cx="175" cy="88" r="4" fill={T.accent} opacity="0.6" />
                        <text x="175" y="82" fill={T.accent} fontSize="7" fontFamily="monospace" textAnchor="middle">V</text>

                        {/* Path Analyzer Overlay (Feature 9) */}
                        <AnimatePresence>
                            {isPathMode && (
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    d="M40,88 L90,88 M150,88 L200,88 M226,100 L250,100 L250,112 L40,112 L40,88"
                                    fill="none"
                                    stroke={T.analog}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeOpacity="0.3"
                                />
                            )}
                        </AnimatePresence>

                        {/* X-Ray Mode Overlay (Feature 1) */}
                        {isXRayMode && (
                            <g>
                                <defs>
                                    <radialGradient id="xray-glow">
                                        <stop offset="0%" stopColor={T.accent} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={T.accent} stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                {/* Current flow particles */}
                                {[0, 0.2, 0.4, 0.6, 0.8].map((offset, i) => (
                                    <circle key={i} r="2" fill={T.accent}>
                                        <animateMotion
                                            path="M40,88 L90,88 M150,88 L195,88"
                                            dur={`${2 - brightness * 1.5}s`}
                                            repeatCount="indefinite"
                                            begin={`${offset}s`}
                                        />
                                    </circle>
                                ))}
                                <rect x="0" y="0" width="280" height="200" fill="url(#xray-glow)" pointerEvents="none" opacity="0.1" />
                            </g>
                        )}

                        {/* Debug Assist Overlay (Feature 6) */}
                        <AnimatePresence>
                            {isDebugMode && !challengeComplete && (
                                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <rect x="190" y="180" width="80" height="15" rx="2" fill="rgba(245,158,11,0.1)" stroke={T.warning} strokeWidth="0.5" />
                                    <text x="195" y="190" fill={T.warning} fontSize="6" fontFamily={T.mono}>DIAGNOSTIC: BRIDGE_LOAD</text>
                                    {brightness < 0.1 && (
                                        <circle cx="120" cy="88" r="10" fill="none" stroke={T.warning} strokeWidth="1" strokeDasharray="2 2">
                                            <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite" />
                                        </circle>
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
                                    <rect x="0" y="0" width="280" height="200" fill={T.bg} />
                                    <g stroke={T.accent} strokeWidth="1" opacity="0.6">
                                        <line x1="60" y1="100" x2="140" y2="100" />
                                        <line x1="140" y1="100" x2="220" y2="100" />
                                        <line x1="220" y1="100" x2="220" y2="150" />
                                        <line x1="220" y1="150" x2="60" y2="150" />
                                        <line x1="60" y1="150" x2="60" y2="100" />
                                    </g>
                                    <circle cx="60" cy="100" r="8" fill={T.surface} stroke={T.accent} />
                                    <text x="60" y="118" fill={T.accent} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_PWR</text>

                                    <circle cx="140" cy="100" r="8" fill={T.surface} stroke={T.accent} />
                                    <text x="140" y="118" fill={T.accent} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_POT</text>

                                    <circle cx="220" cy="100" r="8" fill={T.surface} stroke={T.accent} />
                                    <text x="220" y="118" fill={T.accent} fontSize="6" fontFamily={T.mono} textAnchor="middle">N_LOAD</text>

                                    <circle cx="140" cy="150" r="4" fill={T.border} />
                                    <text x="140" y="162" fill={T.muted} fontSize="5" fontFamily={T.mono} textAnchor="middle">GND_BUS</text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Probe Interaction Layer (Feature 5) */}
                        {isProbeMode && !isGraphMode && (
                            <g style={{ cursor: 'crosshair' }}>
                                <circle cx="40" cy="88" r="15" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'SOURCE_VCC', val: '9.00V' })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                                <circle cx="120" cy="88" r="20" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'POT_WIPER', val: `${voltageV.toFixed(2)}V` })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                                <circle cx="210" cy="100" r="20" fill="transparent"
                                    onMouseEnter={() => setProbeData?.({ label: 'LED_ANODE', val: `${voltageV.toFixed(2)}V` })}
                                    onMouseLeave={() => setProbeData?.(null)}
                                />
                            </g>
                        )}
                    </svg>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* LED Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: ledColor,
                                boxShadow: ledGlow,
                                border: `1px solid rgba(0,212,255,${0.2 + brightness * 0.6})`,
                                transition: 'background 0.08s ease, box-shadow 0.08s ease',
                            }} />
                            <div>
                                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent }}>
                                    {voltageV.toFixed(2)} V
                                </div>
                                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
                                    {Math.round(brightness * 100)}% brightness
                                </div>
                            </div>
                        </div>

                        {/* Potentiometer Slider */}
                        <div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: T.mono, fontSize: 8, color: T.muted,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                marginBottom: 8,
                            }}>
                                <span>Potentiometer</span>
                                <span>{sliderValue}%</span>
                            </div>
                            <input
                                type="range"
                                min={0} max={100} value={sliderValue}
                                onChange={e => setSlider(Number(e.target.value))}
                                style={{
                                    width: '100%', accentColor: T.accent,
                                    cursor: 'pointer', height: 4,
                                }}
                            />
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontFamily: T.mono, fontSize: 7, color: T.muted,
                                marginTop: 4, letterSpacing: '0.08em',
                            }}>
                                <span>0 V</span>
                                <span>5 V</span>
                            </div>
                        </div>

                        {/* Challenge */}
                        {!challengeComplete ? (
                            <div style={{
                                padding: '12px 16px',
                                border: `1px solid ${isWithinTolerance ? `${T.success}40` : T.border}`,
                                borderRadius: 4, background: isWithinTolerance ? `${T.success}08` : 'transparent',
                                transition: 'all 0.2s ease',
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    fontFamily: T.mono, fontSize: 8, color: T.muted,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    marginBottom: 8,
                                }}>
                                    <Target style={{ width: 10, height: 10 }} />
                                    Challenge {challengeIdx + 1}/{CHALLENGE_TARGETS.length}
                                </div>
                                <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text, marginBottom: 8 }}>
                                    Set brightness to{' '}
                                    <span style={{ color: T.accent }}>{currentTarget}%</span>
                                    {' '}(±3%)
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{
                                        fontFamily: T.mono, fontSize: 9,
                                        color: isWithinTolerance ? T.success : T.muted,
                                    }}>
                                        Δ {diff.toFixed(1)}%{isWithinTolerance ? ' ✓ In range' : ''}
                                    </span>
                                    <button
                                        onClick={handleChallengeCheck}
                                        disabled={!isWithinTolerance}
                                        style={{
                                            padding: '6px 14px',
                                            fontFamily: T.mono, fontSize: 8,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            background: isWithinTolerance ? `${T.success}12` : 'transparent',
                                            border: `1px solid ${isWithinTolerance ? T.success : T.border}`,
                                            borderRadius: 2, color: isWithinTolerance ? T.success : T.muted,
                                            cursor: isWithinTolerance ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                                {/* Progress dots */}
                                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                                    {targetsMet.map((met, i) => (
                                        <div key={i} style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: met ? T.success : (i === challengeIdx ? T.accent : T.border),
                                            transition: 'background 0.3s',
                                        }} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    padding: '12px 16px',
                                    border: `1px solid ${T.success}40`,
                                    borderRadius: 4, background: `${T.success}08`,
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}
                            >
                                <CheckCircle2 style={{ width: 16, height: 16, color: T.success, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.success, letterSpacing: '0.1em' }}>
                                        PRECISION CHALLENGE COMPLETE
                                    </div>
                                    <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2 }}>
                                        +10 XP · Badge: Analog Explorer
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Oscilloscope ── */}
            <div style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 4, padding: 16,
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 12,
                }}>
                    <span style={{
                        fontFamily: T.mono, fontSize: 8, color: `${T.accent}80`,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                        Oscilloscope — CH1 Analog
                    </span>
                    <div style={{ display: 'flex', gap: 16, fontFamily: T.mono, fontSize: 8, color: T.muted }}>
                        <span>TIME/DIV: 100ms</span>
                        <span>VOLT/DIV: 1V</span>
                    </div>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={waveformSamples}
                    label1="CH1 — Analog"
                    height={180}
                />
            </div>
        </div>
    );
}
