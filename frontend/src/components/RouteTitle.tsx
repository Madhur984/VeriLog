import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitle } from '../lib/routeMeta';

/**
 * Sets document.title from the current route (via routeMeta) so the browser tab
 * and history always name where you are. Renders nothing.
 */
export const RouteTitle = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        document.title = pageTitle(pathname);
    }, [pathname]);
    return null;
};
