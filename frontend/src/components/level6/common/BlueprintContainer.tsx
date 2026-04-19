import React from 'react';
import { motion } from 'framer-motion';

export const BlueprintContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-matte-obsidian/40 rounded-[60px] md:rounded-[80px] border border-white/5 ${className}`}>
      {/* Refined Blueprint Grid overlay specifically for cards */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
         <div className="absolute inset-0 bg-dot-grid" />
         <div className="absolute inset-0 bg-blueprint-grid bg-[length:40px_40px]" />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
