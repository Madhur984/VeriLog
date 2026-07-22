import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Grid3x3, Boxes, Repeat, HelpCircle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * "Just the facts" primer for K-maps — sits AFTER the video and BEFORE the
 * Hostel analogy. Plain-English definitions and one small worked 3-variable
 * grid, in the clear summarised style of a good GeeksforGeeks article. The
 * hostel story then dresses these same rules up.
 */

// 3-variable K-map for Y = C  (rows A=0/1, cols BC in Gray order 00,01,11,10)
const COLS = ['00', '01', '11', '10'];
const GRID = [
  [0, 1, 1, 0], // A = 0  → m0 m1 m3 m2
  [0, 1, 1, 0], // A = 1  → m4 m5 m7 m6
];
const inGroup = (c: number) => c === 1 || c === 2; // the two C=1 columns

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  const FACTS = [
    {
      Icon: Grid3x3, color: '#22d3ee', tag: 'The grid',
      title: 'A truth table, folded into a picture',
      body: (
        <>A K-map is just the truth table drawn as a grid — one cell per row.
        <strong> n</strong> variables → <strong>2ⁿ</strong> cells (4 variables → a 4×4 grid). You fill
        each cell with the output for that combination.</>
      ),
    },
    {
      Icon: Repeat, color: '#a78bfa', tag: 'Gray code',
      title: 'Neighbours differ by one bit',
      body: (
        <>The rows and columns are ordered <strong>00, 01, 11, 10</strong> — not 00, 01, 10, 11. This
        “Gray code” order means any two touching cells change only <strong>one</strong> input, which is
        exactly what lets them combine.</>
      ),
    },
    {
      Icon: Boxes, color: '#34d399', tag: 'Grouping',
      title: 'Circle 1s in powers of two',
      body: (
        <>Group the 1s into rectangles of size <strong>1, 2, 4, 8…</strong> — as big as you can. Each
        time a group <strong>doubles</strong>, it cancels <strong>one</strong> variable. Bigger groups =
        shorter equation.</>
      ),
    },
    {
      Icon: HelpCircle, color: '#f59e0b', tag: 'Don’t-cares · X',
      title: 'Free 1s when they help',
      body: (
        <>Some rows can never happen. Mark them <strong>X</strong> and treat each as a 1 or 0 —
        whichever lets you draw a <strong>bigger</strong> group. Ignore the rest.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Heading */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>What a K-map actually does</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Simplifying logic with algebra gets messy fast — for 4 variables it is very easy to make a
          mistake. A <strong>Karnaugh map (K-map)</strong> turns that algebra into a
          simple <strong>drawing game</strong>: lay the truth table out as a grid, then circle the 1s
          into big blocks. Every block you draw hands you a shorter term.
        </p>
      </section>

      {/* Fact cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {FACTS.map((f, i) => {
          const Icon = f.Icon;
          return (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`p-6 rounded-3xl border ${cardBg}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${f.color}22`, color: f.color, border: `1.5px solid ${f.color}55` }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: f.color }}>{f.tag}</div>
                  <h4 className={`text-lg font-black ${textColor}`}>{f.title}</h4>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${subText}`}>{f.body}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Worked example */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Grid3x3 size={16} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Worked example · a 3-variable map
          </span>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center">
          {/* the grid */}
          <div className="inline-block">
            <div className="flex">
              <div className="w-10" />
              {COLS.map((c) => (
                <div key={c} className={`w-14 text-center font-mono text-xs pb-1 ${subText}`}>
                  <span className="opacity-50">BC=</span>{c}
                </div>
              ))}
            </div>
            {GRID.map((rowVals, r) => (
              <div key={r} className="flex items-center">
                <div className={`w-10 text-right pr-2 font-mono text-xs ${subText}`}>
                  <span className="opacity-50">A=</span>{r}
                </div>
                {rowVals.map((v, c) => (
                  <div
                    key={c}
                    className="w-14 h-14 flex items-center justify-center font-mono text-lg font-black border transition-colors"
                    style={{
                      background: inGroup(c) ? '#22d3ee22' : (isDarkMode ? 'transparent' : '#fff'),
                      borderColor: inGroup(c) ? '#22d3ee' : 'var(--border-soft)',
                      color: v ? '#22d3ee' : (isDarkMode ? '#64748b' : '#94a3b8'),
                    }}
                  >
                    {v}
                  </div>
                ))}
              </div>
            ))}
            <div className={`mt-2 font-mono text-[11px] ${subText}`}>
              <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1" style={{ background: '#22d3ee55', border: '1px solid #22d3ee' }} />
              one group of four
            </div>
          </div>

          {/* the reading */}
          <div className="space-y-4">
            <p className={`text-sm leading-relaxed ${subText}`}>
              All four 1s sit in the two middle columns — the columns where <span className="font-mono font-bold">C = 1</span>.
              They form one clean block of four. A group of four cancels <strong>two</strong> variables
              (here <span className="font-mono">A</span> and <span className="font-mono">B</span>), leaving just:
            </p>
            <div className={`p-3 rounded-xl font-mono text-xl font-black ${chipBg} border`} style={{ color: '#22d3ee' }}>
              Y = C
            </div>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              By algebra that would be <span className="font-mono">Σm(1,3,5,7)</span> — four product terms to
              wrestle with. The map shows the answer in <strong>one glance</strong>. That is the whole point
              of this module.
            </p>
          </div>
        </div>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Next, the same rules retold as a story — Madhur runs a hostel, and each K-map rule becomes a
        rule of the building.
      </p>
    </div>
  );
};
