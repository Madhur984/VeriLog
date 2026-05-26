/**
 * Tiny client-side auth helper.
 *
 * Recognizes TWO kinds of session:
 *  1. Real Supabase session — `supabase_token` in localStorage (set by LoginPage).
 *  2. Guest session — `guest_session === 'true'` in localStorage (set by the
 *     guest-login button). Useful when Supabase is offline / for quick demos.
 *
 * Both are persisted client-side. There is no server-side guest registry.
 */

const SUPABASE_TOKEN_KEY = 'supabase_token';
const GUEST_FLAG_KEY = 'guest_session';
const GUEST_NAME_KEY = 'guest_name';
const GUEST_ID_KEY = 'guest_id';

export type SessionKind = 'supabase' | 'guest' | 'none';

export interface SessionInfo {
    kind: SessionKind;
    token: string | null;     // bearer token for backend calls; guests get a "guest_<id>" pseudo-token
    displayName: string | null;
    isGuest: boolean;
}

function safeStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function getSession(): SessionInfo {
    const ls = safeStorage();
    if (!ls) return { kind: 'none', token: null, displayName: null, isGuest: false };

    const token = ls.getItem(SUPABASE_TOKEN_KEY);
    if (token) {
        return { kind: 'supabase', token, displayName: null, isGuest: false };
    }
    if (ls.getItem(GUEST_FLAG_KEY) === 'true') {
        const id = ls.getItem(GUEST_ID_KEY) ?? 'unknown';
        return {
            kind: 'guest',
            token: `guest_${id}`,
            displayName: ls.getItem(GUEST_NAME_KEY) || 'Guest',
            isGuest: true,
        };
    }
    return { kind: 'none', token: null, displayName: null, isGuest: false };
}

export function isAuthenticated(): boolean {
    return getSession().kind !== 'none';
}

export function startGuestSession(name: string = 'Guest'): SessionInfo {
    const ls = safeStorage();
    if (!ls) throw new Error('localStorage unavailable');
    // Clear any stale real-auth token so the guest mode is unambiguous.
    ls.removeItem(SUPABASE_TOKEN_KEY);
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 12);
    ls.setItem(GUEST_FLAG_KEY, 'true');
    ls.setItem(GUEST_ID_KEY, id);
    ls.setItem(GUEST_NAME_KEY, name);
    return getSession();
}

export function clearSession(): void {
    const ls = safeStorage();
    if (!ls) return;
    ls.removeItem(SUPABASE_TOKEN_KEY);
    ls.removeItem(GUEST_FLAG_KEY);
    ls.removeItem(GUEST_ID_KEY);
    ls.removeItem(GUEST_NAME_KEY);
}
