import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';

/**
 * S00_Intro: Feel Signal
 * 1. Show phenomenon: Smooth analog wave.
 * 2. Let user feel it: Modulation via mouse.
 * 3. Explain: Reality is smooth.
 */
export const S00_Intro: React.FC = () => {
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  useEffect(() => {
    let raf: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const config: SignalConfig = {
    frequency: 1 + mousePos.x * 2,
    amplitude: 40 + mousePos.y * 30,
    sampleRate: 0, // No sampling yet
    bitDepth: 0,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  };

  const { analogPoints } = SignalEngine(config, time, 600, 200);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter text-white">
          The <span className="text-cyan-500">Nature</span> of Smooth
        </h1>
        <p className="text-lg text-white/60 leading-relaxed max-w-xl">
          Reality doesn't happen in steps. It flows. Every sound you hear, every light you see, 
          is a continuous wave — an infinite stream of values.
        </p>
      </div>

      <div 
        className="relative h-[300px] w-full bg-black/40 rounded-3xl border border-white/10 overflow-hidden cursor-crosshair group"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ 
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
          });
        }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        
        {/* Signal Display */}
        <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
          <path 
            d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.5))' }}
          />
        </svg>

        {/* HUD Elements */}
        <div className="absolute bottom-6 left-6 flex gap-8">
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Frequency</span>
                <span className="text-xl font-black text-cyan-500">{(config.frequency).toFixed(2)} Hz</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Amplitude</span>
                <span className="text-xl font-black text-white/80">{(config.amplitude).toFixed(0)} V</span>
            </div>
        </div>

        <div className="absolute top-6 right-6 px-3 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-[9px] font-bold text-cyan-500 uppercase tracking-widest">
            Analog Mode: Continuous
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-sm border-l-2 border-cyan-500/30 pl-6 text-white/40 italic">
          "The first step of the bridge is accepting that nature is an ocean of infinite precision."
        </div>
      </div>
    </div>
  );
};
