import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { useEngagementAdapter } from '../hooks/useEngagementAdapter';
import { useVoltMonkeyL5, type SceneId } from '../hooks/useVoltMonkeyL5';
import { CircuitComplexityDemo } from '../components/level5/CircuitComplexityDemo';
import { KMapEngine } from '../components/level5/KMapEngine';
import { BooleanSimplification } from '../components/level5/BooleanSimplification';
import { OptimizationComparison } from '../components/level5/OptimizationComparison';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
    bg: '#07080C', card: '#0D0F16', surface: '#1A1D24',
    accent: '#00D4FF', success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    text: '#E5E7EB', muted: '#64748B', border: '#1A1D24',
    mono: "'JetBrains Mono', monospace",
    body: "'DM Sans', Inter, sans-serif",
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ModuleFive: React.FC = () => {
    const navigate = useNavigate();
    const { awardXP, completeSkill } = useEngagementAdapter();
    const { mentorState, triggerResponse } = useVoltMonkeyL5();

    const [scene, setScene] = useState<SceneId>('scene-5-1');
    const [completedScenes, setCompletedScenes] = useState<Set<SceneId>>(new Set());
    const [savedGroups, setSavedGroups] = useState<string[][]>([]);
    const [savedExpression, setSavedExpression] = useState<string>('');

    const markCompleted = useCallback((s: SceneId, xp: number) => {
        if (!completedScenes.has(s)) {
            awardXP('application', xp);
            setCompletedScenes(prev => new Set([...prev, s]));
        }
    }, [completedScenes, awardXP]);

    // Scene Navigation
    const goScene1 = useCallback(() => { setScene('scene-5-1'); triggerResponse('scene-5-1'); }, [triggerResponse]);
    const goScene2 = useCallback(() => { setScene('scene-5-2'); triggerResponse('scene-5-2'); markCompleted('scene-5-1', 50); }, [triggerResponse, markCompleted]);
    const goScene3 = useCallback(() => { setScene('scene-5-3'); triggerResponse('scene-5-3'); markCompleted('scene-5-2', 50); }, [triggerResponse, markCompleted]);
    const goScene4 = useCallback((groups?: string[][], expression?: string) => {
        if (groups) setSavedGroups(groups);
        if (expression) setSavedExpression(expression);
        setScene('scene-5-4');
        triggerResponse('scene-5-4');
        markCompleted('scene-5-3', 100);
    }, [triggerResponse, markCompleted]);
    const goScene5 = useCallback(() => { setScene('scene-5-5'); triggerResponse('scene-5-5'); markCompleted('scene-5-4', 50); }, [triggerResponse, markCompleted]);

    return (
        <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column' }}>
            {/* ── Top Navigation Bar ───────────────────────────────────────────────── */}
            <div style={{ height: 64, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: T.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/portal')}
                        style={{ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div style={{ fontFamily: T.mono, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.text }}>
                        Level 5 <span style={{ color: T.muted }}>/</span> Karnaugh Map Optimization
                    </div>
                </div>

                {/* Top Scene Tabs */}
                <div style={{ display: 'flex', gap: 32, fontFamily: T.mono, fontSize: 12, letterSpacing: '0.05em' }}>
                    <Tab onClick={goScene1} active={scene === 'scene-5-1'} label="Complexity Demo" />
                    <Tab onClick={goScene2} active={scene === 'scene-5-2'} label="K-Map Builder" disabled={!completedScenes.has('scene-5-1') && scene !== 'scene-5-2'} />
                    <Tab onClick={goScene3} active={scene === 'scene-5-3'} label="Cell Grouping" disabled={!completedScenes.has('scene-5-2') && scene !== 'scene-5-3'} />
                    <Tab onClick={goScene4} active={scene === 'scene-5-4'} label="Simplification" disabled={!completedScenes.has('scene-5-3') && scene !== 'scene-5-4'} />
                    <Tab onClick={goScene5} active={scene === 'scene-5-5'} label="Optimization" disabled={!completedScenes.has('scene-5-4') && scene !== 'scene-5-5'} />
                </div>
            </div>

            {/* ── Main Layout ──────────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, position: 'relative', overflowY: 'auto', padding: '40px 24px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={scene} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            {scene === 'scene-5-1' && <CircuitComplexityDemo onComplete={goScene2} />}
                            {scene === 'scene-5-2' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 40px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                                            Scene 5.2 — Karnaugh Mapping
                                        </span>
                                        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Truth Table Translation</h2>
                                        <p style={{ color: T.muted, fontSize: 14 }}>
                                            Drag the $F=1$ results from the Truth Table into their corresponding cells on the K-Map.
                                        </p>
                                    </div>
                                    <KMapEngine variables={3} targetMinterms={[1, 3, 5, 7]} onFullyMapped={goScene3} />
                                </div>
                            )}
                            {scene === 'scene-5-3' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 40px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                                            Scene 5.3 — Cell Grouping
                                        </span>
                                        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Mathematical Minimization</h2>
                                        <p style={{ color: T.muted, fontSize: 14 }}>
                                            Click and drag to form groups of adjacent 1s. <br />
                                            Groups must be rectangular and sized in powers of 2 (1, 2, 4, 8).
                                        </p>
                                    </div>
                                    <KMapEngine variables={3} targetMinterms={[1, 3, 5, 7]} mode="group" onGroupsVerified={goScene4} />
                                </div>
                            )}
                            {scene === 'scene-5-4' && (
                                <BooleanSimplification variables={3} groups={savedGroups} expression={savedExpression} onComplete={goScene5} />
                            )}
                            {scene === 'scene-5-5' && (
                                <div style={{ padding: '0 40px' }}>
                                    <OptimizationComparison onComplete={() => {
                                        markCompleted('scene-5-5', 200);
                                        completeSkill('kmap_optimization');
                                    }} />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── VoltMonkey Side Panel ────────────────────────────────────────────── */}
                <div style={{ width: 340, borderLeft: `1px solid ${T.border}`, background: T.card, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 24, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <Bot size={24} color={T.warning} style={{ margin: '8px' }} />
                        </div>
                        <div>
                            <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.warning, letterSpacing: '0.1em' }}>VOLTMONKEY</div>
                            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>Hardware Mentor AI</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={scene + mentorState.observation}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                            >
                                {/* Observation (Muted) */}
                                <div>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>OBSERVATION</div>
                                    <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>{mentorState.observation}</div>
                                </div>

                                {/* Analysis (Primary) */}
                                <div>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>ANALYSIS</div>
                                    <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>{mentorState.analysis}</div>
                                </div>

                                {/* Suggestion (Amber Outline) */}
                                <div style={{ background: 'rgba(245,158,11,0.05)', border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 6, padding: 12 }}>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.warning, textTransform: 'uppercase', marginBottom: 4 }}>SUGGESTION</div>
                                    <div style={{ fontSize: 13, color: '#FDE68A', lineHeight: 1.5 }}>{mentorState.suggestion}</div>
                                </div>

                                {/* Engineering Insight (Cyan Text) */}
                                <div>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.accent, textTransform: 'uppercase', marginBottom: 4 }}>ENGINEERING INSIGHT</div>
                                    <div style={{ fontSize: 13, color: '#7DD3FC', lineHeight: 1.5 }}>{mentorState.insight}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div style={{ padding: 16, borderTop: `1px solid ${T.border}`, background: 'rgba(0,0,0,0.2)', fontSize: 11, fontFamily: T.mono, color: T.muted, display: 'flex', justifyContent: 'space-between' }}>
                        <span>PERFORMANCE TIER</span>
                        <span style={{ color: mentorState.tier === 'sharp' ? T.success : mentorState.tier === 'steady' ? T.accent : T.warning, textTransform: 'uppercase' }}>
                            {mentorState.tier}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Tab: React.FC<{ label: string; active: boolean; disabled?: boolean; onClick: () => void }> = ({ label, active, disabled, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: 'none', border: 'none', padding: '0 0 4px 0', cursor: disabled ? 'default' : 'pointer',
            color: active ? T.accent : disabled ? '#334155' : T.muted,
            borderBottom: active ? `2px solid ${T.accent}` : '2px solid transparent',
            transition: 'all 0.2s', opacity: disabled ? 0.5 : 1
        }}
    >
        {label}
    </button>
);


