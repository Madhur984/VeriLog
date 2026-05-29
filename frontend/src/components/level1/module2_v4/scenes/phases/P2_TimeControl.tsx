import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveInstrument, EngineeringHUD, SpectrumAnalyzer, KineticText, InsightPanel } from '../../components/UltimateComponents';
import { GlobalSignalState } from '../../types';
import { SignalEngine } from '../../SignalEngine';
import { Ghost, ShieldAlert } from 'lucide-react';

export const P2_TimeControl: React.FC<{
    state: GlobalSignalState;
    time: number;
    onUpdate: (patch: Partial<GlobalSignalState>) => void;
}> = ({ state, time, onUpdate }) => {
    const { metrics } = SignalEngine(state, time, 800, 300);

    return (
        <div className="flex flex-col gap-32 w-full max-w-none mx-auto">
            <header className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-red-500/40" />
                    <span className="text-[11px] font-black font-mono tracking-[0.5em] text-red-500 uppercase">Subsystem_Temporal</span>
                </div>
                <h1 className="text-[12rem] font-black italic tracking-tighter leading-[0.8] text-white uppercase">
                    Temporal <br/> 
                    <span className="text-red-500">Clash</span>.
                </h1>
                <p className="text-3xl font-medium opacity-40 text-white max-w-4xl leading-relaxed italic">
                    Digital signals achieve <span className="text-red-500 font-bold">Noise Immunity</span> by ignoring small voltage fluctuations, but they are vulnerable to time-domain errors.
                </p>
            </header>

            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-20">
                <div className="2xl:col-span-2 space-y-12">
                    <InteractiveInstrument 
                        state={state} onUpdate={onUpdate} time={time}
                        mapping={{
                            x: { label: "SAMPLING_CLOCK (Fs)", key: "sampleRate", min: 4, max: 128, unit: "Hz" },
                            y: { label: "INPUT_FREQUENCY (Fmax)", key: "frequency", min: 1, max: 16, unit: "Hz" }
                        }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightPanel 
                            title="The Jitter Factor"
                            content="Sampling requires a perfect clock. If the timing of each sample varies slightly, it creates 'Jitter'—a form of noise that distorts high-frequency signals even if the value itself is accurate."
                            career="Clock & Timing Specialist"
                        />
                        <InsightPanel 
                            title="Anti-Aliasing Filters"
                            content="To prevent aliasing, engineers use a physical analog filter BEFORE the ADC to cut off any frequency above half the sampling rate (Nyquist). This ensures no 'ghosts' enter the digital system."
                            career="Filter Design Engineer"
                        />
                     </div>
                </div>

                <div className="space-y-10">
                    <SpectrumAnalyzer state={state} />
                    
                    <div className={`p-12 rounded-[5rem] border transition-all duration-700 relative overflow-hidden ${metrics.aliasing ? 'bg-red-500/10 border-red-500 shadow-[0_40px_100px_rgba(239,68,68,0.2)]' : 'bg-[#0A0C10] border-white/5'}`}>
                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className={`p-5 rounded-3xl ${metrics.aliasing ? 'bg-red-500 text-black shadow-lg shadow-red-500/30' : 'bg-white/5 text-white/20'}`}>
                                {metrics.aliasing ? <Ghost size={32} /> : <ShieldAlert size={32} />}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-3xl font-black italic text-white uppercase tracking-tighter">Nyquist Check</h4>
                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Fs &gt; 2 * Fmax Requirement</span>
                            </div>
                        </div>
                        <p className="text-lg font-medium text-white/40 leading-relaxed italic relative z-10">
                            {metrics.aliasing 
                                ? "Violation detected. High frequencies are masquerading as low ones. This information loss is mathematically IRREVERSIBLE."
                                : "The Nyquist-Shannon sampling theorem is satisfied. The analog signal can theoretically be perfectly reconstructed."}
                        </p>
                    </div>
                </div>
            </div>

            <EngineeringHUD metrics={metrics} />
        </div>
    );
};
