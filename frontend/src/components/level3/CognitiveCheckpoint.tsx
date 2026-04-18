/**
 * CognitiveCheckpoint.tsx — Module 3: Post-Lab Verification
 * 
 * Verifies concept retention and enforces "Correct Understanding" 
 * before advancing to the next engineering phase.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Info } from 'lucide-react';
import { useBinaryStore } from '../../stores/binaryStore';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', sans-serif",
};

export type CheckpointScene = 'numbersystems' | 'switch' | 'counter' | 'register' | 'arithmetic';

interface Question {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    hint: string;
}

const QUESTIONS: Record<CheckpointScene, Question> = {
    numbersystems: {
        text: "Why is Hexadecimal specifically chosen to represent computer memory addresses?",
        options: [
            "Because it has letters which look cooler",
            "Because exactly 4 binary bits (a nibble) fit into one hex digit",
            "To prevent web crawlers from reading it",
            "Because it was invented by biological brains"
        ],
        correctIndex: 1,
        explanation: "Since 2^4 = 16, a single hexadecimal character represents 4 bits. This allows us to compress long binary sequences while maintaining a power-of-2 mapping.",
        hint: "Think about how many binary bits can be compressed into a single character if the base is 16 (2 to the power of what is 16?)."
    },
    switch: {
        text: "In our physical simulation, what happens when voltage is at 1.5V (the 'Uncertainty Zone')?",
        options: [
            "The bit flips instantly to 1",
            "The bit remains in its previous state (Hysteresis)",
            "The circuit short circuits",
            "The bit becomes 0.5"
        ],
        correctIndex: 1,
        explanation: "Hardware uses thresholds. A signal must cross a specific high/low limit to change state, preventing noise from causing random flips.",
        hint: "Think about the gray zone between the thresholds. If you don't cross the upper limit, the bit doesn't wake up."
    },
    counter: {
        text: "Why do bits in a Ripple Counter flip sequentially rather than all at once?",
        options: [
            "To save battery power",
            "Because signals take time to travel through each stage (Propagation Delay)",
            "It's a visual trick",
            "Sequential is cheaper"
        ],
        correctIndex: 1,
        explanation: "Each bit's flip depends on the carry from the previous bit. This travel time is propagation delay.",
        hint: "Imagine a line of dominoes. The first one must fall before the second one starts moving."
    },
    register: {
        text: "What does the 'Stabilization' phase represent in high-speed memory?",
        options: [
            "Cooling time",
            "Disk spin up",
            "Setup and Hold time: ensuring data is stable before capturing",
            "Hex conversion"
        ],
        correctIndex: 2,
        explanation: "Data must be stable for a tiny window before and after a clock edge to be stored reliably.",
        hint: "You can't take a clear photo if the subject is moving while the shutter clicks."
    },
    arithmetic: {
        text: "In our silicon grid, why is a number like '82' considered illegal in the Octal system?",
        options: [
            "Because 82 is too large for the screen",
            "Because an Octal system only recognizes digits from 0 to 7",
            "Because 82 is an odd number",
            "Because it hasn't been converted to binary yet"
        ],
        correctIndex: 1,
        explanation: "Base-8 (Octal) only uses eight symbols: 0, 1, 2, 3, 4, 5, 6, and 7. The digit '8' simply doesn't exist in that system's alphabet.",
        hint: "Look back at the Octal grid. Which digits were missing from the number set?"
    }
};

interface Props {
    scene: CheckpointScene;
    onComplete: (isCorrect: boolean) => void;
}

export const CognitiveCheckpoint: React.FC<Props> = ({ scene, onComplete }) => {
    const q = QUESTIONS[scene];
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { recordAction, metrics, resetWrongAnswerCount } = useBinaryStore();

    const handleSubmit = (index: number) => {
        if (isSubmitted) return;
        setSelectedIndex(index);
        setIsSubmitted(true);
        const isCorrect = index === q.correctIndex;
        
        recordAction('predictionAccuracy', isCorrect ? 1 : 0);
        if (!isCorrect) {
            recordAction('arithmeticMistakes', 1); // Track as mistake
        }
        
        setTimeout(() => {
            if (isCorrect) {
                resetWrongAnswerCount();
                onComplete(true);
            } else {
                // If wrong, reset submission to allow retry
                setIsSubmitted(false);
                setSelectedIndex(null);
            }
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                width: '100%', maxWidth: 500, padding: 32, 
                background: T.card, border: `2px solid ${T.accent}40`,
                borderRadius: 16, boxShadow: `0 20px 50px rgba(0,0,0,0.5)`,
                position: 'relative', zIndex: 100
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 8, background: `${T.accent}15`, borderRadius: 8 }}>
                    <Brain size={20} color={T.accent} />
                </div>
                <div>
                    <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Cognitive Verification
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Engineering Checkpoint</div>
                </div>
            </div>

            <p style={{ fontSize: 16, color: T.text, lineHeight: 1.6, marginBottom: 24 }}>{q.text}</p>

            <AnimatePresence>
                {metrics.wrongAnswerCount >= 2 && !isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            padding: 12, background: `${T.warning}15`, 
                            border: `1px solid ${T.warning}40`, borderRadius: 8, 
                            marginBottom: 24, display: 'flex', gap: 10
                        }}
                    >
                        <Info size={16} color={T.warning} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <div style={{ fontSize: 13, color: T.warning, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Engineering Hint</div>
                            <div style={{ fontSize: 14, color: T.text, opacity: 0.9 }}>{q.hint}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {q.options.map((opt, i) => {
                    let border = T.border;
                    let bg = 'transparent';
                    let color = T.muted;

                    if (isSubmitted) {
                        if (i === q.correctIndex) {
                            border = T.success;
                            bg = `${T.success}10`;
                            color = T.success;
                        } else if (i === selectedIndex) {
                            border = T.error;
                            bg = `${T.error}10`;
                            color = T.error;
                        }
                    } else if (selectedIndex === i) {
                        border = T.accent;
                        bg = `${T.accent}05`;
                        color = T.text;
                    }

                    return (
                        <motion.button
                            key={i}
                            onClick={() => handleSubmit(i)}
                            disabled={isSubmitted}
                            whileHover={!isSubmitted ? { x: 4, background: 'rgba(255,255,255,0.03)' } : {}}
                            style={{
                                padding: '14px 18px', textAlign: 'left', fontFamily: T.sans,
                                fontSize: 15, background: bg, border: `1px solid ${border}`,
                                borderRadius: 8, color: color, cursor: isSubmitted ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                transition: 'all 0.2s', width: '100%'
                            }}
                        >
                            {opt}
                            {isSubmitted && i === q.correctIndex && <CheckCircle size={14} color={T.success} />}
                            {isSubmitted && i === selectedIndex && i !== q.correctIndex && <XCircle size={14} color={T.error} />}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {isSubmitted && (
                    <motion.div
                        key={selectedIndex === q.correctIndex ? 'success' : 'fail'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ 
                            padding: 16, background: 'rgba(255,255,255,0.03)', 
                            borderRadius: 8, borderLeft: `3px solid ${selectedIndex === q.correctIndex ? T.success : T.error}` 
                        }}
                    >
                        <div style={{ fontFamily: T.mono, fontSize: 11, textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
                            {selectedIndex === q.correctIndex ? 'Analysis Confirmed' : 'Concept Drift Detected'}
                        </div>
                        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.5 }}>
                            {selectedIndex === q.correctIndex ? q.explanation : "Incorrect interpretation. Re-evaluating physical constraints..."}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
