/**
 * Scene5_Interaction.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';

interface Scene5InteractionProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene5_Interaction: React.FC<Scene5InteractionProps> = ({ onComplete, engine, audio, points, params }) => {
  const [phaseB, setPhaseB] = useState(Math.PI); 
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  
  const [pointsB, setPointsB] = useState<{ x: number; y: number }[]>([]);
  const engineBRef = useRef<WaveEngine | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    engine.setTarget({ amplitude: 0.4, frequency: 2, phase: 0, type: 'sine', noise: 0 });
    engineBRef.current = new WaveEngine({ amplitude: 0.4, frequency: 2, phase: Math.PI, type: 'sine', noise: 0 });
    engineBRef.current.start((pts) => { setPointsB(pts); });

    const resetIdle = () => {
        setIsIdle(false);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => setIsIdle(true), 3000);
    };
    resetIdle();
    window.addEventListener('mousedown', resetIdle);

    return () => {
        window.removeEventListener('mousedown', resetIdle);
        engineBRef.current?.stop();
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [engine]);

  const handlePhaseChange = (val: number) => {
    setPhaseB(val);
    engineBRef.current?.setTarget({ phase: val });
    setPulse(p => p + 1);
    audio.playTick();
  };

  const checkPrediction = (choice: string) => {
    engine.setFrozen(true);
    engineBRef.current?.setFrozen(true);
    setTimeout(() => {
        setPrediction(choice);
        const isDestructive = Math.abs((phaseB % (2 * Math.PI)) - Math.PI) < 0.2;
        const isConstructive = Math.abs((phaseB % (2 * Math.PI)) - 0) < 0.2 || Math.abs((phaseB % (2 * Math.PI)) - 2 * Math.PI) < 0.2;
        const correct = (choice === 'amplify' && isConstructive) || (choice === 'cancel' && isDestructive);
        setFeedback(correct ? 'correct' : 'incorrect');

        if (correct) audio.playSuccess();
        else audio.playError();

        setTimeout(() => {
            engine.setFrozen(false);
            engineBRef.current?.setFrozen(false);
            setFeedback(null);
        }, 1000);
    }, 80);
  };

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox unlocked={prediction !== null && feedback === 'correct'} title="WAVE_INTERFERENCE" insight="Energy adds up. Energy cancels out." whyItMatters="ANC targets and removes environmental noise." engineering="Principle of Superposition: y_result = y1 + y2." />
          </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer points={points} secondaryPoints={pointsB} params={params} showSum={true} pulseTrigger={pulse} feedback={feedback} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-0 w-full h-[35vh] flex justify-center p-12 z-50 pointer-events-none" >
          <div className="w-full max-w-5xl flex gap-12 p-10 border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center pointer-events-auto">
              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex-1 flex flex-col gap-10" >
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>Phase Shift (φ)</label>
                          <span className="text-[#00FF41]">{(phaseB / Math.PI).toFixed(1)}π</span>
                      </div>
                      <motion.input type="range" min="0" max={Math.PI * 2} step="0.01" value={phaseB} onChange={(e) => handlePhaseChange(parseFloat(e.target.value))}
                        animate={isIdle && prediction === null ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0" />
                  </div>
              </motion.div>

              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-[350px] flex flex-col gap-6" >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Sync_Prediction.exe</span>
                  <div className="flex flex-col gap-3">
                      {['amplify', 'cancel'].map(choice => (
                          <button key={choice} onClick={() => checkPrediction(choice)} disabled={prediction !== null}
                            className={`py-4 border font-mono text-[8px] tracking-widest uppercase transition-all ${prediction === choice ? 'bg-[#00FF41] text-black font-black' : 'border-white/5 hover:border-[#00FF41] text-white/40'}`} > {choice} </button>
                      ))}
                  </div>
              </motion.div>
          </div>
      </motion.div>

      <AnimatePresence>
          {prediction !== null && feedback === 'correct' && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={onComplete} className="fixed bottom-12 right-12 px-10 py-5 bg-[#00FF41] text-black font-black text-[10px] tracking-widest uppercase z-[450] italic hover:scale-[1.05] transition-all" > Deploy Module 1.6 → </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
