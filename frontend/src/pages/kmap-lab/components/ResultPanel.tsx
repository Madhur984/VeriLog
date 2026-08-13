import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Cpu, Zap, Undo2, Redo2, Share2, Check, Code } from 'lucide-react';
import { simplify } from '../lib/solver/mintermSimplifier';
import { generateVerilog } from '../lib/utils/exporters';
import { InfoTooltip } from './InfoTooltip';
import { TextbookEquation } from '../../../components/ui/TextbookEquation';

export const ResultPanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType, history, historyIdx, undo, redo } = useStore();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedVerilog, setCopiedVerilog] = useState(false);

  const { expression, groups } = simplify(minterms, dontCares, numVars, solType);

  const totalTerms = groups.length;
  const totalLiterals = groups.reduce((acc, group) => {
    return acc + group.binary.replace(/-/g, '').length;
  }, 0);

  // Canonical notation calculation
  const totalCells = 1 << numVars;
  const maxterms = Array.from({ length: totalCells }, (_, i) => i).filter(
    i => !minterms.includes(i) && !dontCares.includes(i)
  );

  const mintermNotation = `Σm(${minterms.join(', ') || '∅'})${dontCares.length ? ` + d(${dontCares.join(', ')})` : ''}`;
  const maxtermNotation = `ΠM(${maxterms.join(', ') || '∅'})${dontCares.length ? ` · d(${dontCares.join(', ')})` : ''}`;

  const handleShareUrl = async () => {
    const stateObj = { numVars, minterms, dontCares, solType };
    const encoded = btoa(JSON.stringify(stateObj));
    const shareUrl = `${window.location.origin}${window.location.pathname}#state=${encoded}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyVerilog = async () => {
    const verilogCode = generateVerilog(expression, "kmap_simplified");
    await navigator.clipboard.writeText(verilogCode);
    setCopiedVerilog(true);
    setTimeout(() => setCopiedVerilog(false), 2000);
  };

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 lg:mb-8 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${solType === 'SOP' ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Cpu size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-heading font-bold text-text-main tracking-tight">Simplified Expression</h3>
              <InfoTooltip
                title="Simplified Logic Result"
                description="Minimised Boolean expression derived from optimal prime implicant coverage. Displays both simplified formula and canonical minterm/maxterm notation."
                side="top"
              />
            </div>
            <p className="text-xs font-bold text-text-dim uppercase tracking-widest mt-1">
              Method: <span className={solType === 'SOP' ? 'text-orange-500' : 'text-amber-500'}>{solType === 'SOP' ? 'Sum of Products' : 'Product of Sums'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIdx <= 0}
            className="p-2 rounded-xl bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={historyIdx >= history.length - 1}
            className="p-2 rounded-xl bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
          <button
            onClick={handleCopyVerilog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold transition-all active:scale-95"
            title="Copy Verilog Module Code"
          >
            {copiedVerilog ? <Check size={14} className="text-green-400" /> : <Code size={14} />}
            <span>{copiedVerilog ? 'Verilog Copied!' : 'Copy Verilog'}</span>
          </button>
          <button
            onClick={handleShareUrl}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main text-xs font-bold transition-all active:scale-95"
            title="Copy Shareable URL"
          >
            {copiedUrl ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
            <span>{copiedUrl ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Primary Simplified Expression Box */}
      <TextbookEquation
        title={`Simplified ${solType === 'SOP' ? 'Sum-of-Products (SOP)' : 'Product-of-Sums (POS)'} Formula`}
        math={`F(${['A','B','C','D','E','F'].slice(0, numVars).join(', ')}) = ${expression ? expression.replace(/'/g, '^{\\prime}') : (solType === 'SOP' ? '0' : '1')}`}
        variables={[
          { symbol: "F", name: "Minimized Output", description: "Optimal minimized Boolean logic function." },
          { symbol: "Literals", name: "Literal Count", description: `${totalLiterals} active signal literals after prime implicant reduction.` },
          { symbol: "Terms", name: "Term Count", description: `${totalTerms} minimal grouped logic terms.` }
        ]}
      />

      {/* Canonical Form Notation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 font-mono text-xs">
        <div className="p-3 rounded-xl bg-bg-void/60 border border-border-soft flex flex-wrap items-center justify-between gap-x-2 gap-y-1 overflow-x-auto">
          <span className="text-text-dim">Canonical SOP Form:</span>
          <TextbookEquation block={false} math={`\\sum m(${minterms.join(', ') || '\\emptyset'})${dontCares.length ? ` + d(${dontCares.join(', ')})` : ''}`} />
        </div>
        <div className="p-3 rounded-xl bg-bg-void/60 border border-border-soft flex flex-wrap items-center justify-between gap-x-2 gap-y-1 overflow-x-auto">
          <span className="text-text-dim">Canonical POS Form:</span>
          <TextbookEquation block={false} math={`\\prod M(${maxterms.join(', ') || '\\emptyset'})${dontCares.length ? ' \\cdot d(' + dontCares.join(', ') + ')' : ''}`} />
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-text-dim">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          Literals: {totalLiterals}
        </div>
        <div className="w-px h-3 bg-border-soft"></div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          Terms: {totalTerms}
        </div>
      </div>
    </div>
  );
};
