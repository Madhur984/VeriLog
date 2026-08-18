/**
 * Ingest Google Drive PDFs into the Supabase vector store that backs
 * VoltMonkey's answers:  Drive -> text -> chunks -> Gemini embeddings -> pgvector.
 *
 * Resumable by design: every document is keyed on its Drive file id, so a
 * re-run skips anything already stored. The corpus is far larger than one
 * sitting, and free-tier embedding quotas mean this WILL be interrupted.
 *
 * Usage:  node ingest.js <folderId>|<label> [...]  [--limit N] [--dry]
 */
const fs = require('fs');
const path = require('path');

const DRIVE_KEY = 'AIzaSyAWGrfCCr7albM3lmCc937gx4uIphbpeKQ';
const API = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

const SUPABASE_URL = 'https://uhtfagdxxvasbtagovwk.supabase.co';
const SERVICE_KEY = process.env.SB_SERVICE_KEY;
const GEMINI_KEY = process.env.GEMINI_KEY;
// text-embedding-004 was retired; gemini-embedding-001 replaces it but
// defaults to 3072 dims — outputDimensionality pins it to 768 to match
// kb_chunks.embedding vector(768) in the migration.
const EMBED_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

const args = process.argv.slice(2);
const LIMIT = Number((args.find((a) => a.startsWith('--limit')) || '').split('=')[1] || 0) || Infinity;
const DRY = args.includes('--dry');
const ROOTS = args.filter((a) => !a.startsWith('--'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Drive ─────────────────────────────────────────────────────────────── */
async function listFolder(parent) {
  const out = [];
  let token = '';
  do {
    const url = `${API}?q=${encodeURIComponent(`'${parent}' in parents`)}&key=${DRIVE_KEY}` +
      `&fields=nextPageToken,files(id,name,size,mimeType)&pageSize=200${token ? `&pageToken=${token}` : ''}`;
    const r = await fetch(url);
    if (!r.ok) break;
    const j = await r.json();
    (j.files || []).forEach((f) => out.push(f));
    token = j.nextPageToken || '';
  } while (token);
  return out;
}

/** Depth-first walk collecting every PDF, remembering its folder path. */
async function collectPdfs(id, label, acc, depth = 0) {
  if (depth > 6) return acc;
  for (const f of await listFolder(id)) {
    if (f.mimeType === FOLDER_MIME) await collectPdfs(f.id, `${label}/${f.name}`, acc, depth + 1);
    else if (f.mimeType === 'application/pdf') acc.push({ ...f, folder: label });
  }
  return acc;
}

/* ── PDF -> text ───────────────────────────────────────────────────────── */
async function pdfText(buf) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), useSystemFonts: true }).promise;
  const parts = [];
  const max = Math.min(doc.numPages, 400);
  for (let i = 1; i <= max; i++) {
    try {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      const s = tc.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
      if (s.length > 40) parts.push(s);
    } catch { /* skip unreadable page */ }
  }
  await doc.destroy().catch(() => {});
  return { text: parts.join('\n'), pages: doc.numPages };
}

/** ~1200-char chunks on sentence-ish boundaries, with a little overlap. */
function chunk(text, size = 1200, overlap = 150) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length < 120) return [];
  const out = [];
  let i = 0;
  while (i < clean.length) {
    let end = Math.min(i + size, clean.length);
    if (end < clean.length) {
      const dot = clean.lastIndexOf('. ', end);
      if (dot > i + size * 0.5) end = dot + 1;
    }
    const piece = clean.slice(i, end).trim();
    if (piece.length > 120) out.push(piece);
    if (end >= clean.length) break;
    i = end - overlap;
  }
  return out;
}

/* ── Gemini embeddings ─────────────────────────────────────────────────── */
async function embed(text, tries = 5) {
  for (let a = 1; a <= tries; a++) {
    const r = await fetch(`${EMBED_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text: text.slice(0, 8000) }] },
        outputDimensionality: 768,
      }),
    });
    if (r.ok) return (await r.json())?.embedding?.values ?? null;
    if (r.status === 429 || r.status >= 500) { await sleep(a * 4000); continue; }
    console.error('  embed failed', r.status, (await r.text()).slice(0, 120));
    return null;
  }
  return null;
}

/* ── Supabase ──────────────────────────────────────────────────────────── */
const sb = (p, init = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${p}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

async function alreadyDone(driveId) {
  const r = await sb(`kb_documents?drive_id=eq.${driveId}&select=id`);
  const j = r.ok ? await r.json() : [];
  return Array.isArray(j) && j.length ? j[0].id : null;
}

async function insertDoc(d) {
  const r = await sb('kb_documents', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ drive_id: d.drive_id, title: d.title, folder: d.folder, pages: d.pages }),
  });
  if (!r.ok) throw new Error(`doc insert ${r.status} ${(await r.text()).slice(0, 160)}`);
  return (await r.json())[0].id;
}

async function insertChunks(rows) {
  for (let i = 0; i < rows.length; i += 40) {
    const r = await sb('kb_chunks', { method: 'POST', body: JSON.stringify(rows.slice(i, i + 40)) });
    if (!r.ok) throw new Error(`chunk insert ${r.status} ${(await r.text()).slice(0, 160)}`);
  }
}

/* ── main ──────────────────────────────────────────────────────────────── */
(async () => {
  if (!SERVICE_KEY || !GEMINI_KEY) { console.error('need SB_SERVICE_KEY and GEMINI_KEY in env'); process.exit(1); }

  const pdfs = [];
  for (const r of ROOTS) {
    const [id, label] = r.split('|');
    await collectPdfs(id, label || 'root', pdfs);
  }
  pdfs.sort((a, b) => Number(a.size || 0) - Number(b.size || 0)); // cheap wins first
  console.log(`found ${pdfs.length} PDFs`);
  if (DRY) { pdfs.slice(0, 20).forEach((f) => console.log(' ', f.folder + '/' + f.name)); return; }

  let done = 0, skipped = 0, chunksTotal = 0, failed = 0;
  for (const f of pdfs) {
    if (done >= LIMIT) break;
    if (await alreadyDone(f.id)) { skipped++; continue; }
    try {
      const dl = await fetch(`${API}/${f.id}?alt=media&key=${DRIVE_KEY}`);
      if (!dl.ok) { failed++; continue; }
      const buf = Buffer.from(await dl.arrayBuffer());
      const { text, pages } = await pdfText(buf);
      const pieces = chunk(text);
      if (!pieces.length) { failed++; console.log(`  no text: ${f.name} (likely a scan)`); continue; }

      const docId = await insertDoc({ drive_id: f.id, title: f.name.replace(/\.pdf$/i, ''), folder: f.folder, pages });
      const rows = [];
      for (let i = 0; i < pieces.length; i++) {
        const v = await embed(pieces[i]);
        if (v) rows.push({ doc_id: docId, chunk_index: i, content: pieces[i], embedding: JSON.stringify(v) });
        await sleep(120); // stay under the free-tier embedding rate limit
      }
      if (rows.length) await insertChunks(rows);
      chunksTotal += rows.length;
      done++;
      console.log(`[${done}] ${f.folder}/${f.name} — ${pages}p, ${rows.length} chunks`);
    } catch (e) {
      failed++;
      console.error(`  ERROR ${f.name}: ${String(e.message).slice(0, 140)}`);
    }
  }
  console.log(`\ndone=${done} skipped=${skipped} failed=${failed} chunks=${chunksTotal}`);
})();
