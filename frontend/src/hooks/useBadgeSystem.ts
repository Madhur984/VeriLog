/**
 * useBadgeSystem.ts - Auto-award badges based on engagement state
 *
 * Listens to engagementStore and user actions to automatically
 * unlock badges when conditions are met.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useGamificationStore, type BadgeId, BADGE_CATALOG } from '../stores/gamificationStore';

export interface BadgeNotification {
    id: BadgeId;
    name: string;
    description: string;
    icon: string;
}

export function useBadgeSystem() {
    const store = useGamificationStore();
    const { streak, badges, unlockBadge, hasBadge } = store;
    const totalXP = store.xp.total;
    const [notification, setNotification] = useState<BadgeNotification | null>(null);
    const notifTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const showBadgeNotification = useCallback((badgeId: BadgeId) => {
        const def = BADGE_CATALOG.find((b) => b.id === badgeId);
        if (!def) return;

        if (notifTimerRef.current) clearTimeout(notifTimerRef.current);

        setNotification({ id: def.id, name: def.name, description: def.description, icon: def.icon });
        notifTimerRef.current = setTimeout(() => setNotification(null), 4000);
    }, []);

    const tryUnlock = useCallback(
        (badgeId: BadgeId) => {
            if (!hasBadge(badgeId)) {
                unlockBadge(badgeId);
                showBadgeNotification(badgeId);
            }
        },
        [hasBadge, unlockBadge, showBadgeNotification]
    );

    // Auto-check streak badges
    useEffect(() => {
        if (streak.current >= 7) tryUnlock('STREAK_7');
        if (streak.current >= 30) tryUnlock('STREAK_30');
    }, [streak.current, tryUnlock]);

    // Manual triggers for action-based badges
    const onCircuitComplete = useCallback(() => tryUnlock('FIRST_CIRCUIT'), [tryUnlock]);
    const onAllGatesUsed = useCallback(() => tryUnlock('LOGIC_MASTER'), [tryUnlock]);
    const onDebugComplete = useCallback(() => tryUnlock('DEBUGGER'), [tryUnlock]);
    const onSpeedComplete = useCallback(() => tryUnlock('SPEED_DEMON'), [tryUnlock]);
    const onTruthTableView = useCallback(() => tryUnlock('FULL_TRUTH_TABLE'), [tryUnlock]);
    const onMemoryBuilt = useCallback(() => tryUnlock('MEMORY_ARCHITECT'), [tryUnlock]);

    const dismissNotification = useCallback(() => {
        if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
        setNotification(null);
    }, []);

    return {
        badges,
        totalXP,
        notification,
        dismissNotification,
        onCircuitComplete,
        onAllGatesUsed,
        onDebugComplete,
        onSpeedComplete,
        onTruthTableView,
        onMemoryBuilt,
    };
}
