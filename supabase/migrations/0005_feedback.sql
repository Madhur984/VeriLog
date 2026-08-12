-- 0005_feedback.sql
-- Site-wide feedback bubble (footer widget): stores every submission durably
-- in Supabase, then the `feedback` Edge Function best-effort forwards the same
-- row to a Power Automate webhook that appends it to the owner's OneDrive
-- Excel sheet. If the Excel forward ever fails, nothing is lost — it's still
-- here with excel_synced = false for a manual/replay fix.
--
-- Run AFTER 0001-0004 (idempotent; re-running is safe).

create extension if not exists "pgcrypto";

create table if not exists public.feedback (
    id            uuid primary key default gen_random_uuid(),
    owner_key     text,             -- auth.users.id (uuid) for logins, guest_id for guests, null if anonymous
    owner_kind    text check (owner_kind in ('user', 'guest', 'anonymous')),
    display_name  text,
    email         text,
    rating        smallint check (rating between 1 and 5),
    message       text not null check (char_length(message) between 1 and 4000),
    page          text,             -- pathname the learner was on when they opened the form
    user_agent    text,
    excel_synced  boolean not null default false,
    created_at    timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
    on public.feedback (created_at desc);

alter table public.feedback enable row level security;

-- Anonymous + signed-in clients may only INSERT. All reads (including the
-- excel_synced flag update from the Edge Function) go through the service
-- role key, which bypasses RLS — no SELECT/UPDATE policy is needed here.
drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback"
    on public.feedback
    for insert
    to anon, authenticated
    with check (true);
