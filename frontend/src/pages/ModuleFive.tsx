/**
 * ModuleFive.tsx — Level 5: Karnaugh Map Optimization
 *
 * 5-scene module with full Supabase-backed progress persistence.
 * Scenes: Intro → K-Map Builder → Grouping Lab → Challenges → Optimization
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEngagementAdapter } from '../hooks/useEngagementAdapter';

import { useKMapProgress } from '../hooks/useKMapProgress';
import { KMapIntro } from '../components/level5/KMapIntro';
import { KMapEngine } from '../components/level5/KMapEngine';
import { KMapGroupingLab } from '../components/level5/KMapGroupingLab';
import { KMapChallenges } from '../components/level5/KMapChallenges';
import { BooleanSimplification } from '../components/level5/BooleanSimplification';
import { OptimizationComparison } from '../components/level5/OptimizationComparison';

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
};

// ── Types ─────────────────────────────────────────────────────────────────────
type TabId = 'intro' | 'kmap-builder' | 'grouping-lab' | 'challenges' | 'optimization';

const TABS: { id: TabId; label: string; dbScene: string }[] = [

    { id: 'intro', label: 'Intro', dbScene: 'scene-5-1' },
    { id: 'kmap-builder', label: 'K-Map Builder', dbScene: 'scene-5-2' },
    { id: 'grouping-lab', label: 'Grouping Lab', dbScene: 'scene-5-3' },
    { id: 'challenges', label: 'Challenges', dbScene: 'scene-5-4' },
    { id: 'optimization', label: 'Optimization', dbScene: 'scene-5-5' },
];

// ── Main Component ────────────────────────────────────────────────────────────
export const ModuleFive: React.FC = () => {
    const navigate = useNavigate();
    const { awardXP, completeSkill } = useEngagementAdapter();

    const {
        completedScenes,
        loading,
        markSceneComplete,
        saveKMapSession,
        submitChallenge,
        unlockSkill,
    } = useKMapProgress('level-5');

    const [activeTab, setActiveTab] = useState<TabId>('intro');
    const [savedGroups, setSavedGroups] = useState<string[][]>([]);
    const [savedExpression, setSavedExpression] = useState<string>('');

    // Check if a tab is unlocked based on previous scene completion in DB
    const isTabUnlocked = useCallback((tabIdx: number): boolean => {
        if (tabIdx === 0) return true;
        const prevTab = TABS[tabIdx - 1];
        return completedScenes.has(prevTab.dbScene);
    }, [completedScenes]);

    const switchTab = useCallback((tab: (typeof TABS)[number], idx: number) => {
        if (!isTabUnlocked(idx)) return;
        setActiveTab(tab.id);
    }, [isTabUnlocked]);

    // ── Scene Completion Handlers ─────────────────────────────────────────────
    const handleIntroComplete = useCallback(async () => {
        await markSceneComplete('scene-5-1', 40);
        awardXP('structural', 40);
        setActiveTab('kmap-builder');
    }, [markSceneComplete, awardXP]);

    const handleKMapBuilderComplete = useCallback(async () => {
        await markSceneComplete('scene-5-2', 60);
        awardXP('structural', 60);
        setActiveTab('grouping-lab');
    }, [markSceneComplete, awardXP]);

    const handleGroupingComplete = useCallback(async (groups: string[][], expression: string) => {
        setSavedGroups(groups);
        setSavedExpression(expression);
        await markSceneComplete('scene-5-3', 100);
        awardXP('diagnostic', 100);
        setActiveTab('challenges');
    }, [markSceneComplete, awardXP]);

    const handleChallengesComplete = useCallback(async () => {
        await markSceneComplete('scene-5-4', 200);
        awardXP('application', 200);
        setActiveTab('optimization');
    }, [markSceneComplete, awardXP]);

    const handleOptimizationComplete = useCallback(async () => {
        await markSceneComplete('scene-5-5', 100);
        await unlockSkill('kmap_optimization');
        awardXP('application', 100);
        completeSkill('kmap_optimization');
    }, [markSceneComplete, unlockSkill, awardXP, completeSkill]);

    const handleInvalidGroup = useCallback(() => {
        // triggerContextual('invalid_group', mentorState.tier);
    }, []);

    const handleValidGroup = useCallback(() => {
        // triggerContextual('valid_group', mentorState.tier);
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} color={T.accent} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column' }}>
            {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
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

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: 28, fontFamily: T.mono, fontSize: 12, letterSpacing: '0.05em' }}>
                    {TABS.map((tab, idx) => {
                        const unlocked = isTabUnlocked(idx);
                        const isActive = activeTab === tab.id;
                        const isDone = completedScenes.has(tab.dbScene);
                        return (
                            <Tab
                                key={tab.id}
                                onClick={() => switchTab(tab, idx)}
                                active={isActive}
                                disabled={!unlocked}
                                label={tab.label}
                                done={isDone}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ── Main Layout ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Content Area */}
                <div style={{ flex: 1, position: 'relative', overflowY: 'auto', padding: '40px 0' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'intro' && (
                                <KMapIntro onComplete={handleIntroComplete} />
                            )}

                            {activeTab === 'kmap-builder' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 40px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                                            Scene 5.2 — K-Map Builder
                                        </span>
                                        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                                            Truth Table Translation
                                        </h2>
                                        <p style={{ color: T.muted, fontSize: 14 }}>
                                            Drag the F=1 results from the Truth Table into their corresponding K-Map cells.
                                        </p>
                                    </div>
                                    <KMapEngine
                                        variables={3}
                                        targetMinterms={[1, 3, 5, 7]}
                                        onFullyMapped={handleKMapBuilderComplete}
                                    />
                                </div>
                            )}

                            {activeTab === 'grouping-lab' && (
                                <KMapGroupingLab
                                    onComplete={handleGroupingComplete}
                                    onInvalidGroup={handleInvalidGroup}
                                    onValidGroup={handleValidGroup}
                                    saveSession={saveKMapSession}
                                />
                            )}

                            {activeTab === 'challenges' && (
                                <KMapChallenges
                                    onComplete={handleChallengesComplete}
                                    submitChallenge={submitChallenge}
                                    completedChallengeIds={new Set()}
                                />
                            )}

                            {activeTab === 'optimization' && (
                                <div style={{ padding: '0 40px' }}>
                                    {savedGroups.length > 0 ? (
                                        <BooleanSimplification
                                            variables={3}
                                            groups={savedGroups}
                                            expression={savedExpression}
                                            onComplete={() => {
                                                // Move to final comparison immediately
                                            }}
                                        />
                                    ) : (
                                        <OptimizationComparison onComplete={handleOptimizationComplete} />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>


            </div>
        </div>
    );
};

// ── Tab Component ─────────────────────────────────────────────────────────────
const Tab: React.FC<{
    label: string; active: boolean; disabled?: boolean; done?: boolean; onClick: () => void;
}> = ({ label, active, disabled, done, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: 'none', border: 'none', padding: '0 0 4px 0', cursor: disabled ? 'default' : 'pointer',
            color: active ? T.accent : disabled ? '#334155' : done ? T.success : T.muted,
            borderBottom: active ? `2px solid ${T.accent}` : '2px solid transparent',
            transition: 'all 0.2s', opacity: disabled ? 0.4 : 1,
            fontFamily: T.mono, fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 5,
        }}
    >
        {done && !active && <span style={{ fontSize: 10 }}>✓</span>}
        {label}
    </button>
);
