import { defineConfig } from 'vitest/config';


export default defineConfig({
  test: {
    coverage: {
      enabled: false,
      reporter: ["html", "text", "text-summary"],
      reportOnFailure: true,
    },
  },
});
