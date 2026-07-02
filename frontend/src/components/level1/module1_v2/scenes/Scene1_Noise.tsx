/**
 * Scene1_Noise.tsx
 * 
 * "Why signals exist" immersive discovery scene.
 * Updated to use Persistent WaveEngine and AudioEngine.
 * Implemented Invisible Guidance: Target Slider Oscillation + Brightness.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveEngine, WaveParameters } from '../engines/WaveEngine';
import { AudioEngine } from '../engines/AudioEngine';
import { SignalVisualizer } from '../shared/SignalVisualizer';
import { InsightBox } from '../shared/InsightBox';

interface Scene1NoiseProps {
  onComplete: () => void;
  engine: WaveEngine;
  audio: AudioEngine;
  points: { x: number; y: number }[];
  params: WaveParameters;
}

export const Scene1_Noise: React.FC<Scene1NoiseProps> = ({ onComplete, engine, audio, points, params }) => {
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);
  
  useEffect(() => {
    // Initial scene settings
    engine.setTarget({ 
        amplitude: 0.6, 
        frequency: 2, 
        phase: 0, 
        type: 'sine', 
        noise: 0.2 
    });

    const resetIdle = () => {
        setIsIdle(false);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => setIsIdle(true), 3000);
    };

    resetIdle();
    window.addEventListener('mousedown', resetIdle);
    window.addEventListener('keydown', resetIdle);

    return () => {
        window.removeEventListener('mousedown', resetIdle);
        window.removeEventListener('keydown', resetIdle);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [engine]);

  const handleNoiseChange = (val: number) => {
    engine.setTarget({ noise: val });
    setPulse(p => p + 1);
    audio.playTick();
  };

  const checkPrediction = (choice: boolean) => {
    // PREDICTION TENSION: Pause + Glow build
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
        }, 1000); // Resume
    }, 80); // Strict 80ms Tension Gap
  };

  return (
    <div className="w-full h-full flex flex-col items-center pointer-events-auto overflow-hidden">
      
      {/* ── TOP: INSIGHT ── */}
      <div className="absolute top-0 w-full flex justify-center py-12 z-20 pointer-events-none">
          <div className="w-full max-w-4xl pointer-events-auto">
            <InsightBox 
                unlocked={prediction === true}
                title="THE_ENTROPY_CRITICAL"
                insight="Signals must be controlled to survive entropy."
                whyItMatters="Unprotected energy is noise. Shielding and control allow us to carry meaningful information."
                engineering="SNR = 10 * log10(P_signal / P_noise) dB."
            />
          </div>
      </div>

      {/* ── CENTER: THE WAVE (Persistent Layer) ── */}
      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full h-full max-w-6xl aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_100px_rgba(0,255,65,0.02)]">
            <SignalVisualizer 
                points={points} 
                params={params} 
                pulseTrigger={pulse} 
                feedback={feedback}
            />
        </div>
      </div>

      {/* ── BOTTOM: UNIFIED CONTROLS + PREDICTION (900ms delay) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 w-full h-[35vh] flex justify-center p-12 z-50 pointer-events-none"
      >
          <div className="w-full max-w-5xl flex gap-16 p-10 border border-white/5 bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
              {/* Controls Column (1200ms activate) */}
              <motion.div 
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex-1 flex flex-col gap-10"
              >
                  <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          <label>Entropy Level</label>
                          <span className="text-[#00FF41]">{(params.noise * 100).toFixed(0)}dB</span>
                      </div>
                      <motion.input 
                        type="range" min="0" max="1" step="0.01" value={params.noise}
                        onChange={(e) => handleNoiseChange(parseFloat(e.target.value))}
                        animate={isIdle && prediction === null ? {
                            scale: [1, 1.01, 1],
                            opacity: [0.4, 0.8, 0.4]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-full accent-[#00FF41] h-px bg-white/10 appearance-none cursor-crosshair transform-gpu translate-z-0"
                      />
                  </div>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
                      Adjust entropy levels to see why raw energy is unsuitable for data transfer. 
                  </p>
              </motion.div>

              {/* Prediction Column (1200ms activate) */}
              <motion.div 
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-[300px] flex flex-col gap-6"
              >
                  <span className="text-[9px] font-mono text-[#00FF41] tracking-widest uppercase italic">Predict_Outcome.exe</span>
                  <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => checkPrediction(true)}
                        disabled={prediction !== null}
                        className={`py-4 border font-mono text-[9px] tracking-widest uppercase transition-all 
                            ${prediction === true ? 'bg-[#00FF41] border-[#00FF41] text-black font-black' : 'border-white/5 hover:border-[#00FF41] text-white/40'}`}
                      >
                          Signal Degrades
                      </button>
                      <button 
                         onClick={() => checkPrediction(false)}
                         disabled={prediction !== null}
                         className={`py-4 border font-mono text-[9px] tracking-widest uppercase transition-all 
                             ${prediction === false ? 'bg-red-500 border-red-500 text-black font-black' : 'border-white/5 hover:border-red-500 text-white/40'}`}
                      >
                          Signal Strengthens
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
                  Deploy Module 1.2 →
              </motion.button>
          )}
      </AnimatePresence>
    </div>
  );
};
