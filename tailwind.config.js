/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(red|green|blue|yellow|purple|indigo|gray)-(300|400|500|600|700|800)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#4ade80",
        "secondary": "#facc15",
        "primary-alt": "#fff",
        "secondary-alt": "#fff",
        "background": "#1f2937",
        "link": "#63b3ed",
      },
      fontFamily: {
        sans: ["nunito", ...defaultTheme.fontFamily.sans],
        nunito: ["nunito", ...defaultTheme.fontFamily.sans],
      },
      width: (theme) => ({
        "screen/1.5": "calc(100vw / 1.5)",
        "screen/2": "50vw",
      }),
      height: {
        "350-px": "350px",
      },
    },
  },
  plugins: [],
};
