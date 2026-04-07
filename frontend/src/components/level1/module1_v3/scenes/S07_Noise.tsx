/**
 * S07_Noise — "Chaos is also a signal."
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S07_Noise: React.FC = () => {
  const signal = useSignalStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('random');
  }, []);

  const handleChange = (v: number) => {
    signal.setNoise(v);
    audio.tick();
    if (v > 0.6 && !showNext) {
      setShowNext(true);
      audio.snap();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Noise and Entropy.", 
          l2: "Unwanted disturbance in a signal is called noise.",
          l3: "Engineering: Signal-to-Noise Ratio (SNR)"
        }}
        deepMode={{
          explanation: "SNR:\n• P_signal / P_noise\n• Higher is better\n\nThermal Noise:\n• Random electron motion\n• Present in all conductors",
          mapping: "S07 // INTERFERENCE"
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="pointer-events-auto mb-20 w-64"
      >
        <FloatingSlider
          label="ENTROPY (σ)"
          value={signal.noise}
          min={0}
          max={1}
          onChange={handleChange}
        />
        <p className="v3-micro text-center mt-2 opacity-30">Disturb the signal.</p>
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
