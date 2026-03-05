import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'deep-blue': '#0c0a47',
                'midnight': '#0c0a47',
                'ocean': '#110e63',
                'cobalt': '#2563EB',
                'sky': '#3B82F6',
                'laser': '#00F2FF',
                'ice': '#E0F2FE',
                'frost': '#F0F9FF',
                'pg-success': '#10B981',
                'pg-warning': '#F59E0B',
                'ice-highlight': '#E0F2FE', // Blue-centric premium accent
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                sport: ['"Barlow Condensed"', 'sans-serif'],
            },
            borderRadius: {
                'pg-sharp': '4px',
                'pg-premium': '12px',
                'pg-pill': '9999px',
            }
        },
    },
    plugins: [
        tailwindcssAnimate
    ],
    darkMode: 'class',
}
