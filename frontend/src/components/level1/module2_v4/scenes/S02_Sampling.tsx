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
      {/* Detailed Nyquist Mathematical Proof */}
      <div className={`mt-16 p-12 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-black/80 border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className="space-y-12 text-left">
              <div className="text-center space-y-4">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] ${accentColor}`}>Formal Derivation</span>
                  <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>Nyquist-Shannon Proof</h3>
                  <p className={`text-sm max-w-2xl mx-auto ${subTextColor}`}>
                      How Claude Shannon mathematically proved that reality can be perfectly captured in digits.
                  </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div className={`p-8 rounded-3xl border flex flex-col ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-3 mb-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-orange-500 text-black' : 'bg-orange-500 text-white'}`}>1</span>
                          <h4 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Time Sampling</h4>
                      </div>
                      <p className="text-[11px] leading-relaxed text-white/40 mb-6 flex-grow">
                          Sampling $x(t)$ is modeled as multiplication by a **Dirac Comb** $s(t)$. This turns a continuous wave into a series of infinitesimally narrow spikes.
                      </p>
                      <div className={`p-4 rounded-xl font-mono text-[11px] leading-tight ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/10' : 'bg-white text-orange-700 border border-orange-100 shadow-sm'}`}>
                          {`x_s(t) = x(t) \\cdot \\sum_{n=-\\infty}^{+\\infty} \\delta(t - nT)`}
                      </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-8 rounded-3xl border flex flex-col ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-3 mb-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-orange-500 text-black' : 'bg-orange-500 text-white'}`}>2</span>
                          <h4 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Fourier Mapping</h4>
                      </div>
                      <p className="text-[11px] leading-relaxed text-white/40 mb-6 flex-grow">
                          In the frequency domain, multiplication becomes **Convolution**. The original spectrum $X(f)$ is cloned and repeated every $f_s$ Hertz across the spectrum.
                      </p>
                      <div className={`p-4 rounded-xl font-mono text-[11px] leading-tight ${isDarkMode ? 'bg-black/60 text-orange-400 border border-white/10' : 'bg-white text-orange-700 border border-orange-100 shadow-sm'}`}>
                          {`X_s(f) = \\frac{1}{T} \\sum_{k=-\\infty}^{+\\infty} X(f - kf_s)`}
                      </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-8 rounded-3xl border flex flex-col border-orange-500/20 ${isDarkMode ? 'bg-orange-500/5 shadow-inner' : 'bg-orange-50'}`}>
                      <div className="flex items-center gap-3 mb-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-orange-500 text-black`}>3</span>
                          <h4 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Separation</h4>
                      </div>
                      <p className="text-[11px] leading-relaxed text-white/40 mb-6 flex-grow">
                          To recover the original, these copies must **not overlap** (Aliasing). The gap between the signal's bandwidth $B$ and the next copy's start must satisfy $f_s - B \ge B$.
                      </p>
                      <div className={`p-4 rounded-xl font-mono text-xs text-center font-bold ${isDarkMode ? 'bg-orange-500 text-black' : 'bg-orange-500 text-white'}`}>
                          f_s \ge 2 \cdot B
                      </div>
                  </div>
              </div>

              <div className={`p-10 rounded-[2.5rem] border flex flex-col items-center gap-8 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200 shadow-inner'}`}>
                 <p className={`text-xs text-center max-w-3xl leading-loose ${isDarkMode ? 'text-white/60' : 'text-gray-700 font-medium'}`}>
                    <strong className={textColor}>The Master Conclusion:</strong> If you blink at least twice as fast as the fastest thing in your signal, the Fourier clones in your bucket of data will stay separated. You can then use a simple **Low-Pass Filter** to grab just one copy, and like magic, the continuous world is restored with **zero loss** of information.
                 </p>
                 <div className="flex items-center gap-6 opacity-40">
                    <div className="flex flex-col items-center">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-[0.4em] ${textColor}`}>Sampling</span>
                        <div className="w-16 h-px bg-current mt-2" />
                    </div>
                    <div className="text-xl">➔</div>
                    <div className="flex flex-col items-center">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-[0.4em] ${accentColor}`}>Reconstruction</span>
                        <div className="w-16 h-px bg-current mt-2" />
                    </div>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};
