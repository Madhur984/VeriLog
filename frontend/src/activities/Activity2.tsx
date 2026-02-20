import React, { useState } from 'react';
import { VoltBot } from '../components/ui/VoltBot';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { DipIC3D, ElectronicDefs } from '../components/ThreeD';

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
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className="cursor-pointer hover:opacity-80 transition-opacity">
        <text x="0" y="-35" fill="#94a3b8" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">{label}</text>
        <rect x="-20" y="-30" width="40" height="60" rx="4" fill={isOn ? "#f97316" : "#cbd5e1"} stroke="#94a3b8" strokeWidth="2" />
        <rect x="-14" y={isOn ? "-24" : "0"} width="28" height="24" rx="2" fill="white" filter="url(#drop-shadow-3d)" />
    </g>
);

interface LEDProps {
    on: boolean;
    x: number;
    y: number;
}

const LED = ({ on, x, y }: LEDProps) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="25" fill={on ? "#22c55e" : "#e2e8f0"} stroke="#94a3b8" strokeWidth="2" className="transition-colors duration-300" />
        {on && <circle cx="0" cy="0" r="35" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.5" className="animate-ping" />}
    </g>
);

export const Activity2 = ({ onNext }: ActivityProps) => {
    const [gate, setGate] = useState<string | null>(null);
    const [switches, setSwitches] = useState({ A: false, B: false });
    const [botMessage, setBotMessage] = useState("We need a gate that waits for TWO signals.");

    const isCorrectGate = gate === 'and';
    const signalOut = isCorrectGate && switches.A && switches.B;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGate(type);
        if (type === 'and') setBotMessage("Correct! Toggle the switches.");
        else setBotMessage("That's an OR gate. It's too generous!");
    };

    return (
        <div className="w-full h-full bg-white flex flex-col relative">
            <div className="flex-1 relative flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500">
                    <ElectronicDefs />

                    <g strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 150 180 L 300 180 L 300 220" stroke={switches.A ? "#f97316" : "#e2e8f0"} />
                        <path d="M 150 320 L 300 320 L 300 280" stroke={switches.B ? "#f97316" : "#e2e8f0"} />
                        <path d="M 400 250 L 550 250" stroke={signalOut ? "#f97316" : "#e2e8f0"} />
                    </g>

                    <Switch x={150} y={180} isOn={switches.A} label="Switch A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={150} y={320} isOn={switches.B} label="Switch B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <LED x={550} y={250} on={signalOut} />

                    {/* Gate Slot */}
                    <foreignObject x="280" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`w-full h-full rounded-2xl flex items-center justify-center transition-all ${gate ? '' : 'border-4 border-dashed border-neutral-200 bg-neutral-50'}`}
                        >
                            {gate === 'and' && <div className="scale-150"><DipIC3D label="AND-7408" /></div>}
                            {gate === 'or' && <div className="scale-150"><DipIC3D label="OR-7432" /></div>}
                        </div>
                    </foreignObject>
                </svg>

                {signalOut && (
                    <div className="absolute top-8 right-8 animate-bounce-in">
                        <Button onClick={onNext} className="btn-green">Next Level <ArrowRight size={20} className="ml-2" /></Button>
                    </div>
                )}
            </div>

            {/* Component Tray */}
            <div className="h-40 bg-white border-t-2 border-neutral-200 flex items-center justify-center gap-12 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <DraggableItem type="and" label="AND Chip" disabled={gate === 'and'} icon={<div className="scale-125 pt-2"><DipIC3D label="AND" /></div>} />
                <DraggableItem type="or" label="OR Chip" disabled={gate === 'or'} icon={<div className="scale-125 pt-2"><DipIC3D label="OR" /></div>} />
            </div>

            <VoltBot message={signalOut ? "Both ON! Great work." : botMessage} state={signalOut ? 'happy' : 'idle'} className="fixed bottom-8 left-8" />
        </div>
    );
};