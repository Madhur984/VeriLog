import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Activity, Binary, AlertTriangle, Cpu, Ruler, Eye, MousePointer2, Zap, Sliders, Terminal, Volume2, Layers } from 'lucide-react';

import { TechnicalAudit } from '../components/TechnicalAudit';

/**
 * S01_AnalogVsDigital: THE GREAT DIVIDE (ULTRA-ELITE VERSION)
 * Focus: Reality vs Approximation Conflict.
 * Features: Bit-Crusher Audio, Differential View, Harmonic Shadows, Step Sparks.
 */
import { useModule2Audio } from '../hooks/useModule2Audio';


export const S01_AnalogVsDigital: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [targetParams, setTargetParams] = useState({ fs: 0.2, bits: 0.3 });
  const [isIdle, setIsIdle] = useState(true);
  const [viewMode, setViewMode] = useState<'overlay' | 'error'>('overlay');
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Audio State (Elite Layer) ---
  const { createOscillator, createGain, updateGain, updateFreq } = useModule2Audio();

  // Soft Latency Physics
  const springFs = useSpring(0.2, { stiffness: 45, damping: 20 });
  const springBits = useSpring(0.3, { stiffness: 45, damping: 20 });

  useEffect(() => {
    springFs.set(targetParams.fs);
    springBits.set(targetParams.bits);
  }, [targetParams, springFs, springBits]);

  const resetIdleTimer = () => {
    setIsIdle(false);
    createOscillator('drone-s01', 'sine', 40).connect(createGain('crush-s01', 0));
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1500);
  };

  const currentFs = springFs.get();
  const currentBits = springBits.get();

  const config = useMemo((): SignalConfig => ({
    frequency: 1, 
    amplitude: 50,
    sampleRate: Math.max(2, 4 + currentFs * 60), 
    bitDepth: Math.max(1, 1 + Math.floor(currentBits * 11)),
    jitter: 0, 
    dither: false,
    reconstruction: 'zoh'
  }), [currentFs, currentBits]);

  const { analogPoints, reconstructedPoints } = SignalEngine(config, time, 600, 250);

  // Visceral Error Metric
  const errorMagnitude = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 200; i++) {
        sum += Math.abs(analogPoints[i].y - reconstructedPoints[i].y);
    }
    return Math.min(100, (sum / 200) * 1.5);
  }, [analogPoints, reconstructedPoints]);

  const signalLost = errorMagnitude > 40;
  
  // Real-time SNR (approximation)
  const snr = useMemo(() => {
    return (6.02 * Math.floor(targetParams.bits * 11 + 1) + 1.76).toFixed(1);
  }, [targetParams.bits]);

  // sync audio to parameters
  useEffect(() => {
    const bits = springBits.get();
    const crushVol = isIdle ? 0 : (1.0 - bits) / 5.0;
    updateGain('crush-s01', crushVol);
  }, [springBits, isIdle, updateGain]);

  const fs = useTransform(springFs, [0, 1], [4, 64]);
  const bits = useTransform(springBits, [0, 1], [1, 12]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const canvasBg = isDarkMode ? 'bg-black/80 border-white/5' : 'bg-gray-50 border-gray-200';

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32">
      <header className="space-y-4 text-left">
           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                Level 02.01 // The Great Divide
            </div>
            <motion.div className="space-y-4">
                <h1 className={`text-7xl font-black italic tracking-tighter leading-tight ${textColor}`}>
                  Nature <span className="opacity-20">vs</span> <span className={accentColor}>Numbers</span>
                </h1>
                <p className={`text-2xl leading-relaxed font-bold tracking-tight ${textColor}`}>
                    The staircase is not the original smooth wave.
                </p>
                <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
                    Think of it like this: Drawing a circle with a pen is smooth. Drawing it with tiny straight lines (like a polygon) is digital.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setViewMode('overlay')}
                        aria-pressed={viewMode === 'overlay'}
                        aria-label="Overlaid View"
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'overlay' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-transparent border-white/20 text-white/40 hover:bg-white/10'}`}
                    >
                        <Layers size={10} /> Overlaid
                    </button>
                    <button 
                        onClick={() => setViewMode('error')}
                        aria-pressed={viewMode === 'error'}
                        aria-label="Differential View"
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'error' ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-white/20 text-white/40 hover:bg-white/10'}`}
                    >
                        <AlertTriangle size={10} /> Differential View
                    </button>
                </div>
            </motion.div>
      </header>

      <div className="relative group">
            <div 
                className={`relative h-[640px] w-full rounded-[4rem] border overflow-hidden shadow-2xl transition-all duration-700 ${isIdle ? 'cursor-default' : 'cursor-grabbing'} ${canvasBg}`}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTargetParams({ 
                        fs: (e.clientX - rect.left) / rect.width,
                        bits: 1 - (e.clientY - rect.top) / rect.height
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
                    value={targetParams.bits} 
                    onChange={(e) => setTargetParams(p => ({ ...p, bits: parseFloat(e.target.value) }))}
                    className="sr-only" aria-label="Adjust Bit Depth"
                />
                {/* STATUS PANEL */}
                <div className={`absolute top-10 left-10 z-20 p-8 rounded-[2.5rem] border backdrop-blur-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-2xl' : 'bg-white/80 border-gray-100'}`}>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Approximation Error</span>
                            <div className={`text-2xl font-black italic tracking-tighter ${errorMagnitude > 30 ? 'text-red-500' : accentColor}`}>
                                {errorMagnitude.toFixed(2)}<span className="text-xs font-mono not-italic uppercase ml-2">% Loss</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <div className={`h-1 w-48 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                <motion.div className={`h-full ${errorMagnitude > 30 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-orange-500'}`} animate={{ width: `${errorMagnitude}%` }} />
                             </div>
                        </div>
                        <div className="flex gap-8">
                             <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Signal-to-Noise</span>
                                <div className={`text-xl font-black italic tracking-tighter ${textColor}`}>{snr} <span className="text-[10px] not-italic opacity-30">dB</span></div>
                             </div>
                             <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Bit Horizon</span>
                                <div className={`text-xl font-black italic tracking-tighter ${textColor}`}>{Math.floor(currentBits * 11 + 1)} <span className="text-[10px] not-italic opacity-30">bits</span></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* ZOOM DIAGNOSTIC OVERLAY (THE LENS) */}
                <div className={`absolute bottom-10 right-10 z-20 w-48 h-48 rounded-full border overflow-hidden backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 shadow-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-gray-200'}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                         <Ruler size={100} className={textColor} />
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="100 100 100 100">
                         <path 
                             d={reconstructedPoints.slice(40, 80).map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                             fill="none" stroke={strokeColor} strokeWidth="4"
                         />
                         <circle cx="150" cy="125" r="2" fill="white" className="animate-pulse" />
                    </svg>
                    <div className="absolute inset-x-0 bottom-4 text-center">
                         <span className={`text-[9px] font-mono uppercase font-black tracking-widest ${accentColor}`}>Step Edge Diagnostic</span>
                    </div>
                </div>

                {/* THE CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        {/* ERROR Polygon (Differential Fill) */}
                        <path 
                             d={analogPoints.map((p, i) => {
                                 const rp = reconstructedPoints[i];
                                 return `M${p.x},${p.y} L${rp.x},${rp.y}`;
                             }).join(' ')}
                             stroke="#ef4444"
                             strokeWidth="1.5"
                             strokeOpacity={errorMagnitude / 80}
                        />

                        {/* Ultra-Elite: Harmonic Shadows (Visual Echoes) */}
                        <AnimatePresence>
                            {errorMagnitude > 20 && (
                                <path 
                                    d={analogPoints.map((p, i) => {
                                        const t = (p.x / 600) * Math.PI * 4 + time * 6; // 2x freq shadow
                                        return `${i === 0 ? 'M' : 'L'}${p.x},${125 + Math.sin(t) * 20}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="0.5"
                                    strokeOpacity="0.1"
                                />
                            )}
                        </AnimatePresence>

                        {/* ANALOG REAL (Hidden in Error Only mode) */}
                        <AnimatePresence>
                            {viewMode === 'overlay' && (
                                <motion.path 
                                    initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
                                    d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                                    fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1" strokeDasharray="4 4"
                                />
                            )}
                        </AnimatePresence>

                        {/* DIGITAL PROXY */}
                        <AnimatePresence>
                            {viewMode === 'overlay' && (
                                <motion.path 
                                    initial={{ opacity: 0 }} 
                                    animate={{ 
                                        opacity: 1,
                                        // Dynamic Glitch: Flicker when error is high
                                        stroke: errorMagnitude > 35 ? ["#f97316", "#ef4444", "#f97316"] : "#f97316"
                                    }} 
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.1, repeat: errorMagnitude > 35 ? Infinity : 0 }}
                                    d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                                    fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="butt"
                                    style={{ filter: isDarkMode ? `drop-shadow(0 0 15px ${errorMagnitude > 35 ? '#ef444444' : strokeColor + '44'})` : 'none' }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Ultra-Elite: Step Edge Sparks (The Discontinuity) */}
                        {viewMode === 'overlay' && reconstructedPoints.filter((_, i) => i % Math.max(1, Math.floor(200 / config.sampleRate)) === 0).map((p, i) => (
                            <motion.rect 
                                key={i} x={p.x - 1} y={p.y - 1} width="2" height="2" fill="#fff"
                                animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                            />
                        ))}
                    </svg>
                </div>

                {/* BREAKPOINT EVENT */}
                <AnimatePresence>
                    {signalLost && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none z-30"
                        >
                             <div className="bg-red-500 text-white px-8 py-3 rounded-full flex items-center gap-4 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                                <AlertTriangle size={20} className="animate-pulse" />
                                <span className="font-black italic uppercase tracking-[0.2em] text-sm">Signal Integrity Lost</span>
                             </div>
                             <span className="text-red-500/50 font-mono text-[9px] uppercase tracking-widest">Resolution below reconstruction threshold</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CUSTOM CURSOR */}
                <motion.div 
                    className="absolute w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
                    style={{ 
                        left: targetParams.fs * 100 + '%', 
                        top: (1 - targetParams.bits) * 100 + '%',
                        x: '-50%',
                        y: '-50%'
                    }}
                >
                    <div className="absolute inset-0 border border-orange-500/30 rounded-lg rotate-45" />
                    <motion.div 
                        className="w-2 h-2 bg-orange-500"
                        animate={{ opacity: [1, 0.5, 1], scale: signalLost ? [1, 1.3, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                    
                    {/* Audio Volume Visualizer Hint */}
                    <div className="absolute -bottom-8 flex items-center gap-2 opacity-30">
                        <Volume2 size={10} className={textColor} />
                        <div className="flex gap-0.5 h-2 items-end">
                            {[1, 2, 3].map(i => (
                                <motion.div 
                                    key={i} className="w-0.5 bg-orange-500 rounded-full" 
                                    animate={{ height: isIdle ? 2 : Math.random() * 8 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* DOMAIN LABELS */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between pointer-events-none opacity-20">
                    <span className={`text-[9px] font-mono uppercase tracking-[0.4em] ${textColor}`}>Domain: Continuous</span>
                    <span className={`text-[9px] font-mono uppercase tracking-[0.4em] ${accentColor}`}>Domain: Discrete Approximation</span>
                </div>
            </div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
           <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Digital Compromise</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    Switch to **Differential View** to see what is discarded. 
                    Every vertical spike in red is a moment where nature was forced to fit onto a grid. 
                    This is **Quantization Noise**—the permanent ghost of digital conversion.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100'}`}>
                 <div className="flex items-center gap-3">
                    <Zap size={14} className="text-orange-500" />
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Engineering Reality</h4>
                 </div>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "Analog is an infinite ramp. Digital is a staircase. <br/>
                    The higher you climb, the more nature you lose."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Nature vs. Numbers: To make a signal digital, we must approximate it. The most basic approximation is a staircase waveform—it stays at one level, then jumps to the next, discretizing a continuous flow.",
              physical: "The Approximation Error: The staircase is not the original smooth wave. The difference between the smooth wave and the steps is the error (Quantization Error). Every digital signal carries this error; engineering's goal is to minimize it below the perception threshold.",
              formal: "Finite Precision: Digital systems are defined by finite state space. While nature is an infinite ramp, digital is a ladder. No matter how many rungs you add, you are still discarding the infinite space between them.",
              insight: "Polygon Circle Metaphor: Think of analog as a smooth pen circle and digital as a polygon with thousands of tiny straight sides. From a distance, they look identical. Zoom in, and the edges reveal the code.",
              advanced: [
                  {
                      title: "Harmonic Shadows",
                      content: "The 'sharp corners' of the digital staircase create high-frequency energy that didn't exist in the original signal. These artifacts appear as ghosts or harmonic echoes in the frequency spectrum if not filtered."
                  },
                  {
                      title: "Effective Number of Bits (ENOB)",
                      content: "In real circuits, noise and distortion lower the performance. A system might physically have 16-bit converters but, due to interference, only offer 14 bits of 'useful' resolution. This is the ENOB."
                  }
              ]
          }}
      />
    </div>
  );
};
