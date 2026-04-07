import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { FloatingSlider } from '../components/FloatingSlider';
import { canvasState } from '../engine/canvasState';

export const S07_Noise: React.FC = () => {
  const noise = useSignalStore((s) => s.noise);
  const setNoise = useSignalStore((s) => s.setNoise);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.secondaryEnabled = true;
    canvasState.secondaryOpacity = 0.2;
    canvasState.secondaryFrequencyMult = 4.0;
    
    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
    };
    
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.secondaryEnabled = false;
      canvasState.cursorNormX = -1;
    };
  }, [setSignalMode]);

  const handleChange = (v: number) => {
    setNoise(v);
    checkProceed();
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Entropy and Noise." 
        secondary="Irregular disturbance reduces information fidelity." 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pointer-events-auto w-64 mb-20"
      >
        <FloatingSlider
          label="DISTURBANCE (η)"
          value={noise}
          min={0}
          max={1}
          onChange={handleChange}
        />
        <p className="micro-text text-center mt-2 opacity-30">η &gt; 0.5 to proceed.</p>
      </motion.div>
    </div>
  );
};
