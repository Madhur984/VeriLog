/**
 * Scene3_Types.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters, WaveType } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';

interface Scene3TypesProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene3_Types: React.FC<Scene3TypesProps> = ({ onComplete, engine, audio, points, params }) => {
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [prediction, setPrediction] = useState<WaveType | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    engine.setTarget({ amplitude: 0.7, frequency: 3, phase: 0, type: 'sine', noise: 0 });
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

  const handleTypeChange = (t: WaveType) => {
    engine.setTarget({ type: t });
    setPulse(p => p + 1);
    audio.playTick();
  };

  const checkPrediction = (choice: WaveType) => {
    engine.setFrozen(true);
    setTimeout(() => {
        setPrediction(choice);
        const correct = choice === 'square' || choice === 'pulse';
        setIsCorrect(correct);
        setFeedback(correct ? 'correct' : 'incorrect');
        if (correct) audio.playSuccess();
        else audio.playError();
        setTimeout(() => {
            engine.setFrozen(false);
            setFeedback(null);
        }, 1000);
    }, 80);
  };

  const types: WaveType[] = ['sine', 'square', 'triangle', 'pulse'];

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox unlocked={isCorrect} title="WAVE_MORPHOLOGY" insight="Morphology determines data integrity." whyItMatters="Square waves are used in logic because they represent binary states." engineering="Binary data is physically a sequence of voltage transitions." />
          </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer points={points} params={params} pulseTrigger={pulse} feedback={feedback} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-0 w-full h-[35vh] flex justify-center p-12 z-50 pointer-events-none" >
          <div className="w-full max-w-5xl flex gap-12 p-10 border border-white/5 bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center pointer-events-auto">
              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex-1 grid grid-cols-2 gap-4" >
                  {types.map(t => (
                      <motion.button key={t} onClick={() => handleTypeChange(t)}
                        animate={isIdle && prediction === null && t === 'square' ? { scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`py-5 border font-mono text-[9px] tracking-widest uppercase transition-all ${params.type === t ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/40 text-white/60'}`} >
                          {t}
                      </motion.button>
                  ))}
              </motion.div>

              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="w-[350px] flex flex-col gap-6" >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Predict_Outcome.exe</span>
                  <div className="flex flex-col gap-3">
                      {['square', 'sine'].map(choice => (
                          <button key={choice} onClick={() => checkPrediction(choice as any)} disabled={prediction !== null}
                            className={`py-4 border font-mono text-[8px] tracking-widest uppercase transition-all ${prediction === choice ? 'bg-[#00FF41] text-black font-black' : 'border-white/5 hover:border-[#00FF41] text-white/40'}`} >
                              {choice}
                          </button>
                      ))}
                  </div>
              </motion.div>
          </div>
      </motion.div>

      <AnimatePresence>
          {isCorrect && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={onComplete} className="fixed bottom-12 right-12 px-10 py-5 bg-[#00FF41] text-black font-black text-[10px] tracking-widest uppercase z-[450] italic hover:scale-[1.05] transition-all" > Deploy Module 1.4 → </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
