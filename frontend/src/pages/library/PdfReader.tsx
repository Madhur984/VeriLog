/**
 * In-page PDF reader for /library.
 *
 * Drive's own /preview iframe is unreliable — browsers that block third-party
 * cookies simply render an empty frame — so for PDFs we fetch the bytes
 * ourselves and paint them with pdf.js. Drive serves the download endpoint with
 * `Access-Control-Allow-Origin: *`, so this needs no proxy of ours and costs us
 * no bandwidth.
 *
 * Pages render lazily as they scroll into view: some of these papers run to
 * hundreds of pages and rendering them all up front would lock the tab.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** One page — paints only once it's near the viewport, then caches the bitmap. */
const Page: React.FC<{ doc: PDFDocumentProxy; num: number; scale: number }> = ({ doc, num, scale }) => {
    const holder = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [near, setNear] = useState(false);
    const drawn = useRef(-1); // the scale we last painted at

    useEffect(() => {
        const el = holder.current;
        if (!el || near) return;
        const io = new IntersectionObserver(
            (entries) => entries.some((e) => e.isIntersecting) && setNear(true),
            { root: null, rootMargin: '600px 0px' }, // start a little before it's visible
        );
        io.observe(el);
        return () => io.disconnect();
    }, [near]);

    useEffect(() => {
        if (!near || drawn.current === scale) return;
        let cancelled = false;
        (async () => {
            const page = await doc.getPage(num);
            if (cancelled) return;
            // Render at device resolution so text stays crisp on retina/mobile.
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const viewport = page.getViewport({ scale: scale * dpr });
            const cv = canvas.current;
            const ctx = cv?.getContext('2d');
            if (!cv || !ctx) return;
            cv.width = viewport.width;
            cv.height = viewport.height;
            cv.style.width = `${viewport.width / dpr}px`;
            cv.style.height = `${viewport.height / dpr}px`;
            await page.render({ canvasContext: ctx, viewport }).promise;
            if (!cancelled) drawn.current = scale;
        })().catch(() => { /* a single unpaintable page shouldn't kill the reader */ });
        return () => { cancelled = true; };
    }, [near, doc, num, scale]);

    return (
        <div ref={holder} className="flex justify-center">
            <canvas
                ref={canvas}
                className="max-w-full bg-white shadow-neo-sm"
                // Reserve roughly A4 until painted so the scrollbar doesn't jump.
                style={{ minHeight: near ? undefined : 420, minWidth: near ? undefined : 300 }}
            />
        </div>
    );
};

const PdfReader: React.FC<{ url: string; onFail: () => void }> = ({ url, onFail }) => {
    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
    const [pages, setPages] = useState(0);
    const [scale, setScale] = useState(1.2);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        let loaded: PDFDocumentProxy | null = null;
        const task = pdfjs.getDocument({ url, withCredentials: false });
        task.promise
            .then((d) => {
                if (cancelled) { d.destroy(); return; }
                loaded = d;
                setDoc(d);
                setPages(d.numPages);
            })
            .catch(() => {
                if (cancelled) return;
                setError('This file could not be opened here.');
                onFail();
            });
        return () => {
            cancelled = true;
            task.destroy();
            loaded?.destroy();
        };
    }, [url, onFail]);

    // Fit narrow screens: a 1.2 scale page overflows a phone, so start smaller.
    useEffect(() => {
        if (window.innerWidth < 640) setScale(0.62);
    }, []);

    const zoom = useCallback(
        (by: number) => setScale((s) => Math.min(3, Math.max(0.4, +(s + by).toFixed(2)))),
        [],
    );

    if (error) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <AlertTriangle size={22} className="text-text-sub" />
                <p className="text-sm text-text-sub">{error}</p>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="flex flex-1 items-center justify-center gap-2 p-8 text-sm text-text-sub">
                <Loader2 size={16} className="animate-spin" /> Opening document…
            </div>
        );
    }

    return (
        <div className="relative flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-auto bg-bg-void/60 p-2 sm:p-4">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {Array.from({ length: pages }, (_, i) => (
                        <Page key={i} doc={doc} num={i + 1} scale={scale} />
                    ))}
                </div>
            </div>

            {/* Floating zoom + page count, clear of the modal's own header. */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-edge-strong bg-bg-base px-1 py-1 shadow-brutal-sm">
                <button
                    type="button"
                    onClick={() => zoom(-0.2)}
                    aria-label="Zoom out"
                    className="pointer-events-auto rounded-full p-1.5 text-text-sub hover:text-accent-orange"
                >
                    <ZoomOut size={15} />
                </button>
                <span className="px-1 font-mono text-[11px] tabular-nums text-text-sub">
                    {pages} page{pages === 1 ? '' : 's'}
                </span>
                <button
                    type="button"
                    onClick={() => zoom(0.2)}
                    aria-label="Zoom in"
                    className="pointer-events-auto rounded-full p-1.5 text-text-sub hover:text-accent-orange"
                >
                    <ZoomIn size={15} />
                </button>
            </div>
        </div>
    );
};

export default PdfReader;
