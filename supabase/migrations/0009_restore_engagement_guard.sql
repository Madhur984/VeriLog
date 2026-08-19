-- 0009_restore_engagement_guard.sql
-- Closes a write-forgery path opened by 0008, plus the three grant/definer
-- issues the Supabase advisors flag alongside it.
--
-- WHAT WENT WRONG. 0004 created record_engagement with two guards: a signed-in
-- row could only be written by that very user, and a guest key had to be
-- UUID-shaped. 0008 had to change the signature (adding p_route/p_page_kind), and
-- rewrote the body from scratch to do it — carrying over the active_seconds clamp
-- but dropping both guards. record_module_open, which was not touched by 0008,
-- still has its guard, which is what makes the omission obvious in hindsight.
--
-- WHY IT MATTERS. record_engagement is SECURITY DEFINER and executable by anon by
-- design, because guests are tracked too. Without the owner check, any caller
-- holding the publishable anon key (it ships in the browser bundle, as intended)
-- can insert or extend engagement rows attributed to ANY owner_key. Real user
-- UUIDs were obtainable from public.user_total_xp, which is defined SECURITY
-- DEFINER and therefore ignores the RLS on user_xp_events — so the two defects
-- chain into "forge arbitrary engagement against a named account". Engagement is
-- the only first-party product telemetry BitForBytes has; poisoning it is a
-- data-integrity problem, not just a privacy one.
--
-- Idempotent; safe to re-run.

-- ──────────────────────────────────────────────────────────────────
-- 1. record_engagement: restore both guards from 0004
-- ──────────────────────────────────────────────────────────────────
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
) returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
    v_route text;
    v_kind  text;
begin
    if p_owner_key is null or p_owner_key = '' then return; end if;
    if p_owner_kind not in ('user', 'guest') then return; end if;

    -- RESTORED (was in 0004, lost in 0008): a signed-in row may only be written
    -- by that very user. Without this, anon can attribute engagement to anyone.
    if p_owner_kind = 'user'
       and (auth.uid() is null or auth.uid()::text <> p_owner_key) then
        raise exception 'cannot write engagement for another user';
    end if;

    -- RESTORED (was in 0004, lost in 0008): guest keys must be UUID-shaped, so a
    -- caller cannot invent readable identifiers or collide with a user id.
    if p_owner_kind = 'guest'
       and p_owner_key !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        raise exception 'guest owner_key must be a uuid';
    end if;

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

-- ──────────────────────────────────────────────────────────────────
-- 2. user_total_xp: stop bypassing RLS (the only ERROR-level advisor)
-- ──────────────────────────────────────────────────────────────────
-- A view runs with its owner's rights unless told otherwise, so this one ignored
-- the "own xp events" policy on user_xp_events and handed every caller a full
-- table of (user_id, total_xp) — leaking real auth UUIDs. security_invoker makes
-- it run as the caller, so the existing policy applies and a user sees only
-- their own row.
alter view public.user_total_xp set (security_invoker = on);

-- ──────────────────────────────────────────────────────────────────
-- 3. Take back EXECUTE on definer functions that were never meant to be public
-- ──────────────────────────────────────────────────────────────────
-- match_kb is the knowledge-base vector search. The assistant Edge Function calls
-- it with the service-role key, so nothing legitimate loses access — but while
-- anon holds EXECUTE, anyone with the public anon key can page through the whole
-- kb_chunks corpus a few passages per call.
-- Revoke from PUBLIC, not just anon/authenticated: both roles INHERIT execute
-- from PUBLIC, so revoking only the named roles leaves the default grant in
-- place and changes nothing (the ACL still reads "=X/postgres").
revoke all on function public.match_kb(public.vector, integer, double precision) from public, anon, authenticated;

-- handle_auth_user_change is an auth TRIGGER function. Triggers fire it
-- internally; a PostgREST grant only lets callers invoke it out of context, with
-- definer privileges and attacker-chosen timing.
revoke all on function public.handle_auth_user_change() from public, anon, authenticated;

-- ──────────────────────────────────────────────────────────────────
-- 4. Pin classify_page's search_path
-- ──────────────────────────────────────────────────────────────────
-- Without this a definer function can be steered to resolve objects out of a
-- schema the caller controls.
alter function public.classify_page(text) set search_path = public, pg_temp;
