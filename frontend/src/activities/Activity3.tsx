import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltMonkey } from '../components/Bot/VoltMonkey';
import { SpeechBubble } from '../components/Bot/SpeechBubble';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
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
        <rect x="-20" y="-30" width="40" height="60" rx="8" fill={isOn ? "#00d9ff" : "rgba(255,255,255,0.05)"} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="transition-all duration-300" />
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

export const Activity3 = ({ onNext }: ActivityProps) => {
    const [gate, setGate] = useState<string | null>(null);
    const [switches, setSwitches] = useState({ A: false, B: false });
    const [botMessage, setBotMessage] = useState("Calibration required. We need a gate that accepts EITHER active frequency.");

    const isCorrectGate = gate === 'or';
    const signalOut = isCorrectGate && (switches.A || switches.B);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGate(type);
        if (type === 'or') setBotMessage("Logic match. OR gate flexibility confirmed for parallel signals.");
        else setBotMessage("Logic error. AND gate is too restrictive for this sequence.");
    };

    return (
        <div className="h-screen w-screen bg-background flex flex-col relative overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-2xl">
                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 150 180 L 300 180 L 300 220" stroke={switches.A ? "#00d9ff" : "rgba(255,255,255,0.05)"} />
                        <path d="M 150 320 L 300 320 L 300 280" stroke={switches.B ? "#00d9ff" : "rgba(255,255,255,0.05)"} />
                        <path d="M 400 250 L 550 250" stroke={signalOut ? "#00d9ff" : "rgba(255,255,255,0.05)"} />
                    </g>

                    <Switch x={150} y={180} isOn={switches.A} label="Switch A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={150} y={320} isOn={switches.B} label="Switch B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <LED x={550} y={250} on={signalOut} />

                    <foreignObject x="300" y="210" width="100" height="80">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            className={cn(
                                "w-full h-full rounded-3xl flex items-center justify-center transition-all backdrop-blur-md",
                                gate ? "" : "border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            {gate === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke={switches.A && switches.B ? "#00d9ff" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
                            {gate === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke={switches.A || switches.B ? "#00d9ff" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
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
                            Next Activity <ArrowRight size={24} className="ml-3" />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray - Midnight Minimalist */}
            <div className="h-44 bg-white/5 border-t border-white/10 flex items-center justify-center gap-12 z-20 backdrop-blur-xl shadow-2xl">
                <DraggableItem type="or" label="OR Gate" disabled={gate === 'or'} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="4" /></svg>} />
                <DraggableItem type="and" label="AND Gate" disabled={gate === 'and'} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="4" /></svg>} />
            </div>

            <div className="fixed bottom-8 left-8 z-40 flex items-end gap-3">
                <VoltMonkey state={signalOut ? 'happy' : 'idle'} size="md" />
                <SpeechBubble
                    body={signalOut ? "Parallel signal synchronization detected!" : botMessage}
                    placement="right"
                    accent={signalOut ? '#22C55E' : '#3B82F6'}
                    visible
                />
            </div>
        </div>
    );
};
