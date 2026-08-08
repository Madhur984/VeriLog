/**
 * BadgeUnlockToast.tsx - Animated badge unlock notification
 */

import { useEffect, useState } from 'react';
import type { BadgeNotification } from '../../hooks/useBadgeSystem';

interface Props {
    notification: BadgeNotification | null;
    onDismiss: () => void;
}

export function BadgeUnlockToast({ notification, onDismiss }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [notification]);

    if (!notification) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            onClick={onDismiss}
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
                opacity: visible ? 1 : 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                background: 'rgba(6, 9, 18, 0.96)',
                border: '1px solid rgba(0, 212, 255, 0.4)',
                borderRadius: '8px',
                boxShadow: '0 0 32px rgba(0, 212, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                zIndex: 9999,
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{notification.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{
                    fontSize: '10px',
                    fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#00D4FF',
                }}>
                    Badge Unlocked
                </span>
                <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#F1F5F9',
                }}>
                    {notification.name}
                </span>
                <span style={{
                    fontSize: '11px',
                    color: '#94A3B8',
                }}>
                    {notification.description}
                </span>
            </div>
        </div>
    );
}
