import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "var(--canvas-default)",
          subtle: "var(--canvas-subtle)",
          inset: "var(--canvas-inset)",
        },
        fg: {
          DEFAULT: "var(--fg-default)",
          muted: "var(--fg-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          muted: "var(--border-muted)",
          subtle: "var(--border-subtle)",
        },
        accent: {
          fg: "var(--accent-fg)",
          emphasis: "var(--accent-emphasis)",
          subtle: "var(--accent-subtle)",
        },
        success: {
          fg: "var(--success-fg)",
          emphasis: "var(--success-emphasis)",
          subtle: "var(--success-subtle)",
        },
        danger: {
          fg: "var(--danger-fg)",
          subtle: "var(--danger-subtle)",
        },
        attention: {
          fg: "var(--attention-fg)",
          subtle: "var(--attention-subtle)",
        },
        done: {
          fg: "var(--done-fg)",
          subtle: "var(--done-subtle)",
        },
        neutral: {
          muted: "var(--neutral-muted)",
        },
        progress: {
          bg: "var(--progress-bg)",
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        pill: "9999px",
      },
      fontSize: {
        metric: ["24px", { fontWeight: "600" }],
        section: ["14px", { fontWeight: "600" }],
        body: ["14px", { fontWeight: "400" }],
        table: ["13px", { fontWeight: "400" }],
        caption: ["12px", { fontWeight: "400" }],
        mono: ["12px", { fontWeight: "400" }],
        tag: ["11px", { fontWeight: "400" }],
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Noto Sans"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          '"SF Mono"',
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      screens: {
        xl: "1100px",
        lg: "860px",
        md: "600px",
      },
    },
  },
  plugins: [],
};

export default config;
