/**
 * Session sync — bridges the Supabase auth session into the localStorage key
 * (`supabase_token`) that the app's gate/guard layer (lib/auth.ts) reads.
 *
 * Why this exists: OAuth login, email-verification, and password-recovery all
 * redirect the browser back into the app with a fresh Supabase session in the
 * URL. supabase-js (detectSessionInUrl = true) parses and persists that session
 * in ITS OWN storage, but nothing copied the token into `supabase_token`, so the
 * gate kept treating those users as anonymous. This listener fixes that for every
 * sign-in path in one place.
 */

import { supabase } from './supabase';

const SUPABASE_TOKEN_KEY = 'supabase_token';

function writeToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(SUPABASE_TOKEN_KEY, token);
    else localStorage.removeItem(SUPABASE_TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode / SSR) — ignore */
  }
}

let started = false;

/** Idempotently start mirroring the Supabase session into localStorage. */
export function initSessionSync(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  // Mirror any session Supabase already restored/parsed (e.g. from an OAuth or
  // verification redirect) on first load.
  void supabase.auth.getSession().then(({ data }) => {
    if (data.session?.access_token) writeToken(data.session.access_token);
  });

  // Keep it in sync for every future auth event in this tab.
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      writeToken(null);
      return;
    }
    // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, INITIAL_SESSION
    if (session?.access_token) writeToken(session.access_token);
  });
}
