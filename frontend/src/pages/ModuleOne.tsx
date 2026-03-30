import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Zap,
    CheckCircle2, AlertTriangle,
    Smartphone, Cpu, CarFront, Info, Target,
    Activity, RefreshCw, Battery
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { XPCounter } from '../components/level1/XPCounter';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { useEngagementAdapter as useXPSystem } from '../hooks/useEngagementAdapter';
import { useGamificationStore } from '../stores/gamificationStore';
import { BadgeToast } from '../components/level2/BadgeToast';
import { CircuitLab } from '../circuit-lab/CircuitLab';
import '../components/level1/level1.css';

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════ */

const T = {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    surface: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    accent: '#0EA5E9',
    secondary: '#0D9488',
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    mono: "'JetBrains Mono', 'IBM Plex Mono', monospace",
    sans: "'Inter', system-ui, sans-serif",
} as const;

type Scene = 'intro' | 'theory' | 'lab' | 'quiz' | 'matching' | 'blanks' | 'diagnosis' | 'summary' | 'complete';

interface MatchItem { id: number; text: string; matchId: string; }
interface MatchTarget { id: string; text: string; }

interface Badge { name: string; xp: number; }

const BADGES_MAP: Record<string, Badge> = {
    'loop': { name: 'Loop Initiate', xp: 20 },
    'diagnostic': { name: 'Diagnostic Specialist', xp: 25 },
};

