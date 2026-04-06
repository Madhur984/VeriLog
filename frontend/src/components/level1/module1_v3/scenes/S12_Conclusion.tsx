/**
 * S12_Conclusion — Signal collapses to a dot → pulse → disappear.
 * 300ms silence → "You are the signal." → Module 2.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

type Phase = 'collapse' | 'dot' | 'silence' | 'reveal' | 'done';

export const S12_Conclusion: React.FC = () => {
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const setNoise     = useSignalStore((s) => s.setNoise);
  const [phase, setPhase] = useState<Phase>('collapse');

  useEffect(() => {
    canvasState.secondaryEnabled = false;
    canvasState.showTrail = false;
    canvasState.magneticStrength = 0;

    // Lerp signal toward stable over 2s
    const start = performance.now();
    let raf: number;
    const lerp = () => {
      const t = (performance.now() - start) / 2000;
      if (t < 1) {
        setAmplitude(0.5 * (1 - t) + 0.001 * t);
        setNoise(0);
        raf = requestAnimationFrame(lerp);
      } else {
        setAmplitude(0.001);
        setNoise(0);
        audio.collapse();
        setPhase('dot');

        // Dot pulse → silence → reveal
        setTimeout(() => setPhase('silence'), 1500);
        setTimeout(() => setPhase('reveal'), 1800);
      }
    };
    raf = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(raf);
  }, [setAmplitude, setNoise]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Collapsing dot */}
      <AnimatePresence>
        {(phase === 'dot' || phase === 'silence') && (
          <motion.div
            key="dot"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.4, 0], opacity: [1, 0.7, 0] }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-2 h-2 rounded-full bg-[#00E5FF]"
          />
        )}
      </AnimatePresence>

      {/* Final Reveal */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            <p className="v3-hero select-none">You are the signal.</p>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2.2, duration: 1.2 }}
              whileHover={{ opacity: 1 }}
              className="v3-small pointer-events-auto v3-mt-6 tracking-[0.5em] text-white/50 hover:text-white transition-colors"
              onClick={() => window.location.href = '/module/2'}
            >
              Module 2 →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
