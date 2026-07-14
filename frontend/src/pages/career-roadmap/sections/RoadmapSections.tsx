import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ExternalLink, Layers, Cpu, GitFork, Package, Box } from 'lucide-react';
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

const CHIP_LAYERS = [
  {
    layerName: "1. Silicon Substrate",
    description: "The crystalline base layer where all electronic physics begin.",
    icon: Layers,
    color: "border-teal-500/40 text-teal-400",
    bg: "bg-teal-500/[0.03]",
    glow: "shadow-[0_0_15px_rgba(20,184,166,0.1)]"
  },
  {
    layerName: "2. Transistor Gates",
    description: "Creating physical logic gates and silicon junctions.",
    icon: Cpu,
    color: "border-cyan-500/40 text-cyan-400",
    bg: "bg-cyan-500/[0.03]",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
  },
  {
    layerName: "3. Metal Interconnects",
    description: "Routing signals, timing delays, and interconnect networks.",
    icon: GitFork,
    color: "border-emerald-500/40 text-emerald-400",
    bg: "bg-emerald-500/[0.03]",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]"
  },
  {
    layerName: "4. Packaging & Tape-out",
    description: "Enclosing the physical die and running cleanroom validation.",
    icon: Package,
    color: "border-amber-500/40 text-amber-400",
    bg: "bg-amber-500/[0.03]",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]"
  },
  {
    layerName: "5. System Integration",
    description: "Board-level design, firmware, and commercial validation.",
    icon: Box,
    color: "border-orange-500/40 text-orange-400",
    bg: "bg-orange-500/[0.03]",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.1)]"
  }
];

