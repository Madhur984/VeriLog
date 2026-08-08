import React, { useState } from 'react';
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
import './kmap-lab.css';

/**
 * KMapLab - Complete Digital Logic Educational & Synthesis Suite.
 */
export const KMapLab: React.FC = () => {
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<'hazards' | 'cost' | 'multi_output' | 'vem'>('hazards');

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
          <StepByStepPanel />

          {/* Advanced Suite Modes Navigation */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-bg-void/80 rounded-2xl border border-border-soft">
              <button
                onClick={() => setActiveAdvancedTab('hazards')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeAdvancedTab === 'hazards' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                }`}
              >
                Hazard Elimination
              </button>
              <button
                onClick={() => setActiveAdvancedTab('cost')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeAdvancedTab === 'cost' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                }`}
              >
                Cost Optimization
              </button>
              <button
                onClick={() => setActiveAdvancedTab('multi_output')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeAdvancedTab === 'multi_output' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                }`}
              >
                Multi-Output Minimiser
              </button>
              <button
                onClick={() => setActiveAdvancedTab('vem')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeAdvancedTab === 'vem' ? 'bg-accent-orange text-white shadow-md' : 'text-text-dim hover:text-text-main'
                }`}
              >
                VEM Mode
              </button>
            </div>

            {/* Render Active Advanced Component */}
            {activeAdvancedTab === 'hazards' && <HazardPanel />}
            {activeAdvancedTab === 'cost' && <CostPanel />}
            {activeAdvancedTab === 'multi_output' && <MultiOutputPanel />}
            {activeAdvancedTab === 'vem' && <VEMPanel />}
          </div>

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
