import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateMinimizationSteps, binaryToTerm, MinimizationStep } from '../lib/solver/stepTracer';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, Award, Lightbulb, Layers } from 'lucide-react';

export const StepByStepPanel: React.FC = () => {
  const { numVars, minterms, dontCares, solType } = useStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'qm_table'>('walkthrough');

  const steps: MinimizationStep[] = useMemo(() => {
    return generateMinimizationSteps(minterms, dontCares, numVars, solType);
  }, [minterms, dontCares, numVars, solType]);

  const vars = useMemo(() => ["A", "B", "C", "D", "E"].slice(0, numVars), [numVars]);

  // Reset to step 0 when input changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [minterms, dontCares, numVars, solType]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx(prev => {
        if (prev >= steps.length - 1) {
          return 0; // loop around
        }
        return prev + 1;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  if (minterms.length === 0) return null;

  const currentStep = steps[currentStepIdx] || steps[0];

  return (
    <div className="glass-card p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400">
            <Layers size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main tracking-tight">Step-by-Step Minimisation</h3>
            <p className="text-xs font-bold text-text-dim uppercase tracking-wider mt-0.5">
              Pedagogical QM Breakdown · Step {currentStepIdx + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-bg-base rounded-xl border border-border-soft self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('walkthrough')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'walkthrough'
                ? 'bg-accent-orange text-white shadow-md'
                : 'text-text-dim hover:text-text-main'
            }`}
          >
            Walkthrough
          </button>
          <button
            onClick={() => setActiveTab('qm_table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'qm_table'
                ? 'bg-accent-orange text-white shadow-md'
                : 'text-text-dim hover:text-text-main'
            }`}
          >
            QM Prime Chart
          </button>
        </div>
      </div>

      {activeTab === 'walkthrough' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-bg-void/60 rounded-xl border border-border-soft">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-lg bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main disabled:opacity-40 disabled:pointer-events-none transition-all"
                title="Previous step"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-orange hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
              </button>
              <button
                onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStepIdx >= steps.length - 1}
                className="p-2 rounded-lg bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-main disabled:opacity-40 disabled:pointer-events-none transition-all"
                title="Next step"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}
                className="p-2 rounded-lg bg-bg-elev hover:bg-hover-bg border border-border-soft text-text-dim hover:text-text-main transition-all ml-1"
                title="Reset to beginning"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Step Progress Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentStepIdx(idx); setIsPlaying(false); }}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStepIdx
                      ? 'w-6 bg-accent-orange'
                      : idx < currentStepIdx
                      ? 'w-2.5 bg-orange-500/50'
                      : 'w-2.5 bg-border-soft'
                  }`}
                  title={s.title}
                />
              ))}
            </div>
          </div>

          {/* Current Step Description Card */}
          <div className="p-5 rounded-2xl bg-bg-void border border-border-soft relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                <Lightbulb size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-base font-bold text-text-main">{currentStep.title}</h4>
                <p className="text-sm text-text-sub leading-relaxed">{currentStep.description}</p>
              </div>
            </div>
          </div>

          {/* Render Stage Data if available */}
          {currentStep.stages && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentStep.stages.map((stage) => (
                <div key={stage.stageIndex} className="p-4 rounded-xl bg-bg-base/40 border border-border-soft space-y-3">
                  <h5 className="text-xs font-mono font-bold text-accent-orange uppercase tracking-wider border-b border-border-soft pb-2">
                    {stage.stageName}
                  </h5>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {stage.groups.map(group => (
                      <div key={group.onesCount} className="space-y-1.5">
                        <div className="text-[11px] font-mono text-text-dim flex items-center justify-between">
                          <span>Count of 1s: {group.onesCount}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elev">{group.terms.length} terms</span>
                        </div>
                        <div className="space-y-1">
                          {group.terms.map((t, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                                t.combined
                                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                                  : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                              }`}
                            >
                              <span>{t.binary}</span>
                              <span className="font-bold">{t.expression}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QM Table / PI Chart Tab */}
      {activeTab === 'qm_table' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-bg-void border border-border-soft overflow-x-auto">
            <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <Award size={16} className="text-accent-orange" />
              Prime Implicant Chart
            </h4>

            {currentStep.chart ? (
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border-soft bg-bg-base">
                    <th className="py-2.5 px-3 text-left font-bold text-text-dim">Prime Implicant</th>
                    <th className="py-2.5 px-3 text-center font-bold text-text-dim">Binary</th>
                    {currentStep.chart.minterms.map(m => (
                      <th key={m} className="py-2.5 px-2 text-center font-bold text-accent-orange border-l border-border-soft">
                        m{m}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 text-center font-bold text-text-dim border-l border-border-soft">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStep.chart.pis.map((pi, idx) => {
                    const expr = binaryToTerm(pi.implicant.binary, vars);
                    return (
                      <tr key={idx} className="border-b border-border-soft hover:bg-hover-bg transition-colors">
                        <td className="py-2 px-3 font-bold text-text-main">{expr}</td>
                        <td className="py-2 px-3 text-center text-text-dim">{pi.implicant.binary}</td>
                        {currentStep.chart!.minterms.map(m => (
                          <td key={m} className="py-2 px-2 text-center border-l border-border-soft">
                            {pi.covers.includes(m) ? (
                              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                                pi.isEssential ? 'bg-orange-500 text-white font-bold' : 'bg-bg-elev text-accent-orange'
                              }`}>
                                ✕
                              </span>
                            ) : null}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-center border-l border-border-soft">
                          {pi.isEssential ? (
                            <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold uppercase">
                              Essential
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-bg-elev text-text-dim text-[10px]">
                              Prime
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-text-dim italic">PI Chart generated during step 3 of the walkthrough.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
