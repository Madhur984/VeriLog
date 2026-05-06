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
                // ... existing colors ...
                'bg-void': '#0E1116',
                'bg-base': '#141922',
                'bg-elev': '#1C2430',
                'text-main': '#E6EDF3',
                'text-sub':  '#9AA4B2',
                'text-dim':  '#6B7280',
                'signal-core':    '#7DD3FC',
                'signal-bright':  '#BAE6FD',
                'signal-dim':     '#38BDF8',
                'signal-primary': '#7DD3FC',
                'accent-orange': '#F97316',
                'accent-soft':   '#FB923C',
                
                // ════ SILICON OBSERVATORY v3.1 TOKENS ════
                'observatory-bg': '#07080A',
                'observatory-surface': '#0D0F12',
                'observatory-surface-alt': '#131619',
                'cyan-muted': 'rgba(34,211,238,0.09)',
                'ghost-border': 'rgba(148,163,184,0.08)',
                'ghost-border-active': 'rgba(34,211,238,0.25)',

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
                'matte-obsidian': '#0A0A0B',
                'solder-mask': '#121215',
                'ghost-trace': '#2A2A35',
                'plasma-cyan': '#00D4FF',
                'cyan-mist': '#0088AA',
                'burnished-copper': '#FF5F1F',
                'oscilloscope-trace': '#E6E6ED',
                'grid-line': '#8A8A99',
            },
            fontFamily: {
                ui: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            backgroundImage: {
                'dot-grid': `radial-gradient(circle at 1px 1px, #2A2A35 0.5px, transparent 0.5px)`,
                'blueprint-grid': `linear-gradient(to right, rgba(0, 212, 255, 0.05) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0, 212, 255, 0.05) 1px, transparent 1px)`,
                'ghost-traces': `repeating-linear-gradient(90deg, #2A2A35 0px, #2A2A35 1px, transparent 1px, transparent 40px),
                                 repeating-linear-gradient(0deg, #2A2A35 0px, #2A2A35 1px, transparent 1px, transparent 40px)`,
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