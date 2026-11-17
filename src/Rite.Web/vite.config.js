import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Production serves the SPA and the API from the same origin (ps-008), so
    // the app calls relative /api/* paths everywhere; this proxy makes that work
    // against the locally running dotnet API too, instead of needing CORS in dev.
    proxy: {
      "/api": "http://localhost:5159"
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js"
  }
});
