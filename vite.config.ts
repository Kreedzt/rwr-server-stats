import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((config) => {
  return {
    plugins: [react()],
    base: "/",
    server: {
      proxy: {
        "/api": {
          target: "http://rwr.runningwithrifles.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
