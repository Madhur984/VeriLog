/**
 * KMapChallenges.tsx — Scene 5.4: 6 K-Map optimization challenges.
 *
 * Features:
 * - 6 challenges across 3 difficulty tiers  
 * - Truth-table equivalence for expression validation
 * - Gate-reduction animation on success
 * - All attempts persisted to Supabase via useKMapProgress
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Cpu, Activity, Trophy } from 'lucide-react';
import { KMapEngine } from './KMapEngine';
import type { ChallengeAttempt } from '../../hooks/useKMapProgress';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

// ─── Challenge Definitions ────────────────────────────────────────────────────

interface Challenge {
    id: string;
    title: string;
    description: string;
    variables: 2 | 3 | 4;
    minterms: number[];
    optimalGroups: number; // minimum number of groups for optimal solution
    optimalGates: number;  // gates in unsimplified form
    reducedGates: number;  // gates after minimization
    xp: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

const CHALLENGES: Challenge[] = [
    {
        id: 'ch-2v-and',
        title: 'Simple AND',
        description: 'A 2-variable function. Identify the groupings and simplify F.',
        variables: 2, minterms: [3], optimalGroups: 1,
        optimalGates: 4, reducedGates: 1, xp: 50, difficulty: 'easy',
    },
    {
        id: 'ch-2v-or',
        title: 'Inclusive OR',
        description: 'Find a single-term expression from the 2-var K-Map.',
        variables: 2, minterms: [1, 2, 3], optimalGroups: 2,
        optimalGates: 5, reducedGates: 2, xp: 50, difficulty: 'easy',
    },
    {
        id: 'ch-3v-bc',
        title: '3-Variable Pair',
        description: 'Minterms share a common pattern. One group covers them all.',
        variables: 3, minterms: [2, 3, 6, 7], optimalGroups: 1,
        optimalGates: 8, reducedGates: 1, xp: 100, difficulty: 'medium',
    },
    {
        id: 'ch-3v-wrap',
        title: 'Wrap-Around Group',
        description: 'This one requires using the wrap-around adjacency of the K-Map.',
        variables: 3, minterms: [0, 1, 4, 5], optimalGroups: 1,
        optimalGates: 9, reducedGates: 1, xp: 100, difficulty: 'medium',
    },
    {
        id: 'ch-4v-medium',
        title: '4-Variable Minimize',
        description: 'Multiple groups, find the minimal sum-of-products expression.',
        variables: 4, minterms: [0, 1, 5, 7, 8, 9, 13, 15], optimalGroups: 3,
        optimalGates: 14, reducedGates: 5, xp: 200, difficulty: 'hard',
    },
    {
        id: 'ch-4v-expert',
        title: 'Expert Reduction',
        description: 'A complex 4-variable function. Find the optimal cover.',
        variables: 4, minterms: [0, 2, 5, 7, 8, 10, 13, 15], optimalGroups: 4,
        optimalGates: 18, reducedGates: 6, xp: 200, difficulty: 'hard',
    },
];

// Evaluate f(inputs) from a truth table lookup
function evaluateTruthTable(minterms: number[], numVars: number, inputs: number[]): boolean {
    const idx = inputs.reduce((acc, bit, i) => acc | (bit << (numVars - 1 - i)), 0);
    return minterms.includes(idx);
}

// Evaluate a simplified SOP expression like "AC' + B"
function evaluateExpression(expr: string, numVars: number, inputs: number[]): boolean {
    const varNames = 'ABCDEFGH'.slice(0, numVars).split('');
    const terms = expr.split('+').map(t => t.trim()).filter(Boolean);
    return terms.some(term => {
        const literals = term.match(/[A-H]'?/g) || [];
        return literals.every(lit => {
            const inverted = lit.endsWith("'");
            const varIdx = varNames.indexOf(lit.replace("'", ''));
            if (varIdx === -1) return false;
            return inverted ? inputs[varIdx] === 0 : inputs[varIdx] === 1;
        });
    });
}

function checkEquivalence(minterms: number[], expr: string, numVars: number): boolean {
    const total = 1 << numVars;
    for (let i = 0; i < total; i++) {
        const inputs = Array.from({ length: numVars }, (_, b) => (i >> (numVars - 1 - b)) & 1);
        const expected = evaluateTruthTable(minterms, numVars, inputs);
        const actual = evaluateExpression(expr, numVars, inputs);
        if (expected !== actual) return false;
    }
    return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
    onComplete: () => void;
    submitChallenge: (attempt: ChallengeAttempt) => Promise<void>;
    completedChallengeIds: Set<string>;
}

export const KMapChallenges: React.FC<Props> = ({ onComplete, submitChallenge, completedChallengeIds }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [passed, setPassed] = useState<Map<string, boolean>>(new Map());
    const [showResult, setShowResult] = useState<{ passed: boolean; score: number; reduction: number } | null>(null);
    const startTime = useRef<number>(0);

    const challenge = useMemo(() => CHALLENGES.find(c => c.id === activeId), [activeId]);

    useEffect(() => {
        if (activeId) startTime.current = Date.now();
    }, [activeId]);

    const handleGroupsVerified = useCallback(async (groups: string[][], expression: string) => {
        if (!challenge) return;

        const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
        const isPassed = checkEquivalence(challenge.minterms, expression, challenge.variables);
        const groupBonus = groups.length <= challenge.optimalGroups ? 20 : 0;
        const score = isPassed ? Math.min(100, 70 + groupBonus + Math.max(0, 10 - Math.floor(timeTaken / 15))) : 0;
        const reduction = Math.round(((challenge.optimalGates - challenge.reducedGates) / challenge.optimalGates) * 100);

        await submitChallenge({
            challenge_id: challenge.id,
            passed: isPassed,
            score,
            gate_reduction: reduction,
            time_taken_seconds: timeTaken,
            expression_submitted: expression,
        });

        if (isPassed) {
            setPassed(prev => new Map([...prev, [challenge.id, true]]));
        }

        setShowResult({ passed: isPassed, score, reduction });
        setTimeout(() => {
            setShowResult(null);
            if (isPassed) setActiveId(null);
        }, 3500);
    }, [challenge, submitChallenge]);

    const allPassed = CHALLENGES.every(c => passed.has(c.id) || completedChallengeIds.has(c.id));

    useEffect(() => {
        if (allPassed) {
            const t = setTimeout(onComplete, 1000);
            return () => clearTimeout(t);
        }
    }, [allPassed, onComplete]);

    const diffColor = (d: Challenge['difficulty']) =>
        d === 'easy' ? T.success : d === 'medium' ? T.warning : T.error;

    if (activeId && challenge) {
        return (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, padding: '0 40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={() => setActiveId(null)}
                        style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, cursor: 'pointer', padding: '6px 14px', borderRadius: 6, fontFamily: T.mono, fontSize: 11 }}>
                        ← Back
                    </button>
                    <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text, fontWeight: 700 }}>{challenge.title}</div>
                    <span style={{ fontSize: 9, padding: '2px 8px', border: `1px solid ${diffColor(challenge.difficulty)}40`, color: diffColor(challenge.difficulty), borderRadius: 4, textTransform: 'uppercase', fontFamily: T.mono }}>
                        {challenge.difficulty}
                    </span>
                    <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 11, color: T.warning }}>⚡ {challenge.xp} XP</span>
                </div>
                <p style={{ color: T.muted, fontFamily: T.mono, fontSize: 13, margin: 0 }}>{challenge.description}</p>

                <KMapEngine
                    variables={challenge.variables}
                    targetMinterms={challenge.minterms}
                    mode="group"
                    onGroupsVerified={handleGroupsVerified}
                />

                {/* Result overlay */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
                                zIndex: 1000, background: showResult.passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                border: `2px solid ${showResult.passed ? T.success : T.error}`,
                                borderRadius: 20, padding: '32px 48px', textAlign: 'center',
                                backdropFilter: 'blur(16px)', fontFamily: T.mono,
                                boxShadow: `0 0 60px ${showResult.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}`,
                            }}>
                            {showResult.passed ? <CheckCircle2 size={48} color={T.success} style={{ marginBottom: 12 }} /> : <XCircle size={48} color={T.error} style={{ marginBottom: 12 }} />}
                            <div style={{ fontSize: 20, fontWeight: 700, color: showResult.passed ? T.success : T.error, marginBottom: 8 }}>
                                {showResult.passed ? 'Accepted!' : 'Wrong Answer'}
                            </div>
                            {showResult.passed && (
                                <div style={{ display: 'flex', gap: 24, marginTop: 8, justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: T.warning }}>{showResult.score}</div>
                                        <div style={{ fontSize: 10, color: T.muted }}>SCORE</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{showResult.reduction}%</div>
                                        <div style={{ fontSize: 10, color: T.muted }}>GATE REDUCTION</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: T.success }}>+{challenge.xp}</div>
                                        <div style={{ fontSize: 10, color: T.muted }}>XP EARNED</div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '0 40px', fontFamily: T.mono }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 5.4 — Optimization Challenges
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Hardware LeetCode</h2>
                <p style={{ color: T.muted, fontSize: 14, marginTop: 8 }}>
                    Solve real-world logic minimization problems. Complete all 6 to advance.
                </p>
            </div>

            {/* Challenge Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {CHALLENGES.map((ch, i) => {
                    const isComplete = passed.has(ch.id) || completedChallengeIds.has(ch.id);
                    return (
                        <motion.div key={ch.id} whileHover={!isComplete ? { y: -4, boxShadow: `0 12px 32px rgba(0,0,0,0.5)` } : undefined}
                            onClick={() => !isComplete && setActiveId(ch.id)}
                            style={{
                                background: isComplete ? 'rgba(16,185,129,0.06)' : T.card,
                                border: `1px solid ${isComplete ? T.success : T.border}`,
                                borderRadius: 12, padding: '20px 24px',
                                cursor: isComplete ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative', overflow: 'hidden',
                            }}>
                            {isComplete && (
                                <CheckCircle2 size={16} color={T.success} style={{ position: 'absolute', top: 16, right: 16 }} />
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <span style={{ fontSize: 11, color: T.muted, opacity: 0.6 }}>#{i + 1}</span>
                                <span style={{ fontSize: 9, padding: '2px 8px', border: `1px solid ${diffColor(ch.difficulty)}40`, color: diffColor(ch.difficulty), borderRadius: 4, textTransform: 'uppercase' }}>
                                    {ch.difficulty}
                                </span>
                                <span style={{ marginLeft: 'auto', fontSize: 10, color: T.warning }}>⚡ {ch.xp} XP</span>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: isComplete ? T.success : T.text, marginBottom: 6 }}>{ch.title}</div>
                            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{ch.description}</div>
                            <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: T.muted }}>
                                    <Cpu size={11} /> {ch.variables} vars
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: T.muted }}>
                                    <Activity size={11} /> {ch.optimalGates}→{ch.reducedGates} gates
                                </div>
                            </div>
                            {!isComplete && (
                                <ChevronRight size={18} color={T.muted} style={{ position: 'absolute', right: 16, bottom: 20 }} />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress Footer */}
            <div style={{ textAlign: 'center', fontFamily: T.mono, fontSize: 12, color: T.muted }}>
                {passed.size + completedChallengeIds.size}/{CHALLENGES.length} completed
                {allPassed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: T.warning }}>
                        <Trophy size={20} /> All challenges complete! Moving to final scene...
                    </motion.div>
                )}
            </div>
        </div>
    );
};
