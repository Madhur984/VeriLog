import React, { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { SignalEngine, SignalConfig } from '../SignalEngine';

/**
 * S06_Reconstruction: The Final Bridge
 * 1. Show phenomenon: The "staircase" vs the "smooth curve".
 * 2. Realization: Mathematics can fill the gaps between samples.
 * 3. Label: Sinc Interpolation / Low-pass Filtering.
 */
export const S06_Reconstruction: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [method, setMethod] = useState<'zoh' | 'sinc'>('zoh');

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 20,
    bitDepth: 8,
    jitter: 0,
    dither: false,
    reconstruction: method
  }), [method]);

  const { analogPoints, reconstructedPoints, samples } = useMemo(() => 
    SignalEngine(config, time, 600, 250), [config, time]
  );

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          The Final <span className={accentColor}>Bridge</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              The samples are just dots in a void. To turn them back into reality, we must 
              "connect" them. This magical reconstruction is the job of the **DAC**.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black ${accentColor}`}>The Sinc Function</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   Perfect math for a perfect curve:
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl text-xl font-bold ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/5' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                    y(t) = Σ y_n × sinc(t - nT)
                </div>
            </div>
        </div>
      </header>

      <div className={`p-10 rounded-[3rem] border shadow-2xl transition-all duration-700 ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl border transition-all duration-500 flex items-center justify-center ${method === 'sinc' ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] border-orange-500' : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200')}`}>
                            <Activity size={28} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Materialization Mode</span>
                            <span className={`text-2xl font-black uppercase tracking-tighter italic ${textColor}`}>
                                {method === 'zoh' ? 'Lego (Staircase)' : 'Clay (Natural)'}
                            </span>
                        </div>
                    </div>

                    <div className={`flex p-2 rounded-2xl border shadow-inner ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-200 border-gray-100'}`}>
                        {['zoh', 'sinc'].map((m) => (
                            <button 
                                key={m}
                                onClick={() => setMethod(m as any)}
                                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${method === m 
                                    ? (isDarkMode ? 'bg-orange-500 text-black shadow-lg scale-105 px-10' : 'bg-orange-600 text-white shadow-lg scale-105 px-10 border-orange-700') 
                                    : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-gray-500 hover:text-gray-900')}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`relative h-[320px] rounded-[2.5rem] border overflow-hidden shadow-inner flex items-center justify-center transition-all ${innerBg}`}>
                    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-8">
                        {/* Analog Reference */}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1.5" strokeOpacity="0.05" strokeDasharray="8 8" />
                        
                        {/* Reconstructed Path */}
                        <path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={method === 'sinc' ? strokeColor : (isDarkMode ? "#ffffff20" : "#64748b40")} 
                            strokeWidth="4"
                            className="transition-all duration-700"
                            style={{ filter: (method === 'sinc' && isDarkMode) ? `drop-shadow(0 0 20px ${strokeColor}88)` : 'none' }}
                        />

                        {/* Samples */}
                        {samples.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3" fill={isDarkMode ? "#f97316" : "#ea580c"} stroke={isDarkMode ? "#000" : "#fff"} strokeWidth="1.5" className="transition-all duration-300" />
                        ))}
                    </svg>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textColor}`}>
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Lego vs Clay
                    </h4>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                       **Zero-Order Hold (ZOH)** is like building with LEGO blocks—it's fast and easy, but jagged. **Sinc Interpolation** is like smoothing clay; it mathematically weaves through every point to recover the exact wave.
                    </p>
                </div>

                <div className={`flex-1 p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>The Brick Wall</h4>
                    <p className={`text-xs leading-relaxed font-black uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Reconstruction Filter</p>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        In the real world, we use a **Low-Pass Filter** set right at $Fs/2$. This filter "cuts off" the sharp staircase corners (high-frequency noise) and leaves behind nothing but the smooth original signal.
                    </p>
                    <div className={`mt-6 p-4 rounded-xl border flex items-center justify-center font-mono text-[10px] ${isDarkMode ? 'bg-black/60 border-white/5 text-white/30' : 'bg-white border-orange-200 text-gray-400'}`}>
                        STAIRCASE = SIGNAL + NOISE
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
