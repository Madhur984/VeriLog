import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { Battery, Switch, LED, AndGate, OrGate } from '../Gates/CircuitComponents';
import { BotMascot } from '../Mascot/BotMascot';

// Wrapper for draggable items in Tray
const DraggableItem = ({ type, children }: { type: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `tray-${type}`,
        data: { type, fromTray: true }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab hover:scale-105 transition-transform">
            {children}
        </div>
    );
};

// Drop Slot on Board
const CircuitSlot = ({ id, x, y, occupied }: { id: string, x: number, y: number, occupied?: boolean }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`absolute w-24 h-20 border-2 rounded-lg flex items-center justify-center transition-colors ${isOver ? 'border-cyan-400 bg-cyan-400/10' : 'border-dashed border-slate-600'
                } ${occupied ? 'border-solid border-slate-700 bg-slate-800' : ''}`}
            style={{ left: x, top: y }}
        >
            {!occupied && <span className="text-slate-600 text-xs">DROP HERE</span>}
        </div>
    );
};

export const SimulatorCanvas = () => {
    const [components, setComponents] = useState<any[]>([]); // Placed components
    const [dragActive, setDragActive] = useState(false);

    const handleDragEnd = (event: DragEndEvent) => {
        setDragActive(false);
        const { active, over } = event;

        if (over && active.data.current?.fromTray) {
            // Dropped from Tray to Slot
            const type = active.data.current.type;
            const slotId = over.id;

            // Check if slot is empty
            if (!components.find(c => c.slotId === slotId)) {
                const newComp = {
                    id: `${type}-${Date.now()}`,
                    type,
                    slotId: slotId,
                    state: { isOn: false }
                };
                setComponents(prev => [...prev, newComp]);
                // TODO: Update LogicEngine
            }
        }
    };

    // Render component based on type
    const renderComponent = (type: string, props: any) => {
        switch (type) {
            case 'BATTERY': return <Battery {...props} />;
            case 'SWITCH': return <Switch {...props} />;
            case 'LED': return <LED {...props} />;
            case 'AND_GATE': return <AndGate {...props} />;
            case 'OR_GATE': return <OrGate {...props} />;
            default: return <div className="text-white">{type}</div>;
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={() => setDragActive(true)}>
            <div className="w-full h-screen bg-slate-900 text-white overflow-hidden flex flex-col">

                {/* Workspace (Canvas) */}
                <div className="flex-1 relative bg-[url('/grid.svg')] bg-opacity-10">
                    {/* Static Slots for Activity 1 (Mock) */}
                    <CircuitSlot id="slot-1" x={100} y={200} occupied={!!components.find(c => c.slotId === 'slot-1')} />
                    <CircuitSlot id="slot-2" x={300} y={200} occupied={!!components.find(c => c.slotId === 'slot-2')} />
                    <CircuitSlot id="slot-3" x={500} y={200} occupied={!!components.find(c => c.slotId === 'slot-3')} />

                    {/* Placed Components */}
                    {components.map(comp => {
                        // Find slot position? For now simple offset
                        // In real app, we look up slot coords
                        const slotX = comp.slotId === 'slot-1' ? 100 : comp.slotId === 'slot-2' ? 300 : 500;
                        return (
                            <div key={comp.id} className="absolute" style={{ left: slotX, top: 200 }}>
                                {renderComponent(comp.type, { className: "w-20 h-16" })}
                            </div>
                        );
                    })}
                </div>

                {/* Component Tray */}
                <div className="h-32 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-8 z-40">
                    <DraggableItem type="BATTERY"><Battery className="w-16 h-12" /></DraggableItem>
                    <DraggableItem type="SWITCH"><Switch className="w-16 h-20" isOn={false} /></DraggableItem>
                    <DraggableItem type="LED"><LED className="w-12 h-12" /></DraggableItem>
                    <DraggableItem type="AND_GATE"><AndGate className="w-20 h-16" /></DraggableItem>
                    <DraggableItem type="OR_GATE"><OrGate className="w-20 h-16" /></DraggableItem>
                </div>

                {/* Drop Overlay */}
                <DragOverlay>
                    {dragActive ? <div className="w-16 h-12 bg-cyan-400 opacity-50 rounded"></div> : null}
                </DragOverlay>

                <BotMascot state="IDLE" message="Drag components to the board!" />
            </div>
        </DndContext>
    );
};
