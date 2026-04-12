import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Sliders, Activity, Zap, ShieldCheck, Hash, Target } from 'lucide-react';

/**
 * S08_Lab: Signal Forge v3.0
 * The full, uncompromised signal measurement instrument.
 */
export const S08_Lab: React.FC = () => {
  const [time, setTime] = useState(0);
  const [config, setConfig] = useState<SignalConfig>({
    frequency: 1,
    amplitude: 60,
    sampleRate: 24,
    bitDepth: 8,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  });

  useEffect(() => {
    let raf: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { analogPoints, samples, reconstructedPoints, metrics } = useMemo(() => 
    SignalEngine(config, time, 600, 200), [config, time]
  );

  const LabSlider = ({ label, value, min, max, step, onChange }: any) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase">
            <span className="text-white/30">{label}</span>
            <span className="text-orange-500 font-black">{value.toFixed(step < 1 ? 2 : 0)}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full h-1 bg-white/5 rounded-full appearance-none accent-orange-500 cursor-pointer"
        />
    </div>
  );

  const MetricBox = ({ icon: Icon, label, value, sub, active = true }: any) => (
    <div className={`p-4 rounded-2xl border transition-all ${active ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-30'}`}>
        <div className="flex items-center gap-2 mb-3">
            <Icon size={12} className={active ? 'text-cyan-500' : 'text-white/20'} />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">{label}</span>
        </div>
        <div className="text-xl font-black text-white italic tracking-tighter">{value}</div>
        <div className="text-[8px] font-mono text-white/20 uppercase mt-1">{sub}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-4">
            <h2 className="text-5xl font-black italic tracking-tighter text-white">
                Signal <span className="text-orange-500">Forge</span> <span className="text-white/10 italic text-2xl">v3.0</span>
            </h2>
            <p className="text-sm text-white/40 max-w-lg">
                High-fidelity measurement instrument. Control every parameter of the translation bridge 
                and observe the effects on performance metrics.
            </p>
        </div>

        <div className="flex items-center gap-12 mb-2">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/20 uppercase">Sampling Status</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${metrics.aliasing ? 'text-red-500' : 'text-cyan-500'}`}>
                    {metrics.aliasing ? 'Aliased' : 'Nominal'}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/20 uppercase">Bit Efficiency</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">{(metrics.enob / config.bitDepth * 100).toFixed(0)}%</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Controls */}
        <div className="lg:col-span-1 space-y-10 p-8 rounded-3xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
                <Sliders size={14} /> Generators
            </div>
            <LabSlider label="Base Frequency" value={config.frequency} min={0.5} max={5} step={0.1} onChange={(v: any) => setConfig({...config, frequency: v})} />
            <LabSlider label="Sampling Rate (Fs)" value={config.sampleRate} min={4} max={128} step={1} onChange={(v: any) => setConfig({...config, sampleRate: v})} />
            <LabSlider label="Bit Depth (N)" value={config.bitDepth} min={1} max={16} step={1} onChange={(v: any) => setConfig({...config, bitDepth: v})} />
            <LabSlider label="Clock Jitter" value={config.jitter} min={0} max={0.5} step={0.01} onChange={(v: any) => setConfig({...config, jitter: v})} />
            
            <div className="pt-6 border-t border-white/5 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">Dither Enabled</span>
                    <input 
                        type="checkbox" 
                        checked={config.dither} 
                        onChange={(e) => setConfig({...config, dither: e.target.checked})}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 accent-orange-500"
                    />
                </label>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Reconstruction</span>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        {['zoh', 'sinc'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => setConfig({...config, reconstruction: m as any})}
                                className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all ${config.reconstruction === m ? 'bg-orange-500 text-black shadow-lg' : 'text-white/40'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Center Display */}
        <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[300px] w-full bg-black/60 rounded-3xl border border-white/10 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
                    {/* Analog Path */}
                    <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" strokeDasharray="4 4" />
                    
                    {/* Reconstructed Path */}
                    <path 
                        d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="2.5"
                        style={{ filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.4))' }}
                    />

                    {/* Sampling Points */}
                    {samples.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#f97316" />
                    ))}
                </svg>
                
                <div className="absolute top-6 left-6 flex gap-4">
                    <div className="px-2 py-1 rounded bg-black/60 border border-white/10 text-[8px] font-mono text-white/40 uppercase">
                        Mode: {config.reconstruction === 'sinc' ? 'Inter-Sample Interpolation' : 'Zero-Order Hold'}
                    </div>
                </div>
            </div>

            {/* Error Graph (Mini) */}
            <div className="h-[100px] w-full bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col p-4">
                <div className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-2">Quantization Error Spectrum (LSB)</div>
                <div className="flex-1 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
                        <path 
                            d={samples.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${40 + p.error * 100}`).join(' ')} 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="1.5" 
                            strokeOpacity="0.6"
                        />
                        <line x1="0" y1="40" x2="600" y2="40" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="2 2" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Right Metrics */}
        <div className="lg:col-span-1 space-y-4">
            <MetricBox icon={Activity} label="SNR" value={`${metrics.snr.toFixed(1)} dB`} sub="Theoretical Ceiling" />
            <MetricBox icon={Hash} label="ENOB" value={`${metrics.enob.toFixed(2)}`} sub="Effective Bits" />
            <MetricBox icon={Target} label="THD + N" value={`${metrics.thdn.toFixed(1)} dB`} sub="Total Distortion" />
            <MetricBox icon={ShieldCheck} label="Dither Status" value={config.dither ? "On" : "Off"} sub="Quantization Cure" active={config.dither} />
            
            <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 mt-4 text-[10px] leading-relaxed text-white/40 italic">
                "Increasing bit depth doesn't make it louder; it pushes the floor down, revealing the silence between the waves."
            </div>
        </div>
      </div>
    </div>
  );
};
