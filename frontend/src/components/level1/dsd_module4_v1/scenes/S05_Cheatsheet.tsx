import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Hash, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Inline gate icons
const NotIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="30" x2="14" y2="30" stroke="currentColor" strokeWidth="2.5" />
    <polygon points="14,12 14,48 50,30" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="55" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="59" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const AndIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="0" y1="42" x2="22" y2="42" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 22 8 L 42 8 A 22 22 0 0 1 42 52 L 22 52 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="64" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const OrIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="0" y1="42" x2="26" y2="42" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 22 5 Q 36 30 22 55 Q 50 50 65 30 Q 50 10 22 5 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="65" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const NandIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="0" y1="42" x2="22" y2="42" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 22 8 L 42 8 A 22 22 0 0 1 42 52 L 22 52 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="68" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="72" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const NorIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="0" y1="42" x2="26" y2="42" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 22 5 Q 36 30 22 55 Q 50 50 65 30 Q 50 10 22 5 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="68" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="72" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const XorIcon = () => (
  <svg viewBox="0 0 80 60" className="w-20 h-12">
    <line x1="0" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2.5" />
    <line x1="0" y1="42" x2="22" y2="42" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 18 5 Q 32 30 18 55" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="M 22 5 Q 36 30 22 55 Q 50 50 65 30 Q 50 10 22 5 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <line x1="65" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const GATES = [
  { name: 'NOT',  Icon: NotIcon,  expr: "Y = X'",       desc: 'Inverter · 1-input',                           accent: '#fb7185' },
  { name: 'AND',  Icon: AndIcon,  expr: 'Y = A · B',    desc: 'Y=1 only when ALL inputs are 1',               accent: '#fbbf24' },
  { name: 'OR',   Icon: OrIcon,   expr: 'Y = A + B',    desc: 'Y=1 when ANY input is 1',                      accent: '#22c55e' },
  { name: 'NAND', Icon: NandIcon, expr: "Y = (A·B)'",   desc: 'Universal · any function from NANDs alone',    accent: '#a78bfa' },
  { name: 'NOR',  Icon: NorIcon,  expr: "Y = (A+B)'",   desc: 'Universal · dual of NAND',                     accent: '#22d3ee' },
  { name: 'XOR',  Icon: XorIcon,  expr: 'Y = A ⊕ B',    desc: 'Y=1 when inputs DIFFER · half-adder sum',      accent: '#fb923c' },
];

const KMAP_RULES = [
  { t: 'Loops are powers of 2',   d: '1, 2, 4, 8 cells. Never 3, 5, 6, 7.' },
  { t: 'Largest first',           d: 'A 4-cell loop drops 2 variables. Always grab the biggest legal rectangle.' },
  { t: 'Wrap-around is legal',    d: 'Top edge ↔ bottom edge. Left edge ↔ right edge. Corners can form a quad.' },
  { t: 'Overlap is free',         d: "If a cell sits in two loops, no problem — the OR doesn't double-count." },
  { t: "Don't-cares are wildcards", d: 'Treat X as 1 if it helps form a larger group; otherwise as 0.' },
  { t: 'Variables that change drop', d: 'Inside a loop, any variable that takes both 0 and 1 is eliminated.' },
];

const ADJACENCY = [
  { vars: '3-var', layout: 'rows = A · cols = BC (Gray: 00, 01, 11, 10)', cells: '8 cells · 2 rows × 4 cols' },
  { vars: '4-var', layout: 'rows = AB · cols = CD (both Gray)',           cells: '16 cells · 4 rows × 4 cols' },
];

const PIPELINE = [
  { n: '1', t: 'Truth Table',   d: 'Enumerate every 2ⁿ row · mark F = 1 rows.' },
  { n: '2', t: 'Canonical SOP', d: 'Each F=1 row → minterm · OR them all.' },
  { n: '3', t: 'K-Map',         d: 'Plot 1s · group adjacent into power-of-2 loops.' },
  { n: '4', t: 'Schematic',     d: 'Map each product term to AND · feed the OR.' },
];

export const S05_Cheatsheet: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <BookOpen size={14} /> Drill Set 05 · Cheatsheet
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One-page reference.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Stuck mid-drill? Everything you need is on this page — gate symbols, K-Map adjacency
          rules, the four-stage pipeline. Bookmark and keep moving.
        </p>
      </motion.section>

      {/* Gate library strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-4 flex items-center gap-2">
          <Hash size={12} /> Gate library
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GATES.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-2xl border-2 flex items-center gap-3"
              style={{ borderColor: `${g.accent}55`, background: `${g.accent}10` }}
            >
              <div style={{ color: g.accent }}>
                <g.Icon />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: g.accent }}>{g.name}</div>
                <div className={`font-mono text-sm font-black ${textColor}`}>{g.expr}</div>
                <p className={`text-[11px] ${subText} mt-1`}>{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* K-Map rules */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-4 flex items-center gap-2">
          <Zap size={12} /> K-Map adjacency rules
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {KMAP_RULES.map((r) => (
            <div key={r.t} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">{r.t}</div>
              <p className={`text-xs ${subText}`}>{r.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {ADJACENCY.map((a) => (
            <div key={a.vars} className="p-3 rounded-xl border-2 border-violet-400/40 bg-violet-500/10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">{a.vars} K-Map</div>
              <div className={`text-sm ${textColor} font-mono`}>{a.layout}</div>
              <div className={`text-[11px] ${subText} mt-1`}>{a.cells}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pipeline summary */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-4">
          The four-stage pipeline · in order, every time
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="p-4 rounded-2xl border-2 border-amber-400/40 bg-amber-500/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded-lg grid place-items-center bg-amber-400 text-black font-mono font-black text-xs">
                  {s.n}
                </span>
                <h4 className={`text-sm font-black ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-[11px] ${subText} leading-relaxed`}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Module 04 · Practice Arena · Complete
      </motion.div>
    </div>
  );
};
