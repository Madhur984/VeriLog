// VoltMonkey's retrieval step (RAG). The study notes live in
// public.kb_chunks as 768-dim Gemini embeddings — see
// supabase/migrations/0007_knowledge_base.sql and
// scripts/ingest-knowledge-base.js for the schema and ingestion side, which
// are unchanged by this backend move (the vector store stays in Supabase
// Postgres; only the serving logic moved here).
//
// We embed the student's question, pull the closest passages via the
// `match_kb` RPC and hand them to the model as reference material.
//
// Strictly best-effort: any failure here (no GEMINI key, empty corpus, slow
// query) must leave the assistant answering exactly as it did before, so the
// whole thing is wrapped and falls through to ''.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
// match_kb is SECURITY DEFINER with EXECUTE revoked from anon/authenticated
// (see the migration), so this must use the service-role key, not the anon
// key the rest of the backend uses.
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const admin = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null;

// text-embedding-004 was retired; gemini-embedding-001 is its replacement but
// defaults to 3072 dims — outputDimensionality pins it back to 768 to match
// kb_chunks.embedding vector(768) in the migration.
const GEMINI_EMBED = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

interface KbRow {
  content: string;
  title: string;
  folder: string | null;
  similarity: number;
}

export async function knowledge(question: string): Promise<string> {
  const gk = process.env.GEMINI_API_KEY ?? '';
  if (!gk || !admin || question.trim().length < 4) return '';
  try {
    const er = await fetch(`${GEMINI_EMBED}?key=${gk}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'models/gemini-embedding-001', content: { parts: [{ text: question.slice(0, 4000) }] }, outputDimensionality: 768 }),
    });
    if (!er.ok) return '';
    const vec = ((await er.json()) as { embedding?: { values?: unknown } })?.embedding?.values;
    if (!Array.isArray(vec)) return '';

    const { data, error } = await admin.rpc('match_kb', {
      query_embedding: vec,
      match_count: 6,
      min_similarity: 0.55,
    });
    if (error || !Array.isArray(data) || !data.length) return '';

    return (data as KbRow[])
      .map((r, i) => `[${i + 1}] (${r.title})\n${String(r.content).slice(0, 1200)}`)
      .join('\n\n');
  } catch (e) {
    console.error('[voltmonkey] kb lookup skipped:', String(e).slice(0, 160));
    return '';
  }
}
