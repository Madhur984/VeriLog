/**
 * StreakPanel.tsx — 7-day streak calendar with multiplier display
 */

import { useEngagementStore } from '../../stores/engagementStore';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function StreakPanel() {
    const { streak, getStreakMultiplier } = useEngagementStore();
    const multiplier = getStreakMultiplier();

    // Build 7-day visual: last 7 days, marking active ones
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const isActive = streak.current > (6 - i); // Simplified: if streak covers this day
        const isToday = i === 6;
        return { label: DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1], isActive, isToday, dateStr };
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            background: 'rgba(6, 9, 18, 0.8)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🔥</span>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: '#F1F5F9',
                    }}>
                        {streak.current}
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: '#94A3B8',
                        fontFamily: "'IBM Plex Mono', monospace",
                        letterSpacing: '0.06em',
                    }}>
                        day streak
                    </span>
                </div>
                <div style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: multiplier > 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.1)',
                    border: `1px solid ${multiplier > 1 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.15)'}`,
                    fontSize: '10px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 600,
                    color: multiplier > 1 ? '#10B981' : '#64748B',
                }}>
                    {multiplier}× XP
                </div>
            </div>

            {/* 7-day calendar */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {days.map((day, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <span style={{
                            fontSize: '9px',
                            color: '#64748B',
                            fontFamily: "'IBM Plex Mono', monospace",
                        }}>
                            {day.label}
                        </span>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: day.isToday
                                ? '2px solid #00D4FF'
                                : '1px solid rgba(100, 116, 139, 0.2)',
                            background: day.isActive
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'transparent',
                            fontSize: '12px',
                        }}>
                            {day.isActive ? '🔥' : ''}
                        </div>
                    </div>
                ))}
            </div>

            {/* Streak freeze */}
            {streak.freezesRemaining > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    color: '#64748B',
                    fontFamily: "'IBM Plex Mono', monospace",
                }}>
                    <span>❄️</span>
                    <span>{streak.freezesRemaining} streak freeze available</span>
                </div>
            )}
        </div>
    );
}
