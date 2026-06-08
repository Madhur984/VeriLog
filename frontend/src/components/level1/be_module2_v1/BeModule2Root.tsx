import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BeModule2Engine } from './BeModule2Engine';

export const BeModule2Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return localStorage.getItem('bitforbytes_theme') !== 'light'; } catch { return true; } });
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <BeModule2Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default BeModule2Root;
