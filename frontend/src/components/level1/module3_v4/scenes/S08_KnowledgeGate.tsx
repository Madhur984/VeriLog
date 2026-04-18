import React from 'react';
import { motion } from 'framer-motion';
import { CognitiveCheckpoint, CheckpointScene } from '../../../level3/CognitiveCheckpoint';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

/**
 * S08_KnowledgeGate
 * The final verification layer before completing the module.
 * Aligned with Module 2's S09_KnowledgeGate pattern.
 */
export const S08_KnowledgeGate: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="mb-12">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    7. Knowledge Gate -- Final Assessment
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Knowledge Gate</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                        Before the simulation ends, verify your understanding of binary systems. 
                        Correct logic is the key to advancement.
                    </p>
                </div>
            </div>

            <div className="w-full relative flex flex-col items-center">
                <CognitiveCheckpoint scene="numbersystems" onComplete={() => console.log('Gate Passed')} />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className={`mt-12 p-6 rounded-2xl border max-w-lg text-left ${
                        isDarkMode 
                        ? 'bg-sky-500/5 border-sky-500/20 text-sky-200' 
                        : 'bg-sky-50 border-sky-100 text-sky-900'
                    }`}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-sky-500" />
                        <span className="font-mono text-[10px] uppercase tracking-widest font-bold">1 AM Mentor Take</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-80">
                        Binary isn't just about counting -- it's about hardware mapping. When you look at a memory address, you're seeing billions of transistors synchronized in a perfect, logical dance.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
