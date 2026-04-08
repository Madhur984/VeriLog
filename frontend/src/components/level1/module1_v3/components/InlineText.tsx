import React from 'react';
import { motion } from 'framer-motion';

interface InlineTextProps {
  primary: string;
  secondary?: string;
}

export const InlineText: React.FC<InlineTextProps> = ({ primary, secondary }) => {
  return (
    <div className="absolute inset-x-0 bottom-32 flex flex-col items-center pointer-events-none z-20 px-8">
      <motion.div 
        key={primary}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="text-block flex flex-col gap-1 items-center"
      >
        <div 
          className="hero-text select-none text-center"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 0 6px rgba(0,0,0,0.6), 0 0 12px rgba(0,0,0,0.4)',
            fontSize: '1.8rem',
            letterSpacing: '0.1em'
          }}
        >
          {primary}
        </div>

        {secondary && (
          <div 
            className="body-text text-center opacity-60"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textShadow: '0 0 4px rgba(0,0,0,0.5)',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            {secondary}
          </div>
        )}
      </motion.div>
    </div>
  );
};
