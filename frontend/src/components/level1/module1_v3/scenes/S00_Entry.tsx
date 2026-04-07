/**
 * S00_Entry — Black void.
 * Faint line visible at rest.
 * "move" fades in after 2s.
 * First significant mouse movement → begins experience (S01).
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';

export const S00_Entry: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showHint, setShowHint] = useState(false);
  const started = useRef(false);
  const lastPos = useRef({ x: -1, y: -1 });

  // Set entry canvas state
  useEffect(() => {
    canvasState.magneticStrength = 0;
    canvasState.showTrail = false;
    canvasState.frozen = false;
    canvasState.secondaryEnabled = false;
    // Hint after 2s
    const t = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (started.current) return;
      if (lastPos.current.x < 0) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        return;
      }
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 30) {
        started.current = true;
        nextScene();
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [nextScene]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showHint ? [0, 0.4, 0.1, 0.4, 0.2, 0.5] : 0,
        }}
        transition={{ 
          opacity: {
            duration: 0.8,
            times: [0, 0.1, 0.2, 0.3, 0.4, 1],
            repeat: Infinity,
            repeatDelay: 4,
            ease: "linear"
          }
        }}
        className="v3-small tracking-[1.2em] font-medium text-white"
      >
        Move.
      </motion.p>
    </div>
  );
};
