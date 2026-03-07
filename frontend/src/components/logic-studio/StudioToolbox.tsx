/**
 * StudioToolbox.tsx — Play/Pause/Step/Reset toolbar + mode switcher
 */

import type { StudioMode } from '../../hooks/useLogicStudio';

interface Props {
    isRunning: boolean;
    simTime: number;
    mode: StudioMode;
    xrayEnabled: boolean;
    onPlay: () => void;
    onPause: () => void;
    onStep: () => void;
    onReset: () => void;
    onSetMode: (mode: StudioMode) => void;
    onToggleXray: () => void;
}

const MODE_BUTTONS: { mode: StudioMode; label: string; icon: string }[] = [
    { mode: 'select', label: 'Select', icon: '🖱️' },
    { mode: 'wire', label: 'Wire', icon: '🔗' },
    { mode: 'probe', label: 'Probe', icon: '📍' },
];

function formatTime(ns: number): string {
    if (ns < 1_000) return `${ns}ns`;
    if (ns < 1_000_000) return `${(ns / 1_000).toFixed(1)}μs`;
    if (ns < 1_000_000_000) return `${(ns / 1_000_000).toFixed(1)}ms`;
    return `${(ns / 1_000_000_000).toFixed(2)}s`;
}

export function StudioToolbox({
    isRunning,
    simTime,
    mode,
    xrayEnabled,
    onPlay,
    onPause,
    onStep,
    onReset,
    onSetMode,
    onToggleXray,
}: Props) {
    return (
        <div className="studio-toolbox">
            {/* Mode buttons */}
            <div className="studio-toolbox-group">
                {MODE_BUTTONS.map((btn) => (
                    <button
                        key={btn.mode}
                        className={`studio-toolbox-btn ${mode === btn.mode ? 'studio-toolbox-btn--active' : ''}`}
                        onClick={() => onSetMode(btn.mode)}
                        title={btn.label}
                    >
                        <span>{btn.icon}</span>
                        <span className="studio-toolbox-btn-label">{btn.label}</span>
                    </button>
                ))}
            </div>

            <div className="studio-toolbox-divider" />

            {/* Simulation controls */}
            <div className="studio-toolbox-group">
                <button
                    className="studio-toolbox-btn studio-toolbox-btn--sim"
                    onClick={isRunning ? onPause : onPlay}
                    title={isRunning ? 'Pause' : 'Play'}
                >
                    {isRunning ? '⏸' : '▶'}
                </button>
                <button
                    className="studio-toolbox-btn studio-toolbox-btn--sim"
                    onClick={onStep}
                    title="Step"
                    disabled={isRunning}
                >
                    ⏭
                </button>
                <button
                    className="studio-toolbox-btn studio-toolbox-btn--sim"
                    onClick={onReset}
                    title="Reset"
                >
                    🔄
                </button>
            </div>

            <div className="studio-toolbox-divider" />

            {/* X-Ray toggle */}
            <button
                className={`studio-toolbox-btn ${xrayEnabled ? 'studio-toolbox-btn--active' : ''}`}
                onClick={onToggleXray}
                title="X-Ray Mode"
            >
                <span>🔬</span>
                <span className="studio-toolbox-btn-label">X-Ray</span>
            </button>

            {/* Time display */}
            <div className="studio-time-display">
                T = {formatTime(simTime)}
            </div>
        </div>
    );
}
