import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S07_Noise: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.secondaryEnabled = true;
    canvasState.secondaryOpacity = 0.2;
    canvasState.secondaryFrequencyMult = 4.0;
    
    return () => {
      canvasState.secondaryEnabled = false;
    };
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
            primary="Introduce distortion." 
            secondary="η ↑ → noise ↑" 
        />

        {/* NEW: Signal-to-Noise (SNR) Deep Dive */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12 bg-bg-elev p-6 rounded-xl border border-border-soft shadow-neo">
            <div className="space-y-4">
                <h4 className="micro-text text-v3-cyan font-black italic tracking-widest uppercase">The Signal Floor</h4>
                <p className="text-[10px] text-white/40 leading-relaxed">
                    Every physical system has a "noise floor"-a level of random electrical variation caused by heat, nearby interference, or the limits of your sensing hardware. If your signal is too weak, it gets "swallowed" by this floor.
                </p>
                <div className="h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div animate={{ x: [-20, 20] }} transition={{ repeat: Infinity, duration: 0.1 }} className="h-full w-20 bg-v3-cyan/40" />
                </div>
            </div>
            
            <div className="space-y-4">
                <h4 className="micro-text text-v3-cyan font-black italic tracking-widest uppercase">The SNR Ratio</h4>
                <p className="text-[10px] text-white/40 leading-relaxed">
                    SNR (Signal-to-Noise Ratio) is the distance between your message and the noise. A higher SNR means a cleaner bridge between analog and digital. In digital systems, we measure this in **decibels (dB)**.
                </p>
                <div className="mt-2 font-mono text-[9px] text-v3-cyan bg-black/40 px-3 py-1 border border-v3-cyan/10 rounded-sm">
                    SNR = 20 * log10( V_signal / V_noise )
                </div>
            </div>
        </div>

        {/* Colors of Noise */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
            <div className="p-6 rounded-sm border border-border-soft bg-bg-elev shadow-neo-sm">
                <h5 className="micro-text text-white/60 mb-2 font-black uppercase tracking-widest text-left">White Noise</h5>
                <p className="text-[9px] text-white/30 leading-relaxed italic text-left">Equal energy across all frequencies. Sounds like static or rain.</p>
            </div>
            <div className="p-6 rounded-sm border border-border-soft bg-bg-elev shadow-neo-sm">
                <h5 className="micro-text text-[#f97316] mb-2 font-black uppercase tracking-widest text-left">Pink Noise</h5>
                <p className="text-[9px] text-white/30 leading-relaxed italic text-left">Energy decreases as frequency increases. Sounds more natural to the human ear.</p>
            </div>
        </div>

        <div className="pointer-events-auto mt-8 max-w-2xl">
             <p className="text-[10px] leading-relaxed text-white/30 text-center">
                Noise is the enemy of information. The goal of any engineer is to maximize the SNR while minimizing the bandwidth required.
             </p>
        </div>
      </div>
    </div>
  );
};
