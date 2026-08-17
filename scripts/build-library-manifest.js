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
// Only a short alphanumeric tail is a real extension. Many of these filenames
// contain "B.Tech" and no extension at all, so a naive split on the last dot
// yields junk like "tech_as&h_2024-2025_odd_ut_ques_constitution of india".
const ext = (n) => {
  const tail = n.includes('.') ? n.split('.').pop().toLowerCase() : '';
  return /^[a-z0-9]{1,5}$/.test(tail) ? tail : '';
};

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
    // No \b after the word: filenames run these straight into the year ("ODD19 20").
    .replace(/\b(ODD|EVEN|ENEN)\s*\d*/gi, ' ')
    .replace(/\b(19|20)?\d{2}[\s-]+\d{2}\b\s*$/, ' ')
    // Paper-set and session markers that survive into the subject name and
    // otherwise split one subject across several buckets.
    .replace(/\(\s*set\s*[-–]?\s*[a-d]\s*\)/gi, ' ')
    .replace(/\bset\s*[-–]?\s*[a-d]\b/gi, ' ')
    .replace(/\b(sem|semester|session|backlog|carry\s*over)\b/gi, ' ')
    .replace(/\b(19|20)\d{2}\b/g, ' ') // a stray standalone year
    // Any subject code still sitting in the title is junk by this point — the
    // real one was already lifted into its own field. Case-insensitive: plenty
    // of these filenames are lower-case ("operations research noe 073").
    .replace(/\b[a-z]{2,4}\s*-?\s*\d{3}[a-z]?\b/gi, ' ')
    .replace(/\b\d{4,8}\b/g, ' ') // bare numeric codes, e.g. "180001"
    .replace(/[_-]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s.,&-]+|[\s.,&-]+$/g, '')
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
  const code = tail.match(/\b([A-Za-z]{2,4}\s*-?\s*\d{3}[A-Za-z]?)\b/);
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

/* ── subject canonicalisation ──────────────────────────────────────────── */
/* The same subject is typed many ways across years — "Analog & Digital
   Communication" / "Analog and Digital Communication", or with a stray code
   left in ("wireless and mobile communication nec 801"), or plainly misspelled
   ("Communicaton"). Left alone, ECE alone yields 417 "subjects", 232 of them
   holding a single paper, which makes grouping by subject useless. */

const STOP = new Set(['and', 'of', 'the', 'in', 'for', 'to', 'a', 'an', 'using', 'with', 'i', 'ii']);

/** Aggressive key: no case, no punctuation, no stop-words, no stray codes. */
function subjectKey(title) {
  return title
    .toLowerCase()
    .replace(/&/g, ' and ')
    // Common abbreviations, so "Communication Engg." keys the same as
    // "Communication Engineering".
    .replace(/\bengg?\b\.?/g, 'engineering')
    .replace(/\bcomm\b\.?/g, 'communication')
    .replace(/\bmicroprocessors\b/g, 'microprocessor')
    .replace(/\bcircuits\b/g, 'circuit')
    .replace(/\bsystems\b/g, 'system')
    .replace(/\b[a-z]{2,4}\s*-?\s*\d{3}[a-z]?\b/g, ' ') // a code that leaked into the title
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .join('');
}

