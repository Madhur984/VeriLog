/**
 * components/workbench/SubcircuitModal.tsx
 *
 * A modal dialog that allows the user to save the current canvas 
 * as a reusable Subcircuit in the Component Library.
 */

import React, { useState } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { defineSubcircuit } from '../../engine/Subcircuit';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const SubcircuitModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');

    // Store access
    const nodes = useWorkbenchStore(s => Array.from(s.nodes.values()));
    const segments = useWorkbenchStore(s => Array.from(s.segments.values()));

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;

        // Generate a unique ID for this component type
        const typeId = `SUBCIRCUIT_${name.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`;

        // Register the new subcircuit in the engine
        defineSubcircuit(typeId, name, nodes, segments);

        // Optionally clear the canvas to start fresh
        // clearCanvas();

        onClose();
        setName('');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)'
        }}>
            <div style={{
                background: '#1E293B', padding: 24, borderRadius: 8, width: 400,
                color: '#F8FAFC', fontFamily: "'Inter', sans-serif"
            }}>
                <h2 style={{ marginTop: 0, fontSize: 18, color: '#38BDF8' }}>Create Subcircuit</h2>
                <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
                    Save the current circuit as a reusable component. Inputs and outputs will be automatically detected from Pins, Buttons, and LEDs.
                </p>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: '#CBD5E1' }}>
                        Subcircuit Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        placeholder="e.g. 4-bit Adder"
                        style={{
                            width: '100%', padding: '8px 12px', borderRadius: 4,
                            background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC',
                            outline: 'none', fontSize: 14
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
                            background: 'transparent', border: '1px solid #475569', color: '#94A3B8',
                            fontSize: 13, fontWeight: 500
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        style={{
                            padding: '8px 16px', borderRadius: 4, cursor: name.trim() ? 'pointer' : 'not-allowed',
                            background: name.trim() ? '#3B82F6' : '#1E3A8A', border: 'none', color: '#F8FAFC',
                            fontSize: 13, fontWeight: 600
                        }}
                    >
                        Save Subcircuit
                    </button>
                </div>
            </div>
        </div>
    );
};
