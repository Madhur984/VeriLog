import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Zap, ShieldCheck } from 'lucide-react';

/**
 * S05_Dither: The Noise Cure
 * 1. Show phenomenon: Quantization "blocking" at low volume.
 * 2. Realization: Adding noise reveals the underlying signal.
 * 3. Label: Dither.
 */
export const S05_Dither: React.FC<{ time: number }> = ({ time }) => {
  const [ditherEnabled, setDitherEnabled] = useState(false);

  const config = useMemo((): SignalConfig => ({
    frequency: 0.5,
    amplitude: 15, // Low amplitude to accentuate quantization artifacts
    sampleRate: 48,
    bitDepth: 3, // Very low bits to show the staircase clearly
    jitter: 0,
    dither: ditherEnabled,
    reconstruction: 'zoh'
  }), [ditherEnabled]);

  const { analogPoints, reconstructedPoints, samples, metrics } = useMemo(() => 
    SignalEngine(config, time, 600, 200), [config, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          The <span className="text-cyan-500">Noise</span> Cure
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          Quantization doesn't just add noise — it adds **distortion**. At low bit depths, signals 
          become "stuck" on rungs. **Dither** adds a tiny amount of random noise to shake the signal 
          free, trading clarity for a slightly higher floor.
        </p>
      </header>

      <div className={`p-10 rounded-[2.5rem] border transition-all duration-700 shadow-2xl ${ditherEnabled ? 'bg-cyan-500/5 border-cyan-500/20 shadow-cyan-500/5' : 'bg-black/40 border-white/10'}`}>
        <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${ditherEnabled ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}>
                    <ShieldCheck className={ditherEnabled ? 'text-cyan-500' : 'text-white/20'} size={24} />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-1">Linearization</span>
                    <span className={`text-xl font-black uppercase tracking-tighter italic ${ditherEnabled ? 'text-cyan-500' : 'text-white/40'}`}>
                        {ditherEnabled ? 'Dither Active: Linearized' : 'Dither Off: Correlated Distortion'}
                    </span>
                </div>
            </div>

            <button 
                onClick={() => setDitherEnabled(!ditherEnabled)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${ditherEnabled ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-500/20 active:scale-95' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
            >
                <Zap size={14} /> {ditherEnabled ? 'Disable Dither' : 'Inject Noise'}
            </button>
        </div>

        <div className="relative h-[250px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-4">
            {/* Analog Reference */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
            
            {/* Reconstructed Path */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={ditherEnabled ? "#06b6d4" : "#ffffff40"} 
                strokeWidth="3"
                style={{ filter: `drop-shadow(0 0 10px ${ditherEnabled ? 'rgba(6,182,212,0.4)' : 'transparent'})` }}
            />

            {/* Error Indicators */}
            {!ditherEnabled && (
                <text x="50%" y="85%" textAnchor="middle" className="text-[10px] font-mono fill-red-500/40 uppercase tracking-[0.3em]">Harsh Staircase Distortion Detected</text>
            )}
          </svg>
        </div>

        {/* Comparison HUD */}
        <div className="mt-10 grid grid-cols-2 gap-10 px-4">
            <div className="space-y-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 font-black">Dynamic Range</span>
                <div className="h-12 flex items-center justify-between px-6 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-sm font-black text-white italic">{metrics.snr.toFixed(1)} dB</span>
                    <span className="text-[8px] font-mono text-white/30 uppercase font-black">Lower is typical</span>
                </div>
            </div>
            <div className="space-y-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-500/60 font-black">Effective Resolution</span>
                <div className="h-12 flex items-center justify-between px-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                    <span className="text-sm font-black text-cyan-500 italic">{(metrics.enob).toFixed(2)} Bits</span>
                    <span className="text-[8px] font-mono text-cyan-500/40 uppercase font-black">High Linearity</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
