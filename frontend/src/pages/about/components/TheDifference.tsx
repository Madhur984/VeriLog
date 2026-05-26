import React from 'react';
import { motion } from 'framer-motion';
import { COMPARISONS } from '../data/aboutData';
import { SectionWrapper } from '../../../components/SectionWrapper';

export const TheDifference: React.FC = () => {
  return (
    <SectionWrapper id="the-difference" className="bg-[#07080A] border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">
            WHY NOT JUST USE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-[1.1]">
            We know what else is out there.
          </h2>
          <p className="text-slate-400 font-sans text-sm md:text-base max-w-2xl leading-relaxed">
            And we know exactly what's missing from each of them.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 w-1/4">Platform</th>
                <th className="py-4 px-6 w-2/5">The Problem</th>
                <th className="py-4 px-6 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, idx) => {
                const isAxeOr = row.platform === 'AXE-OR';

                return (
                  <tr
                    key={row.platform}
                    className={`
                      border-b border-white/[0.04] transition-colors hover:bg-[#131619]/50
                      ${isAxeOr ? 'bg-cyan-400/[0.03] border-l-4 border-l-cyan-400' : ''}
                    `}
                  >
                    <td className="py-5 px-6 font-sans text-sm font-bold text-white">
                      {row.platform}
                    </td>
                    <td className="py-5 px-6 font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
                      {row.issue}
                    </td>
                    <td className="py-5 px-6 text-right">
                      {row.verdict === 'gap' && (
                        <span className="inline-block px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                          NOT ENOUGH
                        </span>
                      )}
                      {row.verdict === 'partial' && (
                        <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                          PARTIAL
                        </span>
                      )}
                      {row.verdict === 'solution' && (
                        <span className="inline-block px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                          ✓ AXE-OR
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Below Table Callout */}
        <div className="flex justify-center pt-8">
          <p className="text-base md:text-lg font-bold text-white text-center font-sans tracking-tight max-w-2xl leading-relaxed">
            The one thing no platform has: the <span className="text-cyan-400">complete path</span> from confused ECE student to first chip design job, built specifically for the Indian college context.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};
