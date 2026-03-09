/**
 * KMapGroupingLab.tsx — Scene 5.3: Interactive grouping with real validation feedback.
 *
 * Wraps KMapEngine in group mode and adds:
 * - Green pulse + XP badge pop on valid group saved
 * - Red border shake + VoltMonkey hint on invalid group
 * - Group size badge (2^n) per group
 * - "All 1s covered" celebration with DB persist
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Trophy, Zap } from 'lucide-react';
import { KMapEngine } from './KMapEngine';
import type { useKMapProgress } from '../../hooks/useKMapProgress';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

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
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, padding: '0 40px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 5.3 — Grouping Lab
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Mathematical Minimization</h2>
                <p style={{ color: T.muted, fontSize: 14, marginTop: 8 }}>
                    Click adjacent 1s to form groups. Groups must be rectangular, sized as powers of 2 (1, 2, 4, 8).
                </p>
            </div>

            {/* XP Tracker */}
            <motion.div animate={{ opacity: xpTotal > 0 ? 1 : 0 }} style={{
                position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 20, padding: '6px 14px', fontFamily: T.mono, fontSize: 12, color: T.success,
            }}>
                <Zap size={14} /> +{xpTotal} XP
            </motion.div>

            {/* Core Engine */}
            <KMapEngine
                variables={3}
                targetMinterms={[1, 3, 5, 7]}
                mode="group"
                onGroupsVerified={handleGroupsVerified}
                onInvalidGroup={handleInvalidGroup}
                onValidGroup={handleValidGroup}
            />

            {/* Feedback Overlays */}
            <AnimatePresence>
                {feedback === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        style={{
                            position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                            zIndex: 1000, background: 'rgba(16,185,129,0.12)', border: '2px solid #10B981',
                            borderRadius: 16, padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16,
                            backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(16,185,129,0.25)',
                            fontFamily: T.mono,
                        }}>
                        <CheckCircle2 size={28} color={T.success} />
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.success }}>Valid Group!</div>
                            <div style={{ fontSize: 11, color: 'rgba(16,185,129,0.7)', marginTop: 2 }}>+{lastXP} structural XP</div>
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
                        style={{
                            position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                            zIndex: 1000, background: 'rgba(239,68,68,0.1)', border: '2px solid #EF4444',
                            borderRadius: 16, padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16,
                            backdropFilter: 'blur(12px)', fontFamily: T.mono,
                        }}>
                        <AlertTriangle size={28} color={T.error} />
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.error }}>Invalid Group</div>
                            <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)', marginTop: 2 }}>Groups must be powers of 2</div>
                        </div>
                    </motion.div>
                )}

                {feedback === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                            zIndex: 1000, background: 'rgba(245,158,11,0.1)', border: '2px solid #F59E0B',
                            borderRadius: 20, padding: '28px 40px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 12, backdropFilter: 'blur(16px)',
                            boxShadow: '0 0 60px rgba(245,158,11,0.3)', fontFamily: T.mono,
                        }}>
                        <Trophy size={40} color={T.warning} />
                        <div style={{ fontSize: 18, fontWeight: 700, color: T.warning }}>All 1s Covered!</div>
                        <div style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)' }}>Advancing to Simplification...</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
