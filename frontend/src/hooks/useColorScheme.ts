import { useCallback, useEffect, useSyncExternalStore } from 'react';

type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'bitforbytes_theme';

function systemPref(): ColorScheme {
  try {
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch { /* ignore */ }
  return 'dark';
}

function readInitial(): ColorScheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  // No explicit choice saved yet: follow the user's OS / browser preference.
  return systemPref();
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
  applyVariantClass();
}

// ── Theme variants (UI/UX plan §4.2) ───────────────────────────────────────
// `high-contrast` and `amber` are additive skins layered on top of the base
// light/dark scheme rather than replacements for it: they set their own
// `--vj-*` token values while leaving `.dark`/`.light` in place, so every
// component that keys off `isLight` keeps working untouched. Only the judge
// reads the variant tokens today, which is why this lives beside the scheme
// rather than replacing it.
export type ThemeVariant = 'standard' | 'high-contrast' | 'amber';

const VARIANT_KEY = 'bitforbytes_theme_variant';
const VARIANT_CLASS: Record<ThemeVariant, string | null> = {
  standard: null,
  'high-contrast': 'theme-contrast',
  amber: 'theme-amber',
};

function readVariant(): ThemeVariant {
  try {
    const v = localStorage.getItem(VARIANT_KEY);
    if (v === 'high-contrast' || v === 'amber' || v === 'standard') return v;
  } catch { /* ignore */ }
  // Respect an OS-level contrast preference when the user has not chosen.
  try {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-contrast: more)').matches) {
      return 'high-contrast';
    }
  } catch { /* ignore */ }
  return 'standard';
}

let currentVariant: ThemeVariant = typeof window === 'undefined' ? 'standard' : readVariant();

function applyVariantClass(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const cls of Object.values(VARIANT_CLASS)) if (cls) root.classList.remove(cls);
  const next = VARIANT_CLASS[currentVariant];
  if (next) root.classList.add(next);
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

// Follow live OS theme changes, but only until the user makes an explicit choice
// (once they toggle, their saved preference wins and we stop auto-following).
if (typeof window !== 'undefined' && window.matchMedia) {
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* ignore */ }
      if (saved === 'light' || saved === 'dark') return;
      const next: ColorScheme = e.matches ? 'dark' : 'light';
      if (next !== current) {
        current = next;
        applyClass(current);
        listeners.forEach((l) => l());
      }
    });
  } catch { /* ignore */ }
}

// Reflect the resolved scheme on <html> as early as possible (before the first
// consumer mounts) so a system-light user doesn't flash the dark default.
applyClass(current);

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

/**
 * Active theme variant with a setter. Shares the same listener set as the
 * scheme, so a variant change re-renders every consumer of either hook.
 */
export function useThemeVariant(): [ThemeVariant, (v: ThemeVariant) => void] {
  const variant = useSyncExternalStore<ThemeVariant>(
    subscribe, () => currentVariant, () => currentVariant,
  );

  const set = useCallback((v: ThemeVariant) => {
    if (v === currentVariant) return;
    currentVariant = v;
    applyVariantClass();
    try { localStorage.setItem(VARIANT_KEY, v); } catch { /* ignore */ }
    listeners.forEach((l) => l());
  }, []);

  return [variant, set];
}
