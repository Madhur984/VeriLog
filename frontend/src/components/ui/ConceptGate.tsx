/**
 * ConceptGate.tsx
 * 
 * A mandatory learning gate that ensures the user "Experiences" a concept
 * before they can access the challenge or quiz.
 * 
 * Levels:
 * 1. Intuition (Visual + 1-liner)
 * 2. Technical (Terminology + Deep-dive)
 * 3. Formal (Formula + Engineering Insight)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, BookOpen, Brain, ChevronRight, Lock } from 'lucide-react';

const T = {
    accent: '#00D4FF',
    success: '#34D399',
    error: '#EF4444',
    card: 'rgb(13, 15, 22)',
    border: 'rgba(0, 212, 255, 0.2)',
    text: '#E5E7EB',
    muted: '#94A3B8',
    mono: "'IBM Plex Mono', 'Roboto Mono', monospace",
};

export interface ConceptLevel {
    title: string;
    content: React.ReactNode;
    visualHighlight?: string; // ID of the element on screen to highlight
}

interface ConceptGateProps {
    title: string;
    levels: ConceptLevel[];
    onComplete: () => void;
    isVisible: boolean;
    interactionRequirement?: number; // 0-1
    currentExplorationScore?: number;
}

export const ConceptGate: React.FC<ConceptGateProps> = ({
    title,
    levels,
    onComplete,
    isVisible,
    interactionRequirement = 0,
    currentExplorationScore = 0
}) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [isFullyUnlocked, setIsFullyUnlocked] = useState(false);
    const [showFailureLoop, setShowFailureLoop] = useState(false);

    useEffect(() => {
        if (currentLevel >= levels.length - 1) {
            setIsFullyUnlocked(true);
        }
    }, [currentLevel, levels.length]);

    const handleNext = () => {
        if (currentLevel < levels.length - 1) {
            setCurrentLevel(prev => prev + 1);
        } else {
            // Final Unlock Validation
            if (currentExplorationScore < interactionRequirement) {
                setShowFailureLoop(true);
                setTimeout(() => setShowFailureLoop(false), 3000);
                return;
            }
            onComplete();
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(500px, 90vw)',
                    zIndex: 100,
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.1)',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(0,212,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: T.accent,
                    }}>
                        {currentLevel === 0 ? <Info size={18} /> : 
                         currentLevel === 1 ? <BookOpen size={18} /> : <Brain size={18} />}
                    </div>
                    <div>
                        <h4 style={{ 
                            fontFamily: T.mono, 
                            fontSize: 10, 
                            color: T.accent, 
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}>
                            Concept {currentLevel + 1}/{levels.length}: {title}
                        </h4>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            {levels.map((_, i) => (
                                <div key={i} style={{
                                    width: 12, height: 2, borderRadius: 1,
                                    background: i <= currentLevel ? T.accent : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease',
                                }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    key={currentLevel}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: T.text,
                        minHeight: 60,
                        marginBottom: 20,
                    }}
                >
                    {levels[currentLevel].content}
                </motion.div>

                {/* Footer / Nav */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleNext}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px',
                            background: isFullyUnlocked ? T.success : T.accent,
                            border: 'none', borderRadius: 6,
                            color: '#000', fontFamily: T.mono, fontWeight: 700,
                            fontSize: 11, cursor: 'pointer',
                            boxShadow: `0 4px 12px ${isFullyUnlocked ? 'rgba(52,211,153,0.3)' : 'rgba(0,212,255,0.3)'}`,
                        }}
                    >
                        {currentLevel < levels.length - 1 ? 'Next Insight' : 'Unlock Hardware'}
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* Failure Loop Feedback */}
                <AnimatePresence>
                    {showFailureLoop && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                marginTop: 12, padding: '8px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${T.error}`,
                                borderRadius: 4, color: T.error,
                                fontSize: 11, fontFamily: T.mono,
                                display: 'flex', alignItems: 'center', gap: 8
                            }}
                        >
                            <Info size={14} />
                            SYSTEM_NOTICE: Interaction validation required. Please experiment with the lab controls first.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lock Overlay for Content behind gate */}
                {!isFullyUnlocked && (
                    <div style={{
                        position: 'absolute',
                        top: -40, left: 0, right: 0,
                        display: 'flex', justifyContent: 'center', pointerEvents: 'none'
                    }}>
                         <div style={{
                             background: T.card, border: `1px solid ${T.border}`,
                             borderRadius: '20px 20px 0 0', padding: '4px 12px',
                             display: 'flex', alignItems: 'center', gap: 6,
                             fontSize: 9, fontFamily: T.mono, color: T.accent
                         }}>
                             <Lock size={10} /> LOCKING SIMULATION
                         </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
