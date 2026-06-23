import React from 'react';
import { useParams } from 'react-router-dom';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Cpu } from 'lucide-react';
import { TransistorModuleShell } from '../_transistor/kit';
import { PAGES } from './scenes';

export const BeModule6Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const { chapter } = useParams<{ chapter?: string }>();
  return (
    <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
      <TransistorModuleShell
        moduleNumber="6"
        moduleName="BJT Construction & Operation"
        Icon={Cpu}
        pages={PAGES}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        initialChapter={chapter}
      />
    </div>
  );
};

export default BeModule6Root;
