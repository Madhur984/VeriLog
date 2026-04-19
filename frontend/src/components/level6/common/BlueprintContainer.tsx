import React from 'react';
import { motion } from 'framer-motion';

export const BlueprintContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-white/[0.03] backdrop-blur-[40px] rounded-[60px] md:rounded-[80px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] ${className}`}>
      {/* Specular Highlights (Apple Liquid Glass Style) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Organic Liquid Motion (Refractive Background) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0],
                x: [0, 20, 0],
                y: [0, -20, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(0,212,255,0.05),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,165,0,0.02),transparent_40%)] blur-[100px]" 
         />
         
         <div className="absolute inset-0 bg-dot-grid opacity-20 contrast-125" />
         <div className="absolute inset-0 bg-blueprint-grid bg-[length:40px_40px] opacity-5" />
         
         {/* Kinetic PCB Pulse Traces */}
         <svg className="absolute w-full h-full text-plasma-cyan opacity-10" viewBox="0 0 1000 1000">
            <motion.path 
              d="M0 200 H200 L250 250 V400 L300 450 H1000" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.path 
              d="M1000 800 H800 L750 750 V600 L700 550 H0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
            />
         </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
