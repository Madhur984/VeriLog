import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
        // Enables the V8 wasm flag the Yosys engine needs; see vitest.setup.ts
        // for why it has to be done from inside the worker.
        setupFiles: ['./vitest.setup.ts'],
        // Synthesis is a real wasm toolchain run per problem, and the bank is
        // 106 problems — the 5s default trips long before the work is done.
        testTimeout: 120_000,
        hookTimeout: 120_000,
        coverage: {
            provider: 'v8',
            include: ['src/mure/**/*.ts'],
            exclude: ['src/mure/__tests__/**'],
        },
    },
});
