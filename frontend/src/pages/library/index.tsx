/**
 * /library — previous-year question papers.
 *
 * One branch card per stream (ECE first), opening into a two-level tree:
 * year → subject → papers, or subject → year → papers, with filters for
 * paper-vs-solution and exam type. A flat list of 1,700 ECE papers is
 * unusable; the grouping is the feature.
 *
 * Files live on Google Drive (see data.ts). PDFs render in-page via pdf.js
 * (PdfReader); Office files fall back to a Drive frame.
 *
 * PortalLayout renders the fixed nav cluster top-left on this route, so the
 * header here is centered with pt-20 to stay clear of it.
 */
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, ChevronDown, Download, ExternalLink, X, Loader2, Frown,
} from 'lucide-react';
import {
    loadIndex, loadCollection, buildTree, matches, passes, fileMeta, fileSize,
    previewUrl, openUrl, downloadUrl, EXAM_TYPES,
    type CollectionMeta, type LibFile, type Shard, type LibraryIndex,
    type GroupMode, type SortMode, type KindFilter, type Filters,
} from './data';

// pdf.js is ~350KB — keep it out of the page bundle until a document is opened.
const PdfReader = lazy(() => import('./PdfReader'));

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
/** Blank/odd extensions are almost always PDFs here, so treat them as such. */
const isPdf = (f: LibFile) => !f.x || f.x === 'pdf';

/* ── small control primitives ──────────────────────────────────────────── */
const Segmented = <T extends string>({
    label, value, options, onChange,
}: {
    label: string;
    value: T;
    options: { v: T; l: string }[];
    onChange: (v: T) => void;
}) => (
    <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-text-dim">
            {label}
        </span>
        <div className="flex border-2 border-edge-strong">
            {options.map((o) => (
                <button
                    key={o.v}
                    type="button"
                    onClick={() => onChange(o.v)}
                    aria-pressed={value === o.v}
                    className={`px-2 py-1 text-[11px] font-bold transition-colors ${
                        value === o.v
                            ? 'bg-accent-orange text-white'
                            : 'bg-bg-base text-text-sub hover:bg-bg-elev'
                    }`}
                >
                    {o.l}
                </button>
            ))}
        </div>
    </div>
);

