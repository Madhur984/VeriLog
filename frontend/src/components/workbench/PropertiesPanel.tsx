/**
 * components/workbench/PropertiesPanel.tsx — Context-Sensitive Properties Editor
 *
 * Shows relevant controls depending on what's selected:
 * - Nothing selected → circuit stats
 * - Gate selected → timing params, label editor
 * - Switch/Button selected → toggle + on/off state
 * - Clock selected → frequency slider
 * - LED selected → live brightness indicator
 * - Wire selected → endpoints display
 */

import React, { useCallback } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';

const T = {
    bg: '#0D0F16', surface: '#111318', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

// ── Sub-panels ────────────────────────────────────────────────────────────

const StatRow: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{label}</span>
        <span style={{ fontSize: 11, color: color ?? T.text, fontFamily: T.mono, fontWeight: 600 }}>{value}</span>
    </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.muted, fontFamily: T.mono, marginBottom: 8, marginTop: 16 }}>
        {title}
    </div>
);

const TextInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, display: 'block', marginBottom: 3 }}>{label}</label>
        <input
            type="text" value={value}
            onChange={e => onChange(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: '5px 8px', color: T.text, fontSize: 12, fontFamily: T.mono, outline: 'none' }}
        />
    </div>
);

const NumberInput: React.FC<{ label: string; value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void }> = ({ label, value, min, max, step, onChange }) => (
    <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, display: 'block', marginBottom: 3 }}>
            {label} <span style={{ color: T.accent }}>{value}</span>
        </label>
        <input type="range" value={value} min={min} max={max} step={step}
            onChange={e => onChange(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: T.accent }}
        />
    </div>
);

// ── Main Panel ────────────────────────────────────────────────────────────

