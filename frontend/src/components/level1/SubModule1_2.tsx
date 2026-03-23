import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Gauge, ArrowRight } from 'lucide-react';

interface SubModuleProps {
    onComplete: (sip: number) => void;
}


const AnalogyCard = ({ title, value, unit, label, color }: { title: string, value: string, unit: string, label: string, color: string }) => (
    <motion.div 
        className="flex flex-col p-6 bg-[#141B2D] border border-[#1E2332] rounded-xl relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
    >
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gauge size={60} color={color} />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color }}>{title}</span>
        <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{value}</span>
            <span className="text-sm font-mono text-slate-500">{unit}</span>
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed font-sans">{label}</p>
    </motion.div>
);

export const SubModule1_2: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [screen, setScreen] = useState(1);
    const [voltage, setVoltage] = useState(5);

    const next = () => setScreen(s => s + 1);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-[#0B0F14] relative overflow-hidden">
            <AnimatePresence mode="wait">
                {screen === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold text-white leading-tight">Voltage: The Pressure</h2>
                                    <p className="text-slate-400 font-sans leading-relaxed">
                                        Think of voltage like a water pump. It's the electrical "pressure" that pushes charge through the circuit. No pressure, no flow.
                                    </p>
                                </div>
                                
                                <div className="p-6 bg-[#0A0E1A] border border-[#1E2332] rounded-xl space-y-6">
                                    <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-[#00D2FF]">
                                        <span>Pump Pressure (Voltage)</span>
                                        <span>{voltage}V</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="12" step="0.5" 
                                        value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-[#1E2332] rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
                                    />
                                    <div className="flex justify-between text-[9px] font-mono text-slate-600">
                                        <span>0V (OFF)</span>
                                        <span>12V (HIGH)</span>
                                    </div>
                                </div>
                                <button onClick={next} className="group flex items-center gap-3 px-8 py-3 bg-[#00D2FF] text-[#0B0F14] rounded-full font-bold uppercase tracking-widest text-[12px] hover:scale-105 transition-transform">
                                    Next: Current & Flow <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="relative aspect-square bg-[#0A0E1A] rounded-2xl border border-[#1E2332] flex flex-col items-center justify-center overflow-hidden">
                                 {/* Water Tank Visualization Overlay */}
                                 <motion.div 
                                    className="absolute bottom-0 w-full bg-[#00D2FF] opacity-20"
                                    animate={{ height: `${(voltage / 12) * 100}%` }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                 />
                                 <Battery size={120} className="relative z-10 text-[#00D2FF]" />
                                 <div className="mt-8 relative z-10 text-center">
                                    <span className="block font-mono text-[48px] font-bold text-white">{voltage}</span>
                                    <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">Volts (Potential)</span>
                                 </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {screen === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl">
                         <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">The Language of Interaction</h2>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Master the three pillars of electrical engineering.</p>
                         </div>
                         <div className="grid grid-cols-3 gap-8">
                            <AnalogyCard title="Voltage (V)" value={voltage.toString()} unit="V" label="The electrical potential difference or 'push' from the source." color="#00D2FF" />
                            <AnalogyCard title="Current (I)" value={(voltage / 10).toFixed(2)} unit="A" label="The actual flow rate of electrical charge (Amperes)." color="#22C55E" />
                            <AnalogyCard title="Resistance (R)" value="10.0" unit="Ω" label="Opposition to flow. Components or wires that restrict current." color="#F59E0B" />
                         </div>
                         <div className="flex justify-center mt-16">
                            <button 
                                onClick={() => onComplete(15)}
                                className="px-12 py-4 border border-[#00D2FF]/30 text-[#00D2FF] rounded-full font-bold uppercase tracking-widest hover:bg-[#00D2FF]/10 transition-all"
                            >
                                Complete Sub-module 1.2
                            </button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
