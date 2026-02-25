import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CircuitCanvas } from '../components/Activities/CircuitCanvas';
import { VoltMonkey, MonkeyState } from '../components/Bot/VoltMonkey';
import { SpeechBubble } from '../components/Bot/SpeechBubble';
import { Zap, Lightbulb, MousePointer2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DragEngineProvider, useDragEngineContext } from '../contexts/DragEngineContext';
import { CompType, DropResult } from '../engine/types';
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
    // 0: Intro, 1: Place Bulb, 2: Place Switch, 3: Close Switch, 4: Done
    const [step, setStep] = useState(0);
    const [components, setComponents] = useState<ComponentInstance[]>([]);
    const [botState, setBotState] = useState<MonkeyState>('idle');
    const [botText, setBotText] = useState("Welcome to the Circuit Lab! First, we need a light source. Drag the BULB to the right drop zone.");
    const [dropEffect, setDropEffect] = useState<{ x: number, y: number, type: 'ripple' | 'reject' } | null>(null);

    // Fixed puzzle nodes
    const snapNodes = useMemo(() => [
        { id: 'node-bulb-in', x: 600 - 28, y: 300, occupied: false },
        { id: 'node-bulb-out', x: 600 + 28, y: 300, occupied: false },
        { id: 'node-switch-in', x: 400 - 30, y: 150, occupied: false },
        { id: 'node-switch-out', x: 400 + 30, y: 150, occupied: false }
    ], []);

    // Check if expected components are in their zones
    const hasBulb = components.some(c => c.type === 'bulb' && Math.abs(c.x - 600) < 50 && Math.abs(c.y - 300) < 50);
    const hasSwitch = components.some(c => c.type === 'switch' && Math.abs(c.x - 400) < 50 && Math.abs(c.y - 150) < 50);
    const switchComp = components.find(c => c.type === 'switch');
    const isSwitchClosed = switchComp && !switchComp.isOpen;

    const isCircuitClosed = hasBulb && hasSwitch && isSwitchClosed;

    useEffect(() => {
        if (step === 0) {
            if (hasBulb) {
                setStep(1);
                setBotText("Great! Now we need a way to control the flow. Drag the SWITCH to the top drop zone.");
                setBotState('happy');
            }
        } else if (step === 1) {
            if (hasSwitch) {
                if (isSwitchClosed) {
                    setStep(3);
                } else {
                    setStep(2);
                    setBotText("Perfect. The circuit is set up, but the switch is OPEN. Click on it to close the circuit and let the electrons flow!");
                    setBotState('alert');
                }
            }
        } else if (step === 2) {
            if (isSwitchClosed) {
                setStep(3);
            }
        }

        if (step === 3 && isCircuitClosed) {
            setStep(4);
            setBotText("So the signal works in closed loop and according to you what is relevant...");
            setBotState('happy');
            setTimeout(onComplete, 5000);
        }
    }, [step, hasBulb, hasSwitch, isSwitchClosed, isCircuitClosed, onComplete]);

    const handleDrop = useCallback((result: DropResult) => {
        if (result.accepted) {
            // Check if dropped in a valid zone for the type
            let accepted = false;
            if (result.componentType === 'bulb' && Math.abs(result.position.x - 600) < 50 && Math.abs(result.position.y - 300) < 50) {
                accepted = true;
            } else if (result.componentType === 'switch' && Math.abs(result.position.x - 400) < 50 && Math.abs(result.position.y - 150) < 50) {
                accepted = true;
            }

            if (accepted) {
                const newComp: ComponentInstance = {
                    id: `${result.componentType}-${Date.now()}`,
                    type: result.componentType,
                    x: result.componentType === 'bulb' ? 600 : 400,
                    y: result.componentType === 'bulb' ? 300 : 150,
                    isOpen: result.componentType === 'switch' ? true : undefined,
                    connectedNodes: result.snapNodeId ? [result.snapNodeId] : []
                };

                // Allow only one of each
                setComponents(prev => [...prev.filter(c => c.type !== result.componentType), newComp]);
                setDropEffect({ x: result.position.x, y: result.position.y, type: 'ripple' });
                setTimeout(() => setDropEffect(null), 1000);
            } else {
                setBotText("Oops! That component doesn't go there right now. Try the correct drop zone!");
                setBotState('thinking');
                setDropEffect({ x: result.position.x, y: result.position.y, type: 'reject' });
                setTimeout(() => setDropEffect(null), 1000);
            }
        } else {
            setBotText("Whoops! You need to snap it to a metallic connection pad.");
            setBotState('thinking');
            setDropEffect({ x: result.position.x, y: result.position.y, type: 'reject' });
            setTimeout(() => setDropEffect(null), 1000);
        }
    }, []);

    // We pass `isCircuitClosed` to CircuitCanvas as a prop or context
    // Actually, we can add it directly inside CircuitCanvas by observing components, or we can pass it as a new prop.
    // I'll pass it to CircuitCanvas.

    return (
        <DragEngineProvider snapNodes={snapNodes} onDrop={handleDrop}>
            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4 lg:p-8 min-h-[800px]">
                <div className="w-full lg:w-72 flex flex-col gap-6">
                    <div className="bg-[#0A0F1E] border border-[#1E293B] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#3B82F6]/5 backdrop-blur-[2px] pointer-events-none" aria-label="activity-container" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-5 h-5 text-[#3B82F6]" />
                                <h2 className="text-xl font-bold text-white tracking-tight">Component Tray</h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                <TrayCard label="Bulb" type="bulb" icon={<Lightbulb className="w-6 h-6" />} />
                                <TrayCard label="Switch" type="switch" icon={<MousePointer2 className="w-6 h-6" />} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0A0F1E]/60 backdrop-blur-md border border-[#1E293B] rounded-3xl p-6 shadow-xl flex-grow flex flex-col items-center">
                        <div className="relative mb-4">
                            <VoltMonkey state={botState} />
                        </div>
                        <SpeechBubble body={botText} />
                    </div>
                </div>

                <div className="flex-grow flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">CIRCUIT LAB <span className="text-[#3B82F6] text-lg font-mono ml-2">v4.0</span></h1>
                            <p className="text-slate-400 text-sm font-medium">Mission: Close the Loop</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setComponents([]); setStep(0); setBotState('idle'); setBotText("Welcome to the Circuit Lab! First, we need a light source. Drag the BULB to the right drop zone."); }}
                                className="p-3 bg-[#1E293B] text-slate-300 rounded-xl hover:bg-[#334155] transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <CircuitCanvas
                            components={components}
                            setComponents={setComponents}
                            isCircuitClosed={isCircuitClosed}
                        />
                        <svg className="absolute inset-0 pointer-events-none w-full h-full pb-[0px]">
                            <AnimatePresence>
                                {dropEffect?.type === 'ripple' && <DropRipple x={dropEffect.x} y={dropEffect.y} />}
                                {dropEffect?.type === 'reject' && <RejectFlash x={dropEffect.x} y={dropEffect.y} />}
                            </AnimatePresence>
                        </svg>
                    </div>

                    <div className="bg-[#0A0F1E]/50 border border-[#1E293B] rounded-2xl p-4 flex flex-wrap gap-6 items-center justify-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> Loop Engine Active
                        </div>
                    </div>
                </div>
            </div>
        </DragEngineProvider>
    );
};
