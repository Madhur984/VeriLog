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
                ui: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
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
                'cyan-glow': '0 0 6px #00D4FF, 0 0 2px #00D4FF inset',
                'observatory-glow': '0 0 24px rgba(34,211,238,0.35)',
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