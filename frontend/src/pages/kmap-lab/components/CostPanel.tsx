import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { simplify } from '../lib/solver/mintermSimplifier';
import { Sliders, Cpu, Clock, Zap } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export type CostObjective = 'area' | 'delay' | 'power';

export const CostPanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const [objective, setObjective] = useState<CostObjective>('area');

  const { expression, groups } = simplify(minterms, dontCares, numVars, solType);

  const totalTerms = groups.length;
  const totalLiterals = groups.reduce((acc, g) => acc + g.binary.replace(/-/g, '').length, 0);

  // Estimates based on objective
  const gateDepth = totalTerms > 0 ? (totalLiterals > totalTerms ? 2 : 1) : 0;
  const estimatedPowerMw = (totalLiterals * 1.2 + totalTerms * 2.4).toFixed(1);

  if (minterms.length === 0) return null;

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Sliders size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-heading font-bold text-text-main tracking-tight">Cost-Function Optimization</h3>
              <InfoTooltip
                title="Cost-Function Analysis"
                description="Evaluates physical logic implementation metrics: Area (total literal & pin count), Delay (gate logic depth levels), and Power (dynamic CMOS switching activity in mW)."
                side="top"
              />
            </div>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Synthesis Constraints · Area vs Delay vs Power
            </p>
          </div>
        </div>

        {/* Objective Selector */}
        <div className="flex items-center gap-1 p-1 bg-bg-base rounded-xl border border-border-soft">
          <button
            onClick={() => setObjective('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              objective === 'area' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
            }`}
          >
            <Cpu size={14} />
            Area (Literals)
          </button>
          <button
            onClick={() => setObjective('delay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              objective === 'delay' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
            }`}
          >
            <Clock size={14} />
            Delay (Levels)
          </button>
          <button
            onClick={() => setObjective('power')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              objective === 'power' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
            }`}
          >
            <Zap size={14} />
            Power (mW)
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl bg-bg-void border ${objective === 'area' ? 'border-orange-500/50 bg-orange-500/5' : 'border-border-soft'} space-y-1`}>
          <span className="text-xs font-mono text-text-dim uppercase">Total Literals / Area</span>
          <p className="text-2xl font-bold text-accent-orange">{totalLiterals} <span className="text-xs font-normal text-text-dim">literals</span></p>
          <span className="text-[11px] text-text-sub block">Gate inputs count in schematic</span>
        </div>

        <div className={`p-4 rounded-xl bg-bg-void border ${objective === 'delay' ? 'border-amber-500/50 bg-amber-500/5' : 'border-border-soft'} space-y-1`}>
          <span className="text-xs font-mono text-text-dim uppercase">Logic Depth / Propagation Delay</span>
          <p className="text-2xl font-bold text-amber-400">{gateDepth} <span className="text-xs font-normal text-text-dim">levels</span></p>
          <span className="text-[11px] text-text-sub block">Estimated ~{gateDepth * 1.8}ns critical path delay</span>
        </div>

        <div className={`p-4 rounded-xl bg-bg-void border ${objective === 'power' ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-border-soft'} space-y-1`}>
          <span className="text-xs font-mono text-text-dim uppercase">Dynamic Power Activity</span>
          <p className="text-2xl font-bold text-yellow-400">{estimatedPowerMw} <span className="text-xs font-normal text-text-dim">mW</span></p>
          <span className="text-[11px] text-text-sub block">Estimated CMOS switching dissipation</span>
        </div>
      </div>
    </div>
  );
};
