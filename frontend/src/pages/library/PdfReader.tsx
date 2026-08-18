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
 *
 * Zoom defaults to FIT-WIDTH, measured from the container, so a scanned paper
 * fills the space instead of sitting small in the middle of it — and it
 * re-fits when the modal is maximised or the window resizes. Pressing +/- takes
 * manual control; "Fit" hands it back.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
        if (!near || drawn.current === scale || scale <= 0) return;
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
    const [error, setError] = useState('');
    // null = follow the container (fit width). A number = the reader zoomed by hand.
    const [userScale, setUserScale] = useState<number | null>(null);
    const [fitScale, setFitScale] = useState(0);
    const [baseWidth, setBaseWidth] = useState(0); // page width in CSS px at scale 1
    const scroller = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        let loaded: PDFDocumentProxy | null = null;
        const task = pdfjs.getDocument({ url, withCredentials: false });
        task.promise
            .then(async (d) => {
                if (cancelled) { d.destroy(); return; }
                loaded = d;
                setDoc(d);
                setPages(d.numPages);
                // Page 1 sets the fit basis; these papers are uniform A4 scans.
                const p = await d.getPage(1);
                if (!cancelled) setBaseWidth(p.getViewport({ scale: 1 }).width);
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

    // Re-fit whenever the container changes size — which is exactly what
    // maximising, entering fullscreen or rotating a phone does.
    useLayoutEffect(() => {
        const el = scroller.current;
        if (!el || !baseWidth) return;
        const measure = () => {
            const pad = 24; // matches the p-2/p-4 gutter, keeps a hair of margin
            const avail = Math.max(120, el.clientWidth - pad);
            setFitScale(+(avail / baseWidth).toFixed(3));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [baseWidth]);

    const scale = userScale ?? fitScale;

    const zoom = useCallback(
        (by: number) =>
            setUserScale((s) => {
                const from = s ?? fitScale ?? 1;
                return Math.min(4, Math.max(0.25, +(from + by).toFixed(2)));
            }),
        [fitScale],
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
            <div ref={scroller} className="h-full overflow-auto bg-bg-void/60 p-2 sm:p-3">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                    {scale > 0 &&
                        Array.from({ length: pages }, (_, i) => (
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
                <button
                    type="button"
                    onClick={() => setUserScale(null)}
                    aria-label="Fit page to width"
                    title="Fit to width"
                    className={`pointer-events-auto rounded-full px-2 py-1 font-mono text-[10px] font-bold ${
                        userScale === null ? 'text-accent-orange' : 'text-text-sub hover:text-accent-orange'
                    }`}
                >
                    {userScale === null ? 'FIT' : `${Math.round(scale * 100)}%`}
                </button>
                <button
                    type="button"
                    onClick={() => zoom(0.2)}
                    aria-label="Zoom in"
                    className="pointer-events-auto rounded-full p-1.5 text-text-sub hover:text-accent-orange"
                >
                    <ZoomIn size={15} />
                </button>
                <span className="px-1.5 font-mono text-[10px] tabular-nums text-text-dim">
                    {pages}p
                </span>
            </div>
        </div>
    );
};

export default PdfReader;
