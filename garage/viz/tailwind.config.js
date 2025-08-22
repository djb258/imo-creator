/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'health-pass': '#10b981',
        'health-warn': '#f59e0b', 
        'health-fail': '#ef4444',
        'viz-bg': '#0f172a',
        'viz-panel': '#1e293b',
        'viz-border': '#334155'
      }
    },
  },
  plugins: [],
}