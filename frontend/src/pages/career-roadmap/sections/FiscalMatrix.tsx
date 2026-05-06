import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { Wallet, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';

export const FiscalMatrix: React.FC = () => {
  const [savingsRate, setSavingsRate] = useState(30);
  const targetCorpus = 30000000; // 3Cr
  const ctc = 750000; // 7.5L
  
  // Simplified math
  const annualSavings = (ctc * (savingsRate / 100));
  const yearsToFI = Math.round(Math.log(targetCorpus / annualSavings) / Math.log(1 + 0.12));
  const freedomAge = 22 + yearsToFI;

  const components = [
    { label: 'Take Home', value: 540000, percentage: 72, color: 'bg-cyan-400' },
    { label: 'Income Tax', value: 75000, percentage: 10, color: 'bg-amber-400' },
    { label: 'PF / Gratuity', value: 90000, percentage: 12, color: 'bg-orange-500' },
    { label: 'Other Deductions', value: 45000, percentage: 6, color: 'bg-slate-700' },
  ];

  return (
    <SectionWrapper id="fiscal" className="bg-observatory-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Fiscal Matrix</h2>
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest max-w-xl">
                Global compensation analysis for ECE domains. Analyzing the nexus of procurement, silicon value, and financial freedom.
              </p>
            </div>

            <div className="p-8 bg-observatory-bg border border-white/5 rounded-2xl space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Entry Trajectory (CTC)</span>
                <span className="text-6xl font-bold text-white">₹7.5L</span>
              </div>

              <div className="space-y-6">
                {components.map((comp, i) => (
                  <div key={comp.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono uppercase">
                      <span className="text-slate-400">{comp.label}</span>
                      <span className="text-white">₹{comp.value.toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
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
            <div className="p-8 bg-observatory-bg border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-400" />
                Freedom Age Simulator
              </h3>
              
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Estimated Freedom Age</div>
                  <div className="text-5xl font-bold text-cyan-400">{freedomAge}</div>
                  <div className="text-[9px] font-mono text-slate-600 uppercase mt-2 tracking-widest">Target Corpus: ₹3Cr</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                    <span>Savings Rate</span>
                    <span className="text-white">{savingsRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="70" 
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[9px] font-mono text-slate-600 uppercase leading-relaxed">
                    At ₹7.5L CTC, saving {savingsRate}% = ₹{(ctc * (savingsRate / 100)).toLocaleString()}/yr invested at 12% CAGR.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-2xl">
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-cyan-400 mt-1" size={18} />
                <p className="text-[10px] font-mono text-cyan-400 uppercase leading-relaxed tracking-wider">
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
