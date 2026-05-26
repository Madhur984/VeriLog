-- VeriQuest Tutor — pgvector schema for RAG over project content
-- Run once in Supabase SQL editor (or psql) for project uhtfagdxxvasbtagovwk.
-- Idempotent: safe to re-run.

create extension if not exists vector;

create table if not exists chat_documents (
  id           bigserial primary key,
  source       text        not null,     -- 'pdf' | 'markdown' | 'scene' | 'manual'
  source_path  text        not null,     -- file path or scene id
  title        text        not null,     -- human label shown in citations
  chunk_index  int         not null,     -- 0..n within the source
  content      text        not null,     -- the chunk text
  token_count  int         not null,
  embedding    vector(384) not null,     -- all-MiniLM-L6-v2 dimension
  metadata     jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  unique (source_path, chunk_index)
);

create index if not exists chat_documents_embedding_idx
  on chat_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists chat_documents_source_idx
  on chat_documents (source);

-- Similarity RPC. Returns top-k chunks ranked by cosine similarity.
create or replace function match_chat_documents(
  query_embedding vector(384),
  match_count     int     default 6,
  similarity_threshold float default 0.0
)
returns table (
  id          bigint,
  source      text,
  source_path text,
  title       text,
  chunk_index int,
  content     text,
  similarity  float,
  metadata    jsonb
)
language sql
stable
as $$
  select
    d.id,
    d.source,
    d.source_path,
    d.title,
    d.chunk_index,
    d.content,
    1 - (d.embedding <=> query_embedding) as similarity,
    d.metadata
  from chat_documents d
  where 1 - (d.embedding <=> query_embedding) >= similarity_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
$$;

-- Chat sessions (lightweight — optional, lets us recall thread history).
create table if not exists chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,                                -- nullable; matches auth.users when signed in
  created_at  timestamptz not null default now(),
  last_active timestamptz not null default now(),
  title       text
);

create table if not exists chat_messages (
  id         bigserial primary key,
  session_id uuid       not null references chat_sessions(id) on delete cascade,
  role       text       not null check (role in ('user','assistant','system')),
  content    text       not null,
  citations  jsonb      not null default '[]'::jsonb,
  video_url  text,                                  -- populated when video render succeeds
  video_job  text,                                  -- job id for in-progress renders
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx
  on chat_messages (session_id, created_at);

-- Permissive RLS: project content is non-secret. Tighten if you ever store PII here.
alter table chat_documents enable row level security;
alter table chat_sessions  enable row level security;
alter table chat_messages  enable row level security;

drop policy if exists chat_documents_read on chat_documents;
create policy chat_documents_read on chat_documents
  for select using (true);

drop policy if exists chat_sessions_rw on chat_sessions;
create policy chat_sessions_rw on chat_sessions
  for all using (true) with check (true);

drop policy if exists chat_messages_rw on chat_messages;
create policy chat_messages_rw on chat_messages
  for all using (true) with check (true);
