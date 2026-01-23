import React, { useState } from 'react';
import { Bot } from '../components/Bot/BotCharacter';
import { DraggableItem } from '../components/ComponentTray/DraggableItem';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Resistor3D, LED3D, ElectronicDefs } from '../components/ThreeD';

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
        <div className="w-full h-full bg-white flex flex-col relative">
            <div className="flex-1 relative flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500">
                    <ElectronicDefs />

                    {/* Wires */}
                    <g strokeWidth="6" fill="none" strokeLinecap="round">
                        <path d="M 150 250 L 250 250" stroke={slots[1] ? "#f97316" : "#e5e5e5"} />
                        <path d="M 350 250 L 450 250" stroke={slots[1] && slots[2] ? "#f97316" : "#e5e5e5"} />
                        <path d="M 550 250 L 650 250" stroke={success ? "#f97316" : "#e5e5e5"} />
                    </g>

                    {/* Battery */}
                    <g transform="translate(70, 200)">
                        <rect width="80" height="100" rx="8" fill="#ff9600" stroke="#cc7700" strokeWidth="3" filter="url(#drop-shadow-3d)" />
                        <text x="40" y="60" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle">⚡</text>
                    </g>

                    {/* Slot 1: Resistor */}
                    <foreignObject x="230" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 1, 'resistor')}
                            className={`w-full h-full rounded-2xl border-4 flex items-center justify-center transition-all ${slots[1] ? 'border-transparent' : 'border-dashed border-neutral-200 bg-neutral-50'}`}
                        >
                            {slots[1] && (
                                <div className="scale-150">
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
                            className={`w-full h-full rounded-2xl border-4 flex items-center justify-center transition-all ${slots[2] ? 'border-transparent' : 'border-dashed border-neutral-200 bg-neutral-50'}`}
                        >
                            {slots[2] && (
                                <div className="w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_#f97316]" />
                            )}
                        </div>
                    </foreignObject>

                    {/* LED */}
                    <g transform="translate(650, 250)">
                        <LED3D color="#22c55e" on={success} />
                    </g>
                </svg>

                {success && (
                    <div className="absolute top-8 right-8 animate-bounce-in">
                        <Button onClick={onNext} className="btn-green">Next Level <ArrowRight size={20} className="ml-2" /></Button>
                    </div>
                )}
            </div>

            {/* Component Tray */}
            <div className="h-40 bg-white border-t-2 border-neutral-200 flex items-center justify-center gap-12 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
                    icon={<div className="w-16 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />}
                />
            </div>

            <Bot message={success ? "Electricity flows!" : "Drag the missing pieces!"} state={success ? 'success' : 'idle'} />
        </div>
    );
};