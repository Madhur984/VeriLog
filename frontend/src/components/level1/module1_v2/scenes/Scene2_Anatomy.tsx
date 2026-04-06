/**
 * Scene2_Anatomy.tsx
 * 
 * "Signal Anatomy" immersive discovery scene.
 * Updated to use Persistent WaveEngine and AudioEngine.
 * Invisible Guidance: Target Slider Oscillation + Brightness.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';

interface Scene2AnatomyProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene2_Anatomy: React.FC<Scene2AnatomyProps> = ({ onComplete, engine, audio, points, params }) => {
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    // Phase 2: Amplitude & Frequency focus
    engine.setTarget({ amplitude: 0.5, frequency: 2, phase: 0, type: 'sine', noise: 0 });

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

  const handleAmpChange = (val: number) => {
    engine.setTarget({ amplitude: val });
    setPulse(p => p + 1);
    audio.playTick();
  };

  const handleFreqChange = (val: number) => {
    engine.setTarget({ frequency: val });
    setPulse(p => p + 1);
    audio.playTick();
  };

  const checkPrediction = (choice: boolean) => {
    engine.setFrozen(true);
    setTimeout(() => {
        setPrediction(choice);
        const correct = choice === true;
        setFeedback(correct ? 'correct' : 'incorrect');
        if (correct) audio.playSuccess();
        else audio.playError();

        setTimeout(() => {
            engine.setFrozen(false);
            setFeedback(null);
        }, 1000);
    }, 80); // Tension
  };

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      
      {/* ── TOP: INSIGHT ── */}
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox 
                unlocked={prediction === true}
                title="WAVE_GEOMETRY"
                insight="Amplitude is Power. Frequency is Information."
                whyItMatters="High frequency allows more data per second. High amplitude allows data to travel further against noise."
                engineering="λ = v / f (Wavelength is inversely proportional to frequency)."
            />
          </div>
      </div>

      {/* ── CENTER: THE WAVE (Persistent Layer) ── */}
      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer points={points} params={params} pulseTrigger={pulse} feedback={feedback} />
        </div>
      </div>

      {/* ── BOTTOM: UNIFIED CONTROLS (900ms delay) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 w-full h-[35vh] flex justify-center p-12 z-50 pointer-events-none"
      >
          <div className="w-full max-w-5xl flex gap-16 p-10 border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex-1 flex flex-col gap-10"
              >
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>Signal Strength (A)</label>
                          <span className="text-[#00FF41]">{(params.amplitude * 100).toFixed(0)}%</span>
                      </div>
                      <motion.input 
                        type="range" min="0.1" max="1" step="0.01" value={params.amplitude}
                        onChange={(e) => handleAmpChange(parseFloat(e.target.value))}
                        animate={isIdle && prediction === null ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0"
                      />
                  </div>
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>Oscillation Frequency (f)</label>
                          <span className="text-[#00FF41]">{(params.frequency).toFixed(1)}Hz</span>
                      </div>
                      <motion.input 
                        type="range" min="1" max="10" step="0.1" value={params.frequency}
                        onChange={(e) => handleFreqChange(parseFloat(e.target.value))}
                        animate={isIdle && prediction === null ? { scale: [1, 1.01, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0"
                      />
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-[300px] flex flex-col gap-6"
              >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Predict_Outcome.exe</span>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
                      If Frequency doubles, what happens to the density of peaks?
                  </p>
                  <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => checkPrediction(true)}
                        disabled={prediction !== null}
                        className={`py-4 border font-mono text-[8px] tracking-widest uppercase transition-all 
                            ${prediction === true ? 'bg-[#00FF41] text-black font-black' : 'border-white/5 hover:border-[#00FF41] text-white/40'}`}
                      >
                          Density Increases
                      </button>
                      <button 
                         onClick={() => checkPrediction(false)}
                         disabled={prediction !== null}
                         className={`py-4 border font-mono text-[8px] tracking-widest uppercase transition-all 
                             ${prediction === false ? 'bg-red-500 text-black font-black' : 'border-white/5 hover:border-red-500 text-white/40'}`}
                      >
                          Density Decreases
                      </button>
                  </div>
              </motion.div>
          </div>
      </motion.div>

      <AnimatePresence>
          {prediction === true && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                onClick={onComplete}
                className="fixed bottom-12 right-12 px-10 py-5 bg-[#00FF41] text-black font-black text-[10px] tracking-widest uppercase z-[450] italic hover:scale-[1.05] transition-transform"
              >
                  Deploy Module 1.3 →
              </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
