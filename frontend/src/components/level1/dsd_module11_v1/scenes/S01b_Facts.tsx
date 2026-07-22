import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Timer, Sparkles, Share2, Coins } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Plain-English "Facts First" primer for the carry-look-ahead adder — sits
 * right after the video. Clear GeeksforGeeks-style definition of Generate /
 * Propagate and why computing carries in parallel is faster.
 */

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const ACCENT = '#fb923c';

  const FACTS = [
    {
      Icon: Timer, color: '#f43f5e', tag: 'The problem',
      title: 'Ripple carry waits too long',
      body: (
        <>In a ripple adder each column waits for the carry from the one before it. For wide numbers
        that waiting stacks up and the adder gets slow. We want the carries <strong>sooner</strong>.</>
      ),
    },
    {
      Icon: Sparkles, color: '#34d399', tag: 'Generate · G',
      title: 'This column makes a carry',
      body: (
        <>If both input bits are 1, the column <strong>always</strong> sends a carry out — no matter
        what comes in. That is <strong>Generate</strong>: <span className="font-mono">G = A · B</span>.</>
      ),
    },
    {
      Icon: Share2, color: '#22d3ee', tag: 'Propagate · P',
      title: 'This column passes a carry on',
      body: (
        <>If exactly one input bit is 1, the column will <strong>pass along</strong> any carry it
        receives. That is <strong>Propagate</strong>: <span className="font-mono">P = A ⊕ B</span>.</>
      ),
    },
    {
      Icon: Coins, color: '#fb923c', tag: 'The trade',
      title: 'Faster, but more gates',
      body: (
        <>Using G and P we work out <strong>every carry at once</strong>, instead of one after another.
        The adder gets much faster — the cost is extra logic. Speed for hardware.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Don’t wait for the carry — predict it</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          A ripple adder is slow because every column waits its turn for the carry. A
          <strong> carry-look-ahead adder</strong> is clever: it looks at all the input bits first and
          works out <strong>every carry at the same time</strong>. The trick is two simple signals for
          each column — <strong>Generate</strong> and <strong>Propagate</strong>.
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

      {/* the one formula to remember */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: ACCENT }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>
            The one rule · a carry appears if…
          </span>
        </div>
        <div className={`p-4 rounded-xl font-mono text-base md:text-lg font-black ${chipBg} border`} style={{ color: ACCENT }}>
          Cₙ₊₁ = Gₙ + Pₙ · Cₙ
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${textColor}`}>
          In words: a carry leaves a column if the column <strong>generates</strong> one
          (<span className="font-mono">G</span>), <strong>or</strong> if it <strong>propagates</strong>
          (<span className="font-mono">P</span>) a carry that came in. Because G and P depend only on
          the input bits, you can plug this in for every column straight away — no waiting in line.
        </p>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Next, the story — a slow waiter who checks one table at a time versus a master chef who reads
        the whole room at once.
      </p>
    </div>
  );
};
