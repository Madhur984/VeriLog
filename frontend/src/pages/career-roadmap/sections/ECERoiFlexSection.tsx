import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Sparkles, Zap, Award, Flame, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

interface DomainWealthData {
  domain: string;
  entryPay: { tier1: number; tier2: number; startup: number };
  midPay: { tier1: number; tier2: number; startup: number };
  seniorPay: { tier1: number; tier2: number; startup: number };
  flexQuote: string;
  hotSkills: string[];
}

const WEALTH_DATA: Record<string, DomainWealthData> = {
  vlsi: {
    domain: 'Digital Design & RTL (Verilog)',
    entryPay: { tier1: 24, startup: 18, tier2: 12 },
    midPay: { tier1: 45, startup: 35, tier2: 24 },
    seniorPay: { tier1: 90, startup: 70, tier2: 45 },
    flexQuote: "You design the physical logic gates powering Blackwell & Apple M-series chips. Unreplaceable high-level engineering.",
    hotSkills: ['Verilog / SystemVerilog', 'UVM Verification', 'PCIe / NVLink Protocols', 'ASIC Architecture']
  },
  pd: {
    domain: 'Physical Design & STA',
    entryPay: { tier1: 22, startup: 16, tier2: 11 },
    midPay: { tier1: 42, startup: 32, tier2: 22 },
    seniorPay: { tier1: 85, startup: 65, tier2: 42 },
    flexQuote: "You solve sub-2nm quantum timing, IR drop, and lithography constraints. High-frequency silicon wizardry.",
    hotSkills: ['Synopsys ICC2 / Innovus', 'STA & PrimeTime', '2nm GAAFET Nodes', 'Tcl Automation']
  },
  embedded: {
    domain: 'Embedded Systems & AI Edge',
    entryPay: { tier1: 18, startup: 14, tier2: 9 },
    midPay: { tier1: 34, startup: 26, tier2: 18 },
    seniorPay: { tier1: 65, startup: 50, tier2: 32 },
    flexQuote: "You bridge low-level C/C++ firmware with neural processing units on robotics, drones & autonomous vehicles.",
    hotSkills: ['Embedded C / FreeRTOS', 'ARM Cortex-M/R', 'RISC-V ISA', 'Linux Device Drivers']
  },
  verification: {
    domain: 'UVM & DV Verification',
    entryPay: { tier1: 25, startup: 19, tier2: 13 },
    midPay: { tier1: 48, startup: 38, tier2: 26 },
    seniorPay: { tier1: 95, startup: 75, tier2: 50 },
    flexQuote: "The highest paid entry-level domain in hardware. Zero bugs allowed before sending $50 Million masks to TSMC.",
    hotSkills: ['SystemVerilog UVM', 'SVA Assertions', 'Coverage-Driven Verification', 'Formal Verification']
  }
};

