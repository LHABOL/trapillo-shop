import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta TRAPILLO — alegre: coral, uva, sol, durazno. Espejo de globals.css :root.
        ivory: "#FFF9F2",
        cream: "#FFE9D6",
        linen: "#FCE1D0",
        sand: "#FFC44D",
        clay: "#FF6B4A",
        cocoa: "#8B46D9",
        walnut: "#5A2A9E",
        ink: "#241640",
        ash: "#7E6F9A",
        sun: "#FFC13B",
        sea: "#17C4C4",
        rose: "#FF7FB0",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.18em",
        wide2: "0.3em",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-2%, 1%)" },
        },
      },
      animation: {
        grain: "grain-shift 8s steps(4) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
