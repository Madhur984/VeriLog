import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Table2, Sigma } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const CYAN = '#22d3ee';
const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

const TABLE = [
  { a: 0, b: 0, sum: 0, cout: 0 },
  { a: 0, b: 1, sum: 1, cout: 0 },
  { a: 1, b: 0, sum: 1, cout: 0 },
  { a: 1, b: 1, sum: 0, cout: 1 },
];

const TERMS = [
  ['bit', 'one binary digit: a 0 or a 1'],
  ['Sum', 'the ones-column digit of the answer'],
  ['Carry', 'the digit passed to the next column'],
  ['combinational', 'no memory, no clock - outputs follow inputs'],
  ['truth table', 'every input combination with its output'],
];

/**
 * Fact-first chapter: definition, block diagram, the four additions,
 * the truth table, and the two formulas - stated plainly, minimal motion.
 */
export const S01_Basics: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const rowBorder = isDarkMode ? 'border-white/10' : 'border-slate-200';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <BookOpen size={14} /> Chapter 02 · Definition &amp; Truth Table
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The facts first.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Before any story or analogy, here is exactly what a half adder is, what goes in,
          what comes out, and the table that defines it completely.
        </p>
      </section>

      {/* ── definition + block diagram ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="grid lg:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${CYAN}44`, background: `${CYAN}08` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
            Definition
          </div>
          <p className={`text-lg font-bold leading-relaxed ${textColor}`}>
            A half adder is a combinational logic circuit that adds two 1-bit binary
            numbers, A and B, and produces two outputs: the Sum and the Carry.
          </p>
          <ul className={`mt-4 space-y-2 text-sm ${subText}`}>
            <li><strong className={textColor}>Inputs: 2</strong> - the bits A and B, each 0 or 1.</li>
            <li><strong className={textColor}>Outputs: 2</strong> - Sum (the result digit) and Cout (the carry-out).</li>
            <li><strong className={textColor}>Type: combinational</strong> - no memory, no clock; the outputs depend only on the present inputs (the now-circuits from the previous module).</li>
          </ul>
        </div>

        <div className={`p-6 rounded-3xl border ${cardBg} flex flex-col`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
            Block diagram
          </div>
          <svg viewBox="0 0 420 150" className="w-full h-auto my-auto">
            <line x1={50} y1={55} x2={150} y2={55} stroke={ink} strokeWidth="3" />
            <line x1={50} y1={95} x2={150} y2={95} stroke={ink} strokeWidth="3" />
            <text x={40} y={59} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>A</text>
            <text x={40} y={99} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>B</text>
            <rect x={150} y={28} width={120} height={94} rx={14} fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
            <text x={210} y={82} textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="bold" fill={CYAN}>HA</text>
            <line x1={270} y1={55} x2={370} y2={55} stroke={ink} strokeWidth="3" />
            <line x1={270} y1={95} x2={370} y2={95} stroke={ink} strokeWidth="3" />
            <text x={378} y={59} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Sum</text>
            <text x={378} y={99} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Cout</text>
          </svg>
          <p className={`text-xs text-center ${subText}`}>
            Two wires in, two wires out. Everything else in this module explains what
            happens inside this box.
          </p>
        </div>
      </motion.div>

      {/* ── the four additions ── */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: CYAN }}>
          <Sigma size={13} /> Binary addition · all four cases
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-center">
          {[
            ['0 + 0', '0', false],
            ['0 + 1', '1', false],
            ['1 + 0', '1', false],
            ['1 + 1', '10', true],
          ].map(([eq, res, special]) => (
            <div key={eq as string} className={`p-4 rounded-2xl border-2 ${special ? '' : rowBorder}`}
                 style={special ? { borderColor: `${ROSE}66`, background: `${ROSE}0a` } : {}}>
              <div className={`text-lg ${subText}`}>{eq}</div>
              <div className="text-2xl font-black" style={{ color: special ? ROSE : EMERALD }}>= {res}</div>
              {special ? <div className="text-[10px] mt-1" style={{ color: ROSE }}>two needs TWO bits</div>
                       : <div className={`text-[10px] mt-1 opacity-0`}>·</div>}
            </div>
          ))}
        </div>
        <p className={`text-sm mt-4 max-w-3xl ${subText}`}>
          Three cases are easy. The fourth is the whole story: binary has no digit 2, so two
          is written 10 - a Sum of 0 and a Carry of 1. Hold on to that fact; the next two
          chapters make it physical.
        </p>
      </div>

      {/* ── the truth table ── */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
            <Table2 size={13} /> The truth table
          </div>
          <table className="w-full font-mono text-center">
            <thead>
              <tr className={`text-[11px] uppercase tracking-widest border-b ${rowBorder} ${subText}`}>
                <th className="py-2">A</th><th>B</th><th>Sum</th><th>Cout</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((r, i) => (
                <tr key={i} className={`border-b last:border-0 ${rowBorder}`}>
                  <td className={`py-3 text-lg font-bold ${textColor}`}>{r.a}</td>
                  <td className={`text-lg font-bold ${textColor}`}>{r.b}</td>
                  <td className="text-lg font-bold" style={{ color: r.sum ? EMERALD : undefined }}>
                    <span className={r.sum ? '' : subText}>{r.sum}</span>
                  </td>
                  <td className="text-lg font-bold" style={{ color: r.cout ? ROSE : undefined }}>
                    <span className={r.cout ? '' : subText}>{r.cout}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`text-sm mt-4 ${subText}`}>
            With 2 inputs there are exactly 2² = 4 combinations, so these four rows are the
            <strong className={textColor}> complete</strong> specification - there is no fifth case.
          </p>
        </div>

        <div className="space-y-4">
          <div className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
              The two formulas
            </div>
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border ${rowBorder}`}>
                <div className={`font-mono text-xl font-black ${textColor}`}>Sum = A ⊕ B</div>
                <p className={`text-sm mt-1 ${subText}`}>
                  ⊕ is the XOR (exclusive OR) operation: 1 when exactly one input is 1.
                  Check it against the Sum column: 0, 1, 1, 0.
                </p>
              </div>
              <div className={`p-4 rounded-2xl border ${rowBorder}`}>
                <div className={`font-mono text-xl font-black ${textColor}`}>Cout = A · B</div>
                <p className={`text-sm mt-1 ${subText}`}>
                  The dot is AND: 1 only when both inputs are 1. Check the Cout column:
                  0, 0, 0, 1.
                </p>
              </div>
            </div>
            <p className={`text-xs mt-3 ${subText}`}>
              These are facts for now. Chapters 6 and 7 show the two gates that compute them.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
              Key terms
            </div>
            <div className="space-y-2">
              {TERMS.map(([term, def]) => (
                <div key={term} className="flex gap-3 text-sm">
                  <span className="font-mono font-black flex-shrink-0 w-32" style={{ color: AMBER }}>{term}</span>
                  <span className={subText}>{def}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
