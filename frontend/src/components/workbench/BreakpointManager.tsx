/**
 * BreakpointManager.tsx — Set and manage conditional breakpoints on signals
 *
 * Allows users to define conditions (rising, falling, high, low, change)
 * on specific signals to halt simulation.
 */

import { useCallback, memo } from 'react';
import type { Breakpoint } from '../../hooks/useCircuitDebugger';
import type { NodeId } from '../../mure/core/SignalNode';

interface BreakpointManagerProps {
    breakpoints: Breakpoint[];
    onAdd: (nodeId: NodeId, portIndex: number, condition: Breakpoint['condition']) => void;
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
    onClearAll: () => void;
}

const CONDITION_LABELS: Record<Breakpoint['condition'], { text: string; icon: string }> = {
    rising: { text: 'Rising Edge', icon: '↗' },
    falling: { text: 'Falling Edge', icon: '↘' },
    high: { text: 'Logic HIGH', icon: '⬆' },
    low: { text: 'Logic LOW', icon: '⬇' },
    change: { text: 'Any Change', icon: '↕' },
};

export const BreakpointManager = memo(({
    breakpoints,
    onRemove,
    onToggle,
    onClearAll,
}: BreakpointManagerProps) => {
    return (
        <div style={{
            height: '100%',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: 8,
                padding: '4px 8px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                alignItems: 'center',
            }}>
                <span style={{
                    color: 'rgba(0, 212, 255, 0.4)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}>
                    Breakpoints
                </span>
                <span style={{ flex: 1 }} />
                {breakpoints.length > 0 && (
                    <button
                        onClick={onClearAll}
                        style={{
                            background: 'none',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.3)',
                            fontSize: 9,
                            padding: '1px 6px',
                            borderRadius: 2,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Breakpoint List */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {breakpoints.length === 0 && (
                    <div style={{
                        padding: '16px 8px',
                        color: 'rgba(255,255,255,0.12)',
                        textAlign: 'center',
                        fontSize: 10,
                    }}>
                        No breakpoints set. Right-click a signal to add one.
                    </div>
                )}

                {breakpoints.map(bp => (
                    <BreakpointRow key={bp.id} bp={bp} onRemove={onRemove} onToggle={onToggle} />
                ))}
            </div>
        </div>
    );
});

BreakpointManager.displayName = 'BreakpointManager';

// ─── Breakpoint Row ──────────────────────────────────────────────────────

interface BreakpointRowProps {
    bp: Breakpoint;
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
}

const BreakpointRow = memo(({ bp, onRemove, onToggle }: BreakpointRowProps) => {
    const condInfo = CONDITION_LABELS[bp.condition];

    const handleToggle = useCallback(() => onToggle(bp.id), [bp.id, onToggle]);
    const handleRemove = useCallback(() => onRemove(bp.id), [bp.id, onRemove]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.02)',
            opacity: bp.enabled ? 1 : 0.4,
        }}>
            {/* Enable/Disable Toggle */}
            <button
                onClick={handleToggle}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 10,
                    padding: 0,
                    lineHeight: 1,
                    color: bp.enabled ? '#EF4444' : 'rgba(255,255,255,0.2)',
                }}
                title={bp.enabled ? 'Disable breakpoint' : 'Enable breakpoint'}
            >
                {bp.enabled ? '🔴' : '⚪'}
            </button>

            {/* Node ID */}
            <span style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {bp.nodeId}:{bp.portIndex}
            </span>

            {/* Condition */}
            <span style={{
                fontSize: 9,
                color: 'rgba(0, 212, 255, 0.5)',
                padding: '1px 4px',
                border: '1px solid rgba(0, 212, 255, 0.1)',
                borderRadius: 2,
            }}>
                {condInfo.icon} {condInfo.text}
            </span>

            {/* Hit Count */}
            {bp.hitCount > 0 && (
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                    ×{bp.hitCount}
                </span>
            )}

            {/* Remove */}
            <button
                onClick={handleRemove}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    fontSize: 10,
                    padding: 0,
                    lineHeight: 1,
                }}
                title="Remove breakpoint"
            >
                ✕
            </button>
        </div>
    );
});

BreakpointRow.displayName = 'BreakpointRow';
