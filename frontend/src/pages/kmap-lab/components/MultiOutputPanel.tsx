import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { solveMultiOutput, FunctionDefinition, MultiOutputResult } from '../lib/solver/multiOutputSolver';
import { Layers, Plus, Trash2, Share2, Sparkles } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const MultiOutputPanel: React.FC = () => {
  const { numVars, minterms, dontCares } = useStore();
  const [functions, setFunctions] = useState<FunctionDefinition[]>([
    { id: 'f1', name: 'F1', minterms: [0, 1, 4, 5], dontCares: [] },
    { id: 'f2', name: 'F2', minterms: [4, 5, 10, 14], dontCares: [] }
  ]);

  const result: MultiOutputResult = solveMultiOutput(functions, numVars);

  const handleAddFunction = () => {
    const nextIdx = functions.length + 1;
    setFunctions(prev => [
      ...prev,
      { id: `f${nextIdx}`, name: `F${nextIdx}`, minterms: [0, 2, 4], dontCares: [] }
    ]);
  };

  const handleRemoveFunction = (id: string) => {
    if (functions.length <= 1) return;
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const handleSyncCurrentKMap = (id: string) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, minterms: [...minterms], dontCares: [...dontCares] } : f));
  };

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Layers size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-text-main tracking-tight">Multi-Output Function Minimisation</h3>
              <InfoTooltip
                title="Multi-Output Minimizer"
                description="Simultaneously minimizes multiple Boolean outputs (F1, F2...) to identify and extract shared product terms, reducing overall gate count across the entire circuit."
                side="top"
              />
            </div>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Shared Product Term Optimisation · {result.gateReductionPercentage}% Gate Reduction
            </p>
          </div>
        </div>

        <button
          onClick={handleAddFunction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
        >
          <Plus size={14} />
          <span>Add Function</span>
        </button>
      </div>

      {/* Function Definitions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {result.functions.map((f) => (
          <div key={f.id} className="p-4 rounded-xl bg-bg-void border border-border-soft space-y-3">
            <div className="flex items-center justify-between border-b border-border-soft pb-2">
              <span className="font-bold text-accent-orange text-sm font-mono">{f.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSyncCurrentKMap(f.id)}
                  className="px-2 py-1 rounded bg-bg-elev hover:bg-hover-bg text-text-dim hover:text-text-main text-[11px] font-mono transition-colors"
                  title="Import current active K-Map minterms"
                >
                  Sync Active K-Map
                </button>
                {functions.length > 1 && (
                  <button
                    onClick={() => handleRemoveFunction(f.id)}
                    className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-bg-base border border-border-soft font-mono text-xs text-orange-300">
              {f.name} = {f.expression || '0'}
            </div>
          </div>
        ))}
      </div>

      {/* Shared Implicants Summary */}
      {result.sharedImplicants.length > 0 ? (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Shared Product Terms (Reused Across Outputs)</span>
          </div>

          <div className="space-y-2">
            {result.sharedImplicants.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-void border border-border-soft font-mono text-xs">
                <span className="font-bold text-accent-orange">{s.expression} ({s.binary})</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-dim text-[11px]">Reused in:</span>
                  {s.usedInFunctions.map(fn => (
                    <span key={fn} className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                      {fn}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-bg-void border border-border-soft text-xs text-text-dim italic text-center">
          No shared terms between these functions. Standard independent minimisation applied.
        </div>
      )}
    </div>
  );
};
