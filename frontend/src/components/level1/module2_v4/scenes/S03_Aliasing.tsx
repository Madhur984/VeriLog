import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { AlertTriangle, Ghost } from 'lucide-react';

/**
 * S03_Aliasing (Optimized)
 */
/**
 * S03_Aliasing (Optimized)
 */
export const S03_Aliasing: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [freq, setFreq] = useState(2);
  const [sampleRate, setSampleRate] = useState(12);

  const config = useMemo((): SignalConfig => ({
    frequency: freq,
    amplitude: 60,
    sampleRate: sampleRate,
    bitDepth: 12,
    jitter: 0,
    dither: false,
    reconstruction: 'sinc'
  }), [freq, sampleRate]);

  const { analogPoints, samples, reconstructedPoints, metrics } = useMemo(() => 
    SignalEngine(config, time, 600, 250), [config, time]
  );

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode 
    ? (metrics.aliasing ? 'bg-red-500/5 border-red-500/20 shadow-red-500/5' : 'bg-black/40 border-white/10') 
    : (metrics.aliasing ? 'bg-red-50 border-red-200 shadow-red-100' : 'bg-gray-50 border-gray-200');
  const innerBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          Frequency <span className="text-red-500">Ghosts</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              When you sample too slowly, high frequencies disguise themselves as low frequencies. 
              This "imposter" signal is called **Aliasing**.
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-200 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] text-red-500`}>The Alias Math</span>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   The ghost frequency (f_alias) appears at:
                </p>
                <div className={`mt-2 font-mono text-center p-3 rounded-xl ${isDarkMode ? 'bg-black/60 text-red-400' : 'bg-red-100 text-red-700'}`}>
                    f_alias = |f_input - k × f_sampling|
                </div>
            </div>
        </div>
      </header>

      <div className={`p-10 rounded-[3rem] border transition-all duration-700 shadow-2xl ${cardBg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl border transition-all duration-500 flex items-center justify-center ${metrics.aliasing 
                            ? 'border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : (isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-100')}`}>
                            {metrics.aliasing ? <Ghost className="text-red-500" size={28} /> : <AlertTriangle className={isDarkMode ? 'text-white/40' : 'text-gray-400'} size={28} />}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Nyquist Integrity</span>
                            <span className={`text-2xl font-black uppercase tracking-tighter italic transition-colors ${metrics.aliasing ? 'text-red-500 animate-pulse' : accentColor}`}>
                                {metrics.aliasing ? 'Critical: Alias Detected' : 'Shielded: No Aliasing'}
                            </span>
                        </div>
                    </div>

                    <div className={`mt-8 p-6 rounded-3xl border border-dashed ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20 shadow-inner' : 'bg-orange-50 border-orange-200'}`}>
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${accentColor}`}>Engineer's Visual Mental Model</span>
                        <pre className={`mt-4 text-[11px] font-mono leading-relaxed overflow-x-auto ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
{`  FAST SIGNAL (Red)      SAMPLED (Slow Ghost)
     ^    /\\  /\\           ^ ●       ●
   1 |   /  \\/  \\          |● ●     ● ●
   0 |__/        \\__       +---●---●----> time
     +----> time           ALIAS DETECTED!`}
                        </pre>
                    </div>
                </div>

                <div className={`relative h-[320px] rounded-[2rem] border overflow-hidden shadow-inner transition-all ${innerBg}`}>
                    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none" className="p-8">
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1.5" strokeOpacity="0.05" strokeDasharray="8 8" />
                        
                        <path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={metrics.aliasing ? "#ef4444" : strokeColor} 
                            strokeWidth="4"
                            style={{ filter: isDarkMode ? `drop-shadow(0 0 20px ${metrics.aliasing ? 'rgba(239,68,68,0.5)' : strokeColor})` : 'none' }}
                        />
                        
                        {samples.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={metrics.aliasing ? "#ef4444" : strokeColor} className="transition-all duration-300" />
                        ))}
                    </svg>

                    <AnimatePresence>
                        {metrics.aliasing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-red-500/[0.03] pointer-events-none">
                                <span className="text-[180px] font-black italic text-red-500/[0.05] pointer-events-none uppercase tracking-tighter select-none rotate-[-5deg]">GHOST</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-black/40 border-white/5 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${textColor}`}>
                        <span className="w-2 h-2 rounded-full bg-red-500" /> The Wheel Analogy
                    </h4>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        Ever seen a car's wheels spin **backward** in a movie? That's aliasing! The camera shutter (sampling rate) is too slow to catch the real spin speed, so your brain "reconstructs" a slower, backward ghost.
                    </p>
                </div>

                <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-black' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${accentColor}`}>The Shield</h4>
                    <p className={`text-xs leading-relaxed font-black uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Anti-Aliasing Filter (AAF)</p>
                    <p className={`text-xs leading-relaxed font-medium ${subTextColor}`}>
                        Engineers use a **Low-Pass Filter** to kill any frequency &gt; $Fs/2$ *before* it hits the sampler. If it's not there, it can't ghost.
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
            <div className="space-y-6">
                <div className={`flex justify-between text-[11px] font-mono uppercase tracking-[0.2em] font-black ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                    <span>Target Frequency</span>
                    <span className={`italic ${textColor}`}>{freq} Hz</span>
                </div>
                <input type="range" min={1} max={5} step={0.1} value={freq} onChange={(e) => setFreq(parseFloat(e.target.value))} className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all ${isDarkMode ? 'bg-white/10 accent-white' : 'bg-gray-200 accent-gray-600 shadow-inner'}`} />
            </div>
            <div className="space-y-6">
                <div className={`flex justify-between text-[11px] font-mono uppercase tracking-[0.2em] font-black ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                    <span>Sample Rate Supply</span>
                    <span className={`italic transition-colors ${metrics.aliasing ? 'text-red-500 font-bold underline' : accentColor}`}>{sampleRate} Hz</span>
                </div>
                <input type="range" min={4} max={64} step={1} value={sampleRate} onChange={(e) => setSampleRate(parseInt(e.target.value))} className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all ${metrics.aliasing ? 'bg-red-500/30 accent-red-500' : (isDarkMode ? 'bg-orange-500/30 accent-orange-500 shadow-orange-500/20 shadow-lg' : 'bg-orange-200 accent-orange-600 shadow-inner')}`} />
            </div>
        </div>
      </div>
    </div>
  );
};
