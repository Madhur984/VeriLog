import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

/** Reads system preference, syncs with localStorage, and dispatches custom events */
export function useColorScheme(): [ColorScheme, () => void] {
    const getInitial = (): ColorScheme => {
        const stored = localStorage.getItem('bitforbytes_theme') as ColorScheme | null;
        if (stored) return stored;
        return 'dark'; // Default theme = 'dark'
    };

    const [scheme, setScheme] = useState<ColorScheme>(getInitial);

    /* Apply to <html> for Tailwind dark: variants and CSS variables override */
    useEffect(() => {
        const root = document.documentElement;
        if (scheme === 'light') {
            root.classList.add('light');
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        localStorage.setItem('bitforbytes_theme', scheme);
    }, [scheme]);

    /* Listen for system preference changes if user hasn't set one manually */
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('bitforbytes_theme')) {
                setScheme(e.matches ? 'light' : 'dark');
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    /* Listen for custom theme change events to sync in-memory state across hooks */
    useEffect(() => {
        const handler = (e: Event) => {
            const customEv = e as CustomEvent<ColorScheme>;
            if (customEv.detail && customEv.detail !== scheme) {
                setScheme(customEv.detail);
            }
        };
        window.addEventListener('bitforbytes-theme-change', handler);
        return () => window.removeEventListener('bitforbytes-theme-change', handler);
    }, [scheme]);

    /* Listen for toggle-theme custom event (backwards compatibility) */
    useEffect(() => {
        const handler = () => toggle();
        window.addEventListener('toggle-theme', handler);
        return () => window.removeEventListener('toggle-theme', handler);
    });

    const toggle = () => {
        setScheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('bitforbytes_theme', next);
            window.dispatchEvent(new CustomEvent('bitforbytes-theme-change', { detail: next }));
            return next;
        });
    };

    return [scheme, toggle];
}
