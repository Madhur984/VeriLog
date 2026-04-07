import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const SignalHUD: React.FC = () => {
  const { amplitude, frequency, noise, scene, stability } = useSignalStore();

  const isLab = scene === 11;
  const isS09 = scene === 9;

  // Global Visibility Rule
  if (scene === 0 || scene === 12) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="v3-hud z-50 fixed top-8 right-8 flex flex-col gap-1 items-end pointer-events-none"
    >
      <div className="micro-text flex gap-4">
        <span>A: {amplitude.toFixed(2)}</span>
        <span>f: {frequency.toFixed(2)}</span>
        <span>η: {noise.toFixed(2)}</span>
      </div>

      {(isLab || isS09) && (
        <div className="flex flex-col items-end mt-2 pt-2 border-t border-white/10 w-full">
          <div className="micro-text opacity-40">COHERENCE</div>
          <div className="hero-text text-base tabular-nums">
            {Math.round(stability * 100)}%
          </div>
        </div>
      )}
    </motion.div>
  );
};

