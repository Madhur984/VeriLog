import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, Waves } from 'lucide-react';

/**
 * S01_AnalogVsDigital (Optimized)
 */
export const S01_AnalogVsDigital: React.FC<{ time: number }> = ({ time }) => {
  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 40,
    sampleRate: 16,
    bitDepth: 4,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), []);

  const { analogPoints, reconstructedPoints } = useMemo(() => 
    SignalEngine(config, time, 400, 150), [config, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          Nature <span className="text-white/20">vs</span> <span className="text-cyan-500">Numbers</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
          To process signals, we must convert them into a language computers understand: **Bits**.
          One is smooth and eternal; the other is discrete and calculated.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Analog Card */}
        <section className="p-8 rounded-[2rem] border border-white/10 bg-black/40 space-y-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Waves className="text-white/40" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white">The Analog Real</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Infinite Continuity</p>
            </div>
          </div>
          <div className="h-[150px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path 
                d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeOpacity="0.4" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' }}
              />
            </svg>
          </div>
          <p className="text-sm text-white/30 leading-relaxed italic font-medium">
            "Analog signals have no resolution limits, but they are vulnerable to noise that becomes part of the signal."
          </p>
        </section>

        {/* Digital Card */}
        <section className="p-8 rounded-[2rem] border border-cyan-500/10 bg-cyan-500/5 space-y-8 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 shadow-2xl shadow-cyan-500/5">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
              <Binary className="text-cyan-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white">The Digital Proxy</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500/40">Discrete Approximation</p>
            </div>
          </div>
          <div className="h-[150px] bg-black/60 rounded-2xl border border-cyan-500/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="3"
                style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.4))' }}
              />
            </svg>
          </div>
          <p className="text-sm text-white/40 leading-relaxed italic font-medium">
            "Digital is a calculated proxy. It is robust and clean, but it introduces a 'staircase' quantization."
          </p>
        </section>
      </div>
    </div>
  );
};
