import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TheoryOverlayProps {
  levels: {
    l1: string;
    l2: string;
    l3: string;
  };
  deepMode?: {
    formula?: string;
    explanation?: string;
    mapping?: string;
  };
}

export const TheoryOverlay: React.FC<TheoryOverlayProps> = ({ levels, deepMode }) => {
  const [level, setLevel] = useState(0);
  const [showDeep, setShowDeep] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLevel(1), 1800);
    const t2 = setTimeout(() => setLevel(2), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-24 flex flex-col items-center pointer-events-none z-20 px-8">
      <motion.div 
        key={levels.l1}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="v3-text-anchor flex flex-col v3-gap-1"
      >
        {/* Level 1: Key Identity / Observation */}
        <div className="v3-hero select-none">
          {levels.l1}
        </div>

        {/* Level 2: Body / Explanation */}
        <AnimatePresence mode="wait">
          {level >= 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="v3-body text-center"
            >
              {levels.l2}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level 3: Pedagogical / Micro Detail */}
        <AnimatePresence mode="wait">
          {level >= 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="v3-micro opacity-40 v3-mt-1"
            >
              {levels.l3}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Technical Sidebar Toggle (Only for Hybrid scenes 09-11) */}
      {deepMode && (
        <div className="absolute top-2 right-8 pointer-events-auto flex flex-col items-end">
          <button 
            onClick={() => setShowDeep(!showDeep)}
            className="v3-micro v3-interactive py-2"
          >
            {showDeep ? '[-] Close' : '[+] Analyze'}
          </button>
          
          <AnimatePresence>
            {showDeep && (
              <motion.div 
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="v3-mt-2 p-4 bg-black/90 backdrop-blur-md border border-white/5 rounded-sm w-72 space-y-4 shadow-2xl"
              >
                {deepMode.formula && (
                  <div className="v3-gap-1 flex flex-col">
                    <div className="v3-micro opacity-30">Formal Equation</div>
                    <div className="v3-micro tabular-nums text-white/80">{deepMode.formula}</div>
                  </div>
                )}
                {deepMode.explanation && (
                  <div className="v3-gap-1 flex flex-col">
                    <div className="v3-micro opacity-30">Physics</div>
                    <div className="v3-body text-xs text-white/50 leading-relaxed font-light">{deepMode.explanation}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

