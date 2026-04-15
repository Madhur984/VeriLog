import React, { useState, useMemo, memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Sliders, Activity, ShieldCheck, Hash, Target, Zap, Terminal, Settings, Play, Database, Info } from 'lucide-react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { useModule2Audio } from '../hooks/useModule2Audio';

/**
 * MetricBox: THE HUD MODULE
 */
const MetricBox = memo(({ icon: Icon, label, value, sub, active = true, isDarkMode }: any) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-white/30' : 'text-gray-400';
    const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
    const borderColor = isDarkMode ? 'border-white/10 shadow-2xl' : 'border-gray-200 shadow-sm';
    const bgColor = isDarkMode ? 'bg-white/5' : 'bg-white';

    return (
        <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${active ? `${borderColor} ${bgColor}` : 'opacity-30'}`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon size={14} className={active ? accentColor : (isDarkMode ? 'text-white/20' : 'text-gray-300')} />
                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] font-black ${subTextColor}`}>{label}</span>
            </div>
            <div className={`text-3xl font-black italic tracking-tighter ${textColor}`}>{value}</div>
            <div className={`text-[9px] font-mono uppercase mt-2 font-bold ${subTextColor}`}>{sub}</div>
        </div>
    );
});

/**
 * LabSlider: INDUSTRIAL CONTROL
 */
const LabSlider = memo(({ label, value, min, max, step, onChange, isDarkMode }: any) => {
    const accentColorClass = isDarkMode ? `accent-orange-500` : `accent-orange-600`;
    const textColorClass = isDarkMode ? `text-orange-500` : `text-orange-600`;
    
    return (
        <div className="group space-y-3">
            <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase font-black">
                <span className={`${isDarkMode ? 'text-white/20' : 'text-gray-400'} group-hover:opacity-80 transition-opacity`}>{label}</span>
                <span className={`${textColorClass}`}>{value.toFixed(step < 1 ? 2 : 0)}</span>
            </div>
            <input 
                type="range" min={min} max={max} step={step} value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))} 
                className={`w-full h-1 rounded-full appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} ${accentColorClass}`}
            />
        </div>
    );
});

