import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, Hash } from 'lucide-react';

/**
 * S04_Quantization (Optimized)
 */
export const S04_Quantization: React.FC<{ time: number }> = ({ time }) => {
  const [bitDepth, setBitDepth] = useState(3);

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 48, 
    bitDepth: bitDepth,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [bitDepth]);

  const { analogPoints, reconstructedPoints } = useMemo(() => 
    SignalEngine(config, time, 600, 200), [config, time]
  );

  const levels = Math.pow(2, bitDepth);
  const gridLines = Array.from({ length: levels }, (_, i) => (i / (levels - 1)) * 200);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          The <span className="text-orange-500">Rung</span> Paradox
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          If sampling is **when** we look, quantization is **what** we see. 
          A computer must round to the nearest available step. This creates the
          **Quantization Noise** floor.
        </p>
      </header>

      <div className="relative p-10 rounded-[2.5rem] border border-white/10 bg-black/40 space-y-10 shadow-2xl">
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-5 text-orange-500 font-mono text-[10px] uppercase tracking-[0.3em] font-black">
                <Binary size={18} /> Amplitude Resolver
            </div>
            <div className="flex items-center gap-10">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">Grid Density</span>
                    <span className="text-2xl font-black italic text-white tracking-tighter">{levels} <span className="text-xs text-white/20 uppercase tracking-widest not-italic ml-2">Steps</span></span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">Bit Depth</span>
                    <span className="text-2xl font-black italic text-orange-500 tracking-tighter">{bitDepth} Bits</span>
                </div>
            </div>
        </div>

        <div className="relative h-[280px] bg-black/60 rounded-3xl border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-4">
            {/* Resolution Grid */}
            {gridLines.map((y, i) => (
                <line key={i} x1="0" y1={y + 25} x2="600" y2={y + 25} stroke="white" strokeWidth="0.5" strokeOpacity="0.03" />
            ))}

            {/* Analog Background Reference */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="6 6" />
            
            {/* Quantized Staircase */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="3.5"
                style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.4))' }}
            />
          </svg>
        </div>

        <div className="space-y-6 px-4">
            <input 
                type="range" 
                min={1} 
                max={8} 
                step={1} 
                value={bitDepth} 
                onChange={(e) => setBitDepth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-orange-500 cursor-pointer hover:bg-white/10 transition-colors"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">
                <span>Coarse (8 Levels)</span>
                <span>Subtle (256 Levels)</span>
            </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex items-start gap-6 mx-2">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <Hash size={18} className="text-orange-500" />
            </div>
            <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black text-orange-500">The 6dB Golden Rule</span>
                <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                    Every extra bit you add roughly **doubles** the precision. In engineering math, 
                    each bit reduces the noise floor by exactly **6.02 dB**.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
