import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const benRule = (R: number, A: number, W: number) => (R + A + W) <= 1 ? 1 : 0;

const ROWS = Array.from({ length: 8 }, (_, i) => {
  const R = (i >> 2) & 1;
  const A = (i >> 1) & 1;
  const W = i & 1;
  return { idx: i, R, A, W, E: benRule(R, A, W) };
});

const captionFor = (r: typeof ROWS[number]) => {
  const issues = [r.R && 'Rain', r.A && 'Ants', r.W && 'Wind'].filter(Boolean) as string[];
  if (issues.length === 0) return 'Sunny, calm, bug-free';
  if (issues.length === 1) return `Just ${issues[0].toLowerCase()}`;
  if (issues.length === 2) return `${issues[0]} + ${issues[1]} = Ruin`;
  return 'Apocalypse';
};

export const S03_Multiverse: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [hover, setHover] = useState<number | null>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const happyCount = ROWS.filter(r => r.E === 1).length;
  const sadCount = ROWS.length - happyCount;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <section className="space-y-3">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
            Chapter 03 · The Multiverse
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
            The 8-Day Multiverse
          </h2>
          <p className={`text-base ${subText}`}>
            Three binary variables produce <strong>2³ = 8</strong> possible mornings. Each row is a
            parallel universe — <span className="text-emerald-400 font-bold">m0–m7</span>. Hover
            over a row below to enter that universe and read its caption.
          </p>
        </section>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10"
          style={{ background: '#fef9f0' }}
        >
          <img src="/images/sketchbook/p03.png" alt="The 8-Day Multiverse hand-drawn truth table" className="w-full block" />
        </motion.div>
      </div>

      {/* Truth table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`rounded-3xl border overflow-hidden ${cardBg}`}
      >
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-50'}>
              {['Row', 'R', 'A', 'W', 'Universe caption', 'Enjoyment E'].map(h => (
                <th key={h} className={`px-5 py-4 text-left font-black uppercase tracking-widest text-[10px] opacity-50 ${textColor}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const isHappy = r.E === 1;
              return (
                <motion.tr
                  key={r.idx}
                  initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.04 }}
                  onMouseEnter={() => setHover(r.idx)}
                  onMouseLeave={() => setHover(null)}
                  className={`border-t cursor-default transition-colors ${
                    isDarkMode ? 'border-white/5' : 'border-slate-100'
                  } ${
                    hover === r.idx
                      ? isHappy ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                      : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black ${
                      isHappy ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                    }`}>
                      {isHappy ? `m${r.idx}` : `M${r.idx}`}
                    </span>
                  </td>
                  <td className={`px-5 py-4 ${textColor}`}>{r.R}</td>
                  <td className={`px-5 py-4 ${textColor}`}>{r.A}</td>
                  <td className={`px-5 py-4 ${textColor}`}>{r.W}</td>
                  <td className={`px-5 py-4 text-[12px] ${subText}`}>{captionFor(r)}</td>
                  <td className="px-5 py-4">
                    <motion.span
                      key={`${r.idx}-${isHappy}`}
                      initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-base"
                      style={{
                        background: isHappy ? '#10b98122' : '#f43f5e22',
                        color: isHappy ? '#10b981' : '#f43f5e',
                        border: `1.5px solid ${isHappy ? '#10b981' : '#f43f5e'}`,
                      }}
                    >
                      {r.E}
                    </motion.span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Tally */}
      <div className="grid md:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-3">
            <Sparkles size={12} /> Happy paths
          </div>
          <div className={`text-4xl font-black mb-1 ${textColor}`}>{happyCount}<span className="opacity-30 text-2xl"> / 8</span></div>
          <div className={`text-xs ${subText}`}>Rows m0, m1, m2, m4 — these become <strong>minterms</strong> in SOP.</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] uppercase tracking-widest mb-3">
            <Layers size={12} /> Disasters
          </div>
          <div className={`text-4xl font-black mb-1 ${textColor}`}>{sadCount}<span className="opacity-30 text-2xl"> / 8</span></div>
          <div className={`text-xs ${subText}`}>Rows M3, M5, M6, M7 — these become <strong>maxterms</strong> in POS.</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest mb-3 text-amber-400">Key Insight</div>
          <p className={`text-sm leading-relaxed ${textColor}`}>
            The universe is perfectly balanced — 4 paths to joy, 4 paths to disaster. Either side
            uniquely determines the function. <em>Which side feels easier to write down?</em>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
