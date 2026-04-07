/**
 * S12_Conclusion — Signal collapses → "You are the signal."
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S12_Conclusion: React.FC = () => {
  const signal = useSignalStore();
  const [phase, setPhase] = useState<'collapse' | 'reveal'>('collapse');

  useEffect(() => {
    canvasState.magneticStrength = 0;
    canvasState.showTrail = false;

    // Start collapse
    const t = setTimeout(() => {
      setPhase('reveal');
      audio.collapse();
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="flex flex-col items-center"
          >
            <p className="v3-hero tracking-[1.2em] font-extralight text-white/90">TRANSMISSION END.</p>
            <p className="v3-body mt-4 opacity-40">You are the signal.</p>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => window.location.href = '/module/2'}
              className="continue-btn active v3-mt-8 pointer-events-auto"
            >
              [ INITIATE MODULE 02 ]
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
