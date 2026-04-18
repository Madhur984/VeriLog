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
    const bits = useBinaryStore(state => state.bits);
    const toggleSwitchBit = useBinaryStore(state => state.toggleSwitchBit);
    const isSystemBusy = useBinaryStore(state => state.isSystemBusy);
    const isBitTransitioning = useBinaryStore(state => state.isBitTransitioning);
    const isLogicOverlayVisible = useBinaryStore(state => state.isLogicOverlayVisible);

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
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 2. The Engineering Choice - From Voltage to Bit */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
            >
                2. The Engineering Choice - From Voltage to Bit
            </motion.span>
            <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>From Voltage to Bit</h2>
            <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                Computers are made of silicon and metal. They do not understand "3" or "7". They understand <span className={subTextColor}>High Voltage</span> and <span className={subTextColor}>Low Voltage</span>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Comparator Theory</h3>
                <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed ${textColor}`}>
{`Input voltage --+-- Comparator --+-- Output 
                 |                 |
Reference -------+                 |
                                   |
                                   V
                           The "noise margin" 
                           protects the decision.
`}
                </pre>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Noise Margin Visual</h3>
                <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed ${textColor}`}>
{`Logic 1:  V_OH (High)
            ^  Noise Margin High
Undefined:  V_IH to V_IL (Forbidden)
            v  Noise Margin Low
Logic 0:  V_OL (Low)
`}
                </pre>
            </motion.div>
        </div>
      </section>
    </div>
    );
};
