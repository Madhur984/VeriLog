/**
 * CircuitDebugger.tsx — Debugger toolbar with Run/Pause/Step/Reset controls
 *
 * Professional debugger UI with state indicators, timing display,
 * and keyboard shortcut hints.
 */

import { memo } from 'react';
import type { DebuggerContext } from '../../hooks/useCircuitDebugger';

interface CircuitDebuggerProps {
    debugger: DebuggerContext;
}

const STATE_LABELS: Record<string, { text: string; color: string; icon: string }> = {
    idle: { text: 'IDLE', color: '#6B7280', icon: '⏹' },
    running: { text: 'RUNNING', color: '#10B981', icon: '▶' },
    paused: { text: 'PAUSED', color: '#F59E0B', icon: '⏸' },
    stepping: { text: 'STEPPING', color: '#00D4FF', icon: '⏭' },
    breakpoint_hit: { text: 'BREAKPOINT', color: '#EF4444', icon: '🔴' },
};

export const CircuitDebugger = memo(({ debugger: dbg }: CircuitDebuggerProps) => {
    const stateInfo = STATE_LABELS[dbg.state] || STATE_LABELS.idle;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'rgba(0, 212, 255, 0.02)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            userSelect: 'none',
        }}>
            {/* State Indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                borderRadius: 3,
                background: `${stateInfo.color}15`,
                border: `1px solid ${stateInfo.color}30`,
                minWidth: 90,
            }}>
                <span>{stateInfo.icon}</span>
                <span style={{ color: stateInfo.color, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em' }}>
                    {stateInfo.text}
                </span>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: 2 }}>
                {/* Play / Pause */}
                <button
                    onClick={dbg.state === 'running' ? dbg.pause : dbg.play}
                    title={dbg.state === 'running' ? 'Pause (Space)' : 'Run (Space)'}
                    style={btnStyle(dbg.state === 'running')}
                >
                    {dbg.state === 'running' ? '⏸' : '▶'}
                </button>

                {/* Step */}
                <button
                    onClick={dbg.step}
                    disabled={dbg.state === 'running'}
                    title="Step (S)"
                    style={btnStyle(false, dbg.state === 'running')}
                >
                    ⏭
                </button>

                {/* Reset */}
                <button
                    onClick={dbg.reset}
                    title="Reset"
                    style={btnStyle(false)}
                >
                    ⏹
                </button>
            </div>

            {/* Separator */}
            <div style={{ width: 1, height: 16, background: 'rgba(0, 212, 255, 0.1)' }} />

            {/* Time Display */}
            <div style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 10,
                display: 'flex',
                gap: 12,
            }}>
                <span>t = <span style={{ color: '#00D4FF' }}>{dbg.currentTimeNs}ns</span></span>
                <span>Steps: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{dbg.stepCount}</span></span>
            </div>

            <div style={{ flex: 1 }} />

            {/* Breakpoint Count */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'rgba(255,255,255,0.3)',
                fontSize: 9,
            }}>
                <span>🔴</span>
                <span>{dbg.breakpoints.filter(b => b.enabled).length} breakpoints</span>
            </div>

            {/* Watch Count */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'rgba(255,255,255,0.3)',
                fontSize: 9,
            }}>
                <span>👁</span>
                <span>{dbg.watchSignals.length} watched</span>
            </div>
        </div>
    );
});

CircuitDebugger.displayName = 'CircuitDebugger';

function btnStyle(active: boolean, disabled = false): React.CSSProperties {
    return {
        background: active ? 'rgba(0, 212, 255, 0.12)' : 'none',
        border: `1px solid ${active ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255,255,255,0.1)'}`,
        color: disabled ? 'rgba(255,255,255,0.15)' : active ? '#00D4FF' : 'rgba(255,255,255,0.5)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        padding: '3px 8px',
        borderRadius: 3,
        lineHeight: 1,
        transition: 'all 100ms',
    };
}
