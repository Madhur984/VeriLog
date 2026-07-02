import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Ghost, AlertTriangle, Zap, Terminal, Activity, Sliders, Volume2, Maximize2 } from 'lucide-react';
import { useModule2Audio } from '../hooks/useModule2Audio';
import { TechnicalAudit } from '../components/TechnicalAudit';

/**
 * S03_Aliasing: FREQUENCY GHOSTS (ELITE VERSION)
 * Focus: Folded realities and the cost of slow sampling.
 */
export const S03_Aliasing: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [targetParams, setTargetParams] = useState({ fs: 0.2, fmax: 0.3 });
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Soft Latency Physics
  const springFs = useSpring(0.2, { stiffness: 45, damping: 20 });
  const springFmax = useSpring(0.3, { stiffness: 45, damping: 20 });

  const { createOscillator, createGain, updateGain, updateFreq } = useModule2Audio();

  useEffect(() => {
    springFs.set(targetParams.fs);
    springFmax.set(targetParams.fmax);
  }, [targetParams, springFs, springFmax]);

  const resetIdleTimer = () => {
    setIsIdle(false);
    createOscillator('alias-drone-s03', 'sawtooth', 100).connect(createGain('alias-gain-s03', 0));
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1500);
  };

  const currentFsFactor = springFs.get();
  const currentFmaxFactor = springFmax.get();

  const config = useMemo((): SignalConfig => {
    const fmax = 0.5 + currentFmaxFactor * 4; 
    const fs = 4 + currentFsFactor * 60;
    return {
      frequency: fmax,
      amplitude: 60,
      sampleRate: fs,
      bitDepth: 12,
      jitter: 0,
      dither: false,
      reconstruction: 'sinc'
    };
  }, [currentFsFactor, currentFmaxFactor]);

  const { analogPoints, reconstructedPoints, metrics } = SignalEngine(config, time, 600, 250);

  // Sync Audio to Alias Frequency
  useEffect(() => {
    if (!metrics) return;
    const inputFreq = config.frequency * 5;
    const aliasFreq = Math.abs(inputFreq - Math.floor(inputFreq / config.sampleRate + 0.5) * config.sampleRate);
    const intensity = metrics.aliasing ? 0.05 : 0.01;
    
    updateFreq('alias-drone-s03', 40 + aliasFreq * 20);
    updateGain('alias-gain-s03', isIdle ? 0 : intensity);
    
    // Elite Upgrade: Resonance shimmer based on folding closeness
    const foldingRatio = (config.frequency * 2) / config.sampleRate;
    updateGain('alias-shimmer-s03', isIdle || !metrics.aliasing ? 0 : Math.min(0.02, foldingRatio * 0.01));
  }, [metrics.aliasing, config.frequency, config.sampleRate, isIdle, updateFreq, updateGain]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const canvasBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-gray-50 border-gray-200';

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-red-50 border-red-200 text-red-600'}`}>
            Level 02.03 // Frequency Ghosts
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          Frequency <span className="text-red-500">Ghosts</span>
        </h2>
        <p className={`text-xl font-medium max-w-2xl ${subTextColor}`}>
            If you sample too slowly, high-speed signals "fold" back into lower frequencies. They pretend to be something they are not. This is **Aliasing**.
        </p>
      </header>

      <div className="relative group">
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute -top-10 left-0 right-0 text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${subTextColor}`}>
                           Sweep X: Sampling Speed | Sweep Y: Signal Velocity
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
                {/* ALIAS REPORT PANEL */}
                <div className={`absolute top-10 left-10 z-20 p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-bg-elev border-white/5 shadow-neo' : 'bg-white border-gray-100 shadow-neo'}`}>
                    <div className="space-y-6">
                        <div className="space-y-1" role="alert" aria-live="polite">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Anomaly Detection</span>
                            <div className={`text-2xl font-black italic tracking-tighter ${metrics.aliasing ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                {metrics.aliasing ? 'CRITICAL: ALIASING' : 'SIGNAL INTEGRITY: LOCKED'}
                            </div>
                        </div>
                        {metrics.aliasing && (
                            <button 
                                onClick={() => setTargetParams(p => ({ ...p, fs: Math.min(1, p.fmax * 2.2) }))}
                                className={`w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-green-500/10 border-green-500/40 text-green-500 hover:bg-green-500/20' : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'}`}
                            >
                                Fix Nyquist Violation
                            </button>
                        )}
                        <div className="flex gap-10">
                            <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Sample Supply</span>
                                <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{config.sampleRate.toFixed(1)} <span className="text-xs not-italic opacity-30">Hz</span></div>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Digital Representation</span>
                                <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{(config.frequency * 5).toFixed(1)} <span className="text-xs not-italic opacity-30">Hz</span></div>
                            </div>
                        </div>

                        {/* SPECTRAL FOLDING VISUALIZER */}
                        <div className="space-y-2 pt-2">
                             <div className="flex justify-between items-center text-[8px] font-mono opacity-30 uppercase tracking-widest">
                                 <span>0</span>
                                 <span>Nyquist Limit</span>
                             </div>
                             <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                 <motion.div 
                                    className={`h-full ${metrics.aliasing ? 'bg-red-500' : 'bg-green-500'}`}
                                    animate={{ 
                                        width: `${Math.min(100, (config.frequency * 10 / config.sampleRate) * 100)}%`,
                                        opacity: metrics.aliasing ? [0.4, 1, 0.4] : 1
                                    }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                 />
                             </div>
                        </div>
                    </div>
                </div>

                {/* THE GHOST CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className={`absolute inset-0 opacity-[0.02] flex items-center justify-center ${metrics.aliasing ? 'animate-pulse' : ''}`}>
                         <div className={`w-[80%] h-[80%] border-x-4 border-dashed ${isDarkMode ? 'border-red-500' : 'border-red-600'}`} />
                     </div>

                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        <path 
                            d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={metrics.aliasing ? '#ef4444' : (isDarkMode ? 'white' : 'black')} 
                            strokeWidth="1.5" 
                            strokeOpacity={metrics.aliasing ? "0.2" : "0.05"} 
                        />
                        
                        {/* THE IMPOSTER WAVE (ALIASES) */}
                        <AnimatePresence>
                            {metrics.aliasing && (
                                <motion.path 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                                    fill="none" stroke="#ef4444" strokeWidth="6" strokeOpacity="0.05"
                                />
                            )}
                        </AnimatePresence>

                        <motion.path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={metrics.aliasing ? '#ef4444' : strokeColor} 
                            strokeWidth="4"
                            style={{ 
                                filter: metrics.aliasing ? 'drop-shadow(0 0 20px rgba(239,68,68,0.3))' : (isDarkMode ? `drop-shadow(0 0 15px ${strokeColor}44)` : 'none'),
                            }}
                            animate={metrics.aliasing ? { opacity: [1, 0.6, 1], strokeWidth: [4, 5, 4] } : {}}
                            transition={{ repeat: Infinity, duration: 0.15 }}
                        />
                    </svg>
                </div>

                {/* BIG GHOST WATERMARK */}
                <AnimatePresence>
                    {metrics.aliasing && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-red-500/5 pointer-events-none"
                        >
                            <span className="text-[200px] font-black italic text-red-500/[0.04] tracking-tighter select-none rotate-[-5deg]">GHOST</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ELITE CUSTOM CURSOR */}
                <motion.div 
                    className="absolute w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
                    style={{ 
                        left: targetParams.fs * 100 + '%', 
                        top: (1 - targetParams.fmax) * 100 + '%',
                        x: '-50%',
                        y: '-50%'
                    }}
                >
                    <div className={`absolute inset-0 border rounded-xl rotate-45 transition-colors ${metrics.aliasing ? 'border-red-500 animate-ping' : 'border-orange-500/30'}`} />
                    <div className="w-10 h-10 overflow-hidden flex items-center justify-center opacity-40">
                         {metrics.aliasing ? <Ghost size={24} className="text-red-500" /> : <Activity size={24} className={accentColor} />}
                    </div>
                </motion.div>

                {/* System Ticker */}
                <div className={`absolute bottom-6 left-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={metrics.aliasing ? 'text-red-500' : accentColor} />
                    <span className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}>
                       {metrics.aliasing ? 'WARNING: FREQUENCY_FOLDING_DETECTED' : 'DOMAIN_STABILITY: LOCKED'} | MARGIN: {(config.sampleRate / (config.frequency * 10)).toFixed(2)}x
                    </span>
                </div>
            </motion.div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
           <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-red-500 pl-6 ${textColor}`}>The Imposter Wave</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    When the signal speed exceeds the sampling threshold, a "Ghost" wave appears. This imposter is the result of irreversible information loss. In real life, this can make car wheels appear to spin backwards on camera.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-red-500/5 border-red-500/10 shadow-inner' : 'bg-red-50 border-red-100'}`}>
                 <h4 className={`text-[10px] font-black uppercase tracking-widest text-red-500`}>Aha! Moment</h4>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "If you sample a 21 kHz signal at 40 kHz, it doesn't disappear; <br/>
                    it becomes a perfect 19 kHz wave that sounds exactly like a real one."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Frequency Ghosts: If you sample too slowly, high frequencies 'pretend' to be low frequencies. This creates false signals that weren’t there.",
              physical: "Permanent Damage: Once aliasing happens, you cannot fix it. The data is fundamentally corrupted. The high frequency energy has 'folded' into a lower band.",
              formal: "Nyquist Rate: You must sample at more than twice the signal's frequency (Fs > 2f) to keep the ghosts away.",
              insight: "The Anti-Aliasing Filter: To prevent this, engineers use a filter to 'cut off' high frequencies before they reach the sampler. It's better to lose some treble than to gain a ghost.",
              advanced: [
                  {
                      title: "Spectral Folding",
                      content: "Aliasing isn't random; it's predictable mirroring. Frequencies wrap around the Nyquist limit like paper being folded. A 22kHz signal sampled at 40kHz appears exactly at 18kHz."
                  },
                  {
                      title: "In-Band Interference",
                      content: "Unlike quantization noise, which is broad, aliasing is highly tonal and destructive. It creates discordant artifacts that cannot be removed by post-processing filters once captured."
                  }
              ]
          }}
      />
    </div>
  );
};
