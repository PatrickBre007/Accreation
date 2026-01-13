/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
        'metal-gold': 'hsl(var(--metal-gold) / <alpha-value>)',
        'metal-silver': 'hsl(var(--metal-silver) / <alpha-value>)',
        'metal-copper': 'hsl(var(--metal-copper) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 6px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 6px)',
      },
      backgroundImage: {
        'metal-sheen':
          'linear-gradient(120deg, hsl(var(--metal-silver) / 0.18), transparent 25%, hsl(var(--metal-gold) / 0.18) 55%, transparent 75%, hsl(var(--metal-copper) / 0.18))',
        'hero-glow':
          'radial-gradient(900px circle at 10% 10%, hsl(var(--metal-gold) / 0.18), transparent 50%), radial-gradient(900px circle at 90% 20%, hsl(var(--metal-copper) / 0.16), transparent 55%), radial-gradient(900px circle at 40% 90%, hsl(var(--metal-silver) / 0.16), transparent 55%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        floaty: 'floaty 8s ease-in-out infinite',
        shimmer: 'shimmer 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

