/**
 * Workbench.tsx — Unified Engineering Workbench
 *
 * Professional IDE-like workspace combining:
 * - Resizable panel layout (Component Palette, Circuit Canvas, Oscilloscope, Console)
 * - Command Palette (Ctrl+K)
 * - Global keyboard shortcuts
 * - Toolbar with simulation controls
 * - Status bar with sim state
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelManager } from '../components/workbench/PanelManager';
import { PanelContainer } from '../components/workbench/PanelContainer';
import { CommandPalette } from '../components/workbench/CommandPalette';
import { ConsolePanel, consoleLog } from '../components/workbench/ConsolePanel';
import { usePanelLayout } from '../hooks/usePanelLayout';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { createCommandRegistry } from '../data/commands';
import '../components/workbench/workbench.css';

type ToolMode = 'select' | 'wire' | 'probe' | 'delete';

export function Workbench() {
    const navigate = useNavigate();
    const { visiblePanels, visibleSizes, setSplitSizes, togglePanel, resetLayout, layout } = usePanelLayout();

    const [paletteOpen, setPaletteOpen] = useState(false);
    const [currentTool, setCurrentTool] = useState<ToolMode>('select');
    const [simRunning, setSimRunning] = useState(false);
    const [simTime, setSimTime] = useState(0);
    const [showHint, setShowHint] = useState(true);

    // Hide hint after 3s
    useEffect(() => {
        const t = setTimeout(() => setShowHint(false), 3000);
        return () => clearTimeout(t);
    }, []);

    // Log workbench open
    useEffect(() => {
        consoleLog('info', 'Engineering Workbench initialized');
    }, []);

    // Command actions
    const addGate = useCallback((type: string) => {
        consoleLog('info', `Add ${type} gate (place on canvas)`);
        // Future: integrate with canvas node placement
    }, []);

    const setTool = useCallback((tool: string) => {
        setCurrentTool(tool as ToolMode);
        consoleLog('info', `Tool → ${tool}`);
    }, []);

    const simControl = useCallback((cmd: 'play' | 'pause' | 'step' | 'reset') => {
        switch (cmd) {
            case 'play':
                setSimRunning(true);
                consoleLog('sim', 'Simulation started');
                break;
            case 'pause':
                setSimRunning(false);
                consoleLog('sim', 'Simulation paused');
                break;
            case 'step':
                setSimTime(t => t + 1);
                consoleLog('sim', `Clock step → t=${simTime + 1}ns`);
                break;
            case 'reset':
                setSimRunning(false);
                setSimTime(0);
                consoleLog('sim', 'Simulation reset');
                break;
        }
    }, [simTime]);

    const commands = useMemo(() => createCommandRegistry({
        addGate,
        setTool,
        simControl,
        togglePanel,
        navigate,
    }), [addGate, setTool, simControl, togglePanel, navigate]);

    useKeyboardShortcuts({
        commands,
        onCommandPalette: () => setPaletteOpen(true),
    });

    // Render panel content by ID
    const renderPanelContent = useCallback((panelId: string) => {
        switch (panelId) {
            case 'palette':
                return (
                    <div className="wb-empty-panel">
                        <div className="wb-empty-panel__icon">📦</div>
                        <div>Component Palette</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.08)' }}>
                            Gates will appear here
                        </div>
                    </div>
                );
            case 'canvas':
                return (
                    <div className="wb-empty-panel">
                        <div className="wb-empty-panel__icon">⚡</div>
                        <div>Circuit Canvas</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.08)' }}>
                            Press A for AND, O for OR, W for wire
                        </div>
                    </div>
                );
            case 'oscilloscope':
                return (
                    <div className="wb-empty-panel">
                        <div className="wb-empty-panel__icon">📊</div>
                        <div>Oscilloscope</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.08)' }}>
                            Signal waveforms will render here
                        </div>
                    </div>
                );
            case 'console':
                return <ConsolePanel />;
            default:
                return <div className="wb-empty-panel">Unknown panel</div>;
        }
    }, []);

    return (
        <div className="wb-root">
            {/* ── Toolbar ─────────────────────────────────────── */}
            <div className="wb-toolbar">
                <span className="wb-toolbar__title">⚡ DigiLogic Workbench</span>
                <div className="wb-toolbar__spacer" />

                {/* Tool Buttons */}
                <button
                    className={`wb-toolbar__btn ${currentTool === 'select' ? 'wb-toolbar__btn--active' : ''}`}
                    onClick={() => setTool('select')}
                    title="Select (V)"
                >
                    🖱 Select
                </button>
                <button
                    className={`wb-toolbar__btn ${currentTool === 'wire' ? 'wb-toolbar__btn--active' : ''}`}
                    onClick={() => setTool('wire')}
                    title="Wire (W)"
                >
                    🔗 Wire
                </button>
                <button
                    className={`wb-toolbar__btn ${currentTool === 'probe' ? 'wb-toolbar__btn--active' : ''}`}
                    onClick={() => setTool('probe')}
                    title="Probe (P)"
                >
                    📍 Probe
                </button>

                <div style={{ width: 1, height: 16, background: 'rgba(0, 212, 255, 0.1)', margin: '0 4px' }} />

                {/* Simulation Controls */}
                <div className="wb-sim-controls">
                    <button
                        className={`wb-sim-btn ${simRunning ? 'wb-sim-btn--active' : ''}`}
                        onClick={() => simControl(simRunning ? 'pause' : 'play')}
                        title={simRunning ? 'Pause' : 'Play (Space)'}
                    >
                        {simRunning ? '⏸' : '▶'}
                    </button>
                    <button className="wb-sim-btn" onClick={() => simControl('step')} title="Step (S)">
                        ⏭
                    </button>
                    <button className="wb-sim-btn" onClick={() => simControl('reset')} title="Reset">
                        ⏹
                    </button>
                </div>

                <div style={{ width: 1, height: 16, background: 'rgba(0, 212, 255, 0.1)', margin: '0 4px' }} />

                {/* Command Palette trigger */}
                <button
                    className="wb-toolbar__btn"
                    onClick={() => setPaletteOpen(true)}
                    title="Command Palette (Ctrl+K)"
                >
                    ⌘ Ctrl+K
                </button>

                {/* Layout Reset */}
                <button className="wb-toolbar__btn" onClick={resetLayout} title="Reset layout">
                    ↻
                </button>
            </div>

            {/* ── Panel Layout ────────────────────────────────── */}
            <div className="wb-layout">
                <PanelManager
                    panels={visiblePanels}
                    sizes={visibleSizes}
                    orientation={layout.orientation}
                    onSizesChange={setSplitSizes}
                >
                    {visiblePanels.map(panel => (
                        <PanelContainer
                            key={panel.id}
                            id={panel.id}
                            label={panel.label}
                            icon={panel.icon}
                            onClose={() => togglePanel(panel.id)}
                        >
                            {renderPanelContent(panel.id)}
                        </PanelContainer>
                    ))}
                </PanelManager>
            </div>

            {/* ── Status Bar ──────────────────────────────────── */}
            <div className="wb-status">
                <div className="wb-status__item">
                    <div className={`wb-status__dot ${simRunning ? '' : 'wb-status__dot--warn'}`} />
                    <span>{simRunning ? 'Running' : 'Idle'}</span>
                </div>
                <div className="wb-status__item">
                    <span>t = {simTime}ns</span>
                </div>
                <div className="wb-status__item">
                    <span>Tool: {currentTool}</span>
                </div>
                <div style={{ flex: 1 }} />
                <div className="wb-status__item">
                    <span>Panels: {visiblePanels.length}/4</span>
                </div>
            </div>

            {/* ── Command Palette ──────────────────────────────── */}
            <CommandPalette
                commands={commands}
                isOpen={paletteOpen}
                onClose={() => setPaletteOpen(false)}
            />

            {/* ── Initial Hint ──────────────────────────────────── */}
            {showHint && (
                <div className="wb-shortcut-hint">
                    Press Ctrl+K to open Command Palette
                </div>
            )}
        </div>
    );
}
