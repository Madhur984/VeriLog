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
    </div>
  );
};
