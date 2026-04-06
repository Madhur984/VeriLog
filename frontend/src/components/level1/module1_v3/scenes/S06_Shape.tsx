/**
 * S06_Shape — "Shape defines behavior."
 * Floating wave type selector. Inactive options drift down.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InsightText } from '../components/InsightText';
import { ShapeSelector } from '../components/ShapeSelector';

export const S06_Shape: React.FC = () => {
  const waveType = useSignalStore((s) => s.waveType);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [tried, setTried] = useState<Set<string>>(new Set(['sine']));

  const currentType = waveType;
  if (!tried.has(currentType)) {
    setTried(new Set([...tried, currentType]));
  }

  const allTried = tried.size >= 3;

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'Shape defines behavior.', delay: 0.3 },
            { text: 'Form becomes function.', delay: 1.6 },
            { text: 'Form is not visual — it determines function.', delay: 3.2 },
          ]}
          className="text-center"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-28"
      >
        <ShapeSelector />
      </motion.div>

      <AnimatePresence>
        {allTried && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-14 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
