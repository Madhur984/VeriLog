import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IDENTITIES = [
  { law: 'NULL', eq: 'A · 0 = 0 | A + 1 = 1', desc: 'Dominance of 0 in AND, 1 in OR.' },
  { law: 'IDENTITY', eq: 'A · 1 = A | A + 0 = A', desc: 'Neutral elements for each operation.' },
  { law: 'IDEMPOTENT', eq: 'A · A = A | A + A = A', desc: 'Redundant operations have no effect.' },
  { law: 'COMPLEMENT', eq: "A · A' = 0 | A + A' = 1", desc: 'Interaction with opposites.' },
  { law: 'DeMORGAN', eq: "(A·B)' = A'+B' | (A+B)' = A'·B'", desc: 'The fundamental law of logic inversion.' },
  { law: 'ABSORPTION', eq: 'A + (A·B) = A', desc: 'Complex terms simplified by their root.' },
];

const BooleanReferenceHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-10 z-[300]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 rounded-2xl bg-[#0A0A0C]/95 border border-indigo-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(99,102,241,0.2)] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-indigo-500/10">
              <span className="text-xs font-mono font-black italic tracking-widest text-indigo-400 uppercase">
                ENGINE_REFERENCE_v1.0
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {IDENTITIES.map((id, i) => (
                <div key={id.law} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-white/40 italic uppercase tracking-tighter">
                      {id.law}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400/60">0{i+1}</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/[0.03] font-mono text-sm font-black italic text-indigo-300">
                    {id.eq}
                  </div>
                  <p className="text-[10px] font-mono text-white/30 leading-relaxed px-1">
                    {id.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <span className="text-[10px] text-amber-500">⚠</span>
                <span className="text-[9px] font-mono font-black italic text-amber-200/60 uppercase tracking-widest">
                  AXE-OR_TACTICAL_DATA_LINK
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#0A0A0C] border border-indigo-500/50 text-indigo-400 font-mono text-xs font-black italic tracking-widest shadow-2xl transition-all hover:bg-indigo-500/10 hover:border-indigo-400"
      >
        <span className="text-sm">{isOpen ? '✕' : '∫'}</span>
        {isOpen ? 'CLOSE_REF' : 'BOOLEAN_REF'}
      </motion.button>
    </div>
  );
};

export default BooleanReferenceHUD;
