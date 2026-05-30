import React from 'react';
import { useStore } from '../store/useStore';
import { Play, RotateCcw, FileText } from 'lucide-react';

export const BooleanInput: React.FC = () => {
  const { expression, setExpression, reset, loadExample } = useStore();

  return (
    <div className="glass-card p-4 lg:p-8 mb-6 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div className="flex items-center gap-2 mb-4 lg:mb-6 text-accent-orange">
        <span className="text-xl font-bold">{'>'}</span>
        <h3 className="text-xl font-bold text-text-main">Boolean Input</h3>
      </div>

      <textarea
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter boolean expression (e.g., A'BC + AB'C)..."
        className="w-full h-32 bg-bg-void border border-border-soft rounded-xl p-4 font-mono text-lg text-text-main placeholder:text-text-dim/50 focus:outline-none focus:border-accent-orange/50 transition-colors mb-6 resize-none"
      />

      <div className="flex flex-wrap gap-3 lg:gap-4">
        <button
          onClick={loadExample}
          className="flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-bg-elev hover:bg-hover-bg text-text-main border border-border-soft rounded-xl font-semibold transition-all shadow-lg active:scale-95 text-sm min-h-[40px]"
        >
          <FileText size={16} />
          Load Example
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-semibold transition-all shadow-lg active:scale-95 text-sm min-h-[40px]"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button className="flex items-center gap-2 px-6 py-2.5 lg:px-8 lg:py-3 bg-gradient-to-br from-[#f97316] to-[#ea580c] hover:brightness-110 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 ml-auto text-sm min-h-[40px]">
          <Play size={16} fill="currentColor" />
          Solve
        </button>
      </div>
    </div>
  );
};
