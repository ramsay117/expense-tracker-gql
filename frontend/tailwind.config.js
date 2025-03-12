import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'grid-white': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23FFFFFF22\'%3E%3Cpath d=\'M0 .5H31.5V32\'/%3E%3C/svg%3E")',
        'grid-black': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23000000\'%3E%3Cpath d=\'M0 .5H31.5V32\'/%3E%3C/svg%3E")',
        'dot-white': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'16\' height=\'16\' fill=\'none\'%3E%3Ccircle fill=\'%23FFFFFF22\' id=\'pattern-circle\' cx=\'10\' cy=\'10\' r=\'1.6257413380501518\'%3E%3C/circle%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [
    addVariablesForColors,
  ],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}
