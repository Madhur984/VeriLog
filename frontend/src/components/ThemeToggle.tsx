import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useColorScheme } from '../hooks/useColorScheme';

export const ThemeToggle: React.FC<{ variant?: 'default' | 'minimal'; className?: string }> = ({ variant = 'default', className = '' }) => {
  const [scheme, toggle] = useColorScheme();
  const isLight = scheme === 'light';

  if (variant === 'minimal') {
    return (
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2.5 sm:p-2 text-text-dim hover:text-text-main transition-colors cursor-pointer shrink-0 ${className}`}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        style={{ background: 'transparent', border: 'none' }}
      >
        {isLight ? (
          <Sun size={13} className="text-orange-500" />
        ) : (
          <Moon size={13} className="text-cyan-400" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2.5 rounded-full border cursor-pointer flex items-center justify-center transition-colors shadow-sm ${className}`}
      style={{
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
        background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
        color: isLight ? '#ea580c' : '#22d3ee', // active colors: orange in light, cyan in dark
      }}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </motion.button>
  );
};
