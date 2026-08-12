import React from 'react';
import { useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { SubModuleShell } from '../_subtractor/SubEngine';
import { PAGES } from './scenes';

export const DsdModule29Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <SubModuleShell
        moduleNumber="29"
        moduleName="Latches"
        Icon={Lock}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule29Root;