export const S08_Lab: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [uiConfig, setUiConfig] = useState<SignalConfig>({
    frequency: 1,
    amplitude: 60,
    sampleRate: 24,
    bitDepth: 8,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  });

  const [labLogs, setLabLogs] = useState<string[]>(["FORGE_STATION: STANDBY"]);

  const engineConfig = useDebounce(uiConfig, 32); 
  const results = useMemo(() => SignalEngine(engineConfig, time, 600, 250), [engineConfig, time]);

  // --- Audio Engine (Final Scape) ---
  const { createOscillator, createGain, updateGain } = useModule2Audio();

  const handleUpdate = (patch: Partial<SignalConfig>) => {
    createOscillator('drone-s08', 'sine', 40).connect(createGain('forge-gain', 0));
    setUiConfig(prev => ({ ...prev, ...patch }));
  };

  // Sync Audio to Lab parameters
  useEffect(() => {
    const errorVol = (1 - (uiConfig.bitDepth / 16)) * 0.05;
    updateGain('forge-gain', errorVol);
  }, [uiConfig.bitDepth, updateGain]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/40' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-gray-50 border-gray-100 shadow-xl';

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto mb-20 text-left">
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-12 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="space-y-4">
            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-flex ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                Lab Session // Signal Forge v4.0
            </div>
            <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
                The Signal <span className={accentColor}>Forge</span>
            </h2>
            <p className={`text-lg font-medium max-w-xl opacity-60 ${textColor}`}>
                Welcome to the forge. Here, you control the bridge between nature and numbers. Adjust the parameters to see how well you can capture reality.
            </p>
        </div>
        <div className="flex gap-8 mt-10 md:mt-0">
             <div className="space-y-1 text-right">
                <span className={`text-[9px] font-mono tracking-widest uppercase opacity-30 ${textColor}`}>Signal Integrity</span>
                <div className={`text-sm font-black flex items-center gap-2 ${results.metrics.aliasing ? 'text-red-500' : 'text-green-500'}`}>
                     <div className={`w-2 h-2 rounded-full ${results.metrics.aliasing ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                     {results.metrics.aliasing ? 'ALIASING DETECTED' : 'CLEAN CAPTURE'}
                </div>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* CONTROL DECK */}
        <aside className={`lg:col-span-1 p-10 rounded-[3rem] border space-y-12 transition-all duration-700 ${cardBg}`}>
            <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] ${accentColor}`}>
                <Settings size={16} /> Forge Controls
            </div>
            <div className="space-y-10 pt-4">
                <LabSlider label="Wave Frequency" value={uiConfig.frequency} min={0.1} max={5} step={0.1} onChange={(v: any) => handleUpdate({ frequency: v })} isDarkMode={isDarkMode} />
                <LabSlider label="Sampling Rate" value={uiConfig.sampleRate} min={4} max={128} step={1} onChange={(v: any) => handleUpdate({ sampleRate: v })} isDarkMode={isDarkMode} />
                <LabSlider label="Bit Depth" value={uiConfig.bitDepth} min={1} max={16} step={1} onChange={(v: any) => handleUpdate({ bitDepth: v })} isDarkMode={isDarkMode} />
                <LabSlider label="Temporal Jitter" value={uiConfig.jitter} min={0} max={0.5} step={0.01} onChange={(v: any) => handleUpdate({ jitter: v })} isDarkMode={isDarkMode} />
            </div>
            <div className={`pt-10 border-t space-y-10 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="space-y-4">
                    <div className={`flex p-1.5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200 shadow-inner'}`}>
                        {[
                            { id: 'zoh', label: 'Snap', aria: 'Zero-Order Hold' },
                            { id: 'sinc', label: 'Liquid', aria: 'Sinc Interpolation' }
                        ].map((m) => (
                            <button 
                                key={m.id} onClick={() => {
                                    handleUpdate({ reconstruction: m.id as any });
                                    setLabLogs(prev => [`SYS: RECONSTRUCTION_SWAP [${m.id}]`, ...prev.slice(0, 5)]);
                                }} 
                                aria-pressed={uiConfig.reconstruction === m.id}
                                aria-label={m.aria}
                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${uiConfig.reconstruction === m.id ? 'bg-orange-500 text-white shadow-lg' : 'opacity-30 hover:opacity-100'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* LAB LOGS (NEW) */}
                <div className="space-y-4">
                    <span className={`text-[9px] font-mono uppercase tracking-widest opacity-30 ${textColor}`}>Forge History</span>
                    <div className={`p-4 rounded-2xl border font-mono text-[8px] space-y-2 h-24 overflow-hidden ${isDarkMode ? 'bg-black/40 border-white/5 text-orange-500/50' : 'bg-gray-100 border-gray-200 text-orange-700/50'}`}>
                         {labLogs.map((log, i) => (
                             <div key={i} className={i === 0 ? 'opacity-100' : 'opacity-50'}>{log}</div>
                         ))}
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Dither Active</span>
                            <span className="text-[8px] opacity-40 font-mono">Shake the bits free</span>
                        </div>
                        <input 
                            type="checkbox" checked={uiConfig.dither} 
                            onChange={(e) => handleUpdate({ dither: e.target.checked })}
                            className={`w-6 h-6 rounded-lg appearance-none border transition-all ${uiConfig.dither ? 'bg-orange-500 border-orange-500' : 'bg-white/5 border-white/10'}`}
                            aria-label="Toggle Dither in Lab"
                        />
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Show Reference</span>
                            <span className="text-[8px] opacity-40 font-mono">Compare to Ideal Wave</span>
                        </div>
                        <button 
                            onClick={() => setUiConfig(prev => ({ ...prev, showReference: !((prev as any).showReference) }))}
                            aria-pressed={(uiConfig as any).showReference}
                            className={`w-12 h-6 rounded-full border relative transition-all ${(uiConfig as any).showReference ? 'bg-orange-500/20 border-orange-500' : 'bg-white/5 border-white/10'}`}
                        >
                            <motion.div 
                                animate={{ x: (uiConfig as any).showReference ? 24 : 4 }}
                                className={`absolute top-1 w-3 h-3 rounded-full bg-orange-500`} 
                            />
                        </button>
                    </label>
                </div>
            </div>
        </aside>

        {/* MASTER VISUALIZER */}
        <main className="lg:col-span-2 space-y-8">
            <div className={`relative h-[480px] w-full rounded-[4rem] border overflow-hidden p-10 flex items-center justify-center transition-all duration-700 cursor-grab active:cursor-grabbing ${isDarkMode ? 'bg-black/60 border-white/10 shadow-2xl shadow-orange-500/5' : 'bg-white border-gray-200'}`}>
                 {/* GRID DECORATION */}
                 <div className="absolute inset-x-10 top-[20%] bottom-[20%] overflow-hidden pointer-events-none opacity-20">
                     <motion.div 
                        animate={uiConfig.jitter > 0 ? { 
                            x: [0, (Math.random() - 0.5) * 5 * uiConfig.jitter, 0],
                            y: [0, (Math.random() - 0.5) * 5 * uiConfig.jitter, 0]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className={`w-full h-full border-y border-dashed ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`} 
                     />
                 </div>
                 
                 <svg width="100%" height="80%" viewBox="0 0 600 250" preserveAspectRatio="none">
                    <motion.path 
                        animate={{ opacity: (uiConfig as any).showReference ? 0.3 : 0.05 }}
                        d={results.analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                        fill="none" stroke={isDarkMode ? 'white' : 'black'} 
                        strokeWidth="1.5" strokeDasharray="4 4" 
                    />
                    <path 
                        d={results.reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                        fill="none" stroke={results.metrics.aliasing ? '#ef4444' : (isDarkMode ? '#ffedd5' : '#ea580c')} 
                        strokeWidth="4" style={{ filter: isDarkMode ? `drop-shadow(0 0 15px ${results.metrics.aliasing ? '#ef4444' : '#f97316'}44)` : 'none' }}
                    />
                    {results.samples.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={isDarkMode ? 'white' : 'black'} fillOpacity="0.4" />
                    ))}
                 </svg>

                 <div className="absolute bottom-10 left-12 flex items-center gap-4 text-[9px] font-mono tracking-widest font-black uppercase opacity-20">
                    <Terminal size={12} /> Master Output Monitor
                 </div>
                  <div className={`absolute top-10 right-12 px-6 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-700 font-bold'}`}>
                    Resolution: {uiConfig.bitDepth}-BIT
                 </div>
            </div>

            {/* ERROR SPECTRUM HUD */}
            <div className={`h-[180px] rounded-[3rem] border border-dashed flex flex-col p-8 transition-all duration-700 ${cardBg}`}>
                <div className="flex justify-between items-center mb-6">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black opacity-30 ${textColor}`}>Residual Noise Floor</span>
                    <span className={`text-[10px] font-mono font-black uppercase ${accentColor}`}>THD+N: {results.metrics.thdn.toFixed(2)} dB</span>
                </div>
                <div className="flex-1 flex items-center">
                    <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
                         <path d={results.samples.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${40 + p.error * 120}`).join(' ')} 
                            fill="none" stroke={accentColor} strokeWidth="2.5" strokeOpacity="0.6" />
                         <line x1="0" y1="40" x2="600" y2="40" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1" strokeOpacity="0.1" />
                    </svg>
                </div>
            </div>
        </main>

        {/* METRICS HUD */}
        <section className="lg:col-span-1 space-y-6">
            <MetricBox icon={Activity} label="Dynamic Range" value={`${results.metrics.snr.toFixed(1)} dB`} sub="SNR @ Window Limit" isDarkMode={isDarkMode} />
            <MetricBox icon={Target} label="Precision" value={`${results.metrics.enob.toFixed(2)} bits`} sub="Effective Resolution" isDarkMode={isDarkMode} />
            <MetricBox icon={ShieldCheck} label="Inter-Sample State" value={uiConfig.reconstruction === 'sinc' ? "Exact" : "Approx"} sub="Reconstruction Health" isDarkMode={isDarkMode} />
            
            <div className={`p-10 rounded-[2.5rem] border mt-10 transition-all duration-700 ${isDarkMode ? 'bg-orange-500/[0.04] border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100 shadow-inner'}`}>
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Target size={14} className="text-orange-500" />
                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Forge Challenge</h4>
                    </div>
                    {results.metrics.enob > 11 && uiConfig.sampleRate < 40 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 text-white px-2 py-0.5 rounded text-[8px] font-black">SOLVED</motion.div>
                    )}
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className={`text-[9px] font-bold uppercase opacity-40 ${textColor}`}>Goal: ENOB {'>'} 11 bits @ Fs {'<'} 40 Hz</span>
                        <span className={`text-sm font-black italic ${accentColor}`}>{results.metrics.enob.toFixed(1)} Bits</span>
                    </div>
                    <p className={`text-[10px] leading-relaxed italic ${subTextColor}`}>
                        Trade-off vertical precision against temporal cost. Can you capture a high-fidelity signal with a slow sample rate?
                    </p>
                 </div>
            </div>
        </section>
      </div>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "The Signal Forge: A research-grade laboratory for validating the Digital Bridge. This station simulates the non-ideal behavior of real-world converters, from quantization harmonics to temporal jitter.",
              physical: "The Master Trade-off: High-resolution (high bit depth) requires exponentially more precise hardware, while high banding (sampling rate) is limited by the propagation delay of the silicon logic gates.",
              formal: "System Optimization: Performance is measured by SINAD (Signal-to-Noise and Distortion ratio). A clean system maximizes SINAD by balancing the Nyquist requirement with the quantization floor.",
              insight: "Operational Insight: In production hardware, we never 'guess' at parameters. Every choice—from the dither kernel to the filter steepness—is a calculated response to the specific noise environment.",
              advanced: [
                  {
                      title: "Spectral Leakage",
                      content: "When analyzing signals, if the capture window doesn't contain an integer number of cycles, energy 'leaks' into adjacent frequency bins. This spectral leakage can mask low-level detail and lower the perceived ENOB."
                  },
                  {
                      title: "Cumulative Jitter",
                      content: "Jitter in the sampling clock acts as phase noise. For high-frequency signals, even femtoseconds of jitter can lower the effective resolution by several bits, as the timing error translates to a vertical voltage error."
                  }
              ]
          }}
      />
    </div>
  );
};
