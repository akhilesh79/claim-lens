/** @type {import('tailwindcss').Config} */
const withAlpha = (cssVar) => `rgb(var(${cssVar}) / <alpha-value>)`;

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="claimlens"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas:        withAlpha('--color-canvas'),
        surface:       withAlpha('--color-surface'),
        'surface-muted': withAlpha('--color-surface-muted'),
        'surface-sunk':  withAlpha('--color-surface-sunk'),
        border:        withAlpha('--color-border'),
        'border-strong': withAlpha('--color-border-strong'),
        text:          withAlpha('--color-text'),
        'text-muted':  withAlpha('--color-text-muted'),
        'text-subtle': withAlpha('--color-text-subtle'),
        'text-inverse': withAlpha('--color-text-inverse'),
        brand: {
          50:  withAlpha('--color-brand-50'),
          100: withAlpha('--color-brand-100'),
          500: withAlpha('--color-brand-500'),
          600: withAlpha('--color-brand-600'),
          700: withAlpha('--color-brand-700'),
        },
        success: {
          bg:     withAlpha('--color-success-bg'),
          fg:     withAlpha('--color-success-fg'),
          border: withAlpha('--color-success-border'),
        },
        warning: {
          bg:     withAlpha('--color-warning-bg'),
          fg:     withAlpha('--color-warning-fg'),
          border: withAlpha('--color-warning-border'),
        },
        danger: {
          bg:     withAlpha('--color-danger-bg'),
          fg:     withAlpha('--color-danger-fg'),
          border: withAlpha('--color-danger-border'),
        },
        info: {
          bg:     withAlpha('--color-info-bg'),
          fg:     withAlpha('--color-info-fg'),
          border: withAlpha('--color-info-border'),
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        'elev-1': 'var(--elev-1)',
        'elev-2': 'var(--elev-2)',
        'elev-3': 'var(--elev-3)',
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight }]
        caption:    ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        small:      ['13px', { lineHeight: '18px', fontWeight: '400' }],
        body:       ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-strong': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        h3:         ['15px', { lineHeight: '22px', fontWeight: '600' }],
        h2:         ['18px', { lineHeight: '26px', letterSpacing: '-0.005em', fontWeight: '600' }],
        h1:         ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        display:    ['30px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      spacing: {
        // 4px base — only multiples of 4 from 0..48
        // Tailwind defaults already cover 0,1,2,3,4,5,6,8,10,12 — extending only as needed
      },
      transitionDuration: {
        fast: '120ms',
        DEFAULT: '180ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-in':  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'slide-up': 'slide-up 180ms ease-out',
      },
    },
  },
  plugins: [],
};
