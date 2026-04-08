import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { audioEngine } from '../engine/audioEngine';

export const S00_Entry: React.FC = () => {
  const {
    setAmplitude, setFrequency,
    setIntroPhase, setTunnelProgress,
    setCollapseProgress, setPhase: setGlobalPhase
  } = useSignalStore();

  const [text, setText]       = useState('Signal inactive.');
  const [subText, setSubText] = useState('No variation detected.');
  const [localPhase, setLocalPhase] = useState(1);
  const activatedRef = useRef(false);

  useEffect(() => {
    setIntroPhase(1);
    setAmplitude(0);
    setFrequency(0);
  }, [setAmplitude, setFrequency, setIntroPhase]);

  useEffect(() => {
    const onMove = () => {
      if (activatedRef.current) return;
      activatedRef.current = true;
      setIntroPhase(2);
      setText('Signal = change.');
      setSubText('Input detected.');
      setTimeout(startTunnelSequence, 1500);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const startTunnelSequence = () => {
    setLocalPhase(3);
    setIntroPhase(3);
    audioEngine.hum(1.7);
    const start = Date.now();
    const run = () => {
      const n = Math.min(1, (Date.now() - start) / 2400);
      setTunnelProgress(n);
      setAmplitude(n * 0.18);
      setFrequency(1.4);
      if (n < 1) requestAnimationFrame(run);
      else startCollapseSequence();
    };
    requestAnimationFrame(run);
  };

  const startCollapseSequence = () => {
    setLocalPhase(4);
    setIntroPhase(4);
    setText('Signal stabilized.');
    setSubText('Control ready.');
    const start = Date.now();
    const run = () => {
      const n = Math.min(1, (Date.now() - start) / 800);
      setCollapseProgress(n);
      setAmplitude(0.18 + n * 0.4);
      if (n < 1) requestAnimationFrame(run);
      else {
        audioEngine.stabilized();
        setGlobalPhase('ACTIVE');
        setIntroPhase(0);
        setTunnelProgress(0);
        setCollapseProgress(0);
        useSignalStore.setState({ canProceed: true });
      }
    };
    requestAnimationFrame(run);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Neutral white — no cyan */}
          <div className="hero-text text-xl tracking-[0.4em] uppercase mb-3">
            {text}
          </div>
          {/* Dim gray subtext — no color */}
          <div className="micro-text opacity-50">
            {subText}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cursor hint — neutral pulsing text */}
      {localPhase === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-20 micro-text"
        >
          [ MOVE CURSOR TO INITIATE ]
        </motion.div>
      )}
    </div>
  );
};
