import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, Cpu, Zap, Target, AlertTriangle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Level 2 components
import { AnalogLab } from '../components/level2/AnalogLab';
import { DigitalLab } from '../components/level2/DigitalLab';
import { NoiseExperiment } from '../components/level2/NoiseExperiment';
import { SignalRegenerator } from '../components/level2/SignalRegenerator';
import { BadgeToast } from '../components/level2/BadgeToast';
import '../components/level2/level2.css';

// Shared Level 1 systems
import { VoltMonkeyPanel } from '../components/level1/VoltMonkeyPanel';
import { XPCounter } from '../components/level1/XPCounter';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { useXPSystem } from '../hooks/useXPSystem';
import { useVoltMonkeyMentorL2 } from '../hooks/useVoltMonkeyMentorL2';

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════ */

const T = {
    bg: '#0A0B10',
    card: '#0D0F16',
    surface: '#1A1D24',
    border: '#1A1D24',
    text: '#E5E7EB',
    muted: '#94A3B8',
    accent: '#00D4FF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    analog: '#A78BFA',
    digital: '#34D399',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════ */

type Scene = 'intro' | 'analog' | 'digital' | 'comparison' | 'advanced' | 'summary' | 'complete';

interface Badge { name: string; xp: number; }


const BADGES_MAP: Record<string, Badge> = {
    analog: { name: 'Analog Explorer', xp: 10 },
    digital: { name: 'Digital Discoverer', xp: 10 },
    comparison: { name: 'Comparison Master', xp: 10 },
    advanced: { name: 'Digital Advocate', xp: 15 },
};

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════ */

export const ModuleTwo: React.FC = () => {
    const navigate = useNavigate();
    const [scene, setScene] = useState<Scene>('intro');
    const [screenFlash, setScreenFlash] = useState(false);

    // Systems
    const { xp, awardXP, registerCounterEl } = useXPSystem();
    const { recordAnswer, getResponse } = useVoltMonkeyMentorL2();
    const [VoltMonkeyResponse, setVoltMonkeyResponse] = useState<ReturnType<typeof getResponse> | null>(null);

    // Engineering Tools (Features 1, 5, 6, 9)
    const [isXRayMode, setIsXRayMode] = useState(false);
    const [isProbeMode, setIsProbeMode] = useState(false);
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [isPathMode, setIsPathMode] = useState(false);
    const [isGraphMode, setIsGraphMode] = useState(false);
    const [probeData, setProbeData] = useState<{ label: string; val: string } | null>(null);

    // Badge toast state
    const [toast, setToast] = useState<{ show: boolean; badge: Badge }>({
        show: false, badge: { name: '', xp: 0 },
    });

    // Earned badges
    const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());

    // Binary rain chars for complete scene
    const binaryCharsRef = useRef<Array<{ x: number; delay: number; dur: number; char: string }>>([]);
    useEffect(() => {
        binaryCharsRef.current = Array.from({ length: 40 }, () => ({
            x: Math.random() * 100,
            delay: Math.random() * 3,
            dur: 1.5 + Math.random() * 2,
            char: Math.random() > 0.5 ? '1' : '0',
        }));
    }, []);

    const triggerFlash = useCallback(() => {
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 150);
    }, []);

    const showVoltMonkey = useCallback((ctx: Parameters<typeof getResponse>[0]) => {
        setVoltMonkeyResponse(getResponse(ctx));
    }, [getResponse]);

    const awardBadge = useCallback((key: string) => {
        if (earnedBadges.has(key)) return;
        const badge = BADGES_MAP[key];
        setEarnedBadges(prev => new Set([...prev, key]));
        setToast({ show: true, badge });
        triggerFlash();
    }, [earnedBadges, triggerFlash]);

    /* ── Module completion handlers ── */
    const handleAnalogComplete = useCallback((xpAmount: number) => {
        awardXP('structural', xpAmount);
        recordAnswer(true);
        showVoltMonkey('analog');
        awardBadge('analog');
    }, [awardXP, recordAnswer, showVoltMonkey, awardBadge]);

    const handleDigitalComplete = useCallback((xpAmount: number) => {
        awardXP('structural', xpAmount);
        recordAnswer(true);
        showVoltMonkey('digital');
        awardBadge('digital');
    }, [awardXP, recordAnswer, showVoltMonkey, awardBadge]);

    const handleComparisonComplete = useCallback((xpAmount: number) => {
        awardXP('application', xpAmount);
        recordAnswer(true);
        showVoltMonkey('comparison');
        awardBadge('comparison');
    }, [awardXP, recordAnswer, showVoltMonkey, awardBadge]);

    const handleAdvancedComplete = useCallback((xpAmount: number) => {
        awardXP('diagnostic', xpAmount);
        recordAnswer(true);
        showVoltMonkey('advanced');
        awardBadge('advanced');
    }, [awardXP, recordAnswer, showVoltMonkey, awardBadge]);

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
                border: `1px solid rgba(0,212,255,${disabled ? '0.08' : '0.25'})`,
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


    /* ═══════════════════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════════════════ */

    return (
        <div style={{
            minHeight: '100vh', width: '100%',
            display: 'flex', flexDirection: 'column',
            fontFamily: T.sans, background: T.bg, color: T.text,
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
                    padding: '14px 24px',
                    borderBottom: `1px solid ${T.border}`,
                    background: T.bg,
                    position: 'sticky', top: 0, zIndex: 20,
                }}>
                    <button
                        onClick={() => navigate('/portal')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px', borderRadius: 2,
                            border: `1px solid ${T.border}`,
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center' }}>
                        {/* Toolset Toggles */}
                        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.2)', padding: 3, borderRadius: 4, border: `1px solid ${T.border}` }}>
                            <button
                                onClick={() => { setIsProbeMode(!isProbeMode); setIsXRayMode(false); setIsDebugMode(false); setIsPathMode(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 12px', borderRadius: 2,
                                    border: `1px solid ${isProbeMode ? T.accent : 'transparent'}`,
                                    background: isProbeMode ? 'rgba(0,212,255,0.1)' : 'transparent',
                                    color: isProbeMode ? T.accent : T.muted,
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <Target size={12} /> PROBE
                            </button>
                            <button
                                onClick={() => { setIsDebugMode(!isDebugMode); setIsProbeMode(false); setIsXRayMode(false); setIsPathMode(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 12px', borderRadius: 2,
                                    border: `1px solid ${isDebugMode ? T.warning : 'transparent'}`,
                                    background: isDebugMode ? 'rgba(245,158,11,0.1)' : 'transparent',
                                    color: isDebugMode ? T.warning : T.muted,
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <AlertTriangle size={12} /> DEBUG
                            </button>
                            <button
                                onClick={() => { setIsXRayMode(!isXRayMode); setIsProbeMode(false); setIsDebugMode(false); setIsPathMode(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 12px', borderRadius: 2,
                                    border: `1px solid ${isXRayMode ? T.accent : 'transparent'}`,
                                    background: isXRayMode ? 'rgba(0,212,255,0.1)' : 'transparent',
                                    color: isXRayMode ? T.accent : T.muted,
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <Zap size={12} /> X-RAY
                            </button>
                            <button
                                onClick={() => { setIsPathMode(!isPathMode); setIsProbeMode(false); setIsDebugMode(false); setIsXRayMode(false); setIsGraphMode(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 12px', borderRadius: 2,
                                    border: `1px solid ${isPathMode ? T.analog : 'transparent'}`,
                                    background: isPathMode ? 'rgba(167,139,250,0.1)' : 'transparent',
                                    color: isPathMode ? T.analog : T.muted,
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <Share2 size={12} /> PATH
                            </button>
                            <button
                                onClick={() => { setIsGraphMode(!isGraphMode); setIsProbeMode(false); setIsDebugMode(false); setIsXRayMode(false); setIsPathMode(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 12px', borderRadius: 2,
                                    border: `1px solid ${isGraphMode ? T.success : 'transparent'}`,
                                    background: isGraphMode ? 'rgba(16,185,129,0.1)' : 'transparent',
                                    color: isGraphMode ? T.success : T.muted,
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.18em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <Cpu size={12} /> GRAPH
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Progress */}
                        <ProgressTracker
                            stages={[
                                { id: 'intro', label: 'Concept' },
                                { id: 'analog', label: 'Analog Lab' },
                                { id: 'digital', label: 'Digital Lab' },
                                { id: 'comparison', label: 'Comparison' },
                                { id: 'advanced', label: 'Advanced' }
                            ]}
                            activeStageId={scene}
                        />
                        <XPCounter total={xp.total} registerEl={registerCounterEl} breakdown={xp} />
                        <span style={{
                            fontFamily: T.mono, fontSize: 8,
                            letterSpacing: '0.16em', color: T.muted, textTransform: 'uppercase',
                        }}>
                            Lvl 2 — Signal Representation
                        </span>
                    </div>
                </header>
            )}

            {/* ── VoltMonkey Mentor ── */}
            {scene !== 'intro' && scene !== 'complete' && (
                <VoltMonkeyPanel response={VoltMonkeyResponse} />
            )}

            {/* ── Probe Tooltip Overlay ── */}
            <AnimatePresence>
                {probeData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        style={{
                            position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
                            background: 'rgba(15, 23, 42, 0.95)', border: `1px solid ${T.accent}`,
                            padding: '12px 20px', borderRadius: 8, zIndex: 1000, pointerEvents: 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            boxShadow: `0 0 20px ${T.accent}40`, backdropFilter: 'blur(8px)',
                        }}
                    >
                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{probeData.label}</div>
                        <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 'bold', color: T.text }}>{probeData.val}</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                padding: scene === 'intro' || scene === 'complete' ? 0 : '32px 24px',
                maxWidth: scene === 'intro' || scene === 'complete' ? 'none' : 960,
                width: '100%', margin: '0 auto',
            }}>
                <AnimatePresence mode="wait">

                    {/* ══════════════════════════════════════════════════════
                        SCENE 1: INTRO — Cinematic signal world reveal
                    ══════════════════════════════════════════════════════ */}
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
                                padding: '48px 24px',
                                position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {/* Background grid */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundImage: `
                                    linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                                pointerEvents: 'none',
                            }} />

                            {/* Animated signal SVG */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                style={{ marginBottom: 48, position: 'relative' }}
                            >
                                <svg width="360" height="120" viewBox="0 0 360 120">
                                    {/* Analog sine — cyan */}
                                    <path
                                        d="M0,60 C22,10 44,110 66,60 C88,10 110,110 132,60 C154,10 176,110 198,60 C220,10 242,110 264,60 C286,10 308,110 330,60 C352,10 360,60 360,60"
                                        fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.8"
                                        className="waveform-animated"
                                    />
                                    {/* Digital square — green */}
                                    <path
                                        d="M0,90 L0,90 L60,90 L60,30 L120,30 L120,90 L180,90 L180,30 L240,30 L240,90 L300,90 L300,30 L360,30 L360,90"
                                        fill="none" stroke="#34D399" strokeWidth="2" opacity="0.8"
                                        className="waveform-animated"
                                        style={{ animationDelay: '0.4s' }}
                                    />
                                    {/* Labels */}
                                    <text x="8" y="20" fill="#00D4FF" fontSize="9" fontFamily="monospace">Analog</text>
                                    <text x="8" y="112" fill="#34D399" fontSize="9" fontFamily="monospace">Digital</text>
                                </svg>
                            </motion.div>

                            {/* Level designation */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                style={{
                                    fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.3em', textTransform: 'uppercase',
                                    color: `${T.accent}80`, marginBottom: 16,
                                }}
                            >
                                Level 02 · Signal Representation
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                style={{
                                    fontSize: 'clamp(32px, 5vw, 48px)',
                                    fontWeight: 700, textAlign: 'center',
                                    letterSpacing: '-0.02em', marginBottom: 16,
                                    background: `linear-gradient(135deg, ${T.text} 0%, ${T.accent} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Continuous vs Discrete
                            </motion.h1>

                            {/* VoltMonkey narration */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                style={{
                                    maxWidth: 480, textAlign: 'center',
                                    marginBottom: 48,
                                }}
                            >
                                {[
                                    { text: 'Nature speaks in smooth curves.', delay: 0.6 },
                                    { text: 'Machines think in sharp edges.', delay: 0.85 },
                                    { text: 'This level bridges the two worlds.', delay: 1.1, accent: true },
                                ].map(({ text, delay, accent }, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay, duration: 0.4 }}
                                        style={{
                                            fontSize: accent ? 20 : 16,
                                            fontWeight: accent ? 500 : 400,
                                            color: accent ? T.accent : T.muted,
                                            marginBottom: accent ? 0 : 4,
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        {text}
                                    </motion.p>
                                ))}
                            </motion.div>

                            {/* Module overview chips */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.4 }}
                                style={{
                                    display: 'flex', gap: 8, flexWrap: 'wrap',
                                    justifyContent: 'center', marginBottom: 40,
                                }}
                            >
                                {[
                                    { label: '2.1 — Analog World', color: T.analog },
                                    { label: '2.2 — Digital World', color: T.digital },
                                    { label: '2.3 — Head-to-Head', color: T.accent },
                                    { label: '2.4 — Why Digital Wins', color: T.warning },
                                ].map(chip => (
                                    <div key={chip.label} style={{
                                        padding: '5px 12px',
                                        border: `1px solid ${chip.color}30`,
                                        borderRadius: 2, background: `${chip.color}08`,
                                        fontFamily: T.mono, fontSize: 8,
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        color: chip.color,
                                    }}>
                                        {chip.label}
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4, duration: 0.4 }}
                                style={{ display: 'flex', gap: 12 }}
                            >
                                <button
                                    onClick={() => navigate('/portal')}
                                    style={{
                                        padding: '11px 24px',
                                        fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                                        textTransform: 'uppercase', background: 'transparent',
                                        border: `1px solid ${T.border}`, borderRadius: 2,
                                        color: T.muted, cursor: 'pointer',
                                    }}
                                >
                                    Return to Portal
                                </button>
                                <button
                                    onClick={() => { awardXP('structural'); setScene('analog'); }}
                                    style={{
                                        padding: '11px 28px',
                                        fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        background: 'rgba(0,212,255,0.07)',
                                        border: '1px solid rgba(0,212,255,0.3)',
                                        borderRadius: 2, color: T.accent, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        transition: 'background 0.18s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.13)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.07)'}
                                >
                                    Enter Laboratory <ArrowRight style={{ width: 14, height: 14 }} />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 2: ANALOG LAB — Module 2.1
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'analog' && (
                        <motion.div
                            key="analog"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
                        >
                            <div>
                                <span style={{
                                    display: 'block', fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.22em', textTransform: 'uppercase',
                                    color: `${T.analog}99`, marginBottom: 6,
                                }}>
                                    Module 2.1 — Analog World
                                </span>
                                <h1 style={{
                                    fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600,
                                    letterSpacing: '-0.01em', color: T.text, marginBottom: 8,
                                }}>
                                    The Smooth World
                                </h1>
                                <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: '65ch' }}>
                                    Analog signals can take any value between their limits — infinite resolution,
                                    direct physical mapping. Adjust the potentiometer to explore continuous voltage control.
                                </p>
                            </div>

                            <AnalogLab
                                onComplete={handleAnalogComplete}
                                isXRayMode={isXRayMode}
                                isProbeMode={isProbeMode}
                                isDebugMode={isDebugMode}
                                isPathMode={isPathMode}
                                setProbeData={setProbeData}
                            />

                            {earnedBadges.has('analog') && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <EnterpriseBtn label="Proceed to Digital Module" onClick={() => setScene('digital')} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 3: DIGITAL LAB — Module 2.2
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'digital' && (
                        <motion.div
                            key="digital"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
                        >
                            <div>
                                <span style={{
                                    display: 'block', fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.22em', textTransform: 'uppercase',
                                    color: `${T.digital}99`, marginBottom: 6,
                                }}>
                                    Module 2.2 — Digital World
                                </span>
                                <h1 style={{
                                    fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600,
                                    letterSpacing: '-0.01em', color: T.text, marginBottom: 8,
                                }}>
                                    The Discrete World
                                </h1>
                                <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: '65ch' }}>
                                    Digital signals exist in exactly two states. Toggle the switch and observe
                                    how the system collapses infinite analog space into binary decisions.
                                </p>
                            </div>

                            <DigitalLab
                                onComplete={handleDigitalComplete}
                                isXRayMode={isXRayMode}
                                isProbeMode={isProbeMode}
                                isDebugMode={isDebugMode}
                                isPathMode={isPathMode}
                                setProbeData={setProbeData}
                            />

                            {earnedBadges.has('digital') && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <EnterpriseBtn label="Head-to-Head Comparison" onClick={() => setScene('comparison')} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 4: COMPARISON — Module 2.3
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'comparison' && (
                        <motion.div
                            key="comparison"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
                        >
                            <div>
                                <span style={{
                                    display: 'block', fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.22em', textTransform: 'uppercase',
                                    color: `${T.accent}99`, marginBottom: 6,
                                }}>
                                    Module 2.3 — Head-to-Head
                                </span>
                                <h1 style={{
                                    fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600,
                                    letterSpacing: '-0.01em', color: T.text, marginBottom: 8,
                                }}>
                                    Analog vs Digital Under Noise
                                </h1>
                                <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: '65ch' }}>
                                    Increase noise and observe how analog and digital systems respond differently.
                                    This is the core reason digital dominates modern electronics.
                                </p>
                            </div>

                            <NoiseExperiment onComplete={handleComparisonComplete} />

                            {earnedBadges.has('comparison') && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}
                                >
                                    <button
                                        onClick={() => setScene('summary')}
                                        style={{
                                            padding: '9px 20px',
                                            fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                                            textTransform: 'uppercase', background: 'transparent',
                                            border: `1px solid ${T.border}`, borderRadius: 2,
                                            color: T.muted, cursor: 'pointer',
                                        }}
                                    >
                                        Skip Advanced
                                    </button>
                                    <EnterpriseBtn label="Advanced: Why Digital Wins" onClick={() => setScene('advanced')} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 5: ADVANCED — Module 2.4
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'advanced' && (
                        <motion.div
                            key="advanced"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
                        >
                            <div>
                                <span style={{
                                    display: 'block', fontFamily: T.mono, fontSize: 8,
                                    letterSpacing: '0.22em', textTransform: 'uppercase',
                                    color: `${T.warning}99`, marginBottom: 6,
                                }}>
                                    Module 2.4 — Advanced (Optional)
                                </span>
                                <h1 style={{
                                    fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600,
                                    letterSpacing: '-0.01em', color: T.text, marginBottom: 8,
                                }}>
                                    Why Digital Dominates
                                </h1>
                                <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: '65ch' }}>
                                    The killer feature of digital: perfect regeneration at every gate.
                                    Observe how a buffer strips noise completely — preserving only the logical state.
                                </p>
                            </div>

                            <SignalRegenerator onComplete={handleAdvancedComplete} />

                            {earnedBadges.has('advanced') && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <EnterpriseBtn label="View Summary" onClick={() => setScene('summary')} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 6: SUMMARY
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'summary' && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%', maxWidth: 640 }}
                        >
                            <span style={{
                                display: 'block', fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.22em', textTransform: 'uppercase',
                                color: `${T.accent}99`, marginBottom: 6,
                            }}>
                                Level 2 Summary
                            </span>
                            <h1 style={{
                                fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: 600,
                                color: T.text, marginBottom: 24, letterSpacing: '-0.01em',
                            }}>
                                Signal Representation Mastery
                            </h1>

                            {/* XP Breakdown */}
                            <div style={{
                                border: `1px solid ${T.border}`, borderRadius: 4,
                                overflow: 'hidden', marginBottom: 24,
                            }}>
                                {[
                                    { label: 'Module 2.1 — Analog Explorer', cat: 'structural', xpVal: 10, badge: 'Analog Explorer', earned: earnedBadges.has('analog') },
                                    { label: 'Module 2.2 — Digital Discoverer', cat: 'structural', xpVal: 10, badge: 'Digital Discoverer', earned: earnedBadges.has('digital') },
                                    { label: 'Module 2.3 — Comparison Master', cat: 'application', xpVal: 10, badge: 'Comparison Master', earned: earnedBadges.has('comparison') },
                                    { label: 'Module 2.4 — Digital Advocate', cat: 'diagnostic', xpVal: 15, badge: 'Digital Advocate', earned: earnedBadges.has('advanced') },
                                ].map((row, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        borderBottom: i < 3 ? `1px solid ${T.border}` : 'none',
                                        background: row.earned ? `${T.success}04` : 'transparent',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {row.earned
                                                ? <CheckCircle2 style={{ width: 14, height: 14, color: T.success, flexShrink: 0 }} />
                                                : <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${T.border}`, flexShrink: 0 }} />
                                            }
                                            <div>
                                                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.text }}>{row.label}</div>
                                                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.08em' }}>{row.badge}</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: T.mono, fontSize: 10,
                                            color: row.earned ? T.success : T.muted,
                                        }}>
                                            {row.earned ? `+${row.xpVal} XP` : '—'}
                                        </div>
                                    </div>
                                ))}

                                {/* Total */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderTop: `1px solid ${T.border}`,
                                    background: T.surface,
                                }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.text, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        Total Earned
                                    </span>
                                    <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>
                                        {xp.total} XP
                                    </span>
                                </div>
                            </div>

                            {/* Real-world Cards (Feature 7) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {[
                                    {
                                        title: 'Audio Systems',
                                        icon: FlaskConical,
                                        desc: 'Analog signals are used in high-fidelity audio where infinite resolution is required for sound waves.',
                                        insight: 'High-end DACs (Digital to Analog Converters) try to reconstruct perfect curves.'
                                    },
                                    {
                                        title: 'Microprocessors',
                                        icon: Cpu,
                                        desc: 'CPUs use digital signals to ensure billions of operations per second remain error-free.',
                                        insight: 'Binary states allow for robust computing in electrically noisy environments.'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: 20, borderRadius: 8, border: `1px solid ${T.border}`,
                                        background: T.surface, display: 'flex', flexDirection: 'column',
                                        gap: 10, position: 'relative', overflow: 'hidden',
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: '100%', background: T.accent }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <item.icon size={16} color={T.accent} />
                                            <h3 style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{item.title}</h3>
                                        </div>
                                        <p style={{ fontSize: 12, lineHeight: 1.5, color: T.muted }}>{item.desc}</p>
                                        <div style={{
                                            marginTop: 'auto', paddingTop: 8, borderTop: `1px solid ${T.border}`,
                                            fontSize: 9, fontFamily: T.mono, color: `${T.accent}99`,
                                            lineHeight: 1.4, letterSpacing: '0.02em'
                                        }}>
                                            // ENGINEER INSIGHT:<br />
                                            {item.insight}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar — Signal Representation Mastery */}
                            <div style={{ marginBottom: 32 }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    fontFamily: T.mono, fontSize: 8, color: T.muted,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                                }}>
                                    <span>Signal Representation Mastery</span>
                                    <span>{Math.min(100, Math.round((xp.total / 45) * 100))}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: T.surface, overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (xp.total / 45) * 100)}%` }}
                                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                        style={{ height: '100%', borderRadius: 2, background: T.accent }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <EnterpriseBtn label="Level 3 Awaits" onClick={() => setScene('complete')} />
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        SCENE 7: COMPLETE — Level 3 Teaser
                    ══════════════════════════════════════════════════════ */}
                    {scene === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                minHeight: '100vh', width: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                padding: '48px 24px', position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {/* Binary rain background */}
                            {binaryCharsRef.current.map((c, i) => (
                                <div
                                    key={i}
                                    className="binary-char"
                                    style={{
                                        left: `${c.x}%`,
                                        animationDuration: `${c.dur}s`,
                                        animationDelay: `${c.delay}s`,
                                        opacity: 0.4 + Math.random() * 0.4,
                                    }}
                                >
                                    {c.char}
                                </div>
                            ))}

                            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                {/* The transition visualization */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 24,
                                        justifyContent: 'center', marginBottom: 48,
                                    }}
                                >
                                    {[
                                        { label: 'HIGH', sub: '→ 1', color: T.success },
                                        { label: '&', color: T.muted },
                                        { label: 'LOW', sub: '→ 0', color: T.error },
                                    ].map((item, i) => (
                                        <div key={i} style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontFamily: T.mono, fontSize: item.label === '&' ? 24 : 32,
                                                fontWeight: 700, color: item.color,
                                                textShadow: item.label !== '&'
                                                    ? `0 0 24px ${item.color}60` : 'none',
                                            }}>
                                                {item.label}
                                            </div>
                                            {item.sub && (
                                                <div style={{
                                                    fontFamily: T.mono, fontSize: 14, color: T.accent,
                                                    marginTop: 4, letterSpacing: '0.12em',
                                                }}>
                                                    {item.sub}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <div style={{
                                        fontFamily: T.mono, fontSize: 8, letterSpacing: '0.24em',
                                        textTransform: 'uppercase', color: `${T.accent}80`, marginBottom: 12,
                                    }}>
                                        VoltMonkey — Unlocking Level 3
                                    </div>
                                    <h2 style={{
                                        fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 600,
                                        color: T.text, marginBottom: 12, letterSpacing: '-0.01em',
                                    }}>
                                        "You've seen HIGH and LOW."
                                    </h2>
                                    <p style={{
                                        fontSize: 18, color: T.muted, marginBottom: 40,
                                        lineHeight: 1.7, maxWidth: '42ch', margin: '0 auto 40px',
                                    }}>
                                        Next we give them names — <span style={{ color: T.accent }}>1</span> and{' '}
                                        <span style={{ color: T.accent }}>0</span>.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                    style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}
                                >
                                    <button
                                        onClick={() => navigate('/portal')}
                                        style={{
                                            padding: '11px 24px',
                                            fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                                            textTransform: 'uppercase', background: 'transparent',
                                            border: `1px solid ${T.border}`, borderRadius: 2,
                                            color: T.muted, cursor: 'pointer',
                                        }}
                                    >
                                        Return to Portal
                                    </button>
                                    <button
                                        onClick={() => navigate('/module/3')}
                                        style={{
                                            padding: '11px 28px',
                                            fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            background: 'rgba(0,212,255,0.07)',
                                            border: '1px solid rgba(0,212,255,0.3)',
                                            borderRadius: 2, color: T.accent, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            transition: 'background 0.18s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.13)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.07)'}
                                    >
                                        Level 3: Binary Awakening <ArrowRight style={{ width: 14, height: 14 }} />
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};
