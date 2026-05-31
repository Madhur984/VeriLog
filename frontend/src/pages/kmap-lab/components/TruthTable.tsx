
import React from 'react';
import { useStore } from '../store/useStore';
import { Table as TableIcon } from 'lucide-react';

export const TruthTable: React.FC = () => {
  const { numVars, cellValues } = useStore();
  const variables = ['A', 'B', 'C', 'D', 'E'].slice(0, numVars);
  const totalRows = Math.pow(2, numVars);

  return (
    <div className="glass-card p-6 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
      <div className="flex items-center gap-2 mb-6 text-accent-orange">
        <TableIcon size={20} />
        <h3 className="text-xl font-bold text-text-main tracking-tight">Truth Table</h3>
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
                <div className={`py-2.5 text-center font-mono font-bold text-sm ${val === 1 ? 'text-accent-orange' : val === 'X' ? 'text-amber-500' : 'text-text-dim/40'}`}>
                  {val === 'X' ? '×' : val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
