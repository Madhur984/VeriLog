/**
 * components/workbench/ComponentLibrary.tsx
 *
 * Left panel. Displays foldable categories of components.
 * Components are draggable onto the CircuitCanvas.
 */

import React, { useState } from 'react';
import { getComponentsByCategory } from '../../engine/ComponentDef';

const categoriesOrder = ['Wiring', 'Gates', 'Plexers', 'Memory', 'I/O', 'Subcircuit'];

export const ComponentLibrary: React.FC = () => {
    const categoryMap = getComponentsByCategory();
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        Wiring: true,
        Gates: true,
    });

    const toggleCategory = (cat: string) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const handleDragStart = (e: React.DragEvent, typeId: string) => {
        e.dataTransfer.setData('application/verilog-gate', typeId);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div style={{
            width: 250, height: '100%', background: '#0D0F16', color: '#CBD5E1',
            borderRight: '1px solid #1E293B', display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1E293B', fontWeight: 600, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#F1F5F9' }}>
                Circuit Elements
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {categoriesOrder.map(cat => {
                    const comps = categoryMap.get(cat);
                    if (!comps || comps.length === 0) return null;
                    const isOpen = openCategories[cat];

                    return (
                        <div key={cat} style={{ borderBottom: '1px solid #1A1D24' }}>
                            <div
                                onClick={() => toggleCategory(cat)}
                                style={{
                                    padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    fontSize: 13, fontWeight: 500, background: isOpen ? '#11141D' : 'transparent',
                                    color: isOpen ? '#38BDF8' : '#94A3B8'
                                }}
                            >
                                <span style={{ marginRight: 8, fontSize: 10, transform: `rotate(${isOpen ? 90 : 0}deg)`, transition: 'transform 0.1s' }}>▶</span>
                                {cat}
                            </div>

                            {isOpen && (
                                <div style={{ background: '#07080C', padding: '4px 0' }}>
                                    {comps.map(def => (
                                        <div
                                            key={def.type}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, def.type)}
                                            style={{
                                                padding: '6px 16px 6px 32px', fontSize: 12, cursor: 'grab',
                                                display: 'flex', alignItems: 'center', color: '#CBD5E1'
                                            }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1E293B'; (e.currentTarget as HTMLElement).style.color = '#F8FAFC'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#CBD5E1'; }}
                                        >
                                            <span style={{ marginRight: 8, color: '#3B82F6' }}>⚙</span>
                                            {def.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
