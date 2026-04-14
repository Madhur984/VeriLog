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
                    Final Assessment
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Knowledge Gate</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                        Before the simulation ends, verify your understanding of binary synthesis. 
                        Correct logic is the key to advancement.
                    </p>
                </div>
            </div>

            <div className="w-full relative">
                <CognitiveCheckpoint scene="arithmetic" onComplete={() => console.log('Gate Passed')} />
            </div>
        </div>
    );
};
