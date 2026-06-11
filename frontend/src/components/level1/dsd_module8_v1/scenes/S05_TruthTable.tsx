import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table2, MousePointerClick, Lightbulb } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';

const ROWS = [
  { a: 0, b: 0, cin: 0, s: 0, cout: 0 },
  { a: 0, b: 0, cin: 1, s: 1, cout: 0 },
  { a: 0, b: 1, cin: 0, s: 1, cout: 0 },
  { a: 0, b: 1, cin: 1, s: 0, cout: 1 },
  { a: 1, b: 0, cin: 0, s: 1, cout: 0 },
  { a: 1, b: 0, cin: 1, s: 0, cout: 1 },
  { a: 1, b: 1, cin: 0, s: 0, cout: 1 },
  { a: 1, b: 1, cin: 1, s: 1, cout: 1 },
];

export const S05_TruthTable: React.FC<Props> = ({ isDarkMode }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [cin, setCin] = useState(0);

  const activeIdx = a * 4 + b * 2 + cin;
  const row = ROWS[activeIdx];
  const total = a + b + cin;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const setRow = (i: number) => {
    setA(ROWS[i].a); setB(ROWS[i].b); setCin(ROWS[i].cin);
  };

  const toggle = (label: string, val: number, flip: () => void) => (
    <button
      key={label}
      onClick={flip}
      className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[104px] active:scale-95"
      style={{
        borderColor: VIOLET,
        color: val ? '#000' : VIOLET,
        backgroundColor: val ? VIOLET : 'transparent',
        boxShadow: val ? `0 0 25px ${VIOLET}55` : 'none',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest opacity-80">input</span>
      <span className="text-lg">{label} = {val}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Table2 size={14} /> Chapter 06 · The Complete Truth Table
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Eight rows. Zero mysteries.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three one-bit inputs make 2³ = 8 possible cases - few enough to check every single
          one. Flip the inputs (or click a row) and watch both formulas agree with plain
          arithmetic on all eight.
        </p>
      </section>

      {/* interactive table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className={`flex items-center gap-2 text-xs font-mono mb-4 ${subText}`}>
          <MousePointerClick size={12} /> Click any row to load it into the switches
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* the table */}
          <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
               style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
            <div className={`grid grid-cols-6 text-center font-mono text-[10px] uppercase tracking-wider py-2 ${
              isDarkMode ? 'bg-white/[0.06] text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <span>A</span><span>B</span><span style={{ color: EMERALD }}>Cin</span>
              <span style={{ color: CYAN }}>S</span><span style={{ color: AMBER }}>Cout</span>
              <span>total</span>
            </div>
            {ROWS.map((r, i) => {
              const active = i === activeIdx;
              const t = r.a + r.b + r.cin;
              return (
                <button key={i} onClick={() => setRow(i)}
                        className={`w-full grid grid-cols-6 items-center text-center font-mono text-sm py-2.5 border-t transition-all ${
                          active
                            ? isDarkMode ? 'bg-violet-500/15' : 'bg-violet-50'
                            : isDarkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'
                        } ${textColor}`}
                        style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                  <span style={{ opacity: active ? 1 : 0.7 }}>{r.a}</span>
                  <span style={{ opacity: active ? 1 : 0.7 }}>{r.b}</span>
                  <span style={{ color: EMERALD, opacity: active ? 1 : 0.7 }}>{r.cin}</span>
                  <span className="font-black" style={{ color: CYAN, opacity: active ? 1 : 0.65 }}>{r.s}</span>
                  <span className="font-black" style={{ color: AMBER, opacity: active ? 1 : 0.65 }}>{r.cout}</span>
                  <span className="text-[11px]" style={{ color: VIOLET, opacity: active ? 1 : 0.55 }}>
                    {t} = {r.cout}{r.s}₂
                  </span>
                </button>
              );
            })}
          </div>

          {/* switches + live readout */}
          <div className="space-y-4">
            <div className="flex lg:flex-col gap-3 flex-wrap">
              {toggle('A', a, () => setA(v => v ? 0 : 1))}
              {toggle('B', b, () => setB(v => v ? 0 : 1))}
              {toggle('Cin', cin, () => setCin(v => v ? 0 : 1))}
            </div>
            <div className={`p-4 rounded-2xl border-2 font-mono text-sm space-y-2 ${textColor}`}
                 style={{ borderColor: `${VIOLET}55`, background: `${VIOLET}0a` }}>
              <div className="text-[10px] uppercase tracking-widest opacity-60">live check</div>
              <div>{a} + {b} + {cin} = <strong style={{ color: VIOLET }}>{total}</strong></div>
              <div>{total} in binary = <strong style={{ color: VIOLET }}>{row.cout}{row.s}</strong></div>
              <div>
                → <span style={{ color: AMBER }}>Cout = {row.cout}</span> ·{' '}
                <span style={{ color: CYAN }}>S = {row.s}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* the big insight */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className={`p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-violet-500/5' : 'bg-violet-50'}`}
                  style={{ borderColor: `${VIOLET}44` }}>
        <div className="flex items-start gap-3 max-w-3xl mx-auto">
          <Lightbulb size={20} className="shrink-0 mt-0.5" style={{ color: VIOLET }} />
          <p className={`text-sm leading-relaxed ${textColor}`}>
            <strong style={{ color: VIOLET }}>The table's secret:</strong> read Cout and S together
            as a two-bit number, and every row is simply <em>counting its inputs</em>. Zero ones
            → 00. One → 01. Two → 10. Three → 11. The full adder is a machine that counts to
            three - the Sum wire is the count's low bit (the odd/even XOR), and the Carry wire
            is its high bit (the majority vote).
          </p>
        </div>
      </motion.div>

      {/* column highlights */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid sm:grid-cols-2 gap-3">
        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: CYAN }}>
            The S column · odd rows only
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            S = 1 on exactly the four rows with an odd count of 1s: rows 001, 010, 100 and 111.
            Cover the other columns and you can reconstruct it by counting alone - that is
            S = A ⊕ B ⊕ Cin doing its job.
          </p>
        </div>
        <div className={`p-5 rounded-2xl border ${cardBg}`}>
          <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: AMBER }}>
            The Cout column · majority rows only
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Cout = 1 on exactly the four rows where at least two inputs are 1: rows 011, 101,
            110 and 111. Each of those satisfies at least one pair in AB + ACin + BCin - the
            majority function, row by row.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
