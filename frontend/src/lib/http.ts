/**
 * Shared axios instance with an auth interceptor.
 *
 * Every request automatically gets `Authorization: Bearer <token>` from the
 * active session (Supabase JWT or guest pseudo-token). 401 responses surface
 * to the caller - the route guard handles redirect-to-login.
 *
 * Existing code that does `import axios from 'axios'` keeps working because
 * we also install a global default header at module load. Prefer importing
 * `http` from this file for new code so the wiring is explicit.
 */

import axios, { AxiosInstance } from 'axios';

import { getSession } from './auth';

function applyAuthHeader(config: any) {
    const { token } = getSession();
    if (token) {
        config.headers = config.headers || {};
        // Don't overwrite if a caller has set their own.
        if (!config.headers.Authorization && !config.headers.authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}

export const http: AxiosInstance = axios.create();
http.interceptors.request.use(applyAuthHeader);

// Also patch the default axios so legacy call sites (e.g. `axios.get('/api/...')`)
// authenticate correctly without needing to be rewritten.
axios.interceptors.request.use(applyAuthHeader);

export default http;
