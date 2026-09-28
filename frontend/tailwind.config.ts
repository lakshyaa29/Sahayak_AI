import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Base Palette mapped to semantic design tokens */
        paper: {
          50: "var(--color-paper-50)",
          100: "var(--color-paper-100)",
          200: "var(--color-paper-200)",
        },
        ink: {
          500: "var(--color-ink-500)",
          600: "var(--color-ink-600)",
          700: "var(--color-ink-700)",
          800: "var(--color-ink-800)",
          900: "var(--color-ink-900)",
        },
        saffron: {
          100: "var(--color-saffron-100)",
          500: "var(--color-saffron-500)",
          600: "var(--color-saffron-600)",
          700: "var(--color-saffron-700)",
        },
        accent: {
          DEFAULT: "var(--color-accent-primary)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
        },
        link: {
          DEFAULT: "var(--color-link-default)",
          hover: "var(--color-link-hover)",
        },
        focus: {
          DEFAULT: "var(--color-focus)",
          contrast: "var(--color-focus-contrast)",
        },

        /* Semantic Design Tokens */
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
          subtle: "var(--surface-subtle)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
          muted: "var(--primary-muted)",
          subtle: "var(--primary-subtle)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
          muted: "var(--secondary-muted)",
          subtle: "var(--secondary-subtle)",
        },
        muted: {
          DEFAULT: "var(--surface-muted)",
          foreground: "var(--muted-foreground)",
        },
        subtle: {
          foreground: "var(--subtle-foreground)",
        },
        neutral: {
          50: "var(--color-paper-50)",
          100: "var(--color-paper-200)",
          200: "var(--color-border-subtle)",
          300: "var(--color-border-default)",
          400: "var(--color-border-strong)",
          500: "var(--color-ink-500)",
          600: "var(--color-ink-600)",
          700: "var(--color-ink-700)",
          800: "var(--color-ink-800)",
          900: "var(--color-ink-900)",
          950: "var(--color-ink-900)",
        },
        border: {
          DEFAULT: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
          strong: "var(--color-border-strong)",
          subtle: "var(--color-border-subtle)",
          error: "var(--color-border-error)",
          input: "var(--input-border)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
          muted: "var(--success-muted)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
          muted: "var(--warning-muted)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          muted: "var(--destructive-muted)",
        },
        error: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          muted: "var(--destructive-muted)",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "Noto Sans", "system-ui", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "Noto Sans Devanagari", "system-ui", "sans-serif"],
      },
      fontSize: {
        "heading-sm": ["1.5rem", { lineHeight: "2rem" }],
        "heading-md": ["clamp(1.75rem, 3vw, 2.25rem)", { lineHeight: "1.3" }],
        "heading-lg": ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.2" }],
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        round: "var(--radius-round)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        dialog: "var(--radius-dialog)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        none: "none",
        low: "var(--shadow-low)",
        floating: "var(--shadow-floating)",
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
      },
      maxWidth: {
        narrow: "var(--max-w-narrow)",
        content: "var(--max-w-content)",
        wide: "var(--max-w-wide)",
        form: "var(--max-w-form)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        DEFAULT: "160ms",
      },
      transitionTimingFunction: {
        standard: "var(--easing-standard)",
      },
    },
  },
  plugins: [],
};

export default config;
