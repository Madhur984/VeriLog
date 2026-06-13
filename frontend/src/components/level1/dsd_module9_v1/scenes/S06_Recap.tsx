import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, Hammer, RefreshCw, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ROSE = '#fb7185';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';
const CYAN = '#22d3ee';

interface Group { title: string; color: string; rows: Array<[string, string]> }

const SHEET: Group[] = [
  {
    title: 'Combinational',
    color: CYAN,
    rows: [
      ['Definition', 'Output = function of present inputs only. No clock, no memory.'],
      ['MUX', 'N-to-1 selector, ceil(log2 N) select lines. 2:1: Y = S̄·D0 + S·D1.'],
      ['Decoder', 'n-to-2^n, one-hot: exactly one output high per input code.'],
      ['Priority encoder', 'One-hot in, binary index of the highest-priority active line out.'],
      ['Any function', 'Decoder makes every minterm; OR the rows where the output is 1.'],
    ],
  },
  {
    title: 'Sequential',
    color: VIOLET,
    rows: [
      ['Definition', 'Output = present inputs + stored past state. Needs memory + a clock.'],
      ['Latch', 'Level-sensitive: transparent while enabled, holds when not.'],
      ['D flip-flop', 'Edge-triggered: Q = D at the clock edge, held until the next edge.'],
      ['Clock', 'All flip-flops sample the same edge - the circuit moves in lockstep.'],
      ['Counter / register', 'Counter = flip-flops + adder (mod-N wraps). Register = N flip-flops, one clock.'],
    ],
  },
  {
    title: 'Adders',
    color: AMBER,
    rows: [
      ['Half adder', 'Sum = A⊕B, Carry = A·B. No carry-in, so it cannot chain.'],
      ['Full adder', 'Sum = A⊕B⊕Cin, Cout = AB+ACin+BCin.'],
      ['Sum rule', 'XOR = modulo-2: 1 when an odd number of inputs are 1.'],
      ['Carry rule', 'Majority: 1 when any two (or all three) inputs are 1.'],
      ['Architecture', '2 half adders + 1 OR. Ripple-carry: N full adders, Cout to Cin.'],
    ],
  },
];

export const S06_Recap: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const rowBg     = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';

  const NEXT = [
    { Icon: Layers, color: ROSE, title: 'Re-share the deck', body: 'Jump back to the recall deck and post the card that finally made a concept land.', cta: 'Back to the deck', go: '/dsd/9/deck' },
    { Icon: Hammer, color: AMBER, title: 'Build it for real', body: 'Take the adder logic to the live workbench and wire a full adder yourself, guided.', cta: 'Open the workbench', go: '/workbench?tutorial=full-adder' },
    { Icon: RefreshCw, color: VIOLET, title: 'Replay a source', body: 'Foggy on the "then"? Module 06 covers combinational vs sequential end to end.', cta: 'Module 06 · recap', go: '/dsd/6/cover' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <BookOpen size={14} /> Chapter 07 · The Cheatsheet
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          The whole module on <span style={{ color: VIOLET }}>one page.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Everything the deck and drills covered, condensed. Screenshot it, keep it for revision,
          and come back whenever a definition slips.
        </p>
      </motion.section>

      {/* cheatsheet */}
      <div className="grid lg:grid-cols-3 gap-4">
        {SHEET.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * gi }}
            className={`p-6 rounded-3xl border ${cardBg}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
              <h3 className="font-mono text-xs font-black uppercase tracking-widest" style={{ color: g.color }}>{g.title}</h3>
            </div>
            <div className="space-y-2">
              {g.rows.map(([term, def]) => (
                <div key={term} className={`p-3 rounded-xl border ${rowBg}`}>
                  <div className="text-[12px] font-black" style={{ color: g.color }}>{term}</div>
                  <div className={`mt-0.5 text-[12px] leading-relaxed font-mono ${subText}`}>{def}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* one defining line */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border text-center ${cardBg}`}>
        <p className={`text-lg md:text-xl font-bold leading-relaxed ${textColor}`}>
          Combinational logic is the <span style={{ color: CYAN }}>now</span>. Sequential logic adds
          the <span style={{ color: VIOLET }}>then</span>. And the
          <span style={{ color: AMBER }}> adder</span> is the combinational heart that, wrapped in a
          register, lets a CPU count, accumulate and compute across time.
        </p>
      </motion.div>

      {/* where next */}
      <div className="grid md:grid-cols-3 gap-4">
        {NEXT.map(({ Icon, color, title, body, cta, go }) => (
          <button
            key={title}
            onClick={() => navigate(go)}
            className={`text-left p-6 rounded-3xl border transition-all hover:-translate-y-0.5 active:scale-[0.99] ${cardBg}`}
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-widest" style={{ color }}>
              {cta} <ArrowRight size={13} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default S06_Recap;
