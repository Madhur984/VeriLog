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
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    3.1 — The Engineering Choice
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Cost of Continuity</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Analog signals are rich, but they are fragile. Every electron collision in the wire adds noise. 
                        By choosing only <b>0</b> and <b>1</b>, we build a machine that can never be wrong.
                    </p>
                </div>
            </div>

            <div className={`w-full backdrop-blur-xl border rounded-[2rem] p-10 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white shadow-2xl shadow-sky-500/5 border-gray-100'}`}>
                <div className={`w-full h-48 rounded-2xl overflow-hidden border relative mb-8 ${isDarkMode ? 'bg-black border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <canvas ref={canvasRef} width={640} height={200} className="w-full h-full" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <Activity size={14} className={subTextColor} />
                        <span className={`font-mono text-[10px] uppercase font-bold ${subTextColor}`}>Physical Signal (V)</span>
                    </div>
                </div>

                <AnimatePresence>
                    {!isThresholdOn ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <p className="text-yellow-500 font-mono text-[10px] tracking-widest uppercase mb-6 font-bold">
                                Signal Corruption Detected. Recover Truth?
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleThreshold}
                                className="px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-mono text-[11px] font-black tracking-widest uppercase shadow-xl shadow-sky-500/20 transition-all active:scale-95"
                            >
                                <Zap size={14} className="inline mr-3" /> Apply Threshold
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                            <p className={`font-mono text-sm font-black mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                                "Reality is noisy. Binary is Certain."
                            </p>
                            <p className={`text-xs max-w-sm mx-auto opacity-60 leading-relaxed italic ${textColor}`}>
                                Thresholding effectively "cleans" the signal by mapping variable voltages to discrete logical levels.
                            </p>
                            <div className="mt-8 flex justify-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
                                <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse delay-75" />
                                <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse delay-150" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
