import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, Ruler, Hash } from 'lucide-react';

/**
 * S04_Quantization: Error Emerges
 * 1. Show phenomenon: "Rounding" a continuous wave onto a grid.
 * 2. Realization: We lose precision between the steps.
 * 3. Label: Bit Depth & Quantization Error.
 */
export const S04_Quantization: React.FC = () => {
  const [time, setTime] = useState(0);
  const [bitDepth, setBitDepth] = useState(3);

  useEffect(() => {
    let raf: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 48, // High sampling to isolate quantization effect
    bitDepth: bitDepth,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [bitDepth]);

  const { analogPoints, reconstructedPoints, samples } = SignalEngine(config, time, 600, 200);

  // Calculate resolution steps for the grid
  const levels = Math.pow(2, bitDepth);
  const gridLines = Array.from({ length: levels }, (_, i) => (i / (levels - 1)) * 200);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          The <span className="text-orange-500">Rung</span> Paradox
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
          If sampling is **when** we look, quantization is **what** we see. 
          A computer can't store "about 5 volts". It must choose the nearest step. 
          The distance between these steps is your **Quantization Error**.
        </p>
      </div>

      <div className="relative p-8 rounded-3xl border border-white/10 bg-black/40 space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-orange-500 font-mono text-[10px] uppercase tracking-widest font-black">
                <Binary size={16} /> Amplitude Resolver
            </div>
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/30 uppercase">Granularity</span>
                    <span className="text-2xl font-black text-white">{levels} <span className="text-xs text-white/40 uppercase">Steps</span></span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/30 uppercase">Bit Depth</span>
                    <span className="text-2xl font-black text-orange-500">{bitDepth} Bits</span>
                </div>
            </div>
        </div>

        <div className="relative h-[250px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Resolution Grid */}
            {gridLines.map((y, i) => (
                <line key={i} x1="0" y1={y + 25} x2="600" y2={y + 25} stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
            ))}

            {/* Analog Background */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
            
            {/* Quantized Staircase */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.4))' }}
            />
          </svg>
        </div>

        <div className="space-y-4">
            <input 
                type="range" 
                min={1} 
                max={8} 
                step={1} 
                value={bitDepth} 
                onChange={(e) => setBitDepth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Coarse (Noise)</span>
                <span>Subtle (High SNR)</span>
            </div>
        </div>

        <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex items-center gap-3 mb-3">
                <Hash size={14} className="text-orange-500" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-orange-500">The 6dB Rule</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed font-medium">
                Every bit you add to your system roughly **doubles** the precision. In engineering terms, 
                each extra bit adds exactly **6.02 dB** of dynamic range. A 16-bit CD has ~96dB of floor, 
                while a 24-bit studio master has ~144dB.
            </p>
        </div>
      </div>
    </div>
  );
};
