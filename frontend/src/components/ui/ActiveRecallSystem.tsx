import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, X, ArrowRight } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';

export interface Question {
    id: string;
    type: 'instant' | 'prediction';
    text: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
}

interface ActiveRecallProps {
    question: Question | null;
    onAnswer: (correct: boolean) => void;
    isVisible: boolean;
}

export const ActiveRecallSystem: React.FC<ActiveRecallProps> = ({
    question,
    onAnswer,
    isVisible
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [showCorrection, setShowCorrection] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setSelectedIdx(null);
            setShowCorrection(false);
        }
    }, [isVisible, question]);

    if (!question) return null;

    const handleSelect = (idx: number) => {
        if (selectedIdx !== null) return;
        setSelectedIdx(idx);
        const correct = question.options[idx].isCorrect;
        
        if (correct) {
            triggerHaptic('success');
            playSound('success');
            onAnswer(true);
        } else {
            triggerHaptic('error');
            playSound('fail');
            setShowCorrection(true);
            onAnswer(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'min(92vw, 400px)',
                        maxHeight: '86svh',
                        overflowY: 'auto',
                        background: '#0D0F16',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: 12,
                        padding: 'clamp(20px, 6vw, 32px)',
                        zIndex: 10001,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,255,0.1)',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <div style={{ 
                            padding: 10, background: 'rgba(0,212,255,0.1)', 
                            borderRadius: '50%', color: '#00D4FF' 
                        }}>
                            <Brain size={24} />
                        </div>
                    </div>

                    <div style={{ 
                        fontFamily: 'IBM Plex Mono', fontSize: 10, 
                        color: '#00D4FF', marginBottom: 8, letterSpacing: '0.2em' 
                    }}>
                        {question.type === 'prediction' ? 'PREDICTION MODE' : 'INSTANT CHECK'}
                    </div>

                    <h3 style={{ margin: '0 0 24px 0', fontSize: 18, lineHeight: 1.4 }}>{question.text}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {question.options.map((opt, i) => {
                            const isSelected = selectedIdx === i;
                            const isCorrect = opt.isCorrect;
                            
                            let borderColor = 'rgba(255,255,255,0.1)';
                            let bgColor = 'rgba(255,255,255,0.02)';
                            
                            if (isSelected) {
                                borderColor = isCorrect ? '#10B981' : '#EF4444';
                                bgColor = isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(i)}
                                    disabled={selectedIdx !== null}
                                    style={{
                                        padding: '14px 20px',
                                        background: bgColor,
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: 6,
                                        color: '#E5E7EB',
                                        fontSize: 14,
                                        cursor: selectedIdx === null ? 'pointer' : 'default',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {opt.text}
                                    {isSelected && (isCorrect ? <Check size={16} color="#10B981" /> : <X size={16} color="#EF4444" />)}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {showCorrection && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ marginTop: 24, padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)' }}
                            >
                                <p style={{ margin: 0, fontSize: 13, color: '#EF4444', textAlign: 'left', lineHeight: 1.5 }}>
                                    <strong>Actually...</strong> {question.explanation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {selectedIdx !== null && (
                        <button
                            onClick={() => onAnswer(question.options[selectedIdx].isCorrect)}
                            style={{
                                marginTop: 24,
                                width: '100%',
                                padding: '12px',
                                background: '#00D4FF',
                                border: 'none',
                                borderRadius: 6,
                                color: '#000',
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            CONTINUE <ArrowRight size={16} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