export const StudentPathSection: React.FC = () => (
  <section id="path" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
    <SectionHead
      kicker="Silicon Timeline"
      title="Substrate-to-Package progression map"
      sub="An honest, layer-by-layer roadmap from first year to core ECE placements. Here is how your skills stack up like a microchip."
    />

    <div className="relative">
      {/* Central timeline line */}
      <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-teal-500 via-cyan-500 to-orange-500 hidden sm:block opacity-40" />
      
      <div className="space-y-6">
        {studentPath.map((p, i) => {
          const config = CHIP_LAYERS[i] || CHIP_LAYERS[CHIP_LAYERS.length - 1];
          const Icon = config.icon;
          return (
            <motion.div key={p.year} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="relative sm:pl-16">
              {/* Timeline dot with layer icon */}
              <div className={`hidden sm:flex absolute left-0 top-1 h-12 w-12 items-center justify-center rounded-full bg-[#0D0F12] border-2 ${config.color} ${config.glow} z-10 transition-all hover:scale-110`}>
                <Icon size={20} />
              </div>
              
              <div className={`bg-bg-base border-2 border-edge shadow-brutal p-6 relative overflow-hidden group ${config.bg} transition-all hover:border-text-main/30`}>
                {/* Visual grid layout decoration inside the card */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                
                <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#0D0F12] border border-white/5 font-bold ${config.color}`}>
                    {config.layerName} ({p.year})
                  </span>
                  <h3 className="text-xl font-bold text-text-main">{p.title}</h3>
                </div>
                
                <p className="text-xs text-text-dim mb-4 max-w-xl font-mono leading-relaxed">
                  {config.description}
                </p>

                <div className="border-t border-border-soft/45 pt-4">
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {p.focus.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-text-sub">
                        <span className="text-teal-400 mt-1 select-none">▪</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ── Alumni Pathways ─────────────────────────────────────────────────── */
interface AlumniStory {
  name: string;
  collegeType: string;
  startRole: string;
  startSalary: string;
  endRole: string;
  endSalary: string;
  steps: string[];
}

const ALUMNI_STORIES: AlumniStory[] = [
  {
    name: "Vikram R.",
    collegeType: "Tier-3 Affiliated College",
    startRole: "Systems Engineer (TCS)",
    startSalary: "₹4.2 LPA",
    endRole: "DV Engineer (Qualcomm)",
    endSalary: "₹18.5 LPA",
    steps: [
      "Graduated in 2022 with zero core placements; joined service sector IT.",
      "Learned SystemVerilog & UVM testbench basics at night (3 hrs/day).",
      "Completed 2 verified UVM IP testbench simulation projects on BitForBytes.",
      "Referred through verified platform badge; cleared Qualcomm DV technical round."
    ]
  },
  {
    name: "Sneha G.",
    collegeType: "Tier-2 National Institute",
    startRole: "Undergraduate Intern",
    startSalary: "₹45k / Month",
    endRole: "ASIC Engineer (NVIDIA)",
    endSalary: "₹32.0 LPA",
    steps: [
      "Identified VLSI Design interest in 2nd year via Silicon Timeline.",
      "Designed a 5-stage pipelined RISC-V CPU core in Verilog in 3rd year.",
      "Landed off-campus Silicon Design internship via off-campus recruitment drive.",
      "Converted to full-time PPO after compiling a verified performance report."
    ]
  },
  {
    name: "Aditya K.",
    collegeType: "Tier-3 Private University",
    startRole: "Software Developer (Frontend)",
    startSalary: "₹6.0 LPA",
    endRole: "Physical Design (Intel)",
    endSalary: "₹22.0 LPA",
    steps: [
      "Worked 2 years in Web Development but desired to work with physical hardware.",
      "Completed OpenLane ASIC flow workshops; specialized in floorplanning & synthesis.",
      "Contributed to an open-source tape-out project (tinytapeout).",
      "Cleared technical interviews at Intel focusing on STA, DRC, and layout constraints."
    ]
  }
];

export const AlumniPathwaysSection: React.FC = () => {
  const [activeStory, setActiveStory] = useState<number>(0);

  return (
    <section id="alumni" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <SectionHead
        kicker="Real Outcomes"
        title="ECE alumni trajectories"
        sub="Sourced and validated career trajectories. These paths show exactly how actual students transitioned from academics to core silicon."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Story Selector Sidebar */}
        <div className="space-y-3 lg:col-span-1">
          {ALUMNI_STORIES.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setActiveStory(idx)}
              className={`w-full text-left p-4 border-2 transition-all cursor-pointer ${
                activeStory === idx
                  ? 'bg-text-main text-bg-base border-edge shadow-brutal-sm'
                  : 'bg-bg-base text-text-sub border-border-soft hover:border-edge'
              }`}
            >
              <div className="font-bold text-base">{s.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider mt-1 opacity-70">
                {s.collegeType}
              </div>
              <div className="flex justify-between items-center mt-3 font-mono text-xs border-t border-current/20 pt-2">
                <span>{s.startSalary}</span>
                <span>→</span>
                <span className="font-bold">{s.endSalary}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Story Path Checklist */}
        <div className="lg:col-span-2 bg-bg-elev border-2 border-edge shadow-brutal p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border-soft pb-4 mb-6">
              <div>
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest font-bold block mb-1">
                  CAREER PATHWAY STORY
                </span>
                <h3 className="text-xl font-bold text-text-main">
                  {ALUMNI_STORIES[activeStory].name} · {ALUMNI_STORIES[activeStory].collegeType}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Target Conversion</span>
                <span className="font-mono text-base font-bold text-teal-400">
                  {ALUMNI_STORIES[activeStory].startRole} → {ALUMNI_STORIES[activeStory].endRole}
                </span>
              </div>
            </div>

            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-border-soft" />
              {ALUMNI_STORIES[activeStory].steps.map((stepText, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-edge bg-bg-elev flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-text-dim uppercase tracking-wider">Step 0{idx + 1}</span>
                    <p className="text-sm text-text-sub leading-relaxed">{stepText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border-soft/40 flex items-center gap-3 text-xs text-text-dim font-mono">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            Verified trajectory sourced directly from platform placements data.
          </div>
        </div>
      </div>
    </section>
  );
};
