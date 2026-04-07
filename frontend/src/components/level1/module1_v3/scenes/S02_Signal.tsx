/**
 * S02_Signal — "A signal is a change over time."
 * Line follows cursor with inertia. Faint trail visible.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';

export const S02_Signal: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const setPhase = useSignalStore((s) => s.setPhase);
  const [showNext, setShowNext] = useState(false);
  const travelRef = useRef(0);

  useEffect(() => {
    canvasState.magneticStrength = 0.09;
    canvasState.showTrail = true;
    useSignalStore.getState().setSignalMode('digital');

    let dist = 0;
    let lastX = -1;

    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      
      if (lastX >= 0) {
        dist += Math.abs(e.clientX - lastX);
        if (dist > window.innerWidth * 1.5 && !showNext) setShowNext(true);
      }
      lastX = e.clientX;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.magneticStrength = 0;
      canvasState.showTrail = false;
    };
  }, [showNext]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Not all signals behave the same.", 
          l2: "Signals can be continuous, discrete, predictable, or random.",
          l3: "Pedagogical: Taxonomy of Information"
        }}
        deepMode={{
          explanation: "Analog → continuous\nDigital → discrete\nDeterministic → predictable\nRandom → uncertain\nPeriodic → repeating\nAperiodic → non-repeating",
          mapping: "S02 // VARIATION"
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

