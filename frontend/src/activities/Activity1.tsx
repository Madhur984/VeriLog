import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, Info, ShieldCheck } from 'lucide-react';
import { Resistor3D, LED3D, ElectronicDefs } from '../components/ThreeD';
import { cn } from '../lib/utils';

interface ActivityProps {
    onNext: () => void;
}

export const Activity1 = ({ onNext }: ActivityProps) => {
    const [slots, setSlots] = useState<{ 1: string | null; 2: string | null }>({ 1: null, 2: null });
    const [success, setSuccess] = useState(false);

    const handleDrop = (e: React.DragEvent, slotId: 1 | 2, requiredType: string) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');

        if (type === requiredType) {
            const newSlots = { ...slots, [slotId]: type };
            setSlots(newSlots);

            if (newSlots[1] === 'resistor' && newSlots[2] === 'wire') {
                setSuccess(true);
            }
        }
    };

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="activityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#activityGrid)" />
                </svg>
            </div>

            {/* Header */}
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity 01</div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Circuit Basics</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative z-10 flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-xl overflow-visible">
                    <ElectronicDefs />

                    {/* Wires */}
                    <g strokeWidth="6" fill="none" strokeLinecap="round">
                        <path d="M 150 250 L 250 250" stroke={slots[1] ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 350 250 L 450 250" stroke={slots[1] && slots[2] ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 550 250 L 650 250" stroke={success ? "#0ea5e9" : "#e2e8f0"} />
                    </g>

                    {/* Battery */}
                    <g transform="translate(70, 200)">
                        <rect width="80" height="100" rx="20" fill="#0ea5e9" className="shadow-lg shadow-sky-500/10" />
                        <text x="40" y="62" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle">⚡</text>
                    </g>

                    {/* Slot 1: Resistor */}
                    <foreignObject x="230" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 1, 'resistor')}
                            className={cn(
                                "w-full h-full rounded-[32px] border-2 flex items-center justify-center transition-all",
                                slots[1] 
                                    ? "border-transparent bg-white shadow-sm" 
                                    : "border-dashed border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                            )}
                        >
                            {slots[1] && (
                                <div className="scale-125">
                                    <Resistor3D val="1kΩ" />
                                </div>
                            )}
                        </div>
                    </foreignObject>

                    {/* Slot 2: Wire */}
                    <foreignObject x="430" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 2, 'wire')}
                            className={cn(
                                "w-full h-full rounded-[32px] border-2 flex items-center justify-center transition-all",
                                slots[2] 
                                    ? "border-transparent bg-white shadow-sm" 
                                    : "border-dashed border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                            )}
                        >
                            {slots[2] && (
                                <div className="w-full h-2 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
                            )}
                        </div>
                    </foreignObject>

                    {/* LED */}
                    <g transform="translate(650, 250)">
                        <LED3D color="#10b981" on={success} />
                    </g>
                </svg>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-12 right-12 z-30"
                    >
                        <Button
                            onClick={onNext}
                            className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-heading font-black text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tight"
                        >
                            Next Module <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray */}
            <div className="h-44 bg-white border-t border-slate-200 flex items-center justify-center gap-12 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <DraggableItem
                    type="resistor"
                    label="Resistor"
                    disabled={!!slots[1]}
                    icon={<div className="scale-125 pt-2"><Resistor3D val="1kΩ" /></div>}
                />
                <DraggableItem
                    type="wire"
                    label="Wire"
                    disabled={!!slots[2]}
                    icon={<div className="w-16 h-2 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.2)]" />}
                />
            </div>

            {/* Logic Analysis Panel (Replacing Bot) */}
            <div className="fixed bottom-12 left-12 z-40 w-80 bg-white p-6 rounded-[32px] border border-slate-200 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        success ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
                    )}>
                        {success ? <ShieldCheck size={18} /> : <Info size={18} />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Feed</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    "{success ? "Protocol execution successful! Signals are synchronized." : "Drag the components onto the board to establish the first signal path."}"
                </p>
            </div>
        </div>
    );
};
