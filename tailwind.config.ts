import type { Config } from "tailwindcss";

export const colors = {
  background: "#0f0f0f",
  surface: "#1b1b1b",
  "surface-raised": "#242424",
  line: "#292929",
  foreground: "#f5f5f5",
  muted: "#929292",
  quiet: "#686868",
  accent: "#ffffff",
  success: "#22c55e",
  danger: "#f87171",
} as const;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors,
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        brand: "-0.08em",
      },
      fontSize: {
        caption: ["0.6875rem", { lineHeight: "1rem", fontWeight: "500" }],
        small: ["0.75rem", { lineHeight: "1.125rem", fontWeight: "500" }],
        base: ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        lead: ["1rem", { lineHeight: "1.5rem", fontWeight: "450" }],
        h2: ["1.25rem", { lineHeight: "1.5rem", fontWeight: "650" }],
        h1: ["2.125rem", { lineHeight: "2.375rem", fontWeight: "650" }],
      },
      maxWidth: {
        content: "60rem",
      },
      width: {
        sidebar: "16rem",
      },
      borderRadius: {
        card: "1rem",
        shell: "1.125rem",
      },
      backdropBlur: {
        glass: "2px",
      },
      backgroundImage: {
        "glass-sheen": "linear-gradient(115deg, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0.025) 24%, transparent 45%, transparent 65%, rgb(255 255 255 / 0.08) 100%)",
        "glass-highlight": "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.85), rgb(255 255 255 / 0.2), transparent)",
      },
      dropShadow: {
        "glass-label": "0 1px 2px rgb(0 0 0 / 0.85)",
      },
      boxShadow: {
        "glass-nav": "0 12px 36px rgb(0 0 0 / 0.3), 0 2px 8px rgb(0 0 0 / 0.15)",
        "glass-edge": "inset 0 1px 1px rgb(255 255 255 / 0.85), inset 1px 0 2px rgb(255 255 255 / 0.4), inset -1px 0 2px rgb(255 255 255 / 0.15), inset 0 -2px 3px rgb(255 255 255 / 0.3)",
        "glass-active": "inset 0 1px 1px rgb(255 255 255 / 0.45), inset 0 -1px 2px rgb(255 255 255 / 0.1), 0 2px 8px rgb(0 0 0 / 0.12)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 2px rgba(255, 255, 255, 0.45), inset 1px 0 1px rgba(255, 255, 255, 0.2), inset 0 -2px 3px rgba(255, 255, 255, 0.16)",
      },
      keyframes: {
        skeletonPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.75" },
        },
        skeletonShimmer: {
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        skeletonPulse: "skeletonPulse 1.8s ease-in-out infinite",
        skeletonShimmer: "skeletonShimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
