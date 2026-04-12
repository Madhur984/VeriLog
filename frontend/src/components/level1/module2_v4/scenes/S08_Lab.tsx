import React, { useState, useMemo, memo } from 'react';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Sliders, Activity, ShieldCheck, Hash, Target } from 'lucide-react';
import { useDebounce } from '../../../../hooks/useDebounce';

/**
 * Optimized Metric Box
 */
/**
 * Optimized Metric Box
 */
const MetricBox = memo(({ icon: Icon, label, value, sub, active = true, isDarkMode }: any) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-white/30' : 'text-gray-400';
    const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
    const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
    const bgColor = isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm';

    return (
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${active ? `${borderColor} ${bgColor}` : 'opacity-30'}`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon size={14} className={active ? accentColor : (isDarkMode ? 'text-white/20' : 'text-gray-300')} />
                <span className={`text-[10px] font-mono uppercase tracking-widest ${subTextColor}`}>{label}</span>
            </div>
            <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{value}</div>
            <div className={`text-[9px] font-mono uppercase mt-1.5 ${subTextColor}`}>{sub}</div>
        </div>
    );
});

/**
 * Optimized Lab Slider
 */
const LabSlider = memo(({ label, value, min, max, step, onChange, isDarkMode }: any) => {
    const accentColorClass = isDarkMode ? `accent-orange-500` : `accent-orange-600`;
    const textColorClass = isDarkMode ? `text-orange-500` : `text-orange-600`;
    
    return (
        <div className="group space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
                <span className={`${isDarkMode ? 'text-white/30' : 'text-gray-500'} group-hover:opacity-80 transition-opacity`}>{label}</span>
                <span className={`${textColorClass} font-black`}>{value.toFixed(step < 1 ? 2 : 0)}</span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step} 
                value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))} 
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} ${accentColorClass}`}
            />
        </div>
    );
});

/**
 * Specialized Wave Renderer (Memoized)
 */
