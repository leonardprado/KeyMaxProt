// frontend/web/tailwind.config.ts (VERSIÓN PARA SHADCN/UI)
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        // Colores personalizados KeyMaxProt
        keymax: {
          blue: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c3daff',
            300: '#a7b9ff',
            400: '#8b9bff',
            500: '#6f7dff',
            600: '#5761ff',
            700: '#3e43ff',
            800: '#2525ff',
            900: '#0c07ff',
            950: '#0805cc',
          },
          gray: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#111827',
            950: '#0b101a',
          },
          orange: {
            50: '#fff8f0',
            100: '#fff1e0',
            200: '#ffe4c4',
            300: '#ffd7a8',
            400: '#ffc98c',
            500: '#ffbc70',
            600: '#ffae54',
            700: '#ff9f38',
            800: '#ff911c',
            900: '#ff8300',
            950: '#cc6900',
          },
          yellow: {
            50: '#fffbeb',
            100: '#fff4cd',
            200: '#ffeaa8',
            300: '#ffe083',
            400: '#ffd65d',
            500: '#ffcc33',
            600: '#ffc200',
            700: '#ffb800',
            800: '#ffa700',
            900: '#ff9100',
            950: '#cc7400',
          },
        },
      },
   
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },

  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config