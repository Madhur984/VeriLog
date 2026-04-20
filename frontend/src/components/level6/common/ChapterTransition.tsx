import React from 'react';
import { motion } from 'framer-motion';

export const ChapterTransition: React.FC<{ chapter: string, title: string, isActive: boolean }> = ({ chapter, title, isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-8 relative text-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="inline-block px-4 py-1 rounded-full border border-plasma-cyan/30 bg-plasma-cyan/10 text-[10px] font-black uppercase tracking-[0.4em] text-plasma-cyan mb-4 animate-pulse">
            Establishing Phase: {chapter}
        </div>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
            {title}<span className="text-plasma-cyan">.</span>
        </h2>
        <div className="w-32 h-1 bg-plasma-cyan/30 mx-auto rounded-full overflow-hidden">
            <motion.div 
                initial={{ x: '-100%' }}
                animate={isActive ? { x: '100%' } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-plasma-cyan shadow-cyan-glow"
            />
        </div>
      </motion.div>
    </div>
  );
};

