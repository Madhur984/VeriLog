/**
 * S00_Entry — Cinematic Sequence.
 * 0-2s: Flicker
 * 2-6s: Tunnel
 * 6-10s: Flow
 * 10-12s: Stabilize
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';

export const S00_Entry: React.FC = () => {
  const nextScene = useSignalStore((s) => s.nextScene);
  const [stage, setStage] = useState(0); // 0: flicker, 1: tunnel, 2: flow, 3: stable
  const [showMove, setShowMove] = useState(false);
  const startTime = useRef(performance.now());

  useEffect(() => {
    canvasState.magneticStrength = 0;
    canvasState.showTrail = false;
    canvasState.frozen = false;
    canvasState.secondaryEnabled = false;
    canvasState.opacity = 0.1;
    canvasState.tunnelOpacity = 0;
    canvasState.cameraZ = 5;

    let raf: number;
    const update = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      canvasState.introProgress = elapsed;

      if (elapsed < 2) {
        // Stage 0: Flicker
        canvasState.opacity = 0.1 + Math.sin(elapsed * 20) * 0.05;
        if (stage !== 0) setStage(0);
      } else if (elapsed < 6) {
        // Stage 1: Tunnel Forms
        const t = (elapsed - 2) / 4;
        canvasState.tunnelOpacity = t;
        canvasState.opacity = 0.1 + t * 0.5;
        if (stage !== 1) setStage(1);
      } else if (elapsed < 10) {
        // Stage 2: Forward Motion
        const t = (elapsed - 6) / 4;
        canvasState.cameraZ = 5 - t * 2.5;
        canvasState.tunnelOpacity = 1 - t; // Fade out tunnel as we exit
        if (stage !== 2) setStage(2);
      } else if (elapsed < 12) {
        // Stage 3: Stabilize
        canvasState.cameraZ = 2.5;
        canvasState.opacity = 0.6;
        if (stage !== 3) setStage(3);
        if (elapsed > 11 && !showMove) setShowMove(true);
      } else {
        // Sequence Complete
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [stage, showMove]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <AnimatePresence>
        {showMove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <p className="v3-hero tracking-[0.8em] font-light">ARRIVAL</p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              whileHover={{ opacity: 1, y: -2 }}
              onClick={nextScene}
              className="continue-btn active v3-mt-4"
            >
              [ ENTER LAB ]
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Overlays */}
      {stage < 2 && (
        <motion.div 
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 1 ? 0.3 : 0.8 }}
          transition={{ duration: 2 }}
        />
      )}
    </div>
  );
};
