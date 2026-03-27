/**
 * ModuleThree.tsx — Level 3: Binary Awakening
 */
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SceneWhyBinary } from '../components/level3/SceneWhyBinary';
import { SceneSwitch } from '../components/level3/SceneSwitch';
import { SceneCounter } from '../components/level3/SceneCounter';
import { SceneRegister } from '../components/level3/SceneRegister';
import { SceneArithmetic } from '../components/level3/SceneArithmetic';
import { SceneLogicBridge } from '../components/level3/SceneLogicBridge';
import { CognitiveCheckpoint, CheckpointScene } from '../components/level3/CognitiveCheckpoint';
import { VoltMonkeyPanel } from '../components/level1/VoltMonkeyPanel';
import { XPCounter } from '../components/level1/XPCounter';
import { BadgeToast } from '../components/level2/BadgeToast';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { useEngagementAdapter } from '../hooks/useEngagementAdapter';
import { useSigmaMentorL3, L3Scene } from '../hooks/useSigmaMentorL3';
import { useGamificationStore } from '../stores/gamificationStore';
import { useGlobalSensory } from '../hooks/useGlobalSensory';
import { useBinaryStore } from '../stores/binaryStore';

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#17191E',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', sans-serif",
} as const;

// Scene type is imported from binaryStore

const BADGES: Record<string, { name: string; xp: number }> = {
    'bit-flip': { name: 'Bit Manipulator', xp: 10 },
    'bit-counter': { name: 'Counter Initiate', xp: 15 },
    'memory-writer': { name: 'Memory Writer', xp: 15 },
    'ripple-solver': { name: 'Ripple Solver', xp: 20 },
    'binary-awakened': { name: 'Binary Awakened', xp: 50 },
};

const Btn: React.FC<{ label: string; onClick: () => void; disabled?: boolean }> = ({ label, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            padding: '12px 28px', fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', background: disabled ? 'transparent' : 'rgba(0,212,255,0.06)',
            border: `1px solid rgba(0,212,255,${disabled ? 0.08 : 0.28})`,
            borderRadius: 4, color: disabled ? 'rgba(0,212,255,0.3)' : T.accent,
            cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex', alignItems: 'center', gap: 10,
        }}
    >
        {label} <ArrowRight style={{ width: 12, height: 12 }} />
    </button>
);

// SCENE_ORDER is managed in binaryStore

