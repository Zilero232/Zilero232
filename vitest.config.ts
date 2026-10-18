import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**'],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/index.ts', 'src/build.ts', 'src/fetch.ts']
    }
  }
});
