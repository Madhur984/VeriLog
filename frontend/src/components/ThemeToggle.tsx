import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useColorScheme } from '../hooks/useColorScheme';

export const ThemeToggle: React.FC = () => {
  const [scheme, toggle] = useColorScheme();
  const isLight = scheme === 'light';

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2.5 rounded-full border cursor-pointer flex items-center justify-center transition-colors shadow-sm"
      style={{
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
        background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
        color: isLight ? '#ea580c' : '#22d3ee', // active colors: orange in light, cyan in dark
      }}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </motion.button>
  );
};
