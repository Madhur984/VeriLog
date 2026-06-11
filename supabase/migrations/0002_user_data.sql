-- 0002_user_data.sql
-- Server-side capture of every user-linked datum the site produces:
--   1. public.profiles        - queryable mirror of auth.users (email, name,
--                               auth provider, timestamps). Auto-maintained by
--                               a trigger, so Google / LinkedIn / GitHub OAuth
--                               sign-ups appear here with no frontend work.
--   2. public.module_history  - which module each user/guest opened, how many
--                               times, when first/last, and the exact page they
--                               left off on. Written via the RPC below.
--   3. record_module_open()   - SECURITY DEFINER upsert that also increments
--                               the open counter atomically.
--
-- Run AFTER 0001_guest_sessions.sql (both are idempotent; re-running is safe).

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────
-- 1. profiles: one row per registered account
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
    id         uuid primary key references auth.users (id) on delete cascade,
    email      text,
    full_name  text,
    provider   text not null default 'email',   -- email | google | github | linkedin_oidc
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- The project may already have the Supabase starter `profiles` table
-- (id, username, full_name, avatar_url, website, updated_at). The CREATE above
-- is then a no-op, so add whichever of our columns are missing.
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists provider   text not null default 'email';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;

-- Reset ALL policies on profiles: the starter table ships with a
-- "viewable by everyone" SELECT policy, which must not survive now that the
-- table carries emails. Only the owner may read or update their row.
do $pol$
declare pol record;
begin
    for pol in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'profiles'
    loop
        execute format('drop policy if exists %I on public.profiles', pol.policyname);
    end loop;
end;
$pol$;

create policy "own profile select" on public.profiles
    for select to authenticated using (id = auth.uid());

create policy "own profile update" on public.profiles
    for update to authenticated
    using (id = auth.uid()) with check (id = auth.uid());

-- Mirror auth.users into profiles on signup AND on later changes
-- (email change in Settings, OAuth metadata refresh, email verification).
create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
    insert into public.profiles (id, email, full_name, provider)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'full_name',
                 new.raw_user_meta_data ->> 'name',
                 ''),
        coalesce(new.raw_app_meta_data ->> 'provider', 'email')
    )
    on conflict (id) do update
        set email      = excluded.email,
            full_name  = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
            provider   = excluded.provider,
            updated_at = now();
    return new;
end;
$fn$;

drop trigger if exists on_auth_user_change on auth.users;
create trigger on_auth_user_change
    after insert or update on auth.users
    for each row execute function public.handle_auth_user_change();

-- Backfill accounts that registered before this migration.
insert into public.profiles (id, email, full_name, provider)
select id,
       email,
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', ''),
       coalesce(raw_app_meta_data ->> 'provider', 'email')
from auth.users
on conflict (id) do nothing;

-- ──────────────────────────────────────────────────────────────────
-- 2. module_history: per user/guest, per module
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.module_history (
    owner_key       text not null,   -- auth.users.id (uuid) for logins, guest_id for guests
    owner_kind      text not null check (owner_kind in ('user', 'guest')),
    display_name    text,            -- guest name / profile name snapshot for easy reading
    module_id       text not null,   -- e.g. 'dsd/6', 'module/1'
    last_path       text not null,   -- exact page, e.g. '/dsd/6/practice'
    opened_count    integer     not null default 1,
    first_opened_at timestamptz not null default now(),
    last_opened_at  timestamptz not null default now(),
    primary key (owner_key, module_id)
);

create index if not exists module_history_last_opened_idx
    on public.module_history (last_opened_at desc);

alter table public.module_history enable row level security;

-- Logged-in users may read their own history (future profile-page use).
-- All writes go through the RPC below; no direct INSERT/UPDATE policies.
drop policy if exists "own history select" on public.module_history;
create policy "own history select" on public.module_history
    for select to authenticated
    using (owner_kind = 'user' and owner_key = auth.uid()::text);

-- ──────────────────────────────────────────────────────────────────
-- 3. record_module_open: atomic upsert + counter increment
-- ──────────────────────────────────────────────────────────────────
create or replace function public.record_module_open(
    p_owner_key    text,
    p_owner_kind   text,
    p_display_name text,
    p_module_id    text,
    p_last_path    text
)
returns void
language plpgsql security definer set search_path = public
as $fn$
begin
    if p_owner_kind not in ('user', 'guest') then
        raise exception 'invalid owner_kind';
    end if;
    -- A signed-in row may only be written by that very user.
    if p_owner_kind = 'user'
       and (auth.uid() is null or auth.uid()::text <> p_owner_key) then
        raise exception 'cannot write history for another user';
    end if;
    -- Guest rows must carry a UUID-shaped key (matches guest_sessions.id).
    if p_owner_kind = 'guest'
       and p_owner_key !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        raise exception 'guest owner_key must be a uuid';
    end if;

    insert into public.module_history
        (owner_key, owner_kind, display_name, module_id, last_path)
    values
        (p_owner_key, p_owner_kind, nullif(p_display_name, ''), p_module_id, p_last_path)
    on conflict (owner_key, module_id) do update
        set last_path      = excluded.last_path,
            display_name   = coalesce(excluded.display_name, module_history.display_name),
            opened_count   = module_history.opened_count + 1,
            last_opened_at = now();
end;
$fn$;

grant execute on function public.record_module_open(text, text, text, text, text)
    to anon, authenticated;
