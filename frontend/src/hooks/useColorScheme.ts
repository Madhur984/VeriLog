import { useCallback, useEffect, useSyncExternalStore } from 'react';

type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'bitforbytes_theme';

function readInitial(): ColorScheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  } catch {
    return 'dark';
  }
}

// ── Shared module-level state ──────────────────────────────────────────────
// All useColorScheme() consumers read this SAME value through an external store,
// so a toggle anywhere (e.g. the ThemeToggle in the portal's profile card) makes
// every other consumer re-render in lock-step. Previously each component held its
// own useState, so toggling in one place left the rest (the whole portal) stuck
// on its initial theme — "light mode not working".
let current: ColorScheme = typeof window === 'undefined' ? 'dark' : readInitial();
const listeners = new Set<() => void>();

function applyClass(scheme: ColorScheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (scheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

function setScheme(scheme: ColorScheme): void {
  if (scheme === current) return;
  current = scheme;
  applyClass(scheme);
  try { localStorage.setItem(STORAGE_KEY, scheme); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

// Cross-tab + external writes to the key keep every tab in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== current) {
      current = e.newValue;
      applyClass(current);
      listeners.forEach((l) => l());
    }
  });
}

/**
 * Active color scheme ('light' | 'dark') with a toggle. Backed by a shared store
 * so all consumers stay in sync and the document `.light` / `.dark` class always
 * matches the returned value.
 */
export function useColorScheme(): [ColorScheme, () => void] {
  const scheme = useSyncExternalStore<ColorScheme>(subscribe, () => current, () => current);

  // Make sure the document class reflects the current scheme on mount.
  useEffect(() => { applyClass(current); }, []);

  const toggle = useCallback(() => {
    setScheme(current === 'dark' ? 'light' : 'dark');
  }, []);

  return [scheme, toggle];
}

/** Imperatively set the scheme (used by pages that force a theme, e.g. the landing). */
export function setColorScheme(scheme: ColorScheme): void {
  setScheme(scheme);
}
