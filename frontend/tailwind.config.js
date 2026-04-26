/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonCyan:    '#00E0FF',
        neonPurple:  '#8A2BE2',
        neonGreen:   '#39FF14',
        darkPrimary: '#000000',
        darkSecondary: '#0A0A0A',
        darkCard:    '#111111',
        darkCard2:   '#0D0D0F',
        surface:     '#14141A',
        borderSubtle:'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        sans:      ['Inter', 'sans-serif'],
        heading:   ['Space Grotesk', 'sans-serif'],
        syncopate: ['Space Grotesk', 'sans-serif'],
        display:   ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan':    '0 0 20px rgba(0,224,255,0.35)',
        'glow-green':   '0 0 20px rgba(57,255,20,0.35)',
        'glow-purple':  '0 0 20px rgba(138,43,226,0.35)',
        'glow-sm-cyan': '0 0 10px rgba(0,224,255,0.25)',
        'glow-lg-cyan': '0 0 40px rgba(0,224,255,0.25), 0 0 80px rgba(0,224,255,0.1)',
        'glass':        '0 4px 30px rgba(0,0,0,0.2)',
        'card':         '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
        'saas':         '0 20px 60px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'pulse-slow':     'pulse-slow 8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'border-beam':    'border-beam 4s linear infinite',
        'slide-down':     'slide-down 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'count-up':       'count-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%':       { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        'border-beam': {
          '0%':   { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':       { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
