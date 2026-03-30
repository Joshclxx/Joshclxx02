// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class", "dark"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // GitHub-specific semantic colors
        gh: {
          blue: "var(--gh-accent-blue)",
          green: "var(--gh-accent-green)",
          orange: "var(--gh-accent-orange)",
          purple: "var(--gh-accent-purple)",
          red: "var(--gh-accent-red)",
        },
      },
      keyframes: {
        "shake-toast-in": {
          "0%": { opacity: "0", transform: "translate(-50%, 1.5rem) scale(0.95)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0) scale(1)" },
        },
        "phone-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-12deg)" },
          "30%": { transform: "rotate(10deg)" },
          "45%": { transform: "rotate(-8deg)" },
          "60%": { transform: "rotate(6deg)" },
          "75%": { transform: "rotate(-3deg)" },
          "90%": { transform: "rotate(1deg)" },
        },
        "ping-slow": {
          "0%": { opacity: "0.6", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.6)" },
        },
      },
      animation: {
        "shake-toast-in": "shake-toast-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "phone-wiggle": "phone-wiggle 1.2s ease-in-out infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
