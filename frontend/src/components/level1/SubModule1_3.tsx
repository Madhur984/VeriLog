import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalRenderer } from '../../circuit-lab/SignalRenderer';
import { Radio, Activity, CheckCircle2, Cpu } from 'lucide-react';

interface SubModuleProps {
    onComplete: (sip: number) => void;
}

interface Junction {
    id: number;
    rotation: number; // 0, 90, 180, 270
    correctRotation: number;
}

/**
 * SubModule1_3: The Signal Hunt (Repair Challenge)
 * Narrative: Satellite Communicator is offline. Fix the return path.
 */
export const SubModule1_3: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [junctions, setJunctions] = useState<Junction[]>([
        { id: 1, rotation: 90, correctRotation: 0 },
        { id: 2, rotation: 180, correctRotation: 0 },
        { id: 3, rotation: 270, correctRotation: 0 },
    ]);
    const [isSolved, setIsSolved] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const rotate = (id: number) => {
        if (isSolved) return;
        setJunctions(prev => prev.map(j => 
            j.id === id ? { ...j, rotation: (j.rotation + 90) % 360 } : j
        ));
    };

    useEffect(() => {
        const solved = junctions.every(j => j.rotation === j.correctRotation);
        if (solved) {
            setIsSolved(true);
            setTimeout(() => setShowSuccess(true), 1500);
        }
    }, [junctions]);

    // Path definitions for SVG
    const supplyPath = "M 150,150 L 650,150"; // Top straight path

    return (
        <div className="w-full h-full flex flex-col items-center p-12 bg-[#0B0F14] relative overflow-hidden">
            {/* Mission Header */}
            <div className="text-center mb-12 max-w-2xl z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Radio size={20} className="text-[#EF4444] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#EF4444] tracking-[.4em] uppercase">Emergency Repair: Comms-Down</span>
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">The Signal Hunt</h2>
                <p className="text-slate-500 mt-4 text-sm font-sans max-w-md mx-auto">
                    The satellite uplink is offline. The signal reaches the dish, but it can't return to the generator. <br/>
                    <strong className="text-slate-300">Align the fragmented traces to restore the loop.</strong>
                </p>
            </div>

            {/* Circuit Board Workbench */}
            <div className="flex-1 w-full max-w-5xl bg-[#0D121F] border border-[#1E2332] rounded-[48px] relative shadow-2xl flex flex-col items-center justify-center group/repair overflow-hidden">
                {/* Board Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `radial-gradient(circle, #00D2FF 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                {/* SVG Signal Canvas */}
                <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Fixed Supply Trace */}
                    <path d={supplyPath} stroke="#1E2332" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <SignalRenderer 
                        path={supplyPath}
                        isActive={true}
                        state={isSolved ? 'smooth' : 'dissipate'}
                        color="#00D2FF"
                    />

                    {/* Return Traces (Conditional based on alignment) */}
                    <path d="M 650,250 L 150,250" stroke="#1E2332" strokeWidth="6" fill="none" strokeDasharray="10 15" strokeOpacity="0.3" />
                </svg>

                {/* Interactive Junctions */}
                <div className="relative z-10 w-full flex justify-around px-24 items-center h-48">
                    {/* Generator */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-32 bg-[#141B2D] border-2 border-[#1E2332] rounded-xl flex items-center justify-center relative shadow-lg">
                            <div className="absolute -top-3 w-8 h-4 bg-slate-700 rounded-t border-2 border-[#1E2332]" />
                            <Activity size={32} className="text-slate-500" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Generator</span>
                    </div>

                    {/* Rotatable Traces */}
                    <div className="flex gap-16">
                        {junctions.map(j => (
                            <motion.button
                                key={j.id}
                                onClick={() => rotate(j.id)}
                                className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all bg-[#0A0D16] ${j.rotation === j.correctRotation ? 'border-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.2)]' : 'border-[#1E2332] hover:border-slate-600'}`}
                                animate={{ rotate: j.rotation }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="w-full h-2 bg-slate-800 relative">
                                    <motion.div 
                                        className="absolute inset-0 bg-[#00D2FF]"
                                        initial={false}
                                        animate={{ 
                                            opacity: j.rotation === j.correctRotation && isSolved ? 1 : 0.2,
                                            boxShadow: j.rotation === j.correctRotation && isSolved ? '0 0 10px #00D2FF' : 'none'
                                        }}
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Satellite Dish (The Load) */}
                    <div className="flex flex-col items-center gap-3">
                        <motion.div 
                            className="w-28 h-28 rounded-full border-2 flex items-center justify-center relative"
                            animate={{
                                borderColor: isSolved ? '#00D2FF' : '#1E2332',
                                backgroundColor: isSolved ? 'rgba(0,210,255,0.1)' : 'transparent',
                                boxShadow: isSolved ? '0 0 40px rgba(0,210,255,0.2)' : 'none'
                            }}
                        >
                            <Radio size={40} className={isSolved ? 'text-[#00D2FF] animate-bounce' : 'text-slate-700'} />
                            <AnimatePresence>
                                {isSolved && (
                                    <motion.div 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 border-2 border-[#00D2FF] rounded-full"
                                    />
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Uplink Dish</span>
                    </div>
                </div>

                {/* Diagnostic Panel */}
                <div className="absolute bottom-10 left-10 p-4 border border-[#1E2332] bg-[#141B2D]/50 rounded-xl max-w-xs font-mono">
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu size={14} className="text-[#00D2FF]" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Diagnostic Data</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Supply Path:</span>
                            <span className="text-emerald-500">OPTIMAL</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Return Integrity:</span>
                            <span className={isSolved ? 'text-emerald-500' : 'text-[#EF4444]'}>
                                {isSolved ? 'LOCKED' : 'FRAGMENTED'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F14]/90 backdrop-blur-md"
                    >
                        <div className="bg-[#141B2D] border border-[#1E2332] p-12 rounded-[40px] text-center max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-[#0B0F14] mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Uplink Restored</h3>
                            <p className="text-slate-400 mb-10 leading-relaxed font-sans">
                                Brilliant work. You realized the loop was broken in the return. By aligning the traces, you've allowed the information to return to the source.
                            </p>
                            <button 
                                onClick={() => onComplete(40)}
                                className="w-full py-4 bg-[#00D2FF] text-[#0B0F14] rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform"
                            >
                                Finalize Repair (+40 SIP)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
