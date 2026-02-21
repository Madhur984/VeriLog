import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface VoltBotProps {
    state?: 'idle' | 'speaking' | 'happy' | 'sad' | 'thinking';
    message?: string;
    className?: string;
    onClick?: () => void;
}

export const VoltBot: React.FC<VoltBotProps> = ({ state = 'idle', message, className, onClick }) => {

    // Bot Animation Variants
    const botVariants = {
        idle: { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
        speaking: { scale: [1, 1.05, 1], transition: { duration: 0.3, repeat: Infinity } },
        happy: {
            rotate: [0, -10, 10, -10, 10, 0],
            y: [-4, -15, -4],
            transition: { duration: 0.5, y: { duration: 0.3, repeat: Infinity, repeatType: "mirror" } }
        },
        sad: {
            y: 0,
            rotate: [0, -5, 5, 0],
            filter: "grayscale(0.5) contrast(0.8)",
            transition: { duration: 0.5 }
        },
        thinking: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } }
    };

    return (
        <div className={cn("relative flex items-end", className)} onClick={onClick}>
            {/* Dialogue Bubble */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 p-4 bg-white/95 backdrop-blur text-slate-900 rounded-2xl rounded-bl-none shadow-xl border-2 border-primary z-20"
                    >
                        <p className="font-heading font-semibold text-sm leading-relaxed">
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bot Avatar */}
            <motion.div
                variants={botVariants}
                animate={state}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white/20",
                    "bg-gradient-to-br from-indigo-500 to-indigo-600",
                    state === 'happy' && "shadow-[0_0_30px_#FFBE0B]",
                    state === 'sad' && "shadow-[0_0_15px_#ef4444]",
                    state === 'speaking' && "shadow-[0_0_30px_#818CF8]/40"
                )}
            >
                {/* Face Screen */}
                <div className="w-10 h-8 bg-indigo-950 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {/* Expressive Digital Eyes */}
                    <div className="flex space-x-3">
                        <motion.div
                            animate={
                                state === 'happy' ? { scaleY: [1, 0.4, 1], scaleX: [1, 1.2, 1] } :
                                    state === 'sad' ? { scaleY: 0.3, y: 2 } :
                                        state === 'thinking' ? { x: [-1, 1, -1], scaleY: [1, 0.6, 1], opacity: [1, 0.6, 1] } :
                                            state === 'speaking' ? { height: [12, 4, 12] } :
                                                { scaleY: [1, 0.1, 1] }
                            }
                            transition={{
                                duration: state === 'thinking' ? 1.5 : 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={cn(
                                "w-2.5 h-4 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-colors duration-500",
                                state === 'sad' ? "bg-rose-400" :
                                    (state === 'happy' ? "bg-amber-300" : "bg-indigo-300")
                            )}
                        />
                        <motion.div
                            animate={
                                state === 'happy' ? { scaleY: [1, 0.4, 1], scaleX: [1, 1.2, 1] } :
                                    state === 'sad' ? { scaleY: 0.3, y: 2 } :
                                        state === 'thinking' ? { x: [1, -1, 1], scaleY: [1, 0.6, 1], opacity: [1, 0.6, 1] } :
                                            state === 'speaking' ? { height: [12, 4, 12] } :
                                                { scaleY: [1, 0.1, 1] }
                            }
                            transition={{
                                duration: state === 'thinking' ? 1.5 : 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={cn(
                                "w-2.5 h-4 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-colors duration-500",
                                state === 'sad' ? "bg-rose-400" :
                                    (state === 'happy' ? "bg-amber-300" : "bg-indigo-300")
                            )}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
