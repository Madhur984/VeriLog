import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { audioEngine } from '../engine/audioEngine';

export const S00_Entry: React.FC = () => {
  const { 
    setAmplitude, 
    setFrequency, 
    setIntroPhase, 
    setTunnelProgress, 
    setCollapseProgress,
    setPhase: setGlobalPhase 
  } = useSignalStore();

  const [text, setText] = useState('Signal initializing.');
  const [subText, setSubText] = useState('System inactive.');
  const [phase, setLocalPhase] = useState(1);
  const activatedRef = useRef(false);

  useEffect(() => {
    // START PHASE 1: VOID
    setIntroPhase(1);
    setAmplitude(0.15);
    setFrequency(1.0);

    const t1 = setTimeout(() => {
      setLocalPhase(2);
      setIntroPhase(2);
      setText('Signal = change.');
      setSubText('Input detected.');
    }, 1200);

    return () => clearTimeout(t1);
  }, [setAmplitude, setFrequency, setIntroPhase]);

  useEffect(() => {
    if (phase !== 2) return;

    const onMove = () => {
      if (activatedRef.current) return;
      activatedRef.current = true;
      startTunnelSequence();
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const startTunnelSequence = () => {
    // PHASE 3: TUNNEL FORMATION
    setTimeout(() => {
      setLocalPhase(3);
      setIntroPhase(3);
      audioEngine.hum(1.7);
      
      const startTime = Date.now();
      const duration = 2000;

      const animateTunnel = () => {
        const elapsed = Date.now() - startTime;
        const norm = Math.min(1, elapsed / duration);
        
        setTunnelProgress(norm);
        
        if (norm < 1) {
          requestAnimationFrame(animateTunnel);
        } else {
          startCollapseSequence();
        }
      };
      requestAnimationFrame(animateTunnel);
    }, 400);
  };

  const startCollapseSequence = () => {
    // PHASE 4: COLLAPSE
    setLocalPhase(4);
    setIntroPhase(4);
    setText('Signal stabilized.');
    setSubText('Control ready.');

    let startTime = Date.now();
    const duration = 800;

    const animateCollapse = () => {
      const elapsed = Date.now() - startTime;
      const norm = Math.min(1, elapsed / duration);
      
      setCollapseProgress(norm);
      setAmplitude(0.15 + norm * 0.4); // Handoff target 0.55
      
      if (norm < 1) {
        requestAnimationFrame(animateCollapse);
      } else {
        audioEngine.stabilized();
        // TRIGGER GLOBAL TRANSITION
        setGlobalPhase('ACTIVE');
        setIntroPhase(0);
        setTunnelProgress(0);
        setCollapseProgress(0);
        useSignalStore.setState({ canProceed: true });
      }
    };
    requestAnimationFrame(animateCollapse);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
           key={text}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="text-center"
        >
          <div className="hero-text text-xl tracking-[0.4em] uppercase mb-2">
            {text}
          </div>
          <div className="micro-text text-v3-cyan opacity-40 uppercase">
            {subText}
          </div>
        </motion.div>
      </AnimatePresence>

      {phase === 2 && !activatedRef.current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-20 micro-text text-v3-cyan"
        >
          [ MOVE CURSOR TO INITIATE ]
        </motion.div>
      )}
    </div>
  );
};
