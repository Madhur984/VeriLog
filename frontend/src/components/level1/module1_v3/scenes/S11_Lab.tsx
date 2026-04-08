import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S11_Lab: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const stability = useSignalStore((s) => s.stability);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.magneticStrength = 0.05;
    
    return () => {
      canvasState.magneticStrength = 0;
    };
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Stabilization Lab." 
        secondary="Optimal: A=0.6, f=1.5, η=0.0." 
      />

      {stability > 0.9 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hero-text text-[#00E5FF] tracking-widest text-lg mb-20"
        >
          COHERENCE ACHIEVED
        </motion.div>
      )}
    </div>
  );
};
