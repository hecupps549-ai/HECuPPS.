import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-gold': '#8E5A3B',
        'brand-cream': '#F4EDE3',
        'brand-dark': '#2B2B2B',
        'brand-coral': '#E07A5F',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
      },
      keyframes: {
        'fade-in-out': {
          '0%, 100%': { opacity: '0', transform: 'translateY(-20px)' },
          '10%, 90%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-out': 'fade-in-out 2.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
export default config
