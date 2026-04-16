import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveInstrument, EngineeringHUD, KineticText, InsightPanel } from '../../components/UltimateComponents';
import { GlobalSignalState } from '../../types';
import { SignalEngine } from '../../SignalEngine';
import { Dna, Zap } from 'lucide-react';

export const P3_ValuePrecision: React.FC<{
    state: GlobalSignalState;
    time: number;
    onUpdate: (patch: Partial<GlobalSignalState>) => void;
}> = ({ state, time, onUpdate }) => {
    const { metrics } = SignalEngine(state, time, 800, 300);

    return (
        <div className="flex flex-col gap-32 w-full max-w-none mx-auto">
            <header className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-[#00D4FF]/40" />
                    <span className="text-[11px] font-black font-mono tracking-[0.5em] text-[#00D4FF] uppercase">Subsystem_Resolution</span>
                </div>
                <h1 className="text-[12rem] font-black italic tracking-tighter leading-[0.8] text-white uppercase">
                    Value <br/> 
                    <span className="text-[#00D4FF]">Depths</span>.
                </h1>
                <p className="text-3xl font-medium opacity-40 text-white max-w-4xl leading-relaxed italic">
                    Mapping infinite voltage to finite <span className="text-[#00D4FF] font-bold">Discrete Levels</span>. The cost of precision is bandwidth.
                </p>
            </header>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <InteractiveInstrument 
                        state={state} onUpdate={onUpdate} time={time}
                        mapping={{
                            x: { label: "RESOLUTION (N-Bits)", key: "bitDepth", min: 1, max: 24, unit: "Bits" },
                            y: { label: "INPUT_LEVEL_V", key: "amplitude", min: 0, max: 100, unit: "%" }
                        }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightPanel 
                            title="Dynamic Range (6dB Rule)"
                            content="Every 1-bit increase in depth improves your dynamic range by approximately 6dB. A 16-bit signal offers 96dB of range, which matches the human ear's optimal threshold."
                            career="Audio Hardware Engineer"
                        />
                        <InsightPanel 
                            title="LSB vs MSB"
                            content="The 'Least Significant Bit' (LSB) represents the smallest possible change a system can measure. The 'Most Significant Bit' (MSB) handles the bulk of the signal energy."
                            career="Embedded Systems Architect"
                        />
                     </div>
                </div>

                <div className="space-y-12">
                    <div className="p-16 rounded-[6rem] bg-[#0A0C10] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-6">
                                <div className={`p-6 rounded-[2rem] transition-all duration-700 ${state.dither ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-white/5 text-white/20'}`}>
                                    <Dna size={40} />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-4xl font-black italic text-white uppercase tracking-tighter">Quantization</h4>
                                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Discrete Domain Mapping</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xl font-medium text-white/40 leading-relaxed italic relative z-10">
                            Increasing Bit-Depth (N) provides \( 2^N \) distinct values, reducing <span className="text-orange-500 font-bold">Quantization Noise</span> floor until it is inaudible.
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5 relative z-10">
                             <div className="space-y-3">
                                <div className="text-[9px] font-black uppercase text-white/20 tracking-widest font-mono">Signal-to-Noise</div>
                                <div className="text-6xl font-black italic text-[#00D4FF] font-mono tracking-tighter tabular-nums">{metrics.snr.toFixed(0)}<span className="text-lg opacity-20 ml-2 uppercase">dB</span></div>
                             </div>
                             <div className="space-y-3">
                                <div className="text-[9px] font-black uppercase text-white/20 tracking-widest font-mono">Total_Resolution</div>
                                <div className="text-6xl font-black italic text-[#00D4FF] font-mono tracking-tighter tabular-nums">{(Math.pow(2, state.bitDepth)).toLocaleString()}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <EngineeringHUD metrics={metrics} />
        </div>
    );
};
