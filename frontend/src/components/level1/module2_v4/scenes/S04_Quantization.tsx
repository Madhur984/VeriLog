import React, { useState, useMemo } from 'react';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary } from 'lucide-react';

/**
 * S04_Quantization
 * Explains quantization steps, resolution, and SNR.
 */
export const S04_Quantization: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [bitDepth, setBitDepth] = useState(3);

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 48, 
    bitDepth: bitDepth,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [bitDepth]);

  const { analogPoints, reconstructedPoints } = useMemo(() => 
    SignalEngine(config, time, 600, 250), [config, time]
  );

  const levels = Math.pow(2, bitDepth);
  const gridLines = Array.from({ length: levels }, (_, i) => (i / (levels - 1)) * 200);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6 text-left">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          The <span className={accentColor}>Rung</span> Paradox
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              If sampling is **when** we look, quantization is **how precisely** we measure. 
              A computer has finite steps—it must round smooth reality to the nearest ladder rung.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black ${accentColor}`}>Precision Math</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   Number of available levels (L) for n bits:
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl text-xl font-bold ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/5' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                    L = 2^n
                </div>
            </div>
        </div>
      </header>

      <div className={`relative p-10 rounded-[3rem] border shadow-2xl transition-all duration-700 ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-4">
                    <div className={`flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.3em] font-black ${accentColor}`}>
                        <Binary size={24} /> Amplitude Resolver
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col items-end">
                            <span className={`text-[9px] font-mono uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Vertical Density</span>
                            <span className={`text-3xl font-black italic tracking-tighter ${textColor}`}>{levels} <span className={`text-xs uppercase tracking-widest not-italic ml-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Levels</span></span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-[9px] font-mono uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Current Resolution</span>
                            <span className={`text-3xl font-black italic tracking-tighter ${accentColor}`}>{bitDepth} Bits</span>
                        </div>
                    </div>
                </div>

                <div className={`relative h-[320px] rounded-[2.5rem] border overflow-hidden shadow-inner flex items-center justify-center transition-all ${innerBg}`}>
                    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-8">
                        {gridLines.map((y, i) => (
                            <line key={i} x1="0" y1={y + 25} x2="600" y2={y + 25} stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1" strokeOpacity="0.04" />
                        ))}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1.5" strokeOpacity="0.05" strokeDasharray="8 8" />
                        <path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" stroke={strokeColor} strokeWidth="4"
                            style={{ filter: isDarkMode ? `drop-shadow(0 0 20px ${strokeColor}88)` : 'none' }}
                        />
                    </svg>
                </div>
                <div className="space-y-8 px-6 mt-8">
                    <input 
                        type="range" min={1} max={8} step={1} value={bitDepth} 
                        onChange={(e) => setBitDepth(parseInt(e.target.value))}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-white/10 accent-white' : 'bg-gray-200 accent-gray-600 shadow-inner'}`}
                    />
                    <div className={`flex justify-between text-[11px] font-mono uppercase tracking-[0.2em] font-black ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                        <div className="flex flex-col gap-1 text-left">
                            <span className={textColor}>1 Bit</span>
                            <span>On / Off Only</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className={textColor}>8 Bits</span>
                            <span>256 Possible Rungs</span>
                        </div>
                    </div>

                    <div className={`mt-8 p-6 rounded-3xl border border-dashed text-left ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-100'}`}>
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${accentColor}`}>Engineer's Visual Mental Model</span>
                        <pre className={`mt-4 text-[11px] font-mono leading-relaxed overflow-x-auto ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
{`  3 BITS (8 levels):    ███ ███ ███ ███ (Blocky)
  4 BITS (16 levels):   ████▐████▐████▐ (Smoother)
  16 BITS (65k levels): ~~~~~~~~~~~~~~~~ (Perfect)`}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textColor}`}>
                        <span className="w-2 h-2 rounded-full bg-orange-500" /> The Ruler Problem
                    </h4>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        Imagine measuring a wave with a ruler that only has "inch" marks. You can't record 1.5 inches—you have to pick 1 or 2. That "rounding error" is **Quantization Noise**. 
                    </p>
                    <p className={`mt-4 text-[10px] italic ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                        *Next Level Hint:* We can hide this error using static noise called **Dither**. 
                    </p>
                </div>

                <div className={`flex-1 p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>The Golden Rule</h4>
                    <p className={`text-xs leading-relaxed font-black uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>The 6dB Per Bit Law</p>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        In audio and data, adding 1 bit of resolution reduces the noise floor by approximately **6.02 dB**. 16-bit audio (CD quality) has &gt; 96dB of dynamic range—meaning the noise is essentially silent.
                    </p>
                    <div className={`mt-6 p-4 rounded-xl border font-mono text-[10px] ${isDarkMode ? 'bg-black/40 border-white/5 text-white/40' : 'bg-white border-orange-200 text-gray-500'}`}>
                        SNR ≈ 6.02n + 1.76 dB
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* NEW: The Digital Microscope (Quantization Error Visualization) */}
      <div className={`p-12 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6 text-left">
                <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>
                    The Digital <span className={accentColor}>Microscope</span>
                </h3>
                <p className={`text-sm leading-relaxed font-medium ${subTextColor}`}>
                    To truly see the error, we must subtract the Original from the Copy. What remains is **Quantization Distortion**.
                </p>
                <div className={`p-6 rounded-3xl border border-dashed ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                    <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>Engineer's Insight</span>
                    <p className={`mt-2 text-[11px] leading-relaxed italic ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                        "At low bit depths, this noise follows the signal perfectly—making it sound 'harsh'. As we increase bits, the noise detaches and becomes a smooth floor."
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        title: "LSB (Least Significant Bit)",
                        desc: "The smallest possible change the system can record. This is the height of one single rung on your ladder.",
                        icon: "🧩",
                        metric: "Δ = V_fs / 2^n"
                    },
                    {
                        title: "Dynamic Range",
                        desc: "The ratio between the loudest possible signal and the quietest detail that doesn't get lost in noise.",
                        icon: "🔊",
                        metric: "DR = 20 log10(2^n)"
                    },
                    {
                        title: "Resolution floor",
                        desc: "Anything smaller than 1 LSB is invisible to the computer. It treats small movements as zero or jumps to the next rung.",
                        icon: "📉",
                        metric: "PRECISION LIMIT"
                    },
                    {
                        title: "Harmonic Distortion",
                        desc: "The mathematical byproduct of rounding. It adds 'phantom' frequencies that weren't in the original sound.",
                        icon: "👻",
                        metric: "ALIASING RELATIVES"
                    }
                ].map((item, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border text-left group transition-all duration-300 hover:scale-[1.02] ${isDarkMode ? 'bg-black/40 border-white/5 hover:border-orange-500/20' : 'bg-gray-50 border-gray-200 hover:border-orange-200 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-3xl">{item.icon}</span>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>{item.metric}</span>
                        </div>
                        <h4 className={`text-lg font-black italic mb-2 ${textColor}`}>{item.title}</h4>
                        <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
