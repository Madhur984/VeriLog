import React, { useEffect } from 'react';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S10_RealWorld: React.FC = () => {
  useEffect(() => {
    canvasState.magneticStrength = 0.15;
    const handleMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
    };
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
          primary="Signals are Reality." 
          secondary="The language of existence is a function of variation." 
        />

        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-12">
            {[
                { label: "Bio-Signals", desc: "Your heartbeat (ECG), brainwaves (EEG), and nervous impulses. Life is a symphony of signals.", icon: "🫀" },
                { label: "Celestial", desc: "Radio waves from distant pulsars and gravitational waves from colliding black holes.", icon: "🌌" },
                { label: "Financial", desc: "Stock prices and market trends—signals that encode the collective intent of global trade.", icon: "📊" },
                { label: "Silicon", desc: "The rhythmic tick of a CPU clock and the high-speed data packets of the internet.", icon: "💾" }
            ].map((d, i) => (
                <div key={i} className="p-6 rounded-sm bg-black/60 border border-white/5 backdrop-blur-xl group hover:border-v3-cyan/40 transition-all">
                    <div className="text-2xl mb-4 grayscale group-hover:grayscale-0 transition-all">{d.icon}</div>
                    <h4 className="micro-text text-white mb-2 font-black uppercase tracking-widest">{d.label}</h4>
                    <p className="text-[10px] leading-relaxed text-white/40 font-medium">{d.desc}</p>
                </div>
            ))}
        </div>

        <div className="pointer-events-auto mt-12 px-8 py-6 rounded-sm bg-v3-cyan/5 border border-v3-cyan/20 backdrop-blur-xl text-center max-w-2xl">
            <h5 className="micro-text text-v3-cyan mb-2 font-black uppercase tracking-widest">Architectural Insight</h5>
            <p className="text-[11px] font-mono text-white/50 leading-relaxed">
                "Signal Processing is the art of extracting meaning from the noise of the universe. Every waveform we've studied—Energy, Frequency, Noise—converges here. In the next phase, we build the Bridge to translate these infinite flows into the finite calculations of Verilog."
            </p>
        </div>
      </div>
    </div>
  );
};
