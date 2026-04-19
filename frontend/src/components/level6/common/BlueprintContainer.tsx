import React from 'react';
import { motion } from 'framer-motion';

export const BlueprintContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-matte-obsidian/40 rounded-[60px] md:rounded-[80px] border border-white/5 ${className}`}>
      {/* Refined Blueprint Grid overlay specifically for cards */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-dot-grid opacity-30" />
         <div className="absolute inset-0 bg-blueprint-grid bg-[length:40px_40px] opacity-10" />
         
         {/* Kinetic PCB Pulse Traces */}
         <svg className="absolute w-full h-full text-plasma-cyan opacity-20" viewBox="0 0 1000 1000">
            <motion.path 
              d="M0 200 H200 L250 250 V400 L300 450 H1000" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.path 
              d="M1000 800 H800 L750 750 V600 L700 550 H0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
            />
         </svg>
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
