import React from 'react';
import { motion } from 'framer-motion';
import { COMPARISONS } from '../data/aboutData';
import { SectionWrapper } from '../../../components/SectionWrapper';

export const TheDifference: React.FC = () => {
  return (
    <SectionWrapper id="the-difference" className="bg-bg-void border-t border-border-soft">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest block">
            WHY NOT JUST USE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight uppercase leading-[1.1]">
            We know what else is out there.
          </h2>
          <p className="text-text-sub font-sans text-sm md:text-base max-w-2xl leading-relaxed">
            And we know exactly what's missing from each of them.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border-soft text-[10px] font-mono text-text-dim uppercase tracking-wider">
                <th className="py-4 px-6 w-1/4">Platform</th>
                <th className="py-4 px-6 w-2/5">The Problem</th>
                <th className="py-4 px-6 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, idx) => {
                const isBfb = row.platform === 'BitforBytes';

                return (
                  <motion.tr
                    key={row.platform}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`
                      border-b border-border-soft transition-colors hover:bg-bg-base/50
                      ${isBfb ? 'bg-signal-core/10' : ''}
                    `}
                    style={isBfb ? {
                      borderLeft: '4px solid var(--signal-core)',
                    } : {}}
                  >
                    <td className="py-5 px-6 font-sans text-sm font-bold text-text-main">
                      {row.platform}
                    </td>
                    <td className="py-5 px-6 font-sans text-xs md:text-sm text-text-sub leading-relaxed">
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
                        <motion.span
                           initial={{ scale: 0.85, opacity: 0 }}
                           whileInView={{ scale: 1, opacity: 1 }}
                           viewport={{ once: true }}
                           transition={{ duration: 0.4, delay: idx * 0.07 + 0.2 }}
                           className="inline-block px-2.5 py-1 rounded bg-signal-core/10 border border-signal-core/20 text-signal-core font-mono text-[9px] font-bold uppercase tracking-wider"
                        >
                          ✓ BitforBytes
                        </motion.span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Below Table Callout */}
        <div className="flex justify-center pt-8">
          <p className="text-base md:text-lg font-bold text-text-main text-center font-sans tracking-tight max-w-2xl leading-relaxed">
            The one thing no platform has: the <span className="text-signal-core">complete path</span> from confused ECE student to first chip design job, built specifically for the Indian college context.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};
