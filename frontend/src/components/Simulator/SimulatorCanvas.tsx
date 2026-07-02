import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { Battery, Switch, LED, AndGate, OrGate } from '../Gates/CircuitComponents';
import { Info, Activity, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

// Wrapper for draggable items in Tray
const DraggableItem = ({ type, children }: { type: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `tray-${type}`,
        data: { type, fromTray: true }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab hover:scale-105 transition-transform bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
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
            className={cn(
                "absolute w-28 h-24 border-2 rounded-[24px] flex items-center justify-center transition-all",
                isOver 
                    ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100" 
                    : "border-dashed border-slate-200 bg-slate-50/50",
                occupied && "border-solid border-slate-200 bg-white shadow-sm"
            )}
            style={{ left: x, top: y }}
        >
            {!occupied && <span className="text-slate-300 text-[10px] font-black tracking-widest uppercase">Drop Node</span>}
        </div>
    );
};

export const SimulatorCanvas = () => {
    const [components, setComponents] = useState<any[]>([]); // Placed components
    const [dragActive, setDragActive] = useState(false);
    const [statusMessage] = useState("Drag components from the library to build your circuit.");

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
            default: return <div className="text-slate-900">{type}</div>;
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={() => setDragActive(true)}>
            <div className="w-full h-screen bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-sans relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="simulatorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#simulatorGrid)" />
                    </svg>
                </div>

                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between relative z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulator Phase</div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Circuit Prototyping</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                            <Activity size={14} className="text-sky-600" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Engine Active</span>
                        </div>
                    </div>
                </header>

                {/* Workspace (Canvas) */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full max-w-6xl mx-auto">
                        {/* Static Slots */}
                        <CircuitSlot id="slot-1" x={200} y={250} occupied={!!components.find(c => c.slotId === 'slot-1')} />
                        <CircuitSlot id="slot-2" x={450} y={250} occupied={!!components.find(c => c.slotId === 'slot-2')} />
                        <CircuitSlot id="slot-3" x={700} y={250} occupied={!!components.find(c => c.slotId === 'slot-3')} />

                        {/* Placed Components */}
                        {components.map(comp => {
                            const slotX = comp.slotId === 'slot-1' ? 200 : comp.slotId === 'slot-2' ? 450 : 700;
                            return (
                                <div key={comp.id} className="absolute" style={{ left: slotX, top: 250 }}>
                                    <div className="w-28 h-24 flex items-center justify-center bg-white rounded-[24px] shadow-xl border border-slate-100">
                                        {renderComponent(comp.type, { className: "w-20 h-16" })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Logic Analyst Overlay (Replacing Bot) */}
                    <div className="absolute bottom-40 right-12 w-80 bg-white p-6 rounded-[32px] border border-slate-200 shadow-2xl flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Info size={18} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Feed</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                            "{statusMessage}"
                        </p>
                    </div>
                </div>

                {/* Component Tray */}
                <div className="h-44 bg-white border-t border-slate-200 flex items-center justify-center gap-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    <DraggableItem type="BATTERY"><Battery className="w-16 h-12" /></DraggableItem>
                    <DraggableItem type="SWITCH"><Switch className="w-16 h-20" isOn={false} /></DraggableItem>
                    <DraggableItem type="LED"><LED className="w-12 h-12" /></DraggableItem>
                    <DraggableItem type="AND_GATE"><AndGate className="w-20 h-16" /></DraggableItem>
                    <DraggableItem type="OR_GATE"><OrGate className="w-20 h-16" /></DraggableItem>
                </div>

                {/* Drop Overlay */}
                <DragOverlay>
                    {dragActive ? (
                        <div className="w-28 h-24 bg-sky-500/20 border-2 border-sky-500 border-dashed rounded-[24px] animate-pulse" />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};
