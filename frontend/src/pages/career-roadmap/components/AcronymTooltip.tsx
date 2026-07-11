import React from 'react';

interface AcronymTooltipProps {
  term: string;
  definition: string;
  analogy?: string;
  children: React.ReactNode;
}

export const AcronymTooltip: React.FC<AcronymTooltipProps> = ({ term, definition, analogy, children }) => {
  return (
    <span className="relative group cursor-help inline-block">
      <span className="border-b border-dashed border-signal-core/60 pb-0.5 hover:border-signal-core transition-colors">
        {children}
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-[#0D0F12] border border-white/10 rounded-lg shadow-brutal-sm text-[11px] font-mono leading-relaxed z-[400] text-left text-white">
        <span className="block font-black text-teal-400 mb-1 uppercase tracking-wider">{term}</span>
        <span className="block text-slate-200 font-semibold mb-1.5">{definition}</span>
        {analogy && (
          <span className="block text-slate-400 border-t border-white/5 pt-1.5 mt-1.5 italic">
            Analogy: {analogy}
          </span>
        )}
      </span>
    </span>
  );
};
