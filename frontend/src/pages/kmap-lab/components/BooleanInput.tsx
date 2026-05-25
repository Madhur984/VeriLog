import React from 'react';
import { useStore } from '../store/useStore';
import { Play, RotateCcw, FileText } from 'lucide-react';

export const BooleanInput: React.FC = () => {
  const { expression, setExpression, reset, loadExample } = useStore();

  return (
    <div className="glass-card p-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div className="flex items-center gap-2 mb-6 text-orange-400">
        <span className="text-xl font-bold">{'>'}</span>
        <h3 className="text-xl font-bold text-white">Boolean Input</h3>
      </div>

      <textarea
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter boolean expression (e.g., A'BC + AB'C)..."
        className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 font-mono text-lg text-orange-100 placeholder:text-gray-700 focus:outline-none focus:border-orange-500/50 transition-colors mb-6 resize-none"
      />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={loadExample}
          className="flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#1a1a1a] text-white border border-white/10 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          <FileText size={18} />
          Load Example
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/20 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[#f97316] to-[#ea580c] hover:brightness-110 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 ml-auto">
          <Play size={18} fill="currentColor" />
          Solve
        </button>
      </div>
    </div>
  );
};
