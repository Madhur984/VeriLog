import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, Info, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActivityProps {
    onNext: () => void;
}

interface SwitchProps {
    isOn: boolean;
    onClick: () => void;
    label: string;
    x: number;
    y: number;
}

const Switch = ({ isOn, onClick, label, x, y }: SwitchProps) => (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className="cursor-pointer group">
        <text x="0" y="-35" fill="rgba(148, 163, 184, 0.8)" fontSize="10" textAnchor="middle" fontWeight="black" className="uppercase tracking-widest">{label}</text>
        <rect x="-20" y="-30" width="40" height="60" rx="12" fill={isOn ? "#0ea5e9" : "#f1f5f9"} stroke={isOn ? "#38bdf8" : "#e2e8f0"} strokeWidth="2" className="transition-all duration-300 shadow-sm" />
        <rect x="-14" y={isOn ? "-22" : "2"} width="28" height="20" rx="8" fill="white" className="transition-all duration-300 shadow-md" />
    </g>
);

interface LEDProps {
    on: boolean;
    x: number;
    y: number;
}

const LED = ({ on, x, y }: LEDProps) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="25" fill={on ? "#10b981" : "#f1f5f9"} stroke={on ? "#34d399" : "#e2e8f0"} strokeWidth="2" className="transition-all duration-500 shadow-sm" />
        {on && (
            <>
                <circle cx="0" cy="0" r="35" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="25" fill="#10b981" opacity="0.1" className="blur-md" />
            </>
        )}
    </g>
);

export const Activity4 = ({ onNext }: ActivityProps) => {
    const [gates, setGates] = useState<{ 1: string | null, 2: string | null }>({ 1: null, 2: null });
    const [switches, setSwitches] = useState({ A: false, B: false, C: false });
    const [analystMessage] = useState("Final Protocol Challenge: Implement Logic Sequence A AND (B OR C)");

    const gate1Out = gates[1] === 'or' ? (switches.B || switches.C) : (gates[1] === 'and' ? (switches.B && switches.C) : false);
    const ledOn = gates[2] === 'and' ? (switches.A && gate1Out) : (gates[2] === 'or' ? (switches.A || gate1Out) : false);

    const isConfigCorrect = gates[1] === 'or' && gates[2] === 'and';
    const success = isConfigCorrect && ledOn;

    const handleDrop = (e: React.DragEvent, id: 1 | 2) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGates(g => ({ ...g, [id]: type }));
    };

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
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
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity 04</div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">System Synergy</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative z-10 flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-xl overflow-visible">
                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        {/* B & C into Gate 1 */}
                        <path d="M 120 280 L 250 280 L 250 300" stroke={switches.B ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 120 380 L 250 380 L 250 340" stroke={switches.C ? "#0ea5e9" : "#e2e8f0"} />

                        {/* Gate 1 Out + A into Gate 2 */}
                        <path d="M 350 320 L 450 320 L 450 240" stroke={gate1Out ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 120 180 L 450 180 L 450 200" stroke={switches.A ? "#0ea5e9" : "#e2e8f0"} />

                        {/* Gate 2 Out to LED */}
                        <path d="M 550 220 L 650 220" stroke={ledOn ? "#10b981" : "#e2e8f0"} />
                    </g>

                    <Switch x={90} y={180} isOn={switches.A} label="SWITCH_A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={90} y={280} isOn={switches.B} label="SWITCH_B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <Switch x={90} y={380} isOn={switches.C} label="SWITCH_C" onClick={() => setSwitches(s => ({ ...s, C: !s.C }))} />

                    {/* Gate 1 Slot */}
                    <foreignObject x="250" y="280" width="100" height="80">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 1)}
                            className={cn(
                                "w-full h-full rounded-[32px] border-2 flex items-center justify-center transition-all shadow-sm",
                                gates[1] ? "bg-white border-transparent" : "border-dashed border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                            )}
                        >
                            {gates[1] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke={gate1Out ? "#0ea5e9" : "#cbd5e1"} strokeWidth="4" /></svg>}
                            {gates[1] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke={gate1Out ? "#0ea5e9" : "#cbd5e1"} strokeWidth="4" /></svg>}
                            {!gates[1] && <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">G1</span>}
                        </div>
                    </foreignObject>

                    {/* Gate 2 Slot */}
                    <foreignObject x="450" y="180" width="100" height="80">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 2)}
                            className={cn(
                                "w-full h-full rounded-[32px] border-2 flex items-center justify-center transition-all shadow-sm",
                                gates[2] ? "bg-white border-transparent" : "border-dashed border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                            )}
                        >
                            {gates[2] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke={ledOn ? "#0ea5e9" : "#cbd5e1"} strokeWidth="4" /></svg>}
                            {gates[2] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke={ledOn ? "#0ea5e9" : "#cbd5e1"} strokeWidth="4" /></svg>}
                            {!gates[2] && <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">G2</span>}
                        </div>
                    </foreignObject>

                    <LED x={650} y={220} on={ledOn} />
                </svg>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-12 right-12 z-30"
                    >
                        <Button
                            onClick={onNext}
                            className="h-16 px-12 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-black text-lg shadow-xl shadow-sky-200 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tight"
                        >
                            Finish Protocol <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray */}
            <div className="h-44 bg-white border-t border-slate-200 flex items-center justify-center gap-12 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <DraggableItem type="or" label="OR Gate" icon={<svg width="40" height="30" viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke="#0ea5e9" strokeWidth="4" /></svg>} />
                <DraggableItem type="and" label="AND Gate" icon={<svg width="40" height="30" viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke="#0ea5e9" strokeWidth="4" /></svg>} />
            </div>

            {/* Logic Analysis Panel */}
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
                    "{success ? "System optimized. Circuit Master status achieved!" : analystMessage}"
                </p>
            </div>
        </div>
    );
};
