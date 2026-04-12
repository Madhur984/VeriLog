import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Ruler } from 'lucide-react';

/**
 * S02_Sampling: Points Appear
 * 1. Show phenomenon: Dots appearing on the analog wave.
 * 2. Realization: We only check the signal at specific intervals.
 * 3. Label: Sampling Rate (Fs).
 */
export const S02_Sampling: React.FC = () => {
  const [time, setTime] = useState(0);
  const [sampleRate, setSampleRate] = useState(8);

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
    amplitude: 60,
    sampleRate: sampleRate,
    bitDepth: 8, // High precision to focus only on sampling
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  };

  const { analogPoints, samples } = SignalEngine(config, time, 600, 200);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          The <span className="text-cyan-500">Capture</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
          An ADC doesn't watch the whole movie. It takes **snapshots**.
          Sampling is the process of measuring the signal at regular intervals. 
          The faster we "blink", the more detail we capture.
        </p>
      </div>

      <div className="relative p-8 rounded-3xl border border-white/10 bg-black/40 space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-cyan-500 font-mono text-[10px] uppercase tracking-widest font-black">
                <Ruler size={16} /> Sampling Rate Generator
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/30 uppercase">Fs =</span>
                <span className="text-2xl font-black text-cyan-500">{sampleRate} Hz</span>
            </div>
        </div>

        <div className="h-[250px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Analog Background */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.1" strokeDasharray="4 4" />
            
            {/* Samples */}
            {samples.map((p, i) => (
                <g key={i}>
                    <line x1={p.x} y1={125} x2={p.x} y2={p.y} stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 2" />
                    <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="3.5" 
                        fill="#06b6d4" 
                        style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }}
                    />
                </g>
            ))}
          </svg>
        </div>

        <div className="space-y-4">
            <input 
                type="range" 
                min={2} 
                max={48} 
                step={1} 
                value={sampleRate} 
                onChange={(e) => setSampleRate(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Low Detail</span>
                <span>High Fidelity</span>
            </div>
        </div>
      </div>
    </div>
  );
};
