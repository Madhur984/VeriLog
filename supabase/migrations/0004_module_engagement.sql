-- 0004_module_engagement.sql
-- Per-module SCREEN TIME / engagement tracking.
--
--   1. public.module_engagement   - one row per engagement SESSION (a single
--                                    continuous visit to ONE module in ONE
--                                    browser tab). Holds the active (tab-visible)
--                                    seconds spent, plus when it started / last
--                                    updated. Every visit is its own row, so no
--                                    engagement is ever overwritten or lost.
--   2. record_engagement()        - SECURITY DEFINER upsert keyed on the client
--                                    session id. The client sends the CUMULATIVE
--                                    active-seconds for the session and the RPC
--                                    keeps the MAX, so a duplicated or late
--                                    heartbeat can neither inflate nor rewind a
--                                    total (idempotent + monotonic).
--   3. read views                 - module_engagement_by_module (time per person
--                                    per module) and module_engagement_by_user
--                                    (time per person across the whole app).
--
-- Identity + RLS model mirrors 0002_user_data.sql. Run AFTER 0001/0002.
-- Idempotent: re-running is safe.

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────
-- 1. module_engagement: one row per visit-to-a-module session
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.module_engagement (
    id             uuid        primary key,                       -- client-generated session id
    owner_key      text        not null,                          -- auth.users.id (uuid) for logins, guest/device id for the rest
    owner_kind     text        not null check (owner_kind in ('user', 'guest')),
    display_name   text,                                          -- guest / profile name snapshot for easy reading
    module_id      text        not null,                          -- e.g. 'dsd/6', 'module/1'
    last_path      text        not null,                          -- exact page, e.g. '/dsd/6/practice'
    active_seconds integer     not null default 0 check (active_seconds >= 0),
    started_at     timestamptz not null default now(),
    ended_at       timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

create index if not exists module_engagement_owner_idx   on public.module_engagement (owner_key);
create index if not exists module_engagement_module_idx  on public.module_engagement (module_id);
create index if not exists module_engagement_started_idx on public.module_engagement (started_at desc);

alter table public.module_engagement enable row level security;

-- Logged-in users may read their OWN engagement rows (e.g. a future profile page).
-- All writes go through the RPC below (no direct INSERT/UPDATE policies); the
-- site owner reads everyone's data via the dashboard / service-role key.
drop policy if exists "own engagement select" on public.module_engagement;
create policy "own engagement select" on public.module_engagement
    for select to authenticated
    using (owner_kind = 'user' and owner_key = auth.uid()::text);

-- ──────────────────────────────────────────────────────────────────
-- 2. record_engagement: create-or-extend one session row (monotonic)
-- ──────────────────────────────────────────────────────────────────
create or replace function public.record_engagement(
    p_session_id     uuid,
    p_owner_key      text,
    p_owner_kind     text,
    p_display_name   text,
    p_module_id      text,
    p_last_path      text,
    p_active_seconds integer
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
        raise exception 'cannot write engagement for another user';
    end if;
    -- Guest / anonymous rows must carry a UUID-shaped key.
    if p_owner_kind = 'guest'
       and p_owner_key !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        raise exception 'guest owner_key must be a uuid';
    end if;
    -- Clamp to a sane range so a bad client can't poison the data
    -- (0 .. 86400 s = 24 h for a single session).
    if p_active_seconds is null or p_active_seconds < 0 then
        p_active_seconds := 0;
    elsif p_active_seconds > 86400 then
        p_active_seconds := 86400;
    end if;

    insert into public.module_engagement
        (id, owner_key, owner_kind, display_name, module_id, last_path, active_seconds)
    values
        (p_session_id, p_owner_key, p_owner_kind, nullif(p_display_name, ''), p_module_id, p_last_path, p_active_seconds)
    on conflict (id) do update
        set active_seconds = greatest(module_engagement.active_seconds, excluded.active_seconds),
            last_path      = excluded.last_path,
            display_name   = coalesce(excluded.display_name, module_engagement.display_name),
            ended_at       = now(),
            updated_at     = now()
        -- Never let one identity overwrite a session row belonging to another.
        where module_engagement.owner_key  = excluded.owner_key
          and module_engagement.owner_kind = excluded.owner_kind;
end;
$fn$;

grant execute on function
    public.record_engagement(uuid, text, text, text, text, text, integer)
    to anon, authenticated;

-- ──────────────────────────────────────────────────────────────────
-- 3. read views  (query in the Dashboard / with the service-role key)
--    Revoked from anon + authenticated so aggregate data isn't exposed
--    through the public API — they are for the site owner only.
-- ──────────────────────────────────────────────────────────────────

-- Total screen-time per person, per module.
create or replace view public.module_engagement_by_module as
select owner_key,
       owner_kind,
       max(display_name)                  as display_name,
       module_id,
       sum(active_seconds)                as total_seconds,
       round(sum(active_seconds) / 60.0, 1) as total_minutes,
       count(*)                           as sessions,
       min(started_at)                    as first_seen,
       max(ended_at)                      as last_seen
from public.module_engagement
group by owner_key, owner_kind, module_id;

-- Total screen-time per person across the whole app.
create or replace view public.module_engagement_by_user as
select owner_key,
       owner_kind,
       max(display_name)                  as display_name,
       sum(active_seconds)                as total_seconds,
       round(sum(active_seconds) / 60.0, 1) as total_minutes,
       count(distinct module_id)          as modules_touched,
       count(*)                           as sessions,
       min(started_at)                    as first_seen,
       max(ended_at)                      as last_seen
from public.module_engagement
group by owner_key, owner_kind;

revoke all on public.module_engagement_by_module from anon, authenticated;
revoke all on public.module_engagement_by_user   from anon, authenticated;
