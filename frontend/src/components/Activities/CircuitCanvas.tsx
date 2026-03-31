import React, { useRef, useEffect } from 'react';
import { LabBattery, LabBulb, LabResistor, LabSwitch } from './CircuitComponent';
import { SnapNodeVisual } from './SnapNodeVisual';
import { type CompType } from '../../hooks/useDragEngine';

import { useDragEngineContext as useEngine } from '../../contexts/DragEngineContext';

// ─────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────
interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    rotation?: number;
    anchors?: unknown[];
    state?: Record<string, unknown>;
    isOpen?: boolean;
    snapNodeIds: string[];
}

interface CircuitCanvasProps {
    components: ComponentInstance[];
    setComponents: React.Dispatch<React.SetStateAction<ComponentInstance[]>>;
    isCircuitClosed?: boolean;
}

const StaticWire: React.FC<{ d: string; active?: boolean }> = ({ d, active }) => (
    <g>
        {/* Base Wire */}
        <path
            d={d}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d={d}
            fill="none"
            stroke="#94A3B8"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Active Flow */}
        {active && (
            <>
                <path
                    d={d}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-60 blur-md"
                />
                <path
                    d={d}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="16 16"
                    className="animate-[dash_1s_linear_infinite]"
                />
            </>
        )}
    </g>
);

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
    components,
    setComponents,
    isCircuitClosed = false
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const ghostRef = useRef<SVGGElement>(null);

    const engine = useEngine();

    useEffect(() => {
        engine.setRefs(svgRef.current, ghostRef.current);
    }, [engine]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (engine.isDragging) {
            engine.updateCursor(e);
        }
    };

    const handlePointerUp = () => {
        if (engine.isDragging) {
            engine.endDrag();
        }
    };

    const toggleSwitch = (id: string) => {
        setComponents(prev => prev.map(c =>
            c.id === id ? { ...c, isOpen: !c.isOpen } : c
        ));
    };

    const renderComponent = (comp: ComponentInstance) => {
        const componentProps = {
            id: comp.id,
            x: comp.x,
            y: comp.y,
            active: isCircuitClosed, // Pass active state down!
            isDragging: false,
        };

        const content = (() => {
            switch (comp.type) {
                case 'battery': return <LabBattery {...componentProps} />;
                case 'bulb': return <LabBulb {...componentProps} />;
                case 'resistor': return <LabResistor {...componentProps} />;
                case 'switch': return <LabSwitch {...componentProps} isOpen={!!comp.isOpen} />;
                default: return null;
            }
        })();

        return (
            <g
                key={comp.id}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    engine.startCanvasDrag(comp.id, comp.type, comp.x, comp.y, e);
                    (e.currentTarget as Element).setPointerCapture(e.pointerId);
                }}
                className="cursor-grab active:cursor-grabbing"
            >
                {content}
                {comp.type === 'switch' && (
                    <circle
                        cx={comp.x} cy={comp.y} r={25}
                        fill="transparent"
                        className="cursor-pointer"
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            toggleSwitch(comp.id);
                        }}
                    />
                )}
            </g>
        );
    };

    const snapNodes = engine.snapGrid.getAll();

    return (
        <div className="relative w-full h-[600px] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
            {/* Blueprint Grid */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#F1F5F9 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

            <style>{`
                @keyframes dash {
                    to { stroke-dashoffset: -32; }
                }
            `}</style>

            <svg
                ref={svgRef}
                viewBox="0 0 800 600"
                className="w-full h-full select-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <defs>
                    <linearGradient id="snapIdleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="snapActiveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                </defs>

                {/* Pre-traced Wires */}
                {/* Battery is at (200, 300) so nodes are (200, 260) and (200, 340) */}

                {/* Wire 1: Battery to Switch (Switch node left is 370, 150) */}
                <StaticWire d="M200,260 L200,150 L370,150" active={isCircuitClosed} />

                {/* Wire 2: Switch to Bulb (Switch node right is 430, 150, Bulb node left is 572, 300) */}
                <StaticWire d="M430,150 L572,150 L572,300" active={isCircuitClosed} />

                {/* Wire 3: Bulb to Battery (Bulb node right is 628, 300, Battery node bottom is 200, 340) */}
                <StaticWire d="M628,300 L628,450 L200,450 L200,340" active={isCircuitClosed} />

                {/* Snap Nodes Layer */}
                {snapNodes.map(node => (
                    <SnapNodeVisual
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        occupied={components.some(c => c.snapNodeIds.includes(node.id))}
                        isNearest={engine.nearestSnap?.id === node.id}
                        magneticForce={engine.magneticForce}
                    />
                ))}

                {/* Static Battery */}
                <LabBattery id="static-battery" x={200} y={300} active={isCircuitClosed} isDragging={false} />

                {/* Draggable Components Layer */}
                {components.map(renderComponent)}

                {/* Ghost Preview Layer (Direct DOM controlled) */}
                <g ref={ghostRef} style={{ pointerEvents: 'none', visibility: engine.isDragging ? 'visible' : 'hidden' }}>
                    {engine.isDragging && engine.dragType && (() => {
                        const ghostProps = { x: 0, y: 0, id: 'ghost', isGhost: true };
                        switch (engine.dragType) {
                            case 'battery': return <LabBattery {...ghostProps} />;
                            case 'bulb': return <LabBulb {...ghostProps} />;
                            case 'resistor': return <LabResistor {...ghostProps} />;
                            case 'switch': return <LabSwitch {...ghostProps} isOpen={false} />;
                            default: return null;
                        }
                    })()}
                </g>

                {/* Attraction Pulse / Glow */}
                {engine.isDragging && engine.nearestSnap && engine.magneticForce > 0.3 && (
                    <circle
                        cx={engine.nearestSnap.x}
                        cy={engine.nearestSnap.y}
                        r={engine.magneticForce * 40}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth={0.5}
                        strokeDasharray="2 4"
                        opacity={engine.magneticForce * 0.4}
                    />
                )}
            </svg>
        </div>
    );
};
