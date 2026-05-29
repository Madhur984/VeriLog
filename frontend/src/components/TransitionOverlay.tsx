/**
 * TransitionOverlay.tsx
 *
 * System-level route transition overlay for VeriLog.
 * Mounted ONCE at App root - never unmounts.
 *
 * 5-layer visual architecture:
 *   L1  #0B0F14 matte (solid, no gradient)
 *   L2  Subtle grid field (CSS background-image + grid-drift keyframe)
 *   L3  1px horizontal signal line (scaleX from center, single glow pulse)
 *   L4  System text (geometricPrecision, 0.22em tracking, #E5E7EB)
 *   L5  Level markers (L1 active, L2/L3 dimmed aspirational)
 *
 * Zero per-frame React state.
 * CSS class toggles drive all animation timing.
 * Message read from context via ref - zero re-renders.
 */

import { memo } from 'react';
import { useTransitionContext } from '../hooks/useTransitionController';
import './transitions.css';

// ─── Level Markers ─────────────────────────────────────────────────────────── 

const LEVELS = [
    { id: 1, code: 'L1', label: 'SIGNAL' },
    { id: 2, code: 'L2', label: 'ANALOG' },
    { id: 3, code: 'L3', label: 'BINARY' },
    { id: 4, code: 'L4', label: 'LOGIC' },
    { id: 5, code: 'L5', label: 'OPTIMIZE' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * TransitionOverlay
 *
 * Reads `isTransitioning` and `messageRef` from TransitionContext.
 * Only re-renders when isTransitioning toggles (2x per navigation).
 * Message is read inline from ref - no prop drilling, no state.
 */
export const TransitionOverlay = memo(() => {
    const { isTransitioning, messageRef } = useTransitionContext();
    const msg = messageRef.current;

    return (
        <div
            className={`vl-overlay ${isTransitioning ? 'is-active' : ''}`}
            aria-hidden={!isTransitioning}
            aria-live="assertive"
            aria-label={isTransitioning ? `System transition: ${msg.primary}` : undefined}
            role="status"
        >
            {/* ── L2: Grid Field ── */}
            <div className="vl-overlay__grid" aria-hidden="true" />

            {/* ── Content Stack: L3 + L4 + L5 ── */}
            <div className="vl-overlay__content">

                {/* L5: Level markers - rendered above text for visual hierarchy */}
                <div className="vl-overlay__levels" aria-hidden="true">
                    {LEVELS.map((level, i) => {
                        const isActive = level.id === msg.level;
                        const isFuture = level.id > msg.level;
                        return (
                            <div key={level.id} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                <div
                                    className={`vl-level-marker ${isActive ? 'is-active' : isFuture ? 'is-future' : 'is-complete'
                                        }`}
                                >
                                    <div className="vl-level-marker__dot" />
                                    <span>{level.code} - {level.label}</span>
                                </div>
                                {i < LEVELS.length - 1 && (
                                    <div className="vl-level-separator" aria-hidden="true" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* L3: Signal line - between level markers and text */}
                <div className="vl-overlay__signal-wrap" aria-hidden="true">
                    <div className="vl-overlay__signal-line" />
                </div>

                {/* L4: System text */}
                <div className="vl-overlay__message">
                    {msg.primary}
                    <span className="vl-overlay__subtext">
                        VeriLog Engineering System
                    </span>
                </div>

            </div>
        </div>
    );
});

TransitionOverlay.displayName = 'TransitionOverlay';
