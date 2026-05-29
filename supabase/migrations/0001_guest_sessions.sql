-- Guest session log: persists the guest username + the time they entered.
-- Run this once in the Supabase SQL editor (or via the Supabase CLI).
--
-- Why a new table: there was no "guests"/"users" table to ALTER, so the
-- "guest username + time" requirement is satisfied by creating this table
-- (created_at IS the timestamp column requested).
--
-- The frontend writes here from frontend/src/lib/auth.ts -> startGuestSession,
-- using the public anon key, so RLS must allow the `anon` role to INSERT.

create extension if not exists "pgcrypto";  -- for gen_random_uuid()

create table if not exists public.guest_sessions (
    id             uuid primary key default gen_random_uuid(),
    guest_username text        not null check (char_length(guest_username) between 2 and 32),
    created_at     timestamptz not null default now()
);

create index if not exists guest_sessions_created_at_idx
    on public.guest_sessions (created_at desc);

alter table public.guest_sessions enable row level security;

-- Anonymous (anon key) clients may only INSERT a guest-login row.
drop policy if exists "anon can insert guest sessions" on public.guest_sessions;
create policy "anon can insert guest sessions"
    on public.guest_sessions
    for insert
    to anon
    with check (true);
