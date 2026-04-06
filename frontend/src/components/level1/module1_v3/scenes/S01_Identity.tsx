/**
 * S01_Identity — "You are not watching a signal."
 * The line bends magnetically toward the cursor.
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InsightText } from '../components/InsightText';
import { useIdleSystem } from '../hooks/useIdleSystem';

export const S01_Identity: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);
  const { level } = useIdleSystem();
  const interactedRef = useRef(false);
  const interactTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    canvasState.magneticStrength = 0.18;
    canvasState.showTrail = false;
    canvasState.frozen = false;

    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      if (!interactedRef.current) {
        interactedRef.current = true;
        timerRef.current = setInterval(() => {
          interactTime.current += 0.5;
          if (interactTime.current >= 4) {
            setShowNext(true);
            clearInterval(timerRef.current!);
          }
        }, 500);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(timerRef.current!);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <InsightText
        lines={[
          { text: 'You are not observing a signal.', delay: 0.4 },
          { text: 'You are the signal.', delay: 2.0 },
        ]}
        className="text-center"
      />

      {/* Idle hint */}
      <AnimatePresence>
        {level >= 2 && !showNext && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="v3-small absolute bottom-32 tracking-[0.6em]"
          >
            Observe proximity.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
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
