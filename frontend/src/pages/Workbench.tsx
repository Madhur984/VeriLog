/**
 * pages/Workbench.tsx — Logisim Integrated Workbench
 *
 * Renders the Logisim application via an iframe within the VeriLog shell.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogisimWorkbench } from '../components/workbench/LogisimWorkbench';

export function Workbench() {
    const navigate = useNavigate();
    const [circuitData, setCircuitData] = useState<string | undefined>();

    // This is where you could wire up your storage to load circuits
    const handleLoadExample = () => {
        // Example mock postMessage payload
        const exampleJSON = `{ "example": "data" }`; 
        setCircuitData(exampleJSON);
    };

    return (
        <div className="wb-root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#07080C' }}>
            {/* ── Toolbar ────────────────────────────────────────────────────── */}
            <div className="wb-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 12px', height: 44, borderBottom: '1px solid #1A1D24', background: '#0D0F16', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#00D4FF', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 12 }}>
                    ⚡ VeriLog Workbench (Logisim Engine)
                </span>

                <button onClick={handleLoadExample} style={toolBtnStyle}>Load Example JSON</button>

                <div style={{ flex: 1 }} />

                <button onClick={() => navigate(-1)} style={toolBtnStyle}>← Back to Dashboard</button>
            </div>

            {/* ── Main Area ──────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <LogisimWorkbench 
                    circuitData={circuitData}
                    onCircuitLoaded={(success) => console.log('Logisim loaded:', success)}
                />
            </div>
        </div>
    );
}

const toolBtnStyle: React.CSSProperties = {
    background: 'none', border: '1px solid transparent', borderRadius: 4,
    color: '#64748B', cursor: 'pointer', padding: '3px 10px',
    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.15s',
};

