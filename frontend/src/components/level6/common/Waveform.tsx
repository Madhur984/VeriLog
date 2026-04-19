import React from 'react';
import { motion } from 'framer-motion';

export interface Signal {
  name: string;
  values: (0 | 1)[];
}

export const Waveform: React.FC<{ signals: Signal[], className?: string }> = ({ signals, className = "" }) => {
  return (
    <div className={`bg-black/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[30px] w-full font-mono text-[10px] md:text-sm shadow-2xl ${className}`}>
      {signals.map((sig, i) => (
        <div key={i} className="flex items-center gap-6 md:gap-8 mb-6 last:mb-0">
          <span className="w-16 md:w-24 text-plasma-cyan font-black uppercase tracking-widest truncate">{sig.name}</span>
          <div className="flex-1 flex h-10 md:h-12 relative overflow-hidden border-l border-white/10">
            {sig.values.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex-1 relative group h-full`}
              >
                {/* Waveform Visualization */}
                <div className={`absolute left-0 right-0 h-0.5 md:h-1 bg-plasma-cyan transition-all duration-300 ${v === 1 ? 'top-0' : 'bottom-0'}`} />
                
                {/* Vertical transitions */}
                {idx > 0 && sig.values[idx-1] !== v && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 md:w-1 bg-plasma-cyan" />
                )}

                {/* Shading for '1' signals */}
                {v === 1 && (
                    <div className="absolute inset-x-0 top-0 bottom-0 bg-plasma-cyan/10 animate-pulse" />
                )}

                {/* Grid line indicator */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/5" />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
