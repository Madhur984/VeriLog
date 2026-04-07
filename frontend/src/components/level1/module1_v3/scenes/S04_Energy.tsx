/**
 * S04_Energy — "Signals can be smooth or discrete."
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S04_Energy: React.FC = () => {
  const amplitude = useSignalStore((s) => s.amplitude);
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);

  // Set mode
  React.useEffect(() => {
    useSignalStore.getState().setSignalMode('rectangular');
  }, []);

  const handleChange = (v: number) => {
    setAmplitude(v);
    audio.tick();
    if (v > 0.7 && !showNext) {
      setShowNext(true);
      audio.snap();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals can be smooth or discrete.", 
          l2: "Analog is continuous. Digital is step-based.",
          l3: "Architecture: The Quantum vs The Discrete"
        }}
        deepMode={{
          explanation: "Analog:\n• infinite values\n• smooth\n• noise-sensitive\n\nDigital:\n• binary (0,1)\n• robust\n• easier processing",
          mapping: "S04 // DISCRETIZATION"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="pointer-events-auto w-64 mb-12"
      >
        <FloatingSlider
          label="QUANTIZATION"
          value={amplitude}
          min={0.05}
          max={1}
          onChange={handleChange}
        />
        <p className="v3-micro text-center mt-2 opacity-30">Raise for transition.</p>
      </motion.div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={nextScene}
            className="continue-btn active pointer-events-auto"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
