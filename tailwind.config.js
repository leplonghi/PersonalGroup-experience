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
                'deep-blue': '#080838',
                'midnight': '#0A0F2C',
                'ocean': '#0F1B3F',
                'cobalt': '#2563EB',
                'sky': '#3B82F6',
                'laser': '#00F2FF',
                'ice': '#E0F2FE',
                'frost': '#F0F9FF',
                'pg-success': '#10B981',
                'pg-warning': '#F59E0B',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
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
