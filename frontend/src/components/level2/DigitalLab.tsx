/**
 * DigitalLab.tsx - Micro-Module 2.2
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

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useDigitalSignal } from '../../hooks/useDigitalSignal';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';
import { ConceptOverlay, ConceptData } from '../ui/ConceptOverlay';
import { ActiveRecallSystem, Question } from '../ui/ActiveRecallSystem';
import { ConceptGate, ConceptLevel } from '../ui/ConceptGate';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { DURATIONS, SPRINGS } from '../../constants/designTokens';
import { useSpring, useTransform } from 'framer-motion';
import { VeriSlider } from '../shared/VeriSlider';
import { VeriButton } from '../shared/VeriButton';
import { useAttentionLock } from '../../hooks/useAttentionLock';

const T = {
    bg: '#FFFFFF', card: '#F8FAFC', surface: '#F1F5F9', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0EA5E9',
    success: '#059669', error: '#DC2626', warning: '#D97706',
    analog: '#8B5CF6', digital: '#10B981',
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
    const { triggerHaptic, playSound, playAmbient, stopAmbient } = useGlobalSensory();
    const { focusProps } = useAttentionLock();
    const [noiseAmp, setNoiseAmp] = useState(0);
    const { switchOn, toggle, inputVoltage, setInputVoltage, voltageClass, waveformSamples, isGlitching } = useDigitalSignal(noiseAmp);

    // Elite States
    const [isGateUnlocked, setIsGateUnlocked] = useState(false);
    const [isEngineerMode, setIsEngineerMode] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isFreezeOnError, setIsFreezeOnError] = useState(false);
    const [pulseOpacity, setPulseOpacity] = useState(0);

    // Theory & Recall State
    const [showTheory, setShowTheory] = useState(false);
    const [showRecall, setShowRecall] = useState(false);

    const DIGITAL_CONCEPT: ConceptData = {
        id: 'digital_discrete',
        title: 'Discrete Signals',
        description: 'Digital signals use abstraction to ignore small variations. They operate on thresholds (LOW or HIGH), creating a "Noise Margin" that rejects interference.',
        visualLink: 'Threshold Bands (LOW/HIGH)',
        insight: 'By deciding that only 0 and 1 exist, computers can transmit data perfectly even if the wire has static.',
        memoryHook: 'Digital is like a light switch-it is either ON or OFF.',
        color: T.digital
    };

    const DIGITAL_RECALL: Question = {
        id: 'digital_threshold',
        type: 'prediction',
        text: 'What happens if the voltage falls into the orange "UNDEFINED" zone?',
        options: [
            { text: 'The signal becomes unstable', isCorrect: true },
            { text: 'It automatically rounds up', isCorrect: false },
            { text: 'The computer ignores it', isCorrect: false }
        ],
        explanation: 'The Undefined zone (Between VIL and VIH) is a dangerous region where the hardware cannot reliably tell if the signal is a 0 or a 1.'
    };

    // Glitch effect trigger for Undefined zone
    const isUndefined = voltageClass === 'UNDEFINED';
    
    useEffect(() => {
        if (isUndefined) {
            triggerHaptic('warning');
            playSound('glitch');
            if (isFreezeOnError) setIsPaused(true);
        }
    }, [isUndefined, isFreezeOnError, triggerHaptic, playSound]);

    const DIGITAL_GATE_LEVELS: ConceptLevel[] = [
        {
            title: "Abstraction",
            content: "Digital isn't 'real'-it's a decision. We take messy analog voltages and force them into two boxes: 0 and 1."
        },
        {
            title: "Noise Margin",
            content: "By ignoring small voltage ripples, digital systems can carry data across miles of wire without losing a single bit."
        },
        {
            title: "The Danger Zone",
            content: "What happens between 0 and 1? The 'Undefined' zone. Here, hardware enters a 'metastable' state-unstable, unpredictable, and dangerous for logic."
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
    }, [switchOn]);

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
    const ledGlowProgress = useSpring(ledOn ? 1 : 0, SPRINGS.ORGANIC);
    const ledShadow = useTransform(ledGlowProgress, [0, 1], [
        'none', 
        'drop-shadow(0 0 10px rgba(0,212,255,0.9))'
    ]);
    

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
                    Circuit Lab - Digital Toggle
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
                            stroke={ledOn ? T.accent : T.border} strokeWidth={ledOn ? "2" : "1.5"}
                            style={ledOn ? { filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' } : { opacity: 0.4 }} />
                        {/* Causal Glow - Wire 1 */}
                        <motion.line 
                            x1="36" y1="68" x2="80" y2="68" 
                            stroke={T.accent} strokeWidth="4" 
                            animate={{ opacity: pulseOpacity * 0.4 }}
                            transition={{ duration: DURATIONS.GLOW_TRAVEL }}
                            style={{ filter: 'blur(3px)' }} 
                        />

                        {/* Switch symbol */}
                        <circle cx="90" cy="68" r="3" fill={T.accent} />
                        {/* Switch arm */}
                        <motion.line
                            x1="90" y1="68"
                            x2={switchOn ? "122" : "118"}
                            y2={switchOn ? "68" : "56"}
                            stroke={T.accent} strokeWidth="1.8"
                            style={{ cursor: 'pointer' }}
                            animate={{ x2: switchOn ? 122 : 118, y2: switchOn ? 68 : 56 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            onClick={() => {
                                toggle();
                                triggerHaptic('medium'); // Stronger haptic for switch
                                playSound('snap');
                            }}
                        />
                        <circle cx="124" cy="68" r="3" fill={ledOn ? T.accent : T.muted} />
                        <text x="105" y="84" fill={T.muted} fontSize="7" fontFamily="monospace" textAnchor="middle">
                            SPST
                        </text>

                        {/* Live Voltage Readout in Circuit */}
                        <text x="147" y="58" fill={ledOn ? T.accent : T.muted} fontSize="8" fontFamily={T.mono} textAnchor="middle" style={{ opacity: 0.9, fontWeight: 600 }}>
                            {ledOn ? '5.0V (HIGH)' : '0.0V (LOW)'}
                        </text>
                        <text x="147" y="82" fill={T.muted} fontSize="6" fontFamily={T.mono} textAnchor="middle" style={{ opacity: 0.8 }}>
                            DIGITAL SIGNAL
                        </text>

                        {/* Wire switch → LED */}
                        <line x1="127" y1="68" x2="168" y2="68"
                            stroke={ledOn ? T.accent : T.border} strokeWidth={ledOn ? "2" : "1.5"}
                            style={ledOn ? { filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' } : { opacity: 0.4 }} />
                        {/* Causal Glow - Wire 2 */}
                        <motion.line 
                            x1="127" y1="68" x2="168" y2="68" 
                            stroke={T.accent} strokeWidth="4" 
                            animate={{ opacity: pulseOpacity * 0.4 }}
                            transition={{ duration: DURATIONS.GLOW_TRAVEL, delay: 0.05 }}
                            style={{ filter: 'blur(3px)' }} 
                        />

                        {/* LED */}
                        <circle cx="186" cy="80" r="14" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                        <motion.circle cx="186" cy="80" r="10"
                            fill={ledOn ? 'rgba(0,212,255,0.9)' : 'rgba(0,212,255,0.04)'}
                            animate={{ 
                                x: isUndefined ? [0, -1, 1, -1, 0] : 0,
                                opacity: isGlitching ? 0.2 : 1 
                            }}
                            transition={{ 
                                x: { repeat: Infinity, duration: 0.1 },
                                opacity: { duration: 0.05 }
                            }}
                             style={{ 
                                 filter: ledShadow as any
                             }}
                         />
                         {/* Metastability Tooltip (Failure Intelligence) */}
                         <AnimatePresence>
                             {isUndefined && (
                                 <motion.g
                                     initial={{ opacity: 0, y: -5 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0 }}
                                 >
                                     <rect x="150" y="30" width="80" height="20" rx="2" fill={T.warning} />
                                     <text x="190" y="43" fill="#000" fontSize="6" fontFamily={T.mono} textAnchor="middle" fontWeight="bold">
                                         METASTABLE STATE
                                     </text>
                                     <line x1="186" y1="50" x2="186" y2="66" stroke={T.warning} strokeWidth="1" strokeDasharray="2 2" />
                                 </motion.g>
                             )}
                         </AnimatePresence>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: isGateUnlocked ? 1 : 0.4, transition: '0.3s' }}>
                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Switch Control
                            </span>
                            <VeriButton
                                onClick={toggle}
                                disabled={!isGateUnlocked}
                                variant={ledOn ? 'logic' : 'secondary'}
                                size="md"
                                className="w-full"
                            >
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: ledOn ? T.success : T.error,
                                    boxShadow: `0 0 8px ${ledOn ? T.success : T.error}`,
                                }} />
                                {ledOn ? 'ON - HIGH (5V)' : 'OFF - LOW (0V)'}
                            </VeriButton>
                        </div>

                        {/* Voltage Threshold Visualization */}
                        <div {...focusProps} className={isUndefined ? 'animate-ui-glitch' : ''}>
                             <VeriSlider
                                value={inputVoltage}
                                onChange={setInputVoltage}
                                min={0} max={5}
                                label="Input Voltage Modulation"
                                variant="logic"
                                snaps={[
                                    { value: 0.8, label: 'VIL' },
                                    { value: 2.0, label: 'VIH' },
                                    { value: 5.0, label: 'VCC' }
                                ]}
                            />
                        </div>

                        {/* Noise Slider */}
                        <VeriSlider
                            value={noiseAmp}
                            onChange={setNoiseAmp}
                            min={0} max={10}
                            label="Noise Injection"
                            variant="signal"
                        />
                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: -10 }}>
                            {noiseAmp < 2 ? 'Signal stable - within noise margin' :
                                noiseAmp < 6 ? 'Approaching threshold - caution' :
                                    'Exceeding noise margin - signal corrupted'}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            fontFamily: T.mono, fontSize: 8, color: `${T.success}80`,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>
                            Oscilloscope - CH2 Digital
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <VeriButton
                                onClick={() => { setIsPaused(!isPaused); triggerHaptic('medium'); }}
                                variant={isPaused ? 'primary' : 'secondary'}
                                size="sm"
                                className="!py-1 !px-2 !text-[7px]"
                            >
                                {isPaused ? 'RESUME' : 'PAUSE'}
                            </VeriButton>
                            <VeriButton
                                onClick={() => { setIsEngineerMode(!isEngineerMode); triggerHaptic('heavy'); }}
                                variant={isEngineerMode ? 'logic' : 'secondary'}
                                size="sm"
                                className="!py-1 !px-2 !text-[7px]"
                            >
                                ENGINEER
                            </VeriButton>
                            <VeriButton
                                onClick={() => { setIsFreezeOnError(!isFreezeOnError); triggerHaptic('light'); }}
                                variant={isFreezeOnError ? 'primary' : 'secondary'}
                                size="sm"
                                className="!py-1 !px-2 !text-[7px]"
                            >
                                FREEZE_ON_ERR
                            </VeriButton>
                        </div>
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>TIME/DIV: 100ms</span>
                </div>
                <OscilloscopeCanvas
                    ch1Samples={waveformSamples}
                    showThreshold={true}
                    label1="CH2 - Digital"
                    height={160}
                    isPaused={isPaused}
                    isEngineerMode={isEngineerMode}
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
                        Challenge - Voltage Classification ({quizIdx + 1}/3)
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
                            
                            let variant: 'primary' | 'secondary' | 'logic' | 'signal' | 'ghost' = 'secondary';
                            if (answered) {
                                if (isSelected) {
                                    variant = isCorrect ? 'logic' : 'primary';
                                }
                            }
                            
                            return (
                                <VeriButton 
                                    key={opt}
                                    onClick={() => handleQuizAnswer(opt)}
                                    disabled={!!answered}
                                    variant={variant}
                                    size="sm"
                                    className="flex-1"
                                >
                                    {opt}
                                </VeriButton>
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

            {/* Theory & Recall Overlays */}
            <ConceptOverlay 
                isVisible={showTheory} 
                concept={DIGITAL_CONCEPT} 
                onDismiss={() => setShowTheory(false)} 
            />
            
            <ActiveRecallSystem 
                isVisible={showRecall} 
                question={DIGITAL_RECALL} 
                onAnswer={() => {
                    setShowRecall(false);
                }} 
            />

            <ConceptGate
                title="Digital Logic"
                levels={DIGITAL_GATE_LEVELS}
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
