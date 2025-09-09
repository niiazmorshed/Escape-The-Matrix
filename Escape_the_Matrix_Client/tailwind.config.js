/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        nunito: "'Nunito', sans-serif",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#003366", // Deep Blue
          secondary: "#004080", // Darker Deep Blue
          accent: "#0066cc", // Lighter Blue accent
          neutral: "#374151",
          "base-100": "#ffffff",
          "base-200": "#f0f4f8", // Light blue tint
          "base-300": "#e2e8f0", // Lighter blue tint
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#003366", // Deep Blue
          secondary: "#004080", // Darker Deep Blue
          accent: "#0066cc", // Lighter Blue accent
          neutral: "#1f2937",
          "base-100": "#0f1419", // Dark blue background
          "base-200": "#1a2332", // Darker blue
          "base-300": "#2d3748", // Medium dark blue
        },
      },
    ],
  },
};
