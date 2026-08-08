import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const Header: React.FC = () => {
  const { mode, setMode } = useStore();

  return (
    <header className="py-6 lg:py-10 text-center animate-in fade-in slide-in-from-top-8 duration-1000 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 lg:mb-4 flex items-center justify-center gap-3">
        <span className="text-gradient">KMap Executor</span>
        <InfoTooltip 
          title="K-Map Executor Workbench"
          description="A high-performance interactive digital logic synthesis tool. Switch between Normal Mode (fast 2-6 var K-map solver) and Pro Mode (advanced suite with QM step tracer, hazard elimination, VEM, cost optimization, and multi-output minimization)."
          side="right"
        />
      </h1>
      <p className="text-base md:text-lg text-text-sub font-medium max-w-2xl mx-auto px-4 mb-6">
        High-performance Interactive Digital Logic Synthesis & Pedagogical Workbench
      </p>

      {/* Mode Switcher */}
      <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-bg-void/80 border border-border-soft shadow-inner">
        <button
          onClick={() => setMode('normal')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'normal'
              ? 'bg-accent-orange text-white shadow-md'
              : 'text-text-dim hover:text-text-main'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Normal Mode</span>
        </button>

        <button
          onClick={() => setMode('pro')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'pro'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-text-dim hover:text-text-main'
          }`}
        >
          <Sparkles size={14} className={mode === 'pro' ? 'animate-pulse' : ''} />
          <span>Pro Mode (Advanced Suite)</span>
        </button>
      </div>
    </header>
  );
};

