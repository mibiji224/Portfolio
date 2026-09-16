/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // ✅ Added: Scans the root HTML file (common in Vite)
    "./public/index.html",      // ✅ Added: Scans the public folder (common in CRA)
    "./src/**/*.{js,jsx,ts,tsx}", // Your existing source code scan
  ],
  theme: {
    extend: {
      animation: {
        fadeSlideEnhanced: "fadeSlideEnhanced 9s infinite",
        certPage: "certPage 350ms ease-out",
      },
      keyframes: {
        certPage: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
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
  plugins: [],
}