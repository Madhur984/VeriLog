import React, { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Sliders, Activity, Zap, ShieldCheck, Hash, Target } from 'lucide-react';
import { useDebounce } from '../../../../hooks/useDebounce';

/**
 * Optimized Metric Box
 */
const MetricBox = memo(({ icon: Icon, label, value, sub, active = true }: any) => (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${active ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-30'}`}>
        <div className="flex items-center gap-2 mb-3">
            <Icon size={12} className={active ? 'text-cyan-500' : 'text-white/20'} />
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">{label}</span>
        </div>
        <div className="text-xl font-black text-white italic tracking-tighter">{value}</div>
        <div className="text-[8px] font-mono text-white/20 uppercase mt-1">{sub}</div>
    </div>
));

/**
 * Optimized Lab Slider
 */
const LabSlider = memo(({ label, value, min, max, step, onChange, color = 'orange' }: any) => (
    <div className="group space-y-3">
        <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase">
            <span className="text-white/30 group-hover:text-white/50 transition-colors">{label}</span>
            <span className={`text-${color}-500 font-black`}>{value.toFixed(step < 1 ? 2 : 0)}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className={`w-full h-1 bg-white/5 rounded-full appearance-none accent-${color}-500 cursor-pointer hover:bg-white/10 transition-colors`}
        />
    </div>
));

/**
 * Specialized Wave Renderer (Memoized)
 */
const WaveRenderer = memo(({ analogPoints, samples, reconstructedPoints, color = "#06b6d4" }: any) => (
    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {/* Analog Path (Background) */}
        <path 
            d={analogPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            strokeOpacity="0.03" 
            strokeDasharray="4 4" 
        />
        
        {/* Reconstructed Path (Hero) */}
        <path 
            d={reconstructedPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke={color} 
            strokeWidth="2.5"
            style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
        />

        {/* Sampling Points */}
        {samples.map((p: any, i: number) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#f97316" className="transition-all duration-300" />
        ))}
    </svg>
));

/**
 * S08_Lab: Signal Forge v3.0 (Optimized)
 * Performance-stabilized version with debounced physics.
 */
export const S08_Lab: React.FC<{ time: number }> = ({ time }) => {
  // 1. Separate UI state from Engine state
  const [uiConfig, setUiConfig] = useState<SignalConfig>({
    frequency: 1,
    amplitude: 60,
    sampleRate: 24,
    bitDepth: 8,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  });

  // 2. Debounce the heavy calculations
  const engineConfig = useDebounce(uiConfig, 32); 

  // 3. Compute Engine Results (O(N) windowed)
  const results = useMemo(() => 
    SignalEngine(engineConfig, time, 600, 250), [engineConfig, time]
  );

  const updateConfig = (patch: Partial<SignalConfig>) => {
    setUiConfig(prev => ({ ...prev, ...patch }));
  };

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-4">
            <h2 className="text-5xl font-black italic tracking-tighter text-white">
                Signal <span className="text-orange-500">Forge</span> <span className="text-white/10 italic text-2xl">v3.0</span>
            </h2>
            <p className="text-sm text-white/40 max-w-lg leading-relaxed font-medium">
                Optimized measurement instrument. Experience sub-millisecond precision with windowed sinc reconstruction 
                and stabilized noise modeling.
            </p>
        </div>

        <div className="flex items-center gap-10 mb-2">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">Sampling Status</span>
                <span className={`text-xs font-black uppercase tracking-widest ${results.metrics.aliasing ? 'text-red-500' : 'text-cyan-500'}`}>
                    {results.metrics.aliasing ? 'Violation' : 'Nominal'}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">System Load</span>
                <span className="text-xs font-black text-white/60 uppercase tracking-widest italic">Stable</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Controls */}
        <aside className="lg:col-span-1 p-8 rounded-[2rem] bg-black/40 border border-white/5 space-y-10">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
                <Sliders size={14} /> Modulation
            </div>
            
            <LabSlider label="Fundamental" value={uiConfig.frequency} min={0.5} max={5} step={0.1} onChange={(v: any) => updateConfig({ frequency: v })} />
            <LabSlider label="Nyquist Rate (Fs)" value={uiConfig.sampleRate} min={4} max={128} step={1} onChange={(v: any) => updateConfig({ sampleRate: v })} />
            <LabSlider label="Amplitudinal Resolution" value={uiConfig.bitDepth} min={1} max={16} step={1} onChange={(v: any) => updateConfig({ bitDepth: v })} />
            <LabSlider label="Clock Instability" value={uiConfig.jitter} min={0} max={0.5} step={0.01} onChange={(v: any) => updateConfig({ jitter: v })} />
            
            <div className="pt-8 border-t border-white/5 space-y-6">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">Dither Filter</span>
                    <input 
                        type="checkbox" 
                        checked={uiConfig.dither} 
                        onChange={(e) => updateConfig({ dither: e.target.checked })}
                        className="w-5 h-5 rounded-lg border-white/10 bg-white/5 accent-orange-500 transition-all"
                    />
                </label>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Algorithm</span>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['zoh', 'sinc'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => updateConfig({ reconstruction: m as any })}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all duration-300 ${uiConfig.reconstruction === m ? 'bg-orange-500 text-black shadow-lg scale-105' : 'text-white/30 hover:text-white/60'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>

        {/* Center Canvas: Visualizer */}
        <main className="lg:col-span-2 space-y-8">
            <div className="relative h-[320px] w-full bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-inner group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <WaveRenderer 
                    analogPoints={results.analogPoints}
                    samples={results.samples}
                    reconstructedPoints={results.reconstructedPoints}
                    color={results.metrics.aliasing ? "#ef4444" : "#06b6d4"}
                />
                
                <div className="absolute top-8 left-8 flex gap-4">
                    <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                        {uiConfig.reconstruction === 'sinc' ? 'Inter-Sample Interpolation' : 'Zero-Order Hold'}
                    </div>
                </div>
            </div>

            {/* Error Spectrum Analyzer */}
            <div className="h-[120px] w-full bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col p-6 group">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Quantization Residual (LSB)</span>
                    <span className="text-[9px] font-mono text-orange-500/40 font-bold uppercase">Physics Real-time</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
                        <path 
                            d={results.samples.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${40 + p.error * 120}`).join(' ')} 
                            fill="none" 
                            stroke="#f97316" 
                            strokeWidth="1.5" 
                            strokeOpacity="0.4"
                        />
                        <line x1="0" y1="40" x2="600" y2="40" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    </svg>
                </div>
            </div>
        </main>

        {/* Right Panel: Metrics HUD */}
        <section className="lg:col-span-1 space-y-4">
            <MetricBox icon={Activity} label="Dynamic Range" value={`${results.metrics.snr.toFixed(1)} dB`} sub="Theoretical SNR" />
            <MetricBox icon={Hash} label="Linearity" value={`${results.metrics.enob.toFixed(2)}`} sub="Effective Bits" />
            <MetricBox icon={Target} label="Distortion" value={`${results.metrics.thdn.toFixed(1)} dB`} sub="THD + Noise" />
            <MetricBox icon={ShieldCheck} label="Linearization" value={uiConfig.dither ? "Triangular" : "None"} sub="Dither Status" active={uiConfig.dither} />
            
            <div className="p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 mt-6 group hover:bg-orange-500/10 transition-colors duration-500">
                <p className="text-[11px] leading-relaxed text-white/30 italic font-medium">
                    "Increasing bit depth doesn't make it louder; it pushes the floor down, revealing the silence between the waves."
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-500/40" />
                    <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-orange-500/40">Design Insight</span>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};
