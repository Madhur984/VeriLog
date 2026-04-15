import React from 'react';
import { Module3Engine } from './Module3Engine';
import { useColorScheme } from '../../../hooks/useColorScheme';

export const Module3Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return <Module3Engine isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />;
};
