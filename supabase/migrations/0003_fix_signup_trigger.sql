-- 0003_fix_signup_trigger.sql
-- Fixes signup failing with HTTP 500 "Database error saving new user".
--
-- Root-cause class: ANY trigger on auth.users that raises during INSERT rolls
-- back the whole auth.users insert, and GoTrue then reports
-- "Database error saving new user". The two triggers that can do this here are:
--   * the Supabase starter `on_auth_user_created -> public.handle_new_user()`,
--     which assumes the original profiles schema (id, full_name, avatar_url, ...)
--     and breaks once that table is reshaped or carries a NOT NULL column; and
--   * our own `on_auth_user_change` from 0002, if profiles has a leftover
--     NOT NULL column (e.g. the starter `username`) that the mirror never sets.
--
-- The durable fix is to make profile-mirroring NON-BLOCKING: the mirror insert
-- is wrapped so any failure is swallowed and the new auth.users row always
-- commits. We also remove the starter trigger and relax legacy NOT NULL columns.
--
-- Idempotent: safe to paste into the Supabase SQL editor and re-run any time.
-- Run AFTER 0001 and 0002.

create extension if not exists "pgcrypto";

-- 1. Remove the Supabase starter trigger + function if they still exist.
--    These are the most common source of the 500 on a reshaped profiles table.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

-- 2. Ensure profiles exists with the columns the app needs (no-op if 0002 ran).
create table if not exists public.profiles (
    id         uuid primary key references auth.users (id) on delete cascade,
    email      text,
    full_name  text,
    provider   text not null default 'email',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists provider   text not null default 'email';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- 3. Drop NOT NULL on any legacy starter columns the mirror never supplies, so a
--    leftover column can't reject the row. Guarded: only touches columns present.
do $relax$
declare col text;
begin
    foreach col in array array['username', 'avatar_url', 'website', 'bio'] loop
        if exists (
            select 1 from information_schema.columns
            where table_schema = 'public' and table_name = 'profiles' and column_name = col
        ) then
            execute format('alter table public.profiles alter column %I drop not null', col);
        end if;
    end loop;
end;
$relax$;

-- 4. Rebuild the mirror so it can NEVER block authentication: the insert is in an
--    inner block whose exception handler swallows any error (auth.users still
--    commits). Worst case, the profile row is just skipped and logged.
create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql security definer set search_path = public
as $fn$
begin
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
    exception when others then
        -- Mirroring is best-effort; never let it break sign-up / sign-in.
        raise warning 'handle_auth_user_change skipped for %: %', new.id, sqlerrm;
    end;
    return new;
end;
$fn$;

drop trigger if exists on_auth_user_change on auth.users;
create trigger on_auth_user_change
    after insert or update on auth.users
    for each row execute function public.handle_auth_user_change();

-- 5. Backfill anyone who registered while signup was broken or before mirroring.
insert into public.profiles (id, email, full_name, provider)
select id,
       email,
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', ''),
       coalesce(raw_app_meta_data ->> 'provider', 'email')
from auth.users
on conflict (id) do nothing;
