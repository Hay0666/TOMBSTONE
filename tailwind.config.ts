import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    extend: {
      colors: {
        void: '#0A0A0C',
        bunker: '#0F0F11',
        slab: '#1A1A1E',
        bulkhead: '#242428',
        fog: '#3A3A40',
        chalk: '#E8E8EC',
        concrete: '#8A8A92',
        ash: '#4A4A52',
        razor: {
          DEFAULT: '#FF5500',
          dim: '#CC4400',
          glow: 'rgba(255,85,0,0.25)',
        },
        critical: '#FF3333',
        degraded: '#FF8800',
        nominal: '#33FF88',
        'ghost-node': 'rgba(255,85,0,0.08)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      fontSize: {
        'terminal': ['11px', { lineHeight: '1.8', letterSpacing: '0.03em' }],
        'ui': ['12px', { lineHeight: '1.6', letterSpacing: '0.03em' }],
        'metric-label': ['9px', { lineHeight: '1', letterSpacing: '0.08em' }],
        'metric-abbr': ['11px', { lineHeight: '1', letterSpacing: '0.04em' }],
        'metric-value': ['28px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'metric-hero': ['clamp(3rem, 6vw, 8rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4vw, 5rem)', { lineHeight: '1.1', letterSpacing: '0.08em' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'bold': '700',
      },
      borderRadius: {
        'node': '50%',
        'cluster': '8px',
        'panel': '0px',
      },
      boxShadow: {
        'node-nominal': '0 0 4px rgba(51,255,136,0.3)',
        'node-degraded': '0 0 8px rgba(255,136,0,0.4)',
        'node-critical': '0 0 16px rgba(255,51,51,0.5)',
        'blade': '0 0 16px rgba(255,85,0,0.25)',
        'panel': '-4px 0 24px rgba(0,0,0,0.5)',
      },
      backdropBlur: {
        'panel': '8px',
      },
      width: {
        'panel': '420px',
      },
      animation: {
        'pulse-critical': 'pulse-critical 1.5s ease-in-out infinite',
        'blade-pulse': 'blade-pulse 0.5s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'typewriter-cursor': 'blink 0.8s step-end infinite',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { boxShadow: '0 0 16px rgba(255,51,51,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(255,51,51,0.6)' },
        },
        'blade-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
