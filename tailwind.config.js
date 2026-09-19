/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // ✅ Added: Scans the root HTML file (common in Vite)
    "./public/index.html",      // ✅ Added: Scans the public folder (common in CRA)
    "./src/**/*.{js,jsx,ts,tsx}", // Your existing source code scan
  ],
  theme: {
    extend: {
      // Every colour resolves through a CSS variable, so a component written
      // once follows whichever theme is on <html>. See src/index.css.
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          strong: "hsl(var(--primary-strong))",
          soft: "hsl(var(--primary-soft))",
          deep: "hsl(var(--primary-deep))",
        },
        matcha: {
          DEFAULT: "hsl(var(--matcha))",
          foreground: "hsl(var(--matcha-foreground))",
          strong: "hsl(var(--matcha-strong))",
          ink: "hsl(var(--matcha-ink))",
          soft: "hsl(var(--matcha-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        /* Not "card": `card` is also a colour name, so `shadow-card` would
           compile as a shadow-COLOUR utility and silently win. */
        lift: "var(--shadow-lift)",
        accent: "var(--shadow-accent)",
        "accent-lg": "var(--shadow-accent-lg)",
        "accent-ring": "var(--accent-ring)",
        nav: "var(--shadow-nav)",
      },
      animation: {
        fadeSlideEnhanced: "fadeSlideEnhanced 9s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeSlideEnhanced: {
          "0%, 100%": {
            opacity: "0",
            transform: "translateY(100%) scale(0.95) skewY(4deg)",
            filter: "blur(4px)"
          },
          "8%": {
            opacity: "1",
            transform: "translateY(0) scale(1.05) skewY(0deg)",
            filter: "blur(0)"
          },
          "30%": {
            opacity: "1",
            transform: "translateY(0) scale(1.05) skewY(0deg)",
            filter: "blur(0)"
          },
          "38%": {
            opacity: "0",
            transform: "translateY(-100%) scale(0.95) skewY(-4deg)",
            filter: "blur(4px)"
          },
          "90%": {
            opacity: "0",
            transform: "translateY(-100%) scale(0.95) skewY(-4deg)",
            filter: "blur(4px)"
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
