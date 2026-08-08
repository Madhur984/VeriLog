import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { VariableSelector } from './components/VariableSelector';
import { KMapGrid } from './components/KMapGrid';
import { TruthTable } from './components/TruthTable';
import { BooleanInput } from './components/BooleanInput';
import { ResultPanel } from './components/ResultPanel';
import { StepByStepPanel } from './components/StepByStepPanel';
import { HazardPanel } from './components/HazardPanel';
import { CostPanel } from './components/CostPanel';
import { MultiOutputPanel } from './components/MultiOutputPanel';
import { VEMPanel } from './components/VEMPanel';
import { CircuitRenderer } from './components/CircuitRenderer';
import { QuickActions } from './components/QuickActions';
import { Sparkles, Zap, Layers, AlertTriangle, Sliders, Variable } from 'lucide-react';
import './kmap-lab.css';

/**
 * KMapLab - Digital Logic Educational Workbench with Normal & Pro Modes.
 */
export const KMapLab: React.FC = () => {
  const { mode } = useStore();
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<'step_by_step' | 'hazards' | 'cost' | 'multi_output' | 'vem'>('step_by_step');

  return (
    <main
      className="kmap-lab-root min-h-[100svh] text-text-main relative overflow-x-hidden"
      style={{ background: 'radial-gradient(circle at 20% 20%, var(--kmap-bg-start), var(--kmap-bg-end) 70%)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-6 lg:px-6 lg:py-12 flex flex-col gap-6 lg:gap-10">
        <Header />
        <VariableSelector />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 flex justify-center">
            <KMapGrid />
          </div>
          <div className="lg:col-span-4 h-full">
            <TruthTable />
          </div>
        </div>

        <BooleanInput />

        <div className="flex flex-col gap-10">
          <ResultPanel />

          {/* Pro Mode: Advanced Features Suite */}
          {mode === 'pro' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-orange font-bold text-sm uppercase tracking-wider">
                  <Sparkles size={18} className="animate-pulse" />
                  <span>Pro Mode Advanced Engineering Suite</span>
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-bg-void/90 rounded-2xl border border-border-soft shadow-md">
                <button
                  onClick={() => setActiveAdvancedTab('step_by_step')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeAdvancedTab === 'step_by_step' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  <Layers size={14} />
                  Step-by-Step QM
                </button>

                <button
                  onClick={() => setActiveAdvancedTab('hazards')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeAdvancedTab === 'hazards' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  <AlertTriangle size={14} />
                  Hazard Elimination
                </button>

                <button
                  onClick={() => setActiveAdvancedTab('cost')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeAdvancedTab === 'cost' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  <Sliders size={14} />
                  Cost Optimization
                </button>

                <button
                  onClick={() => setActiveAdvancedTab('multi_output')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeAdvancedTab === 'multi_output' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  <Zap size={14} />
                  Multi-Output Minimiser
                </button>

                <button
                  onClick={() => setActiveAdvancedTab('vem')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeAdvancedTab === 'vem' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  <Variable size={14} />
                  VEM Mode
                </button>
              </div>

              {/* Render Selected Pro Feature */}
              {activeAdvancedTab === 'step_by_step' && <StepByStepPanel />}
              {activeAdvancedTab === 'hazards' && <HazardPanel />}
              {activeAdvancedTab === 'cost' && <CostPanel />}
              {activeAdvancedTab === 'multi_output' && <MultiOutputPanel />}
              {activeAdvancedTab === 'vem' && <VEMPanel />}
            </div>
          )}

          <CircuitRenderer />
        </div>

        <QuickActions />

        <footer className="mt-16 py-10 border-t border-border-soft text-center text-sm text-text-dim font-medium">
          &copy; {new Date().getFullYear()} K-Map Lab &bull; Digital Logic Synthesis Suite
        </footer>
      </div>
    </main>
  );
};

export default KMapLab;
