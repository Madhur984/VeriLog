-- 0008_page_engagement.sql
-- Widen engagement tracking from COURSE MODULES ONLY to EVERY page.
--
-- 0004 tracked modules and nothing else, so time spent in the Verilog judge,
-- the K-Map lab, the workbench, the question-paper library or the career
-- roadmap simply vanished. This generalises the SAME table rather than adding a
-- parallel one — there are already ~780 real sessions and ~28 hours of recorded
-- time in it, and two tables measuring the same thing would immediately drift.
--
--   1. module_id becomes NULLABLE (a non-module page has none) and gains
--      `route` (the normalised pattern, e.g. '/dsd/:n') plus `page_kind`
--      (module | tool | library | career | account | marketing | other) so the
--      reports can group without parsing paths.
--   2. record_engagement() gains p_route / p_page_kind, BOTH DEFAULTED. The old
--      7-argument call from a browser still running the previous bundle keeps
--      working — important, because clients update only when they reload.
--   3. Reporting views in seconds AND minutes, per route / per user / per day.
--
-- Run AFTER 0004. Idempotent: re-running is safe.

-- ──────────────────────────────────────────────────────────────────
-- 1. Widen the table
-- ──────────────────────────────────────────────────────────────────
alter table public.module_engagement alter column module_id drop not null;
alter table public.module_engagement add column if not exists route     text;
alter table public.module_engagement add column if not exists page_kind text;

-- Classify a path the same way in SQL as the client does, so backfilled history
-- and new rows land in the same buckets.
create or replace function public.classify_page(p_path text)
returns table (route text, page_kind text)
language sql immutable
as $$
    select
        case
            when p_path ~ '^/module/\d+'           then '/module/:n'
            when p_path ~ '^/dsd/\d+'              then '/dsd/:n'
            when p_path ~ '^/basic-electronics/\d+' then '/basic-electronics/:n'
            else split_part(coalesce(nullif(p_path, ''), '/'), '?', 1)
        end,
        case
            when p_path ~ '^/(module|dsd|basic-electronics)/\d+' then 'module'
            when p_path ~ '^/(verilog-playground|workbench|kmap-lab|logic-studio|fsm|signal-playground|hw-leetcode|ai-lab)' then 'tool'
            when p_path ~ '^/(library|analogies|verilog-library|interview-prep|silicon-map)' then 'library'
            when p_path ~ '^/(career-roadmap|portfolio|skill-tree)'    then 'career'
            when p_path ~ '^/(profile|settings|login)'                 then 'account'
            when p_path ~ '^/(privacy|terms|pledge|community)$' or p_path = '/' then 'marketing'
            else 'other'
        end;
$$;

-- Backfill: every existing row is a module visit by definition.
update public.module_engagement
   set route     = coalesce(route, (select c.route from public.classify_page(last_path) c)),
       page_kind = coalesce(page_kind, 'module')
 where route is null or page_kind is null;

create index if not exists module_engagement_route_idx on public.module_engagement (route);
create index if not exists module_engagement_kind_idx  on public.module_engagement (page_kind);

-- ──────────────────────────────────────────────────────────────────
-- 2. RPC — same name, two extra DEFAULTED params
-- ──────────────────────────────────────────────────────────────────
-- Dropped and recreated rather than overloaded: two functions of the same name
-- whose argument lists differ only by defaulted params make every PostgREST
-- call ambiguous, which would break tracking outright.
drop function if exists public.record_engagement(uuid, text, text, text, text, text, integer);

create or replace function public.record_engagement(
    p_session_id     uuid,
    p_owner_key      text,
    p_owner_kind     text,
    p_display_name   text,
    p_module_id      text,
    p_last_path      text,
    p_active_seconds integer,
    p_route          text default null,
    p_page_kind      text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_route text;
    v_kind  text;
begin
    if p_owner_key is null or p_owner_key = '' then return; end if;
    if p_owner_kind not in ('user', 'guest') then return; end if;
    -- A wild value would silently poison every report; clamp instead.
    if p_active_seconds is null or p_active_seconds < 0 or p_active_seconds > 86400 then return; end if;

    select c.route, c.page_kind into v_route, v_kind
      from public.classify_page(coalesce(p_last_path, '/')) c;
    v_route := coalesce(p_route, v_route);
    v_kind  := coalesce(p_page_kind, v_kind);

    insert into public.module_engagement as m (
        id, owner_key, owner_kind, display_name, module_id, last_path,
        route, page_kind, active_seconds, started_at, ended_at, updated_at
    )
    values (
        p_session_id, p_owner_key, p_owner_kind, p_display_name,
        nullif(p_module_id, ''), coalesce(p_last_path, '/'),
        v_route, v_kind, p_active_seconds, now(), now(), now()
    )
    on conflict (id) do update
        set -- MAX, never assignment: heartbeats can arrive late or duplicated,
            -- and a total must never rewind.
            active_seconds = greatest(m.active_seconds, excluded.active_seconds),
            last_path      = excluded.last_path,
            route          = excluded.route,
            page_kind      = excluded.page_kind,
            display_name   = coalesce(excluded.display_name, m.display_name),
            ended_at       = now(),
            updated_at     = now();
end;
$$;

revoke all on function public.record_engagement(uuid, text, text, text, text, text, integer, text, text) from public;
grant execute on function public.record_engagement(uuid, text, text, text, text, text, integer, text, text) to anon, authenticated;

-- ──────────────────────────────────────────────────────────────────
-- 3. Reporting views — seconds and minutes, since "how long" is the question
-- ──────────────────────────────────────────────────────────────────
create or replace view public.engagement_by_route as
select
    coalesce(route, last_path)                     as route,
    coalesce(page_kind, 'other')                   as page_kind,
    count(*)                                       as sessions,
    count(distinct owner_key)                      as people,
    sum(active_seconds)                            as total_seconds,
    round(sum(active_seconds) / 60.0, 1)           as total_minutes,
    round(avg(active_seconds))                     as avg_seconds_per_session,
    round(avg(active_seconds) / 60.0, 1)           as avg_minutes_per_session,
    max(ended_at)                                  as last_seen
from public.module_engagement
group by 1, 2;

create or replace view public.engagement_by_user as
select
    owner_key,
    owner_kind,
    max(display_name)                              as display_name,
    count(*)                                       as sessions,
    count(distinct coalesce(route, last_path))     as pages_visited,
    sum(active_seconds)                            as total_seconds,
    round(sum(active_seconds) / 60.0, 1)           as total_minutes,
    min(started_at)                                as first_seen,
    max(ended_at)                                  as last_seen
from public.module_engagement
group by owner_key, owner_kind;

create or replace view public.engagement_daily as
select
    date_trunc('day', started_at)::date            as day,
    coalesce(page_kind, 'other')                   as page_kind,
    count(distinct owner_key)                      as people,
    count(*)                                       as sessions,
    sum(active_seconds)                            as total_seconds,
    round(sum(active_seconds) / 60.0, 1)           as total_minutes
from public.module_engagement
group by 1, 2;

-- Views are for the owner via the service-role key / SQL editor, exactly like
-- 0004's. Nothing here is exposed to the browser.
revoke all on public.engagement_by_route from anon, authenticated;
revoke all on public.engagement_by_user  from anon, authenticated;
revoke all on public.engagement_daily    from anon, authenticated;
