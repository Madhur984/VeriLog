import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, Waves } from 'lucide-react';

/**
 * S01_AnalogVsDigital: Visual First
 * 1. Show phenomenon: Analog vs Digital side by side.
 * 2. Realization: One is smooth, one is stepped.
 * 3. Label: Nature vs Calculation.
 */
export const S01_AnalogVsDigital: React.FC = () => {
  const [time, setTime] = useState(0);

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
    frequency: 1,
    amplitude: 40,
    sampleRate: 16,
    bitDepth: 4,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  };

  const { analogPoints, reconstructedPoints } = SignalEngine(config, time, 400, 150);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          Nature <span className="text-white/20">vs</span> <span className="text-cyan-500">Numbers</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
          To process signals, we must convert them into a language computers understand: **Bits**.
          This section explores the fundamental difference between the smooth physical world and 
          the discrete calculation of digital systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Analog Card */}
        <div className="p-8 rounded-3xl border border-white/10 bg-black/40 space-y-6 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <Waves className="text-white/40" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">The Analog Real</h3>
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">Infinite Continuity</p>
            </div>
          </div>
          <div className="h-[150px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
            </svg>
          </div>
          <p className="text-sm text-white/50 leading-relaxed italic">
            "Analog signals have no resolution limits, but they are vulnerable to noise that becomes part of the signal."
          </p>
        </div>

        {/* Digital Card */}
        <div className="p-8 rounded-3xl border border-cyan-500/10 bg-cyan-500/5 space-y-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Binary className="text-cyan-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">The Digital Proxy</h3>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-500/50">Discrete Steps</p>
            </div>
          </div>
          <div className="h-[150px] bg-black/60 rounded-2xl border border-cyan-500/5 overflow-hidden flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' }}
              />
            </svg>
          </div>
          <p className="text-sm text-white/50 leading-relaxed italic">
            "Digital is an approximation. It is cleaner and robust, but it creates a 'staircase' that wasn't there."
          </p>
        </div>
      </div>
    </div>
  );
};
