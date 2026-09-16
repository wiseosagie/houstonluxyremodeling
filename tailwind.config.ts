import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F2",
        warmwhite: "#FDFCFA",
        stone: {
          50: "#F7F5F2",
          100: "#EFEAE3",
          200: "#DFD6C9",
          300: "#C8BAA5",
          400: "#AB9A80",
          500: "#8C7B62",
          600: "#6E5F4A",
        },
        charcoal: {
          DEFAULT: "#22201D",
          light: "#3A3733",
          soft: "#4A4642",
        },
        bronze: {
          DEFAULT: "#9C7A4F",
          light: "#B9976B",
          dark: "#7A5E3B",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
