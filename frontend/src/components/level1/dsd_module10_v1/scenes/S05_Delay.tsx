import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hourglass, TrendingUp, Scale, AlertTriangle } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const ROSE = '#fb7185';

const WIDTHS = [4, 8, 16, 32, 64];

const COMPARISON: Array<{ attr: string; solo: string; team: string }> = [
  { attr: 'Complexity',    solo: 'Simple logic gates',        team: 'A cascaded chain of N stages' },
  { attr: 'Hardware cost', solo: 'Very low (one adder)',      team: 'Scales directly with N' },
  { attr: 'Time delay',    solo: 'Fixed, single-stage delay', team: 'Cumulative, grows with N (2·N·ΔG)' },
];

export const S05_Delay: React.FC<Props> = ({ isDarkMode }) => {
  const [n, setN] = useState(8);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const delay = 2 * n;
  const maxDelay = 2 * 64;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Hourglass size={14} /> Chapter 06 · The Cost of Waiting
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Elegant and cheap - but slow</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The ripple-carry adder's simplicity has a price, and the price is time. Because every
          stage waits on the one below, the delays add up in a straight line. Here is exactly how
          that wait is measured, how badly it scales, and what you give and get versus a single adder.
        </p>
      </motion.section>

      {/* propagation delay + cumulative wait */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${AMBER}26`, border: `1px solid ${AMBER}55` }}>
            <Hourglass size={20} style={{ color: AMBER }} />
          </div>
          <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>Propagation delay</h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
            The physical time it takes for a stage's logic gates to process their inputs and produce
            a stable output. Until a stage's carry has propagated, the next runner is physically
            locked out of finishing its leg of the race.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${ROSE}26`, border: `1px solid ${ROSE}55` }}>
            <TrendingUp size={20} style={{ color: ROSE }} />
          </div>
          <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>The cumulative wait</h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
            The delays stack linearly. The total sum, from S0 to S(N-1), is not stable until the
            carry has rippled through every stage and the last runner crosses the line. The whole
            answer waits on the single longest path.
          </p>
        </motion.div>
      </div>

      {/* the formula + interactive scaling */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`relative p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <TryItYourself corner label="Pick a width" />
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: AMBER }}>The scaling problem</div>
          <div className={`mt-2 font-mono text-2xl md:text-3xl font-black ${textColor}`}>
            Total Delay = <span style={{ color: ROSE }}>2 × N × ΔG</span>
          </div>
          <p className={`mt-2 text-sm max-w-xl mx-auto ${subText}`}>
            Two gate delays per stage, N stages in series. Pick a width and watch the wait grow.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {WIDTHS.map((w) => (
            <button key={w} onClick={() => setN(w)}
              className="px-4 py-2 rounded-xl font-mono text-sm font-black border-2 transition-all active:scale-95"
              style={{ borderColor: n === w ? AMBER : `${AMBER}44`, background: n === w ? `${AMBER}22` : 'transparent', color: n === w ? AMBER : `${AMBER}aa` }}>
              {w}-bit
            </button>
          ))}
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {WIDTHS.map((w) => {
            const d = 2 * w;
            const active = w === n;
            return (
              <div key={w} className="flex items-center gap-3">
                <span className={`font-mono text-xs w-12 text-right ${active ? '' : subText}`} style={active ? { color: AMBER } : undefined}>{w}-bit</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(d / maxDelay) * 100}%` }} transition={{ duration: 0.5 }}
                              className="h-full rounded-lg flex items-center justify-end pr-2"
                              style={{ background: active ? AMBER : `${AMBER}66` }}>
                    <span className="font-mono text-[10px] font-black text-black">{d}·ΔG</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        <p className={`mt-6 text-center text-sm ${subText}`}>
          For a <strong style={{ color: EMERALD }}>4-bit</strong> add, an 8·ΔG wait is perfectly
          acceptable. For a <strong style={{ color: ROSE }}>64-bit</strong> modern system, a 128·ΔG
          sequential wait is a massive speed bottleneck. The relay race simply becomes too long.
        </p>
      </motion.div>

      {/* solo vs team */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[520px] md:min-w-0">
            <div className="grid grid-cols-3 text-center font-mono text-[11px] md:text-sm font-black uppercase tracking-widest">
              <div className={`p-4 ${subText}`}>Attribute</div>
              <div className="p-4 text-black" style={{ background: VIOLET }}>Single Full Adder</div>
              <div className="p-4 text-black" style={{ background: AMBER }}>N-bit Ripple Carry</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.attr} className={`grid grid-cols-3 text-center text-[13px] md:text-sm border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${i % 2 === 1 ? (isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-50/60') : ''}`}>
                <div className={`p-4 font-bold ${textColor}`}>{row.attr}</div>
                <div className={`p-4 ${subText}`}>{row.solo}</div>
                <div className="p-4 font-medium" style={{ color: AMBER }}>{row.team}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* close → next */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 rounded-3xl border-2"
                  style={{ borderColor: `${VIOLET}66`, background: isDarkMode ? 'rgba(167,139,250,0.06)' : 'rgba(167,139,250,0.05)' }}>
        <div className="flex items-center gap-2 mb-3 justify-center">
          <Scale size={18} style={{ color: VIOLET }} />
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: VIOLET }}>The verdict</span>
        </div>
        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-3xl mx-auto text-center ${textColor}`}>
          The ripple-carry adder is a beautiful example of modular design - its simplicity is its
          greatest strength. But the sequential baton hand-off creates an inevitable speed limit.
          To go faster, engineers found a way for runners to know the baton was coming before it was
          actually passed: the <span style={{ color: VIOLET }}>carry-lookahead adder</span>, coming next.
        </p>
        <div className="mt-3 flex items-center gap-2 justify-center font-mono text-[11px]" style={{ color: AMBER }}>
          <AlertTriangle size={12} /> the bottleneck you just measured is exactly what the next module removes
        </div>
      </motion.div>
    </div>
  );
};

export default S05_Delay;
