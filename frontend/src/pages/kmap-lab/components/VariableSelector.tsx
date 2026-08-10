import React from 'react';
import { useStore } from '../store/useStore';
import { InfoTooltip } from './InfoTooltip';

export const VariableSelector: React.FC = () => {
  const { numVars, setNumVars, solType, setSolType } = useStore();

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 mb-6 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {/* Variable Count Pill */}
      <div className="flex items-center gap-1 p-1.5 bg-bg-elev rounded-2xl border border-border-soft shadow-inner flex-wrap justify-center">
        <span className="text-xs font-bold text-text-dim px-2 hidden sm:inline-flex items-center gap-1">
          Vars:
          <InfoTooltip
            title="Variable Selector"
            description="Select the number of input variables (2, 3, 4, 5, or 6). Supports up to 64-cell K-maps with Gray code adjacency."
            side="top"
          />
        </span>
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setNumVars(n)}
            className={`
              px-3 py-2 lg:px-6 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 min-w-[55px] lg:min-w-0
              ${numVars === n
                ? 'bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white font-bold'
                : 'text-text-dim hover:text-text-main hover:bg-hover-bg'}
            `}
          >
            {n} Vars
          </button>
        ))}
      </div>

      {/* Mode Switch Pill */}
      <div className="flex items-center gap-1 p-1.5 bg-bg-elev rounded-2xl border border-border-soft shadow-inner">
        <span className="text-xs font-bold text-text-dim px-2 hidden sm:inline-flex items-center gap-1">
          Form:
          <InfoTooltip
            title="SOP / POS Synthesis Mode"
            description="SOP (Sum of Products) groups 1s into AND-OR logic. POS (Product of Sums) groups 0s into OR-AND maxterm logic."
            side="top"
          />
        </span>
        {(['SOP', 'POS'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSolType(type)}
            className={`
              px-6 py-2 lg:px-8 lg:py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300
              ${solType === type
                ? 'bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white'
                : 'text-text-dim hover:text-text-main hover:bg-hover-bg'}
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

