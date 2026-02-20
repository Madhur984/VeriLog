import React, { useState } from 'react';
import { VoltBot } from '../components/ui/VoltBot';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

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
        <text x="0" y="-35" fill="#b0bec5" fontSize="14" textAnchor="middle" fontWeight="bold">{label}</text>
        <rect x="-20" y="-30" width="40" height="60" rx="4" fill={isOn ? "#00d9ff" : "#4a5568"} className="transition-colors duration-300" />
        <rect x="-14" y={isOn ? "-24" : "0"} width="28" height="24" rx="2" fill="white" />
    </g>
);

interface LEDProps {
    on: boolean;
    x: number;
    y: number;
}

const LED = ({ on, x, y }: LEDProps) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="25" fill={on ? "#4caf50" : "#2d3748"} className="transition-colors duration-300" />
        {on && <circle cx="0" cy="0" r="35" fill="none" stroke="#4caf50" strokeWidth="2" opacity="0.5" className="animate-ping" />}
    </g>
);

export const Activity3 = ({ onNext }: ActivityProps) => {
    const [gate, setGate] = useState<string | null>(null);
    const [switches, setSwitches] = useState({ A: false, B: false });
    const [botMessage, setBotMessage] = useState("This time, we need a gate that works if EITHER switch is on.");

    const isCorrectGate = gate === 'or';
    const signalOut = isCorrectGate && (switches.A || switches.B);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        setGate(type);
        if (type === 'or') setBotMessage("Correct! The OR gate is flexible.");
        else setBotMessage("That's an AND gate. It's too strict!");
    };

    return (
        <div className="h-screen w-screen bg-background-primary flex flex-col relative">
            <div className="flex-1 relative flex items-center justify-center">
                <svg width="800" height="500" viewBox="0 0 800 500">
                    <g strokeWidth="4" fill="none" strokeLinecap="round">
                        <path d="M 150 180 L 300 180 L 300 220" stroke={switches.A ? "#fbbf24" : "#4a5568"} />
                        <path d="M 150 320 L 300 320 L 300 280" stroke={switches.B ? "#fbbf24" : "#4a5568"} />
                        <path d="M 400 250 L 550 250" stroke={signalOut ? "#fbbf24" : "#4a5568"} />
                    </g>

                    <Switch x={150} y={180} isOn={switches.A} label="Switch A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={150} y={320} isOn={switches.B} label="Switch B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <LED x={550} y={250} on={signalOut} />

                    <foreignObject x="300" y="210" width="100" height="80">
                        <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} className={`w-full h-full rounded-xl flex items-center justify-center transition-all ${gate ? '' : 'border-2 border-dashed border-wire-inactive bg-background-secondary/50'}`}>
                            {gate === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                            {gate === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                        </div>
                    </foreignObject>
                </svg>

                {signalOut && (
                    <div className="absolute top-8 right-8 animate-bounce-in">
                        <Button onClick={onNext}>Next Activity <ArrowRight size={20} /></Button>
                    </div>
                )}
            </div>

            <div className="h-48 bg-background-secondary border-t border-white/10 flex items-center justify-center gap-12 z-20">
                <DraggableItem type="or" label="OR Gate" disabled={gate === 'or'} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>} />
                <DraggableItem type="and" label="AND Gate" disabled={gate === 'and'} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>} />
            </div>

            <VoltBot message={signalOut ? "One switch was enough!" : botMessage} state={signalOut ? 'happy' : 'idle'} className="fixed bottom-8 left-8" />
        </div>
    );
};