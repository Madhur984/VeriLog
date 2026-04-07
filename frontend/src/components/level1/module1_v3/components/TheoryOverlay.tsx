import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

interface TheoryOverlayProps {
  levels: {
    l1: string; // Immediate (Level 1)
    l2: string; // Concept (Level 2)
    l3: string; // Engineering / Pedagogical (Bottom Detail)
  };
  deepMode?: {
    formula?: string;
    explanation?: string; // Lines for Level 3
    mapping?: string;
  };
}

/**
 * TheoryOverlay — Implements the "Invisible Theory Layer".
 * Level 1/2 are revealed by time.
 * Level 3 is revealed ONLY when theoryMode is ON.
 */
export const TheoryOverlay: React.FC<TheoryOverlayProps> = ({ levels, deepMode }) => {
  const [level, setLevel] = useState(0);
  const theoryMode = useSignalStore((s) => s.theoryMode);

  useEffect(() => {
    // Level 1: Immediate
    // Level 2: after 1.8s
    const t1 = setTimeout(() => setLevel(1), 1800);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-24 flex flex-col items-center pointer-events-none z-20 px-8">
      <motion.div 
        key={levels.l1}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="v3-text-anchor flex flex-col v3-gap-1 items-center"
      >
        {/* Level 1: Immediate Identity */}
        <div className="v3-hero select-none text-center">
          {levels.l1}
        </div>

        {/* Level 2: Progressive Concept */}
        <AnimatePresence>
          {level >= 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="v3-body text-center max-w-lg opacity-80"
            >
              {levels.l2}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Level 3 Indicator (Engineering) */}
        <AnimatePresence>
          {level >= 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="v3-micro v3-mt-1 tracking-widest uppercase"
            >
              {levels.l3}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Level 3: Deep Theory Layer (Activated by Global Theory Mode) */}
      <AnimatePresence>
        {theoryMode && deepMode && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="v3-mt-8 p-6 bg-black/60 backdrop-blur-xl border border-white/5 rounded-sm w-full max-w-xl flex flex-col v3-gap-4 pointer-events-auto shadow-2xl"
          >
            {deepMode.formula && (
              <div className="flex flex-col v3-gap-1">
                <div className="v3-micro opacity-30 uppercase tracking-tighter">Mathematical Model</div>
                <div className="v3-micro tabular-nums text-v3-cyan font-medium text-base">{deepMode.formula}</div>
              </div>
            )}
            
            {deepMode.explanation && (
              <div className="flex flex-col v3-gap-1">
                <div className="v3-micro opacity-30 uppercase tracking-tighter">Engineering Insight</div>
                <div className="v3-body text-xs text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                  {deepMode.explanation}
                </div>
              </div>
            )}

            {deepMode.mapping && (
              <div className="v3-micro opacity-20 uppercase mt-2 italic">
                {deepMode.mapping}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
