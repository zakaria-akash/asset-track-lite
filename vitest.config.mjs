import { defineConfig } from "vitest/config";

// Minimal Vitest config for fast utility-level coverage in Node runtime.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/lib/**/*.test.js"],
    coverage: {
      enabled: false,
    },
  },
});
