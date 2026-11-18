import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // loadEnv, not import.meta.env/process.env: this config file runs in Vite's
  // own Node process, before the client-side env injection that powers
  // import.meta.env in app code, so reading a .env file here needs this call.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      // Production serves the SPA and the API from the same origin (ps-008), so
      // the app calls relative /api/* paths everywhere; this proxy makes that
      // work in development too. The proxy runs server-side (Node-to-Node), so
      // it's never subject to browser CORS — set VITE_DEV_PROXY_TARGET in a
      // local, gitignored .env.local to point dev at the live API instead of a
      // local one, with no other change and no CORS policy needed either way.
      proxy: {
        "/api": env.VITE_DEV_PROXY_TARGET || "http://localhost:5159"
      }
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js"
    }
  };
});