export const ModuleOne: React.FC = () => {
    const navigate = useNavigate();
    const completeSkill = useGamificationStore(state => state.completeSkill);
    const [scene, setScene] = useState<Scene>('intro');
    const [step, setStep] = useState(0);
    const [screenFlash, setScreenFlash] = useState(false);
    const [isXRayMode, setIsXRayMode] = useState(false);
    const [isProbeMode, setIsProbeMode] = useState(false);
    const [isDebugMode, setIsDebugMode] = useState(false);
    // const [probeData, setProbeData] = useState<{ label: string; val: string } | null>(null);

    // Systems
    const { xp, awardXP, registerCounterEl } = useXPSystem();


    // Badge toast state
    const [toast, setToast] = useState<{ show: boolean; badge: Badge }>({
        show: false, badge: { name: '', xp: 0 },
    });
    const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());

    const triggerFlash = useCallback(() => {
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 150);
    }, []);



    const awardBadge = useCallback((key: string) => {
        if (earnedBadges.has(key)) return;
        const badge = BADGES_MAP[key];
        if (!badge) return;
        setEarnedBadges(prev => new Set([...prev, key]));
        setToast({ show: true, badge });
        triggerFlash();
    }, [earnedBadges, triggerFlash]);

    /* ── SCENE 1: INTRO ── */
    const introLines = [
        "Before logic. Before processors.",
        "There is one rule.",
        "Energy must return to its source.",
        "Let's test your understanding."
    ];

    // Labs are now handled by CircuitLab component
    const [labDone, setLabDone] = useState(false);

    /* ── SCENE 3: QUIZ ── */
    const questions = [
        {
            q: "If voltage exists but no current flows, the circuit is:",
            options: ["Open circuit", "Short circuit", "High gain", "Amplified"],
            correct: 0,
            feedback: "Voltage alone does not guarantee flow. The path must be closed."
        },
        {
            q: "If one wire in a working circuit breaks, what happens instantly?",
            options: ["Voltage increases", "Current stops", "Bulb dims slowly", "Battery drains faster"],
            correct: 1,
            feedback: "Current cannot partially flow in a broken loop. It ceases immediately."
        },
        {
            q: "In a simple bulb circuit, current:",
            options: ["Starts at bulb", "Is used up by bulb", "Flows in a closed loop", "Stays inside battery"],
            correct: 2,
            feedback: "Energy is transferred, but current always returns to the source in a closed loop."
        }
    ];

    /* ── SCENE 4: MATCHING ── */
    const sourceItems: MatchItem[] = [
        { id: 1, text: "Source", matchId: "C" },
        { id: 2, text: "Load", matchId: "B" },
        { id: 3, text: "Open Circuit", matchId: "A" },
        { id: 4, text: "Closed Circuit", matchId: "D" },
        { id: 5, text: "Return Path", matchId: "E" },
    ];
    const targetItems: MatchTarget[] = [
        { id: "A", text: "Break in connection" },
        { id: "B", text: "Converts electrical energy" },
        { id: "C", text: "Provides potential difference" },
        { id: "D", text: "Continuous conducting loop" },
        { id: "E", text: "Completes the electrical cycle" },
    ];
    const [matches, setMatches] = useState<Record<number, string>>({});

    /* ── SCENE 5: BLANKS ── */
    const [blankValue, setBlankValue] = useState("");

    /* ── SCENE 6: DIAGNOSIS ── */
    const [diagnosisSelection, setDiagnosisSelection] = useState<number | null>(null);

    /* ── NAVIGATION ── */
    const nextStep = () => {
        if (scene === 'intro') {
            if (step < introLines.length - 1) setStep(s => s + 1);
            else { setScene('theory'); setStep(0); }
        } else if (scene === 'theory') {
            setScene('lab');
        } else if (scene === 'lab') {
            if (labDone) { setScene('quiz'); }
        } else if (scene === 'quiz') {
            if (step < questions.length - 1) {
                setStep(s => s + 1);
            }
            else {
                setStep(0);
                setScene('matching');
            }
        } else if (scene === 'matching') {
            setScene('blanks');
        } else if (scene === 'blanks') {
            setScene('diagnosis');
        } else if (scene === 'diagnosis') {
            setScene('summary');
        } else if (scene === 'summary') {

            setScene('complete');
            completeSkill('signals');
        } else if (scene === 'complete') {
            setScene('intro');
            setStep(0);
        }
    };

    /* ── Enterprise button ── */
    const EnterpriseBtn = useCallback(({ label, onClick, disabled = false }: {
        label: string; onClick: () => void; disabled?: boolean;
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '9px 22px',
                fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'rgba(0,212,255,0.06)',
                border: `1px solid rgba(0, 212, 255, ${disabled ? 0.08 : 0.25})`,
                borderRadius: 2, color: disabled ? 'rgba(0,212,255,0.3)' : T.accent,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.18s, border-color 0.18s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.12)'; }}
            onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.06)'; }}
        >
            {label} <ArrowRight style={{ width: 12, height: 12 }} />
        </button>
    ), []);

    /* ── Event Handlers ── */
    const handleLabWireSnap = () => {
        setLabDone(true);
        awardXP('structural', 15);

        awardBadge('loop');
        triggerFlash();
    };

    const handleQuizAnswer = (idx: number) => {
        const isCorrect = idx === questions[step].correct;
        // recordAnswer(isCorrect);
        // showVoltMonkey('quiz');

        if (isCorrect) {
            awardXP('application', 10);
            triggerFlash();
            setTimeout(nextStep, 1500);
        }
    };

    const handleMatch = (itemId: number, targetId: string) => {
        setMatches(prev => ({ ...prev, [itemId]: targetId }));
    };

    const checkMatches = () => {
        const isCorrect = sourceItems.every(item => matches[item.id] === item.matchId);
        if (isCorrect) {

            awardXP('structural', 15);
            triggerFlash();
            setTimeout(nextStep, 1500);
        }
    };

    const checkBlank = () => {
        const isCorrect = blankValue.toLowerCase().trim() === 'return';
        if (isCorrect) {

            awardXP('application', 10);
            triggerFlash();
            setTimeout(nextStep, 1500);
        }
    };

    const checkDiagnosis = (idx: number) => {
        setDiagnosisSelection(idx);
        const isCorrect = idx === 2; // Short circuit
        if (isCorrect) {

            awardXP('diagnostic', 20);
            awardBadge('diagnostic');
            triggerFlash();
            setTimeout(nextStep, 2000);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', width: '100%',
            display: 'flex', flexDirection: 'column',
            fontFamily: T.sans, background: T.bg, color: T.text,
            overflow: 'hidden'
        }}>
            {/* Screen flash */}
            <AnimatePresence>
                {screenFlash && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,212,255,0.03)',
                            pointerEvents: 'none', zIndex: 9999,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ── Badge Toast ── */}
            <BadgeToast
                show={toast.show}
                badgeName={toast.badge.name}
                xp={toast.badge.xp}
                onDismiss={() => setToast(prev => ({ ...prev, show: false }))}
            />

            {/* ── Header ── */}
            {scene !== 'intro' && scene !== 'complete' && (
                <header style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderBottom: `1px solid ${T.border} `,
                    background: T.bg, position: 'sticky', top: 0, zIndex: 20,
                }}>
                    <button
                        onClick={() => navigate('/portal')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px', borderRadius: 2,
                            border: `1px solid ${T.border} `,
                            background: 'transparent', color: T.muted,
                            fontFamily: T.mono, fontSize: 8,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = T.text; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = T.muted; }}
                    >
                        <ArrowLeft style={{ width: 12, height: 12 }} /> Exit
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Progress */}
                        <ProgressTracker
                            stages={[
                                { id: 'intro', label: 'Concept' },
                                { id: 'theory', label: 'Theory' },
                                { id: 'lab', label: 'Lab' },
                                { id: 'quiz', label: 'Challenge' },
                            ]}
                            activeStageId={scene}
                        />

                        {/* Signal Probe Toggle */}
                        <button
                            onClick={() => { setIsProbeMode(!isProbeMode); setIsXRayMode(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '5px 12px', borderRadius: 2,
                                border: `1px solid ${isProbeMode ? T.secondary : T.border} `,
                                background: isProbeMode ? 'rgba(20,184,166,0.1)' : 'transparent',
                                color: isProbeMode ? T.secondary : T.muted,
                                fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.18em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            <Target size={12} /> PROBE {isProbeMode ? 'ON' : 'OFF'}
                        </button>

                        {/* Debug Assist Toggle (Feature 6) */}
                        <button
                            onClick={() => { setIsDebugMode(!isDebugMode); setIsProbeMode(false); setIsXRayMode(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '5px 12px', borderRadius: 2,
                                border: `1px solid ${isDebugMode ? T.warning : T.border} `,
                                background: isDebugMode ? 'rgba(245,158,11,0.1)' : 'transparent',
                                color: isDebugMode ? T.warning : T.muted,
                                fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.18em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            <AlertTriangle size={12} /> DEBUG {isDebugMode ? 'ON' : 'OFF'}
                        </button>

                        {/* X-Ray Mode Toggle */}
                        <button
                            onClick={() => { setIsXRayMode(!isXRayMode); setIsProbeMode(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '5px 12px', borderRadius: 2,
                                border: `1px solid ${isXRayMode ? T.accent : T.border} `,
                                background: isXRayMode ? 'rgba(0,212,255,0.1)' : 'transparent',
                                color: isXRayMode ? T.accent : T.muted,
                                fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.18em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            <Zap size={12} fill={isXRayMode ? T.accent : 'none'} /> X-RAY {isXRayMode ? 'ON' : 'OFF'}
                        </button>

                        <XPCounter total={xp.total} registerEl={registerCounterEl} breakdown={xp} />
                        <span style={{
                            fontFamily: T.mono, fontSize: 8,
                            letterSpacing: '0.16em', color: T.muted, textTransform: 'uppercase',
                        }}>
                            Lvl 1 — Closed Loops
                        </span>
                    </div>
                </header>
            )}

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <main style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: scene === 'intro' || scene === 'complete' ? 0 : '32px 24px',
                        maxWidth: scene === 'intro' || scene === 'complete' ? 'none' : 960,
                        width: '100%', margin: '0 auto', minHeight: '100%'
                    }}>
                        <AnimatePresence mode="wait">

                            {/* ── SCENE 1: INTRO ── */}
                            {scene === 'intro' && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    style={{
                                        minHeight: '100vh', width: '100%',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        padding: '48px 24px', position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: `
linear - gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
    linear - gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px)
        `,
                                        backgroundSize: '40px 40px', pointerEvents: 'none',
                                    }} />

                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        style={{
                                            fontFamily: T.mono, fontSize: 8,
                                            letterSpacing: '0.3em', textTransform: 'uppercase',
                                            color: `${T.accent} 80`, marginBottom: 16,
                                        }}
                                    >
                                        Level 01 · Signal Must Return
                                    </motion.div>

                                    <motion.h1
                                        key={step}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.5 }}
                                        style={{
                                            fontSize: 'clamp(32px, 5vw, 48px)',
                                            fontWeight: 700, textAlign: 'center',
                                            letterSpacing: '-0.02em', marginBottom: 48,
                                            background: `linear - gradient(135deg, ${T.text} 0 %, ${T.accent} 100 %)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            maxWidth: 600
                                        }}
                                    >
                                        "{introLines[step]}"
                                    </motion.h1>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                        style={{ display: 'flex', gap: 12, zIndex: 10 }}
                                    >
                                        {step === introLines.length - 1 ? (
                                            <EnterpriseBtn label="Enter Laboratory" onClick={nextStep} />
                                        ) : (
                                            <EnterpriseBtn label="Next" onClick={nextStep} />
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ── SCENE 1.5: THEORY ── */}
                            {scene === 'theory' && (
                                <motion.div key="theory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%', maxWidth: 860 }}>
                                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                                        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${T.accent}99`, marginBottom: 6 }}>Module 1.1 — Fundamentals</span>
                                        <h1 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.01em', color: T.text, marginBottom: 8 }}>The Nature of Signals</h1>
                                        <p style={{ color: T.muted }}>Before logic gates and processors, you must master the complete path.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
                                        {/* Block 1 */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, padding: 24, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
                                            <div>
                                                <h2 style={{ fontSize: 18, color: T.text, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={18} color={T.accent} /> What is a signal?</h2>
                                                <p style={{ color: T.muted, lineHeight: 1.6, fontSize: 14 }}>A signal is a physical quantity—like voltage or current—that changes over time to transmit power or information. In digital systems, we interpret these changes as binary states.</p>
                                            </div>
                                            <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Engineering Insight</span>
                                                <p style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>Even in "digital" electronics, signals are fundamentally analog waves governed by physics. There is no perfect 1 or 0 in the real world.</p>
                                            </div>
                                        </div>

                                        {/* Block 2 */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, padding: 24, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
                                            <div>
                                                <h2 style={{ fontSize: 18, color: T.text, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={18} color={T.warning} /> Signal flow in circuits</h2>
                                                <p style={{ color: T.muted, lineHeight: 1.6, fontSize: 14 }}>Electricity is driven by a potential difference (voltage) provided by a source. When a complete path is formed, charge carriers flow to balance this difference, continuously transferring energy to the load.</p>
                                            </div>
                                            <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Engineering Insight</span>
                                                <p style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>While electrons physically drift very slowly (millimeters per second), the electromagnetic energy wave propagates near the speed of light.</p>
                                            </div>
                                        </div>

                                        {/* Block 3 */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, padding: 24, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
                                            <div>
                                                <h2 style={{ fontSize: 18, color: T.text, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><RefreshCw size={18} color={T.success} /> Closed Loop Rule</h2>
                                                <p style={{ color: T.muted, lineHeight: 1.6, fontSize: 14 }}>Current always flows in a complete, unbroken loop. If there is a break anywhere in the path—no matter how small—the entire steady-state flow of current stops instantaneously across the entire circuit.</p>
                                            </div>
                                            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.success, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Engineering Insight</span>
                                                <p style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>A circuit without a return path acts like an antenna. Without a loop, no reliable, steady transfer of energy or information can occur.</p>
                                            </div>
                                        </div>

                                        {/* Block 4 */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24, padding: 24, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
                                            <div>
                                                <h2 style={{ fontSize: 18, color: T.text, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Battery size={18} color={T.accent} /> Why current must return</h2>
                                                <p style={{ color: T.muted, lineHeight: 1.6, fontSize: 14 }}>Charge cannot accumulate indefinitely at a component. Every electron leaving the negative terminal of a source must eventually be matched by one returning to its positive terminal to maintain equilibrium.</p>
                                            </div>
                                            <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Engineering Insight</span>
                                                <p style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>In high-speed PCB design, poor return paths are the #1 cause of interference, ground bounce, and EMI failures. Always route the return path carefully.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <EnterpriseBtn label="Enter Laboratory" onClick={nextStep} />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SCENE 2: LAB ── */}
                            {scene === 'lab' && (
                                <motion.div key="lab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                                        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${T.accent} 99`, marginBottom: 6 }}>Module 1.1 — Laboratory</span>
                                        <h1 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.01em', color: T.text, marginBottom: 8 }}>The Circuit Lab</h1>
                                        <p style={{ color: T.muted }}>Complete the path to energy's return.</p>
                                    </div>

                                    <div style={{
                                        height: 580,
                                        borderRadius: 24,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: `1px solid ${T.border} `
                                    }}>
                                        <CircuitLab
                                            standalone={false}
                                            onCircuitComplete={handleLabWireSnap}
                                        />
                                    </div>

                                    {labDone && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                            <EnterpriseBtn label="Proceed to Theory Checkout" onClick={nextStep} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── SCENE 3: QUIZ ── */}
                            {scene === 'quiz' && (
                                <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: 640 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.surface, padding: 16, borderRadius: 8, border: `1px solid ${T.border} `, marginBottom: 32 }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.1em', color: T.muted, textTransform: 'uppercase' }}>Checkpoint {step + 1}/{questions.length}</span>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {questions.map((_, i) => (
                                                <div key={i} style={{ height: 4, width: 32, borderRadius: 2, background: i <= step ? T.accent : T.border }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                        <h2 style={{ fontSize: 24, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>{questions[step].q}</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                            {questions[step].options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuizAnswer(idx)}
                                                    style={{
                                                        padding: 16, textAlign: 'left', borderRadius: 8,
                                                        border: `1px solid ${T.border} `, background: T.card,
                                                        color: T.text, cursor: 'pointer', transition: 'all 0.2s',
                                                        display: 'flex', alignItems: 'center', gap: 16
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.borderColor = T.accent)}
                                                    onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
                                                >
                                                    <div style={{ width: 32, height: 32, borderRadius: 6, background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 12, color: T.accent }}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SCENE 4: MATCHING ── */}
                            {scene === 'matching' && (
                                <motion.div key="matching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', maxWidth: 800 }}>
                                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                                        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${T.accent} 99`, marginBottom: 6 }}>Module 1.4 — Structural Synthesis</span>
                                        <h1 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.01em', color: T.text, marginBottom: 8 }}>Structural Thinking</h1>
                                        <p style={{ color: T.muted }}>Match the components to their structural role.</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {sourceItems.map(item => {
                                                const isMatched = !!matches[item.id];
                                                return (
                                                    <div key={item.id} style={{
                                                        padding: 16, borderRadius: 8,
                                                        border: `1px solid ${isMatched ? T.accent : T.border} `,
                                                        background: isMatched ? 'rgba(0,212,255,0.08)' : T.card,
                                                        color: isMatched ? T.accent : T.text,
                                                        position: 'relative'
                                                    }}>
                                                        {item.text}
                                                        {isMatched && (
                                                            <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: T.accent, color: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: T.mono }}>{matches[item.id]}</div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {targetItems.map(target => (
                                                <div key={target.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, border: '1px solid rgba(0,212,255,0.2)', color: T.accent }}>{target.id}</div>
                                                    <button
                                                        onClick={() => {
                                                            const nextUnmatched = sourceItems.find(s => !matches[s.id]);
                                                            if (nextUnmatched) handleMatch(nextUnmatched.id, target.id);
                                                        }}
                                                        style={{ flex: 1, padding: 16, textAlign: 'left', borderRadius: 8, border: `1px solid ${T.border} `, background: T.card, color: T.text, cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => (e.currentTarget.style.borderColor = T.accent)}
                                                        onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
                                                    >
                                                        {target.text}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                                        <EnterpriseBtn label="VERIFY STRUCTURE" onClick={checkMatches} disabled={Object.keys(matches).length < 5} />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SCENE 5: BLANKS ── */}
                            {scene === 'blanks' && (
                                <motion.div key="blanks" style={{ width: '100%', maxWidth: 640, textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${T.accent} 99`, marginBottom: 6 }}>Module 1.5 — Synthesis</span>
                                    <h2 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.6, color: T.text, marginBottom: 48 }}>
                                        In a working circuit, current must leave the source and <br />
                                        <span style={{ display: 'inline-block', borderBottom: `2px solid ${T.accent} `, margin: '0 8px' }}>
                                            <input type="text" placeholder="......" value={blankValue} onChange={e => setBlankValue(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', textAlign: 'center', width: 120, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.accent }} />
                                        </span>
                                        to it.
                                    </h2>
                                    <EnterpriseBtn label="CONFIRM CONCEPT" onClick={checkBlank} disabled={blankValue.length < 3} />
                                </motion.div>
                            )}

                            {/* ── SCENE 6: DIAGNOSIS ── */}
                            {scene === 'diagnosis' && (
                                <motion.div key="diagnosis" style={{ width: '100%', maxWidth: 900 }}>
                                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                                        <h1 style={{ fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.01em', color: T.text, marginBottom: 8 }}>Safe Systems Diagnosis</h1>
                                        <p style={{ color: T.muted }}>Pick the diagram that represents a dangerous failure.</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                                        {[
                                            { label: 'Proper Loop', detail: 'Ideal path', icon: CheckCircle2, color: T.success },
                                            { label: 'Open Loop', detail: 'Break in line', icon: AlertTriangle, color: T.warning },
                                            { label: 'Short Circuit', detail: 'Bypasses load', icon: Zap, color: T.error }
                                        ].map((sys, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => checkDiagnosis(idx)}
                                                style={{
                                                    padding: 32, borderRadius: 16,
                                                    border: `2px solid ${diagnosisSelection === idx ? T.accent : T.border} `,
                                                    background: diagnosisSelection === idx ? 'rgba(0,212,255,0.08)' : T.card,
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
                                                    cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ width: 64, height: 64, borderRadius: 12, background: `${sys.color} 20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sys.color }}>
                                                    <sys.icon size={32} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{sys.label}</h3>
                                                    <p style={{ fontSize: 10, fontFamily: T.mono, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, color: T.text }}>{sys.detail}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SCENE 7: SUMMARY ── */}
                            {scene === 'summary' && (
                                <motion.div key="summary" style={{ width: '100%', maxWidth: 840 }}>
                                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                                        <h1 style={{ fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em', color: T.text, marginBottom: 8 }}>SYSTEM ARCHITECTURE RECAP</h1>
                                        <p style={{ color: T.muted, fontSize: 18 }}>Return path integrity defines reliability.</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 48 }}>
                                        {[
                                            {
                                                title: 'Smartphone',
                                                icon: Smartphone,
                                                desc: 'Ground line break = No power even if battery is full.',
                                                insight: 'Mobile devices use multi-layer return paths for thermal efficiency.'
                                            },
                                            {
                                                title: 'PCB Failure',
                                                icon: Cpu,
                                                desc: 'Microscopic trace snap = Entire motherboard fails.',
                                                insight: 'Automated optical inspection (AOI) catches return path breaks.'
                                            },
                                            {
                                                title: 'Electric Vehicle',
                                                icon: CarFront,
                                                desc: 'Loose return path = Catastrophic pack failure.',
                                                insight: 'EV systems monitor isolation resistance to detect path faults.'
                                            }
                                        ].map((item, idx) => (
                                            <div key={idx} style={{
                                                padding: 24, borderRadius: 12, border: `1px solid ${T.border} `,
                                                background: T.surface, display: 'flex', flexDirection: 'column',
                                                gap: 12, position: 'relative', overflow: 'hidden'
                                            }}>
                                                <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: '100%', background: T.accent }} />
                                                <item.icon size={24} style={{ color: T.accent }} />
                                                <h3 style={{ fontWeight: 600, color: T.text, fontSize: 16 }}>{item.title}</h3>
                                                <p style={{ fontSize: 13, lineHeight: 1.5, color: T.muted }}>{item.desc}</p>
                                                <div style={{
                                                    marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${T.border} `,
                                                    fontSize: 10, fontFamily: T.mono, color: `${T.accent} 80`,
                                                    lineHeight: 1.4, letterSpacing: '0.02em'
                                                }}>
                                                    // ENGINEER INSIGHT:<br />
                                                    {item.insight}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ padding: 32, borderRadius: 16, background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', position: 'relative', overflow: 'hidden', marginBottom: 48 }}>
                                        <Info size={160} style={{ position: 'absolute', right: -32, top: -32, opacity: 0.1, transform: 'rotate(12deg)', color: T.accent }} />
                                        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            <h3 style={{ fontSize: 10, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.2em', color: T.accent }}>Project Trivia</h3>
                                            <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.6, color: T.text }}>
                                                "Did you know? In early space missions, microscopic wiring faults caused system failures worth millions of dollars."
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <EnterpriseBtn label="Finish Journey" onClick={nextStep} />
                                    </div>
                                </motion.div>
                            )}

                            {/* ── FINAL COMPLETION ── */}
                            {scene === 'complete' && (
                                <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '64px 0' }}>
                                    <div style={{ marginBottom: 48 }}>
                                        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em', background: `linear - gradient(135deg, ${T.text} 0 %, ${T.accent} 100 %)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            "MODULE CLEARED"
                                        </h1>
                                        <p style={{ fontSize: 18, color: T.muted, maxWidth: 480, margin: '24px auto', lineHeight: 1.6 }}>
                                            You now understand the foundation. Every digital system you will build rests on this rule.
                                        </p>
                                    </div>
                                    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'inline-block', marginBottom: 48 }}>
                                        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Aspirational Goal</p>
                                        <p style={{ fontSize: 16, fontStyle: 'italic', color: T.text }}>"Next, we introduce control."</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => navigate('/portal')}
                                            style={{
                                                padding: '16px 32px', borderRadius: 8, background: T.card,
                                                border: `1px solid ${T.border} `, color: T.text, fontWeight: 600,
                                                letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                                        >
                                            BACK TO STATION MAP
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </main>
                </div>


            </div>
        </div>
    );
};
