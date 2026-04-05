import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

export const ModuleOneHub: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans selection:bg-sky-100 text-slate-900 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/50 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center"
            >
                {/* Icon Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12 w-16 h-16 border border-slate-200 bg-white rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-sm"
                >
                    <LinkIcon className="w-8 h-8 text-sky-600" />
                </motion.div>

                {/* Main Text Content */}
                <div className="space-y-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                    >
                        <p className="text-slate-500 text-sm tracking-widest font-mono uppercase">
                            Before logic. Before processors.
                        </p>
                        <p className="text-slate-500 text-sm tracking-widest font-mono uppercase">
                            There is one rule.
                        </p>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-3xl md:text-5xl font-bold text-sky-600 tracking-tight leading-tight"
                    >
                        "Energy must return to its source."
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-slate-400 text-sm tracking-widest font-mono pt-4"
                    >
                        Verify your understanding.
                    </motion.p>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <button
                        onClick={() => navigate('/module/1/1')}
                        className="group flex items-center justify-center gap-4 px-12 py-4 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm tracking-[0.2em] transition-all w-full sm:w-auto shadow-lg hover:shadow-sky-200/50 uppercase"
                    >
                        Begin Experience
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] opacity-60">
                        Unified Module // Seamless Flow
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};
