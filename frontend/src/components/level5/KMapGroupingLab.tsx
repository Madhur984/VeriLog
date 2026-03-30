/**
 * KMapGroupingLab.tsx — Scene 5.3: Interactive grouping with real validation feedback.
 *
 * Wraps KMapEngine in group mode and adds:
 * - Green pulse + XP badge pop on valid group saved
 * - Red border shake + AI Analyst hint on invalid group
 * - Group size badge (2^n) per group
 * - "All 1s covered" celebration with DB persist
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Zap, ShieldCheck } from 'lucide-react';
import { KMapEngine } from './KMapEngine';
import type { useKMapProgress } from '../../hooks/useKMapProgress';



type ProgressHook = ReturnType<typeof useKMapProgress>;

interface Props {
    onComplete: (groups: string[][], expression: string) => void;
    onInvalidGroup: () => void;
    onValidGroup: () => void;
    saveSession: ProgressHook['saveKMapSession'];
}

type FeedbackType = 'success' | 'error' | 'complete' | null;

export const KMapGroupingLab: React.FC<Props> = ({ onComplete, onInvalidGroup, saveSession }) => {
    const [feedback, setFeedback] = useState<FeedbackType>(null);
    const [lastXP, setLastXP] = useState(0);
    const [xpTotal, setXpTotal] = useState(0);
    const [completed, setCompleted] = useState(false);

    const showFeedback = useCallback((type: FeedbackType, xp = 0) => {
        setFeedback(type);
        if (xp > 0) { setLastXP(xp); setXpTotal(p => p + xp); }
        setTimeout(() => setFeedback(null), 2200);
    }, []);

    const handleGroupsVerified = useCallback(async (groups: string[][], expression: string) => {
        if (completed) return;
        setCompleted(true);
        showFeedback('complete', 50);

        await saveSession({
            variables: 3,
            minterms: [1, 3, 5, 7],
            groups,
            expression,
            is_optimal: groups.length <= 1,
        });

        setTimeout(() => onComplete(groups, expression), 1800);
    }, [completed, showFeedback, saveSession, onComplete]);

    // Called by KMapEngine when user tries to save an invalid group
    const handleInvalidGroup = useCallback(() => {
        showFeedback('error', 0);
        onInvalidGroup();
    }, [showFeedback, onInvalidGroup]);

    const handleValidGroup = useCallback(() => {
        showFeedback('success', 25);
    }, [showFeedback]);

    return (
        <div className="relative flex flex-col gap-10 px-10 font-mono">
            {/* Header */}
            <div className="text-center">
                <span className="text-[9px] uppercase tracking-[0.25em] text-sky-500 font-black block mb-2">
                    Scene 5.3 — Grouping Lab
                </span>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase margin-0">Mathematical Minimization</h2>
                <p className="text-slate-400 text-sm mt-4 font-sans font-bold leading-relaxed italic">
                    "Click adjacent 1s to form groups. Groups must be rectangular, sized as powers of 2 (1, 2, 4, 8)."
                </p>
            </div>

            {/* XP Tracker */}
            <motion.div animate={{ opacity: xpTotal > 0 ? 1 : 0 }} className="absolute top-2 right-10 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 text-xs font-black text-emerald-600 shadow-xl shadow-emerald-50">
                <Zap size={16} fill="currentColor" /> +{xpTotal} XP
            </motion.div>

            {/* Core Engine */}
            <div className="bg-white rounded-[48px] p-12 border border-slate-200 shadow-2xl">
                <KMapEngine
                    variables={3}
                    targetMinterms={[1, 3, 5, 7]}
                    mode="group"
                    onGroupsVerified={handleGroupsVerified}
                    onInvalidGroup={handleInvalidGroup}
                    onValidGroup={handleValidGroup}
                />
            </div>

            {/* Feedback Overlays */}
            <AnimatePresence>
                {feedback === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="fixed top-[30%] left-1/2 -translate-x-1/2 z-[1000] bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-100 rounded-[32px] p-8 flex items-center gap-8 backdrop-blur-xl"
                    >
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900 uppercase italic">Valid Group!</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">+{lastXP} structural XP synchronized</div>
                        </div>
                    </motion.div>
                )}

                {feedback === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed top-[30%] left-1/2 -translate-x-1/2 z-[1000] bg-white border-2 border-rose-500 shadow-2xl shadow-rose-100 rounded-[32px] p-8 flex items-center gap-8 backdrop-blur-xl"
                    >
                        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900 uppercase italic">Invalid Group</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Groups must be powers of 2 (binary logic)</div>
                        </div>
                    </motion.div>
                )}

                {feedback === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-[30%] left-1/2 -translate-x-1/2 z-[1000] bg-white border-4 border-sky-500 shadow-[0_0_80px_rgba(14,165,233,0.3)] rounded-[48px] p-12 flex flex-col items-center gap-6 backdrop-blur-2xl"
                    >
                        <div className="p-6 bg-sky-50 rounded-full text-sky-500 shadow-inner">
                            <ShieldCheck size={48} />
                        </div>
                        <div className="text-2xl font-black text-slate-900 uppercase italic tracking-widest">MINIMIZATION_COMPLETE</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Advancing to logical realization...</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
