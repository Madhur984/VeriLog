import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ListChecks, Sigma, Grid3x3, Cpu, CheckCircle2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * "Just the facts" primer for combinational design — sits AFTER the video and
 * BEFORE the Server-Vault analogy. It lays out the fixed 5-step pipeline in
 * plain English (the clear, summarised GeeksforGeeks style) and shows the
 * module's own example, F = A + B·C, run through it end to end.
 */

// Truth table for F = A + B·C  →  F = Σm(3,4,5,6,7)
const ROWS = [
  { a: 0, b: 0, c: 0, f: 0 },
  { a: 0, b: 0, c: 1, f: 0 },
  { a: 0, b: 1, c: 0, f: 0 },
  { a: 0, b: 1, c: 1, f: 1 },
  { a: 1, b: 0, c: 0, f: 1 },
  { a: 1, b: 0, c: 1, f: 1 },
  { a: 1, b: 1, c: 0, f: 1 },
  { a: 1, b: 1, c: 1, f: 1 },
];

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  const STEPS = [
    {
      Icon: ListChecks, color: '#38bdf8', tag: 'Step 1 · Truth table',
      body: (
        <>Write down the output for <strong>every</strong> input combination. With 3 inputs that is 8
        rows. This is the complete, honest description of what the circuit must do.</>
      ),
    },
    {
      Icon: Sigma, color: '#34d399', tag: 'Step 2 · Read the SOP',
      body: (
        <>Look at the rows where the output is <strong>1</strong>. Turn each into a product term and
        <strong> OR</strong> them together. This is the raw equation — correct, but not yet short.</>
      ),
    },
    {
      Icon: Grid3x3, color: '#a78bfa', tag: 'Step 3 · Simplify on the K-map',
      body: (
        <>Drop the 1s onto a K-map and circle them in big groups. Each group throws away a variable, so
        a long sum collapses into a <strong>short</strong> one.</>
      ),
    },
    {
      Icon: Cpu, color: '#f59e0b', tag: 'Step 4 · Wire the gates',
      body: (
        <>Translate the short equation straight into hardware: <strong>AND</strong> for products,
        <strong> OR</strong> for the sum, <strong>NOT</strong> for any bars. The schematic is done.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Heading */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One problem, one fixed recipe</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Turning a description into a working circuit is always the <strong>same four moves</strong>,
          in the same order. Learn the recipe once and every combinational design after this becomes
          routine. Here is the whole pipeline — then we run this module’s example,
          <span className="font-mono font-bold"> F = A + B·C</span>, through it.
        </p>
      </section>

      {/* The four steps */}
      <div className="grid md:grid-cols-2 gap-5">
        {STEPS.map((s, i) => {
          const Icon = s.Icon;
          return (
            <motion.div
              key={s.tag}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`p-6 rounded-3xl border ${cardBg}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${s.color}22`, color: s.color, border: `1.5px solid ${s.color}55` }}>
                  <Icon size={20} />
                </div>
                <div className="font-mono text-[11px] uppercase tracking-widest font-bold" style={{ color: s.color }}>
                  {s.tag}
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${subText}`}>{s.body}</p>
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
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            The example, end to end · F = A + B·C
          </span>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
          {/* truth table */}
          <div className={`rounded-2xl border overflow-hidden ${chipBg}`}>
            <table className="font-mono text-sm text-center">
              <thead>
                <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-100'}>
                  <th className={`px-3 py-2 ${subText}`}>A</th>
                  <th className={`px-3 py-2 ${subText}`}>B</th>
                  <th className={`px-3 py-2 ${subText}`}>C</th>
                  <th className={`px-3 py-2 ${subText}`}>F</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border-soft)' }}>
                    <td className={`px-3 py-1.5 ${textColor}`}>{r.a}</td>
                    <td className={`px-3 py-1.5 ${textColor}`}>{r.b}</td>
                    <td className={`px-3 py-1.5 ${textColor}`}>{r.c}</td>
                    <td className="px-3 py-1.5 font-black" style={{ color: r.f ? '#34d399' : '#f43f5e' }}>{r.f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* the flow */}
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Read the 1-rows</div>
              <p className={`text-sm ${subText}`}>Five rows output 1, so the raw SOP is:</p>
              <div className={`mt-2 p-3 rounded-xl font-mono text-base font-black ${chipBg} border`} style={{ color: '#34d399' }}>
                F = Σm(3, 4, 5, 6, 7)
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#a78bfa' }}>Group on the K-map</div>
              <p className={`text-sm ${subText}`}>
                The four rows with <span className="font-mono">A=1</span> collapse to just <span className="font-mono font-bold">A</span>.
                The pair <span className="font-mono">m3, m7</span> collapses to <span className="font-mono font-bold">B·C</span>. Together:
              </p>
              <div className={`mt-2 p-3 rounded-xl font-mono text-xl font-black ${chipBg} border`} style={{ color: '#a78bfa' }}>
                F = A + B·C
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Wire it</div>
              <p className={`text-sm leading-relaxed ${textColor}`}>
                One <strong>AND</strong> gate makes <span className="font-mono">B·C</span>; one <strong>OR</strong> gate
                adds <span className="font-mono">A</span>. Two gates — from a table of eight rows to real hardware.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Now watch it happen for real — a server room needs this exact circuit, and we build it step by step.
      </p>
    </div>
  );
};
