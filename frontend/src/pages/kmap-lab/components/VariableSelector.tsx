
import React from 'react';
import { useStore } from '../store/useStore';

export const VariableSelector: React.FC = () => {
  const { numVars, setNumVars, solType, setSolType } = useStore();

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 mb-6 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {/* Variable Count Pill */}
      <div className="flex items-center gap-1 p-1.5 bg-[#171717] rounded-2xl border border-white/5 shadow-inner flex-wrap justify-center">
        {[2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setNumVars(n)}
            className={`
              px-3 py-2 lg:px-6 lg:py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-300 min-w-[60px] lg:min-w-0
              ${numVars === n
                ? 'bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {n} Vars
          </button>
        ))}
      </div>

      {/* Mode Switch Pill */}
      <div className="flex items-center gap-1 p-1.5 bg-[#171717] rounded-2xl border border-white/5 shadow-inner">
        {(['SOP', 'POS'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSolType(type)}
            className={`
              px-6 py-2 lg:px-8 lg:py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300
              ${solType === type
                ? 'bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};
