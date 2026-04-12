import React, { useState, useMemo } from 'react';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Zap, ShieldCheck } from 'lucide-react';

/**
 * S05_Dither: The Noise Cure
 */
export const S05_Dither: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [ditherEnabled, setDitherEnabled] = useState(false);

  const config = useMemo((): SignalConfig => ({
    frequency: 0.5,
    amplitude: 15, // Low amplitude to accentuate quantization artifacts
    sampleRate: 48,
    bitDepth: 3, // Very low bits to show the staircase clearly
    jitter: 0,
    dither: ditherEnabled,
    reconstruction: 'zoh'
  }), [ditherEnabled]);

  const { analogPoints, reconstructedPoints, metrics } = useMemo(() => 
    SignalEngine(config, time, 600, 250), [config, time]
  );

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode 
    ? (ditherEnabled ? 'bg-orange-500/5 border-orange-500/20 shadow-orange-500/5' : 'bg-black/40 border-white/10') 
    : (ditherEnabled ? 'bg-orange-50 border-orange-200 shadow-orange-100' : 'bg-gray-50 border-gray-200');
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          The <span className={accentColor}>Noise</span> Cure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              Quantization doesn't just add noise—it adds **correlated distortion**. 
              At low bit depths, signals get "stuck" on rungs. **Dither** adds random noise to shake them free.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black ${accentColor}`}>The SNR Law</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   Total Dynamic Range (Max Signal / Noise):
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl text-xl font-bold ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/5' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                    SNR ≈ 6.02 × n + 1.76 dB
                </div>
            </div>
        </div>
      </header>

      <div className={`p-10 rounded-[3rem] border transition-all duration-700 shadow-2xl ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl border transition-all duration-500 flex items-center justify-center ${ditherEnabled 
                            ? (isDarkMode ? 'border-orange-500/40 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'border-orange-200 bg-orange-50') 
                            : (isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-100')}`}>
                            <ShieldCheck className={ditherEnabled ? accentColor : (isDarkMode ? 'text-white/20' : 'text-gray-400')} size={28} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Linearization</span>
                            <span className={`text-2xl font-black uppercase tracking-tighter italic transition-colors ${ditherEnabled ? accentColor : (isDarkMode ? 'text-white/40' : 'text-gray-400')}`}>
                                {ditherEnabled ? 'Linearized Dither' : 'Raw Quantization'}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setDitherEnabled(!ditherEnabled)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-full border font-black uppercase tracking-widest text-[11px] transition-all duration-300 transform active:scale-95 ${ditherEnabled 
                            ? (isDarkMode ? 'bg-orange-500 text-black border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'bg-orange-600 text-white border-orange-600 shadow-lg') 
                            : (isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 shadow-sm')}`}
                    >
                        <Zap size={14} className={ditherEnabled ? 'animate-pulse' : ''} /> {ditherEnabled ? 'Remove Noise' : 'Apply Dither'}
                    </button>
                </div>

                <div className={`relative h-[320px] rounded-[2.5rem] border overflow-hidden shadow-inner flex items-center justify-center transition-all ${innerBg}`}>
                    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-8">
                        {/* Analog Reference */}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1.5" strokeOpacity="0.05" strokeDasharray="8 8" />
                        
                        {/* Reconstructed Path */}
                        <path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={ditherEnabled ? strokeColor : (isDarkMode ? "#ffffff20" : "#64748b40")} 
                            strokeWidth="4"
                            style={{ filter: (ditherEnabled && isDarkMode) ? `drop-shadow(0 0 20px ${strokeColor}88)` : 'none' }}
                        />

                        {!ditherEnabled && (
                            <text x="50%" y="85%" textAnchor="middle" className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black ${isDarkMode ? 'fill-red-500/30' : 'fill-red-600/40'}`}>Harmonic Distortion Active</text>
                        )}
                    </svg>
                </div>

                <div className="grid grid-cols-2 gap-10 px-8">
                    <div className="space-y-4">
                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Dynamic Range (SNR)</span>
                        <div className={`h-16 flex items-center justify-between px-8 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5 shadow-black' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                            <span className={`text-xl font-black italic ${textColor}`}>{metrics.snr.toFixed(1)} dB</span>
                            <span className={`text-[9px] font-mono uppercase font-black px-3 py-1 rounded-lg ${isDarkMode ? 'bg-white/5 text-white/30' : 'bg-white text-gray-400 shadow-sm'}`}>Current Floor</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600/60'}`}>Signal Linearity</span>
                        <div className={`h-16 flex items-center justify-between px-8 rounded-2xl border ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                            <span className={`text-xl font-black italic ${accentColor}`}>{(metrics.enob).toFixed(2)} Bits</span>
                            <span className={`text-[9px] font-mono uppercase font-black px-3 py-1 rounded-lg ${isDarkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-white text-orange-600 shadow-sm'}`}>Effective Bits</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textColor}`}>
                        <span className="w-2 h-2 rounded-full bg-orange-500" /> The Noise Paradox
                    </h4>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        Wait, adding noise makes things *better*? Yes! In low-bit systems, the "staircase" is actually repeating patterns of distortion. Dither breaks these patterns, turning harsh clicks into a smooth, white-noise floor.
                    </p>
                </div>

                <div className={`flex-1 p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>The Holy Water</h4>
                    <p className={`text-xs leading-relaxed font-black uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Shaking the Signal Free</p>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        Think of a ball sitting in a dent on a table. To get a true measurement, you **shake the table** (dither). The ball now "floats" around its average position, allowing for a measurement more precise than the dent itself.
                    </p>
                    <div className={`mt-6 p-5 rounded-2xl border flex flex-col gap-2 ${isDarkMode ? 'bg-black/40 border-orange-500/10' : 'bg-white border-orange-200'}`}>
                        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest font-black">
                            <span className={subTextColor}>Distortion</span>
                            <span className="text-red-500">Harmonic Errors</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest font-black">
                            <span className={subTextColor}>Dither</span>
                            <span className={accentColor}>Linear Fidelity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
