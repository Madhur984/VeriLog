/**
 * Module1Container.tsx
 * 
 * Persistent Orchestrator for Module 1.
 * Ensures wave continuity across all scenes. No resets. No cuts.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from './engines/WaveEngine';
import { AudioEngine } from './engines/AudioEngine';

interface Module1ContainerProps {
  children: (props: { 
    engine: WaveEngine; 
    audio: AudioEngine;
    points: { x: number; y: number }[];
    params: WaveParameters;
  }) => React.ReactNode;
}

export const Module1Container: React.FC<Module1ContainerProps> = ({ children }) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [params, setParams] = useState<WaveParameters>({
      amplitude: 0.4,
      frequency: 2,
      phase: 0,
      type: 'sine',
      noise: 0
  });

  // Persistent Engines
  const engineRef = useRef<WaveEngine>(new WaveEngine(params));
  const audioRef = useRef<AudioEngine>(new AudioEngine());

  useEffect(() => {
    // Start Engine once and keep it alive across all scenes
    engineRef.current.start((pts, p) => {
        setPoints(pts);
        setParams(p);
    });

    // Trigger Awareness Response at T+1200ms (Global)
    const awarenessTimer = setTimeout(() => {
        engineRef.current.triggerAwareness();
    }, 1200);

    return () => {
        engineRef.current.stop();
        clearTimeout(awarenessTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] text-white flex flex-col items-center justify-between overflow-hidden">
      
      {/* ── TOP LAYER: CONCEPT & SYSTEM STATUS (600ms delay) ── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[15vh] flex flex-col items-center justify-center border-b border-white/5 bg-black/20 backdrop-blur-xl z-[400] px-12"
      >
        <div className="w-full max-w-7xl flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono tracking-[0.4em] text-[#00FF41]/60 uppercase">
                   Signal_Link_01
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
                    <h1 className="text-xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                        The Signal Must Return
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-12">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Protocol Integrity</span>
                    <span className="text-xs font-mono text-[#00FF41]">98.42%</span>
                </div>
                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: '40%' }}
                        className="h-full bg-gradient-to-r from-[#00FF41] to-[#00FFFF]"
                    />
                </div>
            </div>
        </div>
      </motion.header>

      {/* ── CENTER LAYER: THE WAVE (Refactored to be persistent) ── */}
      {/* This main contains the scene-specific controls, while the wave is rendered by the container or shared by scenes */}
      <main className="relative flex-1 w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.02)_0%,rgba(0,0,0,0)_100%)] z-[100]">
          {children({ 
              engine: engineRef.current, 
              audio: audioRef.current,
              points,
              params
          })}
      </main>

      {/* ── BOTTOM LAYER: VISUAL GROUNDING (900ms delay) ── */}
      <motion.footer 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[12vh] border-t border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-center z-[400]"
      >
          <div className="w-full max-w-4xl flex justify-center items-center px-12 pointer-events-none">
                <span className="text-[9px] font-mono text-white/10 tracking-[1em] uppercase select-none italic">
                   - SYSTEM_CORE_TERMINAL_V1 -
                </span>
          </div>
      </motion.footer>

      {/* Global Grain/Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-soft-light z-[500]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};
