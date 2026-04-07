/**
 * S03_Time — "Without time, a signal cannot exist."
 * Drag left/right to rewind/forward.
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';

export const S03_Time: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [isDragging, setIsDragging] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const startX = useRef(0);
  const baseOffset = useRef(0);
  const dragCount = useRef(0);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('periodic');
    canvasState.timeOffset = 0;

    const onDown = (e: MouseEvent) => {
      setIsDragging(true);
      startX.current = e.clientX;
      baseOffset.current = canvasState.timeOffset;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = (e.clientX - startX.current) * 0.015;
      canvasState.timeOffset = baseOffset.current - delta;
      dragCount.current++;
      if (dragCount.current > 40 && !showNext) {
        setShowNext(true);
      }
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvasState.timeOffset = 0;
    };
  }, [isDragging, showNext]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{
          l1: "Time is the carrier.",
          l2: "Without the dimension of time, the signal has no space to evolve. It is frozen in stasis.",
          l3: "SIGNALS EXIST ONLY IN THE UNFOLDING OF NOW."
        }}
        deepMode={{
          formula: "s(t) | t ∈ ℝ",
          explanation: "In DSP, the temporal domain is fundamental. A sample at t=0 has no meaning without the samples that follow it.",
          mapping: "S03 // TEMPORALITY"
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
