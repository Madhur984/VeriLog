import React from 'react';
import { useParams } from 'react-router-dom';
import { Unlink } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { SubModuleShell } from '../_subtractor/SubEngine';
import { PAGES } from './scenes';

export const DsdModule41Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();

  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <SubModuleShell
        moduleNumber="41"
        moduleName="Asynchronous Sequential Circuits"
        Icon={Unlink}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default DsdModule41Root;
