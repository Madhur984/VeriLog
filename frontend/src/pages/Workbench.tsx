/**
 * pages/Workbench.tsx — Unified Engineering Workbench (v2)
 *
 * Shell layout connecting all 5 panels:
 *  Left:   ComponentPalette
 *  Center: CircuitCanvas
 *  Right:  PropertiesPanel
 *  Bottom: WaveformViewer
 *  Log:    ConsolePanel
 *
 * Simulation is driven by WorkerBridge (CSE running in a Web Worker).
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkbenchStore } from '../stores/useWorkbenchStore';
import { workerBridge } from '../engine/WorkerBridge';
import { ComponentPalette } from '../components/workbench/ComponentPalette';
import { CircuitCanvas } from '../components/workbench/CircuitCanvas';
import { WaveformViewer } from '../components/workbench/WaveformViewer';
import { PropertiesPanel } from '../components/workbench/PropertiesPanel';
import { ConsolePanel, consoleLog } from '../components/workbench/ConsolePanel';
import {
    serializeCircuit,
    saveToLocalStorage,
    loadFromLocalStorage,
    downloadCircuit,
} from '../engine/CircuitSerializer';
import '../components/workbench/workbench.css';

type ToolMode = 'select' | 'wire' | 'probe' | 'delete';

// ── Layout constants ─────────────────────────────────────────────────────
const PALETTE_W = 200;
const PROPERTIES_W = 240;
const WAVEFORM_H = 200;
const CONSOLE_H = 120;

export function Workbench() {
    const navigate = useNavigate();
    const [tool, setTool] = useState<ToolMode>('select');
    const [showConsole, setShowConsole] = useState(true);
    const [showWaveform, setShowWaveform] = useState(true);

    const { nodes, wires, probes, simRunning, simTimeNs, setSimRunning, resetSim, clearCanvas } = useWorkbenchStore();

    // ── Worker lifecycle ──────────────────────────────────────────────────

    const bridgeReady = useRef(false);
    useEffect(() => {
        if (!bridgeReady.current) {
            workerBridge.init();
            bridgeReady.current = true;
            consoleLog('info', '⚡ DigiLogic Workbench v2 initialized');
            // Try to restore autosave
            const saved = loadFromLocalStorage();
            if (saved) { consoleLog('info', `Restored circuit: ${saved.metadata.name}`); }
        }
        return () => { /* keep worker alive across hot reloads */ };
    }, []);

    // Re-load graph into worker whenever canvas nodes/wires change
    useEffect(() => {
        workerBridge.loadGraph();
    }, [nodes, wires]);

    // ── Sim controls ──────────────────────────────────────────────────────

    const simControl = useCallback((cmd: 'play' | 'pause' | 'step' | 'reset') => {
        switch (cmd) {
            case 'play':
                setSimRunning(true);
                workerBridge.start();
                consoleLog('sim', 'Simulation started');
                break;
            case 'pause':
                workerBridge.stop();
                consoleLog('sim', 'Simulation paused');
                break;
            case 'step':
                workerBridge.step();
                consoleLog('sim', `Step → t=${simTimeNs + 100}ns`);
                break;
            case 'reset':
                workerBridge.reset();
                resetSim();
                consoleLog('sim', 'Simulation reset');
                break;
        }
    }, [setSimRunning, resetSim, simTimeNs]);

    // ── Tool keyboard shortcuts ───────────────────────────────────────────

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            switch (e.key.toLowerCase()) {
                case 'v': setTool('select'); break;
                case 'w': setTool('wire'); break;
                case 'p': setTool('probe'); break;
                case 'd': setTool('delete'); break;
                case ' ':
                    e.preventDefault();
                    simControl(simRunning ? 'pause' : 'play');
                    break;
                case 's':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        handleSave();
                    }
                    break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [simRunning, simControl]);

    // ── Save / Load ───────────────────────────────────────────────────────

    const handleSave = useCallback(() => {
        const cf = serializeCircuit(nodes, wires, probes);
        saveToLocalStorage(cf);
        consoleLog('info', `Circuit saved to localStorage`);
    }, [nodes, wires, probes]);

    const handleDownload = useCallback(() => {
        const cf = serializeCircuit(nodes, wires, probes);
        downloadCircuit(cf);
        consoleLog('info', `Downloading circuit file`);
    }, [nodes, wires, probes]);

    // ── Drag start from palette (just logs — canvas handles the drop) ─────

    const handleDragStart = useCallback((typeId: string) => {
        consoleLog('info', `Dragging ${typeId} to canvas`);
    }, []);

    // ── Layout calculation ────────────────────────────────────────────────



    return (
        <div className="wb-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#07080C' }}>

            {/* ── Toolbar ────────────────────────────────────────────────────── */}
            <div className="wb-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 12px', height: 44, borderBottom: '1px solid #1A1D24', background: '#0D0F16', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#00D4FF', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 12 }}>
                    ⚡ Workbench
                </span>

                {/* Tool buttons */}
                {([
                    { id: 'select', key: 'V', label: '🖱 Select' },
                    { id: 'wire', key: 'W', label: '〰 Wire' },
                    { id: 'probe', key: 'P', label: '📍 Probe' },
                    { id: 'delete', key: 'D', label: '🗑 Delete' },
                ] as { id: ToolMode; key: string; label: string }[]).map(t => (
                    <button key={t.id}
                        onClick={() => setTool(t.id)}
                        title={`${t.label} (${t.key})`}
                        style={{
                            ...toolBtnStyle,
                            color: tool === t.id ? '#00D4FF' : '#64748B',
                            borderColor: tool === t.id ? '#00D4FF44' : 'transparent',
                            background: tool === t.id ? '#00D4FF0A' : 'transparent',
                        }}
                    >
                        {t.label}
                    </button>
                ))}

                <div style={divStyle} />

                {/* Sim controls */}
                <button onClick={() => simControl(simRunning ? 'pause' : 'play')} style={toolBtnStyle} title="Play/Pause (Space)">
                    {simRunning ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onClick={() => simControl('step')} style={toolBtnStyle} title="Step (S)">⏭ Step</button>
                <button onClick={() => simControl('reset')} style={toolBtnStyle} title="Reset">⏹ Reset</button>

                <div style={divStyle} />

                {/* Save/Load */}
                <button onClick={handleSave} style={toolBtnStyle} title="Save (Ctrl+S)">💾 Save</button>
                <button onClick={handleDownload} style={toolBtnStyle} title="Download JSON">⬇ Export</button>
                <button onClick={() => clearCanvas()} style={toolBtnStyle} title="Clear canvas">🗑 Clear</button>

                <div style={{ flex: 1 }} />

                {/* Panel toggles */}
                <button onClick={() => setShowWaveform(v => !v)} style={{ ...toolBtnStyle, color: showWaveform ? '#10B981' : '#334155' }}>
                    📊 Waveform
                </button>
                <button onClick={() => setShowConsole(v => !v)} style={{ ...toolBtnStyle, color: showConsole ? '#10B981' : '#334155' }}>
                    🖥 Console
                </button>
                <button onClick={() => navigate(-1)} style={toolBtnStyle}>← Back</button>
            </div>

            {/* ── Main Area ──────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* LEFT — Component Palette */}
                <div style={{ width: PALETTE_W, borderRight: '1px solid #1A1D24', flexShrink: 0, overflowY: 'auto' }}>
                    <ComponentPalette onDragStart={handleDragStart} />
                </div>

                {/* CENTER — Canvas + Bottom panels */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Circuit Canvas */}
                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        <CircuitCanvas tool={tool} />
                    </div>

                    {/* Waveform Viewer */}
                    {showWaveform && (
                        <div style={{ height: WAVEFORM_H, borderTop: '1px solid #1A1D24', flexShrink: 0 }}>
                            <WaveformViewer />
                        </div>
                    )}

                    {/* Console */}
                    {showConsole && (
                        <div style={{ height: CONSOLE_H, borderTop: '1px solid #1A1D24', flexShrink: 0 }}>
                            <ConsolePanel />
                        </div>
                    )}
                </div>

                {/* RIGHT — Properties Panel */}
                <div style={{ width: PROPERTIES_W, borderLeft: '1px solid #1A1D24', flexShrink: 0, overflowY: 'auto', background: '#0D0F16' }}>
                    <PropertiesPanel />
                </div>
            </div>

            {/* ── Status Bar ────────────────────────────────────────────────── */}
            <div style={{ height: 24, borderTop: '1px solid #1A1D24', background: '#090B10', display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', flexShrink: 0 }}>
                <StatusDot active={simRunning} label={simRunning ? 'Simulating' : 'Idle'} />
                <StatusItem label={`t = ${simTimeNs}ns`} />
                <StatusItem label={`${nodes.size} nodes`} />
                <StatusItem label={`${wires.size} wires`} />
                <StatusItem label={`Tool: ${tool}`} />
                <div style={{ flex: 1 }} />
                <StatusItem label="VeriLog Workbench v2" muted />
            </div>
        </div>
    );
}

// ── Micro-components ──────────────────────────────────────────────────────

const toolBtnStyle: React.CSSProperties = {
    background: 'none', border: '1px solid transparent', borderRadius: 4,
    color: '#64748B', cursor: 'pointer', padding: '3px 10px',
    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.15s',
};

const divStyle: React.CSSProperties = { width: 1, height: 16, background: '#1A1D24', margin: '0 4px' };

const StatusDot: React.FC<{ active: boolean; label: string }> = ({ active, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#10B981' : '#334155', transition: 'background 0.3s' }} />
        <span style={{ fontSize: 10, color: active ? '#10B981' : '#475569', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
    </div>
);

const StatusItem: React.FC<{ label: string; muted?: boolean }> = ({ label, muted }) => (
    <span style={{ fontSize: 10, color: muted ? '#1E293B' : '#475569', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
);
