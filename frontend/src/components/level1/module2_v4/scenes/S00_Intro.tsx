import React, { useState, useMemo } from 'react';
import { SignalEngine, SignalConfig } from '../SignalEngine';

/**
 * S00_Intro: Feel Signal (Optimized)
 */
export const S00_Intro: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const config = useMemo((): SignalConfig => ({
    frequency: 1 + mousePos.x * 2,
    amplitude: 40 + mousePos.y * 30,
    sampleRate: 0,
    bitDepth: 0,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  }), [mousePos]);

  const { analogPoints } = SignalEngine(config, time, 600, 250);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                Module 02 // The Digital Bridge
            </div>
            <h1 className={`text-7xl font-black italic tracking-tighter leading-[0.9] ${textColor}`}>
              The <span className={accentColor}>Essence</span> <br/>of Flow
            </h1>
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              Reality doesn't happen in steps. It <span className="text-orange-500 italic">flows</span>. 
              Like a 1 AM coffee chat, let's keep it real: every sound you hear, every light you see, is an infinite stream of values.
            </p>
            <div className={`p-6 rounded-[2rem] border italic text-sm leading-relaxed ${isDarkMode ? 'bg-white/5 border-white/10 text-white/50' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                "Nature is an ocean of infinite precision. To a computer, that's a problem. Computers are ladders; nature is a smooth ramp."
            </div>
        </div>

        <div 
            className={`relative h-[480px] w-full rounded-[3rem] border overflow-hidden cursor-crosshair group shadow-2xl transition-all duration-700 hover:scale-[1.02] ${isDarkMode ? 'bg-black/40 border-white/10 shadow-black' : 'bg-gray-50 border-gray-200 shadow-orange-500/10'}`}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePos({ 
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                });
            }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${isDarkMode ? 'from-orange-500/10 to-transparent' : 'from-orange-500/15 to-transparent'}`} />
            
            {/* Grid Background */}
            <div className={`absolute inset-0 opacity-20 ${isDarkMode ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]'} bg-[size:40px_40px]`} />

            <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="absolute inset-0 top-1/2 -translate-y-1/2 scale-[1.2]">
                <path 
                    d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 20px ${strokeColor})` }}
                />
            </svg>

            <div className="absolute bottom-10 left-10 flex gap-12 text-left">
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Vibration (Hz)</span>
                    <span className={`text-3xl font-black italic tracking-tighter ${accentColor}`}>{(config.frequency * 10).toFixed(1)}</span>
                </div>
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Intensity (V)</span>
                    <span className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>{(config.amplitude).toFixed(0)}</span>
                </div>
            </div>

            <div className={`absolute top-10 right-10 px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md ${isDarkMode ? 'bg-black/60 border-orange-500/30 text-orange-500' : 'bg-white/80 border-orange-200 text-orange-600 shadow-sm'}`}>
                LIVE STATE: ANALOG REALITY
            </div>
        </div>
      </div>

      {/* Deep Dive: Signal Mechanics */}
      <div className="mt-32 space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-orange-500/10 pb-8">
              <div className="space-y-4">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-[0.4em] ${accentColor}`}>Fundamental Physics</span>
                  <h2 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>
                      How Signals <span className="underline decoration-orange-500/30 underline-offset-8">Work</span>
                  </h2>
              </div>
              <p className={`max-w-md text-sm font-medium leading-relaxed opacity-60 text-right ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Information is never stationary. It rides on the back of physical change. 
                  To capture it, we must first understand its motion.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`p-10 rounded-[2.5rem] border space-y-6 ${isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black' : 'bg-white border-gray-100 shadow-xl'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl">⚡</div>
                  <h4 className={`text-xl font-bold italic tracking-tight ${textColor}`}>Physical Carriers</h4>
                  <p className={`text-sm leading-loose opacity-60 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      In the physical world, a signal is energy. It could be electrons flowing through a copper wire (Voltage), 
                      air molecules colliding (Sound), or photons hitting a sensor (Light). 
                      <span className="block mt-4 text-orange-500 font-black">Information = Change.</span>
                  </p>
              </div>

              <div className={`p-10 rounded-[2.5rem] border border-orange-500/20 space-y-6 ${isDarkMode ? 'bg-orange-500/[0.03] shadow-2xl shadow-orange-500/5' : 'bg-orange-50 shadow-xl shadow-orange-500/10'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20 text-white">f</div>
                  <h4 className={`text-xl font-bold italic tracking-tight ${textColor}`}>Mathematical Identity</h4>
                  <p className={`text-sm leading-loose opacity-70 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Mathematically, we treat a signal as a function <span className="font-mono font-bold italic underline">x(t)</span>. 
                      For any moment in time <span className="italic">t</span>, there is a unique value <span className="italic">x</span>. 
                      In nature, this function is <span className="underline decoration-orange-500/40 font-bold">continuous</span>—there are no gaps.
                  </p>
              </div>

              <div className={`p-10 rounded-[2.5rem] border border-dashed space-y-6 ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-200 shadow-inner'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">🧩</div>
                  <h4 className={`text-xl font-bold italic tracking-tight ${textColor}`}>The Digital Gap</h4>
                  <p className={`text-sm leading-loose opacity-50 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Digital systems are <strong>discrete</strong>. They can't see the gaps between their internal clock ticks. 
                      The "Bridge" is our attempt to map the infinite richness of nature into these finite slots.
                  </p>
              </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-12 rounded-[3.5rem] border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
              <div className="space-y-6">
                  <h4 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Sampling Philosophy</h4>
                  <p className={`text-base leading-relaxed opacity-60 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Why don't we just build analog computers? Because analog is <strong>fragile</strong>. 
                      A tiny bit of heat or a nearby power line adds "noise" that becomes permanent. 
                      Digital is <strong>robust</strong>—a 1 is a 1, even if it's a bit fuzzy.
                  </p>
                  <div className="flex gap-4">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white/40' : 'bg-white text-gray-400'}`}>Noise Immunity</span>
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white/40' : 'bg-white text-gray-400'}`}>Perfect Replication</span>
                  </div>
              </div>
              <div className={`flex items-center justify-center p-8 rounded-[2rem] border-2 border-dashed ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                  <p className={`text-sm italic text-center leading-loose font-medium ${isDarkMode ? 'text-orange-200/50' : 'text-orange-800/70'}`}>
                    "A song on a vinyl record wears out every time you play it. <br/>
                    A song in a FLAC file is a mathematical truth; <br/>
                    it stays the same until the end of time."
                  </p>
              </div>
          </div>
      </div>

      {/* The Anatomy of Variation */}
      <div className="mt-32 space-y-12">
        <div className="text-center space-y-4">
            <h2 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>
                Anatomy of the <span className={accentColor}>Conversion</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-sm font-medium leading-relaxed ${subTextColor}`}>
                To turn reality into numbers, we follow four sacred steps. 
                Move through these in order as we progress through the module.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    title: "1. The Snapshot",
                    brief: "We stop time for a fraction of a second.",
                    deep: "Sampling is the process of selecting specific moments to record the signal's value. We ignore everything in between. If we ignore too much, we lose the curve (Aliasing).",
                    icon: "📸",
                    color: "orange"
                },
                {
                    title: "2. The Measurement",
                    brief: "Assigning a number to the height.",
                    deep: "Quantization is mapping a continuous value to a fixed 'bin'. It's like rounding 0.52 to 0.5. This creates a tiny error called 'Quantization Noise'.",
                    icon: "📏",
                    color: "orange"
                },
                {
                    title: "3. The Code",
                    brief: "Converting that height to Binary.",
                    deep: "Once we have a bin number (e.g., 42), we convert it to 101010. This is the only language a processor understands. Now, the signal is manageable data.",
                    icon: "💻",
                    color: "orange"
                },
                {
                    title: "4. The Reconstruction",
                    brief: "Connecting the dots back to reality.",
                    deep: "A DAC (Digital to Analog Converter) takes our numbers and draws the smooth ramp back. If we sampled correctly, the reconstruction is mathematically identical.",
                    icon: "🎨",
                    color: "orange"
                }
            ].map((item, i) => (
                <ExpandableCard key={i} item={item} isDarkMode={isDarkMode} />
            ))}
        </div>

        <div className={`p-12 rounded-[3.5rem] border flex flex-col md:flex-row items-center gap-10 overflow-hidden relative ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-500/5'}`} />
            <div className="flex-1 space-y-6 relative z-10">
                <h3 className={`text-3xl font-black italic tracking-tighter ${textColor}`}>The Engineer's Curse</h3>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "You cannot represent what you did not capture. In the digital world, **Loss is Forever**. High precision requires more memory; low memory causes distortion. This module is the art of finding the perfect balance."
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'bg-black border-white/10' : 'bg-white border-gray-100'}`} />)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Joined by 12.4k Engineers</span>
                </div>
            </div>
            <div className={`relative px-12 py-10 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'border-orange-500/30' : 'border-orange-300'} z-10 group transition-all duration-500 hover:border-solid hover:bg-orange-500 hover:text-white`}>
                <span className="font-mono text-3xl font-black italic tracking-tighter">NYQUIST</span>
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.4em] opacity-60">The Limit</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const ExpandableCard: React.FC<{ item: any; isDarkMode: boolean }> = ({ item, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col text-left group
                ${isDarkMode 
                    ? `bg-white/[0.03] border-white/5 hover:border-orange-500/40 ${isExpanded ? 'ring-2 ring-orange-500/20' : ''}` 
                    : `bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 ${isExpanded ? 'ring-2 ring-orange-100' : ''}`}`}
        >
            <div className="flex justify-between items-start mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">{item.icon}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-orange-500/20 border-orange-500/40' : 'border-gray-400/20'}`}>
                    <span className={`text-[10px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isExpanded ? '−' : '+'}</span>
                </div>
            </div>
            <h4 className={`text-lg font-black italic mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
            <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                {item.brief}
            </p>
            
            <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-40 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <p className={`text-[11px] leading-relaxed italic ${isDarkMode ? 'text-orange-200/60' : 'text-orange-700/80'}`}>
                        {item.deep}
                    </p>
                </div>
            </div>
        </div>
    );
};
