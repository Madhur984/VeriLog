import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Boxes, ArrowRightCircle } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { useGlobalSensory } from '../../../../hooks/useGlobalSensory';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S03_TheCarryChain: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const bits = useBinaryStore(s => s.bits);
    const increment = useBinaryStore(s => s.increment);
    const isSystemBusy = useBinaryStore(s => s.isSystemBusy);
    const isIncrementing = useBinaryStore(s => s.isIncrementing);
    
    const [prediction, setPrediction] = useState<number[] | null>(null);
    const [predictionStatus, setPredictionStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    const handleIncrement = async () => {
        if (isSystemBusy || isIncrementing) {
            triggerHaptic('micro');
            return;
        }

        if (predictionStatus === 'idle') {
            triggerHaptic('heavy');
            // ... (Prediction logic could go here, but for scrollytelling we'll keep it focused)
        }
        
        await increment(true);
        triggerHaptic('success');
    };

    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
    const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white shadow-2xl shadow-sky-500/5 border-gray-100';

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    3.3 — The Carry Chain
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>Synchronous Progress</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Binary counting isn't just incrementing. It's a cascade of transitions. Notice how a single bit flip can ripple 
                        across the entire bits (nibble) when it overflows. This is the <b>Carry Chain</b>.
                    </p>
                </div>
            </div>

            <div className={`w-full backdrop-blur-xl border rounded-[2rem] p-12 relative overflow-hidden transition-colors duration-500 ${cardBg}`}>
                {/* Counter Simulation Visual */}
                <div className="flex justify-center gap-6 mb-16">
                    {bits.map((bit, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <motion.div 
                                animate={{ 
                                    scale: isIncrementing ? [1, 1.1, 1] : 1,
                                    rotateX: bit === 1 ? 0 : 180
                                }}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                                    bit === 1 
                                    ? (isDarkMode ? 'bg-sky-500/20 border-sky-500' : 'bg-sky-50 border-sky-400 shadow-lg shadow-sky-500/10') 
                                    : (isDarkMode ? 'bg-black border-white/10 opacity-30' : 'bg-gray-100 border-gray-200 opacity-50')
                                }`}
                                style={{ perspective: 1000 }}
                            >
                                <span className={`text-2xl font-black ${bit === 1 ? subTextColor : textColor}`}>{bit}</span>
                            </motion.div>
                            <span className="font-mono text-[9px] opacity-30 font-bold">2^{3-i}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleIncrement}
                        disabled={isSystemBusy || isIncrementing}
                        className={`group px-12 py-6 rounded-2xl font-mono text-xs font-black tracking-[0.2em] uppercase transition-all flex items-center gap-4 ${
                            isSystemBusy || isIncrementing
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : (isDarkMode ? 'bg-sky-500 text-white shadow-2xl shadow-sky-500/20' : 'bg-sky-600 text-white shadow-2xl shadow-sky-600/30')
                        }`}
                    >
                        <Zap size={16} className={isIncrementing ? 'animate-pulse' : ''} />
                        Cycle Hardware Clock
                        <ArrowRightCircle size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    
                    <div className="flex items-center gap-8 opacity-40">
                         <div className="flex items-center gap-2">
                            <Boxes size={14} />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Base_10: {parseInt(bits.join(''), 2)}</span>
                         </div>
                         <div className="h-4 w-px bg-current opacity-20" />
                         <div className="flex items-center gap-2">
                             <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Overflow: {parseInt(bits.join(''), 2) === 15 ? 'Critical' : 'Safe'}</span>
                         </div>
                    </div>
                </div>

                {/* Aesthetic Detail: Connection Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/10 to-transparent -z-10" />
            </div>
        </div>
    );

};
