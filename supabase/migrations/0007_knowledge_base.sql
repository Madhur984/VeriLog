-- 0007_knowledge_base.sql
-- Vector store backing VoltMonkey's retrieval-augmented answers: the study
-- notes / question papers are chunked, embedded (Gemini gemini-embedding-001,
-- truncated to 768 dims via outputDimensionality — text-embedding-004, the
-- original model this schema was sized for, has since been retired) and
-- searched by cosine similarity so the bot answers FROM the material instead
-- of from memory.
--
-- Run AFTER 0001-0006 (idempotent; re-running is safe).

create extension if not exists vector;

create table if not exists public.kb_documents (
    id         bigserial primary key,
    drive_id   text unique,          -- Google Drive file id, so re-runs skip work
    title      text not null,
    folder     text,                 -- e.g. 'Notes/DSD' — used to scope/filter
    pages      int,
    created_at timestamptz not null default now()
);

create table if not exists public.kb_chunks (
    id          bigserial primary key,
    doc_id      bigint not null references public.kb_documents (id) on delete cascade,
    chunk_index int not null,
    content     text not null,
    embedding   vector(768),
    created_at  timestamptz not null default now(),
    unique (doc_id, chunk_index)
);

-- HNSW beats IVFFlat here: it needs no training pass and stays accurate while
-- the table grows one ingest batch at a time.
create index if not exists kb_chunks_embedding_idx
    on public.kb_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists kb_chunks_doc_idx on public.kb_chunks (doc_id);

-- Both tables are service-role only: RLS on, ZERO policies. The corpus is
-- reachable exclusively through the `assistant` Edge Function, never straight
-- from a browser with the anon key.
alter table public.kb_documents enable row level security;
alter table public.kb_chunks    enable row level security;

-- Top-k semantic search. SECURITY DEFINER so the Edge Function can call it
-- without the tables being exposed.
create or replace function public.match_kb(
    query_embedding vector(768),
    match_count     int   default 6,
    min_similarity  float default 0.55
)
returns table (content text, title text, folder text, similarity float)
language sql stable security definer set search_path = public
as $$
    select c.content,
           d.title,
           d.folder,
           1 - (c.embedding <=> query_embedding) as similarity
    from public.kb_chunks c
    join public.kb_documents d on d.id = c.doc_id
    where 1 - (c.embedding <=> query_embedding) > min_similarity
    order by c.embedding <=> query_embedding
    limit match_count;
$$;

revoke all on function public.match_kb(vector, int, float) from anon, authenticated;
