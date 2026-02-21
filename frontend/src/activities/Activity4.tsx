import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltBot } from '../components/ui/VoltBot';
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

export const Activity4 = ({ onNext }: ActivityProps) => {
    const [gates, setGates] = useState<{ 1: string | null, 2: string | null }>({ 1: null, 2: null });
    const [switches, setSwitches] = useState({ A: false, B: false, C: false });
    const [botMessage] = useState("Final Protocol Challenge: Implement Logic Sequence A AND (B OR C)");

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
        <div className="h-screen w-screen bg-background flex flex-col relative overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-2xl">
                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        {/* B & C into Gate 1 */}
                        <path d="M 120 280 L 250 280 L 250 300" stroke={switches.B ? "#fbbf24" : "rgba(255,255,255,0.05)"} />
                        <path d="M 120 380 L 250 380 L 250 340" stroke={switches.C ? "#fbbf24" : "rgba(255,255,255,0.05)"} />

                        {/* Gate 1 Out + A into Gate 2 */}
                        <path d="M 350 320 L 450 320 L 450 240" stroke={gate1Out ? "#fbbf24" : "rgba(255,255,255,0.05)"} />
                        <path d="M 120 180 L 450 180 L 450 200" stroke={switches.A ? "#fbbf24" : "rgba(255,255,255,0.05)"} />

                        {/* Gate 2 Out to LED */}
                        <path d="M 550 220 L 650 220" stroke={ledOn ? "#10b981" : "rgba(255,255,255,0.05)"} />
                    </g>

                    <Switch x={90} y={180} isOn={switches.A} label="A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={90} y={280} isOn={switches.B} label="B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <Switch x={90} y={380} isOn={switches.C} label="C" onClick={() => setSwitches(s => ({ ...s, C: !s.C }))} />

                    {/* Gate 1 Slot (OR) */}
                    <foreignObject x="250" y="280" width="100" height="80">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 1)}
                            className={cn(
                                "w-full h-full rounded-3xl flex items-center justify-center backdrop-blur-md",
                                gates[1] ? "" : "border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            {gates[1] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke={gate1Out ? "#fbbf24" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
                            {gates[1] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke={gate1Out ? "#fbbf24" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
                        </div>
                    </foreignObject>

                    {/* Gate 2 Slot (AND) */}
                    <foreignObject x="450" y="180" width="100" height="80">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 2)}
                            className={cn(
                                "w-full h-full rounded-3xl flex items-center justify-center backdrop-blur-md",
                                gates[2] ? "" : "border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            {gates[2] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke={ledOn ? "#fbbf24" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
                            {gates[2] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke={ledOn ? "#fbbf24" : "rgba(255,255,255,0.4)"} strokeWidth="4" /></svg>}
                        </div>
                    </foreignObject>

                    <LED x={650} y={220} on={ledOn} />
                </svg>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-8 right-8 z-30"
                    >
                        <Button
                            onClick={onNext}
                            className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Finish Protocol <ArrowRight size={24} className="ml-3" />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Component Tray - Midnight Minimalist */}
            <div className="h-44 bg-white/5 border-t border-white/10 flex items-center justify-center gap-12 z-20 backdrop-blur-xl shadow-2xl">
                <DraggableItem type="or" label="OR Gate" disabled={false} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="4" /></svg>} />
                <DraggableItem type="and" label="AND Gate" disabled={false} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="4" /></svg>} />
            </div>

            <VoltBot
                message={success ? "System optimized. Circuit Master status achieved!" : botMessage}
                state={success ? 'happy' : 'idle'}
                className="fixed bottom-12 left-12 z-40 scale-110"
            />
        </div>
    );
};
