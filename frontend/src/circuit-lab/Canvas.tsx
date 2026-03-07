import type React from 'react';
import type { CircuitComponent, WireSegment, AnchorPoint, Position } from './types';
import { Battery } from './components/Battery';
import { Resistor } from './components/Resistor';
import { Switch } from './components/Switch';
import { Bulb } from './components/Bulb';
import { Wire } from './components/Wire';
import { useDrag } from './hooks/useDrag';

const SNAP_RADIUS = 30;
const CANVAS_W = 1400;
const CANVAS_H = 900;

interface CanvasProps {
    components: CircuitComponent[];
    wires: WireSegment[];
    isCircuitClosed: boolean;
    liveWireIds: Set<string>;
    onUpdateComponent: (id: string, update: Partial<CircuitComponent>) => void;
    onToggleSwitch: (id: string) => void;
    onAddWire: (fromAnchorId: string, toAnchorId: string) => void;
    onConnectAnchors: (anchorId: string, targetAnchorId: string) => void;
    svgRef: React.RefObject<SVGSVGElement>;
}

// Helper: get world-space anchor position
function getWorldAnchor(comp: CircuitComponent, anchor: AnchorPoint) {
    return {
        worldX: comp.position.x + anchor.offset.x,
        worldY: comp.position.y + anchor.offset.y,
    };
}

// Individual draggable component wrapper
function DraggableComponent({
    component,
    components,
    isLive,
    liveWireIds: _liveWireIds,
    svgRef,
    onUpdateComponent,
    onToggleSwitch,
    onAddWire,
    onConnectAnchors,
}: {
    component: CircuitComponent;
    components: CircuitComponent[];
    isLive: boolean;
    liveWireIds: Set<string>;
    svgRef: React.RefObject<SVGSVGElement | null>;
    onUpdateComponent: (id: string, update: Partial<CircuitComponent>) => void;
    onToggleSwitch: (id: string) => void;
    onAddWire: (fromAnchorId: string, toAnchorId: string) => void;
    onConnectAnchors: (anchorId: string, targetAnchorId: string) => void;
}) {
    const isConnected = component.anchors.some((a) => a.connectedTo !== null);

    const { position, isDragging, dragHandlers, setPosition } = useDrag(
        component.position,
        {
            canvasBounds: svgRef,
            compId: component.id,
            components,
            onDragEnd: (finalPos) => {
                // Snap logic: find nearest unconnected anchor from other components
                for (const anchor of component.anchors) {
                    if (anchor.connectedTo !== null) continue;

                    const worldX = finalPos.x + anchor.offset.x;
                    const worldY = finalPos.y + anchor.offset.y;

                    let bestDist = SNAP_RADIUS;
                    let bestAnchor: AnchorPoint | null = null;
                    let bestCompId: string | null = null;

                    for (const other of components) {
                        if (other.id === component.id) continue;
                        for (const otherAnchor of other.anchors) {
                            if (otherAnchor.connectedTo !== null) continue;
                            const ox = other.position.x + otherAnchor.offset.x;
                            const oy = other.position.y + otherAnchor.offset.y;
                            const dist = Math.sqrt((worldX - ox) ** 2 + (worldY - oy) ** 2);
                            if (dist < bestDist) {
                                bestDist = dist;
                                bestAnchor = otherAnchor;
                                bestCompId = other.id;
                            }
                        }
                    }

                    if (bestAnchor && bestCompId) {
                        const targetComp = components.find((c) => c.id === bestCompId)!;
                        const targetWorldX = targetComp.position.x + bestAnchor.offset.x;
                        const targetWorldY = targetComp.position.y + bestAnchor.offset.y;
                        const snappedPos: Position = {
                            x: finalPos.x + (targetWorldX - worldX),
                            y: finalPos.y + (targetWorldY - worldY),
                        };
                        setPosition(snappedPos);
                        onUpdateComponent(component.id, { position: snappedPos });
                        onConnectAnchors(anchor.id, bestAnchor.id);
                        onAddWire(anchor.id, bestAnchor.id);
                        return;
                    }
                }

                onUpdateComponent(component.id, { position: finalPos });
            },
        }
    );

    const componentWithPos: CircuitComponent = { ...component, position };

    const sharedProps = {
        component: componentWithPos,
        isLive,
        onPointerDown: dragHandlers.onPointerDown,
        isDragging,
        // Animation data attributes passed through
        dataCompId: component.id,
        dataConnected: isConnected,
        dataDragging: isDragging,
        dataType: component.type,
        dataBaseX: position.x,
        dataBaseY: position.y,
    };

    switch (component.type) {
        case 'battery':
            return <Battery {...sharedProps} />;
        case 'resistor':
            return <Resistor {...sharedProps} />;
        case 'switch':
            return (
                <Switch
                    {...sharedProps}
                    onToggle={() => onToggleSwitch(component.id)}
                />
            );
        case 'bulb':
            return <Bulb {...sharedProps} />;
        default:
            return null;
    }
}

