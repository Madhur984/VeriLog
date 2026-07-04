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
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 5. Silicon Persistence -- Memory and Registers */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
            >
                5. Silicon Persistence -- Memory and Registers
            </motion.span>
            <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Silicon Persistence</h2>
            <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                Logic gates are instantaneous--they have no memory. To store a bit, we need <strong>Persistence</strong>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>The D-Flip-Flop</h3>
                <p className={`text-sm mb-6 ${textColor} leading-relaxed`}>
                    This is the atom of memory. It captures the input <strong>D</strong> only at the exact moment the <strong>Clock</strong> clicks (rising edge).
                </p>
                <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed ${textColor} ${isDarkMode ? 'bg-black/20' : 'bg-slate-100'} p-4 rounded-xl`}>
{`Clock:  ____
Data:   ______
        |
Capture Moment: Q = 1
Value stays until next tick.
`}
                </pre>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>The Register</h3>
                <p className={`text-sm mb-6 ${textColor} leading-relaxed`}>
                    A register is just a row of Flip-Flops sharing a single clock signal.
                </p>
                <div className="grid grid-cols-4 gap-2">
                    {[3,2,1,0].map(i => (
                        <div key={i} className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="text-[10px] opacity-40 mb-2">FlipFlop {i}</div>
                            <div className="font-mono font-bold">1 Bit</div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-[10px] opacity-50 italic text-center">Together: 4-Bit Output Bus</p>
            </motion.div>
        </div>
      </section>


      {/* 1 AM Mentor Take */}
      <div className={`p-8 rounded-3xl text-center ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-100'}`}>
          <p className={`font-mono text-xs font-black mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
              "1 AM Mentor Take"
          </p>
          <p className={`text-lg md:text-xl font-medium italic ${textColor}`}>
              "Logic is the lightning; memory is the jar. Without flip-flops, a computer is just a reaction--with them, it becomes a system with a past."
          </p>
      </div>
    </div>
    );
};
