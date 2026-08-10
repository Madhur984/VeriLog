import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { simplify } from '../lib/solver/mintermSimplifier';
import { generateVerilog, generateVHDL, generateLaTeX } from '../lib/utils/exporters';
import { X, Copy, Check, Code, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const [activeTab, setActiveTab] = useState<'verilog' | 'vhdl' | 'latex'>('verilog');
  const [copied, setCopied] = useState(false);

  const { expression } = simplify(minterms, dontCares, numVars, solType);

  if (!isOpen) return null;

  const content =
    activeTab === 'verilog'
      ? generateVerilog(expression)
      : activeTab === 'vhdl'
      ? generateVHDL(expression)
      : generateLaTeX(expression);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-2xl overflow-hidden border border-border-soft bg-bg-base/95 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-soft">
          <div className="flex items-center gap-2.5 text-accent-orange">
            <Code size={22} />
            <h3 className="text-lg font-bold text-text-main">Export Design Artefact</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-dim hover:text-text-main hover:bg-hover-bg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-3 bg-bg-void/50 border-b border-border-soft">
          {(['verilog', 'vhdl', 'latex'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-accent-orange text-white shadow-md'
                  : 'text-text-dim hover:text-text-main hover:bg-hover-bg'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-5 relative">
          <button
            onClick={handleCopy}
            className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elev border border-border-soft hover:bg-hover-bg text-xs font-semibold text-text-main transition-all active:scale-95"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <pre className="w-full h-64 p-4 rounded-xl bg-bg-void border border-border-soft font-mono text-xs text-orange-300 overflow-auto custom-scrollbar leading-relaxed">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-soft flex justify-end bg-bg-void/30">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
