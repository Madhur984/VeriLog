/**
 * S11_Lab — "Control the Signal" (Synthesis Screen)
 * This is the final lab where user balances all variables.
 * No UI sliders. Invisible interaction.
 */
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalLabStore } from '../store/signalLabStore';
import { useSignalStore } from '../store/signalStore';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

// --- 🖱️ INPUT SYSTEM ---
const Controls: React.FC = () => {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth;
      const y = e.clientY / innerHeight;
      const store = useSignalLabStore.getState();

      // Vertical → Amplitude
      store.setAmplitude(1 - y);
      // Horizontal → Frequency (Direct 2x mapping)
      store.setFrequency(x * 2.0);
    };

    const handleScroll = (e: WheelEvent) => {
      const store = useSignalLabStore.getState();
      // Increase/decrease noise slowly (0.0005 step)
      const delta = e.deltaY * 0.0005;
      store.setNoise(store.noise + delta);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return null;
};

// --- 📊 STATUS UI (MINIMAL INSTRUMENT) ---
const HUD: React.FC = () => {
  const { status, stabilityProgress } = useSignalLabStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="v3-hud z-30 flex v3-gap-3 items-center"
    >
      <div className="flex flex-col items-end">
        <div className="v3-micro opacity-30">Status</div>
        <motion.div 
          key={status}
          className="v3-micro text-white/80"
        >
          {status === 'OPTIMAL' ? 'STABLE' : status}
        </motion.div>
      </div>

      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          <motion.circle 
            cx="24" cy="24" r="20" fill="none" 
            stroke="#E6F9FF" strokeWidth="1"
            strokeDasharray="125.6"
            animate={{ strokeDashoffset: 125.6 * (1 - stabilityProgress) }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="v3-micro opacity-40 tabular-nums">{Math.round(stabilityProgress * 100)}</div>
      </div>
    </motion.div>
  );
};

import { TheoryOverlay } from '../components/TheoryOverlay';

// --- 🌌 MAIN SCENE ---
export const S11_Lab: React.FC = () => {
  const { status, reset } = useSignalLabStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [locked, setLocked] = useState(false);
  const [fading, setFading] = useState(false);
  const [finalText, setFinalText] = useState("");

  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  useEffect(() => {
    if (status === "OPTIMAL" && !locked) {
      setLocked(true);
      triggerFinalSequence();
    }
  }, [status, locked]);

  const triggerFinalSequence = () => {
    audio.stabilize();
    
    // 0ms ->Brightness pulse (simulated via fading)
    setTimeout(() => setFading(true), 200);
    
    // 400ms -> Text: Stable.
    setTimeout(() => setFinalText("Stable."), 600);
    
    // 2000ms -> Transition to End
    setTimeout(() => {
      setFinalText("You are the signal.");
      audio.collapse();
    }, 2500);

    setTimeout(() => {
       nextScene();
    }, 4500);
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
      <Controls />
      <HUD />

      <AnimatePresence>
        {!locked && (
          <TheoryOverlay 
            levels={{ 
              l1: "Control the signal.", 
              l2: "Balance defines stability.",
              l3: "Synthesis: Final Convergence"
            }}
            deepMode={{
              explanation: "All concepts combine:\n• amplitude\n• frequency\n• noise\n• behavior",
              mapping: "S12 // SYNTHESIS"
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {finalText && (
          <motion.div
            key={finalText}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="v3-text-anchor"
          >
            <div className="v3-hero tracking-[0.4em] opacity-80 uppercase">
              {finalText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ opacity: fading ? [0, 0.15, 0] : 0 }}
        className="absolute inset-0 bg-white pointer-events-none z-50"
      />
    </div>
  );
};


