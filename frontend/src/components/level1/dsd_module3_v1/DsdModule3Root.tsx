import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DsdModule3Engine } from './DsdModule3Engine';

export const DsdModule3Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return localStorage.getItem('bitforbytes_theme') !== 'light'; } catch { return true; } });
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <DsdModule3Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule3Root;
