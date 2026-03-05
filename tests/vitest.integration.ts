/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/integration/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    testTimeout: 30000,
    alias: {
      "@bareapi/moonshot": path.resolve(
        __dirname,
        "../packages/provider/moonshot/src"
      ),
      "@bareapi/kie": path.resolve(__dirname, "../packages/provider/kie/src"),
      "@bareapi/xai": path.resolve(__dirname, "../packages/provider/xai/src"),
    },
  },
});
