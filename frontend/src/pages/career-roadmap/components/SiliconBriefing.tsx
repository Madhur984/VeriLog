import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';

const HEADLINES = [
  { id: 1, tag: 'FOUNDRY', title: 'TSMC 2nm mass production schedule confirmed for late 2026.', impact: 'High' },
  { id: 2, tag: 'GEOPOLITICS', title: 'CHIPS Act 2.0 allocates additional $20B for domestic R&D clusters.', impact: 'Critical' },
  { id: 3, tag: 'DESIGN', title: 'RISC-V adoption grows 40% in automotive controller segments.', impact: 'Medium' },
  { id: 4, tag: 'RECRUITMENT', title: 'NVIDIA expands Design Center in Hyderabad, targeting 500+ freshers.', impact: 'High' },
];

export const SiliconBriefing: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const headline = HEADLINES[index];

  return (
    <div className={`fixed bottom-0 left-0 w-full z-[100] backdrop-blur-xl border-t h-16 flex items-center px-6 overflow-hidden ${
      isLight 
        ? 'bg-bg-elev/90 border-border-soft' 
        : 'bg-black/90 border-cyan-400/30'
    }`}>
      <div className={`flex items-center gap-4 border-r pr-6 shrink-0 h-full ${isLight ? 'border-border-soft' : 'border-white/10'}`}>
        <Radio size={16} className={`animate-pulse ${isLight ? 'text-signal-core' : 'text-cyan-400'}`} />
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.3em] ${isLight ? 'text-text-main' : 'text-white'}`}>Live Briefing</span>
      </div>

      <div className="flex-1 px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={headline.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-4"
          >
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
              headline.impact === 'Critical' ? 'bg-red-500 text-white' : 
              headline.impact === 'High' ? (isLight ? 'bg-signal-core text-white' : 'bg-cyan-400 text-black') : 
              (isLight ? 'bg-ghost-trace text-text-sub' : 'bg-slate-700 text-slate-300')
            }`}>
              {headline.tag}
            </span>
            <span className={`font-mono text-xs truncate tracking-wide ${isLight ? 'text-text-sub' : 'text-slate-300'}`}>
              {headline.title}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`flex items-center gap-6 border-l pl-6 shrink-0 h-full ${isLight ? 'border-border-soft' : 'border-white/10'}`}>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
           <span className="font-mono text-[9px] text-text-dim uppercase">System Ready</span>
        </div>
        <div className="font-mono text-[9px] text-text-dim uppercase">
          {new Date().toLocaleTimeString([], { hour12: false })} UTC
        </div>
      </div>
    </div>
  );
};
