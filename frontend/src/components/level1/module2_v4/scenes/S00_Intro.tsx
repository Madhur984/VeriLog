import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';

/**
 * S00_Intro: Feel Signal (Optimized)
 */
export const S00_Intro: React.FC<{ time: number }> = ({ time }) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const config = useMemo((): SignalConfig => ({
    frequency: 1 + mousePos.x * 2,
    amplitude: 40 + mousePos.y * 30,
    sampleRate: 0,
    bitDepth: 0,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  }), [mousePos]);

  const { analogPoints } = SignalEngine(config, time, 600, 250);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter text-white">
          The <span className="text-cyan-500">Nature</span> of Smooth
        </h1>
        <p className="text-lg text-white/60 leading-relaxed max-w-xl font-medium">
          Reality doesn't happen in steps. It flows. Every sound you hear, every light you see, 
          is a continuous wave — an infinite stream of values.
        </p>
      </div>

      <div 
        className="relative h-[320px] w-full bg-black/40 rounded-[2.5rem] border border-white/10 overflow-hidden cursor-crosshair group shadow-inner"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ 
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
          });
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        
        <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
          <path 
            d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 15px rgba(6,182,212,0.4))' }}
          />
        </svg>

        <div className="absolute bottom-8 left-8 flex gap-10">
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-1">Frequency</span>
                <span className="text-2xl font-black italic text-cyan-500 tracking-tighter">{(config.frequency).toFixed(2)} Hz</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-1">Potential</span>
                <span className="text-2xl font-black italic text-white/80 tracking-tighter">{(config.amplitude).toFixed(0)} V</span>
            </div>
        </div>

        <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em]">
            Analog Mode: Pure Continuity
        </div>
      </div>

      <div className="text-sm border-l-2 border-cyan-500/30 pl-8 text-white/40 italic font-medium max-w-lg leading-relaxed">
        "The first step of the bridge is accepting that nature is an ocean of infinite precision."
      </div>
    </div>
  );
};
