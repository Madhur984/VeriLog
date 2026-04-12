import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Timer } from 'lucide-react';

/**
 * S02_Sampling
 * Demonstrates sampling theory and Nyquist-Shannon theorem.
 */
export const S02_Sampling: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [sampleRate, setSampleRate] = useState(12);

  const config = useMemo((): SignalConfig => ({
    frequency: 0.5,
    amplitude: 70,
    sampleRate: sampleRate,
    bitDepth: 12,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [sampleRate]);

  const { analogPoints, samples } = useMemo(() => 
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
      <header className="space-y-6 text-left">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          The Temporal <span className={accentColor}>Blink</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              A computer cannot watch the world continuously. It takes snapshots — **samples** — 
              at fixed intervals. The speed of this "blink" determines what reality you capture.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-white border-orange-200 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>The Nyquist Theorem</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   To avoid missing the pattern, you must sample at **more than twice** the highest frequency (f-max).
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/5' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                    Fs &gt; 2 × f-max
                </div>
                <p className={`text-[10px] italic leading-tight ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                    Why not exactly 2x? Because of **Phase Ambiguity**. If you sample exactly at zero-crossings, you see nothing. Real signals need a tiny margin.
                </p>
            </div>
        </div>
      </header>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10`}>
        <div className={`lg:col-span-8 p-10 rounded-[3rem] border space-y-10 shadow-2xl transition-all duration-700 ${cardBg}`}>
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col text-left">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Sampling Frequency (Fs)</span>
                    <span className={`text-3xl font-black italic tracking-tighter ${accentColor}`}>{sampleRate} <span className={`text-xs uppercase tracking-widest not-italic ml-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Hz</span></span>
                </div>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                    <Timer className={accentColor} size={28} />
                </div>
            </div>

            <div className={`relative h-[280px] rounded-[2rem] border overflow-hidden shadow-inner flex items-center justify-center transition-all ${innerBg}`}>
                <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
                    <path 
                        d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                        fill="none" 
                        stroke={isDarkMode ? 'white' : '#64748b'} 
                        strokeWidth="2" 
                        strokeOpacity={isDarkMode ? '0.05' : '0.15'} 
                        strokeDasharray="6 6" 
                    />
                    {samples.map((p, i) => (
                        <motion.g key={i}>
                            <line x1={p.x} y1={125} x2={p.x} y2={p.y} stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="2 2" />
                            <circle cx={p.x} cy={p.y} r="4.5" fill={strokeColor} style={{ filter: isDarkMode ? `drop-shadow(0 0 10px ${strokeColor})` : 'none' }} />
                        </motion.g>
                    ))}
                </svg>
            </div>

            <div className="space-y-8 px-4">
                <div className="space-y-4">
                    <input 
                        type="range" min={4} max={48} step={1} value={sampleRate} 
                        onChange={(e) => setSampleRate(parseInt(e.target.value))}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 accent-orange-500' : 'bg-gray-200 accent-orange-600'}`}
                    />
                    <div className={`flex justify-between text-[10px] font-mono uppercase tracking-[0.4em] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                        <span>Slow Snapshots</span>
                        <span>High Fidelity</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>Practical Margin</h4>
                <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                    CD Audio uses **44.1 kHz**. If human hearing is 20 kHz, why the extra 4.1 kHz? It provides room for analog filters to roll off without distorting the music.
                </p>
            </div>
            <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest ${accentColor}`}>Engineer's Visual Mental Model</span>
                <pre className={`mt-4 text-[11px] font-mono leading-relaxed overflow-x-auto ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
{`  WAVE:  /\\  /\\  /\\
  SLOW:  .     .     .
  FAST:  .......
  Slower than 2x? 
  You miss the peak!`}
                </pre>
            </div>
        </div>
      </div>

      {/* NEW: The Sampling Microscope */}
      <div className={`mt-16 p-12 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6 text-left">
                <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>
                    The Sampling <span className={accentColor}>Microscope</span>
                </h3>
                <p className={`text-sm leading-relaxed font-medium ${subTextColor}`}>
                    Zooming into the moment of capture. Here is what happens when the computer "blinks".
                </p>
                <div className={`p-6 rounded-3xl border border-dashed ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                    <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>Engineer's Fact</span>
                    <p className={`mt-2 text-[11px] leading-relaxed italic ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                        "A perfect sampler takes zero time to measure. In reality, we have **Aperture Jitter**—the tiny uncertainty in *exactly* when the sample was taken."
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        title: "Discrete Time",
                        desc: "Once sampled, time is no longer a sliding scale. It becomes a sequence of indices: n=0, 1, 2...",
                        icon: "📉",
                        metric: "n [INDEX]"
                    },
                    {
                        title: "Shannon's Proof",
                        desc: "Claude Shannon proved that if you follow the Nyquist rule, you lose **ZERO** information. You can reconstruct the original perfectly.",
                        icon: "🎓",
                        metric: "LOSSLESS BRIDGE"
                    },
                    {
                        title: "The Heartbeat (T)",
                        desc: "The time between samples. $T = 1 / Fs$. A smaller T means more data, but higher fidelity.",
                        icon: "💓",
                        metric: "PERIOD"
                    },
                    {
                        title: "Clock Jitter",
                        desc: "Tiny timing errors in the clock. It creates 'phase noise' that can blur the fine details of a signal.",
                        icon: "🎢",
                        metric: "TEMPORAL NOISE"
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
      {/* Formal Mathematical Proof Manuscript */}
      <div className={`mt-16 p-1 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className={`p-16 rounded-[3.4rem] ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
              <div className="max-w-4xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                      <span className={`text-[10px] font-mono font-black uppercase tracking-[0.6em] ${accentColor}`}>Academic Specification</span>
                      <h3 className={`text-5xl font-serif italic tracking-tighter ${textColor}`}>Derivation of the Sampling Theorem</h3>
                      <div className={`w-32 h-0.5 mx-auto ${isDarkMode ? 'bg-white/20' : 'bg-gray-700'}`} />
                  </div>

                  {/* The "Paper" Area */}
                  <div className={`font-serif text-[1.1rem] leading-[2.8] text-left p-16 rounded-[2.5rem] ${isDarkMode ? 'bg-black/30 text-white/90' : 'bg-gray-50 text-gray-800'}`}>
                      
                      {/* Equation 1 */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                          <p>
                             Sampled signal <span className="font-bold">y(t) = x(t) · δ(t)</span>
                          </p>
                          <span className="text-xs font-mono opacity-40 italic tracking-widest self-end">...... (1)</span>
                      </div>

                      <p className="mb-6 opacity-70">The trigonometric Fourier series representation of <span className="italic">δ(t)</span> is given by:</p>
                      
                      {/* Equation 2 */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                          <div className="flex items-center gap-3 translate-x-12">
                            <span className="italic">δ(t) = a₀ + </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none mx-2">
                                <span className="text-[12px] mb-[-4px] italic">∞</span>
                                <span className="text-4xl not-italic font-sans">Σ</span>
                                <span className="text-[12px] mt-[-4px] italic">n=1</span>
                            </div>
                            <span className="italic">(aₙ cos nωₛt + bₙ sin nωₛt)</span>
                          </div>
                          <span className="text-xs font-mono opacity-40 italic tracking-widest self-end">...... (2)</span>
                      </div>

                      {/* Constants Block */}
                      <div className="space-y-12 my-16 pl-12 border-l-2 border-orange-500/10">
                          <p className="not-italic opacity-40 text-[10px] uppercase font-mono tracking-[0.3em] mb-4">Parameter Determination:</p>
                          
                          {/* a0 Row */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-4 min-h-[60px]">
                            <span className="whitespace-nowrap">Where <span className="italic">a₀</span> = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                <span className="border-b border-black/20 dark:border-white/20 pb-0.5 px-3 italic text-xs">1</span>
                                <span className="pt-0.5 px-3 italic text-xs">Tₛ</span>
                            </div>
                            <div className="inline-flex flex-col items-center align-middle leading-none">
                                <span className="text-[11px] mb-[-6px] italic">T/2</span>
                                <span className="text-4xl not-italic font-light">∫</span>
                                <span className="text-[11px] mt-[-6px] italic">-T/2</span>
                            </div>
                            <span className="whitespace-nowrap">δ(t) dt = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                <span className="border-b border-black/20 dark:border-white/20 pb-0.5 px-3 italic text-xs">1</span>
                                <span className="pt-0.5 px-3 italic text-xs">Tₛ</span>
                            </div>
                            <span className="whitespace-nowrap">δ(0) = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-sm font-bold font-sans tracking-tighter text-orange-500">
                                <span className="border-b border-orange-500/20 pb-0.5 px-3 italic uppercase text-sm">1</span>
                                <span className="pt-0.5 px-3 italic uppercase text-sm">Tₛ</span>
                            </div>
                          </div>

                          {/* an Row */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-4 min-h-[60px]">
                            <span className="whitespace-nowrap italic">aₙ</span> = 
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                <span className="border-b border-black/20 dark:border-white/20 pb-0.5 px-3 italic text-xs">2</span>
                                <span className="pt-0.5 px-3 italic text-xs">Tₛ</span>
                            </div>
                            <div className="inline-flex flex-col items-center align-middle leading-none">
                                <span className="text-[11px] mb-[-6px] italic">T/2</span>
                                <span className="text-4xl not-italic font-light">∫</span>
                                <span className="text-[11px] mt-[-6px] italic">-T/2</span>
                            </div>
                            <span className="whitespace-nowrap">δ(t) cos nωₛt dt = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter text-orange-500">
                                <span className="border-b border-orange-500/20 pb-0.5 px-3 italic text-xs">2</span>
                                <span className="pt-0.5 px-3 italic text-xs">Tₛ</span>
                            </div>
                            <span className="whitespace-nowrap italic">δ(0) cos nωₛ0 = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-sm font-bold font-sans tracking-tighter text-orange-500">
                                <span className="border-b border-orange-500/20 pb-0.5 px-3 italic text-sm">2</span>
                                <span className="pt-0.5 px-3 italic text-sm">Tₛ</span>
                            </div>
                          </div>

                          {/* bn Row */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-4 min-h-[60px]">
                            <span className="whitespace-nowrap italic">bₙ</span> = 
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter opacity-40">
                                <span className="border-b border-current pb-0.5 px-3">2</span>
                                <span className="pt-0.5 px-3">Tₛ</span>
                            </div>
                            <div className="inline-flex flex-col items-center align-middle leading-none opacity-40">
                                <span className="text-[11px] mb-[-6px]">T/2</span>
                                <span className="text-4xl not-italic font-light">∫</span>
                                <span className="text-[11px] mt-[-6px]">-T/2</span>
                            </div>
                            <span className="whitespace-nowrap italic opacity-40">δ(t) sin nωₛt dt = 0</span>
                          </div>
                      </div>

                      {/* Synthesis */}
                      <div className="pt-12 mt-12 border-t border-black/5 dark:border-white/5 space-y-10">
                          <p className="opacity-50 text-xs uppercase font-mono italic">Substitute parameters into eq (2):</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-4 translate-x-12 italic">
                            <span>δ(t) = </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                <span className="border-b border-black/20 dark:border-white/20 pb-0.5 px-3">1</span>
                                <span className="pt-0.5 px-3">Tₛ</span>
                            </div>
                            <span> + </span>
                            <div className="inline-flex flex-col items-center align-middle leading-none mx-4">
                                <span className="text-[12px] mb-[-4px]">∞</span>
                                <span className="text-4xl not-italic font-sans">Σ</span>
                                <span className="text-[12px] mt-[-4px]">n=1</span>
                            </div>
                            <span className="mr-2">(</span>
                            <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                <span className="border-b border-black/20 dark:border-white/20 pb-0.5 px-3">2</span>
                                <span className="pt-0.5 px-3">Tₛ</span>
                            </div>
                            <span className="ml-2">cos nωₛt + 0)</span>
                          </div>

                          <p className="opacity-50 text-xs uppercase font-mono italic mt-16">Applying δ(t) to eq (1):</p>
                          <div className="space-y-8 translate-x-12 italic text-[1.2rem]">
                            <div className="flex items-center gap-2">
                               <span>➔ y(t) = x(t) · δ(t)</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span>= x(t) [ </span>
                               <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                   <span className="border-b border-black/20 dark:border-white/20 pb-0.2 px-2">1</span>
                                   <span className="pt-0.2 px-2">Tₛ</span>
                               </div>
                               <span> + </span>
                               <div className="inline-flex flex-col items-center align-middle leading-none mx-2">
                                    <span className="text-[10px] mb-[-2px]">∞</span>
                                    <span className="text-3xl not-italic font-sans">Σ</span>
                                    <span className="text-[10px] mt-[-2px]">n=1</span>
                               </div>
                               <span> (</span>
                               <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                   <span className="border-b border-black/20 dark:border-white/20 pb-0.2 px-2">2</span>
                                   <span className="pt-0.2 px-2">Tₛ</span>
                               </div>
                               <span> cos nωₛt ) ]</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-orange-500">
                               <span>y(t) = </span>
                               <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter">
                                   <span className="border-b border-orange-500/30 pb-0.2 px-3">1</span>
                                   <span className="pt-0.2 px-3">Tₛ</span>
                               </div>
                               <span className="ml-2 tracking-tighter">[ x(t) + 2 cos ωₛt · x(t) + 2 cos 2ωₛt · x(t) + ... ]</span>
                            </div>
                          </div>
                      </div>

                      {/* Frequency Domain */}
                      <div className="pt-16 mt-16 border-t border-black/5 dark:border-white/5">
                          <p className="opacity-50 text-xs uppercase font-mono italic">Spectral Analysis (Fourier Transform):</p>
                          <div className="space-y-12 translate-x-12 mt-12 italic">
                            <div className="flex items-center gap-2">
                               <span>Y(ω) = </span>
                               <div className="inline-flex flex-col items-center align-middle leading-none text-xs font-sans tracking-tighter mx-2">
                                   <span className="border-b border-black/20 dark:border-white/20 pb-0.2 px-4 italic">1</span>
                                   <span className="pt-0.2 px-4 italic">Tₛ</span>
                               </div>
                               <span className="tracking-tight">[ X(ω) + X(ω - ωₛ) + X(ω + ωₛ) + ... ]</span>
                            </div>
                            <div className="flex items-center gap-4 mt-12 bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10">
                               <span className="not-italic mr-4 text-2xl">∴</span>
                               <span className="text-2xl font-black">Y(ω) = </span>
                               <div className="inline-flex flex-col items-center align-middle leading-none text-sm font-bold font-sans tracking-tighter mx-2">
                                   <span className="border-b border-orange-500/40 pb-0.5 px-4 italic">1</span>
                                   <span className="pt-0.5 px-4 italic">Tₛ</span>
                               </div>
                               <div className="inline-flex flex-col items-center align-middle leading-none mx-4">
                                    <span className="text-[14px] mb-[-2px]">∞</span>
                                    <span className="text-5xl not-italic font-light">Σ</span>
                                    <span className="text-[14px] mt-[-2px]">n=-∞</span>
                               </div>
                               <span className="text-2xl font-black">X(ω - nωₛ)</span>
                            </div>
                          </div>
                      </div>

                      {/* Summary Section */}
                      <div className={`mt-20 p-10 rounded-[2.5rem] italic leading-relaxed text-[1rem] ${isDarkMode ? 'bg-orange-500/5 text-white/40' : 'bg-orange-50 text-gray-600'}`}>
                          <p>
                            To reconstruct <span className="font-bold text-orange-500 underline underline-offset-8 decoration-orange-500/30">x(t)</span>, 
                            one must recover the input signal spectrum <span className="font-bold">X(ω)</span> from the sampled signal spectrum <span className="font-bold">Y(ω)</span>. 
                            This is possible only when there is <span className="font-black text-white dark:text-gray-900 bg-orange-500 px-2 rounded-lg not-italic mx-1">no overlapping</span> 
                            between the cycles of <span className="italic font-bold text-orange-600 dark:text-orange-400">Y(ω)</span>.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
