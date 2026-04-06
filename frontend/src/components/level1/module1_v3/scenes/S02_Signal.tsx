/**
 * S02_Signal — "A signal is a change over time."
 * Line follows cursor with inertia. Faint trail visible.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InsightText } from '../components/InsightText';

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
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'A signal is change over time.', delay: 0.3 },
            { text: 'You create it.', delay: 1.6 },
            { text: 'Signals are not static — they carry history.', delay: 3.0 },
          ]}
          className="text-center"
        />
      </div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-20 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
