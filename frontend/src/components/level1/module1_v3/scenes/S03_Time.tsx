/**
 * S03_Time — "Without time, a signal cannot exist."
 * Drag left/right to rewind/forward. Spring resistance.
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InsightText } from '../components/InsightText';

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
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'Without time,', delay: 0.3 },
            { text: 'there is no signal.', delay: 1.6 },
            { text: 'A signal is a recorded transformation.', delay: 3.2 },
          ]}
          className="text-center"
        />
      </div>

      {/* Drag indicator */}
      <AnimatePresence>
        {!dragged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.0 }}
            className="v3-small absolute bottom-36 tracking-[0.4em]"
          >
            Explore timeline.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
