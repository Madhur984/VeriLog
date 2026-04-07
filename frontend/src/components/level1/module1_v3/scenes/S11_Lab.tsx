import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S11_Lab: React.FC = () => {
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const setFrequency = useSignalStore((s) => s.setFrequency);
  const setNoise = useSignalStore((s) => s.setNoise);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const stability = useSignalStore((s) => s.stability);
  const checkProceed = useSignalStore((s) => s.checkProceed);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.magneticStrength = 0.05;
    
    const handleMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      setAmplitude(1 - (e.clientY / window.innerHeight));
      setFrequency((e.clientX / window.innerWidth) * 3);
      checkProceed();
    };
    
    const handleWheel = (e: WheelEvent) => {
      const currentNoise = useSignalStore.getState().noise;
      setNoise(Math.max(0, Math.min(1, currentNoise + e.deltaY * 0.001)));
      checkProceed();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('wheel', handleWheel);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, [setAmplitude, setFrequency, setNoise, setSignalMode, checkProceed]);

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
