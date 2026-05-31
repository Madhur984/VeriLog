import React from 'react';
import { Header } from './components/Header';
import { VariableSelector } from './components/VariableSelector';
import { KMapGrid } from './components/KMapGrid';
import { TruthTable } from './components/TruthTable';
import { BooleanInput } from './components/BooleanInput';
import { ResultPanel } from './components/ResultPanel';
import { CircuitRenderer } from './components/CircuitRenderer';
import { QuickActions } from './components/QuickActions';
import './kmap-lab.css';

/**
 * KMapLab - formerly the standalone Next.js k-map app, now an in-frontend route.
 * Mounted at `/kmap-lab` (KMapLabPage wraps this) and inside ModuleFour's Lab section.
 */
export const KMapLab: React.FC = () => {
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
          <CircuitRenderer />
        </div>
 
        <QuickActions />
 
        <footer className="mt-16 py-10 border-t border-border-soft text-center text-sm text-text-dim font-medium">
          &copy; {new Date().getFullYear()} K-Map Lab &bull; Digital Logic Synthesis
        </footer>
      </div>
    </main>
  );
};

export default KMapLab;
