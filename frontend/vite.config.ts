import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync, writeFileSync, cpSync, existsSync, mkdirSync, createReadStream } from 'fs'
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

/**
 * Serve the self-hosted Yosys WASM engine at `/yowasp/*`.
 *
 * The engine's `gen/bundle.js` resolves its 43 MB core and sidecar files via
 * `new URL('./yosys.core.wasm', import.meta.url)`, so the worker must load it by
 * a plain URL (not `import('@yowasp/yosys')`, which drags the wasm through Vite's
 * transform and serves it with a MIME the browser rejects as a module script).
 *
 * The files can't live in `public/` either: Vite's transform middleware
 * intercepts any `.js` request that resolves into `public/` and refuses it
 * ("should not be imported from source code"). So instead:
 *   - DEV: a middleware registered BEFORE Vite's transform middleware streams
 *     `/yowasp/*` straight out of node_modules with the right Content-Type.
 *   - BUILD: the engine is copied into `dist/yowasp/` so the same URLs resolve.
 * `import.meta.url` inside the bundle then resolves to `/yowasp/bundle.js`, and
 * its wasm siblings fetch as ordinary static assets in dev and prod alike.
 */
function yowaspAssetsPlugin(): Plugin {
  const gen = path.resolve(__dirname, 'node_modules/@yowasp/yosys/gen')
  const MIME: Record<string, string> = {
    '.js': 'text/javascript',
    '.wasm': 'application/wasm',
    '.tar': 'application/x-tar',
    '.map': 'application/json',
  }
  return {
    name: 'bfb-yowasp-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = (req.url || '').split('?')[0]
        if (!urlPath.startsWith('/yowasp/')) return next()
        const file = path.resolve(gen, urlPath.slice('/yowasp/'.length))
        if (!file.startsWith(gen + path.sep) || !existsSync(file)) return next()
        res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream')
        res.setHeader('Cache-Control', 'no-cache')
        createReadStream(file).pipe(res)
      })
    },
    closeBundle() {
      try {
        if (!existsSync(path.join(gen, 'bundle.js'))) return
        const out = path.resolve(__dirname, 'dist/yowasp')
        mkdirSync(out, { recursive: true })
        cpSync(gen, out, { recursive: true })
        // eslint-disable-next-line no-console
        console.log('[bfb-yowasp-assets] emitted Yosys engine -> dist/yowasp')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[bfb-yowasp-assets] emit skipped:', e)
      }
    },
  }
}

export default defineConfig({
    plugins: [react(), prerenderMetaPlugin(), yowaspAssetsPlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            // netlistsvg does `require('elkjs')`, whose main entry (lib/main.js)
            // is the NODE build: it calls require.resolve('webworker-threads')
            // and falls back to a CommonJS fake worker, neither of which a
            // browser bundle can satisfy. elk.bundled.js is the self-contained
            // browser build — it constructs without a workerUrl and carries the
            // layout engine inline, which is exactly what the schematic needs.
            // Without this alias the schematic panel fails at import time.
            elkjs: path.resolve(__dirname, "./node_modules/elkjs/lib/elk.bundled.js"),
            // netlistsvg does `require('lodash')`. lodash ships a UMD wrapper
            // that checks for an AMD loader FIRST:
            //
            //   if (typeof define == 'function' && define.amd) root._ = _;
            //   else if (freeModule) freeModule.exports = _;
            //
            // Monaco installs a global `define` with `.amd`, so on any page
            // carrying an editor lodash hands itself to Monaco's loader and
            // `module.exports` stays `{}` — netlistsvg then dies on
            // `_.mapValues is not a function`. It only reproduces in the
            // browser, which is why the Node tests never saw it.
            //
            // lodash-es is pure ESM with no UMD branch, so the interop is
            // unambiguous. Same 4.17.21 implementation, same function surface.
            lodash: "lodash-es",
        },
    },
    // The Yosys WASM engine is loaded by static URL from public/yowasp (see
    // yowaspAssetsPlugin + yosys.worker.ts), not imported through Vite, so it
    // never reaches dep pre-bundling. Keep the exclude as a guard in case any
    // transitive code references the bare specifier.
    optimizeDeps: {
        exclude: ['@yowasp/yosys', '@yowasp/runtime'],
        // netlistsvg is CommonJS and does `require('lodash')` / `require('onml')`.
        // Left to on-demand discovery, Vite hands it an ESM namespace object whose
        // default export is not lodash itself, and the schematic dies on
        // `_.mapValues is not a function`. Naming them here forces the CJS->ESM
        // interop shim to be built up front, with lodash resolved the way
        // netlistsvg expects.
        include: ['netlistsvg', 'lodash-es', 'onml', 'clone'],
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
                    // pdfjs backs the /library document reader. Left unpinned it lands
                    // in vendor-core and costs every page ~354 kB on first paint.
                    if (f.includes('/pdfjs-dist/')) return 'vendor-pdfjs';
                    if (f.includes('force-graph') || f.includes('/d3-') || f.includes('/d3/')) return 'vendor-graph';
                    if (f.includes('/dagre/') || f.includes('/graphlib/') || f.includes('@dagrejs')) return 'vendor-dagre';
                    // lodash-es is shared: netlistsvg requires it, and dagre's
                    // `require('lodash')` is aliased onto it too. Folding it into
                    // either consumer's chunk makes vendor-dagre and
                    // vendor-schematic circular, so it gets its own.
                    if (f.includes('/lodash-es/')) return 'vendor-lodash';
                    // netlistsvg + elkjs back the Verilog schematic panel only.
                    // elk.bundled.js alone is ~1.3 MB; left unpinned it merges into
                    // vendor-core and every page pays for it on first paint, even
                    // though the schematic is behind a tab.
                    if (f.includes('/netlistsvg/') || f.includes('/elkjs/')
                        || f.includes('/onml/')) return 'vendor-schematic';
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
