
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SILICON_ARCHETYPES } from '../data/archetypes';
import { ShieldCheck, Download, Share2 } from 'lucide-react';

interface SiliconPersonalityEngineProps {
  choices: string[];
  onComplete: () => void;
}

export const SiliconPersonalityEngine: React.FC<SiliconPersonalityEngineProps> = ({ choices, onComplete }) => {
  // Simple heuristic matching
  const archetype = SILICON_ARCHETYPES.find(a => 
    a.triggerPath.some(path => choices.includes(path))
  ) || SILICON_ARCHETYPES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-[2.5rem] relative overflow-hidden bg-observatory-surface border border-white/[0.06]"
    >
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-10 blur-[100px]"
        style={{ backgroundColor: archetype.color }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-4" style={{ color: archetype.color }}>
            Neural Archetype Detected
          </div>
          <h2 className="text-6xl font-bold text-white mb-4 tracking-tighter">
            {archetype.name}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-md">
            {archetype.subtitle}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                🧠
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Core Strength</div>
                <div className="text-sm text-white">{archetype.strength}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                🏢
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Target Ecosystems</div>
                <div className="text-sm text-white">{archetype.companies.join(' • ')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Shareable Card Mockup */}
          <div className="w-72 aspect-[3/4] rounded-3xl bg-black/40 border border-white/10 p-6 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: archetype.color }} />
            
            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">VeriLog Silicon ID</div>
            
            <div className="text-6xl my-4">{archetype.icon}</div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{archetype.name}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase mt-1">Verified Trajectory</div>
            </div>

            <div className="w-full pt-4 border-t border-white/5 flex justify-between items-end">
              <div className="text-[7px] font-mono text-slate-600">ID: AX-882-EVO</div>
              <ShieldCheck size={16} className="text-cyan-400/40" />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
              <Download size={18} />
            </button>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
              <Share2 size={18} />
            </button>
            <button 
              onClick={onComplete}
              className="px-8 py-4 bg-cyan-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all"
            >
              Finalize Outcome →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
