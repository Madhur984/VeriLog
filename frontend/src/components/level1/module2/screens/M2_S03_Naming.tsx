import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { dailyExamples } from '../shared/UltimateComponents';

export const M2_S03_Naming: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-10 px-6">
      
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
          Where do they hide?
        </h2>
        <p className="font-mono text-xs text-[#8A8A99] tracking-widest">
          Explore how these signals show up in your everyday existence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {dailyExamples.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => { setActiveId(activeId === item.id ? null : item.id); triggerHaptic('light'); }}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
              activeId === item.id 
                ? 'bg-[#121215] border-[#00D4FF] shadow-[0_0_30px_rgba(0,212,255,0.1)]' 
                : 'bg-black/40 border-[#2A2A35] hover:border-[#00D4FF]/40'
            }`}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${activeId === item.id ? 'bg-[#00D4FF] text-black' : 'bg-[#2A2A35] text-[#00D4FF]'}`}>
                  {item.icon}
                </div>
                <h3 className="font-bold uppercase text-sm tracking-wide">{item.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-[#8A8A99] font-mono">Analog</div>
                  <div className="text-[11px] leading-tight text-white/90">{item.analogExample.split(' - ')[0]}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-[#FF5F1F] font-mono">Digital</div>
                  <div className="text-[11px] leading-tight text-white/90">{item.digitalExample.split(' - ')[0]}</div>
                </div>
              </div>

              <AnimatePresence>
                {activeId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pt-4 border-t border-[#2A2A35] text-[11px] leading-relaxed text-[#8A8A99] font-mono"
                  >
                    {item.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
