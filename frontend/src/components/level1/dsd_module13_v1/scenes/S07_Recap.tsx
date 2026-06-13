import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, Copy, Check, Clock, Cpu, ArrowRight, Library } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

interface Group { title: string; color: string; rows: Array<[string, string]> }

const SHEET: Group[] = [
  {
    title: 'The machine', color: SKY,
    rows: [
      ['Full adder', 'Exactly one, reused every cycle.'],
      ['Shift registers', 'Two (A and B) hold the operands, feed LSB first.'],
      ['Carry flip-flop', 'One D flip-flop stores Cout, feeds it back as Cin.'],
      ['Clock', 'One tick = one pair of bits processed.'],
    ],
  },
  {
    title: 'The rhythm', color: EMERALD,
    rows: [
      ['Queue up', 'Bits line up in the shift registers.'],
      ['Process', 'One pair enters the full adder per cycle.'],
      ['Shift output', 'The result register shifts the sum bit in.'],
      ['N bits = N cycles', 'Then the final carry forms the top bit.'],
    ],
  },
  {
    title: 'The trade', color: AMBER,
    rows: [
      ['Sum', 'S = A ⊕ B ⊕ Cin (same full adder every cycle).'],
      ['Carry', 'Cout = AB + BCin + ACin, stored each tick.'],
      ['Parallel', 'N adders, 1 cycle, massive - speed wins.'],
      ['Serial', '1 adder, N cycles, compact - space wins.'],
    ],
  },
];

const CODE = `// A serial adder: one full adder, reused every clock.
// Two shift registers feed bits LSB-first; a flip-flop carries the carry.
module serial_adder #(parameter N = 8) (
    input              clk,
    input              start,   // pulse high to load a, b and begin
    input  [N-1:0]     a, b,    // the two operands
    output [N-1:0]     sum,     // low N bits of the result
    output             cout,    // final carry-out (top bit)
    output             done
);
    reg [N-1:0]               A, B, S;
    reg                       carry, busy;
    reg [$clog2(N+1)-1:0]     count;

    // the single full adder, working on the lowest bit of each register
    wire fa_sum  = A[0] ^ B[0] ^ carry;
    wire fa_cout = (A[0] & B[0]) | (B[0] & carry) | (A[0] & carry);

    always @(posedge clk) begin
        if (start && !busy) begin
            A <= a; B <= b; S <= 0;
            carry <= 1'b0;          // clear the carry before a new add
            count <= 0; busy <= 1'b1;
        end else if (busy) begin
            S     <= {fa_sum, S[N-1:1]}; // shift the sum bit in from the top
            A     <= A >> 1;             // next bit of A
            B     <= B >> 1;             // next bit of B
            carry <= fa_cout;            // park the carry for next cycle
            count <= count + 1'b1;
            if (count == N-1) busy <= 1'b0;
        end
    end

    assign sum  = S;
    assign cout = carry;
    assign done = !busy;
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
    { Icon: Clock, color: SKY, title: 'Step it again', body: 'Re-run the live addition and try the carry-ripple preset until the timing is second nature.', cta: 'Back to the walkthrough', go: '/dsd/13/walkthrough' },
    { Icon: Cpu, color: EMERALD, title: 'Revisit the full adder', body: 'The booth itself is just a full adder. Module 08 builds it from two half adders and an OR gate.', cta: 'Module 08 · The Full Adder', go: '/dsd/8/cover' },
    { Icon: Library, color: VIOLET, title: 'Read real Verilog', body: 'Browse verified counters, FSMs and registers - the sequential building blocks behind this design.', cta: 'Open the Verilog library', go: '/verilog-library' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <BookOpen size={14} /> Chapter 08 · Recap & Verilog
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          The whole booth on <span style={{ color: VIOLET }}>one page.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Everything the module covered, condensed - then the same machine written as Verilog, so
          you can see the shift registers, the single adder and the carry flip-flop in code.
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
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Code2 size={15} style={{ color: VIOLET }} />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: VIOLET }}>serial_adder.v</span>
          </div>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
            } ${textColor}`}
          >
            {copied ? <><Check size={12} style={{ color: EMERALD }} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className={`overflow-x-auto p-5 text-[12px] leading-relaxed font-mono ${isDarkMode ? 'text-slate-200 bg-[#0a0e1a]' : 'text-slate-800 bg-slate-50'}`}>
          <code>{CODE}</code>
        </pre>
        <p className={`px-5 py-3 text-[12px] border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${subText}`}>
          A teaching implementation: notice the carry is cleared at <span className="font-mono">start</span>,
          the single full adder works only on bit 0 of each register, and <span className="font-mono">count</span>{' '}
          ends the run after N cycles. That is the whole serial adder.
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
