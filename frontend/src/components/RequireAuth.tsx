import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../lib/auth';

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
 *   <Route path="/hero" element={<RequireAuth><HeroExperience /></RequireAuth>} />
 */
export const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }
    return <>{children}</>;
};
