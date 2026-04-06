/**
 * Scene6_ApplyLab.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';
import { useGlobalMemory } from '../../../../hooks/useGlobalMemory';

interface Scene6ApplyLabProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene6_ApplyLab: React.FC<Scene6ApplyLabProps> = ({ onComplete, engine, audio, points, params }) => {
  const [pulse, setPulse] = useState(0);
  const [mastered, setMastered] = useState(false);
  const { addAchievement } = useGlobalMemory();
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    engine.setTarget({ amplitude: 0.1, frequency: 1, phase: 0, type: 'sine', noise: 0.5 });
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
    setPulse(p => p + 1);
    audio.playTick();
  };

  const handleVerify = () => {
    const current = engine.getParams();
    if (current.frequency >= 6 && current.noise <= 0.1 && current.amplitude >= 0.8) {
        setMastered(true);
        addAchievement('TRANSMISSION_SECURED');
        audio.playSuccess();
    } else {
        audio.playError();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox unlocked={mastered} title="MODULE_01_COMPLETION" insight="Transmission Secured. Link Established." whyItMatters="You've mastered the link between energy and logic." engineering="System check: [SNR Opt: OK] [Throughput: MAX] [Integrity: VERIFIED]." />
          </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer points={points} params={params} pulseTrigger={pulse} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-0 w-full h-[40vh] flex justify-center p-8 z-50 pointer-events-none" >
          <div className="w-full max-w-5xl flex gap-12 p-8 border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center pointer-events-auto">
              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex-1 flex flex-col gap-6" >
                  {[
                      { id: 'amplitude', label: 'Signal Power', max: 1, step: 0.01 },
                      { id: 'frequency', label: 'Throughput', max: 10, step: 0.1 },
                      { id: 'noise', label: 'Inertia Filter', max: 1, step: 0.01, reverse: true }
                  ].map((ctrl, i) => (
                      <div key={ctrl.id} className="flex flex-col gap-3">
                        <div className="flex justify-between items-end text-[8px] font-mono tracking-widest text-white/30 uppercase">
                          <label>{ctrl.label}</label>
                          <span className="text-[#00FF41]">{(params as any)[ctrl.id].toFixed(2)}</span>
                        </div>
                        <motion.input type="range" min="0" max={ctrl.max} step={ctrl.step} value={(params as any)[ctrl.id]} onChange={(e) => handleParamChange(ctrl.id as any, parseFloat(e.target.value))}
                            animate={isIdle && !mastered ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                            transition={{ delay: i * 0.2 }}
                            className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0" />
                      </div>
                  ))}
              </motion.div>

              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-[300px] flex flex-col gap-6" >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Protocol_Verify.exe</span>
                  <div className="flex flex-col gap-3 opacity-40 text-[7px] font-mono text-white/60">
                      <div>[f {">"} 6Hz]</div>
                      <div>[A {">"} 80%]</div>
                      <div>[Noise {"<"} 10%]</div>
                  </div>
                  <button onClick={handleVerify} className="group relative py-6 border border-[#00FF41] text-[#00FF41] font-mono text-[9px] tracking-widest uppercase overflow-hidden hover:bg-[#00FF41] hover:text-black transition-all" > Run Verification Cycle <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" /> </button>
              </motion.div>
          </div>
      </motion.div>

      <AnimatePresence>
          {mastered && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={onComplete} className="fixed bottom-12 right-12 px-10 py-5 bg-[#00FF41] text-black font-black text-[10px] tracking-widest uppercase z-[450] italic hover:scale-[1.05] transition-all" > Exit Module 1 → </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
