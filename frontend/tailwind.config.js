/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        card: "rgba(20, 20, 30, 0.7)",
        primary: "#00f2ff",
        secondary: "#7000ff",
        accent: "#ff00d4",
      },
    },
  },
  plugins: [],
}
