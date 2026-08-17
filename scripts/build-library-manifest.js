/**
 * Build the /library manifest from the shared Google Drive folder.
 *
 * The corpus is ~24GB — far too big to live in the repo or on shared hosting —
 * so Drive stays the storage and the site is only the browsing UI. This script
 * walks Drive once and writes small JSON shards that the page fetches lazily:
 *
 *   frontend/public/library/index.json      tiny — collections + counts
 *   frontend/public/library/<shard>.json    one per branch / notes set
 *
 * Re-run whenever the Drive folder changes:  node scripts/build-library-manifest.js
 *
 * Deliberately EXCLUDED: the two textbook folders (copyrighted commercial
 * books) and the internal folders (PITCH, Plans post Launch, SEO, LOGO, BOT).
 */
const fs = require('fs');
const path = require('path');

const KEY = process.env.DRIVE_API_KEY || 'AIzaSyAWGrfCCr7albM3lmCc937gx4uIphbpeKQ';
const API = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const ROOT = '1fwNZUEgH15xyOT8nuS3kcjAT21pjJpN_';
const OUT = path.join(__dirname, '..', 'frontend', 'public', 'library');

/* ── Drive ─────────────────────────────────────────────────────────────── */
async function list(parent) {
  const out = [];
  let token = '';
  do {
    const url = `${API}?q=${encodeURIComponent(`'${parent}' in parents and trashed=false`)}&key=${KEY}` +
      `&fields=nextPageToken,files(id,name,size,mimeType)&pageSize=200${token ? `&pageToken=${token}` : ''}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Drive list ${r.status} for ${parent}`);
    const j = await r.json();
    (j.files || []).forEach((f) => out.push(f));
    token = j.nextPageToken || '';
  } while (token);
  return out;
}

/** Depth-first collect of every non-folder file, remembering its folder path. */
async function collect(id, trail, acc, depth = 0) {
  if (depth > 5) return acc;
  for (const f of await list(id)) {
    if (f.mimeType === FOLDER_MIME) await collect(f.id, [...trail, f.name], acc, depth + 1);
    else acc.push({ ...f, trail });
  }
  return acc;
}

async function resolve(parts) {
  let id = ROOT;
  for (const p of parts) {
    const hit = (await list(id)).find(
      (f) => f.mimeType === FOLDER_MIME && f.name.toLowerCase() === p.toLowerCase(),
    );
    if (!hit) throw new Error(`folder not found: ${parts.join('/')} (stuck at "${p}")`);
    id = hit.id;
  }
  return id;
}

/* ── filename parsing ──────────────────────────────────────────────────── */
const ext = (n) => (n.includes('.') ? n.split('.').pop().toLowerCase() : '');

