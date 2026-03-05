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
                'deep-blue': '#0A0F1D', /* Matte deep blue */
                'midnight': '#0A0F1D',
                'ocean': '#111827', /* Matte ocean */
                'cobalt': '#1D4ED8', /* Matte accent */
                'sky': '#3B82F6',
                'laser': '#2563EB', /* Replaced neon with solid blue */
                'ice': '#E0F2FE',
                'frost': '#F0F9FF',
                'pg-success': '#10B981',
                'pg-warning': '#F59E0B',
                'ice-highlight': '#E0F2FE',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                sport: ['"Barlow Condensed"', 'sans-serif'],
            },
            borderRadius: {
                'pg-sharp': '0px',
                'pg-premium': '2px', /* Sharp architecture */
                'pg-pill': '9999px',
            }
        },
    },
    plugins: [
        tailwindcssAnimate
    ],
    darkMode: 'class',
}
