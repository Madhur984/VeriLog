import React, { useState } from 'react';
import { solveVEM, VEMResult } from '../lib/solver/vemSolver';
import { Grid, Sparkles, Variable } from 'lucide-react';

export const VEMPanel: React.FC = () => {
  const [baseVarCount, setBaseVarCount] = useState<number>(3);
  const [enteredVarStr, setEnteredVarStr] = useState<string>("E");
  const [cellExprs, setCellExprs] = useState<Record<number, string>>({
    0: "1", 1: "E", 2: "0", 3: "E'", 4: "1", 5: "0", 6: "E", 7: "1"
  });

  const enteredVars = enteredVarStr.split(',').map(s => s.trim()).filter(Boolean);
  const result: VEMResult = solveVEM(cellExprs, baseVarCount, enteredVars);

  const totalCells = 1 << baseVarCount;

  const handleCellChange = (idx: number, val: string) => {
    setCellExprs(prev => ({ ...prev, [idx]: val }));
  };

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
            <Variable size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main tracking-tight">Variable-Entered Map (VEM)</h3>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Algebraic Cell Map · Extend K-Map Capacity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-text-dim font-mono">
            <span>Base Vars:</span>
            <select
              value={baseVarCount}
              onChange={(e) => setBaseVarCount(Number(e.target.value))}
              className="px-2 py-1 rounded bg-bg-void border border-border-soft text-text-main font-bold"
            >
              <option value={2}>2 (A,B)</option>
              <option value={3}>3 (A,B,C)</option>
              <option value={4}>4 (A,B,C,D)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-dim font-mono">
            <span>Entered:</span>
            <input
              type="text"
              value={enteredVarStr}
              onChange={(e) => setEnteredVarStr(e.target.value)}
              className="w-16 px-2 py-1 rounded bg-bg-void border border-border-soft text-accent-orange font-bold text-center uppercase"
            />
          </div>
        </div>
      </div>

      {/* VEM Cell Input Grid */}
      <div className="mb-6 space-y-2">
        <span className="text-xs font-mono text-text-dim">Edit VEM Cell Expressions (0, 1, E, E', X):</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Array.from({ length: totalCells }).map((_, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-bg-void border border-border-soft text-center space-y-1">
              <span className="text-[10px] font-mono text-text-dim block">m{idx}</span>
              <input
                type="text"
                value={cellExprs[idx] || "0"}
                onChange={(e) => handleCellChange(idx, e.target.value)}
                className="w-full text-center font-mono font-bold text-xs bg-bg-base border border-border-soft rounded-lg py-1 text-accent-orange uppercase"
              />
            </div>
          ))}
        </div>
      </div>

      {/* VEM Result */}
      <div className="p-5 rounded-2xl bg-bg-void border border-border-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-main uppercase tracking-wider">VEM Reduced Expression</span>
          <span className="text-xs font-mono text-accent-orange">Two-Pass Solution</span>
        </div>

        <div className="p-4 rounded-xl bg-bg-base border border-border-soft font-mono font-bold text-lg text-accent-orange text-center">
          F = {result.simplifiedExpression}
        </div>
      </div>
    </div>
  );
};
