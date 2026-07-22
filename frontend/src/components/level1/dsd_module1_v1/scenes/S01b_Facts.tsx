import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Table2, Plus, X, Lightbulb } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * "Just the facts" — a plain-English primer that sits AFTER the video and
 * BEFORE the picnic analogy. No story, no metaphor: clear definitions, the two
 * rules, and one small worked example, in the clean explain-it-simply style of
 * a good GeeksforGeeks summary. This is the ground truth the analogy then
 * dresses up.
 */

const XOR = [
  { row: 0, a: 0, b: 0, y: 0 },
  { row: 1, a: 0, b: 1, y: 1 },
  { row: 2, a: 1, b: 0, y: 1 },
  { row: 3, a: 1, b: 1, y: 0 },
];

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  const FACTS = [
    {
      Icon: Table2, color: '#38bdf8', tag: 'Truth table',
      title: 'It lists every possible answer',
      body: (
        <>A digital circuit gives one output — <strong>0 or 1</strong> — for each combination of its
        inputs. A <strong>truth table</strong> writes them all down. With <strong>n</strong> inputs you
        get <strong>2ⁿ</strong> rows (3 inputs → 8 rows).</>
      ),
    },
    {
      Icon: Plus, color: '#34d399', tag: 'Minterm  ·  m',
      title: 'One AND term per “1” row',
      body: (
        <>A <strong>minterm</strong> is an AND of all the inputs that is <strong>1</strong> for exactly
        one row. Rule: if an input is <strong>0</strong> in that row, write it barred (A′); if it
        is <strong>1</strong>, write it plain (A).</>
      ),
    },
    {
      Icon: X, color: '#f43f5e', tag: 'Maxterm  ·  M',
      title: 'One OR term per “0” row',
      body: (
        <>A <strong>maxterm</strong> is an OR of all the inputs that is <strong>0</strong> for exactly
        one row. The rule flips: if an input is <strong>1</strong>, write it barred; if it
        is <strong>0</strong>, write it plain.</>
      ),
    },
    {
      Icon: BookOpen, color: '#a78bfa', tag: 'Canonical form',
      title: 'Every term uses every input',
      body: (
        <>“Canonical” just means <strong>full-length</strong>: each minterm or maxterm mentions all the
        variables, none left out. That is the raw, unshortened form — we simplify it later with K-maps.</>
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
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Two ways to write any circuit</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Before the story, here is the plain version. A truth table can always be turned into an
          equation in <strong>two standard shapes</strong>: <strong>SOP</strong> (add up the good rows)
          and <strong>POS</strong> (block off the bad rows). Both describe the exact same circuit —
          you pick whichever is shorter.
        </p>
      </section>

      {/* Definition strip: SOP vs POS */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05 }}
          className={`p-7 rounded-3xl border ${cardBg}`}
          style={{ borderColor: '#34d399' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                 style={{ background: '#34d39922', color: '#34d399', border: '1.5px solid #34d39955' }}>
              <Plus size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Sum of Products</div>
              <h3 className={`text-2xl font-black ${textColor}`}>SOP</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Take every row where the output is <strong>1</strong>, write its <strong>minterm</strong>,
            and <strong>OR</strong> them together. Compact notation: <span className="font-mono font-bold" style={{ color: '#34d399' }}>Σm(…)</span>.
          </p>
          <p className={`mt-3 text-xs font-mono ${subText}`}>Best when the table has only a few 1s.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12 }}
          className={`p-7 rounded-3xl border ${cardBg}`}
          style={{ borderColor: '#f43f5e' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                 style={{ background: '#f43f5e22', color: '#f43f5e', border: '1.5px solid #f43f5e55' }}>
              <X size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Product of Sums</div>
              <h3 className={`text-2xl font-black ${textColor}`}>POS</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Take every row where the output is <strong>0</strong>, write its <strong>maxterm</strong>,
            and <strong>AND</strong> them together. Compact notation: <span className="font-mono font-bold" style={{ color: '#f43f5e' }}>ΠM(…)</span>.
          </p>
          <p className={`mt-3 text-xs font-mono ${subText}`}>Best when the table has only a few 0s.</p>
        </motion.div>
      </div>

      {/* Fact cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {FACTS.map((f, i) => {
          const Icon = f.Icon;
          return (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
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
        transition={{ delay: 0.45 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb size={16} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
            Worked example · a 2-input circuit
          </span>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
          {/* the table */}
          <div className={`rounded-2xl border overflow-hidden ${chipBg}`}>
            <table className="font-mono text-sm text-center">
              <thead>
                <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-100'}>
                  <th className={`px-4 py-2 ${subText}`}>A</th>
                  <th className={`px-4 py-2 ${subText}`}>B</th>
                  <th className={`px-4 py-2 ${subText}`}>Y</th>
                  <th className={`px-4 py-2 ${subText}`}>row</th>
                </tr>
              </thead>
              <tbody>
                {XOR.map((r) => (
                  <tr key={r.row} className="border-t" style={{ borderColor: 'var(--border-soft)' }}>
                    <td className={`px-4 py-2 ${textColor}`}>{r.a}</td>
                    <td className={`px-4 py-2 ${textColor}`}>{r.b}</td>
                    <td className="px-4 py-2 font-black" style={{ color: r.y ? '#34d399' : '#f43f5e' }}>{r.y}</td>
                    <td className={`px-4 py-2 opacity-50 ${subText}`}>m{r.row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* the two readings */}
          <div className="space-y-5">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>
                SOP · add the 1-rows (m1, m2)
              </div>
              <p className={`text-sm leading-relaxed ${subText}`}>
                Rows 1 and 2 output 1. Row 1 is <span className="font-mono">A=0, B=1</span> → <span className="font-mono font-bold">A′·B</span>.
                Row 2 is <span className="font-mono">A=1, B=0</span> → <span className="font-mono font-bold">A·B′</span>. OR them:
              </p>
              <div className={`mt-2 p-3 rounded-xl font-mono text-base font-black ${chipBg} border`} style={{ color: '#34d399' }}>
                Y = A′B + AB′ &nbsp;=&nbsp; Σm(1, 2)
              </div>
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: '#f43f5e' }}>
                POS · block the 0-rows (M0, M3)
              </div>
              <p className={`text-sm leading-relaxed ${subText}`}>
                Rows 0 and 3 output 0. Row 0 is <span className="font-mono">A=0, B=0</span> → <span className="font-mono font-bold">(A+B)</span>.
                Row 3 is <span className="font-mono">A=1, B=1</span> → <span className="font-mono font-bold">(A′+B′)</span>. AND them:
              </p>
              <div className={`mt-2 p-3 rounded-xl font-mono text-base font-black ${chipBg} border`} style={{ color: '#f43f5e' }}>
                Y = (A+B)(A′+B′) &nbsp;=&nbsp; ΠM(0, 3)
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${textColor}`}>
              <strong>Same circuit, two spellings.</strong> Both equations give the identical truth
              table above — this one is the XOR gate. That is the whole idea of this module.
            </p>
          </div>
        </div>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Now watch the same idea play out as a story — Ben plans a picnic, and his rule for a good day
        turns out to be exactly this.
      </p>
    </div>
  );
};
