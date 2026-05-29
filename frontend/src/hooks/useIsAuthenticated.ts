import { useEffect, useState } from 'react';
import { isAuthenticated } from '../lib/auth';
import { supabase } from '../lib/supabase';

/**
 * Reactive view of "is there an active session right now?" (real Supabase login
 * OR guest session — see lib/auth.isAuthenticated).
 *
 * The initial value is read synchronously from localStorage, so the first paint
 * is already correct (no sign-in → workstation flicker). It then stays in sync
 * with:
 *   - `storage` events  → login/logout in another tab
 *   - window `focus`    → state changed while this tab was backgrounded
 *   - Supabase auth changes → real sign-in / sign-out / token refresh
 *
 * Used by the landing page to show "Go to Workstation" instead of "Sign in"
 * once the visitor is logged in (persisted across reloads via localStorage;
 * only a cleared/absent session shows sign-in again).
 */
export function useIsAuthenticated(): boolean {
  const [authed, setAuthed] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());
    // Re-check on mount (covers client-side navigations back to this page).
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    const { data } = supabase.auth.onAuthStateChange(() => sync());
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      data.subscription.unsubscribe();
    };
  }, []);

  return authed;
}
