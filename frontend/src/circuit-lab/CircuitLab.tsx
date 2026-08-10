import { useState, useCallback, useEffect, useRef } from 'react';
import type { CircuitComponent, WireSegment, ComponentType, AnchorPoint } from './types';
import { Canvas } from './Canvas';
import { useCircuitGraph } from './hooks/useCircuitGraph';
import { animController } from './animations/animationController';
import { FloatAnimator } from './animations/floatAnimator';
import { MagneticAssist } from './animations/magneticAssist';
import { ElectronFlow } from './animations/electronFlow';
import { ActivationPulse } from './animations/activationPulse';
import { ParticleField } from './animations/particleField';
import { ShortCircuit } from './animations/shortCircuit';

// ─────────────────────────────────────────────────────────────────────────────
// Anchor factory helpers
// ─────────────────────────────────────────────────────────────────────────────
function makeAnchors(type: ComponentType, compId: string): AnchorPoint[] {
    switch (type) {
        case 'battery':
            return [
                { id: `${compId}-pos`, offset: { x: 0, y: -52 }, connectedTo: null, role: 'positive' },
                { id: `${compId}-neg`, offset: { x: 0, y: 52 }, connectedTo: null, role: 'negative' },
            ];
        case 'resistor':
            return [
                { id: `${compId}-in`, offset: { x: -34, y: 0 }, connectedTo: null, role: 'in' },
                { id: `${compId}-out`, offset: { x: 34, y: 0 }, connectedTo: null, role: 'out' },
            ];
        case 'switch':
            return [
                { id: `${compId}-in`, offset: { x: -44, y: 0 }, connectedTo: null, role: 'in' },
                { id: `${compId}-out`, offset: { x: 44, y: 0 }, connectedTo: null, role: 'out' },
            ];
        case 'bulb':
            return [
                { id: `${compId}-in`, offset: { x: -14, y: 28 }, connectedTo: null, role: 'in' },
                { id: `${compId}-out`, offset: { x: 14, y: 28 }, connectedTo: null, role: 'out' },
            ];
    }
}

