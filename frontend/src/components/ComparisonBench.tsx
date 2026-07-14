import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare, Check, TrendingUp } from 'lucide-react';
import { DOMAINS, Domain } from '../data/domains';
import { cn } from '../utils/cn';
import { useCompass } from '../hooks/useCompass';

interface ComparisonBenchProps {
  comparingIds: string[];
  onClose: () => void;
}

const COMPARISON_ROWS = [
  {
    label: 'DEMAND',
    render: (domain: Domain) => (
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-widest",
        domain.demand === 'High' ? 'border-cyan-400/30 text-cyan-400 bg-cyan-400/5' : 'border-amber-400/30 text-amber-400 bg-amber-400/5'
      )}>{domain.demand}</span>
    ),
    winner: (a: Domain, b: Domain) => {
      const score = { 'High': 3, 'Growing': 2, 'Medium': 1 };
      return score[a.demand] > score[b.demand] ? 'a' : score[b.demand] > score[a.demand] ? 'b' : null;
    }
  },
  {
    label: 'ENTRY SALARY',
    render: (domain: Domain) => `₹${domain.salary.fresher} LPA`,
    winner: (a: Domain, b: Domain) => a.salary.fresher > b.salary.fresher ? 'a' : a.salary.fresher < b.salary.fresher ? 'b' : null
  },
  {
    label: 'SENIOR SALARY',
    render: (domain: Domain) => `₹${domain.salary.senior} LPA`,
    winner: (a: Domain, b: Domain) => a.salary.senior > b.salary.senior ? 'a' : a.salary.senior < b.salary.senior ? 'b' : null
  },
  {
    label: 'DIFFICULTY',
    render: (domain: Domain) => (
       <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-widest",
        domain.difficulty === 'Hard' ? 'border-red-400/30 text-red-400 bg-red-400/5' : 'border-purple-400/30 text-purple-400 bg-purple-400/5'
      )}>{domain.difficulty}</span>
    ),
    winner: null // lower difficulty isn't necessarily better in BitForBytes context
  },
  {
    label: 'YoY GROWTH',
    render: (domain: Domain) => `+${domain.yoyGrowth}%`,
    winner: (a: Domain, b: Domain) => a.yoyGrowth > b.yoyGrowth ? 'a' : a.yoyGrowth < b.yoyGrowth ? 'b' : null
  },
  {
    label: 'TIME TO HIRE',
    render: (domain: Domain) => `~${domain.timeToHire} months`,
    winner: (a: Domain, b: Domain) => a.timeToHire < b.timeToHire ? 'a' : a.timeToHire > b.timeToHire ? 'b' : null
  },
  {
    label: 'GLOBAL DEMAND',
    render: (domain: Domain) => domain.globalDemand,
    winner: (a: Domain, b: Domain) => {
       const score = { 'Very High': 3, 'High': 2, 'Medium': 1, 'Growing': 1 };
       const sA = (score as any)[a.globalDemand] || 0;
       const sB = (score as any)[b.globalDemand] || 0;
       return sA > sB ? 'a' : sA < sB ? 'b' : null;
    }
  },
];

