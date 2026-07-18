import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0B0D",
        surface: "#121316",
        "surface-light": "#1A1C20",
        border: "#23262B",
        foreground: "#F2F4F5",
        muted: "#94999F",
        accent: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
