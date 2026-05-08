
import React from 'react';
import { motion } from 'framer-motion';

interface SimulatorRightPanelProps {
  history: { label: string }[];
  outcomes: { id: string; role: string; probability: number }[];
}

export const SimulatorRightPanel: React.FC<SimulatorRightPanelProps> = ({ history, outcomes }) => {
  return (
    <div className="h-full flex flex-col gap-8 p-8">
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Decision History</div>
        <div className="space-y-4">
          {history.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 group"
            >
              <div className="relative flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${i === history.length - 1 ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                {i < history.length - 1 && <div className="w-px h-8 bg-slate-800" />}
              </div>
              <span className="text-[11px] font-mono text-slate-400 group-last:text-white">
                {step.label}
              </span>
            </motion.div>
          ))}
          {history.length === 0 && (
            <div className="text-[11px] font-mono text-slate-600 italic">No decisions logged in current buffer.</div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/[0.04]">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Outcome Probabilities</div>
        <div className="space-y-4">
          {outcomes.map((o) => (
            <div key={o.id}>
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span className="text-slate-400">{o.role}</span>
                <span className="text-cyan-400">{o.probability}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${o.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
