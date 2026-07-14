import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Cpu } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const ROSE = '#fb7185';
const SKY = '#38bdf8';

const FACTS: Array<[string, string]> = [
  ['O(log N)', 'delay - the carries resolve in a logarithmic number of levels'],
  ['•', 'one associative merge operator, used everywhere in the tree'],
  ['log₂64 = 6', 'levels to add 64 bits, versus 64 for a ripple'],
  ['CPUs', 'the adders inside modern high-speed processors'],
];

const JOURNEY = ['The tree idea', 'The black cell', 'The prefix network', 'Topologies', 'Prove it'];

export const S00_Cover: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          Compute carries in a <span style={{ color: INDIGO }}>tree.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          The carry look-ahead adder is fast, but a single flat block explodes into impossible gates
          at 64 bits. The parallel prefix adder keeps the speed and tames the size by computing the
          carries in a tree: merge neighbouring blocks, double the span each level, and after just
          log₂N levels every carry is known. This is the fastest class of adder, and it is what sits
          inside real processors.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-xl md:text-2xl font-black" style={{ color: INDIGO }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* the three architectures at a glance */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-5 text-center" style={{ color: INDIGO }}>How carry delay grows with width</div>
        <div className="space-y-3 max-w-2xl mx-auto">
          {[
            { name: 'Ripple carry', growth: 'Linear · N', frac: 1.0, color: ROSE, note: 'one stage waits for the next' },
            { name: 'Carry look-ahead', growth: 'Block-linear', frac: 0.45, color: '#fb923c', note: 'fast, but a flat block balloons' },
            { name: 'Parallel prefix', growth: 'Logarithmic · log₂N', frac: 0.18, color: INDIGO, note: 'a tree of merges' },
          ].map(({ name, growth, frac, color, note }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="font-mono text-xs w-36 text-right" style={{ color }}>{name}</span>
              <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                <div className="h-full rounded-lg flex items-center pl-2" style={{ width: `${frac * 100}%`, background: color }}>
                  <span className="font-mono text-[10px] font-black text-black truncate">{growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className={`mt-5 text-sm text-center max-w-2xl mx-auto ${subText}`}>
          For 64 bits, ripple needs ~64 carry stages and look-ahead needs huge gates - the prefix
          adder needs only <span className="font-mono font-bold" style={{ color: INDIGO }}>6 levels</span> of
          small, identical merge cells.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid md:grid-cols-2 gap-4">
        {[
          { Icon: Zap, color: EMERALD, title: 'Its strength: logarithmic speed', body: 'Carry delay grows as log₂N, not N. Doubling the width adds just one more level, so even 64-bit adds stay extremely fast.' },
          { Icon: Cpu, color: INDIGO, title: 'Its price: wires and area', body: 'The tree of merge cells needs the most wiring and silicon of any adder. You spend area to buy the very best speed.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}><Icon size={20} style={{ color }} /></div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: INDIGO }}>The route through this module</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{ borderColor: i === JOURNEY.length - 1 ? `${ROSE}88` : `${INDIGO}44`, color: i === JOURNEY.length - 1 ? ROSE : INDIGO, background: i === JOURNEY.length - 1 ? `${ROSE}10` : `${INDIGO}08` }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" style={{ color: ink }} />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-center font-mono" style={{ color: EMERALD }}>
          The summit of the adder track: same Generate/Propagate idea from Module 11, arranged as a logarithmic tree.
        </p>
      </motion.div>
    </div>
  );
};

export default S00_Cover;
