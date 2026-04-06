/**
 * S05_Frequency — "Frequency is repetition."
 * Frequency slider shows tighter cycles.
 */
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InsightText } from '../components/InsightText';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S05_Frequency: React.FC = () => {
  const frequency = useSignalStore((s) => s.frequency);
  const setFrequency = useSignalStore((s) => s.setFrequency);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);
  const movedHigh = useRef(false);

  const handleChange = (v: number) => {
    setFrequency(v);
    audio.tick();
    if (v > 2.5 && !movedHigh.current) {
      movedHigh.current = true;
      setTimeout(() => setShowNext(true), 600);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'Frequency is repetition.', delay: 0.3 },
            { text: 'How often change occurs.', delay: 1.6 },
            { text: 'Frequency defines how often change occurs.', delay: 3.2 },
          ]}
          className="text-center"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-28 w-64"
      >
        <FloatingSlider
          label="Frequency"
          value={frequency}
          min={0.1}
          max={5}
          step={0.05}
          onChange={handleChange}
        />
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
