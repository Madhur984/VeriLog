import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitCanvas } from '../components/Activities/CircuitCanvas';
import { VoltMonkey, MonkeyState } from '../components/Bot/VoltMonkey';
import { SpeechBubble } from '../components/Bot/SpeechBubble';
import { Zap, Lightbulb, Activity, MousePointer2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DragEngineProvider, useDragEngineContext } from '../contexts/DragEngineContext';
import { CompType, DropResult } from '../engine/types';
import { SnapGrid } from '../engine/SnapGrid';
import { DropRipple, RejectFlash } from '../components/Activities/DropEffects';

interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    isOpen?: boolean;
    connectedNodes: string[];
}

interface ActivityLevel1Props {
    onComplete: () => void;
}

const INITIAL_COMPONENTS: ComponentInstance[] = [
    { id: 'batt-1', type: 'battery', x: 160, y: 280, connectedNodes: [] },
    { id: 'switch-1', type: 'switch', x: 410, y: 145, isOpen: true, connectedNodes: [] },
    { id: 'bulb-1', type: 'bulb', x: 660, y: 280, connectedNodes: [] },
    { id: 'resistor-1', type: 'resistor', x: 410, y: 420, connectedNodes: [] },
];

const TrayCard: React.FC<{ label: string; type: CompType; icon: React.ReactNode }> = ({ label, type, icon }) => {
    const engine = useDragEngineContext();
    const isBeingDragged = engine.isDragging && engine.dragType === type;

    return (
        <div
            onPointerDown={(e) => {
                e.preventDefault();
                engine.startTrayDrag(type, e);
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            className={`
                group relative flex flex-col items-center justify-center p-4 rounded-2xl 
                border-2 transition-all duration-300 cursor-grab active:cursor-grabbing
                ${isBeingDragged
                    ? 'border-[#00D2FF] bg-[#00D2FF]/10 opacity-50 scale-95'
                    : 'border-[#1E293B] bg-[#0A0F1E] hover:border-[#334155] hover:bg-[#111827] shadow-lg'}
            `}
        >
            <div className={`
                p-3 rounded-xl mb-2 transition-colors duration-300
                ${isBeingDragged ? 'text-[#00D2FF]' : 'text-slate-400 group-hover:text-slate-200'}
            `}>
                {icon}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isBeingDragged ? 'text-[#00D2FF]' : 'text-slate-500'}`}>
                {isBeingDragged ? "Dragging..." : label}
            </span>
        </div>
    );
};

export const ActivityLevel1: React.FC<ActivityLevel1Props> = ({ onComplete }) => {
    const [components, setComponents] = useState<ComponentInstance[]>(INITIAL_COMPONENTS);
    const [botText, setBotText] = useState("Drag components from the tray to complete the circuit!");
    const [botState, setBotState] = useState<MonkeyState>('idle');
    const [dropEffect, setDropEffect] = useState<{ x: number, y: number, type: 'ripple' | 'reject' } | null>(null);

    const snapNodes = useMemo(() => SnapGrid.generateSnapNodes(components), [components]);

    const handleDrop = useCallback((result: DropResult) => {
        if (result.accepted) {
            const newComp: ComponentInstance = {
                id: `${result.componentType}-${Date.now()}`,
                type: result.componentType,
                x: result.position.x,
                y: result.position.y,
                isOpen: result.componentType === 'switch',
                connectedNodes: result.snapNodeId ? [result.snapNodeId] : []
            };
            setComponents(prev => [...prev, newComp]);
            setBotText("Excellent snap! The circuit is growing.");
            setBotState('happy');
            setDropEffect({ x: result.position.x, y: result.position.y, type: 'ripple' });
            setTimeout(() => setDropEffect(null), 1000);
        } else {
            setBotText("Whoops! You need to snap it to a metallic connection pad.");
            setBotState('thinking');
            setDropEffect({ x: result.position.x, y: result.position.y, type: 'reject' });
            setTimeout(() => setDropEffect(null), 1000);
        }
    }, []);

    // Check for completion logic can be added here
    const checkCompletion = useCallback(() => {
        // Dummy completion for now
        if (components.length >= 6) {
            setBotText("Wow! You've built a complex circuit!");
            setBotState('happy');
            setTimeout(onComplete, 2000);
        }
    }, [components.length, onComplete]);

    return (
        <DragEngineProvider snapNodes={snapNodes} onDrop={handleDrop}>
            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4 lg:p-8 min-h-[800px]">
                <div className="w-full lg:w-72 flex flex-col gap-6">
                    <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-[#00D2FF]" />
                            <h2 className="text-xl font-bold text-white tracking-tight">Component Tray</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <TrayCard label="Battery" type="battery" icon={<Zap className="w-6 h-6" />} />
                            <TrayCard label="Bulb" type="bulb" icon={<Lightbulb className="w-6 h-6" />} />
                            <TrayCard label="Switch" type="switch" icon={<MousePointer2 className="w-6 h-6" />} />
                            <TrayCard label="Resistor" type="resistor" icon={<Activity className="w-6 h-6" />} />
                        </div>
                    </div>

                    <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-3xl p-6 shadow-xl flex-grow flex flex-col items-center">
                        <div className="relative mb-4">
                            <VoltMonkey state={botState} />
                        </div>
                        <SpeechBubble body={botText} />
                    </div>
                </div>

                <div className="flex-grow flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">CIRCUIT LAB <span className="text-[#00D2FF] text-lg font-mono ml-2">v4.0</span></h1>
                            <p className="text-slate-400 text-sm font-medium">Mission: Snappy Connections</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setComponents(INITIAL_COMPONENTS)}
                                className="p-3 bg-[#1E293B] text-slate-300 rounded-xl hover:bg-[#334155] transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={checkCompletion}
                                className="flex items-center gap-2 px-6 py-3 bg-[#00D2FF] text-[#0A0F1E] rounded-xl font-bold hover:bg-[#00B8E6] transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                            >
                                RUN TEST <Zap className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <CircuitCanvas
                            components={components}
                            setComponents={setComponents}
                        />
                        {/* Overlay effects in CircuitCanvas SVG space? Or absolute overlay? 
                            The DropEffects expect to be inside SVG or have absolute positioning relative to SVG.
                            Let's put them inside an overlay SVG or pass them to CircuitCanvas.
                        */}
                        <svg className="absolute inset-0 pointer-events-none w-full h-full pb-[0px]">
                            <AnimatePresence>
                                {dropEffect?.type === 'ripple' && <DropRipple x={dropEffect.x} y={dropEffect.y} />}
                                {dropEffect?.type === 'reject' && <RejectFlash x={dropEffect.x} y={dropEffect.y} />}
                            </AnimatePresence>
                        </svg>
                    </div>

                    <div className="bg-[#0A0F1E]/50 border border-[#1E293B] rounded-2xl p-4 flex flex-wrap gap-6 items-center justify-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#00D2FF] uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> Physics Engine Active
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-slate-700" /> Magnetic Snap: 24px
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-slate-700" /> RAF Loop: 60FPS
                        </div>
                    </div>
                </div>
            </div>
        </DragEngineProvider>
    );
};
