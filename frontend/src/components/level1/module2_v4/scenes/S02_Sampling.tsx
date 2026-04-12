import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Timer } from 'lucide-react';

/**
 * S02_Sampling (Optimized)
 */
export const S02_Sampling: React.FC<{ time: number }> = ({ time }) => {
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
    SignalEngine(config, time, 600, 200), [config, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          The Temporal <span className="text-cyan-500">Blink</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          A computer cannot watch the world continuously. It takes snapshots — **samples** — 
          at fixed intervals. The speed of this "blink" determines what reality you see.
        </p>
      </header>

      <div className="p-10 rounded-[2.5rem] border border-white/10 bg-black/40 space-y-10 shadow-2xl">
        <div className="flex justify-between items-center px-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-1">Snapshot Rate</span>
                <span className="text-3xl font-black italic text-cyan-500 tracking-tighter">{sampleRate} <span className="text-xs text-white/20 uppercase tracking-widest not-italic ml-2">Samples / Period</span></span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Timer className="text-cyan-500" size={24} />
            </div>
        </div>

        <div className="relative h-[250px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Analog Path */}
            <path 
                d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeOpacity="0.05" 
                strokeDasharray="4 4" 
            />
            
            {/* Sample Logic Visuals */}
            {samples.map((p, i) => (
                <motion.g key={i}>
                    <line x1={p.x} y1={125} x2={p.x} y2={p.y} stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.2" />
                    <circle cx={p.x} cy={p.y} r="3.5" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.6))' }} />
                </motion.g>
            ))}
          </svg>
        </div>

        <div className="space-y-6 px-4">
            <input 
                type="range" 
                min={4} 
                max={48} 
                step={1} 
                value={sampleRate} 
                onChange={(e) => setSampleRate(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-cyan-500 cursor-pointer hover:bg-white/10 transition-colors"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">
                <span>Slow (Lossy)</span>
                <span>Fast (Fidelity)</span>
            </div>
        </div>

        <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-4 mx-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
            <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                Observe how the "staircase" becomes smoother as you increase the rate. This is the foundation of 
                High-Resolution audio and video.
            </p>
        </div>
      </div>
    </div>
  );
};
