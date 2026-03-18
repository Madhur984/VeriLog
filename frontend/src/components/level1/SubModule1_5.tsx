import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalRenderer } from '../../circuit-lab/SignalRenderer';
import { AlertTriangle, Thermometer, Zap, RefreshCcw } from 'lucide-react';

interface SubModuleProps {
    onComplete: (sip: number) => void;
}

export const SubModule1_5: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [state, setState] = useState<'safe' | 'shorted' | 'failed'>('safe');
    const [heat, setHeat] = useState(25);

    const triggerShort = () => {
        setState('shorted');
        let currentHeat = 25;
        const interval = setInterval(() => {
            currentHeat += 5;
            setHeat(currentHeat);
            if (currentHeat >= 100) {
                clearInterval(interval);
                setState('failed');
            }
        }, 100);
    };

    const reset = () => {
        setState('safe');
        setHeat(25);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-[#0B0F14]">
            <div className="text-center mb-16 max-w-2xl">
                <span className="text-[10px] font-mono text-[#EF4444] tracking-[.3em] uppercase">Safety Engineering</span>
                <h2 className="text-3xl font-bold text-white mt-2">The Short Circuit</h2>
                <p className="text-slate-500 mt-4 text-sm font-sans">
                    Energy follows the path of least resistance. If you bypass the "Load," the current flows at maximum speed, generating heat and destruction.
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-[#141B2D] border border-[#1E2332] rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    {/* Thermal Glow Overlay */}
                    <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        animate={{ 
                            backgroundColor: state === 'safe' ? 'transparent' : `rgba(239, 68, 68, ${(heat - 25) / 150})`
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-12">
                         <div className="flex gap-24 items-center scale-125">
                            <div className="w-16 h-12 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] font-mono text-slate-500">BATTERY</div>
                            <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center">
                                <Zap size={20} className={state === 'shorted' ? 'text-red-500 animate-pulse' : 'text-slate-700'} />
                            </div>
                         </div>

                         <div className="w-full flex justify-between items-center bg-[#0A0E1A] p-4 border border-[#1E2332] rounded-xl">
                            <div className="flex items-center gap-3">
                                <Thermometer size={16} className={heat > 70 ? 'text-red-500' : 'text-[#00D2FF]'} />
                                <span className="font-mono text-xs uppercase text-slate-400">Wire Temp</span>
                            </div>
                            <span className={`font-mono text-sm font-bold ${heat > 70 ? 'text-red-500' : 'text-[#00D2FF]'}`}>{heat}°C</span>
                         </div>

                         {state === 'safe' && (
                            <button 
                                onClick={triggerShort}
                                className="px-8 py-3 bg-[#EF4444] text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                            >
                                Simulate Short (Hazard)
                            </button>
                         )}

                         {state === 'failed' && (
                            <button 
                                onClick={reset}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-mono text-[10px] tracking-widest"
                            >
                                <RefreshCcw size={14} /> Reset System
                            </button>
                         )}
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <SignalRenderer 
                            path="M 150,150 L 350,150"
                            isActive={state !== 'safe'}
                            state={state === 'shorted' ? 'rapid' : 'dissipate'}
                            color="#EF4444"
                        />
                    </svg>
                </div>

                <div className="space-y-6">
                    <div className="p-8 border border-[#1E2332] bg-[#0A0E1A] rounded-2xl relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {state !== 'failed' ? (
                                <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h4 className="font-mono text-[10px] text-[#EF4444] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Danger Assessment
                                    </h4>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                        Without a load to convert electrical energy into something else (light, motion), the energy stays in the wire as <strong className="text-white">vibration (Heat)</strong>.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                            Physical damage to insulators
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                            Source depletion/explosion
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div className="flex flex-col items-center text-center py-4">
                                        <AlertTriangle size={48} className="text-red-500 mb-6 animate-bounce" />
                                        <h4 className="text-xl font-bold text-white mb-2">THERMAL FAILURE</h4>
                                        <p className="text-sm text-slate-400 mb-8 max-w-[200px]">Wire core melted. Circuit continuity lost.</p>
                                        <button 
                                            onClick={() => onComplete(25)}
                                            className="w-full py-4 bg-[#22C55E] text-[#0B0F14] font-bold rounded-xl uppercase tracking-widest text-xs"
                                        >
                                            Mastery Unlocked (+25 SIP)
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
