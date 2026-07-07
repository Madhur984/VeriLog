import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { domains } from '../data/careerData';
import { SectionHead, OUTLOOK, RangeBar, reveal } from './RoadmapUI';

/** Ten ECE domains as expandable cards: pay band, difficulty, skills, roadmap. */
export const DomainGrid: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="domains" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <SectionHead
        kicker="Where the work is"
        title="Ten domains, one degree"
        sub="Your ECE degree opens every one of these. Each card shows what the work actually is, the India pay band, and the exact skills to get in. Tap one to open its roadmap."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {domains.map((d, i) => {
          const isOpen = open === d.id;
          const ol = OUTLOOK[d.outlook];
          return (
            <motion.div
              key={d.id}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 2) * 0.05 }}
              className="bg-bg-base border-2 border-edge shadow-brutal"
            >
              <button onClick={() => setOpen(isOpen ? null : d.id)} className="w-full text-left p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-1">{d.tagline}</div>
                    <h3 className="text-xl font-bold text-text-main">{d.name}</h3>
                  </div>
                  <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-1 ${ol.cls}`}>{ol.label}</span>
                </div>

                <p className="mt-3 text-sm text-text-sub leading-relaxed">{d.what}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-mono text-[10px] text-text-dim uppercase mb-1">Fresher · ₹LPA</div>
                    <div className="text-sm font-bold text-text-main mb-1">{d.fresherLpa[0]}–{d.fresherLpa[1]}</div>
                    <RangeBar min={d.fresherLpa[0]} max={d.fresherLpa[1]} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-text-dim uppercase mb-1">Senior · ₹LPA</div>
                    <div className="text-sm font-bold text-text-main mb-1">{d.seniorLpa[0]}–{d.seniorLpa[1]}</div>
                    <RangeBar min={d.seniorLpa[0]} max={d.seniorLpa[1]} accent="bg-accent-orange" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <span key={k} className={`h-2 w-2 ${k < d.difficulty ? 'bg-text-main' : 'bg-border-soft'}`} />
                    ))}
                    <span className="ml-2 font-mono text-[10px] text-text-dim uppercase tracking-wider">difficulty</span>
                  </div>
                  <ChevronDown size={16} className={`text-text-dim transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t-2 border-edge"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-signal-core mb-2">Core skills</div>
                        <div className="flex flex-wrap gap-2">
                          {d.coreSkills.map((s) => (
                            <span key={s} className="text-xs font-medium px-2 py-1 bg-bg-elev border border-border-soft text-text-sub">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-signal-core mb-2">Tools of the trade</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {d.tools.map((s) => (
                            <span key={s} className="text-xs font-mono text-text-dim">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-signal-core mb-2">How to get in</div>
                        <ol className="space-y-1.5">
                          {d.roadmap.map((r, idx) => (
                            <li key={r} className="flex gap-3 text-sm text-text-sub">
                              <span className="font-mono text-xs text-text-dim shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                              {r}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
