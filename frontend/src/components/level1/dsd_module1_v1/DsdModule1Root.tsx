import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DsdModule1Engine } from './DsdModule1Engine';

export const DsdModule1Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <DsdModule1Engine
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule1Root;
