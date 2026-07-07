import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ExternalLink } from 'lucide-react';
import {
  marketStats, companies, schemes, fabs, exams, experiencePaths, studentPath,
  domains, SOURCES, AS_OF,
} from '../data/careerData';
import { SectionHead, reveal } from './RoadmapUI';

const sourceById = (id: string) => SOURCES.find((s) => s.id === id);

/* ── Hero ─────────────────────────────────────────────────────────────── */
export const RoadmapHero: React.FC = () => (
  <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8">
    <motion.div {...reveal}>
      <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-signal-core mb-5">
        <span className="h-2 w-2 bg-signal-core animate-gentle-pulse" /> Career roadmap · updated {AS_OF}
      </div>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-main leading-[1.02]">
        Your ECE degree is a<br /><span className="text-signal-core">ticket into silicon.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text-sub leading-relaxed">
        The world is short a million chip engineers, and India is building fabs for the first time.
        This is the honest map — the domains, the real pay, who’s hiring, and the exact route from first year to first offer.
      </p>
    </motion.div>

    <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {marketStats.slice(0, 3).map((s) => (
        <div key={s.id} className="bg-bg-base border-2 border-edge shadow-brutal p-5">
          <div className="text-2xl sm:text-3xl font-bold text-text-main">{s.value}</div>
          <div className="text-sm font-medium text-text-sub mt-1">{s.label}</div>
        </div>
      ))}
    </motion.div>

    <div className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-dim">
      <ArrowDown size={14} className="animate-bounce" /> Scroll to explore
    </div>
  </section>
);

/* ── Market pulse ─────────────────────────────────────────────────────── */
export const MarketPulse: React.FC = () => (
  <section id="market" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
    <SectionHead
      kicker="The opportunity"
      title="Why this, why now"
      sub="Not hype — numbers. Every figure below is dated and linked to its source."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {marketStats.map((s, i) => {
        const src = sourceById(s.sourceId);
        return (
          <motion.div
            key={s.id}
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.05 }}
            className="bg-bg-base border-2 border-edge shadow-brutal p-6 flex flex-col"
          >
            <div className="text-3xl sm:text-4xl font-bold text-signal-core">{s.value}</div>
            <div className="text-base font-bold text-text-main mt-2">{s.label}</div>
            <p className="text-sm text-text-sub mt-2 leading-relaxed flex-1">{s.detail}</p>
            {src && (
              <a href={src.url} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-dim hover:text-signal-core transition-colors">
                {src.label}<ExternalLink size={10} />
              </a>
            )}
          </motion.div>
        );
      })}
    </div>
  </section>
);

/* ── Companies ────────────────────────────────────────────────────────── */
export const CompaniesBoard: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const chips = [{ id: 'all', name: 'All' }, ...domains.map((d) => ({ id: d.id, name: d.name }))];
  const shown = filter === 'all' ? companies : companies.filter((c) => c.domainTags.includes(filter));

  return (
    <section id="companies" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <SectionHead
        kicker="Who's hiring"
        title="The companies, and what they want"
        sub="India pay bands and the skills that get you in the door. Filter by the domain you’re aiming for."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {chips.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border-2 transition-colors ${
              filter === c.id ? 'bg-text-main text-bg-base border-edge' : 'bg-bg-base text-text-sub border-border-soft hover:border-edge'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shown.map((c, i) => (
          <motion.div key={c.name} {...reveal} transition={{ ...reveal.transition, delay: (i % 2) * 0.04 }}
            className="bg-bg-base border-2 border-edge shadow-brutal p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold text-text-main">{c.name}</h3>
              <span className="font-mono text-sm font-bold text-signal-core whitespace-nowrap">₹{c.indiaLpa} LPA</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-dim mt-1">{c.cities}</div>
            <p className="text-sm text-text-sub mt-3">{c.lookFor}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ── Opportunities ────────────────────────────────────────────────────── */
export const OpportunitiesBoard: React.FC = () => (
  <section id="opportunities" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
    <SectionHead
      kicker="Real openings"
      title="Doors that are open right now"
      sub={`Government missions, the fabs rising across India, the exams worth taking, and how to get real experience — current as of ${AS_OF}.`}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-bg-base border-2 border-edge shadow-brutal p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">Government missions</h3>
        <div className="space-y-4">
          {schemes.map((s) => (
            <div key={s.name}>
              <div className="font-bold text-text-main text-sm">{s.name}</div>
              <p className="text-sm text-text-sub mt-0.5 leading-relaxed">{s.what}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-base border-2 border-edge shadow-brutal p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">Fabs &amp; plants rising in India</h3>
        <div className="space-y-2.5">
          {fabs.map((f) => {
            const cls = f.status === 'Operational' ? 'bg-signal-core text-white'
              : f.status === 'Under construction' ? 'bg-accent-orange text-white'
              : 'bg-bg-elev text-text-sub border border-edge';
            return (
              <div key={f.name} className="flex items-start justify-between gap-3 border-b border-border-soft pb-2.5 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="font-bold text-text-main text-sm">{f.name} <span className="font-normal text-text-dim">· {f.where}</span></div>
                  <div className="text-xs text-text-dim">{f.type}</div>
                </div>
                <span className={`shrink-0 font-mono text-[9px] uppercase tracking-wider px-2 py-1 ${cls}`}>{f.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bg-base border-2 border-edge shadow-brutal p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">Exams worth taking</h3>
        <div className="space-y-4">
          {exams.map((e) => (
            <div key={e.name}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-bold text-text-main text-sm">{e.name}</div>
                <div className="font-mono text-[10px] text-text-dim text-right shrink-0">{e.window}</div>
              </div>
              <p className="text-sm text-text-sub mt-0.5 leading-relaxed">{e.what}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-base border-2 border-edge shadow-brutal p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">Get real experience</h3>
        <div className="space-y-4">
          {experiencePaths.map((x) => (
            <div key={x.name}>
              <div className="font-bold text-text-main text-sm">{x.name}</div>
              <p className="text-sm text-text-sub mt-0.5 leading-relaxed">{x.what}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── The path ─────────────────────────────────────────────────────────── */
export const StudentPathSection: React.FC = () => (
  <section id="path" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
    <SectionHead
      kicker="The plan"
      title="First year to first offer"
      sub="An honest, semester-scale plan. Skip the noise, do the projects, and here’s how it compounds."
    />

    <div className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border-soft hidden sm:block" />
      <div className="space-y-5">
        {studentPath.map((p, i) => (
          <motion.div key={p.year} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="relative sm:pl-12">
            <div className="hidden sm:flex absolute left-0 top-1 h-8 w-8 items-center justify-center bg-signal-core text-white font-mono text-xs font-bold border-2 border-edge">{i + 1}</div>
            <div className="bg-bg-base border-2 border-edge shadow-brutal p-5">
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal-core">{p.year}</span>
                <h3 className="text-lg font-bold text-text-main">{p.title}</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {p.focus.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-text-sub"><span className="text-signal-core">→</span>{f}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