export function Canvas({
    components,
    wires,
    isCircuitClosed,
    liveWireIds,
    onUpdateComponent,
    onToggleSwitch,
    onAddWire,
    onConnectAnchors,
    svgRef,
}: CanvasProps) {
    // Precompute anchor world positions for wire rendering
    const anchorWorldMap = new Map<string, { worldX: number; worldY: number } & AnchorPoint>();
    for (const comp of components) {
        for (const anchor of comp.anchors) {
            anchorWorldMap.set(anchor.id, {
                ...anchor,
                ...getWorldAnchor(comp, anchor),
            });
        }
    }

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#0B1C2D',
            }}
        >
            <defs>
                {/* Grid pattern */}
                <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f2a3f" strokeWidth={0.5} />
                </pattern>
                <pattern id="gridLarge" width={200} height={200} patternUnits="userSpaceOnUse">
                    <rect width={200} height={200} fill="url(#grid)" />
                    <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#0f2f4a" strokeWidth={1} />
                </pattern>

                {/* Neon glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Bulb warm glow filter */}
                <filter id="bulbGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Bulb bloom */}
                <filter id="bulbBloom" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="18" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* ── NEW: Magnetic assist glow ── */}
                <filter id="magnetGlow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="0 0 0 0 0  0 0.75 0 0 1  0 0 1 0 1  0 0 0 1.2 0"
                        result="coloredBlur"
                    />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* ── NEW: Electron flow wire glow ── */}
                <filter id="electronGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="0 0 0 0 0  0 0.75 0 0 1  0 0 1 0 1  0 0 0 1.5 0"
                        result="coloredBlur"
                    />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Battery gradient */}
                <linearGradient id="battGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0d2a40" />
                    <stop offset="30%" stopColor="#1a4a6a" />
                    <stop offset="50%" stopColor="#1e5578" />
                    <stop offset="70%" stopColor="#1a4a6a" />
                    <stop offset="100%" stopColor="#0d2a40" />
                </linearGradient>

                {/* CSS animations */}
                <style>{`
          @keyframes snapPulse {
            0%, 100% { opacity: 0.3; r: 12; }
            50% { opacity: 0.8; r: 18; }
          }
          .snap-ring { animation: snapPulse 1s ease-in-out infinite; }
          @keyframes bulbPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          .bulb-live { animation: bulbPulse 1.5s ease-in-out infinite; }
        `}</style>
            </defs>

            {/* Blueprint grid */}
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#gridLarge)" />

            {/* Particle field container — inserted by ParticleField module */}
            <g id="cl-particles" pointerEvents="none" />

            {/* Corner crosshairs */}
            {[[60, 60], [CANVAS_W - 60, 60], [60, CANVAS_H - 60], [CANVAS_W - 60, CANVAS_H - 60]].map(
                ([cx, cy], i) => (
                    <g key={i} opacity={0.15}>
                        <line x1={cx - 15} y1={cy} x2={cx + 15} y2={cy} stroke="#00BFFF" strokeWidth={1} />
                        <line x1={cx} y1={cy - 15} x2={cx} y2={cy + 15} stroke="#00BFFF" strokeWidth={1} />
                        <circle cx={cx} cy={cy} r={4} fill="none" stroke="#00BFFF" strokeWidth={1} />
                    </g>
                )
            )}

            {/* Canvas title */}
            <text x={CANVAS_W / 2} y={28} textAnchor="middle" fill="#0e3a57" fontSize={11} fontFamily="'Courier New', monospace" letterSpacing={3}>
                ◈ CIRCUIT LAB CANVAS ◈
            </text>

            {/* Wires — tagged with data-wire-id for electron flow animator */}
            {wires.map((wire) => {
                const fromAnchor = anchorWorldMap.get(wire.fromAnchorId);
                const toAnchor = anchorWorldMap.get(wire.toAnchorId);
                if (!fromAnchor || !toAnchor) return null;
                return (
                    <g key={wire.id} data-wire-group={wire.id}>
                        <Wire
                            wire={wire}
                            from={fromAnchor}
                            to={toAnchor}
                            isLive={isCircuitClosed && liveWireIds.has(wire.id)}
                            wireId={wire.id}
                        />
                    </g>
                );
            })}

            {/* Components — tagged with data-comp-id, data-type, data-base-x/y etc. */}
            {components.map((comp) => (
                <DraggableComponent
                    key={comp.id}
                    component={comp}
                    components={components}
                    isLive={isCircuitClosed}
                    liveWireIds={liveWireIds}
                    svgRef={svgRef}
                    onUpdateComponent={onUpdateComponent}
                    onToggleSwitch={onToggleSwitch}
                    onAddWire={onAddWire}
                    onConnectAnchors={onConnectAnchors}
                />
            ))}

            {/* Live circuit ambient overlay */}
            {isCircuitClosed && (
                <rect
                    width={CANVAS_W}
                    height={CANVAS_H}
                    fill="rgba(0,191,255,0.015)"
                    pointerEvents="none"
                />
            )}
        </svg>
    );
}
