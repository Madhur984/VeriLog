/**
 * Scene4_ControlLab.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';

interface Scene4ControlLabProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene4_ControlLab: React.FC<Scene4ControlLabProps> = ({ onComplete, engine, audio, points, params }) => {
  const [targetHit, setTargetHit] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [engMode, setEngMode] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);
  
  useEffect(() => {
    engine.setTarget({ amplitude: 0.2, frequency: 1, phase: 0, type: 'sine', noise: 0 });
    const resetIdle = () => {
        setIsIdle(false);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => setIsIdle(true), 3000);
    };
    resetIdle();
    window.addEventListener('mousedown', resetIdle);
    return () => {
        window.removeEventListener('mousedown', resetIdle);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
    }
  }, [engine]);

  const handleParamChange = (id: keyof WaveParameters, val: any) => {
    engine.setTarget({ [id]: val });
    setPulseTrigger(p => p + 1);
    audio.playTick();
    
    // Check target hit in real-time
    const current = engine.getParams();
    if (!targetHit && current.frequency >= 6 && current.amplitude >= 0.8) {
      setTargetHit(true);
      audio.playSuccess();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox unlocked={targetHit} title="ENERGY_CONTROL" insight="Precision control allows binary encoding." whyItMatters="By controlling voltage and timing, we transform raw electricity into a language of logic." engineering="P ∝ A². Bandwidth ∝ Frequency." />
          </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer points={points} params={params} pulseTrigger={pulseTrigger} engineeringMode={engMode} />
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={() => setEngMode(!engMode)} className="absolute top-8 right-8 px-5 py-2 border border-white/5 bg-black/40 text-[9px] font-mono text-white/40 uppercase tracking-widest hover:border-[#00FF41] hover:text-[#00FF41] transition-all z-10 italic" > {engMode ? '[ ENG: ENABLED ]' : '[ ENG: DISABLED ]'} </motion.button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-0 w-full h-[35vh] flex justify-center p-12 z-50 pointer-events-none" >
          <div className="w-full max-w-5xl flex gap-12 p-10 border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center pointer-events-auto">
              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex-1 flex flex-col gap-10" >
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>System Power (A)</label>
                          <span className="text-[#00FF41]">{(params.amplitude * 100).toFixed(0)}%</span>
                      </div>
                      <motion.input type="range" min="0.1" max="1" step="0.01" value={params.amplitude} onChange={(e) => handleParamChange('amplitude', parseFloat(e.target.value))}
                        animate={isIdle && !targetHit ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0" />
                  </div>
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>Data Throughput (f)</label>
                          <span className="text-[#00FF41]">{(params.frequency).toFixed(1)}Hz</span>
                      </div>
                      <motion.input type="range" min="1" max="10" step="0.1" value={params.frequency} onChange={(e) => handleParamChange('frequency', parseFloat(e.target.value))}
                        animate={isIdle && !targetHit ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                        transition={{ delay: 1 }}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0" />
                  </div>
              </motion.div>

              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-[350px] flex flex-col gap-6" >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Target_Sync.exe</span>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-relaxed"> Mission: Stabilize system for Peak Power (A {">"} 80%) and Maximum Throughput (f {">"} 6Hz). </p>
              </motion.div>
          </div>
      </motion.div>

      <AnimatePresence>
          {targetHit && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={onComplete} className="fixed bottom-12 right-12 px-10 py-5 bg-[#00FF41] text-black font-black text-[10px] tracking-widest uppercase z-[450] italic hover:scale-[1.05] transition-all" > Deploy Module 1.5 → </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
