import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        "deep-brown": "#1a120b",
        "burnt-bronze": "#6b4423",
        gold: "#d4a64a",
        "solar-amber": "#ffac02",
        "warm-glow": "#ffbd3859",
        "soft-sand": "#c8b28a",
        ivory: "#f5f1e8",
        emerald: "#355c52",
        "nile-blue": "#1aa7b8",
        "lunar-blue": "#10243a"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ],
        body: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        "gold-soft": "0 0 32px rgba(212, 166, 74, 0.18)",
        "panel-lift": "0 22px 80px rgba(0, 0, 0, 0.38)"
      },
      keyframes: {
        "gold-pulse": {
          "0%, 100%": { opacity: "0.46" },
          "50%": { opacity: "0.82" }
        },
        "soft-rise": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "gold-pulse": "gold-pulse 6s ease-in-out infinite",
        "soft-rise": "soft-rise 700ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
