/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            colors: {
                'bg-void': 'var(--bg-void)',
                'bg-base': 'var(--bg-base)',
                'bg-elev': 'var(--bg-elev)',
                'text-main': 'var(--text-main)',
                'text-sub':  'var(--text-sub)',
                'text-dim':  'var(--text-dim)',
                'signal-core':    'var(--signal-core)',
                'signal-bright':  'var(--signal-bright)',
                'signal-dim':     'var(--signal-dim)',
                'signal-primary': 'var(--signal-primary)',
                'accent-orange': 'var(--accent-orange)',
                'accent-soft':   'var(--accent-soft)',
                'accent-pink':   'var(--accent-pink)',
                'border-soft':   'var(--border-soft)',
                'edge':          'var(--edge)',
                'edge-strong':   'var(--edge-strong)',
                'neo-bg':        'var(--neo-bg)',

                // ════ SILICON OBSERVATORY v3.1 TOKENS ════
                'observatory-bg': 'var(--observatory-bg)',
                'observatory-surface': 'var(--observatory-surface)',
                'observatory-surface-alt': 'var(--observatory-surface-alt)',
                'cyan-muted': 'var(--cyan-muted)',
                'ghost-border': 'var(--ghost-border)',
                'ghost-border-active': 'var(--ghost-border-active)',

                // Legacy shadcn tokens
                border:     'hsl(var(--border))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                'card': {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                // ════ ECE POKÉDEX DESIGN TOKENS ════
                'matte-obsidian': 'var(--matte-obsidian)',
                'solder-mask': 'var(--solder-mask)',
                'ghost-trace': 'var(--ghost-trace)',
                'plasma-cyan': 'var(--plasma-cyan)',
                'cyan-mist': 'var(--cyan-mist)',
                'burnished-copper': 'var(--burnished-copper)',
                'oscilloscope-trace': 'var(--oscilloscope-trace)',
                'grid-line': 'var(--grid-line)',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
                ui: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
            },
            /* Site-wide readability bump. Most body text uses text-sm / text-xs,
               which at Tailwind's defaults (14px / 12px) read too small. Enlarge
               the small-to-mid range one notch each for comfortable reading.
               2xl/3xl+ are intentionally left at defaults so headings/hero titles
               keep their tuned sizes and don't overflow cards. Font size and
               spacing use separate scales, so layouts are unaffected. */
            fontSize: {
                xs:   ['0.8125rem', '1.15rem'],  // 13px  (was 12)
                sm:   ['0.9375rem', '1.4rem'],   // 15px  (was 14)
                base: ['1.0625rem', '1.65rem'],  // 17px  (was 16)
                lg:   ['1.1875rem', '1.8rem'],   // 19px  (was 18)
                xl:   ['1.3125rem', '1.85rem'],  // 21px  (was 20)
            },
            /* Less rounded, more editorial/classy — shrink the big radii site-wide
               (rounded-full pills are intentionally left untouched). */
            borderRadius: {
                sm: '3px',
                md: '5px',
                lg: '6px',
                xl: '8px',
                '2xl': '10px',
                '3xl': '12px',
            },
            backgroundImage: {
                'dot-grid': `radial-gradient(var(--ghost-trace) 1px, transparent 1px)`,
                'blueprint-grid': `linear-gradient(to right, rgba(0, 212, 255, 0.05) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0, 212, 255, 0.05) 1px, transparent 1px)`,
                'ghost-traces': `linear-gradient(90deg, var(--ghost-trace) 1px, transparent 1px),
                                 linear-gradient(0deg, var(--ghost-trace) 1px, transparent 1px)`,
            },
            backgroundSize: {
                'dot-grid': '24px 24px',
                'ghost-traces': '40px 40px',
            },
            boxShadow: {
                'cyan-glow': '0 0 0 0 transparent',
                'observatory-glow': '0 0 0 0 transparent',
                // ── Hybrid design system: brutalist offset + neomorphic twin shadows ──
                'brutal': '4px 4px 0 0 var(--brutal-sh)',
                'brutal-sm': '3px 3px 0 0 var(--brutal-sh)',
                'brutal-lg': '6px 6px 0 0 var(--brutal-sh)',
                'brutal-xl': '8px 8px 0 0 var(--brutal-sh)',
                // Tactile-brutalist reading surfaces now use the same hard blur-0 offset (smaller than controls)
                'neo': '3px 3px 0 0 var(--brutal-sh)',
                'neo-sm': '2px 2px 0 0 var(--brutal-sh)',
                'neo-inset': 'inset 0 2px 6px rgba(0,0,0,0.35)',
            },
            transitionTimingFunction: {
                'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
            },
            animation: {
                'laser-sweep': 'laser-sweep 1.6s linear infinite',
                'gentle-pulse': 'gentle-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                'laser-sweep': {
                    '0%': { top: '0%', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' },
                },
                'gentle-pulse': {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}