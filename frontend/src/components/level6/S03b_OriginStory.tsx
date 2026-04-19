import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Award, Globe } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S03b_OriginStory: React.FC<Props> = ({ isActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeline = [
    { year: '1983', event: 'Phil Moorby designs Verilog for Gateway Design Automation.' },
    { year: '1990', event: 'Cadence opens the language to the public to drive adoption.' },
    { year: '1995', event: 'IEEE 1364-1995 standard is released (The turning point).' },
    { year: '2005', event: 'SystemVerilog introduced, merging HDL with Verification.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-white/40 mb-4">
             <History size={16} />
             <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Historical Legitimacy</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-4">The Verilog <span className="text-amber-500">Genesis.</span></h2>
          <p className="text-sm opacity-40 font-bold max-w-lg mx-auto italic">
            "Proven in the trenches." Verilog wasn't born in a lab, but in the heat of the 1980s EDA wars.
          </p>
        </div>

        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-8 rounded-[40px] bg-white/[0.03] border border-white/10 flex items-center justify-between hover:bg-white/5 transition-all group"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                        <Award size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-lg font-black italic">Legacy Timeline</div>
                        <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">1983 — PRESENT</div>
                    </div>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-amber-500' : 'text-white/20'}`}>
                    <ChevronDown size={24} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-8 space-y-4">
                            {timeline.map((item, i) => (
                                <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.01] border border-white/5">
                                    <div className="text-xl font-black text-amber-500 w-20 flex-shrink-0 italic">{item.year}</div>
                                    <div className="h-px flex-1 bg-white/5" />
                                    <div className="text-sm font-medium opacity-60 text-right max-w-xs italic">{item.event}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700">
            <div className="text-[10px] font-black tracking-widest uppercase">Used By:</div>
            <div className="font-black italic text-sm tracking-tighter">INTEL</div>
            <div className="font-black italic text-sm tracking-tighter">AMD</div>
            <div className="font-black italic text-sm tracking-tighter">NVIDIA</div>
            <div className="font-black italic text-sm tracking-tighter">APPLE</div>
        </div>
      </motion.div>
    </div>
  );
};
