/**
 * /library — Notes & Question Papers in one place.
 *
 * Three tabs (Notes / Question Papers / GATE); inside each, collections open
 * into year- or subject-folders that expand to the file list. Files live on
 * Google Drive (see data.ts), so a row opens a Drive preview in a modal and
 * offers a direct download — nothing is proxied through our host.
 *
 * PortalLayout renders the fixed nav cluster top-left on this route, so the
 * header here is centered with pt-20 to stay clear of it.
 */
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, FileText, GraduationCap, Search, ChevronDown, Download,
    ExternalLink, X, Folder, Loader2, Frown,
} from 'lucide-react';
import {
    loadIndex, loadCollection, groupFiles, matches, fileMeta, fileSize,
    previewUrl, openUrl, downloadUrl,
    type CollectionMeta, type LibFile, type Shard, type LibraryIndex,
} from './data';

// pdf.js is ~350KB — keep it out of the page bundle until a document is opened.
const PdfReader = lazy(() => import('./PdfReader'));

type TabId = 'notes' | 'papers' | 'gate';

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
/** Blank/odd extensions are almost always PDFs here, so treat them as such. */
const isPdf = (f: LibFile) => !f.x || f.x === 'pdf';

const TABS: { id: TabId; label: string; icon: React.ElementType; blurb: string }[] = [
    { id: 'notes', label: 'Notes', icon: BookOpen, blurb: 'Unit-wise subject notes and semester material.' },
    { id: 'papers', label: 'Question Papers', icon: FileText, blurb: 'Sessionals, pre-university and unit tests, by year and subject.' },
    { id: 'gate', label: 'GATE', icon: GraduationCap, blurb: 'GATE ECE previous-year papers, notes and lecture material.' },
];

