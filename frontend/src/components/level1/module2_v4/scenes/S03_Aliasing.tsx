import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { AlertTriangle, Ghost } from 'lucide-react';

/**
 * S03_Aliasing: Failure Visualization
 * 1. Show phenomenon: Signal folding / "Ghosts".
 * 2. Realization: Sampling too slow creates fake information.
 * 3. Label: Nyquist Limit.
 */
export const S03_Aliasing: React.FC = () => {
  const [time, setTime] = useState(0);
  const [freq, setFreq] = useState(2);
  const [sampleRate, setSampleRate] = useState(12);

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
    frequency: freq,
    amplitude: 60,
    sampleRate: sampleRate,
    bitDepth: 12,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  }), [freq, sampleRate]);

  const { analogPoints, samples, reconstructedPoints, metrics } = SignalEngine(config, time, 600, 200);

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white">
          Frequency <span className="text-red-500">Ghosts</span>
        </h2>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
          If you blink too slowly, fast-moving reality "folds". A 10Hz signal might appear as 2Hz.
          This distortion is called **Aliasing**, and it is the absolute wall of digital sampling.
        </p>
      </div>

      <div className={`p-8 rounded-3xl border transition-all duration-700 ${metrics.aliasing ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]' : 'bg-black/40 border-white/10'}`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg border transition-colors ${metrics.aliasing ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                    {metrics.aliasing ? <Ghost className="text-red-500" size={18} /> : <AlertTriangle className="text-white/40" size={18} />}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/20">Nyquist Status</span>
                    <span className={`text-sm font-black uppercase ${metrics.aliasing ? 'text-red-500' : 'text-cyan-500'}`}>
                        {metrics.aliasing ? 'Violation: Aliasing Present' : 'Nominal: Reconstruction Possible'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/30 uppercase">Fs</span>
                    <span className="text-xl font-black text-white">{sampleRate} Hz</span>
                </div>
                <div className="text-white/10 text-xl font-thin">/</div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono text-white/30 uppercase">Fmax × 2</span>
                    <span className={`text-xl font-black ${metrics.aliasing ? 'text-red-500' : 'text-white/40'}`}>
                        {(freq * 5 * 2).toFixed(0)} Hz
                    </span>
                </div>
            </div>
        </div>

        <div className="relative h-[250px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
            {/* Real Analog (Grey, Dash) */}
            <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
            
            {/* Reconstructed (Cyan if OK, Red if Aliased) */}
            <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={metrics.aliasing ? "#ef4444" : "#06b6d4"} 
                strokeWidth="2.5"
                style={{ filter: `drop-shadow(0 0 10px ${metrics.aliasing ? 'rgba(239,68,68,0.4)' : 'rgba(6,182,212,0.4)'})` }}
            />
            
            {/* Samples */}
            {samples.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={metrics.aliasing ? "#ef4444" : "#06b6d4"} />
            ))}
          </svg>
          
          <AnimatePresence>
            {metrics.aliasing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/5 pointer-events-none"
                >
                    <span className="text-[120px] font-black italic text-red-500/10 pointer-events-none uppercase tracking-tighter">Folded</span>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                    <span>Input Frequency</span>
                    <span className="text-white">{freq} Hz</span>
                </div>
                <input type="range" min={1} max={5} step={0.1} value={freq} onChange={(e) => setFreq(parseFloat(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-white/40 cursor-pointer" />
            </div>
            <div className="space-y-4">
                <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                    <span>Sampling Rate</span>
                    <span className={metrics.aliasing ? 'text-red-500 font-bold' : 'text-cyan-500'}>{sampleRate} Hz</span>
                </div>
                <input type="range" min={4} max={64} step={1} value={sampleRate} onChange={(e) => setSampleRate(parseInt(e.target.value))} className={`w-full h-1 rounded-full appearance-none cursor-pointer ${metrics.aliasing ? 'bg-red-500/20 accent-red-500' : 'bg-cyan-500/20 accent-cyan-500'}`} />
            </div>
        </div>
      </div>
    </div>
  );
};
