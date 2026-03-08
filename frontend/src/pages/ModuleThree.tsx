/**
 * ModuleThree.tsx — Level 3: Binary Awakening
 *
 * Orchestrates 4 micro-modules using the established ModuleOne scene pattern.
 * Integrates SIGMA mentor, XP system, badge toasts, and progress tracker.
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Binary, CheckCircle2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SceneSwitch } from '../components/level3/SceneSwitch';
import { SceneCounter } from '../components/level3/SceneCounter';
import { SceneRegister } from '../components/level3/SceneRegister';
import { SceneArithmetic } from '../components/level3/SceneArithmetic';
import { VoltMonkeyPanel } from '../components/level1/VoltMonkeyPanel';
import { XPCounter } from '../components/level1/XPCounter';
import { BadgeToast } from '../components/level2/BadgeToast';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { useEngagementAdapter } from '../hooks/useEngagementAdapter';
import { useSigmaMentorL3, L3Scene } from '../hooks/useSigmaMentorL3';
import { useGamificationStore } from '../stores/gamificationStore';

// ── Design Tokens (identical to existing levels) ─────────────────────────────
const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B',
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', system-ui, sans-serif",
} as const;

// ── Scene type ───────────────────────────────────────────────────────────────
type Scene = 'intro' | 'switch' | 'counter' | 'register' | 'arithmetic' | 'complete';

// ── Badges ───────────────────────────────────────────────────────────────────
const BADGES: Record<string, { name: string; xp: number }> = {
    'bit-flip': { name: 'Bit Manipulator', xp: 10 },
    'bit-counter': { name: 'Counter Initiate', xp: 15 },
    'memory-writer': { name: 'Memory Writer', xp: 15 },
    'ripple-solver': { name: 'Ripple Solver', xp: 20 },
    'binary-awakened': { name: 'Binary Awakened', xp: 50 },
};

// ── Enterprise CTA Button ─────────────────────────────────────────────────────
const Btn: React.FC<{ label: string; onClick: () => void; disabled?: boolean }> = ({ label, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            padding: '10px 24px', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em',
            textTransform: 'uppercase', background: disabled ? 'transparent' : 'rgba(0,212,255,0.06)',
            border: `1px solid rgba(0,212,255,${disabled ? 0.08 : 0.28})`,
            borderRadius: 2, color: disabled ? 'rgba(0,212,255,0.3)' : T.accent,
            cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
        }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget).style.background = 'rgba(0,212,255,0.13)'; }}
        onMouseLeave={e => { if (!disabled) (e.currentTarget).style.background = 'rgba(0,212,255,0.06)'; }}
    >
        {label} <ArrowRight style={{ width: 11, height: 11 }} />
    </button>
);

// ── SCENE ORDER ──────────────────────────────────────────────────────────────
const SCENE_ORDER: Scene[] = ['intro', 'switch', 'counter', 'register', 'arithmetic', 'complete'];

// ── Component ─────────────────────────────────────────────────────────────────
export const ModuleThree: React.FC = () => {
    const navigate = useNavigate();
    const completeSkill = useGamificationStore(state => state.completeSkill);

    const [scene, setScene] = useState<Scene>('intro');
    const [screenFlash, setScreenFlash] = useState(false);

    // ── Systems ──
    const { xp, awardXP, registerCounterEl } = useEngagementAdapter();
    const { recordInteraction, getResponse } = useSigmaMentorL3();
    const [panelResponse, setPanelResponse] = useState<any>(null);

    /* ── Engineering Features ── */

    const [toast, setToast] = useState<{ show: boolean; name: string; xp: number }>({ show: false, name: '', xp: 0 });
    const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());

    // Module completion flags
    const [hasToggled, setHasToggled] = useState(false);
    const [hasReached8, setHasReached8] = useState(false);
    const [hasStored, setHasStored] = useState(false);
    const [hasComputed, setHasComputed] = useState(false);

    const flash = useCallback(() => {
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 150);
    }, []);

    const showSigma = useCallback((sc: L3Scene) => {
        const res = getResponse(sc);
        if (res) {
            setPanelResponse({
                obs: res.observation,
                why: res.analysis,
                conclusion: res.conclusion,
                tier: res.tier as 'sharp' | 'steady' | 'struggling'
            });
        }
    }, [getResponse]);

    const awardBadge = useCallback((key: string) => {
        if (earnedBadges.has(key)) return;
        const b = BADGES[key];
        if (!b) return;
        setEarnedBadges(prev => new Set([...prev, key]));
        setToast({ show: true, name: b.name, xp: b.xp });
        flash();
    }, [earnedBadges, flash]);

    const advance = () => {
        const idx = SCENE_ORDER.indexOf(scene);
        if (idx < SCENE_ORDER.length - 1) {
            const next = SCENE_ORDER[idx + 1] as Scene;
            setScene(next);
            if (next !== 'intro' && next !== 'complete') showSigma(next as L3Scene);
            if (next === 'complete') completeSkill('binary_awakening');
        }
    };

    // ── Intro ─────────────────────────────────────────────────────────────────
    const INTRO_LINES = [
        'Before logic gates. Before processors.',
        'There is one universal language.',
        'Zero and One.',
        'Binary is the language of hardware.'
    ];
    const [introStep, setIntroStep] = useState(0);

    const handleIntroNext = () => {
        if (introStep < INTRO_LINES.length - 1) {
            setIntroStep(s => s + 1);
        } else {
            advance();
        }
    };

    // ── Module event handlers ─────────────────────────────────────────────────
    const handleFirstToggle = () => {
        setHasToggled(true);
        awardXP('structural', 10);
        awardBadge('bit-flip');
        showSigma('switch');
    };

    const handleCarry = () => {
        showSigma('counter');
        recordInteraction(true);
    };

    const handleReach8 = () => {
        setHasReached8(true);
        awardXP('application', 15);
        awardBadge('bit-counter');
        flash();
    };

    const handleStore = () => {
        setHasStored(true);
        awardXP('structural', 15);
        awardBadge('memory-writer');
        showSigma('register');
        flash();
    };

    const handleArithmeticCorrect = () => {
        setHasComputed(true);
        awardXP('application', 20);
        awardBadge('ripple-solver');
        showSigma('arithmetic');
        recordInteraction(true);
        flash();
    };

    // Progression gates checked directly via boolean flags (hasToggled, hasReached8, etc.)

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: T.sans, background: T.bg, color: T.text, overflow: 'hidden' }}>
            {/* Screen flash overlay */}
            <AnimatePresence>
                {screenFlash && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,212,255,0.04)', pointerEvents: 'none', zIndex: 9999 }} />
                )}
            </AnimatePresence>

            {/* Badge Toast */}
            <BadgeToast show={toast.show} badgeName={toast.name} xp={toast.xp} onDismiss={() => setToast(t => ({ ...t, show: false }))} />

            {/* Header */}
            {scene !== 'intro' && scene !== 'complete' && (
                <header style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderBottom: `1px solid ${T.border}`,
                    background: T.bg, position: 'sticky', top: 0, zIndex: 20,
                }}>
                    <button onClick={() => navigate('/portal')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 2, border: `1px solid ${T.border}`, background: 'transparent', color: T.muted, fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 11, height: 11 }} /> Exit
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ProgressTracker
                            stages={[
                                { id: 'switch', label: 'Binary Intro' },
                                { id: 'counter', label: 'Counter' },
                                { id: 'register', label: 'Memory' },
                                { id: 'arithmetic', label: 'Arithmetic' },
                            ]}
                            activeStageId={scene}
                        />
                        <XPCounter total={xp.total} registerEl={registerCounterEl} breakdown={xp} />
                        <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.16em', color: T.muted, textTransform: 'uppercase' }}>
                            Lvl 3 — Binary Awakening
                        </span>
                    </div>
                </header>
            )}

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <main style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: scene === 'intro' || scene === 'complete' ? 0 : '36px 24px',
                        maxWidth: scene === 'intro' || scene === 'complete' ? 'none' : 1024,
                        width: '100%', margin: '0 auto', minHeight: '100%',
                    }}>
                        <AnimatePresence mode="wait">

                            {/* ── INTRO ── */}
                            {scene === 'intro' && (
                                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                                    style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>

                                    {/* Grid background */}
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                        <Binary size={16} style={{ color: T.accent, opacity: 0.7 }} />
                                        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.accent, opacity: 0.7 }}>
                                            Level 03 · Binary Awakening
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        key={introStep}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45 }}
                                        style={{
                                            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, textAlign: 'center',
                                            letterSpacing: '-0.02em', marginBottom: 52,
                                            background: `linear-gradient(135deg, ${T.text} 0%, ${T.accent} 100%)`,
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                            maxWidth: 600,
                                        }}
                                    >
                                        "{INTRO_LINES[introStep]}"
                                    </motion.h1>

                                    {/* Binary ticker decoration */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                        style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, opacity: 0.2, letterSpacing: '0.1em', marginBottom: 48 }}>
                                        0000 0001 0010 0011 0100 0101 0110 0111 1000 1001 1010 1011 1100 1101 1110 1111
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                        <Btn
                                            label={introStep < INTRO_LINES.length - 1 ? 'Next' : 'Enter Binary Lab'}
                                            onClick={handleIntroNext}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* ── MODULE 3.1: SWITCH ── */}
                            {scene === 'switch' && (
                                <motion.div key="switch" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneSwitch onFirstToggle={handleFirstToggle} hasToggled={hasToggled} />
                                    {hasToggled && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                            <Btn label="Binary Counting Machine →" onClick={advance} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── MODULE 3.2: COUNTER ── */}
                            {scene === 'counter' && (
                                <motion.div key="counter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneCounter onCarry={handleCarry} onReach8={handleReach8} hasReached8={hasReached8} />
                                    {hasReached8 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                            <Btn label="Bits in Memory →" onClick={advance} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── MODULE 3.3: REGISTER ── */}
                            {scene === 'register' && (
                                <motion.div key="register" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneRegister onStore={handleStore} />
                                    {hasStored && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                            <Btn label="Binary Arithmetic Lab →" onClick={advance} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── MODULE 3.4: ARITHMETIC ── */}
                            {scene === 'arithmetic' && (
                                <motion.div key="arithmetic" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneArithmetic onCorrect={handleArithmeticCorrect} />
                                    {hasComputed && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                                            <Btn label="Complete Level 3 →" onClick={advance} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── COMPLETE ── */}
                            {scene === 'complete' && (
                                <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '72px 24px', maxWidth: 640, margin: '0 auto' }}>

                                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 280 }}
                                        style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: `2px solid rgba(0,212,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                                        <Trophy size={36} style={{ color: T.accent }} />
                                    </motion.div>

                                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em', background: `linear-gradient(135deg, ${T.text} 0%, ${T.accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
                                        BINARY AWAKENED
                                    </h1>

                                    <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, marginBottom: 40 }}>
                                        You now understand binary representation, counting, memory registers, and arithmetic. Every digital circuit you will ever build operates on these principles.
                                    </p>

                                    {/* Badges earned */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
                                        {[...earnedBadges].map(key => {
                                            const b = BADGES[key];
                                            return b ? (
                                                <div key={key} style={{ padding: '6px 14px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, fontFamily: T.mono, fontSize: 10, color: T.accent, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <CheckCircle2 size={10} /> {b.name}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>

                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <button onClick={() => navigate('/portal')}
                                            style={{ padding: '14px 28px', borderRadius: 8, background: T.card, border: `1px solid ${T.border}`, color: T.text, fontFamily: T.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = T.accent)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                                            Back to Station Map
                                        </button>
                                        <button onClick={() => navigate('/module/4')}
                                            style={{ padding: '14px 28px', borderRadius: 8, background: 'rgba(0,212,255,0.08)', border: `1px solid rgba(0,212,255,0.3)`, color: T.accent, fontFamily: T.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                            Next: Logic Gates →
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </main>
                </div>

                {/* SIGMA Mentor Sidebar */}
                {scene !== 'intro' && scene !== 'complete' && (
                    <VoltMonkeyPanel response={panelResponse} />
                )}
            </div>
        </div>
    );
};
