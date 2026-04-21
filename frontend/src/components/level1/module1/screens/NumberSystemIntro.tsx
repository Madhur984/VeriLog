import React from 'react';
import { ScreenProps } from '../types';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { Cpu, Hash, Binary, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const NumberSystemIntro: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete 
}) => {
  return (
    <div className="section-content flex flex-col items-center justify-center space-y-12 relative">
      <div className="text-center space-y-4">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Fundamentals</h2>
        <h1 className="title-xl italic text-slate-900">THE MACHINE'S ALPHABET</h1>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Historical Insight Card */}
        <div className="glass-card p-10 space-y-6 border-slate-200 bg-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <History size={120} />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-500">
               <Cpu size={24} />
            </div>
            <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-slate-800">Historical Evolution</h3>
          </div>
          
          <p className="body text-slate-600 leading-relaxed">
            In 1837, Charles Babbage's <span className="text-sky-600 font-bold">Analytical Engine</span> used 25 rows of decimal gears (Base 10). It was a mechanical marvel, but modern electronics chose a different path.
          </p>
          
          <div className="pt-4 border-t border-slate-100 italic text-xs text-slate-400">
            "It is vastly more reliable to distinguish between two distinct voltages (ON/OFF) than to cleanly separate ten different levels on a single wire."
          </div>
        </div>

        {/* The Odometer Analogy */}
        <div className="space-y-6">
           <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="glass-card p-8 bg-slate-900 text-white border-slate-800"
           >
              <div className="flex items-center gap-3 mb-4">
                <Hash className="text-sky-400" size={20} />
                <h3 className="text-[10px] font-mono uppercase tracking-widest">The Odometer Rule</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Imagine counting on a car's odometer. In decimal, a digit rolls over at 9. In **Binary (Base 2)**, the digit rolls over at **1**.
              </p>
              <div className="flex gap-2 font-mono text-xl">
                 <span className="opacity-20">00</span>
                 <span className="text-sky-400 animate-pulse">1</span>
                 <span className="opacity-20">→</span>
                 <span className="text-sky-400">10</span>
                 <span className="text-[10px] text-slate-500 self-end mb-1">(Decimal 2)</span>
              </div>
           </motion.div>

           <div className="grid grid-cols-2 gap-4">
              <KnowledgeCard 
                title="Shorthand Logic"
                description="Why Hexadecimal?"
                details="Writing long binary strings is prone to error. Hexadecimal groups 4 bits into 1 character, making it the perfect bridge between machine and human."
                icon={Binary}
              />
              <button 
                onClick={() => {
                  triggerHaptic?.('success');
                  onInteractionComplete?.();
                }}
                className="glass-card p-6 flex flex-col items-center justify-center gap-2 hover:bg-sky-500 hover:text-white transition-all text-sky-600 border-sky-100"
              >
                 <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Initialize Logic</span>
                 <span className="text-xs font-bold italic">Proceed to Binary Counting</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSystemIntro;