export const ECERoiFlexSection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('vlsi');
  const [tier, setTier] = useState<'tier1' | 'startup' | 'tier2'>('tier1');

  const current = WEALTH_DATA[selectedDomain] || WEALTH_DATA.vlsi;
  const entry = current.entryPay[tier];
  const mid = current.midPay[tier];
  const senior = current.seniorPay[tier];

  // Calculate 5-year accumulated gross earnings estimate (Lakhs INR)
  const cumulative5Yr = (entry * 1.5) + (mid * 3.5);

  return (
    <section id="ece-wealth-flex" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-24">
      {/* Gen-Z Vibrant Outer Envelope */}
      <div className="p-[2px] rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <div className="bg-[#090C12] rounded-[22px] p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
          
          {/* Decorative Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-full text-[10px] font-mono font-black uppercase tracking-widest mb-3">
                <Flame size={13} className="animate-bounce" />
                <span>WHY ECE IS COOL · THE SILICON BAG 💰</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Software is Saturated. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Hardware is Where the $1 Trillion Bag Is.
                </span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-2 max-w-2xl">
                While 500,000 CS graduates compete for web dev roles, chip architects and Verilog verification engineers command India's highest engineering packages & global visa priority.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shrink-0 backdrop-blur-md">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block mb-1">
                TOP TIER 1 FANG+ HARDWARE OFFER
              </span>
              <span className="text-2xl font-black font-mono text-white">
                ₹38L – ₹52L <span className="text-xs text-emerald-400 font-normal">CTC (Fresher)</span>
              </span>
            </div>
          </div>

          {/* Interactive 5-Year Wealth Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 mb-12">
            
            {/* Controls Panel (Left 5 cols) */}
            <div className="lg:col-span-5 bg-white/[0.02] border border-slate-800/80 p-6 rounded-2xl space-y-6">
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block mb-3">
                  1. Select Target ECE Domain
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(WEALTH_DATA).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDomain(key)}
                      className={`p-3 text-left font-mono text-xs rounded-xl border transition-all cursor-pointer ${
                        selectedDomain === key
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="block truncate">{data.domain.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest block mb-3">
                  2. Select Company Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tier1', label: 'Tier-1 MNC', desc: 'NVIDIA, Intel, Qualcomm' },
                    { id: 'startup', label: 'Chip Startup', desc: 'Series-B Hardware' },
                    { id: 'tier2', label: 'Services', desc: 'Wipro, HCL, L&T' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id as any)}
                      className={`p-2.5 text-center font-mono text-[11px] rounded-xl border transition-all cursor-pointer ${
                        tier === t.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="block font-bold">{t.label}</span>
                      <span className="block text-[9px] text-slate-500 truncate">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  💡 DOMAIN FLEX FACT
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{current.flexQuote}"
                </p>
              </div>
            </div>

            {/* Wealth Outcome Visualizer (Right 7 cols) */}
            <div className="lg:col-span-7 bg-white/[0.02] border border-slate-800/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold">
                    5-YEAR PAY TRAJECTORY (ANNUAL CTC)
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    PROJECTED 🚀
                  </span>
                </div>

                {/* Pay Progress Bars */}
                <div className="space-y-5 font-mono">
                  {/* Fresher / Entry */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Year 0–2 (Junior Engineer)</span>
                      <span className="text-emerald-400 font-bold">₹{entry} LPA</span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry / 100) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Mid Level */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Year 3–5 (Senior Specialist)</span>
                      <span className="text-teal-300 font-bold">₹{mid} LPA</span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(mid / 100) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Principal / Architect */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Year 6+ (Lead Architect / Staff)</span>
                      <span className="text-amber-400 font-bold">₹{senior} LPA + RSUs 💎</span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (senior / 100) * 100)}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Accumulated Wealth Banner */}
              <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-amber-500/15 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    ESTIMATED 5-YEAR ACCUMULATED GROSS CTC
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    ₹{cumulative5Yr.toFixed(1)} Lakhs <span className="text-xs font-normal text-emerald-400">(~$220,000 USD)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 font-bold bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl shrink-0">
                  <Sparkles size={14} />
                  <span>HIGH SKILL MOAT</span>
                </div>
              </div>

            </div>

          </div>

          {/* Cultural Flex Comparison Matrix */}
          <div className="border-t border-white/10 pt-8 relative z-10">
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-6 text-center">
              WHY ECE HARDWARE ENGINEERS ARE BUILT DIFFERENT 👑
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Software Web Dev */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3 opacity-75">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-slate-400">Generic CS / Web Dev</span>
                  <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">HIGH SATURATION</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-400 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span> 500,000+ bootcamps & grads fighting for 1 entry role
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span> Generative AI automating standard boilerplate code
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span> Constant tech stack churn (React, Vue, Svelte, Next)
                  </li>
                </ul>
              </div>

              {/* ECE & VLSI Hardware */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/40 rounded-2xl space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-extrabold text-emerald-300">ECE / VLSI Silicon Engineer</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400 font-bold">HIGH BARRIER MOAT 🛡️</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200 font-mono">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>You print 100-Billion Transistors on 2nm silicon wafers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>$10 Billion Indian Semiconductor Mission backing + FANG MNC Fabs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Irreplaceable physics, timing closure, & Verilog/UVM expertise</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
