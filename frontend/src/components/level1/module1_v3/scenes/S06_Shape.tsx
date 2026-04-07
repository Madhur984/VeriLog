/**
 * S06_Shape — "Shape defines behavior."
 * Floating wave type selector. Inactive options drift down.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { ShapeSelector } from '../components/ShapeSelector';

export const S06_Shape: React.FC = () => {
  const waveType = useSignalStore((s) => s.waveType);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [tried, setTried] = useState<Set<string>>(new Set(['sine']));

  useEffect(() => {
    if (!tried.has(waveType)) {
      setTried((prev) => new Set([...prev, waveType]));
    }
  }, [waveType, tried]);

  const allTried = tried.size >= 3;

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals can have shapes.", 
          l2: "Shape affects behavior.",
          l3: "Geometric: Waveform Morphology"
        }}
        deepMode={{
          explanation: "Rectangular\nTriangular\nSinusoidal",
          mapping: "S09 // GEOMETRY"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-44"
      >
        <ShapeSelector />
      </motion.div>

      <AnimatePresence>
        {allTried && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-24 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

