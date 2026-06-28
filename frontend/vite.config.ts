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
    // The Yosys WASM engine references its 43 MB core via `new URL('./*.wasm',
    // import.meta.url)`. Excluding it from dep pre-bundling lets Vite serve it
    // through the main pipeline (so those asset URLs resolve in dev and the wasm
    // is emitted in the build). It is dynamically imported inside an ES worker.
    optimizeDeps: {
        exclude: ['@yowasp/yosys', '@yowasp/runtime'],
    },
    worker: {
        format: 'es',
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
                    if (!id.includes('node_modules')) return;
                    const f = id.replace(/\\/g, '/');
                    // Heavy, route-specific libs -> isolated chunks so they load ONLY
                    // with the lazy route that uses them, never in the upfront bundle.
                    if (/\/node_modules\/(three|@react-three|three-stdlib|troika)\b/.test(f)) return 'vendor-three';
                    if (f.includes('jspdf') || f.includes('html2canvas') || f.includes('/canvg/')) return 'vendor-pdf';
                    if (f.includes('force-graph') || f.includes('/d3-') || f.includes('/d3/')) return 'vendor-graph';
                    if (f.includes('/dagre/') || f.includes('/graphlib/') || f.includes('@dagrejs')) return 'vendor-dagre';
                    if (f.includes('/gsap/')) return 'vendor-gsap';
                    if (f.includes('/animejs/')) return 'vendor-anime';
                    if (f.includes('@monaco-editor') || f.includes('monaco-editor')) return 'vendor-monaco';
                    if (f.includes('@dnd-kit')) return 'vendor-dnd';
                    if (f.includes('react-zoom-pan-pinch')) return 'vendor-zoom';
                    if (f.includes('react-icons')) return 'vendor-react-icons';
                    if (f.includes('framer-motion') || f.includes('/motion-dom/') || f.includes('/motion-utils/') || f.includes('motion/react')) return 'vendor-animation';
                    // Keep icons in their own cacheable chunk (separate from the small
                    // app entry chunk) so app-code changes don't re-download them.
                    if (f.includes('lucide-react')) return 'vendor-icons';
                    if (f.includes('@supabase')) return 'vendor-supabase';
                    // Core React/runtime/router stays in the small upfront bundle.
                    return 'vendor-core';
                }
            }
        },
        chunkSizeWarningLimit: 600
    }
})
