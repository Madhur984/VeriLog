import React from 'react';
import { motion } from 'framer-motion';
import { SceneLogicBridge } from '../../../level3/SceneLogicBridge';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S06_LogicBridge: React.FC<Props> = ({ isActive, isDarkMode }) => {
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
                    3.6 — The Logic Bridge
                </motion.span>
                <h2 className={`text-4xl font-black mb-6 ${textColor}`}>The Transistor's Dream</h2>
                <div className="max-w-xl mx-auto">
                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        The bridge between signal and computation is now closed. You have seen how voltage becomes bit, 
                        bit becomes count, count becomes memory, and memory becomes math.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <SceneLogicBridge onComplete={() => console.log('Logic Bridge Verified')} />
            </div>
        </div>
    );
};
