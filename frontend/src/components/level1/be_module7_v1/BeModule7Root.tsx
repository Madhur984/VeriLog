import React from 'react';
import { useParams } from 'react-router-dom';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { SlidersHorizontal } from 'lucide-react';
import { TransistorModuleShell } from '../_transistor/kit';
import { PAGES } from './scenes';

export const BeModule7Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();
  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <TransistorModuleShell
        moduleNumber="7"
        moduleName="BJT DC Biasing"
        Icon={SlidersHorizontal}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default BeModule7Root;
