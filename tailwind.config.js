/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-black': 'rgb(240, 240, 240)',
        'side-bar': 'rgb(245, 245, 245)',
        'side-bar-dark':'rgb(24,24,24)',
        'feedback': 'rgb(235, 235, 235)',
        'feedback-box': 'rgb(249, 249, 248)',
        'searchbox': 'rgb(32, 32, 32)'
      },
      screens: {
        'custom-breakpoint': '1030px',
      },
    },
  },
  plugins: [],
}
