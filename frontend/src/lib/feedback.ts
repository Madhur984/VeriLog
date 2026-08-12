// Client for the `feedback` Edge Function, which durably stores every
// submission in Supabase and best-effort forwards it to the team's OneDrive
// Excel sheet. See supabase/functions/feedback/index.ts.
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabase } from './supabase';

const FN_URL = `${SUPABASE_URL}/functions/v1/feedback`;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface FeedbackInput {
  message: string;
  rating?: number | null;
  displayName?: string;
  email?: string;
  page: string;
}

/** Best-effort owner identity, mirroring lib/moduleHistory's syncModuleOpen. */
async function ownerIdentity(): Promise<{ ownerKey: string | null; ownerKind: 'user' | 'guest' | null; fallbackName: string }> {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) {
      const name = (user.user_metadata?.full_name as string) || user.email || '';
      return { ownerKey: user.id, ownerKind: 'user', fallbackName: name };
    }
  } catch {
    /* fall through to guest/anonymous */
  }
  const gid = localStorage.getItem('guest_id');
  if (localStorage.getItem('guest_session') === 'true' && gid && UUID_RE.test(gid)) {
    return { ownerKey: gid, ownerKind: 'guest', fallbackName: localStorage.getItem('guest_name') || '' };
  }
  return { ownerKey: null, ownerKind: null, fallbackName: '' };
}

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  const identity = await ownerIdentity();

  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({
      message: input.message,
      rating: input.rating ?? null,
      displayName: input.displayName || identity.fallbackName,
      email: input.email || '',
      page: input.page,
      ownerKey: identity.ownerKey,
      ownerKind: identity.ownerKind ?? 'anonymous',
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Could not send feedback (${res.status})`);
  }
}
