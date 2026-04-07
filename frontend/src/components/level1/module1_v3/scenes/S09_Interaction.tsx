/**
 * S09_Interaction — Geometric Signals.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore, SignalMode } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

const MODES: { id: SignalMode; label: string }[] = [
  { id: 'triangular', label: 'TRIANGLE (▲)' },
  { id: 'rectangular', label: 'BINARY (■)' }
];

export const S09_Interaction: React.FC = () => {
  const signal = useSignalStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [tried, setTried] = useState<Set<string>>(new Set());
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    signal.setSignalMode('triangular');
  }, []);

  const handleSelect = (mode: SignalMode) => {
    signal.setSignalMode(mode);
    audio.tick();
    const newTried = new Set(tried);
    newTried.add(mode);
    setTried(newTried);
    if (newTried.size >= 2 && !showNext) setShowNext(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals define geometry.", 
          l2: "Geometric signals are used to drive synthesizers and oscillators.",
          l3: "Pedagogical: Waveform Geometry"
        }}
        deepMode={{
          explanation: "Triangle:\n• Linear slopes\n• Rich harmonics\n\nRectangular:\n• Binary switching\n• Pure fundamental",
          mapping: "S09 // GEOMETRIC"
        }}
      />

      <div className="pointer-events-auto flex v3-gap-2 mb-20">
        {MODES.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -2 }}
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
