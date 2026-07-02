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
        // Heavy, route-only vendor chunks (three.js, pdf, monaco, graph libs, ...)
        // were being <link rel="modulepreload">'d on first paint even though nothing
        // in the initial shell uses them - three.js alone is ~886 kB. Drop them from
        // the eager preload set; they still load on demand when their lazy route runs
        // (via the runtime preload helper), so the first paint is far lighter.
        modulePreload: {
            resolveDependencies: (_filename, deps) =>
                deps.filter((d) => !/vendor-(three|pdf|monaco|graph|dagre|gsap|anime|dnd|zoom|react-icons)/.test(d)),
        },
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
                    // lucide-react: DON'T force every icon into one eager mega-chunk
                    // (the old `vendor-icons` was ~665 kB and got modulepreloaded on
                    // first paint because the nav imports a few icons). Returning
                    // undefined lets Rollup tree-split icons into the route chunks that
                    // use them, so the entry only carries its handful.
                    if (f.includes('lucide-react')) return;
                    if (f.includes('@supabase')) return 'vendor-supabase';
                    // Core React/runtime/router stays in the small upfront bundle.
                    return 'vendor-core';
                }
            }
        },
        chunkSizeWarningLimit: 600
    }
})