/** Bounded edit distance — returns >max as soon as it's certain. */
function within(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

/**
 * Fold each row's title onto one canonical spelling per subject: exact key
 * first, then a near-miss pass that catches typos. The winning display name is
 * the most common spelling (longest breaks ties), so the label stays natural.
 */
function canonicaliseSubjects(rows) {
  const groups = new Map(); // key -> Map(originalTitle -> count)
  for (const r of rows) {
    const k = subjectKey(r.t);
    if (!k) continue;
    if (!groups.has(k)) groups.set(k, new Map());
    const m = groups.get(k);
    m.set(r.t, (m.get(r.t) || 0) + 1);
  }

  // Merge near-identical keys into the more populous one. Only for keys long
  // enough that a 1-2 char difference is a typo rather than a real distinction
  // ("ec101" vs "ec102" must never merge).
  const keys = [...groups.keys()].sort(
    (a, b) => [...groups.get(b).values()].reduce((x, y) => x + y, 0) -
      [...groups.get(a).values()].reduce((x, y) => x + y, 0),
  );
  const alias = new Map();
  const kept = [];
  for (const k of keys) {
    const hit = k.length >= 12 ? kept.find((c) => within(k, c, k.length >= 20 ? 2 : 1)) : undefined;
    if (hit) alias.set(k, hit);
    else kept.push(k);
  }

  // Fold the merged spellings together before picking a winner.
  const merged = new Map();
  for (const [k, counts] of groups) {
    const target = alias.get(k) || k;
    if (!merged.has(target)) merged.set(target, new Map());
    const m = merged.get(target);
    for (const [title, n] of counts) m.set(title, (m.get(title) || 0) + n);
  }

  // Filenames shout, whisper and mix case, so the winning spelling still needs
  // normalising: title-case the all-lower ones, and keep roman numerals upper
  // ("mathematics iii" -> "Mathematics III", not "Mathematics Iii").
  const displayName = (s) =>
    (/[A-Z]/.test(s) ? s : titleCase(s)).replace(
      /\b(i{1,3}|iv|vi{0,3}|ix|xi{0,2})\b/gi,
      (m) => m.toUpperCase(),
    );

  const display = new Map();
  for (const [k, counts] of merged) {
    let best = '';
    let bestN = -1;
    for (const [title, n] of counts) {
      if (n > bestN || (n === bestN && title.length > best.length)) { best = title; bestN = n; }
    }
    display.set(k, displayName(best));
  }

  let folded = 0;
  for (const r of rows) {
    const k = subjectKey(r.t);
    const target = alias.get(k) || k;
    const name = display.get(target);
    if (name && name !== r.t) { r.t = name; folded++; }
  }
  return { rows, folded, subjects: display.size };
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

// ECE leads: this is a VLSI/ECE site, so its papers go first regardless of the
// order Drive hands the folders back. Anything unlisted sorts after these.
const BRANCH_ORDER = ['ECE', 'EN', 'CSE', 'CS', 'ME', 'CE', 'AS&H', 'IT'];

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
  const branchFolders = (await list(bytepad))
    .filter((f) => f.mimeType === FOLDER_MIME)
    .sort((a, b) => {
      const ai = BRANCH_ORDER.indexOf(a.name);
      const bi = BRANCH_ORDER.indexOf(b.name);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.name.localeCompare(b.name);
    });
  for (const br of branchFolders) {
    const raw = await collect(br.id, [], []);
    if (!raw.length) continue;
    let rows = raw.map((f) => {
      const p = parsePaper(f.name);
      return fileRow(f, { t: p.title, c: p.code, y: p.year, s: p.session, e: p.exam, k: p.kind });
    });
    // Canonicalise BEFORE dedupe: once spellings agree, the duplicate copies
    // that only differed by wording collapse too.
    const canon = canonicaliseSubjects(rows);
    rows = dedupe(canon.rows, (r) => `${r.t.toLowerCase()}|${r.y}|${r.s}|${r.e}|${r.k}`);
    rows.sort((a, b) => (b.y || '').localeCompare(a.y || '') || a.t.localeCompare(b.t));
    console.log(`    ${canon.subjects} subjects after folding ${canon.folded} titles`);
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

  /* ---- notes: subject folders under KRITEN/Notes + the kartik sets ----
     Parked for now — flip INCLUDE_NOTES back to true to restore the tab; the
     page picks the tabs up from index.json, so nothing else needs changing. */
  const INCLUDE_NOTES = false;
  console.log(INCLUDE_NOTES ? 'notes…' : 'notes… SKIPPED (INCLUDE_NOTES=false)');
  const noteSources = !INCLUDE_NOTES ? [] : [
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

  /* ---- GATE ----
     Parked alongside notes; flip INCLUDE_GATE to restore it. Note that the
     "Lecture Material" set is the pw_gate folder (commercial coaching notes) —
     re-check that before publishing it. */
  const INCLUDE_GATE = false;
  console.log(INCLUDE_GATE ? 'GATE…' : 'GATE… SKIPPED (INCLUDE_GATE=false)');
  const gateSets = !INCLUDE_GATE ? [] : [
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
  if (gateRows.length) {
    write('gate', { id: 'gate', title: 'GATE', kind: 'gate', files: gateRows });
    collections.push({ id: 'gate', title: 'GATE ECE', group: 'gate', count: gateRows.length });
  }

  const index = {
    generated: new Date().toISOString().slice(0, 10),
    total: collections.reduce((n, c) => n + c.count, 0),
    collections,
  };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`\nindex.json — ${collections.length} collections, ${index.total} files total`);
}

main().catch((e) => { console.error(e); process.exit(1); });
