import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltBot } from '../components/ui/VoltBot';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
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
        <text x="0" y="-35" fill="rgba(148, 163, 184, 0.8)" fontSize="12" textAnchor="middle" fontWeight="bold" className="font-heading tracking-wider uppercase">{label}</text>
        <rect x="-20" y="-30" width="40" height="60" rx="8" fill={isOn ? "#f97316" : "rgba(255,255,255,0.05)"} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="transition-all duration-300" />
        <rect x="-14" y={isOn ? "-22" : "2"} width="28" height="20" rx="4" fill="white" className="transition-all duration-300 shadow-lg" />
    </g>
);

interface LEDProps {
    on: boolean;
    x: number;
    y: number;
}

const LED = ({ on, x, y }: LEDProps) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="25" fill={on ? "#10b981" : "rgba(255,255,255,0.05)"} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="transition-all duration-500" />
        {on && (
            <>
                <circle cx="0" cy="0" r="35" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="25" fill="#10b981" opacity="0.2" className="blur-md" />
            </>
        )}
    </g>
);

export const Activity2 = ({ onNext }: ActivityProps) => {
    const [gate, setGate] = useState<string | null>(null);
    const [switches, setSwitches] = useState({ A: false, B: false });
    const [botMessage, setBotMessage] = useState("Protocol requires a gate that wait-states for TWO concurrent signals.");

    const isCorrectGate = gate === 'and';
    const signalOut = isCorrectGate && switches.A && switches.B;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGate(type);
        if (type === 'and') setBotMessage("Logic verified. Protocol sequence ready for toggle.");
        else setBotMessage("Signal mismatch. OR gate detected—too much noise variance!");
    };

    return (
        <div className="w-full h-full bg-background flex flex-col relative overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-2xl">
                    <ElectronicDefs />

                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 150 180 L 300 180 L 300 220" stroke={switches.A ? "#f97316" : "rgba(255,255,255,0.05)"} />
                        <path d="M 150 320 L 300 320 L 300 280" stroke={switches.B ? "#f97316" : "rgba(255,255,255,0.05)"} />
                        <path d="M 400 250 L 550 250" stroke={signalOut ? "#f97316" : "rgba(255,255,255,0.05)"} />
                    </g>

                    <Switch x={150} y={180} isOn={switches.A} label="Switch A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={150} y={320} isOn={switches.B} label="Switch B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <LED x={550} y={250} on={signalOut} />

                    {/* Gate Slot */}
                    <foreignObject x="280" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            className={cn(
                                "w-full h-full rounded-3xl flex items-center justify-center transition-all backdrop-blur-md",
                                gate ? "" : "border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            {gate === 'and' && <div className="scale-150"><DipIC3D label="AND-7408" /></div>}
                            {gate === 'or' && <div className="scale-150"><DipIC3D label="OR-7432" /></div>}
                        </div>
                    </foreignObject>
                </svg>

                {signalOut && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-8 right-8 z-30"
                    >
                        <Button
                            onClick={onNext}
                            className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Next Level <ArrowRight size={24} className="ml-3" />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray - Midnight Minimalist */}
            <div className="h-44 bg-white/5 border-t border-white/10 flex items-center justify-center gap-12 z-20 backdrop-blur-xl shadow-2xl">
                <DraggableItem type="and" label="AND Chip" disabled={gate === 'and'} icon={<div className="scale-125 pt-2"><DipIC3D label="AND" /></div>} />
                <DraggableItem type="or" label="OR Chip" disabled={gate === 'or'} icon={<div className="scale-125 pt-2"><DipIC3D label="OR" /></div>} />
            </div>

            <VoltBot
                message={signalOut ? "Binary status: BOTH HIGH! Protocol verified." : botMessage}
                state={signalOut ? 'happy' : 'idle'}
                className="fixed bottom-12 left-12 z-40 scale-110"
            />
        </div>
    );
};
