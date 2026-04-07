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
    canvasState.frozen = false;

    let lastX = -1;
    let dist = 0;

    const onMove = (e: MouseEvent) => {
      const normX = e.clientX / window.innerWidth;
      canvasState.cursorNormX = normX;
      // Phase shifts gently with Y movement for inertia feel
      const normY = e.clientY / window.innerHeight;
      setPhase(normY * Math.PI * 0.4);

        if (lastX >= 0) {
        dist += Math.abs(e.clientX - lastX);
        travelRef.current = dist;
        if (dist > window.innerWidth * 1.5 && !showNext) setShowNext(true);
      }
      lastX = e.clientX;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.magneticStrength = 0;
      canvasState.showTrail = false;
      canvasState.cursorNormX = -1;
    };
  }, [setPhase, showNext]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{
          l1: "Variance is information.",
          l2: "A signal is change over time. Without change, there is zero information.",
          l3: "STILLNESS IS THE ABSENCE OF TRUTH."
        }}
        deepMode={{
          formula: "δs/δt ≠ 0",
          explanation: "In information theory, a constant value carries zero information (H=0). Variance is the prerequisite for data.",
        }}
      />

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="v3-micro v3-interactive pointer-events-auto opacity-40 hover:opacity-100 transition-opacity"
          >
            [ PROCEED ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

