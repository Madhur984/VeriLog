import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, RotateCw, Clock, HelpCircle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Plain-English "Facts First" primer — sits after the video, before the story.
 * Combinational vs sequential logic, in the clear, summarised style of a good
 * GeeksforGeeks note: a one-line definition, the key differences, and a small
 * side-by-side table.
 */

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  const FACTS = [
    {
      Icon: Zap, color: '#22d3ee', tag: 'Combinational',
      title: 'No memory — answers on the spot',
      body: (
        <>The output depends <strong>only on the inputs right now</strong>. Change an input and the
        output changes at once. It cannot remember anything. Examples: adders, multiplexers, decoders.</>
      ),
    },
    {
      Icon: RotateCw, color: '#f59e0b', tag: 'Sequential',
      title: 'Has memory — remembers the past',
      body: (
        <>The output depends on the inputs <strong>and</strong> on what happened before (its stored
        <strong> state</strong>). This is what lets a circuit count or keep score. Examples: counters,
        registers, state machines.</>
      ),
    },
    {
      Icon: Clock, color: '#a78bfa', tag: 'The clock',
      title: 'A steady beat keeps it in step',
      body: (
        <>Sequential circuits update on the tick of a <strong>clock</strong> — a steady on/off signal.
        Every memory element changes together, on the beat, so nothing gets out of order.</>
      ),
    },
    {
      Icon: HelpCircle, color: '#34d399', tag: 'How to tell',
      title: 'Look for a loop',
      body: (
        <>If the circuit feeds its own output back in, or has a memory box (a flip-flop), it is
        <strong> sequential</strong>. No loop, no memory → it is <strong>combinational</strong>.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Two kinds of digital circuit</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Every digital circuit is one of two types. A <strong>combinational</strong> circuit just
          reacts to its inputs right now. A <strong>sequential</strong> circuit also has
          <strong> memory</strong>, so it can react to what came before. That one difference — memory —
          is the whole topic of this module.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        {FACTS.map((f, i) => {
          const Icon = f.Icon;
          return (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.07 }}
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

      {/* side-by-side table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl border overflow-hidden ${cardBg}`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-100'}>
              <th className={`text-left px-5 py-3 font-mono text-[11px] uppercase tracking-widest ${subText}`}>Question</th>
              <th className="text-left px-5 py-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: '#22d3ee' }}>Combinational</th>
              <th className="text-left px-5 py-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: '#f59e0b' }}>Sequential</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Has memory?', 'No', 'Yes'],
              ['Needs a clock?', 'No', 'Yes'],
              ['Output depends on', 'Inputs now', 'Inputs now + past state'],
              ['Example', 'Adder, MUX', 'Counter, register'],
            ].map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border-soft)' }}>
                <td className={`px-5 py-3 font-semibold ${textColor}`}>{row[0]}</td>
                <td className={`px-5 py-3 ${subText}`}>{row[1]}</td>
                <td className={`px-5 py-3 ${subText}`}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Next, the same idea as a picture — a straight pipe (no memory) versus a loop with a little
        memory box.
      </p>
    </div>
  );
};
