/**
 * S10_RealWorld — "The signal returns to the world."
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';

export const S10_RealWorld: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('aperiodic');
    canvasState.magneticStrength = 0.2;
    
    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      if (!showNext && e.clientX > window.innerWidth * 0.8) {
        setShowNext(true);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.magneticStrength = 0;
    };
  }, [showNext]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals are everywhere.", 
          l2: "From the beating of a heart to the orbits of planets, everything is information.",
          l3: "Conceptual: Universal Connectivity"
        }}
        deepMode={{
          explanation: "In our final synthesis, we recognize that the 'Signal' is not just voltage—it is the language of existence.",
          mapping: "S10 // REAL WORLD"
        }}
      />

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={nextScene}
            className="continue-btn active pointer-events-auto"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
