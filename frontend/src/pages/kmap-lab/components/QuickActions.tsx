import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, FileText, Code, Sparkles } from 'lucide-react';
import { ExportModal } from './ExportModal';

export const QuickActions: React.FC = () => {
  const { mode, reset, loadExample } = useStore();
  const [showExport, setShowExport] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4 mt-6 lg:mt-8 py-6 lg:py-8 border-t border-border-soft animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 lg:px-6 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl font-bold transition-all border border-red-500/20 text-sm min-h-[40px]"
        >
          <Trash2 size={16} />
          Clear Board
        </button>

        <button
          onClick={loadExample}
          className="flex items-center gap-2 px-4 py-2.5 lg:px-6 bg-bg-elev hover:bg-hover-bg text-text-main rounded-xl font-bold transition-all border border-border-soft text-sm min-h-[40px]"
        >
          <FileText size={16} />
          Load Example
        </button>

        {mode === 'pro' && (
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2.5 lg:px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white rounded-xl font-bold transition-all shadow-md text-sm min-h-[40px]"
          >
            <Code size={16} />
            Export Verilog / VHDL / LaTeX
          </button>
        )}
      </div>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </>
  );
};
