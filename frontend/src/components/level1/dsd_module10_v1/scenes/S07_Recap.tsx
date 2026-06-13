import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Copy, Check, Cpu, Clock, ArrowRight, Library } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

interface Group { title: string; color: string; rows: Array<[string, string]> }

const SHEET: Group[] = [
  {
    title: 'The build', color: AMBER,
    rows: [
      ['Stages', 'N full adders, one per bit.'],
      ['The chain', 'Cout of stage i wires to Cin of stage i+1.'],
      ['The start', 'Bit 0\'s Cin is tied to 0.'],
      ['The end', 'The final Cout is the top result bit (N+1 total).'],
    ],
  },
  {
    title: 'The timing', color: EMERALD,
    rows: [
      ['The wait', 'Each stage waits for the carry from below.'],
      ['Per stage', 'About 2 gate delays (ΔG) to settle and pass.'],
      ['Total', 'Worst-case delay ≈ 2 · N · ΔG (linear in N).'],
      ['Worst case', '0111 + 0001: the carry ripples all the way up.'],
    ],
  },
  {
    title: 'The trade', color: VIOLET,
    rows: [
      ['Strength', 'Simple, cheap, modular - copy one adder N times.'],
      ['Weakness', 'Slow for large N; the ripple is the bottleneck.'],
      ['Logic', 'Sum = A⊕B⊕Cin, Cout = AB+BCin+ACin per stage.'],
      ['Successor', 'Carry-lookahead computes carries in parallel.'],
    ],
  },
];

const CODE = `// One full adder - the single runner.
module full_adder(input a, b, cin, output sum, cout);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (b & cin) | (a & cin);
endmodule

// N full adders chained carry-to-carry - the relay team.
module ripple_carry_adder #(parameter N = 4) (
    input  [N-1:0] a, b,
    input          cin,
    output [N-1:0] sum,
    output         cout
);
    wire [N:0] c;            // the carry chain: c[0]=cin ... c[N]=cout
    assign c[0] = cin;

    genvar i;
    generate
        for (i = 0; i < N; i = i + 1) begin : stage
            full_adder fa (
                .a   (a[i]),
                .b   (b[i]),
                .cin (c[i]),       // baton received from stage i-1
                .sum (sum[i]),
                .cout(c[i+1])      // baton passed to stage i+1
            );
        end
    endgenerate

    assign cout = c[N];
endmodule`;

export const S07_Recap: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const rowBg     = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';

  const copy = async () => {
    try { await navigator.clipboard.writeText(CODE); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { /* clipboard blocked */ }
  };

  const NEXT = [
    { Icon: Cpu, color: EMERALD, title: 'Revisit one runner', body: 'Every stage here is the full adder from Module 08 - two half adders and an OR gate. Replay it if the stage logic is foggy.', cta: 'Module 08 · The Full Adder', go: '/dsd/8/cover' },
    { Icon: Clock, color: SKY, title: 'The faster fix', body: 'The ripple is slow because carries wait. The carry look-ahead adder predicts every carry in parallel - no waiting.', cta: 'Module 11 · Carry Look-Ahead', go: '/dsd/11/cover' },
    { Icon: Library, color: VIOLET, title: 'Read real Verilog', body: 'Browse verified adders, FSMs and registers, and try the generate-loop chain in the playground.', cta: 'Open the Verilog library', go: '/verilog-library' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <BookOpen size={14} /> Chapter 08 · Recap & Verilog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          The relay team on <span style={{ color: VIOLET }}>one page.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Everything the module covered, condensed - then the same chain written as Verilog, where
          a generate loop builds the relay team and the carry wire is the baton.
        </p>
      </motion.section>

      {/* cheatsheet */}
      <div className="grid lg:grid-cols-3 gap-4">
        {SHEET.map((g, gi) => (
          <motion.div key={g.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * gi }}
                      className={`p-6 rounded-3xl border ${cardBg}`}>
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

      {/* verilog */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Code2 size={15} style={{ color: VIOLET }} />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: VIOLET }}>ripple_carry_adder.v</span>
          </div>
          <button onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} ${textColor}`}>
            {copied ? <><Check size={12} style={{ color: EMERALD }} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className={`overflow-x-auto p-5 text-[12px] leading-relaxed font-mono ${isDarkMode ? 'text-slate-200 bg-[#0a0e1a]' : 'text-slate-800 bg-slate-50'}`}>
          <code>{CODE}</code>
        </pre>
        <p className={`px-5 py-3 text-[12px] border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${subText}`}>
          The <span className="font-mono">generate</span> loop stamps out N identical full adders;
          the <span className="font-mono">c[N:0]</span> wire is the carry chain, with{' '}
          <span className="font-mono">c[i]</span> the baton received and <span className="font-mono">c[i+1]</span>{' '}
          the baton passed. Change <span className="font-mono">N</span> and the relay team grows.
        </p>
      </motion.div>

      {/* where next */}
      <div className="grid md:grid-cols-3 gap-4">
        {NEXT.map(({ Icon, color, title, body, cta, go }) => (
          <button key={title} onClick={() => navigate(go)}
                  className={`text-left p-6 rounded-3xl border transition-all hover:-translate-y-0.5 active:scale-[0.99] ${cardBg}`}>
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

export default S07_Recap;