function createComponent(type: ComponentType, position = { x: 200, y: 300 }): CircuitComponent {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    return {
        id,
        type,
        position,
        anchors: makeAnchors(type, id),
        isClosed: type === 'switch' ? false : undefined,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Tray Item
// ─────────────────────────────────────────────────────────────────────────────
const TRAY_ITEMS: { type: ComponentType; label: string; icon: string; desc: string }[] = [
    { type: 'battery', label: 'Battery', icon: '⚡', desc: 'EMF Source' },
    { type: 'resistor', label: 'Resistor', icon: '≈', desc: 'Load / Ohmic' },
    { type: 'switch', label: 'Switch', icon: '⏻', desc: 'Toggle Gate' },
    { type: 'bulb', label: 'Bulb', icon: '◉', desc: 'Light Indicator' },
];

function TrayItem({ type, label, icon, desc, onAdd }: {
    type: ComponentType;
    label: string;
    icon: string;
    desc: string;
    onAdd: (type: ComponentType) => void;
}) {
    return (
        <button
            className="tray-item"
            onClick={() => onAdd(type)}
            aria-label={`Add ${label}`}
            title={`Click to add ${label} to canvas`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,191,255,0.04)',
                border: '1px solid rgba(0,191,255,0.15)',
                borderRadius: 8,
                cursor: 'pointer',
                color: '#a0c8e8',
                transition: 'all 0.2s ease',
                marginBottom: 8,
                textAlign: 'left',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,191,255,0.12)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,191,255,0.5)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,191,255,0.2), inset 0 0 8px rgba(0,191,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = '#00BFFF';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,191,255,0.04)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,191,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.color = '#a0c8e8';
            }}
        >
            <span style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
            <span style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5, marginTop: 2 }}>{desc}</div>
            </span>
            <span style={{ opacity: 0.4, fontSize: 12 }}>+</span>
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CircuitLab Page
// ─────────────────────────────────────────────────────────────────────────────
export function CircuitLab({ onCircuitComplete, standalone = true }: {
    onCircuitComplete?: () => void;
    standalone?: boolean;
}) {
    const [components, setComponents] = useState<CircuitComponent[]>([]);
    const [wires, setWires] = useState<WireSegment[]>([]);

    const { isCircuitClosed, isShortCircuit, liveWireIds } = useCircuitGraph(components, wires);

    // ── Promoted svgRef so we can pass it to animController ──
    const svgRef = useRef<SVGSVGElement>(null);

    // ── Animation controller bootstrap ──────────────────────────────────────
    useEffect(() => {
        animController.register(new FloatAnimator());
        animController.register(new MagneticAssist());
        animController.register(new ElectronFlow());
        animController.register(new ActivationPulse());
        animController.register(new ParticleField());
        animController.register(new ShortCircuit());

        if (svgRef.current) animController.init(svgRef.current);

        return () => animController.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Emit circuit state changes to animation event bus ───────────────────
    const prevClosed = useRef<boolean | null>(null);
    const prevShort = useRef<boolean | null>(null);

    useEffect(() => {
        if (prevClosed.current === isCircuitClosed) return;
        prevClosed.current = isCircuitClosed;
        if (isCircuitClosed) {
            animController.emit('circuit:closed', {
                liveWireIds: [...liveWireIds],
            });
            if (onCircuitComplete) onCircuitComplete();
        } else {
            animController.emit('circuit:opened', {});
        }
    }, [isCircuitClosed, liveWireIds]);

    useEffect(() => {
        if (prevShort.current === isShortCircuit) return;
        prevShort.current = isShortCircuit;
        if (isShortCircuit) {
            animController.emit('circuit:short', {});
        } else {
            animController.emit('circuit:short:cleared', {});
        }
    }, [isShortCircuit]);

    const addComponent = useCallback((type: ComponentType) => {
        // Stagger new components so they don't stack exactly
        const offset = components.length * 30;
        const defaultPos: Record<ComponentType, { x: number; y: number }> = {
            battery: { x: 200 + offset, y: 280 + offset * 0.3 },
            resistor: { x: 580 + offset, y: 280 + offset * 0.3 },
            switch: { x: 390 + offset, y: 440 + offset * 0.3 },
            bulb: { x: 760 + offset, y: 280 + offset * 0.3 },
        };
        setComponents((prev) => [...prev, createComponent(type, defaultPos[type])]);
    }, [components.length]);

    const updateComponent = useCallback((id: string, update: Partial<CircuitComponent>) => {
        setComponents((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...update } : c))
        );
    }, []);

    const toggleSwitch = useCallback((id: string) => {
        setComponents((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isClosed: !c.isClosed } : c))
        );
        // Remove wires connected to this switch when opened (to break circuit)
    }, []);

    const connectAnchors = useCallback((anchorId: string, targetAnchorId: string) => {
        setComponents((prev) =>
            prev.map((comp) => ({
                ...comp,
                anchors: comp.anchors.map((a) => {
                    if (a.id === anchorId) return { ...a, connectedTo: targetAnchorId };
                    if (a.id === targetAnchorId) return { ...a, connectedTo: anchorId };
                    return a;
                }),
            }))
        );
    }, []);

    const addWire = useCallback((fromAnchorId: string, toAnchorId: string) => {
        const id = `wire-${fromAnchorId}-${toAnchorId}`;
        setWires((prev) => {
            // Prevent duplicate wires
            if (prev.some((w) => w.fromAnchorId === fromAnchorId && w.toAnchorId === toAnchorId)) {
                return prev;
            }
            return [...prev, { id, fromAnchorId, toAnchorId, isLive: false }];
        });
    }, []);

    const clearCanvas = useCallback(() => {
        setComponents([]);
        setWires([]);
    }, []);

    const componentCount = components.length;
    const wireCount = wires.length;

    return (
        <div
            style={{
                display: 'flex',
                height: standalone ? '100vh' : '500px',
                width: standalone ? '100vw' : '100%',
                background: standalone ? '#070f1a' : 'rgba(0,0,0,0.2)',
                fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
                overflow: 'hidden',
                borderRadius: standalone ? 0 : 24,
                border: standalone ? 'none' : '2px dashed rgba(30,41,59,1)',
            }}
        >
            {/* ── Left Panel ── */}
            <aside
                style={{
                    width: 220,
                    flexShrink: 0,
                    background: 'linear-gradient(180deg, #0a1929 0%, #071320 100%)',
                    borderRight: '1px solid rgba(0,191,255,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 0 16px 0',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.6)',
                    zIndex: 10,
                }}
            >
                {/* Panel header */}
                <div
                    style={{
                        padding: '20px 16px 16px',
                        borderBottom: '1px solid rgba(0,191,255,0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: '#00BFFF', fontSize: 16 }}>◈</span>
                        <span style={{ color: '#00BFFF', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>
                            VERILOG
                        </span>
                    </div>
                    <div style={{ color: '#2a6e8a', fontSize: 9, letterSpacing: 2, marginLeft: 24 }}>
                        CIRCUIT LAB v1.0
                    </div>
                </div>

                {/* Section label */}
                <div style={{ padding: '14px 16px 8px', color: '#2a6e8a', fontSize: 9, letterSpacing: 2 }}>
                    COMPONENTS
                </div>

                {/* Component tray */}
                <div style={{ padding: '0 12px', flex: 1 }}>
                    {TRAY_ITEMS.map((item) => (
                        <TrayItem key={item.type} {...item} onAdd={addComponent} />
                    ))}
                </div>

                {/* Stats */}
                <div
                    style={{
                        margin: '12px',
                        padding: '12px',
                        background: 'rgba(0,191,255,0.04)',
                        border: '1px solid rgba(0,191,255,0.1)',
                        borderRadius: 6,
                    }}
                >
                    <div style={{ color: '#2a6e8a', fontSize: 8, letterSpacing: 2, marginBottom: 8 }}>CIRCUIT STATS</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#4a8caa', fontSize: 10 }}>Components</span>
                        <span style={{ color: '#00BFFF', fontSize: 10, fontWeight: 700 }}>{componentCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#4a8caa', fontSize: 10 }}>Wires</span>
                        <span style={{ color: '#00BFFF', fontSize: 10, fontWeight: 700 }}>{wireCount}</span>
                    </div>
                    {/* Clear button */}
                    <button
                        onClick={clearCanvas}
                        style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 4,
                            color: '#f87171',
                            fontSize: 9,
                            letterSpacing: 1,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)')}
                    >
                        CLEAR CANVAS
                    </button>
                </div>

                {/* Circuit status */}
                <div
                    style={{
                        margin: '0 12px',
                        padding: '10px 12px',
                        background: isShortCircuit
                            ? 'rgba(239,68,68,0.1)'
                            : isCircuitClosed
                                ? 'rgba(0,191,255,0.08)'
                                : 'rgba(0,0,0,0.3)',
                        border: `1px solid ${isShortCircuit ? 'rgba(239,68,68,0.5)' : isCircuitClosed ? 'rgba(0,191,255,0.4)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 6,
                        textAlign: 'center',
                        boxShadow: isShortCircuit
                            ? '0 0 16px rgba(239,68,68,0.2)'
                            : isCircuitClosed
                                ? '0 0 16px rgba(0,191,255,0.15)'
                                : 'none',
                        transition: 'all 0.5s ease',
                    }}
                >
                    <div
                        style={{
                            fontSize: 16,
                            marginBottom: 4,
                            filter: isShortCircuit
                                ? 'drop-shadow(0 0 6px #ef4444)'
                                : isCircuitClosed
                                    ? 'drop-shadow(0 0 6px #00BFFF)'
                                    : 'none',
                            transition: 'filter 0.5s ease',
                        }}
                    >
                        {isShortCircuit ? '⚠' : isCircuitClosed ? '⚡' : '○'}
                    </div>
                    <div
                        style={{
                            fontSize: 9,
                            letterSpacing: 1.5,
                            color: isShortCircuit ? '#f87171' : isCircuitClosed ? '#00BFFF' : '#2A2D35',
                            fontWeight: 700,
                            transition: 'color 0.5s ease',
                        }}
                    >
                        {isShortCircuit ? 'SHORT CIRCUIT' : isCircuitClosed ? 'LOOP COMPLETE' : 'OPEN CIRCUIT'}
                    </div>
                </div>
            </aside>

            {/* ── Canvas Area ── */}
            <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Top bar */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 36,
                        background: '#070F1A',
                        borderBottom: '1px solid rgba(0,191,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        zIndex: 5,
                    }}
                >
                    <span style={{ color: '#1a4a6a', fontSize: 9, letterSpacing: 3 }}>
                        DRAG COMPONENTS FROM PANEL → DROP ON CANVAS → CONNECT ANCHORS TO BUILD CIRCUIT
                    </span>
                    <span style={{ marginLeft: 'auto', color: '#00BFFF', fontSize: 9, opacity: 0.5 }}>
                        SNAP RADIUS: 30px
                    </span>
                </div>

                {/* SVG Canvas */}
                <div style={{ position: 'absolute', inset: 36, top: 36 }}>
                    <Canvas
                        components={components}
                        wires={wires}
                        isCircuitClosed={isCircuitClosed}
                        liveWireIds={liveWireIds}
                        onUpdateComponent={updateComponent}
                        onToggleSwitch={toggleSwitch}
                        onAddWire={addWire}
                        onConnectAnchors={connectAnchors}
                        svgRef={svgRef}
                    />
                </div>

                {/* ── Logic Analyst Short-Circuit Overlay ── */}
                {/* Controlled directly by ShortCircuit AnimModule via DOM (id lookup) */}
                <div
                    id="Analyst-short-overlay"
                    style={{
                        display: 'none',
                        position: 'absolute',
                        top: 44,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 50,
                        background: '#1F1315',
                        border: '1px solid rgba(239,68,68,0.4)',
                        borderRadius: 8,
                        padding: '10px 20px',
                        alignItems: 'center',
                        gap: 12,
                        pointerEvents: 'none',
                        minWidth: 280,
                    }}
                    aria-live="assertive"
                    aria-label="Warning: Short circuit detected"
                >
                    <span style={{ fontSize: 20, color: '#ef4444' }}>⚠</span>
                    <div>
                        <div style={{
                            color: '#fca5a5',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 2,
                            fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
                        }}>LOGIC ANALYST WARNING</div>
                        <div style={{
                            color: 'rgba(252,165,165,0.7)',
                            fontSize: 10,
                            letterSpacing: 1,
                            marginTop: 2,
                            fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
                        }}>
                            Direct path detected. No load in loop. Danger.
                        </div>
                    </div>
                </div>

                {/* Empty state hint */}
                {components.length === 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            top: 36,
                        }}
                    >
                        <div style={{ color: '#0f2a3f', fontSize: 64, marginBottom: 16, lineHeight: 1 }}>◈</div>
                        <div style={{ color: '#0f2a3f', fontSize: 13, letterSpacing: 3, marginBottom: 8 }}>
                            CIRCUIT CANVAS READY
                        </div>
                        <div style={{ color: '#0c2030', fontSize: 10, letterSpacing: 2 }}>
                            ADD COMPONENTS FROM THE LEFT PANEL
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
