import React from 'react';
import { useParams } from 'react-router-dom';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { DsdModule4Engine } from './DsdModule4Engine';

export const DsdModule4Root: React.FC = () => {
  // Theme lives in the shared color-scheme store so the portal's floating toggle
  // and the module's own sidebar toggle stay in sync and apply instantly.
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <DsdModule4Engine
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule4Root;
