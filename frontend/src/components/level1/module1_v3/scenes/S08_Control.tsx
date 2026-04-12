import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

export const S08_Control: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('deterministic');
    const timer = setTimeout(() => {
      useSignalStore.setState({ canProceed: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
          primary="Signal Processing." 
          secondary="The pipeline transforms raw entropy into structured logic." 
        />

        {/* NEW: DSP Pipeline Visualization */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-4 gap-2 w-full mt-12 bg-black/40 p-1 rounded-sm border border-white/5">
            {[
                { step: "SENSING", tool: "Transducers", col: "white/20" },
                { step: "CONDITIONING", tool: "Op-Amps", col: "v3-cyan/40" },
                { step: "CONVERSION", tool: "ADC/DAC", col: "v3-cyan/70" },
                { step: "PROCESSING", tool: "Silicon", col: "v3-cyan" }
            ].map((p, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-black/20 group hover:bg-v3-cyan/5 transition-all">
                    <span className={`micro-text text-${p.col} mb-1 font-black`}>{p.step}</span>
                    <span className="text-[9px] text-white/40 italic">{p.tool}</span>
                </div>
            ))}
        </div>

        <div className="pointer-events-auto mt-8 max-w-2xl">
             <p className="text-[10px] leading-relaxed text-white/30 text-center">
                Processing is the bridge between **Matter** and **Meaning**. By applying mathematical operators—filters, gains, and transforms—we can isolate the information that matters while discarding the noise that doesn't.
             </p>
        </div>

        <div className="micro-text mt-12 animate-pulse opacity-40">Analyzing DSP pipeline...</div>
      </div>
    </div>
  );
};
