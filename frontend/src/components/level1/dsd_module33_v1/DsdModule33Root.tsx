import React from 'react';
import { useParams } from 'react-router-dom';
import { Repeat2 } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { SubModuleShell } from '../_subtractor/SubEngine';
import { PAGES } from './scenes';

export const DsdModule33Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <SubModuleShell
        moduleNumber="33"
        moduleName="FF Conversions"
        Icon={Repeat2}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule33Root;
