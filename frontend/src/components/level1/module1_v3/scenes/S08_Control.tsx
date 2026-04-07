/**
 * S08_Control — Full control panel floats in.
 * Unlock by 5s of interaction time (not "all sliders touched").
 */
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S08_Control: React.FC = () => {
  const amplitude  = useSignalStore((s) => s.amplitude);
  const frequency  = useSignalStore((s) => s.frequency);
  const noise      = useSignalStore((s) => s.noise);
  const setAmp     = useSignalStore((s) => s.setAmplitude);
  const setFreq    = useSignalStore((s) => s.setFrequency);
  const setNoise   = useSignalStore((s) => s.setNoise);
  const nextScene  = useSignalStore((s) => s.nextScene);

  const [showNext, setShowNext] = useState(false);
  const interactMs = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  // Tick interaction time while user interacts
  const startTimer = () => {
    if (timer.current) return;
    timer.current = setInterval(() => {
      interactMs.current += 250;
      if (interactMs.current >= 5000 && !showNext) {
        setShowNext(true);
        audio.stabilize();
        clearInterval(timer.current!);
      }
    }, 250);
  };

  const handle = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    audio.tick();
    startTimer();
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <TheoryOverlay 
        levels={{
          l1: "Systematic adjustment.",
          l2: "Variables are not isolated.",
          l3: "True control is the ability to maintain stability within a chaotic field."
        }}
        deepMode={{
          explanation: "Mastering a signal requires understanding the trade-offs between its parameters. High energy often invites high noise.",
          mapping: "Precision -> Stability // Complexity -> Information Density"
        }}
      />

      <motion.div
        className="pointer-events-auto absolute bottom-40 w-72 flex flex-col v3-gap-4"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Amplitude" value={amplitude} min={0.05} max={1} onChange={handle(setAmp)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Frequency" value={frequency} min={0.1} max={5} step={0.05} onChange={handle(setFreq)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.66, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Noise" value={noise} min={0} max={1} onChange={handle(setNoise)} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-24 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

