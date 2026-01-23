import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MascotState = 'IDLE' | 'HAPPY' | 'THINKING' | 'HINT';

interface BotMascotProps {
    state: MascotState;
    message?: string;
}

export const BotMascot: React.FC<BotMascotProps> = ({ state, message }) => {
    // Animation variants
    const variants = {
        IDLE: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
        HAPPY: { y: [0, -20, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } },
        THINKING: { rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 1 } },
        HINT: { x: [0, 10, 0], transition: { repeat: Infinity, duration: 1 } }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
            {/* Speech Bubble */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="bg-slate-800 border-2 border-cyan-400 text-white p-4 rounded-xl rounded-br-none mb-4 shadow-lg max-w-xs font-heading"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mascot SVG */}
            <motion.div
                className="w-24 h-24 relative"
                variants={variants}
                animate={state}
            >
                {/* Simple CSS/SVG Bot */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                    {/* Antenna */}
                    <line x1="50" y1="10" x2="50" y2="30" stroke="#94a3b8" strokeWidth="4" />
                    <circle cx="50" cy="10" r="5" fill={state === 'HAPPY' ? '#4ade80' : '#f472b6'} className="animate-pulse" />

                    {/* Head Body */}
                    <rect x="20" y="30" width="60" height="50" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />

                    {/* Eyes */}
                    <motion.g animate={state === 'THINKING' ? { scaleY: [1, 0.1, 1], transition: { repeat: Infinity, duration: 2 } } : {}}>
                        <circle cx="35" cy="50" r="6" fill="#00d9ff" />
                        <circle cx="65" cy="50" r="6" fill="#00d9ff" />
                    </motion.g>

                    {/* Mouth */}
                    {state === 'HAPPY' ? (
                        <path d="M 35 70 Q 50 80 65 70" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    ) : (
                        <line x1="35" y1="70" x2="65" y2="70" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    )}
                </svg>
            </motion.div>
        </div>
    );
};
