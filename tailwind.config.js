/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink:     '#1a1a2e',
        surface: '#f5f6fa',
        card:    '#ffffff',
        muted:   '#6b7280',
        border:  '#e5e7eb',
        accent1: '#0077b6',
        accent2: '#023e8a',
        accent3: '#2d9e5f',
      },
      borderRadius: {
        card: '14px',
        btn:  '8px',
        pill: '99px',
      },
      boxShadow: {
        card: '0 1px 8px rgba(0,0,0,0.06)',
        btn:  '0 2px 8px rgba(0,119,182,0.3)',
        chip: '0 3px 14px rgba(0,119,182,0.45)',
      },
    },
  },
  plugins: [],
}
