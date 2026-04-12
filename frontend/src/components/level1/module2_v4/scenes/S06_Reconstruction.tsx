import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Activity, MoveHorizontal } from 'lucide-react';

/**
 * S06_Reconstruction: The Final Bridge
 * 1. Show phenomenon: The "staircase" vs the "smooth curve".
 * 2. Realization: Mathematics can fill the gaps between samples.
 * 3. Label: Sinc Interpolation / Low-pass Filtering.
 */
export const S06_Reconstruction: React.FC<{ time: number }> = ({ time }) => {
  const [method, setMethod] = useState<'zoh' | 'sinc'>('zoh');

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 20,
    bitDepth: 8,
    jitter: 0,
    dither: false,
    reconstruction: method
  }), [method]);

  const { analogPoints, reconstructedPoints, samples } = useMemo(() => 
    SignalEngine(config, time, 600, 200), [config, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          <span className="text-cyan-500">Materialization</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          Once sampled, the signal is just a list of numbers. To turn it back into physical flow, 
          we must bridge the gaps. While **Zero-Order Hold** creates a jagged staircase, 
          **Sinc Interpolation** recovers the smooth, infinite truth.
        </p>
      </header>

      <div className="p-10 rounded-[2.5rem] border border-white/10 bg-black/40 space-y-10 shadow-2xl">
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <Activity className="text-cyan-500" size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-1">Reconstruction Filter</span>
                    <span className="text-xl font-black uppercase tracking-tighter italic text-white">
                        {method === 'zoh' ? 'Zero-Order Hold (Quantized)' : 'Sinc Interpolation (Natural)'}
                    </span>
                </div>
            </div>

            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                {['zoh', 'sinc'].map((m) => (
                    <button 
                        key={m}
                        onClick={() => setMethod(m as any)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${method === m ? 'bg-cyan-500 text-black shadow-lg scale-105' : 'text-white/30 hover:text-white/60'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>

        <div className="relative h-[280px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden shadow-inner px-2">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Analog Reference (Invisible/Faint) */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 6" />
            
            {/* Reconstructed Path */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={method === 'sinc' ? "#06b6d4" : "#ffffff40"} 
                strokeWidth="3.5"
                className="transition-all duration-700"
                style={{ filter: method === 'sinc' ? 'drop-shadow(0 0 15px rgba(6,182,212,0.4))' : 'none' }}
            />

            {/* Samples */}
            {samples.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#f97316" stroke="#000" strokeWidth="1" className="transition-all duration-300" />
            ))}
          </svg>

          {method === 'sinc' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                  <div className="text-[120px] font-black italic text-cyan-500/[0.02] uppercase tracking-tighter">Interpolated</div>
              </motion.div>
          )}
        </div>

        <div className="p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-6 mx-2">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <MoveHorizontal size={18} className="text-cyan-500" />
            </div>
            <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black text-cyan-500">The Whittaker–Shannon Proof</span>
                <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                    If you sample fast enough (Nyquist), you don't lose anything. The smooth curve can be perfectly 
                    reconstructed from the discrete dots using a sinc filter.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
