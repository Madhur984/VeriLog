import React from 'react';
import { motion } from 'framer-motion';
import { Lock, FileWarning, Cpu, Eye } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S02_HiddenWing: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <FileWarning size={14} /> Chapter 02 · The Discovery
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>An Undocumented Hostel Wing</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Late one evening Madhur finds a corridor not on any blueprint. At its end stands a
          steel vault. There is no key — only a wall of wires that pulse when somebody approaches.
          A combinational lock. To control it, he must read it.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
        {/* Story panel - PDF p02 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
        >
          <img
            src="/images/noir/p02.png"
            alt="Madhur discovers the hidden wing"
            className="w-full block aspect-[16/9] object-cover"
          />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-cyan-200/70">
            Casebook · Page 02
          </div>
        </motion.div>

        {/* Definition panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Cpu size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Definition</div>
              <h3 className={`text-xl font-black ${textColor}`}>Combinational Logic Circuit</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            A <strong>combinational</strong> circuit has <em>no memory</em>. The output depends only
            on the present values of the inputs — never on past states. The vault forgets the
            previous attempt the instant the visitor leaves.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { Icon: Lock, t: 'Memoryless', d: 'No flip-flops, no latches, no clock — pure gates.' },
              { Icon: Eye,  t: 'Pure Inputs → Pure Output', d: 'Every input change instantly re-evaluates Y.' },
            ].map((c) => (
              <div key={c.t} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <c.Icon size={14} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">{c.t}</span>
                </div>
                <p className={`text-xs leading-relaxed ${subText}`}>{c.d}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-5 border border-cyan-400/30 bg-cyan-500/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">Mission</div>
            <p className={`text-sm ${textColor}`}>
              Trace the wires <strong>from the output backward to the inputs</strong> until the
              entire Boolean function — the rule that opens the vault — is laid bare.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Strategy strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
            The four-step plan
          </span>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: '01', t: 'Identify the Variables',  d: 'Count and label every primary input — the doors of the system.' },
            { n: '02', t: 'Catalogue the Gates',     d: 'Recognise NOT, AND, OR by their distinctive shapes and rules.' },
            { n: '03', t: 'Walk End-to-Start',       d: 'From Y, name each gate\'s output by the expression of its inputs.' },
            { n: '04', t: 'Substitute Upward',       d: 'Replace symbols with sub-expressions until only inputs remain.' },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-cyan-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
