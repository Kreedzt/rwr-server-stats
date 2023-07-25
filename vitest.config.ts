import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    watch: false,
    coverage: {
      include: ["src"],
      all: true,
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
  },
});