/** Title-case, but leave acronyms and codes (DSD, BEC-302, D.COM) intact. */
const titleCase = (s) =>
  s.split(/\s+/)
    .map((w) => (/[a-z]/.test(w) && !/\d/.test(w) ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');

/** Folder names double as group labels: drop Drive's export suffix, tidy case. */
const tidyFolder = (s) => {
  const clean = s.replace(/-\d{8}T\d+Z-\d+-\d+$/, '').replace(/\s*\(\d+\)\s*$/, '').trim();
  // All-caps folders are acronyms (DSD, NAS, ANTENNA) — title-casing hurts them.
  return /[a-z]/.test(clean) ? titleCase(clean) : clean;
};

/** Strip the exam/session/kind/year tokens that repeat inside a paper title. */
const cleanTitle = (s) =>
  s
    .replace(/\b(ST[\s-]?[12]|ST|PUT|UT)\b/gi, ' ')
    .replace(/\b(QP|QUES|Sol|Solution)\b/gi, ' ')
    .replace(/\b(ODD|EVEN)\b/gi, ' ')
    .replace(/\b(19|20)?\d{2}[\s-]+\d{2}\b\s*$/, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

/** Strip Drive's " (2)" duplicate suffix and the extension. */
function stem(name) {
  return name.replace(/\.[a-z0-9]+$/i, '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

const BYTEPAD_PREFIX = /^_src_main_resources_papers_B\.Tech_/i;
const EXAMS = ['ST-1', 'ST-2', 'ST1', 'ST2', 'PUT', 'UT', 'ST', 'PRE-UNIVERSITY', 'SESSIONAL'];

/** Normalise an academic year to "2021-22" from either "2021-2022" or "21-22". */
function normYear(raw) {
  if (!raw) return '';
  let m = raw.match(/^(\d{4})\s*[-–]\s*(\d{2,4})$/);
  if (m) return `${m[1]}-${m[2].slice(-2)}`;
  m = raw.match(/^(\d{2})\s*[-–]\s*(\d{2})$/);
  if (m) return `20${m[1]}-${m[2]}`;
  return '';
}

/**
 * Question papers carry their metadata in the filename. Two shapes exist and
 * both appear (the `_src_` ones are the scraper's originals, the bare ones are
 * the same paper re-saved), so we parse both and de-duplicate afterwards.
 */
function parsePaper(name) {
  const s = stem(name);
  const out = { title: '', code: '', year: '', session: '', exam: '', kind: '' };

  if (BYTEPAD_PREFIX.test(s)) {
    // _src_..._B.Tech_ECE_2023-2024_ODD_ST-1_QUES_<Subject> <CODE> ...
    const parts = s.replace(BYTEPAD_PREFIX, '').split('_');
    out.year = normYear(parts[1] || '');
    out.session = (parts[2] || '').toUpperCase();
    out.exam = (parts[3] || '').toUpperCase();
    out.kind = /SOL/i.test(parts[4] || '') ? 'Solution' : 'Question paper';
    var tail = parts.slice(5).join(' ');
  } else {
    var tail = s;
    const y = s.match(/\b(\d{2}\s*-\s*\d{2}|\d{4}\s*-\s*\d{4})\s*$/);
    if (y) { out.year = normYear(y[1].replace(/\s/g, '')); tail = tail.slice(0, y.index); }
    const sess = tail.match(/\b(ODD|EVEN)\b/i);
    if (sess) { out.session = sess[1].toUpperCase(); tail = tail.replace(sess[0], ' '); }
    const kind = tail.match(/\b(Sol|Solution|QP|QUES)\b/i);
    if (kind) {
      out.kind = /sol/i.test(kind[1]) ? 'Solution' : 'Question paper';
      tail = tail.replace(kind[0], ' ');
    }
  }

  // Subject code, e.g. KEC-076 / BEC403 / REC-085 / BOE410
  const code = tail.match(/\b([A-Z]{2,4}\s*-?\s*\d{3}[A-Z]?)\b/);
  if (code) { out.code = code[1].replace(/\s/g, '').toUpperCase(); tail = tail.replace(code[0], ' '); }

  if (!out.exam) {
    const e = EXAMS.find((x) => new RegExp(`\\b${x.replace('-', '[- ]?')}\\b`, 'i').test(tail));
    if (e) { out.exam = e.toUpperCase(); tail = tail.replace(new RegExp(`\\b${e.replace('-', '[- ]?')}\\b`, 'i'), ' '); }
  }
  if (!out.kind) out.kind = 'Question paper';

  out.title = cleanTitle(tail) || stem(name);
  return out;
}

/** ABESIT papers are "BEC402-ANALOG-CIRCUITS.pdf" — code first, then subject. */
function parseAbesit(name) {
  const s = stem(name);
  // These are shouted in ALL CAPS, so lower first and let titleCase rebuild them.
  const nice = (x) => titleCase(x.replace(/-/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase()).trim();
  // The code sits at the front on most, but trails on some ("...-KEC-402").
  const m = s.match(/\b([A-Z]{2,4}\s*-?\s*\d{3}[A-Z]?)\b/i);
  if (!m) return { title: nice(s), code: '', kind: 'Question paper' };
  return {
    title: nice(s.replace(m[0], ' ')),
    code: m[1].replace(/[\s-]/g, '').toUpperCase(),
    kind: 'Question paper',
  };
}

/** GATE PYQs: EC-2000, EC-GATE-2011, ECE-_Gate-16_-set-2, ECGUQPWVL_17P2 */
function parseGateYear(name) {
  const s = stem(name);
  const full = s.match(/\b(19|20)(\d{2})\b/);
  if (full) return `${full[1]}${full[2]}`;
  const two = s.match(/gate[-_ ]?(\d{2})\b/i) || s.match(/_(\d{2})P\d/i);
  if (two) return `20${two[1]}`;
  return 'Other';
}

/* ── shard assembly ────────────────────────────────────────────────────── */
const fileRow = (f, extra) => ({
  i: f.id,
  x: ext(f.name),
  z: f.size ? Number(f.size) : undefined,
  ...extra,
});

/**
 * The same paper is often present several times (Drive "(1)" copies, plus the
 * `_src_` original alongside its re-saved twin). Collapse on the parsed
 * identity and keep the best copy — a PDF beats a .doc, a bigger file beats a
 * truncated one.
 */
function dedupe(rows, keyOf) {
  const best = new Map();
  const rank = (r) => (r.x === 'pdf' ? 2 : r.x === 'docx' || r.x === 'doc' ? 1 : 0);
  for (const r of rows) {
    const k = keyOf(r);
    const prev = best.get(k);
    if (!prev || rank(r) > rank(prev) || (rank(r) === rank(prev) && (r.z || 0) > (prev.z || 0))) {
      best.set(k, r);
    }
  }
  return [...best.values()];
}

const BRANCHES = {
  ECE: 'Electronics & Communication',
  CSE: 'Computer Science',
  CS: 'Computer Science (CS)',
  IT: 'Information Technology',
  ME: 'Mechanical',
  CE: 'Civil',
  EN: 'Electrical',
  'AS&H': 'Applied Science & Humanities',
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const collections = [];
  const write = (id, data) => {
    fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(data));
    const kb = (fs.statSync(path.join(OUT, `${id}.json`)).size / 1024).toFixed(0);
    console.log(`  wrote ${id}.json — ${data.files.length} files, ${kb}KB`);
  };

  /* ---- question papers: one shard per branch ---- */
  console.log('question papers (bytepad)…');
  const bytepad = await resolve(['KRITEN', 'q_papers_bytepad']);
  for (const br of (await list(bytepad)).filter((f) => f.mimeType === FOLDER_MIME)) {
    const raw = await collect(br.id, [], []);
    if (!raw.length) continue;
    let rows = raw.map((f) => {
      const p = parsePaper(f.name);
      return fileRow(f, { t: p.title, c: p.code, y: p.year, s: p.session, e: p.exam, k: p.kind });
    });
    rows = dedupe(rows, (r) => `${r.t.toLowerCase()}|${r.c}|${r.y}|${r.s}|${r.e}|${r.k}`);
    rows.sort((a, b) => (b.y || '').localeCompare(a.y || '') || a.t.localeCompare(b.t));
    const id = `qp-${br.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    write(id, { id, title: BRANCHES[br.name] || br.name, badge: br.name, kind: 'qp', files: rows });
    collections.push({ id, title: BRANCHES[br.name] || br.name, badge: br.name, group: 'papers', count: rows.length });
  }

  /* ---- ABESIT papers (no year in the filenames) ---- */
  console.log('question papers (ABESIT)…');
  const abesitId = await resolve(['KRITEN', 'q_papers_abesit']);
  let abesit = (await collect(abesitId, [], [])).map((f) => {
    const p = parseAbesit(f.name);
    return fileRow(f, { t: p.title, c: p.code, y: '', s: '', e: '', k: p.kind });
  });
  abesit = dedupe(abesit, (r) => `${r.t.toLowerCase()}|${r.c}`);
  abesit.sort((a, b) => a.t.localeCompare(b.t));
  write('qp-abesit', { id: 'qp-abesit', title: 'ABESIT Papers', badge: 'ABESIT', kind: 'qp', files: abesit });
  collections.push({ id: 'qp-abesit', title: 'ABESIT Papers', badge: 'ABESIT', group: 'papers', count: abesit.length });

  /* ---- notes: subject folders under KRITEN/Notes + the kartik sets ---- */
  console.log('notes…');
  const noteSources = [
    { path: ['KRITEN', 'Notes'], id: 'notes-core', title: 'Subject Notes' },
    { path: ['kartik notes'], id: 'notes-sem', title: 'Semester Notes' },
    { path: ['KRITEN', 'iit kgp stuff'], id: 'notes-iitkgp', title: 'IIT KGP Material' },
  ];
  for (const src of noteSources) {
    const id0 = await resolve(src.path);
    const raw = await collect(id0, [], []);
    if (!raw.length) continue;
    let rows = raw.map((f) =>
      fileRow(f, {
        t: stem(f.name),
        // Group by the first folder below the root of this set; loose files sit
        // under "General" rather than vanishing.
        y: f.trail[0] ? tidyFolder(f.trail[0]) : 'General',
        k: 'Notes',
      }),
    );
    rows = dedupe(rows, (r) => `${r.y}|${r.t.toLowerCase()}`);
    rows.sort((a, b) => a.y.localeCompare(b.y) || a.t.localeCompare(b.t));
    write(src.id, { id: src.id, title: src.title, kind: 'notes', files: rows });
    collections.push({ id: src.id, title: src.title, group: 'notes', count: rows.length });
  }

  /* ---- GATE ---- */
  console.log('GATE…');
  const gateSets = [
    { path: ['KRITEN', 'GATE', 'PYQs'], label: 'Previous Year Papers', byYear: true },
    { path: ['KRITEN', 'GATE', 'notes'], label: 'GATE Notes', byYear: false },
    { path: ['KRITEN', 'GATE', 'pw_gate'], label: 'Lecture Material', byYear: false },
  ];
  const gate = [];
  for (const g of gateSets) {
    const gid = await resolve(g.path);
    for (const f of await collect(gid, [], [])) {
      gate.push(fileRow(f, {
        t: stem(f.name),
        y: g.label,
        e: g.byYear ? parseGateYear(f.name) : '',
        k: g.byYear ? 'Question paper' : 'Notes',
      }));
    }
  }
  const gateRows = dedupe(gate, (r) => `${r.y}|${r.t.toLowerCase().replace(/\s*\(\d+\)$/, '')}`)
    .sort((a, b) => a.y.localeCompare(b.y) || (b.e || '').localeCompare(a.e || '') || a.t.localeCompare(b.t));
  write('gate', { id: 'gate', title: 'GATE', kind: 'gate', files: gateRows });
  collections.push({ id: 'gate', title: 'GATE ECE', group: 'gate', count: gateRows.length });

  const index = {
    generated: new Date().toISOString().slice(0, 10),
    total: collections.reduce((n, c) => n + c.count, 0),
    collections,
  };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`\nindex.json — ${collections.length} collections, ${index.total} files total`);
}

main().catch((e) => { console.error(e); process.exit(1); });
