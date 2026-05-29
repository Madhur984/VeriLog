import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Building2, Map, Sparkles, GraduationCap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S12_Masterclass: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const principles = [
    {
      Icon: Map, title: 'The Grid',
      tag: 'GRAY CODE',
      headline: 'One bit-flip = one shared wall.',
      body: 'Both axes use Gray code. Adjacent rooms differ by exactly one variable. That single architectural decision is what makes the entire K-Map work.',
      color: '#fcd34d',
    },
    {
      Icon: Building2, title: 'The Wings',
      tag: 'POWERS OF TWO',
      headline: 'Group strictly in 1, 2, 4, 8, 16. Bigger wins.',
      body: 'Wings must be perfect rectangles. Each doubling kills one variable. Always look for the largest legal rectangle before settling for a smaller one.',
      color: '#10b981',
    },
    {
      Icon: Compass, title: 'The Corridors',
      tag: 'TORUS',
      headline: 'Always check the edges and corners.',
      body: 'The map curls into a torus - left edge meets right, top meets bottom. The four absolute corners cluster into one wing. Many of the cleanest simplifications hide on the wrap-arounds.',
      color: '#a78bfa',
    },
  ];

  const checklist = [
    'Re-write the function as Σm(...).',
    'Plot every minterm on a Gray-coded 4×4 K-Map.',
    'Hunt for the largest legal rectangles first (1×1 → 4×4).',
    'Use wrap-around corridors and the 4-corner cluster aggressively.',
    'Absorb each X (don\'t-care) only if it grows a wing to the next power of two.',
    'OR all wing terms together → simplified SOP.',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <GraduationCap size={14} /> Chapter 12 · Masterclass
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Madhur&apos;s Three Core Principles</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Everything you&apos;ve seen reduces to three architectural rules. Memorise these and you can attack any
          4-variable K-Map.
        </p>
      </section>

      {/* Three principle cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {principles.map((p, i) => (
          <motion.div
            key={p.tag}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden`}
            style={{ borderColor: `${p.color}33` }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `${p.color}1f` }} />
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative" style={{ background: `${p.color}1f`, border: `1px solid ${p.color}55`, color: p.color }}>
              <p.Icon size={22} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: p.color }}>{p.tag}</div>
            <h3 className={`text-xl font-black mb-2 ${textColor}`}>{p.title}</h3>
            <div className={`text-sm font-bold mb-3 ${textColor}`}>{p.headline}</div>
            <p className={`text-[13px] leading-relaxed ${subText}`}>{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Solver checklist */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={14} className="text-amber-400" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Madhur&apos;s six-step solver</div>
        </div>
        <ol className="space-y-3">
          {checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-black font-mono font-black text-sm flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className={`text-sm leading-relaxed ${textColor}`}>{c}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Closing line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">Final thought</div>
        <p className={`text-lg leading-relaxed ${textColor}`}>
          Karnaugh maps aren&apos;t a trick - they&apos;re a <strong className="text-amber-300">change of perspective</strong>.
          Once you see Boolean terms as rooms and adjacency as architecture, simplification is just{' '}
          <strong>finding the biggest rectangles</strong>. The hostel was the textbook all along.
        </p>
      </motion.div>
    </div>
  );
};
