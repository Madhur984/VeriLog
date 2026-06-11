import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DsdModule7Engine } from './DsdModule7Engine';

export const DsdModule7Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return localStorage.getItem('bitforbytes_theme') !== 'light'; } catch { return true; } });
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <DsdModule7Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule7Root;
