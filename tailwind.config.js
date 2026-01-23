/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    500: "#58cc02", // Official Duolingo Green
                    600: "#58a700", // Darker Green (Shadow)
                },
                blue: {
                    400: "#1cb0f6", // Official Duolingo Blue
                    500: "#1899d6", // Darker Blue (Shadow)
                    100: "#ddf4ff", // Light Blue bg
                },
                orange: {
                    500: "#ff9600", // Brand Orange (VeriQuest)
                    600: "#cc7700", // Darker Orange (Shadow)
                },
                rose: {
                    500: "#ff4b4b", // Error/Hearts
                    600: "#d93636",
                },
                yellow: {
                    400: "#ffc800", // Stars/Gold
                    500: "#e5b400",
                },
                neutral: {
                    200: "#e5e5e5",
                    300: "#d7d7d7",
                    500: "#afafaf",
                    700: "#4b4b4b",
                },
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'], // Keep Outfit for headings
                body: ['Inter', 'sans-serif'],     // Keep Inter for body
            },
            boxShadow: {
                '3d': '0 4px 0 0', // The classic Duolingo 3D button effect
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [],
}