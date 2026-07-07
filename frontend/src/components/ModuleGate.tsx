import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { moduleIdFromPath, canOpenModule, recordModuleVisit } from '../lib/auth';
import { recordModuleHistory } from '../lib/moduleHistory';
import { enterModule, leaveModule } from '../lib/engagement';

/**
 * Gate for course-module routes.
 *
 *  - A real Supabase login  => unlimited modules.
 *  - A guest / anonymous visitor => only the five free foundation modules
 *    (FREE_MODULE_IDS: module/1..5). Opening any other module redirects to
 *    /login (the original target is remembered in state.from so the user
 *    returns there after signing in). Chapter sub-routes (e.g. /dsd/1/cover)
 *    count as one module.
 *
 * Mirrors RequireAuth's redirect pattern, but keyed on the module-visit count
 * rather than mere presence of a session.
 */
export const ModuleGate: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const moduleId = moduleIdFromPath(location.pathname);

    // Decide once per module so the render stays pure (no side effects here).
    const allowed = useMemo(
        () => (moduleId ? canOpenModule(moduleId) : true),
        [moduleId],
    );

    // Count the visit only after we've decided to allow it, and record the
    // exact page so the profile can offer "continue where you left off".
    // enterModule also drives per-module screen-time tracking: it keeps one
    // timing session across sub-pages of the same module and starts a fresh one
    // when the module changes (see lib/engagement).
    useEffect(() => {
        if (moduleId && allowed) {
            recordModuleVisit(moduleId);
            recordModuleHistory(location.pathname);
            enterModule(moduleId, location.pathname);
        } else {
            leaveModule();
        }
    }, [moduleId, allowed, location.pathname]);

    // Leaving the whole module area (this gate unmounts) finalises the timer.
    useEffect(() => () => { leaveModule(); }, []);

    if (moduleId && !allowed) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search, reason: 'module_limit' }}
            />
        );
    }

    return <>{children}</>;
};
