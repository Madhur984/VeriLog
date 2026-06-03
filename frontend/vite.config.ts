import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        // Forward /api/* to the Express backend so the frontend can call
        // same-origin URLs in dev (matches the production setup where a
        // reverse proxy fronts both).
        proxy: {
            '/api': {
                target: process.env.VITE_API_TARGET || 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('framer-motion') || id.includes('motion/react')) {
                            return 'vendor-animation';
                        }
                        if (id.includes('lucide-react')) {
                            return 'vendor-icons';
                        }
                        return 'vendor-core';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 600
    }
})
