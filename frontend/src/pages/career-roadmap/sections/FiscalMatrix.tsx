import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { TrendingUp, ShieldCheck } from 'lucide-react';

const ROLE_PRESETS = [
  { label: 'VLSI Design', ctc: 1200000 },
  { label: 'Embedded Systems', ctc: 750000 },
  { label: 'RF / Wireless', ctc: 1000000 },
  { label: 'Software / EDA', ctc: 900000 },
];

interface FiscalMatrixProps {
  initialRoleIndex?: number;
  onFocusSkillNode?: (nodeId: string) => void;
}

export const FiscalMatrix: React.FC<FiscalMatrixProps> = ({ initialRoleIndex = 0, onFocusSkillNode }) => {
  const [savingsRate, setSavingsRate] = useState(30);
  const [activeRole, setActiveRole] = useState(initialRoleIndex);
  const [targetCorpus, setTargetCorpus] = useState(30000000);
  const [showFreedomSim, setShowFreedomSim] = useState(false);

  React.useEffect(() => {
    setActiveRole(initialRoleIndex);
  }, [initialRoleIndex]);
  const ctc = ROLE_PRESETS[activeRole].ctc;
  
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
                <span className="text-4xl sm:text-6xl font-bold text-text-main shrink-0">₹{(ctc / 100000).toFixed(1)}L</span>
              </div>

              {/* Role Selector */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {ROLE_PRESETS.map((role, i) => (
                    <button
                      key={role.label}
                      onClick={() => setActiveRole(i)}
                      className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border rounded-full transition-all ${
                        activeRole === i
                          ? 'bg-signal-core border-signal-core text-bg-void font-bold'
                          : 'border-border-soft text-text-dim hover:border-text-dim hover:text-text-sub'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                
                {onFocusSkillNode && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        const roleToNode: Record<string, string> = {
                          'VLSI Design': 'vlsi',
                          'Embedded Systems': 'embedded',
                          'RF / Wireless': 'wireless',
                          'Software / EDA': 'verilog',
                        };
                        const activeLabel = ROLE_PRESETS[activeRole].label;
                        if (roleToNode[activeLabel]) {
                          onFocusSkillNode(roleToNode[activeLabel]);
                        }
                      }}
                      className="text-[9px] font-mono uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                    >
                      [ Analyze skill requirements in Graph ↗ ]
                    </button>
                  </div>
                )}
              </div>


              <div className="space-y-6">
                {components.map((comp, i) => (
                  <div key={comp.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono uppercase">
                      <span className="text-text-sub">{comp.label}</span>
                      <span className="text-text-main">₹{comp.value.toLocaleString('en-IN')}</span>
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
            {/* Freedom Age Simulator — collapsed by default */}
            <div className="border border-border-soft rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowFreedomSim(v => !v)}
                className="w-full flex justify-between items-center px-5 py-4 bg-observatory-bg text-xs font-mono uppercase tracking-widest text-text-sub hover:text-text-main transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2"><TrendingUp size={13} className="text-signal-core" /> Freedom Age Simulator</span>
                <span className="text-text-dim">{showFreedomSim ? '−' : '+'}</span>
              </button>

              {showFreedomSim && (
                <div className="p-5 sm:p-8 bg-observatory-bg border-t border-border-soft space-y-6">
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-1">Estimated Freedom Age</div>
                      <div className="text-5xl font-bold text-signal-core">{freedomAge}</div>
                      <div className="text-[9px] font-mono text-text-dim uppercase mt-2 tracking-widest">Target Corpus: ₹{(targetCorpus / 10000000).toFixed(1)}Cr</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono text-text-dim uppercase">
                        <span>Target Corpus</span>
                        <span className="text-text-main">₹{(targetCorpus / 10000000).toFixed(1)}Cr</span>
                      </div>
                      <label htmlFor="corpus-slider" className="sr-only">Target corpus amount</label>
                      <input
                        id="corpus-slider"
                        type="range"
                        min="5000000"
                        max="100000000"
                        step="5000000"
                        value={targetCorpus}
                        onChange={(e) => setTargetCorpus(parseInt(e.target.value))}
                        className="w-full h-1 bg-border-soft rounded-full appearance-none accent-signal-core cursor-pointer"
                      />
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
                        At ₹{(ctc / 100000).toFixed(1)}L CTC, saving {savingsRate}% = ₹{(ctc * (savingsRate / 100)).toLocaleString('en-IN')}/yr invested at 12% CAGR.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
