// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Adjust based on your project structure
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // For Next.js 13+ with the app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
