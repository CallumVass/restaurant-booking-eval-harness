import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/restaurants": "http://localhost:5088",
      "/bookings": "http://localhost:5088",
    },
  },
});
