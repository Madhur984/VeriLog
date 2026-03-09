/**
 * SignalWatchPanel.tsx — Watch window for selected signals
 *
 * Displays real-time values of watched signals with sparkline history.
 * Similar to a software debugger's variable watch window.
 */

import { memo, useCallback } from 'react';
import type { WatchSignal } from '../../hooks/useCircuitDebugger';
import type { NodeId } from '../../mure/core/SignalNode';

interface SignalWatchPanelProps {
    signals: WatchSignal[];
    onRemove: (nodeId: NodeId, portIndex: number) => void;
}

export const SignalWatchPanel = memo(({ signals, onRemove }: SignalWatchPanelProps) => {
    return (
        <div style={{
            height: '100%',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            overflow: 'auto',
        }}>
            {/* Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 50px 80px 24px',
                gap: 4,
                padding: '4px 8px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
                color: 'rgba(0, 212, 255, 0.4)',
                fontSize: 9,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
            }}>
                <span>Signal</span>
                <span>Value</span>
                <span>Logic</span>
                <span>Sparkline</span>
                <span />
            </div>

            {signals.length === 0 && (
                <div style={{
                    padding: '16px 8px',
                    color: 'rgba(255,255,255,0.15)',
                    textAlign: 'center',
                    fontSize: 10,
                }}>
                    No watched signals. Click a wire to add a watch.
                </div>
            )}

            {signals.map(sig => (
                <WatchRow key={`${sig.nodeId}-${sig.portIndex}`} signal={sig} onRemove={onRemove} />
            ))}
        </div>
    );
});

SignalWatchPanel.displayName = 'SignalWatchPanel';

// ─── Individual Watch Row ────────────────────────────────────────────────

interface WatchRowProps {
    signal: WatchSignal;
    onRemove: (nodeId: NodeId, portIndex: number) => void;
}

const WatchRow = memo(({ signal, onRemove }: WatchRowProps) => {
    const voltage = signal.currentValue?.voltage ?? 0;
    const logic = signal.currentValue?.logic;
    const isHigh = logic === true;

    const handleRemove = useCallback(() => {
        onRemove(signal.nodeId, signal.portIndex);
    }, [signal.nodeId, signal.portIndex, onRemove]);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 50px 80px 24px',
            gap: 4,
            padding: '3px 8px',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            transition: 'background 80ms',
        }}>
            {/* Signal Label */}
            <span style={{ color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {signal.label}
            </span>

            {/* Voltage */}
            <span style={{
                color: voltage > 2.5 ? '#10B981' : voltage > 0 ? '#F59E0B' : 'rgba(255,255,255,0.3)',
                fontWeight: 600,
                fontSize: 10,
            }}>
                {voltage.toFixed(1)}V
            </span>

            {/* Logic Level */}
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
            }}>
                <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isHigh ? '#10B981' : '#374151',
                    boxShadow: isHigh ? '0 0 4px #10B981' : 'none',
                }} />
                <span style={{ color: isHigh ? '#10B981' : 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                    {logic === undefined ? '?' : logic ? '1' : '0'}
                </span>
            </span>

            {/* Sparkline */}
            <Sparkline history={signal.history} />

            {/* Remove */}
            <button
                onClick={handleRemove}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    fontSize: 10,
                    padding: 0,
                    lineHeight: 1,
                }}
                title="Remove watch"
            >
                ✕
            </button>
        </div>
    );
});

WatchRow.displayName = 'WatchRow';

// ─── Sparkline Component ─────────────────────────────────────────────────

const Sparkline = memo(({ history }: { history: { time: number; voltage: number }[] }) => {
    if (history.length < 2) {
        return <div style={{ height: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 2 }} />;
    }

    const last32 = history.slice(-32);
    const minV = 0;
    const maxV = 5;
    const w = 76;
    const h = 14;

    const points = last32.map((s, i) => {
        const x = (i / (last32.length - 1)) * w;
        const y = h - ((s.voltage - minV) / (maxV - minV)) * h;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
            <polyline
                points={points}
                fill="none"
                stroke="#00D4FF"
                strokeWidth={1}
                opacity={0.6}
            />
        </svg>
    );
});

Sparkline.displayName = 'Sparkline';
