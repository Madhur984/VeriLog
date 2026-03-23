import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

/**
 * CognitiveCheckpoint.tsx
 * 
 * An inline pedagogical block that adapts to the user's cognitive state.
 * NOT a modal. Part of the scroll flow.
 */

export type CheckMode = 'VERIFY' | 'PREDICT' | 'APPLY';

interface Option {
    text: string;
    isCorrect: boolean;
}

interface CognitiveCheckpointProps {
    mode: CheckMode;
    question: string;
    options: Option[];
    explanation: string;
    onSuccess: (xp: number) => void;
    onFailure?: () => void;
    difficulty?: 'Easy' | 'Hard';
}

const T = {
    bg: '#0D0F16',
    border: '#1A1D24',
    accent: '#00D4FF',
    success: '#10B981',
    error: '#EF4444',
    text: '#E5E7EB',
    muted: '#64748B',
    mono: "'IBM Plex Mono', monospace"
};

export function CognitiveCheckpoint({
    mode, question, options, explanation, onSuccess, onFailure, difficulty = 'Easy'
}: CognitiveCheckpointProps) {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = useCallback((idx: number) => {
        if (isSubmitted) return;
        
        const correct = options[idx].isCorrect;
        
        setSelectedIdx(idx);
        setIsSubmitted(true);
        setIsCorrect(correct);

        if (correct) {
            triggerHaptic('success');
            playSound('success');
            onSuccess(difficulty === 'Hard' ? 20 : 10);
        } else {
            triggerHaptic('error');
            playSound('fail');
            onFailure?.();
        }
    }, [isSubmitted, options, triggerHaptic, playSound, onSuccess, onFailure, difficulty]);

    const getModeLabel = () => {
        switch (mode) {
            case 'VERIFY': return 'SYSTEM_CHECK';
            case 'PREDICT': return 'PROJECTION_MODE';
            case 'APPLY': return 'ENGINEERING_TASK';
            default: return 'CHECKPOINT';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
                background: T.bg,
                border: `1px solid ${isSubmitted ? (isCorrect ? T.success : T.error) : T.border}`,
                borderRadius: 8,
                padding: '20px',
                margin: '24px 0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Mode Tag */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                padding: '4px 12px', background: T.border,
                borderBottomLeftRadius: 8, fontFamily: T.mono,
                fontSize: 9, color: T.accent, letterSpacing: '0.1em'
            }}>
                {getModeLabel()}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(0, 212, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: T.accent, flexShrink: 0
                }}>
                    <HelpCircle size={18} />
                </div>

                <div style={{ flex: 1 }}>
                    <h4 style={{ 
                        margin: '0 0 16px 0', fontSize: 16, color: T.text,
                        lineHeight: 1.4, maxWidth: '90%'
                    }}>
                        {question}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={isSubmitted}
                                onClick={() => handleSubmit(idx)}
                                style={{
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    background: selectedIdx === idx 
                                        ? (opt.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')
                                        : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${
                                        selectedIdx === idx 
                                            ? (opt.isCorrect ? T.success : T.error) 
                                            : 'transparent'
                                    }`,
                                    borderRadius: 4,
                                    color: selectedIdx === idx ? T.text : T.muted,
                                    cursor: isSubmitted ? 'default' : 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: 14
                                }}
                            >
                                {opt.text}
                                {isSubmitted && opt.isCorrect && <CheckCircle2 size={14} color={T.success} />}
                                {isSubmitted && selectedIdx === idx && !opt.isCorrect && <XCircle size={14} color={T.error} />}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {isSubmitted && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}
                            >
                                <div style={{ 
                                    fontFamily: T.mono, fontSize: 11, color: isCorrect ? T.success : T.error,
                                    marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6
                                }}>
                                    {isCorrect ? 'VALIDATION_SUCCESS' : 'SYSTEM_RETRY_REQUIRED'}
                                </div>
                                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, margin: 0 }}>
                                    {explanation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
