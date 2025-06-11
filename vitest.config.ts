import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigpaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        include: ['**/*.spec.ts'],
        exclude: ['**/node_modules/**'],
        globals: true,
        root: './',
    },
    plugins: [
        tsconfigpaths(),
        swc.vite({
            module: { type: 'es6' },
        })
    ],
})