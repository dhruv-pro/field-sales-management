/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f8f9ff",
          100: "#f0f3ff",
          200: "#e5ecff",
          300: "#d4deff",
          400: "#b8c9ff",
          500: "#9fb3ff",
          600: "#7c8fff",
          700: "#5b6aff",
          800: "#4252ff",
          900: "#2835ff",
          950: "#1a1fff",
        },
        secondary: {
          50: "#f8f7ff",
          100: "#f0edff",
          200: "#e5dfff",
          300: "#d4c9ff",
          400: "#b8a8ff",
          500: "#9f8cff",
          600: "#7c68ff",
          700: "#5b48ff",
          800: "#4232ff",
          900: "#281fff",
          950: "#1a0fff",
        },
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
