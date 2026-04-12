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

      {/* NEW: The Anatomy of Variation (Pre-Bridge Concepts) */}
      <div className="mt-24 space-y-12">
        <div className="text-center space-y-4">
            <h2 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>
                Before we cross the <span className={accentColor}>Bridge...</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-sm font-medium ${subTextColor}`}>
                To understand the "Digital Bridge," we must first look at the bricks of the Analog world.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    title: "What is a Signal?",
                    brief: "It's just a variable that changes over time.",
                    deep: "Mathematically, it's a function x(t). Physically, it's energy—voltage, pressure, or magnetic flux—encoding information. If it doesn't change, it's just static; it's not a signal.",
                    icon: "📡",
                    color: "orange"
                },
                {
                    title: "Why Sample?",
                    brief: "Because computers can't handle infinity.",
                    deep: "An analog signal has infinite points between 0 and 1. A computer would run out of memory just trying to store a single second of it. We take 'snapshots' to make the data manageable.",
                    icon: "📸",
                    color: "orange"
                },
                {
                    title: "The Heartbeat",
                    brief: "The interval between those snapshots.",
                    deep: "We call this the Sample Period (T). The faster the heartbeat, the more 'Analog' the digital copy feels. If the heartbeat is too slow, we lose reality entirely (Aliasing).",
                    icon: "💓",
                    color: "orange"
                },
                {
                    title: "The Ruler",
                    brief: "How accurately we measure the height.",
                    deep: "Once we take a snapshot, we need to measure its height. This is Quantization. A better ruler (more bits) means a more accurate digital reconstruction.",
                    icon: "📏",
                    color: "orange"
                }
            ].map((item, i) => (
                <ExpandableCard key={i} item={item} isDarkMode={isDarkMode} />
            ))}
        </div>

        <div className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center gap-10 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
            <div className="flex-1 space-y-4">
                <h3 className={`text-2xl font-black italic tracking-tighter ${textColor}`}>The Golden Rule</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "You cannot represent what you did not capture. In the digital world, **Loss is Forever**. This module teaches you how to lose as little as possible while building the bridge."
                </p>
            </div>
            <div className={`px-8 py-4 rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-orange-500/30 font-mono text-orange-500' : 'border-orange-300 font-mono text-orange-600'} text-xs font-bold`}>
                PRECISION &lt;=&gt; PERFORMANCE
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
