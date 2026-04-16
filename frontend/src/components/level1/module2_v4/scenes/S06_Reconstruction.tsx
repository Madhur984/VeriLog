import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Activity, Zap, Terminal, Activity as WaveIcon, Layers, Sliders, Volume2, ShieldCheck } from 'lucide-react';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { useModule2Audio } from '../hooks/useModule2Audio';

/**
 * S06_Reconstruction: THE FINAL BRIDGE (ELITE VERSION)
 * Focus: Turning dots back into liquid reality.
 * Features: Sinc ripple interaction, Mirror ghosting, Liquid audio transitions.
 */
export const S06_Reconstruction: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [method, setMethod] = useState<'zoh' | 'sinc'>('zoh');
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Audio State (The Snap vs. The Flow) ---
  const { createOscillator, createGain, updateGain } = useModule2Audio();

  const initAudio = () => {
    // ZOH Clicks (Step Transitions)
    createOscillator('click-s06', 'square', 20).connect(createGain('click-gain-s06', 0));
    // Sinc Flow (Pure Tone)
    createOscillator('flow-s06', 'sine', 440).connect(createGain('flow-gain-s06', 0));
  };

  const resetIdleTimer = () => {
    setIsIdle(false);
    initAudio();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1500);
  };

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 20,
    bitDepth: 8,
    reconstruction: method
  }), [method]);

  const { analogPoints, reconstructedPoints, samples } = SignalEngine(config, time, 600, 250);

  // Audio Sync
  useEffect(() => {
    if (isIdle) {
        updateGain('click-gain-s06', 0);
        updateGain('flow-gain-s06', 0);
    } else {
        updateGain('click-gain-s06', method === 'zoh' ? 0.05 : 0);
        updateGain('flow-gain-s06', method === 'sinc' ? 0.1 : 0);
    }
  }, [method, isIdle, updateGain]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const canvasBg = isDarkMode ? 'bg-black/60 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-xl';

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
            Level 02.06 // The Final Bridge
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          Recovering <span className={accentColor}>Reality</span>
        </h2>
        <p className={`text-xl font-medium max-w-2xl ${subTextColor}`}>
            Samples are just frozen dots. To turn them back into liquid sound, we must fill the gaps. This is the miracle of **Reconstruction Filtering**.
        </p>
      </header>

      <div className="relative group">
            {/* Interaction Instruction */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute -top-10 left-0 right-0 text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${subTextColor}`}>
                           Switch to 'Sinc' to see the Mathematical Weave
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div 
                className={`relative h-[580px] w-full rounded-[4rem] border overflow-hidden cursor-none shadow-2xl transition-all duration-700 ${canvasBg}`}
                onMouseMove={() => resetIdleTimer()}
            >
                {/* RECONSTRUCTION CONTROL PANEL */}
                <div className={`absolute top-10 left-10 z-20 p-8 rounded-[3.5rem] border backdrop-blur-3xl transition-all ${isDarkMode ? 'bg-black/60 border-white/10 shadow-2xl' : 'bg-white/90 border-gray-200 shadow-xl'}`}>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Materialization Algorithm</span>
                            <div className={`text-2xl font-black italic tracking-tighter transition-colors ${method === 'sinc' ? accentColor : textColor}`}>
                                {method === 'zoh' ? 'STAIRCASE (ZOH)' : 'LIQUID (SINC)'}
                            </div>
                        </div>
                        <div className={`flex p-1.5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200 shadow-inner'}`}>
                            {[
                                { id: 'zoh', label: 'Staircase ZOH', aria: 'Zero-Order Hold Reconstruction' },
                                { id: 'sinc', label: 'Liquid SINC', aria: 'Mathematical Sinc Interpolation' }
                            ].map((m) => (
                                <button 
                                    key={m.id} onClick={() => { setMethod(m.id as any); initAudio(); }}
                                    aria-pressed={method === m.id}
                                    aria-label={m.aria}
                                    className={`flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === m.id ? 'bg-orange-500 text-white shadow-lg' : 'opacity-30 hover:opacity-100'}`}
                                >
                                    {m.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* THE RECONSTRUCTION CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Imaging Artifact Decoration (Low opacity ghosts) */}
                    <AnimatePresence>
                        {method === 'zoh' && (
                            <motion.svg 
                                initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 w-full h-full scale-[1.2] rotate-3"
                            >
                                <path d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="1" />
                            </motion.svg>
                        )}
                    </AnimatePresence>

                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        {/* Analog Ghost (Desired Path) */}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="1.5" strokeDasharray="4 4" />
                        
                        {/* THE MIRRORED IMAGES (Harmonic Artifacts in ZOH) */}
                        <AnimatePresence>
                            {method === 'zoh' && (
                                <motion.path 
                                    initial={{ opacity: 0 }} 
                                    animate={{ 
                                        opacity: [0.05, 0.1, 0.05],
                                        y: [-2, 2, -2]
                                    }} 
                                    exit={{ opacity: 0 }}
                                    d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y - 10}`).join(' ')} 
                                    fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2"
                                />
                            )}
                        </AnimatePresence>

                        {/* SINC PULSE SUMMATION (The "Weave") */}
                        <AnimatePresence>
                            {method === 'sinc' && samples.map((p, i) => (
                                <motion.path 
                                    key={`sinc-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.05 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.01 }}
                                    d={Array.from({ length: 40 }).map((_, j) => {
                                        const px = p.x + (j - 20) * 10;
                                        const dx = (px - p.x) / 10;
                                        const sinc = dx === 0 ? 1 : Math.sin(Math.PI * dx) / (Math.PI * dx);
                                        const py = 125 + (p.y - 125) * sinc;
                                        return `${j === 0 ? 'M' : 'L'}${px},${py}`;
                                    }).join(' ')}
                                    fill="none" stroke={strokeColor} strokeWidth="1"
                                />
                            ))}
                        </AnimatePresence>
                        
                        {/* Result Path */}
                        <motion.path 
                            layout
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
                            style={{ filter: method === 'sinc' ? `drop-shadow(0 0 20px ${strokeColor}66)` : 'none' }}
                            animate={{ strokeWidth: method === 'sinc' ? 6 : 5 }}
                        />

                        {/* Samples (The Anchors) */}
                        {samples.map((p, i) => (
                            <motion.circle 
                                key={i} cx={p.x} cy={p.y} r="3.5" 
                                fill={textColor} 
                                initial={{ fillOpacity: 0.2 }}
                                animate={{ 
                                    fillOpacity: method === 'sinc' ? 0.6 : 0.2,
                                    r: method === 'sinc' ? 4 : 3.5
                                }} 
                            />
                        ))}
                    </svg>
                </div>

                {/* ELITE CUSTOM CURSOR */}
                <motion.div 
                    className="absolute w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
                    style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
                >
                    <div className={`absolute inset-0 border border-orange-500/30 rounded-lg ${method === 'sinc' ? 'animate-spin-slow' : 'rotate-45'}`} />
                    <WaveIcon size={20} className={method === 'sinc' ? 'text-orange-500 animate-pulse' : 'text-orange-500/40'} />
                </motion.div>

                {/* Telemetry Ticker */}
                <div className={`absolute bottom-10 left-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={accentColor} />
                    <span className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}>
                       RECONSTRUCTION: {method.toUpperCase()} | IMAGE_ARTIFACTS: {method === 'zoh' ? 'DETECTED' : 'SUPPRESSED'} | SINC_INTEGRITY: 100%
                    </span>
                </div>
            </div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
           <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Weaving Effect</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    In **Liquid (Sinc) Mode**, we aren't just connecting dots; we are performing a "Mathematical Weave." We remove the sharp high-frequency corners of the staircase and leave behind the pure fundamental wave. This is how your computer recovers high-fidelity audio.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100'}`}>
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-orange-500" />
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Aha! Moment</h4>
                 </div>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "If you follow the Nyquist rule correctly, the 'Liquid' mode isn't a guess—it is the one and only original wave that perfectly fits those dots."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Connecting the Dots: After digital processing, the signal must be turned back into a smooth analog waveform. A reconstruction filter (low-pass) removes the staircase steps and imaging artifacts (high-frequency mirrors).",
              physical: "The Mirror Effect: The 'Snap' staircase contains mathematical mirrors of the signal at frequencies centered around multiples of the sample rate. An analog filter removes these mirrors to recover nature.",
              formal: "Sinc Interpolation: The ideal reconstruction filter is the Whittaker-Shannon interpolation formula. It uses Sinc pulses to perform a weighted summation that perfectly recovers the original signal.",
              insight: "Phase Delay: Real-world filters aren't instantaneous; they introduce phase shift and group delay. Achieving a perfectly flat phase while maintaining a steep filter 'roll-off' is a major engineering trade-off.",
              advanced: [
                  {
                      title: "Gibbs Phenomenon",
                      content: "Perfect 'brick-wall' filters cause ringing artifacts at sharp edges (discontinuities). This phenomenon explains why audio with high-frequency content might 'shimmer' near the limit of the system."
                  },
                  {
                      title: "Transition Band Width",
                      content: "The region between the passband and stopband is the transition band. A narrower band requires a higher-order filter (more complex circuitry), driving up cost and power consumption."
                  }
              ]
          }}
      />
    </div>
  );
};
