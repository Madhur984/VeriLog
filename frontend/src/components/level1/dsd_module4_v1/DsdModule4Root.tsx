import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DsdModule4Engine } from './DsdModule4Engine';

export const DsdModule4Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return localStorage.getItem('bitforbytes_theme') !== 'light'; } catch { return true; } });
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <DsdModule4Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule4Root;
