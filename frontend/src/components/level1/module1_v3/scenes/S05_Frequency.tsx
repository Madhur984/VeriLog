import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

export const S05_Frequency: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
            primary="Increase repetition." 
            secondary="f ↑ → density ↑" 
        />

        {/* NEW: The Periodic Table of Waves */}
        <div className="pointer-events-auto grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-12 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            {[
                { label: "Ultra Low", desc: "0.1 - 10 Hz", use: "Seismic / EEG" },
                { label: "Infrasonic", desc: "10 - 20 Hz", use: "Wind / Oceans" },
                { label: "Sonic", desc: "20 - 20k Hz", use: "Speech / Music" },
                { label: "Ultrasonic", desc: "> 20k Hz", use: "Medical / Sonar" }
            ].map((p, i) => (
                <div key={i} className="p-4 border border-white/5 bg-white/5 rounded-lg group hover:bg-v3-cyan/10 transition-all">
                    <span className="micro-text text-v3-cyan font-black block mb-2">{p.label}</span>
                    <span className="text-[10px] text-white/60 block mb-1">{p.desc}</span>
                    <span className="text-[8px] text-white/30 italic block line-clamp-1">{p.use}</span>
                </div>
            ))}
        </div>

        <div className="pointer-events-auto mt-8 max-w-2xl">
             <p className="text-[10px] leading-relaxed text-white/30 text-center">
                Frequency represents how many times a signal repeats its cycle within one second (Hertz). In the digital domain, higher frequencies require faster sampling rates to avoid becoming "ghosts" (aliasing).
             </p>
        </div>
      </div>
    </div>
  );
};
