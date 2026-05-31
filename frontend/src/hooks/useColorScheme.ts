import { useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

/**
 * Theme is LOCKED to dark (light mode removed per product decision).
 *
 * This hook is intentionally a no-op shim: it always reports 'dark' and its
 * toggle does nothing, so the ~36 components that read `const [scheme] =
 * useColorScheme()` keep rendering their dark branch and any old toggle button
 * is inert. It also forces the <html> class to `dark` and clears any stale
 * 'light' preference left in localStorage from before.
 */
export function useColorScheme(): [ColorScheme, () => void] {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    try { localStorage.setItem('bitforbytes_theme', 'dark'); } catch { /* ignore */ }
  }, []);

  const toggle = () => { /* light mode removed - no-op */ };
  return ['dark', toggle];
}
