/**
 * S07_Noise — "Real signals are never perfect."
 * Noise slider adds particles + distortion. NOT glitchy.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InsightText } from '../components/InsightText';
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
    if (v > 0.5 && !explored) {
      setExplored(true);
      setTimeout(() => setShowNext(true), 800);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'No signal is perfect.', delay: 0.3 },
            { text: 'Noise is always present.', delay: 1.6 },
            { text: 'Imperfection is inherent, not accidental.', delay: 3.2 },
          ]}
          className="text-center"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-28 w-64"
      >
        <FloatingSlider label="Noise" value={noise} min={0} max={1} onChange={handleChange} />
      </motion.div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-14 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
