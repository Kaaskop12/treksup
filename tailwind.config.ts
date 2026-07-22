import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#1E3A2B',
        forestDeep: '#122B1F',
        alpine: '#5C89A8',
        offwhite: '#F7F3EA',
        paper: '#FBF9F4',
        ink: '#20241F',
        inkSoft: '#5B6058'
      },
      borderRadius: {
        xl2: '24px',
        xl3: '28px'
      },
      boxShadow: {
        card: '0 18px 40px -22px rgba(20,35,25,0.28)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
