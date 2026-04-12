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
      {/* Detailed Sampling Theorem Proof (Derivation) */}
      <div className={`mt-16 p-12 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-black/80 border-white/5 shadow-2xl transition-all' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className="space-y-16 text-left">
              <div className="text-center space-y-4">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] ${accentColor}`}>Full Mathematical Derivation</span>
                  <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>The Sampling Theorem Proof</h3>
                  <p className={`text-sm max-w-2xl mx-auto ${subTextColor}`}>
                      A step-by-step engineering proof using Fourier Series and Transform pairs.
                  </p>
              </div>

              <div className="space-y-24">
                  {/* Phase 1: The Model */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                      <div className="space-y-4">
                          <h4 className={`text-xl font-bold italic ${textColor}`}>1. Sampling as Multiplication</h4>
                          <p className={`text-xs leading-relaxed ${subTextColor}`}>
                            Sampling a continuous signal $x(t)$ is mathematically equivalent to multiplying it by an impulse train $\delta(t)$. This is our base model.
                          </p>
                          <div className={`p-6 rounded-2xl font-mono text-xs ${isDarkMode ? 'bg-black/40 text-v3-cyan border border-white/5' : 'bg-gray-50 text-blue-600 border border-gray-100 shadow-inner'}`}>
                             {`y(t) = x(t) \\cdot \\delta(t) \\quad \\dots (1)`}
                          </div>
                      </div>
                      <div className="space-y-4">
                          <h4 className={`text-xl font-bold italic ${textColor}`}>2. The Fourier Series Bridge</h4>
                          <p className={`text-xs leading-relaxed ${subTextColor}`}>
                            The periodic impulse train $\delta(t)$ can be represented by a **Trigonometric Fourier Series**.
                          </p>
                          <div className={`p-6 rounded-2xl font-mono text-xs ${isDarkMode ? 'bg-black/40 text-v3-cyan border border-white/5' : 'bg-gray-50 text-blue-600 border border-gray-100 shadow-inner'}`}>
                             {`\\delta(t) = a_0 + \\sum_{n=1}^{\\infty} (a_n \\cos n\\omega_s t + b_n \\sin n\\omega_s t) \\quad \\dots (2)`}
                          </div>
                      </div>
                  </div>

                  {/* Phase 2: Solving Coefficients */}
                  <div className="space-y-8">
                      <h4 className={`text-xl font-bold italic text-center ${textColor}`}>3. Solving the Coefficients</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { 
                                label: "DC Component (a0)", 
                                formula: `a_0 = \\frac{1}{T_s} \\int_{-T/2}^{T/2} \\delta(t)dt = \\frac{1}{T_s}`,
                                desc: "The average value of the impulse train over one period."
                            },
                            { 
                                label: "Cosine Parts (an)", 
                                formula: `a_n = \\frac{2}{T_s} \\int_{-T/2}^{T/2} \\delta(t)\\cos n\\omega_s t dt = \\frac{2}{T_s}`,
                                desc: "Fourier coefficients for even symmetry (cosines)."
                            },
                            { 
                                label: "Sine Parts (bn)", 
                                formula: `b_n = 0`,
                                desc: "Zero for even functions like the impulse train delta(t)."
                            }
                        ].map((c, i) => (
                            <div key={i} className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <h5 className={`text-[10px] font-mono font-black uppercase tracking-widest mb-4 ${accentColor}`}>{c.label}</h5>
                                <div className={`mb-4 font-mono text-xs ${textColor}`}>{`{${c.formula}}`}</div>
                                <p className={`text-[10px] italic ${subTextColor}`}>{c.desc}</p>
                            </div>
                        ))}
                      </div>
                  </div>

                  {/* Phase 3: Synthesis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h4 className={`text-xl font-bold italic ${textColor}`}>4. Synthesis into Time-Domain</h4>
                        <p className={`text-xs leading-relaxed ${subTextColor}`}>
                            Substituting the coefficients back into Eq (2) and then multiplying by $x(t)$, we get the time-domain synthesis of the sampled signal:
                        </p>
                        <div className={`p-8 rounded-3xl font-mono text-[11px] space-y-4 ${isDarkMode ? 'bg-black/60 text-white/80 border border-white/10' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                            <div>{`\\delta(t) = \\frac{1}{T_s} + \\sum_{n=1}^{\\infty} \\frac{2}{T_s} \\cos n\\omega_s t`}</div>
                            <div className="text-orange-500 font-black">↓ Multiply by x(t)</div>
                            <div className="leading-loose">
                                {`y(t) = \\frac{1}{T_s} [x(t) + 2 \\sum_{n=1}^{\\infty} x(t) \\cos n\\omega_s t]`}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h4 className={`text-xl font-bold italic ${textColor}`}>5. The Frequency Shift Result</h4>
                        <p className={`text-xs leading-relaxed ${subTextColor}`}>
                            Taking the **Fourier Transform** of the synthesis result, we see the original spectrum $X(\omega)$ repeated at every multiple of the sampling frequency $\omega_s$:
                        </p>
                        <div className={`p-8 rounded-3xl font-mono text-[11px] border border-orange-500/20 ${isDarkMode ? 'bg-orange-500/5 text-orange-400' : 'bg-orange-50 text-orange-800'}`}>
                             {`Y(\\omega) = \\frac{1}{T_s} \\sum_{n=-\\infty}^{+\\infty} X(\\omega - n\\omega_s)`}
                        </div>
                        <p className={`text-[10px] italic font-medium leading-relaxed ${subTextColor}`}>
                            Reconstruction is possible **ONLY** when these cycles of $Y(\omega)$ do not overlap. This leads directly to the core requirement for sampling.
                        </p>
                    </div>
                  </div>
              </div>

              <div className={`p-10 rounded-[3rem] border border-orange-500/10 flex flex-col items-center gap-6 ${isDarkMode ? 'bg-white/5 shadow-2xl' : 'bg-orange-50 shadow-inner'}`}>
                  <h4 className={`text-sm font-black uppercase tracking-widest ${accentColor}`}>Sampling Theorem Condition</h4>
                  <div className="flex gap-12 items-center">
                      <div className="text-center">
                        <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>$\omega_s &gt; 2\omega_m$</div>
                        <span className="text-[10px] uppercase font-mono tracking-widest opacity-40">No Overlap</span>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <div className="text-center opacity-40">
                        <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>$\omega_s &lt; 2\omega_m$</div>
                        <span className="text-[10px] uppercase font-mono tracking-widest opacity-40">Aliasing Occurs</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
