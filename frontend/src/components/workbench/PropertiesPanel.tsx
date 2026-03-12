/**
 * components/workbench/PropertiesPanel.tsx
 *
 * Right panel. Context-sensitive properties editor for the selected node(s).
 */

import React, { useMemo } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { getComponentDef } from '../../engine/ComponentDef';

export const PropertiesPanel: React.FC = () => {
    const selectedIds = useWorkbenchStore(s => s.selectedIds);
    const nodes = useWorkbenchStore(s => s.nodes);
    const updateNodeParams = useWorkbenchStore(s => s.updateNodeParams);
    const updateNodeLabel = useWorkbenchStore(s => s.updateNodeLabel);

    // If exactly 1 node is selected
    const selectedNode = useMemo(() => {
        if (selectedIds.size === 1) {
            const id = Array.from(selectedIds)[0];
            return nodes.get(id);
        }
        return null;
    }, [selectedIds, nodes]);

    if (!selectedNode) {
        return (
            <div style={panelStyle}>
                <div style={headerStyle}>Properties</div>
                <div style={{ padding: 16, fontSize: 12, color: '#64748B', textAlign: 'center' }}>
                    Select a single component to edit its properties.
                </div>
            </div>
        );
    }

    const def = getComponentDef(selectedNode.type);
    if (!def) return <div style={panelStyle}>Unknown component type</div>;

    const handleParamChange = (key: string, value: unknown) => {
        updateNodeParams(selectedNode.id, { [key]: value });
    };

    return (
        <div style={panelStyle}>
            <div style={headerStyle}>{def.label} Properties</div>
            <div style={{ padding: '16px' }}>
                {/* Node Label (Standard property for all nodes) */}
                <div style={rowStyle}>
                    <label style={labelStyle}>Label</label>
                    <input
                        style={inputStyle}
                        value={selectedNode.parameters?.label || ''}
                        onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                    />
                </div>

                {/* Dynamic Params based on ComponentDef */}
                {def.params?.map((param: any) => {
                    const value = selectedNode.parameters?.[param.key] ?? def.defaultParams?.[param.key];
                    return (
                        <div key={param.key} style={rowStyle}>
                            <label style={labelStyle}>{param.label || param.key}</label>

                            {(param.type === 'int' || param.type === 'float') && (
                                <input
                                    type="number" style={inputStyle}
                                    value={value as number}
                                    min={param.min} max={param.max}
                                    onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                                />
                            )}

                            {param.type === 'string' && param.options && (
                                <select
                                    style={inputStyle}
                                    value={value as string}
                                    onChange={(e) => handleParamChange(param.key, e.target.value)}
                                >
                                    {param.options.map((opt: any) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {param.type === 'bool' && (
                                <input
                                    type="checkbox"
                                    checked={value as boolean}
                                    onChange={(e) => handleParamChange(param.key, e.target.checked)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
    width: 250, height: '100%', background: '#0D0F16', color: '#CBD5E1',
    borderLeft: '1px solid #1E293B', display: 'flex', flexDirection: 'column',
    fontFamily: "'Inter', sans-serif"
};

const headerStyle: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid #1E293B',
    fontWeight: 600, fontSize: 13, letterSpacing: '0.05em',
    textTransform: 'uppercase', color: '#F1F5F9'
};

const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, fontSize: 12
};

const labelStyle: React.CSSProperties = {
    color: '#94A3B8'
};

const inputStyle: React.CSSProperties = {
    background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155',
    borderRadius: 4, padding: '4px 8px', fontSize: 12, width: 120, outline: 'none'
};
