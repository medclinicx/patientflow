/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ebf8fe',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#38bdf8',
          500: '#0066FF',
          600: '#0066FF', // MedClinicX Primary Blue
          700: '#0052CC', // MedClinicX Deep Blue
          800: '#003d99',
          900: '#0b132b',
        },
        med: {
          primary: '#0066FF',
          deep: '#0052CC',
          electric: '#00C8FF',
          ice: '#EBF8FE',
          navy: '#0B132B',
          dark: '#0a192f',
        },
        medical: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b',
          accent: '#0066FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 102, 255, 0.08), 0 4px 6px -2px rgba(0, 102, 255, 0.04)',
        'glow': '0 0 15px rgba(0, 102, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
