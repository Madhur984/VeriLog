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
        <rect x="-20" y="-30" width="40" height="60" rx="4" fill={isOn ? "#00d9ff" : "#4a5568"} />
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

export const Activity4 = ({ onNext }: ActivityProps) => {
    const [gates, setGates] = useState<{ 1: string | null, 2: string | null }>({ 1: null, 2: null });
    const [switches, setSwitches] = useState({ A: false, B: false, C: false });
    const [botMessage] = useState("Final Challenge! Logic: A AND (B OR C)");

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
        <div className="h-screen w-screen bg-background-primary flex flex-col relative">
            <div className="flex-1 relative flex items-center justify-center">
                <svg width="800" height="500" viewBox="0 0 800 500">
                    <g strokeWidth="4" fill="none" strokeLinecap="round">
                        {/* B & C into Gate 1 */}
                        <path d="M 120 280 L 250 280 L 250 300" stroke={switches.B ? "#fbbf24" : "#4a5568"} />
                        <path d="M 120 380 L 250 380 L 250 340" stroke={switches.C ? "#fbbf24" : "#4a5568"} />

                        {/* Gate 1 Out + A into Gate 2 */}
                        <path d="M 350 320 L 450 320 L 450 240" stroke={gate1Out ? "#fbbf24" : "#4a5568"} />
                        <path d="M 120 180 L 450 180 L 450 200" stroke={switches.A ? "#fbbf24" : "#4a5568"} />

                        {/* Gate 2 Out to LED */}
                        <path d="M 550 220 L 650 220" stroke={ledOn ? "#fbbf24" : "#4a5568"} />
                    </g>

                    <Switch x={90} y={180} isOn={switches.A} label="A" onClick={() => setSwitches(s => ({ ...s, A: !s.A }))} />
                    <Switch x={90} y={280} isOn={switches.B} label="B" onClick={() => setSwitches(s => ({ ...s, B: !s.B }))} />
                    <Switch x={90} y={380} isOn={switches.C} label="C" onClick={() => setSwitches(s => ({ ...s, C: !s.C }))} />

                    {/* Gate 1 Slot (OR) */}
                    <foreignObject x="250" y="280" width="100" height="80">
                        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 1)} className={`w-full h-full rounded-xl flex items-center justify-center ${gates[1] ? '' : 'border-2 border-dashed border-[#4a5568] bg-[#1a1f3a]/50'}`}>
                            {gates[1] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                            {gates[1] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                        </div>
                    </foreignObject>

                    {/* Gate 2 Slot (AND) */}
                    <foreignObject x="450" y="180" width="100" height="80">
                        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 2)} className={`w-full h-full rounded-xl flex items-center justify-center ${gates[2] ? '' : 'border-2 border-dashed border-[#4a5568] bg-[#1a1f3a]/50'}`}>
                            {gates[2] === 'and' && <svg viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                            {gates[2] === 'or' && <svg viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>}
                        </div>
                    </foreignObject>

                    <LED x={650} y={220} on={ledOn} />
                </svg>

                {success && (
                    <div className="absolute top-8 right-8 animate-bounce-in">
                        <Button onClick={onNext}>Finish <ArrowRight size={20} /></Button>
                    </div>
                )}
            </div>

            <div className="h-48 bg-background-secondary border-t border-white/10 flex items-center justify-center gap-12 z-20">
                <DraggableItem type="or" label="OR Gate" disabled={false} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 C 20 5 30 20 40 30 C 30 40 20 55 10 55 C 25 55 35 45 60 30 C 35 15 25 5 10 5 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>} />
                <DraggableItem type="and" label="AND Gate" disabled={false} icon={<svg width="50" height="40" viewBox="0 0 80 60"><path d="M 10 5 L 40 5 C 65 5 65 55 40 55 L 10 55 Z" fill="#b0bec5" stroke="#1a1f3a" strokeWidth="2" /></svg>} />
            </div>

            <VoltBot message={success ? "Circuit Master!" : botMessage} state={success ? 'happy' : 'idle'} className="fixed bottom-8 left-8" />
        </div>
    );
};