import React, { useState } from 'react';
import { Module5Engine } from './Module5Engine';

export const Module5Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <Module5Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
};

export default Module5Root;