/* ── file row ──────────────────────────────────────────────────────────── */
const FileRow: React.FC<{ file: LibFile; onOpen: (f: LibFile) => void }> = ({ file, onOpen }) => {
    const isSolution = file.k === 'Solution';
    // The subject and the year are both always shown by an ancestor block
    // (whichever way it's grouped), so a row only needs what varies within it.
    return (
        <div className="flex items-center gap-2 border-b border-edge/60 py-1.5 pl-2 pr-1 last:border-b-0 hover:bg-bg-elev/60 sm:gap-3 sm:pl-3">
            <button type="button" onClick={() => onOpen(file)} className="group min-w-0 flex-1 text-left">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[11px] font-bold text-text-main group-hover:text-accent-orange">
                        {file.e || 'Paper'}
                    </span>
                    <span
                        className={`rounded px-1 py-px font-mono text-[9.5px] font-bold uppercase tracking-wide ${
                            isSolution
                                ? 'bg-accent-soft text-text-main'
                                : 'border border-edge text-text-sub'
                        }`}
                    >
                        {isSolution ? 'Solution' : 'Paper'}
                    </span>
                    {file.s && <span className="text-[11px] text-text-dim">{file.s}</span>}
                </span>
            </button>
            <span className="hidden w-14 shrink-0 text-right font-mono text-[10px] text-text-dim sm:block">
                {fileSize(file.z)}
            </span>
            <a
                href={downloadUrl(file.i)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Download ${file.t}`}
                aria-label={`Download ${file.t}`}
                className="shrink-0 rounded-md border border-edge p-1.5 text-text-sub transition-colors hover:border-accent-orange hover:text-accent-orange"
            >
                <Download size={13} />
            </a>
        </div>
    );
};

/* ── subject (or year) block inside a section ──────────────────────────── */
const SubBlock: React.FC<{
    label: string;
    files: LibFile[];
    open: boolean;
    onToggle: () => void;
    onOpenFile: (f: LibFile) => void;
}> = ({ label, files, open, onToggle, onOpenFile }) => {
    const code = files.find((f) => f.c)?.c;
    return (
        <div className="border border-edge bg-bg-base">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-2 px-2.5 py-2 text-left hover:bg-bg-elev sm:px-3"
            >
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-text-main sm:text-sm">
                    {label}
                </span>
                {code && <span className="shrink-0 font-mono text-[10px] text-text-dim">{code}</span>}
                <span className="shrink-0 font-mono text-[10px] text-text-sub">{files.length}</span>
                <ChevronDown
                    size={14}
                    className={`shrink-0 text-text-sub transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="border-t border-edge">
                    {files.map((f) => (
                        <FileRow key={f.i} file={f} onOpen={onOpenFile} />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── one section (a year, or a subject) ────────────────────────────────── */
const SectionBlock: React.FC<{
    label: string;
    count: number;
    sub: { key: string; files: LibFile[] }[];
    forceOpen: boolean;
    onOpenFile: (f: LibFile) => void;
}> = ({ label, count, sub, forceOpen, onOpenFile }) => {
    const [open, setOpen] = useState(false);
    const [openSubs, setOpenSubs] = useState<Set<string>>(new Set());
    const expanded = forceOpen || open;

    return (
        <div className="border-2 border-edge-strong bg-bg-base shadow-neo-sm">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-bg-elev sm:gap-3 sm:px-4 sm:py-3"
            >
                <FileText size={15} className="shrink-0 text-accent-orange" />
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-text-main sm:text-base">
                    {label}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-text-dim sm:text-xs">{count}</span>
                {!forceOpen && (
                    <ChevronDown
                        size={15}
                        className={`shrink-0 text-text-sub transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden border-t-2 border-edge-strong"
                    >
                        <div className="space-y-1.5 bg-bg-void/40 p-2 sm:p-3">
                            {sub.map((s) => (
                                <SubBlock
                                    key={s.key}
                                    label={s.key}
                                    files={s.files}
                                    open={forceOpen || openSubs.has(s.key)}
                                    onToggle={() =>
                                        setOpenSubs((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(s.key)) next.delete(s.key);
                                            else next.add(s.key);
                                            return next;
                                        })
                                    }
                                    onOpenFile={onOpenFile}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ── one branch collection ─────────────────────────────────────────────── */
const CollectionBlock: React.FC<{
    meta: CollectionMeta;
    query: string;
    filters: Filters;
    mode: GroupMode;
    sort: SortMode;
    open: boolean;
    onToggle: () => void;
    onOpenFile: (f: LibFile) => void;
}> = ({ meta, query, filters, mode, sort, open, onToggle, onOpenFile }) => {
    const [shard, setShard] = useState<Shard | null>(null);
    const [error, setError] = useState('');

    // Fetch on first open, and whenever a search is running — search has to see
    // inside collections the reader hasn't clicked into yet.
    const needed = open || !!query;
    useEffect(() => {
        if (!needed || shard) return;
        let alive = true;
        loadCollection(meta.id)
            .then((s) => alive && setShard(s))
            .catch(() => alive && setError('Could not load this section.'));
        return () => { alive = false; };
    }, [needed, shard, meta.id]);

    const sections = useMemo(() => {
        if (!shard) return [];
        const hits = shard.files.filter((f) => passes(f, filters) && matches(f, query));
        return buildTree(hits, mode, sort);
    }, [shard, query, filters, mode, sort]);

    const hitCount = useMemo(() => sections.reduce((n, s) => n + s.count, 0), [sections]);

    const searching = !!query;
    const expanded = searching || open;
    if (searching && shard && hitCount === 0) return null;

    return (
        <div className="border-2 border-edge-strong bg-bg-base shadow-brutal-sm">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="flex w-full items-center gap-2 px-3 py-3 text-left hover:bg-bg-elev sm:gap-3 sm:px-5 sm:py-4"
            >
                {meta.badge && (
                    <span className="shrink-0 border-2 border-edge-strong bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-text-main sm:text-[11px]">
                        {meta.badge}
                    </span>
                )}
                <span className="min-w-0 flex-1 truncate text-base font-bold text-text-main sm:text-lg">
                    {meta.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-text-sub sm:text-xs">
                    {shard ? `${hitCount} shown` : `${meta.count} papers`}
                </span>
                {!searching && (
                    <ChevronDown
                        size={18}
                        className={`shrink-0 text-text-sub transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {expanded && (
                <div className="space-y-2 border-t-2 border-edge-strong bg-bg-void/40 p-2 sm:space-y-3 sm:p-4">
                    {error && <p className="px-2 py-3 text-sm text-text-sub">{error}</p>}
                    {!shard && !error && (
                        <div className="flex items-center gap-2 px-2 py-6 text-sm text-text-sub">
                            <Loader2 size={16} className="animate-spin" /> Loading…
                        </div>
                    )}
                    {shard && hitCount === 0 && (
                        <p className="px-2 py-4 text-sm text-text-sub">
                            Nothing matches these filters.
                        </p>
                    )}
                    {shard &&
                        sections.map((s) => (
                            <SectionBlock
                                key={s.key}
                                label={s.key}
                                count={s.count}
                                sub={s.sub}
                                // A search already narrowed things down; show the hits.
                                forceOpen={searching}
                                onOpenFile={onOpenFile}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

/* ── preview modal ─────────────────────────────────────────────────────── */
const PreviewModal: React.FC<{ file: LibFile; onClose: () => void }> = ({ file, onClose }) => {
    // Office files can't be painted by pdf.js, and a PDF that fails to parse
    // falls back the same way: let Google render it in a frame.
    const [useFrame, setUseFrame] = useState(!isPdf(file) && !IMAGE_EXT.has(file.x || ''));
    const failToFrame = useCallback(() => setUseFrame(true), []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.97, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 8 }}
                onClick={(e) => e.stopPropagation()}
                className="flex h-[92svh] w-full max-w-5xl flex-col border-2 border-edge-strong bg-bg-base shadow-brutal-lg sm:h-[88svh]"
            >
                <div className="flex shrink-0 items-center gap-2 border-b-2 border-edge-strong px-3 py-2.5 sm:gap-3 sm:px-4">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-text-main">{file.t}</p>
                        <p className="truncate text-[11px] text-text-sub">
                            {[file.c, file.y, fileMeta(file)].filter(Boolean).join(' · ')}
                        </p>
                    </div>
                    <a
                        href={downloadUrl(file.i)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 border-2 border-edge-strong bg-accent-orange px-2.5 py-1.5 text-xs font-bold text-white shadow-neo-sm transition-transform hover:translate-y-px sm:px-3"
                    >
                        <Download size={13} /> <span className="hidden sm:inline">Download</span>
                    </a>
                    <a
                        href={openUrl(file.i)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Drive"
                        aria-label="Open in Google Drive"
                        className="shrink-0 border-2 border-edge-strong p-1.5 text-text-sub transition-colors hover:text-accent-orange"
                    >
                        <ExternalLink size={14} />
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="shrink-0 border-2 border-edge-strong p-1.5 text-text-sub transition-colors hover:text-accent-orange"
                    >
                        <X size={14} />
                    </button>
                </div>

                {IMAGE_EXT.has(file.x || '') ? (
                    <div className="flex-1 overflow-auto bg-bg-void/60 p-4">
                        <img src={downloadUrl(file.i)} alt={file.t} className="mx-auto max-w-full" />
                    </div>
                ) : useFrame ? (
                    <iframe
                        src={previewUrl(file.i)}
                        title={file.t}
                        className="w-full flex-1 bg-white"
                        allow="autoplay"
                    />
                ) : (
                    <Suspense
                        fallback={
                            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-text-sub">
                                <Loader2 size={16} className="animate-spin" /> Opening document…
                            </div>
                        }
                    >
                        <PdfReader url={downloadUrl(file.i)} onFail={failToFrame} />
                    </Suspense>
                )}
            </motion.div>
        </motion.div>
    );
};

/* ── page ──────────────────────────────────────────────────────────────── */
const LibraryPage: React.FC = () => {
    const [index, setIndex] = useState<LibraryIndex | null>(null);
    const [failed, setFailed] = useState(false);
    const [rawQuery, setRawQuery] = useState('');
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);
    const [preview, setPreview] = useState<LibFile | null>(null);
    const [mode, setMode] = useState<GroupMode>('year');
    const [sort, setSort] = useState<SortMode>('newest');
    const [kind, setKind] = useState<KindFilter>('all');
    const [exam, setExam] = useState('');
    const debounce = useRef<number | undefined>(undefined);

    useEffect(() => {
        loadIndex().then(setIndex).catch(() => setFailed(true));
    }, []);

    // Typing filters thousands of rows; wait for a pause before re-filtering.
    useEffect(() => {
        window.clearTimeout(debounce.current);
        debounce.current = window.setTimeout(() => setQuery(rawQuery.trim()), 220);
        return () => window.clearTimeout(debounce.current);
    }, [rawQuery]);

    const filters = useMemo<Filters>(() => ({ kind, exam }), [kind, exam]);
    const collections = index?.collections ?? [];

    // Sort options only make sense against the current grouping.
    const sortOptions = useMemo(
        () =>
            mode === 'year'
                ? ([{ v: 'newest', l: 'Newest' }, { v: 'oldest', l: 'Oldest' }] as { v: SortMode; l: string }[])
                : ([{ v: 'az', l: 'A–Z' }, { v: 'za', l: 'Z–A' }] as { v: SortMode; l: string }[]),
        [mode],
    );
    const changeMode = useCallback((m: GroupMode) => {
        setMode(m);
        setSort(m === 'year' ? 'newest' : 'az');
    }, []);

    return (
        <div className="min-h-[100svh] w-full bg-bg-void text-text-main">
            <div className="mx-auto w-full max-w-5xl px-3 pb-16 pt-20 sm:px-6 sm:pt-24">
                {/* Centered header — the fixed nav cluster owns the top-left corner. */}
                <header className="mb-6 text-center sm:mb-8">
                    <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Question Papers</h1>
                    <p className="mx-auto mt-2 max-w-2xl text-sm text-text-sub sm:text-base">
                        Previous-year papers and solutions, sorted by branch, year and subject.
                        Free to read and download — no sign-in needed.
                    </p>
                    {index && (
                        <p className="mt-2 font-mono text-[11px] text-text-dim">
                            {index.total.toLocaleString()} papers · updated {index.generated}
                        </p>
                    )}
                </header>

                {/* Search */}
                <div className="relative mb-3">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
                    />
                    <input
                        type="search"
                        value={rawQuery}
                        onChange={(e) => setRawQuery(e.target.value)}
                        placeholder="Search a subject, code or year…"
                        aria-label="Search question papers"
                        className="w-full border-2 border-edge-strong bg-bg-base py-2.5 pl-9 pr-3 text-sm text-text-main outline-none transition-colors placeholder:text-text-dim focus:border-accent-orange sm:py-3"
                    />
                </div>

                {/* Controls */}
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-2 border-edge-strong bg-bg-base p-2.5 sm:mb-5 sm:p-3">
                    <Segmented
                        label="Group"
                        value={mode}
                        onChange={changeMode}
                        options={[{ v: 'year', l: 'Year' }, { v: 'subject', l: 'Subject' }]}
                    />
                    <Segmented label="Sort" value={sort} onChange={setSort} options={sortOptions} />
                    <Segmented
                        label="Show"
                        value={kind}
                        onChange={setKind}
                        options={[
                            { v: 'all', l: 'All' },
                            { v: 'qp', l: 'Papers' },
                            { v: 'sol', l: 'Solutions' },
                        ]}
                    />
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-text-dim">
                            Exam
                        </span>
                        <div className="flex border-2 border-edge-strong">
                            {[{ v: '', l: 'Any' }, ...EXAM_TYPES.map((e) => ({ v: e, l: e }))].map((o) => (
                                <button
                                    key={o.v || 'any'}
                                    type="button"
                                    onClick={() => setExam(o.v)}
                                    aria-pressed={exam === o.v}
                                    className={`px-2 py-1 text-[11px] font-bold transition-colors ${
                                        exam === o.v
                                            ? 'bg-accent-orange text-white'
                                            : 'bg-bg-base text-text-sub hover:bg-bg-elev'
                                    }`}
                                >
                                    {o.l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Collections */}
                {failed && (
                    <div className="border-2 border-edge-strong bg-bg-base p-6 text-center">
                        <Frown size={22} className="mx-auto mb-2 text-text-sub" />
                        <p className="text-sm text-text-sub">
                            The library index didn’t load. Refresh the page and it should come back.
                        </p>
                    </div>
                )}
                {!index && !failed && (
                    <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-sub">
                        <Loader2 size={18} className="animate-spin" /> Loading library…
                    </div>
                )}
                <div className="space-y-3 sm:space-y-4">
                    {collections.map((c) => (
                        <CollectionBlock
                            key={c.id}
                            meta={c}
                            query={query}
                            filters={filters}
                            mode={mode}
                            sort={sort}
                            open={openId === c.id}
                            onToggle={() => setOpenId((prev) => (prev === c.id ? null : c.id))}
                            onOpenFile={setPreview}
                        />
                    ))}
                </div>

                <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] leading-relaxed text-text-dim">
                    These papers are indexed for personal study and are hosted on Google Drive.
                    Copyright stays with the university, board or author that produced each one —
                    BitForBytes claims no ownership. If something here is yours and you’d like it
                    removed, email{' '}
                    <a href="mailto:info@bitforbytes.in" className="underline hover:text-accent-orange">
                        info@bitforbytes.in
                    </a>{' '}
                    and we’ll take it down. See our{' '}
                    <a href="/terms" className="underline hover:text-accent-orange">Terms</a>.
                </p>
            </div>

            <AnimatePresence>
                {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default LibraryPage;
