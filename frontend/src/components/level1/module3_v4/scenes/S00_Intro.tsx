import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S00_Intro: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className={`font-mono text-[10px] tracking-[0.5em] uppercase ${subTextColor}`}>First Principles</span>
        <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mt-4 ${textColor}`}>
          Binary <br/>
          <span className={subTextColor}>Awakening</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 1 }}
        className="space-y-6"
      >
        <p className={`text-xl font-medium leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
          Before logical equations. Before high-level abstractions. <br/>
          There is a physical choice between two states.
        </p>
        <div className="flex justify-center gap-4">
           <div className={`w-12 h-1 px-4 rounded-full ${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-100'}`} />
           <div className={`w-12 h-1 px-4 rounded-full bg-sky-500`} />
        </div>
      </motion.div>
    </div>
  );
};
