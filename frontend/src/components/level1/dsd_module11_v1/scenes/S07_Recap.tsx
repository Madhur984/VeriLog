import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Copy, Check, Link as LinkIcon, Network, ArrowRight, Library } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

interface Group { title: string; color: string; rows: Array<[string, string]> }

const SHEET: Group[] = [
  {
    title: 'The recipes', color: EMERALD,
    rows: [
      ['Generate', 'G = A·B - the column makes a carry by itself.'],
      ['Propagate', 'P = A⊕B - the column passes a carry through.'],
      ['Exclusive', 'A column generates or propagates, never both.'],
      ['One delay', 'G and P come straight from the inputs, in parallel.'],
    ],
  },
  {
    title: 'The carries', color: ORANGE,
    rows: [
      ['Recurrence', 'Ci+1 = Gi + Pi·Ci.'],
      ['Unrolled', 'Each carry rewritten with only G, P and C0.'],
      ['Parallel', 'No carry waits on another - all resolve together.'],
      ['Sum', 'Si = Pi ⊕ Ci = Ai ⊕ Bi ⊕ Ci.'],
    ],
  },
  {
    title: 'The trade', color: VIOLET,
    rows: [
      ['Delay', 'Near-constant; ~11 vs ~32 gate delays at 16-bit.'],
      ['Cost', 'Large, many-input gates - more area and power.'],
      ['Strength', 'Fast even when wide.'],
      ['Limit', 'A flat block explodes at 64-bit → parallel prefix.'],
    ],
  },
];

const CODE = `// A 4-bit carry look-ahead adder.
// Every carry is written directly from g, p and cin - computed in
// parallel, with no ripple between stages.
module cla_adder_4 (
    input  [3:0] a, b,
    input        cin,
    output [3:0] sum,
    output       cout
);
    wire [3:0] g = a & b;     // generate: this column makes a carry
    wire [3:0] p = a ^ b;     // propagate: this column passes a carry

    wire [4:0] c;
    assign c[0] = cin;
    assign c[1] = g[0] | (p[0] & c[0]);
    assign c[2] = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c[0]);
    assign c[3] = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0])
                       | (p[2] & p[1] & p[0] & c[0]);
    assign c[4] = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1])
                       | (p[3] & p[2] & p[1] & g[0])
                       | (p[3] & p[2] & p[1] & p[0] & c[0]);

    assign sum  = p ^ c[3:0];  // Si = Pi XOR Ci
    assign cout = c[4];
endmodule`;

export const S07_Recap: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const rowBg     = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';

  const copy = async () => {
    try { await navigator.clipboard.writeText(CODE); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ }
  };

  const NEXT = [
    { Icon: LinkIcon, color: ORANGE, title: 'The slow baseline', body: 'See the ripple delay this module removes - the relay race where every runner waits for the baton.', cta: 'Module 10 · Ripple-Carry', go: '/dsd/10/cover' },
    { Icon: Network, color: VIOLET, title: 'Keep speed, lose the bulk', body: 'A flat look-ahead block explodes at 64 bits. The parallel prefix adder stacks it into a logarithmic tree.', cta: 'Module 12 · Parallel Prefix', go: '/dsd/12/cover' },
    { Icon: Library, color: SKY, title: 'Read real Verilog', body: 'Browse verified adders and building blocks, and try the look-ahead equations in the playground.', cta: 'Open the Verilog library', go: '/verilog-library' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <BookOpen size={14} /> Chapter 08 · Recap & Verilog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          The chef's method on <span style={{ color: VIOLET }}>one page.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Everything the module covered, condensed - then the look-ahead carries written as Verilog,
          where you can read every parallel carry equation directly in the code.
        </p>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-4">
        {SHEET.map((g, gi) => (
          <motion.div key={g.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * gi }} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4"><span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} /><h3 className="font-mono text-xs font-black uppercase tracking-widest" style={{ color: g.color }}>{g.title}</h3></div>
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

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2"><Code2 size={15} style={{ color: VIOLET }} /><span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: VIOLET }}>cla_adder_4.v</span></div>
          <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} ${textColor}`}>
            {copied ? <><Check size={12} style={{ color: EMERALD }} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className={`overflow-x-auto p-5 text-[12px] leading-relaxed font-mono ${isDarkMode ? 'text-slate-200 bg-[#0a0e1a]' : 'text-slate-800 bg-slate-50'}`}><code>{CODE}</code></pre>
        <p className={`px-5 py-3 text-[12px] border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${subText}`}>
          Notice every <span className="font-mono">c[i]</span> is its own <span className="font-mono">assign</span>, written from{' '}
          <span className="font-mono">g</span>, <span className="font-mono">p</span> and <span className="font-mono">cin</span> only -
          there is no chain. That is the parallelism, in code.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {NEXT.map(({ Icon, color, title, body, cta, go }) => (
          <button key={title} onClick={() => navigate(go)} className={`text-left p-6 rounded-3xl border transition-all hover:-translate-y-0.5 active:scale-[0.99] ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}><Icon size={20} style={{ color }} /></div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-widest" style={{ color }}>{cta} <ArrowRight size={13} /></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default S07_Recap;
