/**
 * Data layer for /library.
 *
 * The corpus (~7,000 files) lives on Google Drive, not in this repo — shared
 * hosting could never carry 24GB. `scripts/build-library-manifest.js` walks
 * Drive and writes the JSON shards in public/library/; here we fetch them
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

const BASE = '/library';

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

export interface Group {
    key: string;
    files: LibFile[];
}

/**
 * Papers group by academic year (newest first, undated last); notes and GATE
 * group by their folder. Within a group, files sort by subject then title.
 */
export function groupFiles(shard: Shard): Group[] {
    const by = new Map<string, LibFile[]>();
    for (const f of shard.files) {
        const key = f.y || (shard.kind === 'qp' ? 'Year not listed' : 'General');
        const list = by.get(key);
        if (list) list.push(f);
        else by.set(key, [f]);
    }

    const groups = [...by.entries()].map(([key, files]) => ({
        key,
        files: files.sort(
            (a, b) => a.t.localeCompare(b.t) || (a.e || '').localeCompare(b.e || ''),
        ),
    }));

    if (shard.kind === 'qp') {
        // "2024-25" before "2016-17"; the undated bucket always sinks.
        return groups.sort((a, b) => {
            const au = /^\d/.test(a.key) ? 0 : 1;
            const bu = /^\d/.test(b.key) ? 0 : 1;
            return au - bu || b.key.localeCompare(a.key);
        });
    }
    return groups.sort((a, b) => a.key.localeCompare(b.key));
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
