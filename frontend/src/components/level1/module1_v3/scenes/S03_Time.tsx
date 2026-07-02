import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InlineText } from '../components/InlineText';

export const S03_Time: React.FC = () => {

  useEffect(() => {
    useSignalStore.getState().setSignalMode('periodic');
    canvasState.magneticStrength = 0.5;

    return () => {
      canvasState.magneticStrength = 0;
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
          primary="Time is the carrier." 
          secondary="Signals exist only in the unfolding of now." 
        />
        
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-12">
            <div className="p-8 rounded-sm bg-bg-elev border border-border-soft shadow-neo-sm">
                <h4 className="micro-text text-v3-cyan mb-3 font-black uppercase tracking-[0.2em]">Causality</h4>
                <p className="text-[10px] leading-relaxed text-white/50">A signal cannot depend on the future. It is a record of what has happened, influencing what will happen next. This is the arrow of time in data.</p>
            </div>
            <div className="p-8 rounded-sm bg-bg-elev border border-border-soft shadow-neo-sm">
                <h4 className="micro-text text-v3-cyan mb-3 font-black uppercase tracking-[0.2em]">Persistence</h4>
                <p className="text-[10px] leading-relaxed text-white/50">Does the signal remember its past? LTI systems (Linear Time-Invariant) treat every moment with the same rules, regardless of when it occurs.</p>
            </div>
        </div>

        <div className="micro-text opacity-30 mt-8">Drag to unfold time</div>
      </div>
    </div>
  );
};
