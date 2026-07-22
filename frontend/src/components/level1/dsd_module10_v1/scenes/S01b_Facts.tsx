import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Boxes, ArrowRightLeft, PiggyBank, Timer } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Plain-English "Facts First" primer for the ripple-carry adder — sits right
 * after the video. Clear GeeksforGeeks-style definition, the key points, and a
 * tiny worked 3-bit add showing the carry travelling.
 */

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const ACCENT = '#f59e0b';

  const FACTS = [
    {
      Icon: Boxes, color: '#f59e0b', tag: 'What it is',
      title: 'Full adders in a chain',
      body: (
        <>To add two multi-bit numbers, put <strong>one full adder per bit</strong>. A 4-bit add uses
        4 full adders, side by side, one for each column.</>
      ),
    },
    {
      Icon: ArrowRightLeft, color: '#fbbf24', tag: 'The key idea',
      title: 'The carry is passed along',
      body: (
        <>Each adder’s <strong>carry-out</strong> becomes the next adder’s <strong>carry-in</strong> —
        like passing a baton down the line. That is why it is called “ripple” carry.</>
      ),
    },
    {
      Icon: PiggyBank, color: '#34d399', tag: 'The upside',
      title: 'Simple and cheap',
      body: (
        <>It uses the <strong>least hardware</strong> and is the easiest adder to wire. This is the
        first multi-bit adder everyone learns, and it is used everywhere small.</>
      ),
    },
    {
      Icon: Timer, color: '#f43f5e', tag: 'The catch',
      title: 'It is slow',
      body: (
        <>The last column cannot finish until the carry has rippled through <strong>all</strong> the
        adders before it. More bits → longer wait. Delay grows with the number of bits.</>
      ),
    },
  ];

  // 3-bit example: 011 + 001 = 100, carry ripples left
  const cols = [
    { bit: 2, a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
    { bit: 1, a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
    { bit: 0, a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Adding more than one bit</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          A single full adder only adds one column of bits. To add whole numbers you line up many full
          adders and let each one hand its <strong>carry</strong> to the next — exactly how you add on
          paper, right to left. That is a <strong>ripple-carry adder</strong>: simple to build, but
          you pay for it in speed.
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

      {/* worked example */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <ArrowRightLeft size={16} style={{ color: ACCENT }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>
            Worked example · 011 + 001 = 100
          </span>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          {cols.map((c, i) => (
            <React.Fragment key={c.bit}>
              <div className={`flex-1 min-w-[130px] p-4 rounded-2xl border ${chipBg}`}>
                <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${subText}`}>Full adder · bit {c.bit}</div>
                <div className={`font-mono text-sm space-y-1 ${textColor}`}>
                  <div>A = {c.a} , B = {c.b}</div>
                  <div>carry-in = <span style={{ color: ACCENT }}>{c.cin}</span></div>
                  <div className="pt-1 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                    sum = <strong>{c.sum}</strong>
                  </div>
                  <div>carry-out = <span style={{ color: ACCENT }}>{c.cout}</span></div>
                </div>
              </div>
              {i < cols.length - 1 && (
                <div className="flex items-center font-mono text-xs" style={{ color: ACCENT }}>
                  ← carry
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${textColor}`}>
          Read right to left: bit 0 makes a carry, which feeds bit 1, which makes another carry into
          bit 2. The answer <span className="font-mono font-bold">100</span> only settles once that
          carry has travelled the whole way — that travelling wait is the adder’s speed limit.
        </p>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Now the story — think of the carry as a baton in a relay race, handed from runner to runner.
      </p>
    </div>
  );
};
