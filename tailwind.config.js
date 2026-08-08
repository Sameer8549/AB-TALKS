/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Palette via CSS channel variables ───────────────────────────────────
      // Using `rgb(var(--c-x) / <alpha-value>)` so every color AND every
      // opacity modifier (bg-signal/10, text-ash/40, etc.) auto-switch with theme.
      colors: {
        // Surfaces
        ink:       'rgb(var(--c-ink)      / <alpha-value>)',
        coal:      'rgb(var(--c-coal)     / <alpha-value>)',
        graphite:  'rgb(var(--c-graphite) / <alpha-value>)',
        rim:       'rgb(var(--c-rim)      / <alpha-value>)',
        // Text
        ash:       'rgb(var(--c-ash)      / <alpha-value>)',
        chalk:     'rgb(var(--c-chalk)    / <alpha-value>)',
        // Accent
        signal:    'rgb(var(--c-signal)   / <alpha-value>)',
        'signal-dim': 'rgb(var(--c-signal-dim) / <alpha-value>)',
      },

      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },

      // ─── Type Scale ──────────────────────────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      // ─── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        'card': '12px',
        'pill': '999px',
        'chip': '6px',
      },

      // ─── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        'link-forge': {
          '0%':   { opacity: '0', transform: 'scaleY(0.4)' },
          '60%':  { opacity: '1', transform: 'scaleY(1.05)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        'signal-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'link-forge':   'link-forge 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'signal-pulse': 'signal-pulse 2.4s ease-in-out infinite',
        'fade-up':      'fade-up 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-in':      'fade-in 0.4s ease forwards',
        'spin-slow':    'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
}
