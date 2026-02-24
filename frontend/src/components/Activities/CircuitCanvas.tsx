import React, { useRef, useEffect } from 'react';
import { LabBattery, LabBulb, LabResistor, LabSwitch } from './CircuitComponent';
import { SnapNodeVisual } from './SnapNodeVisual';
import { CompType } from '../../engine/types';

import { useDragEngineContext as useEngine } from '../../contexts/DragEngineContext';

// ─────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────
interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    isOpen?: boolean;
    connectedNodes: string[];
}

interface CircuitCanvasProps {
    components: ComponentInstance[];
    setComponents: React.Dispatch<React.SetStateAction<ComponentInstance[]>>;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
    components,
    setComponents,
}) => {
    // UI Effects State (Keeping local for transient visuals)
    // Actually, I'll move effects to the parent if I want them to trigger on dropped items
    // But local is fine for now as long as we have a way to trigger them.

    // SVG Refs for Drag Engine (Bypass Render)
    const svgRef = useRef<SVGSVGElement>(null);
    const ghostRef = useRef<SVGGElement>(null);

    const engine = useEngine();

    // Link engine to refs
    useEffect(() => {
        engine.setRefs(svgRef.current, ghostRef.current);
    }, [engine]);

    // Handle SVG Global Pointer Events
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
            active: true,
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
        <div className="relative w-full h-[600px] bg-[#0A0F1E] rounded-3xl overflow-hidden border border-[#1E293B] shadow-2xl">
            {/* Blueprint Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

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
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    <linearGradient id="snapActiveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D2FF" />
                        <stop offset="100%" stopColor="#0080FF" />
                    </linearGradient>
                </defs>

                {/* Snap Nodes Layer */}
                {snapNodes.map(node => (
                    <SnapNodeVisual
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        occupied={components.some(c => c.connectedNodes.includes(node.id))}
                        isNearest={engine.nearestSnap?.id === node.id}
                        magneticForce={engine.magneticForce}
                    />
                ))}

                {/* Static Components Layer */}
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
                        stroke="#00D2FF"
                        strokeWidth={0.5}
                        strokeDasharray="2 4"
                        opacity={engine.magneticForce * 0.4}
                    />
                )}
            </svg>
        </div>
    );
};
