import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
 * ConceptCard (Optimized)
 * Accordion-style card for delivering pedagogical depth without clutter.
 * Memoized to prevent parent scroll re-renders.
 */
export const ConceptCard: React.FC<ConceptCardProps> = memo(({ 
  icon, 
  title, 
  layman, 
  technical, 
  example, 
  extra,
  color = '#06b6d4' 
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${expanded ? 'bg-white/[0.03] border-white/20 shadow-2xl' : 'bg-black/40 border-white/5 hover:border-white/10 hover:translate-y-[-2px]'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-6 p-8">
        <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg"
            style={{ background: `${color}10`, border: `1px solid ${color}20` }}
        >
            {React.cloneElement(icon as React.ReactElement, { color, size: 28 })}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black italic tracking-tight text-white">{title}</h3>
          <p className="text-[11px] mt-2 text-white/30 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{layman}</p>
        </div>

        <div className={`p-3 rounded-full transition-all duration-300 ${expanded ? 'rotate-180 bg-white/10' : 'bg-white/5 text-white/20'}`}>
            <ChevronDown size={20} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="px-8 pb-10 space-y-8 pt-4 border-t border-white/5 mx-8">
              <div className="space-y-3 pt-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500 font-black">Technical Logic</span>
                <p className="text-sm leading-relaxed text-white/60 font-medium">{technical}</p>
              </div>

              <div className="p-6 rounded-[1.5rem] bg-black/40 border border-white/5 space-y-3 shadow-inner">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-orange-500/60 font-black italic">In the Field</span>
                <p className="text-sm leading-relaxed text-white/80 italic font-medium">"{example}"</p>
              </div>

              {extra && (
                <div className="p-6 rounded-[1.5rem] bg-cyan-500/5 border border-cyan-500/10 transition-colors hover:bg-cyan-500/10">
                    <p className="text-[11px] font-mono leading-relaxed text-cyan-500/60 font-bold tracking-tight">
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
});

ConceptCard.displayName = 'ConceptCard';
