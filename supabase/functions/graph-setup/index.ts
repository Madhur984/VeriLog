// Supabase Edge Function: `graph-setup`
// ---------------------------------------------------------------------------
// ONE-TIME setup endpoint for the direct Microsoft Graph feedback sync (see
// supabase/functions/feedback/index.ts). Visit it ONCE, in a browser, right
// after the OneDrive owner completes the Microsoft login/consent step:
//
//   https://<project>.supabase.co/functions/v1/graph-setup?code=<the code from the redirect URL>
//
// It exchanges that authorization code for the first refresh_token, resolves
// the target OneDrive share link to its driveId + itemId, and stores all
// three in public.integration_secrets (service-role only). From then on,
// `feedback` mints its own access tokens from the stored refresh_token and
// rotates it automatically — this endpoint is never needed again unless the
// connection is revoked and has to be redone.
//
// Required secrets: MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET
// Auto-provided: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// verify_jwt = false (it's only useful to whoever already holds a fresh,
// single-use Microsoft login code for this app's client_id).
// ---------------------------------------------------------------------------

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MS_CLIENT_ID = Deno.env.get('MS_GRAPH_CLIENT_ID') ?? '';
const MS_CLIENT_SECRET = Deno.env.get('MS_GRAPH_CLIENT_SECRET') ?? '';
const MS_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const MS_SCOPES = 'openid offline_access Files.ReadWrite';
const REDIRECT_URI = 'http://localhost';

// The feedback sheet given by the site owner — resolved to a driveId/itemId
// once here so `feedback` never has to touch the fragile share-link path.
const SHARE_URL = 'https://1drv.ms/x/c/6e96b0499bcf40d1/IQCPTRRNQLwDQLDqgIMkO-HnAbyr4fCV3k37N2w1zVVqMO8?e=1auX4g';

const TABLE_NAME = Deno.env.get('MS_TABLE_NAME') || 'FeedbackLog';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Rating', 'Message', 'Page'];

/**
 * Make the workbook ready for `feedback` to append rows to: write the header
 * row into the first worksheet and promote A1:F1 into a Table named
 * TABLE_NAME. Idempotent — if that Table already exists, nothing is touched
 * (so re-running setup can never clobber collected feedback).
 */
async function ensureTable(accessToken: string, driveId: string, itemId: string): Promise<string> {
  const base = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/workbook`;
  const H = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  const fail = async (label: string, r: Response) => {
    throw new Error(`${label}: ${r.status} ${(await r.text().catch(() => '')).slice(0, 300)}`);
  };

  // Already set up? Leave everything alone.
  const listRes = await fetch(`${base}/tables`, { headers: H });
  if (listRes.ok) {
    const existing = (await listRes.json())?.value ?? [];
    if (existing.some((t: { name?: string }) => t?.name === TABLE_NAME)) return `"${TABLE_NAME}" already existed — left as is`;
  }

  // Target the first worksheet, whatever it happens to be called.
  const wsRes = await fetch(`${base}/worksheets`, { headers: H });
  if (!wsRes.ok) return await fail('could not list worksheets', wsRes);
  const sheets = (await wsRes.json())?.value ?? [];
  if (!sheets.length) throw new Error('the workbook has no worksheets');
  const sheet = `${base}/worksheets('${encodeURIComponent(sheets[0].name)}')`;

  const hRes = await fetch(`${sheet}/range(address='A1:F1')`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ values: [HEADERS] }),
  });
  if (!hRes.ok) return await fail('could not write the header row', hRes);

  const addRes = await fetch(`${sheet}/tables/add`, {
    method: 'POST', headers: H, body: JSON.stringify({ address: 'A1:F1', hasHeaders: true }),
  });
  if (!addRes.ok) return await fail('could not create the table', addRes);
  const created = await addRes.json();

  const nameRes = await fetch(`${base}/tables/${created.id}`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ name: TABLE_NAME }),
  });
  if (!nameRes.ok) return await fail('could not name the table', nameRes);

  return `created "${TABLE_NAME}" on sheet "${sheets[0].name}" with headers ${HEADERS.join(' | ')}`;
}

async function setSecret(key: string, value: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/integration_secrets`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`could not store ${key}: ${res.status} ${(await res.text()).slice(0, 300)}`);
}

Deno.serve(async (req: Request) => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ error: 'Supabase env not available.' }, 500);
  if (!MS_CLIENT_ID || !MS_CLIENT_SECRET) {
    return json({ error: 'Set MS_GRAPH_CLIENT_ID and MS_GRAPH_CLIENT_SECRET as function secrets first.' }, 500);
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) return json({ error: 'Missing ?code= — open the Microsoft consent link first, then use the code from the redirect URL.' }, 400);

  try {
    // 1. Exchange the one-time login code for tokens.
    const tokenBody = new URLSearchParams({
      client_id: MS_CLIENT_ID,
      client_secret: MS_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      scope: MS_SCOPES,
    });
    const tokenRes = await fetch(MS_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: tokenBody });
    if (!tokenRes.ok) throw new Error(`token exchange failed: ${tokenRes.status} ${(await tokenRes.text()).slice(0, 500)}`);
    const tokenData = await tokenRes.json();
    if (!tokenData.refresh_token) throw new Error('No refresh_token in response — check the offline_access scope was granted.');
    if (!tokenData.access_token) throw new Error('No access_token in response.');
    await setSecret('ms_refresh_token', tokenData.refresh_token);

    // 2. Resolve the OneDrive share link to a driveId + itemId.
    const b64 = btoa(SHARE_URL).replace(/=+$/, '').replace(/\//g, '_').replace(/\+/g, '-');
    const shareId = `u!${b64}`;
    const shareRes = await fetch(`https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!shareRes.ok) throw new Error(`could not resolve the share link: ${shareRes.status} ${(await shareRes.text()).slice(0, 500)}`);
    const item = await shareRes.json();
    const driveId = item?.parentReference?.driveId;
    const itemId = item?.id;
    if (!driveId || !itemId) throw new Error('Share link resolved but driveId/itemId were missing from the response.');
    await setSecret('ms_drive_id', driveId);
    await setSecret('ms_item_id', itemId);

    // 3. Make the workbook ready to receive rows, so nobody has to set up
    // Excel by hand: write the header row and turn it into a named Table.
    const table = await ensureTable(tokenData.access_token, driveId, itemId);

    return json({
      ok: true,
      message: 'Microsoft account connected — feedback will now sync straight into your Excel sheet.',
      table,
      driveId,
      itemId,
    });
  } catch (e) {
    console.error(`[graph-setup] ${String((e as Error)?.message ?? e)}`);
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
