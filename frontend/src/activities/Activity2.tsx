import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, Info, ShieldCheck } from 'lucide-react';
import { DipIC3D, ElectronicDefs } from '../components/ThreeD';
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

export const Activity2 = ({ onNext }: ActivityProps) => {
    const [gate, setGate] = useState<string | null>(null);
    const [switches, setSwitches] = useState({ A: false, B: false });
    const [analystMessage, setAnalystMessage] = useState("Protocol requires a gate that registers only when TWO concurrent signals are present.");

    const isCorrectGate = gate === 'and';
    const signalOut = isCorrectGate && switches.A && switches.B;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGate(type);
        if (type === 'and') setAnalystMessage("Logic verified. Protocol sequence ready for toggle.");
        else setAnalystMessage("Signal mismatch. OR gate detected-incorrect variance for this sequence.");
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
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity 02</div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Gate Integration</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 relative z-10 flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-xl overflow-visible">
                    <ElectronicDefs />

                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 150 180 L 300 180 L 300 220" stroke={switches.A ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 150 320 L 300 320 L 300 280" stroke={switches.B ? "#0ea5e9" : "#e2e8f0"} />
                        <path d="M 400 250 L 550 250" stroke={signalOut ? "#0ea5e9" : "#e2e8f0"} />
                    </g>

                    <Switch x={150} y={180} isOn={switches.A} label="SWITCH_A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={150} y={320} isOn={switches.B} label="SWITCH_B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <LED x={550} y={250} on={signalOut} />

                    {/* Gate Slot */}
                    <foreignObject x="280" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            className={cn(
                                "w-full h-full rounded-[32px] border-2 flex items-center justify-center transition-all shadow-sm",
                                gate ? "bg-white border-transparent" : "border-dashed border-slate-200 bg-slate-100/50 hover:bg-slate-100"
                            )}
                        >
                            {gate === 'and' && <div className="scale-125"><DipIC3D label="AND-7408" /></div>}
                            {gate === 'or' && <div className="scale-125"><DipIC3D label="OR-7432" /></div>}
                            {!gate && <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Drop IC</span>}
                        </div>
                    </foreignObject>
                </svg>

                {signalOut && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-12 right-12 z-30"
                    >
                        <Button
                            onClick={onNext}
                            className="h-16 px-12 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-black text-lg shadow-xl shadow-sky-200 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tight"
                        >
                            Next Module <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray */}
            <div className="h-44 bg-white border-t border-slate-200 flex items-center justify-center gap-12 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <DraggableItem type="and" label="AND Chip" disabled={gate === 'and'} icon={<div className="scale-125 pt-2"><DipIC3D label="AND" /></div>} />
                <DraggableItem type="or" label="OR Chip" disabled={gate === 'or'} icon={<div className="scale-125 pt-2"><DipIC3D label="OR" /></div>} />
            </div>

            {/* Logic Analysis Panel */}
            <div className="fixed bottom-12 left-12 z-40 w-80 bg-white p-6 rounded-[32px] border border-slate-200 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        signalOut ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
                    )}>
                        {signalOut ? <ShieldCheck size={18} /> : <Info size={18} />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Feed</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    "{signalOut ? "Binary status: BOTH HIGH! Protocol verified." : analystMessage}"
                </p>
            </div>
        </div>
    );
};
