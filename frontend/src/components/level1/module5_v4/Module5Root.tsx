import React from 'react';
import { Module5Engine } from './Module5Engine';
import { useColorScheme } from '../../../hooks/useColorScheme';

export const Module5Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <Module5Engine
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />
    </div>
  );
};

export default Module5Root;