const WaveRenderer = memo(({ analogPoints, samples, reconstructedPoints, isDarkMode, aliasing }: any) => {
    const strokeColor = aliasing 
        ? '#ef4444' 
        : (isDarkMode ? '#06b6d4' : '#0891b2');
    
    return (
        <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="drop-shadow-2xl">
            {/* Analog Path (Background) */}
            <path 
                d={analogPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={isDarkMode ? 'white' : 'black'} 
                strokeWidth="1" 
                strokeOpacity="0.05" 
                strokeDasharray="4 4" 
            />
            
            {/* Reconstructed Path (Hero) */}
            <path 
                d={reconstructedPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth="3"
                style={{ filter: isDarkMode ? `drop-shadow(0 0 12px ${strokeColor}88)` : 'none' }}
                className="transition-all duration-500"
            />

            {/* Sampling Points */}
            {samples.map((p: any, i: number) => (
                <circle 
                    key={i} 
                    cx={p.x} 
                    cy={p.y} 
                    r="3" 
                    fill={isDarkMode ? "#f97316" : "#ea580c"} 
                    stroke={isDarkMode ? "rgba(0,0,0,0.5)" : "white"}
                    strokeWidth="1"
                    className="transition-all duration-300" 
                />
            ))}
        </svg>
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

  const engineConfig = useDebounce(uiConfig, 32); 

  const results = useMemo(() => 
    SignalEngine(engineConfig, time, 600, 250), [engineConfig, time]
  );

  const updateConfig = (patch: Partial<SignalConfig>) => {
    setUiConfig(prev => ({ ...prev, ...patch }));
  };

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/40' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-gray-50 border-gray-200 shadow-xl';
  const innerBg = isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white border-gray-100 shadow-inner';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';

  // --- Challenge Mode Logic ---
  const [challengeMode, setChallengeMode] = useState(false);
  const [targetConfig] = useState<SignalConfig>({
    frequency: 1.5,
    amplitude: 80,
    sampleRate: 48,
    bitDepth: 12,
    jitter: 0,
    dither: true,
    reconstruction: 'sinc'
  });

  const accuracy = useMemo(() => {
    if (!challengeMode) return 100;
    const freqErr = Math.abs(uiConfig.frequency - targetConfig.frequency) / targetConfig.frequency;
    const rateErr = Math.abs(uiConfig.sampleRate - targetConfig.sampleRate) / targetConfig.sampleRate;
    const bitErr = Math.abs(uiConfig.bitDepth - targetConfig.bitDepth) / targetConfig.bitDepth;
    const totalErr = (freqErr + rateErr + bitErr) / 3;
    return Math.max(0, Math.min(100, 100 - totalErr * 100));
  }, [challengeMode, uiConfig, targetConfig]);

  const targetResults = useMemo(() => 
    SignalEngine(targetConfig, time, 600, 250), [targetConfig, time]
  );

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto">
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-10 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="space-y-4">
            <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
                Signal <span className={accentColor}>Forge</span> <span className={`${isDarkMode ? 'text-white/10' : 'text-gray-200'} italic text-3xl ml-2`}>v3.0</span>
            </h2>
            <p className={`text-lg max-w-xl leading-relaxed font-medium ${subTextColor}`}>
                Advanced inter-sample measurement suite. Precision windowed sinc reconstruction 
                with real-time quantization error profiling.
            </p>
        </div>

        <div className="flex items-center gap-12 mt-8 md:mt-0">
            {challengeMode && (
                <div className="flex flex-col items-end mr-8">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Forge Accuracy</span>
                    <span className={`text-2xl font-black italic ${accuracy > 95 ? 'text-green-500' : accentColor}`}>
                        {accuracy.toFixed(1)}%
                    </span>
                </div>
            )}
            <div className="flex flex-col items-end">
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Nyquist Integrity</span>
                <span className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${results.metrics.aliasing ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${results.metrics.aliasing ? 'bg-red-500' : 'bg-green-500'}`} />
                    {results.metrics.aliasing ? 'Violation Detected' : 'Phase Balanced'}
                </span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar: Controls */}
        <aside className={`lg:col-span-1 p-10 rounded-[2.5rem] border space-y-12 ${cardBg}`}>
            <div className="flex items-center justify-between mb-8">
                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] ${accentColor}`}>
                    <Sliders size={16} /> Parameters
                </div>
                <button 
                    onClick={() => setChallengeMode(!challengeMode)}
                    className={`p-2 rounded-lg border transition-all ${challengeMode 
                        ? (isDarkMode ? 'bg-orange-500 text-black border-orange-500' : 'bg-orange-600 text-white border-orange-600') 
                        : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500')}`}
                >
                    <Target size={14} />
                </button>
            </div>
            
            <LabSlider label="Fundamental Wave" value={uiConfig.frequency} min={0.1} max={5} step={0.1} onChange={(v: any) => updateConfig({ frequency: v })} isDarkMode={isDarkMode} />
            <LabSlider label="Sampling Frequency" value={uiConfig.sampleRate} min={4} max={128} step={1} onChange={(v: any) => updateConfig({ sampleRate: v })} isDarkMode={isDarkMode} />
            <LabSlider label="Bit Depth (LSB)" value={uiConfig.bitDepth} min={1} max={16} step={1} onChange={(v: any) => updateConfig({ bitDepth: v })} isDarkMode={isDarkMode} />
            <LabSlider label="Temporal Jitter" value={uiConfig.jitter} min={0} max={0.5} step={0.01} onChange={(v: any) => updateConfig({ jitter: v })} isDarkMode={isDarkMode} />
            
            <div className={`pt-10 border-t space-y-10 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className={`text-[10px] font-mono uppercase tracking-widest group-hover:opacity-80 transition-all ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Dither Injection</span>
                    <input 
                        type="checkbox" 
                        checked={uiConfig.dither} 
                        onChange={(e) => updateConfig({ dither: e.target.checked })}
                        className={`w-6 h-6 rounded-xl border transition-all ${isDarkMode ? 'border-white/10 bg-white/5 accent-orange-500' : 'border-gray-300 bg-white accent-orange-600'}`}
                    />
                </label>
                <div className="space-y-4">
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Reconstruction Engine</span>
                    <div className={`flex p-1.5 rounded-2xl border shadow-inner ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                        {['zoh', 'sinc'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => updateConfig({ reconstruction: m as any })}
                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${uiConfig.reconstruction === m 
                                    ? (isDarkMode ? 'bg-orange-500 text-black shadow-lg scale-105' : 'bg-orange-600 text-white shadow-lg scale-105') 
                                    : (isDarkMode ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600')}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>

        {/* Center Canvas: Visualizer */}
        <main className="lg:col-span-2 space-y-10">
            <div className={`relative h-[360px] w-full rounded-[3rem] border overflow-hidden p-2 ${innerBg}`}>
                <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-gradient-to-b from-white/[0.02] to-transparent' : 'bg-gradient-to-b from-black/[0.01] to-transparent'}`} />
                <WaveRenderer 
                    analogPoints={results.analogPoints}
                    samples={results.samples}
                    reconstructedPoints={results.reconstructedPoints}
                    isDarkMode={isDarkMode}
                    aliasing={results.metrics.aliasing}
                />
                
                {challengeMode && (
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <path 
                            d={targetResults.reconstructedPoints.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={isDarkMode ? 'white' : 'black'} 
                            strokeWidth="8" 
                            strokeDasharray="10 5"
                        />
                    </div>
                )}
                
                <div className="absolute top-10 left-10">
                    <div className={`px-5 py-2.5 rounded-full backdrop-blur-xl border text-[10px] font-black uppercase tracking-widest shadow-2xl ${isDarkMode ? 'bg-black/60 border-white/10 text-white/40' : 'bg-white/80 border-gray-200 text-gray-400'}`}>
                        {uiConfig.reconstruction === 'sinc' ? 'Inter-Sample Recovery' : 'Discrete Step Function'}
                    </div>
                </div>
            </div>

            {/* Error Spectrum Analyzer */}
            <div className={`h-[160px] w-full rounded-[2.5rem] border overflow-hidden flex flex-col p-8 transition-colors duration-500 ${cardBg}`}>
                <div className="flex justify-between items-center mb-6">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Quantization Residual (Noise Floor)</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                        <span className={`text-[10px] font-mono font-black uppercase ${accentColor}`}>Live Spectral Data</span>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
                        <path 
                            d={results.samples.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${40 + p.error * 120}`).join(' ')} 
                            fill="none" 
                            stroke={isDarkMode ? "#f97316" : "#ea580c"} 
                            strokeWidth="2" 
                            strokeOpacity={isDarkMode ? "0.6" : "0.4"}
                            className="transition-all duration-300"
                        />
                        <line x1="0" y1="40" x2="600" y2="40" stroke={isDarkMode ? "white" : "black"} strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    </svg>
                </div>
            </div>
        </main>

        {/* Right Panel: Metrics HUD */}
        <section className="lg:col-span-1 space-y-6">
            <MetricBox icon={Activity} label="Dynamic Range" value={`${results.metrics.snr.toFixed(1)} dB`} sub="Theoretical SNR Window" isDarkMode={isDarkMode} />
            <MetricBox icon={Hash} label="Linearity" value={`${results.metrics.enob.toFixed(2)} bits`} sub="Effective Resolution" isDarkMode={isDarkMode} />
            <MetricBox icon={Target} label="Precision" value={`${results.metrics.thdn.toFixed(1)} dB`} sub="Quantization Accuracy" isDarkMode={isDarkMode} />
            <MetricBox icon={ShieldCheck} label="Inter-Sample State" value={uiConfig.reconstruction === 'sinc' ? "Mathematically Exact" : "Non-Ideal Approximation"} sub="Reconstruction Health" active={true} isDarkMode={isDarkMode} />
            
            <div className={`p-8 rounded-[2.5rem] border mt-10 transition-all duration-700 ${isDarkMode ? 'bg-orange-500/[0.03] border-orange-500/10' : 'bg-orange-50 border-orange-100'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${accentColor}`}>Engineer's Report</h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight">
                        <span className={subTextColor}>Theoretical Max</span>
                        <span className={textColor}>{(uiConfig.bitDepth * 6.02 + 1.76).toFixed(1)} dB</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                        <div 
                            className="h-full bg-orange-500 transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (results.metrics.snr / (uiConfig.bitDepth * 6.02 + 1.76)) * 100)}%` }} 
                        />
                    </div>
                    <p className={`text-[10px] leading-relaxed italic ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                        {results.metrics.aliasing 
                            ? "Aliasing detected: The reconstruction includes 'ghost' frequencies from the folding effect."
                            : uiConfig.bitDepth < 8 
                            ? "Low resolution: Significant quantization error masks low-level signal detail." 
                            : "Ideal Bridge: The digital representation preserves the analog intent with minimal residual loss."}
                    </p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};