export const PropertiesPanel: React.FC = () => {
    const { nodes, wires, selectedIds, snapshot, simTimeNs, updateNodeParams, updateNodeLabel } = useWorkbenchStore();

    // Resolve selection
    const selectedNodeIds = Array.from(selectedIds).filter(id => nodes.has(id));
    const selectedWireIds = Array.from(selectedIds).filter(id => wires.has(id));

    const singleNode = selectedNodeIds.length === 1 ? nodes.get(selectedNodeIds[0]) : null;
    const singleWire = selectedWireIds.length === 1 ? wires.get(selectedWireIds[0]) : null;

    const nodePorts = singleNode ? (snapshot.get(singleNode.id) ?? []) : [];

    const handleParamChange = useCallback((key: string, value: unknown) => {
        if (!singleNode) return;
        updateNodeParams(singleNode.id, { [key]: value } as object);
    }, [singleNode, updateNodeParams]);

    const handleLabelChange = useCallback((v: string) => {
        if (!singleNode) return;
        updateNodeLabel(singleNode.id, v);
    }, [singleNode, updateNodeLabel]);

    // ── Nothing selected ──────────────────────────────────────────────────

    if (!singleNode && !singleWire && selectedIds.size === 0) {
        const nodeCount = nodes.size;
        const wireCount = wires.size;
        const liveWires = Array.from(wires.values()).filter(w => w.isLive).length;

        return (
            <div style={{ padding: '16px 14px', height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
                <SectionHeader title="Circuit Stats" />
                <StatRow label="Components" value={nodeCount} />
                <StatRow label="Wires" value={wireCount} />
                <StatRow label="Live Signals" value={liveWires} color={T.success} />
                <StatRow label="Simulation t" value={`${simTimeNs}ns`} color={T.accent} />

                <SectionHeader title="How to Use" />
                <ul style={{ color: T.muted, fontSize: 11, fontFamily: T.mono, lineHeight: 1.8, paddingLeft: 14, margin: 0 }}>
                    <li>Drag gates from the left panel</li>
                    <li>Press <span style={{ color: T.accent }}>W</span> for wire mode</li>
                    <li>Click port → click port to connect</li>
                    <li>Right-click → Add Probe</li>
                    <li>Space to play/pause simulation</li>
                    <li>Del to remove selected</li>
                </ul>
            </div>
        );
    }

    // ── Wire selected ─────────────────────────────────────────────────────────

    if (singleWire) {
        const fromNode = nodes.get(singleWire.from.nodeId);
        const toNode = nodes.get(singleWire.to.nodeId);
        return (
            <div style={{ padding: '16px 14px', overflowY: 'auto' }}>
                <SectionHeader title="Wire" />
                <StatRow label="Signal" value={singleWire.isLive ? 'HIGH' : 'LOW'} color={singleWire.isLive ? T.success : T.muted} />
                <StatRow label="From" value={fromNode?.label ?? singleWire.from.nodeId} />
                <StatRow label="Port" value={`out[${singleWire.from.portIndex}]`} />
                <StatRow label="To" value={toNode?.label ?? singleWire.to.nodeId} />
                <StatRow label="Port" value={`in[${singleWire.to.portIndex}]`} />
            </div>
        );
    }

    // ── Multi-select ──────────────────────────────────────────────────────────

    if (selectedIds.size > 1) {
        return (
            <div style={{ padding: '16px 14px' }}>
                <SectionHeader title="Multi-Select" />
                <StatRow label="Selected" value={selectedIds.size} />
                <p style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, lineHeight: 1.6 }}>
                    Del — delete all selected<br />
                    Shift+Click — add/remove
                </p>
            </div>
        );
    }

    // ── Single node selected ──────────────────────────────────────────────────

    if (!singleNode) return null;

    const type = singleNode.type;

    return (
        <div style={{ padding: '16px 14px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }} />
                <span style={{ fontSize: 13, fontFamily: T.mono, fontWeight: 700, color: T.text }}>{type}</span>
            </div>

            {/* Port States */}
            <SectionHeader title="Port States" />
            {nodePorts.map((p, i) => (
                <StatRow
                    key={i}
                    label={`port[${i}]`}
                    value={p.logic ? `HIGH (${p.voltage.toFixed(2)}V)` : `LOW (${p.voltage.toFixed(2)}V)`}
                    color={p.logic ? T.success : T.muted}
                />
            ))}

            {/* Label */}
            <SectionHeader title="Identity" />
            <TextInput label="Label" value={singleNode.label} onChange={handleLabelChange} />

            {/* Gate timing */}
            {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'].includes(type) && (
                <>
                    <SectionHeader title="Timing (CMOS 180nm)" />
                    <NumberInput label="tpdHL (ns)" value={singleNode.params.tpdHL ?? 1.8} min={0.1} max={20} step={0.1}
                        onChange={v => handleParamChange('tpdHL', v)} />
                    <NumberInput label="tpdLH (ns)" value={singleNode.params.tpdLH ?? 2.1} min={0.1} max={20} step={0.1}
                        onChange={v => handleParamChange('tpdLH', v)} />
                </>
            )}

            {/* Switch toggle */}
            {(type === 'SWITCH_SPST' || type === 'PUSHBUTTON') && (
                <>
                    <SectionHeader title="Control" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: T.text, fontFamily: T.mono }}>
                            {singleNode.params.isOn ? 'ON (HIGH)' : 'OFF (LOW)'}
                        </span>
                        <button
                            onClick={() => handleParamChange('isOn', !singleNode.params.isOn)}
                            style={{
                                padding: '5px 16px', borderRadius: 6, border: `1px solid ${T.border}`, cursor: 'pointer',
                                background: singleNode.params.isOn ? T.success : T.surface,
                                color: singleNode.params.isOn ? '#000' : T.text,
                                fontFamily: T.mono, fontSize: 12, fontWeight: 700,
                            }}
                        >
                            {singleNode.params.isOn ? 'CLOSE' : 'OPEN'}
                        </button>
                    </div>
                </>
            )}

            {/* Battery voltage */}
            {type === 'BATTERY' && (
                <>
                    <SectionHeader title="Supply Voltage" />
                    <NumberInput label="Voltage (V)" value={singleNode.params.voltage ?? 5} min={1} max={12} step={0.1}
                        onChange={v => handleParamChange('voltage', v)} />
                </>
            )}

            {/* LED status */}
            {type === 'LED' && (() => {
                const brightness = nodePorts[0]?.logic ? 1 : 0;
                return (
                    <>
                        <SectionHeader title="LED State" />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: `rgba(239,68,68,${Math.max(0.08, brightness)})`,
                                boxShadow: brightness > 0 ? `0 0 20px #EF444488` : 'none',
                                border: '2px solid #EF4444',
                                transition: 'all 0.2s',
                            }} />
                            <span style={{ fontSize: 12, color: brightness ? T.error : T.muted, fontFamily: T.mono }}>
                                {brightness ? '● ON' : '○ OFF'}
                            </span>
                        </div>
                    </>
                );
            })()}

            {/* Flip-flop clock edge */}
            {['D_FF', 'JK_FF', 'T_FF'].includes(type) && (
                <>
                    <SectionHeader title="Flip-Flop" />
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['rising', 'falling'] as const).map(edge => (
                            <button
                                key={edge}
                                onClick={() => handleParamChange('clockEdge', edge)}
                                style={{
                                    flex: 1, padding: '5px 0', borderRadius: 4, border: `1px solid ${T.border}`,
                                    background: singleNode.params.clockEdge === edge ? T.accent + '22' : T.surface,
                                    color: singleNode.params.clockEdge === edge ? T.accent : T.muted,
                                    fontFamily: T.mono, fontSize: 11, cursor: 'pointer',
                                }}
                            >
                                {edge === 'rising' ? '↑ Rising' : '↓ Falling'}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
