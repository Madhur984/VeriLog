import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';

import { audioEngine } from '../engine/audioEngine';

export const S00_Entry: React.FC = () => {
  const { setAmplitude, setFrequency } = useSignalStore();
  const [phase, setPhase] = useState(1); // 1: Void, 2: Activation, 3: Tunnel, 4: Collapse
  const [text, setText] = useState('Signal initializing.');
  const [subText, setSubText] = useState('System inactive.');
  const activatedRef = useRef(false);

  useEffect(() => {
    // START PHASE 1: VOID
    canvasState.introPhase = 1;
    canvasState.opacity = 0.4; // Boosted from 0.05
    canvasState.magneticStrength = 0;
    setAmplitude(0.15); // Boosted from 0.05
    setFrequency(1.0);

    // After 1.2s, move to Phase 2
    const t1 = setTimeout(() => {
      setPhase(2); // Fix: required to enable the mousemove listener
      canvasState.introPhase = 2;
      canvasState.opacity = 0.5;
      setText('Signal = change.');
      setSubText('Input detected.');
    }, 1200);

    return () => clearTimeout(t1);
  }, [setAmplitude, setFrequency]);

  // Listener for Phase 2 -> 3 transition
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
    // PHASE 2 RESPONSE: Magnetic Pull
    canvasState.magneticStrength = 0.4;
    
    // PHASE 3: TUNNEL FORMATION (2800ms)
    setTimeout(() => {
      setPhase(3);
      canvasState.introPhase = 3;
      
      audioEngine.hum(1.7);
      const startTime = Date.now();
      const duration = 1700; // Phase 3 duration

      const animateTunnel = () => {
        const elapsed = Date.now() - startTime;
        const norm = Math.min(1, elapsed / duration);
        
        // forward motion simulated via scaling + fade
        canvasState.tunnelLayerCount = Math.floor(norm * 8);
        canvasState.tunnelOpacity = norm * 0.2;
        canvasState.opacity = 0.1 + norm * 0.25;
        
        if (norm < 1) {
          requestAnimationFrame(animateTunnel);
        } else {
          startCollapseSequence();
        }
      };
      
      requestAnimationFrame(animateTunnel);
    }, 800);
  };

  const startCollapseSequence = () => {
    // PHASE 4: COLLAPSE (1000ms)
    setPhase(4);
    canvasState.introPhase = 4;
    setText('Signal stabilized.');
    setSubText('Control ready.');

    let startTime = Date.now();
    const duration = 1000;

    const animateCollapse = () => {
      const elapsed = Date.now() - startTime;
      const norm = Math.min(1, elapsed / duration);
      
      // tunnel layers converge
      canvasState.tunnelOpacity = 0.2 * (1 - norm);
      // quick compression (scale Y -> 0.8 -> 1)
      canvasState.stabilizeCompress = 0.8 + (norm * 0.2);
      // amplitude stabilizes
      setAmplitude(0.1 + norm * 0.3);
      
      if (norm < 1) {
        requestAnimationFrame(animateCollapse);
      } else {
        audioEngine.stabilized();
        canvasState.introPhase = 0; // End intro
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
