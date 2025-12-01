export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#0f1221',
          100: '#171a2c',
          200: '#1a1d32',
          300: '#2a2f47',
        },
        light: {
          50: '#ffffff',
          100: '#f7f8fb',
          200: '#e6e8f0',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
