import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Database, History } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { useGlobalSensory } from '../../../../hooks/useGlobalSensory';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S04_SiliconPersistence: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const bits = useBinaryStore(s => s.bits);
    const storeValue = useBinaryStore(s => s.storeValue);
    const storedValue = useBinaryStore(s => s.storedValue);
    const isWriting = useBinaryStore(s => s.isWriting);
    const isSystemBusy = useBinaryStore(s => s.isSystemBusy);

    const handleStore = async () => {
        if (isSystemBusy || isWriting) return;
        triggerHaptic('heavy');
        playSound('success');
        await storeValue(true);
    };

    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
    const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white shadow-2xl shadow-sky-500/5 border-gray-100';

    const currentVal = parseInt(bits.slice(0, 4).join(''), 2).toString(16).toUpperCase();
    const formattedStoredVal = storedValue !== null ? storedValue.toString(16).toUpperCase() : '?';

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    3.4 — Silicon Persistence
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Memory Abstraction</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Computation is temporary. Memory is persistent. By storing a binary state into a <b>Register</b>, 
                        we capture a moment in time, allowing it to be used as an input for future operations.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Active Bus */}
                <div className={`backdrop-blur-xl border rounded-[2rem] p-10 flex flex-col items-center justify-between transition-colors duration-500 ${cardBg}`}>
                    <div className="flex items-center gap-3 self-start opacity-40 font-mono text-[10px] font-bold uppercase tracking-widest mb-8">
                        <History size={14} />
                        Active Logic Bus
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <span className={`text-6xl font-black font-mono mb-2 ${textColor}`}>{currentVal}</span>
                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 ${textColor}`}>Hex Output</span>
                    </div>

                    <div className="w-full h-px bg-current opacity-5 my-8" />
                    
                    <div className="flex gap-2">
                        {bits.slice(0, 4).map((b, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${b === 1 ? 'bg-sky-500' : 'bg-gray-200 opacity-20'}`} />
                        ))}
                    </div>
                </div>

                {/* Stored Register */}
                <div className={`backdrop-blur-xl border rounded-[2rem] p-10 flex flex-col items-center justify-between transition-colors duration-500 overflow-hidden relative ${
                    storedValue !== null 
                    ? (isDarkMode ? 'bg-sky-950/20 border-sky-400' : 'bg-sky-50 border-sky-200') 
                    : cardBg
                }`}>
                    <div className="flex items-center gap-3 self-start opacity-40 font-mono text-[10px] font-bold uppercase tracking-widest mb-8">
                        <Database size={14} />
                        Static Register Store
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                        <motion.span 
                            key={formattedStoredVal}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-6xl font-black font-mono mb-2 ${storedValue !== null ? subTextColor : 'opacity-10 ' + textColor}`}
                        >
                            {formattedStoredVal}
                        </motion.span>
                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 ${textColor}`}>Stored State</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStore}
                        disabled={isSystemBusy || isWriting}
                        className={`w-full mt-8 py-5 rounded-2xl font-mono text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${
                            isWriting 
                            ? 'bg-sky-400 text-white cursor-wait' 
                            : (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
                        }`}
                    >
                        <Save size={14} className={isWriting ? 'animate-bounce' : ''} />
                        {isWriting ? 'Writing to Silicon...' : 'Commit to Register'}
                    </motion.button>

                    {isWriting && (
                         <motion.div 
                            className="absolute inset-0 bg-sky-500/10 pointer-events-none"
                            initial={{ x: '-100%' }} animate={{ x: '100%' }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                         />
                    )}
                </div>
            </div>
        </div>
    );
};
