/**
 * Data layer for /library.
 *
 * The corpus (~7,000 files) lives on Google Drive, not in this repo — shared
 * hosting could never carry 24GB. `scripts/build-library-manifest.js` walks
 * Drive and writes the JSON shards in public/paper-data/; here we fetch them
 * lazily, one collection at a time, and group them for display.
 */

/** One file, as stored in the shards. Keys are short to keep the JSON small. */
export interface LibFile {
    i: string;              // Drive file id
    x?: string;             // extension: pdf | docx | ...
    z?: number;             // bytes
    t: string;              // title (subject name, or the note's name)
    c?: string;             // subject code, e.g. KEC-076
    y?: string;             // academic year ("2021-22") or, for notes, the subject folder
    s?: string;             // session: ODD | EVEN
    e?: string;             // exam: ST-1 | ST-2 | PUT | UT, or the GATE year
    k?: string;             // "Question paper" | "Solution" | "Notes"
}

export interface Shard {
    id: string;
    title: string;
    badge?: string;
    kind: 'qp' | 'notes' | 'gate';
    files: LibFile[];
}

export interface CollectionMeta {
    id: string;
    title: string;
    badge?: string;
    group: 'papers' | 'notes' | 'gate';
    count: number;
}

export interface LibraryIndex {
    generated: string;
    total: number;
    collections: CollectionMeta[];
}

const BASE = '/paper-data'; // NOT '/library' — that path is the SPA route, and a
// real directory there makes Apache 301 to it and then 403 (see public/.htaccess:
// the rewrite bails out on existing dirs, and Options -Indexes forbids listing).

/* Shards are immutable per deploy, so one fetch each per session is plenty. */
const cache = new Map<string, Promise<Shard>>();

export function loadIndex(): Promise<LibraryIndex> {
    return fetch(`${BASE}/index.json`).then((r) => {
        if (!r.ok) throw new Error(`library index ${r.status}`);
        return r.json();
    });
}

export function loadCollection(id: string): Promise<Shard> {
    let hit = cache.get(id);
    if (!hit) {
        hit = fetch(`${BASE}/${id}.json`)
            .then((r) => {
                if (!r.ok) throw new Error(`library shard ${id} ${r.status}`);
                return r.json();
            })
            .catch((err) => {
                cache.delete(id); // let a later attempt retry rather than cache the failure
                throw err;
            });
        cache.set(id, hit);
    }
    return hit;
}

/* ── Drive links ───────────────────────────────────────────────────────── */
export const previewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const openUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

// `confirm=t` skips Drive's virus-scan interstitial, which otherwise serves an
// HTML warning page instead of the file for anything over ~25MB. Verified to
// stream the real bytes anonymously; the plain /uc?export=download form does not.
export const downloadUrl = (id: string) =>
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

/* ── display helpers ───────────────────────────────────────────────────── */
export function fileSize(bytes?: number): string {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** A one-line descriptor under the title: "ST-1 · ODD · Solution". */
export function fileMeta(f: LibFile): string {
    return [f.e, f.s, f.k === 'Question paper' ? '' : f.k].filter(Boolean).join(' · ');
}

/* ── browsing controls ─────────────────────────────────────────────────── */
export type GroupMode = 'year' | 'subject';
export type SortMode = 'newest' | 'oldest' | 'az' | 'za';
export type KindFilter = 'all' | 'qp' | 'sol';

export interface Filters {
    kind: KindFilter;
    exam: string; // '' = any
}

/** Exam types actually present across the corpus, in the order students sit them. */
export const EXAM_TYPES = ['ST-1', 'ST-2', 'PUT', 'UT'];

export const UNDATED = 'Year not listed';

export function passes(f: LibFile, filters: Filters): boolean {
    if (filters.kind === 'qp' && f.k !== 'Question paper') return false;
    if (filters.kind === 'sol' && f.k !== 'Solution') return false;
    if (filters.exam && f.e !== filters.exam) return false;
    return true;
}

/** Grouping key for a paper's subject — the parsed subject name. */
const subjectKey = (f: LibFile) => f.t || 'Untitled';
const yearKey = (f: LibFile) => f.y || UNDATED;

export interface SubGroup {
    key: string;
    files: LibFile[];
}
export interface Section {
    key: string;
    count: number;
    sub: SubGroup[];
}

/** ST-1 before ST-2 before PUT before UT; anything unknown trails. */
const examRank = (e?: string) => {
    const i = EXAM_TYPES.indexOf(e || '');
    return i < 0 ? 99 : i;
};

/**
 * Two-level tree: year -> subject -> papers, or subject -> year -> papers.
 * A flat list of 1,700 ECE papers is unusable; this is what makes it browsable.
 */
export function buildTree(files: LibFile[], mode: GroupMode, sort: SortMode): Section[] {
    const outer = mode === 'year' ? yearKey : subjectKey;
    const inner = mode === 'year' ? subjectKey : yearKey;

    const bySection = new Map<string, Map<string, LibFile[]>>();
    for (const f of files) {
        const sk = outer(f);
        let subs = bySection.get(sk);
        if (!subs) { subs = new Map(); bySection.set(sk, subs); }
        const ik = inner(f);
        const list = subs.get(ik);
        if (list) list.push(f);
        else subs.set(ik, [f]);
    }

    // Newest-year-first inside a subject; alphabetical subjects inside a year.
    const sortSubKeys = (a: string, b: string) =>
        mode === 'year'
            ? a.localeCompare(b)
            : (a === UNDATED ? 1 : 0) - (b === UNDATED ? 1 : 0) || b.localeCompare(a);

    const sections: Section[] = [...bySection.entries()].map(([key, subs]) => {
        const sub = [...subs.entries()]
            .map(([k, list]) => ({
                key: k,
                files: list.sort(
                    (a, b) =>
                        examRank(a.e) - examRank(b.e) ||
                        (a.k || '').localeCompare(b.k || '') ||
                        a.t.localeCompare(b.t),
                ),
            }))
            .sort((x, y) => sortSubKeys(x.key, y.key));
        return { key, count: sub.reduce((n, s) => n + s.files.length, 0), sub };
    });

    if (mode === 'year') {
        // Undated always sinks, whichever direction the years run.
        return sections.sort(
            (a, b) =>
                (a.key === UNDATED ? 1 : 0) - (b.key === UNDATED ? 1 : 0) ||
                (sort === 'oldest' ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key)),
        );
    }
    return sections.sort((a, b) =>
        sort === 'za' || sort === 'oldest' ? b.key.localeCompare(a.key) : a.key.localeCompare(b.key),
    );
}

/** Free-text match over title, code, year and exam. */
export function matches(f: LibFile, q: string): boolean {
    if (!q) return true;
    const hay = `${f.t} ${f.c || ''} ${f.y || ''} ${f.e || ''} ${f.k || ''}`.toLowerCase();
    return q
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => hay.includes(term));
}
