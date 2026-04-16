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
        d === 'easy' ? 'text-emerald-500 border-emerald-500' : 
        d === 'medium' ? 'text-amber-500 border-amber-500' : 'text-rose-500 border-rose-500';

    if (activeId && challenge) {
        return (
            <div className="relative flex flex-col gap-6 px-10 w-full max-w-5xl mx-auto font-mono">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveId(null)}
                        className="bg-transparent border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        ← Back
                    </button>
                    <div className="text-sm text-slate-900 dark:text-white font-black">{challenge.title}</div>
                    <span className={`text-[9px] px-2 py-0.5 border bg-white/5 bg-opacity-10 rounded uppercase ${diffColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                    </span>
                    <span className="ml-auto text-xs text-amber-500 font-bold tracking-widest">⚡ {challenge.xp} XP</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-sans font-medium italic m-0">{challenge.description}</p>

                <div className="bg-white dark:bg-slate-950 rounded-[48px] p-12 border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-300">
                    <KMapEngine
                        variables={challenge.variables}
                        targetMinterms={challenge.minterms}
                        mode="group"
                        onGroupsVerified={handleGroupsVerified}
                    />
                </div>

                {/* Result overlay */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className={`fixed top-[35%] left-1/2 -translate-x-1/2 z-[1000] border-2 rounded-[32px] p-10 text-center backdrop-blur-2xl shadow-2xl transition-all
                                ${showResult.passed 
                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/90 border-emerald-500 shadow-emerald-500/20' 
                                    : 'bg-rose-50/90 dark:bg-rose-950/90 border-rose-500 shadow-rose-500/20'}`}
                        >
                            {showResult.passed 
                                ? <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" /> 
                                : <XCircle size={48} className="text-rose-500 mx-auto mb-4" />}
                            <div className={`text-2xl font-black uppercase tracking-wider mb-4 ${showResult.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {showResult.passed ? 'Accepted!' : 'Wrong Answer'}
                            </div>
                            {showResult.passed && (
                                <div className="flex gap-8 mt-6 justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-amber-500">{showResult.score}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SCORE</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-sky-500">{showResult.reduction}%</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">GATE REDUCTION</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-emerald-500">+{challenge.xp}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">XP EARNED</div>
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
        <div className="flex flex-col gap-10 px-10 font-mono w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <span className="text-[9px] tracking-[0.25em] uppercase text-sky-500 font-black block mb-3">
                    Scene 5.4 — Optimization Challenges
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter m-0">Hardware LeetCode</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-sans font-medium italic">
                    Solve real-world logic minimization problems. Complete all 6 to advance.
                </p>
            </div>

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHALLENGES.map((ch, i) => {
                    const isComplete = passed.has(ch.id) || completedChallengeIds.has(ch.id);
                    return (
                        <motion.div key={ch.id} whileHover={!isComplete ? { y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' } : undefined}
                            onClick={() => !isComplete && setActiveId(ch.id)}
                            className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300
                                ${isComplete 
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/50 cursor-default shadow-none' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer shadow-lg hover:border-sky-500/30'}`}
                        >
                            {isComplete && (
                                <CheckCircle2 size={16} className="text-emerald-500 absolute top-5 right-5" />
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[11px] text-slate-400 dark:text-slate-600 font-bold">#{i + 1}</span>
                                <span className={`text-[9px] px-2 py-0.5 border rounded uppercase font-bold bg-white/5 ${diffColor(ch.difficulty)}`}>
                                    {ch.difficulty}
                                </span>
                                <span className="ml-auto text-[10px] font-bold tracking-widest text-amber-500">⚡ {ch.xp} XP</span>
                            </div>
                            <div className={`text-base font-black mb-2 ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                {ch.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed mb-6 font-medium italic">
                                {ch.description}
                            </div>
                            <div className="flex gap-4 mt-auto">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    <Cpu size={12} /> {ch.variables} vars
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    <Activity size={12} /> {ch.optimalGates}→{ch.reducedGates} gates
                                </div>
                            </div>
                            {!isComplete && (
                                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 absolute right-4 bottom-5" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress Footer */}
            <div className="text-center font-mono text-xs font-bold text-slate-500 dark:text-slate-400 mt-4">
                {passed.size + completedChallengeIds.size}/{CHALLENGES.length} completed
                {allPassed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-6 flex items-center justify-center gap-2 text-amber-500 font-black uppercase tracking-widest">
                        <Trophy size={20} /> All challenges complete! Moving to final scene...
                    </motion.div>
                )}
            </div>
        </div>
    );
};
