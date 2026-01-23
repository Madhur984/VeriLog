/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // Cyber-Industrial Palette
                void: {
                    DEFAULT: '#0F172A', // Deep Void (Background)
                    light: '#1E293B',   // Panel Grey (Surface)
                },
                panel: {
                    DEFAULT: '#1E293B',
                    border: '#334155',  // Bezel Grey (Border)
                },
                terminal: {
                    green: '#00DC82',   // Nvidia Green (Primary CTA)
                    dim: 'rgba(0, 220, 130, 0.1)',
                },
                signal: {
                    blue: '#3B82F6',    // Signal Blue (Selection/Clock)
                    cyan: '#06b6d4',    // Cyan for wires
                    magenta: '#d946ef', // Magenta for input/output keywords
                    orange: '#f97316',  // Orange for numbers
                },
                xp: {
                    gold: '#EAB308',    // XP Gold
                },
                status: {
                    error: '#EF4444',   // Bug Red
                    success: '#00DC82', // Same as terminal green
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'neon-green': '0 0 10px rgba(0, 220, 130, 0.5)',
                'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5)',
                'bezel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'scanline': 'scanline 2s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            }
        },
    },
    plugins: [],
}