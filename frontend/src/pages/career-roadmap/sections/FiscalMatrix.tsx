import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const FiscalMatrix: React.FC = () => {
  const [savingsRate, setSavingsRate] = useState(30);
  const targetCorpus = 30000000; // 3Cr
  const ctc = 750000; // 7.5L
  
  // Simplified math
  const annualSavings = (ctc * (savingsRate / 100));
  const yearsToFI = Math.round(Math.log(targetCorpus / annualSavings) / Math.log(1 + 0.12));
  const freedomAge = 22 + yearsToFI;

  const components = [
    { label: 'Take Home', value: 540000, percentage: 72, color: 'bg-signal-core' },
    { label: 'Income Tax', value: 75000, percentage: 10, color: 'bg-amber-400' },
    { label: 'PF / Gratuity', value: 90000, percentage: 12, color: 'bg-accent-orange' },
    { label: 'Other Deductions', value: 45000, percentage: 6, color: 'bg-text-dim' },
  ];

  return (
    <SectionWrapper id="fiscal" className="bg-observatory-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight uppercase">Fiscal Matrix</h2>
              <p className="text-text-sub font-mono text-xs uppercase tracking-widest max-w-xl">
                Global compensation analysis for ECE domains. Analyzing the nexus of procurement, silicon value, and financial freedom.
              </p>
            </div>

            <div className="p-5 sm:p-8 bg-observatory-bg border border-border-soft rounded-2xl space-y-8">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Entry Trajectory (CTC)</span>
                <span className="text-4xl sm:text-6xl font-bold text-text-main shrink-0">₹7.5L</span>
              </div>

              <div className="space-y-6">
                {components.map((comp, i) => (
                  <div key={comp.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono uppercase">
                      <span className="text-text-sub">{comp.label}</span>
                      <span className="text-text-main">₹{comp.value.toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-full bg-border-soft rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${comp.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${comp.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-96 space-y-6">
            <div className="p-5 sm:p-8 bg-observatory-bg border border-border-soft rounded-2xl space-y-6">
              <h3 className="text-xs font-mono font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-signal-core" />
                Freedom Age Simulator
              </h3>
              
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">Estimated Freedom Age</div>
                  <div className="text-5xl font-bold text-signal-core">{freedomAge}</div>
                  <div className="text-[9px] font-mono text-text-dim uppercase mt-2 tracking-widest">Target Corpus: ₹3Cr</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono text-text-dim uppercase">
                    <span>Savings Rate</span>
                    <span className="text-text-main">{savingsRate}%</span>
                  </div>
                  <label htmlFor="savings-slider" className="sr-only">Savings rate percentage</label>
                  <input 
                    id="savings-slider"
                    type="range" 
                    min="10" 
                    max="70" 
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                    className="w-full h-1 bg-border-soft rounded-full appearance-none accent-signal-core cursor-pointer"
                  />
                  <p className="text-[9px] font-mono text-text-dim uppercase leading-relaxed">
                    At ₹7.5L CTC, saving {savingsRate}% = ₹{(ctc * (savingsRate / 100)).toLocaleString()}/yr invested at 12% CAGR.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-signal-core/5 border border-signal-core/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-signal-core mt-1" size={18} />
                <p className="text-[10px] font-mono text-signal-core uppercase leading-relaxed tracking-wider">
                  VLSI Design roles show a +28% premium over standard software roles at the 3-year seniority mark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
