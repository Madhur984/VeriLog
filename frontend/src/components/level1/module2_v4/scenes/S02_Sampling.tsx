import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Timer } from 'lucide-react';

/**
 * S02_Sampling (Optimized)
 */
/**
 * S02_Sampling (Optimized)
 */
export const S02_Sampling: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [sampleRate, setSampleRate] = useState(12);

  const config = useMemo((): SignalConfig => ({
    frequency: 0.5,
    amplitude: 70,
    sampleRate: sampleRate,
    bitDepth: 12,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [sampleRate]);

  const { analogPoints, samples } = useMemo(() => 
    SignalEngine(config, time, 600, 250), [config, time]
  );

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          The Temporal <span className={accentColor}>Blink</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              A computer cannot watch the world continuously. It takes snapshots — **samples** — 
              at fixed intervals. The speed of this "blink" determines what reality you capture.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-white border-orange-200 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>The Nyquist Theorem</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   To avoid missing the pattern, you must sample at **more than twice** the highest frequency present.
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl ${isDarkMode ? 'bg-black/60 text-orange-400' : 'bg-orange-50 text-orange-700'}`}>
                    f_sampling &gt; 2 × f_max
                </div>
            </div>
        </div>
      </header>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10`}>
        <div className={`lg:col-span-8 p-10 rounded-[3rem] border space-y-10 shadow-2xl transition-all duration-500 ${cardBg}`}>
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Sampling Frequency (Fs)</span>
                    <span className={`text-3xl font-black italic tracking-tighter ${accentColor}`}>{sampleRate} <span className={`text-xs uppercase tracking-widest not-italic ml-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Hz</span></span>
                </div>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                    <Timer className={accentColor} size={28} />
                </div>
            </div>

            <div className={`relative h-[280px] rounded-[2rem] border overflow-hidden shadow-inner flex items-center justify-center transition-all ${innerBg}`}>
                <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
                    {/* Analog Path */}
                    <path 
                        d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                        fill="none" 
                        stroke={isDarkMode ? 'white' : '#64748b'} 
                        strokeWidth="2" 
                        strokeOpacity={isDarkMode ? '0.05' : '0.15'} 
                        strokeDasharray="6 6" 
                    />
                    
                    {/* Sample Logic Visuals */}
                    {samples.map((p, i) => (
                        <motion.g key={i}>
                            <line x1={p.x} y1={125} x2={p.x} y2={p.y} stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="2 2" />
                            <circle cx={p.x} cy={p.y} r="4.5" fill={strokeColor} style={{ filter: isDarkMode ? `drop-shadow(0 0 10px ${strokeColor})` : 'none' }} />
                        </motion.g>
                    ))}
                </svg>
            </div>

            <div className="space-y-8 px-4">
                <div className="space-y-2">
                    <input 
                        type="range" 
                        min={4} 
                        max={48} 
                        step={1} 
                        value={sampleRate} 
                        onChange={(e) => setSampleRate(parseInt(e.target.value))}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 accent-orange-500 hover:bg-white/20' : 'bg-gray-200 accent-orange-600 hover:bg-gray-300'}`}
                    />
                    <div className={`flex justify-between text-[10px] font-mono uppercase tracking-[0.4em] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                        <span>Slow (Under-sampling)</span>
                        <span>Fast (High Fidelity)</span>
                    </div>
                </div>

                <div className={`p-8 rounded-[2rem] border flex items-start gap-6 transition-all ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50/50 border-orange-100 shadow-sm'}`}>
                    <div className={`w-3 h-3 rounded-full mt-1.5 animate-pulse ${isDarkMode ? 'bg-orange-500' : 'bg-orange-600'}`} />
                    <div className="space-y-4 text-left">
                        <p className={`text-sm leading-relaxed font-bold ${textColor}`}>
                            Why 40.1 kHz?
                        </p>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            If your orchestra goes up to **20 kHz**, the math says you need &gt; 2 × 20. But &gt; 40 means even 40.001 works. In the real world, 40.1 kHz is the practical baseline.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>Practical Use</h4>
                <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                    CD Audio uses **44.1 kHz**. That's 20 kHz (human hearing) × 2, plus a safety margin for the anti-aliasing filters.
                </p>
            </div>
            <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${textColor}`}>Snapshot Analogy</h4>
                <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                    Imagine a hummingbird's wings (80 flap/s). If you take a photo 81 times per second, you'll see the wing shape. Take it 20 times per second, and you just see a blur.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
