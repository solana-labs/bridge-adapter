import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  // Prefix is also declared at the './src/lib/styles.ts' helper
  prefix: "bsa-",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--bsa-radius)",
        md: "calc(var(--bsa-radius) - 2px)",
        sm: "calc(var(--bsa-radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--bsa-border))",
        input: "hsl(var(--bsa-input))",
        ring: "hsl(var(--bsa-ring))",
        background: "hsl(var(--bsa-background))",
        foreground: "hsl(var(--bsa-foreground))",
        error: "hsl(var(--bsa-error))",
        primary: {
          DEFAULT: "hsl(var(--bsa-primary))",
          foreground: "hsl(var(--bsa-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--bsa-secondary))",
          foreground: "hsl(var(--bsa-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--bsa-destructive))",
          foreground: "hsl(var(--bsa-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--bsa-muted))",
          foreground: "hsl(var(--bsa-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--bsa-accent))",
          foreground: "hsl(var(--bsa-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--bsa-popover))",
          foreground: "hsl(var(--bsa-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--bsa-card))",
          foreground: "hsl(var(--bsa-card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      spacing: {
        1.5: "1.5rem",
        "calc(100%-3rem)": "calc(100%-3rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
