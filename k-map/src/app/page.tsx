"use client";
import React from 'react';
import { Header } from '@/components/Header';
import { VariableSelector } from '@/components/VariableSelector';
import { KMapGrid } from '@/components/KMapGrid';
import { TruthTable } from '@/components/TruthTable';
import { BooleanInput } from '@/components/BooleanInput';
import { ResultPanel } from '@/components/ResultPanel';
import { CircuitRenderer } from '@/components/CircuitRenderer';
import { QuickActions } from '@/components/QuickActions';

export default function Home() {
  return (
    <main className="min-h-screen text-slate-50 relative" style={{ background: 'radial-gradient(circle at 20% 20%, #0a0a0a, #000000 70%)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Header Section */}
        <Header />

        {/* Variable Selector + Mode Switch */}
        <VariableSelector />

        {/* Core Workspace: Grid + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 flex justify-center">
            <KMapGrid />
          </div>
          <div className="lg:col-span-4 h-full">
            <TruthTable />
          </div>
        </div>

        {/* Boolean Input Panel */}
        <BooleanInput />

        {/* Results Section */}
        <div className="flex flex-col gap-10">
          <ResultPanel />
          <CircuitRenderer />
        </div>

        {/* Quick Actions Panel */}
        <QuickActions />

        {/* Footer info or spacing */}
        <footer className="mt-16 py-10 border-t border-white/5 text-center text-sm text-gray-500 font-medium font-inter">
          &copy; {new Date().getFullYear()} KMap Executer &bull; Built for Digital Logic Synthesis
        </footer>

      </div>
    </main>
  );
}
