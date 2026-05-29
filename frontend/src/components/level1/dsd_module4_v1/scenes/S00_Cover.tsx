import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Sigma, Grid3x3, BookOpen, Trophy } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const DRILL_SETS = [
  {
    Icon: Cpu,
    title: 'Forward Synthesis',
    count: '4 problems',
    desc: 'Story → Truth Table → Equation → Smallest Circuit. Real-world examples.',
    accent: '#fbbf24',
  },
  {
    Icon: Sigma,
    title: 'Reverse Engineering',
    count: '3 problems',
    desc: 'You get a circuit. Figure out the equation it makes.',
    accent: '#22d3ee',
  },
  {
    Icon: Grid3x3,
    title: 'K-Map Optimisation',
    count: '3 problems',
    desc: 'Just shrinking. The long equation is given - find the shortest version.',
    accent: '#a78bfa',
  },
  {
    Icon: Trophy,
    title: 'Boss Round',
    count: '2 problems',
    desc: 'Don\'t-cares · BCD decoder · multi-step. The hardest set.',
    accent: '#fb7185',
  },
  {
    Icon: BookOpen,
    title: 'Cheatsheet',
    count: 'reference',
    desc: 'Gates + K-Map rules + grouping tips, all on one page.',
    accent: '#22c55e',
  },
];

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-5"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Target size={14} /> Module 04 · The Practice Arena
        </div>
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          No lectures.<br />
          <span className="text-rose-400">Just drills.</span>
        </h1>
        <p className={`text-lg max-w-3xl ${subText}`}>
          You learnt the pipeline in <strong className="text-cyan-300">dsd/3</strong>. Now it's
          time to practice. <strong className="text-rose-300">12 problems across 4 drill sets</strong> -
          each one has a story, a circuit, a few questions, and a step-by-step solution to peek
          at when you're stuck.
        </p>
      </motion.section>

      {/* Drill set grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DRILL_SETS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="rounded-2xl p-6 border-2 flex flex-col gap-3"
            style={{ borderColor: `${s.accent}55`, background: `${s.accent}10` }}
          >
            <div className="flex items-center justify-between">
              <s.Icon size={22} style={{ color: s.accent }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: s.accent }}>
                {s.count}
              </span>
            </div>
            <h3 className={`text-lg font-black ${textColor}`}>{s.title}</h3>
            <p className={`text-sm ${subText} leading-relaxed`}>{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-3xl border ${cardBg} space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">How to use</div>
        <ul className={`text-sm ${subText} space-y-2`}>
          <li>▸ Try each problem on paper FIRST, then click <strong className="text-rose-300">Solve it</strong>.</li>
          <li>▸ All circuits are clickable - toggle the inputs and watch the wires light up.</li>
          <li>▸ Each problem has 3-4 small questions. Check your answers after the reveal.</li>
          <li>▸ Stuck? The cheatsheet (last page) has everything you need on one page.</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Hit → to start with Drill Set 01
      </motion.div>
    </div>
  );
};
