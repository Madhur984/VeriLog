import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';
import { useGlobalSensory } from '../../../../hooks/useGlobalSensory';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

export const S01_WhyBinary: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    
    const [isThresholdOn, setIsThresholdOn] = useState(false);
    const [noise, setNoise] = useState<number[]>(Array(50).fill(2.5));
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Simulate noisy analog signal
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setNoise(prev => {
                const next = prev.slice(1);
                const last = prev[prev.length - 1];
                const target = Math.random() > 0.5 ? 4.5 : 0.5; // High or Low target
                const drift = (target - last) * 0.1 + (Math.random() - 0.5) * 1.5;
                const newer = Math.min(5, Math.max(0, last + drift));
                return [...next, newer];
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isActive]);

    // Render Waveform
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;

        // Draw Signal
        ctx.beginPath();
        ctx.strokeStyle = isThresholdOn ? T.success : '#0EA5E9';
        noise.forEach((v, i) => {
            const x = (i / noise.length) * canvas.width;
            const y = canvas.height - (v / 5) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        if (isThresholdOn) {
            // Draw result bit (0 or 1)
            ctx.beginPath();
            ctx.strokeStyle = T.success;
            ctx.lineWidth = 4;
            noise.forEach((v, i) => {
                const x = (i / noise.length) * canvas.width;
                const bit = v > 2.5 ? 1 : 0;
                const bY = canvas.height - (bit === 1 ? 0.9 : 0.1) * canvas.height;
                if (i === 0) ctx.moveTo(x, bY);
                else ctx.lineTo(x, bY);
            });
            ctx.stroke();
        }
    }, [noise, isThresholdOn]);

    const handleThreshold = () => {
        setIsThresholdOn(true);
        triggerHaptic('heavy');
        playSound('success');
    };

    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 1.1 The Fundamental Choice */}
      <section className="text-center space-y-4">
        <motion.span 
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
        >
          1. The Pulse of Logic - Why Binary?
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Fundamental Choice</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          At the heart of every computer is a simple, powerful idea: <span className={subTextColor}>represent information using only two symbols, 0 and 1</span>.
        </p>
      </section>

      {/* 1.2 Analog vs Binary Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity size={16} className="text-red-500" />
            <h3 className={`font-mono text-xs uppercase tracking-widest ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Analog Signal (Continuous)</h3>
          </div>
          <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed opacity-80 overflow-x-auto ${textColor}`}>
{`Voltage
 5V -|     /-----
 4V -|    /
 3V -|   /
 2V -|  /
 1V -| /
 0V -+/----------> Time
`}
          </pre>
          <div className={`mt-6 p-4 rounded-xl text-xs opacity-60 italic border border-dashed ${isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
            Every tiny wiggle matters - noise is part of the signal.
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-sm'}`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap size={16} className={subTextColor} />
            <h3 className={`font-mono text-xs uppercase tracking-widest ${subTextColor}`}>Binary Signal (Discrete)</h3>
          </div>
          <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed ${subTextColor} overflow-x-auto`}>
{`Voltage
 5V -|############  (1)
     |
 2V -+------------  Threshold
     |
0.8V-|############  (0)
     +-----------> Time
`}
          </pre>
          <div className={`mt-6 p-4 rounded-xl text-xs opacity-80 font-medium italic border border-dashed ${isDarkMode ? 'border-sky-500/20' : 'border-sky-200'}`}>
            Small noise (wiggles) does not cross the threshold - signal is clean.
          </div>
        </motion.div>
      </div>

      {/* 1.3 Why Binary Wins Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`overflow-hidden rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
      >
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                    <th className={`p-6 font-mono text-xs uppercase tracking-widest ${subTextColor} w-1/4`}>Property</th>
                    <th className={`p-6 font-mono text-xs uppercase tracking-widest ${subTextColor}`}>Analog</th>
                    <th className={`p-6 font-mono text-xs uppercase tracking-widest ${subTextColor}`}>Binary</th>
                </tr>
            </thead>
            <tbody className={`text-sm ${textColor}`}>
                <tr className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className="p-6 font-bold">Noise immunity</td>
                    <td className="p-6 opacity-60">Poor - noise changes value</td>
                    <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700'}`}>
                            Excellent
                        </span>
                        <div className="mt-2 text-xs opacity-60 italic">Noise must cross large gap</div>
                    </td>
                </tr>
                <tr className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className="p-6 font-bold">Precision</td>
                    <td className="p-6 opacity-60">Infinite in theory, limited by noise</td>
                    <td className="p-6 font-bold text-sky-500">Finite but Exact</td>
                </tr>
                <tr className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className="p-6 font-bold">Storage</td>
                    <td className="p-6 opacity-60">Fragile (magnetic tape degrades)</td>
                    <td className="p-6 font-bold text-sky-500">Robust (perfect copies)</td>
                </tr>
                <tr className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <td className="p-6 font-bold">Computation</td>
                    <td className="p-6 opacity-60">Hard (needs precise components)</td>
                    <td className="p-6 font-bold text-sky-500">Easy (just switches)</td>
                </tr>
            </tbody>
        </table>
      </motion.div>

      {/* Final Insight Callout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className={`p-10 rounded-[2.5rem] text-center border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'}`}
      >
          <div className={`p-2 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-500'}`}>
            <Zap size={20} className="text-white" />
          </div>
          <p className="text-xl md:text-2xl font-black leading-tight italic">
            "Binary is not about representing all possible values - it is about representing enough values with <span className={subTextColor}>certainty</span>."
          </p>
      </motion.div>
    </div>
    );
};
