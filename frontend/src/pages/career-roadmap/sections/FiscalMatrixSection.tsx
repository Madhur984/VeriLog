import React from 'react';
import { motion } from 'framer-motion';
import { globalSalaries, salaryConfig } from '../data/salaries';
import { DataTerminal } from '../components/DataTerminal';

interface FiscalMatrixSectionProps {
  country: string;
  expYears: number;
  onPrefsChange: (country: string, exp: number) => void;
}

export const FiscalMatrixSection: React.FC<FiscalMatrixSectionProps> = ({
  country,
  expYears,
  onPrefsChange
}) => {
  const currentData = globalSalaries.find(s => s.country === country) || globalSalaries[0];
  const config = salaryConfig;

  // Mock calculation logic for fiscal breakdown
  const getBreakdown = () => {
    const baseStr = currentData.fresher.split('-')[0];
    const base = parseFloat(baseStr);
    const multiplier = 1 + (expYears * 0.25);
    const gross = base * multiplier;
    const tax = gross * (config.taxRates[country] || 0.2);
    const pf = gross * (config.pfRate[country] || 0);
    const net = gross - tax - pf;
    const colAdjusted = net / (config.colMultipliers[country] || 1);

    const unit = config.unitLabels[country];
    const symbol = config.currencySymbols[country];

    const format = (val: number) => `${symbol}${val.toFixed(1)}${unit}`;

    return { gross, tax, pf, net, colAdjusted, format };
  };

  const breakdown = getBreakdown();

  return (
    <section id="fiscal-matrix" className="py-24 px-6 bg-matte-obsidian/50 border-y border-ghost-trace scroll-mt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Input & Global Mobility */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
              Fiscal <span className="text-plasma-cyan">Matrix</span>
            </h2>
            <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
              Worldwide salary and cost of living comparisons.
            </p>
          </div>

          <div className="space-y-6 bg-solder-mask p-8 border border-ghost-trace">
            <div>
              <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-4 block">Active Geography</label>
              <div className="grid grid-cols-2 gap-2">
                {globalSalaries.map((s) => (
                  <button
                    key={s.country}
                    onClick={() => onPrefsChange(s.country, expYears)}
                    className={`
                      px-4 py-3 font-mono text-xs text-left border transition-all
                      ${country === s.country 
                        ? 'border-plasma-cyan bg-plasma-cyan/10 text-text-main' 
                        : 'border-ghost-trace text-text-dim hover:text-text-sub'}
                    `}
                  >
                    <span className="mr-2">{s.flag}</span> {s.country}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Experience Curve</label>
                <span className="text-plasma-cyan font-mono text-xs">{expYears} YEARS</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={expYears}
                onChange={(e) => onPrefsChange(country, parseInt(e.target.value))}
                className="w-full accent-plasma-cyan bg-ghost-trace h-1 rounded-full"
              />
            </div>
          </div>

          <DataTerminal title="GLOBAL MOBILITY INDEX" subtitle="Visa & COL Analysis">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Visa Difficulty</div>
                  <div className={`text-sm font-mono mt-1 ${
                    currentData.visaDifficulty === 'Hard' ? 'text-red-400' : 
                    currentData.visaDifficulty === 'Medium' ? 'text-accent-orange' : 'text-green-400'
                  }`}>
                    {currentData.visaDifficulty.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Notice Period</div>
                  <div className="text-sm font-mono text-text-main mt-1">{currentData.avgNoticePeriod}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-3">Dominant Hiring Entities</div>
                <div className="flex flex-wrap gap-2">
                  {currentData.topCompanies.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-matte-obsidian border border-ghost-trace text-text-sub font-mono text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </DataTerminal>
        </div>

        {/* Right: Detailed Breakdown */}
        <div className="lg:col-span-7">
          <DataTerminal title="COMPENSATION TELEMETRY" subtitle={`Unit: ${currentData.currency}`} className="h-full">
            <div className="flex flex-col h-full">
              {/* Massive Main Stat */}
              <div className="p-12 border-b border-ghost-trace bg-matte-obsidian/30 text-center">
                <div className="text-[10px] font-mono text-text-dim uppercase tracking-[0.4em] mb-4">Estimated Gross Annual</div>
                <motion.div 
                  key={`${country}-${expYears}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-7xl md:text-8xl font-mono font-bold text-text-main tracking-tighter"
                >
                  {breakdown.format(breakdown.gross)}
                </motion.div>
              </div>

              {/* Rows */}
              <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-text-dim">Tax Liability</span>
                    <span className="text-red-400">-{breakdown.format(breakdown.tax)}</span>
                  </div>
                  <div className="w-full bg-ghost-trace h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full" style={{ width: `${(breakdown.tax/breakdown.gross)*100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-text-dim">Retirement / PF</span>
                    <span className="text-accent-orange">-{breakdown.format(breakdown.pf)}</span>
                  </div>
                  <div className="w-full bg-ghost-trace h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent-orange h-full" style={{ width: `${(breakdown.pf/breakdown.gross)*100}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-text-dim">Monthly Net (EST)</span>
                    <span className="text-text-main">{breakdown.format(breakdown.net / 12)} / MO</span>
                  </div>
                  <div className="w-full bg-ghost-trace h-1.5 rounded-full overflow-hidden">
                    <div className="bg-plasma-cyan h-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-text-dim">Take Home (EST)</span>
                    <span className="text-text-main">{breakdown.format(breakdown.net)} / YR</span>
                  </div>
                  <div className="w-full bg-ghost-trace h-1.5 rounded-full overflow-hidden">
                    <div className="bg-text-main h-full" style={{ width: `${(breakdown.net/breakdown.gross)*100}%` }} />
                  </div>
                </div>

                <div className="md:col-span-2 pt-8 border-t border-ghost-trace/30 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest mb-1">COL ADJUSTED POWER</div>
                    <div className="text-4xl font-mono font-bold text-text-main">{breakdown.format(breakdown.colAdjusted)}</div>
                    <p className="text-[10px] font-mono text-text-dim mt-2 max-w-xs uppercase">
                      Purchasing power relative to base Indian ECE market standards.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-plasma-cyan/5 border border-plasma-cyan/30 rounded flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-plasma-cyan flex items-center justify-center font-mono text-plasma-cyan font-bold">
                      {currentData.costOfLivingIndex}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-text-sub uppercase">COL Index</div>
                      <div className="text-xs font-mono text-text-dim">Relative to NYC (100)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DataTerminal>
        </div>
      </div>
    </section>
  );
};
