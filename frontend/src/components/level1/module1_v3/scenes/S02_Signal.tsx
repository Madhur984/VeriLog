import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S02_Signal: React.FC = () => {
  const updateInteraction = useSignalStore((s) => s.updateInteraction);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('digital');
    canvasState.magneticStrength = 0.3; // BOOSTED SENSITIVITY from 0.1

    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      canvasState.cursorX = e.clientX;
      canvasState.cursorY = e.clientY;
      updateInteraction(0.08); // BOOSTED SENSITIVITY from 0.016
      checkProceed();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, [updateInteraction, checkProceed, setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24">
        <InlineText 
          primary="Variation exists." 
          secondary="Signals classify change as discrete or continuous." 
        />

        {/* NEW: Interactive Signal Theory for Module 1 */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                {
                    title: "The Medium",
                    desc: "Signals aren't magic. They need a host. In electronics, it's typically Voltage (V). In acoustics, it's Pressure (P).",
                    tip: "Without a medium, information has nowhere to travel."
                },
                {
                    title: "The Message",
                    desc: "A signal is a carrier. The actual information is encoded in how the carrier changes its properties over time.",
                    tip: "Frequency, Amplitude, and Phase are our encoding tools."
                },
                {
                    title: "The Domain",
                    desc: "We usually visualize signals in the Time Domain (now vs later), but they can also exist in the Frequency Domain.",
                    tip: "Every complex wave is just a sum of simple sines."
                }
            ].map((item, i) => (
                <div key={i} className="p-6 rounded-sm bg-black/60 border border-white/10 backdrop-blur-xl group hover:border-v3-cyan/40 transition-all">
                    <h4 className="micro-text text-v3-cyan mb-2 font-black uppercase tracking-widest">{item.title}</h4>
                    <p className="text-[10px] leading-relaxed text-white/60 font-medium mb-4">{item.desc}</p>
                    <div className="pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] italic text-v3-cyan/70">{item.tip}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="pointer-events-auto p-8 rounded-sm bg-v3-cyan/5 border border-v3-cyan/20 backdrop-blur-xl">
             <p className="text-xs leading-relaxed text-white/50 text-center italic">
                "To understand a system, you must first understand the language it speaks. In VeriLog, that language is the Signal. It is the lifeblood of every digital design."
             </p>
        </div>
      </div>
    </div>
  );
};
