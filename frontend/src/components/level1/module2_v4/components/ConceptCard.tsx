import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ConceptCardProps {
  icon: React.ReactNode;
  title: string;
  layman: string;
  technical: string;
  example: string;
  extra?: string;
  color?: string; // Primarily cyan or orange
}

/**
 * ConceptCard
 * Accordion-style card for delivering pedagogical depth without clutter.
 * Refined for scientific minimalism.
 */
export const ConceptCard: React.FC<ConceptCardProps> = ({ 
  icon, 
  title, 
  layman, 
  technical, 
  example, 
  extra,
  color = '#06b6d4' // Default to Signal Cyan
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${expanded ? 'bg-white/[0.03] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-6 p-6">
        <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
            style={{ background: `${color}10`, border: `1px solid ${color}20` }}
        >
            {React.cloneElement(icon as React.ReactElement, { color, size: 24 })}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black italic tracking-tight text-white">{title}</h3>
          <p className="text-xs mt-1 text-white/40 font-medium leading-relaxed line-clamp-1">{layman}</p>
        </div>

        <div className={`p-2 rounded-full transition-transform duration-300 ${expanded ? 'rotate-180 bg-white/5' : 'bg-transparent'}`}>
            <ChevronDown size={18} className={expanded ? 'text-white' : 'text-white/20'} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-6 pb-8 space-y-6 pt-2 border-t border-white/5 mx-6">
              <div className="space-y-2 pt-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-500 font-black">Technical Definition</span>
                <p className="text-sm leading-relaxed text-white/60 font-medium">{technical}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-orange-500/60 font-black italic">Real-World Case</span>
                <p className="text-sm leading-relaxed text-white/80 italic">"{example}"</p>
              </div>

              {extra && (
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                    <p className="text-[10px] font-mono leading-relaxed text-cyan-500/60 font-bold tracking-tight">
                        {extra}
                    </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
