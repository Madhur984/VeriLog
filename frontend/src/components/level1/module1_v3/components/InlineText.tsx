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
        <div className="hero-text select-none text-center">
          {primary}
        </div>

        {secondary && (
          <div className="body-text text-center opacity-75">
            {secondary}
          </div>
        )}
      </motion.div>
    </div>
  );
};
