import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { CheckCircle2, Circle } from 'lucide-react';

const PHASE2_TASKS = [
  { done: true,  text: 'Career Roadmap v5.0 with tabbed dashboard' },
  { done: true,  text: 'Skill Gap Radar with company overlay mode' },
  { done: true,  text: 'About tab merged as first experience' },
  { done: false, text: 'Verilog HDL module (VL-M01)' },
  { done: false, text: 'Advanced Digital Design (DD-M02)' },
  { done: false, text: 'Silicon Resume generator' },
  { done: false, text: 'Interview Terminal — domain question banks' },
  { done: false, text: 'College verification + peer connections' },
  { done: false, text: 'VoltMonkey AI hint system (Adarsh)' },
];

export const WhatWeBuilt: React.FC = () => {
  return (
    <SectionWrapper id="what-we-built" className="bg-[#07080A] border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">
            THE PLATFORM
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-[1.1]">
            What exists. What's coming. What we're aiming for.
          </h2>
        </div>

        {/* Vertical Timeline Wrapper */}
        <div className="relative space-y-8 pl-8 md:pl-12">
          {/* Vertical dashed line */}
          <div className="absolute left-[16px] md:left-[24px] top-6 bottom-6 w-0.5 border-l border-dashed border-white/10 pointer-events-none" />          {/* Phase 1 - TODAY */}
          <div className="relative">
            {/* Dot indicator on vertical line */}
            <div className="absolute left-[-29px] md:left-[-37px] top-[34px] w-3 h-3 rounded-full bg-emerald-400 border-4 border-observatory-bg z-20" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="pcb-trace-card relative bg-[#0D0F12] border border-white/[0.08] border-l-4 border-l-emerald-400 rounded-xl p-8 hover:border-slate-800 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-wider block mb-1">Phase 1</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">The Foundation</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-400/20">
                  LIVE NOW
                </span>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Core Features Available</span>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Interactive scrollytelling modules (DD-M01: Digital Design Foundations)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Career Roadmap: 13 ECE specializations with salary, roles, and skills data</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Skill Topology: Prerequisite visual nodes mapped by job requirements</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Silicon Cabinet: Unlocked badges and credentials</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Silicon Ticker: Live telemetry updates from the semiconductor space</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-400 mt-0.5" />
                      <span className="text-xs md:text-sm text-slate-400">Trajectory Simulator: Interactive career path outcome simulator</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-4">Coverage Telemetry</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">13</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">ECE Domains</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">30+</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">Interview Qs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">25</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">Live Updates</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">10</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">Target Companies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">₹0</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">Paywalls</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Phase 2 - BUILDING */}
          <div className="relative">
            {/* Dot indicator on vertical line */}
            <div className="absolute left-[-29px] md:left-[-37px] top-[34px] w-3 h-3 rounded-full bg-amber-400 border-4 border-observatory-bg z-20" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="pcb-trace-card relative bg-[#0D0F12] border border-white/[0.08] border-l-4 border-l-amber-400 rounded-xl p-8 hover:border-slate-800 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="font-mono text-[9px] text-amber-400 uppercase tracking-wider block mb-1">Phase 2</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">The Expansion</h3>
                </div>
                <span className="px-3 py-1 bg-amber-400/10 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest rounded-full border border-amber-400/20">
                  IN PROGRESS
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Feature Backlog Status</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PHASE2_TASKS.map((task, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {task.done ? (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle size={14} className="text-slate-700 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${task.done ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Phase 3 - THE VISION */}
          <div className="relative">
            {/* Dot indicator on vertical line */}
            <div className="absolute left-[-29px] md:left-[-37px] top-[34px] w-3 h-3 rounded-full bg-cyan-400 border-4 border-observatory-bg z-20" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="pcb-trace-card relative bg-[#0D0F12] border border-white/[0.08] border-l-4 border-l-cyan-400 rounded-xl p-8 hover:border-slate-800 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-wider block mb-1">Phase 3</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">The ECE Companion</h3>
                </div>
                <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-widest rounded-full border border-cyan-400/20">
                  2026–2027
                </span>
              </div>

              <div className="space-y-4 max-w-3xl">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Project Destination</span>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                  A complete 4-year ECE companion — from "I don't know what
                  my degree means" to "I have my first chip design offer."
                </p>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                  All 13 ECE domain modules. Peer-to-peer mentorship.
                  Direct connections to companies.
                </p>
                <p className="font-mono text-xs font-semibold" style={{ color: '#22D3EE' }}>
                  Still free.
                </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
};
