import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  mode: "jit",
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      screens: {
        xxs: "320px",
        xs: "440px",
        sm: "640px",
        md: "768px",
        lg: "970px",
        xl: "1024px",
        "2xl": "1280px",
        "3xl": "1400px",
        "4xl": "1600px",
      },
      colors: {
        background: "#F6F6F6",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#004C83",
          foreground: "#283747",
        },
        secondary: {
          DEFAULT: "#0075C9",
        },
        dark: {
          DEFAULT: "#272727",
          foreground: "#343434",
        },
        muted: {
          DEFAULT: "#D9D9D9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
