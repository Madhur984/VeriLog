/**
 * XPCounter.tsx - Signal Integrity Index
 *
 * Monochrome by default. Three category breakdown inline on hover.
 * RAF counter animation via direct textContent write (no React state).
 * Subtle opacity flash on XP award.
 */

import { useRef, useEffect, memo } from 'react';
import type { XPState } from '../../hooks/useEngagementAdapter';
import './level1.css';

interface XPCounterProps {
    total: number;
    registerEl: (el: HTMLElement | null) => void;
    breakdown: XPState;
}

export const XPCounter = memo(({ total, registerEl, breakdown }: XPCounterProps) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        registerEl(spanRef.current);
        return () => registerEl(null);
    }, [registerEl]);

    // Update display when total changes from external source (initial load)
    useEffect(() => {
        if (spanRef.current && spanRef.current.dataset.animating !== 'true') {
            spanRef.current.textContent = String(total).padStart(3, '0');
        }
    }, [total]);

    return (
        <div
            title={`SXP: ${breakdown.structural} | DXP: ${breakdown.diagnostic} | AXP: ${breakdown.application}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '3px 10px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 2,
                background: 'rgba(255,255,255,0.02)',
                cursor: 'default',
                userSelect: 'none',
                position: 'relative',
            }}
        >
            {/* Label */}
            <span style={{
                fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                fontSize: 7,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
            }}>SII</span>

            {/* Animated counter */}
            <span
                ref={spanRef}
                style={{
                    fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.7)',
                    minWidth: '2ch',
                    display: 'inline-block',
                }}
            >
                {String(total).padStart(3, '0')}
            </span>

            {/* Category micro-badges */}
            <div style={{ display: 'flex', gap: 4 }}>
                {([
                    { label: 'S', val: breakdown.structural, key: 'structural' },
                    { label: 'D', val: breakdown.diagnostic, key: 'diagnostic' },
                    { label: 'A', val: breakdown.application, key: 'application' },
                ] as const).map(({ label, val, key }) => (
                    <span key={key} style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 7,
                        color: val > 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)',
                        letterSpacing: '0.05em',
                        transition: 'color 0.3s',
                    }}>
                        {label}{val > 0 ? String(val).padStart(2, '0') : '──'}
                    </span>
                ))}
            </div>
        </div>
    );
});

XPCounter.displayName = 'XPCounter';
