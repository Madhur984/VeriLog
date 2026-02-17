import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ResistorBotProps {
    state?: 'idle' | 'speaking' | 'happy' | 'sad' | 'thinking';
    message?: string;
    className?: string;
}

export const ResistorBot: React.FC<ResistorBotProps> = ({ state = 'idle', message, className }) => {

    const botVariants = {
        idle: { y: [0, -5, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
        speaking: { scale: [1, 1.02, 1], transition: { duration: 0.2, repeat: Infinity } },
        happy: { y: [0, -15, 0], scale: [1, 1.1, 1], transition: { duration: 0.4, repeat: 2 } },
        sad: { rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } },
        thinking: { rotateY: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } }
    };

    return (
        <div className={cn("fixed bottom-8 right-8 flex flex-col items-end z-50 pointer-events-none", className)}>
            {/* Speech Bubble */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="pointer-events-auto mr-12 mb-6 p-5 bg-white border-4 border-slate-900 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12),8px_8px_0px_rgba(30,41,59,1)] z-20 max-w-[240px]"
                    >
                        <p className="font-heading font-black text-slate-800 text-base leading-tight">
                            {message}
                        </p>
                        {/* Bubble tail */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-4 border-b-4 border-slate-900 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resistor Body */}
            <motion.div
                variants={botVariants}
                animate={state}
                className="pointer-events-auto relative w-20 h-40"
            >
                {/* Leads (Wires) */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-1.5 h-8 bg-slate-400 rounded-full" />
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1.5 h-8 bg-slate-400 rounded-full" />

                {/* Body Canvas (Technical Resistor Look) */}
                <div className="relative w-full h-full bg-[#E5D5C0] rounded-[30px] border-4 border-slate-900 overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-white/10" />

                    {/* Color Bands */}
                    <div className="absolute top-6 w-full h-3 bg-red-600 border-y-[1px] border-slate-900/10" />
                    <div className="absolute top-12 w-full h-3 bg-purple-600 border-y-[1px] border-slate-900/10" />
                    <div className="absolute top-18 w-full h-3 bg-orange-500 border-y-[1px] border-slate-900/10" />
                    <div className="absolute bottom-6 w-full h-3 bg-yellow-500 border-y-[1px] border-slate-900/10" />

                    {/* Face Section */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        {/* Eyes Screen */}
                        <div className="w-12 h-8 bg-slate-950 rounded-lg flex items-center justify-center space-x-1.5 border-2 border-slate-800 shadow-inner">
                            <motion.div
                                className="w-1.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                animate={state === 'happy' ? { scaleY: 0.5 } : { height: [12, 1, 12] }}
                                transition={state === 'happy' ? {} : { repeat: Infinity, duration: 4, times: [0, 0.95, 1] }}
                            />
                            <motion.div
                                className="w-1.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                animate={state === 'happy' ? { scaleY: 0.5 } : { height: [12, 1, 12] }}
                                transition={state === 'happy' ? {} : { repeat: Infinity, duration: 4, times: [0, 0.95, 1] }}
                            />
                        </div>
                        {/* Status LED */}
                        <motion.div
                            className={cn(
                                "w-2 h-2 rounded-full",
                                state === 'sad' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                            )}
                            animate={state === 'speaking' ? { opacity: [0.4, 1, 0.4] } : {}}
                        />
                    </div>
                </div>

                {/* 3D Reflection */}
                <div className="absolute top-4 left-4 w-2 h-20 bg-white/20 blur-[1px] rounded-full" />
            </motion.div>
        </div>
    );
};
