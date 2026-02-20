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
                    "bg-gradient-to-br from-slate-700 to-slate-900",
                    state === 'happy' && "shadow-[0_0_30px_#FFBE0B] border-signal-gold",
                    state === 'sad' && "shadow-[0_0_15px_#ef4444] border-rose-500",
                    state === 'speaking' && "shadow-[0_0_30px_#3A86FF]"
                )}
            >
                {/* Face Screen */}
                <div className="w-10 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden relative">
                    {/* Eyes */}
                    <div className="flex space-x-2">
                        <motion.div
                            className={cn(
                                "w-2 h-3 rounded-full",
                                (state === 'happy' || state === 'celebrating' as any) ? "bg-signal-gold" :
                                    state === 'sad' ? "bg-rose-500" : "bg-signal-digital"
                            )}
                            animate={state === 'speaking' ? { height: [12, 4, 12] } : {}}
                        />
                        <motion.div
                            className={cn(
                                "w-2 h-3 rounded-full",
                                (state === 'happy' || state === 'celebrating' as any) ? "bg-signal-gold" :
                                    state === 'sad' ? "bg-rose-500" : "bg-signal-digital"
                            )}
                            animate={state === 'speaking' ? { height: [12, 4, 12] } : {}}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
