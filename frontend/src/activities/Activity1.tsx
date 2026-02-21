import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltBot } from '../components/ui/VoltBot';
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
        <div className="w-full h-full bg-background flex flex-col relative overflow-hidden">
            {/* Soft Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center p-8">
                <svg width="800" height="500" viewBox="0 0 800 500" className="drop-shadow-2xl">
                    <ElectronicDefs />

                    {/* Wires - Adjusted for dark mode visibility */}
                    <g strokeWidth="6" fill="none" strokeLinecap="round">
                        <path d="M 150 250 L 250 250" stroke={slots[1] ? "#f97316" : "rgba(255,255,255,0.05)"} />
                        <path d="M 350 250 L 450 250" stroke={slots[1] && slots[2] ? "#f97316" : "rgba(255,255,255,0.05)"} />
                        <path d="M 550 250 L 650 250" stroke={success ? "#f97316" : "rgba(255,255,255,0.05)"} />
                    </g>

                    {/* Battery */}
                    <g transform="translate(70, 200)">
                        <rect width="80" height="100" rx="16" fill="#f97316" className="shadow-lg shadow-orange-500/20" />
                        <text x="40" y="60" fill="white" fontSize="32" fontWeight="bold" textAnchor="middle" className="font-heading">⚡</text>
                    </g>

                    {/* Slot 1: Resistor */}
                    <foreignObject x="230" y="210" width="140" height="100">
                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => handleDrop(e, 1, 'resistor')}
                            className={`w-full h-full rounded-3xl border-2 flex items-center justify-center transition-all backdrop-blur-md ${slots[1] ? 'border-transparent' : 'border-dashed border-white/10 bg-white/5 hover:bg-white/10'}`}
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
                            className={`w-full h-full rounded-3xl border-2 flex items-center justify-center transition-all backdrop-blur-md ${slots[2] ? 'border-transparent' : 'border-dashed border-white/10 bg-white/5 hover:bg-white/10'}`}
                        >
                            {slots[2] && (
                                <div className="w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_15px_#f97316]" />
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
            <div className="h-44 bg-white/5 border-t border-white/10 flex items-center justify-center gap-12 z-20 backdrop-blur-xl shadow-2xl relative">
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
                    icon={<div className="w-16 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]" />}
                />
            </div>

            <VoltBot
                message={success ? "Protocol execution successful! Signals are synchronized." : "Drag the components onto the breadboard grid."}
                state={success ? 'happy' : 'idle'}
                className="fixed bottom-12 left-12 z-40 scale-110"
            />
        </div>
    );
};