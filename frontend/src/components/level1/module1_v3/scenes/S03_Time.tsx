/**
 * S03_Time — "Without time, a signal cannot exist."
 * Drag left/right to rewind/forward. Spring resistance.
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';

export const S03_Time: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const startX = useRef(0);
  const baseOffset = useRef(0);
  const dragCount = useRef(0);

  useEffect(() => {
    canvasState.magneticStrength = 0;
    canvasState.showTrail = false;
    canvasState.frozen = false;
    canvasState.timeOffset = 0;

    const onDown = (e: MouseEvent) => {
      setIsDragging(true);
      startX.current = e.clientX;
      baseOffset.current = canvasState.timeOffset;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = (e.clientX - startX.current) * 0.015;
      canvasState.timeOffset = baseOffset.current - delta; // left = rewind
      dragCount.current++;
      if (dragCount.current > 40 && !dragged) {
        setDragged(true);
        setTimeout(() => setShowNext(true), 500);
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
  }, [isDragging, dragged]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "All signals are built from simple forms.", 
          l2: "Complex signals are combinations of basic signals.",
          l3: "Foundational: Unit Step & Impulse"
        }}
        deepMode={{
          explanation: "Include:\n• Unit Step\n• Impulse\n• Ramp\n• Parabolic",
          mapping: "S06 // ELEMENTARY"
        }}
      />

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={nextScene}
            className="v3-micro v3-interactive pointer-events-auto opacity-40 hover:opacity-100 transition-opacity"
          >
            [ PROCEED ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
