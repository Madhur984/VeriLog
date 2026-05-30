
import React from 'react';
import { useStore } from '../store/useStore';
import { Cpu, Zap } from 'lucide-react';
import { simplify } from '../lib/solver/mintermSimplifier';

export const ResultPanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  
  const { expression, groups } = simplify(minterms, dontCares, numVars, solType);

  const totalTerms = groups.length;
  const totalLiterals = groups.reduce((acc, group) => {
    return acc + group.binary.replace(/-/g, '').length;
  }, 0);

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
      <div className="flex items-center justify-between mb-5 lg:mb-8 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${solType === 'SOP' ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main tracking-tight">Simplified Expression</h3>
            <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-1">
              Method: <span className={solType === 'SOP' ? 'text-orange-500' : 'text-amber-500'}>{solType === 'SOP' ? 'Sum of Products' : 'Product of Sums'}</span>
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-base rounded-xl border border-border-soft">
          <Zap size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-text-sub uppercase tracking-tighter">Optimized</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-bg-void border border-border-soft rounded-xl p-6 md:p-8 flex items-center justify-center min-h-[100px] shadow-inner">
          <span className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-center bg-gradient-to-r from-text-main to-accent-orange bg-clip-text text-transparent">
            {expression || (solType === 'SOP' ? '0' : '1')}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium text-text-dim">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          Literals: {totalLiterals}
        </div>
        <div className="w-px h-3 bg-border-soft"></div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          Terms: {totalTerms}
        </div>
      </div>
    </div>
  );
};
