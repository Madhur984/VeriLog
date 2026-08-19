/**
 * Site-wide screen-time tracker.
 *
 * Engagement used to be started inside ModuleGate, so only course modules were
 * timed — every minute spent in the Verilog judge, the K-Map lab, the workbench
 * or the question-paper library was invisible. This sits above the router and
 * times EVERY route instead, which is why ModuleGate no longer starts a timer:
 * doing it in both places would count module time twice.
 *
 * Renders nothing. All the real work (visible-only accounting, heartbeats,
 * keepalive flush on unload) lives in lib/engagement.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { enterPage, endEngagement } from '../lib/engagement';

export const EngagementTracker: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        enterPage(pathname);
    }, [pathname]);

    // Finalise on teardown so the last slice is banked rather than dropped.
    useEffect(() => () => { endEngagement(); }, []);

    return null;
};

export default EngagementTracker;
