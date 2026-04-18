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
    const bits = useBinaryStore(state => state.bits);
    const increment = useBinaryStore(state => state.increment);
    const isSystemBusy = useBinaryStore(state => state.isSystemBusy);
    const isIncrementing = useBinaryStore(state => state.isIncrementing);
    
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
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 4. The Carry Chain - Binary Counting in Action */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
            >
                4. The Carry Chain - Binary Counting in Action
            </motion.span>
            <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Binary Counting</h2>
            <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                To increment a binary number, we follow a simple recursive rule that creates a <strong>ripple effect</strong> across bits.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>The counting Rule</h3>
                <ol className={`space-y-4 text-sm ${textColor}`}>
                    <li className="flex gap-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isDarkMode ? 'bg-white/10' : 'bg-sky-100 text-sky-700'}`}>1</span>
                        <span>Start at bit 0 (LSB). If it is 0, change to 1. <strong>Done</strong>.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isDarkMode ? 'bg-white/10' : 'bg-sky-100 text-sky-700'}`}>2</span>
                        <span>If it is 1, change to 0 and <strong>carry</strong> 1 to the next bit.</span>
                    </li>
                    <li className="flex gap-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isDarkMode ? 'bg-white/10' : 'bg-sky-100 text-sky-700'}`}>3</span>
                        <span>Repeat for the next bit until no carry remains.</span>
                    </li>
                </ol>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>The Ripple Effect (7 -{'>'} 8)</h3>
                <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed ${textColor}`}>
{`  0 1 1 1  (7)
+        1
-----------
  1 0 0 0  (8)

Clock --+-> bit0: 1 -> 0 (Carry 1)
        |           |
        +-----------> bit1: 1 -> 0 (Carry 1)
                    |           |
                    +-----------> bit2: 1 -> 0 (Carry 1)
                                |           |
                                +-----------> bit3: 0 -> 1
`}
                </pre>
            </motion.div>
        </div>
      </section>

      {/* Propagation Delay & Overflow */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center gap-3 mb-4 text-red-500">
                <Boxes size={20} />
                <h3 className="font-black text-xl">Overflow Condition</h3>
            </div>
            <p className="text-sm opacity-70 mb-6 font-medium leading-relaxed">
                When adding to the maximum value (1111 for 4 bits), the carry propagates out of the system.
            </p>
            <div className={`p-6 rounded-2xl font-mono text-xs ${isDarkMode ? 'bg-black/40' : 'bg-white border border-red-100'}`}>
{`  1 1 1 1  (15)
+         1
-----------
1 0 0 0 0  (Stored: 0000)

Result: Overflow flag = 1
`}
            </div>
        </div>

        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-4 text-sky-500">
                <Zap size={20} />
                <h3 className="font-black text-xl">Propagation Delay</h3>
            </div>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
                Each bit flip takes a small amount of time (gate delay). The total ripple time is:
            </p>
            <div className="text-2xl font-mono font-black text-center mb-6">
                T_total = N * t_gate
            </div>
            <p className="text-xs opacity-50 italic">
                This "chain reaction" time is why higher clock speeds require faster physical materials and smaller circuits.
            </p>
        </div>
      </section>

      {/* Key Principle Callout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className={`p-10 rounded-[2.5rem] text-center border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}
      >
          <div className={`p-2 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-6 bg-sky-500`}>
            <Boxes size={20} className="text-white" />
          </div>
          <p className="text-xl md:text-2xl font-black leading-tight">
            "Binary counting is a cascade of decisions. One flip can trigger a chain reaction across the entire machine."
          </p>
      </motion.div>
    </div>
    );
};
 can trigger a chain reaction across the entire machine."
          </p>
      </motion.div>
    </div>
    );

};
