/**
 * SignalRegenerator.tsx - Micro-Module 2.4 (Advanced)
 *
 * Demonstrates digital signal regeneration:
 *   Noisy square wave input → Digital buffer → Clean output
 *
 * Dual-channel oscilloscope: CH1=noisy input, CH2=clean output
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Activity, Cpu } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { VeriSlider } from '../shared/VeriSlider';
import { VeriButton } from '../shared/VeriButton';
import { useAttentionLock } from '../../hooks/useAttentionLock';
import { OscilloscopeCanvas } from './OscilloscopeCanvas';



const BUFFER_SIZE = 256;

interface SignalRegeneratorProps {
    onComplete: (xp: number) => void;
}

export function SignalRegenerator({ onComplete }: SignalRegeneratorProps) {
    const { triggerHaptic } = useGlobalSensory();
    const { focusProps } = useAttentionLock();
    const [noiseAmp, setNoiseAmp] = useState(5);
    const [complete, setComplete] = useState(false);

    const noisyRef = useRef(new Float32Array(BUFFER_SIZE));
    const cleanRef = useRef(new Float32Array(BUFFER_SIZE));
    const writeRef = useRef(0);
    const halfRef = useRef(0);
    const rafRef = useRef(0);

    // Generate both channels
    useEffect(() => {
        const PERIOD = 60;

        function tick() {
            const squareHi = halfRef.current < PERIOD / 2;
            const baseV = squareHi ? 1.0 : 0.0;

            // Noisy channel
            const u1 = Math.random() + 1e-10;
            const u2 = Math.random();
            const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const noise = gaussian * (noiseAmp / 10) * 0.22;
            const noisyV = Math.max(0, Math.min(1, baseV + noise));

            // Clean channel (threshold decision: >0.5 → 1, else → 0)
            const cleanV = noisyV > 0.5 ? 1.0 : 0.0;

            const idx = writeRef.current % BUFFER_SIZE;
            noisyRef.current[idx] = noisyV;
            cleanRef.current[idx] = cleanV;

            halfRef.current = (halfRef.current + 1) % PERIOD;
            writeRef.current++;

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [noiseAmp]);

    const handleObserved = useCallback(() => {
        setComplete(true);
        onComplete(15);
    }, [onComplete]);

    return (
        <div className="flex flex-col gap-6 w-full font-mono">
            <div {...focusProps} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                        <Activity size={18} />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black block">
                            Signal Regeneration Lab
                        </span>
                        <h2 className="text-sm font-black text-slate-900 italic uppercase">Digital Buffer Analysis</h2>
                    </div>
                </div>

                {/* Noise control */}
                <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <VeriSlider
                        value={noiseAmp}
                        onChange={(v) => {
                            setNoiseAmp(v);
                            triggerHaptic('light');
                        }}
                        min={1} max={9}
                        label="Input Noise Amplitude"
                        variant="signal"
                    />
                </div>

                {/* Pipeline diagram */}
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 mb-2">
                    {[
                        { label: 'Noisy Source', color: 'text-rose-500' },
                        { label: '→', color: 'text-slate-300' },
                        { label: 'Digital Buffer', color: 'text-sky-600', special: true },
                        { label: '→', color: 'text-slate-300' },
                        { label: 'Clean Output', color: 'text-emerald-500' },
                    ].map((item, i) => (
                        <div key={i} className={cn("text-[8px] uppercase tracking-widest font-black text-center", item.color)}>
                            {item.special ? (
                                <div className="px-4 py-2 border border-sky-200 bg-white rounded-xl shadow-sm">
                                    {item.label}<br />
                                    <span className="text-[7px] text-slate-400 font-bold">THRESHOLD DECISION</span>
                                </div>
                            ) : item.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dual-channel oscilloscope */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                            Real-time Scope
                        </span>
                    </div>
                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-tighter">
                        <span className="text-sky-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> CH1: Noisy Input
                        </span>
                        <span className="text-amber-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> CH2: Clean Output
                        </span>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                    <OscilloscopeCanvas
                        ch1Samples={noisyRef.current}
                        ch2Samples={cleanRef.current}
                        showThreshold={true}
                        thresholdLow={0.1}
                        thresholdHigh={0.5}
                        label1="CH1 Noisy"
                        label2="CH2 Clean"
                        height={200}
                    />
                </div>
            </div>

            {/* AI Insight */}
            <div className="p-6 bg-white border border-slate-200 rounded-[24px] shadow-lg flex gap-6 items-start border-l-4 border-l-sky-500">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Cpu size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-2">Engineering Principle · Digital Integrity</div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                        "A digital buffer compares input to threshold, then drives output rail to VCC or GND.
                        Noise on the input is discarded - only the binary decision propagates.
                        This is why a digital signal can traverse thousands of kilometers through
                        repeater nodes with zero accumulated degradation."
                    </p>
                </div>
            </div>

            {!complete ? (
                <div className="flex justify-end mt-4">
                    <VeriButton
                        onClick={handleObserved}
                        variant="primary"
                        size="md"
                    >
                        Synchronize Knowledge →
                    </VeriButton>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center gap-4 text-emerald-600"
                >
                    <CheckCircle2 size={24} />
                    <div className="font-black">
                        <div className="text-xs uppercase tracking-widest">
                            MODULE 2.4 COMPLETE - ADVANCED
                        </div>
                        <div className="text-[10px] text-emerald-500/70 uppercase tracking-tighter mt-1">
                            +15 XP · Badge: Digital Advocate Synchronized
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
