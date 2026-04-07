/**
 * S01_Identity — "You are not watching a signal."
 * The line bends magnetically toward the cursor.
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';

export const S01_Identity: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);
  const interactedRef = useRef(false);
  const interactTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    canvasState.magneticStrength = 0.18;
    useSignalStore.getState().setSignalMode('analog');
    
    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      if (!interactedRef.current) {
        interactedRef.current = true;
        timerRef.current = setInterval(() => {
          interactTime.current += 1;
          if (interactTime.current >= 3) {
            setShowNext(true);
            clearInterval(timerRef.current!);
          }
        }, 1000);
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
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "A signal is a change.", 
          l2: "A signal is a function of variables representing a phenomenon.",
          l3: "Engineering: Fundamental Data Carrier"
        }}
        deepMode={{
          formula: "s(t) = f(x, y, z, ...)",
          explanation: "A signal is a function of one or more variables that indicates a physical phenomenon.\n\nExamples:\n• sound waves\n• voltage\n• temperature\n• motion",
          mapping: "S01 // DEFINITION"
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

