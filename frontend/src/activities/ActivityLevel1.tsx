import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CircuitCanvas } from '../components/Activities/CircuitCanvas';
import { Info, Zap, Lightbulb, MousePointer2, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DragEngineProvider, useDragEngineContext } from '../contexts/DragEngineContext';
import { type CompType, type DropResult } from '../hooks/useDragEngine';
import { DropRipple, RejectFlash } from '../components/Activities/DropEffects';
import { cn } from '../lib/utils';

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
            className={cn(
                "group relative flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 cursor-grab active:cursor-grabbing",
                isBeingDragged
                    ? "border-sky-500 bg-sky-50 opacity-50 scale-95 shadow-inner"
                    : "border-slate-100 bg-white hover:border-sky-300 hover:bg-sky-50/30 shadow-sm hover:shadow-md"
            )}
        >
            <div className={cn(
                "p-3 rounded-2xl mb-2 transition-colors duration-300",
                isBeingDragged ? "text-sky-600" : "text-slate-400 group-hover:text-sky-600"
            )}>
                {icon}
            </div>
            <span className={cn(
                "text-[10px] uppercase tracking-widest font-black",
                isBeingDragged ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"
            )}>
                {isBeingDragged ? "Active" : label}
            </span>
        </div>
    );
};

export const ActivityLevel1: React.FC<ActivityLevel1Props> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [components, setComponents] = useState<ComponentInstance[]>([]);
    const [analystText, setAnalystText] = useState("Protocol Initialization: LIGHT source required. Anchor the BULB into the designated terminal.");
    const [dropEffect, setDropEffect] = useState<{ x: number, y: number, type: 'ripple' | 'reject' } | null>(null);

    const snapNodes = useMemo(() => [
        { id: 'node-bulb-in', x: 600 - 28, y: 300, type: 'pin' as const, occupied: false },
        { id: 'node-bulb-out', x: 600 + 28, y: 300, type: 'pin' as const, occupied: false },
        { id: 'node-switch-in', x: 400 - 30, y: 150, type: 'pin' as const, occupied: false },
        { id: 'node-switch-out', x: 400 + 30, y: 150, type: 'pin' as const, occupied: false }
    ], []);

    const hasBulb = components.some(c => c.type === 'bulb' && Math.abs(c.x - 600) < 50 && Math.abs(c.y - 300) < 50);
    const hasSwitch = components.some(c => c.type === 'switch' && Math.abs(c.x - 400) < 50 && Math.abs(c.y - 150) < 50);
    const switchComp = components.find(c => c.type === 'switch');
    const isSwitchClosed = switchComp && !switchComp.isOpen;

    const isCircuitClosed = hasBulb && hasSwitch && isSwitchClosed;

    useEffect(() => {
        if (step === 0 && hasBulb) {
            setStep(1);
            setAnalystText("Signal path detected. Proceed with FLOW CONTROL. Integrate the SWITCH into the primary bus.");
        } else if (step === 1 && hasSwitch) {
            if (isSwitchClosed) {
                setStep(3);
            } else {
                setStep(2);
                setAnalystText("Circuit topology complete. Current state: OPEN. Toggle the switch to synchronize frequencies.");
            }
        } else if (step === 2 && isSwitchClosed) {
            setStep(3);
        }

        if (step === 3 && isCircuitClosed) {
            setStep(4);
            setAnalystText("Loop integrity verified. Full synchronization achieved. Transitioning to next protocol.");
            setTimeout(onComplete, 3000);
        }
    }, [step, hasBulb, hasSwitch, isSwitchClosed, isCircuitClosed, onComplete]);

    const handleDrop = useCallback((result: DropResult) => {
        if (result.accepted) {
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
                    rotation: 0,
                    anchors: [],
                    state: {},
                    isOpen: result.componentType === 'switch' ? true : undefined,
                    snapNodeIds: result.snapNodeId ? [result.snapNodeId] : []
                };

                setComponents(prev => [...prev.filter(c => c.type !== result.componentType), newComp]);
                setDropEffect({ x: result.position.x, y: result.position.y, type: 'ripple' });
                setTimeout(() => setDropEffect(null), 1000);
            } else {
                setAnalystText("Vector mismatch. Terminal rejected signal. Re-align with designated drop zone.");
                setDropEffect({ x: result.position.x, y: result.position.y, type: 'reject' });
                setTimeout(() => setDropEffect(null), 1000);
            }
        } else {
            setAnalystText("Node connection failure. Precision alignment required for metallic pads.");
            setDropEffect({ x: result.position.x, y: result.position.y, type: 'reject' });
            setTimeout(() => setDropEffect(null), 1000);
        }
    }, []);

    return (
        <DragEngineProvider snapNodes={snapNodes} onDrop={handleDrop}>
            <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="levelGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#levelGrid)" />
                    </svg>
                </div>

                {/* Header */}
                <header className="h-24 bg-white border-b border-slate-200 px-12 flex items-center justify-between relative z-10 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl shadow-inner">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Laboratory Unit 01</div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Circuit Synthesis</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setComponents([]); setStep(0); setAnalystText("Welcome back to the Circuit Lab! First, we need a light source. Drag the BULB to the right drop zone."); }}
                            className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-200 shadow-sm flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest px-1">Reset</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex gap-12 p-12 max-w-[1600px] mx-auto w-full">
                    {/* Left: Control Panel */}
                    <div className="w-80 flex flex-col gap-8 flex-shrink-0">
                        {/* Tray */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Nodes</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <TrayCard label="Bulb" type="bulb" icon={<Lightbulb className="w-8 h-8" />} />
                                <TrayCard label="Switch" type="switch" icon={<MousePointer2 className="w-8 h-8" />} />
                            </div>
                        </div>

                        {/* Analyst Panel (Replacing Bot) */}
                        <div className="flex-1 bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldCheck size={120} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Info size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Analyst Feed</span>
                            </div>
                            <p className="text-lg font-bold text-slate-700 leading-relaxed italic relative z-10">
                                "{analystText}"
                            </p>
                        </div>
                    </div>

                    {/* Right: Interaction Zone */}
                    <div className="flex-1 flex flex-col gap-8">
                        <div className="flex-1 relative bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden group">
                           <div className="absolute inset-0 flex items-center justify-center">
                                <CircuitCanvas
                                    components={components}
                                    setComponents={setComponents}
                                    isCircuitClosed={isCircuitClosed}
                                />
                           </div>
                           
                           {/* Step Indicator Overlay */}
                           <div className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-slate-100 shadow-xl">
                               <div className={cn("w-2 h-2 rounded-full", isCircuitClosed ? "bg-emerald-500" : "bg-sky-500 animate-pulse")} />
                               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Phase {step + 1} of 4</span>
                           </div>

                           <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                <AnimatePresence>
                                    {dropEffect?.type === 'ripple' && <DropRipple x={dropEffect.x} y={dropEffect.y} />}
                                    {dropEffect?.type === 'reject' && <RejectFlash x={dropEffect.x} y={dropEffect.y} />}
                                </AnimatePresence>
                            </svg>
                        </div>

                        {/* Status Footer */}
                        <div className="h-20 bg-white rounded-[32px] border border-slate-200 shadow-xl flex items-center px-8 gap-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className={cn("w-5 h-5 transition-colors", isCircuitClosed ? "text-emerald-500" : "text-slate-200")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest", isCircuitClosed ? "text-emerald-600" : "text-slate-400")}>
                                    Loop Synchronization
                                </span>
                            </div>
                            <div className="h-4 w-px bg-slate-100" />
                            <div className="flex-1 flex gap-2">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className={cn(
                                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                                        step > i ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" : 
                                        step === i ? "bg-sky-400 animate-pulse" : "bg-slate-100"
                                    )} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DragEngineProvider>
    );
};
