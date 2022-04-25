import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        hmr: false,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
