import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, Share2, Binary, ChevronDown, Shield } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S07_ModuleThinking: React.FC<Props> = ({ isActive }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-8 text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <div className="mb-20 px-6">
            <h2 className="hero-text text-5xl md:text-8xl italic uppercase mb-8">Modules & <span className="text-indigo-500">Ports.</span></h2>
            <div className="h-1.5 w-32 bg-indigo-500/20 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-start px-6">
            {/* Minimalist Hierarchy Visual */}
            <div className="md:col-span-12 lg:col-span-7 p-10 rounded-[50px] border border-white/5 bg-white/[0.01] flex flex-col gap-10 text-left h-full backdrop-blur-md">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="p-10 rounded-[40px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between group hover:bg-indigo-500/20 transition-all shadow-xl"
                >
                    <div className="flex items-center gap-8">
                        <Boxes size={40} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="hero-text text-2xl md:text-3xl italic uppercase tracking-tighter">4-Bit Adder CORE</span>
                    </div>
                    <ChevronDown size={32} className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 pl-16 border-l-2 border-indigo-500/20 relative overflow-hidden"
                        >
                            {[0, 1, 2, 3].map(i => (
                                <motion.div 
                                    key={i} 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-8 p-6 rounded-[25px] bg-white/[0.02] border border-white/5 opacity-60 hover:opacity-100 transition-opacity backdrop-blur-sm group"
                                >
                                    <Binary size={24} className="text-indigo-500/50 group-hover:text-indigo-500 transition-colors" />
                                    <span className="body-text text-lg md:text-xl italic opacity-80 uppercase tracking-widest">Full Adder UNIT_{i}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Insight Side */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-10 text-left">
                <div className="p-10 rounded-[50px] border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-inner relative overflow-hidden group">
                    <div className="flex items-center gap-4 text-indigo-400 micro-text uppercase mb-8 relative z-10">
                        <Shield size={20} /> Port Physicality
                    </div>
                    <p className="body-text text-2xl md:text-3xl leading-tight italic opacity-80 relative z-10 px-2">
                        "Ports map directly to the literal metal pins that connect your design to the silicon fabric."
                    </p>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                </div>
                
                <div className="p-10 rounded-[50px] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-md">
                    <p className="body-text text-lg md:text-xl italic opacity-40 leading-snug">
                       "Design a 1-bit component once, and instantiate it a million times across your silicon die."
                    </p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
