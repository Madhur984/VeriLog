/**
 * S11_Lab — Free exploration sandbox.
 * No explicit goal. System subtly stabilizes when signal is "good".
 * "stable" text appears quietly after achieving stability.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { FloatingSlider } from '../components/FloatingSlider';
import { ShapeSelector } from '../components/ShapeSelector';
import { InsightText } from '../components/InsightText';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

function evaluate(amp: number, freq: number, noise: number) {
  return {
    stable: noise < 0.15,
    strong: amp > 0.6,
    fast:   freq > 1.5,
  };
}

export const S11_Lab: React.FC = () => {
  const amplitude  = useSignalStore((s) => s.amplitude);
  const frequency  = useSignalStore((s) => s.frequency);
  const noise      = useSignalStore((s) => s.noise);
  const setAmp     = useSignalStore((s) => s.setAmplitude);
  const setFreq    = useSignalStore((s) => s.setFrequency);
  const setNoise   = useSignalStore((s) => s.setNoise);
  const nextScene  = useSignalStore((s) => s.nextScene);

  const [status, setStatus] = useState({ stable: false, strong: false, fast: false });
  const [showStable, setShowStable] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const stableTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const s = evaluate(amplitude, frequency, noise);
    setStatus(s);
    if (s.stable && s.strong && !showStable) {
      stableTimer.current = setTimeout(() => {
        setShowStable(true);
        audio.stabilize();
        setTimeout(() => setShowNext(true), 2000);
      }, 1000);
    } else {
      clearTimeout(stableTimer.current!);
    }
    return () => clearTimeout(stableTimer.current!);
  }, [amplitude, frequency, noise]);

  const handle = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    audio.tick();
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <div className="absolute top-16 text-center">
        <InsightText
          lines={[
            { text: 'Adjust.', delay: 0.3 },
            { text: 'Observe.', delay: 1.6 },
            { text: 'Understanding emerges through manipulation.', delay: 3.2 },
          ]}
          className="text-center"
        />
      </div>

      {/* Status readout — very quiet */}
      <div className="absolute top-12 right-12 flex flex-col v3-gap-1 text-right">
        {[
          { key: 'stable', label: 'stable' },
          { key: 'strong', label: 'strong' },
          { key: 'fast',   label: 'fast' },
        ].map(({ key, label }) => (
          <motion.span
            key={key}
            animate={{ opacity: status[key as keyof typeof status] ? 0.6 : 0.05 }}
            transition={{ duration: 0.8 }}
            className="v3-small tracking-[0.3em] text-[#00E5FF] pointer-events-none"
          >
            {label}
          </motion.span>
        ))}
      </div>

      {/* Stable confirmation — appears AFTER */}
      <AnimatePresence>
        {showStable && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="absolute top-1/2 -translate-y-24 text-center pointer-events-none"
          >
            <p className="v3-title tracking-[0.6em]">Stable.</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8 }}
              className="v3-small tracking-[0.4em] v3-mt-1"
            >
              Maintain it.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        className="pointer-events-auto absolute bottom-24 w-72 flex flex-col v3-gap-6"
      >
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
           <ShapeSelector />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Amplitude" value={amplitude} min={0.05} max={1} onChange={handle(setAmp)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Frequency" value={frequency} min={0.1} max={5} step={0.05} onChange={handle(setFreq)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.64, ease: [0.16, 1, 0.3, 1] }}>
          <FloatingSlider label="Noise" value={noise} min={0} max={1} onChange={handle(setNoise)} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-8 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
