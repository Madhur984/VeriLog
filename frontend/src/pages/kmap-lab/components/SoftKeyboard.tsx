import React from 'react';
import { useStore } from '../store/useStore';
import { Delete, RotateCcw } from 'lucide-react';

interface SoftKeyboardProps {
  onInsertSymbol: (symbol: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const SoftKeyboard: React.FC<SoftKeyboardProps> = ({
  onInsertSymbol,
  onBackspace,
  onClear
}) => {
  const { numVars, varNames } = useStore();
  const vars = varNames.slice(0, numVars);

  const operators = [
    { label: "NOT ( ' )", symbol: "'" },
    { label: "OR ( + )", symbol: " + " },
    { label: "AND ( · )", symbol: "" },
    { label: "XOR ( ⊕ )", symbol: " ^ " },
    { label: "(", symbol: "(" },
    { label: ")", symbol: ")" }
  ];

  return (
    <div className="p-3 rounded-2xl bg-bg-void/90 border border-border-soft space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">Soft Engineering Keyboard</span>
        <span className="text-[10px] font-mono text-accent-orange">Quick Operators</span>
      </div>

      {/* Variables row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {vars.map((v) => (
          <button
            key={v}
            onClick={() => onInsertSymbol(v)}
            type="button"
            className="flex-1 min-w-[40px] py-2 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 font-mono font-extrabold text-sm rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {v}
          </button>
        ))}

        {/* Backspace & Clear */}
        <button
          onClick={onBackspace}
          type="button"
          className="p-2 bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main rounded-xl transition-all active:scale-95"
          title="Backspace"
        >
          <Delete size={16} />
        </button>

        <button
          onClick={onClear}
          type="button"
          className="p-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-xl transition-all active:scale-95"
          title="Clear Input"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Operators row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {operators.map((op) => (
          <button
            key={op.label}
            onClick={() => onInsertSymbol(op.symbol)}
            type="button"
            className="flex-1 min-w-[44px] py-1.5 bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main font-mono font-bold text-xs rounded-xl transition-all active:scale-95"
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
};
