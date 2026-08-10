import React from 'react';
import { useStore } from '../store/useStore';
import { Table as TableIcon, Edit3 } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const TruthTable: React.FC = () => {
  const { numVars, cellValues, toggleCellValue } = useStore();
  const variables = ['A', 'B', 'C', 'D', 'E'].slice(0, numVars);
  const totalRows = Math.pow(2, numVars);

  return (
    <div className="glass-card p-6 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
      <div className="flex items-center justify-between mb-4 text-accent-orange">
        <div className="flex items-center gap-2">
          <TableIcon size={20} />
          <h3 className="text-xl font-bold text-text-main tracking-tight">Truth Table</h3>
          <InfoTooltip
            title="Truth Table"
            description="Exhaustive input combination table mapping binary variables to output state F. Click any F cell value directly to toggle (0 → 1 → X)."
            side="bottom"
          />
        </div>
        <span className="text-[11px] font-mono text-text-dim flex items-center gap-1">
          <Edit3 size={12} className="text-accent-orange" />
          Click F to Edit
        </span>
      </div>
      
      <div className="border border-border-soft rounded-xl overflow-hidden bg-bg-base/20">
        <div className="grid border-b border-border-soft bg-bg-base" style={{ gridTemplateColumns: `repeat(${numVars}, 1fr) 80px` }}>
          {variables.map((v) => (
            <div key={v} className="py-3 text-center text-xs font-bold text-accent-orange uppercase tracking-widest border-r border-border-soft">
              {v}
            </div>
          ))}
          <div className="py-3 text-center text-xs font-bold text-accent-orange uppercase tracking-widest">
            F
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
          {Array.from({ length: totalRows }).map((_, i) => {
            const binary = i.toString(2).padStart(numVars, '0');
            const val = cellValues[i] || 0;
            
            return (
              <div 
                key={i} 
                className="grid border-b border-border-soft hover:bg-hover-bg transition-colors" 
                style={{ gridTemplateColumns: `repeat(${numVars}, 1fr) 80px` }}
              >
                {binary.split('').map((bit, idx) => (
                  <div key={idx} className="py-2.5 text-center font-mono text-sm text-text-dim border-r border-border-soft">
                    {bit}
                  </div>
                ))}
                <button
                  onClick={() => toggleCellValue(i)}
                  className={`py-2.5 text-center font-mono font-bold text-sm hover:bg-orange-500/10 transition-colors cursor-pointer ${
                    val === 1 ? 'text-accent-orange font-extrabold' : val === 'X' ? 'text-amber-500' : 'text-text-dim/40'
                  }`}
                  title={`Click to cycle m${i} value (0 → 1 → X)`}
                >
                  {val === 'X' ? '×' : val}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
