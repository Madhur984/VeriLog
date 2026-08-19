import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { isAuthenticated, hasRealAccount } from '../lib/auth';

/**
 * Route guard. Redirects to /login if the visitor has no Supabase token
 * and no guest session. Passes the requested URL through `state.from` so
 * post-login redirect can send the user back where they were heading.
 *
 * Usage:
 *   <Route element={<RequireAuth />}>
 *     <Route path="/portal" element={<WorkstationHome />} />
 *     ...
 *   </Route>
 *
 * Or wrap a single element:
 *   <Route path="/portal" element={<RequireAuth><WorkstationHome /></RequireAuth>} />
 */
export const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }
    return <>{children}</>;
};

/**
 * Stricter guard: requires a REAL Supabase account, not just any session.
 *
 * RequireAuth deliberately accepts a guest session, which is right for the
 * course area. It is wrong for the question-paper library, where the whole
 * point of the gate is a registered student — a guest session is one click and
 * anonymous, so it would gate nothing. Matches canOpenModule's
 * `kind === 'supabase'` test, the same bar the paid modules use.
 */
export const RequireAccount: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    if (!hasRealAccount()) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }
    return <>{children}</>;
};
