import React from 'react';
import { motion } from 'framer-motion';

interface Line {
  text: string;
  delay?: number;
}

interface Props {
  lines: Line[];
  className?: string;
}

export const InsightText: React.FC<Props> = ({ lines, className }) => (
  <div className={`flex flex-col gap-3 pointer-events-none select-none ${className ?? ''}`}>
    {lines.map((line, i) => {
      const isHero = i === 0 && lines.length > 1;
      return (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: line.delay ?? i * 0.4, 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className={isHero ? 'v3-hero' : 'v3-body'}
        >
          {line.text}
        </motion.p>
      );
    })}
  </div>
);
