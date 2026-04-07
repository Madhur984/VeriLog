/**
 * S06_Shape — Basic Signals.
 * User selects between Step, Impulse, and Ramp.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore, SignalMode } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

const MODES: { id: SignalMode; label: string }[] = [
  { id: 'step', label: 'STEP (u)' },
  { id: 'impulse', label: 'IMPULSE (δ)' },
  { id: 'ramp', label: 'RAMP (r)' }
];

export const S06_Shape: React.FC = () => {
  const signal = useSignalStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [tried, setTried] = useState<Set<string>>(new Set());
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // Initial mode
    signal.setSignalMode('step');
  }, []);

  const handleSelect = (mode: SignalMode) => {
    signal.setSignalMode(mode);
    audio.tick();
    const newTried = new Set(tried);
    newTried.add(mode);
    setTried(newTried);
    if (newTried.size >= 3 && !showNext) setShowNext(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "All signals are built from simple forms.", 
          l2: "Complex signals are combinations of basic signals.",
          l3: "Foundational: Unit Step & Impulse"
        }}
        deepMode={{
          explanation: "Unit Step (u):\n• Sudden change of state\n\nImpulse (δ):\n• Infinite height, zero width\n\nRamp (r):\n• Linear growth",
          mapping: "S06 // ELEMENTARY"
        }}
      />

      <div className="pointer-events-auto flex v3-gap-2 mb-20">
        {MODES.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(m.id)}
            className={`v3-micro px-4 py-2 border rounded-sm cursor-pointer transition-all ${
              signal.signalMode === m.id 
                ? 'border-v3-cyan text-v3-cyan bg-v3-cyan/5' 
                : 'border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            {m.label}
          </motion.div>
        ))}
      </div>

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
