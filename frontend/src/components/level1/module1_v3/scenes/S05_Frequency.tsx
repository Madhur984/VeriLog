import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { FloatingSlider } from '../components/FloatingSlider';

export const S05_Frequency: React.FC = () => {
  const amplitude = useSignalStore((s) => s.amplitude);
  const frequency = useSignalStore((s) => s.frequency);
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const setFrequency = useSignalStore((s) => s.setFrequency);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
  }, [setSignalMode]);

  const handleAmp = (v: number) => {
    setAmplitude(v);
    checkProceed();
  };

  const handleFreq = (v: number) => {
    setFrequency(v);
    checkProceed();
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Parametric DNA." 
        secondary="The interaction between amplitude and rate creates unique profiles." 
      />

      <div className="flex gap-16 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="pointer-events-auto w-48"
        >
          <FloatingSlider
            label="HEIGHT (A)"
            value={amplitude}
            min={0.1}
            max={1}
            onChange={handleAmp}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="pointer-events-auto w-48"
        >
          <FloatingSlider
            label="RATE (f)"
            value={frequency}
            min={0.2}
            max={3}
            onChange={handleFreq}
          />
          <p className="micro-text text-center mt-2 opacity-30">f &gt; 1.5 to proceed.</p>
        </motion.div>
      </div>
    </div>
  );
};
