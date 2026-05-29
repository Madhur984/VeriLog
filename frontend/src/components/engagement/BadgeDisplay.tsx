/**
 * BadgeDisplay.tsx - Grid view of all badges
 */

import { BADGE_CATALOG, useGamificationStore } from '../../stores/gamificationStore';

export function BadgeDisplay() {
    const { badges } = useGamificationStore();
    const unlockedIds = new Set(badges.map((b) => b.id));

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
            padding: '16px',
        }}>
            {BADGE_CATALOG.map((badge) => {
                const unlocked = unlockedIds.has(badge.id);
                const unlockedBadge = badges.find((b) => b.id === badge.id);

                return (
                    <div
                        key={badge.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 12px',
                            borderRadius: '8px',
                            border: `1px solid ${unlocked ? 'rgba(0, 212, 255, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`,
                            background: unlocked
                                ? 'rgba(0, 212, 255, 0.05)'
                                : 'rgba(15, 23, 42, 0.6)',
                            opacity: unlocked ? 1 : 0.5,
                            filter: unlocked ? 'none' : 'grayscale(1)',
                            transition: 'all 300ms ease',
                            cursor: 'pointer',
                        }}
                        title={unlocked
                            ? `Unlocked: ${new Date(unlockedBadge!.unlockedAt).toLocaleDateString()}`
                            : badge.description}
                    >
                        <span style={{ fontSize: '32px', lineHeight: 1 }}>{badge.icon}</span>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: "'IBM Plex Mono', monospace",
                            letterSpacing: '0.06em',
                            color: unlocked ? '#00D4FF' : '#64748B',
                            textAlign: 'center',
                        }}>
                            {badge.name}
                        </span>
                        <span style={{
                            fontSize: '9px',
                            color: '#94A3B8',
                            textAlign: 'center',
                            lineHeight: 1.3,
                        }}>
                            {badge.description}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
