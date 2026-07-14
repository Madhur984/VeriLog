import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S02_Signal: React.FC = () => {
  const updateInteraction = useSignalStore((s) => s.updateInteraction);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  // This scene renders against the module's dark instrument theme.
  const isDarkMode = true;

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
        {/* Signal Theory Comparison Table */}
        <div className="pointer-events-auto mt-12 overflow-hidden rounded-sm border border-border-soft bg-bg-elev shadow-neo-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-4 micro-text text-white/40 font-black uppercase tracking-widest">Dimension</th>
                        <th className="p-4 micro-text text-v3-cyan font-black uppercase tracking-widest">Analog (Continuous)</th>
                        <th className="p-4 micro-text text-white/60 font-black uppercase tracking-widest">Digital (Discrete)</th>
                    </tr>
                </thead>
                <tbody className="text-[10px] font-medium text-white/50">
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 border-r border-white/5 font-bold text-white/30 tracking-widest uppercase">Precision</td>
                        <td className="p-4 text-v3-cyan/80">Infinite (Theoretical)</td>
                        <td className="p-4 italic">Limited by Bits (Finite)</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 border-r border-white/5 font-bold text-white/30 tracking-widest uppercase">Represent</td>
                        <td className="p-4 text-v3-cyan/80">Voltage, Pressure, Temp</td>
                        <td className="p-4 italic">Binary States (0 / 1)</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 border-r border-white/5 font-bold text-white/30 tracking-widest uppercase">Interference</td>
                        <td className="p-4 text-v3-cyan/80">Additive Noise (Irreversible)</td>
                        <td className="p-4 italic">Error Correction (Robust)</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* NEW: Signal Taxonomy & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pointer-events-auto">
            <div className={`p-10 rounded-sm border shadow-neo transition-all duration-700 hover:border-v3-cyan/40 ${isDarkMode ? 'bg-bg-elev border-white/5' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-sm bg-v3-cyan/10 flex items-center justify-center text-v3-cyan">🎲</div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-v3-cyan">The Deterministic Duality</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/40 mb-6">
                    Signals are classified by our ability to predict them. A **Deterministic** signal has no uncertainty; we can calculate its value at any moment with a formula. 
                    A **Random** signal (Stochastic) is unpredictable-we can only describe it using statistics and averages.
                </p>
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-v3-cyan/5 border border-v3-cyan/20 text-[8px] font-bold text-v3-cyan tracking-widest uppercase">Predictable</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-bold text-white/20 tracking-widest uppercase">Statistical</span>
                </div>
            </div>

            <div className={`p-10 rounded-sm border shadow-neo transition-all duration-700 hover:border-v3-cyan/40 ${isDarkMode ? 'bg-bg-elev border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white/40">⚡</div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-v3-cyan transition-colors">Physical Variation</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/30">
                    A signal is never just "math". It is the footprint of a process. In digital logic, it's the movement of charges. 
                    In deep space communication, it's the modulation of electromagnetic fields. 
                    <span className="block mt-4 text-v3-cyan italic font-medium">To measure a signal is to observe the universe in motion.</span>
                </p>
            </div>
        </div>

        {/* NEW: Mathematical Physics Deep Dive */}
        <div className="pointer-events-auto p-12 rounded-sm border border-white/10 bg-gradient-to-br from-black/80 to-v3-cyan/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-v3-cyan/10 blur-[60px] group-hover:bg-v3-cyan/20 transition-all duration-1000" />
            
            <div className="max-w-2xl space-y-8 relative z-10">
                <div className="space-y-2">
                    <h3 className="text-3xl font-black italic tracking-tighter text-white">The Language of <span className="text-v3-cyan">Change</span></h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60 border-l-2 border-v3-cyan pl-4">Time Domain</h5>
                        <p className="text-[10px] leading-loose text-white/30">
                            The immediate reality. We observe values <span className="text-v3-cyan font-mono italic">A(t)</span> as they occur. 
                            This is where we detect "Events" and "Shifts".
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/60 border-l-2 border-white/20 pl-4">Frequency Domain</h5>
                        <p className="text-[10px] leading-loose text-white/30">
                            The hidden structure. We decompose the signal into its constituent sines. 
                            This is where we reveal the "DNA" of the waveform.
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-medium text-white/20 italic tracking-wide">
                        "Every signal has a story in time, but its soul belongs to frequency."
                    </p>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-v3-cyan animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-v3-cyan/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-v3-cyan/10" />
                    </div>
                </div>
            </div>
        </div>

        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                {
                    title: "The Medium",
                    desc: "Signals aren't magic. They need a host. In electronics, it's typically Voltage (V). In acoustics, it's Pressure (P).",
                    formula: "x(t) = A sin(ωt + φ)"
                },
                {
                    title: "The Message",
                    desc: "A signal is a carrier. The actual information is encoded in how the carrier changes its properties over time.",
                    formula: "BW = f_max - f_min"
                },
                {
                    title: "The Domain",
                    desc: "We usually visualize signals in the Time Domain (now vs later), but they can also exist in the Frequency Domain.",
                    formula: "X(f) = ∫ x(t)e^{-j2πft} dt"
                }
            ].map((item, i) => (
                <div key={i} className="p-8 rounded-sm bg-bg-elev border border-border-soft shadow-neo-sm group hover:border-v3-cyan/40 transition-all duration-500 hover:-translate-y-1">
                    <h4 className="micro-text text-v3-cyan mb-3 font-black uppercase tracking-[0.3em]">{item.title}</h4>
                    <p className="text-[10px] leading-relaxed text-white/40 font-medium mb-6 min-h-[4rem]">{item.desc}</p>
                    <div className="pt-6 border-t border-white/5">
                        <code className="text-[9px] font-mono text-v3-cyan/40 group-hover:text-v3-cyan transition-colors">{item.formula}</code>
                    </div>
                </div>
            ))}
        </div>

        <div className="pointer-events-auto p-10 rounded-sm bg-v3-cyan/5 border border-v3-cyan/20 shadow-neo group hover:bg-v3-cyan/10 transition-all duration-700">
             <p className="text-xs leading-relaxed text-white/40 text-center italic tracking-wide group-hover:text-white/60 transition-colors">
                "In the digital bridge, symbols are the only currency. But before those symbols exist, <br/>
                there is only the continuous, unrelenting pulse of the Analog world."
             </p>
        </div>
      </div>
    </div>
  );
};
