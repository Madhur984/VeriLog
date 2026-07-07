import React from 'react';
import { motion } from 'framer-motion';
import { salaryStages, skillPremiums, globalPay, AS_OF } from '../data/careerData';
import { SectionHead, reveal } from './RoadmapUI';

const SCALE = 100; // ₹LPA axis maximum

/** India pay-by-stage bar chart + skill premiums + a global comparison. */
export const SalaryLab: React.FC = () => (
  <section id="salaries" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
    <SectionHead
      kicker="The money, honestly"
      title="What you can actually earn"
      sub={`India VLSI / semiconductor pay by career stage (₹ LPA, ${AS_OF}). These are ranges, not guarantees — the gap between a services role and a Tier-1 offer is 3–5× at every level.`}
    />

    {/* Stage bars */}
    <div className="bg-bg-base border-2 border-edge shadow-brutal p-5 sm:p-8">
      <div className="space-y-5">
        {salaryStages.map((s, i) => (
          <motion.div key={s.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.04 }}>
            <div className="flex items-baseline justify-between mb-1.5 gap-3">
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-sm font-bold text-text-main truncate">{s.stage}</span>
                <span className="font-mono text-[10px] text-text-dim shrink-0">{s.exp}</span>
              </div>
              <span className="font-mono text-sm font-bold text-text-main shrink-0">₹{s.min}–{s.max}L</span>
            </div>
            <div className="relative h-6 w-full bg-bg-void border border-border-soft">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0, left: `${(s.min / SCALE) * 100}%`, width: `${((s.max - s.min) / SCALE) * 100}%` }}
                className="absolute top-0 bottom-0 bg-signal-core"
              />
            </div>
            <p className="mt-1 text-xs text-text-dim">{s.note}</p>
          </motion.div>
        ))}
        <div className="flex justify-between font-mono text-[10px] text-text-dim pt-1">
          <span>₹0</span><span>₹25L</span><span>₹50L</span><span>₹75L</span><span>₹100L</span>
        </div>
      </div>
    </div>

    {/* Premiums + global */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <div className="bg-bg-base border-2 border-edge shadow-brutal p-5 sm:p-7">
        <h3 className="font-bold text-text-main mb-1">Skills that pay a premium</h3>
        <p className="text-xs text-text-dim mb-4">Extra ₹ LPA layered on top of the base band.</p>
        <div className="space-y-3">
          {skillPremiums.map((p) => (
            <div key={p.skill} className="flex items-start gap-3">
              <span className="font-mono text-sm font-bold text-accent-orange whitespace-nowrap pt-0.5">+₹{p.delta[0]}–{p.delta[1]}L</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-main">{p.skill}</div>
                <div className="text-xs text-text-dim">{p.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-base border-2 border-edge shadow-brutal p-5 sm:p-7">
        <h3 className="font-bold text-text-main mb-1">Same job, four countries</h3>
        <p className="text-xs text-text-dim mb-4">Indicative gross annual pay (entry → senior), {AS_OF}.</p>
        <div className="space-y-3">
          {globalPay.map((g) => (
            <div key={g.country} className="border-b border-border-soft pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-text-main"><span className="mr-2">{g.flag}</span>{g.country}</span>
                <span className="font-mono text-xs text-text-sub shrink-0">{g.currency} {g.entry} → {g.senior}</span>
              </div>
              <p className="text-xs text-text-dim mt-1">{g.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
