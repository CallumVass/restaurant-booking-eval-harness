import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { border: "hsl(214 32% 91%)" } } },
  plugins: [],
} satisfies Config;
