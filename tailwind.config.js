/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: "#10151F",
        surface: {
          DEFAULT: "#F7F8FA",
          raised: "#FFFFFF",
        },
        hairline: "#D8DCE2",
        primary: {
          DEFAULT: "#1E3A5F",
          foreground: "#FFFFFF",
        },
        text: {
          primary: "#10151F",
          muted: "#5B6472",
        },
        risk: {
          low: "#2E7D5B",
          medium: "#C98A2E",
          high: "#B23A3A",
        },
        background: "#F7F8FA",
        foreground: "#10151F",
        card: "#FFFFFF",
        "card-foreground": "#10151F",
        border: "#D8DCE2",
        muted: {
          DEFAULT: "#F7F8FA",
          foreground: "#5B6472",
        },
        sidebar: {
          DEFAULT: "#10151F",
          foreground: "#FFFFFF",
          accent: "#1E3A5F",
          "accent-foreground": "#FFFFFF",
          border: "#D8DCE2",
        }
      },
      borderRadius: {
        lg: "4px",
        md: "4px",
        sm: "4px",
      },
    },
  },
  plugins: [],
}
