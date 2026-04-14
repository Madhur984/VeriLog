import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Cpu } from 'lucide-react';
import { SceneArithmetic } from '../../../level3/SceneArithmetic';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

/**
 * S05_ArithmeticSynthesis
 * Synthesis of logic into mathematics. 
 * Reuses the high-fidelity SceneArithmetic lab component but wraps it in the new architecture.
 */
export const S05_ArithmeticSynthesis: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    3.5 — Arithmetic Synthesis
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>Logic is Mathematics</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        By combining logic gates in specific ways, we move from simple state flipping to <b>Binary Addition</b>. 
                        Mathematics is not magic; it is the inevitable outcome of networked logic.
                    </p>
                </div>
            </div>

            <div className="w-full">
                {/* We can directly reuse the existing complex lab here to maintain its fidelity */}
                <SceneArithmetic onCorrect={() => console.log('Arithmetic Synthesis Complete')} />
            </div>

            <div className={`mt-12 flex items-center gap-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-sky-500/10' : 'bg-sky-100'}`}>
                    <Cpu size={18} className={subTextColor} />
                </div>
                <div>
                     <p className={`text-[10px] font-mono font-black uppercase tracking-widest ${subTextColor}`}>Hardware Verification</p>
                     <p className={`text-xs opacity-40 ${textColor}`}>Full Adder logic paths are being simulated in real-time.</p>
                </div>
            </div>
        </div>
    );
};
