import { useEffect, useState } from 'react';

type ColorScheme = 'light' | 'dark';

/**
 * Custom hook to manage the active color scheme ('light' or 'dark').
 * Reads from and syncs to localStorage, and updates document element classes.
 */
export function useColorScheme(): [ColorScheme, () => void] {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    try {
      const saved = localStorage.getItem('bitforbytes_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (scheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('bitforbytes_theme', scheme);
    } catch {
      /* ignore */
    }
  }, [scheme]);

  const toggle = () => {
    setScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return [scheme, toggle];
}

