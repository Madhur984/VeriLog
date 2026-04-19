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
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-5xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">Modules & <span className="text-indigo-500">Ports.</span></h2>
            <div className="h-1 w-24 bg-indigo-500/20 mx-auto rounded-full" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Minimalist Hierarchy Visual */}
            <div className="md:col-span-7 p-10 rounded-[50px] border border-white/5 bg-white/[0.01] flex flex-col gap-8 text-left h-full">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between group hover:bg-indigo-500/20 transition-all shadow-lg"
                >
                    <div className="flex items-center gap-6">
                        <Boxes size={32} className="text-indigo-400" />
                        <span className="text-2xl font-black italic tracking-tighter uppercase">4-Bit Adder</span>
                    </div>
                    <ChevronDown size={24} className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 pl-12 border-l-2 border-indigo-500/20 relative overflow-hidden"
                        >
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 opacity-60">
                                    <Binary size={18} className="text-indigo-500/50" />
                                    <span className="text-lg font-bold italic tracking-tight opacity-80 uppercase">Full Adder UNIT_{i}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Insight Side */}
            <div className="md:col-span-5 flex flex-col gap-8 text-left">
                <div className="p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 text-indigo-400 mb-6 font-black uppercase text-[10px] tracking-widest">
                        <Shield size={16} /> Ports as Pins
                    </div>
                    <p className="text-2xl font-black leading-tight italic opacity-60 tracking-tighter">
                        In Verilog, "ports" define the literal metal pins that connect your design to the outside world.
                    </p>
                </div>
                
                <div className="p-8 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10">
                    <p className="text-lg font-bold italic tracking-tight text-white/40 leading-snug">
                       "Design a 1-bit component once, and instantiate it a million times across your silicon die."
                    </p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
