import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Compass, Cpu, FileWarning, Wand2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero noir illustration from the PDF cover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-cyan-300/30 mx-auto max-w-4xl aspect-[16/9] shadow-[0_30px_80px_rgba(34,211,238,0.18)]"
      >
        <img
          src="/images/noir/p01.png"
          alt="The Secret of Wing X — noir cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020611] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-cyan-200/70">
          Madhur&apos;s Casebook · Page 01
        </div>
      </motion.div>

      {/* Hero copy */}
      <section className="text-center space-y-6 relative">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400 block"
        >
          DSD · Module 3 · The Secret of Wing X
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          Truth Tables · K-Maps<br />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 bg-clip-text text-transparent">
            Circuit Realisation
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          A noir-style detective story about decoding digital circuits — narrated through{' '}
          <strong className="text-cyan-300">Warden Madhur</strong> as he reverse-engineers a
          combinational vault and then re-builds it from a K-Map.
        </motion.p>
      </section>

      {/* Detective + Thesis */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Search size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">The Detective</div>
              <h3 className={`text-xl font-black ${textColor}`}>Madhur · Logic Investigator</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            A vault stands sealed by an undocumented combinational circuit. Madhur cannot crack it
            head-on — he must <strong>walk the wires backward</strong> from the output, identifying
            every gate and every Boolean term until the entire equation lies bare on his clipboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Compass size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">The Thesis</div>
              <h3 className={`text-xl font-black ${textColor}`}>Three Faces, One Truth</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Hardware (logic gates), abstract algebra (Sum-of-Products), and exhaustive logic
            (truth tables) are <strong>three views of the same Boolean function</strong>. Master
            converting between them — that is digital design.
          </p>
        </motion.div>
      </div>

      {/* Three story acts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">Story Arc</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: FileWarning, n: '01', t: 'End-to-Start',  d: 'Reverse-engineer a vault circuit. Walk gate-by-gate from the output back to the inputs.' },
            { Icon: Cpu,          n: '02', t: 'SOP & Truth',   d: 'Stitch the path expressions into Y. Exhaust 2³ rows and isolate the breach minterms.' },
            { Icon: Wand2,        n: '03', t: 'Forward Build', d: 'Fold the truth table into a K-Map, group the 1s, then synthesise gates from the SOP.' },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <s.Icon size={16} />
                </div>
                <span className="font-mono text-3xl font-black text-cyan-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What you will be able to do */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            By the end of this module · you will be able to
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: 'Reverse-engineer', desc: 'Read any gate diagram and derive its Boolean expression.' },
            { tag: 'Truth Table',      desc: 'Build an exhaustive table for any expression up to 4 inputs.' },
            { tag: 'K-Map → SOP',      desc: 'Plot minterms on a K-Map and read off the simplified SOP.' },
            { tag: 'Synthesis',        desc: 'Realise a Boolean function as an actual gate-level circuit.' },
          ].map((cap) => (
            <div
              key={cap.tag}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">{cap.tag}</div>
              <p className={`text-xs leading-relaxed ${subText}`}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Module map · all chapters at a glance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            The Casebook · 20 chapters
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          {[
            { p: 'I',   t: 'Case File',         items: ['Cover', 'Field-manual video'] },
            { p: 'II',  t: 'Intrusion',         items: ['Hidden wing', 'Three doors', 'Gate dossier', 'Universal gates'] },
            { p: 'III', t: 'End-to-Start',      items: ['The gauntlet', 'Final chokepoint', 'Trace back paths'] },
            { p: 'IV',  t: 'The SOP',           items: ['Master equation', 'Algebra lab', 'Truth-table lab', 'Canonical SOP & POS'] },
            { p: 'V',   t: 'Forward Synthesis', items: ['K-Map bridge', "Don't-care loophole", '4-var boss example', 'Live circuit build'] },
            { p: 'VI',  t: 'Case Closed',       items: ['Three faces', 'Final wrap', 'Practice arena'] },
          ].map((part) => (
            <div key={part.p} className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">PART {part.p}</span>
                <span className={`font-bold text-sm ${textColor}`}>{part.t}</span>
              </div>
              <ul className={`text-xs ${subText} space-y-0.5 pl-4 list-disc list-inside`}>
                {part.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 20 chapters · ~70 min
      </motion.div>
    </div>
  );
};
