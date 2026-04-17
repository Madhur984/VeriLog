import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSignalState } from '../../types';
import { SignalEngine } from '../../SignalEngine';
import { InteractiveInstrument, EngineeringHUD, KineticText, LogicReadout } from '../../components/UltimateComponents';
import { Heart, Car, Wifi, ShieldAlert, CheckCircle, Target, Boxes, Zap } from 'lucide-react';

const SCENARIOS = [
    {
        id: 'ecg',
        title: "Medical ADC",
        icon: <Heart size={24} />,
        description: "Capturing analog heart fluxes. An ADC transforms continuous voltage into digital code via Sampling, Quantization, and Encoding.",
        target: { bitDepth: 12 },
        accent: "#EF4444"
    },
    {
        id: 'radar',
        title: "Tesla Logic",
        icon: <Car size={24} />,
        description: "Sensor data must be immune to engine noise. Conversion to binary logic bands ensures absolute data integrity over distance.",
        target: { samplingRate: 80 },
        accent: "#F59E0B"
    },
    {
        id: 'audio',
        title: "DAC Speaker",
        icon: <Zap size={24} />,
        description: "Reconstructing sound. A DAC converts binary bits back into voltage, using a Reconstruction Filter to remove staircase artifacts.",
        target: { fidelity: 92, dither: true },
        accent: "#00D4FF"
    }
];

export const P4_SystemConversion: React.FC<{
    state: GlobalSignalState;
    onUpdate: (patch: Partial<GlobalSignalState>) => void;
    time: number;
}> = ({ state, onUpdate, time }) => {
    const [activeId, setActiveId] = useState(SCENARIOS[0].id);
    const scene = SCENARIOS.find(s => s.id === activeId)!;
    const { metrics } = SignalEngine(state, time, 800, 300);

    const isSuccess = 
        (activeId === 'ecg' && state.bitDepth >= 12) ||
        (activeId === 'radar' && state.samplingRate >= 80) ||
        (activeId === 'audio' && metrics.fidelity >= 92 && state.dither);

    return (
        <div className="flex flex-col gap-32 w-full max-w-none mx-auto">
            <header className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-purple-500/40" />
                    <span className="text-[11px] font-black font-mono tracking-[0.5em] text-purple-500 uppercase">Master_Guide // Series_04</span>
                </div>
                <h1 className="text-[12rem] font-black italic tracking-tighter leading-[0.8] text-white uppercase">
                    System <br/> 
                    <span className="text-purple-500">Bridges</span>.
                </h1>
                <p className="text-3xl font-medium opacity-40 text-white max-w-4xl leading-relaxed italic">
                    Real-world systems are <span className="text-purple-500 font-bold">Mixed-Signal</span>. We use ADCs to capture the world and DACs to speak back to it, bridging the language of physics and the language of logic.
                </p>
            </header>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-20">
                <div className="space-y-6">
                    {SCENARIOS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveId(s.id)}
                            className={`group flex items-center gap-10 p-12 rounded-[5rem] border transition-all text-left relative overflow-hidden ${activeId === s.id ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-transparent hover:bg-white/[0.01] opacity-40'}`}
                        >
                            <div className={`p-8 rounded-[2.5rem] transition-all ${activeId === s.id ? 'bg-white text-black' : 'bg-white/5 text-white/20'}`}>
                                {s.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-3xl font-black italic text-white uppercase tracking-tighter">{s.title}</h4>
                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1 block">CONVERSION_BRIDGE_00{SCENARIOS.indexOf(s)+1}</span>
                            </div>
                            {isSuccess && activeId === s.id && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-4 bg-green-500 rounded-full text-black shadow-lg shadow-green-500/40">
                                    <CheckCircle size={24} />
                                </motion.div>
                            )}
                        </button>
                    ))}

                    <div className="p-16 rounded-[6rem] bg-black border border-white/5 space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4 text-purple-500 mb-4">
                            <ShieldAlert size={24} />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em]">Hardware_Requirement</span>
                        </div>
                        <p className="text-2xl font-medium text-white/60 italic leading-relaxed">
                            {scene.description}
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                     <InteractiveInstrument 
                        state={state} onUpdate={onUpdate} time={time}
                        mapping={{
                            x: { label: "SYSTEM_LATENCY", key: "samplingRate", min: 4, max: 128, unit: "ms" },
                            y: { label: "QUANTIZATION_ERROR", key: "bitDepth", min: 1, max: 24, unit: "LSB" }
                        }}
                    />
                    <LogicReadout metrics={metrics} />
                </div>
            </div>

            <EngineeringHUD metrics={metrics} />
        </div>
    );
};
