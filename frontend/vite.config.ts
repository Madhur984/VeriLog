import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { getSeo, routeJsonLd, SITE } from './src/lib/seo'

/**
 * Build-time per-route SEO prerender.
 *
 * The app is a client-rendered SPA, so the shipped index.html carries only the
 * home page's meta — social scrapers and non-JS crawlers see the same card on
 * every deep link. This plugin post-processes the built index.html into one
 * static HTML file per public route with that route's real <title>, description,
 * canonical, Open Graph / Twitter tags, JSON-LD, and a content-ful <noscript>.
 *
 * Bodies stay an empty #root, so there is zero hydration risk (main.tsx uses
 * createRoot, which renders into the container regardless). The .htaccess serves
 * `/career-roadmap` -> `career-roadmap.html` with no redirect. Only flat,
 * single-segment routes are prerendered so no route nests inside another's
 * directory. At runtime SeoManager keeps every route (prerendered or not)
 * correct for JS-executing crawlers.
 */
const PRERENDER_ROUTES = [
  '/career-roadmap',
  '/portal',
  '/verilog-playground',
  '/workbench',
  '/kmap-lab',
  '/verilog-library',
  '/analogies',
  '/silicon-map',
  '/pledge',
  '/privacy',
  '/terms',
]

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function setTitle(html: string, v: string) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(v)}</title>`)
}
function setMetaName(html: string, name: string, v: string) {
  return html.replace(new RegExp(`(<meta name="${name}" content=")[^"]*(")`), `$1${escAttr(v)}$2`)
}
function setMetaProp(html: string, prop: string, v: string) {
  return html.replace(new RegExp(`(<meta property="${prop}" content=")[^"]*(")`), `$1${escAttr(v)}$2`)
}
function setLink(html: string, rel: string, v: string) {
  return html.replace(new RegExp(`(<link rel="${rel}" href=")[^"]*(")`), `$1${escAttr(v)}$2`)
}
function noscript(title: string, description: string) {
  const heading = title.replace(/\s*\|\s*BitForBytes.*$/, '').replace(/\s*—\s*BitForBytes.*$/, '')
  return `<noscript>
      <div style="max-width:640px;margin:12vh auto;padding:0 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1B1436;text-align:center;">
        <h1 style="font-size:28px;margin:0 0 12px;">${escHtml(heading)}</h1>
        <p style="font-size:16px;line-height:1.6;color:#4A4560;margin:0 0 18px;">${escHtml(description)} This app needs JavaScript enabled. Explore:</p>
        <p style="font-size:15px;line-height:2;">
          <a href="/career-roadmap">VLSI Career Roadmap</a> &middot;
          <a href="/portal">Course Portal</a> &middot;
          <a href="/verilog-playground">Verilog Judge</a> &middot;
          <a href="/kmap-lab">K-Map Solver</a> &middot;
          <a href="/module/1">Start Module 1</a>
        </p>
      </div>
    </noscript>`
}

function prerenderMetaPlugin(): Plugin {
  return {
    name: 'bfb-prerender-meta',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      let template: string
      try {
        template = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      } catch {
        return
      }
      for (const route of PRERENDER_ROUTES) {
        const seo = getSeo(route)
        let html = template
        html = setTitle(html, seo.title)
        html = setMetaName(html, 'description', seo.description)
        html = setMetaName(html, 'robots', seo.robots)
        html = setLink(html, 'canonical', seo.canonical)
        html = setMetaProp(html, 'og:title', seo.title)
        html = setMetaProp(html, 'og:description', seo.description)
        html = setMetaProp(html, 'og:url', seo.canonical)
        html = setMetaProp(html, 'og:type', seo.type)
        html = setMetaName(html, 'twitter:title', seo.title)
        html = setMetaName(html, 'twitter:description', seo.description)

        const ld = routeJsonLd(route, seo)
        if (ld.length) {
          const tag = `<script type="application/ld+json" id="ld-route">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>`
          html = html.replace('</head>', `    ${tag}\n</head>`)
        }
        html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript(seo.title, seo.description))

        writeFileSync(path.join(outDir, route.replace(/^\//, '') + '.html'), html, 'utf8')
      }
      // eslint-disable-next-line no-console
      console.log(`[bfb-prerender-meta] wrote ${PRERENDER_ROUTES.length} per-route HTML files (site: ${SITE.origin})`)
    },
  }
}

export default defineConfig({
    plugins: [react(), prerenderMetaPlugin()],
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
