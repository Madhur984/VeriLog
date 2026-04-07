/**
 * S11_Lab — "Control the Signal" (Synthesis Screen)
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalLabStore } from '../store/signalLabStore';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

const HUD: React.FC = () => {
  const { status, stabilityProgress } = useSignalLabStore();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="v3-hud z-30 flex v3-gap-3 items-center">
      <div className="flex flex-col items-end">
        <div className="v3-micro opacity-30 uppercase">Instrument Status</div>
        <div className="v3-micro text-white/80">{status}</div>
      </div>
      <div className="v3-micro opacity-40 tabular-nums text-xl">
        {Math.round(stabilityProgress * 100)}%
      </div>
    </motion.div>
  );
};

export const S11_Lab: React.FC = () => {
  const { status, reset, setAmplitude, setFrequency, setNoise } = useSignalLabStore();
  const nextScene = useSignalStore((s) => s.nextScene);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('deterministic');
    reset();
    
    const handleMove = (e: MouseEvent) => {
      if (locked) return;
      setAmplitude(1 - (e.clientY / window.innerHeight));
      setFrequency((e.clientX / window.innerWidth) * 3);
    };
    
    const handleWheel = (e: WheelEvent) => {
      if (locked) return;
      setNoise(Math.max(0, Math.min(1, useSignalLabStore.getState().noise + e.deltaY * 0.001)));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('wheel', handleWheel);
      reset();
    };
  }, [locked]);

  useEffect(() => {
    if (status === 'OPTIMAL' && !locked) {
      setLocked(true);
      audio.stabilize();
      setTimeout(nextScene, 3000);
    }
  }, [status, locked, nextScene]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <HUD />
      <TheoryOverlay 
        levels={{ 
          l1: "Control the signal.", 
          l2: "Balance defines stability. Use your mouse and scroll wheel to stabilize.",
          l3: "Synthesis: Final Convergence"
        }}
        deepMode={{
          explanation: "Stabilize all variables to reach 100% coherence.",
          mapping: "S11 // SYNTHESIS"
        }}
      />
      
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="v3-hero uppercase tracking-widest text-[#00E5FF]"
        >
          COHERENCE ACHIEVED
        </motion.div>
      )}
    </div>
  );
};
