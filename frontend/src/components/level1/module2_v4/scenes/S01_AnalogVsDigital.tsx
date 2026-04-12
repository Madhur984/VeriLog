import React, { useMemo } from 'react';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, Waves } from 'lucide-react';

/**
 * S01_AnalogVsDigital (Optimized)
 */
export const S01_AnalogVsDigital: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 40,
    sampleRate: 16,
    bitDepth: 4,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), []);

  const { analogPoints, reconstructedPoints } = useMemo(() => 
    SignalEngine(config, time, 400, 150), [config, time]
  );

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-16 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          Nature <span className={isDarkMode ? 'text-white/10' : 'text-gray-200'}>vs</span> <span className={accentColor}>Numbers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
                  To process signals, we must convert them into a language computers understand: **Bits**.
                  One is smooth and eternal; the other is discrete and calculated.
                </p>
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${accentColor}`}>Mathematical Identity</span>
                    <pre className={`mt-4 text-[13px] font-mono leading-relaxed ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
{` x(t) = A × sin(2π × f × t + φ)`}
                    </pre>
                    <p className={`mt-2 text-[10px] uppercase tracking-widest font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                        A=Amp | f=Freq | φ=Phase
                    </p>
                </div>
            </div>
            
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>The Bridge Objective</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   **Nature is analog.** Sound, light, heat—they change infinitely.
                   **Computers are digital.** Switches, bits, logic—they change in steps.
                </p>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
                    <table className="w-full text-left text-[10px] font-mono">
                        <thead className={isDarkMode ? 'bg-white/5' : 'bg-gray-100'}>
                            <tr>
                                <th className="p-2 border-r border-white/5">Domain</th>
                                <th className="p-2">Properties</th>
                            </tr>
                        </thead>
                        <tbody className={isDarkMode ? 'text-white/40' : 'text-gray-500'}>
                            <tr className="border-t border-white/5">
                                <td className="p-2 border-r border-white/5 font-bold text-gray-400 uppercase">Analog</td>
                                <td className="p-2 italic">Continuous, Infinite, Noisy</td>
                            </tr>
                            <tr className="border-t border-white/5">
                                <td className="p-2 border-r border-white/5 font-bold text-orange-500 uppercase">Digital</td>
                                <td className="p-2 italic">Discrete, Finite, Robust</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Analog Card */}
        <section className={`group p-10 rounded-[2.5rem] border space-y-8 relative overflow-hidden transition-all duration-500 shadow-xl hover:-translate-y-1 ${cardBg}`}>
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${innerBg}`}>
              <Waves className={isDarkMode ? 'text-white/40' : 'text-gray-400'} size={28} />
            </div>
            <div>
              <h3 className={`text-2xl font-black tracking-tight ${textColor}`}>The Analog Real</h3>
              <p className={`text-[10px] font-mono uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Infinite Continuity</p>
            </div>
          </div>
          <div className={`h-[180px] rounded-[2rem] border overflow-hidden flex items-center justify-center p-4 shadow-inner ${innerBg}`}>
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path 
                d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={isDarkMode ? 'white' : '#64748b'} 
                strokeWidth="3" 
                strokeOpacity={isDarkMode ? '0.4' : '0.6'} 
                style={{ filter: isDarkMode ? 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' : 'none' }}
              />
            </svg>
          </div>
          <div className="space-y-4 text-left">
              <div className={`p-4 rounded-2xl border-l-4 border-l-gray-400 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className={`text-xs font-bold ${textColor}`}>Vinyl Records, Light, Sound Pressure</p>
              </div>
              <p className={`text-sm leading-relaxed italic font-medium ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                "Analog signals have no resolution limits, but they are vulnerable to noise that becomes permanently baked into the signal."
              </p>
          </div>
        </section>

        {/* Digital Card */}
        <section className={`group p-10 rounded-[2.5rem] border space-y-8 relative overflow-hidden transition-all duration-500 shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-orange-500/5 hover:border-orange-500/30' : 'bg-white border-orange-200 shadow-orange-500/5 hover:border-orange-300'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:-rotate-12 ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
              <Binary className={accentColor} size={28} />
            </div>
            <div>
              <h3 className={`text-2xl font-black tracking-tight ${textColor}`}>The Digital Proxy</h3>
              <p className={`text-[10px] font-mono uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-orange-500/40' : 'text-orange-600/60'}`}>Discrete Approximation</p>
            </div>
          </div>
          <div className={`h-[180px] rounded-[2rem] border overflow-hidden flex items-center justify-center p-4 shadow-inner ${isDarkMode ? 'bg-black/80 border-orange-500/10' : 'bg-orange-50/30 border-orange-100'}`}>
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path 
                d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth="4"
                style={{ filter: isDarkMode ? `drop-shadow(0 0 15px ${strokeColor}66)` : 'none' }}
              />
            </svg>
          </div>
          <div className="space-y-4 text-left">
              <div className={`p-4 rounded-2xl border-l-4 border-l-orange-500 ${isDarkMode ? 'bg-orange-950/20 border-white/5' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                <p className={`text-xs font-bold ${textColor}`}>MP3s, HDMI, CDs, Microchips</p>
              </div>
              <p className={`text-sm leading-relaxed italic font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                "Digital is a calculated proxy. It is robust and clean, but it introduces a 'staircase' quantization that we must trick the eye into seeing as smooth."
              </p>
          </div>
        </section>
      </div>

      {/* NEW: Signal Anatomy Section */}
      <div className={`mt-16 p-12 rounded-[3.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6 text-left">
                <h3 className={`text-3xl font-black italic tracking-tighter ${textColor}`}>Signal <span className={accentColor}>Anatomy</span></h3>
                <p className={`text-sm leading-relaxed font-medium ${subTextColor}`}>
                    A signal is more than just a wave. It is a **carrier of meaning**. To master the bridge, you must understand what makes a signal *useful*.
                </p>
                <div className={`p-6 rounded-3xl border border-dashed ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-200'}`}>
                    <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${accentColor}`}>Engineer's Note</span>
                    <p className={`mt-2 text-[11px] leading-relaxed italic ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                        "A signal without change is just a static value. A signal without a receiver is just energy. The bridge connects the physical to the logical."
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        title: "The Carrier",
                        desc: "The physical medium. Voltage in a wire, pressure in the air, or photons in a fiber optic cable.",
                        icon: "⚡",
                        meta: "PHYSICAL LAYER"
                    },
                    {
                        title: "Information",
                        desc: "The meaning encoded within the variations. The music inside the wave or the bits in the pulse.",
                        icon: "💡",
                        meta: "LOGICAL LAYER"
                    },
                    {
                        title: "Sample Period",
                        desc: "The 'T' in our equations. The precise heartbeat of the digital observer.",
                        icon: "⏱️",
                        meta: "TEMPORAL RESOLUTION"
                    },
                    {
                        title: "Linearity",
                        desc: "How well the digital copy follows the analog original without adding its own 'opinions'.",
                        icon: "📏",
                        meta: "FIDELITY"
                    }
                ].map((item, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border text-left group transition-all duration-300 hover:scale-[1.02] ${isDarkMode ? 'bg-black/40 border-white/5 hover:border-orange-500/20' : 'bg-gray-50 border-gray-200 hover:border-orange-200 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-3xl">{item.icon}</span>
                            <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>{item.meta}</span>
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
