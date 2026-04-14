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
        <span className={`font-mono text-[10px] tracking-[0.5em] uppercase ${subTextColor}`}>Module 03 — First Principles</span>
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
        <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-sky-50 border-sky-100'} border mb-8 text-left`}>
            <p className={`text-xl font-bold leading-relaxed mb-6 ${textColor}`}>
                Digital logic starts with a single question: <br/>
                <span className={subTextColor}>Is there voltage or not?</span>
            </p>
            <div className="space-y-4">
                {[
                  { label: "Number Systems", desc: "Decimal, Binary, Octal, and Hexadecimal foundations." },
                  { label: "The Binary Choice", desc: "Why machines prefer two states over ten." },
                  { label: "Interaction Gates", desc: "How switches become mathematical logic." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                    <div>
                      <h3 className={`text-sm font-black uppercase tracking-tight ${textColor}`}>{item.label}</h3>
                      <p className={`text-xs opacity-50 ${textColor}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
        </div>
        <div className="flex justify-center gap-4">
           <div className={`w-12 h-1 px-4 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9]`} />
           <div className={`w-12 h-1 px-4 rounded-full ${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-100'}`} />
        </div>
      </motion.div>
    </div>
  );
};
