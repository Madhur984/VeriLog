/**
 * S08_Control — DSP Pipeline.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S08_Control: React.FC = () => {
  const signal = useSignalStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('sinc');
  }, []);

  const handleChange = (v: number) => {
    signal.setAmplitude(v);
    audio.tick();
    if (v > 0.4 && !showNext) {
      setShowNext(true);
      audio.snap();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals can be processed.", 
          l2: "Analog → Digital → Process → Analog",
          l3: "Engineering: DSP Pipeline"
        }}
        deepMode={{
          explanation: "ADC → converts signal\nProcessing → modifies\nDAC → reconstructs",
          mapping: "S08 // PROCESSING"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="pointer-events-auto mb-20 w-64"
      >
        <FloatingSlider
          label="PROCESSING GAIN"
          value={signal.amplitude}
          min={0.1}
          max={1}
          onChange={handleChange}
        />
        <p className="v3-micro text-center mt-2 opacity-30">Oscillate the filter.</p>
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
