import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BeModule3Engine } from './BeModule3Engine';

export const BeModule3Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <BeModule3Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default BeModule3Root;