/* ── file row ──────────────────────────────────────────────────────────── */
const FileRow: React.FC<{ file: LibFile; onOpen: (f: LibFile) => void }> = ({ file, onOpen }) => {
    const meta = fileMeta(file);
    return (
        <div className="flex items-center gap-2 sm:gap-3 border-b border-edge/60 last:border-b-0 py-2 px-2 sm:px-3 hover:bg-bg-elev/60 transition-colors">
            <button
                type="button"
                onClick={() => onOpen(file)}
                className="flex-1 min-w-0 text-left group"
            >
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[13px] sm:text-sm font-medium text-text-main group-hover:text-accent-orange transition-colors break-words">
                        {file.t}
                    </span>
                    {file.c && (
                        <span className="font-mono text-[10px] sm:text-[11px] text-text-dim shrink-0">{file.c}</span>
                    )}
                </div>
                {meta && <div className="text-[11px] text-text-sub mt-0.5">{meta}</div>}
            </button>
            <span className="hidden sm:block font-mono text-[10px] text-text-dim shrink-0 w-14 text-right">
                {fileSize(file.z)}
            </span>
            <a
                href={downloadUrl(file.i)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Download ${file.t}`}
                aria-label={`Download ${file.t}`}
                className="shrink-0 p-2 rounded-md border border-edge text-text-sub hover:text-accent-orange hover:border-accent-orange transition-colors"
            >
                <Download size={14} />
            </a>
        </div>
    );
};

/* ── one year / subject folder ─────────────────────────────────────────── */
const FolderBlock: React.FC<{
    label: string;
    files: LibFile[];
    open: boolean;
    onToggle: () => void;
    onOpenFile: (f: LibFile) => void;
}> = ({ label, files, open, onToggle, onOpenFile }) => (
    <div className="border-2 border-edge-strong bg-bg-base shadow-neo-sm">
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-bg-elev transition-colors"
        >
            <Folder size={16} className="shrink-0 text-accent-orange" />
            <span className="flex-1 min-w-0 text-sm sm:text-base font-semibold text-text-main truncate">{label}</span>
            <span className="shrink-0 font-mono text-[10px] sm:text-xs text-text-dim">{files.length}</span>
            <ChevronDown
                size={16}
                className={`shrink-0 text-text-sub transition-transform ${open ? 'rotate-180' : ''}`}
            />
        </button>
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden border-t-2 border-edge-strong"
                >
                    {files.map((f) => (
                        <FileRow key={f.i} file={f} onOpen={onOpenFile} />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

/* ── one collection (a branch, a notes set, GATE) ──────────────────────── */
const CollectionBlock: React.FC<{
    meta: CollectionMeta;
    query: string;
    open: boolean;
    onToggle: () => void;
    onOpenFile: (f: LibFile) => void;
}> = ({ meta, query, open, onToggle, onOpenFile }) => {
    const [shard, setShard] = useState<Shard | null>(null);
    const [error, setError] = useState('');
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    // Fetch on first open, and also whenever a search is running — search has to
    // see inside collections the reader hasn't clicked into yet.
    const needed = open || !!query;
    useEffect(() => {
        if (!needed || shard) return;
        let alive = true;
        loadCollection(meta.id)
            .then((s) => alive && setShard(s))
            .catch(() => alive && setError('Could not load this section.'));
        return () => { alive = false; };
    }, [needed, shard, meta.id]);

    const groups = useMemo(() => {
        if (!shard) return [];
        if (!query) return groupFiles(shard);
        const hits = shard.files.filter((f) => matches(f, query));
        return groupFiles({ ...shard, files: hits });
    }, [shard, query]);

    const hitCount = useMemo(
        () => groups.reduce((n, g) => n + g.files.length, 0),
        [groups],
    );

    // While searching, open everything — a collapsed match is a missed match.
    const searching = !!query;
    const expanded = searching || open;
    if (searching && shard && hitCount === 0) return null;

    return (
        <div className="border-2 border-edge-strong bg-bg-base shadow-brutal-sm">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 text-left hover:bg-bg-elev transition-colors"
            >
                {meta.badge && (
                    <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 border-2 border-edge-strong bg-accent-soft text-text-main">
                        {meta.badge}
                    </span>
                )}
                <span className="flex-1 min-w-0 text-base sm:text-lg font-bold text-text-main truncate">
                    {meta.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] sm:text-xs text-text-sub">
                    {searching && shard ? `${hitCount} match${hitCount === 1 ? '' : 'es'}` : `${meta.count} files`}
                </span>
                {!searching && (
                    <ChevronDown
                        size={18}
                        className={`shrink-0 text-text-sub transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {expanded && (
                <div className="border-t-2 border-edge-strong p-2 sm:p-4 space-y-2 sm:space-y-3 bg-bg-void/40">
                    {error && <p className="text-sm text-text-sub px-2 py-3">{error}</p>}
                    {!shard && !error && (
                        <div className="flex items-center gap-2 px-2 py-6 text-text-sub text-sm">
                            <Loader2 size={16} className="animate-spin" /> Loading…
                        </div>
                    )}
                    {shard &&
                        groups.map((g) => (
                            <FolderBlock
                                key={g.key}
                                label={g.key}
                                files={g.files}
                                // A search already narrowed things down, so show the hits.
                                open={searching || openFolders.has(g.key)}
                                onToggle={() =>
                                    setOpenFolders((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(g.key)) next.delete(g.key);
                                        else next.add(g.key);
                                        return next;
                                    })
                                }
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
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.97, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 8 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl h-[92svh] sm:h-[88svh] flex flex-col border-2 border-edge-strong bg-bg-base shadow-brutal-lg"
            >
                <div className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b-2 border-edge-strong">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-main truncate">{file.t}</p>
                        <p className="text-[11px] text-text-sub truncate">
                            {[file.c, file.y, fileMeta(file)].filter(Boolean).join(' · ')}
                        </p>
                    </div>
                    <a
                        href={downloadUrl(file.i)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border-2 border-edge-strong bg-accent-orange text-white text-xs font-bold shadow-neo-sm hover:translate-y-px transition-transform"
                    >
                        <Download size={13} /> <span className="hidden sm:inline">Download</span>
                    </a>
                    <a
                        href={openUrl(file.i)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Google Drive"
                        aria-label="Open in Google Drive"
                        className="shrink-0 p-1.5 border-2 border-edge-strong text-text-sub hover:text-accent-orange transition-colors"
                    >
                        <ExternalLink size={14} />
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="shrink-0 p-1.5 border-2 border-edge-strong text-text-sub hover:text-accent-orange transition-colors"
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
                        className="flex-1 w-full bg-white"
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
    const [tab, setTab] = useState<TabId>('notes');
    const [rawQuery, setRawQuery] = useState('');
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);
    const [preview, setPreview] = useState<LibFile | null>(null);
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

    const visible = useMemo(
        () => (index ? index.collections.filter((c) => c.group === tab) : []),
        [index, tab],
    );

    const switchTab = useCallback((id: TabId) => {
        setTab(id);
        setOpenId(null);
    }, []);

    const active = TABS.find((t) => t.id === tab)!;

    return (
        <div className="min-h-[100svh] w-full bg-bg-void text-text-main">
            <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 pt-20 sm:pt-24 pb-16">
                {/* Centered header — the fixed nav cluster owns the top-left corner. */}
                <header className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Library</h1>
                    <p className="mt-2 text-sm sm:text-base text-text-sub max-w-2xl mx-auto">
                        Notes and previous-year question papers, sorted by subject and year.
                        Free to read and download — no sign-in needed.
                    </p>
                    {index && (
                        <p className="mt-2 font-mono text-[11px] text-text-dim">
                            {index.total.toLocaleString()} files · updated {index.generated}
                        </p>
                    )}
                </header>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const on = t.id === tab;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => switchTab(t.id)}
                                aria-pressed={on}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-edge-strong font-bold text-xs sm:text-base transition-all ${
                                    on
                                        ? 'bg-accent-orange text-white shadow-brutal-sm'
                                        : 'bg-bg-base text-text-sub hover:bg-bg-elev shadow-neo-sm'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                <span className="text-center leading-tight">{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative mb-3 sm:mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                    <input
                        type="search"
                        value={rawQuery}
                        onChange={(e) => setRawQuery(e.target.value)}
                        placeholder={`Search ${active.label.toLowerCase()} — subject, code or year…`}
                        aria-label={`Search ${active.label}`}
                        className="w-full pl-9 pr-3 py-2.5 sm:py-3 border-2 border-edge-strong bg-bg-base text-sm text-text-main placeholder:text-text-dim outline-none focus:border-accent-orange transition-colors"
                    />
                </div>
                <p className="text-xs text-text-sub mb-4 sm:mb-5">{active.blurb}</p>

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
                    <div className="flex items-center justify-center gap-2 py-16 text-text-sub text-sm">
                        <Loader2 size={18} className="animate-spin" /> Loading library…
                    </div>
                )}
                <div className="space-y-3 sm:space-y-4">
                    {visible.map((c) => (
                        <CollectionBlock
                            key={c.id}
                            meta={c}
                            query={query}
                            open={openId === c.id}
                            onToggle={() => setOpenId((prev) => (prev === c.id ? null : c.id))}
                            onOpenFile={setPreview}
                        />
                    ))}
                </div>

                <p className="mt-10 text-[11px] leading-relaxed text-text-dim text-center max-w-2xl mx-auto">
                    Papers and notes are shared for study use and are hosted on Google Drive.
                    If something here is yours and you’d like it removed, email{' '}
                    <a href="mailto:info@bitforbytes.in" className="underline hover:text-accent-orange">
                        info@bitforbytes.in
                    </a>
                    .
                </p>
            </div>

            <AnimatePresence>
                {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default LibraryPage;
