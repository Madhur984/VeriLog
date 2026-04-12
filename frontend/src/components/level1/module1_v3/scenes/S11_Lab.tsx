import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S11_Lab: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const stability = useSignalStore((s) => s.stability);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.magneticStrength = 0.05;
    
    return () => {
      canvasState.magneticStrength = 0;
    };
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-6 space-y-12 pb-24 flex flex-col items-center">
        <InlineText 
          primary="Stabilization Lab." 
          secondary="Optimal: A=0.6, f=1.5, η=0.0." 
        />

        {/* NEW: Coherence Metrics */}
        <div className="pointer-events-auto flex gap-6 mt-12">
            {[
                { label: "Stability", val: (stability * 100).toFixed(1) + "%", col: stability > 0.8 ? "v3-cyan" : "white/40" },
                { label: "Coherence", val: stability > 0.9 ? "HIGH" : "SYNCING", col: stability > 0.9 ? "v3-cyan" : "white/20" },
                { label: "Integrity", val: "L1-ACTIVE", col: "white/20" }
            ].map((m, i) => (
                <div key={i} className={`px-8 py-4 rounded-sm bg-black/40 border border-${m.col}/20 backdrop-blur-md flex flex-col items-center`}>
                    <span className="text-[8px] opacity-40 uppercase tracking-widest mb-1">{m.label}</span>
                    <span className={`text-xs font-black text-${m.col}`}>{m.val}</span>
                </div>
            ))}
        </div>

        {stability > 0.9 && (
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-text text-v3-cyan tracking-[0.5em] text-sm mt-8"
            >
            COHERENCE ACHIEVED
            </motion.div>
        )}
      </div>
    </div>
  );
};