export const ComparisonBench: React.FC<ComparisonBenchProps> = ({ comparingIds, onClose }) => {
  const { result: compassResult } = useCompass();
  const domainA = DOMAINS.find(d => d.id === comparingIds[0]);
  const domainB = DOMAINS.find(d => d.id === comparingIds[1]);

  if (!domainA || !domainB) return null;

  const tally = { a: 0, b: 0 };
  COMPARISON_ROWS.forEach(row => {
    if (row.winner) {
      const winner = row.winner(domainA, domainB);
      if (winner === 'a') tally.a++;
      if (winner === 'b') tally.b++;
    }
  });

  const getVerdict = () => {
    if (compassResult?.primary === domainA.id) {
       return `Based on your Silicon Compass, ${domainA.name} remains your optimal alignment. It leads in ${tally.a} categories and matches your work metabolism profile perfectly.`;
    }
    if (compassResult?.primary === domainB.id) {
       return `While ${domainA.name} is strong, ${domainB.name} aligns with your primary Compass calibration and offers better long-term scalability in the Indian market.`;
    }
    return tally.a > tally.b 
      ? `${domainA.name} shows stronger overall industrial metrics in this comparison.`
      : `${domainB.name} appears to be the more competitive trajectory based on current hiring data.`;
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 sm:p-8 bg-bg-void/95">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl h-[85vh] bg-bg-elev border border-border-soft rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 sm:p-10 border-b border-border-soft flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <GitCompare size={20} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">Domain Comparison Bench</h2>
                <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">Side-by-Side Industrial Analytics</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-base/40 text-slate-500 hover:text-text-main transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {/* Domain Headings */}
           <div className="grid grid-cols-10 border-b border-border-soft bg-bg-base/20">
              <div className="col-span-2 p-6" />
              <div className="col-span-4 p-8 border-x border-border-soft text-center space-y-2">
                 <h3 className="text-text-main font-extrabold text-xl uppercase tracking-tight">{domainA.name}</h3>
                 {compassResult?.primary === domainA.id && <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">★ COMPASS MATCH ★</span>}
              </div>
              <div className="col-span-4 p-8 text-center space-y-2">
                 <h3 className="text-text-main font-extrabold text-xl uppercase tracking-tight">{domainB.name}</h3>
                 {compassResult?.primary === domainB.id && <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">★ COMPASS MATCH ★</span>}
              </div>
           </div>

           {/* Comparison Table */}
           <div className="divide-y divide-border-soft">
              {COMPARISON_ROWS.map((row, idx) => {
                const winner = row.winner ? row.winner(domainA, domainB) : null;
                return (
                  <div key={idx} className="grid grid-cols-10 group hover:bg-bg-base/20 transition-colors">
                    <div className="col-span-2 p-6 flex items-center">
                       <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">{row.label}</span>
                    </div>
                    <div className="col-span-4 p-6 border-x border-border-soft flex items-center justify-center relative">
                       {winner === 'a' && <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
                       <span className={cn("font-medium", winner === 'a' ? "text-text-main font-bold" : "text-text-dim")}>{row.render(domainA)}</span>
                    </div>
                    <div className="col-span-4 p-6 flex items-center justify-center relative">
                       {winner === 'b' && <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
                       <span className={cn("font-medium", winner === 'b' ? "text-text-main font-bold" : "text-text-dim")}>{row.render(domainB)}</span>
                    </div>
                  </div>
                );
              })}
           </div>

            {/* Verdict Section */}
            <div className="p-10 bg-bg-base/20">
               <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center gap-3 justify-center">
                     <div className="h-px w-12 bg-border-soft" />
                     <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">System Verdict</span>
                     <div className="h-px w-12 bg-border-soft" />
                  </div>
                  <div className="p-8 rounded-2xl bg-cyan-400/5 border border-cyan-400/20 text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-cyan-400 to-transparent opacity-30" />
                     <p className="text-text-sub text-lg leading-relaxed">
                        {getVerdict()}
                     </p>
                     <div className="mt-6 pt-6 border-t border-cyan-400/10 flex justify-center gap-12">
                        <div className="text-center">
                           <span className="block text-2xl font-bold text-text-main">{tally.a}</span>
                           <span className="text-[9px] font-mono text-slate-500 uppercase">CATEGORY WINS</span>
                        </div>
                        <div className="text-center">
                           <span className="block text-2xl font-bold text-text-main">{tally.b}</span>
                           <span className="text-[9px] font-mono text-slate-500 uppercase">CATEGORY WINS</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </div>

         {/* Footer Actions */}
         <div className="p-6 sm:p-8 bg-bg-base border-t border-border-soft flex items-center justify-between shrink-0">
            <button onClick={onClose} className="text-[10px] font-mono text-slate-500 hover:text-text-main uppercase tracking-widest">
               Close Comparison
            </button>
            <div className="flex gap-4">
               <button className="px-6 py-2.5 bg-bg-elev text-text-main font-bold uppercase text-[10px] tracking-widest rounded-lg border border-border-soft hover:bg-bg-base transition-colors">
                 Compare Others
               </button>
               <button className="px-6 py-2.5 bg-cyan-400 text-black font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-white transition-colors">
                 Finalize Path →
               </button>
            </div>
         </div>
      </motion.div>
    </div>
  );
};
