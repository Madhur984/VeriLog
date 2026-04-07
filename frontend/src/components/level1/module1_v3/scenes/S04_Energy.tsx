import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { FloatingSlider } from '../components/FloatingSlider';

export const S04_Energy: React.FC = () => {
  const amplitude = useSignalStore((s) => s.amplitude);
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('rectangular');
  }, [setSignalMode]);

  const handleChange = (v: number) => {
    setAmplitude(v);
    checkProceed();
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Energy is Amplitude." 
        secondary="The vertical displacement defines the intensity of information." 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="pointer-events-auto w-64 mb-20"
      >
        <FloatingSlider
          label="STRENGTH (A)"
          value={amplitude}
          min={0.05}
          max={1}
          onChange={handleChange}
        />
        <p className="micro-text text-center mt-2 opacity-30">A &gt; 0.6 to proceed.</p>
      </motion.div>
    </div>
  );
};
