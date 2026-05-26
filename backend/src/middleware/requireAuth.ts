import { NextFunction, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

/**
 * Express middleware that gates routes behind a valid session.
 *
 * Recognizes TWO token shapes (mirrors the frontend's lib/auth.ts):
 *   1. Real Supabase JWT — verified via supabase.auth.getUser(token).
 *   2. Guest pseudo-token — string starting with "guest_". Accepted as-is;
 *      sets req.user = { id: <suffix>, isGuest: true }.
 *
 * On success: attaches req.user and calls next().
 * On failure: 401 with a JSON error.
 *
 * Read the bearer token from:
 *   - Authorization: Bearer <token>
 *   - x-auth-token: <token>     (legacy fallback used by some app code)
 */
export interface AuthedUser {
    id: string;
    email?: string | null;
    isGuest: boolean;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthedUser;
    }
}

function extractToken(req: Request): string | null {
    const auth = req.header('authorization') || req.header('Authorization');
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        return auth.slice(7).trim();
    }
    const xToken = req.header('x-auth-token');
    if (xToken) return xToken.trim();
    return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ error: 'missing_token', detail: 'No bearer token provided.' });
    }

    // Guest pseudo-token — accept without DB lookup. (No real privileges anyway.)
    if (token.startsWith('guest_')) {
        req.user = { id: token.slice(6), isGuest: true };
        return next();
    }

    // Real Supabase JWT — verify with the auth API.
    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            return res.status(401).json({ error: 'invalid_token', detail: error?.message || 'Unknown' });
        }
        req.user = {
            id: data.user.id,
            email: data.user.email ?? null,
            isGuest: false,
        };
        return next();
    } catch (e: any) {
        return res.status(503).json({
            error: 'auth_service_unreachable',
            detail: e?.message || 'Could not verify token with Supabase.',
        });
    }
}

/** Same as requireAuth but never returns 401 — attaches user when possible, otherwise leaves req.user undefined. */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    const token = extractToken(req);
    if (!token) return next();
    if (token.startsWith('guest_')) {
        req.user = { id: token.slice(6), isGuest: true };
        return next();
    }
    try {
        const { data } = await supabase.auth.getUser(token);
        if (data.user) {
            req.user = { id: data.user.id, email: data.user.email ?? null, isGuest: false };
        }
    } catch {
        /* swallow — optional */
    }
    next();
}
