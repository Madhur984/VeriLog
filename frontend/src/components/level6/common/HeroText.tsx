import React from 'react';
import { motion } from 'framer-motion';

export const HeroText: React.FC<{ children: React.ReactNode, color?: string, className?: string }> = ({ children, color = "text-plasma-cyan", className = "" }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`hero-text text-5xl md:text-7xl lg:text-8xl italic uppercase text-center ${color} ${className}`}
    >
      {children}
    </motion.h1>
  );
};
