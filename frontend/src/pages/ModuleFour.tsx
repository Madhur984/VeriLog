import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Zap, Trophy, ChevronRight } from 'lucide-react';
import { useEngagementAdapter } from '../hooks/useEngagementAdapter';
import { GateDiscovery } from '../components/level4/GateDiscovery';
import { GateLab } from '../components/level4/GateLab';
import { CircuitBuilder } from '../components/level4/CircuitBuilder';
import { LogicPuzzle } from '../components/level4/LogicPuzzle';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    surface: '#F1F5F9',
    accent: '#0EA5E9',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
    mono: "'JetBrains Mono', monospace",
    body: "'DM Sans', Inter, sans-serif",
};

// ── Scene Types ───────────────────────────────────────────────────────────────
type Scene = 'intro' | 'gate_discovery' | 'gate_lab' | 'circuit_builder' | 'logic_puzzle' | 'complete';

interface SceneMeta {
    id: Scene;
    label: string;
    step: number;
}

const SCENES: SceneMeta[] = [
    { id: 'gate_discovery', label: 'Gate Discovery', step: 1 },
    { id: 'gate_lab', label: 'Gate Lab', step: 2 },
    { id: 'circuit_builder', label: 'Circuit Builder', step: 3 },
    { id: 'logic_puzzle', label: 'Puzzle Arena', step: 4 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const EnterpriseBtn: React.FC<{
    children: React.ReactNode; onClick: () => void;
    variant?: 'primary' | 'ghost'; disabled?: boolean; icon?: React.ReactNode;
}> = ({ children, onClick, variant = 'primary', disabled, icon }) => (
    <motion.button onClick={onClick} disabled={disabled} whileTap={{ scale: 0.96 }}
        style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 8,
            fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.38 : 1, transition: 'all 0.18s',
            background: variant === 'primary' ? `${T.accent}11` : 'rgba(0,0,0,0.03)',
            border: `1px solid ${variant === 'primary' ? `${T.accent}44` : 'rgba(0,0,0,0.08)'}`,
            color: variant === 'primary' ? T.accent : T.muted,
            backdropFilter: 'blur(8px)',
        }}>
        {icon}{children}
    </motion.button>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const ModuleFour: React.FC = () => {
    const navigate = useNavigate();
    const { awardXP, completeSkill } = useEngagementAdapter();

    const [scene, setScene] = useState<Scene>('intro');


    // Scene completion gates
    const [discoveryDone, setDiscoveryDone] = useState(false);
    const [labDone, setLabDone] = useState(false);
    const [builderDone, setBuilderDone] = useState(false);
    const [puzzlesDone, setPuzzlesDone] = useState(false);

    const goNext = useCallback(() => {
        if (scene === 'intro') {
            setScene('gate_discovery');
        } else if (scene === 'gate_discovery') {
            awardXP('structural');
            setScene('gate_lab');
        } else if (scene === 'gate_lab') {
            awardXP('diagnostic');
            setScene('circuit_builder');
        } else if (scene === 'circuit_builder') {
            awardXP('application');
            setScene('logic_puzzle');
        } else if (scene === 'logic_puzzle') {
            awardXP('application');
            setScene('complete');
            completeSkill('logic_gates');
        }
    }, [scene, awardXP, completeSkill]);

    const goBack = useCallback(() => {
        if (scene === 'gate_discovery') setScene('intro');
        else if (scene === 'gate_lab') setScene('gate_discovery');
        else if (scene === 'circuit_builder') setScene('gate_lab');
        else if (scene === 'logic_puzzle') setScene('circuit_builder');
    }, [scene]);

    // Canary for next button
    const canAdvance =
        scene === 'intro' ? true :
            scene === 'gate_discovery' ? discoveryDone :
                scene === 'gate_lab' ? labDone :
                    scene === 'circuit_builder' ? builderDone :
                        scene === 'logic_puzzle' ? puzzlesDone :
                            false;

    const progressPct = {
        intro: 0, gate_discovery: 15, gate_lab: 40, circuit_builder: 65, logic_puzzle: 85, complete: 100,
    }[scene];

    // ── INTRO ─────────────────────────────────────────────────────────────────
    if (scene === 'intro') {
        return (
            <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.body, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 20, background: `${T.accent}11`, border: `1px solid ${T.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 40px ${T.accent}11` }}>
                            <Cpu size={36} style={{ color: T.accent }} />
                        </div>
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.accent, marginBottom: 16 }}>
                        Level 4 — Logic Gates
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: T.text, marginBottom: 16, lineHeight: 1.2 }}>
                        The Language of<br />Digital Hardware
                    </h1>
                    <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                        Every processor, every memory chip, every communication circuit you've ever used is built from logic gates. Learn to think in AND, OR, NOT, XOR — and you'll understand how computers reason at the atomic level.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
                        {[
                            { label: 'Gate Types', sub: 'AND · OR · NOT · NAND · NOR · XOR · XNOR', color: T.accent },
                            { label: 'Live Truth Tables', sub: 'Toggle inputs — watch outputs respond', color: T.success },
                            { label: 'Circuit Puzzles', sub: '5 progressive logic challenges', color: T.warning },
                        ].map(card => (
                            <div key={card.label} style={{ padding: 16, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'left' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.color, marginBottom: 8, boxShadow: `0 0 8px ${card.color}80` }} />
                                <div style={{ fontFamily: T.mono, fontSize: 10, color: card.color, marginBottom: 4 }}>{card.label}</div>
                                <div style={{ fontSize: 11, color: T.muted }}>{card.sub}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <EnterpriseBtn onClick={() => navigate('/portal')} variant="ghost" icon={<ArrowLeft size={13} />}>Back</EnterpriseBtn>
                        <EnterpriseBtn onClick={goNext} icon={<Zap size={13} />}>Enter Module</EnterpriseBtn>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── COMPLETE ──────────────────────────────────────────────────────────────
    if (scene === 'complete') {
        return (
            <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.body, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ maxWidth: 580, width: '100%', textAlign: 'center' }}>
                    <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: 64, marginBottom: 24 }}>⚡</motion.div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.accent, marginBottom: 12 }}>
                        Level 4 Complete
                    </div>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 16 }}>Logic Gates Mastered</h1>
                    <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
                        You've characterized all 7 logic gates, completed the gate lab, and solved all circuit puzzles. You now speak the language of digital hardware.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
                        {[
                            { label: 'Gates Explored', value: '7', color: T.accent },
                            { label: 'XP Earned', value: '+400', color: T.success },
                            { label: 'Puzzles Solved', value: '5/5', color: T.warning },
                        ].map(s => (
                            <div key={s.label} style={{ padding: '14px 20px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
                                <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <EnterpriseBtn onClick={() => navigate('/portal')} variant="ghost" icon={<ArrowLeft size={13} />}>Back to Map</EnterpriseBtn>
                        <EnterpriseBtn onClick={() => navigate('/portal')} icon={<Trophy size={13} />}>Continue</EnterpriseBtn>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── MODULE SCENES ─────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.body }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 40, padding: '0 24px',
                height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${T.border}`,
            }}>
                <button onClick={() => navigate('/portal')} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', color: T.muted, cursor: 'pointer',
                    fontFamily: T.mono, fontSize: 10, letterSpacing: '0.12em',
                }}>
                    <ArrowLeft size={13} /> PORTAL
                </button>

                {/* Progress bar */}
                <div style={{ flex: 1, maxWidth: 400, margin: '0 24px' }}>
                    <div style={{ height: 2, background: T.surface, borderRadius: 1, overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }}
                            style={{ height: '100%', background: `linear-gradient(to right, ${T.accent}, #818cf8)`, borderRadius: 1 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        {SCENES.map(s => (
                            <span key={s.id} style={{ fontFamily: T.mono, fontSize: 8, color: scene === s.id ? T.accent : T.muted, letterSpacing: '0.1em' }}>
                                {s.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        padding: '6px 14px', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.12em',
                        textTransform: 'uppercase', borderRadius: 6,
                        background: 'rgba(0,0,0,0.03)', border: `1px solid ${T.border}`, color: T.muted,
                    }}>
                        UNIT 04
                    </div>
                </div>
            </header>

            {/* Scene content */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 120px' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={scene} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.28 }}>
                        {scene === 'gate_discovery' && (
                            <GateDiscovery
                                onComplete={() => { setDiscoveryDone(true); }}
                                hasCompleted={discoveryDone}
                            />
                        )}
                        {scene === 'gate_lab' && (
                            <GateLab
                                onComplete={() => { setLabDone(true); }}
                                hasCompleted={labDone}
                            />
                        )}
                        {scene === 'circuit_builder' && (
                            <CircuitBuilder
                                onComplete={() => { setBuilderDone(true); }}
                                hasCompleted={builderDone}
                            />
                        )}
                        {scene === 'logic_puzzle' && (
                            <LogicPuzzle
                                onAllComplete={() => { setPuzzlesDone(true); }}
                                onSolve={() => { }}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom navigation */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
                padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                borderTop: `1px solid ${T.border}`,
            }}>
                <EnterpriseBtn onClick={goBack} variant="ghost"
                    disabled={scene === 'gate_discovery'}
                    icon={<ArrowLeft size={13} />}>Back</EnterpriseBtn>

                {/* Scene indicator */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {SCENES.map(s => (
                        <div key={s.id} style={{
                            width: s.id === scene ? 24 : 6, height: 6, borderRadius: 3, transition: 'all 0.3s',
                            background: s.id === scene ? T.accent :
                                SCENES.findIndex(x => x.id === s.id) < SCENES.findIndex(x => x.id === scene) ? `${T.accent}50` : T.surface,
                        }} />
                    ))}
                </div>

                <EnterpriseBtn onClick={goNext} disabled={!canAdvance} icon={<ChevronRight size={13} />}>
                    {scene === 'logic_puzzle' ? 'Complete' : 'Next'}
                </EnterpriseBtn>
            </div>
        </div>
    );
};
