import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

export const S04_Energy: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('rectangular');
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
            primary="Increase energy." 
            secondary="A ↑ → power ↑" 
        />

        {/* NEW: The Power Scale (Logarithmic Reality) */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12 bg-black/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="space-y-4">
                <h4 className="micro-text text-v3-cyan font-black italic tracking-widest uppercase text-left">Linear vs Log</h4>
                <p className="text-[10px] text-white/40 leading-relaxed text-left">
                    Amplitude is the **reach** of a signal. In linear terms, doubling amplitude quadruples the power $(P ∝ A^2)$. This is why we use Decibels (dB)-to squash massive ranges of energy into numbers humans can handle.
                </p>
                <div className="flex gap-1 h-4 items-end">
                    {[0, 1, 2, 4, 8, 16].map((h, i) => (
                        <div key={i} className="flex-1 bg-v3-cyan" style={{ height: `${(h/16)*100}%` }} />
                    ))}
                </div>
            </div>
            
            <div className="space-y-4">
                <h4 className="micro-text text-v3-cyan font-black italic tracking-widest uppercase text-left">Real World Energy</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 border border-white/5 bg-white/5 rounded">
                      <span className="text-[8px] text-white/40 block mb-1">Whisper</span>
                      <span className="text-[10px] text-v3-cyan font-black">~30 dB</span>
                   </div>
                   <div className="p-2 border border-white/5 bg-white/5 rounded">
                      <span className="text-[8px] text-white/40 block mb-1">Turbo Jet</span>
                      <span className="text-[10px] text-v3-cyan font-black">~140 dB</span>
                   </div>
                </div>
                <p className="text-[9px] text-white/20 italic text-left">
                   Every 6dB increase roughly doubles the linear amplitude peak.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
