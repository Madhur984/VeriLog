import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { moduleIdFromPath, canOpenModule, recordModuleVisit } from '../lib/auth';

/**
 * Gate for course-module routes.
 *
 *  - A real Supabase login  => unlimited modules.
 *  - A guest / anonymous visitor => the first FREE_MODULE_LIMIT (5) DISTINCT
 *    modules are free. Opening a 6th new module redirects to /login (the
 *    original target is remembered in state.from so the user returns there
 *    after signing in). Re-opening an already-visited module never re-triggers
 *    the gate, and chapter sub-routes (e.g. /dsd/1/cover) count as one module.
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

    // Count the visit only after we've decided to allow it.
    useEffect(() => {
        if (moduleId && allowed) recordModuleVisit(moduleId);
    }, [moduleId, allowed]);

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
