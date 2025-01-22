/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  test: {
    globals: true, // Enables auto cleanup of DOM after each test
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text"],
    },
    setupFiles: "./vitest.setup.ts",
  },
});
