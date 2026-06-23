import React from 'react';
import { useParams } from 'react-router-dom';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { AudioLines } from 'lucide-react';
import { TransistorModuleShell } from '../_transistor/kit';
import { PAGES } from './scenes';

export const BeModule8Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();
  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <TransistorModuleShell
        moduleNumber="8"
        moduleName="BJT AC Analysis"
        Icon={AudioLines}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default BeModule8Root;
