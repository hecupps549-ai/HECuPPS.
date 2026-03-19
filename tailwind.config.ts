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
        // Lou Paperi template palette
        'brand-accent': '#0066FF',    // Announcement bar blue
        'brand-black': '#111111',     // Primary text / buttons
        'brand-white': '#FFFFFF',     // Background
        'brand-light': '#F5F5F5',    // Subtle off-white surfaces
        'brand-border': '#E0E0E0',   // Thin borders
        // Keep gold for legacy refs that haven't been updated yet
        'brand-gold': '#111111',
        'brand-cream': '#FFFFFF',
        'brand-dark': '#111111',
        'brand-coral': '#E07A5F',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],       // Logo wordmark only
        'outfit': ['"Outfit"', 'sans-serif'],              // Headings
        'inter': ['"Inter"', 'sans-serif'],                // Body
        'poppins': ['"Inter"', 'sans-serif'],              // Mapped to Inter
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0', transform: 'translateY(-20px)' },
          '10%, 90%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in-out': 'fade-in-out 2.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
export default config
