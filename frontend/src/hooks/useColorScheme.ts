import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

/** Reads system preference, syncs with localStorage, and dispatches custom events */
export function useColorScheme(): [ColorScheme, () => void] {
    const getInitial = (): ColorScheme => {
        const stored = localStorage.getItem('digi_theme') as ColorScheme | null;
        if (stored) return stored;
        return 'light'; // Force light mode as default for the 'whitepage' request
    };

    const [scheme, setScheme] = useState<ColorScheme>(getInitial);

    /* Apply to <html> for Tailwind dark: variants */
    useEffect(() => {
        const root = document.documentElement;
        if (scheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('digi_theme', scheme);
    }, [scheme]);

    /* Listen for system preference changes */
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const handler = (e: MediaQueryListEvent) => {
            // Only update if user hasn't manually set a preference
            if (!localStorage.getItem('digi_theme')) {
                setScheme(e.matches ? 'light' : 'dark');
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    /* Listen for toggle-theme custom event (from CommandPalette) */
    useEffect(() => {
        const handler = () => toggle();
        window.addEventListener('toggle-theme', handler);
        return () => window.removeEventListener('toggle-theme', handler);
    });

    const toggle = () => {
        setScheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('digi_theme', next);
            return next;
        });
    };

    return [scheme, toggle];
}
