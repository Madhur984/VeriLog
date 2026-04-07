import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { useSignalLabStore } from '../store/signalLabStore';

export const SignalHUD: React.FC = () => {
  const { amplitude: gAmp, frequency: gFreq, noise: gNoise, scene } = useSignalStore();
  const lab = useSignalLabStore();

  // Zero UI Rule: Scenes 00-02 (Immersion) and 12 (Conclusion) hide the HUD
  if (scene <= 2 || scene === 12) return null;

  // Use Lab values if in final lab, otherwise global state
  const isLab = scene === 11;
  const amp = isLab ? lab.amplitude : gAmp;
  const freq = isLab ? lab.frequency : gFreq;
  const noise = (isLab ? lab.noise : gNoise) + (isLab ? 0 : 0.05); // slight variant forHUD

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="v3-hud z-50 flex flex-col v3-gap-2 font-mono"
    >
      <div className="v3-micro flex flex-col items-end">
        <div>AMP: {amp.toFixed(2)}</div>
        <div>FREQ: {(freq / 3).toFixed(2)}</div>
        <div>NOISE: {noise.toFixed(2)}</div>
      </div>

      {(isLab || scene >= 9) && (
        <div className="v3-mt-1 v3-micro flex flex-col items-end border-t border-white/10 pt-2">
           <div>STATUS: {isLab ? lab.status : 'MONITORING'}</div>
           <div>STABILITY: {isLab ? lab.stabilityProgress.toFixed(2) : '0.98'}</div>
        </div>
      )}
    </motion.div>
  );
};
