/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Palette: "Ink & Signal" ─────────────────────────────────────────────
      // Named for what they represent, not just what they look like.
      colors: {
        // Surfaces
        ink:       '#0C0E14', // Background — the late-night screen
        coal:      '#13151F', // Card surface — just above background
        graphite:  '#1E2133', // Elevated surface — nav, modals, raised cards
        rim:       '#2A2D42', // Borders, dividers, hairlines

        // Text
        ash:       '#6B7191', // Muted / secondary text, inactive states
        chalk:     '#DDE1EA', // Primary body text — high contrast, readable at 11pm

        // Accent — used ONLY for streaks, CTAs, active/today states
        signal:    '#F4B942', // Amber — streak fire, momentum, the thing you don't let go cold

        // Signal scale for nuanced usage
        'signal-dim':    '#C49030', // Dimmed amber — used in cracked/recovered chain links
        'signal-faint':  '#F4B94215', // 8% opacity amber — ambient glow backgrounds
        'signal-glow':   '#F4B94240', // 25% opacity amber — active day halos
      },

      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        // Display — Space Grotesk: technical feel, tight tracking, personality
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        // Body — Outfit: readable, slightly rounded, warm for tired eyes
        body:    ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        // Mono — JetBrains Mono: day counters, commit codes, status badges
        mono:    ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },

      // ─── Type Scale ──────────────────────────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }], // 10px — eyebrow labels
      },

      // ─── Spacing ─────────────────────────────────────────────────────────────
      // Mobile-first: generous thumb-friendly targets
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      // Consistent radius scale: sharp cards, pill buttons
      borderRadius: {
        'card': '12px',  // Cards, panels
        'pill': '999px', // Buttons, badges
        'chip': '6px',   // Small status chips
      },

      // ─── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        // Chain link "forge" — completes a day
        'link-forge': {
          '0%':   { opacity: '0', transform: 'scaleY(0.4)' },
          '60%':  { opacity: '1', transform: 'scaleY(1.05)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        // Signal pulse — today's link breathing
        'signal-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        // Fade up — section reveals
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Fade in — simple opacity reveal
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'link-forge':    'link-forge 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'signal-pulse':  'signal-pulse 2.4s ease-in-out infinite',
        'fade-up':       'fade-up 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-in':       'fade-in 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}
