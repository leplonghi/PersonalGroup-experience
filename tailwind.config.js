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
                // ── Brand Core (aligned with index.css CSS vars) ──────────
                'deep-blue': '#25235b',    // Brand dark purple-blue
                'midnight': '#171638',     // Deepest dark surface
                'ocean': '#1a1945',        // Dark card surface
                'cobalt': '#00b6fd',       // Brand cyan — PRIMARY ACCENT
                'sky': '#3363a2',          // Secondary blue / hover
                'laser': '#00b6fd',        // Alias for cobalt
                'ice': '#F8FAFC',          // Near-white light bg
                'frost': '#FFFFFF',        // White

                // ── Semantic Status ────────────────────────────────────────
                'pg-success': '#10B981',   // Emerald green
                'pg-warning': '#F59E0B',   // Amber

                // ── Light Accents ──────────────────────────────────────────
                'ice-highlight': '#F1F5F9',

                // --- NOVAS CORES (Expansão) ---
                'pg-cobalt':    '#00b6fd',   // alias com prefixo pg- para CSS vars
                'pg-deep':      '#021141',
                'pg-navy':      '#021141',
                'pg-sky':       '#3363a2',
                'pg-midnight':  '#01081f',
                'pg-ice':       '#F8FAFC',

                // Superfícies semânticas para uso nos componentes:
                'pg-surface-dark':  '#0b1f4a',   // cards em dark mode
                'pg-surface-light': '#ffffff',   // cards em light mode
                'pg-border-main':   'rgba(255,255,255,0.08)',
                'pg-text-main':     '#F8FAFC',   // texto principal dark mode
                'pg-text-muted':    'rgba(248,250,252,0.50)',
            },
            animation: {
                'pulso-suave': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'entrada-baixo': 'slideUp 0.4s ease-out',
                'entrada-cima': 'slideDown 0.3s ease-out',
                'aparecer': 'fadeIn 0.35s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                sport: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            borderRadius: {
                'pg-sharp': '0px',
                'pg-premium': '16px',   // Matches --pg-radius-premium in CSS
                'pg-pill': '9999px',
            },
            fontSize: {
                // Micro scale — used pervasively across the app
                'micro': ['8px', { lineHeight: '1.2', letterSpacing: '0.05em' }],
                '2xs':   ['9px', { lineHeight: '1.3', letterSpacing: '0.04em' }],
                'label': ['10px', { lineHeight: '1.4', letterSpacing: '0.03em' }],
                'caption': ['11px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
            },
            boxShadow: {
                'card':     '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
                'elevated': '0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.05)',
                'modal':    '0 8px 32px rgba(0,0,0,0.14), 0 24px 64px rgba(0,0,0,0.10)',
                'cobalt':   '0 6px 20px rgba(0,182,253,0.30)',
                'emerald':  '0 6px 20px rgba(16,185,129,0.30)',
                'amber':    '0 6px 20px rgba(245,158,11,0.30)',
            },
            zIndex: {
                'chrome': '100',   // Header + Navigation
                'modal':  '200',   // Modals, drawers
                'toast':  '300',   // Toasts, notifications
            },
        },
    },
    plugins: [
        tailwindcssAnimate
    ],
    darkMode: 'class',
}
