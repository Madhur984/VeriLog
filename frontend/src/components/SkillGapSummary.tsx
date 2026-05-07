
import React from 'react';
import { motion } from 'framer-motion';
import { COMPANY_SKILL_MAP } from '../data/companySkillMap';
import { Rocket, Target, Zap } from 'lucide-react';

interface SkillGapSummaryProps {
  company: string;
  masteredNodes: Set<string>;
}

export const SkillGapSummary: React.FC<SkillGapSummaryProps> = ({ company, masteredNodes }) => {
  const requirements = COMPANY_SKILL_MAP[company];
  if (!requirements) return null;

  const mastered = requirements.required.filter(n => masteredNodes.has(n));
  const gaps = requirements.required.filter(n => !masteredNodes.has(n));
  const readiness = Math.round((mastered.length / requirements.required.length) * 100);
  
  const colors = {
    Mid: 'text-amber-400 bg-amber-400/10',
    Fresher: 'text-emerald-400 bg-emerald-400/10',
    Senior: 'text-rose-400 bg-rose-400/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-8 bg-observatory-surface border border-white/[0.08] rounded-3xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Gap Analysis</div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{company} Selection Matrix</h3>
          <div className="flex gap-3 mt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Role: {requirements.role}</span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${colors[requirements.level]}`}>
              Level: {requirements.level}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Readiness Score</div>
          <div className="text-4xl font-bold text-white font-mono">{readiness}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <Target size={12} className="text-emerald-400" />
            Mastered Requirements ({mastered.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {mastered.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-emerald-400/5 border border-emerald-400/20 text-emerald-400 text-[10px] font-mono rounded-lg">
                ✓ {skill.replace('-', ' ')}
              </span>
            ))}
            {mastered.length === 0 && <span className="text-[10px] font-mono text-slate-600">No core requirements mastered yet.</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <Zap size={12} className="text-amber-400" />
            Critical Skill Gaps ({gaps.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-amber-400/5 border border-amber-400/20 text-amber-400 text-[10px] font-mono rounded-lg">
                ✗ {skill.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/[0.04] flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Fastest Path to Hire</div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${readiness}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-3 italic">
            Estimated time to clearance: ~{gaps.length * 2} weeks at 2hrs/day calibration.
          </p>
        </div>

        <button className="px-8 py-4 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2">
          <Rocket size={14} />
          Launch Targeted Lab
        </button>
      </div>
    </motion.div>
  );
};
