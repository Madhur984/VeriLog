import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Timer, AlertTriangle, Cpu, Ruler, Activity, Zap, Terminal, Sliders, Minimize2, Maximize2 } from 'lucide-react';

import { TechnicalAudit } from '../components/TechnicalAudit';
import { useModule2Audio } from '../hooks/useModule2Audio';

/**
 * S02_Sampling: THE TEMPORAL BLINK (ELITE VERSION)
 * Focus: Sweep-interaction to find the Nyquist Limit.
 * Features: Mouse-controlled Fs vs Fmax, Nyquist Violation Warning, Elite Reticle, Mathematical Manuscript.
 */
export const S02_Sampling: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [targetParams, setTargetParams] = useState({ 
    fs: 0.3, // Sampling Rate Sweep
    fmax: 0.2 // Input Signal Sweep
  });
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Soft Latency Physics
  const springFs = useSpring(0.3, { stiffness: 45, damping: 20 });
  const springFmax = useSpring(0.2, { stiffness: 45, damping: 20 });

  useEffect(() => {
    springFs.set(targetParams.fs);
    springFmax.set(targetParams.fmax);
  }, [targetParams, springFs, springFmax]);

  // --- Audio State (The Blip) ---
  const { createOscillator, createGain, updateGain, updateFreq } = useModule2Audio();

  const resetIdleTimer = () => {
    setIsIdle(false);
    createOscillator('blip-s02', 'sine', 100).connect(createGain('gain-s02', 0));
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 2000);
  };

  const currentFsFactor = springFs.get();
  const currentFmaxFactor = springFmax.get();

  const config = useMemo((): SignalConfig => {
    // Fmax sweep: range 0.2 to 2.5 Hz (scaled internally)
    const fmax = 0.2 + currentFmaxFactor * 2.3;
    // Fs sweep: range 4 to 64 Hz
    const fs = 4 + currentFsFactor * 60;
    
    return {
      frequency: fmax,
      amplitude: 60,
      sampleRate: fs,
      bitDepth: 12, // Focus on temporal precision
      jitter: 0,
      dither: false,
      reconstruction: 'zoh'
    };
  }, [currentFsFactor, currentFmaxFactor]);

  const { analogPoints, samples } = SignalEngine(config, time, 600, 250);

  // Nyquist Check: Note that SignalEngine internal scaled fmax is config.frequency * 5
  const internalFmax = config.frequency * 5;
  const isNyquistViolated = config.sampleRate < 2 * internalFmax;
  const margin = config.sampleRate / (2 * internalFmax);

  // Log Ticker
  const [logIndex, setLogIndex] = useState(0);
  const logs = useMemo(() => [
    `NYQUIST_MARGIN: ${margin.toFixed(2)}x`,
    isNyquistViolated ? "SHANNON_VIOLATION: YES" : "SHANNON_STATUS: OPTIMAL",
    "APERTURE_JITTER: 0.0\u03C3",
    "CLOCK_STABILITY: LOCKED",
    `ALIASING_PROBABILITY: ${isNyquistViolated ? '100%' : '0%'}`
  ], [margin, isNyquistViolated]);

  // Sync audio to sampling parameters
  useEffect(() => {
    if (isIdle) {
        updateGain('gain-s02', 0);
    } else {
        updateGain('gain-s02', isNyquistViolated ? 0.1 : 0.05);
        updateFreq('blip-s02', 40 + (config.sampleRate * 2));
    }
  }, [config.sampleRate, isIdle, isNyquistViolated, updateGain, updateFreq]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const canvasBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32">
      <header className="space-y-6 text-left">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
            Level 02.02 // The Temporal Blink
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          The Catching <span className={accentColor}>Frequency</span>
        </h2>
        <p className={`text-xl leading-relaxed font-medium max-w-2xl ${subTextColor}`}>
            Sampling means measuring the signal’s value at specific moments in time – like a camera taking pictures.
            To see reality correctly, you must "blink" at least twice as fast as it moves.
        </p>
      </header>

      <div className="relative group">
            {/* Interaction Instructions */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute -top-10 left-0 right-0 text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${subTextColor}`}>
                           Move X: Sampling Rate | Move Y: Signal Frequency
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className={`relative h-[620px] w-full rounded-[4rem] border overflow-hidden shadow-2xl transition-all duration-700 ${isIdle ? 'cursor-default' : 'cursor-grabbing'} ${canvasBg}`}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTargetParams({ 
                        fs: (e.clientX - rect.left) / rect.width,
                        fmax: 1 - (e.clientY - rect.top) / rect.height
                    });
                    resetIdleTimer();
                }}
            >
                {/* Accessible Hidden Inputs */}
                <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={targetParams.fs} 
                    onChange={(e) => setTargetParams(p => ({ ...p, fs: parseFloat(e.target.value) }))}
                    className="sr-only" aria-label="Adjust Sampling Rate"
                />
                <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={targetParams.fmax} 
                    onChange={(e) => setTargetParams(p => ({ ...p, fmax: parseFloat(e.target.value) }))}
                    className="sr-only" aria-label="Adjust Signal Frequency"
                />
                {/* LIVE TELEMETRY PANEL */}
                <div className={`absolute top-10 right-10 z-20 p-8 rounded-[2.5rem] border backdrop-blur-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-2xl' : 'bg-white/80 border-gray-100 shadow-xl'}`}>
                    <div className="space-y-6 text-right">
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Sampling Threshold</span>
                            <div className={`text-2xl font-black italic tracking-tighter ${isNyquistViolated ? 'text-red-500' : accentColor}`}>
                                {isNyquistViolated ? 'VIOLATION' : 'OPTIMAL'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Logic Load (f_max)</span>
                            <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{internalFmax.toFixed(1)} <span className="text-xs not-italic opacity-30">Hz</span></div>
                        </div>
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Nyquist Barrier (2f)</span>
                            <div className={`text-xl font-bold tracking-tight opacity-50 ${textColor}`}>{(2 * internalFmax).toFixed(1)} <span className="text-[10px] opacity-30">Hz</span></div>
                        </div>
                        {isNyquistViolated && (
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 justify-end text-red-500 font-black text-[10px] tracking-widest uppercase">
                                <AlertTriangle size={14} /> Aliasing Imminent
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* THE SAMPLING CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        {/* ANALOG REAL */}
                        <path 
                            d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1" strokeOpacity="0.1" 
                        />

                        {/* SAMPLING APERTURE LINES */}
                        {samples.map((p, i) => (
                            <motion.line 
                                key={`line-${i}`} x1={p.x} y1="0" x2={p.x} y2="250"
                                stroke={isNyquistViolated ? '#ef4444' : (isDarkMode ? '#ffffff' : '#000000')}
                                strokeWidth="0.5"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: isNyquistViolated ? [0.1, 0.3, 0.1] : 0.05,
                                    x: isNyquistViolated ? [p.x, p.x + (Math.random() - 0.5) * 2, p.x] : p.x
                                }}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                            />
                        ))}

                        {/* DISCRETE SAMPLES */}
                        {samples.map((p, i) => (
                            <motion.circle 
                                key={`circle-${i}`} cx={p.x} cy={p.y} r={isNyquistViolated ? 3 : 2}
                                fill={isNyquistViolated ? '#ef4444' : strokeColor}
                                style={{ filter: isNyquistViolated ? 'drop-shadow(0 0 10px #ef4444)' : 'none' }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            />
                        ))}
                    </svg>
                </div>

                {/* ELITE CUSTOM CURSOR (Aperture Focus) */}
                <motion.div 
                    className="absolute w-16 h-16 pointer-events-none z-50 flex items-center justify-center"
                    style={{ 
                        left: targetParams.fs * 100 + '%', 
                        top: (1 - targetParams.fmax) * 100 + '%',
                        x: '-50%',
                        y: '-50%'
                    }}
                >
                    <div className="absolute inset-0 border border-orange-500/20 rounded-full" />
                    <div className="absolute inset-2 border-2 border-dashed border-orange-500/10 rounded-full animate-spin-slow" />
                    
                    {/* Tiny Spectrum in reticle */}
                    <div className="w-10 h-10 overflow-hidden flex items-center justify-center opacity-40">
                         <Activity size={24} className={isNyquistViolated ? 'text-red-500' : accentColor} />
                    </div>
                </motion.div>

                {/* System Ticker */}
                <div className={`absolute bottom-6 right-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={accentColor} />
                    <AnimatePresence mode="wait">
                        <motion.span 
                            key={logIndex}
                            initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }}
                            className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}
                        >
                            {logs[logIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.div>
      </div>

      {/* FOOTER: THE NYQUIST CHALLENGE */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
           <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Speed of Information</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    The rule is absolute: **Fs &gt; 2f**. If you sample slower than twice the speed of reality, you don't just lose detail—you create a fake reality (Aliasing). 
                    As you move the mouse up, increase your sampling speed to maintain signal integrity.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100'}`}>
                 <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Shannon's Law</h4>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "If a system is sampled at a rate greater than twice its highest frequency, it can be reconstructed with zero loss."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "The Temporal Blink: Sampling means measuring the signal’s value at specific moments in time. The sampling rate is how many measurements we take per second (measured in Hz).",
              physical: "The Nyquist Rule: To capture a signal without losing information, you must sample at more than twice the highest frequency present in the signal. If your signal has 10 kHz components, you need >20,000 samples/sec.",
              formal: "The Guard Band: In real life, we sample even higher (e.g., 44.1 kHz or 48 kHz). This safety margin accounts for the fact that real-world anti-aliasing filters aren't perfect 'brick walls'.",
              insight: "Spinning Wheel Metaphor: If you film a spinning wheel, you need enough frames per second to see it spin correctly. Too few frames, and the wheel might appear to spin backwards. That's exactly what happens in aliasing.",
              advanced: [
                  {
                      title: "Aperture Jitter",
                      content: "In real hardware, the 'blink' isn't perfectly timed. Tiny variations in clock timing (jitter) create uncertainty in when the sample was taken, effectively converting temporal errors into amplitude noise."
                  },
                  {
                      title: "Shannon's Ideal",
                      content: "Shannon proved that if the signal is band-limited and sampled correctly, it can be reconstructed perfectly using an infinite series of Sinc pulses. Digital isn't 'missing' data—it's just compacting it."
                  }
              ]
          }}
      />

      {/* REMAINDER OF FILE: THE MATHEMATICAL MANUSCRIPT (PRESERVED) */}
      <div className={`mt-32 p-1 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className={`p-16 rounded-[3.4rem] ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
              <div className="max-w-4xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                      <span className={`text-[10px] font-mono font-black uppercase tracking-[0.6em] ${accentColor}`}>Academic Specification</span>
                      <h3 className={`text-5xl font-serif italic tracking-tighter ${textColor}`}>Derivation of the Sampling Theorem</h3>
                      <div className={`w-32 h-0.5 mx-auto ${isDarkMode ? 'bg-white/20' : 'bg-gray-700'}`} />
                  </div>

                  <div className={`font-serif text-[1.1rem] leading-[2.8] text-left p-16 rounded-[2.5rem] ${isDarkMode ? 'bg-black/30 text-white/90' : 'bg-gray-50 text-gray-800'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                          <p>Sampled signal <span className="font-bold">y(t) = x(t) · δ(t)</span></p>
                          <span className="text-xs font-mono opacity-40 italic tracking-widest self-end">...... (1)</span>
                      </div>
                      <p className="mb-6 opacity-70 italic">The trigonometric Fourier series representation of δ(t) is given by:</p>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                          <div className="flex items-center gap-3 translate-x-12">
                             <span className="italic">δ(t) = a₀ + </span>
                             <div className="inline-flex flex-col items-center align-middle mx-2">
                                 <span className="text-[12px] mb-[-4px]">∞</span>
                                 <span className="text-4xl not-italic">Σ</span>
                                 <span className="text-[12px] mt-[-4px]">n=1</span>
                             </div>
                             <span className="italic">(aₙ cos nωₛt + bₙ sin nωₛt)</span>
                          </div>
                      </div>
                      <div className="pt-12 mt-12 border-t border-black/5 dark:border-white/5 space-y-10">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-4 translate-x-12 italic text-orange-500 font-bold bg-orange-500/5 p-6 rounded-2xl">
                             <span>➔ Proof Conclusion: Y(ω) = </span>
                             <div className="inline-flex flex-col items-center align-middle mx-2">
                                 <span className="border-b border-orange-500/30 pb-0.2 px-3">1</span>
                                 <span className="pt-0.2 px-3">Tₛ</span>
                             </div>
                             <div className="inline-flex flex-col items-center align-middle mx-4">
                                  <span className="text-[14px] mb-[-2px]">∞</span>
                                  <span className="text-5xl not-italic font-light">Σ</span>
                                  <span className="text-[14px] mt-[-2px]">n=-∞</span>
                             </div>
                             <span>X(ω - nωₛ)</span>
                          </div>
                      </div>

                      <div className={`mt-20 p-10 rounded-[2.5rem] italic leading-relaxed text-[1rem] ${isDarkMode ? 'bg-orange-500/5 text-white/40' : 'bg-orange-50 text-gray-600'}`}>
                          <p>
                            To reconstruct x(t), we must recover X(ω) from Y(ω). This is possible only when there is **no overlapping** 
                            between the cycles of Y(ω)—the fundamental condition of the Nyquist-Shannon Theorem.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
