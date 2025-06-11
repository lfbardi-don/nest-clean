import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigpaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        include: ['**/*.e2e-spec.ts'],
        exclude: ['**/node_modules/**'],
        globals: true,
        root: './',
        setupFiles: ['./test/setup-e2e.ts'],
    },
    plugins: [
        tsconfigpaths(),
        swc.vite({
            module: { type: 'es6' },
        })
    ],
})