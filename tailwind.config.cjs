/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-blue': '0 0 24px rgba(59,130,246,0.25)',
        'glow-green': '0 0 24px rgba(34,197,94,0.25)',
        'glow-amber': '0 0 24px rgba(245,158,11,0.25)',
        'glow-red': '0 0 24px rgba(239,68,68,0.25)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        claimlens: {
          primary: '#3b82f6',
          'primary-content': '#ffffff',
          secondary: '#8b5cf6',
          'secondary-content': '#ffffff',
          accent: '#22d3ee',
          'accent-content': '#000000',
          neutral: '#1e293b',
          'neutral-content': '#e2e8f0',
          'base-100': '#050d1a',
          'base-200': '#0a1628',
          'base-300': '#0f2040',
          'base-content': '#e2e8f0',
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      'light',
    ],
    darkTheme: 'claimlens',
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
