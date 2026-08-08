import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { simplify } from '../lib/solver/mintermSimplifier';
import { detectHazards, Hazard } from '../lib/solver/hazardDetector';
import { AlertTriangle, ShieldCheck, Plus, Zap, Activity } from 'lucide-react';

export const HazardPanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType, setExpression } = useStore();
  const [consensusTermsAdded, setConsensusTermsAdded] = useState<string[]>([]);

  const { expression, groups } = simplify(minterms, dontCares, numVars, solType);

  const hazards: Hazard[] = detectHazards(minterms, groups, numVars);

  if (minterms.length === 0) return null;

  const handleAddConsensusTerm = (hazard: Hazard) => {
    if (!consensusTermsAdded.includes(hazard.consensusTerm)) {
      const newTerms = [...consensusTermsAdded, hazard.consensusTerm];
      setConsensusTermsAdded(newTerms);

      const baseExpr = expression;
      const hazardFreeExpr = `${baseExpr} + ${hazard.consensusTerm}`;
      setExpression(hazardFreeExpr);
    }
  };

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${hazards.length > 0 ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400' : 'bg-green-500/15 border border-green-500/30 text-green-400'}`}>
            {hazards.length > 0 ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main tracking-tight">Hazard Analysis & Elimination</h3>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Glitch Analysis · {hazards.length === 0 ? 'No Static Hazards Detected' : `${hazards.length} Static-1 Hazard(s) Found`}
            </p>
          </div>
        </div>
      </div>

      {hazards.length === 0 ? (
        <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-300 text-sm font-medium">
          <ShieldCheck size={20} className="shrink-0" />
          <span>This minimised circuit is free of static-1 hazards. All adjacent 1-cell transitions are safely covered by common prime implicants.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hazards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hazards.map((h) => {
              const isAdded = consensusTermsAdded.includes(h.consensusTerm);
              return (
                <div key={h.id} className="p-4 rounded-xl bg-bg-void border border-amber-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                      Static-1 Hazard: m{h.mintermA} ↔ m{h.mintermB}
                    </span>
                    <span className="text-xs font-mono text-text-dim">
                      Var: <strong className="text-accent-orange">{h.variableChanging}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-text-sub leading-relaxed">
                    Transitioning variable <code className="text-amber-300 font-mono font-bold">{h.variableChanging}</code> between minterm m{h.mintermA} and m{h.mintermB} can cause an unwanted 0-glitch due to gate propagation delay.
                  </p>

                  <div className="p-2.5 rounded-lg bg-bg-base border border-border-soft flex items-center justify-between font-mono text-xs">
                    <span className="text-text-dim">Consensus Term:</span>
                    <span className="font-bold text-accent-orange">{h.consensusTerm}</span>
                  </div>

                  <button
                    onClick={() => handleAddConsensusTerm(h)}
                    disabled={isAdded}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      isAdded
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white'
                    }`}
                  >
                    {isAdded ? <ShieldCheck size={14} /> : <Plus size={14} />}
                    <span>{isAdded ? 'Consensus Term Added (Hazard Fixed)' : 'Add Redundant Consensus Term'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Timing Diagram Waveform Preview Sketch */}
          <div className="p-5 rounded-2xl bg-bg-void border border-border-soft space-y-3">
            <div className="flex items-center gap-2 text-text-main text-xs font-bold uppercase tracking-wider">
              <Activity size={16} className="text-accent-orange" />
              <span>Conceptual Timing Diagram — Glitch Waveform Preview</span>
            </div>

            <div className="p-4 rounded-xl bg-bg-base border border-border-soft font-mono text-xs space-y-4">
              {/* Inputs */}
              <div className="flex items-center gap-4">
                <span className="w-24 text-text-dim">Input Change:</span>
                <div className="flex-1 h-6 rounded bg-bg-elev border border-border-soft flex items-center px-3 text-accent-orange text-[11px]">
                  Transitioning A (0 → 1) at t = 10ns
                </div>
              </div>

              {/* Without Consensus */}
              <div className="flex items-center gap-4">
                <span className="w-24 text-amber-400 font-bold">Raw Output:</span>
                <div className="flex-1 h-8 rounded bg-amber-500/10 border border-amber-500/30 relative flex items-center px-3 text-amber-300 text-[11px] overflow-hidden">
                  <div className="absolute inset-x-0 h-0.5 bg-amber-400 top-2" />
                  <div className="absolute left-[45%] w-4 h-6 border-2 border-amber-400 border-t-0 bg-bg-void top-1 flex items-center justify-center text-[9px] text-red-400 font-bold animate-pulse">
                    Glitch!
                  </div>
                  <span className="relative z-10">High (1) ─── 🗲 ─── High (1)</span>
                </div>
              </div>

              {/* With Consensus */}
              <div className="flex items-center gap-4">
                <span className="w-24 text-green-400 font-bold">Glitch-Free:</span>
                <div className="flex-1 h-8 rounded bg-green-500/10 border border-green-500/30 flex items-center px-3 text-green-300 text-[11px]">
                  <span className="font-bold">Continuous Clean High Signal (1) — Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
