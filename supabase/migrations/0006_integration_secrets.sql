-- 0006_integration_secrets.sql
-- Tiny private key/value store for server-side integration credentials that
-- must be READ AND REWRITTEN at runtime (e.g. a self-rotating Microsoft Graph
-- refresh_token for the feedback -> OneDrive Excel sync). Unlike a Supabase
-- Function *secret* (env var, immutable without a redeploy), a DB row can be
-- updated by the Edge Function itself on every call.
--
-- Run AFTER 0001-0005 (idempotent; re-running is safe).

create table if not exists public.integration_secrets (
    key        text primary key,
    value      text not null,
    updated_at timestamptz not null default now()
);

alter table public.integration_secrets enable row level security;

-- Deliberately NO policies: RLS with zero policies means anon/authenticated
-- get zero access via the public API. Only the service-role key (used
-- exclusively inside Edge Functions, never shipped to the browser) bypasses
-- RLS and can read/write these rows.
