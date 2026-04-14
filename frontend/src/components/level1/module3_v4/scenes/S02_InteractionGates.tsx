import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Terminal } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { useGlobalSensory } from '../../../../hooks/useGlobalSensory';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S02_InteractionGates: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    
    // Using global store for state persistence across scrollytelling
    const bits = useBinaryStore(s => s.bits);
    const toggleSwitchBit = useBinaryStore(s => s.toggleSwitchBit);
    const isSystemBusy = useBinaryStore(s => s.isSystemBusy);
    const isBitTransitioning = useBinaryStore(s => s.isBitTransitioning);
    const isLogicOverlayVisible = useBinaryStore(s => s.isLogicOverlayVisible);

    const handleToggle = async (i: number) => {
        if (isSystemBusy || isBitTransitioning[i]) {
            if (isSystemBusy) triggerHaptic('micro');
            return;
        }
        
        triggerHaptic(i === 0 ? 'heavy' : 'light');
        playSound('snap');
        await toggleSwitchBit(i);
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
                    3.2 — Interaction Gates
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Digital Lever</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Manipulation of discrete states starts here. Each switch represents a <b>Bit</b> — the smallest unit of information. 
                        Toggle the switches to see the physical transition between logic levels.
                    </p>
                </div>
            </div>

            <div className={`w-full backdrop-blur-xl border rounded-[2rem] p-10 relative overflow-hidden transition-colors duration-500 ${cardBg}`}>
                {/* Switch Grid */}
                <div className="grid grid-cols-4 gap-8 mb-12">
                    {bits.map((bit, i) => (
                        <div key={i} className="flex flex-col items-center gap-6">
                            <span className="font-mono text-[10px] opacity-40 font-black tracking-widest uppercase">BIT_{3-i}</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleToggle(i)}
                                className={`w-16 h-28 rounded-2xl relative transition-all duration-300 border-2 overflow-hidden ${
                                    bit === 1 
                                    ? (isDarkMode ? 'bg-sky-500 border-sky-400' : 'bg-sky-500 border-sky-600 shadow-xl shadow-sky-500/40') 
                                    : (isDarkMode ? 'bg-black border-white/10' : 'bg-gray-100 border-gray-200')
                                }`}
                            >
                                <motion.div 
                                    animate={{ y: bit === 1 ? -10 : 10 }}
                                    className={`absolute inset-0 m-auto w-10 h-10 rounded-xl transition-all duration-300 shadow-lg ${
                                        bit === 1 
                                        ? 'bg-white' 
                                        : (isDarkMode ? 'bg-white/10' : 'bg-white')
                                    }`}
                                />
                                {bit === 1 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                                    />
                                )}
                            </motion.button>
                            <span className={`font-mono text-2xl font-black transition-colors ${bit === 1 ? subTextColor : 'opacity-20 ' + textColor}`}>
                                {bit}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Info Bar */}
                <div className={`w-full p-6 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                   <div className="flex items-center gap-4">
                        <Terminal size={14} className={subTextColor} />
                        <span className={`font-mono text-[10px] tracking-widest font-black uppercase ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                            Binary State:
                        </span>
                        <span className={`font-mono text-xs font-black ${subTextColor}`}>{bits.join('')}</span>
                   </div>
                   <div className="flex items-center gap-2">
                        <Info size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-tight">Toggle bits to unlock counting</span>
                   </div>
                </div>
            </div>
        </div>
    );
};
