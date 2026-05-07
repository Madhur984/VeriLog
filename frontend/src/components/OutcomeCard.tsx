
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, MapPin } from 'lucide-react';

interface OutcomeCardProps {
  outcome: {
    role: string;
    company: string;
    salary: { year1: number; year3: number; year7: number };
    tags: string[];
    requirements: string[];
  };
  onReset: () => void;
}

export const OutcomeCard: React.FC<OutcomeCardProps> = ({ outcome, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-observatory-surface border border-white/[0.08] rounded-[2.5rem] overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-amber-400 to-orange-500" />
      
      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3">
              <Briefcase size={12} />
              Final Trajectory Lock
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{outcome.role}</h3>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
              <MapPin size={14} className="text-slate-600" />
              {outcome.company}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={12} />
              Fiscal Progression (Projected)
            </div>
            <div className="space-y-4">
              {[
                { label: 'Entry Level', value: outcome.salary.year1, max: outcome.salary.year7 },
                { label: 'Mid Career', value: outcome.salary.year3, max: outcome.salary.year7 },
                { label: 'Senior Lead', value: outcome.salary.year7, max: outcome.salary.year7 },
              ].map(({ label, value, max }) => (
                <div key={label}>
                  <div className="flex justify-between text-[11px] font-mono mb-2">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white">₹{value} LPA</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / max) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Lifestyle Profile</div>
            <div className="flex flex-wrap gap-2">
              {outcome.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono rounded-xl uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Calibration Requirements</div>
            <ul className="space-y-3">
              {outcome.requirements.map(req => (
                <li key={req} className="flex items-start gap-3 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 mt-1.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="p-10 pt-0 flex flex-wrap gap-4">
        <button className="px-10 py-5 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all">
          Bookmark This Trajectory
        </button>
        <button 
          onClick={onReset}
          className="px-10 py-5 border border-white/10 text-slate-400 text-[11px] font-mono uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all"
        >
          Simulate Alternative Path
        </button>
      </div>
    </motion.div>
  );
};
