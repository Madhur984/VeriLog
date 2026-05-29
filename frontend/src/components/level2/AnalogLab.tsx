/**
 * AnalogLab.tsx - Micro-Module 2.1
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

import { useState, useCallback, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

const CAUSAL_DELAY = 25; // ms propagation delay
import { CheckCircle2, Target } from 'lucide-react';
import { useAnalogSignal } from '../../hooks/useAnalogSignal';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';
import { ConceptOverlay, ConceptData } from '../ui/ConceptOverlay';
import { ActiveRecallSystem, Question } from '../ui/ActiveRecallSystem';
import { ConceptGate, ConceptLevel } from '../ui/ConceptGate';
import { useCognitionEngine } from '../../hooks/useCognitionEngine';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { DURATIONS } from '../../constants/designTokens';
import { VeriSlider } from '../shared/VeriSlider';
import { VeriButton } from '../shared/VeriButton';
import { useAttentionLock } from '../../hooks/useAttentionLock';

const T = {
    bg: '#FFFFFF', card: '#F8FAFC', surface: '#F1F5F9', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0EA5E9',
    success: '#059669', error: '#DC2626', warning: '#D97706',
    analog: '#8B5CF6',
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
    const { triggerHaptic, playSound, playAmbient, stopAmbient } = useGlobalSensory();
    const { focusProps } = useAttentionLock();

    const cognition = useCognitionEngine('analog_lab');
    
    // Physical Simulation State
    const [sliderVoltage, setSliderVoltage] = useState(2.5);
    const [actualVoltage, setActualVoltage] = useState(2.5); // Delayed "causal" voltage
    const [wireDistance, setWireDistance] = useState(0); // 0-100% attenuation
    const [isFreezeActive, setIsFreezeActive] = useState(false);
    const [noiseType, setNoiseType] = useState<'gaussian' | 'burst' | 'drift' | 'emi'>('gaussian');
    
    const { setSlider, waveformSamples, sliderValue, voltageV, brightness } = useAnalogSignal(noiseAmp, noiseType);
    
    // Causal Engine logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isFreezeActive) {
                setActualVoltage(sliderVoltage);
                setSlider(sliderVoltage * 20); // Scale 0-5V to 0-100%
            }
        }, CAUSAL_DELAY);
        return () => clearTimeout(timer);
    }, [sliderVoltage, isFreezeActive, setSlider]);

    const displayVoltage = actualVoltage * (1 - (wireDistance * 0.005));
    const effectiveBrightness = displayVoltage / 5;
    const [challengeIdx, setChallengeIdx] = useState(0);
    const [challengeComplete, setChallengeComplete] = useState(false);
    const [targetsMet, setTargetsMet] = useState<boolean[]>([false, false, false]);
    
    // Causal Glow Pulse
    const [pulseOpacity, setPulseOpacity] = useState(0);
    const [isGateUnlocked, setIsGateUnlocked] = useState(false);
    const [isEngineerMode, setIsEngineerMode] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Theory & Recall State
    const [showTheory, setShowTheory] = useState(false);
    const [showRecall, setShowRecall] = useState(false);
    const [hasSeenRecall, setHasSeenRecall] = useState(false);

    const ANALOG_CONCEPT: ConceptData = {
        id: 'analog_continuous',
        title: 'Continuous Signals',
        description: 'Analog signals map physical quantities (like voltage) directly to information. They have infinite resolution-there is always a value between any two points.',
        visualLink: 'Potentiometer Voltage',
        insight: 'In the analog world, every micro-volt matters. This makes them precise but vulnerable to noise.',
        memoryHook: 'Analog is like a dimmer switch, not a button.',
        color: T.analog
    };

    const ANALOG_RECALL: Question = {
        id: 'analog_precision',
        type: 'instant',
        text: 'Why does the LED brightness change smoothly rather than snapping?',
        options: [
            { text: 'It has infinite resolution', isCorrect: true },
            { text: 'It uses binary logic', isCorrect: false },
            { text: 'The battery is 9V', isCorrect: false }
        ],
        explanation: 'Analog signals are continuous, meaning they can represent any value between 0 and 5V, resulting in smooth transitions.'
    };

    const ANALOG_GATE_LEVELS: ConceptLevel[] = [
        {
            title: "Intuition",
            content: "Analog signals are like a dimmer switch-there are no 'snaps' or 'jumps'. Every slight physical change is mirrored perfectly in the signal."
        },
        {
            title: "Technical",
            content: "We use voltage to represent value. A 0% slider = 0V, 100% slider = 5V. In between? Infinite possibilities (1.23V, 1.234V...)."
        },
        {
            title: "Engineering",
            content: "Because they map to physics directly, analog signals are 'Continuous'. This makes them the foundation of the real world, but vulnerable to electrical noise."
        }
    ];

    // Engineering Hum & Pulse reaction
    useEffect(() => {
        playAmbient();
        return () => stopAmbient();
    }, [playAmbient, stopAmbient]);

    useEffect(() => {
        setPulseOpacity(1);
        const t = setTimeout(() => setPulseOpacity(0), 400);
        return () => clearTimeout(t);
    }, [sliderValue]);

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
            triggerHaptic('success');
        } else {
            setChallengeComplete(true);
            onComplete(10);
            if (!hasSeenRecall) setShowRecall(true);
        }
    }, [isWithinTolerance, challengeIdx, targetsMet, onComplete, hasSeenRecall, triggerHaptic]);

    // Obsolete style variables removed

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
                    Circuit Lab - Potentiometer Voltage Divider
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                    {/* SVG Circuit */}
                    <svg viewBox="0 0 280 200" style={{ width: '100%', maxWidth: 280 }}>
                        {/* Battery */}
                        <g>
                            <defs>
                                <radialGradient id="led-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor={`rgba(0, 212, 255, ${Math.max(0.1, brightness * 1.5)})`} />
                                    <stop offset="60%" stopColor={`rgba(0, 212, 255, ${brightness * 0.8})`} />
                                    <stop offset="100%" stopColor={`rgba(0, 212, 255, ${brightness * 0.1})`} />
                                </radialGradient>
                            </defs>
                            <rect x="8" y="80" width="32" height="40" rx="2" fill="none"
                                stroke={T.accent} strokeWidth="1.5" />
                            <line x1="14" y1="88" x2="14" y2="112" stroke={T.accent} strokeWidth="1.5" />
                            <line x1="26" y1="84" x2="26" y2="116" stroke={T.accent} strokeWidth="2" />
                            <text x="24" y="78" fill={T.muted} fontSize="8" fontFamily="monospace" textAnchor="middle">9V</text>
                            <text x="42" y="85" fill={T.accent} fontSize="9" fontFamily="monospace">+</text>
                            <text x="42" y="115" fill={T.muted} fontSize="9" fontFamily="monospace">−</text>
                        </g>

                        {/* Wire battery+ to potentiometer */}
                        <line x1="40" y1="88" x2="90" y2="88" stroke={T.accent} strokeWidth="1.5" strokeDasharray="4 8" opacity={0.4 + brightness * 0.6}>
                            {brightness > 0.05 && <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite" />}
                        </line>
                        {/* Causal Glow Pulse - Wire 1 */}
                        <motion.line 
                            x1="40" y1="88" x2="90" y2="88" 
                            stroke={T.accent} strokeWidth="4" 
                            animate={{ opacity: pulseOpacity * 0.6 }}
                            transition={{ duration: DURATIONS.GLOW_TRAVEL }}
                            style={{ filter: 'blur(4px)' }} 
                        />

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

                        {/* Live Voltage Readout in Circuit */}
                        <text x="175" y="78" fill={T.accent} fontSize="8" fontFamily={T.mono} textAnchor="middle" style={{ opacity: 0.9 }}>
                            {voltageV.toFixed(2)}V
                        </text>
                        <text x="175" y="114" fill={T.muted} fontSize="6" fontFamily={T.mono} textAnchor="middle" style={{ opacity: 0.8 }}>
                            ANALOG SIGNAL
                        </text>

                        {/* Wire pot to LED */}
                        <line x1="150" y1="88" x2="195" y2="88" stroke={T.accent} strokeWidth="1.5" strokeDasharray="4 8" opacity={0.4 + brightness * 0.6}>
                            {brightness > 0.05 && <animate attributeName="stroke-dashoffset" from="12" to="0" dur={`${1 + (1 - brightness)}s`} repeatCount="indefinite" />}
                        </line>
                        {/* Causal Glow Pulse - Wire 2 */}
                        <motion.line 
                            x1="150" y1="88" x2="195" y2="88" 
                            stroke={T.accent} strokeWidth="4" 
                            animate={{ opacity: pulseOpacity * 0.6 }}
                            transition={{ duration: DURATIONS.GLOW_TRAVEL, delay: 0.05 }}
                            style={{ filter: 'blur(4px)' }} 
                        />

                        {/* LED symbol */}
                        <g>
                            <circle cx="210" cy="100" r="16" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                            {/* LED bright fill */}
                            <motion.circle cx="210" cy="100" r="12"
                                fill="url(#led-grad)"
                                animate={{ scale: targetsMet[0] ? [1, 1.1, 1] : 1 }}
                                style={{ 
                                    opacity: effectiveBrightness,
                                    filter: effectiveBrightness > 0.1 
                                        ? `drop-shadow(0 0 ${8 + effectiveBrightness * 20}px rgba(0,212,255,0.8))`
                                        : 'none'
                                }}
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
                                
                                {/* Mini Waveform Overlay on Probe */}
                                <foreignObject x="130" y="20" width="80" height="50">
                                     <div style={{ 
                                         width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', 
                                         border: `1px solid ${T.accent}`, borderRadius: 2, overflow: 'hidden'
                                     }}>
                                         <OscilloscopeCanvas 
                                             ch1Samples={waveformSamples} 
                                             height={50} 
                                             className="opacity-80"
                                         />
                                     </div>
                                </foreignObject>
                            </g>
                        )}
                    </svg>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* LED Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <motion.div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: `rgba(0, 212, 255, ${0.05 + effectiveBrightness * 0.95})`,
                                boxShadow: effectiveBrightness > 0.1
                                    ? `0 0 ${12 + effectiveBrightness * 32}px rgba(0,212,255,${effectiveBrightness * 0.8}), 0 0 ${4 + effectiveBrightness * 12}px rgba(0,212,255,0.9)`
                                    : 'none',
                                border: `1px solid rgba(0,212,255,${0.2 + effectiveBrightness * 0.6})`,
                                transition: 'background 0.08s ease',
                            }} />
                            <div>
                                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.accent }}>
                                    {displayVoltage.toFixed(2)} V
                                </div>
                                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>
                                    {Math.round(effectiveBrightness * 100)}% brightness
                                </div>
                            </div>
                        </div>

                        {/* Simulation Logic Controls */}
                        <div style={{ display: 'flex', gap: 8 }}>
                             <VeriButton
                                 onClick={() => { setIsFreezeActive(!isFreezeActive); triggerHaptic('medium'); }}
                                 variant={isFreezeActive ? 'primary' : 'secondary'}
                                 size="sm"
                                 className="flex-1"
                             >
                                 {isFreezeActive ? 'RESUME SIM' : 'FREEZE SIM'}
                             </VeriButton>
                        </div>

                        {/* Potentiometer Slider */}
                        <div {...focusProps} style={{ opacity: isGateUnlocked ? 1 : 0.4, transition: 'opacity 0.5s ease', pointerEvents: isGateUnlocked ? 'auto' : 'none' }}>
                            <VeriSlider
                                value={sliderVoltage * 20}
                                onChange={(v) => {
                                    setSliderVoltage(v / 20);
                                    cognition.recordInteraction('potentiometer_drag');
                                    setPulseOpacity(1);
                                    setTimeout(() => setPulseOpacity(0), 400);
                                }}
                                label="Signal Voltage"
                                variant="signal"
                                snaps={[
                                    { value: 0, label: '0V' },
                                    { value: 50, label: '2.5V' },
                                    { value: 100, label: '5V' },
                                    { value: currentTarget, label: challengeComplete ? undefined : 'TARGET' }
                                ]}
                            />
                        </div>

                        {/* Feature 9: Line Loss (Distance Simulation) */}
                        <div style={{ opacity: isGateUnlocked ? 1 : 0.4, transition: 'opacity 0.5s ease' }}>
                            <VeriSlider
                                value={wireDistance}
                                onChange={(v) => {
                                    setWireDistance(v);
                                    cognition.recordInteraction('wire_distance_adjust');
                                }}
                                label="Line Loss / Distance"
                                variant="signal"
                                snaps={[
                                    { value: 0, label: '0m' },
                                    { value: 50, label: '50m' },
                                    { value: 100, label: '100m' }
                                ]}
                            />
                        </div>

                        {/* Noise Personality Engine UI */}
                        {isGateUnlocked && (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>NOISE_TYPE:</span>
                                {(['gaussian', 'burst', 'drift', 'emi'] as const).map(type => (
                                    <VeriButton
                                        key={type}
                                        onClick={() => { setNoiseType(type); triggerHaptic('light'); }}
                                        variant={noiseType === type ? 'primary' : 'secondary'}
                                        size="sm"
                                        className="!py-1 !px-2 !text-[7px]"
                                    >
                                        {type}
                                    </VeriButton>
                                ))}
                            </div>
                        )}

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
                                    <VeriButton
                                        onClick={handleChallengeCheck}
                                        disabled={!isWithinTolerance}
                                        variant={isWithinTolerance ? 'primary' : 'secondary'}
                                        size="sm"
                                    >
                                        Confirm
                                    </VeriButton>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            fontFamily: T.mono, fontSize: 8, color: `${T.accent}80`,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>
                            Oscilloscope - CH1 Analog
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                             <button
                                 onClick={() => { setIsPaused(!isPaused); triggerHaptic('medium'); }}
                                 style={{
                                     padding: '2px 8px', fontFamily: T.mono, fontSize: 7,
                                     background: isPaused ? T.error : 'rgba(255,255,255,0.05)',
                                     color: isPaused ? '#FFF' : T.muted,
                                     border: `1px solid ${isPaused ? T.error : T.border}`,
                                     borderRadius: 2, cursor: 'pointer'
                                 }}
                             >
                                 {isPaused ? 'RESUME' : 'PAUSE'}
                             </button>
                             <button
                                 onClick={() => { setIsEngineerMode(!isEngineerMode); triggerHaptic('heavy'); }}
                                 style={{
                                     padding: '2px 8px', fontFamily: T.mono, fontSize: 7,
                                     background: isEngineerMode ? T.accent : 'rgba(255,255,255,0.05)',
                                     color: isEngineerMode ? '#000' : T.muted,
                                     border: `1px solid ${isEngineerMode ? T.accent : T.border}`,
                                     borderRadius: 2, cursor: 'pointer'
                                 }}
                             >
                                 ENGINEER_MODE
                             </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontFamily: T.mono, fontSize: 8, color: T.muted }}>
                        <span>TIME/DIV: 100ms</span>
                        <span>VOLT/DIV: 1V</span>
                    </div>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={waveformSamples}
                    label1="CH1 - Analog"
                    height={180}
                    isPaused={isPaused}
                    isEngineerMode={isEngineerMode}
                />
            </div>

            {/* Theory & Recall Overlays */}
            <ConceptOverlay 
                isVisible={showTheory} 
                concept={ANALOG_CONCEPT} 
                onDismiss={() => setShowTheory(false)} 
            />
            
            <ActiveRecallSystem 
                isVisible={showRecall} 
                question={ANALOG_RECALL} 
                onAnswer={() => {
                    setShowRecall(false);
                    setHasSeenRecall(true);
                }} 
            />

            <ConceptGate
                title="Analog Continuity"
                levels={ANALOG_GATE_LEVELS}
                isVisible={!isGateUnlocked}
                onComplete={() => {
                    setIsGateUnlocked(true);
                    triggerHaptic('success');
                    playSound('success');
                }}
            />
        </div>
    );
}
