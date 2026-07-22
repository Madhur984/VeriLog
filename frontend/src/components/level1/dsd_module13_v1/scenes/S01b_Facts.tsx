import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Repeat, Save, Minimize2, Timer } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Plain-English "Facts First" primer for the serial adder — sits right after
 * the video. Clear GeeksforGeeks-style explanation: add one bit per clock with
 * a single full adder and a flip-flop that carries the carry.
 */

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const ACCENT = '#38bdf8';

  const FACTS = [
    {
      Icon: Repeat, color: '#38bdf8', tag: 'What it is',
      title: 'One adder, used again and again',
      body: (
        <>Instead of one full adder per bit, a serial adder uses <strong>just one</strong>. It feeds
        the bits in <strong>one pair per clock tick</strong> and adds them up over several ticks.</>
      ),
    },
    {
      Icon: Save, color: '#a78bfa', tag: 'The key idea',
      title: 'A flip-flop remembers the carry',
      body: (
        <>After each tick the <strong>carry-out</strong> is stored in a flip-flop. On the next tick it
        comes back as the <strong>carry-in</strong> — so the one adder always knows the carry from the
        column before.</>
      ),
    },
    {
      Icon: Minimize2, color: '#34d399', tag: 'The upside',
      title: 'The smallest adder there is',
      body: (
        <>Only <strong>one full adder</strong> and <strong>one flip-flop</strong>, no matter how many
        bits. When chip space matters more than speed, this is the cheapest way to add.</>
      ),
    },
    {
      Icon: Timer, color: '#f43f5e', tag: 'The catch',
      title: 'It takes N ticks',
      body: (
        <>You add one bit per clock, so an <strong>N-bit</strong> add needs <strong>N clock cycles</strong>.
        It trades <strong>time</strong> to save <strong>space</strong> — the opposite of a parallel adder.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Add one bit at a time</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Every adder so far used many full adders at once. A <strong>serial adder</strong> flips the
          deal: it uses a <strong>single</strong> full adder and adds the bits <strong>one pair per
          clock tick</strong>, remembering the carry in a flip-flop between ticks. It is slow but tiny —
          a clean trade of time for space.
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

      {/* time-vs-space contrast */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Timer size={16} style={{ color: ACCENT }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>
            The trade-off · adding two 4-bit numbers
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl border ${chipBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>Serial adder</div>
            <ul className={`text-sm space-y-1 ${textColor}`}>
              <li>1 full adder + 1 flip-flop</li>
              <li>4 clock cycles to finish</li>
              <li className={subText}>tiny, slow</li>
            </ul>
          </div>
          <div className={`p-5 rounded-2xl border ${chipBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#fb7185' }}>Parallel (ripple)</div>
            <ul className={`text-sm space-y-1 ${textColor}`}>
              <li>4 full adders</li>
              <li>1 pass to finish</li>
              <li className={subText}>bigger, faster</li>
            </ul>
          </div>
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${textColor}`}>
          Same answer, opposite choices: the serial adder saves hardware and spends clock cycles; the
          parallel adder spends hardware to save time.
        </p>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Next, the story — one toll-booth lane handling every car in turn, versus eight lanes at once.
      </p>
    </div>
  );
};
