/**
 * S07_Noise — "Real signals are never perfect."
 * Noise slider adds particles + distortion. NOT glitchy.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S07_Noise: React.FC = () => {
  const noise = useSignalStore((s) => s.noise);
  const setNoise = useSignalStore((s) => s.setNoise);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [explored, setExplored] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleChange = (v: number) => {
    setNoise(v);
    audio.tick();
    
    // FIX Checklist: Lower threshold to 0.3
    if (v > 0.3 && !explored) {
      setExplored(true);
      setTimeout(() => setShowNext(true), 800);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{
          l1: "Mastering Imperfection.",
          l2: "No signal is perfect. Entropy adds noise to every transmission.",
          l3: "MASTERING THE SYSTEM REQUIRES MASTERING THE NOISE."
        }}
        deepMode={{
          formula: "S(t) + η(t)",
          explanation: "Mastery is not about removing noise, but controlling its influence on the core truth.",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-48 flex flex-col items-center v3-gap-4"
      >
        <FloatingSlider label="Entropy (η)" value={noise} min={0} max={1} onChange={handleChange} />

        <AnimatePresence>
          {showNext && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={nextScene}
              className="v3-micro v3-interactive opacity-40 hover:opacity-100 transition-opacity"
            >
              [ PROCEED ]
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

