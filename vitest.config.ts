import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    reporters: "default",
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