export const ModuleThree: React.FC = () => {
    const navigate = useNavigate();
    const completeSkill = useGamificationStore(state => state.completeSkill);

    const { xp, awardXP, registerCounterEl } = useEngagementAdapter();
    const { triggerHaptic } = useGlobalSensory();
    const { recordInteraction, getResponse, getProactiveMessage } = useSigmaMentorL3();
    const [panelResponse, setPanelResponse] = useState<any>(null);

    const [toast, setToast] = useState<{ show: boolean; name: string; xp: number }>({ show: false, name: '', xp: 0 });
    const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());

    const activeScene = useBinaryStore(s => s.activeScene);
    const nextScene = useBinaryStore(s => s.nextScene);
    const navigationLocked = useBinaryStore(s => s.navigationLocked);
    const isSystemBusy = useBinaryStore(s => s.isSystemBusy);
    const toggleLogicOverlay = useBinaryStore(s => s.toggleLogicOverlay);
    const isLogicOverlayVisible = useBinaryStore(s => s.isLogicOverlayVisible);
    const setNavigationLocked = useBinaryStore(s => s.setNavigationLocked);

    useEffect(() => {
        console.log("ModuleThree: activeScene changed to:", activeScene);
        window.scrollTo(0,0);
    }, [activeScene]);

    const [screenFlash, setScreenFlash] = useState(false);
    const [showCheckpoint, setShowCheckpoint] = useState(false);

    const [hasToggled, setHasToggled] = useState(false);
    const [hasReached8, setHasReached8] = useState(false);
    const [hasStored, setHasStored] = useState(false);
    const [hasComputed, setHasComputed] = useState(false);

    const flash = useCallback(() => {
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 150);
    }, []);

    const showSigma = useCallback((sc: L3Scene, proactive?: string) => {
        const res = getResponse(sc);
        if (res) {
            setPanelResponse({
                obs: proactive || res.observation,
                why: res.analysis,
                conclusion: res.conclusion,
                tier: res.tier
            });
        }
    }, [getResponse]);

    useEffect(() => {
        const sigmaScenes = ['whybinary', 'switch', 'counter', 'register', 'arithmetic', 'bridge'];
        if (!sigmaScenes.includes(activeScene)) return;
        
        const msg = getProactiveMessage(activeScene as L3Scene);
        if (msg) showSigma(activeScene as L3Scene, msg);
    }, [activeScene, getProactiveMessage, showSigma]);

    const awardBadge = useCallback((key: string) => {
        if (earnedBadges.has(key)) return;
        const b = BADGES[key];
        if (!b) return;
        setEarnedBadges(prev => new Set([...prev, key]));
        setToast({ show: true, name: b.name, xp: b.xp });
        flash();
    }, [earnedBadges, flash]);

    const [showRecap, setShowRecap] = useState(false);
    const [recapData, setRecapData] = useState<{ title: string; points: string[] } | null>(null);

    const handleAdvance = () => {
        console.log("ModuleThree: handleAdvance for", activeScene);
        const recaps: Record<string, { title: string; points: string[] }> = {
            switch: {
                title: "Voltage to Logic Complete",
                points: ["Mapped physical voltage to binary bits", "Observed threshold-based state transitions", "Explored all 16 states of a 4-bit nibble"]
            },
            counter: {
                title: "Binary Progression Complete",
                points: ["Observed carry propagation 'ripple' effect", "Mastered prediction of next binary states", "Understood modular arithmetic (0-15 wrap)"]
            },
            register: {
                title: "Memory Abstraction Complete",
                points: ["Stored values into silicon flip-flops", "Mastered Byte (8-bit) and Hexadecimal mapping", "Understood volatile vs non-volatile storage"]
            },
            arithmetic: {
                title: "Computational Logic Complete",
                points: ["Added binary numbers using Full Adders", "Observed ripple carry vs parallel logic", "Completed the Reverse ALU challenge"]
            }
        };

        if (navigationLocked || isSystemBusy) {
            triggerHaptic('impact' as any);
            return;
        }

        if (recaps[activeScene]) {
            setRecapData(recaps[activeScene]);
            setShowRecap(true);
        } else {
            actuallyAdvance();
        }
    };

    const actuallyAdvance = useCallback(async () => {
        if (isSystemBusy) return;
        
        // REQ 2: Transition Hardware Delay (Perceptual Continuity)
        setNavigationLocked(true); 
        await new Promise(r => setTimeout(r, 200)); 
        
        setNavigationLocked(false);
        setShowCheckpoint(false);
        nextScene();
        setShowRecap(false);
    }, [isSystemBusy, setNavigationLocked, nextScene]);

    const confirmAdvance = useCallback(() => {
        setShowRecap(false);
        setShowCheckpoint(true);
        triggerHaptic('success');
    }, [triggerHaptic]);

    useEffect(() => {
        if (activeScene !== 'intro' && activeScene !== 'complete') showSigma(activeScene as L3Scene);
        if (activeScene === 'complete') completeSkill('binary_awakening');
    }, [activeScene, showSigma, completeSkill]);

    const INTRO_LINES = [
        'Before logic gates. Before processors.',
        'There is one universal language.',
        'Computation is not a mathematical concept.',
        'It is a physical act.',
        'Binary is the language of hardware.'
    ];
    const [introStep, setIntroStep] = useState(0);

    const handleIntroNext = () => {
        if (isSystemBusy) return;
        if (introStep < INTRO_LINES.length - 1) {
            setIntroStep(s => s + 1);
        } else {
            actuallyAdvance();
        }
    };

    // SAFETY: Global Lock Cleanup on Mount/Unmount
    useEffect(() => {
        return () => {
            const state = useBinaryStore.getState();
            state.setNavigationLocked(false);
            if (state.isIncrementing) useBinaryStore.setState({ isIncrementing: false, isSystemBusy: false });
        };
    }, []);

    const handleFirstToggle = useCallback(() => { setHasToggled(true); awardXP('structural', 10); awardBadge('bit-flip'); showSigma('switch'); }, [awardXP, awardBadge, showSigma]);
    const handleCarry = useCallback(() => { showSigma('counter'); recordInteraction(true); }, [showSigma, recordInteraction]);
    const handleReach8 = useCallback(() => { setHasReached8(true); awardXP('application', 15); awardBadge('bit-counter'); flash(); }, [awardXP, awardBadge, flash]);
    const handleStore = useCallback(() => { setHasStored(true); awardXP('structural', 15); awardBadge('memory-writer'); showSigma('register'); flash(); }, [awardXP, awardBadge, showSigma, flash]);
    const handleArithmeticCorrect = useCallback(() => { setHasComputed(true); awardXP('application', 20); awardBadge('ripple-solver'); showSigma('arithmetic'); recordInteraction(true); flash(); }, [awardXP, awardBadge, showSigma, recordInteraction, flash]);

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: T.sans, background: T.bg, color: T.text, overflow: 'hidden' }}>
            <AnimatePresence>
                {screenFlash && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,212,255,0.04)', pointerEvents: 'none', zIndex: 9999 }} />
                )}
            </AnimatePresence>

            <BadgeToast show={toast.show} badgeName={toast.name} xp={toast.xp} onDismiss={() => setToast(t => ({ ...t, show: false }))} />

            {activeScene !== 'intro' && activeScene !== 'complete' && (
                <header style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderBottom: `1px solid ${T.border}`,
                    background: T.bg, position: 'sticky', top: 0, zIndex: 20,
                }}>
                    <button onClick={() => navigate('/portal')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 2, border: `1px solid ${T.border}`, background: 'transparent', color: T.muted, fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 11, height: 11 }} /> Exit
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button 
                            onClick={toggleLogicOverlay}
                            style={{
                                background: isLogicOverlayVisible ? T.accent : 'transparent',
                                border: `1px solid ${T.accent}`, color: isLogicOverlayVisible ? T.bg : T.accent,
                                padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.1em', transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: 10 }}>{isLogicOverlayVisible ? '◉' : '○'}</span>
                            ENGINEERING VIEW
                        </button>
                        <ProgressTracker
                            stages={[
                                { id: 'switch', label: 'Binary Intro' },
                                { id: 'counter', label: 'Counter' },
                                { id: 'register', label: 'Memory' },
                                { id: 'arithmetic', label: 'Arithmetic' },
                            ]}
                            activeStageId={activeScene}
                        />
                        <XPCounter total={xp.total} registerEl={registerCounterEl} breakdown={xp} />
                    </div>
                </header>
            )}

            <AnimatePresence mode="wait">
                {showRecap && recapData && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5, 5, 10, 0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            style={{ width: '100%', maxWidth: 460, background: T.card, border: `1px solid ${T.accent}44`, borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: `0 0 50px ${T.accent}11` }}
                        >
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${T.success}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: `1px solid ${T.success}33` }}>
                                <CheckCircle2 size={28} color={T.success} />
                            </div>
                            <h3 style={{ fontFamily: T.mono, fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {recapData.title}
                            </h3>
                            <div style={{ marginBottom: 40 }}>
                                {recapData.points.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', textAlign: 'left', marginBottom: 14, fontSize: 14, color: T.muted }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, marginTop: 7, flexShrink: 0 }} />
                                        {p}
                                    </div>
                                ))}
                            </div>
                            <Btn label="Advance to Next Lab" onClick={confirmAdvance} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <main style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: activeScene === 'intro' || activeScene === 'complete' ? 0 : '36px 24px',
                        maxWidth: activeScene === 'intro' || activeScene === 'complete' ? 'none' : 1024,
                        width: '100%', margin: '0 auto', minHeight: '100%',
                    }}>
                        <AnimatePresence mode="wait">
                            {activeScene === 'intro' && (
                                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, textAlign: 'center', marginBottom: 52 }}>
                                        "{INTRO_LINES[introStep]}"
                                    </h1>
                                    <Btn label={introStep < INTRO_LINES.length - 1 ? 'Next Line' : 'Enter Lab'} onClick={handleIntroNext} />
                                </motion.div>
                            )}
                            {activeScene === 'whybinary' && (
                                <motion.div key="whybinary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneWhyBinary onComplete={actuallyAdvance} />
                                </motion.div>
                            )}
                            {activeScene === 'switch' && (
                                <motion.div key="switch" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneSwitch onFirstToggle={handleFirstToggle} hasToggled={hasToggled} />
                                    {hasToggled && (
                                        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', marginTop: 40, gap: 12 }}>
                                            <Btn label="Continue to Counting Machine" onClick={handleAdvance} disabled={navigationLocked} />
                                            {navigationLocked && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, opacity: 0.8 }}>PREDICTION REQUIRED TO UNLOCK NAVIGATION</span>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            {activeScene === 'counter' && (
                                <motion.div key="counter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneCounter onCarry={handleCarry} onReach8={handleReach8} hasReached8={hasReached8} />
                                    {hasReached8 && (
                                        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', marginTop: 40, gap: 12 }}>
                                            <Btn label="Continue to Memory Store" onClick={handleAdvance} disabled={navigationLocked} />
                                            {navigationLocked && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, opacity: 0.8 }}>PREDICTION REQUIRED TO UNLOCK NAVIGATION</span>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            {activeScene === 'register' && (
                                <motion.div key="register" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneRegister onStore={handleStore} />
                                    {hasStored && (
                                        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', marginTop: 40, gap: 12 }}>
                                            <Btn label="Continue to Arithmetic" onClick={handleAdvance} disabled={navigationLocked} />
                                            {navigationLocked && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, opacity: 0.8 }}>PREDICTION REQUIRED TO UNLOCK NAVIGATION</span>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            {activeScene === 'arithmetic' && (
                                <motion.div key="arithmetic" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneArithmetic onCorrect={handleArithmeticCorrect} />
                                    {hasComputed && (
                                        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', marginTop: 40, gap: 12 }}>
                                            <Btn label="Examine Internal Logic" onClick={handleAdvance} disabled={navigationLocked} />
                                            {navigationLocked && <span style={{ fontFamily: T.mono, fontSize: 9, color: T.warning, opacity: 0.8 }}>PREDICTION REQUIRED TO UNLOCK NAVIGATION</span>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            {activeScene === 'bridge' && (
                                <motion.div key="bridge" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                                    <SceneLogicBridge onComplete={actuallyAdvance} />
                                </motion.div>
                            )}
                            {activeScene === 'complete' && (
                                <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '72px 24px' }}>
                                    <Trophy size={80} style={{ color: T.accent, marginBottom: 32 }} />
                                    <h1 style={{ fontSize: 60, fontWeight: 800, color: T.text, marginBottom: 16 }}>BINARY AWAKENED</h1>
                                    <Btn label="Exit to Portal" onClick={() => navigate('/portal')} />
                                </motion.div>
                            )}
                            {/* Safety Fallback */}
                            {!['intro', 'whybinary', 'switch', 'counter', 'register', 'arithmetic', 'bridge', 'complete'].includes(activeScene) && (
                                <div key="fallback" style={{ textAlign: 'center', padding: 40 }}>
                                    <p style={{ color: T.error, fontFamily: T.mono, fontSize: 14 }}>CRITICAL: Unknown Scene State "{activeScene}"</p>
                                    <button onClick={() => window.location.reload()} style={{ marginTop: 20, color: T.accent }}>Re-initialize System</button>
                                </div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {showCheckpoint && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 7, 12, 0.95)', backdropFilter: 'blur(12px)', padding: 24 }}>
                                    <CognitiveCheckpoint scene={activeScene as CheckpointScene} onComplete={actuallyAdvance} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
                {activeScene !== 'intro' && activeScene !== 'complete' && <VoltMonkeyPanel response={panelResponse} />}
            </div>
        </div>
    );
};
