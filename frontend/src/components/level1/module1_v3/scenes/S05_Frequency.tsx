/**
 * S05_Frequency — "The DNA of a signal."
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S05_Frequency: React.FC = () => {
  const signal = useSignalStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);
  const [changed, setChanged] = useState({ amp: false, freq: false });

  useEffect(() => {
    useSignalStore.getState().setSignalMode('analog');
  }, []);

  const handleAmp = (v: number) => {
    signal.setAmplitude(v);
    audio.tick();
    if (!changed.amp) setChanged(p => ({ ...p, amp: true }));
  };

  const handleFreq = (v: number) => {
    signal.setFrequency(v);
    audio.tick();
    if (!changed.freq) setChanged(p => ({ ...p, freq: true }));
  };

  useEffect(() => {
    if (changed.amp && changed.freq && !showNext) {
      setTimeout(() => {
        setShowNext(true);
        audio.snap();
      }, 500);
    }
  }, [changed, showNext]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Amplitude and Frequency.", 
          l2: "These are the fundamental parameters of any periodic signal.",
          l3: "Engineering: Signal Characteristics"
        }}
        deepMode={{
          explanation: "Amplitude (A):\n• Strength / Energy\n• Intensity\n\nFrequency (f):\n• Cycles per second (Hz)\n• Measured as 1/T",
          mapping: "S05 // PARAMETRIC DNA"
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="pointer-events-auto flex flex-col v3-gap-4 mb-20 w-64"
      >
        <FloatingSlider
          label="STRENGTH (A)"
          value={signal.amplitude}
          min={0.1}
          max={1}
          onChange={handleAmp}
        />
        <FloatingSlider
          label="VELOCITY (f)"
          value={signal.frequency}
          min={0.5}
          max={4}
          onChange={handleFreq}
        />
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
