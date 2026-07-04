import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSignalState } from '../../types';
import { SignalEngine } from '../../SignalEngine';
import { InteractiveInstrument, EngineeringHUD, KineticText } from '../../components/UltimateComponents';
import { ShieldCheck, Zap, Terminal, Activity, Lock, Unlock, BookOpen } from 'lucide-react';
import { TryItYourself } from '../../../../ui/TryItYourself';

export const P5_MasterLab: React.FC<{
    state: GlobalSignalState;
    onUpdate: (patch: Partial<GlobalSignalState>) => void;
    time: number;
    isDarkMode?: boolean;
}> = ({ state, onUpdate, time, isDarkMode = true }) => {
    const { metrics } = SignalEngine(state, time, 800, 300);
    const [isForging, setIsForging] = useState(false);

    const isStable = metrics.fidelity > 92 && !metrics.aliasing && state.bitDepth >= 16;

    const runAudit = () => {
        setIsForging(true);
        setTimeout(() => setIsForging(false), 3000);
    };

    return (
        <div className="flex flex-col gap-32 w-full max-w-none mx-auto">
            <header className="space-y-10 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-[11px] font-mono font-black uppercase tracking-[0.5em] text-green-500">
                    BitforBytes // MASTER_SUMMARY_AUDIT
                </div>
                <h1 className={`text-[12rem] font-black italic tracking-tighter leading-[0.8] uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    The <br/>
                    <span className="text-green-500">Forge</span>.
                </h1>
                <p className={`text-3xl font-medium max-w-4xl leading-relaxed italic ${isDarkMode ? 'opacity-40 text-white' : 'text-slate-600'}`}>
                    Final Takeaway: Real-world systems are a mix of bothDomains. Leverage the robustness of <span className="text-green-500 font-bold">Digital</span> and the nuance of <span className="text-orange-500 font-bold">Analog</span> through the essential bridges of ADC/DAC conversion.
                </p>
            </header>

            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-20">
                <div className="2xl:col-span-2">
                    <TryItYourself />
                    <InteractiveInstrument
                        state={state} onUpdate={onUpdate} time={time}
                        mapping={{
                            x: { label: "NYQUIST_FS", key: "sampleRate", min: 4, max: 128, unit: "Hz" },
                            y: { label: "QUANTIZATION_BITS", key: "bitDepth", min: 1, max: 24, unit: "Bits" }
                        }}
                    />
                </div>

                <div className="space-y-10">
                    <div className="p-16 rounded-[6rem] bg-black border border-white/5 text-center space-y-16 shadow-[0_60px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
                        
                        <div className="relative mx-auto w-56 h-56 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: isStable ? 360 : 0 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-700 ${isStable ? 'border-green-500 opacity-40' : 'border-white/10 opacity-20'}`} 
                            />
                            <div className={`relative z-10 p-12 rounded-full transition-all duration-1000 ${isStable ? 'bg-green-500 text-black shadow-[0_0_100px_rgba(34,197,94,0.4)] rotate-0' : 'bg-white/5 text-white/10 rotate-12 grayscale'}`}>
                                {isStable ? <Unlock size={80} /> : <Lock size={80} />}
                            </div>
                        </div>

                        <div className="space-y-6 text-left">
                            <div className="flex items-center gap-4 text-green-500 mb-2">
                                <BookOpen size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Mastery_Criteria</span>
                            </div>
                            <ul className="text-lg font-medium text-white/40 leading-relaxed italic space-y-4">
                                <li>• Continuous resolution preserved via <span className="text-green-500">92%+ Fidelity</span></li>
                                <li>• No information loss to <span className="text-red-500">Aliasing</span> (Nyquist-Shannon active)</li>
                                <li>• Robust data storage via <span className="text-[#00D4FF]">16-bit Precision</span></li>
                            </ul>
                        </div>
                        
                        <button 
                            onClick={runAudit}
                            disabled={!isStable || isForging}
                            className={`w-full py-12 rounded-[3.5rem] font-black uppercase tracking-[0.5em] text-sm transition-all relative overflow-hidden ${isStable && !isForging ? 'bg-green-500 text-black shadow-2xl hover:scale-105 active:scale-95' : 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5'}`}
                        >
                            <span className="relative z-10">{isForging ? 'AUDITING...' : isStable ? 'COMMENCE_DEPLOYMENT' : 'CRITERIA_UNMET'}</span>
                        </button>
                    </div>

                    <div className="p-12 rounded-[5rem] bg-[#0A0C10] border border-white/5 space-y-10">
                        <div className="flex items-center gap-4 text-white/20">
                            <Terminal size={20} />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Final_Audit_Protocol</span>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: "Nyquist-Shannon Law", state: !metrics.aliasing, val: state.sampleRate + "Hz" },
                                { label: "Quantization Depth", state: state.bitDepth >= 16, val: state.bitDepth + "Bits" },
                                { label: "Integrated Fidelity", state: metrics.fidelity > 92, val: metrics.fidelity.toFixed(1) + "%" }
                            ].map((c, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest font-mono">
                                        <span className="text-white/40">{c.label}</span>
                                        <span className={c.state ? 'text-green-500' : 'text-red-500'}>{c.state ? 'PASS' : 'FAIL'}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: c.state ? '100%' : '30%' }} className={`h-full ${c.state ? 'bg-green-500' : 'bg-red-500 opacity-40'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <EngineeringHUD metrics={metrics} />
        </div>
    );
};
