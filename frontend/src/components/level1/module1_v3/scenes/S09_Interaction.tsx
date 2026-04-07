/**
 * S09_Interaction — "Signals interact."
 * Second signal appears. Align phase → attract + amplify.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S09_Interaction: React.FC = () => {
  const phase     = useSignalStore((s) => s.phase);
  const setPhase  = useSignalStore((s) => s.setPhase);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [aligned, setAligned] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    canvasState.secondaryEnabled = true;
    canvasState.secondaryPhase = Math.PI; // start misaligned
    return () => { canvasState.secondaryEnabled = false; };
  }, []);

  useEffect(() => {
    // Sync secondary phase offset
    canvasState.secondaryPhase = Math.PI - phase;
    const diff = Math.abs(canvasState.secondaryPhase) % (Math.PI * 2);
    const isNearAligned = diff < 0.3 || diff > Math.PI * 2 - 0.3;
    if (isNearAligned && !aligned) {
      setAligned(true);
      audio.snap();
      setTimeout(() => setShowNext(true), 600);
    }
  }, [phase, aligned]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <TheoryOverlay 
        levels={{
          l1: "Signals interact.",
          l2: "They combine. They cancel.",
          l3: "No signal exists in isolation. Reality is an interference pattern."
        }}
        deepMode={{
          formula: "s_total = s1 + s2 // Superposition",
          explanation: "In phase, they reinforce. Out of phase, they destroy each other. This is the heart of communication and noise cancellation.",
          mapping: "Constructive -> Reinforcement // Destructive -> Cancellation"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-44 w-64"
      >
        <FloatingSlider
          label="Alignment"
          value={phase}
          min={0}
          max={Math.PI * 2}
          step={0.05}
          onChange={(v) => { 
            setPhase(v); 
            audio.tick(); 
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          className="v3-small text-center v3-mt-2 tracking-[0.4em]"
        >
          Explore alignment.
        </motion.p>
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

