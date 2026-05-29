import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveInstrument, CircuitBench, EngineeringHUD, DailyGallery, KineticText, ComparisonConsole, InsightPanel } from '../../components/UltimateComponents';
import { GlobalSignalState } from '../../types';
import { SignalEngine } from '../../SignalEngine';

export const P1_SignalReality: React.FC<{
    state: GlobalSignalState;
    time: number;
    onUpdate: (patch: Partial<GlobalSignalState>) => void;
}> = ({ state, time, onUpdate }) => {
    const { metrics } = SignalEngine(state, time, 800, 300);

    return (
        <div className="flex flex-col gap-32 w-full max-w-none mx-auto">
            <header className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-orange-500/40" />
                    <span className="text-[11px] font-black font-mono tracking-[0.5em] text-orange-500 uppercase">System_Genesis</span>
                </div>
                <h1 className="text-[12rem] font-black italic tracking-tighter leading-[0.8] text-white uppercase">
                    Analog <br/> 
                    <span className="text-orange-500">Realities</span>.
                </h1>
                <p className="text-3xl font-medium opacity-40 text-white max-w-4xl leading-relaxed italic">
                    The real world is <span className="text-orange-500 font-bold">Analog</span>. It is defined by continuous-time and continuous-amplitude voltage fluxes, preserving the infinite resolution of nature.
                </p>
            </header>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-20 items-start">
                <div className="space-y-12">
                     <InteractiveInstrument 
                        state={state} onUpdate={onUpdate} time={time}
                        mapping={{
                            x: { label: "FREQUENCY_TARGET", key: "frequency", min: 1, max: 8, unit: "Hz" },
                            y: { label: "VOLTAGE_PEAK", key: "amplitude", min: 0, max: 100, unit: "Vpp" }
                        }}
                     />
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightPanel 
                            title="The Infinity Paradox"
                            content="In theory, an analog signal can be divided infinitely. In practice, physics intervenes: Thermal Noise (Johnson-Nyquist noise) creates a random floor where data becomes indistinguishable from chaos."
                            career="Integrated Circuit (IC) Designer"
                        />
                        <InsightPanel 
                            title="Signal Propagation"
                            content="Analog signals travel as electromagnetic waves. Every component they pass through-every wire, every transistor-adds a unique physical 'signature' or distortion."
                            career="RF / Antenna Engineer"
                        />
                     </div>
                </div>

                <div className="space-y-12">
                    <CircuitBench state={state} onUpdate={onUpdate} />
                    <ComparisonConsole />
                </div>
            </div>

            <EngineeringHUD metrics={metrics} />

            <div className="space-y-24">
                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="h-px w-40 bg-white/10" />
                    <div className="space-y-2">
                        <h3 className="text-[12px] font-black italic text-white/30 uppercase tracking-[1em]">Physical_Phenomena_Log</h3>
                        <p className="text-sm font-medium text-white/20 italic">Preserving the unbroken line of reality before digitization</p>
                    </div>
                </div>
                <DailyGallery />
            </div>
        </div>
    );
};
