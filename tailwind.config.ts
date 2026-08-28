import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta TRAPILLO — hilo, madera, textiles, artesanía
        ivory: "#F4EFE6",
        cream: "#EDE4D3",
        linen: "#E2D5BF",
        sand: "#CDB89A",
        clay: "#A9835B",
        cocoa: "#6F4E37",
        walnut: "#3E2C20",
        ink: "#1C1712",
        ash: "#8A8072",
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
