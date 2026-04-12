import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { AlertTriangle, Ghost } from 'lucide-react';

/**
 * S03_Aliasing (Optimized)
 */
export const S03_Aliasing: React.FC<{ time: number }> = ({ time }) => {
  const [freq, setFreq] = useState(2);
  const [sampleRate, setSampleRate] = useState(12);

  const config = useMemo((): SignalConfig => ({
    frequency: freq,
    amplitude: 60,
    sampleRate: sampleRate,
    bitDepth: 12,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  }), [freq, sampleRate]);

  const { analogPoints, samples, reconstructedPoints, metrics } = useMemo(() => 
    SignalEngine(config, time, 600, 200), [config, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          Frequency <span className="text-red-500">Ghosts</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          When you sample too slowly, data "folds". A fast frequency might appear as a slow ghost.
          This distortion is **Aliasing**, and it is the absolute limit of digital logic.
        </p>
      </header>

      <div className={`p-10 rounded-[2.5rem] border transition-all duration-700 shadow-2xl ${metrics.aliasing ? 'bg-red-500/5 border-red-500/20 shadow-red-500/5' : 'bg-black/40 border-white/10'}`}>
        <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${metrics.aliasing ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                    {metrics.aliasing ? <Ghost className="text-red-500" size={24} /> : <AlertTriangle className="text-white/40" size={24} />}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-1">Nyquist Status</span>
                    <span className={`text-xl font-black uppercase tracking-tighter italic ${metrics.aliasing ? 'text-red-500' : 'text-cyan-500'}`}>
                        {metrics.aliasing ? 'Violation: Aliasing Present' : 'Nominal: Signal Protected'}
                    </span>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Sample Freq</span>
                    <span className="text-2xl font-black text-white italic tracking-tighter">{sampleRate} Hz</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Nyquist Limit</span>
                    <span className={`text-2xl font-black italic tracking-tighter ${metrics.aliasing ? 'text-red-500' : 'text-white/40'}`}>
                        {(freq * 5 * 2).toFixed(0)} Hz
                    </span>
                </div>
            </div>
        </div>

        <div className="relative h-[280px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden shadow-inner">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-4">
            {/* Real Analog (Background Reference) */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 6" />
            
            {/* Reconstructed Ghost */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={metrics.aliasing ? "#ef4444" : "#06b6d4"} 
                strokeWidth="3.5"
                style={{ filter: `drop-shadow(0 0 15px ${metrics.aliasing ? 'rgba(239,68,68,0.4)' : 'rgba(6,182,212,0.4)'})` }}
            />
            
            {/* Sampling Dots */}
            {samples.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={metrics.aliasing ? "#ef4444" : "#06b6d4"} className="transition-all duration-300" />
            ))}
          </svg>
          
          <AnimatePresence>
            {metrics.aliasing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/[0.02] pointer-events-none"
                >
                    <span className="text-[140px] font-black italic text-red-500/[0.03] pointer-events-none uppercase tracking-tighter select-none">Ghosting</span>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
            <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">
                    <span>Input Frequency</span>
                    <span className="text-white italic">{freq} Hz</span>
                </div>
                <input type="range" min={1} max={5} step={0.1} value={freq} onChange={(e) => setFreq(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-white/40 cursor-pointer" />
            </div>
            <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">
                    <span>Sampling Rate</span>
                    <span className={`italic transition-colors ${metrics.aliasing ? 'text-red-500' : 'text-cyan-500'}`}>{sampleRate} Hz</span>
                </div>
                <input type="range" min={4} max={64} step={1} value={sampleRate} onChange={(e) => setSampleRate(parseInt(e.target.value))} className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-colors ${metrics.aliasing ? 'bg-red-500/20 accent-red-500' : 'bg-cyan-500/20 accent-cyan-500'}`} />
            </div>
        </div>
      </div>
    </div>
  );
};
