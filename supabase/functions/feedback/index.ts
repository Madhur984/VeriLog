// Supabase Edge Function: `feedback`
// ---------------------------------------------------------------------------
// Backs the site-wide feedback bubble (footer widget). A submission is:
//   1. ALWAYS inserted into public.feedback via the service-role key (durable,
//      never touches RLS, so it can't be blocked/lost by a policy mistake).
//   2. Best-effort synced straight into the team's OneDrive Excel table via
//      Microsoft Graph. If step 2 fails, step 1 already succeeded — nothing
//      is lost, the row just stays excel_synced = false for a manual replay.
//
// The Graph connection is a self-refreshing OAuth token: a one-time login by
// the OneDrive owner (via the sibling `graph-setup` function) stores a
// refresh_token in public.integration_secrets; every call here mints a fresh
// access_token from it and immediately persists whatever refresh_token comes
// back (Microsoft rotates it on use). No third-party automation platform,
// no manual "flow" to maintain.
//
// Required secrets:
//   MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET   from the Azure app registration
//   MS_TABLE_NAME (optional)                      Excel Table name, default 'FeedbackLog'
// Auto-provided by the Supabase platform (no manual secret needed):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// verify_jwt = false. CORS restricted to BitForBytes origins + per-IP rate limit.
// ---------------------------------------------------------------------------

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MS_CLIENT_ID = Deno.env.get('MS_GRAPH_CLIENT_ID') ?? '';
const MS_CLIENT_SECRET = Deno.env.get('MS_GRAPH_CLIENT_SECRET') ?? '';
const MS_TABLE_NAME = Deno.env.get('MS_TABLE_NAME') || 'FeedbackLog';
const MS_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const MS_SCOPES = 'openid offline_access Files.ReadWrite';

// ── public.integration_secrets (service-role only) ──────────────────────────
async function getSecret(key: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/integration_secrets?key=eq.${encodeURIComponent(key)}&select=value`, {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
  if (!res.ok) return null;
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows[0]?.value ? String(rows[0].value) : null;
}
async function setSecret(key: string, value: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/integration_secrets`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
  }).catch(() => {});
}

// Mint a fresh access_token from the stored refresh_token, persisting whatever
// (possibly rotated) refresh_token Microsoft hands back.
async function getAccessToken(): Promise<string> {
  const refreshToken = await getSecret('ms_refresh_token');
  if (!refreshToken) throw new Error('Microsoft account not connected yet — run graph-setup first.');
  const body = new URLSearchParams({
    client_id: MS_CLIENT_ID,
    client_secret: MS_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: MS_SCOPES,
  });
  const res = await fetch(MS_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  if (data.refresh_token) await setSecret('ms_refresh_token', data.refresh_token);
  return data.access_token;
}

async function syncFeedbackRow(values: (string | number)[]): Promise<void> {
  const [accessToken, driveId, itemId] = await Promise.all([getAccessToken(), getSecret('ms_drive_id'), getSecret('ms_item_id')]);
  if (!driveId || !itemId) throw new Error('OneDrive file not resolved yet — run graph-setup first.');
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/workbook/tables/${encodeURIComponent(MS_TABLE_NAME)}/rows/add`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] }),
    },
  );
  if (!res.ok) throw new Error(`add row failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
}

const ALLOWED_ORIGINS = new Set([
  'https://bitforbytes.in',
  'https://www.bitforbytes.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
]);
function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://bitforbytes.in';
  return {
    'Access-Control-Allow-Origin': allow,
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Light per-IP rate limit (best-effort; per-isolate memory). Feedback is a
// low-frequency action, so this is much stricter than the assistant chat.
const RL_MAX = 5;
const RL_WINDOW = 60_000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RL_MAX;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clamp = (s: unknown, max: number) => String(s ?? '').trim().slice(0, max);

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  const CORS = corsHeaders(origin);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('[feedback] missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    return json({ error: 'Feedback storage is not configured yet.' }, 500);
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return json({ error: "You've sent a few of these already — try again in a minute." }, 429);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const message = clamp(body?.message, 4000);
  if (!message) return json({ error: 'Message is required.' }, 400);

  const ratingNum = Number(body?.rating);
  const rating = Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? Math.round(ratingNum) : null;

  const ownerKeyRaw = clamp(body?.ownerKey, 200);
  const ownerKindRaw = clamp(body?.ownerKind, 20);
  const ownerKind = ['user', 'guest'].includes(ownerKindRaw) && (ownerKindRaw !== 'guest' || UUID_RE.test(ownerKeyRaw))
    ? ownerKindRaw
    : 'anonymous';
  const ownerKey = ownerKind === 'anonymous' ? null : ownerKeyRaw;

  const row = {
    owner_key: ownerKey,
    owner_kind: ownerKind,
    display_name: clamp(body?.displayName, 120) || null,
    email: clamp(body?.email, 200) || null,
    rating,
    message,
    page: clamp(body?.page, 300) || null,
    user_agent: clamp(req.headers.get('user-agent'), 300) || null,
  };

  // 1. Durable insert — this is the source of truth.
  let insertedId: string | null = null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[feedback] insert failed ${res.status}: ${detail.slice(0, 300)}`);
      return json({ error: 'Could not save your feedback. Please try again.' }, 502);
    }
    const data = await res.json().catch(() => []);
    insertedId = Array.isArray(data) && data[0]?.id ? String(data[0].id) : null;
  } catch (e) {
    console.error(`[feedback] insert network error: ${String(e).slice(0, 300)}`);
    return json({ error: 'Could not save your feedback. Please try again.' }, 502);
  }

  // 2. Best-effort sync straight into the Excel table via Microsoft Graph.
  // Never fails the request — the row is already durably saved above.
  if (MS_CLIENT_ID && MS_CLIENT_SECRET) {
    try {
      await syncFeedbackRow([
        new Date().toISOString(),
        row.display_name ?? '',
        row.email ?? '',
        row.rating ?? '',
        row.message,
        row.page ?? '',
      ]);
      if (insertedId) {
        await fetch(`${SUPABASE_URL}/rest/v1/feedback?id=eq.${insertedId}`, {
          method: 'PATCH',
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ excel_synced: true }),
        }).catch(() => {});
      }
    } catch (e) {
      console.error(`[feedback] excel sync failed: ${String((e as Error)?.message ?? e).slice(0, 300)}`);
    }
  } else {
    console.warn('[feedback] MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET not set — skipping Excel sync');
  }

  return json({ ok: true });
});
