import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Monitor, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Level 2 components
import { AnalogLab } from '../components/level2/AnalogLab';
import { DigitalLab } from '../components/level2/DigitalLab';
import { NoiseExperiment } from '../components/level2/NoiseExperiment';
import { SignalRegenerator } from '../components/level2/SignalRegenerator';
import { SamplingLab } from '../components/level2/SamplingLab';
import { NoisyLineChallenge } from '../components/level2/NoisyLineChallenge';
import { BadgeToast } from '../components/level2/BadgeToast';
import { useGlobalSensory } from '../hooks/useGlobalSensory';
import '../components/level2/level2.css';

// Shared Level 1 systems
import { XPCounter } from '../components/level1/XPCounter';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { useEngagementAdapter as useXPSystem } from '../hooks/useEngagementAdapter';
import { useGamificationStore } from '../stores/gamificationStore';

const T = {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    accent: '#0EA5E9',
    success: '#059669',
    error: '#DC2626',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

type Scene = 'intro' | 'analog' | 'digital' | 'sampling' | 'comparison' | 'advanced' | 'boss' | 'summary' | 'complete';

interface Badge { name: string; xp: number; }

const BADGES_MAP: Record<string, Badge> = {
    analog: { name: 'Analog Explorer', xp: 10 },
    digital: { name: 'Digital Discoverer', xp: 10 },
    sampling: { name: 'Nyquist Master', xp: 15 },
    comparison: { name: 'Comparison Master', xp: 10 },
    advanced: { name: 'Digital Advocate', xp: 15 },
    boss: { name: 'Signal Architect', xp: 30 },
};

export const ModuleTwo: React.FC = () => {
    const navigate = useNavigate();
    const completeSkill = useGamificationStore(state => state.completeSkill);
    const [scene, setScene] = useState<Scene>('intro');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { xp, awardXP, registerCounterEl } = useXPSystem();
    const { triggerHaptic, playSound } = useGlobalSensory();


    const [isHighContrast, setIsHighContrast] = useState(false);
    const [isXRayMode] = useState(false);
    const setProbeData = useCallback(() => {}, []);

    const [toast, setToast] = useState<{ show: boolean; badge: Badge }>({
        show: false, badge: { name: '', xp: 0 },
    });
    const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
    const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

    // Evolution Logic Persistence
    const [intel, setIntel] = useState({ accuracy: 0, exploration: 0 });
    useEffect(() => {
        const checkIntel = () => {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('verilog_cognition_'));
            if (keys.length === 0) return;
            try {
                const data = JSON.parse(localStorage.getItem(keys[keys.length-1]) || '{}');
                setIntel({ accuracy: data.predictionAccuracy || 0, exploration: data.explorationScore || 0 });
            } catch (e) {
                console.error("Failed to parse cognition data", e);
            }
        };
        const interval = setInterval(checkIntel, 2000);
        return () => clearInterval(interval);
    }, []);

    const awardBadge = useCallback((id: string) => {
        if (earnedBadges.has(id)) return;
        const badge = BADGES_MAP[id];
        if (!badge) return;
        setEarnedBadges(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        setToast({ show: true, badge });
        awardXP('structural', badge.xp);
        triggerHaptic('success');
        playSound('success');
    }, [earnedBadges, awardXP, triggerHaptic, playSound]);

    const handleAnalogComplete = useCallback(() => {
        awardBadge('analog');
    }, [awardBadge]);

    const handleDigitalComplete = useCallback(() => {
        awardBadge('digital');
    }, [awardBadge]);

    const handleComparisonComplete = useCallback(() => {
        awardBadge('comparison');
    }, [awardBadge]);

    const handleRegenerationComplete = useCallback(() => {
        awardBadge('advanced');
    }, [awardBadge]);

    const handleSamplingComplete = useCallback(() => {
        awardBadge('sampling');
    }, [awardBadge]);

    const startChallenge = useCallback((id: string) => {
        setActiveChallenge(id);
        triggerHaptic('heavy');
    }, [triggerHaptic]);

    const binaryChars = useRef(Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 1.5 + Math.random() * 2,
        char: Math.random() > 0.5 ? '1' : '0'
    })));

    return (
        <div style={{ 
            minHeight: '100vh', background: T.bg, color: T.text,
            fontFamily: T.sans, position: 'relative', overflowX: 'hidden',
            filter: isHighContrast ? 'contrast(1.2) brightness(1.1)' : 'none'
        }}>
            <AnimatePresence mode="wait">
                {isTransitioning && (
                    <motion.div key="transition-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 10000, pointerEvents: 'none' }} />
                )}
            </AnimatePresence>

            <header style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '16px 24px', background: 'rgba(10, 11, 16, 0.8)',
                backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ width: 1, height: 24, background: T.border }} />
                    <ProgressTracker stages={[
                        { id: 'intro', label: 'Start' }, { id: 'analog', label: 'Analog' },
                        { id: 'digital', label: 'Digital' }, { id: 'comparison', label: 'Compare' },
                        { id: 'advanced', label: 'Regen' }, { id: 'sampling', label: 'Sampling' },
                        { id: 'boss', label: 'Boss' }, { id: 'summary', label: 'Final' }
                    ]} activeStageId={scene} />
                    
                    {/* Evolution Logic: Engineering Intelligence Dashboard */}
                    <div style={{ 
                        display: 'flex', gap: 12, padding: '4px 12px', 
                        background: 'rgba(255,255,255,0.03)', borderRadius: 20, 
                        border: '1px solid rgba(255,255,255,0.05)', marginLeft: 8 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                             <span style={{ fontSize: 7, color: T.muted, fontFamily: T.mono }}>ACCURACY</span>
                             <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                 <motion.div animate={{ width: `${intel.accuracy * 100}%` }} style={{ height: '100%', background: T.accent }} />
                             </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                             <span style={{ fontSize: 7, color: T.muted, fontFamily: T.mono }}>EXPLORE</span>
                             <div style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                 <motion.div animate={{ width: `${intel.exploration * 100}%` }} style={{ height: '100%', background: T.success }} />
                             </div>
                        </div>
                    </div>

                    <XPCounter total={xp.total} registerEl={registerCounterEl} breakdown={xp} />
                    
                    {/* Accessibility Toggle */}
                    <button 
                        onClick={() => { setIsHighContrast(!isHighContrast); triggerHaptic('light'); }}
                        style={{ 
                            background: isHighContrast ? T.accent : 'rgba(255,255,255,0.05)', 
                            border: 'none', borderRadius: 4, width: 28, height: 28, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: isHighContrast ? '#000' : T.muted
                        }}
                        title="High Contrast Mode"
                    >
                        <Zap size={14} />
                    </button>
                </div>
            </header>



            <main style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: scene === 'intro' || scene === 'complete' ? 0 : '100px 24px 32px',
                maxWidth: scene === 'intro' || scene === 'complete' ? 'none' : 1000,
                width: '100%', margin: '0 auto'
            }}>
                <AnimatePresence mode="wait">
                    {scene === 'intro' && (
                        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ textAlign: 'center', zIndex: 1 }}>
                                <motion.h1 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    style={{ fontSize: 'clamp(40px, 8vw, 84px)', fontWeight: 800, color: T.text, marginBottom: 24 }}
                                >
                                    SIGNAL<br /><span style={{ color: 'transparent', WebkitTextStroke: `1px ${T.accent}` }}>DOMAINS</span>
                                </motion.h1>
                                <motion.button 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => setScene('analog')} 
                                    style={{ padding: '16px 40px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono, fontWeight: 700 }}
                                >
                                    Initialize Level 2
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {scene === 'analog' && (
                        <motion.div key="analog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, filter: 'blur(10px)' }} style={{ width: '100%' }}>
                            <AnalogLab onComplete={handleAnalogComplete} isXRayMode={isXRayMode} setProbeData={setProbeData} />
                            {earnedBadges.has('analog') && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setScene('digital')} style={{ padding: '12px 24px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono }}>Proceed to Digital</button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {scene === 'digital' && (
                        <motion.div key="digital" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, filter: 'blur(10px)' }} style={{ width: '100%' }}>
                            <DigitalLab onComplete={handleDigitalComplete} isXRayMode={isXRayMode} setProbeData={setProbeData} />
                            {earnedBadges.has('digital') && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setScene('comparison')} style={{ padding: '12px 24px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono }}>Comparison Lab</button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {scene === 'comparison' && (
                        <motion.div key="comparison" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, filter: 'blur(10px)' }} style={{ width: '100%' }}>
                            <NoiseExperiment onComplete={handleComparisonComplete} />
                            {earnedBadges.has('comparison') && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                    <button onClick={() => setScene('advanced')} style={{ padding: '12px 24px', background: 'transparent', border: `1px solid ${T.accent}`, color: T.accent, cursor: 'pointer', fontFamily: T.mono }}>Advanced Regen</button>
                                    <button onClick={() => setScene('sampling')} style={{ padding: '12px 24px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono }}>Nyquist Lab</button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {scene === 'advanced' && (
                        <motion.div key="advanced" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, filter: 'blur(10px)' }} style={{ width: '100%' }}>
                            <SignalRegenerator onComplete={handleRegenerationComplete} />
                            {earnedBadges.has('advanced') && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setScene('sampling')} style={{ padding: '12px 24px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono }}>Nyquist Lab</button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {scene === 'sampling' && (
                        <motion.div key="sampling" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, filter: 'blur(10px)' }} style={{ width: '100%' }}>
                            <SamplingLab onComplete={handleSamplingComplete} />
                            {earnedBadges.has('sampling') && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setScene('boss')} style={{ padding: '12px 24px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono }}>The Final Boss</button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {scene === 'boss' && ( activeChallenge === 'noisy_line' ? (
                        <NoisyLineChallenge onComplete={() => { awardBadge('boss'); awardXP('application', 50); setScene('summary'); }} />
                    ) : (
                        <motion.div key="boss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', textAlign: 'center' }}>
                            <h2 style={{ fontSize: 32, marginBottom: 40 }}>FINAL CHALLENGE</h2>
                            <button onClick={() => startChallenge('noisy_line')} style={{ padding: '16px 40px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono, fontWeight: 700, borderRadius: 8 }}>Begin Transmission</button>
                        </motion.div>
                    ))}

                    {scene === 'summary' && (
                        <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 600 }}>
                            <div style={{ background: T.card, padding: 40, borderRadius: 24, border: `1px solid ${T.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                                <div style={{ width: 64, height: 64, background: `${T.accent}20`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: T.accent }}>
                                    <Monitor size={32} />
                                </div>
                                <h2 style={{ color: T.accent, marginBottom: 12, fontSize: 24, fontWeight: 800 }}>MODULE 2 CAPTURED</h2>
                                <p style={{ color: T.muted, marginBottom: 32 }}>You've mastered the bridge between worlds.</p>
                                <button onClick={() => setScene('complete')} style={{ padding: '14px 32px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono, fontWeight: 800, borderRadius: 8 }}>Finalize Graduation</button>
                            </div>
                        </motion.div>
                    )}

                    {scene === 'complete' && (
                        <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            {binaryChars.current.map((c, i) => (
                                <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: '-20px', fontFamily: T.mono, fontSize: 10, color: T.accent, opacity: 0.2, animation: `binary-fall ${c.dur}s linear ${c.delay}s infinite` }}>{c.char}</div>
                            ))}
                            <motion.h1 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ fontSize: 'clamp(40px, 10vw, 84px)', fontWeight: 800, color: T.text, marginBottom: 24, textAlign: 'center' }}
                            >
                                LEVEL 2<br/><span style={{ color: T.accent }}>COMPLETE</span>
                            </motion.h1>
                            <motion.button 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => { setIsTransitioning(true); triggerHaptic('heavy'); playSound('boss_defeat'); setTimeout(() => { completeSkill('signal_representation'); navigate('/module/3'); }, 2500); }} 
                                style={{ padding: '16px 40px', background: T.accent, color: T.bg, border: 'none', cursor: 'pointer', fontFamily: T.mono, fontWeight: 700, boxShadow: `0 0 30px ${T.accent}60`, borderRadius: 8 }}
                            >
                                Enter Level 3
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <BadgeToast 
                show={toast.show} 
                badgeName={toast.badge.name} 
                xp={toast.badge.xp} 
                onDismiss={() => setToast({ ...toast, show: false })} 
            />
            
            {/* Global Legend Style */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes binary-fall {
                    0% { transform: translateY(-20px); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(110vh); opacity: 0; }
                }
            ` }} />
        </div>
    );
};
