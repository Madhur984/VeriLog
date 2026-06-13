import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Copy, Check, ChefHat, Clock, ArrowRight, Library } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const ROSE = '#fb7185';
const ORANGE = '#fb923c';
const SKY = '#38bdf8';

interface Group { title: string; color: string; rows: Array<[string, string]> }

const SHEET: Group[] = [
  {
    title: 'The pieces', color: INDIGO,
    rows: [
      ['Bit G / P', 'G = A·B, P = A⊕B - per column.'],
      ['Block G / P', 'A whole span summarised by one G and one P.'],
      ['Black Cell', 'G = G_up + P_up·G_low, P = P_up·P_low.'],
      ['Sum', 'Sᵢ = Pᵢ ⊕ Cᵢ₋₁, once carries are known.'],
    ],
  },
  {
    title: 'The tree', color: EMERALD,
    rows: [
      ['Merge', 'Combine blocks pairwise with the Black Cell.'],
      ['Doubling', 'Each level doubles the span: 1, 2, 4, 8…'],
      ['Depth', 'log₂N levels (8→3, 16→4, 32→5, 64→6).'],
      ['Why a tree', 'The merge is associative, so it parallelises.'],
    ],
  },
  {
    title: 'The trade', color: ROSE,
    rows: [
      ['Delay', 'Logarithmic - the fastest adder class.'],
      ['Cost', 'Most wiring and area of any adder.'],
      ['Used in', 'High-speed CPU ALUs and wide datapaths.'],
      ['Flavours', 'Kogge-Stone, Brent-Kung, Ladner-Fischer.'],
    ],
  },
];

const CODE = `// 8-bit parallel prefix adder (Kogge-Stone).
// Phase 1: bit generate/propagate. Phase 2: 3-level black-cell tree.
// Phase 3: sum = p ^ carry.  Black cell: Go = Gu|(Pu&Gl), Po = Pu&Pl.
module ppa_8 (input [7:0] a, b, input cin, output [7:0] sum, output cout);
    wire [7:0] G0 = a & b;          // phase 1
    wire [7:0] P0 = a ^ b;

    wire [7:0] G1, P1, G2, P2, G3, P3;
    genvar i;
    generate
      for (i = 0; i < 8; i = i + 1) begin : tree
        // level 1 (distance 1), level 2 (distance 2), level 3 (distance 4)
        assign G1[i] = (i>=1) ? G0[i] | (P0[i] & G0[i-1]) : G0[i];
        assign P1[i] = (i>=1) ? P0[i] & P0[i-1]           : P0[i];
        assign G2[i] = (i>=2) ? G1[i] | (P1[i] & G1[i-2]) : G1[i];
        assign P2[i] = (i>=2) ? P1[i] & P1[i-2]           : P1[i];
        assign G3[i] = (i>=4) ? G2[i] | (P2[i] & G2[i-4]) : G2[i];
        assign P3[i] = (i>=4) ? P2[i] & P2[i-4]           : P2[i];
      end
    endgenerate

    wire [7:0] C;                    // carry into each bit
    assign C[0] = cin;
    generate
      for (i = 1; i < 8; i = i + 1) begin : carries
        assign C[i] = G3[i-1] | (P3[i-1] & cin);
      end
    endgenerate

    assign sum  = P0 ^ C;            // phase 3
    assign cout = G3[7] | (P3[7] & cin);
endmodule`;

export const S07_Recap: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const rowBg     = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';

  const copy = async () => { try { await navigator.clipboard.writeText(CODE); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ } };

  const NEXT = [
    { Icon: ChefHat, color: ORANGE, title: 'The flat version', body: 'Parallel prefix is look-ahead arranged as a tree. Revisit the flat carry look-ahead block it grew from.', cta: 'Module 11 · Carry Look-Ahead', go: '/dsd/11/cover' },
    { Icon: Clock, color: SKY, title: 'The opposite trade', body: 'Prefix spends maximum area for maximum speed. The serial adder does the reverse - minimum area, more time.', cta: 'Module 13 · The Serial Adder', go: '/dsd/13/cover' },
    { Icon: Library, color: INDIGO, title: 'Read real Verilog', body: 'Browse verified adders and building blocks, and try the prefix tree in the playground.', cta: 'Open the Verilog library', go: '/verilog-library' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ROSE }}>
          <BookOpen size={14} /> Chapter 08 · Recap & Verilog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          The whole tree on <span style={{ color: ROSE }}>one page.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Everything the module covered, condensed - then a real 8-bit Kogge-Stone prefix adder in
          Verilog, where you can read all three phases and the black-cell merges directly.
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
          <div className="flex items-center gap-2"><Code2 size={15} style={{ color: ROSE }} /><span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: ROSE }}>ppa_8.v · Kogge-Stone</span></div>
          <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} ${textColor}`}>
            {copied ? <><Check size={12} style={{ color: EMERALD }} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className={`overflow-x-auto p-5 text-[12px] leading-relaxed font-mono ${isDarkMode ? 'text-slate-200 bg-[#0a0e1a]' : 'text-slate-800 bg-slate-50'}`}><code>{CODE}</code></pre>
        <p className={`px-5 py-3 text-[12px] border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${subText}`}>
          Three levels of merges (distances 1, 2, 4) cover 8 bits - that is log₂8. Each{' '}
          <span className="font-mono">G/P</span> line is one black cell, and the carries fall out of the
          final prefixes <span className="font-mono">G3 / P3</span>.
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
