import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, FileText, Code, Sparkles, ChevronDown, BookOpen } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { InfoTooltip } from './InfoTooltip';

export const QuickActions: React.FC = () => {
  const { mode, reset, loadExample, loadPresetExample } = useStore();
  const [showExport, setShowExport] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleSelectPreset = (key: string) => {
    loadPresetExample(key);
    setShowPresetsMenu(false);
  };

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

        {/* Preset Engineering Examples Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresetsMenu(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 lg:px-6 bg-bg-elev hover:bg-hover-bg text-text-main rounded-xl font-bold transition-all border border-border-soft text-sm min-h-[40px]"
          >
            <BookOpen size={16} className="text-accent-orange" />
            <span>Preset Examples</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showPresetsMenu ? 'rotate-180' : ''}`} />
          </button>

          {showPresetsMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[min(84vw,16rem)] sm:left-0 sm:translate-x-0 sm:w-64 bg-[#0d121d] border border-orange-500/40 rounded-xl shadow-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-bold text-accent-orange uppercase tracking-wider px-2 py-1 border-b border-border-soft/60 mb-1">
                Classic Hardware Circuits
              </div>
              <button
                onClick={loadExample}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-500/20 hover:text-accent-orange transition-all flex items-center justify-between"
              >
                <span>Default Sample Problem</span>
                <span className="text-[10px] opacity-60">4-Var</span>
              </button>
              <button
                onClick={() => handleSelectPreset('full_adder_carry')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-500/20 hover:text-accent-orange transition-all flex items-center justify-between"
              >
                <span>Full Adder Carry Out (Cout)</span>
                <span className="text-[10px] opacity-60">3-Var</span>
              </button>
              <button
                onClick={() => handleSelectPreset('seven_segment_a')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-500/20 hover:text-accent-orange transition-all flex items-center justify-between"
              >
                <span>BCD 7-Segment (Segment A)</span>
                <span className="text-[10px] opacity-60">4-Var (Don't Care)</span>
              </button>
              <button
                onClick={() => handleSelectPreset('hazard_demo')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-500/20 hover:text-accent-orange transition-all flex items-center justify-between"
              >
                <span>Static-1 Glitch Hazard Demo</span>
                <span className="text-[10px] opacity-60">3-Var</span>
              </button>
              <button
                onClick={() => handleSelectPreset('parity_checker')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-500/20 hover:text-accent-orange transition-all flex items-center justify-between"
              >
                <span>4-Bit Parity Checker</span>
                <span className="text-[10px] opacity-60">4-Var</span>
              </button>
            </div>
          )}
        </div>

        {mode === 'pro' && (
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-2 px-4 py-2.5 lg:px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white rounded-xl font-bold transition-all shadow-md text-sm min-h-[40px]"
            >
              <Code size={16} />
              Export Verilog / VHDL / LaTeX
            </button>
            <InfoTooltip
              title="HDL & LaTeX Exporter"
              description="Generate production-ready Verilog and VHDL hardware module code or publication-ready LaTeX equation snippets directly from your simplified logic."
              side="top"
            />
          </div>
        )}
      </div>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </>
  );
};

