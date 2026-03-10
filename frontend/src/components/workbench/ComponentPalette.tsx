/**
 * components/workbench/ComponentPalette.tsx — Component Library Panel
 *
 * Left panel: grouped, searchable, draggable gate tiles.
 * Dragging a tile initiates a drop onto CircuitCanvas.
 */

import React, { useState, useCallback } from 'react';
import { GateTile } from './GateTile';

// ── Palette Registry ──────────────────────────────────────────────────────

interface PaletteItem {
    typeId: string;
    label: string;
    symbol: string;
    color: string;
    tpdHL?: number;
    tpdLH?: number;
    description?: string;
}

interface PaletteSection {
    title: string;
    icon: string;
    items: PaletteItem[];
}

const SECTIONS: PaletteSection[] = [
    {
        title: 'Basic Gates',
        icon: '⛓',
        items: [
            { typeId: 'AND', label: 'AND', symbol: '&', color: '#00D4FF', tpdHL: 1.8, tpdLH: 2.1, description: 'Output HIGH only when ALL inputs are HIGH.' },
            { typeId: 'OR', label: 'OR', symbol: '≥1', color: '#10B981', tpdHL: 2.0, tpdLH: 1.9, description: 'Output HIGH when ANY input is HIGH.' },
            { typeId: 'NOT', label: 'NOT', symbol: '1', color: '#F59E0B', tpdHL: 0.9, tpdLH: 0.8, description: 'Inverts the single input.' },
            { typeId: 'NAND', label: 'NAND', symbol: '⊼', color: '#A78BFA', tpdHL: 0.9, tpdLH: 1.5, description: 'Universal gate. NOT-AND.' },
            { typeId: 'NOR', label: 'NOR', symbol: '⊽', color: '#F43F5E', tpdHL: 1.0, tpdLH: 1.8, description: 'Universal gate. NOT-OR.' },
            { typeId: 'XOR', label: 'XOR', symbol: '=1', color: '#FB923C', tpdHL: 2.5, tpdLH: 2.7, description: 'Output HIGH when inputs DIFFER.' },
            { typeId: 'XNOR', label: 'XNOR', symbol: '⊙', color: '#34D399', tpdHL: 2.6, tpdLH: 2.8, description: 'Output HIGH when inputs are EQUAL.' },
            { typeId: 'BUFFER', label: 'BUFFER', symbol: '→', color: '#60A5FA', tpdHL: 1.0, tpdLH: 1.0, description: 'Non-inverting buffer, high drive strength.' },
        ],
    },
    {
        title: 'I/O',
        icon: '💡',
        items: [
            { typeId: 'SWITCH_SPST', label: 'Switch', symbol: '⏻', color: '#64748B', description: 'Manual logic HIGH/LOW toggle.' },
            { typeId: 'PUSHBUTTON', label: 'Button', symbol: '⊓', color: '#64748B', description: 'Momentary push button.' },
            { typeId: 'BATTERY', label: 'VCC Source', symbol: '⚡', color: '#FCD34D', description: '5V logic supply.' },
            { typeId: 'GROUND', label: 'GND', symbol: '⏚', color: '#94A3B8', description: 'Ground reference.' },
            { typeId: 'LED', label: 'LED', symbol: '◉', color: '#EF4444', description: 'Lights when input is HIGH.' },
            { typeId: 'SEVEN_SEG', label: '7-Segment', symbol: '8', color: '#F59E0B', description: '7-segment display, active-high inputs.' },
        ],
    },
    {
        title: 'Sequential',
        icon: '🔄',
        items: [
            { typeId: 'D_FF', label: 'D Flip-Flop', symbol: 'D', color: '#818CF8', description: 'Rising-edge triggered D flip-flop.' },
            { typeId: 'SR_LATCH', label: 'SR Latch', symbol: 'SR', color: '#E879F9', description: 'Set-Reset latch.' },
            { typeId: 'JK_FF', label: 'JK Flip-Flop', symbol: 'JK', color: '#C084FC', description: 'JK flip-flop with toggle mode.' },
            { typeId: 'T_FF', label: 'T Flip-Flop', symbol: 'T', color: '#818CF8', description: 'Toggle flip-flop.' },
        ],
    },
    {
        title: 'Advanced',
        icon: '🧠',
        items: [
            { typeId: 'COMPARATOR', label: 'Comparator', symbol: '=?', color: '#06B6D4', description: '2-input magnitude comparator.' },
        ],
    },
];

// ── Component ─────────────────────────────────────────────────────────────

interface Props {
    onDragStart: (typeId: string, e: React.DragEvent) => void;
}

export const ComponentPalette: React.FC<Props> = ({ onDragStart }) => {
    const [query, setQuery] = useState('');
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

    const toggleSection = useCallback((title: string) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            next.has(title) ? next.delete(title) : next.add(title);
            return next;
        });
    }, []);

    const q = query.toLowerCase();
    const filtered: PaletteSection[] = SECTIONS.map(s => ({
        ...s,
        items: q
            ? s.items.filter(i => i.label.toLowerCase().includes(q) || i.typeId.toLowerCase().includes(q))
            : s.items,
    })).filter(s => s.items.length > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#0D0F16' }}>
            {/* Search */}
            <div style={{ padding: '12px 12px 8px' }}>
                <input
                    type="text"
                    placeholder="Search gates…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                        width: '100%', boxSizing: 'border-box',
                        background: '#1A1D24', border: '1px solid #222633',
                        borderRadius: 6, padding: '7px 10px',
                        color: '#E5E7EB', fontSize: 12,
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: 'none',
                    }}
                />
            </div>

            {/* Sections */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px 16px' }}>
                {filtered.map(section => (
                    <div key={section.title} style={{ marginBottom: 4 }}>
                        {/* Section header */}
                        <button
                            onClick={() => toggleSection(section.title)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '8px 10px 4px', color: '#64748B',
                                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}
                        >
                            <span>{section.icon}</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>{section.title}</span>
                            <span style={{ transition: 'transform 0.2s', transform: collapsed.has(section.title) ? 'rotate(-90deg)' : 'none' }}>
                                ▾
                            </span>
                        </button>

                        {/* Items */}
                        {!collapsed.has(section.title) && section.items.map(item => (
                            <GateTile
                                key={item.typeId}
                                {...item}
                                onDragStart={onDragStart}
                            />
                        ))}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ color: '#334155', fontSize: 11, textAlign: 'center', padding: '24px 16px' }}>
                        No components match "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};
