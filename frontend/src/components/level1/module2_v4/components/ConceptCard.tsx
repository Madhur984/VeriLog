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
  isDarkMode: boolean;
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
  color = '#06b6d4',
  isDarkMode
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${expanded 
        ? (isDarkMode ? 'bg-white/[0.03] border-white/20 shadow-2xl' : 'bg-gray-100 border-gray-300 shadow-xl') 
        : (isDarkMode ? 'bg-black/40 border-white/5 hover:border-white/10 hover:translate-y-[-2px]' : 'bg-white border-gray-200 hover:border-gray-300 hover:translate-y-[-2px]')}`}
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
          <h3 className={`text-xl font-black italic tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-[11px] mt-2 font-bold uppercase tracking-widest leading-relaxed line-clamp-1 ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>{layman}</p>
        </div>

        <div className={`p-3 rounded-full transition-all duration-300 ${expanded 
          ? (isDarkMode ? 'rotate-180 bg-white/10' : 'rotate-180 bg-gray-200') 
          : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-400')}`}>
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
            <div className={`px-8 pb-10 space-y-8 pt-4 border-t mx-8 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="space-y-3 pt-6">
                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>Technical Logic</span>
                <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{technical}</p>
              </div>

              <div className={`p-6 rounded-[1.5rem] space-y-3 shadow-inner ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black italic ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600/60'}`}>In the Field</span>
                <p className={`text-sm leading-relaxed italic font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-800'}`}>"{example}"</p>
              </div>

              {extra && (
                <div className={`p-6 rounded-[1.5rem] transition-colors ${isDarkMode 
                  ? 'bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10' 
                  : 'bg-orange-50 border border-orange-200 hover:bg-orange-100'}`}>
                    <p className={`text-[11px] font-mono leading-relaxed font-bold tracking-tight ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600'}`}>
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
