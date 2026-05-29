import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Zap, ShieldCheck, Activity, Terminal, Waves, Volume2, Maximize2 } from 'lucide-react';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { useModule2Audio } from '../hooks/useModule2Audio';

/**
 * S05_Dither: THE NOISE CURE (ELITE VERSION)
 * Focus: Using noise to fix distortion.
 * Features: Manual 'Shake' interaction, Buzz vs. Hiss Audio, Particle-based noise visualization.
 */
export const S05_Dither: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [ditherEnabled, setDitherEnabled] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<any>(null);

  // --- Audio State (Buzz vs. Hiss) ---
  const { createOscillator, createGain, updateGain } = useModule2Audio();

  const initAudio = () => {
    // Harmonic Buzz (Correlated Distortion)
    createOscillator('buzz-s05', 'sawtooth', 55).connect(createGain('buzz-gain-s05', 0));
    // White Noise Simulation (Hollow Square Cluster)
    createOscillator('hiss-s05', 'square', 1000).connect(createGain('hiss-gain-s05', 0));
  };

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
        setIsIdle(true);
        setShakeIntensity(0);
    }, 1500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Mouse X/Y behavior for Dither doesn't exist yet, we only care about shake
    setShakeIntensity(prev => Math.min(prev + (Math.abs(e.movementX) + Math.abs(e.movementY)) * 0.1, 100));
    resetIdleTimer();
  };

  const config = useMemo((): SignalConfig => ({
    frequency: 0.5,
    amplitude: 15, // Low amplitude to make quantization visible
    sampleRate: 48,
    bitDepth: 3, 
    jitter: ditherEnabled ? 0.2 : 0, 
    dither: ditherEnabled,
    reconstruction: 'zoh'
  }), [ditherEnabled]);

  const { analogPoints, reconstructedPoints, metrics, samples } = SignalEngine(config, time, 600, 250);

  // Audio Sync: Transition Buzz -> Hiss
  // Sync audio to quantization state
  useEffect(() => {
    updateGain('gain-s05', ditherEnabled ? 0.05 : 0);
  }, [ditherEnabled, updateGain]);

  // Accessibility: Keyboard trigger for "Shake"
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') setDitherEnabled(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const canvasBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100';


  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32">
      <header className="space-y-6 text-left">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
            Level 02.05 // The Noise Cure
        </div>
        <div className="space-y-4">
            <h2 className={`text-6xl font-black italic tracking-tighter leading-tight ${textColor}`}>
              Grainy <span className={accentColor}>Truth</span>
            </h2>
            <p className={`text-xl leading-relaxed font-bold tracking-tight opacity-70 ${textColor}`}>
              Dither is intentional noise that reveals detail hidden below the steps.
            </p>
        </div>
      </header>

      <div className="relative group">
            {/* Interaction Instructions */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute -top-10 left-0 right-0 text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                           Shake mouse rapidly to randomize errors (Dither)
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className={`relative h-[580px] w-full rounded-[4rem] border overflow-hidden shadow-2xl transition-all duration-700 ${isIdle ? 'cursor-default' : 'cursor-grabbing'} ${canvasBg}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsIdle(false)}
                onMouseLeave={() => setIsIdle(true)}
            >
                {/* Accessible Input */}
                <input 
                    type="checkbox"
                    checked={ditherEnabled}
                    onChange={(e) => setDitherEnabled(e.target.checked)}
                    className="sr-only"
                    aria-label="Toggle Dither"
                />

                {/* DITHER STATUS CONTROL */}
                <div className={`absolute top-10 left-10 z-20 p-8 rounded-[2.5rem] border backdrop-blur-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-2xl' : 'bg-white/80 border-gray-100 shadow-xl'}`}>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Harmonic State</span>
                            <div className={`text-2xl font-black italic tracking-tighter ${ditherEnabled ? 'text-green-500' : 'text-red-500'}`}>
                                {ditherEnabled ? 'LINEARIZED' : 'HARMONIC DISTORTION'}
                            </div>
                        </div>
                        <button 
                            onClick={() => setDitherEnabled(!ditherEnabled)}
                            aria-pressed={ditherEnabled}
                            aria-label="Toggle Dither"
                            className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${ditherEnabled ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                        >
                            <Zap size={16} fill={ditherEnabled ? 'white' : 'none'} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {ditherEnabled ? 'DITHER ACTIVE' : 'SHAKE TO DITHER [S]'}
                            </span>
                        </button>
                        
                        {/* LSB SHIMMER HUD */}
                        <div className="flex items-center gap-2 pt-2">
                             <div className="flex gap-1">
                                 {[1, 0, 1, 0, 1].map((b, i) => (
                                     <motion.div 
                                        key={i} 
                                        className={`w-2 h-3 rounded-sm ${b ? 'bg-orange-500/40' : 'bg-white/5'}`}
                                        animate={ditherEnabled ? { opacity: [0.2, 1, 0.2], backgroundColor: ["#f97316", "#ffffff", "#f97316"] } : {}}
                                        transition={{ repeat: Infinity, duration: 0.1 * (i + 1) }}
                                     />
                                 ))}
                             </div>
                             <span className={`text-[8px] font-mono uppercase tracking-widest opacity-30 ${textColor}`}>LSB Activity</span>
                        </div>
                    </div>
                </div>

                {/* THE DITHER CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {/* Floating Noise Particles */}
                     <AnimatePresence>
                        {ditherEnabled && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        className={`absolute w-1 h-1 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-orange-400/40'}`}
                                        style={{ 
                                            left: `${Math.random() * 100}%`, 
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{ 
                                            x: [0, (Math.random() - 0.5) * 40, 0],
                                            y: [0, (Math.random() - 0.5) * 40, 0],
                                            opacity: [0, 0.8, 0],
                                        }}
                                        transition={{ repeat: Infinity, duration: 0.2 + Math.random() * 0.5 }}
                                    />
                                ))}
                            </div>
                        )}
                     </AnimatePresence>

                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        {/* Analog Reference */}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'} strokeWidth="1.5" strokeDasharray="4 4" />
                        
                        {/* Reconstructed Path */}
                        <motion.path 
                            animate={ditherEnabled ? { 
                                transform: ["translateY(-2px)", "translateY(2px)", "translateY(-1px)", "translateY(1px)", "translateY(0px)"],
                                strokeOpacity: [1, 0.8, 1]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={ditherEnabled ? strokeColor : (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')} 
                            strokeWidth="5" strokeLinecap="round"
                            style={{ filter: ditherEnabled ? `drop-shadow(0 0 15px ${strokeColor}66)` : 'none' }}
                        />
                    </svg>
                </div>

                {/* ELITE CUSTOM CURSOR (The Shaker) */}
                <motion.div 
                    className="absolute w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
                    style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
                    animate={{ rotate: shakeIntensity * 2 }}
                >
                    <div className="absolute inset-0 border border-orange-500/30 rounded-full" />
                    <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center backdrop-blur-md border border-orange-500/20">
                         <Waves size={16} className={accentColor} />
                    </div>
                </motion.div>

                {/* Telemetry Ticker */}
                <div className={`absolute bottom-10 left-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={accentColor} />
                    <span className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}>
                       SPECTRAL_NOISE: {ditherEnabled ? 'UNCORRELATED' : 'CORRELATED'} | LSB_SHIMMER: {ditherEnabled ? 'ACTIVE' : 'IDLE'} | ENB: {metrics.enob.toFixed(2)}
                    </span>
                </div>
            </motion.div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
           <div className="space-y-6 text-left">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Digital Shimmer</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    Without dither, quiet sounds get "stuck" between levels, becoming a harsh metallic buzz. 
                    By adding a tiny bit of random noise (the orange shimmer), you keep the signal 
                    moving constantly. This allows the computer to record sounds that are theoretically "between" the steps.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100'}`}>
                 <div className="flex items-center gap-3">
                    <Volume2 size={14} className="text-orange-500" />
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Aha! Moment</h4>
                 </div>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "Dither is like adding a little white noise to 'shake the bits free' - the result is a smooth hiss instead of harsh crackles."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "The Noise Cure: Low-bit signals sound harsh because the rounding creates harmonic distortion (correlated noise). Dither decorrelates that distortion, turning it into a benign, linear noise floor.",
              physical: "Shaking the Bits: Dither doesn’t reduce the total noise - it actually increases it slightly. But it makes the noise sound much more pleasant and natural, effectively 'linearizing' the quantization steps.",
              formal: "Optimal Dither: In professional audio, TPDF (Triangular Probability Density Function) dither is the gold standard. It ensures the first and second moments of the quantization error are independent of the signal.",
              insight: "Grainy Truth: Dither turns a 'jagged lie' into a 'grainy truth'. It is mandatory whenever you reduce bit depth (e.g., from 32-bit float to 24-bit PCM) to maintain signal transparency.",
              advanced: [
                  {
                      title: "TPDF vs. RPDF",
                      content: "Rectangular Dither (RPDF) only spreads noise, but still leaves some signal correlation. Triangular Dither (TPDF) completely eliminates signal-dependent modulation of the noise floor."
                  },
                  {
                      title: "Psychoacoustic Noise Shaping",
                      content: "Advanced dither kernels don't just add flat noise; they 'shape' the noise into frequencies where the human ear is least sensitive (above 15kHz), achieving perceived 18-bit performance on a 16-bit channel."
                  }
              ]
          }}
      />
    </div>
  );
};
